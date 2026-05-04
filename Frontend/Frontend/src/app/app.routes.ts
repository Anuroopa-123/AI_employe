import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RegisterComponent } from './features/auth/login/register/register.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { ManagerComponent } from './features/manager/manager.component';
import { AdminEmployesComponent } from './features/admin/admin-employees/admin-employes.component';
import { EmployeeTasksComponent } from './features/employees/employees-task.component';
import { AssignedTasksComponent } from './features/manager/assigned-tasks/assigned-tasks.component';
import { ManagerDashboardComponent } from './features/manager/manager-dashboard/manager-dashboard.component';
import { ReviewsComponent } from './features/manager/reviews/reviews.component';
import { EmployeesWorklogsComponent } from './features/employees/employees-worklogs/employees-worklogs.component';


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
      { path: 'manager', component: ManagerDashboardComponent },
      {
        path: 'manager/reviews',
        component: ReviewsComponent,
      },
      { path: 'manager/tasks', component: ManagerComponent },
      {
        path: 'manager/assigned',
        component: AssignedTasksComponent,
      },
      { path: 'employee', component: DashboardComponent },

      {
        path: 'employee/tasks',
        component: EmployeeTasksComponent,
      },
      {
        path: 'employee/worklogs',
        component: EmployeesWorklogsComponent,
      },
      { path: 'admin-employes', component: AdminEmployesComponent },
    ],
  },
];
