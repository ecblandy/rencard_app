import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { toast } from 'ngx-sonner';
import { OnboardingStep } from '../../../(users)/client/components/onboarding-step/onboarding-step';
import { OnboardingTitle } from '../../../(users)/client/components/onboarding-title/onboarding-title';
import { Surface } from '../../../../shared/components/surface/surface';
import { UiButton } from '../../../../shared/ui/button/button';
import { PaymentService } from '../../services/facade/payment.service';
import { Order } from '../../../../shared/types/order';
import { OnboardingCart } from '../../../(users)/client/components/onboarding-cart/onboarding-cart';

interface TemporaryCart {
  id: string;
  expiresAt: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingService: string;
}

@Component({
  selector: 'app-terms',
  imports: [OnboardingStep, OnboardingTitle, NgIcon, Surface, UiButton, OnboardingCart],
  templateUrl: './terms.html',
  styleUrl: './terms.css',
})
export class Terms {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly acceptedTerms = signal(false);
  readonly temporaryCart = signal<TemporaryCart | null>(null);

  constructor() {
    const cart = JSON.parse(
      localStorage.getItem('temporaryCart') ?? 'null',
    ) as TemporaryCart | null;

    if (!cart?.id || !cart?.expiresAt) {
      toast.error('Seu carrinho não foi encontrado.');
      this.router.navigate(['../products'], {
        relativeTo: this.route,
      });
      return;
    }

    const expired = new Date(cart.expiresAt).getTime() <= Date.now();

    if (expired) {
      localStorage.removeItem('temporaryCart');

      toast.error('Seu carrinho expirou. Escolha os produtos novamente.');

      this.router.navigate(['../products'], {
        relativeTo: this.route,
      });

      return;
    }

    this.temporaryCart.set(cart);
  }

  readonly cartItems = computed(() => {
    const cart = this.temporaryCart();

    if (!cart) return [];

    return [
      {
        label: 'Subtotal',
        value: this.formatPrice(cart.subtotal),
      },
      ...(cart.discount > 0
        ? [
            {
              label: 'Desconto',
              value: `- ${this.formatPrice(cart.discount)}`,
            },
          ]
        : []),
      ...(cart.shipping > 0
        ? [
            {
              label: `Frete${cart.shippingService ? ` (${cart.shippingService})` : ''}`,
              value: this.formatPrice(cart.shipping),
            },
          ]
        : []),
      {
        label: 'Total',
        value: this.formatPrice(cart.total),
      },
    ];
  });

  readonly steps = signal([
    {
      step: 1,
      message:
        'A compra do dispositivo físico Rencard garante a posse permanente do produto e o acesso inicial ao seu perfil digital.',
    },
    {
      step: 2,
      message:
        'A manutenção, edição, atualizações e acesso a recursos avançados do perfil são oferecidos como um serviço por assinatura.',
    },
    {
      step: 3,
      message:
        'Caso não opte por manter uma assinatura após o período inicial, seu perfil permanecerá público e acessível, porém com as edições e ferramentas avançadas desativadas.',
    },
    {
      step: 4,
      message:
        'Você poderá reativar esses recursos a qualquer momento escolhendo um de nossos planos.',
    },
  ]);

  readonly currentStep = computed(() => this.route.snapshot.data['step'] as number);

  onCreateOrder() {
    if (!this.acceptedTerms()) {
      toast.error('Você precisa aceitar os termos para continuar.');
      return;
    }

    const cart = this.temporaryCart();

    if (!cart) {
      toast.error('Carrinho temporário não encontrado.');
      return;
    }

    // Chamada da API quando estiver pronta
    // this.paymentService.createOrder(cart.id).subscribe(...);

    console.log('Criar pedido utilizando o carrinho:', cart.id);
  }

  formatPrice(priceCents: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceCents / 100);
  }

  goToSignup() {
    if (!this.acceptedTerms()) {
      toast.error('Você precisa aceitar os termos para continuar.');
      return;
    }

    const cart = this.temporaryCart();

    if (!cart) {
      toast.error('Carrinho temporário não encontrado.');
      return;
    }

    this.router.navigate(['/auth/signup']);
  }
}
