// Server-side application configuration for SSR
// Merges client config with SSR-specific providers - used in main.server.ts
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

// Server-specific configuration - adds SSR providers and server routes
const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes))],
};

// Combines client config with server config for complete SSR setup
export const config = mergeApplicationConfig(appConfig, serverConfig);
