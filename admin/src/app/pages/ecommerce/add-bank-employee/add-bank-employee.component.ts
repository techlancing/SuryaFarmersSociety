import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BankEmployeeService } from '../../../core/services/bankemployee.service';
import { BankEmployee } from '../../../core/models/bankemployee.model'
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { from } from 'rxjs';
import {UtilitydateService} from '../../../core/services/utilitydate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-bank-employee',
  templateUrl: './add-bank-employee.component.html',
  styleUrls: ['./add-bank-employee.component.scss']
})
export class AddBankEmployeeComponent implements OnInit {

aBankEmployees: Array<BankEmployee>;

  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditBankEmployeeModel: BankEmployee;

  public oBankEmployeeModel: BankEmployee;
  nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;
  bTRAppointedType : boolean =true ;

  @ViewChild('_BankAccountFormElem')
  public oBankAccountfoFormElem: any;

  @ViewChild('addphotoropzoneElem')
  public oPhotoDropZone: DropzoneComponent;
  @ViewChild('addpassbookropzoneElem')
  public oBankPassBookDropZone: DropzoneComponent;
  @ViewChild('addcallletterropzoneElem')
  public oCallLetterDropZone: DropzoneComponent;
  @ViewChild('addaadharropzoneElem')
  public oAadharDropZone: DropzoneComponent;
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
  
  constructor(private oBankEmployeeService: BankEmployeeService,private router : Router,
              private modalService: NgbModal,private oUtilitydateService : UtilitydateService) { }
              
             
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
    this.oBankEmployeeModel.sAppointmentType = 'Trainee';
    this.sButtonText = 'Save & Submit';
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode) {
       const tempobj = JSON.parse(JSON.stringify(this.oEditBankEmployeeModel));
      this.oBankEmployeeModel = tempobj;
      this.sButtonText = 'Update';
      if(this.oBankEmployeeModel.sAppointmentType==='Regular')
        this.bTRAppointedType=false;
    }
  }

  fnOnBankEmployeeInfoSubmit(): void {
    if(
    this.oBankEmployeeModel.nEmployeeID  === ''||
    this.oBankEmployeeModel.sAccountNo === null||
    this.oBankEmployeeModel.sEmployeeName === ''||
    this.oBankEmployeeModel.sReligion === ''||
    this.oBankEmployeeModel.sNationality  === ''||
    this.oBankEmployeeModel.sSpeakLanguage === ''||
    this.oBankEmployeeModel.sFatherOrHusbandName === ''||
    this.oBankEmployeeModel.sMotherName === ''||        
    this.oBankEmployeeModel.sMobileNumber  === ''||
    this.oBankEmployeeModel.sEmployeeCallLetterID === ''||
    this.oBankEmployeeModel.sCallLetterIssuedDate === ''||
    this.oBankEmployeeModel.sAppointmentType === ''||
    this.oBankEmployeeModel.sDesignation === ''||
    this.oBankEmployeeModel.sIFSCCode === ''||
    this.oBankEmployeeModel.sBranchName === ''||
    this.oBankEmployeeModel.sPlace === ''||
    this.oBankEmployeeModel.sAadharNo === ''||
    this.oBankEmployeeModel.sJoiningDate=== ''
    // this.oBankEmployeeModel.oPassportImageInfo === null ||
    // this.oBankEmployeeModel.oAadharUpload === null ||
    // this.oBankEmployeeModel.oBankPassBookUpload === null ||
    // this.oBankEmployeeModel.oCallLetterUpload === null ||
    // this.oBankEmployeeModel.oEmployeePhotoUpload === null
    ){
      this.fnShowFieldsAreEmpty();
      return;
    }
    //this.bIsAddActive = true;
    if (this.oBankEmployeeModel.sCallLetterIssuedDate !== undefined && this.oBankEmployeeModel.sCallLetterIssuedDate !== '')
      this.oBankEmployeeModel.sCallLetterIssuedDate = this.oUtilitydateService.fnChangeDateFormate(this.oBankEmployeeModel.sCallLetterIssuedDate);
    if (this.oBankEmployeeModel.sJoiningDate !== undefined && this.oBankEmployeeModel.sJoiningDate !== '')
      this.oBankEmployeeModel.sJoiningDate = this.oUtilitydateService.fnChangeDateFormate(this.oBankEmployeeModel.sJoiningDate);
    if (!this.bisEditMode) {
      this.oBankEmployeeModel.sStatus = 'pending' ;
      this.oBankEmployeeService.fnAddBankEmployeeInfo(this.oBankEmployeeModel).subscribe((data) => {
        console.log(data);
        this.fnSucessMessage();
        this.redirectTo('/addemployee');
      });
    }
    else {
      this.oBankEmployeeService.fnEditBankEmployeeInfo(this.oBankEmployeeModel).subscribe((data) => {
        console.log(data);
        this.fnSucessMessage();
        this.redirectTo('/allemployeesupdate');
      });
    }

  }
  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }

  fnOnSelectedAppointment($event){
    console.log($event.target.value);
    if($event.target.value==='Trainee')
      this.bTRAppointedType = true ;
    else this.bTRAppointedType = false ;
    this.oBankEmployeeModel.sAppointmentType=$event.target.value;
  }

  fnShowFieldsAreEmpty(){
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Please fill all the fields.',
      showConfirmButton: false,
      timer: 1500
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
    this.oBankEmployeeService.fngetApprovedBankEmployeeInfo().subscribe((cdata) => {
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

  fnClear(){
    this.oBankEmployeeModel.nEmployeeID  = '';
    this.oBankEmployeeModel.sAccountNo = null;
    this.oBankEmployeeModel.sEmployeeName = '';
    this.oBankEmployeeModel.sReligion = '';
    this.oBankEmployeeModel.sNationality  = '';
    this.oBankEmployeeModel.sSpeakLanguage = '';
    this.oBankEmployeeModel.sFatherOrHusbandName = '';
    this.oBankEmployeeModel.sMotherName = '';        
    this.oBankEmployeeModel.sMobileNumber  = '';
    this.oBankEmployeeModel.sEmployeeCallLetterID = '';
    this.oBankEmployeeModel.sCallLetterIssuedDate = '';
    this.oBankEmployeeModel.sAppointmentType = '';
    this.oBankEmployeeModel.sDesignation = '';
    this.oBankEmployeeModel.sIFSCCode = '';
    this.oBankEmployeeModel.sBranchName = '';
    this.oBankEmployeeModel.sPlace = '';
    this.oBankEmployeeModel.sAadharNo = '';
    this.oBankEmployeeModel.sJoiningDate= ''
    this.oBankEmployeeModel.oPassportImageInfo = null ;
    this.oBankEmployeeModel.oAadharUpload = null ;
    this.oBankEmployeeModel.oBankPassBookUpload = null ;
    this.oBankEmployeeModel.oCallLetterUpload = null ;
    this.oBankEmployeeModel.oEmployeePhotoUpload = null;
    this.oPhotoDropZone.directiveRef.dropzone().removeAllFiles(true);
    this.oBankPassBookDropZone.directiveRef.dropzone().removeAllFiles(true);
    this.oCallLetterDropZone.directiveRef.dropzone().removeAllFiles(true);
    this.oAadharDropZone.directiveRef.dropzone().removeAllFiles(true);
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


