import { inject, Injectable } from '@angular/core';
import { ApiAdmin } from '../api/api-admin';
import { tap } from 'rxjs';
import { UserFilters } from '../../types/user-filter';
import { Coupon, CouponFilters } from '../../types/coupons-filter';
import { PhysicalFilters } from '../../types/physical-filter';
import { AffiliateFilters } from '../../types/affiliate-model';
import { PhysicalCard } from '../../types/physical-card';
import { DashboardFilters } from '../../types/dashboard-model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly api = inject(ApiAdmin);

  fetchUsers(params: UserFilters & { page: number; page_size: number }) {
    return this.api.listUsers(params).pipe(tap((response) => console.log(response)));
  }

  fetchDashboardDetails(params: DashboardFilters) {
    return this.api.dashboardDetails(params).pipe(tap((response) => console.log(response)));
  }

  fetchSubscriptionSummary() {
    return this.api.subscriptionSummary();
  }

  fetchCoupons(params: CouponFilters & { page: number; page_size: number }) {
    return this.api.listCoupons(params).pipe(tap((info) => console.log(info)));
  }

  registerCoupon(coupon: Partial<Coupon>) {
    return this.api.createCoupon(coupon).pipe(tap((info) => console.log(info)));
  }

  fetchCouponId(couponId: string | number) {
    return this.api.couponId(couponId).pipe(tap((coupon) => console.log(coupon)));
  }

  updateCoupon(coupon: Partial<Coupon>) {
    return this.api.updateCoupon(coupon).pipe(tap((info) => console.log(info)));
  }

  fetchAffiliates(params: AffiliateFilters & { page: number; page_size: number }) {
    return this.api
      .listAffiliatesWithParams(params)
      .pipe(tap((affiliates) => console.log(affiliates)));
  }

  fetchAllAffiliates() {
    return this.api.listAllAffiliates().pipe(tap((affiliates) => console.log(affiliates)));
  }

  fetchAffiliateId(id: number) {
    return this.api.affiliateId(id).pipe(tap((info) => console.log(info)));
  }

  fetchPhysicalSummary() {
    return this.api.physicalSummary().pipe(tap((info) => console.log(info)));
  }

  fetchPhysicalCards(params: PhysicalFilters & { page: number; page_size: number }) {
    return this.api.physicalCards(params).pipe(tap((info) => console.log(info)));
  }

  updatePhysycalCards(payload: Partial<PhysicalCard>) {
    return this.api
      .updatePhysicalCards(payload)
      .pipe(tap((info) => console.log('Dados atualizados', info)));
  }

  fetchPhysicalCardId(physicalId: string) {
    return this.api.physicalId(physicalId).pipe(tap((info) => console.log(info)));
  }
}
