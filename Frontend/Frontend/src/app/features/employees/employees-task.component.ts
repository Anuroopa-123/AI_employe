import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employees-task.component.html',
  styleUrls: ['./employees-task.component.css']
})
export class EmployeeTasksComponent implements OnInit {

  tasks: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.http.get('http://localhost:5000/api/tasks/my-tasks')
      .subscribe((res: any) => {
        this.tasks = res;
      });
  }
}