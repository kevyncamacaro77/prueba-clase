import axios from 'axios';

// Instancia configurada de Axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Servicios para Contactos (Clientes y Proveedores)
export const contactoService = {
  getAll: () => api.get('/contactos'),
  getById: (id) => api.get(`/contactos/${id}`),
  create: (datos) => api.post('/contactos', datos),
  update: (id, datos) => api.put(`/contactos/${id}`, datos),
  delete: (id) => api.delete(`/contactos/${id}`)
};

// Servicios para Movimientos y Balance
export const movimientoService = {
  getAll: () => api.get('/movimientos'),
  create: (datos) => api.post('/movimientos', datos),
  getResumen: () => api.get('/resumen')
};

export default api;