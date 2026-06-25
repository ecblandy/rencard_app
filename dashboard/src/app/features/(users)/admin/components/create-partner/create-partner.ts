import { Component, input, output } from '@angular/core';
import { Modal } from '../../../../../shared/ui/modal/modal';

@Component({
  selector: 'app-create-partner',
  imports: [Modal],
  templateUrl: './create-partner.html',
  styleUrl: './create-partner.css',
})
export class CreatePartner {
  isOpen = input(false);
  close = output<void>();
}
