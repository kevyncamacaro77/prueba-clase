
# 🗓️ SESIÓN 2 — JUEVES (2 horas académicas)

---

## 🟩 BLOQUE 1: Accesibilidad Web (a11y) — Tema Oficial 

### 📌 Diapositiva 15: ¿Por qué Accesibilidad?
```
ACCESIBILIDAD WEB (WCAG 2.1)
No es un "extra". Es un derecho.

En un ERP financiero:
- Un contador con discapacidad visual debe poder usarlo
- Un usuario con movilidad reducida debe navegar con teclado
- Los colores deben tener contraste suficiente

REQUISITO: Puntaje Lighthouse ≥ 80 en Accesibilidad
```

### 📌 Diapositiva 16: Auditoría en Vivo
```
PASOS:
1. Abrir Chrome DevTools (F12)
2. Pestaña "Lighthouse"
3. Seleccionar solo "Accessibility"
4. Click "Analyze page load"
5. Revisar resultados

ERRORES COMUNES A CORREGIR:
❌ Inputs sin <label> asociado
❌ Botones solo con íconos (sin aria-label)
❌ Colores con bajo contraste
❌ No se puede navegar con Tab
```

**🗣️ :**
> *"Abran su Dashboard actual. Ejecuten Lighthouse. Tienen 20 minutos para corregir los errores más críticos. Al final, deben tener puntaje ≥ 80. Esto es requisito para la entrega final de la Semana 14."*

---

## 🟩 BLOQUE 2: Informe Técnico Individual — Tema Oficial 

### 📌 Diapositiva 17: Estructura del Informe
```
INFORME TÉCNICO INDIVIDUAL (Entrega Semana 12)

1. PORTADA
2. RESUMEN EJECUTIVO (½ página)
3. ARQUITECTURA DEL SISTEMA
   - Diagrama Vue → Express → MySQL
4. MÓDULOS DESARROLLADOS
   - Capturas y explicación de cada módulo
5. INTEGRACIÓN INTERDISCIPLINARIA ⭐
   - "¿Cómo la materia de Contabilidad dictó las reglas de negocio?"
6. ACCESIBILIDAD Y UX
   - Reporte Lighthouse + mejoras aplicadas
7. DIFICULTADES TÉCNICAS Y SOLUCIONES
8. CONCLUSIONES Y APRENDIZAJES
```

**🗣️ :**
> *" El capítulo 5 (Integración Interdisciplinaria) es el más importante: quiero que reflexionen sobre cómo los conceptos de Contabilidad (partida doble, trazabilidad, no borrar registros) cambiaron la forma en que diseñaron el sistema."*

---

##  BLOQUE 3: Preparación Específica para la Semana 11 

### 📌 Diapositiva 18: Lo que Viene la Semana 11 (Evaluación 20%)
```
SEMANA 11 — EVALUACIÓN SUMATIVA 20%

Módulo 1: Motor Contable
  - Algoritmo de cuadre (Backend + Frontend)
  - Validación Debe = Haber
  - Generación automática de asientos

Módulo 2: Dashboards y Reportes
  - Chart.js para visualización
  - Balance de Comprobación
  - Filtros avanzados (fecha, cuenta, contacto)

NO VAN A TOCAR EL BACKEND EL MARTES.
Solo van a conectar Vue + Gráficos.
Por eso el backend debe estar HOY 100% listo.
```

### 📌 Diapositiva 19: Estructura de Datos para Chart.js
```
Para la Semana 11, su endpoint debe devolver:

GET /api/reportes/grafico-gastos

RESPUESTA:
{
  "labels": ["Servicios", "Alquiler", "Insumos", "Nómina"],
  "datasets": [{
    "label": "Gastos por Categoría",
    "data": [450, 1200, 300, 5000],
    "backgroundColor": ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]
  }]
}

TAREA PARA EL FIN DE SEMANA:
Crear un endpoint que agrupe movimientos por tipo/cuenta
y devuelva este formato listo para Chart.js.
```

---

## 🟩 BLOQUE 4: Pruebas de "Rompe-Sistemas" 

###  Diapositiva 20: Casos de Prueba Obligatorios
```
PRUEBAS QUE DEBE PASAR SU ENDPOINT /api/asientos:

✅ CASO 1: Asiento cuadrado perfecto → 201 Created
✅ CASO 2: Asiento descuadrado → 400 + Rollback
✅ CASO 3: Cuenta inexistente (cuenta_id: 999) → Error FK + Rollback
✅ CASO 4: Monto negativo en una línea → Rechazado
✅ CASO 5: Array de líneas vacío → Error de validación

Si su endpoint pasa los 5 casos.
```

**🗣️ :**
> *"Los últimos 15 minutos son para que prueben los 5 casos. Si alguno falla, quédense y corríjanlo."*

---

## 🟩 BLOQUE 5: Cierre y Compromisos 
### 📌 Diapositiva 21: Compromisos para el Martes de Semana 11
```
PARA EL MARTES 13/10 DEBEN TRAER:

1. ✅ Backend del Motor Contable 100% funcional
2. ✅ Endpoint de reportes para Chart.js (tarea fin de semana)
3. ✅ Informe Técnico avanzado (mínimo 5 capítulos)
4. ✅ Lighthouse ≥ 80 en Accesibilidad
5. ✅ Repositorio actualizado en GitHub

⚠️ NO se permite avanzar al frontend del Motor Contable 
   hasta que el backend esté validado.

📚 RECURSOS:
- Documentación Chart.js: https://www.chartjs.org/docs/
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
```

---
