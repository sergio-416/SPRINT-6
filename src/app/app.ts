// Root application component - entry point for Angular app
// Defines app-root selector used in index.html, renders content from app.html
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Standalone component with OnPush change detection for optimal performance
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {}
