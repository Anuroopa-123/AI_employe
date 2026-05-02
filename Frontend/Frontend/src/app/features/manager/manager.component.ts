import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent {
  employees: any[] = [];

  task = {
    title: '',
    description: '',
    assigned_to: '',
    deadline: ''
  };

constructor(private http: HttpClient) {}
ngOnInit() {
  this.loadEmployees();
}

loadEmployees() {
  this.http.get('http://localhost:5000/api/org/employees')
    .subscribe((res: any) => {
      this.employees = res;
    });
}

assignTask() {
  this.http.post('http://localhost:5000/api/tasks/assign', this.task)
    .subscribe(() => {
      alert("Task assigned");
    });
}
}