import { Component, inject, signal } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { NgIcon } from '@ng-icons/core';

import { Loader } from '../../../../../../shared/components/loader/loader';
import { Surface } from '../../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../../components/surface-title/surface-title';

import { AdminService } from '../../../services/facade/admin.service';
import { Affiliate } from '../../../types/affiliate-model';

@Component({
  selector: 'app-partner-details',

  imports: [Loader, NgIcon, Surface, SurfaceTitle],

  templateUrl: './partner-details.html',
  styleUrl: './partner-details.css',
})
export class PartnerDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly adminService = inject(AdminService);

  // ============================================================
  // STATE
  // ============================================================

  readonly isLoading = signal(true);

  readonly affiliate = signal<Affiliate | null>(null);

  readonly error = signal(false);

  readonly copiedPix = signal(false);

  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    console.log('🔎 ID do parceiro:', id);

    if (!id) {
      this.isLoading.set(false);
      this.error.set(true);
      return;
    }

    const affiliateId = Number(id);

    if (Number.isNaN(affiliateId)) {
      this.isLoading.set(false);
      this.error.set(true);
      return;
    }

    this.loadAffiliate(affiliateId);
  }

  // ============================================================
  // API
  // ============================================================

  private loadAffiliate(id: number): void {
    this.isLoading.set(true);
    this.error.set(false);

    console.log('📡 Buscando afiliado:', id);

    this.adminService.fetchAffiliateId(id).subscribe({
      next: (affiliate) => {
        console.log('✅ Afiliado recebido:', affiliate);

        this.affiliate.set(affiliate);
      },

      error: (error) => {
        console.error('❌ Erro ao buscar afiliado:', error);

        this.affiliate.set(null);
        this.error.set(true);
        this.isLoading.set(false);
      },

      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  // ============================================================
  // NAVIGATION
  // ============================================================

  goBack(): void {
    this.router.navigate(['/admin/partners']);
  }

  // ============================================================
  // HELPERS
  // ============================================================

  getInitials(name: string | null | undefined): string {
    if (!name) {
      return 'A';
    }

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  getAccountStatus(): string {
    return this.affiliate()?.is_active ? 'Ativo' : 'Inativo';
  }

  getAffiliateStatus(): string {
    return this.affiliate()?.affiliate_active ? 'Ativo' : 'Inativo';
  }

  getPlanName(): string {
    const plan = this.affiliate()?.active_plan;

    if (!plan) {
      return 'Nenhum plano';
    }

    if (typeof plan === 'string') {
      return plan;
    }

    if (typeof plan === 'object' && plan !== null && 'name' in plan) {
      return String(plan.name);
    }

    return 'Plano ativo';
  }

  formatPixType(type: string | null | undefined): string {
    const labels: Record<string, string> = {
      email: 'E-mail',

      cpf: 'CPF',

      cnpj: 'CNPJ',

      phone: 'Telefone',

      random: 'Chave aleatória',
    };

    return labels[type ?? ''] ?? 'Não informado';
  }

  formatCents(cents: number | null | undefined): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format((cents ?? 0) / 100);
  }

  formatDate(value: string | null | undefined): string {
    if (!value) {
      return 'Não informado';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return 'Não informado';
    }

    return new Intl.DateTimeFormat('pt-BR').format(date);
  }

  copyPix(): void {
    const key = this.affiliate()?.pix_key;

    if (!key) {
      return;
    }

    navigator.clipboard
      .writeText(key)
      .then(() => {
        this.copiedPix.set(true);

        setTimeout(() => {
          this.copiedPix.set(false);
        }, 1500);
      })
      .catch((error) => {
        console.error('❌ Erro ao copiar PIX:', error);
      });
  }
}
