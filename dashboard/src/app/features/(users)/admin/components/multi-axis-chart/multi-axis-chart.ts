import { Component, effect, input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardModel } from '../../types/dashboard-model';

@Component({
  selector: 'app-multi-axis-chart',
  imports: [BaseChartDirective],
  templateUrl: './multi-axis-chart.html',
  styleUrl: './multi-axis-chart.css',
})
export class MultiAxisChart {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // READONLY input signal
  data = input<Partial<DashboardModel>>({});

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        label: 'Assinaturas Pro',
        data: [],
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgba(0, 0, 0, 1)',
        yAxisID: 'y',
        tension: 0.4,
      },
      {
        label: 'Novas Contas',
        data: [],
        borderColor: 'rgb(110, 110, 110)',
        backgroundColor: 'rgba(110, 110, 110, 1)',
        yAxisID: 'y1',
        tension: 0.4,
      },
    ],
    labels: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
      },
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 50,
        },
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  public lineChartType: ChartType = 'line';

  constructor() {
    effect(() => {
      const apiData = this.data();

      if (!apiData?.chart) return;

      // Atualiza os dados do gráfico com os dados da API
      this.lineChartData = {
        labels: apiData.chart.labels || [],
        datasets: [
          {
            ...this.lineChartData.datasets[0],
            data: apiData.chart.new_subscriptions || [],
          },
          {
            ...this.lineChartData.datasets[1],
            data: apiData.chart.new_users || [],
          },
        ],
      };

      this.chart?.update();
    });
  }
}
