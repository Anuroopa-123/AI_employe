import { Component, OnInit } from '@angular/core';  //  add OnInit
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {   //  implement OnInit

  email = '';
  password = '';
  error = '';
  loading = false;
  rememberMe = false;
  showPassword = false;

  showRegister = false;  //  THIS

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {   //  ADD THIS METHOD
    this.authService.checkRegister().subscribe((res: any) => {
      this.showRegister = res.allowRegister;
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (!this.email || !this.password) return;

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.loading = false;
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('user', JSON.stringify(res.user));
        sessionStorage.setItem('session_id', res.sessionId);

        if (res.user.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid email or password';
      }
    });
  }
}