import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: any = {};
  loading = true;
  showModal = false;
  selectedFile: File | null = null;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  getProfileImageUrl(): string {
    if (!this.profile.profile_pic) return '';
    return `http://localhost:5000${this.profile.profile_pic}`;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
  }

  loadProfile() {
    this.loading = true;
    this.http.get('http://localhost:5000/api/org/profile').subscribe({
      next: (res: any) => {
        this.profile = res || {};
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateProfile() {
    const formData = new FormData();

    Object.keys(this.profile).forEach(key => {
      if (this.profile[key] !== null && this.profile[key] !== undefined) {
        formData.append(key, this.profile[key]);
      }
    });

    if (this.selectedFile) {
      formData.append('profile_pic', this.selectedFile);
    }

    this.http.put('http://localhost:5000/api/org/profile', formData)
      .subscribe({
        next: () => {
          this.toastr.success("Profile updated successfully");
          this.closeModal();
          this.selectedFile = null;
          setTimeout(() => this.loadProfile(), 600);
        },
        error: (err) => {
          console.error(err);
          this.toastr.error("Failed to update profile");
        }
      });
  }

  openModal() { this.showModal = true; }
  closeModal() { this.showModal = false; }
}