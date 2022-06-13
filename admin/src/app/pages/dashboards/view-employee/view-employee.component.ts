import { Component, Input, OnInit } from '@angular/core';
import { BankEmployee } from 'src/app/core/models/bankemployee.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss']
})
export class ViewEmployeeComponent implements OnInit {
  @Input() oEditBankEmployeeModel: BankEmployee;
  public oBankEmployeeModel: BankEmployee;
  aDesignation : any;
  sImageRootPath : string ;
  public sDesignation : string ='';
  constructor() { }

  ngOnInit(): void {
    this.sImageRootPath = environment.imagePath;
    this.aDesignation = [
      {
        displayText: 'Manager',
        value:'01'
      },
      {
      displayText: 'Accountant',
        value:'02'
      },
      {
        displayText: 'Field Officer',
        value:'03'
      },
      {
        displayText: 'Cashier',
        value:'04'
      },
      {
        displayText: 'Office Boy',
        value:'05'
      }
    ];
    this.oBankEmployeeModel = new BankEmployee();
    const tempobj = JSON.parse(JSON.stringify(this.oEditBankEmployeeModel));
    this.oBankEmployeeModel =tempobj ;
    this.aDesignation.map((designation) => {
      if(this.oBankEmployeeModel.sDesignation===designation.value)
        this.sDesignation = designation.displayText ;
    });
  }
}
