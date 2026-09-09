import { inject, Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../../../environments/environments';

import { User } from '../../../../../shared/types/user.model';

import { PaginatedResponse } from '../../../../../shared/types/pagionation';

import { SubscriptionSummary } from '../../types/subscription-summary';

import {
  Coupon,
  CouponCreatePayload,
  CouponFilters,
  CouponUpdatePayload,
  ResultCouponList,
} from '../../types/coupons-filter';

import { UserFilters } from '../../types/user-filter';

import { PhysicalSummary } from '../../types/physical-summary';

import { PhysicalCard } from '../../types/physical-card';

import { PhysicalFilters } from '../../types/physical-filter';

import {
  Affiliate,
  AffiliateCreatePayload,
  AffiliateCreateResponse,
  AffiliateFilters,
} from '../../types/affiliate-model';

import { DashboardFilters, DashboardModel } from '../../types/dashboard-model';

@Injectable({
  providedIn: 'root',
})
export class ApiAdmin {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl;

  // ============================================================
  // CLIENTES
  // ============================================================

  listUsers(
    params: UserFilters & {
      page: number;
      page_size: number;
    },
  ) {
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

  // ============================================================
  // RESUMO
  // ============================================================

  subscriptionSummary() {
    return this.http.get<SubscriptionSummary>(`${this.baseUrl}/users/clients/summary/`);
  }

  // ============================================================
  // DASHBOARD
  // ============================================================

  dashboardDetails(params: DashboardFilters) {
    const httpParams = new HttpParams().set('period', params.period);

    return this.http.get<DashboardModel>(`${this.baseUrl}/users/admin/dashboard/`, {
      params: httpParams,
    });
  }

  // ============================================================
  // CUPONS
  // ============================================================

  listCoupons(
    params: CouponFilters & {
      page: number;
      page_size: number;
    },
  ) {
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

  /**
   * GET /coupons/admin/coupons/<id>/
   */
  couponId(couponId: string | number) {
    return this.http.get<Coupon>(`${this.baseUrl}/coupons/admin/coupons/${couponId}/`);
  }

  /**
   * POST /coupons/admin/coupons/
   */
  createCoupon(payload: CouponCreatePayload) {
    return this.http.post<Coupon>(`${this.baseUrl}/coupons/admin/coupons/`, payload);
  }

  /**
   * PATCH /coupons/admin/coupons/<id>/
   */
  updateCoupon(couponId: string | number, payload: CouponUpdatePayload) {
    return this.http.patch<Coupon>(`${this.baseUrl}/coupons/admin/coupons/${couponId}/`, payload);
  }

  /**
   * DELETE /coupons/admin/coupons/<id>/
   */
  deleteCoupon(couponId: string | number) {
    return this.http.delete<void>(`${this.baseUrl}/coupons/admin/coupons/${couponId}/`);
  }

  // ============================================================
  // AFILIADOS
  // ============================================================

  listAffiliatesWithParams(
    params: AffiliateFilters & {
      page: number;
      page_size: number;
    },
  ) {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('page_size', params.page_size.toString());

    if (params.q) {
      httpParams = httpParams.set('q', params.q);
    }

    return this.http.get<PaginatedResponse<Affiliate>>(`${this.baseUrl}/users/affiliates/`, {
      params: httpParams,
    });
  }

  /**
   * GET /users/affiliates/<id>/
   */
  affiliateId(id: number) {
    return this.http.get<Affiliate>(`${this.baseUrl}/users/affiliates/${id}/`);
  }

  /**
   * POST /users/affiliates/
   */
  createAffiliate(payload: AffiliateCreatePayload) {
    return this.http.post<AffiliateCreateResponse>(`${this.baseUrl}/users/affiliates/`, payload);
  }

  // ============================================================
  // FÍSICO
  // ============================================================

  /**
   * GET /physical/admin/cards/summary/
   */
  physicalSummary() {
    return this.http.get<PhysicalSummary>(`${this.baseUrl}/physical/admin/cards/summary/`);
  }

  /**
   * GET /physical/admin/cards/
   *
   * Filtros:
   * - q
   * - status
   *
   * Paginação:
   * - page
   * - page_size
   */
  physicalCards(
    params: PhysicalFilters & {
      page: number;
      page_size: number;
    },
  ) {
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

  /**
   * GET /physical/admin/cards/<id>/
   */
  physicalId(physicalId: string) {
    return this.http.get<PhysicalCard>(`${this.baseUrl}/physical/admin/cards/${physicalId}/`);
  }

  /**
   * PATCH /physical/admin/cards/<id>/
   *
   * A API aceita atualização parcial.
   *
   * Payload documentado:
   *
   * {
   *   "status": "in_production",
   *   "shipping_code": "BR123456789"
   * }
   */
  updatePhysicalCards(payload: Pick<Partial<PhysicalCard>, 'id' | 'status' | 'shipping_code'>) {
    if (!payload.id) {
      throw new Error('ID do cartão é obrigatório para atualização.');
    }

    const normalizedPayload: {
      status?: string;
      shipping_code?: string;
    } = {};

    if (payload.status !== undefined && payload.status !== '') {
      normalizedPayload.status = payload.status;
    }

    if (payload.shipping_code !== undefined) {
      normalizedPayload.shipping_code = payload.shipping_code;
    }

    return this.http.patch<PhysicalCard>(
      `${this.baseUrl}/physical/admin/cards/${payload.id}/`,
      normalizedPayload,
    );
  }

  // ============================================================
  // SCANS
  // ============================================================

  /**
   * GET /physical/admin/scans/
   */
  listScans(params: { page: number; page_size: number }) {
    const httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('page_size', params.page_size.toString());

    return this.http.get<PaginatedResponse<unknown>>(`${this.baseUrl}/physical/admin/scans/`, {
      params: httpParams,
    });
  }

  // ============================================================
  // ASSIGNMENTS
  // ============================================================

  /**
   * GET /physical/admin/assignments/
   */
  listAssignments(params: { page: number; page_size: number }) {
    const httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('page_size', params.page_size.toString());

    return this.http.get<PaginatedResponse<unknown>>(
      `${this.baseUrl}/physical/admin/assignments/`,
      {
        params: httpParams,
      },
    );
  }
}
