<?php
// Set your professional email here
$my_email = "support@packupexpress.com";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Sanitize Data
    $name  = strip_tags(trim($_POST["name"]));
    $phone = strip_tags(trim($_POST["phone"]));
    $from  = strip_tags(trim($_POST["from"]));
    $to    = strip_tags(trim($_POST["to"]));
    $date  = date("d-m-Y H:i:s");

    // 2. SAVE TO CSV (Hostinger Storage)
    $file = 'leads.csv';
    $data_row = [$date, $name, $phone, $from, $to];
    
    // If file doesn't exist, add headers first
    if (!file_exists($file)) {
        $header = ["Date", "Name", "Phone", "Moving From", "Moving To"];
        $fp = fopen($file, 'w');
        fputcsv($fp, $header);
        fclose($fp);
    }

    $fp = fopen($file, 'a');
    fputcsv($fp, $data_row);
    fclose($fp);

    // 3. SEND EMAIL NOTIFICATION
    $subject = "New Lead: $name ($from to $to)";
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: no-reply@packupexpress.com" . "\r\n"; // Must use your domain

    $email_content = "
    <h2>New Quote Request</h2>
    <p><strong>Name:</strong> $name</p>
    <p><strong>Phone:</strong> $phone</p>
    <p><strong>From:</strong> $from</p>
    <p><strong>To:</strong> $to</p>
    <p><strong>Date:</strong> $date</p>
    ";

    if(mail($my_email, $subject, $email_content, $headers)) {
        echo "success";
    } else {
        echo "error";
    }
}
?>