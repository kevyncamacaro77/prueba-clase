const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'erp_user',
  password: 'erp2026',
  database: 'erp_contable_kc', // Tu base de datos con iniciales
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();