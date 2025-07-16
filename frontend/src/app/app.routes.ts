import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import {RegisterComponent} from './auth/register/register.component';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: RegisterComponent
  },
];
