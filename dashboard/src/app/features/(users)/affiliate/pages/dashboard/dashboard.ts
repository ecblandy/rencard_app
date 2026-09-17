import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { AffiliateDashboardResponse } from '../../services/api/api-affiliate';
import { AffiliateServices } from '../../services/facade/affiliate.services';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly affiliateService = inject(AffiliateServices);

  /**
   * =========================================================
   * STATE
   * =========================================================
   */

  readonly dashboard = signal<AffiliateDashboardResponse | null>(null);

  readonly loading = signal(true);

  readonly error = signal<string | null>(null);

  /**
   * =========================================================
   * INIT
   * =========================================================
   */

  ngOnInit(): void {
    this.loadDashboard();
  }

  /**
   * =========================================================
   * DASHBOARD
   * =========================================================
   */

  loadDashboard(): void {
    this.loading.set(true);
    this.error.set(null);

    this.affiliateService.fetchDashboard().subscribe({
      next: (response) => {
        this.dashboard.set(response);
        this.loading.set(false);
      },

      error: (error) => {
        console.error('Erro ao carregar dashboard do afiliado:', error);

        this.error.set(error?.error?.detail ?? 'Não foi possível carregar os dados do dashboard.');

        this.loading.set(false);
      },
    });
  }

  /**
   * =========================================================
   * FORMATTERS
   * =========================================================
   */

  formatPrice(cents: number | null | undefined): string {
    if (cents === null || cents === undefined) {
      return 'R$ 0,00';
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  }
}
