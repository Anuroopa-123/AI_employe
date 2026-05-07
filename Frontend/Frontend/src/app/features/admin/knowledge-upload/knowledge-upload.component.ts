import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-knowledge-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './knowledge-upload.component.html',
  styleUrls: ['./knowledge-upload.component.css']
})
export class KnowledgeUploadComponent {

  selectedFile!: File;

  loading = false;

  response: any = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {

    this.selectedFile =
      event.target.files[0];

  }

  uploadPDF() {

    if (!this.selectedFile) return;

    const formData = new FormData();

    formData.append(
      'file',
      this.selectedFile
    );

    this.loading = true;

    this.http.post(
      'http://localhost:5000/api/chatbot/upload-pdf',
      formData
    ).subscribe({

      next: (res: any) => {

        console.log(res);

        this.response = res;

        this.loading = false;
      },

      error: (err) => {

        console.log(err);

        this.loading = false;
      }

    });

  }

}

