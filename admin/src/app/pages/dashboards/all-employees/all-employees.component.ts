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
  

  public oDropZone: DropzoneComponent;
  aChairman : Array<
  {
    displayText:string,
    value:string
  }>;

  // page
  currentpage: number;
  constructor(private oBankEmployeeService: BankEmployeeService,private modalService: NgbModal,
    public oBankEmployeeModel : BankEmployee) { }

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

    ]

    this.breadCrumbItems = [{ label: 'Ecommece' }, { label: 'EndUsers', active: true }];

    this.currentpage = 1;
    this.oBankEmployeeService.fngetBankEmployeeInfo().subscribe((users : any)=>{
      console.log('users',users);
      this.aUsers = users;
  });
  
}
/**
   * Open modal
   * @param content modal content
   */

 openModal(content: any, selectedindex: number) {
  this.nSelectedProductIndex = selectedindex;
 this.modalService.open(content, { centered: true, size: 'xl' });
}

fnChangeEmployeeApprovalStatus(){
  this.oBankEmployeeService.fnBankEmployeeApprovalStatusInfo(this.oBankEmployeeModel.sStatus).subscribe((data) => {
    this.fnSuccessMessage();
  });
}
fnSuccessMessage(){
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'District is saved sucessfully.',
    showConfirmButton: false,
    timer: 1500
  });
}

}


