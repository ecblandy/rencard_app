import { Component, computed, inject, input, output, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { form, FormField, required, submit, validate } from '@angular/forms/signals';
import { NgIcon } from '@ng-icons/core';
import { toast } from 'ngx-sonner';

import { Modal } from '../../../../../shared/ui/modal/modal';
import { UiLabel } from '../../../../../shared/ui/label/label';
import { UiInput } from '../../../../../shared/ui/input/input';
import { UiButton } from '../../../../../shared/ui/button/button';
import { SurfaceTitle } from '../../../components/surface-title/surface-title';
import { AdminService } from '../../services/facade/admin.service';
import { formatErrorList } from '../../../../../shared/utils/format-error';
import { convertToCents } from '../../../../../shared/utils/currency';
import { Affiliate } from '../../types/affiliate-model';
import {
  CouponApplicableTo,
  CouponCommissionType,
  CouponCreatePayload,
  CouponDiscountType,
} from '../../types/coupons-filter';

interface CreateCouponFormModel {
  code: string;
  discount_type: CouponDiscountType | '';
  discount_value: number | null;
  starts_at: string;
  ends_at: string;
  applicable_to: CouponApplicableTo | '';
  commission_type: CouponCommissionType;
  commission_value: number | null;
  affiliate: string;
}

@Component({
  selector: 'app-create-coupon',
  imports: [Modal, UiLabel, UiInput, UiButton, SurfaceTitle, NgIcon, FormField],
  templateUrl: './create-coupon.html',
  styleUrl: './create-coupon.css',
})
export class CreateCoupon {
  private readonly adminServices = inject(AdminService);

  isOpen = input(false);
  close = output<void>();
  couponCreated = output<void>();

  affiliatesData = signal<Affiliate[]>([]);

  couponState = signal<CreateCouponFormModel>({
    code: '',
    discount_type: '',
    discount_value: null,
    starts_at: '',
    ends_at: '',
    applicable_to: '',
    commission_type: 'none',
    commission_value: 0,
    affiliate: '',
  });

  couponForm = form(this.couponState, (schemaPath) => {
    required(schemaPath.code, {
      message: 'O código do cupom é obrigatório.',
    });

    required(schemaPath.starts_at, {
      message: 'A data de início é obrigatória.',
    });

    required(schemaPath.ends_at, {
      message: 'A data de término é obrigatória.',
    });

    required(schemaPath.discount_type, {
      message: 'Selecione o tipo de desconto.',
    });

    required(schemaPath.applicable_to, {
      message: 'Selecione onde o cupom será aplicável.',
    });

    required(schemaPath.commission_type, {
      message: 'Selecione o tipo de comissão.',
    });

    validate(schemaPath.discount_value, ({ value, valueOf }) => {
      const type = valueOf(schemaPath.discount_type);
      const rawValue = value();

      if (!type) {
        return undefined;
      }

      if (rawValue === null || rawValue === undefined) {
        return {
          kind: 'discount-required',
          message: 'Informe o valor do desconto.',
        };
      }

      const numericValue = Number(rawValue);

      if (!Number.isFinite(numericValue)) {
        return {
          kind: 'discount-invalid',
          message: 'Informe um valor de desconto válido.',
        };
      }

      if (numericValue < 0) {
        return {
          kind: 'discount-negative',
          message: 'O valor do desconto não pode ser negativo.',
        };
      }

      if (type === 'percent') {
        if (!Number.isInteger(numericValue)) {
          return {
            kind: 'discount-percent-decimal',
            message: 'A porcentagem deve ser um número inteiro.',
          };
        }

        if (numericValue > 100) {
          return {
            kind: 'discount-percent-invalid',
            message: 'A porcentagem deve estar entre 0 e 100.',
          };
        }
      }

      return undefined;
    });

    validate(schemaPath.commission_type, ({ value, valueOf }) => {
      const type = value();
      const affiliate = valueOf(schemaPath.affiliate);

      const hasAffiliate = typeof affiliate === 'string' && affiliate.trim() !== '';

      if (!hasAffiliate && type !== 'none') {
        return {
          kind: 'commission-without-affiliate',
          message: 'Sem afiliado, a comissão deve ser "none".',
        };
      }

      return undefined;
    });

    validate(schemaPath.commission_value, ({ value, valueOf }) => {
      const type = valueOf(schemaPath.commission_type);
      const affiliate = valueOf(schemaPath.affiliate);
      const rawValue = value();

      const hasAffiliate = typeof affiliate === 'string' && affiliate.trim() !== '';

      if (!hasAffiliate) {
        const numericValue = Number(rawValue ?? 0);

        if (type !== 'none' || numericValue !== 0) {
          return {
            kind: 'commission-without-affiliate',
            message: 'Sem afiliado, a comissão deve ser "none" e o valor 0.',
          };
        }

        return undefined;
      }

      if (type === 'none') {
        const numericValue = Number(rawValue ?? 0);

        if (numericValue !== 0) {
          return {
            kind: 'commission-none-invalid',
            message: 'Quando a comissão for "none", o valor deve ser 0.',
          };
        }

        return undefined;
      }

      if (rawValue === null || rawValue === undefined) {
        return {
          kind: 'commission-required',
          message: 'Informe o valor da comissão.',
        };
      }

      const numericValue = Number(rawValue);

      if (!Number.isFinite(numericValue)) {
        return {
          kind: 'commission-invalid',
          message: 'Informe um valor de comissão válido.',
        };
      }

      if (numericValue < 0) {
        return {
          kind: 'commission-negative',
          message: 'O valor da comissão não pode ser negativo.',
        };
      }

      if (type === 'percent') {
        if (!Number.isInteger(numericValue)) {
          return {
            kind: 'commission-percent-decimal',
            message: 'A porcentagem deve ser um número inteiro.',
          };
        }

        if (numericValue > 100) {
          return {
            kind: 'commission-percent-invalid',
            message: 'A porcentagem deve estar entre 0 e 100.',
          };
        }
      }

      return undefined;
    });

    validate(schemaPath.ends_at, ({ value, valueOf }) => {
      const startsAt = valueOf(schemaPath.starts_at);
      const endsAt = value();

      if (!startsAt || !endsAt) {
        return undefined;
      }

      if (new Date(endsAt) <= new Date(startsAt)) {
        return {
          kind: 'date-invalid',
          message: 'A data de término deve ser posterior à data de início.',
        };
      }

      return undefined;
    });
  });

  hasAffiliate = computed(() => {
    const affiliate = this.couponForm.affiliate().value();

    return typeof affiliate === 'string' && affiliate.trim() !== '';
  });

  hasDiscountType = computed(() => {
    return !!this.couponForm.discount_type().value();
  });

  hasCommissionValue = computed(() => {
    const type = this.couponForm.commission_type().value();

    return this.hasAffiliate() && type !== 'none';
  });

  applicableToDescription = computed(() => {
    const value = this.couponForm.applicable_to().value();

    switch (value) {
      case 'subscription':
        return 'Somente assinaturas.';

      case 'physical':
        return 'Toda a ordem do onboarding, incluindo cartão, tag, logo e demais itens. O frete não recebe desconto.';

      case 'card':
        return 'Somente itens com type = "card" na ordem. Tag, logo, produtos digitais e frete ficam fora da base do desconto.';

      case 'tag':
        return 'Somente itens com type = "tag" na ordem. Cartão, logo, produtos digitais e frete ficam fora da base do desconto.';

      case 'both':
        return 'Assinaturas e toda a ordem do onboarding. O frete não recebe desconto.';

      default:
        return 'Selecione onde o cupom poderá ser aplicado.';
    }
  });

  constructor() {
    this.loadAffiliates();
  }

  private loadAffiliates(): void {
    this.adminServices
      .fetchAffiliates({
        q: '',
        page: 1,
        page_size: 100,
      })
      .subscribe({
        next: (response) => {
          console.log('🤝 Afiliados:', response);
          this.affiliatesData.set(response.results);
        },

        error: (err) => {
          console.error('Erro ao carregar afiliados:', err);
          toast.error('Não foi possível carregar os afiliados.');
        },
      });
  }

  onAffiliateChange(): void {
    const affiliate = this.couponState().affiliate.trim();

    if (!affiliate) {
      this.couponState.update((state) => ({
        ...state,
        commission_type: 'none',
        commission_value: 0,
      }));
    }
  }

  onCommissionTypeChange(): void {
    const type = this.couponState().commission_type;

    if (type === 'none') {
      this.couponState.update((state) => ({
        ...state,
        commission_value: 0,
      }));
    }
  }

  private normalizeApiValue(
    type: CouponDiscountType | CouponCommissionType,
    value: number | null,
  ): number {
    const numericValue = Number(value ?? 0);

    if (type === 'percent' || type === 'none') {
      return numericValue;
    }

    return convertToCents(numericValue, 'amount');
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    submit(this.couponForm, async () => {
      const formData = this.couponState();

      const affiliateValue = formData.affiliate.trim();

      const hasAffiliate = affiliateValue !== '';

      const affiliateId = hasAffiliate ? Number(affiliateValue) : null;

      const discountType = formData.discount_type;

      const applicableTo = formData.applicable_to;

      if (discountType !== 'percent' && discountType !== 'amount') {
        return;
      }

      if (
        applicableTo !== 'subscription' &&
        applicableTo !== 'physical' &&
        applicableTo !== 'card' &&
        applicableTo !== 'tag' &&
        applicableTo !== 'both'
      ) {
        return;
      }

      const commissionType: CouponCommissionType = hasAffiliate ? formData.commission_type : 'none';

      const discountValue = this.normalizeApiValue(discountType, formData.discount_value);

      const commissionValue =
        !hasAffiliate || commissionType === 'none'
          ? 0
          : this.normalizeApiValue(commissionType, formData.commission_value);

      const payload: CouponCreatePayload = {
        code: formData.code.trim().toUpperCase(),
        status: 'active',
        affiliate: affiliateId,
        discount_type: discountType,
        discount_value: discountValue,
        commission_type: commissionType,
        commission_value: commissionValue,
        applicable_to: applicableTo,
        starts_at: formData.starts_at,
        ends_at: formData.ends_at,
      };

      console.log('📦 Payload do cupom:', payload);

      const loadingToast = toast.loading('Aguarde, tentando criar cupom...', {
        description: '',
      });

      try {
        await firstValueFrom(this.adminServices.registerCoupon(payload));

        toast.success('Cupom cadastrado', {
          description: '',
          id: loadingToast,
        });

        this.couponCreated.emit();
        this.close.emit();
      } catch (err: any) {
        console.error('Erro ao cadastrar cupom:', err);

        const backendError = err?.error ?? err;

        const errorMessages = formatErrorList(backendError);

        toast.error('Ops, algo deu errado!', {
          description: errorMessages.join('\n'),
          id: loadingToast,
        });
      }
    });
  }
}
