export interface Coupon {
  code: string;
  status: 'Ativo' | 'Inativo' | 'Expirado';
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  discount_label: string;
  total_uses: number;
  ends_at: string;
}
