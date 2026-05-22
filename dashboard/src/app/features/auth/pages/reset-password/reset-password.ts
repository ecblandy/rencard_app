import { Component, signal } from '@angular/core';
import { form, submit } from '@angular/forms/signals';
import { AuthForm } from '../../../../shared/components/auth-form/auth-form';
import { UiButton } from '../../../../shared/ui/button/button';
import { UiInput } from '../../../../shared/ui/input/input';
import { UiLabel } from '../../../../shared/ui/label/label';

interface ResetPasswordModel {
  code: string;
  password: string;
}

@Component({
  selector: 'app-reset-password',
  imports: [AuthForm, UiLabel, UiInput, UiButton],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  resetPasswordModel = signal<ResetPasswordModel>({
    code: '',
    password: '',
  });

  resetPasswordForm = form(this.resetPasswordModel);

  onSubmit(event: Event) {
    submit(this.resetPasswordForm, async () => {
      const credentials = this.resetPasswordModel();
      console.log('Logging in with:', credentials);
    });
  }
}
