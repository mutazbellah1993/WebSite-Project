import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import type { ResolvedComponent } from '@inertiajs/react';
import { renderToString } from 'react-dom/server';
import { AppProviders } from '@/components/app-providers';
import { resolveLayout } from '@/lib/inertia-layouts';

const appName = import.meta.env.VITE_APP_NAME || 'ELITEDATA';
const pages = import.meta.glob<{ default: ResolvedComponent }>('./pages/**/*.tsx', { eager: true });

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: (name) => {
            const page = pages[`./pages/${name}.tsx`];

            if (!page) {
                throw new Error(`Page not found: ${name}`);
            }

            return page;
        },
        layout: resolveLayout,
        setup({ App, props }) {
            return (
                <AppProviders>
                    <App {...props} />
                </AppProviders>
            );
        },
    }),
);
