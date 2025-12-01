export async function registerServiceWorker() {
  if (typeof window === 'undefined') return;
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered', reg);
      return reg;
    } catch (err) {
      console.error('SW registration failed:', err);
    }
  }
}
