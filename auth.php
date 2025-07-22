<?php
// auth.php
require_once 'db_connect.php'; 

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'login') {
        $correo = $conn->real_escape_string($_POST['correo'] ?? '');
        $password = $_POST['password'] ?? '';

        $stmt = $conn->prepare("SELECT id, password FROM usuarios WHERE correo = ?");
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($user_id, $hashed_password);
            $stmt->fetch();

            if (password_verify($password, $hashed_password)) {
                $response['success'] = true;
                $response['message'] = 'Login exitoso!';
                $response['user_id'] = $user_id; 

            } else {
                $response['message'] = 'Contraseña incorrecta.';
            }
        } else {
            $response['message'] = 'Correo no registrado.';
        }
        $stmt->close();

    } elseif ($action === 'register') {
        $nombre = $conn->real_escape_string($_POST['nombre'] ?? '');
        $apellido = $conn->real_escape_string($_POST['apellido'] ?? '');
        $correo = $conn->real_escape_string($_POST['correo'] ?? '');
        $password = $_POST['password'] ?? '';
        $cedula = $conn->real_escape_string($_POST['cedula'] ?? '');

        if (empty($nombre) || empty($apellido) || empty($correo) || empty($password) || empty($cedula)) {
            $response['message'] = 'Todos los campos son obligatorios.';
        } else {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $conn->prepare("INSERT INTO usuarios (nombre, apellido, correo, password, cedula) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $nombre, $apellido, $correo, $hashed_password, $cedula);

            if ($stmt->execute()) {
                $response['success'] = true;
                $response['message'] = 'Registro exitoso! Por favor, inicia sesión.';
            } else {
                $response['message'] = 'Error al registrar: ' . $stmt->error;
                if ($stmt->errno == 1062) { // Código de error para entrada duplicada (UNIQUE constraint)
                    $response['message'] = 'El correo o la cédula ya están registrados.';
                }
            }
            $stmt->close();
        }
    } else {
        $response['message'] = 'Acción no válida.';
    }
} else {
    $response['message'] = 'Método de solicitud no permitido.';
}

$conn->close();
echo json_encode($response);
?>