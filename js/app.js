const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "sports_grounds",
    password: ""
});

connection.connect(err => {
    if (err) {
        return err;
    }
    else {
        console.log('Connrction on');
    }
});

let query = "SELECT * FROM name_columns;";
connection.query(query, (err, result, fields) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result[2]['ru_name']);
        console.log(fields);
    }
});



connection.end(err => {
    if (err) {
        console.log(err);
        return err;
    }
    else {
        console.log("Connection off");
    }
});
