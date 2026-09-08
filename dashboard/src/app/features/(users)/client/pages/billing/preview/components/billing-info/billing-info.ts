import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { NgIcon } from '@ng-icons/core';

import { Surface } from '../../../../../../../../shared/components/surface/surface';

@Component({
  selector: 'app-billing-info',
  standalone: true,
  imports: [Surface, NgIcon],
  templateUrl: './billing-info.html',
  styleUrl: './billing-info.css',
})
export class BillingInfo {
  private readonly router = inject(Router);

  goToSupport(): void {
    this.router.navigate(['/client/support']);
  }
}
