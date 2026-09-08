import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UiButton } from '../../../../../shared/ui/button/button';

@Component({
  selector: 'app-success',
  imports: [UiButton],
  templateUrl: './success.html',
  styleUrl: './success.css',
})
export class Success implements OnInit {
  private router = inject(Router);

  redirectCountdown = signal<number>(5);

  ngOnInit() {
    console.log('✅ Pagamento confirmado com sucesso!');

    // ✅ Limpa o localStorage
    localStorage.removeItem('pendingOrder');
    localStorage.removeItem('temporaryCart');
    localStorage.removeItem('pendingEmail');

    // ✅ Redireciona automaticamente após 5 segundos
    const interval = setInterval(() => {
      this.redirectCountdown.update((count) => count - 1);
      console.log(`⏱️ Redirecionando em ${this.redirectCountdown()}s...`);

      if (this.redirectCountdown() === 0) {
        clearInterval(interval);
        this.goToDashboard();
      }
    }, 3000);
  }

  goToDashboard() {
    console.log('🚀 Redirecionando para o dashboard...');
    this.router.navigate(['/client/dashboard']);
  }
}
