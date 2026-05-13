
import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import {
  catchError,
  map,
  of
} from 'rxjs';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);

  const http = inject(HttpClient);

  const token =
    sessionStorage.getItem('token');

  // NO TOKEN
  if (!token) {

    router.navigate(['/login']);

    return false;

  }

  // VERIFY SESSION FROM BACKEND
  return http.get(

    'http://localhost:5000/api/auth/check-session',

    {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }

  ).pipe(

    map(() => true),

    catchError(() => {

      sessionStorage.clear();

      router.navigate(['/login']);

      return of(false);

    })

  );

};

