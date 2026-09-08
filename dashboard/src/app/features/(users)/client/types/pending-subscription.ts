export interface PendingSubscription {
  id: number;

  plan: number;
  plan_name: string;
  plan_price: number;

  status: 'pending' | 'active' | 'canceled' | 'failed';

  payment_link: string;
  payment_link_created_at?: string | null;

  billing_type: 'CREDIT_CARD' | 'PIX' | 'BOLETO' | 'BANK_TRANSFER' | string;

  credit_card_last4: string;
  credit_card_brand: string;

  coupon_code: string;
  coupon_discount: number | null;
  discount_cents: number;

  current_period_start: string | null;
  current_period_end: string | null;

  canceled_at: string | null;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  type: 'free' | 'pro' | 'premium';
}

export interface SubscriptionResponse {
  id: number;
  plan: SubscriptionPlan;
  status: 'ativa' | 'expirada' | 'cancelada' | 'aguardando pagamento' | 'falhou' | 'teste';

  start_at: string;
  end_at: string;

  payment_method?: string;

  created_at: string;
  updated_at: string;
}

export interface CreateSubscriptionRequest {
  plan_price: number;
  coupon_code?: string;
}

export interface PlansResponse {
  data: SubscriptionPlan[];
}

export interface PendingPaymentData {
  isPending: boolean;
  loading: boolean;

  subscription: PendingSubscription | null;

  planName: string;
  billingType?: string;

  creditCardInfo: {
    brand: string;
    last4: string;
  } | null;

  createdDate: string | null;
  expiresAt: string | null;

  remainingTime: string;

  amount: number;
  discount: number;
  finalAmount: number;

  hasDiscount: boolean;
  couponCode: string;

  paymentLink: string | null;
}

export interface CurrentPlanData {
  isPending: boolean;
  loading: boolean;
  name: string;
  description: string;
  hasNoPlan: boolean;
  type: string;
  statusLabel: string;
  statusMessage: string;
  statusBadgeClass: string;
  isFreeTrial: boolean;
  isActive: boolean;
  isExpired: boolean;
  isCancelled: boolean;
  isFailed: boolean;
  endDate: string | null;
  daysRemaining: number;
  paymentMethod: string;
  hasActivePlan: boolean;
  progressPercentage: number;
  progressColor: string;
  features: string[];
}
export interface FeaturesData {
  isPending: boolean;
  hasNoPlan: boolean;
  features: string[];
}
