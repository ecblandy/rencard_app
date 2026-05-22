export interface CardHistory {
  id: number;
  description: string;
  created_at: string;
}

export interface PhysicalCard {
  id: string;
  qr_token: string;
  qr_image: string;
  sku: string;
  status: string;
  shipping_code: string;
  shipping_address: string;
  delivery_preview_date: string | null;
  user: number;
  order: number;
  product: number;
  user_name: string;
  user_email: string;
  profile_image: string;
  order_code: string;
  card_type: string;
  plan_name: string;
  order_date: string;
  history: CardHistory[];
  created_at: string;
  updated_at: string;
}
