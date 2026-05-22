import { Component, input, output, signal } from '@angular/core';
import { Modal } from "../../../../shared/ui/modal/modal";
import { UiLabel } from "../../../../shared/ui/label/label";
import { UiInput } from "../../../../shared/ui/input/input";
import { UiButton } from "../../../../shared/ui/button/button";

@Component({
  selector: 'app-change-email-modal',
  imports: [Modal, UiLabel, UiInput, UiButton],
  templateUrl: './change-email-modal.html',
  styleUrl: './change-email-modal.css',
})
export class ChangeEmailModal {
  isOpen = input<boolean>(false);
  close = output<void>();

  email = signal('');
  password = signal('');

  submit() {
    this.close.emit();
  }
}
