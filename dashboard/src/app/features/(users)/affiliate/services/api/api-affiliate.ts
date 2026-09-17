import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../../../environments/environments';

import { PaginatedResponse } from '../../../../../shared/types/pagionation';
import { SaleCommission } from '../../../admin/types/affiliate-sales';
import { Coupon } from '../../types/coupons';

export interface AffiliateDashboardResponse {
  confirmed_sales_count: number;
  available_commission_cents: number;
  latest_coupon: {
    code: string;
    status: string;
    status_label: string;
    discount_type: string;
    discount_value: number;
    discount_label: string;
    total_uses: number;
    ends_at: string | null;
  } | null;
}

@Injectable({
  providedIn: 'root',
})
export class ApiAffiliate {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  /**
   * Dashboard do afiliado
   */
  dashboard() {
    return this.http.get<AffiliateDashboardResponse>(`${this.baseUrl}/users/affiliate/dashboard/`);
  }

  /**
   * Cupons do afiliado
   * Usado na aba exclusiva de cupons.
   */
  coupons(params: { page?: number; page_size?: number }) {
    let httpParams = new HttpParams();

    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }

    if (params.page_size !== undefined) {
      httpParams = httpParams.set('page_size', params.page_size.toString());
    }

    return this.http.get<PaginatedResponse<Coupon>>(`${this.baseUrl}/coupons/me/coupons/`, {
      params: httpParams,
    });
  }

  /**
   * Vendas do afiliado
   * Usado na aba exclusiva de vendas.
   */
  sales(params: { page?: number; page_size?: number }) {
    let httpParams = new HttpParams();

    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }

    if (params.page_size !== undefined) {
      httpParams = httpParams.set('page_size', params.page_size.toString());
    }

    return this.http.get<PaginatedResponse<SaleCommission>>(`${this.baseUrl}/coupons/me/sales/`, {
      params: httpParams,
    });
  }
}
