import { PaginationParams } from '../../../../shared/types/pagionation';

export type CouponDiscountType = 'percent' | 'amount';

export type CouponCommissionType = 'percent' | 'amount' | 'none';

export type CouponApplicableTo = 'subscription' | 'physical' | 'card' | 'tag' | 'both';

export type CouponStatus = 'active' | 'inactive' | 'expired';

/**
 * Dados de pagamento do afiliado
 * retornados pela API.
 */
export interface AffiliatePayment {
  pix_key: string;
  pix_key_type: string;
  pix_owner_name: string;
  available_commission_cents: number;
}

/**
 * Modelo de resposta da API.
 *
 * Usado para GET/listagem/detalhamento.
 */
export interface Coupon {
  id: number;

  code: string;

  status: string;

  affiliate: number | null;
  affiliate_name: string;
  affiliate_email: string;

  affiliate_payment: AffiliatePayment | null;

  discount_type: CouponDiscountType;
  discount_value: number;

  commission_type: CouponCommissionType;
  commission_value: number;

  applicable_to: CouponApplicableTo;

  starts_at: string;
  ends_at: string;

  total_uses: number;

  total_revenue_cents: number;
  total_commission_cents: number;

  created_at: string;
  updated_at: string;
}

/**
 * POST /ren_api/coupons/admin/coupons/
 */
export interface CouponCreatePayload {
  code: string;

  status: 'active';

  affiliate: number | null;

  discount_type: CouponDiscountType;

  discount_value: number;

  commission_type: CouponCommissionType;

  commission_value: number;

  applicable_to: CouponApplicableTo;

  starts_at: string;

  ends_at: string;
}

/**
 * PATCH /ren_api/coupons/admin/coupons/<id>/
 */
export interface CouponUpdatePayload {
  code?: string;

  status?: 'active' | 'inactive';

  affiliate?: number | null;

  discount_type?: CouponDiscountType;

  discount_value?: number;

  commission_type?: CouponCommissionType;

  commission_value?: number;

  applicable_to?: CouponApplicableTo;

  starts_at?: string;

  ends_at?: string;
}

export interface ResultCouponList {
  count: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: Coupon[];
}

export interface FiltersCouponModel {
  q: string;
}

export type CouponFilters = FiltersCouponModel & PaginationParams;
