import {
  Component,
  effect,
  input,
  model,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Surface } from '../surface/surface';
import { NgIcon } from '@ng-icons/core';

export interface MetricOption {
  label: string;
  value: number | string;
  icon: string; // nome do ícone do ng-icon
}

@Component({
  selector: 'app-metric-card',
  imports: [NgIcon],
  templateUrl: './metric-card.html',
  styleUrl: './metric-card.css',
})
export class MetricCard {
  metrics = input<MetricOption[]>();
}
