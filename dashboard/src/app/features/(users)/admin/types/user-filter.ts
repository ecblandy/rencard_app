import { PaginationParams } from '../../../../shared/types/pagionation';

export interface FiltersUsersModel {
  q: string;
  plan_type: string;
  status: string;
}

export type UserFilters = FiltersUsersModel & PaginationParams;
