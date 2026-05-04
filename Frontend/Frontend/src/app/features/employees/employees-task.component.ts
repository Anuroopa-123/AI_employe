import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-tasks',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './employees-task.component.html',
  styleUrls: ['./employees-task.component.css']
})
export class EmployeeTasksComponent implements OnInit {

  tasks: any[] = [];

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.http.get('http://localhost:5000/api/tasks/my-tasks')
      .subscribe((res: any) => {
         console.log("EMP TASKS:", res);
        this.tasks = res;
        this.cd.detectChanges();
      });
  }
  updateStatus(taskId: number, event: any) {
  const status = event.target.value;

  this.http.put(
    `http://localhost:5000/api/tasks/status/${taskId}`,
    { status }
  ).subscribe(() => {
    console.log("Status updated");

    // reload tasks so UI syncs
    this.loadTasks();
  });
}
markComplete(taskId: number) {
  this.http.put(`http://localhost:5000/api/tasks/status/${taskId}`, {
    status: 'completed'
  }).subscribe(() => {
    alert("Marked as completed");
    this.loadTasks();
  });
}

submitWork(task: any) {
  const formData = new FormData();

  formData.append('task_id', task.id);
  formData.append('description', task.workLog || '');
  formData.append('hours_spent', task.hours || 0);

  if (task.selectedFile) {
    formData.append('file', task.selectedFile);
  }

  task.uploading = true;

  this.http.post('http://localhost:5000/api/worklogs/add', formData)
    .subscribe({
      next: () => {
        alert("Work submitted");

        // RESET UI
        task.uploading = false;
        task.workLog = '';
        task.selectedFile = null;
        task.hours = null;

        // 🔥 FORCE FULL REFRESH
        this.tasks = [];
        this.loadTasks();
      },
      error: () => {
        alert("Upload failed");
        task.uploading = false;
      }
    });
}

onFileSelect(event: any, task: any) {
  const file = event.target.files[0];

  if (!file) return;

  task.selectedFile = file; // store file temporarily
}
}