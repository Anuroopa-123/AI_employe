import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent {

  task = {
    title: '',
    description: '',
    assigned_to: '',
    deadline: ''
  };

  assignTask() {
    console.log("Task assigned:", this.task);
  }
}