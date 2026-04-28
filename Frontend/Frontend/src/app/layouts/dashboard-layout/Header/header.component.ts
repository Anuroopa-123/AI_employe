import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input() pageTitle: string = 'Dashboard';

  user = JSON.parse(sessionStorage.getItem('user') || '{}');

  constructor(private router: Router) {}

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  toggleSidebar() {
    // For now, just console log. 
    // You can later implement sidebar collapse logic here
    console.log('Sidebar toggle clicked');
    // Future: Emit event to parent or use a service to toggle sidebar
  }
}