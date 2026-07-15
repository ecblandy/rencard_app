import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { NgIcon } from '@ng-icons/core';
import { Surface } from '../../../../../shared/components/surface/surface';
import { UiButton } from '../../../../../shared/ui/button/button';

@Component({
  selector: 'app-success',
  imports: [Surface, NgIcon, UiButton],
  templateUrl: './success.html',
  styleUrl: './success.css',
})
export class Success {
  private router = inject(Router);

  goToDashboard() {
    this.router.navigate(['/client/dashboard']);
  }
}
