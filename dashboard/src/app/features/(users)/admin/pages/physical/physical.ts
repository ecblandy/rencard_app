import { Component, computed, effect, inject, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { NgClass } from '@angular/common';
import { AdminService } from '../../services/facade/admin.service';
import { MetricCard } from '../../types/physical-summary';
import { Surface } from '../../../../../shared/components/surface/surface';
import { DashboardTitle } from '../../../components/dashboard-title/dashboard-title';
import { debounce, form, FormField } from '@angular/forms/signals';
import { UiInput } from '../../../../../shared/ui/input/input';
import { PhysicalCard } from '../../types/physical-card';
import { Loader } from '../../../../../shared/components/loader/loader';
import { LocalDatePipe } from '../../../../../shared/pipes/local-date.pipe.ts-pipe';
import {
  Pagination,
  PaginationConfig,
} from '../../../../../shared/components/pagination/pagination';
import { PaginatedResponse } from '../../../../../shared/types/pagionation';
import { UiButton } from '../../../../../shared/ui/button/button';
import { Router } from '@angular/router';

interface FiltersPhysicalModel {
  q: string;
  status: string;
}

@Component({
  selector: 'app-physical',
  imports: [
    NgIcon,
    NgClass,
    Surface,
    DashboardTitle,
    UiInput,
    FormField,
    Loader,
    LocalDatePipe,
    Pagination,
    UiButton,
  ],
  templateUrl: './physical.html',
  styleUrl: './physical.css',
})
export class Physical {
  private readonly adminServices = inject(AdminService);
  private router = inject(Router);
  pageSizeOptions = [5, 10, 20];
  isLoadingPhysicalCard = signal(false);
  isInitialLoading = signal(true);

  metrics = signal<MetricCard[]>([
    {
      key: 'delivered',
      label: 'Entregue',
      icon: 'monoClipboardCheck',
      value: 0,
    },
    {
      key: 'shipped',
      label: 'Enviado',
      icon: 'remixFeedbackLine',
      value: 0,
    },
    {
      key: 'in_production',
      label: 'Em produção',
      icon: 'monoPause',
      value: 0,
    },
  ]);

  usersCard = signal<PhysicalCard[]>([]);

  // Signals para paginação
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

  private filtersSignal = signal<FiltersPhysicalModel>({
    q: '',
    status: '',
  });

  filtersForm = form(this.filtersSignal, (schema) => {
    debounce(schema.q, 300);
  });

  constructor() {
    // Effect só para o campo de busca (com debounce)
    effect(() => {
      const searchValue = this.filtersForm.q().value();
      const page = this.currentPage();
      const page_size = this.pageSize();

      console.log('🔄 Effect de busca disparado:', { searchValue, page, page_size });

      this.loadPhysicalCards();
    });
  }

  ngOnInit() {
    this.adminServices.fetchPhysicalSummary().subscribe({
      next: (summary) => {
        this.metrics.update((cards) =>
          cards.map((card) => ({
            ...card,
            value: summary[card.key] ?? 0,
          })),
        );
      },
      error: console.error,
    });
  }

  private loadPhysicalCards() {
    const params = {
      q: this.filtersForm.q().value(),
      status: this.filtersForm.status().value(),
      page: this.currentPage(),
      page_size: this.pageSize(),
    };

    console.log('📡 Fazendo requisição:', params);
    this.isLoadingPhysicalCard.set(true);
    this.adminServices.fetchPhysicalCards(params).subscribe({
      next: (data: PaginatedResponse<PhysicalCard>) => {
        console.log('✅ Dados recebidos:', data);

        this.usersCard.set(data.results);
        this.totalPages.set(data.total_pages);
        this.totalCount.set(data.count);
        this.hasNext.set(!!data.next);
        this.hasPrevious.set(!!data.previous);
      },
      error: (error) => {
        console.error('❌ Erro ao buscar cartões físicos:', error);
      },
      complete: () => {
        this.isLoadingPhysicalCard.set(false);
        this.isInitialLoading.set(false);
      },
    });
  }

  onFilterChange() {
    console.log('🔄 Select mudou');
    this.currentPage.set(1);
    this.loadPhysicalCards();
  }

  onPageChange(page: number) {
    console.log('📄 Mudando para página:', page);
    this.currentPage.set(page);
    this.loadPhysicalCards();
  }

  onPageSizeChange(size: number) {
    console.log('📏 Mudando pageSize para:', size);
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadPhysicalCards();
  }

  viewPhysicalDetails(physicalId: number | string) {
    this.router.navigate(['/admin/physical', physicalId]);
  }
}
