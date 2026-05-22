import { inject, Injectable } from '@angular/core';
import { ApiAffiliate } from '../api/api-affiliate';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AffiliateServices {
  private readonly api = inject(ApiAffiliate);

  fetchSales(params: { page: number; page_size: number }) {
    return this.api.sales(params).pipe(tap((info) => console.log(info)));
  }

  fetchCoupons(params: { page: number; page_size: number }) {
    return this.api.coupons(params).pipe(tap((info) => console.log(info)));
  }
}
