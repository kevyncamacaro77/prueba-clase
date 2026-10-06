const mysql = require('mysql2/promise'); // <-- IMPORTANTE: Agregar /promise para usar async/await

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'erp_contable_kc', // <-- Tu base de datos real
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db; // (Si este código está en un archivo db.js separado)