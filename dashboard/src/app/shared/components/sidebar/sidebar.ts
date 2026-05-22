import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SIDEBAR_LINKS } from './sidebar.config';
import { NgIcon } from '@ng-icons/core';
import { NgClass } from '@angular/common';
import { AuthState } from '../../../features/auth/services/state/auth/auth-state';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';
import { Auth } from '../../../features/auth/services/facade/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, NgIcon, NgClass],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private readonly authState = inject(AuthState);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  // ✅ Use computed para reagir automaticamente às mudanças do user
  links = computed(() => {
    const user = this.authState.user();
    if (!user) return [];

    return SIDEBAR_LINKS[user.role] || [];
  });

  // ✅ ADICIONE O MÉTODO DE LOGOUT
  async onLogout() {
    const loadingToast = toast.loading('Saindo...', {
      description: 'Você está sendo desconectado.',
    });
    try {
      await firstValueFrom(this.auth.logout());

    toast.success('Até logo!', {
      description: 'Sessão encerrada com sucesso.',
      id: loadingToast,
    });

      // Redireciona para login
      this.router.navigate(['/auth/signin']);
    } catch (error) {
      console.error('[Sidebar] erro no logout:', error);

      toast.error('Erro ao sair', {
        description: 'Não foi possível fazer logout.',
        id: loadingToast,
      });

      // Mesmo com erro, limpa o estado e redireciona
      this.authState.clear();
      this.router.navigate(['/auth/signin']);
    }
  }
}
