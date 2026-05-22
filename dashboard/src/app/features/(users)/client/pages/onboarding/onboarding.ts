import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-onboarding',
  imports: [RouterOutlet],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css',
})
export class Onboarding {}
