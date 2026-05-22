import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Modal } from '../../../../../shared/ui/modal/modal';
import { UiLabel } from '../../../../../shared/ui/label/label';
import { UiInput } from '../../../../../shared/ui/input/input';
import { UiButton } from '../../../../../shared/ui/button/button';
import { SurfaceTitle } from '../../../components/surface-title/surface-title';
import { NgIcon } from '@ng-icons/core';
import { form, FormField, required, submit, validate } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { AdminService } from '../../services/facade/admin.service';
import { formatErrorList } from '../../../../../shared/utils/format-error';
import { toast } from 'ngx-sonner';
import { convertToCents } from '../../../../../shared/utils/currency';
import { Affiliate } from '../../types/affiliate-model';

interface CreateCouponModel {
  code: string;
  discount_type: 'percent' | 'amount';
  discount_value: number;
  starts_at: string;
  ends_at: string;
  applicable_to: 'subscription' | 'product';
  comission_type: string;
  commission_value: number;
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

  couponState = signal<CreateCouponModel>({
    code: '',
    discount_type: 'amount',
    discount_value: 0,
    starts_at: '',
    ends_at: '',
    applicable_to: 'subscription',
    comission_type: '',
    commission_value: 0,
    affiliate: '',
  });

  affiliatesData = signal<Affiliate[]>([]);

  couponCreated = output<void>();

  couponForm = form(this.couponState, (schemaPath) => {
    required(schemaPath.affiliate, { message: 'Selecione um afiliado.' });
    required(schemaPath.code, { message: 'O campo de código é obrigatório.' });
    required(schemaPath.starts_at, { message: 'A data de início é obrigatória.' });
    required(schemaPath.ends_at, { message: 'A data de término é obrigatória.' });
    required(schemaPath.applicable_to, { message: 'Selecione onde o cupom será aplicável.' });
    required(schemaPath.comission_type, { message: 'O campo de tipo de comissão é obrigatório.' });
    required(schemaPath.discount_type, { message: 'O campo de tipo de desconto é obrigatório.' });
    required(schemaPath.commission_value, {
      message: 'Um valor é obrigatório.',
    });
    required(schemaPath.discount_value, {
      message: 'Um valor de desconto é obrigatório.',
    });

    // Validação para commission_value
    validate(schemaPath.commission_value, ({ value, valueOf }) => {
      const typeComission = valueOf(schemaPath.comission_type);
      const comissionValue = value();

      if (!typeComission || !comissionValue) return undefined;

      switch (typeComission) {
        case 'percent':
          const percentRegex = /^(100|[1-9]?\d)$/;
          if (!percentRegex.test(String(comissionValue))) {
            return {
              kind: 'percent-invalid',
              message: 'Informe uma porcentagem válida entre 0 e 100 (apenas números inteiros)',
            };
          }
          return undefined;

        case 'amount':
          const amountRegex = /^\d+(\.\d{1,2})?$/;
          if (!amountRegex.test(String(comissionValue))) {
            return { kind: 'amount-invalid', message: 'Valor inválido. Use formato: 10.50' };
          }
          return undefined;

        default:
          return undefined;
      }
    });

    // Validação para discount_value
    validate(schemaPath.discount_value, ({ value, valueOf }) => {
      const typeDiscount = valueOf(schemaPath.discount_type);
      const discountValue = value();

      if (!typeDiscount || !discountValue) return undefined;

      switch (typeDiscount) {
        case 'percent':
          const percentRegex = /^(100|[1-9]?\d)$/;
          if (!percentRegex.test(String(discountValue))) {
            return {
              kind: 'percent-invalid',
              message: 'Informe uma porcentagem válida entre 0 e 100 (apenas números inteiros)',
            };
          }
          return undefined;

        case 'amount':
          const amountRegex = /^\d+(\.\d{1,2})?$/;
          if (!amountRegex.test(String(discountValue))) {
            return { kind: 'amount-invalid', message: 'Valor inválido. Use formato: 10.50' };
          }
          return undefined;

        default:
          return undefined;
      }
    });

    // Validação de data - ends_at deve ser maior que starts_at
    validate(schemaPath.ends_at, ({ value, valueOf }) => {
      const startsAt = valueOf(schemaPath.starts_at);
      const endsAt = value();

      if (!startsAt || !endsAt) return undefined;

      if (new Date(endsAt) <= new Date(startsAt)) {
        return {
          kind: 'date-invalid',
          message: 'A data de término deve ser posterior à data de início.',
        };
      }

      return undefined;
    });
  });

  // ✅ Computed signals para propriedades da máscara de COMISSÃO
  commissionMaskProps = computed(() => {
    const type = this.couponForm.comission_type().value();

    if (type === 'percent') {
      return {
        mask: 'separator.0',
        suffix: '%',
        prefix: undefined,
        thousandSeparator: undefined,
        decimalMarker: undefined,
        placeholder: 'Ex: 20',
      };
    } else if (type === 'amount') {
      return {
        mask: 'separator.2',
        prefix: 'R$ ',
        suffix: undefined,
        thousandSeparator: '.',
        decimalMarker: ',',
        placeholder: 'Ex: 20,00',
      };
    }

    return {
      mask: undefined,
      prefix: undefined,
      suffix: undefined,
      thousandSeparator: undefined,
      decimalMarker: undefined,
      placeholder: 'Selecione o tipo de comissão primeiro',
    };
  });

  // ✅ Computed signals para propriedades da máscara de DESCONTO
  discountMaskProps = computed(() => {
    const type = this.couponForm.discount_type().value();

    if (type === 'percent') {
      return {
        mask: 'separator.0',
        suffix: '%',
        prefix: undefined,
        thousandSeparator: undefined,
        decimalMarker: undefined,
        placeholder: 'Ex: 20',
      };
    } else if (type === 'amount') {
      return {
        mask: 'separator.2',
        prefix: 'R$ ',
        suffix: undefined,
        thousandSeparator: '.',
        decimalMarker: ',',
        placeholder: 'Ex: 20,00',
      };
    }

    return {
      mask: undefined,
      prefix: undefined,
      suffix: undefined,
      thousandSeparator: undefined,
      decimalMarker: undefined,
      placeholder: 'Selecione o tipo de desconto primeiro',
    };
  });

  constructor() {
    this.loadAffiliates();
  }

  private loadAffiliates() {
    this.adminServices.fetchAllAffiliates().subscribe({
      next: (data) => {
        console.log(data);
        this.affiliatesData.set(data);
      },
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.couponForm, async () => {
      const formData = this.couponState();

      // ✅ Usa a função importada
      const payload = {
        ...formData,
        discount_value: convertToCents(formData.discount_value, formData.discount_type),
        commission_value: convertToCents(
          formData.commission_value,
          formData.comission_type as 'percent' | 'amount',
        ),
      };

      console.log('Payload original:', formData);
      console.log('Payload convertido:', payload);

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
