import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { OrganizationService } from '../../services/organization.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  stats = {
  totalEmployees: 0,
  totalManagers: 0,
  totalTasks: 0,
  urgentTasks: 0
};
  topEmployees: any[] = [];
  topManagers: any[] = [];

  constructor(private http: HttpClient,private orgService: OrganizationService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadStats();
  }


loadStats() {
  this.orgService.getAdminStats()
    .subscribe((res: any) => {
      //  console.log("STATS RESPONSE:", res);
      this.stats = res;
      this.topEmployees = res.topEmployees;
      this.topManagers = res.topManagers;
      this.cd.detectChanges(); 

      setTimeout(() => this.renderCharts(), 0);
    });
}

  renderCharts() {

    new Chart("employeeChart", {
      type: 'pie',
      data: {
        labels: this.topEmployees.map(e => e.name),
        datasets: [{
          data: this.topEmployees.map(e => e.completed)
        }]
      }
    });

    new Chart("managerChart", {
      type: 'bar',
      data: {
        labels: this.topManagers.map(m => m.name),
        datasets: [{
          label: 'Tasks Assigned',
          data: this.topManagers.map(m => m.assigned)
        }]
      }
    });
  }
}