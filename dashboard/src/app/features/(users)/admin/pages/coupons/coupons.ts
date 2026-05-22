import { Component, computed, effect, inject, signal } from '@angular/core';
import { AdminService } from '../../services/facade/admin.service';
import { Coupon, FiltersCouponModel, ResultCouponList } from '../../types/coupons-filter';
import { DashboardTitle } from '../../../components/dashboard-title/dashboard-title';
import { UiButton } from '../../../../../shared/ui/button/button';
import { Loader } from '../../../../../shared/components/loader/loader';
import { Surface } from '../../../../../shared/components/surface/surface';
import { PaginatedResponse } from '../../../../../shared/types/pagionation';
import { debounce, form } from '@angular/forms/signals';
import { UiInput } from '../../../../../shared/ui/input/input';
import { Pagination } from '../../../../../shared/components/pagination/pagination';
import { CreateCoupon } from '../../components/create-coupon/create-coupon';
import { NgIcon } from '@ng-icons/core';
import { Router } from '@angular/router';

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
  private router = inject(Router);
  isInitialLoading = signal<boolean>(true);
  isLoadingCupons = signal<boolean>(false);
  pageSizeOptions = [5, 10, 20];

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
      const page_size = this.pageSize();

      console.log('🔄 Effect disparado:', { filters, page, page_size });

      this.loadCoupons();
    });

    effect(() => {
      console.log(this.modalOpen());
    });
  }

  private loadCoupons() {
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
      },
      complete: () => {
        this.isLoadingCupons.set(false);
        this.isInitialLoading.set(false);
      },
    });
  }

  onPageChange(page: number) {
    console.log('📄 Mudando para página:', page);
    this.currentPage.set(page);
  }

  onPageSizeChange(size: number) {
    console.log('📏 Mudando pageSize para:', size);
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  modalOpen = signal(false);

  open() {
    this.modalOpen.set(true);
  }

  close() {
    this.modalOpen.set(false);
  }

  formatDiscount(coupon: any): string {
    return this.formatValue(coupon.discount_value, coupon.discount_type);
  }

  formatCommission(coupon: any): string {
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

  viewCouponDetails(couponId: string | number) {
    this.router.navigate(['/admin/coupons', couponId]);
  }

  onCouponCreated() {
    console.log('✅ Cupom criado, recarregando lista...');
    this.currentPage.set(1); // Volta para primeira página
    this.loadCoupons(); // Recarrega a lista
  }
}
