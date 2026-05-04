import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';

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

constructor(private http: HttpClient, private toastr: ToastrService,  private cdr: ChangeDetectorRef) {}
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
    .subscribe({
      next: () => {
        console.log("API SUCCESS");

        this.toastr.success('Task assigned successfully ');

        // FIX: delay change detection safely
        setTimeout(() => {
          this.task = {
            title: '',
            description: '',
            assigned_to: '',
            deadline: ''
          };
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error("API ERROR:", err);
        this.toastr.error('Task assignment failed ❌');
      }
    });
}
}