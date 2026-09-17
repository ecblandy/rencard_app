import { UserRole } from '../../types/user-role';

export interface SidebarLink {
  label: string;
  path: string;
  icon?: string;
}

export const SIDEBAR_LINKS: Record<UserRole, SidebarLink[]> = {
  admin: [
    {
      label: 'Dashboard',
      path: '/app/admin/dashboard',
      icon: 'lucideLayoutDashboard',
    },
    {
      label: 'Cupons',
      path: '/app/admin/coupons',
      icon: 'bootstrapTicketPerforated',
    },
    {
      label: 'Cartões físicos',
      path: '/app/admin/physical',
      icon: 'monoCreditCard',
    },
    {
      label: 'Clientes',
      path: '/app/admin/users-and-subscriptions',
      icon: 'lucideUser',
    },
    {
      label: 'Parceiros',
      path: '/app/admin/partners',
      icon: 'remixSuitcase2Line',
    },
    {
      label: 'Integrações',
      path: '/app/admin/integrations',
      icon: 'bootstrapLink',
    },
    {
      label: 'Configurações',
      path: '/app/admin/settings',
      icon: 'lucideSettings',
    },
  ],

  affiliate: [
    {
      label: 'Dashboard',
      path: '/app/affiliate/dashboard',
      icon: 'lucideLayoutDashboard',
    },
    {
      label: 'Pagamentos',
      path: '/app/affiliate/payment',
      icon: 'monoCreditCard',
    },
    {
      label: 'Minhas vendas',
      path: '/app/affiliate/sales',
      icon: 'monoCreditCard',
    },
    {
      label: 'Cupons',
      path: '/app/affiliate/coupons',
      icon: 'monoCreditCard',
    },
    {
      label: 'Configurações',
      path: '/app/affiliate/settings',
      icon: 'lucideSettings',
    },
  ],

  client: [
    {
      label: 'Dashboard',
      path: '/app/client/dashboard',
      icon: 'lucideLayoutDashboard',
    },
    {
      label: 'Assinatura',
      path: '/app/client/billing/preview',
      icon: 'lucideCrown',
    },
    {
      label: 'Perfil',
      path: '/app/client/profile',
      icon: 'lucideUser',
    },
    {
      label: 'Códigos & Apps',
      path: '/app/client/apps',
      icon: 'lucideQrCode',
    },
    {
      label: 'Configurações',
      path: '/app/client/settings',
      icon: 'lucideSettings',
    },
    {
      label: 'Suporte',
      path: '/app/client/support',
      icon: 'bootstrapHeadset',
    },
    {
      label: 'Entrega',
      path: '/app/client/delivery-information',
      icon: 'lucideTruck',
    },
  ],
};
