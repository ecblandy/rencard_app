import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';

import { AdminService } from '../../../services/facade/admin.service';
import { Coupon } from '../../../types/coupons-filter';

import { UiButton } from '../../../../../../shared/ui/button/button';
import { NgIcon } from '@ng-icons/core';
import { Loader } from '../../../../../../shared/components/loader/loader';
import { Surface } from '../../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../../components/surface-title/surface-title';
import { LocalDatePipe } from '../../../../../../shared/pipes/local-date.pipe.ts-pipe';
import { UpdateCoupon } from '../../../components/update-coupon/update-coupon';
import { Modal } from '../../../../../../shared/ui/modal/modal';

@Component({
  selector: 'app-coupon-details',
  imports: [UiButton, NgIcon, Loader, Surface, SurfaceTitle, LocalDatePipe, UpdateCoupon, Modal],
  templateUrl: './coupon-details.html',
  styleUrl: './coupon-details.css',
})
export class CouponDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly adminServices = inject(AdminService);

  couponState = signal<Coupon>({
    id: 0,
    code: '',
    status: 'active',
    affiliate: null,
    affiliate_name: '',
    affiliate_email: '',
    affiliate_payment: null,
    discount_type: 'percent',
    discount_value: 0,
    commission_type: 'none',
    commission_value: 0,
    applicable_to: 'subscription',
    starts_at: '',
    ends_at: '',
    total_uses: 0,
    total_revenue_cents: 0,
    total_commission_cents: 0,
    created_at: '',
    updated_at: '',
  });

  isLoadingCoupon = signal(false);
  modalOpen = signal(false);

  // ============================================================
  // MODAL DE EXCLUSÃO
  // ============================================================

  deleteModalOpen = signal(false);
  isDeleting = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/admin/coupons']);
      return;
    }

    const couponId = Number(id);

    if (!Number.isFinite(couponId) || couponId <= 0) {
      this.router.navigate(['/admin/coupons']);
      return;
    }

    this.loadCoupon(couponId);
  }

  private loadCoupon(couponId: number): void {
    this.isLoadingCoupon.set(true);

    this.adminServices.fetchCouponId(couponId).subscribe({
      next: (coupon) => {
        this.couponState.set(coupon);
      },

      error: (err) => {
        console.error('Erro ao carregar cupom:', err);

        this.isLoadingCoupon.set(false);

        toast.error('Erro ao carregar cupom', {
          description: 'Não foi possível carregar os dados do cupom.',
        });
      },

      complete: () => {
        this.isLoadingCoupon.set(false);
      },
    });
  }

  async copyPixKey(): Promise<void> {
    const pixKey = this.couponState().affiliate_payment?.pix_key;

    if (!pixKey) {
      toast.warning('Chave PIX indisponível', {
        description: 'Nenhuma chave PIX foi cadastrada para este afiliado.',
      });

      return;
    }

    try {
      await navigator.clipboard.writeText(pixKey);

      toast.success('Chave PIX copiada!', {
        description: 'A chave foi copiada para a área de transferência.',
      });
    } catch (err) {
      console.error('Erro ao copiar chave PIX:', err);

      toast.error('Falha ao copiar', {
        description: 'Não foi possível copiar a chave PIX. Tente novamente.',
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/coupons']);
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

  onPauseCoupon(): void {
    const currentCoupon = this.couponState();

    if (currentCoupon.status !== 'active' && currentCoupon.status !== 'inactive') {
      toast.warning('Cupom expirado', {
        description: 'Um cupom expirado não pode ser ativado ou pausado.',
      });

      return;
    }

    const newStatus: 'active' | 'inactive' =
      currentCoupon.status === 'active' ? 'inactive' : 'active';

    this.adminServices
      .updateCoupon(currentCoupon.id, {
        status: newStatus,
      })
      .subscribe({
        next: (updatedCoupon) => {
          this.couponState.set({
            ...currentCoupon,
            ...updatedCoupon,
          });

          toast.success('Status atualizado!', {
            description: `Cupom ${newStatus === 'active' ? 'ativado' : 'pausado'} com sucesso.`,
          });
        },

        error: (err) => {
          console.error('Erro ao atualizar status do cupom:', err);

          toast.error('Erro ao atualizar status', {
            description: 'Não foi possível atualizar o cupom. Tente novamente.',
          });
        },
      });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100);
  }

  // ============================================================
  // MODAL DE EDIÇÃO
  // ============================================================

  open(): void {
    this.modalOpen.set(true);
  }

  close(): void {
    this.modalOpen.set(false);
  }

  /**
   * Disparado quando o UpdateCoupon salva com sucesso.
   * Recarrega o cupom para refletir os dados atualizados na tela.
   */
  onCouponUpdated(): void {
    this.loadCoupon(this.couponState().id);
  }

  // ============================================================
  // EXCLUSÃO DE CUPOM
  // ============================================================

  openDeleteModal(): void {
    this.deleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    if (this.isDeleting()) {
      return;
    }

    this.deleteModalOpen.set(false);
  }

  confirmDelete(): void {
    const currentCoupon = this.couponState();

    this.isDeleting.set(true);

    this.adminServices.deleteCoupon(currentCoupon.id).subscribe({
      next: () => {
        toast.success('Cupom excluído', {
          description: 'O cupom foi removido com sucesso.',
        });

        this.router.navigate(['/admin/coupons']);
      },

      error: (err) => {
        console.error('Erro ao excluir cupom:', err);

        this.isDeleting.set(false);
        this.deleteModalOpen.set(false);

        toast.error('Erro ao excluir cupom', {
          description: 'Não foi possível excluir o cupom. Tente novamente.',
        });
      },
    });
  }
}
