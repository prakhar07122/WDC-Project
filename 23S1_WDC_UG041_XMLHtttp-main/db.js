const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'xmlhttp'
});

connection.connect();

connection.query('use xmlhttp;', (err, rows, fields) => {
    if (err) throw err;

    console.log('Server connected to the database!');
  });


module.exports = connection;
