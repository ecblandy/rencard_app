import { Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-switch-button',
  imports: [],
  templateUrl: './switch-button.html',
  styleUrl: './switch-button.css',
})
export class SwitchButton {
  checked = input<boolean>(false);
  disabled = input<boolean>(false);
  checkedChange = output<boolean>();

  constructor() {
    effect(() => {
      console.log('checked:', this.checked()); // vai logar o valor real após inicialização
    });
  }

  toggleSwitch() {
    if (this.disabled()) return;
    this.checkedChange.emit(!this.checked());
  }
}
