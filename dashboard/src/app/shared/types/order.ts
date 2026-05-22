import { CouponDiscount } from './shipping';

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  unit_price_cents: number;
}

export interface OrderPlan {
  id: number;
  name: string;
  description: string;
  features: string[];
  price_cents: number;
  type: string;
  active: boolean;
}

export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'refunded';

export interface Order {
  id: number;
  code: string;
  status: OrderStatus;
  created_at: string; // ISO 8601

  // Financeiro
  subtotal_cents: number;
  discount_cents: number;
  shipping_cents: number;
  total_cents: number;
  coupon_code: string | null;
  coupon_discount: CouponDiscount | null;

  // Frete
  postal_code: string;
  shipping_service_code: string;
  shipping_service_name: string;
  shipping_deadline_days: number;
  shipping_deadline_date: string; // ISO 8601

  // Asaas
  asaas_payment_id: string;
  asaas_checkout_id: string;
  asaas_invoice_url: string;
  checkout_url: string;

  // Relacionamentos
  items: OrderItem[];
  plan: OrderPlan;
  logo_image: string | null;
}
