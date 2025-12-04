// Client-side route configuration
// Maps URL paths to components - used in app.config.ts and rendered in app.html
import { Routes } from '@angular/router';
import { WelcomePage } from './components/welcome-page/welcome-page';
import { ProductsForm } from './components/products-form/products-form';

// Route definitions: home page (WelcomePage) and budget calculator (ProductsForm)
export const routes: Routes = [
  {
    path: '',
    component: WelcomePage,
  },
  {
    path: 'budget',
    component: ProductsForm,
  },
  {
    // Redirects unknown paths to home
    path: '**',
    redirectTo: '',
  },
];
