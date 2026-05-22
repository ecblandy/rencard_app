import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-onboarding-step',
  imports: [],
  templateUrl: './onboarding-step.html',
  styleUrl: './onboarding-step.css',
})
export class OnboardingStep {
  currentStep = input.required<number>();
  totalSteps = input<number>(4);

  steps = computed(() => Array.from({ length: this.totalSteps() }, (_, i) => i + 1));
}
