import {

  Component,
  OnInit,
  ChangeDetectorRef

} from '@angular/core';

import { CommonModule }
from '@angular/common';

import { FormsModule }
from '@angular/forms';

import { HttpClient }
from '@angular/common/http';

@Component({

  selector:
    'app-manager-certificates',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './manager-certificates.component.html',

  styleUrls: [
    './manager-certificates.component.css'
  ]

})

export class ManagerCertificatesComponent
implements OnInit {

  employees: any[] = [];

  constructor(

    private http: HttpClient,

    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit() {

    this.loadEmployees();

  }

  loadEmployees() {

    this.http.get(

      'http://localhost:5000/api/certificates/eligible-employees',

      {

        headers: {

          Authorization:
            `Bearer ${sessionStorage.getItem('token')}`

        }

      }

    ).subscribe({

      next: (res: any) => {

        console.log(
          "EMPLOYEES:",
          res
        );

        this.employees =
          res.employees || [];

        console.log(
          this.employees
        );

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  generateCertificate(emp: any) {

    this.http.post(

      'http://localhost:5000/api/certificates/generate',

      {

        employeeId:
          emp.employeeId,

        awardTitle:
          emp.certificateType

      },

      {

        headers: {

          Authorization:
            `Bearer ${sessionStorage.getItem('token')}`

        }

      }

    ).subscribe({

      next: (res: any) => {

        alert(
          'Certificate generated successfully'
        );

        window.open(
          res.downloadUrl,
          '_blank'
        );

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

}