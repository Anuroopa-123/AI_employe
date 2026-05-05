import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../../../services/organization.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assigned-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assigned-tasks.component.html',
  styleUrls: ['./assigned-tasks.component.css']
})
export class AssignedTasksComponent implements OnInit {

  tasks: any[] = [];
  loading = true;
  showEdit = false;
  selectedTask: any = {};

  constructor(
    private http: HttpClient,
    private orgService: OrganizationService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

loadTasks() {
    this.loading = true;
    this.cdr.detectChanges();

    this.orgService.getAssignedTasks().subscribe({
      next: (res: any) => {
        console.log("✅ API RESPONSE RECEIVED:", res);

        this.tasks = Array.isArray(res) ? res : [];

        this.loading = false;
        this.cdr.detectChanges();        // Force UI update
      },
      error: (err) => {
        console.error("❌ API ERROR:", err);
        this.tasks = [];
        this.loading = false;
        this.cdr.detectChanges();
        this.toastr.error('Failed to load tasks');
      }
    });
  }
  openEdit(task: any) {
    this.selectedTask = { ...task };
    this.showEdit = true;
  }

  closeEdit() {
    this.showEdit = false;
    this.selectedTask = {};
  }

  updateTask() {
    if (!this.selectedTask.id) return;

    this.http.put(`http://localhost:5000/api/tasks/update/${this.selectedTask.id}`, this.selectedTask)
      .subscribe({
        next: () => {
          this.toastr.success('Task updated successfully');
          this.closeEdit();
          this.loadTasks();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to update task');
        }
      });
  }

  deleteTask(id: number) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    this.http.delete(`http://localhost:5000/api/tasks/delete/${id}`)
      .subscribe({
        next: () => {
          this.toastr.success('Task deleted successfully');
          this.loadTasks();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to delete task');
        }
      });
  }
}