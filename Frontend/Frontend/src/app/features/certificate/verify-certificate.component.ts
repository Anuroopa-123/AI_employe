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

  CertificateService

} from '../../services/certificate.service';

@Component({

  selector:
    'app-verify-certificate',

  standalone: true,

  imports: [
    CommonModule
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