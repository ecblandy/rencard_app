import { UserRole } from './user-role';

export interface Plan {
  id: number;
  name: string;
  type: string;
}

export interface ActiveGrant {
  id: number;
  plan: Plan;
  source: string;
  start_at: string;
  end_at: string;
}

export interface PhysicalCard {
  status: string;
  type: string;
}

export interface ActivePlan {
  id: number;
  status: string;
  name: string;
  type: string;
  description?: string;
  end_at?: string;
  features?: string[];
  payment_method?: string | null;
}

export interface User extends Address {
  id: number;
  full_name: string;
  active_access_grant: ActiveGrant | null;
  active_plan: ActivePlan | null;
  email: string;
  password: string;
  role: UserRole;
  username: string;
  is_active: boolean;
  cpf_cnpj: string;
  google_analytics_id: string;
  phone_number: string;
  country: string;
  profile_image: string | null;
  terms_accepted: boolean;
  physical?: PhysicalCard;
  last_payment_date?: string;
  next_charge_date?: string;

  // 👇 Adicione os campos de PIX aqui
  pix_key?: string;
  pix_key_type?: string;
  pix_owner_name?: string;
}

export interface Address {
  street: string;
  number: number | null;
  neighborhood: string;
  cep: string;
  complement?: string;
  city: string;
  state: string;
}

export type UserRegistration = Omit<User, 'role'> & { role: UserRole };

export type SignupDraft = Partial<UserRegistration>;
