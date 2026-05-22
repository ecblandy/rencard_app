export interface SaleCommission {
  sale_type: 'order';
  sale_reference: string;
  product_names: string[];
  sale_status: 'confirmado' | 'pendente' | 'cancelado';
  sale_date: string; // ISO 8601
  total_sale_cents: number;
  commission_cents: number;
  status_description: string;
}
