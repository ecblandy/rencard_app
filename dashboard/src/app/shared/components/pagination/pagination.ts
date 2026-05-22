import { Component, input, output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Surface } from '../surface/surface';

export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

@Component({
  selector: 'app-pagination',
  imports: [NgIcon, Surface],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  // Inputs
  config = input.required<PaginationConfig>();
  pageSizeOptions = input<number[]>([20, 50, 100]);

  // Outputs
  pageChange = output<number>();
  pageSizeChange = output<number>();

  // Methods
  goToPage(page: number) {
    const cfg = this.config();
    if (page >= 1 && page <= cfg.totalPages) {
      this.pageChange.emit(page);
    }
  }

  nextPage() {
    if (this.config().hasNext) {
      this.pageChange.emit(this.config().currentPage + 1);
    }
  }

  previousPage() {
    if (this.config().hasPrevious) {
      this.pageChange.emit(this.config().currentPage - 1);
    }
  }

  changePageSize(size: number) {
    this.pageSizeChange.emit(size);
  }

  getPageNumbers(): (number | string)[] {
    const { currentPage, totalPages } = this.config();
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  }

  getDisplayRange(): { start: number; end: number } {
    const { currentPage, pageSize, totalCount } = this.config();
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalCount);
    return { start, end };
  }
}
