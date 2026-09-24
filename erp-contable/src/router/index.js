import { createRouter, createWebHistory } from 'vue-router'
// Importamos las vistas (páginas)
import Dashboard from '../views/Dashboard.vue'
import Clientes from '../views/Clientes.vue'
import Facturacion from '../views/Facturacion.vue'
import Contabilidad from '../views/Contabilidad.vue'
import MotorContable from '../views/MotorContable.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: Clientes
    },
    {
      path: '/facturacion',
      name: 'facturacion',
      component: Facturacion
    },
    {
      path: '/contabilidad',
      name: 'contabilidad',
      component: Contabilidad
    },
    {
      path: '/motor-contable',
      name: 'motor-contable',
      component: MotorContable 
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router