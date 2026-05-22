import { Component, computed, input, booleanAttribute } from '@angular/core';

type ButtonSize = 'sm' | 'xl';
type ButtonVariant = 'default' | 'outline' | 'custom' | 'destructive';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrls: ['./button.css'],
  standalone: true,
})
export class UiButton {
  // Inputs como Signals
  sizeH = input<ButtonSize>('sm');
  variant = input<ButtonVariant>('default');

  disabled = input(false, {
    transform: booleanAttribute,
  });

  type = input<'button' | 'submit' | 'reset'>('button');
  class = input<string | undefined>(undefined);

  private sizeMap: Record<ButtonSize, string> = {
    sm: 'h-[2.5rem]',
    xl: 'h-[3.75rem]',
  };

  private variantMap: Record<ButtonVariant, string> = {
    default: 'bg-black text-white',
    outline: 'border-1 border-black text-black ',
    custom: '',
    destructive: `
      text-neutral-900
      hover:bg-red-100
      hover:text-red-700
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-red-600
      focus-visible:ring-offset-2
      cursor-pointer
    `,
  };

  private baseClass =
    'font-manrope font-medium rounded-[.625rem] px-4 py-2 transition-all duration-300 ease-in-out';

  // Computed Signal
  buttonClass = computed(() => {
    return [
      this.baseClass,
      this.sizeMap[this.sizeH()],
      this.variantMap[this.variant()],
      this.disabled() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-70',
      this.class(),
    ]
      .filter(Boolean)
      .join(' ');
  });
}
