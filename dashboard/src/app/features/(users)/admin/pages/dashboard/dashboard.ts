import { Component, inject, signal, effect } from '@angular/core';
import { DashboardTitle } from '../../../components/dashboard-title/dashboard-title';
import { PeriodFilter } from '../../../components/period-filter/period-filter';
import { Surface } from '../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../components/surface-title/surface-title';
import { MultiAxisChart } from '../../components/multi-axis-chart/multi-axis-chart';
import { AdminService } from '../../services/facade/admin.service';
import { DashboardModel } from '../../types/dashboard-model';
import { NgIcon } from '@ng-icons/core';
import { UiButton } from '../../../../../shared/ui/button/button';
import { RouterLink } from '@angular/router';

interface MetricOptions {
  icon: string;
  label: string;
  value: number | string;
  description?: string;
  isPrice: boolean;
}

interface RecentCoupons {
  code: string;
  influencer: string;
  uses: number;
  revenueGenerated: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardTitle,
    PeriodFilter,
    Surface,
    SurfaceTitle,
    MultiAxisChart,
    NgIcon,
    UiButton,
    RouterLink,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  period = signal<'today' | '7d' | '30d'>('30d');
  dashboardData = signal<Partial<DashboardModel>>({});
  adminServices = inject(AdminService);

  constructor() {
    effect(() => {
      const currentPeriod = this.period();
      this.adminServices.fetchDashboardDetails({ period: currentPeriod }).subscribe((response) => {
        this.dashboardData.set(response);

        console.log(response, 'dashboard response');
      });
    });
  }

  metricsSignal = signal<MetricOptions[]>([
    {
      label: 'Receita do mês',
      value: this.dashboardData().metrics?.revenue_cents || 0,
      icon: 'bootstrapCurrencyDollar',
      description: 'Somatório de assinaturas dos dois planos',
      isPrice: true,
    },
    {
      label: 'Assinaturas Pro ativas',
      value: this.dashboardData().metrics?.active_subscriptions || 0,
      icon: 'lucideCrown',
      description: 'Total de contas Pro no momento',
      isPrice: false,
    },
    {
      label: 'Vendas do cartão físico',
      value: this.dashboardData().metrics?.physical_sales || 0,
      icon: 'monoCreditCard',
      description: 'Unidades vendidas nos últimos 30 dias',
      isPrice: false,
    },

    {
      label: 'Novos usuários',
      value: this.dashboardData().metrics?.new_users || 0,
      icon: 'lucideUser',
      description: 'Inscritos nos últimos 30 dias',
      isPrice: false,
    },
  ]);

  couponsMetric = signal<MetricOptions[]>([
    {
      label: 'Cupons ativos',
      value: this.dashboardData().coupons?.active_coupons || 0,
      icon: 'bootstrapTicketPerforated',
      isPrice: false,
    },
    {
      label: 'Influenciadores',
      value: this.dashboardData().coupons?.affiliates || 0,
      icon: 'lucideUser',
      isPrice: false,
    },
    {
      label: 'Usos totais',
      value: this.dashboardData().coupons?.total_uses || 0,
      icon: 'lucideCheck',
      isPrice: false,
    },

    {
      label: 'Receita gerada',
      value: this.dashboardData().coupons?.total_revenue_cents || 0,
      icon: 'bootstrapCurrencyDollar',
      isPrice: true,
    },
  ]);

  recentCoupons = signal<RecentCoupons[]>([]);

  formatPrice(price: number | string) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
      Number(price),
    );
  }
}
