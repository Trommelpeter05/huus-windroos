<?php
/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle the JSON endpoint of the static version for occupancy and reviews from Travanto
* (travanto.php?type=belegung|bewertungen&objekt=<nr>) with a file cache – mirrors server/utils/travanto.ts.
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

// Only these listings (see app/data/content.ts → units[].travanto.id)
const OBJECTS = [36065, 1013504];
const BASE = 'https://ext.travanto.de/ferienwohnung';
const SITE = 'https://www.huus-windroos.de/';
const TTL = ['belegung' => 2 * 3600, 'bewertungen' => 24 * 3600];

function respond(int $status, array $payload, int $maxAge = 0): void
{
    http_response_code($status);
    header('Cache-Control: ' . ($maxAge ? 'public, max-age=' . $maxAge : 'no-store'));
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function num(?string $s): float
{
    return $s === null ? 0.0 : (float) str_replace(',', '.', $s);
}

function decode(string $s): string
{
    $s = preg_replace('#<br\s*/?>#i', "\n", $s);
    $s = html_entity_decode(strip_tags($s), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $s = preg_replace("/[ \t\x{00A0}]+/u", ' ', $s);
    return trim(preg_replace('/\s*\n\s*/', "\n", $s));
}

// Fix: browser-like request – a bot-like User-Agent can get a challenge page instead of the calendar
const HEADERS = [
    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
    'Accept: text/html,application/xhtml+xml',
    'Accept-Language: de-DE,de;q=0.9',
    'Referer: ' . SITE,
];

function fetchHtml(string $url): string
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_HTTPHEADER => HEADERS,
            CURLOPT_ENCODING => '',
        ]);
        $html = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $error = curl_error($ch);
        curl_close($ch);
    } else {
        $ctx = stream_context_create(['http' => ['timeout' => 10, 'header' => implode("\r\n", HEADERS) . "\r\n", 'ignore_errors' => true]]);
        $html = @file_get_contents($url, false, $ctx);
        $status = isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m) ? (int) $m[1] : 0;
        $error = $html === false ? 'file_get_contents failed' : '';
    }
    if ($html === false || $html === '' || $status >= 400) {
        throw new RuntimeException("fetch failed (HTTP $status) $error");
    }
    return (string) $html;
}

function parseOccupancy(string $html, int $objekt): array
{
    $days = [];
    // Fix: read every day tag on its own – independent of the attribute order inside the tag
    preg_match_all('/<[a-z]+\b[^>]*\bdata-datum="[^"]*"[^>]*>/i', $html, $tags);
    foreach ($tags[0] as $tag) {
        if (!preg_match('/data-datum="(\d{2})\.(\d{2})\.(\d{4})"/', $tag, $row)) {
            continue;
        }
        $cls = ' ' . (preg_match('/\bclass="([^"]*)"/', $tag, $c) ? $c[1] : '') . ' ';
        // Fix: the "vor/zurück" buttons carry a data-datum too – they are no calendar days
        if (str_contains($cls, 'blaettern')) {
            continue;
        }
        $has = static fn (string $k): bool => str_contains($cls, " $k ") || str_contains($cls, " ob_$k ");
        $arr = $has('anfahrt');
        $dep = $has('abfahrt');
        $s = $has('belegt') ? 'belegt' : ($arr && $dep ? 'wechsel' : ($arr ? 'anreise' : ($dep ? 'abreise' : 'frei')));
        $days["{$row[3]}-{$row[2]}-{$row[1]}"] = ['s' => $s, 'an' => str_contains($cls, ' anreisetag '), 'ab' => str_contains($cls, ' abreisetag ')];
    }
    if (!$days) {
        throw new RuntimeException('no days found');
    }
    return ['objekt' => $objekt, 'updated' => date(DATE_ATOM), 'days' => $days];
}

function parseReviews(string $html, int $objekt): array
{
    $flat = preg_replace('/\s+/', ' ', $html);
    $pos = strpos($flat, 'itemprop="review"');
    $head = $pos === false ? $flat : substr($flat, 0, $pos);

    preg_match('/itemprop="ratingCount">(\d+)</', $head, $c);
    preg_match('/itemprop="ratingValue" content="([\d.]+)"/', $head, $v);
    preg_match_all('#presentation-rating-box-w-in">([^<]+)</div> <div class="presentation-rating-box-w-in"> <span class="rating-box-w-num"[^>]*><span>([\d,]+)<#', $head, $cats, PREG_SET_ORDER);

    $reviews = [];
    foreach (array_slice(explode('itemprop="review"', $flat), 1) as $block) {
        preg_match('#itemprop="description">(.*?)</span>#', $block, $t);
        preg_match('/Bewertung von (.*?) vom/', $block, $n);
        preg_match('/itemprop="datePublished" content="([\d-]+)"/', $block, $d);
        preg_match('#rating-single-comment-us-zeitraum">(.*?)</div>#', $block, $p);
        preg_match('/itemprop="reviewRating".*?itemprop="ratingValue" content="([\d.]+)"/', $block, $r);
        $reviews[] = [
            'name' => decode($n[1] ?? ''),
            'date' => $d[1] ?? '',
            'period' => decode($p[1] ?? ''),
            'text' => isset($t[1]) ? decode($t[1]) : '',
            'rating' => num($r[1] ?? null),
        ];
    }

    $count = (int) ($c[1] ?? 0);
    $value = num($v[1] ?? null);
    if (!$count || !$value) {
        throw new RuntimeException('no rating found');
    }
    return [
        'objekt' => $objekt,
        'updated' => date(DATE_ATOM),
        'value' => $value,
        'count' => $count,
        'categories' => array_map(static fn ($x) => ['label' => decode($x[1]), 'value' => num($x[2])], $cats),
        'reviews' => $reviews,
    ];
}

$type = (string) ($_GET['type'] ?? '');
$objekt = (int) ($_GET['objekt'] ?? 0);
if (!in_array($objekt, OBJECTS, true) || !isset(TTL[$type])) {
    respond(400, ['ok' => false, 'message' => 'Ungültige Anfrage']);
}

// Fix: travanto.php?type=…&objekt=…&debug=1 skips the cache and shows the error
$debug = isset($_GET['debug']);
$cacheFile = sys_get_temp_dir() . "/windroos_travanto_{$type}_{$objekt}.json";
$cached = is_file($cacheFile) ? json_decode((string) file_get_contents($cacheFile), true) : null;
if (!$debug && $cached && filemtime($cacheFile) > time() - TTL[$type]) {
    respond(200, ['ok' => true] + $cached, 900);
}

try {
    $data = $type === 'belegung'
        ? parseOccupancy(fetchHtml(BASE . "/externer_belegzeitenkalender.php?nummer=$objekt&lang=de&externUrl=" . urlencode(SITE) . '&design=responsive&legendPosition=top'), $objekt)
        : parseReviews(fetchHtml(BASE . "/externe_bewertungen.php?onr=$objekt&lang=de&externUrl=" . urlencode(SITE)), $objekt);
    @file_put_contents($cacheFile, json_encode($data, JSON_UNESCAPED_UNICODE));
    respond(200, ['ok' => true] + $data, 900);
} catch (Throwable $e) {
    error_log('[travanto] ' . $e->getMessage());
    if ($debug) {
        respond(502, ['ok' => false, 'error' => $e->getMessage()]);
    }
    // Travanto unreachable: rather show the last known data than nothing
    if ($cached) {
        respond(200, ['ok' => true, 'stale' => true] + $cached, 300);
    }
    respond(502, ['ok' => false, 'message' => 'Travanto ist gerade nicht erreichbar']);
}
