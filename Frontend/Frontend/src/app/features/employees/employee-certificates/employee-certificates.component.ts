import {
  Component,
  OnInit,
  ChangeDetectorRef
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

  loading = true;

  constructor(
    private http: HttpClient,
    private cdRef: ChangeDetectorRef
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

    if (!this.user?.org_user_id) {

      console.log(
        'ORG USER ID NOT FOUND'
      );

      this.loading = false;

      return;
    }

    this.http.get(

      `http://localhost:5000/api/certificates/employee/${this.user.org_user_id}`,

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
          [...(res.certificates || [])];

        this.loading = false;

        this.cdRef.detectChanges();
      },

      error: (err) => {

        console.log(err);

        this.loading = false;

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