// SERVIDOR EXPRESS CON MYSQL ERP CONTABLE
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const PORT = 3000;

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// ============================================
// ENDPOINTS PARA CONTACTOS
// ============================================

// 1. Obtener todos los contactos
app.get('/api/contactos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contactos ORDER BY id');
    res.status(200).json({ exito: true, datos: rows });
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
  }
});

// 2. Obtener un contacto por ID
app.get('/api/contactos/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contactos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ exito: false, mensaje: 'Contacto no encontrado' });
    }
    res.status(200).json({ exito: true, datos: rows[0] });
  } catch (error) {
    console.error('Error al obtener contacto:', error);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
  }
});

// 3. Crear un nuevo contacto
app.post('/api/contactos', async (req, res) => {
  try {
    const { nombre, rfc, tipo, email, telefono } = req.body;
    if (!nombre || !rfc || !tipo) {
      return res.status(400).json({ exito: false, mensaje: 'Campos obligatorios: nombre, rfc, tipo' });
    }
    const [result] = await db.query(
      'INSERT INTO contactos (nombre, rfc, tipo, email, telefono) VALUES (?, ?, ?, ?, ?)',
      [nombre, rfc, tipo, email || null, telefono || null]
    );
    res.status(201).json({
      exito: true,
      mensaje: 'Contacto creado exitosamente',
      datos: { id: result.insertId, nombre, rfc, tipo }
    });
  } catch (error) {
    console.error('Error al crear contacto:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ exito: false, mensaje: 'El RFC ya está registrado' });
    }
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
  }
});

// 4. Actualizar un contacto
app.put('/api/contactos/:id', async (req, res) => {
  try {
    const { nombre, rfc, tipo, email, telefono } = req.body;
    const [result] = await db.query(
      'UPDATE contactos SET nombre=?, rfc=?, tipo=?, email=?, telefono=? WHERE id=?',
      [nombre, rfc, tipo, email, telefono, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ exito: false, mensaje: 'Contacto no encontrado' });
    }
    res.status(200).json({
      exito: true,
      mensaje: 'Contacto actualizado',
      datos: { id: parseInt(req.params.id), nombre, rfc, tipo }
    });
  } catch (error) {
    console.error('Error al actualizar contacto:', error);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
  }
});

// 5. Eliminar un contacto
app.delete('/api/contactos/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM contactos WHERE id=?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ exito: false, mensaje: 'Contacto no encontrado' });
    }
    res.status(200).json({ exito: true, mensaje: 'Contacto eliminado' });
  } catch (error) {
    console.error('Error al eliminar contacto:', error);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
  }
});

// ============================================
// ENDPOINTS PARA MOVIMIENTOS
// ============================================

// 1. Obtener todos los movimientos (con JOIN a contactos)
app.get('/api/movimientos', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, c.nombre AS contacto_nombre
      FROM movimientos m
      LEFT JOIN contactos c ON m.contacto_id = c.id
      ORDER BY m.fecha DESC
    `);
    res.status(200).json({ exito: true, datos: rows });
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
  }
});

// 2. Crear un nuevo movimiento
app.post('/api/movimientos', async (req, res) => {
  try {
    const { concepto, tipo, monto, fecha, contacto_id } = req.body;
    if (!concepto || !tipo || !monto || !fecha) {
      return res.status(400).json({ exito: false, mensaje: 'Campos obligatorios: concepto, tipo, monto, fecha' });
    }
    if (!['Ingreso', 'Egreso'].includes(tipo)) {
      return res.status(400).json({ exito: false, mensaje: 'El tipo debe ser "Ingreso" o "Egreso"' });
    }
    const montoNumerico = parseFloat(monto);
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      return res.status(400).json({ exito: false, mensaje: 'El monto debe ser un número positivo' });
    }
    const [result] = await db.query(
      'INSERT INTO movimientos (concepto, tipo, monto, fecha, contacto_id) VALUES (?, ?, ?, ?, ?)',
      [concepto, tipo, montoNumerico, fecha, contacto_id || null]
    );
    res.status(201).json({
      exito: true,
      mensaje: 'Movimiento registrado',
      datos: { id: result.insertId, concepto, tipo, monto: montoNumerico, fecha }
    });
  } catch (error) {
    console.error('Error al crear movimiento:', error);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
  }
});

// 3. Generar reporte / resumen de tesorería
app.get('/api/resumen', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        SUM(CASE WHEN tipo = 'Ingreso' THEN monto ELSE 0 END) AS totalIngresos,
        SUM(CASE WHEN tipo = 'Egreso' THEN monto ELSE 0 END) AS totalEgresos,
        COUNT(*) AS totalMovimientos
      FROM movimientos
    `);
    const resumen = rows[0];
    const totalIngresos = parseFloat(resumen.totalIngresos) || 0;
    const totalEgresos = parseFloat(resumen.totalEgresos) || 0;
    const saldo = totalIngresos - totalEgresos;

    res.status(200).json({
      exito: true,
      datos: {
        totalIngresos,
        totalEgresos,
        saldo,
        totalMovimientos: parseInt(resumen.totalMovimientos) || 0
      }
    });
  } catch (error) {
    console.error('Error al obtener resumen:', error);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
  }
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log('====================================');
  console.log('    SERVIDOR ERP CON MYSQL ACTIVO   ');
  console.log('====================================');
  console.log(`Puerto: http://localhost:${PORT}`);
  console.log('Base de datos: erp_contable_kc');
});