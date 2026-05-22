import { Component, input, output, signal } from '@angular/core';
import { UiInput } from '../../../../shared/ui/input/input';
import { UiLabel } from '../../../../shared/ui/label/label';
import { UiButton } from '../../../../shared/ui/button/button';
import { Modal } from '../../../../shared/ui/modal/modal';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-change-password-modal',
  imports: [UiInput, UiLabel, UiButton, Modal, NgIcon],
  templateUrl: './change-password-modal.html',
  styleUrl: './change-password-modal.css',
})
export class ChangePasswordModal {
  isOpen = input<boolean>(false);
  close = output<void>();

  submit() {
    this.close.emit();
  }
}
