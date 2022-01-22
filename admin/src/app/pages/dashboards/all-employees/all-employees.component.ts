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
  constructor(private oBankEmployeeService: BankEmployeeService,private modalService: NgbModal) { }

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

    this.currentpage = 1;
    this.oBankEmployeeService.fngetBankEmployeeInfo().subscribe((users : any)=>{
      console.log('users',users);
      this.aUsers = users;
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

}


