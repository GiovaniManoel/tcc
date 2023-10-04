const mysql = require('mysql');

var pool = mysql.createPool({
    "user": "root", 
    "password": null,
    "database": "tcc_fatec_2023_v1",
    "host": "localhost",
    "port": 3306

});

exports.pool = pool;