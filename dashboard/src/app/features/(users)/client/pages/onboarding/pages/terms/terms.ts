import { Component, computed, inject, signal } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { Surface } from '../../../../../../../shared/components/surface/surface';
import { UiButton } from '../../../../../../../shared/ui/button/button';
import { OnboardingCart } from '../../../../components/onboarding-cart/onboarding-cart';
import { OnboardingStep } from '../../../../components/onboarding-step/onboarding-step';
import { OnboardingTitle } from '../../../../components/onboarding-title/onboarding-title';
import { PaymentService } from '../../services/facade/payment.service';
import { toast } from 'ngx-sonner';
import { ShippingCalculationResponse } from '../../../../../../../shared/types/shipping';
import { Order } from '../../../../../../../shared/types/order';

@Component({
  selector: 'app-terms',
  imports: [OnboardingStep, OnboardingTitle, NgIcon, Surface, UiButton, OnboardingCart],
  templateUrl: './terms.html',
  styleUrl: './terms.css',
})
export class Terms {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paymentService = inject(PaymentService);
  readonly steps = signal([
    {
      step: 1,
      message:
        'A compra do dispositivo físico Renc garante a posse permanente do produto e o acesso inicial ao seu perfil digital.',
    },
    {
      step: 2,
      message:
        'A manutenção, edição, atualizações e acesso a recursos avançados do perfil são oferecidos como um serviço por assinatura.',
    },
    {
      step: 3,
      message:
        'Caso não opte por manter uma assinatura após o período inicial, seu perfil permanecerá público e acessível, porém com as edições e ferramentas avançadas desativadas.',
    },
    {
      step: 4,
      message:
        'Você poderá reativar esses recursos a qualquer momento escolhendo um de nossos planos.',
    },
  ]);

  readonly currentStep = computed(() => {
    return this.route.snapshot.data['step'] as number;
  });

  readonly order = signal<any>(JSON.parse(sessionStorage.getItem('onboarding_order') ?? 'null'));
  readonly preview = signal<ShippingCalculationResponse | null>(null);

  formatPrice(priceCents: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
      priceCents / 100,
    );
  }

  constructor() {
    console.log('Order in Terms Component:', this.order());
  }

  ngOnInit() {
    const { total_cents, postal_code, ...orderPayload } = this.order();
    this.paymentService.previewOrder(orderPayload).subscribe({
      next: (response) => {
        this.preview.set(response);
      },
    });
  }

  readonly cartItems = computed(() => {
    const order = this.preview(); // <-- usa o preview, não o order
    if (!order) return []; // enquanto carrega, retorna vazio

    const items = [
      {
        label: 'Subtotal',
        value: this.formatPrice(order.subtotal_cents),
      },
    ];

    if (order.coupon_discount && order.discount_cents > 0) {
      items.push({
        label: 'Desconto',
        value: `- ${this.formatPrice(order.discount_cents)}`,
      });
    }

    if (order.shipping_required) {
      items.push({
        label: `Frete (${order.shipping_service_name})`,
        value: this.formatPrice(order.shipping_cents),
      });
    }

    items.push({
      label: 'Total',
      value: this.formatPrice(order.total_cents),
    });

    return items;
  });

  onCreateOrder() {
    const { total_cents, postal_code, ...orderPayload } = this.order();

    this.paymentService.createOrder(orderPayload).subscribe({
      next: (order: Order) => {
        toast.success('Pedido criado com sucesso!');
        sessionStorage.removeItem('onboarding_order');
        this.router.navigate(['../checkout'], {
          relativeTo: this.route,
          state: { order },
        });
      },
      error: (err) => {
        console.error('Error creating order:', err);
        toast.error('Erro ao criar pedido. Por favor, tente novamente.');
      },
    });
  }
}
