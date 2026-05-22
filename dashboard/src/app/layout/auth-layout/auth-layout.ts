import { Component, EventEmitter, Output } from '@angular/core';
import { UiHeader } from '../../shared/ui/header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, UiHeader],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {
  @Output() submitForm = new EventEmitter<Event>();

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitForm.emit(event);
  }
}
