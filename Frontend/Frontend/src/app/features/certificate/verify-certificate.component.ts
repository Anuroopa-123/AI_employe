import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';

import { CertificateService } from '../../services/certificate.service';

@Component({
  selector: 'app-verify-certificate',

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

  certificate: any = {};

  valid = false;

  loading = true;

  error = false;

  certificateDownloadUrl = '';

  constructor(
    private route: ActivatedRoute,
    private certService: CertificateService
  ) {}

  ngOnInit(): void {

    const token =
      this.route.snapshot.paramMap.get('token');

    console.log('TOKEN:', token);

    if (!token) {

      this.loading = false;

      this.error = true;

      return;
    }

    this.certService.verify(token)
      .subscribe({

        next: (res: any) => {

          console.log('VERIFY RESPONSE:', res);

          this.valid = res.valid;

          this.certificate = res.certificate || {};

          if (this.certificate?.certificate_url) {

            this.certificateDownloadUrl =
              `http://localhost:5000/${this.certificate.certificate_url}`;
          }

          this.loading = false;
        },

        error: (err) => {

          console.log(err);

          this.loading = false;

          this.error = true;
        }

      });
  }
}