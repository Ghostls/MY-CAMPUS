<?php
// db_connect.php

$servername = "127.0.0.1"; 
$username = "root";    
$password = "root";        
$dbname = "sistema_academico"; 
$db_port = 8889;      


$conn = new mysqli($servername, $username, $password, $dbname, $db_port);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// No es necesario cerrar la conexión aquí, ya que se usará en otros scripts.
// Se cerrará automáticamente cuando el script termine, o puedes cerrarla explícitamente.
?>