import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Chart from 'chart.js/auto'; // ✅ ADD THIS

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  intervalId: any;
  user: any;

  // ✅ ADD THIS
  topEmployees: any[] = [];

  constructor(private router: Router, private authService: AuthService) {
    const data = sessionStorage.getItem('user');

    if (data && data !== 'undefined') {
      try {
        this.user = JSON.parse(data);
      } catch {
        this.user = null;
      }
    } else {
      this.user = null;
    }
  }

  ngOnInit() {
    this.startSessionCheck();

    // ✅ LOAD MANAGER DATA
    this.loadManagerStats();
  }

  // ✅ SESSION CHECK (your existing logic moved to function)
  startSessionCheck() {
    this.intervalId = setInterval(() => {
      fetch('http://localhost:5000/api/auth/check-session', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      }).then(res => {
        if (res.status === 401) {
          clearInterval(this.intervalId);
          sessionStorage.clear();
          alert("Logged out from another device");
          this.router.navigate(['/login']);
        }
      });
    }, 3000);
  }

  // ✅ ADD THIS FUNCTION
  loadManagerStats() {
    if (this.user?.role !== 'Manager') return;

    fetch('http://localhost:5000/api/manager/stats', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then((data) => {
      this.topEmployees = data.topEmployees || [];

      setTimeout(() => this.renderChart(), 0);
    });
  }

  // ✅ ADD THIS FUNCTION
  renderChart() {

    if (!this.topEmployees.length) return;

    new Chart("managerEmployeeChart", {
      type: 'pie',
      data: {
        labels: this.topEmployees.map(e => e.name),
        datasets: [{
          data: this.topEmployees.map(e => e.completed)
        }]
      }
    });

  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        sessionStorage.clear();
        this.router.navigate(['/login']);
      },
      error: () => {
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}