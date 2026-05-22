import { Component, input } from '@angular/core';

@Component({
  selector: 'app-surface-title',
  imports: [],
  templateUrl: './surface-title.html',
  styleUrl: './surface-title.css',
})
export class SurfaceTitle {
  title = input<string>('');
  description = input<string>('');
}
