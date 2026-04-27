import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { OrganizationService } from '../../services/organization.service';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  employees: any[] = [];

  newEmployee = {
    name: '',
    email: '',
    password: '',
    role_id: 3
  };

constructor(private orgService: OrganizationService) {}

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
}