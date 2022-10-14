import { ImageInfo } from './image.model';
export class BankAccount {
    constructor(
        public sAddress : string = '',
        public sBranchCode : string = '',
        public sBranchName : string = '',
        public sMandalBranchName : string = '',
        public nAccountId : number = null,//unique: true},
        public sAccountNo : string = null,
        public sState : string = '',
        public nDistrictId : number = null,
        public nMandalId : number = null,
        public nVillageId : number = null,
        public sCustomerId : number = null,
        public sDate : string = '',
        public sApplicantName : string = '',
        public sApplicantSurName : string = '',
        public sGender : string = '',
        public sDOB : string = '',
        public sAge : string = '',
        public sAccountType : string = '',
        public sAccountCategory : string = '',
        public sShareType : string = '',
        public sSMSAlert : string = '',
        public sFatherOrHusbandName : string = '',
        public sMotherName : string = '',
        public sNomineeName : string = '',
        public sNomineeRelationship : string = '',
        public sVoterIdNo : string = '',
        public sAadharNo : string = '',
        public sRationCardNo : string = '',
        public sFlatNo : string = '',  
        public sStreetName : string = '',
        public sVillageAddress : string = '',
        public sMandalAddress : string = '',
        public sDistrictAddress : string = '',
        public sPinCode : string = '',
        public sMobileNumber : string = '',
        public sEmail : string = '',
        public nAmount : number = null,
        public bIsDeactivated : boolean = false ,
        public sEmployeeName : string = '',
        public oPassportImageInfo: ImageInfo = null,
        public oSignature1Info: ImageInfo = null,
        public oSignature2Info: ImageInfo = null,
        public oDocument1Info: ImageInfo = null,
        public oDocument2Info: ImageInfo = null

    ) {

    }
}




