import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

@Component({

  selector:
    'app-employee-certificates',

  standalone: true,

  imports: [
    CommonModule,
    HttpClientModule
  ],

  templateUrl:
    './employee-certificates.component.html',

  styleUrls: [
    './employee-certificates.component.css'
  ]

})

export class EmployeeCertificatesComponent
implements OnInit {

  certificates: any[] = [];

  user: any = null;

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {

    this.user =
      JSON.parse(
        sessionStorage.getItem('user') || '{}'
      );

    console.log(
      'LOGGED USER:',
      this.user
    );

    this.loadCertificates();

  }

  loadCertificates() {

    if (!this.user?.id) {

      console.log(
        'USER ID NOT FOUND'
      );

      return;

    }

    this.http.get(

      `http://localhost:5000/api/certificates/employee/${this.user.id}`,

      {

        headers: {

          Authorization:
            `Bearer ${sessionStorage.getItem('token')}`

        }

      }

    ).subscribe({

      next: (res: any) => {

        console.log(
          'CERTIFICATES:',
          res
        );

        this.certificates =
          res.certificates || [];

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  downloadCertificate(cert: any) {

    window.open(

      `http://localhost:5000/${cert.certificate_url}`,

      '_blank'

    );

  }

  verifyCertificate(cert: any) {

    window.open(

      `http://localhost:4200/verify-certificate/${cert.verification_token}`,

      '_blank'

    );

  }

}