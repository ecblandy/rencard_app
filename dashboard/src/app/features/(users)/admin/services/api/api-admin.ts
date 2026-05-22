import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../../../../../shared/types/user.model';
import { SubscriptionSummary } from '../../types/subscription-summary';
import { PaginatedResponse } from '../../../../../shared/types/pagionation';
import { Coupon, CouponFilters, ResultCouponList } from '../../types/coupons-filter';
import { UserFilters } from '../../types/user-filter';
import { PhysicalSummary } from '../../types/physical-summary';
import { PhysicalCard } from '../../types/physical-card';
import { PhysicalFilters } from '../../types/physical-filter';
import { Affiliate, AffiliateFilters } from '../../types/affiliate-model';
import { DashboardFilters, DashboardModel } from '../../types/dashboard-model';

@Injectable({
  providedIn: 'root',
})
export class ApiAdmin {
  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  listUsers(params: UserFilters & { page: number; page_size: number }) {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('page_size', params.page_size.toString());

    if (params.q) {
      httpParams = httpParams.set('q', params.q);
    }
    if (params.plan_type) {
      httpParams = httpParams.set('plan_type', params.plan_type);
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }

    return this.http.get<PaginatedResponse<User>>(`${this.baseUrl}/users/clients/`, {
      params: httpParams,
    });
  }

  dashboardDetails(params: DashboardFilters) {
    let httpParams = new HttpParams().set('period', params.period);

    if (params.period) {
      httpParams = httpParams.set('period', params.period);
    }

    return this.http.get<DashboardModel>(`${this.baseUrl}/users/admin/dashboard/`, {
      params: httpParams,
    });
  }

  subscriptionSummary() {
    return this.http.get<SubscriptionSummary>(`${this.baseUrl}/users/clients/summary/`);
  }

  listCoupons(params: CouponFilters & { page: number; page_size: number }) {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('page_size', params.page_size.toString());

    if (params.q) {
      httpParams = httpParams.set('q', params.q);
    }
    return this.http.get<ResultCouponList>(`${this.baseUrl}/coupons/admin/coupons/`, {
      params: httpParams,
    });
  }

  createCoupon(coupon: Partial<Coupon>) {
    return this.http.post<Partial<Coupon>>(`${this.baseUrl}/coupons/admin/coupons/`, coupon);
  }

  couponId(couponId: string | number) {
    return this.http.get<Coupon>(`${this.baseUrl}/coupons/admin/coupons/${couponId}/`);
  }

  updateCoupon(coupon: Partial<Coupon>) {
    const id = coupon.id;
    return this.http.patch<Partial<Coupon>>(`${this.baseUrl}/coupons/admin/coupons/${id}/`, coupon);
  }

  listAffiliatesWithParams(params: AffiliateFilters & { page: number; page_size: number }) {
    let httpParams = new HttpParams();

    if (params.q) {
      httpParams = httpParams.set('q', params.q);
    }

    if (params.page && params.page_size) {
      httpParams = httpParams.set('page', params.page);
      httpParams = httpParams.set('page_size', params.page_size);
    }

    return this.http.get<PaginatedResponse<Affiliate>>(`${this.baseUrl}/users/affiliates/`, {
      params: httpParams,
    });
  }

  listAllAffiliates() {
    return this.http.get<Affiliate[]>(`${this.baseUrl}/users/affiliates/`);
  }

  affiliateId(id: number) {
    return this.http.get(`${this.baseUrl}/users/affiliates/${id}/`);
  }

  physicalSummary() {
    return this.http.get<PhysicalSummary>(`${this.baseUrl}/physical/admin/cards/summary/`);
  }

  physicalCards(params: PhysicalFilters & { page: number; page_size: number }) {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('page_size', params.page_size.toString());

    if (params.q) {
      httpParams = httpParams.set('q', params.q);
    }

    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }

    return this.http.get<PaginatedResponse<PhysicalCard>>(`${this.baseUrl}/physical/admin/cards/`, {
      params: httpParams,
    });
  }

  physicalId(physicalId: string) {
    return this.http.get<PhysicalCard>(`${this.baseUrl}/physical/admin/cards/${physicalId}/`);
  }

  updatePhysicalCards(payload: Partial<PhysicalCard>) {
    const normalyzed = {
      status: payload.status,
      shipping_code: payload.shipping_code,
    };
    return this.http.patch(`${this.baseUrl}/physical/admin/cards/${payload.id}/`, normalyzed);
  }
}
