import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Surface } from '../../../../../shared/components/surface/surface';
import { User } from '../../../../../shared/types/user.model';
import { LocalDatePipe } from '../../../../../shared/pipes/local-date.pipe.ts-pipe';
import { NgClass, UpperCasePipe } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'li[app-user-and-subscription-card]',
  standalone: true,
  imports: [Surface, LocalDatePipe, NgClass, UpperCasePipe, NgIcon],
  templateUrl: './user-and-subscription-card.html',
  styleUrl: './user-and-subscription-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'group',
  },
})
export class UserAndSubscriptionCard {
  user = input.required<User>();
}
