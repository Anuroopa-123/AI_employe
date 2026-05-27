import {

  Component,
  OnInit

} from '@angular/core';

import {

  ActivatedRoute

} from '@angular/router';

import {

  CommonModule

} from '@angular/common';

import {

  HttpClientModule

} from '@angular/common/http';

import {

  CertificateService

} from '../../services/certificate.service';

@Component({

  selector:
    'app-verify-certificate',

  standalone: true,

  imports: [
    CommonModule,
    HttpClientModule
  ],

  templateUrl:
    './verify-certificate.component.html',

  styleUrls: [
    './verify-certificate.component.css'
  ]

})

export class VerifyCertificateComponent
implements OnInit {

  certificate: any = null;

  valid = false;

  loading = true;

  certificateDownloadUrl = '';

  constructor(

    private route:
    ActivatedRoute,

    private certService:
    CertificateService

  ) {}

  ngOnInit() {

    const token =
      this.route.snapshot
      .paramMap
      .get('token');

    if (token) {

      this.certService
      .verify(token)
      .subscribe({

        next: (res: any) => {

          this.valid =
            res.valid;

          this.certificate =
            res.certificate;

          if (
            this.certificate
          ) {

            this.certificateDownloadUrl =
              `http://localhost:5000/${this.certificate.certificate_url}`;

          }

          this.loading =
            false;

        },

        error: () => {

          this.loading =
            false;

        }

      });

    }

  }

}