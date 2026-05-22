import { PaginationParams } from '../../../../shared/types/pagionation';

export interface FiltersPhysiicalModel {
  q: string;
  status: string;
}

export type PhysicalFilters = FiltersPhysiicalModel & PaginationParams;
