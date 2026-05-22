export interface ProductModel {
  id: string | number;
  image: string | null;
  name: string;
  subtitle: string;
  description: string;
  type: string;
  plan_type: string;
  price_cents: number;
  stock: number;
  weight_kg: number | string | null;
  width_cm: number | null;
  height_cm: number | null;
  length_cm: number | null;
  is_active: boolean;
}

export interface ProductResponse {
  fisico: ProductModel[];
  adicional: ProductModel[];
  digital: ProductModel[];
}
