import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-teste',
  imports: [],
  templateUrl: './teste.html',
  styleUrl: './teste.css',
})
export class Teste {
  debugMode = signal(true);

  // flags granulares
  debugMask = signal(true);
  debugFormField = signal(true);
  debugClasses = signal(true);
}
