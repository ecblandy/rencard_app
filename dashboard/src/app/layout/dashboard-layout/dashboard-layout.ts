import { Component } from '@angular/core';
import { Sidebar } from "../../shared/components/sidebar/sidebar";
import { RouterOutlet } from "@angular/router";
import { UiHeader } from "../../shared/ui/header/header";

@Component({
  selector: 'app-dashboard-layout',
  imports: [Sidebar, RouterOutlet, UiHeader],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {

}
