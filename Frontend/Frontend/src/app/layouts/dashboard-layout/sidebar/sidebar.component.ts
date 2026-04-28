import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports:[CommonModule,FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  user = JSON.parse(sessionStorage.getItem('user') || '{}');

  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }
}