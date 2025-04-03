import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from './services/auth-guard.service';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuardService]  
  },
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full'  
  },
  { 
    path: '**', 
    redirectTo: 'login'  
  }
];
