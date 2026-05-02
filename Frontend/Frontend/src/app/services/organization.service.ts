import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  private API = 'http://localhost:5000/api/org';

  constructor(private http: HttpClient) {}

  getEmployees() {
    return this.http.get(`${this.API}/employees`);
  }

  addEmployee(data: any) {
    return this.http.post(`${this.API}/add-employee`, data);
  }

  updateRole(data: any) {
    return this.http.post(`${this.API}/update-role`, data);
  }
  getAssignedTasks() {
  return this.http.get('http://localhost:5000/api/tasks/assigned');
}
}