import { Component, computed, effect, inject, signal } from '@angular/core';
import { DashboardTitle } from '../../../components/dashboard-title/dashboard-title';
import { AdminService } from '../../services/facade/admin.service';
import { User } from '../../../../../shared/types/user.model';
import { UserAndSubscriptionCard } from '../../components/user-and-subscription-card/user-and-subscription-card';
import { UiInput } from '../../../../../shared/ui/input/input';
import { debounce, form, FormField } from '@angular/forms/signals';
import { MetricCard } from '../../types/subscription-summary';
import { Surface } from '../../../../../shared/components/surface/surface';
import { NgIcon } from '@ng-icons/core';
import { NgClass } from '@angular/common';
import { PaginatedResponse } from '../../../../../shared/types/pagionation';
import {
  PaginationConfig,
  Pagination,
} from '../../../../../shared/components/pagination/pagination';
import { Loader } from '../../../../../shared/components/loader/loader';
import { FiltersUsersModel } from '../../types/user-filter';

@Component({
  selector: 'app-users-and-subscription',
  imports: [
    DashboardTitle,
    UserAndSubscriptionCard,
    UiInput,
    FormField,
    Surface,
    NgIcon,
    NgClass,
    Pagination,
    Loader,
  ],
  templateUrl: './users-and-subscription.html',
  styleUrl: './users-and-subscription.css',
})
export class UsersAndSubscription {
  private readonly adminService = inject(AdminService);

  pageSizeOptions = [5, 10, 20];
  isLoadingUser = signal(false);
  isInitialLoading = signal(true);

  metrics = signal<MetricCard[]>([
    {
      key: 'active',
      label: 'Assinaturas ativas',
      icon: 'monoClipboardCheck',
      value: 0,
    },
    {
      key: 'trial',
      label: 'Teste grátis',
      icon: 'remixFeedbackLine',
      value: 0,
    },
    {
      key: 'suspended',
      label: 'Suspensas',
      icon: 'monoPause',
      value: 0,
    },
    {
      key: 'canceled',
      label: 'Canceladas',
      icon: 'lucideXCircle',
      value: 0,
    },
  ]);

  users = signal<User[]>([]);

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

  private filtersSignal = signal<FiltersUsersModel>({
    q: '',
    plan_type: '',
    status: '',
  });

  filterForm = form(this.filtersSignal, (schema) => {
    debounce(schema.q, 300);
  });

  constructor() {
    // Effect só para o campo de busca (com debounce)
    effect(() => {
      // Chama o campo como função para obter o FieldState, depois acessa value()
      const searchValue = this.filterForm.q().value();
      const page = this.currentPage();
      const page_size = this.pageSize();

      console.log('🔄 Effect de busca disparado:', { searchValue, page, page_size });

      this.loadUsers();
    });
  }

  ngOnInit() {
    this.adminService.fetchSubscriptionSummary().subscribe({
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

  private loadUsers() {
    const params = {
      q: this.filterForm.q().value(),
      plan_type: this.filterForm.plan_type().value(),
      status: this.filterForm.status().value(),
      page: this.currentPage(),
      page_size: this.pageSize(),
    };

    console.log('📡 Fazendo requisição:', params);
    this.isLoadingUser.set(true);
    this.adminService.fetchUsers(params).subscribe({
      next: (data: PaginatedResponse<User>) => {
        console.log('✅ Dados recebidos:', data);

        this.users.set(data.results);
        this.totalPages.set(data.total_pages);
        this.totalCount.set(data.count);
        this.hasNext.set(!!data.next);
        this.hasPrevious.set(!!data.previous);
      },
      error: (error) => {
        console.error('❌ Erro ao buscar usuários:', error);
      },
      complete: () => {
        this.isLoadingUser.set(false);
        this.isInitialLoading.set(false);
      },
    });
  }

  onFilterChange() {
    console.log('🔄 Select mudou');
    this.currentPage.set(1);
    this.loadUsers();
  }

  onPageChange(page: number) {
    console.log('📄 Mudando para página:', page);
    this.currentPage.set(page);
    this.loadUsers();
  }

  onPageSizeChange(size: number) {
    console.log('📏 Mudando pageSize para:', size);
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadUsers();
  }
}
