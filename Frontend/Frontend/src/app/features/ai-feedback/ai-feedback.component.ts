import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-feedback.component.html',
  styleUrls: ['./ai-feedback.component.css']
})
export class AiFeedbackComponent implements OnInit {

  feedback: any = null;
  loading = false;
  user: any = JSON.parse(sessionStorage.getItem('user') || '{}');

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef   // ← Important
  ) {}

  ngOnInit() {
    // Do not auto generate
  }

  generateFeedback() {
    const employeeId = this.user?.org_user_id;
    if (!employeeId) {
      alert("User ID not found");
      return;
    }

    this.loading = true;
    this.feedback = null;

    this.http.get(`http://localhost:5000/api/chatbot/feedback/${employeeId}`)
      .subscribe({
        next: (res: any) => {
          console.log("AI FEEDBACK RECEIVED:", res);
          
          this.feedback = res;
          this.loading = false;
          
          this.cdr.detectChanges();   // ← Force UI update
        },
        error: (err) => {
          console.error("AI Feedback Error:", err);
          this.loading = false;
          this.feedback = {
            success: false,
            aiFeedback: "Failed to generate feedback. Please try again."
          };
          this.cdr.detectChanges();
        }
      });
  }

  // Optional: Format AI response nicely
  formatFeedback(text: string): string {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br><br>');
  }
}