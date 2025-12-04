// Server-side bootstrap entry point for SSR (Server-Side Rendering)
// Used by server.ts for rendering Angular app on the server
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

// Initializes Angular app with SSR context - receives context from Angular SSR engine
// Returns Promise that resolves when app is ready to handle requests
const bootstrap = (context: BootstrapContext) => bootstrapApplication(App, config, context);

export default bootstrap;
