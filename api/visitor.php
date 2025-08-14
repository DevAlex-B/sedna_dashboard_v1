<?php
header('Content-Type: application/json');
require_once 'equipment_db.php';

function getTimeWindowStart($time = null) {
  $time = $time ?? time();
  return intdiv($time, 300) * 300; // 5-minute windows
}

function generateOtp($email, $timeWindowStart = null) {
  $secret = getenv('OTP_HMAC_SECRET');
  if (!$secret) {
    http_response_code(500);
    echo json_encode(['error' => 'OTP secret not configured']);
    exit;
  }
  $timeWindowStart = $timeWindowStart ?? getTimeWindowStart();
  $data = $email . ':' . $timeWindowStart;
  $hash = hash_hmac('sha256', $data, $secret);
  $otp = str_pad(strval(hexdec(substr($hash, -8)) % 10000), 4, '0', STR_PAD_LEFT);
  return $otp;
}

function verifyOtpCode($email, $inputOtp) {
  $current = generateOtp($email);
  if (hash_equals($current, $inputOtp)) return true;
  $previousWindow = getTimeWindowStart(time() - 300);
  $previous = generateOtp($email, $previousWindow);
  return hash_equals($previous, $inputOtp);
}

function smtpSend($to, $name, $subject, $html, $text) {
  $host = getenv('SMTP_HOST');
  $port = getenv('SMTP_PORT');
  $username = getenv('SMTP_USERNAME');
  $password = getenv('SMTP_PASSWORD');
  $secure = getenv('SMTP_SECURE') === 'true' ? 'ssl://' : '';
  $from = getenv('MAIL_FROM');
  $fromName = getenv('MAIL_FROM_NAME');
  $fp = fsockopen($secure.$host, $port, $errno, $errstr, 30);
  if (!$fp) return false;
  $read = function() use ($fp) { $data=''; while($str = fgets($fp,515)) { $data.=$str; if (substr($str,3,1)==' ') break; } return $data; };
  $cmd = function($cmd) use ($fp, $read) { fwrite($fp, $cmd."\r\n"); return $read(); };
  $read();
  $cmd('EHLO localhost');
  $cmd('AUTH LOGIN');
  $cmd(base64_encode($username));
  $cmd(base64_encode($password));
  $cmd('MAIL FROM:<'.$from.'>');
  $cmd('RCPT TO:<'.$to.'>');
  $cmd('DATA');
  $boundary = uniqid('np');
  $headers = 'From: '.$fromName.' <'.$from.'>'."\r\n".'To: '.$name.' <'.$to.'>'."\r\n".'Subject: '.$subject."\r\n".'MIME-Version: 1.0' ."\r\n".'Content-Type: multipart/alternative; boundary='.$boundary."\r\n";
  $body = '--'.$boundary."\r\n".'Content-Type: text/plain; charset=UTF-8' ."\r\n\r\n".$text."\r\n".'--'.$boundary."\r\n".'Content-Type: text/html; charset=UTF-8' ."\r\n\r\n".$html."\r\n".'--'.$boundary.'--';
  $cmd($headers."\r\n".$body."\r\n.");
  $cmd('QUIT');
  fclose($fp);
  return true;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? '';

if ($action === 'send') {
  $name = $input['name'] ?? '';
  $email = $input['email'] ?? '';
  if (!$name || !$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields']);
    exit;
  }
  $otp = generateOtp($email);
  $html = '<div style="font-family:sans-serif"><div style="background:#000;padding:20px;text-align:center"><img src="https://digirockinnovations.com/wp-content/uploads/2025/08/sedna_logo.png" alt="Sedna" style="height:40px"/></div><p>Hello '.htmlspecialchars($name).',</p><p>Your one-time sign-in code is:</p><div style="font-size:32px;font-weight:bold;text-align:center;margin:20px">'.$otp.'</div><p>This code is valid for 5 minutes.</p><p>If you didn\'t request this, you can ignore this email.</p><div style="display:flex;justify-content:space-between;align-items:center;margin-top:40px;padding-top:10px;border-top:1px solid #ccc"><em>Powered by</em><img src="https://digirockinnovations.com/wp-content/uploads/2025/08/DRi_Logo_v3-2.png" alt="DRi" style="height:24px"/></div></div>';
  $text = 'Your one-time sign-in code is '.$otp.' (valid 5 minutes). If you did not request this, ignore.';
  $sent = smtpSend($email, $name, 'Your Sedna sign-in code: '.$otp, $html, $text);
  if (!$sent) {
    http_response_code(500);
    echo json_encode(['error' => 'Email send failed']);
    exit;
  }
  error_log('OTP sent to '.hash('sha256', $email));
  echo json_encode(['success' => true]);
} elseif ($action === 'verify') {
  $name = $input['name'] ?? '';
  $email = $input['email'] ?? '';
  $otp = $input['otp'] ?? '';
  if (!$name || !$email || !$otp) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields']);
    exit;
  }
  if (!verifyOtpCode($email, $otp)) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid OTP']);
    exit;
  }
  $conn = getEquipmentDbConnection();
  $stmt = $conn->prepare("INSERT INTO users (full_name, email, dashboard_visitor) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), dashboard_visitor = 1");
  $stmt->bind_param('ss', $name, $email);
  $stmt->execute();
  $stmt->close();
  $conn->close();
  echo json_encode(['success' => true]);
} else {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid action']);
}
?>
