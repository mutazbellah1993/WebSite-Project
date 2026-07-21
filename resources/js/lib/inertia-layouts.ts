import AppLayout from '@/layouts/app-layout';
import AdminLayout from '@/layouts/admin-layout';
import AuthLayout from '@/layouts/auth-layout';
import PublicLayout from '@/layouts/public-layout';
import SettingsLayout from '@/layouts/settings/layout';

export function resolveLayout(name: string) {
    switch (true) {
        case name.startsWith('public/'):
            return PublicLayout;
        case name.startsWith('admin/'):
            return AdminLayout;
        case name === 'welcome':
            return null;
        case name.startsWith('auth/'):
            return AuthLayout;
        case name.startsWith('settings/'):
            return [AppLayout, SettingsLayout];
        default:
            return AppLayout;
    }
}
