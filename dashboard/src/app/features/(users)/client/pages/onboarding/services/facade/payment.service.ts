import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { PaymentApi } from '../api/payment.api';
import { Shipping, ShippingItem, ShippingOrder } from '../../../../../../../shared/types/shipping';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private readonly api: PaymentApi) {}

  fetchPlans() {
    return this.api.fetchPlans().pipe(tap((info) => console.log(info)));
  }

  fetchProducts() {
    return this.api.fetchProducts().pipe(tap((info) => console.log('Produtos:', info)));
  }

  searchShipping(items: Shipping) {
    return this.api.shipping(items).pipe(tap((info) => console.log('Shipping info:', info)));
  }

  validateCoupon(coupon_code: string, items: ShippingItem[]) {
    return this.api
      .isValidCoupon(coupon_code, items)
      .pipe(tap((isValid) => console.log('Coupon valid:', isValid)));
  }

  createOrder(orderData: ShippingOrder) {
    return this.api
      .createOrder(orderData)
      .pipe(tap(() => console.log('Order created with data:', orderData)));
  }

  previewOrder(orderData: ShippingOrder) {
    return this.api
      .previewOrder(orderData)
      .pipe(tap((response) => console.log('Order preview response:', response)));
  }
}
