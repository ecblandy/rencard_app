import { PaginationParams } from '../../../../shared/types/pagionation';

export interface Affiliate {
  id: number;

  full_name: string;
  username: string;
  email: string;
  email_confirmed: boolean;

  cpf_cnpj: string;
  phone_number: string;

  profile_image: string | null;

  role: 'affiliate' | string;

  is_active: boolean;
  affiliate_active: boolean;

  active_plan: unknown | null;
  active_access_grant: unknown | null;

  onboard_password_changed: boolean;

  terms_accepted: boolean;

  street: string;
  number: string;
  neighborhood: string;
  complement: string | null;
  cep: string;
  city: string;
  state: string;
  country: string;

  link_slug: string;

  clicks_count: number;
  confirmed_sales_count: number;

  attributed_revenue_cents: number;
  available_commission_cents: number;

  physical: boolean | null;

  pix_key: string;
  pix_key_type: 'email' | 'cpf' | 'cnpj' | 'phone' | 'random';
  pix_owner_name: string;

  last_payment_date: string | null;
  next_charge_date: string | null;

  google_analytics_id: string;
}

export interface FiltersCouponModel {
  q: string;
}

export type AffiliateFilters = FiltersCouponModel & PaginationParams;

export type PixKeyType = 'email' | 'cpf' | 'cnpj' | 'phone' | 'random';

export interface AffiliateCreatePayload {
  full_name: string;
  email: string;

  terms_accepted: boolean;

  cpf_cnpj: string;
  phone_number: string;

  street: string;
  number: string;
  neighborhood: string;
  cep: string;
  complement: string;
  city: string;
  state: string;
  country: string;

  affiliate_active: boolean;

  pix_key: string;
  pix_key_type: PixKeyType;
  pix_owner_name: string;
}

export interface AffiliateCreateResponse extends Affiliate {
  temporary_password: string;
}
