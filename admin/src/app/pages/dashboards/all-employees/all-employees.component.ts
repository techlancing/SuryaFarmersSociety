import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/services/auth.service';
import { BankEmployee } from '../../../core/models/bankemployee.model';
import { BankEmployeeService } from 'src/app/core/services/bankemployee.service';
//import { Content } from '@angular/compiler/src/render3/r3_ast';
//import { AdvancedSortableDirective, SortEvent } from './advanced-sortable.directive';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  // page
  currentpage: number;
  constructor(private oBankEmployeeService: BankEmployeeService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Ecommece' }, { label: 'EndUsers', active: true }];

    this.currentpage = 1;
    this.oBankEmployeeService.fngetBankEmployeeInfo().subscribe((users : any)=>{
      console.log('users',users);
      this.aUsers = users;
  });
  /*
  @param Content
  openModal(content: any, selectedindex: number) {
    this.nSelectedProductIndex = selectedindex;
   this.modalService.open(content, { centered: true, size: 'xl' });
 }*/


}
}
/*
function openModal(content: any, any: any, selectedindex: any, number: any) {
  throw new Error('Function not implemented.');
}*/

