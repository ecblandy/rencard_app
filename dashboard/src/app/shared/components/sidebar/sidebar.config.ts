import { UserRole } from '../../types/user-role';

export interface SidebarLink {
  label: string;
  path: string;
  icon?: string; // pode ser nome de ícone ou classe CSS
}

export const SIDEBAR_LINKS: Record<UserRole, SidebarLink[]> = {
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'lucideLayoutDashboard' },
    { label: 'Cupons', path: '/admin/coupons', icon: 'bootstrapTicketPerforated' },
    { label: 'Cartões físicos', path: '/admin/physical', icon: 'monoCreditCard' },
    { label: 'Clientes', path: '/admin/users-and-subscriptions', icon: 'lucideUser' },
    { label: 'Parceiros', path: '/admin/partners', icon: 'remixSuitcase2Line' },
    { label: 'Integrações', path: '/admin/integrations', icon: 'bootstrapLink' },
    { label: 'Configurações', path: '/admin/settings', icon: 'lucideSettings' },
  ],
  affiliate: [
    { label: 'Dashboard', path: '/affiliate/dashboard', icon: 'lucideLayoutDashboard' },
    { label: 'Pagamentos', path: '/affiliate/payment', icon: 'monoCreditCard' },
    { label: 'Minhas vendas', path: '/affiliate/sales', icon: 'monoCreditCard' },
    { label: 'Cupons', path: '/affiliate/coupons', icon: 'monoCreditCard' },
    { label: 'Configurações', path: '/affiliate/settings', icon: 'lucideSettings' },
  ],
  client: [
    { label: 'Dashboard', path: '/client/dashboard', icon: 'lucideLayoutDashboard' },
    { label: 'Assinatura', path: '/client/billing', icon: 'lucideCrown' },
    { label: 'Perfil', path: '/client/profile', icon: 'lucideUser' },
    { label: 'Códigos & Apps', path: '/client/apps', icon: 'lucideQrCode' },
    { label: 'Configurações', path: '/client/settings', icon: 'lucideSettings' },
  ],
};
