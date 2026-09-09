import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { finalize } from 'rxjs';

import { form, FormField, minLength, required, validate } from '@angular/forms/signals';
import { toast } from 'ngx-sonner';

import { DashboardTitle } from '../../../../components/dashboard-title/dashboard-title';

import { UiLabel } from '../../../../../../shared/ui/label/label';
import { UiInput } from '../../../../../../shared/ui/input/input';
import { Loader } from '../../../../../../shared/components/loader/loader';
import { UiButton } from '../../../../../../shared/ui/button/button';

import { LocalDatePipe } from '../../../../../../shared/pipes/local-date.pipe.ts-pipe';

import { AdminService } from '../../../services/facade/admin.service';

import { PhysicalCard } from '../../../types/physical-card';

interface PhysicalFormModel {
  status: string;
  shipping_code: string;
  id: string;
}

/**
 * Status aceitos pela API.
 */
const STATUS_PT_TO_EN: Record<string, string> = {
  'Em produção': 'in_production',
  'Em Produção': 'in_production',

  Enviado: 'shipped',

  Entregue: 'delivered',

  in_production: 'in_production',
  shipped: 'shipped',
  delivered: 'delivered',
};

/**
 * Status utilizados para exibição.
 */
const STATUS_EN_TO_PT: Record<string, string> = {
  in_production: 'Em produção',
  shipped: 'Enviado',
  delivered: 'Entregue',

  'Em produção': 'Em produção',
  'Em Produção': 'Em produção',
  Enviado: 'Enviado',
  Entregue: 'Entregue',
};

@Component({
  selector: 'app-physical-details',
  imports: [DashboardTitle, UiLabel, NgIcon, LocalDatePipe, UiInput, FormField, Loader, UiButton],
  templateUrl: './physical-details.html',
  styleUrl: './physical-details.css',
})
export class PhysicalDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly adminService = inject(AdminService);

  /**
   * Estado inicial da página.
   */
  isInitialLoading = signal(true);

  /**
   * Indica atualização em andamento.
   */
  isUpdating = signal(false);

  /**
   * Dados completos do cartão físico.
   */
  physicalState = signal<Partial<PhysicalCard>>({
    id: '',
    qr_token: '',
    qr_image: '',
    sku: '',
    status: '',
    shipping_code: '',
    shipping_address: '',
    delivery_preview_date: null,

    user: undefined,
    order: undefined,
    product: undefined,

    user_name: '',
    user_email: '',
    profile_image: null,

    order_code: '',
    card_type: '',
    plan_name: '',
    order_date: '',

    history: [],

    created_at: '',
    updated_at: '',
  });

  /**
   * Estado utilizado pelo Signal Forms.
   */
  formState = signal<PhysicalFormModel>({
    status: '',
    shipping_code: '',
    id: '',
  });

  /**
   * Formulário.
   */
  physicalForm = form(this.formState, (schemaPath) => {
    /**
     * Status é sempre obrigatório.
     */
    required(schemaPath.status, {
      message: 'Selecione um status.',
    });

    /**
     * Código de rastreio:
     *
     * - Em produção: opcional
     * - Enviado: obrigatório
     * - Entregue: obrigatório
     */
    validate(schemaPath.shipping_code, ({ value, valueOf }) => {
      const shippingCode = value().trim();
      const status = valueOf(schemaPath.status);

      const requiresTracking = status === 'shipped' || status === 'delivered';

      /**
       * Não exige rastreio enquanto estiver
       * em produção.
       */
      if (!requiresTracking) {
        return null;
      }

      /**
       * Rastreio obrigatório.
       */
      if (!shippingCode) {
        return {
          kind: 'shippingCodeRequired',
          message: 'Informe o código de rastreio.',
        };
      }

      /**
       * Tamanho mínimo.
       */
      if (shippingCode.length < 3) {
        return {
          kind: 'shippingCodeMinLength',
          message: 'O código de rastreio deve possuir pelo menos 3 caracteres.',
        };
      }

      return null;
    });

    /**
     * Mantém a informação de tamanho mínimo
     * disponível no estado do campo.
     *
     * A regra acima continua sendo responsável
     * pela validação condicional.
     */
    minLength(schemaPath.shipping_code, 3, {
      message: 'O código de rastreio deve possuir pelo menos 3 caracteres.',
    });
  });

  /**
   * Histórico em ordem decrescente:
   * mais recente primeiro.
   */
  reversedHistory = computed(() => {
    const history = this.physicalState().history ?? [];

    return [...history].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  });

  /**
   * Indica se o código de rastreio é obrigatório.
   */
  isShippingCodeRequired = computed(() => {
    const status = this.normalizeStatus(this.formState().status);

    return status === 'shipped' || status === 'delivered';
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      console.error('❌ ID do cartão físico não encontrado na rota.');

      toast.error('Cartão físico não encontrado.');

      this.isInitialLoading.set(false);

      return;
    }

    this.loadPhysicalDetails(id);
  }

  /**
   * Busca os detalhes completos do cartão.
   */
  private loadPhysicalDetails(id: string): void {
    this.isInitialLoading.set(true);

    this.adminService
      .fetchPhysicalCardId(id)
      .pipe(
        finalize(() => {
          this.isInitialLoading.set(false);
        }),
      )
      .subscribe({
        next: (physical) => {
          console.log('💳 Dados do cartão físico:', physical);

          this.physicalState.set(physical);

          const status = this.normalizeStatus(physical.status);

          this.formState.set({
            status,
            shipping_code: physical.shipping_code ?? '',
            id: physical.id,
          });

          console.log('🔄 Status normalizado:', physical.status, '→', status);
        },

        error: (error) => {
          console.error('❌ Erro ao carregar cartão físico:', error);

          toast.error('Não foi possível carregar o cartão físico.', {
            description: 'Ocorreu um erro ao buscar os dados do cartão.',
          });
        },
      });
  }

  /**
   * Atualiza status e código de rastreio.
   */
  onSubmit(event: Event): void {
    event.preventDefault();

    /**
     * Mostra os erros de validação.
     */
    this.physicalForm().markAsTouched();

    /**
     * Interrompe caso o formulário esteja inválido.
     */
    if (this.physicalForm().invalid()) {
      console.warn('⚠️ Formulário inválido:', this.physicalForm().errors());

      toast.error('Revise os dados informados.', {
        description: 'Preencha corretamente os campos obrigatórios.',
      });

      return;
    }

    const formValue = this.formState();

    /**
     * ID obrigatório.
     */
    if (!formValue.id) {
      console.error('❌ Não foi possível atualizar: ID do cartão não encontrado.');

      toast.error('Não foi possível atualizar o cartão.', {
        description: 'O ID do cartão físico não foi encontrado.',
      });

      return;
    }

    /**
     * Normaliza o status.
     */
    const status = this.normalizeStatus(formValue.status);

    /**
     * Segurança adicional antes da requisição.
     */
    const allowedStatuses = ['in_production', 'shipped', 'delivered'];

    if (!allowedStatuses.includes(status)) {
      console.error('❌ Status inválido:', status);

      toast.error('Status inválido.', {
        description: 'Selecione um status válido para continuar.',
      });

      return;
    }

    /**
     * Normaliza o código de rastreio.
     */
    const shippingCode = formValue.shipping_code.trim();

    /**
     * Regra de negócio adicional.
     */
    if ((status === 'shipped' || status === 'delivered') && shippingCode.length < 3) {
      console.error('❌ Código de rastreio inválido.');

      toast.error('Código de rastreio inválido.', {
        description: 'Informe um código com pelo menos 3 caracteres.',
      });

      return;
    }

    /**
     * Payload aceito pelo AdminService.
     *
     * Mantém propositalmente o nome:
     * updatePhysycalCards
     */
    const payload: Pick<Partial<PhysicalCard>, 'id' | 'status' | 'shipping_code'> = {
      id: formValue.id,
      status,
      shipping_code: shippingCode,
    };

    console.log('📤 Atualizando cartão físico:', payload);

    this.isUpdating.set(true);

    // cspell:disable-next-line
    this.adminService
      .updatePhysycalCards(payload)
      .pipe(
        finalize(() => {
          this.isUpdating.set(false);
        }),
      )
      .subscribe({
        next: (updatedPhysical) => {
          console.log('✅ Cartão físico atualizado:', updatedPhysical);

          /**
           * Atualiza os dados exibidos.
           */
          this.physicalState.update((currentState) => ({
            ...currentState,
            ...updatedPhysical,
          }));

          /**
           * Mantém o formulário sincronizado.
           */
          this.formState.set({
            status: this.normalizeStatus(updatedPhysical.status),
            shipping_code: updatedPhysical.shipping_code ?? '',
            id: updatedPhysical.id,
          });

          toast.success('Cartão atualizado com sucesso.', {
            description: 'As informações da entrega foram atualizadas.',
          });
        },

        error: (error) => {
          console.error('❌ Erro ao atualizar cartão físico:', error);

          toast.error('Não foi possível atualizar o cartão.', {
            description:
              error?.error?.detail ||
              error?.error?.message ||
              'Ocorreu um erro ao salvar as alterações.',
          });
        },
      });
  }

  /**
   * Converte qualquer representação do status
   * para o formato técnico esperado pela API.
   */
  private normalizeStatus(status?: string): string {
    if (!status) {
      return '';
    }

    return STATUS_PT_TO_EN[status] ?? status;
  }

  /**
   * Converte status técnico para apresentação.
   */
  getStatusLabel(status?: string): string {
    if (!status) {
      return 'N/A';
    }

    return STATUS_EN_TO_PT[status] ?? status;
  }

  /**
   * Download do QR Code.
   */
  async downloadQrCode(): Promise<void> {
    const qrUrl = this.physicalState().qr_image;

    if (!qrUrl) {
      console.error('❌ QR Code não disponível.');

      toast.error('QR Code indisponível.', {
        description: 'Nenhuma imagem de QR Code foi registrada para este cartão.',
      });

      return;
    }

    try {
      const response = await fetch(qrUrl);

      if (!response.ok) {
        throw new Error(`Erro ao baixar QR Code: ${response.status}`);
      }

      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = blobUrl;

      link.download = `qr-code-${
        this.physicalState().sku || this.physicalState().id || 'card'
      }.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);

      toast.success('QR Code baixado com sucesso.');
    } catch (error) {
      console.error('❌ Erro ao fazer download do QR Code:', error);

      toast.error('Não foi possível baixar o QR Code.', {
        description: 'Ocorreu um erro ao tentar realizar o download da imagem.',
      });
    }
  }
}
