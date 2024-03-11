<?php
include 'dbConnector.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['get_data'])) {
        // Запрос данных для вывода на странице
        $result = mysqli_query($mysql, "SELECT * FROM `info_playground` LIMIT 1000");

        if (!$result) {
            echo 'Ошибка запроса: ' . mysqli_error($mysql);
            exit;
        }

        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }

        mysqli_free_result($result); // Освобождаем ресурсы результата запроса
        mysqli_close($mysql); // Закрываем соединение

        header("Content-Type: application/json");
        echo json_encode($data); 
        exit;
    } elseif (isset($_POST['get_data_for_id'])) {
        // Запрос данных по ID
        $id = $_POST['get_data_for_id'];
        $query = "SELECT * FROM `info_playground` WHERE `global_id` = $id";

        $result = mysqli_query($mysql, $query);
        if (!$result) {
            echo 'Ошибка запроса: ' . mysqli_error($mysql);
            exit;
        }

        $data = mysqli_fetch_assoc($result);
        mysqli_free_result($result); // Освобождаем ресурсы результата запроса
        mysqli_close($mysql); // Закрываем соединение

        header("Content-Type: application/json");
        echo json_encode($data); 
        exit;
    } elseif (isset($_POST['get_column_name'])) {
        // Запрос названий столбцов
        $result = mysqli_query($mysql, "SELECT `en_name`,`ru_name` FROM `name_columns`;");

        if (!$result) {
            echo 'Ошибка запроса: ' . mysqli_error($mysql);
            exit;
        }

        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }

        mysqli_free_result($result); // Освобождаем ресурсы результата запроса
        mysqli_close($mysql); // Закрываем соединение

        header("Content-Type: application/json");
        echo json_encode($data); 
        exit;
    } else {
        http_response_code(400);
        echo json_encode(array("error" => "Invalid request"));
        exit;
    }
} else {
    http_response_code(400);
    echo json_encode(array("error" => "Invalid request"));
    exit;
}
?>
