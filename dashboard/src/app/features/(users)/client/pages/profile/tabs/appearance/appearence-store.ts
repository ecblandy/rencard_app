import { Injectable, signal } from '@angular/core';

export interface AppearanceSettings {
  background_color: string;
  button_bg_primary: string;
  button_bg_secondary: string;
  button_text_primary: string;
  button_text_secondary: string;
  text_primary: string;
  text_secondary: string;
}

@Injectable({ providedIn: 'root' })
export class AppearanceStore {
  readonly settings = signal<AppearanceSettings>({
    background_color: '#ffffff',
    button_bg_primary: '#000000',
    button_bg_secondary: '#f5f5f5',
    button_text_primary: '#ffffff',
    button_text_secondary: '#000000',
    text_primary: '#000000',
    text_secondary: '#6b7280',
  });

  updateColor(key: keyof AppearanceSettings, value: string) {
    this.settings.update((prev) => ({ ...prev, [key]: value }));
  }

  setFromProfile(profile: Partial<AppearanceSettings>) {
    this.settings.update((prev) => ({
      ...prev,
      background_color: profile.background_color || prev.background_color,
      button_bg_primary: profile.button_bg_primary || prev.button_bg_primary,
      button_bg_secondary: profile.button_bg_secondary || prev.button_bg_secondary,
      button_text_primary: profile.button_text_primary || prev.button_text_primary,
      button_text_secondary: profile.button_text_secondary || prev.button_text_secondary,
      text_primary: profile.text_primary || prev.text_primary,
      text_secondary: profile.text_secondary || prev.text_secondary,
    }));
  }
}
