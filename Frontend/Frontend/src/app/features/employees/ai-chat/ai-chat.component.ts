import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.css']
})
export class AiChatComponent {

  question = '';
  loading = false;

  user: any =
    JSON.parse(sessionStorage.getItem('user') || '{}');

  messages: any[] = [];

  constructor(private http: HttpClient) {}

  sendMessage() {

    if (!this.question.trim()) return;

    const q = this.question;

    this.messages.push({
      role: 'user',
      content: q
    });

    this.question = '';

    this.loading = true;

    this.http.post(
      'http://localhost:5000/api/chatbot/chat',
      {
        employeeId: this.user.org_user_id,
        question: q
      }
    ).subscribe({

      next: (res: any) => {

        this.messages.push({
          role: 'bot',
          content: res.answer
        });

        this.loading = false;
      },

      error: () => {

        this.messages.push({
          role: 'bot',
          content: 'AI failed.'
        });

        this.loading = false;
      }

    });

  }

}