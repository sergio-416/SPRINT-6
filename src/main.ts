// Client-side bootstrap entry point - runs in browser
// Initializes Angular app for client-side rendering
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Bootstraps root component with client configuration
// Catches and logs any bootstrap errors to console
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
