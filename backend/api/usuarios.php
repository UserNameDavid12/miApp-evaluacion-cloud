<?php
// api/usuarios.php - API REST para la tabla usuarios

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Obtener el ID de la URL (ej: /api/usuarios.php?id=1)
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

switch ($method) {
    case 'GET':
        if ($id) {
            // Obtener un usuario por ID
            $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE id = ?");
            $stmt->execute([$id]);
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($usuario ?: ["error" => "Usuario no encontrado"]);
        } else {
            // Listar todos los usuarios
            $stmt = $pdo->query("SELECT * FROM usuarios ORDER BY id");
            $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($usuarios);
        }
        break;

    case 'POST':
        // Registrar un nuevo usuario
        $nombre = $input['nombre'] ?? '';
        $apePaterno = $input['apePaterno'] ?? '';
        $apeMaterno = $input['apeMaterno'] ?? '';
        $user = $input['user'] ?? '';
        $password = $input['password'] ?? '';
        $estado = $input['estado'] ?? 1;

        // Encriptar la contraseña
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, apePaterno, apeMaterno, user, password, estado) VALUES (?, ?, ?, ?, ?, ?)");
        if ($stmt->execute([$nombre, $apePaterno, $apeMaterno, $user, $hashedPassword, $estado])) {
            echo json_encode(["mensaje" => "Usuario creado correctamente", "id" => $pdo->lastInsertId()]);
        } else {
            echo json_encode(["error" => "Error al crear el usuario"]);
        }
        break;

    case 'PUT':
        // Actualizar un usuario existente
        if (!$id) {
            echo json_encode(["error" => "ID requerido"]);
            break;
        }
        $nombre = $input['nombre'] ?? '';
        $apePaterno = $input['apePaterno'] ?? '';
        $apeMaterno = $input['apeMaterno'] ?? '';
        $user = $input['user'] ?? '';
        $estado = $input['estado'] ?? 1;

        // Si se envía una nueva contraseña, se encripta
        $password = $input['password'] ?? null;
        if ($password) {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE usuarios SET nombre=?, apePaterno=?, apeMaterno=?, user=?, password=?, estado=? WHERE id=?");
            $success = $stmt->execute([$nombre, $apePaterno, $apeMaterno, $user, $hashedPassword, $estado, $id]);
        } else {
            $stmt = $pdo->prepare("UPDATE usuarios SET nombre=?, apePaterno=?, apeMaterno=?, user=?, estado=? WHERE id=?");
            $success = $stmt->execute([$nombre, $apePaterno, $apeMaterno, $user, $estado, $id]);
        }

        echo json_encode($success ? ["mensaje" => "Usuario actualizado"] : ["error" => "Error al actualizar"]);
        break;

    case 'DELETE':
        // Eliminar un usuario (o desactivarlo)
        if (!$id) {
            echo json_encode(["error" => "ID requerido"]);
            break;
        }
        // En lugar de eliminar, lo desactivamos (cambiamos estado a 0)
        $stmt = $pdo->prepare("UPDATE usuarios SET estado = 0 WHERE id = ?");
        $success = $stmt->execute([$id]);
        echo json_encode($success ? ["mensaje" => "Usuario desactivado"] : ["error" => "Error al desactivar"]);
        break;

    default:
        echo json_encode(["error" => "Método no permitido"]);
        break;
}
?>