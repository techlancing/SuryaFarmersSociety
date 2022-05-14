import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BankAccount } from '../../../core/models/bankaccount.model';
import { District } from '../../../core/models/district.model';
import { Mandal } from '../../../core/models/mandal.model';
import { Village } from '../../../core/models/village.model';
import { BankAccountService } from '../../../core/services/account.service';
import { DistrictService } from '../../../core/services/district.service';
import { MandalService } from '../../../core/services/mandal.service';
import { VillageService } from '../../../core/services/village.service';
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { analytics } from 'firebase';
import {UtilitydateService} from '../../../core/services/utilitydate.service';
import { BankEmployee } from 'src/app/core/models/bankemployee.model';
import { BankEmployeeService } from 'src/app/core/services/bankemployee.service';

@Component({
  selector: 'app-addaccount',
  templateUrl: './addaccount.component.html',
  styleUrls: ['./addaccount.component.scss']
})
export class AddaccountComponent implements OnInit {

  bankaccounts: Array<BankAccount>;

  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditBankAccount: BankAccount;


  public oBankAccountModel: BankAccount;
  nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;
  bShowPersonal : boolean;
  bErrorNominee : boolean;
  bErrorNomineeRelation : boolean;
  bErrorVoterId : boolean;
  bErrorAadhar : boolean;
  bErrorRation : boolean;
  bErrorPin : boolean;
  bErrorMobile : boolean;
  bErrorEmail : boolean ;
  sVotterPattern : string = '^([a-zA-Z]){3}([0-9]){7}$';
  sAadharPattern : string = '^[2-9]{1}[0-9]{3}\\s{0,1}[0-9]{4}\\s{0,1}[0-9]{4}$';
  sRationCardPattern :string = '^([a-zA-Z0-9a-zA-Z]){8,12,15}\\s*$';
  sMobilePattern : string = '([+]{0,1}91[\\s]*)?[6-9]{1}[0-9]{9}$';
  sPincodePattern : string = '^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$';
  sMailPattern : string = '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$';
  aUsers: Array<BankEmployee>;

  @ViewChild('_BankAccountFormElem')
  public oBankAccountfoFormElem: any;

  @ViewChild('photodropzoneElem')
  public oPhotoDropZone: DropzoneComponent;

@ViewChild('signature1dropzoneElem')
  public oSignature1DropZone: DropzoneComponent;

@ViewChild('signature2dropzoneElem')
  public oSignature2DropZone: DropzoneComponent;

@ViewChild('document1dropzoneElem')
  public oDocument1DropZone: DropzoneComponent;

@ViewChild('document2dropzoneElem')
  public oDocument2DropZone: DropzoneComponent;

  aState : Array<
  {
    displayText:string,
    value:string
  }>;
  aDistrict : Array<District>;
  aMandal : Array<Mandal>;
  aVillage : Array<Village>;
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
  constructor(private oBankAccountService: BankAccountService,
    private oDistrictService: DistrictService,
    private oMandalService: MandalService,
    private oVillageService: VillageService,
    private router : Router,
              private modalService: NgbModal,
              private oUtilitydateService : UtilitydateService,
              private oBankEmployeeService : BankEmployeeService,
              private element : ElementRef) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add Account', active: true }];
    
    this.oDistrictService.fngetDistrictInfo().subscribe((data) => {
      this.aDistrict = [...data as any];
      
    });
    
    this.bShowPersonal=false;

    this.aState = [
      {
        displayText: 'Telangana',
        value: '01'
      },
      ];
    
    this.oBankAccountModel = new BankAccount();
    this.oBankAccountModel.sDate = new Date().toString();
    this.sButtonText = 'Save & Submit';
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode) {
      const tempobj = JSON.parse(JSON.stringify(this.oEditBankAccount));
      this.oBankAccountModel = tempobj;
      this.sButtonText = 'Update';
      this.bShowPersonal = true;
    }
    this.oBankAccountService.fngetActiveBankAccountInfo().subscribe((data) => {
      this.bankaccounts = [...data as any];

    });

    this.oBankEmployeeService.fngetApprovedBankEmployeeInfo().subscribe((users : any)=>{
      console.log('users',users);
       this.aUsers = users;
     });

  }

  ngAfterViewInit() {
    if (this.bisEditMode) {
      
      this.fnDisplayExistingImageThumbnail();
    }
  }

  private fnDisplayExistingImageThumbnail(): void{
    if(!this.oPhotoDropZone && !this.oSignature1DropZone && !this.oSignature2DropZone
      && !this.oDocument1DropZone && !this.oDocument2DropZone) return;
    setTimeout(() => {


      const oDZ = this.oPhotoDropZone.directiveRef.dropzone();
      let oImageInfo = this.oBankAccountModel.oPassportImageInfo;
      if (!oImageInfo) return;

      var imgURL = environment.imagePath + oImageInfo.sImageURL;
      var mockFile = { name: oImageInfo.sImageName, size: 12345, accepted: true, kind: "image", dataURL: imgURL };

      var crossorigin = "anonymous";
      oDZ.displayExistingFile(mockFile, imgURL, function (img) {
        console.log(img);
      }, crossorigin);

      const oDZM = this.oSignature1DropZone.directiveRef.dropzone();
      let oImageInfoMob = this.oBankAccountModel.oSignature1Info;
      if (!oImageInfoMob) return;

      var imgURLmob = environment.imagePath + oImageInfoMob.sImageURL;
      var mockFileMob = { name: oImageInfoMob.sImageName, size: 12345, accepted: true, kind: "image", dataURL: imgURLmob };

      crossorigin = "anonymous";
      oDZM.displayExistingFile(mockFileMob, imgURLmob, function (img) {
        console.log(img);
      }, crossorigin);

      const os2DZM = this.oSignature2DropZone.directiveRef.dropzone();
      let oImageInfos2 = this.oBankAccountModel.oSignature2Info;
      if (!oImageInfos2) return;

      var imgURLs2 = environment.imagePath + oImageInfos2.sImageURL;
      var mockFiles2 = { name: oImageInfos2.sImageName, size: 12345, accepted: true, kind: "image", dataURL: imgURLs2 };

      crossorigin = "anonymous";
      os2DZM.displayExistingFile(mockFiles2, imgURLs2, function (img) {
        console.log(img);
      }, crossorigin);

      const od1DZM = this.oDocument1DropZone.directiveRef.dropzone();
      let oImageInfod1 = this.oBankAccountModel.oDocument1Info;
      if (!oImageInfod1) return;

      var imgURLd1 = environment.imagePath + oImageInfod1.sImageURL;
      var mockFiled1 = { name: oImageInfod1.sImageName, size: 12345, accepted: true,  dataURL: imgURLd1 };

      crossorigin = "anonymous";
      od1DZM.displayExistingFile(mockFiled1, imgURLd1, function (img) {
        console.log(img);
      }, crossorigin);

      const od2DZM = this.oDocument2DropZone.directiveRef.dropzone();
      let oImageInfd2 = this.oBankAccountModel.oDocument2Info;
      if (!oImageInfd2) return;

      var imgURLd2 = environment.imagePath + oImageInfd2.sImageURL;
      var mockFiled2 = { name: oImageInfd2.sImageName, size: 12345, accepted: true, dataURL: imgURLd2 };

      crossorigin = "anonymous";
      od2DZM.displayExistingFile(mockFiled2, imgURLd2, function (img) {
        console.log(img);
      }, crossorigin);

    }, 500);

  }

  fnFetchMandalInfo(event, nDistrictId: number) {
    this.aMandal = [];
    this.oBankAccountModel.nMandalId = null;
    let alocalmandal = {};
    this.oMandalService.fngetMandalInfo().subscribe((data) => {
      this.aMandal = [...data as any];
      alocalmandal = this.aMandal.filter((mandal:any) => {
        if (mandal.nDistrictId === nDistrictId) {
          return mandal;
        }
      });
      this.aMandal = [...alocalmandal as any];
    });
    
  }

  fnFetchVillageInfo(event, nMandalId: number) {
    this.aVillage = [];
    this.oBankAccountModel.nVillageId = null;
    let alocalvillage = {};
    this.oVillageService.fngetVillageInfo().subscribe((data) => {
      this.aVillage = [...data as any];
      alocalvillage = this.aVillage.filter((village:any) => {
        if (village.nMandalId === nMandalId) {
          return village;
        }
      });
      this.aVillage = [...alocalvillage as any];
    });
    
  }

  fnCalculateAge(){
    if (typeof this.oBankAccountModel.sDOB === 'object') { 
      let toDay = new Date();
      let age = 0;
      let sDateOfBirth = new Date(this.oBankAccountModel.sDOB);
      age = toDay.getFullYear() - sDateOfBirth.getFullYear();
      if (age > 0) {
        if (toDay.getMonth() > sDateOfBirth.getMonth()) age--;
        else if (toDay.getMonth() == sDateOfBirth.getMonth()) {
          if (toDay.getDate() >= (sDateOfBirth.getDate() - 1)) age++;
          else age--;
        }
        else age--;
      }
      this.oBankAccountModel.sAge = "" + age;
    }
  }

  fnCreateAccountDetails(){
    let statecode = this.oBankAccountModel.sState;
    let selecteddistrict = this.aDistrict.find(item=> item.nDistrictId === this.oBankAccountModel.nDistrictId);
    let selectedmandal = this.aMandal.find(item=> item.nMandalId === this.oBankAccountModel.nMandalId);
    let selectedvillage = this.aVillage.find(item=> item.nVillageId === this.oBankAccountModel.nVillageId);
     this.oBankAccountModel.sBranchCode =  statecode 
     + (selecteddistrict.nDistrictCode.toString().length > 1 ? selecteddistrict.nDistrictCode.toString() : '0'+selecteddistrict.nDistrictCode.toString())
     + (selectedmandal.nMandalCode.toString().length > 1 ? selectedmandal.nMandalCode.toString() : '0'+selectedmandal.nMandalCode.toString())
     + (selectedvillage.nVillageCode.toString().length > 1 ? selectedvillage.nVillageCode.toString() : '0'+selectedvillage.nVillageCode.toString())
      
     
     
    this.oBankAccountService.fngetLastBankAccountInfo(this.oBankAccountModel.nVillageId).subscribe((data:any) => {
      
      if(data.accno.toString().length === 1){
        this.oBankAccountModel.sAccountNo = ''+this.oBankAccountModel.sBranchCode +'000' + data.accno;
      }else{
        
        this.oBankAccountModel.sAccountNo = '0'+(parseInt(data.accno) + 1).toString();
      }
      
      //this.oBankAccountModel.sCustomerId = this.oBankAccountModel.sBranchCode + '0002';
    });

    this.bShowPersonal=true;

  }

  fnResetState() {
    this.oBankAccountModel.sState = '';
  }

  fnOnBankAccountInfoSubmit(): void {
    if(this.oBankAccountModel.sState === '' || 
    this.oBankAccountModel.nDistrictId === null || 
    this.oBankAccountModel.nMandalId === null || 
    this.oBankAccountModel.nVillageId === null || 
    this.oBankAccountModel.sDate === '' || 
    this.oBankAccountModel.sApplicantName === '' ||
    this.oBankAccountModel.sApplicantSurName === '' ||
    this.oBankAccountModel.sGender === '' ||
    this.oBankAccountModel.sDOB === '' ||
    this.oBankAccountModel.sAge === '' ||
    this.oBankAccountModel.sAccountType === '' ||
    this.oBankAccountModel.sAccountCategory === '' ||
    this.oBankAccountModel.sShareType === '' ||
    this.oBankAccountModel.sSMSAlert === '' ||
    this.oBankAccountModel.sFatherOrHusbandName === '' ||
    this.oBankAccountModel.sMotherName === '' ||
    this.oBankAccountModel.sNomineeName === '' ||
    this.oBankAccountModel.sVoterIdNo === '' ||
    this.oBankAccountModel.sAadharNo === '' ||
    this.oBankAccountModel.sRationCardNo === '' ||
    this.oBankAccountModel.sFlatNo === '' ||
    this.oBankAccountModel.sStreetName === '' ||
    this.oBankAccountModel.sVillageAddress === '' ||
    this.oBankAccountModel.sMandalAddress === '' ||
    this.oBankAccountModel.sDistrictAddress === '' ||
    this.oBankAccountModel.sPinCode === '' ||
    this.oBankAccountModel.sMobileNumber === '' ||
    this.oBankAccountModel.sEmail === '' ||
    this.oBankAccountModel.nAmount === null ||
    this.oBankAccountModel.sEmployeeName === ''||
    this.oBankAccountModel.oDocument1Info === null ||
    this.oBankAccountModel.oDocument2Info === null ||
    this.oBankAccountModel.oPassportImageInfo === null ||
    this.oBankAccountModel.oSignature1Info === null ||
    this.oBankAccountModel.oSignature2Info === null){
      this.fnMessage('Please fill all the fields.','warning');
      return;
    }
    if(Number(this.oBankAccountModel.sAge) < 18){
      this.fnMessage('Age should be above 18 years','warning');
      return;
    }
    if(this.bankaccounts != undefined && this.bankaccounts !== null){
      if(this.oBankAccountModel.sState.length === 0 || this.oBankAccountModel.sState.trim().length === 0)
      {
        // this.fnEmptyStateMessage();
        //return;
      }
      //Verification for Duplicate Car name
        for(var i = 0; i < this.bankaccounts.length; i++) {
          if(this.bankaccounts[i].sState.toLowerCase() === this.oBankAccountModel.sState.toLowerCase().trim()) {
            // this.fnDuplicateCarNameMessage();
            //return;
          }
      }
    }
 
      this.bIsAddActive = true;
      //In Edit case,the date coming from db is 'dd-mm-yyyy' for which new Date is giving an error
      // So just checking the lenght of the string, temp fix
      if(this.oBankAccountModel.sDate !== undefined && this.oBankAccountModel.sDate !== '')
        this.oBankAccountModel.sDate = this.oUtilitydateService.fnChangeDateFormate(this.oBankAccountModel.sDate);//new Date(this.oBankAccountModel.sDate).toISOString().split('T')[0].split("-").reverse().join("-");
      if(this.oBankAccountModel.sDOB !== undefined && this.oBankAccountModel.sDate !== '')
        this.oBankAccountModel.sDOB = this.oUtilitydateService.fnChangeDateFormate(this.oBankAccountModel.sDOB);//new Date(this.oBankAccountModel.sDOB).toISOString().split('T')[0].split("-").reverse().join("-");
      if (!this.bisEditMode) {
        this.oBankAccountService.fnAddBankAccountInfo(this.oBankAccountModel).subscribe((data) => {
          this.bankaccounts = [];
          this.oBankAccountService.fngetActiveBankAccountInfo().subscribe((cdata) => {
            this.fnMessage('Account is created sucessfully.','success');
            this.bankaccounts = [...cdata as any];
            //this.oBankAccountModel.sState = '';
            this.bIsAddActive = false;
            this.addClicked.emit();
            this.redirectTo('/newaccountform');
          });
        });
      }else{
        this.oBankAccountService.fnEditBankAccountInfo(this.oBankAccountModel).subscribe((data) => {
          console.log(data);
          this.fnMessage('Account updated sucessfully.','success');
          this.redirectTo('/allaccounts');
        });
      }
  }

  // fnUpdateParentAfterEdit() {
  //   this.oBankAccountService.fngetBankAccountInfo().subscribe((cdata) => {
  //     this.fnEditSucessMessage();
  //     this.bankaccounts = [];
  //     console.log(this.bankaccounts);
  //     this.bankaccounts = [...cdata as any];
  //     console.log(this.bankaccounts);
  //     this.oBankAccountModel.sState = '';
  //     this.modalService.dismissAll();
  //   });
  // }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }

  fnonUploadPassportImageSuccess(args: any){
    this.oBankAccountModel.oPassportImageInfo = args[1].oImageRefId;
  }

  fnonUploadSignature1ImageSuccess(args: any){
    this.oBankAccountModel.oSignature1Info = args[1].oImageRefId;
  }

  fnonUploadSignature2ImageSuccess(args: any){
    this.oBankAccountModel.oSignature2Info = args[1].oImageRefId;
  }

  fnonUploadDocument1ImageSuccess(args: any){
    this.oBankAccountModel.oDocument1Info = args[1].oImageRefId;
  }

  fnonUploadDocument2ImageSuccess(args: any){
    this.oBankAccountModel.oDocument2Info = args[1].oImageRefId;
  }

  fnMessage(message,icon) {
    Swal.fire({
      position: 'center',
      icon: icon,
      title: message,
      showConfirmButton: false,
      timer: 1500
    });
  }
  fnClear(){
    // this.oBankAccountModel.sState = '';
    // this.oBankAccountModel.nDistrictId = null ; 
    // this.oBankAccountModel.nMandalId = null ; 
    // this.oBankAccountModel.nVillageId = null ; 
    this.oBankAccountModel.sDate = '' ; 
    this.oBankAccountModel.sApplicantName = '' ;
    this.oBankAccountModel.sApplicantSurName = '' ;
    this.oBankAccountModel.sGender = '' ;
    this.oBankAccountModel.sDOB = '' ;
    this.oBankAccountModel.sAge = '' ;
    this.oBankAccountModel.sAccountType = '' ;
    this.oBankAccountModel.sAccountCategory = '' ;
    this.oBankAccountModel.sShareType = '' ;
    this.oBankAccountModel.sSMSAlert = '' ;
    this.oBankAccountModel.sFatherOrHusbandName = '' ;
    this.oBankAccountModel.sMotherName = '' ;
    this.oBankAccountModel.sNomineeName = '' ;
    this.oBankAccountModel.sVoterIdNo = '' ;
    this.oBankAccountModel.sAadharNo = '' ;
    this.oBankAccountModel.sRationCardNo = '' ;
    this.oBankAccountModel.sFlatNo = '' ;
    this.oBankAccountModel.sStreetName = '' ;
    this.oBankAccountModel.sVillageAddress = '' ;
    this.oBankAccountModel.sMandalAddress = '' ;
    this.oBankAccountModel.sDistrictAddress = '' ;
    this.oBankAccountModel.sPinCode = '' ;
    this.oBankAccountModel.sMobileNumber = '' ;
    this.oBankAccountModel.sEmail = '' ;
    this.oBankAccountModel.nAmount = null ;
    this.oBankAccountModel.sEmployeeName = '';
    this.oBankAccountModel.oDocument1Info = null ;
    this.oBankAccountModel.oDocument2Info = null ;
    this.oBankAccountModel.oPassportImageInfo = null ;
    this.oBankAccountModel.oSignature1Info = null ;
    this.oBankAccountModel.oSignature2Info = null
  }
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any, index) {
    this.nSelectedEditIndex = index;
    this.modalService.open(content, { centered: true });
  }

  fnValidateNominee(){
     if(this.oBankAccountModel.sNomineeName!==null){
       if(this.oBankAccountModel.sNomineeName!==this.oBankAccountModel.sFatherOrHusbandName&&this.oBankAccountModel.sNomineeName!==this.oBankAccountModel.sMotherName)
          this.bErrorNominee = true ;
       else this.bErrorNominee = false ;
     }  
  }
  fnValidateNomineeRelationship(){
    if(this.oBankAccountModel.sNomineeRelationship !==null){
      let relation = this.oBankAccountModel.sNomineeRelationship.toLocaleLowerCase() ;
      if(relation !== 'father' && relation !== 'mother' && relation !== 'husband')
        this.bErrorNomineeRelation = true ;
      else this.bErrorNomineeRelation = false ;
    }
  }
  fnvalidate(property : string, pattern : string, sErrorName : string){
    if(property !== null){
      if(!property.trim().match(pattern)) this.fnEnableOrDisableError(sErrorName,true);
      else this.fnEnableOrDisableError(sErrorName,false);
    }
  }
  fnEnableOrDisableError(sErrorName : string, flag : boolean){
    if(sErrorName === 'voter') this.bErrorVoterId = flag ;
    else if(sErrorName === 'aadhar') this.bErrorAadhar = flag ;
    else if(sErrorName === 'ration') this.bErrorRation = flag ;
    else if(sErrorName === 'mobile') this.bErrorMobile = flag ;
    else if(sErrorName === 'pin') this.bErrorPin = flag ;
    else if(sErrorName === 'email') this.bErrorEmail = flag ;
  }
}
