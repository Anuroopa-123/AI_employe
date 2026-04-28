import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  user = JSON.parse(sessionStorage.getItem('user') || '{}');

  constructor(private router: Router) {}

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}