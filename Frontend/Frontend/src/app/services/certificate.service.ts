import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CertificateService {

  api =
    'http://localhost:5000/api/certificates';

  constructor(
    private http: HttpClient
  ) {}

  generate(data: any) {

    return this.http.post(

      `${this.api}/generate`,

      data
    );

  }

  verify(token: string) {

    return this.http.get(

      `${this.api}/verify/${token}`

    );

  }

}