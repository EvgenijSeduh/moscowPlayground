const mysql = require('mysql');

const NAME_DB = "sports_grounds";
const PASSWORD_DB = "";
const USER_DB = "root";
const HOST_DB = "localhost";



function requestDB(query, callback) {
    const connection = mysql.createConnection({
      host: HOST_DB,
      user:USER_DB,
      password: PASSWORD_DB,
      database: NAME_DB
    });
  
    connection.connect((err) => {
      if (err) {
        console.error('Ошибка подключения к базе данных: ', err);
        return callback(err, null);
      }
  
      connection.query(query, (err, result) => {
        if (err) {
          console.error('Ошибка выполнения запроса к базе данных: ', err);
          connection.end(); // Закрытие соединения
          return callback(err, null);
        }
  
        connection.end(); // Закрытие соединения
        callback(null, result);
      });
    });
  }
  
  module.exports = requestDB;