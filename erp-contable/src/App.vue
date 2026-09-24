<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const drawer = ref(true)  // Controla si el menú está abierto
// Array con las opciones del menú
const menuItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
  { title: 'Clientes', icon: 'mdi-account-group', to: '/clientes' },
  { title: 'Facturación', icon: 'mdi-receipt', to: '/facturacion' },
  { title: 'Contabilidad', icon: 'mdi-calculator', to: '/contabilidad' },
  { title: 'Motor Contable', icon: 'mdi-cash-register', to: '/motor-contable' },
]
</script>
<template>
  <v-app>
    <!-- BARRA SUPERIOR -->
    <v-app-bar color="primary" density="comfortable">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>
        <v-icon start>mdi-calculator-variant</v-icon>
        ERP Contable - Microempresa
      </v-app-bar-title>
      <v-spacer />
      <v-chip color="white" variant="outlined">
        <v-icon start>mdi-school</v-icon>
        Universidad
      </v-chip>
    </v-app-bar>
    <!-- MENÚ LATERAL -->
    <v-navigation-drawer v-model="drawer" width="260">
      <v-list nav>
        <v-list-item v-for="item in menuItems" :key="item.to" :to="item.to" :prepend-icon="item.icon"
          :title="item.title" :active="route.path === item.to" color="primary" />
      </v-list>
      <template v-slot:append>
        <div class="pa-4">
          <v-divider class="mb-4" />
          <div class="text-caption text-grey">
            <v-icon size="small">mdi-information</v-icon>
            Sistema didáctico<br />
            Partida doble + SPA
          </div>
        </div>
      </template>
    </v-navigation-drawer>
    <!-- CONTENIDO PRINCIPAL -->
    <v-main>
      <v-container fluid class="pa-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>