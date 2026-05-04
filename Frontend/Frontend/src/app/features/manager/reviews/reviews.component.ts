import { Component,OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  tasks: any[] = [];

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef,private toastr: ToastrService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.http.get('http://localhost:5000/api/tasks/assigned')
      .subscribe((res: any) => {
        this.tasks = res;
         this.cdRef.detectChanges();
      });
  }

  review(taskId: number, status: string) {
    this.http.put(`http://localhost:5000/api/tasks/review/${taskId}`, {
      completion_status: status
    }).subscribe(() => {
      this.toastr.success('Review Updated Successfully ');
      this.loadTasks();
    });
  }
submitReview(task: any) {

  if (!task.rating) {
    this.toastr.error('Please select a rating');
    return;
  }

  this.http.post('http://localhost:5000/api/tasks/review', {
    task_id: task.id,
    employee_id: task.assigned_to,
    rating: task.rating,
    comments: task.comments
  }).subscribe(() => {
    this.toastr.success('Feedback submitted successfully');
    this.loadTasks();
  });
}
}