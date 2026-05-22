import { Component, computed, effect, inject, signal } from '@angular/core';
import { DashboardTitle } from '../../../components/dashboard-title/dashboard-title';
import { UiButton } from '../../../../../shared/ui/button/button';
import { NgIcon } from '@ng-icons/core';
import { UiInput } from '../../../../../shared/ui/input/input';
import { AdminService } from '../../services/facade/admin.service';
import { debounce, form, FormField } from '@angular/forms/signals';
import { Surface } from '../../../../../shared/components/surface/surface';
import {
  PaginationConfig,
  Pagination,
} from '../../../../../shared/components/pagination/pagination';
import { Router } from '@angular/router';
import { Affiliate } from '../../types/affiliate-model';
import { Loader } from '../../../../../shared/components/loader/loader';

interface FilterAffiliate {
  q: string;
}

@Component({
  selector: 'app-partners',
  imports: [DashboardTitle, UiButton, NgIcon, UiInput, Surface, FormField, Pagination, Loader],
  templateUrl: './partners.html',
  styleUrl: './partners.css',
})
export class Partners {
  private readonly adminServices = inject(AdminService);
  private router = inject(Router);

  userAffiliate = signal<Affiliate[]>([]);

  pageSizeOptions = [5, 10, 20];
  isLoadingAffiliates = signal(false);
  isInitialLoading = signal(true);

  currentPage = signal(1);
  pageSize = signal(this.pageSizeOptions[0]);
  totalPages = signal(1);
  totalCount = signal(0);
  hasNext = signal(false);
  hasPrevious = signal(false);

  paginationConfig = computed<PaginationConfig>(() => ({
    currentPage: this.currentPage(),
    pageSize: this.pageSize(),
    totalPages: this.totalPages(),
    totalCount: this.totalCount(),
    hasNext: this.hasNext(),
    hasPrevious: this.hasPrevious(),
  }));

  // O model signal deve ser criado primeiro
  private filtersModel = signal<FilterAffiliate>({
    q: '',
  });

  // Depois criar o form com o model e schema
  searchForm = form(this.filtersModel, (schemaPath) => {
    // Debounce aplicado ao campo de busca
    debounce(schemaPath.q, 300);
  });

  constructor() {
    // Effect monitora o valor do campo q no form
    effect(() => {
      // Lê o valor debounced do campo q
      const searchValue = this.searchForm.q().value();

      console.log('🔄 Effect de busca disparado:', {
        searchValue,
        page: this.currentPage(),
        page_size: this.pageSize(),
      });

      this.loadAffiliates();
    });
  }

  private loadAffiliates() {
    const params = {
      q: this.searchForm.q().value(),
      page: this.currentPage(),
      page_size: this.pageSize(),
    };

    this.isLoadingAffiliates.set(true);

    this.adminServices.fetchAffiliates(params).subscribe({
      next: (data) => {
        console.log(data);
        this.userAffiliate.set(data.results);
        this.totalPages.set(data.total_pages);
        this.totalCount.set(data.count);
        this.hasNext.set(!!data.next);
        this.hasPrevious.set(!!data.previous);
      },
      error: (error) => {
        console.error('❌ Erro ao buscar afiliados:', error);
      },

      complete: () => {
        this.isInitialLoading.set(false);
        this.isLoadingAffiliates.set(false);
      },
    });
  }

  onFilterChange() {
    console.log('🔄 Select mudou');
    this.currentPage.set(1);
    this.loadAffiliates();
  }

  onPageChange(page: number) {
    console.log('📄 Mudando para página:', page);
    this.currentPage.set(page);
    this.loadAffiliates();
  }

  onPageSizeChange(size: number) {
    console.log('📏 Mudando pageSize para:', size);
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadAffiliates();
  }

  viewPhysicalDetails(physicalId: number | string) {
    this.router.navigate(['/admin/partners', physicalId]);
  }
}
