import { Routes } from '@angular/router';
import { WelcomePage } from './components/welcome-page/welcome-page';
import { ProductsForm } from './components/products-form/products-form';

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
    path: '**',
    redirectTo: '',
  },
];
