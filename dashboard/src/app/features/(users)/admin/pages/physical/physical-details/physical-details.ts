import { Component, computed, inject, signal } from '@angular/core';
import { DashboardTitle } from '../../../../components/dashboard-title/dashboard-title';
import { UiLabel } from '../../../../../../shared/ui/label/label';
import { NgIcon } from '@ng-icons/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../services/facade/admin.service';
import { PhysicalCard } from '../../../types/physical-card';
import { LocalDatePipe } from '../../../../../../shared/pipes/local-date.pipe.ts-pipe';
import { UiInput } from '../../../../../../shared/ui/input/input';
import { form, FormField } from '@angular/forms/signals';
import { Loader } from '../../../../../../shared/components/loader/loader';
import { UiButton } from '../../../../../../shared/ui/button/button';

interface PhysicalFormModel {
  status: string;
  shipping_code: string;
  id: string;
}

// ✅ Mapeamento de status PT → EN
const STATUS_PT_TO_EN: Record<string, string> = {
  'Em produção': 'in_production',
  Entregue: 'delivered',
  Enviado: 'shipped',
};

// ✅ Mapeamento de status EN → PT
const STATUS_EN_TO_PT: Record<string, string> = {
  in_production: 'Em produção',
  delivered: 'Entregue',
  shipped: 'Enviado',
};

@Component({
  selector: 'app-physical-details',
  imports: [DashboardTitle, UiLabel, NgIcon, LocalDatePipe, UiInput, FormField, Loader, UiButton],
  templateUrl: './physical-details.html',
  styleUrl: './physical-details.css',
})
export class PhysicalDetails {
  private route = inject(ActivatedRoute);
  private readonly adminServices = inject(AdminService);

  isInitialLoading = signal(true);

  physicalState = signal<Partial<PhysicalCard>>({
    user_name: '',
    status: '',
    shipping_code: '',
    shipping_address: '',
    history: [],
  });

  formState = signal<PhysicalFormModel>({
    status: '',
    shipping_code: '',
    id: '',
  });

  physicalForm = form(this.formState);

  // ✅ Computed signal para histórico invertido (mais recente primeiro)
  reversedHistory = computed(() => {
    const history = this.physicalState().history || [];
    return [...history].reverse();
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    this.loadPhysicalDetails(String(id));
  }

  private loadPhysicalDetails(id: string) {
    this.adminServices.fetchPhysicalCardId(id).subscribe({
      next: (physical) => {
        console.log('Dados recebidos:', physical);
        this.physicalState.set(physical);

        // ✅ Converte status de PT para EN antes de setar no form
        const statusInEnglish = STATUS_PT_TO_EN[physical.status || ''] || '';

        this.formState.set({
          status: statusInEnglish,
          shipping_code: physical.shipping_code || '',
          id: physical.id,
        });

        console.log('Status convertido:', physical.status, '→', statusInEnglish);
      },
      error: console.error,
      complete: () => this.isInitialLoading.set(false),
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const payload = this.formState();

    this.adminServices.updatePhysycalCards(payload).subscribe({
      next: (data) => {
        console.log('dados atualizados', data);
        this.physicalState.update((state) => ({
          ...state,
          status: payload.status,
          shipping_code: payload.shipping_code,
        }));
      },
      error: console.error,
    });
  }

  // ✅ Método auxiliar para exibir status traduzido
  getStatusLabel(statusEn: string): string {
    return STATUS_EN_TO_PT[statusEn] || statusEn;
  }
}
