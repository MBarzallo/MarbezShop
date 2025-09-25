import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Blog } from './pages/blog/blog';
import { Categories } from './pages/categories/categories';
import { CategoryPage } from './pages/category-page/category-page';
import { ProductPage } from './pages/product-page/product-page';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Cart } from './pages/cart/cart';
import { authGuard } from './shared/guards/auth-guard';
import { Checkout } from './pages/checkout/checkout';
import { Landing } from './pages/landing/landing';

const eventDeadline = new Date('2025-10-05T20:30:00');

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'landing', component: Landing },
  { path: 'home', component: Home },
  { path: 'blog', component: Blog },
  { path: 'categories', component: Categories },
  { path: 'category/:id', component: CategoryPage },
  { path: 'product/:id', component: ProductPage },
  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Register },
  { path: 'cart', component: Cart },
  { path: 'checkout', canActivate: [authGuard], component: Checkout },
  { path: '**', redirectTo: '' },
];
