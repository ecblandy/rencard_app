import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

import { Surface } from '../../../../../../../../shared/components/surface/surface';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [NgIcon, Surface],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq {
  readonly data = input.required<{
    isPending: boolean;
    hasNoPlan: boolean;
    features: string[];
  }>();
}
