import axios from 'axios';

// Instancia base de Axios apuntando al backend Express
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Servicios para la entidad Contactos (CRM)
export const contactoService = {
  getAll: () => api.get('/contactos'),
  getById: (id) => api.get(`/contactos/${id}`),
  create: (data) => api.post('/contactos', data),
  update: (id, data) => api.put(`/contactos/${id}`, data),
  delete: (id) => api.delete(`/contactos/${id}`)
};

// Servicios para Movimientos y Resumen Financiero
export const movimientoService = {
  getAll: () => api.get('/movimientos'),
  create: (data) => api.post('/movimientos', data),
  getResumen: () => api.get('/resumen')
};

export default api;