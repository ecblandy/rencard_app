import { PaginationParams } from '../../../../shared/types/pagionation';

interface AffiliatePayment {
  available_commission_cents: 0;
  pix_key: '';
  pix_key_type: '';
  pix_owner_name: '';
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percent' | 'amount';
  discount_value: number;
  applicable_to: 'subscription' | 'product';
  status: 'active' | 'inactive' | 'expired';
  status_label: '';
  starts_at: string;
  ends_at: string;
  total_uses: number;
  commission_percent: number;
  affiliate: string;
  affiliate_name: string;
  affiliate_email: string;
  affiliate_payment: AffiliatePayment;
  total_commission_cents: number;
  total_revenue_cents: number;
  created_at: string;
  updated_at: string;
}
export interface ResultCouponList {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  results: Coupon[];
}

export interface FiltersCouponModel {
  q: string;
}

export type CouponFilters = FiltersCouponModel & PaginationParams;
