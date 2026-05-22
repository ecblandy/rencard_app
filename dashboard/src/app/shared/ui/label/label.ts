import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

type LabelVariant = 'default' | 'auth';

@Component({
  selector: 'app-label',
  imports: [NgClass],
  templateUrl: './label.html',
  styleUrl: './label.css',
})
export class UiLabel {
  variant = input<LabelVariant>('default');
  error = input<boolean>(false);
  for = input<string | undefined>();
  class = input<string>();

  labelClasses() {
    return [
      this.error() ? 'text-error' : '',
      this.variant() === 'auth' ? 'text-neutral-strong' : 'text-black mb-[.5rem] block',
    ].join(' ');
  }
}
