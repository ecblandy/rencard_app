import { Component, input } from '@angular/core';

@Component({
  selector: 'app-onboarding-title',
  imports: [],
  templateUrl: './onboarding-title.html',
  styleUrl: './onboarding-title.css',
})
export class OnboardingTitle {
  title = input<string>('');
  description = input<string>('');
}
