# Code Review Semana 8
## Revisor: [Nombre de tu compañero] | Revisado: Kevyn Camacaro

### Aspectos Positivos
1. La configuración centralizada de Axios en `erpApi.js` permite mantener un código limpio y modular.
2. El uso del bloque `finally` para la variable `cargando` garantiza que el estado de carga siempre se desactive correctamente.

### Sugerencias de Mejora
1. Agregar formato de moneda (`$0.00`) en la lista de movimientos para mejorar la presentación visual.
2. Deshabilitar el botón del formulario mientras la solicitud está en progreso (`:disabled="cargando"`).

### Preguntas Técnicas
1. ¿Por qué elegiste declarar las variables con `ref` en lugar de usar `reactive` para el formulario?

### Validación de Funcionalidades
- [x] Carga de movimientos funciona
- [x] Creación de movimientos funciona
- [x] Manejo de errores es adecuado (prueba con servidor apagado)
- [x] KPIs (saldo) se actualizan correctamente
- [x] El código usa async/await y try/catch/finally