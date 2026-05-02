import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const token = sessionStorage.getItem('token');
  const sessionId = sessionStorage.getItem('session_id');

  let cloned = req;

  if (token) {
    cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'x-session-id': sessionId || ''
      }
    });
  }

  return next(cloned).pipe(
    catchError((err) => {
      if (err.status === 401) {
        sessionStorage.clear();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};