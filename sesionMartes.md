# 📊 PRESENTACIÓN  - SEMANA 10
## "Puente hacia el Motor Contable: Transacciones ACID y Accesibilidad"

---

# ️ SESIÓN 1 — MARTES 

---

## 🟦 BLOQUE 1: Apertura y Contexto 

### 📌 Diapositiva 1: Portada
```
SEMANA 10: PUENTE HACIA EL MOTOR CONTABLE
De la Tesorería al Sistema Contable Real

Unidad Curricular: Interfaces Web con el Usuario (INU-554)

```

### 📌 Diapositiva 2: ¿Dónde estamos?
```
RECORRIDO DEL PROYECTO ERP
── Sem 7-8: Frontend Vue 3 + API en memoria RAM
── Sem 9:   Persistencia real con MySQL 
├── Sem 10:  HOY → Preparación del Motor Contable
── Sem 11:  EVALUACIÓN 20% → Partida Doble + Chart.js
```


---

## 🟦 BLOQUE 2: Punto de Control Rápido 

### 📌 Diapositiva 3: Checklist de Salida de la Semana 9
```
¿TIENES ESTO FUNCIONANDO? ✅ / ❌

[ ] Servidor Express corriendo en puerto 3000
[ ] Base de datos MySQL: erp_contable_[TUS INICIALES]
[ ] Tablas: contactos y movimientos con datos
[ ] Endpoints funcionando: 
    GET /api/contactos
    POST /api/movimientos
    GET /api/resumen
[ ] Los datos persisten al reiniciar el servidor
```


---

##  BLOQUE 3: El Salto Conceptual — Tesorería vs Contabilidad 

### 📌 Diapositiva 4: Los Dos Mundos del ERP
```
┌─────────────────────────────────────────────────────────────┐
│  MUNDO 1: TESORERÍA (Semana 9) - Lo que ve el Cajero       │
│  "Entró dinero, salió dinero" - Unidireccional             │
│  Tablas: contactos, movimientos                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────
│  MUNDO 2: MOTOR CONTABLE (Semana 11) - Lo que ve el Contador│
│  "¿De dónde vino y a dónde fue?" - Partida Doble           │
│  Tablas: catalogo_cuentas, asientos, detalle_asientos      │
└─────────────────────────────────────────────────────────────┘
```

### 📌 Diapositiva 5: La Traducción Automática
```
ACCIÓN DEL USUARIO (Frontend):
"Registrar Ingreso de $1,500 por Venta de Servicios"

TRADUCCIÓN AUTOMÁTICA DEL BACKEND (Partida Doble):
┌──────────────────────────────┬──────────┬──────────┐
│ Cuenta Contable              │  DEBE    │  HABER   │
├──────────────────────────────┼──────────┼──────────┤
│ 1.1.01 Caja General (Activo) │ $1,500   │ $0       │
│ 4.1.01 Ventas (Ingreso)      │ $0       │ $1,500   │
├────────────────────────────────────────┼──────────┤
│ TOTALES                      │ $1,500   │ $1,500   │
└──────────────────────────────┴──────────┴──────────┘

REGLA DE ORO: SUMA(DEBE) == SUMA(HABER)
Si no cuadra → ROLLBACK (se deshace todo)
```



## 🟦 BLOQUE 4: Concepto Clave — Transacciones ACID (30 min)

### 📌 Diapositiva 6: ¿Qué es una Transacción?
```
TRANSACCIÓN = "Todo o Nada"

Ejemplo de la vida real: Transferencia bancaria
  1. Se debita de tu cuenta
  2. Se acredita en la cuenta destino
  
  ¿Qué pasa si se va la luz entre el paso 1 y 2?
  → Sin transacción: Pierdes el dinero 💸
  → Con transacción: Se REVIerte todo (Rollback) ✅
```

### 📌 Diapositiva 7: Las 4 Propiedades ACID
```
A - Atomicidad:    Todo se ejecuta o nada se ejecuta
C - Consistencia:  La BD pasa de un estado válido a otro válido
I - Aislamiento:   Las transacciones no interfieren entre sí
D - Durabilidad:   Una vez confirmada (COMMIT), es permanente
```

### 📌 Diapositiva 8: Sintaxis en Node.js + MySQL
```javascript
const connection = await db.getConnection();

try {
  await connection.beginTransaction();  // 1. INICIAR
  
  // ... todas tus consultas INSERT/UPDATE ...
  
  await connection.commit();            // 2. CONFIRMAR (guardar todo)
  
} catch (error) {
  await connection.rollback();          // 3. REVERTIR (deshacer todo)
  res.status(400).json({ error: error.message });
  
} finally {
  connection.release();                 // 4. LIBERAR conexión
}
```


---

## 🟦 BLOQUE 5: Modelado de Base de Datos para el Motor Contable 

### 📌 Diapositiva 9: El DER Completo (Proyectar el diagrama)
```
[CONTACTOS] 1:N [MOVIMIENTOS] 1:1 [ASIENTOS_CONTABLES] 1:N [DETALLE_ASIENTOS] N:1 [CATALOGO_CUENTAS]
   (Sem 9)          (Sem 9)            (Sem 11)              (Sem 11)            (Sem 11)
```

### 📌 Diapositiva 10: Script SQL — Tablas Nuevas
```sql
-- 1. CATÁLOGO DE CUENTAS (El diccionario contable)
CREATE TABLE catalogo_cuentas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('Activo','Pasivo','Patrimonio','Ingreso','Gasto') NOT NULL,
    naturaleza ENUM('Deudora','Acreedora') NOT NULL
);

-- 2. ASIENTOS CONTABLES (La cabecera)
CREATE TABLE asientos_contables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    descripcion VARCHAR(255),
    total_debe DECIMAL(12,2) DEFAULT 0.00,
    total_haber DECIMAL(12,2) DEFAULT 0.00,
    estado ENUM('Cuadrado','Descuadrado') DEFAULT 'Descuadrado',
    movimiento_id INT NULL,
    FOREIGN KEY (movimiento_id) REFERENCES movimientos(id) 
        ON DELETE SET NULL
);

-- 3. DETALLE DE ASIENTOS (Las líneas de la partida doble)
CREATE TABLE detalle_asientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asiento_id INT NOT NULL,
    cuenta_id INT NOT NULL,
    debe DECIMAL(12,2) DEFAULT 0.00,
    haber DECIMAL(12,2) DEFAULT 0.00,
    FOREIGN KEY (asiento_id) REFERENCES asientos_contables(id) 
        ON DELETE CASCADE,
    FOREIGN KEY (cuenta_id) REFERENCES catalogo_cuentas(id)
);
```

### 📌 Diapositiva 11: Datos de Prueba del Catálogo
```sql
INSERT INTO catalogo_cuentas (codigo, nombre, tipo, naturaleza) VALUES
('1.1.01', 'Caja General', 'Activo', 'Deudora'),
('1.1.02', 'Banco Mercantil', 'Activo', 'Deudora'),
('1.2.01', 'Clientes', 'Activo', 'Deudora'),
('2.1.01', 'Proveedores', 'Pasivo', 'Acreedora'),
('3.1.01', 'Capital Social', 'Patrimonio', 'Acreedora'),
('4.1.01', 'Ventas de Servicios', 'Ingreso', 'Acreedora'),
('5.1.01', 'Gastos de Servicios', 'Gasto', 'Deudora'),
('5.1.02', 'Gastos de Alquiler', 'Gasto', 'Deudora');
```


---

## 🟦 BLOQUE 6: Trabajo Práctico — Implementación del Endpoint 

### 📌 Diapositiva 12: El Reto de Hoy
```
OBJETIVO: Implementar POST /api/asientos

Debe recibir este JSON:
{
  "fecha": "2026-10-08",
  "descripcion": "Registro de venta",
  "lineas": [
    { "cuenta_id": 1, "debe": 1500.00, "haber": 0.00 },
    { "cuenta_id": 6, "debe": 0.00, "haber": 1500.00 }
  ]
}

Debe aplicar el Algoritmo de Cuadre:
1. Calcular totalDebe y totalHaber
2. Si no cuadran → Error 400 + Rollback
3. Si cuadran → Guardar cabecera + detalles + Commit
```




### 📌 Diapositiva 13: Código Guía (Proyectar solo si se traban)
```javascript
app.post('/api/asientos', async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { fecha, descripcion, lineas } = req.body;
    
    // Calcular totales
    let totalDebe = 0, totalHaber = 0;
    lineas.forEach(l => {
      totalDebe += parseFloat(l.debe);
      totalHaber += parseFloat(l.haber);
    });
    
    // VALIDACIÓN DE PARTIDA DOBLE
    if (Math.abs(totalDebe - totalHaber) > 0.01) {
      throw new Error(`No cuadra. Debe: ${totalDebe}, Haber: ${totalHaber}`);
    }
    
    // Guardar cabecera
    const [resAsiento] = await connection.query(
      `INSERT INTO asientos_contables 
       (fecha, descripcion, total_debe, total_haber, estado) 
       VALUES (?, ?, ?, ?, 'Cuadrado')`,
      [fecha, descripcion, totalDebe, totalHaber]
    );
    const asientoId = resAsiento.insertId;
    
    // Guardar detalles
    for (const linea of lineas) {
      await connection.query(
        `INSERT INTO detalle_asientos 
         (asiento_id, cuenta_id, debe, haber) 
         VALUES (?, ?, ?, ?)`,
        [asientoId, linea.cuenta_id, linea.debe, linea.haber]
      );
    }
    
    await connection.commit();
    res.status(201).json({ exito: true, id: asientoId });
    
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ exito: false, mensaje: error.message });
  } finally {
    connection.release();
  }
});
```


---

## 🟦 BLOQUE 7: Cierre del Martes 

### 📌 Diapositiva 14: Checklist de Salida del Martes
```
AL FINALIZAR HOY DEBES TENER:

✅ Tablas catalogo_cuentas, asientos_contables, detalle_asientos creadas
✅ 8 cuentas insertadas en el catálogo
✅ Endpoint POST /api/asientos funcionando
✅ Prueba en Postman: asiento cuadrado → 201 Created
✅ Prueba en Postman: asiento descuadrado → 400 Error + Rollback

⚠️ Si no tienes esto, NO estás listo para la Semana 11.
   Debes nivelarte el fin de semana.
```
