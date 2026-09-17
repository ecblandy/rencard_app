import { inject, Injectable } from '@angular/core';

import { ApiAffiliate } from '../api/api-affiliate';

@Injectable({
  providedIn: 'root',
})
export class AffiliateServices {
  private readonly api = inject(ApiAffiliate);

  /**
   * Dashboard
   */
  fetchDashboard() {
    return this.api.dashboard();
  }

  /**
   * Cupons
   */
  fetchCoupons(params: { page: number; page_size: number }) {
    return this.api.coupons(params);
  }

  /**
   * Vendas
   */
  fetchSales(params: { page: number; page_size: number }) {
    return this.api.sales(params);
  }
}
