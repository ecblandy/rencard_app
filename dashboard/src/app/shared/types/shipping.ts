export interface ShippingItem {
  product: number;
  quantity: number;
}

export interface Shipping {
  postal_code: string;
  items: ShippingItem[];
}

export interface ShippingOrder {
  coupon_code?: string;
  postal_code: string;
  shipping_service_code: string;
  logo_image?: string;
  items: ShippingItem[];
}

export interface ShippingOption {
  deadline_date: string;
  deadline_days: number;
  price_cents: number;
  service_code: string;
  service_name: string;
}

export interface CouponDiscount {
  type: string;
  value: number;
}

export interface ShippingCalculationResponse {
  coupon_discount: CouponDiscount | null;
  discount_cents: number;
  postal_code: string;
  shipping_cents: number;
  shipping_deadline_date: string | null;
  shipping_deadline_days: number | null;
  shipping_options: ShippingOption[];
  shipping_required: boolean;
  shipping_service_code: string;
  shipping_service_name: string;
  subtotal_cents: number;
  total_cents: number;
}

export interface CouponValidateResponse {
  coupon_code: string;
  subtotal_cents: number;
  discount_cents: number;
  discounted_total_cents: number;
  coupon_discount: CouponDiscount;
}
