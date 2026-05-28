import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';

@Component({

  selector: 'app-employee-certificates',

  standalone: true,

  imports: [CommonModule],

  templateUrl:
    './employee-certificates.component.html',

  styleUrls:
    ['./employee-certificates.component.css']

})

export class EmployeeCertificatesComponent
implements OnInit {

  certificates: any[] = [];

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {

    this.loadCertificates();

  }

  loadCertificates() {

    const user =
      JSON.parse(
        sessionStorage.getItem('user') || '{}'
      );

    this.http.get(

      `http://localhost:5000/api/certificates/employee/${user.id}`,

      {

        headers: {

          Authorization:
            `Bearer ${sessionStorage.getItem('token')}`

        }

      }

    ).subscribe({

      next: (res: any) => {

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