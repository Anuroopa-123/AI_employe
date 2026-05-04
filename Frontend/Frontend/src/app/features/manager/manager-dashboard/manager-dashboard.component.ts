import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css']
})
export class ManagerDashboardComponent implements OnInit {

  user: any;
  topEmployees: any[] = [];

  ngOnInit() {
    const data = sessionStorage.getItem('user');
    this.user = data ? JSON.parse(data) : null;

    this.loadStats();
  }

  loadStats() {
    fetch('http://localhost:5000/api/manager/stats', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then((data) => {
      this.topEmployees = data.topEmployees || [];
      setTimeout(() => this.renderChart(), 0);
    });
  }

  renderChart() {
    if (!this.topEmployees.length) return;

 new Chart("managerChart", {
  type: 'pie',
  data: {
    labels: this.topEmployees.map(e => e.name),
    datasets: [{
      data: this.topEmployees.map(e => e.score)
    }]
  }
});
  }
}