import { Component, computed, inject, signal } from '@angular/core';
import { Loader } from '../../../../../shared/components/loader/loader';
import { AffiliateServices } from '../../services/facade/affiliate.services';
import { PaginationConfig, Pagination } from '../../../../../shared/components/pagination/pagination';
import { PaginatedResponse } from '../../../../../shared/types/pagionation';
import { Coupon } from '../../types/coupons';
import { DashboardTitle } from "../../../components/dashboard-title/dashboard-title";
import { Surface } from "../../../../../shared/components/surface/surface";
import { UiButton } from "../../../../../shared/ui/button/button";
import { LocalDatePipe } from "../../../../../shared/pipes/local-date.pipe.ts-pipe";

@Component({
  selector: 'app-coupons',
  imports: [Loader, DashboardTitle, Surface, UiButton, Pagination, LocalDatePipe],
  templateUrl: './coupons.html',
  styleUrl: './coupons.css',
})
export class Coupons {
  private readonly affiliateServices = inject(AffiliateServices);

  pageSizeOptions = [5, 10, 20];
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

  coupons = signal<PaginatedResponse<Coupon>>({
    count: 0,
    next: null,
    previous: null,
    total_pages: 0,
    results: [],
  });

  constructor() {
    this.loadSales();
  }

  private loadSales() {
    const params = {
      page: this.currentPage(),
      page_size: this.pageSize(),
    };

    this.affiliateServices.fetchCoupons(params).subscribe({
      next: (data) => {
        this.coupons.set(data);
        this.totalPages.set(data.total_pages);
        this.totalCount.set(data.count);
        this.hasNext.set(!!data.next);
        this.hasPrevious.set(!!data.previous);
      },
      error: console.error,
      complete: () => this.isInitialLoading.set(false),
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

  formatPrice(price: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }
}
