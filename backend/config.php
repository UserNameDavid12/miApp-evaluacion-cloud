<?php
// config.php - Configuración de la base de datos

$host = 'db';          // Nombre del servicio en docker-compose
$dbname = 'bd_ventas';
$user = 'user_api';
$password = 'user_pass';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "Error de conexión: " . $e->getMessage()]));
}
?>