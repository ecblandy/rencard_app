import { Component, model } from '@angular/core';
import { UiButton } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-period-filter',
  standalone: true,
  imports: [UiButton],
  templateUrl: './period-filter.html',
})
export class PeriodFilter {
  // model() cria um ModelSignal (writable) — child pode set/update
  period = model<'today' | '7d' | '30d'>();

  setPeriod(value: 'today' | '7d' | '30d') {
    // model é writeable: pode usar set ou update
    this.period.set(value);
  }
}
