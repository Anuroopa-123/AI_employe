import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-performance-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-performance.component.html',
  styleUrls: ['./employee-performance.component.css']
})
export class PerformanceDashboardComponent implements OnInit {

  metrics: any = null;
  user: any = JSON.parse(sessionStorage.getItem('user') || '{}');

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadPerformance();
  }

  loadPerformance() {
    const employeeId = this.user?.org_user_id || this.user?.id;

    if (!employeeId) {
      console.error("No employee ID found");
      return;
    }

    this.http.get(`http://localhost:5000/api/performance/generate/${employeeId}`)
      .subscribe({
        next: (res: any) => {
          console.log("PERFORMANCE RESPONSE:", res);
          
          this.metrics = res.metrics || res;   // Handle both cases
          this.cdr.detectChanges();             // Force UI update
        },
        error: (err) => {
          console.error("Performance API Error:", err);
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