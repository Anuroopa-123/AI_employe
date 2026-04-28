import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RegisterComponent } from './features/auth/login/register/register.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
    {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: 'admin', component: AdminDashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
    ]
  }

];
