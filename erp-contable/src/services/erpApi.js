import axios from 'axios';

// Instancia configurada de Axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Servicios específicos exportados
export const movimientoService = {
  getAll: () => api.get('/movimientos'),
  create: (datos) => api.post('/movimientos', datos),
  getResumen: () => api.get('/resumen')
};

export default api;
