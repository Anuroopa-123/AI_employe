import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/internal/operators/catchError';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const token = sessionStorage.getItem('token');

  let clonedReq = req;

  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedReq).pipe(
    // catch backend errors
    catchError((err) => {
      if (err.status === 401) {
        // AUTO LOGOUT
        sessionStorage.clear();
        router.navigate(['/login']);
      }
      throw err;
    })
  );
};