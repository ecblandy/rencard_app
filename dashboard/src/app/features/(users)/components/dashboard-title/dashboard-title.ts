import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard-title',
  imports: [],
  templateUrl: './dashboard-title.html',
  styleUrl: './dashboard-title.css',
})
export class DashboardTitle {
  title = input<string>();
  description = input<string>();
}
