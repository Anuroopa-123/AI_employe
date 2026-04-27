import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post(`${this.API}/login`, {
      email,
      password
    });
  }

  register(data: any) {
    return this.http.post(`${this.API}/register`, data);
  }

logout() {
  return this.http.post(`${this.API}/logout`, {});
}

  getToken() {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  
}   