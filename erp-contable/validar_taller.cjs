/**
 * SCRIPT DE AUTOEVALUACIÓN - TALLER SEMANA 8
 * Programa: Programación Web Avanzada / Arquitectura Frontend-Backend
 * Objetivo: Validar automáticamente la implementación de patrones asíncronos en Vue 3.
 * 
 * Uso: node validar_taller.js
 * Salida: Genera 'reporte_automatico.json' en la raíz del proyecto.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Iniciando validación automática del Taller Semana 8...\n');

const resultados = {
  estudiante: process.env.USER || process.env.USERNAME || 'Estudiante',
  fecha: new Date().toLocaleString(),
  semana: 8,
  proyecto: 'erp-contable',
  pruebas: {
    axios_instalado: false,
    servicio_api_existe: false,
    usa_axios_create: false,
    usa_base_url: false,
    usa_async_await: false,
    usa_try_catch: false,
    usa_finally: false,
    usa_computed: false,
    usa_onMounted: false,
    usa_ref: false,
    maneja_estado_cargando: false,
    maneja_estado_error: false
  },
  puntaje: 0,
  maxPuntaje: 12,
  estado_final: 'PENDIENTE',
  recomendaciones: []
};

try {
  // 1. Verificar package.json (Axios instalado)
  const pkgPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (pkg.dependencies && pkg.dependencies.axios) {
      resultados.pruebas.axios_instalado = true;
      console.log('✅ Axios está instalado en package.json');
    } else {
      resultados.recomendaciones.push('Instalar Axios: ejecuta `npm install axios`');
    }
  } else {
    resultados.recomendaciones.push('No se encontró package.json en la raíz del proyecto.');
  }

  // 2. Verificar servicio centralizado (src/services/erpApi.js o api.js)
  const servicesDir = path.join(__dirname, 'src', 'services');
  let apiContent = '';
  if (fs.existsSync(servicesDir)) {
    const files = fs.readdirSync(servicesDir);
    const apiFile = files.find(f => f.includes('api') && f.endsWith('.js'));
    
    if (apiFile) {
      resultados.pruebas.servicio_api_existe = true;
      apiContent = fs.readFileSync(path.join(servicesDir, apiFile), 'utf8');
      
      if (apiContent.includes('axios.create')) {
        resultados.pruebas.usa_axios_create = true;
        console.log('✅ Usa axios.create() para configuración centralizada');
      } else {
        resultados.recomendaciones.push('Usa axios.create() en tu archivo de servicios en lugar de llamadas sueltas.');
      }

      if (apiContent.includes('baseURL')) {
        resultados.pruebas.usa_base_url = true;
        console.log('✅ Configura baseURL correctamente');
      }
    } else {
      resultados.recomendaciones.push('Crea un archivo de servicios (ej: src/services/erpApi.js).');
    }
  }

  // 3. Verificar patrones en los componentes de Vista (src/views/*.vue)
  const viewsDir = path.join(__dirname, 'src', 'views');
  let vueFilesContent = '';
  
  if (fs.existsSync(viewsDir)) {
    const files = fs.readdirSync(viewsDir);
    const vueFiles = files.filter(f => f.endsWith('.vue'));
    
    if (vueFiles.length > 0) {
      vueFiles.forEach(file => {
        vueFilesContent += fs.readFileSync(path.join(viewsDir, file), 'utf8') + '\n';
      });

      // Validaciones de contenido
      const checks = [
        { key: 'usa_async_await', pattern: /async\s+function|async\s*\(/, msg: 'Usa async/await en funciones de red' },
        { key: 'usa_try_catch', pattern: /try\s*\{[\s\S]*?catch\s*\(/, msg: 'Implementa bloques try/catch para manejo de errores' },
        { key: 'usa_finally', pattern: /finally\s*\{/, msg: 'Usa bloque finally para limpiar estados de carga' },
        { key: 'usa_computed', pattern: /computed\s*\(/, msg: 'Usa propiedades computed para cálculos reactivos (ej: saldo)' },
        { key: 'usa_onMounted', pattern: /onMounted\s*\(/, msg: 'Usa el hook onMounted para la carga inicial de datos' },
        { key: 'usa_ref', pattern: /ref\s*\(/, msg: 'Usa ref() para declarar variables reactivas' },
        { key: 'maneja_estado_cargando', pattern: /cargando|loading/i, msg: 'Implementa un estado reactivo de carga (cargando/loading)' },
        { key: 'maneja_estado_error', pattern: /error|errorMsg/i, msg: 'Implementa un estado reactivo para manejar errores' }
      ];

      checks.forEach(check => {
        if (check.pattern.test(vueFilesContent)) {
          resultados.pruebas[check.key] = true;
          console.log(`✅ ${check.msg}`);
        } else {
          resultados.recomendaciones.push(check.msg.replace('Usa', 'Verifica que uses').replace('Implementa', 'Verifica que implementes'));
        }
      });

    } else {
      resultados.recomendaciones.push('No se encontraron archivos .vue en src/views/.');
    }
  } else {
    resultados.recomendaciones.push('No se encontró la carpeta src/views/.');
  }

  // 4. Calcular puntaje y estado final
  const pruebasAprobadas = Object.values(resultados.pruebas).filter(v => v === true).length;
  resultados.puntaje = pruebasAprobadas;
  
  if (pruebasAprobadas >= 10) {
    resultados.estado_final = 'APROBADO_AUTOMÁTICO';
    console.log('\n🎉 ¡Excelente! Tu código cumple con todos los requisitos básicos.');
  } else if (pruebasAprobadas >= 7) {
    resultados.estado_final = 'APROBADO_CON_OBSERVACIONES';
    console.log('\n✅ Aprobado, pero hay algunas mejoras recomendadas para alcanzar la excelencia.');
  } else {
    resultados.estado_final = 'REQUIERE_REVISIÓN_MANUAL';
    console.log('\n⚠️  Se requiere revisión manual del docente. Faltan implementaciones importantes.');
  }

} catch (err) {
  resultados.error = err.message;
  resultados.estado_final = 'ERROR_EN_VALIDACION';
  console.error('❌ Error inesperado durante la validación:', err.message);
}

// 5. Mostrar resumen en consola
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN DE VALIDACIÓN AUTOMÁTICA');
console.log('='.repeat(60));
console.log(`Puntaje obtenido: ${resultados.puntaje} / ${resultados.maxPuntaje}`);
console.log(`Estado final: ${resultados.estado_final}`);

if (resultados.recomendaciones.length > 0) {
  console.log('\n💡 RECOMENDACIONES PARA MEJORAR TU NOTA:');
  resultados.recomendaciones.forEach((rec, i) => {
    console.log(`  ${i + 1}. ${rec}`);
  });
}

// 6. Generar archivo de reporte para el docente
const reportePath = path.join(__dirname, 'reporte_automatico.json');
fs.writeFileSync(reportePath, JSON.stringify(resultados, null, 2));
console.log('\n📄 Reporte generado exitosamente: reporte_automatico.json');
console.log('📌 INSTRUCCIÓN: Sube este archivo JSON a la carpeta de Google Drive junto con tu proyecto.');
console.log('='.repeat(60));