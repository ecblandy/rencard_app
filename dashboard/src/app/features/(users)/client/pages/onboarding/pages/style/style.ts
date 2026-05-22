import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgIcon } from '@ng-icons/core';

import { PaymentService } from '../../services/facade/payment.service';
import { Plan } from '../../../../../../../shared/types/plan-model';
import { UiButton } from '../../../../../../../shared/ui/button/button';
import { OnboardingCart } from '../../../../components/onboarding-cart/onboarding-cart';
import { OnboardingStep } from '../../../../components/onboarding-step/onboarding-step';
import { OnboardingTitle } from '../../../../components/onboarding-title/onboarding-title';
import { Loader } from '../../../../../../../shared/components/loader/loader';

@Component({
  selector: 'app-style',
  imports: [OnboardingStep, OnboardingTitle, NgIcon, UiButton, OnboardingCart, Loader],
  templateUrl: './style.html',
  styleUrl: './style.css',
})
export class Style {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paymentService = inject(PaymentService);

  readonly currentStep = computed(() => {
    // a rota pai define o data quando a rota muda
    return this.route.snapshot.data['step'] as number;
  });

  readonly plans = signal<Plan[]>([]);
  readonly selectedProfile = signal<Plan | null>(null);

  readonly isInitialLoading = signal<boolean>(true);

  ngOnInit() {
    // opcional: carregar ao iniciar
    this.loadPlans();
  }

  loadPlans() {
    this.paymentService.fetchPlans().subscribe({
      next: (data) => {
        this.plans.set(data.results.reverse());
        this.isInitialLoading.set(false); // ✅ só para quando tem dado
      },
      error: (err) => {
        console.error('Erro ao carregar planos', err);
        this.isInitialLoading.set(false); // ✅ para o loading mesmo com erro
      },
    });
  }

  choosePlan(plan: Plan) {
    this.selectedProfile.set(plan); // Atualiza o profile do carrinho
  }

  goToProduct() {
    this.router.navigate(['onboarding/products'], {
      queryParams: { plan: this.selectedProfile()?.type },
    });
  }

  cartItems() {
    return this.selectedProfile()
      ? [{ label: 'Perfil', value: this.selectedProfile()?.name ?? 'Falha ao carregar' }]
      : [];
  }
}
