import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports:[CommonModule,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  user: any;

  constructor(private router: Router) {
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

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}