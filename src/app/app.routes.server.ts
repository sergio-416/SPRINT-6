// Server-side route configuration for SSR prerendering
// Defines which routes should be prerendered at build time - used in app.config.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

// Prerenders all routes at build time for improved initial load performance
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
