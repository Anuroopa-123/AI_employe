import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../../../services/organization.service';

@Component({
  selector: 'app-assigned-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assigned-tasks.component.html',
  styleUrls: ['./assigned-tasks.component.css']
})
export class AssignedTasksComponent implements OnInit {

  tasks: any[] = [];
  loading = true;

  constructor(private http: HttpClient, private orgService: OrganizationService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadTasks();
  }

loadTasks() {
  this.orgService.getAssignedTasks()
    .subscribe({
      next: (res: any) => {
        console.log("Tasks:", res);

        this.tasks = Array.isArray(res) ? res : res.data;

        this.loading = false;

        this.cd.detectChanges(); //  FORCE UI UPDATE
      },
      error: () => {
        this.loading = false;
      }
    });
}
}