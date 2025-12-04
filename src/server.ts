// Express server for Angular SSR (Server-Side Rendering)
// Handles HTTP requests and renders Angular app on server before sending to client
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

// Path to pre-built client application files
const browserDistFolder = join(import.meta.dirname, '../browser');

// Express application instance
const app = express();
// Angular SSR engine for rendering app on server
const angularApp = new AngularNodeAppEngine();

// Serves static files (JS, CSS, images) with 1-year cache and disabled directory indexing
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

// SSR middleware - handles all non-static requests
// Renders Angular app on server and returns HTML response
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

// Starts server if this is the main module or running under PM2
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Exports request handler for serverless/edge deployment
export const reqHandler = createNodeRequestHandler(app);
