import { toast } from 'ngx-sonner';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/facade/admin.service';
import { Coupon } from '../../../types/coupons-filter';
import { UiButton } from '../../../../../../shared/ui/button/button';
import { NgIcon } from '@ng-icons/core';
import { Loader } from '../../../../../../shared/components/loader/loader';
import { Surface } from '../../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../../components/surface-title/surface-title';
import { LocalDatePipe } from '../../../../../../shared/pipes/local-date.pipe.ts-pipe';
import { form, submit } from '@angular/forms/signals';
import { UpdateCoupon } from '../../../components/update-coupon/update-coupon';

@Component({
  selector: 'app-coupon-details',
  imports: [UiButton, NgIcon, Loader, Surface, SurfaceTitle, LocalDatePipe, UpdateCoupon],
  templateUrl: './coupon-details.html',
  styleUrl: './coupon-details.css',
})
export class CouponDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private readonly adminServices = inject(AdminService);

  couponState = signal<Coupon>({
    id: '',
    code: '',
    discount_type: 'percent',
    discount_value: 0,
    applicable_to: 'subscription',
    status: 'active',
    status_label: '',
    starts_at: '',
    ends_at: '',
    total_uses: 0,
    commission_percent: 0,
    affiliate: '',
    affiliate_name: '',
    affiliate_email: '',
    affiliate_payment: {
      available_commission_cents: 0,
      pix_key: '',
      pix_key_type: '',
      pix_owner_name: '',
    },
    total_commission_cents: 0,
    total_revenue_cents: 0,
    created_at: '',
    updated_at: '',
  });

  couponForm = form(this.couponState);
  isLoadingCoupon = signal<boolean>(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.loadCoupon(Number(id));
  }

  private loadCoupon(couponId: number | string) {
    this.isLoadingCoupon.set(true);
    this.adminServices.fetchCouponId(couponId).subscribe({
      next: (coupon) => {
        this.couponState.set(coupon);
      },
      error: console.error,
      complete: () => this.isLoadingCoupon.set(false),
    });
  }

  async copyPixKey() {
    const pixKey = this.couponState()?.affiliate_payment?.pix_key;

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
      toast.error('Falha ao copiar', {
        description: 'Não foi possível copiar a chave PIX. Tente novamente.',
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin/coupons']);
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

  onPauseCoupon() {
    const currentCoupon = this.couponState();
    const newStatus = currentCoupon.status === 'active' ? 'inactive' : 'active';

    this.adminServices
      .updateCoupon({
        id: currentCoupon.id,
        status: newStatus,
      })
      .subscribe({
        next: (updatedCoupon) => {
          this.couponState.set({ ...currentCoupon, ...updatedCoupon });
          toast.success('Status atualizado!', {
            description: `Cupom ${newStatus === 'active' ? 'ativado' : 'pausado'} com sucesso.`,
          });
        },
        error: (err) => {
          console.error(err);
          toast.error('Erro ao atualizar status', {
            description: 'Não foi possível atualizar o cupom. Tente novamente.',
          });
        },
      });
  }

  formatPrice(price: number) {
    return Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 1000);
  }

  modalOpen = signal(false);

  open() {
    this.modalOpen.set(true);
  }

  close() {
    this.modalOpen.set(false);
  }
}
