<script setup>
import { ref, onMounted } from 'vue'
import { movimientoService } from '../services/api'
import TarjetaKPI from '../components/TarjetaKPI.vue'

// ============ ESTADO REACTIVO ============
const movimientos = ref([])
const resumen = ref({ totalIngresos: 0, totalEgresos: 0, saldo: 0, totalMovimientos: 0 })
const cargando = ref(false)
const error = ref(null)
const dialog = ref(false)

const formulario = ref({
  concepto: '',
  tipo: 'Ingreso',
  monto: 0
})

// ============ VALIDACIONES ============
const reglas = {
  requerido: (v) => !!v || 'Campo obligatorio',
  montoPositivo: (v) => (v && v > 0) || 'El monto debe ser un número positivo'
}

// ============ CARGAR DATOS DEL BACKEND ============
const cargarFacturacion = async () => {
  cargando.value = true
  error.value = null
  try {
    const [resMovs, resResumen] = await Promise.all([
      movimientoService.getAll(),
      movimientoService.getResumen()
    ])
    movimientos.value = resMovs.data.datos
    resumen.value = resResumen.data.datos
  } catch (err) {
    error.value = 'Error al cargar el módulo de facturación: ' + err.message
  } finally {
    cargando.value = false
  }
}

onMounted(cargarFacturacion)

// ============ MÉTODOS ============
const abrirNuevo = () => {
  formulario.value = { concepto: '', tipo: 'Ingreso', monto: 0 }
  dialog.value = true
}

const guardarMovimiento = async () => {
  try {
    await movimientoService.create(formulario.value)
    await cargarFacturacion() // Actualiza la lista y los KPI al instante
    dialog.value = false
  } catch (err) {
    alert('Error al registrar factura/movimiento: ' + (err.response?.data?.mensaje || err.message))
  }
}
</script>

<template>
  <div>
    <!-- ALERTA DE ERROR -->
    <v-alert v-if="error" type="error" class="mb-4" closable>
      {{ error }}
    </v-alert>

    <!-- RESUMEN FINANCIERO EN TIEMPO REAL -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <TarjetaKPI 
          titulo="Total Facturado (Ingresos)" 
          :valor="'$' + resumen.totalIngresos.toLocaleString()" 
          icono="mdi-cash-register" 
          color="success" 
        />
      </v-col>
      <v-col cols="12" md="4">
        <TarjetaKPI 
          titulo="Total Gastos (Egresos)" 
          :valor="'$' + resumen.totalEgresos.toLocaleString()" 
          icono="mdi-receipt-text-minus" 
          color="error" 
        />
      </v-col>
      <v-col cols="12" md="4">
        <TarjetaKPI 
          titulo="Balance / Saldo" 
          :valor="'$' + resumen.saldo.toLocaleString()" 
          icono="mdi-scale-balance" 
          :color="resumen.saldo >= 0 ? 'primary' : 'warning'" 
        />
      </v-col>
    </v-row>

    <!-- TABLA DE FACTURAS Y MOVIMIENTOS -->
    <v-card :loading="cargando">
      <v-card-title class="d-flex align-center">
        <span>Módulo de Facturación y Movimientos</span>
        <v-spacer />
        <v-btn color="primary" @click="abrirNuevo">
          <v-icon start>mdi-plus</v-icon>
          Nueva Factura / Registro
        </v-btn>
      </v-card-title>

      <v-data-table :headers="[
        { title: 'ID', key: 'id' },
        { title: 'Concepto / Detalle', key: 'concepto' },
        { title: 'Tipo', key: 'tipo' },
        { title: 'Monto', key: 'monto', align: 'end' }
      ]" :items="movimientos" :items-per-page="5">
        
        <!-- Slot tipo badge -->
        <template v-slot:item.tipo="{ item }">
          <v-chip :color="item.tipo === 'Ingreso' ? 'success' : 'error'" size="small">
            {{ item.tipo }}
          </v-chip>
        </template>

        <!-- Slot monto formato -->
        <template v-slot:item.monto="{ item }">
          <span :class="item.tipo === 'Ingreso' ? 'text-success' : 'text-error'">
            {{ item.tipo === 'Ingreso' ? '+' : '-' }}${{ (item.monto || 0).toLocaleString() }}
          </span>
        </template>
      </v-data-table>
    </v-card>

    <!-- DIÁLOGO NUEVA FACTURA / MOVIMIENTO -->
    <v-dialog v-model="dialog" max-width="500" persistent>
      <v-card>
        <v-card-title>Registrar Factura o Movimiento</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="guardarMovimiento">
            <v-text-field 
              v-model="formulario.concepto" 
              label="Concepto (Ej: Factura #001 - Venta de productos)" 
              :rules="[reglas.requerido]" 
              variant="outlined" 
              class="mb-2" 
            />
            <v-select 
              v-model="formulario.tipo" 
              :items="['Ingreso', 'Egreso']" 
              label="Tipo" 
              variant="outlined" 
              class="mb-2" 
            />
            <v-text-field 
              v-model.number="formulario.monto" 
              label="Monto Total" 
              type="number" 
              prefix="$" 
              :rules="[reglas.requerido, reglas.montoPositivo]" 
              variant="outlined" 
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="guardarMovimiento">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>