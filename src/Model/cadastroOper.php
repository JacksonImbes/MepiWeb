<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Conectando ao banco de dados usando PDO
$host = 'localhost';
$dbname = 'dbmepi';
$username = 'softMepi';
$password = '1234';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(array("result" => "Erro ao conectar com o banco: " . $e->getMessage()));
    exit();
}

// Recebendo dados da requisição
$eData = file_get_contents("php://input");
$dData = json_decode($eData, true);

$nome = $dData['nome'];
$email = $dData['email'];
$senha = $dData['senha'];
$userType = 'oper'; // Definindo o tipo de usuário como "oper"

$result = "";

if ($nome != '' && $email != '' && $senha != '') {
    try {
        // Verificando se o email já existe no banco de dados
        $stmt = $conn->prepare("SELECT id FROM usuario WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            $result = "Este email já existe";
        } else {
            // Inserindo novo usuário no banco de dados
            $senha = password_hash($senha, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("INSERT INTO usuario (nome, email, senha, userType) VALUES (:nome, :email, :senha, :userType)");
            $stmt->bindParam(':nome', $nome);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':senha', $senha);
            $stmt->bindParam(':userType', $userType);
            $stmt->execute();
            $result = "Cadastro bem sucedido!";
        }
    } catch(PDOException $e) {
        $result = "Falha ao executar query: " . $e->getMessage();
    }
} else {
    $result = "Dados incompletos!";
}

$conn = null;

$response[] = array("result" => $result);
echo json_encode($response);

?>