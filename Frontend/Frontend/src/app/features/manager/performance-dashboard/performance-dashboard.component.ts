import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-performance-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './performance-dashboard.component.html',
  styleUrls: ['./performance-dashboard.component.css']
})
export class PerformanceDashboardComponent implements OnInit {

  metrics: any = null;

  user: any = JSON.parse(sessionStorage.getItem('user') || '{}');

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPerformance();
  }

  loadPerformance() {

    // ✅ DYNAMIC USER
    const employeeId = this.user.org_user_id;

    this.http.get(
      `http://localhost:5000/api/performance/generate/${employeeId}`
    ).subscribe({
      next: (res: any) => {

        console.log("PERFORMANCE:", res);

        this.metrics = res.metrics;
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

  getPerformanceLabel(score: number): string {

    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Average';

    return 'Needs Improvement';
  }

}