import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('[DevManage] Bootstrapping app...');
window.addEventListener('error', (e) => {
  console.error('[DevManage] Global error:', (e as ErrorEvent).error || (e as ErrorEvent).message);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('[DevManage] Unhandled promise rejection:', (e as PromiseRejectionEvent).reason);
});

const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error('[DevManage] Root element not found');
} else {
  createRoot(rootEl).render(<App />);
  console.log('[DevManage] App rendered');
}
