const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('Connected to MariaDB successfully!');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to MariaDB:', err.message);
        process.exit(1); // Exit process if cannot connect to DB
    });

module.exports = pool;