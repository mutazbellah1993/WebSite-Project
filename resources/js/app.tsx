import { createInertiaApp } from '@inertiajs/react';
import { AppProviders } from '@/components/app-providers';
import { initializeTheme } from '@/hooks/use-appearance';
import { resolveLayout } from '@/lib/inertia-layouts';

const appName = import.meta.env.VITE_APP_NAME || 'ELITEDATA';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: resolveLayout,
    strictMode: true,
    withApp(app) {
        return <AppProviders>{app}</AppProviders>;
    },
    progress: {
        color: '#0f766e',
    },
});

// This will set light / dark mode on load...
initializeTheme();
