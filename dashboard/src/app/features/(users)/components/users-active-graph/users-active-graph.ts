import { Component, computed, effect, input, ViewChild } from '@angular/core';

import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { NgIcon } from '@ng-icons/core';

import { ViewsByDay } from '../../client/types/dashboard';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-users-active-graph',
  standalone: true,
  imports: [BaseChartDirective, NgIcon, DecimalPipe],
  templateUrl: './users-active-graph.html',
  styleUrl: './users-active-graph.css',
})
export class UsersActiveGraph {
  @ViewChild(BaseChartDirective)
  chart?: BaseChartDirective;

  range = input<'today' | '7d' | '30d'>('7d');

  data = input<ViewsByDay[]>([]);

  hasData = computed(() => this.data().length > 0);

  /*
   * =========================================================
   * DADOS RESOLVIDOS
   * =========================================================
   */

  resolvedData = computed(() => {
    const apiData = this.data();

    if (apiData.length > 0) {
      return {
        labels: apiData.map((item) => item.label),
        values: apiData.map((item) => item.total),
      };
    }

    return {
      labels: [],
      values: [],
    };
  });

  /*
   * =========================================================
   * ESTATÍSTICAS
   * =========================================================
   */

  totalViews = computed(() => {
    return this.resolvedData().values.reduce((total, value) => total + value, 0);
  });

  averageViews = computed(() => {
    const values = this.resolvedData().values;

    if (!values.length) {
      return 0;
    }

    return Math.round(this.totalViews() / values.length);
  });

  peakViews = computed(() => {
    const values = this.resolvedData().values;

    if (!values.length) {
      return 0;
    }

    return Math.max(...values);
  });

  peakIndex = computed(() => {
    const values = this.resolvedData().values;

    if (!values.length) {
      return -1;
    }

    return values.indexOf(this.peakViews());
  });

  peakLabel = computed(() => {
    const index = this.peakIndex();

    if (index < 0) {
      return '-';
    }

    return this.resolvedData().labels[index] ?? '-';
  });

  rangeLabel = computed(() => {
    switch (this.range()) {
      case 'today':
        return 'Hoje';

      case '7d':
        return 'Últimos 7 dias';

      case '30d':
        return 'Últimos 30 dias';

      default:
        return 'Período';
    }
  });

  /*
   * =========================================================
   * CONFIGURAÇÃO DO GRÁFICO
   * =========================================================
   */

  chartConfig: ChartConfiguration<'line'> = {
    type: 'line',

    data: {
      labels: [],

      datasets: [
        {
          data: [],

          label: 'Visualizações',

          borderColor: '#171717',

          backgroundColor: 'rgba(23, 23, 23, 0.08)',

          borderWidth: 2,

          pointRadius: 0,

          pointHoverRadius: 5,

          pointHoverBorderWidth: 2,

          pointBackgroundColor: '#ffffff',

          pointHoverBackgroundColor: '#171717',

          fill: true,

          tension: 0.4,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      interaction: {
        mode: 'index',
        intersect: false,
      },

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          enabled: true,

          backgroundColor: '#171717',

          titleColor: '#ffffff',

          bodyColor: '#d4d4d4',

          borderColor: '#404040',

          borderWidth: 1,

          padding: 12,

          displayColors: false,

          callbacks: {
            title: (items) => {
              return items[0]?.label ?? '';
            },

            label: (context) => {
              return ` ${context.parsed.y} visualizações`;
            },
          },
        },
      },

      scales: {
        x: {
          grid: {
            display: false,
          },

          border: {
            display: false,
          },

          ticks: {
            color: '#a3a3a3',

            font: {
              family: 'Manrope',
              size: 11,
            },

            maxRotation: 0,
          },
        },

        y: {
          beginAtZero: true,

          border: {
            display: false,
          },

          grid: {
            color: 'rgba(229, 229, 229, 0.7)',
          },

          ticks: {
            color: '#a3a3a3',

            font: {
              family: 'Manrope',
              size: 11,
            },

            precision: 0,

            padding: 8,
          },
        },
      },

      animation: {
        duration: 700,

        easing: 'easeOutQuart',
      },
    },
  };

  /*
   * =========================================================
   * ATUALIZAÇÃO
   * =========================================================
   */

  constructor() {
    effect(() => {
      const resolved = this.resolvedData();

      this.chartConfig.data = {
        labels: [...resolved.labels],

        datasets: [
          {
            ...this.chartConfig.data.datasets[0],

            data: [...resolved.values],
          },
        ],
      };

      this.chart?.update();
    });
  }
}
