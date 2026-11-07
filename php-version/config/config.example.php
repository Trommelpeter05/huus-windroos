<?php
/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle the SMTP settings of the enquiry form (copy to config.php and fill in).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/

// Copy to config.php (same folder). config.php must NOT be inside the public web root –
// or, if that is impossible, keep the .htaccess in this folder.
return [
    'smtp_host' => 'smtp.example.com',
    'smtp_port' => 587,
    // 'tls' = STARTTLS (port 587), 'ssl' = SSL/TLS (port 465), 'none' = unencrypted
    'smtp_secure' => 'tls',
    'smtp_user' => '',
    'smtp_pass' => '',

    'mail_from' => 'kontakt@huus-windroos.de',
    'mail_from_name' => 'Huus Windroos Website',
    'mail_to' => ['kontakt@huus-windroos.de'],

    // folder for the rate limit files (default: system temp folder)
    // 'rate_limit_dir' => __DIR__ . '/../storage',
];
