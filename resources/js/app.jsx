import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';


createInertiaApp({
  title: (title) => (title ? `${title} - Ciplon` : 'Ciplon Pharmaceuticals — Advancing Healthcare Through Quality & Innovation'),
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    const page = pages[`./Pages/${name}.jsx`];
    if (!page) {
      throw new Error(`Inertia page not found: ./Pages/${name}.jsx`);
    }
    return page;
  },
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              fontSize: '13px',
              borderRadius: '10px',
              padding: '10px 16px',
              border: '1px solid #1e293b',
            },
            success: {
              iconTheme: {
                primary: '#0d9488',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#e11d48',
                secondary: '#ffffff',
              },
            },
          }}
        />
        <App {...props} />
      </>
    );
  },
  progress: {
    color: '#0d9488',
    showSpinner: false,
  },
});
