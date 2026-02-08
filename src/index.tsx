
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';



// ============================================================================
// PUNTO DE ENTRADA (index.tsx)
// ============================================================================
// Este es el archivo principal que se ejecuta primero (definido en index.html).
// Su función es montar la aplicación de React en el DOM del navegador.
// ============================================================================

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Crea la raíz de React (React 18+) y renderiza la App
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* React.StrictMode ayuda a detectar problemas potenciales en la aplicación */}
    <App />
  </React.StrictMode>
);


