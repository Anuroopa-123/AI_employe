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

  constructor(private http: HttpClient, private orgService: OrganizationService, private cd: ChangeDetectorRef, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadTasks();
  }
  openEdit(task: any) {
  this.selectedTask = { ...task }; // clone
  this.showEdit = true;
}
closeEdit() {
  this.showEdit = false;
}
updateTask() {
  this.http.put(
    `http://localhost:5000/api/tasks/update/${this.selectedTask.id}`,
    this.selectedTask
  ).subscribe(() => {
    this.toastr.success('Task updated successfully ');
    this.showEdit = false;
    this.loadTasks(); // refresh
  });
}
deleteTask(id: number) {
  if (!confirm("Are you sure?")) return;

  this.http.delete(`http://localhost:5000/api/tasks/delete/${id}`)
    .subscribe(() => {
    this.toastr.error('Task deleted ');
      this.loadTasks();
    });
}

loadTasks() {
  this.orgService.getAssignedTasks()
    .subscribe({
      next: (res: any) => {
        console.log("Tasks:", res);

        this.tasks = Array.isArray(res) ? res : res.data;

        this.loading = false;

        this.cd.detectChanges(); //  FORCE UI UPDATE
      },
      error: () => {
        this.loading = false;
      }
    });
}
}