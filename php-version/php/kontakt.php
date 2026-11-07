<?php
/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle the booking enquiry of the static version: validation, spam checks (honeypot, minimum fill time,
* link filter, simple rate limit) and sending via SMTP with PHPMailer.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as MailException;
use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

// config/ and lib/ ideally live next to the web root, otherwise inside it (protected by .htaccess)
function locate(array $candidates): ?string
{
    foreach ($candidates as $path) {
        if (is_file($path) || is_dir($path)) {
            return $path;
        }
    }
    return null;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'message' => 'Methode nicht erlaubt']);
}

$configFile = locate([__DIR__ . '/../config/config.php', __DIR__ . '/config/config.php']);
$mailerDir = locate([__DIR__ . '/../lib/PHPMailer', __DIR__ . '/lib/PHPMailer']);
if (!$configFile || !$mailerDir) {
    respond(500, ['ok' => false, 'message' => 'Mailversand ist nicht eingerichtet']);
}
$config = require $configFile;

$body = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($body)) {
    respond(400, ['ok' => false, 'message' => 'Ungültige Anfrage']);
}

// Bots: filled honeypot or form sent faster than a human can type → pretend success
if (!empty($body['hp']) || (isset($body['elapsed']) && (int) $body['elapsed'] < 3000)) {
    respond(200, ['ok' => true]);
}

// Simple rate limit: max. 5 enquiries per IP and hour
$limitDir = $config['rate_limit_dir'] ?? sys_get_temp_dir();
$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
$limitFile = rtrim($limitDir, '/') . '/windroos_' . hash('sha256', $ip) . '.json';
$hits = is_file($limitFile) ? (json_decode((string) file_get_contents($limitFile), true) ?: []) : [];
$hits = array_values(array_filter($hits, static fn ($t) => $t > time() - 3600));
if (count($hits) >= 5) {
    respond(429, ['ok' => false, 'message' => 'Zu viele Anfragen – bitte versuchen Sie es später erneut']);
}

$clean = static function ($value, int $max = 500): string {
    $value = preg_replace('/[\r\n]+/', ' ', (string) ($value ?? ''));
    return mb_substr(trim($value), 0, $max);
};
$date = static function ($value): string {
    return preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) $value) ? implode('.', array_reverse(explode('-', (string) $value))) : '';
};

$name = $clean($body['name'] ?? '', 120);
$email = $clean($body['email'] ?? '', 200);
$phone = $clean($body['phone'] ?? '', 60);
$object = $clean($body['object'] ?? '', 60);
$persons = $clean($body['persons'] ?? '', 2);
$message = mb_substr(trim((string) ($body['message'] ?? '')), 0, 4000);

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $phone === '' || empty($body['privacy'])) {
    respond(422, ['ok' => false, 'message' => 'Bitte füllen Sie alle Pflichtfelder aus']);
}
if (preg_match_all('#https?://#i', $message) > 2) {
    respond(422, ['ok' => false, 'message' => 'Bitte senden Sie keine Links']);
}

$arrival = $date($body['arrival'] ?? '');
$departure = $date($body['departure'] ?? '');
$text = implode("\n", [
    'Unterkunft: ' . $object,
    'Zeitraum: ' . ($arrival ?: '–') . ' bis ' . ($departure ?: '–'),
    'Personen: ' . $persons,
    '',
    'Name: ' . $name,
    'E-Mail: ' . $email,
    'Telefon: ' . $phone,
    '',
    'Nachricht:',
    $message !== '' ? $message : '–',
]);

require $mailerDir . '/Exception.php';
require $mailerDir . '/PHPMailer.php';
require $mailerDir . '/SMTP.php';

$mail = new PHPMailer(true);
try {
    $mail->CharSet = 'UTF-8';
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->Port = (int) $config['smtp_port'];
    $secure = $config['smtp_secure'] ?? 'tls';
    if ($secure === 'ssl') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } elseif ($secure === 'tls') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    } else {
        $mail->SMTPSecure = '';
        $mail->SMTPAutoTLS = false;
    }
    if (!empty($config['smtp_user'])) {
        $mail->SMTPAuth = true;
        $mail->Username = $config['smtp_user'];
        $mail->Password = $config['smtp_pass'];
    }
    $mail->setFrom($config['mail_from'], $config['mail_from_name'] ?? 'Huus Windroos Website');
    foreach ((array) $config['mail_to'] as $to) {
        $mail->addAddress($to);
    }
    $mail->addReplyTo($email, $name);
    $mail->Subject = 'Anfrage ' . $object . ': ' . ($arrival ?: 'ohne Datum') . ' – ' . $name;
    $mail->Body = $text;
    $mail->send();
} catch (MailException $e) {
    error_log('[kontakt] ' . $mail->ErrorInfo);
    respond(502, ['ok' => false, 'message' => 'Die Nachricht konnte nicht versendet werden']);
}

$hits[] = time();
@file_put_contents($limitFile, json_encode($hits));

respond(200, ['ok' => true]);
