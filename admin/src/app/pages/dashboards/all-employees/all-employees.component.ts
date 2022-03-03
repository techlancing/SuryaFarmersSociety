import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AuthenticationService } from '../../../core/services/auth.service';
import { BankEmployee } from '../../../core/models/bankemployee.model';
import { BankEmployeeService } from 'src/app/core/services/bankemployee.service';
import { AdvancedSortableDirective } from '../all-bank-accounts/advanced-sortable.directive';
import { AdvancedService } from '../all-bank-accounts/advanced.service';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import Swal from 'sweetalert2';
import { User } from 'src/app/core/models/auth.models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.scss']
})
export class AllEmployeesComponent implements OnInit {


  aUsers: Array<BankEmployee>;
  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;
  @Input() bHideBreadCrumb: boolean = false;

  nSelectedProductIndex : number;
  public account : any ;
  public statusUpdate : boolean ;
  public oDropZone: DropzoneComponent;
  aChairman : Array<
  {
    displayText:string,
    value:string
  }>;
  rChairman : Array<
  {
    displayText:string,
    value:string
  }>;
  pChairman : Array<
  {
    displayText:string,
    value:string
  }>;
  // page
  currentpage: number;
  sApproval: boolean;
  constructor(private oBankEmployeeService: BankEmployeeService,private modalService: NgbModal,
    private activatedroute : ActivatedRoute) { }

  ngOnInit(): void {
    
    this.aChairman=[
      {
        displayText: 'Approve',
        value:'approved'
      },
      {
      displayText: 'Reject',
        value:'rejected'
      },
      {
        displayText: 'Pending',
          value:'pending'
      }
    ];

    this.rChairman =[
      {
        displayText: 'Reject',
        value: 'rejected'
      },
      {
        displayText: 'Pending',
        value: 'pending'
      },
      {
        displayText: 'Approve',
        value: 'approved'
      }
    ];

    this.pChairman = [
      {
        displayText: 'Pending',
        value: 'pending'
      },
      {
        displayText: 'Approve',
        value: 'approved'
      },
      {
        displayText: 'Reject',
        value: 'rejected'
      }
    ] ;
    this.breadCrumbItems = [{ label: 'Ecommece' }, { label: 'EndUsers', active: true }];
    if (this.activatedroute.snapshot.data.type === 'approval') this.sApproval = true ;

    

    this.currentpage = 1;
    this.oBankEmployeeService.fngetBankEmployeeInfo().subscribe((users : any)=>{
      console.log('users',users);
      this.aUsers = users;
      if(this.sApproval) {
        let employees = [];
        this.aUsers.map((employee) => {
          if(employee.sStatus == 'pending') employees.push(employee);
        });
        this.aUsers = employees;
      }else {
        let employees = [];
        this.aUsers.map((employee) => {
          if(employee.sStatus !== 'pending') employees.push(employee);
        });
        this.aUsers = employees;
      }
      
  });
  this.account = JSON.parse(localStorage.getItem('userData'));
  
}
/**
   * Open modal
   * @param content modal content
   */

 openModal(content: any, selectedindex: number) {
  this.nSelectedProductIndex = selectedindex;
 this.modalService.open(content, { centered: true, size: 'xl' });
}

fnChangeEmployeeApprovalStatus(oBankemployee : BankEmployee, sStatus : string){
  oBankemployee.sStatus = sStatus ;
  this.oBankEmployeeService.fnBankEmployeeApprovalStatusInfo(oBankemployee).subscribe((data) => {
    this.fnSuccessMessage();
    this.ngOnInit();
  });
}
  fnDeleteEmployee(oBankemployee: BankEmployee) {
    if (oBankemployee !== undefined) {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Do you want to really Delete this employee?',
        showConfirmButton: true,
        showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.close();
          this.oBankEmployeeService.fnDeleteBankEmployeeInfo(oBankemployee).subscribe((data) => {
            this.fnDeleteMessage();
            this.ngOnInit();
          });
        }
      });
    }
  }

fnUpdate(){
  this.statusUpdate = true ;
}
fnSuccessMessage(){
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Employee status updated Successfully.',
    showConfirmButton: false,
    timer: 1500
  });
}
fnDeleteMessage(){
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Employee Deleted Successfully.',
    showConfirmButton: false,
    timer: 1500
  });
}

}


