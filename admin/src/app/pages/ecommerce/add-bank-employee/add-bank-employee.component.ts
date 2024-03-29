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
  url: environment.apiUrl + "nodejs/bankemployee/upload_file",//"/nodejs/car/upload_file", 
  maxFilesize: 0.20161290,
  thumbnailWidth:8,
  thumbnailHeight :8,
  maxFiles: 1,
  init: function() {
    this.on("error", function(file){
         alert(file.name+" is above 250kb!");
         this.removeFile(file);
     });
  }
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
    this.oBankEmployeeModel.sJoiningDate=== ''||
    // this.oBankEmployeeModel.oPassportImageInfo === null ||
    this.oBankEmployeeModel.oAadharUpload === null ||
    this.oBankEmployeeModel.oBankPassBookUpload === null ||
    this.oBankEmployeeModel.oCallLetterUpload === null ||
    this.oBankEmployeeModel.oEmployeePhotoUpload === null
    ){
      this.fnShowFieldsAreEmpty();
      return;
    }
    this.bIsAddActive = true;
    if (this.oBankEmployeeModel.sCallLetterIssuedDate !== undefined && this.oBankEmployeeModel.sCallLetterIssuedDate !== '')
      this.oBankEmployeeModel.sCallLetterIssuedDate = this.oUtilitydateService.fnChangeDateFormate(this.oBankEmployeeModel.sCallLetterIssuedDate);
    if (this.oBankEmployeeModel.sJoiningDate !== undefined && this.oBankEmployeeModel.sJoiningDate !== '')
      this.oBankEmployeeModel.sJoiningDate = this.oUtilitydateService.fnChangeDateFormate(this.oBankEmployeeModel.sJoiningDate);
    if (!this.bisEditMode) {
      this.oBankEmployeeModel.sStatus = 'pending' ;
      this.oBankEmployeeService.fnAddBankEmployeeInfo(this.oBankEmployeeModel).subscribe((data) => {
        console.log(data);
        this.fnSucessMessage();
        this.bIsAddActive = false ;
        this.redirectTo('/addemployee');
      },(error) => {
        this.bIsAddActive = false ;
      });
    }
    else {
      this.oBankEmployeeService.fnEditBankEmployeeInfo(this.oBankEmployeeModel).subscribe((data) => {
        console.log(data);
        this.fnSucessMessage();
        this.bIsAddActive = false ;
        this.redirectTo('/allemployeesupdate');
      },(error) => {
        this.bIsAddActive = false ;
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

  ngAfterViewInit() {
    if (this.bisEditMode) {
      
      this.fnDisplayExistingImageThumbnail();
    }
  }

  private fnDisplayExistingImageThumbnail(): void{
    if(!this.oPhotoDropZone && !this.oBankPassBookDropZone && !this.oCallLetterDropZone
      && !this.oAadharDropZone ) return;
      //&& !this.oDocument2DropZone
    
      setTimeout(() => {
      const oDZ = this.oPhotoDropZone.directiveRef.dropzone();
      let oImageInfo = this.oBankEmployeeModel.oEmployeePhotoUpload;
      if (!oImageInfo) return;

      var imgURL = environment.imagePath + oImageInfo.sImageURL;
      var mockFile = { name: oImageInfo.sImageName, size: 12345, accepted: true, kind: "image", dataURL: imgURL };

      var crossorigin = "anonymous";
      oDZ.displayExistingFile(mockFile, imgURL, function (img) {
        console.log(img);
      }, crossorigin);

      const oDZM = this.oBankPassBookDropZone.directiveRef.dropzone();
      let oImageInfoMob = this.oBankEmployeeModel.oBankPassBookUpload;
      if (!oImageInfoMob) return;

      var imgURLmob = environment.imagePath + oImageInfoMob.sImageURL;
      var mockFileMob = { name: oImageInfoMob.sImageName, size: 12345, accepted: true, kind: "image", dataURL: imgURLmob };

      crossorigin = "anonymous";
      oDZM.displayExistingFile(mockFileMob, imgURLmob, function (img) {
        console.log(img);
      }, crossorigin);

      const os2DZM = this.oCallLetterDropZone.directiveRef.dropzone();
      let oImageInfos2 = this.oBankEmployeeModel.oCallLetterUpload;
      if (!oImageInfos2) return;

      var imgURLs2 = environment.imagePath + oImageInfos2.sImageURL;
      var mockFiles2 = { name: oImageInfos2.sImageName, size: 12345, accepted: true, kind: "image", dataURL: imgURLs2 };

      crossorigin = "anonymous";
      os2DZM.displayExistingFile(mockFiles2, imgURLs2, function (img) {
        console.log(img);
      }, crossorigin);

      const od1DZM = this.oAadharDropZone.directiveRef.dropzone();
      let oImageInfod1 = this.oBankEmployeeModel.oAadharUpload;
      if (!oImageInfod1) return;

      var imgURLd1 = environment.imagePath + oImageInfod1.sImageURL;
      var mockFiled1 = { name: oImageInfod1.sImageName, size: 12345, accepted: true,  dataURL: imgURLd1 };

      crossorigin = "anonymous";
      od1DZM.displayExistingFile(mockFiled1, imgURLd1, function (img) {
        console.log(img);
      }, crossorigin);

      // const od2DZM = this.oDocument2DropZone.directiveRef.dropzone();
      // let oImageInfd2 = this.oBankEmployeeModel.oDocument2Info;
      // if (!oImageInfd2) return;

      // var imgURLd2 = environment.imagePath + oImageInfd2.sImageURL;
      // var mockFiled2 = { name: oImageInfd2.sImageName, size: 12345, accepted: true, dataURL: imgURLd2 };

      // crossorigin = "anonymous";
      // od2DZM.displayExistingFile(mockFiled2, imgURLd2, function (img) {
      //   console.log(img);
      // }, crossorigin);

    }, 500);

  }

  
  fnonUploadPhotoSuccess(args: any){
    this.oBankEmployeeModel.oEmployeePhotoUpload = args[1].oImageRefId;
  }
  
  fnonUploadAadhaarSuccess(args: any){
    this.oBankEmployeeModel.oAadharUpload = args[1].oImageRefId;
  }
  
  fnonUploadCallLetterSuccess(args: any){
    this.oBankEmployeeModel.oCallLetterUpload = args[1].oImageRefId;
  }
  
  fnonUploadBankPassbookSuccess(args: any){
    this.oBankEmployeeModel.oBankPassBookUpload = args[1].oImageRefId;
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


