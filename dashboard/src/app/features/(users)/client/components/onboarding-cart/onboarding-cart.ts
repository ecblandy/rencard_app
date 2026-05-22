import { Component, computed, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Plan } from '../../../../../shared/types/plan-model';
import { Surface } from '../../../../../shared/components/surface/surface';

interface CartDetails {
  label: string;
  value: string;
}

@Component({
  selector: 'app-onboarding-cart',
  imports: [NgIcon, Surface],
  templateUrl: './onboarding-cart.html',
  styleUrl: './onboarding-cart.css',
})
export class OnboardingCart {
  items = input<CartDetails[]>([]);

  // Computed para saber se o carrinho está vazio
  readonly isEmpty = computed(() => !this.items().length);
}
