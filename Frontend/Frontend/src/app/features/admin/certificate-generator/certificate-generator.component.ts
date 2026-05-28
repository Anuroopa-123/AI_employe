import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { CertificateService }
from '../../../services/certificate.service';

@Component({

  selector:
    'app-certificate-generator',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './certificate-generator.component.html'

})

export class CertificateGeneratorComponent {

  employeeId = '';
  awardTitle = '';

  result: any;

  constructor(
    private certService:
    CertificateService
  ) {}

  generate() {

    this.certService.generate({

      employeeId:
        this.employeeId,

      awardTitle:
        this.awardTitle

    }).subscribe({

      next: (res) => {

        this.result = res;

      }

    });

  }

}