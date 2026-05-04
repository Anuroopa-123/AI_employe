import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component,OnInit, ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-employees-worklogs",
  standalone:true,
  imports:[CommonModule,FormsModule],
  templateUrl: "./employees-worklogs.component.html",
  styleUrls: ["./employees-worklogs.component.css"]
})
export class EmployeesWorklogsComponent implements OnInit {
  // This component will display employee work logs
  logs: any[] = [];
  editingLog: any = null;

    constructor(private http: HttpClient, private cd: ChangeDetectorRef,private toastr: ToastrService) {}
ngOnInit() {
  this.loadLogs();
}

loadLogs() {
  this.http.get('http://localhost:5000/api/worklogs/my')
    .subscribe((res: any) => {
      this.logs = res;
      this.cd.detectChanges();
    });
}

isToday(date: string) {
  const today = new Date().toISOString().split('T')[0];
  const logDate = new Date(date).toISOString().split('T')[0];

  return today === logDate;
}
edit(log: any) {
  this.editingLog = { ...log }; // clone
}
update() {
  this.http.put(`http://localhost:5000/api/worklogs/${this.editingLog.id}`, {
    description: this.editingLog.description,
    hours_spent: this.editingLog.hours_spent
  }).subscribe(() => {
    this.toastr.success('Work log updated successfully');
    this.editingLog = null;
    this.loadLogs();
  });
}

delete(id: number) {
  this.http.delete(`http://localhost:5000/api/worklogs/${id}`)
    .subscribe(() => {
      this.toastr.success('Work log deleted successfully');
      this.loadLogs();
    });
}
}