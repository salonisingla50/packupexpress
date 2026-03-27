<?php
// 1. Configuration
$my_email   = "support@packupexpress.com";
$from_email = "no-reply@packupexpress.com"; // Ensure this email exists in Hostinger hPanel

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 2. Sanitize Data
    $name  = strip_tags(trim($_POST["name"] ?? 'No Name'));
    $phone = strip_tags(trim($_POST["phone"] ?? 'No Phone'));
    $from  = strip_tags(trim($_POST["from"] ?? 'N/A'));
    $to    = strip_tags(trim($_POST["to"] ?? 'N/A'));
    $date  = date("d-m-Y H:i:s");

    // 3. SAVE TO CSV (Hostinger Storage)
    $file = 'leads.csv';
    
    // Check if file exists to add headers
    if (!file_exists($file)) {
        $header = ["Date", "Name", "Phone", "Moving From", "Moving To"];
        $fp = fopen($file, 'w');
        // Added default parameters to fix PHP 8.3+ Deprecation warning
        fputcsv($fp, $header, ",", '"', "\\");
        fclose($fp);
    }

    $fp = fopen($file, 'a');
    $data_row = [$date, $name, $phone, $from, $to];
    fputcsv($fp, $data_row, ",", '"', "\\");
    fclose($fp);

    // 4. PREPARE EMAIL NOTIFICATION
    $subject = "New Lead: $name ($from to $to)";
    
    // Generate a unique Message-ID to pass server security checks
    $msg_id = "<" . gmdate('YmdHis') . "." . bin2hex(random_bytes(4)) . "@packupexpress.com>";

    // Build Strict Headers
    $headers  = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: PackUp Express <$from_email>" . "\r\n";
    $headers .= "Reply-To: $phone" . "\r\n";
    $headers .= "Return-Path: $from_email" . "\r\n";
    $headers .= "Message-ID: $msg_id" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "Date: " . date("r") . "\r\n";

    $email_content = "
    <div style='font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; border: 1px solid #eee; padding: 20px;'>
        <h2 style='color: #0A1128;'>New Quote Request</h2>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>Moving From:</strong> $from</p>
        <p><strong>Moving To:</strong> $to</p>
        <hr style='border: 0; border-top: 1px solid #eee;'>
        <p style='font-size: 12px; color: #666;'>Submitted via website on: $date</p>
    </div>
    ";
    echo("mail formed  ");
    // 5. SEND COMMAND
    // The '-f' parameter tells the server the "Envelope Sender" is authorized
    if(mail($my_email, $subject, $email_content, $headers, "-f".$from_email)) {
        echo "success";
    } else {
        error_log("Internal PHP Mail Error for $my_email");
        echo "error in mail";
    }
}
?>