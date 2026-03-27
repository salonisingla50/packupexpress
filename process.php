<?php
$my_email = "support@packupexpress.com";
$from_email = "no-reply@packupexpress.com";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Sanitize Data
    $name  = strip_tags(trim($_POST["name"] ?? 'No Name'));
    $phone = strip_tags(trim($_POST["phone"] ?? 'No Phone'));
    $from  = strip_tags(trim($_POST["from"] ?? 'N/A'));
    $to    = strip_tags(trim($_POST["to"] ?? 'N/A'));
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
    $headers .= "From: PackUp Express <$from_email>" . "\r\n";
    $headers .= "Reply-To: $phone" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    $email_content = "
    <div style='font-family: Arial, sans-serif; line-height: 1.6;'>
        <h2 style='color: #0A1128;'>New Quote Request</h2>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>From:</strong> $from</p>
        <p><strong>To:</strong> $to</p>
        <hr>
        <p style='font-size: 12px; color: #666;'>Submitted on: $date</p>
    </div>
    ";

    if(mail($my_email, $subject, $email_content, $headers, "-f" . $from_email)) {
        echo "success";
    } else {
        error_log("Mail failed for $my_email");
        echo "error";
    }
}
?>