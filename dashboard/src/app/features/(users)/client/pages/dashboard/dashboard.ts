import { Component, computed, effect, inject, signal } from '@angular/core';
import { MetricCard, MetricOption } from '../../../../../shared/components/metric-card/metric-card';
import { Surface } from '../../../../../shared/components/surface/surface';
import { DashboardTitle } from '../../../components/dashboard-title/dashboard-title';
import { PeriodFilter } from '../../../components/period-filter/period-filter';
import { SurfaceTitle } from '../../../components/surface-title/surface-title';
import { UsersActiveGraph } from '../../../components/users-active-graph/users-active-graph';
import { DashboardQrcode } from '../../components/dashboard-qrcode/dashboard-qrcode';
import { ClientService } from '../../services/facade/client.service';
import { DashboardClient } from '../../types/dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardTitle,
    PeriodFilter,
    UsersActiveGraph,
    MetricCard,
    Surface,
    SurfaceTitle,
    DashboardQrcode,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private clientServices = inject(ClientService);
  period = signal<'today' | '7d' | '30d'>('30d');
  dashboardData = signal<Partial<DashboardClient>>({});
  isLoading = signal(false);

  constructor() {
    effect(() => {
      const currentPeriod = this.period();
      this.isLoading.set(true);

      this.clientServices.fetchDashboardDetails(currentPeriod).subscribe({
        next: (response) => {
          this.dashboardData.set(response);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
    });
  }

  metricsSignal = computed<MetricOption[]>(() => {
    const summary = this.dashboardData().summary;
    return [
      {
        label: 'Visualizações',
        value: summary?.profile_views ?? 0,
        icon: 'lucideEye',
      },
      {
        label: 'Cliques em links',
        value: summary?.link_clicks ?? 0,
        icon: 'lucideLink',
      },
      {
        label: 'QR Scans',
        value: summary?.qr_scans ?? 0,
        icon: 'lucideQrCode',
      },
      {
        label: 'NFC Scans',
        value: summary?.nfc_scans ?? 0,
        icon: 'lucideCreditCard',
      },
      {
        label: 'Compartilhamentos',
        value: summary?.shares ?? 0,
        icon: 'lucideShare2',
      },
    ];
  });

  // Expõe os dados do chart para o componente de gráfico
  viewsByDay = computed(() => this.dashboardData().charts?.views_by_day ?? []);
  topLinks = computed(() => this.dashboardData().charts?.top_links ?? []);
  profile = computed(() => this.dashboardData().profile);
}
