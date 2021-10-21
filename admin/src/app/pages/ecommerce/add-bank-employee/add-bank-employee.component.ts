import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BankEmployeeService } from '../../../core/services/bankemployee.service';
import { BankEmployee } from '../../../core/models/bankemployee.model'
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { from } from 'rxjs';

@Component({
  selector: 'app-add-bank-employee',
  templateUrl: './add-bank-employee.component.html',
  styleUrls: ['./add-bank-employee.component.scss']
})
export class AddBankEmployeeComponent implements OnInit {

aBankEmployees: Array<BankEmployee>;

  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditBankAccount: BankEmployee;

  public oBankEmployeeModel: BankEmployee;
  nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;

  @ViewChild('_BankAccountFormElem')
  public oBankAccountfoFormElem: any;

  @ViewChild('addcardropzoneElem')
  public oDropZone: DropzoneComponent;
  aState : Array<
  {
    displayText:string,
    value:string
  }>;
  aDesignation : Array<
  {
    displayText:string,
    value:string
  }>;
  aMandal : Array<
  {
    displayText:string,
    value:string
  }>;
  aVillage : Array<
  {
    displayText:string,
    value:string
  }>;
  aBranchCode  : Array<
  {
    displayText:string,
    value:string
  }>;
  public oDropZoneConfig: DropzoneConfigInterface = {
    // Change this to your upload POST address:
  url: environment.apiUrl + "nodejs/BankAccount/upload_file",//"/nodejs/car/upload_file", 
  maxFilesize: 100,
  maxFiles: 1
  };

  // bread crumb items
  breadCrumbItems: Array<{}>;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideCateogryList: boolean = false;

  public sButtonText: string;
  @Input() bisEditMode: boolean;
  
  constructor(private oBankEmployeeService: BankEmployeeService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add Account', active: true }];
    this.aDesignation = [
      {
        displayText: 'Manager',
        value:'01'
      },
      {
      displayText: 'Accountant',
        value:'02'
      }  
    ];
    this.aMandal = [
      {
        displayText: 'Gudur',
        value:'01'
      },
      {
        displayText: 'Kesamudram',
        value:'02'
      },
      {
        displayText: 'Kothaguda',
        value:'03'
      }
    ];
    this.aVillage = [
      {
        displayText: 'Gajulagattu',
        value:'01'
      },
      {
        displayText: 'Gundenga',
        value:'02'
      },
      {
        displayText: 'Ayodyapuram',
        value:'03'
      }
    ];
    this.aState = [
      {
        displayText: 'Telangana',
        value: '01'
      },
      ];
    
    this.oBankEmployeeModel = new BankEmployee();
    this.sButtonText = 'Save & Submit';
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode) {
      // const tempobj = JSON.parse(JSON.stringify(this.oEditBankaccount));
      // this.oBankAccountModel = tempobj;
      this.sButtonText = 'Update';
    }
   // this.oBankEmployeeService.fngetBankEmployeeInfo().subscribe((data) => {
      //this.aBankAccountTypes = [...data as any];

   // });
  }

  fnOnBankEmployeeInfoSubmit(): void {
    //this.bIsAddActive = true;

    this.oBankEmployeeModel.sCallLetterIssuedDate = new Date(this.oBankEmployeeModel.sCallLetterIssuedDate).toISOString().split('T')[0].split("-").reverse().join("-");
    this.oBankEmployeeModel.sJoiningDate = new Date(this.oBankEmployeeModel.sJoiningDate).toISOString().split('T')[0].split("-").reverse().join("-");

      this.oBankEmployeeService.fnAddBankEmployeeInfo(this.oBankEmployeeModel).subscribe((data) => {
        console.log(data);
        this.fnSucessMessage();
      });
  }

  fnResetState() {
    // this.oBankEmployeeModel.sState = '';
  }

  // fnOnBankAccountInfoSubmit(): void {
  //   if(this.bankaccounts != undefined && this.bankaccounts !== null){
  //     if(this.oBankAccountModel.sState.length === 0 || this.oBankAccountModel.sState.trim().length === 0)
  //     {
  //       // this.fnEmptyStateMessage();
  //       return;
  //     }
  //     //Verification for Duplicate Car name
  //       for(var i = 0; i < this.bankaccounts.length; i++) {
  //         if(this.bankaccounts[i].sState.toLowerCase() === this.oBankAccountModel.sState.toLowerCase().trim()) {
  //           // this.fnDuplicateCarNameMessage();
  //           return;
  //         }
  //     }
  //   }
    

  //   if (!this.bisEditMode) {
  //     this.bIsAddActive = true;
  //     // this.oBankAccountService.fnAddBankAccountInfo(this.oBankAccountModel).subscribe((data) => {
  //       this.bankaccounts = [];
  //       // this.oBankAccountService.fngetBankAccountInfo().subscribe((cdata) => {
  //         // this.fnSucessMessage();
  //         // this.bankaccounts = [...cdata as any];
  //         this.oBankAccountModel.sState = '';
  //         this.bIsAddActive = false;
  //         this.addClicked.emit();
  //       });
  //     });
  //   } else {
  //     // Edit function from service here
  //     this.bIsEditActive = true;
  //     this.oBankAccountService.fnEditCarInfo(this.oBankAccountModel).subscribe((data) => {
  //       this.updateClicked.emit();
  //     });
  //   }
  // }

  fnUpdateParentAfterEdit() {
    this.oBankEmployeeService.fngetBankEmployeeInfo().subscribe((cdata) => {
      // this.fnEditSucessMessage();
      this.aBankEmployees = [];
      console.log(this.aBankEmployees);
      this.aBankEmployees = [...cdata as any];
      console.log(this.aBankEmployees);
      // this.oBankEmployeeModel.sState = '';
      this.modalService.dismissAll();
    });
  }

  
  fnSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Bank Employee data is saved sucessfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnEmptyCarNameMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Please enter a valid Car Name',
      showConfirmButton: false,
      timer: 2000
    });
  }


  // fnEditSucessMessage() {
  //   Swal.fire({
  //     position: 'center',
  //     icon: 'success',
  //     title: 'Car is updated sucessfully.',
  //     showConfirmButton: false,
  //     timer: 1500
  //   });
  // }
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any, index) {
    this.nSelectedEditIndex = index;

    this.modalService.open(content, { centered: true });

  }

}


