import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-roles',
  imports: [FormsModule, CommonModule],
  template: `
    <h2>Manage Roles</h2>

    <input [(ngModel)]="name" placeholder="Role Name">
    <input [(ngModel)]="desc" placeholder="Description">

    <button (click)="addRole()">Add Role</button>

    <ul>
      <li *ngFor="let r of roles">{{ r.name }}</li>
    </ul>
  `
})
export class RolesComponent {

  roles: any[] = [];
  name = '';
  desc = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.http.get('http://localhost:5000/api/roles')
      .subscribe((res: any) => this.roles = res);
  }

  addRole() {
    this.http.post('http://localhost:5000/api/roles', {
      name: this.name,
      description: this.desc
    }).subscribe(() => {
      this.loadRoles();
    });
  }
}