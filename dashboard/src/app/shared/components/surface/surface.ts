import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-surface',
  imports: [NgClass],
  templateUrl: './surface.html',
  styleUrl: './surface.css',
})
export class Surface {
  classes = input<string | string[]>();
}
