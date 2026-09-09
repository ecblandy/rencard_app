import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { debounce, form } from '@angular/forms/signals';
import { NgIcon } from '@ng-icons/core';

import { AdminService } from '../../services/facade/admin.service';

import { Coupon, FiltersCouponModel, ResultCouponList } from '../../types/coupons-filter';

import { DashboardTitle } from '../../../components/dashboard-title/dashboard-title';

import { UiButton } from '../../../../../shared/ui/button/button';
import { Loader } from '../../../../../shared/components/loader/loader';
import { Surface } from '../../../../../shared/components/surface/surface';
import { PaginatedResponse } from '../../../../../shared/types/pagionation';
import { UiInput } from '../../../../../shared/ui/input/input';
import { Pagination } from '../../../../../shared/components/pagination/pagination';
import { CreateCoupon } from '../../components/create-coupon/create-coupon';

interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

@Component({
  selector: 'app-coupons',
  imports: [DashboardTitle, UiButton, Loader, Surface, UiInput, Pagination, CreateCoupon, NgIcon],
  templateUrl: './coupons.html',
  styleUrl: './coupons.css',
})
export class Coupons {
  private readonly adminServices = inject(AdminService);
  private readonly router = inject(Router);

  isInitialLoading = signal(true);
  isLoadingCupons = signal(false);

  pageSizeOptions = [5, 10, 20];

  currentPage = signal(1);
  pageSize = signal(this.pageSizeOptions[0]);

  totalPages = signal(1);
  totalCount = signal(0);

  hasNext = signal(false);
  hasPrevious = signal(false);

  modalOpen = signal(false);

  /**
   * Incrementado sempre que precisamos forçar uma nova
   * requisição para a lista de cupons.
   *
   * Isso resolve o caso em que currentPage já é 1 e,
   * portanto, chamar currentPage.set(1) não dispara o effect.
   */
  private readonly refreshTrigger = signal(0);

  paginationConfig = computed<PaginationConfig>(() => ({
    currentPage: this.currentPage(),
    pageSize: this.pageSize(),
    totalPages: this.totalPages(),
    totalCount: this.totalCount(),
    hasNext: this.hasNext(),
    hasPrevious: this.hasPrevious(),
  }));

  filters = signal<FiltersCouponModel>({
    q: '',
  });

  coupons = signal<ResultCouponList>({
    count: 0,
    next: null,
    previous: null,
    total_pages: 0,
    results: [],
  });

  couponForm = form(this.filters, (schemaPath) => {
    debounce(schemaPath.q, 300);
  });

  constructor() {
    effect(() => {
      const filters = this.filters();
      const page = this.currentPage();
      const pageSize = this.pageSize();

      // Apenas ler o signal já faz o effect depender dele.
      const refresh = this.refreshTrigger();

      console.log('🔄 Effect disparado:', {
        filters,
        page,
        pageSize,
        refresh,
      });

      this.loadCoupons();
    });
  }

  private loadCoupons(): void {
    const params = {
      ...this.filters(),
      page: this.currentPage(),
      page_size: this.pageSize(),
    };

    console.log('📡 Fazendo requisição:', params);

    this.isLoadingCupons.set(true);

    this.adminServices.fetchCoupons(params).subscribe({
      next: (data: PaginatedResponse<Coupon>) => {
        console.log('✅ Dados recebidos:', data);

        this.coupons.set(data);

        this.totalPages.set(data.total_pages);
        this.totalCount.set(data.count);

        this.hasNext.set(!!data.next);
        this.hasPrevious.set(!!data.previous);
      },

      error: (error) => {
        console.error('❌ Erro ao buscar cupons:', error);

        this.isInitialLoading.set(false);
        this.isLoadingCupons.set(false);
      },

      complete: () => {
        this.isLoadingCupons.set(false);
        this.isInitialLoading.set(false);
      },
    });
  }

  onPageChange(page: number): void {
    console.log('📄 Mudando para página:', page);

    this.currentPage.set(page);
  }

  onPageSizeChange(size: number): void {
    console.log('📏 Mudando pageSize para:', size);

    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  open(): void {
    this.modalOpen.set(true);
  }

  close(): void {
    this.modalOpen.set(false);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'Ativo';

      case 'inactive':
        return 'Inativo';

      case 'expired':
        return 'Expirado';

      default:
        return status;
    }
  }

  formatDiscount(coupon: Coupon): string {
    return this.formatValue(coupon.discount_value, coupon.discount_type);
  }

  formatCommission(coupon: Coupon): string {
    if (coupon.commission_type === 'none') {
      return 'N/A';
    }

    return this.formatValue(coupon.commission_value, coupon.commission_type);
  }

  private formatValue(value: number, type: 'percent' | 'amount'): string {
    if (type === 'percent') {
      return `${value}%`;
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100);
  }

  viewCouponDetails(couponId: number): void {
    this.router.navigate(['/admin/coupons', couponId]);
  }

  onCouponCreated(): void {
    console.log('✅ Cupom criado, recarregando lista...');

    // Volta para a primeira página.
    this.currentPage.set(1);

    // Força a execução do effect mesmo se a página já for 1.
    this.refreshTrigger.update((value) => value + 1);

    // Fecha o modal.
    this.modalOpen.set(false);
  }
}
