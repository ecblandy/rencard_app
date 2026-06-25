import { Component, computed, inject, signal } from '@angular/core';
import { Surface } from '../../../../../../../shared/components/surface/surface';
import { SurfaceTitle } from '../../../../../components/surface-title/surface-title';
import { AppearanceSettings, AppearanceStore } from './appearence-store';
import { toast } from 'ngx-sonner';
import { ProfileApi } from '../../services/api/profile-api';

interface ColorField {
  key: keyof AppearanceSettings;
  label: string;
  description: string;
}

@Component({
  selector: 'app-appearance',
  imports: [Surface, SurfaceTitle],
  templateUrl: './appearance.html',
  styleUrl: './appearance.css',
})
export class Appearance {
  readonly store = inject(AppearanceStore);
  private readonly api = inject(ProfileApi);

  readonly colorFields: ColorField[] = [
    {
      key: 'background_color',
      label: 'Cor de fundo',
      description: 'Fundo principal do seu cartão',
    },
    { key: 'text_primary', label: 'Texto primário', description: 'Cor do texto principal' },
    { key: 'text_secondary', label: 'Texto secundário', description: 'Cor dos textos de apoio' },
    {
      key: 'button_bg_primary',
      label: 'Botão primário — fundo',
      description: 'Cor de fundo dos botões principais',
    },
    {
      key: 'button_bg_secondary',
      label: 'Botão secundário — fundo',
      description: 'Cor de fundo dos botões secundários',
    },
    {
      key: 'button_text_primary',
      label: 'Botão primário — texto',
      description: 'Cor do texto nos botões principais',
    },
    {
      key: 'button_text_secondary',
      label: 'Botão secundário — texto',
      description: 'Cor do texto nos botões secundários',
    },
  ];

  updateColor(key: keyof AppearanceSettings, value: string) {
    this.store.updateColor(key, value);
  }

  save() {
    this.api.updateAppearance(this.store.settings()).subscribe({
      next: () => toast.success('Aparência salva!'),
      error: () => toast.error('Erro ao salvar aparência.'),
    });
  }
}
