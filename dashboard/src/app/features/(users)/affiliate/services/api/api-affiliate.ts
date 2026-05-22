import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatedResponse } from '../../../../../shared/types/pagionation';
import { SaleCommission } from '../../../admin/types/affiliate-sales';
import { Coupon } from '../../types/coupons';

@Injectable({
  providedIn: 'root',
})
export class ApiAffiliate {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  sales(params: { page?: number; page_size?: number }) {
    let httpParams = new HttpParams();
    if (params.page && params.page_size) {
      httpParams.set('page', params.page.toString()).set('page_size', params.page_size.toString());
    }
    return this.http.get<PaginatedResponse<SaleCommission>>(`${this.baseUrl}/coupons/me/sales/`, {
      params: httpParams,
    });
  }

  coupons(params: { page?: number; page_size?: number }) {
    let httpParams = new HttpParams();
    if (params.page && params.page_size) {
      httpParams.set('page', params.page.toString()).set('page_size', params.page_size.toString());
    }
    return this.http.get<PaginatedResponse<Coupon>>(`${this.baseUrl}/coupons/me/coupons/`, {
      params: httpParams,
    });
  }
}
