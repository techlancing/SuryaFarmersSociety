import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
              private modalService: NgbModal) { }

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
      this.fnDisplayExistingImageThumbnail();
    }
    this.oBankAccountService.fngetBankAccountInfo().subscribe((data) => {
      this.bankaccounts = [...data as any];

    });
  }

  private fnDisplayExistingImageThumbnail(): void{

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
/*
  fnCalculateAge(){
    if(this.oBankAccountModel.sDOB===''){
      var today=(new Date).getFullYear;  
      this.oBankAccountModel.sAge=today-(new Date(this.oBankAccountModel.sDOB).toISOString().split('T')[0].split("-").reverse().join("-")).getFullYear
   }
  }*/

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
        this.oBankAccountModel.sAccountNo = '0'+this.oBankAccountModel.sBranchCode +'000' + data.accno;
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
    this.oBankAccountModel.nAmount === null ){
      this.fnShowFieldsAreEmpty();
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
        this.oBankAccountModel.sDate = new Date(this.oBankAccountModel.sDate).toISOString().split('T')[0].split("-").reverse().join("-");
      if(this.oBankAccountModel.sDOB !== undefined && this.oBankAccountModel.sDate !== '')
        this.oBankAccountModel.sDOB = new Date(this.oBankAccountModel.sDOB).toISOString().split('T')[0].split("-").reverse().join("-");
      if (!this.bisEditMode) {
        this.oBankAccountService.fnAddBankAccountInfo(this.oBankAccountModel).subscribe((data) => {
          this.bankaccounts = [];
          this.oBankAccountService.fngetBankAccountInfo().subscribe((cdata) => {
            this.fnSucessMessage();
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
          this.fnEditSucessMessage();
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

  fnSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Account is created sucessfully.',
      showConfirmButton: false,
      timer: 1500
    });
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

  

  fnEditSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Account updated sucessfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any, index) {
    this.nSelectedEditIndex = index;

    this.modalService.open(content, { centered: true });

  }

}
