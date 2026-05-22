import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../../environments/environments';
import { Plan, PlansResponse } from '../../../../../../../shared/types/plan-model';
import { ProductResponse } from '../../../../../../../shared/types/product-model';
import {
  CouponValidateResponse,
  Shipping,
  ShippingCalculationResponse,
  ShippingItem,
  ShippingOrder,
} from '../../../../../../../shared/types/shipping';
import { Order } from '../../../../../../../shared/types/order';

@Injectable({
  providedIn: 'root',
})
export class PaymentApi {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  fetchPlans(): Observable<PlansResponse> {
    return this.http.get<PlansResponse>(`${this.baseUrl}/payments/plans/`);
  }

  fetchProducts() {
    return this.http.get<ProductResponse>(`${this.baseUrl}/payments/products/`, {
      params: { grouped: 'true' },
    });
  }

  shipping(items: Shipping) {
    return this.http.post<ShippingCalculationResponse>(
      `${this.baseUrl}/payments/orders/preview/`,
      items,
    );
  }
  isValidCoupon(coupon_code: string, items: ShippingItem[]) {
    return this.http.post<CouponValidateResponse>(
      `${this.baseUrl}/payments/orders/coupon/validate/`,
      { coupon_code, items },
    );
  }
  createOrder(ordersData: ShippingOrder) {
    return this.http.post<Order>(`${this.baseUrl}/payments/orders/`, ordersData);
  }

  previewOrder(ordersData: ShippingOrder) {
    return this.http.post<ShippingCalculationResponse>(
      `${this.baseUrl}/payments/orders/preview/`,
      ordersData,
    );
  }
}
