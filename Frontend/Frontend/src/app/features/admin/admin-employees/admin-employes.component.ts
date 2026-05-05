import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../../services/organization.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-employes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-employes.component.html',
  styleUrls: ['./admin-employes.component.css']
})
export class AdminEmployesComponent implements OnInit {

  employees: any[] = [];

  newEmployee = {
    name: '',
    email: '',
    password: '',
    role_id: 3
  };

  constructor(private http: HttpClient, private orgService: OrganizationService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.orgService.getEmployees()
      .subscribe((res: any) => {
        this.employees = res;
      });
  }

  addEmployee() {
    this.orgService.addEmployee(this.newEmployee)
      .subscribe(() => {
        alert("Employee added");
        this.loadEmployees();
      });
  }

  changeRole(emp: any, roleId: number) {
    this.orgService.updateRole({
      user_id: emp.id,
      role_id: roleId
    }).subscribe(() => {
      this.loadEmployees();
    });
  }
toggleStatus(emp: any) {
  const newStatus = emp.status === 'active' ? 'inactive' : 'active';

  this.http.post('http://localhost:5000/api/org/toggle-status', {
    user_id: emp.id,
    status: newStatus
  }).subscribe(() => {
    this.loadEmployees(); // refresh UI
  });
}
}