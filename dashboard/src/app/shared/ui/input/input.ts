import { NgClass } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { NgxMaskDirective } from 'ngx-mask';

type InputSize = 'sm' | 'xl';

type DecimalMarker = '.' | ',' | ['.', ','];

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [NgClass, FormField, NgxMaskDirective],
  templateUrl: './input.html',
  styleUrl: './input.css',
})
export class UiInput {
  type = input<string>('text');

  id = input<string | undefined>();

  placeholder = input<string | undefined>();

  formField = input<any>();

  sizeH = input<InputSize>('sm');

  error = input<boolean>(false);

  disabled = input<string | boolean | null | undefined>();

  // ============================================================
  // MASK
  // ============================================================

  mask = input<string | undefined>();

  maskType = input<'text' | 'number'>('text');

  prefix = input<string>('');

  suffix = input<string>('');

  thousandSeparator = input<string>('');

  decimalMarker = input<DecimalMarker>(',');

  separatorLimit = input<string | undefined>();

  allowNegativeNumbers = input<boolean>(true);

  validation = input<boolean | undefined>();

  // ============================================================
  // STATE
  // ============================================================

  isNumberMask = computed(() => {
    return this.maskType() === 'number';
  });

  validationEnabled = computed(() => {
    return this.validation() ?? true;
  });

  hasMask = computed(() => {
    return !!this.mask();
  });

  showPassword = signal(false);

  isPassword = computed(() => {
    return this.type() === 'password';
  });

  resolvedType = computed(() => {
    return this.isPassword() && this.showPassword() ? 'text' : this.type();
  });

  isDisabled = computed(() => {
    const attrDisabled = this.disabled();

    const fieldDisabled = this.formField()?.disabled?.();

    const resolvedAttrDisabled =
      attrDisabled === '' ||
      attrDisabled === 'true' ||
      attrDisabled === 'disabled' ||
      attrDisabled === true;

    return resolvedAttrDisabled || fieldDisabled === true;
  });

  inputClasses = computed(() =>
    [
      'w-full rounded-[.625rem] border pl-[1rem] pr-[3rem]',

      this.sizeH() === 'xl' ? 'h-[3.75rem]' : 'h-[2.375rem]',

      this.error()
        ? 'bg-error-soft border-error outline-error'
        : this.isDisabled()
          ? 'bg-neutral-soft border-neutral-soft text-neutral-strong cursor-not-allowed opacity-70'
          : 'bg-white border-neutral-soft placeholder:text-neutral-medium',
    ].join(' '),
  );

  togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  preventFocus(event: MouseEvent): void {
    event.preventDefault();
  }
}
