import { Component, signal } from '@angular/core';
import { ProductsForm } from './components/products-form/products-form';

@Component({
  selector: 'app-root',
  imports: [ProductsForm],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('SPRINT-6');
}
