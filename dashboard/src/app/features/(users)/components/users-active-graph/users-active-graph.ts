import { Component, computed, effect, input, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ViewsByDay } from '../../client/types/dashboard';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-users-active-graph',
  imports: [BaseChartDirective, NgIcon],
  templateUrl: './users-active-graph.html',
  styleUrl: './users-active-graph.css',
})
export class UsersActiveGraph {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  range = input<'today' | '7d' | '30d'>();
  data = input<ViewsByDay[]>([]); // ← dados reais da API
  hasData = computed(() => this.data().length > 0);

  private mockDataSets = {
    today: { labels: ['00h', '06h', '12h', '18h', '24h'], data: [5, 15, 10, 20, 8] },
    '7d': {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      data: [65, 59, 80, 81, 56, 70, 60],
    },
    '30d': {
      labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
      data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
    },
  };

  chartConfig: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          label: 'Visitas',
          borderColor: '#2B72FB',
          backgroundColor: '#2b70fba2',
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
      },
    },
  };

  constructor() {
    effect(() => {
      const apiData = this.data();
      const range = this.range();

      // Dados reais têm prioridade; fallback para mock
      const resolved =
        apiData.length > 0
          ? { labels: apiData.map((d) => d.label), data: apiData.map((d) => d.total) }
          : this.mockDataSets[range ?? '7d'];

      this.chartConfig.data = {
        labels: [...resolved.labels],
        datasets: [{ ...this.chartConfig.data.datasets[0], data: [...resolved.data] }],
      };

      this.chart?.update();
    });
  }
}
