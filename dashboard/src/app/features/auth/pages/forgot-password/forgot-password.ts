import { Component, signal } from '@angular/core';
import { form, submit } from '@angular/forms/signals';
import { UiButton } from '../../../../shared/ui/button/button';
import { UiInput } from '../../../../shared/ui/input/input';
import { AuthForm } from '../../../../shared/components/auth-form/auth-form';
import { UiLabel } from '../../../../shared/ui/label/label';

interface ForgotPasswordModel {
  email: string;
}

@Component({
  selector: 'app-forgot-password',
  imports: [AuthForm, UiLabel, UiInput, UiButton],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  forgotPasswordModel = signal<ForgotPasswordModel>({
    email: '',
  });

  forgotPasswordForm = form(this.forgotPasswordModel);

  onSubmit(event: Event) {
    submit(this.forgotPasswordForm, async () => {
      const credentials = this.forgotPasswordModel();
      console.log('Logging in with:', credentials);
    });
  }
}
