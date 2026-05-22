import { NgClass } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { NgxMaskDirective } from 'ngx-mask';

type InputSize = 'sm' | 'xl';

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

  // MASK
  mask = input<string | undefined>();
  maskType = input<'text' | 'number'>('text');

  prefix = input<string | undefined>();
  suffix = input<string | undefined>();
  thousandSeparator = input<any>();
  decimalMarker = input<any>();
  separatorLimit = input<string | undefined>();
  allowNegativeNumbers = input<boolean>(true);
  validation = input<boolean | undefined>();

  isNumberMask = computed(() => this.maskType() === 'number');
  validationEnabled = computed(() => this.validation() ?? true);
  hasMask = computed(() => !!this.mask());

  showPassword = signal(false);

  isPassword = computed(() => this.type() === 'password');

  resolvedType = computed(() => (this.isPassword() && this.showPassword() ? 'text' : this.type()));

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

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  preventFocus(event: MouseEvent) {
    event.preventDefault();
  }
}
