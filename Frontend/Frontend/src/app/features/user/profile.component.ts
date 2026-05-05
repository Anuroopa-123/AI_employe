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

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef   // ← Added
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;

    this.http.get('http://localhost:5000/api/org/profile')
      .subscribe({
        next: (res: any) => {
          console.log("PROFILE LOADED:", res);
          
          this.profile = res || {};
          this.loading = false;
          this.cdr.detectChanges();        // ← Force update
        },
        error: (err) => {
          console.error("Profile load error", err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  updateProfile() {
    this.http.put('http://localhost:5000/api/org/profile', this.profile)
      .subscribe({
        next: () => {
          this.toastr.success("Profile updated successfully");
          this.closeModal();
          this.cdr.detectChanges();        // ← Fix NG0100 error
          
          // Optional: Refresh profile after update
          setTimeout(() => this.loadProfile(), 500);
        },
        error: (err) => {
          this.toastr.error("Failed to update profile");
          console.error(err);
        }
      });
  }
}