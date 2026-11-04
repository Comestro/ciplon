import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { renderToString } from 'react-dom/server';

createServer((page) =>
  createInertiaApp({
    page,
    render: renderToString,
    resolve: (name) => {
      const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
      const resolvedPage = pages[`./Pages/${name}.jsx`];
      if (!resolvedPage) {
        throw new Error(`Inertia SSR page not found: ./Pages/${name}.jsx`);
      }
      return resolvedPage;
    },
    setup: ({ App, props }) => <App {...props} />,
    title: (title) =>
      title
        ? `${title} - Ciplon Pharma`
        : 'Ciplon Pharma — WHO-GMP & ISO 9001:2015 Certified Finished Formulations',
  })
);

