<?php
/*

=== SUPER GLOBAL LIST ===

$_ENV       // Variables d'environnement
$_GET       // Paramètres URL (?name=value)
$_POST      // Données de formulaire
$_SERVER    // Informations serveur
$_SESSION   // Données de session
$_COOKIE    // Cookies
$_FILES     // Fichiers uploadés
$_REQUEST   // Combinaison GET/POST/COOKIE
$GLOBALS    // Toutes les variables globales


=== Constante Magic ===
__DIR__      // Dossier du fichier actuel
__FILE__     // Chemin complet du fichier actuel
__LINE__     // Numéro de ligne actuel
__FUNCTION__ // Nom de la fonction actuelle
__CLASS__    // Nom de la classe actuelle
__METHOD__   // Nom de la méthode actuelle

*/

//namespace
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Charger l'autoload de Composer
require_once __DIR__ . '/vendor/autoload.php';

define('DEBUG', true);
define('DEFAULT_EMAIL', 'contact@azilios.ch');
define('PHPMAILER_AUTOLOAD', __DIR__ . '/vendor/autoload.php');


// ajoute un log dans /debug.log
function debugLog($message) :void {
    if (DEBUG)
    {
        file_put_contents(__DIR__ . '/debug.log',
            date('Y-m-d H:i:s') . " - $message\n",
            FILE_APPEND);
    }
}

// charge .env dans _ENV
function loadEnv($path) :void {
    if (!file_exists($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        $line = trim($line);

        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        [$key, $value] = array_map('trim', explode('=', $line, 2));
        $value = trim($value, "\"'");
        $_ENV[$key] = $value;
        putenv("$key=$value");
    }
}

// envoie une requete valide pour ne pas alarmer le bot
function fakeRequest() : void {
    http_response_code(200);
	echo json_encode(['success' => true, 'message' => 'Message envoyé. Merci !']);
}

//[helper] phpmailerSet && sendAlertPhpmailer
function smptConfig($mail) : object {
    $mail->isSMTP();
    $mail->Host = $_ENV['SMTP_HOST'] ?? 'mail.infomaniak.com';
    $mail->SMTPAuth    = true;
    $mail->Username = $_ENV['SMTP_USER'];
    $mail->Password = $_ENV['SMTP_PASS'];
    $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = $_ENV['SMTP_PORT'] ?? 465;
    return $mail;
}

//[helper] sendAlertPhpmailer
function setAlertAddress($mail) : object {
    $mail->setFrom('noreply@' . ($_ENV['FROM_DOMAIN'] ?? 'azilios.ch'), 'Azilios Alert');
    $mail->addAddress($_ENV['MAIL_TO'] ?? DEFAULT_EMAIL);

    return $mail;
}

//[helper] sendAlertPhpmailer
function setAlertMsg($mail, $log_entry) : object {
    $mail->isHTML(false);
    $mail->Subject = '[ALERTE] Tentative bot - Échec log';
    $mail->Body = "Impossible d'écrire dans bot_attempts.log\n\n$log_entry";

    return $mail;
}

// alerte si bot
function sendAlertPhpmailer($log_entry) : void {
    if (!file_exists(PHPMAILER_AUTOLOAD)) {
        debugLog("Erreur: vendor/autoload.php manquant pour fallback bot alert");

        return;
    }
    

    $mail = new PHPMailer();

    $mail = smtpConfig($mail);
    $mail = setAlertAddress($mail);
    $mail = setAlertMsg($mail, $log_entry);
    
    if ($mail->send()) {
        debugLog("ALERT envoyée via PHPMailer");
    }
    else {
        debugLog("ERREUR: Impossible d'envoyer ALERT via PHPMailer: {$mail->ErrorInfo}");
    }
}

// cree les log si c'est un bot dans bot_attempts.log
// FALLBACK sur mail ou phpmailer
function logBotAttempt() : void{
    $log_file = __DIR__ . '/bot_attempts.log';
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

    $data = json_encode($_POST);
    
    $log_entry = "[$timestamp] IP: $ip | User-Agent: $user_agent | Data: $data\n";

    // Écrire dans le fichier (crée le fichier s'il n'existe pas)
    $result = file_put_contents($log_file, $log_entry, FILE_APPEND);

	debugLog("==[bot] FALLBACK logBotAttempt send mail===");
    // FALLBACK send mail
    if ($result === false) {
        if (function_exists('mail')) {
            $to = $_ENV['MAIL_TO'] ?? DEFAULT_EMAIL;
            $subject = '[ALERTE] Tentative bot - Échec log';
            $body = "Impossible d'écrire dans bot_attempts.log\n\n$log_entry";
            $headers = "From: noreply@azilios.ch\r\nContent-Type: text/plain; charset=UTF-8";

            mail($to, $subject, $body, $headers);
        }
        //FALLBACK phpmailer
        else {
			debugLog("==[bot] FALLBACK phpmailer===");
            sendAlertPhpmailer($log_entry);
        }
    }
}

//verifie si c'est un bot
// false = fake request + log
function isBot() : bool
{
    if (!empty($_POST['company'])) {
		debugLog("---------------> bot detected <---------------");
        fakeRequest();
        logBotAttempt();
        return true;
    }
	debugLog("---------------> bot not detected<---------------");
    return false;
}

// verifie que les champs soit plein et que le mail soit valide
function validatefields() : void{
    debugLog("POST data: " . json_encode($_POST));
    $errors = [];

    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');

    // Validation
    if (empty($name)) {
        $errors[] = 'Le nom est requis';
    }

    if (empty($email)) {
        $errors[] = 'L\'email est requis';
    }
    elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'L\'email n\'est pas valide';
    }

    if (empty($message)) {
        $errors[] = 'Le message est requis';
    }

    // Si erreurs, retourner JSON avec erreurs
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'errors' => $errors
        ]);
        exit;
    }
}

// set les value pour l'envoie de mail via mail()
function setValue() : array {
    validatefields();

    $to = $_ENV['MAIL_TO'] ?? DEFAULT_EMAIL;
    $subject = $_POST['subject'] ?? $_ENV['SUBJECT'] ?? 'Contact from portfolio';
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $message = trim($_POST['message']);

    $headers ="From: noreply@azilios.ch\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";

    return [
        'to' => $to,
        'subject' => $subject,
        'body' => "DE: $name ($email)\n\nMessage:\n$message",
        'headers' => $headers,
        'email' => $email,
        'name' => $name
    ];
}

// [helper] phpmailerSet
function setAdressAndFrom($mail, $data) : object {
    $mail->setFrom('noreply@' . ($_ENV['FROM_DOMAIN'] ?? 'azilios.ch'), 'Azilios');
    $mail->addAddress($data['to']);
    $mail->addReplyTo($data['email'], $data['name']);
    return $mail;
}
// [helper] phpmailerSet
function setMsg($mail, $data) : object {
    $mail->isHTML(false);
    $mail->Subject = $data['subject'];
    $mail->Body = $data['body'];
    return $mail;
}

// set la classe de phpmailer
function phpmailerSet($data) : bool {
    if (!file_exists(PHPMAILER_AUTOLOAD)) {
        debugLog("Erreur: vendor/autoload.php manquant");
        return false;
    }
    
    $mail = new PHPMailer();

    $mail = smptConfig($mail);
    $mail = setAdressAndFrom($mail, $data);
    $mail = setMsg($mail, $data);
    
    if ($mail->send()) {
        debugLog("Email envoyé avec PHPMailer");
        return true;
    } else {
        debugLog("Erreur PHPMailer: {$mail->ErrorInfo}");
        return false;
    }
}

// envoie un mail avec mail()
function usemail($data) : bool {
    debugLog("Utilisation de mail");
    $result = mail(
        $data['to'],
        $data['subject'],
        $data['body'],
        $data['headers']);

    if ($result) {
        debugLog("Email envoyé avec mail()");
    }
    else {
        debugLog("Échec mail()");
    }

    return $result;
}

// envoie de mail via mail()
// FALLBACK phpmailer
function sendMail() : bool {
    $data = setValue();
    if (function_exists('mail')) {
        return  usemail($data);
    }
    
    // FALLBACK phpmailer si mail() n'existe pas
    else {
        debugLog("FALLBACK [mail()], utilisation de PHPMailer");
        return phpmailerSet($data);
    }
}

// start
debugLog("=== start ===");

$dir = __DIR__ . '/.env';
// check si .env exist
if (!file_exists($dir)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'errors' => ['.env manquant']]);
    exit;
}
loadEnv($dir);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

	if (isBot()) {
		exit ;
	}
    if (sendMail()) {
        debugLog("Email envoyé avec succès");
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Message envoyé. Merci !']);
    }
    else {
        debugLog("Échec envoi email");
        http_response_code(500);
        echo json_encode(['success' => false, 'errors' => ['Échec de l\'envoi de l\'email']]);
    }
	debugLog("=== end ===\n");
}
