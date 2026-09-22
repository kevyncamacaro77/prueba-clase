<template>
  <div class="motor-contable">
    <h2>Motor Contable ERP</h2>

    <!-- Estado de Carga / Spinner -->
    <div v-if="cargando" class="spinner">Cargando datos...</div>

    <!-- Mensaje de Error Amigable -->
    <div v-if="error" class="alerta-error">
      {{ error }}
    </div>

    <!-- Indicadores KPIs (Propiedades Computadas) -->
    <div class="kpis">
      <p><strong>Total Ingresos:</strong> ${{ totalIngresos }}</p>
      <p><strong>Total Egresos:</strong> ${{ totalEgresos }}</p>
      <p><strong>Saldo Neto:</strong> ${{ saldo }}</p>
    </div>

    <!-- Formulario para Nuevo Movimiento -->
    <form @submit.prevent="guardarMovimiento">
      <input v-model="nuevoMovimiento.concepto" placeholder="Concepto" required />
      <select v-model="nuevoMovimiento.tipo">
        <option value="Ingreso">Ingreso</option>
        <option value="Egreso">Egreso</option>
      </select>
      <input v-model.number="nuevoMovimiento.monto" type="number" placeholder="Monto" required />
      <button type="submit" :disabled="cargando">Guardar Movimiento</button>
    </form>

    <!-- Lista de Movimientos -->
    <ul>
      <li v-for="m in movimientos" :key="m.id">
        {{ m.concepto }} - {{ m.tipo }}: ${{ m.monto }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { movimientoService } from '@/services/erpApi';

// 1. Variables reactivas
const movimientos = ref([]);
const cargando = ref(false);
const error = ref(null);

const nuevoMovimiento = ref({
  concepto: '',
  tipo: 'Ingreso',
  monto: 0
});

// 2. Cargar datos con try / catch / finally
async function cargarMovimientos() {
  cargando.value = true;
  error.value = null;
  try {
    const respuesta = await movimientoService.getAll();
    movimientos.value = respuesta.data.datos;
  } catch (err) {
    if (err.response) {
      error.value = err.response.data?.mensaje || 'Error al obtener los datos del servidor.';
    } else if (err.request) {
      error.value = 'El servidor no responde. Verifica que esté encendido.';
    } else {
      error.value = 'Error inesperado en la aplicación.';
    }
  } finally {
    cargando.value = false; // SIEMPRE se ejecuta para ocultar el spinner
  }
}

// 3. Crear movimiento y actualización reactiva
async function guardarMovimiento() {
  cargando.value = true;
  error.value = null;
  try {
    const respuesta = await movimientoService.create(nuevoMovimiento.value);
    movimientos.value.push(respuesta.data.datos); // Actualización inmediata en UI
    nuevoMovimiento.value = { concepto: '', tipo: 'Ingreso', monto: 0 }; // Limpiar form
  } catch (err) {
    error.value = err.response?.data?.mensaje || 'Error al guardar el movimiento.';
  } finally {
    cargando.value = false;
  }
}

// 4. Propiedades Computadas (maneja arrays vacíos para evitar NaN)
const totalIngresos = computed(() => {
  if (!movimientos.value.length) return 0;
  return movimientos.value
    .filter(m => m.tipo === 'Ingreso')
    .reduce((sum, m) => sum + Number(m.monto), 0);
});

const totalEgresos = computed(() => {
  if (!movimientos.value.length) return 0;
  return movimientos.value
    .filter(m => m.tipo === 'Egreso')
    .reduce((sum, m) => sum + Number(m.monto), 0);
});

const saldo = computed(() => totalIngresos.value - totalEgresos.value);

// 5. Cargar datos al montar el componente
onMounted(cargarMovimientos);
</script>
```[cite: 3, 4]

---

## Paso 3: Redactar la Investigación Individual (`investigacion.md`)
Crea un archivo llamado `investigacion.md` en la raíz de tu entrega para responder a los tres escenarios investigativos:

1. **Simulación de Servidor Apagado**: Apaga la terminal de Express con `Ctrl + C` e intenta recargar la aplicación Vue.
   * Documenta qué mensaje mostró tu interfaz y adjunta una captura de pantalla.
2. **Manejo de Error HTTP 400**: Envía un movimiento con monto negativo y muestra en captura cómo la UI atrapa el mensaje de error provisto por el servidor (`err.response.data.mensaje`).
3. **Peticiones Simultáneas con `Promise.all`**: Muestra el código de cómo ejecutar dos peticiones a la vez (ejemplo: contactos y movimientos) esperando a que ambas finalicen antes de ocultar el spinner:
   ```javascript
   const [resMovimientos, resResumen] = await Promise.all([
     movimientoService.getAll(),
     movimientoService.getResumen()
   ]);