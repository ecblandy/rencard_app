import { Component, computed, effect, inject, signal } from '@angular/core';

import { Router } from '@angular/router';

import { DashboardTitle } from '../../../components/dashboard-title/dashboard-title';

import { UiButton } from '../../../../../shared/ui/button/button';

import { UiInput } from '../../../../../shared/ui/input/input';

import { NgIcon } from '@ng-icons/core';

import { Surface } from '../../../../../shared/components/surface/surface';

import {
  Pagination,
  PaginationConfig,
} from '../../../../../shared/components/pagination/pagination';

import { Loader } from '../../../../../shared/components/loader/loader';

import { debounce, form, FormField } from '@angular/forms/signals';

import { AdminService } from '../../services/facade/admin.service';

import { Affiliate } from '../../types/affiliate-model';

import { CreatePartner } from '../../components/create-partner/create-partner';

interface FilterAffiliate {
  q: string;
}

@Component({
  selector: 'app-partners',

  imports: [
    DashboardTitle,
    UiButton,
    NgIcon,
    UiInput,
    Surface,
    FormField,
    Pagination,
    Loader,
    CreatePartner,
  ],

  templateUrl: './partners.html',

  styleUrl: './partners.css',
})
export class Partners {
  // ============================================================
  // DEPENDENCIES
  // ============================================================

  private readonly adminService = inject(AdminService);

  private readonly router = inject(Router);

  // ============================================================
  // LISTA
  // ============================================================

  userAffiliate = signal<Affiliate[]>([]);

  isLoadingAffiliates = signal(false);

  isInitialLoading = signal(true);

  // ============================================================
  // PAGINAÇÃO
  // ============================================================

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

  // ============================================================
  // FILTROS
  // ============================================================

  private readonly filtersModel = signal<FilterAffiliate>({
    q: '',
  });

  searchForm = form(
    this.filtersModel,

    (schemaPath) => {
      debounce(schemaPath.q, 300);
    },
  );

  // ============================================================
  // MODAL
  // ============================================================

  modalOpen = signal(false);

  // ============================================================
  // RESUMO
  // ============================================================

  activeAffiliatesCount = computed(() => {
    return this.userAffiliate().filter((affiliate) => this.isAccountActive(affiliate)).length;
  });

  confirmedSalesCount = computed(() => {
    return this.userAffiliate().reduce(
      (total, affiliate) => total + (affiliate.confirmed_sales_count ?? 0),

      0,
    );
  });

  /**
   * Retorna o total de comissão disponível
   * em CENTAVOS.
   *
   * O backend envia os valores em centavos.
   */
  availableCommissionCents = computed(() => {
    return this.userAffiliate().reduce(
      (total, affiliate) => total + (affiliate.available_commission_cents ?? 0),

      0,
    );
  });

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor() {
    effect(() => {
      /*
       * O effect acompanha:
       *
       * - busca
       * - página
       * - tamanho da página
       */

      this.searchForm.q().value();

      this.currentPage();

      this.pageSize();

      this.loadAffiliates();
    });
  }

  // ============================================================
  // BUSCAR AFILIADOS
  // ============================================================

  private loadAffiliates(): void {
    const params = {
      q: this.searchForm.q().value().trim(),

      page: this.currentPage(),

      page_size: this.pageSize(),
    };

    console.log('🔎 Buscando afiliados:', params);

    this.isLoadingAffiliates.set(true);

    this.adminService.fetchAffiliates(params).subscribe({
      next: (data) => {
        console.log('✅ Afiliados recebidos:', data);

        /*
         * A API já retorna a lista
         * paginada e filtrada pelo q.
         */
        this.userAffiliate.set(data.results);

        this.totalPages.set(data.total_pages);

        this.totalCount.set(data.count);

        this.hasNext.set(!!data.next);

        this.hasPrevious.set(!!data.previous);
      },

      error: (error) => {
        console.error('❌ Erro ao buscar afiliados:', error);

        this.userAffiliate.set([]);

        this.totalPages.set(1);

        this.totalCount.set(0);

        this.hasNext.set(false);

        this.hasPrevious.set(false);

        this.isInitialLoading.set(false);

        this.isLoadingAffiliates.set(false);
      },

      complete: () => {
        this.isInitialLoading.set(false);

        this.isLoadingAffiliates.set(false);
      },
    });
  }

  // ============================================================
  // STATUS
  // ============================================================

  isAccountActive(affiliate: Affiliate): boolean {
    const status = affiliate.is_active;

    if (typeof status === 'boolean') {
      return status;
    }

    return String(status).toLowerCase() === 'ativo';
  }

  getAccountStatus(affiliate: Affiliate): string {
    return this.isAccountActive(affiliate) ? 'Ativo' : 'Inativo';
  }

  // ============================================================
  // AVATAR
  // ============================================================

  getInitials(name: string): string {
    if (!name) {
      return '?';
    }

    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // ============================================================
  // MOEDA
  // ============================================================

  formatCurrency(cents: number | null | undefined): string {
    const value = (cents ?? 0) / 100;

    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  // ============================================================
  // PAGINAÇÃO
  // ============================================================

  onPageChange(page: number): void {
    console.log('📄 Mudando página:', page);

    this.currentPage.set(page);
  }

  onPageSizeChange(size: number): void {
    console.log('📏 Mudando tamanho:', size);

    this.pageSize.set(size);

    this.currentPage.set(1);
  }

  // ============================================================
  // NAVEGAÇÃO
  // ============================================================

  viewPhysicalDetails(affiliateId: number | string): void {
    this.router.navigate(['/admin/partners', affiliateId]);
  }

  // ============================================================
  // MODAL
  // ============================================================

  open(): void {
    this.modalOpen.set(true);
  }

  close(): void {
    this.modalOpen.set(false);
  }

  // ============================================================
  // APÓS CADASTRO
  // ============================================================

  onAffiliateCreated(): void {
    console.log('✅ Novo parceiro cadastrado');

    /*
     * Fecha o modal.
     */
    this.modalOpen.set(false);

    /*
     * Volta para a primeira página.
     */
    this.currentPage.set(1);

    /*
     * Atualiza a lista imediatamente.
     *
     * Isso é necessário mesmo quando
     * currentPage já é 1.
     */
    this.loadAffiliates();
  }
}
