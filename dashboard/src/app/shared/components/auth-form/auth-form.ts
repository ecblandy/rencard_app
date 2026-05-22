import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-auth-form',
  imports: [],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.css',
})
export class AuthForm {
  title = input<string>();
  subtitle = input<string>();

  @Output() submitForm = new EventEmitter<Event>();

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitForm.emit(event);
  }
}
