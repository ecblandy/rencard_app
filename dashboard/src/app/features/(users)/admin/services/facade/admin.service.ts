import { inject, Injectable } from '@angular/core';

import { tap } from 'rxjs';

import { ApiAdmin } from '../api/api-admin';

import { UserFilters } from '../../types/user-filter';

import {
  CouponCreatePayload,
  CouponFilters,
  CouponUpdatePayload,
} from '../../types/coupons-filter';

import { AffiliateCreatePayload, AffiliateFilters } from '../../types/affiliate-model';

import { PhysicalFilters } from '../../types/physical-filter';

import { PhysicalCard } from '../../types/physical-card';

import { DashboardFilters } from '../../types/dashboard-model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly api = inject(ApiAdmin);

  // ============================================================
  // CLIENTES
  // ============================================================

  fetchUsers(
    params: UserFilters & {
      page: number;
      page_size: number;
    },
  ) {
    return this.api.listUsers(params).pipe(
      tap((response) => {
        console.log('👤 Clientes:', response);
      }),
    );
  }

  // ============================================================
  // RESUMO
  // ============================================================

  fetchSubscriptionSummary() {
    return this.api.subscriptionSummary().pipe(
      tap((response) => {
        console.log('📊 Resumo:', response);
      }),
    );
  }

  // ============================================================
  // DASHBOARD
  // ============================================================

  fetchDashboardDetails(params: DashboardFilters) {
    return this.api.dashboardDetails(params).pipe(
      tap((response) => {
        console.log('📊 Dashboard:', response);
      }),
    );
  }

  // ============================================================
  // CUPONS
  // ============================================================

  fetchCoupons(
    params: CouponFilters & {
      page: number;
      page_size: number;
    },
  ) {
    return this.api.listCoupons(params).pipe(
      tap((response) => {
        console.log('🎟️ Cupons:', response);
      }),
    );
  }

  registerCoupon(payload: CouponCreatePayload) {
    return this.api.createCoupon(payload).pipe(
      tap((response) => {
        console.log('✅ Cupom cadastrado:', response);
      }),
    );
  }

  fetchCouponId(couponId: string | number) {
    return this.api.couponId(couponId).pipe(
      tap((response) => {
        console.log('🎟️ Cupom:', response);
      }),
    );
  }

  updateCoupon(couponId: string | number, payload: CouponUpdatePayload) {
    return this.api.updateCoupon(couponId, payload).pipe(
      tap((response) => {
        console.log('✅ Cupom atualizado:', response);
      }),
    );
  }

  deleteCoupon(couponId: string | number) {
    return this.api.deleteCoupon(couponId).pipe(
      tap(() => {
        console.log('🗑️ Cupom excluído:', couponId);
      }),
    );
  }

  // ============================================================
  // AFILIADOS
  // ============================================================

  fetchAffiliates(
    params: AffiliateFilters & {
      page: number;
      page_size: number;
    },
  ) {
    return this.api.listAffiliatesWithParams(params).pipe(
      tap((response) => {
        console.log('🤝 Afiliados:', response);
      }),
    );
  }

  fetchAffiliateId(id: number) {
    return this.api.affiliateId(id).pipe(
      tap((response) => {
        console.log('🤝 Afiliado:', response);
      }),
    );
  }

  registerAffiliate(payload: AffiliateCreatePayload) {
    return this.api.createAffiliate(payload).pipe(
      tap((response) => {
        console.log('✅ Afiliado cadastrado:', response);
      }),
    );
  }

  // ============================================================
  // FÍSICO
  // ============================================================

  fetchPhysicalSummary() {
    return this.api.physicalSummary().pipe(
      tap((response) => {
        console.log('📦 Resumo físico:', response);
      }),
    );
  }

  fetchPhysicalCards(
    params: PhysicalFilters & {
      page: number;
      page_size: number;
    },
  ) {
    return this.api.physicalCards(params).pipe(
      tap((response) => {
        console.log('💳 Cartões físicos:', response);
      }),
    );
  }

  fetchPhysicalCardId(physicalId: string) {
    return this.api.physicalId(physicalId).pipe(
      tap((response) => {
        console.log('💳 Cartão físico:', response);
      }),
    );
  }

  updatePhysycalCards(payload: Pick<Partial<PhysicalCard>, 'id' | 'status' | 'shipping_code'>) {
    return this.api.updatePhysicalCards(payload).pipe(
      tap((response) => {
        console.log('✅ Dados do cartão atualizados:', response);
      }),
    );
  }

  // ============================================================
  // SCANS
  // ============================================================

  fetchScans(params: { page: number; page_size: number }) {
    return this.api.listScans(params).pipe(
      tap((response) => {
        console.log('📱 Scans:', response);
      }),
    );
  }

  // ============================================================
  // ASSIGNMENTS
  // ============================================================

  fetchAssignments(params: { page: number; page_size: number }) {
    return this.api.listAssignments(params).pipe(
      tap((response) => {
        console.log('🔗 Assignments:', response);
      }),
    );
  }
}
