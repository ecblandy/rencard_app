// dashboard.ts

import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

import { DashboardTitle } from '../../../components/dashboard-title/dashboard-title';
import { PeriodFilter } from '../../../components/period-filter/period-filter';
import { Surface } from '../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../components/surface-title/surface-title';
import { MultiAxisChart } from '../../components/multi-axis-chart/multi-axis-chart';
import { UiButton } from '../../../../../shared/ui/button/button';

import { AdminService } from '../../services/facade/admin.service';

import {
  DashboardModel,
  DashboardPeriod,
} from '../../types/dashboard-model';

interface MetricOptions {
  icon: string;
  label: string;
  value: number;
  description?: string;
  isPrice: boolean;
}

interface RecentCoupon {
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
  private readonly adminService = inject(AdminService);

  readonly period = signal<DashboardPeriod>('30d');

  readonly dashboardData = signal<DashboardModel | null>(null);

  constructor() {
    effect(() => {
      const selectedPeriod = this.period();

      this.adminService
        .fetchDashboardDetails({
          period: selectedPeriod,
        })
        .subscribe({
          next: (response) => {
            this.dashboardData.set(response);
          },

          error: (error) => {
            console.error(
              'Erro ao carregar dashboard:',
              error,
            );

            this.dashboardData.set(null);
          },
        });
    });
  }

  readonly metrics = computed<MetricOptions[]>(() => {
    const metrics = this.dashboardData()?.metrics;

    return [
      {
        label: 'Receita do período',
        value: metrics?.revenue_cents ?? 0,
        icon: 'bootstrapCurrencyDollar',
        description:
          'Somatório das assinaturas no período selecionado',
        isPrice: true,
      },

      {
        label: 'Assinaturas Pro ativas',
        value:
          metrics?.active_subscriptions ?? 0,
        icon: 'lucideCrown',
        description:
          'Total de contas Pro ativas',
        isPrice: false,
      },

      {
        label: 'Vendas do cartão físico',
        value:
          metrics?.physical_sales ?? 0,
        icon: 'monoCreditCard',
        description:
          'Vendas de cartões no período selecionado',
        isPrice: false,
      },

      {
        label: 'Novos usuários',
        value:
          metrics?.new_users ?? 0,
        icon: 'lucideUser',
        description:
          'Novos usuários no período selecionado',
        isPrice: false,
      },
    ];
  });

  readonly couponMetrics = computed<MetricOptions[]>(() => {
    const coupons = this.dashboardData()?.coupons;

    return [
      {
        label: 'Cupons ativos',
        value:
          coupons?.active_coupons ?? 0,
        icon: 'bootstrapTicketPerforated',
        isPrice: false,
      },

      {
        label: 'Influenciadores',
        value:
          coupons?.affiliates ?? 0,
        icon: 'lucideUser',
        isPrice: false,
      },

      {
        label: 'Usos totais',
        value:
          coupons?.total_uses ?? 0,
        icon: 'lucideCheck',
        isPrice: false,
      },

      {
        label: 'Receita gerada',
        value:
          coupons?.total_revenue_cents ?? 0,
        icon: 'bootstrapCurrencyDollar',
        isPrice: true,
      },
    ];
  });

  readonly recentCoupons = computed<RecentCoupon[]>(() => {
    const recent =
      this.dashboardData()?.coupons?.recent ?? [];

    return recent.map((coupon) => ({
      code: coupon.code,
      influencer: coupon.affiliate_name,
      uses: coupon.uses,
      revenueGenerated:
        coupon.revenue_cents,
    }));
  });

  formatPrice(priceInCents: number): string {
    const value = Number(priceInCents);

    if (!Number.isFinite(value)) {
      return 'R$ 0,00';
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  }
}