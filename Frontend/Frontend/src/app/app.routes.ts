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
import { ProfileComponent } from './features/user/profile.component';
import { PerformanceDashboardComponent } from './features/employees/employee-performance/employee-performance.component';
import { AiFeedbackComponent } from './features/ai-feedback/ai-feedback.component';
import { AiChatComponent } from './features/employees/ai-chat/ai-chat.component';
import { KnowledgeUploadComponent } from './features/admin/knowledge-upload/knowledge-upload.component';
import { authGuard } from './core/guards/auth.guard';
import { CertificateGeneratorComponent } from './features/admin/certificate-generator/certificate-generator.component';
import { ManagerCertificatesComponent } from './features/manager/manager-certificates/manager-certificates.component';
import { EmployeeCertificatesComponent } from './features/employees/employee-certificates/employee-certificates.component';
import { VerifyCertificateComponent } from './features/certificate/verify-certificate.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
    {
    path: 'verify-certificate/:token',
    component: VerifyCertificateComponent
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'admin', component: AdminDashboardComponent },
      {
        path: 'admin/knowledge-upload',
        component: KnowledgeUploadComponent

      },
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
      {path:'profile', component: ProfileComponent},
      {path:'employee/performance', component: PerformanceDashboardComponent},
      {
        path:'employee/ai-feedback',component: AiFeedbackComponent
      },
      {
        path:'employee/ai-chat',component: AiChatComponent
      },
    {
      path:'admin/certificates',component: CertificateGeneratorComponent
    },
    {
  path: 'manager/certificates',
  component: ManagerCertificatesComponent
},
{
  path: 'manager/performance',
  component: PerformanceDashboardComponent
},
{
  path: 'employee/certificates',
  component: EmployeeCertificatesComponent
},

    ],
  },
];
