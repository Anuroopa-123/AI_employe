import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray, transferArrayItem,DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-employee-tasks',
  standalone: true,
  imports: [CommonModule,FormsModule,DragDropModule],
  templateUrl: './employees-task.component.html',
  styleUrls: ['./employees-task.component.css']
})
export class EmployeeTasksComponent implements OnInit {

  tasks: any[] = [];
  previewUrl: any = null;
  pendingTasks: any[] = [];
  progressTasks: any[] = [];
  completedTasks: any[] = [];

  constructor(private http: HttpClient, private cd: ChangeDetectorRef,private toastr: ToastrService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.http.get('http://localhost:5000/api/tasks/my-tasks')
      .subscribe((res: any) => {
         console.log("EMP TASKS:", res);
        this.tasks = res;
        this.pendingTasks = this.tasks.filter(t => t.status === 'pending');
        this.progressTasks = this.tasks.filter(t => t.status === 'in_progress');
        this.completedTasks = this.tasks.filter(t => t.status === 'completed');
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
    this.toastr.success('Status updated successfully');

    // reload tasks so UI syncs
    this.loadTasks();
  });
}
markComplete(taskId: number) {
  this.http.put(`http://localhost:5000/api/tasks/status/${taskId}`, {
    status: 'completed'
  }).subscribe(() => {
    this.toastr.success('Task marked as completed');
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
        this.toastr.success('Work submitted successfully');

        // RESET UI
        task.uploading = false;
        task.workLog = '';
        task.selectedFile = null;
        task.hours = null;

        //  FORCE FULL REFRESH
        this.tasks = [];
        this.loadTasks();
      },
      error: () => {
        this.toastr.error('Upload failed');
        task.uploading = false;
      }
    });
}

onFileSelect(event: any, task: any) {
  const file = event.target.files[0];

  if (!file) return;

  task.selectedFile = file; // store file temporarily
}
drop(event: CdkDragDrop<any[]>, status: string) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    const task = event.container.data[event.currentIndex];
    this.updateStatus(task.id, { target: { value: status } });
  }

  //  SAVE FULL ORDER
  this.saveAllOrders();
}
saveAllOrders() {
  const allTasks = [
    ...this.pendingTasks,
    ...this.progressTasks,
    ...this.completedTasks
  ];

  const orderData = allTasks.map((task, index) => ({
    id: task.id,
    order_index: index
  }));

  this.http.put('http://localhost:5000/api/tasks/reorder', orderData)
    .subscribe(() => console.log("Order saved"));
}
openFile(task: any) {
  this.previewUrl = 'http://localhost:5000/uploads/' + task.attachment_url;
}
}