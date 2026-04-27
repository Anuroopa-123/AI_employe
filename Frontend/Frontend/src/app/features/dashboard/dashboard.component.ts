import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  // (inside class)
 ngOnInit() {
  this.intervalId = setInterval(() => {
    fetch('http://localhost:5000/api/auth/check-session', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    }).then(res => {
      if (res.status === 401) {

        //  STOP LOOP FIRST
        clearInterval(this.intervalId);

        sessionStorage.clear();

        alert("Logged out from another device");

        this.router.navigate(['/login']);
      }
    });
  }, 3000);
}

  // (inside class)
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