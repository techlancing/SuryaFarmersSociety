import { ImageInfo } from './image.model';
export class BankEmployee {
    constructor(
        public sAddress : string = '',
        public sBranchCode : string = '',
        public nAccountId : number = null,//unique: true},
        public sAccountNo : string = null,
        public sState : string = '',
        public sDistrict : string = '',
        public sMandal : string = '',
        public sVillage : string = '',
        public sCustomerId : string = null,
        public sDate : string = '',
        public sApplicantName : string = '',
        public sApplicantSurName : string = '',
        public sGender : string = '',
        public sDOB : string = '',
        public sAge : string = '',
        public sAccountType : string = '',
        public sAccountCategory : string = '',
        public sShareType : string = '',
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
        public sEmployeeCallLetterID : string = '',
        public sCallLetterIssuedDate : string = '',
        public nEmployeeID : number = null,
        public sNationality : string = '',
        public sEmployeeName : string = '',
        public sReligion : string = '',
        public sSpeakLanguage : string = '',
        public sAppointmentType : string = '',
        public sDesignation : string = '',
        public sIfscCode : string = '',
        public sBranchName : string = '',
        public sPlace : string = '',        
        public nAmount : number = null,
        public oPassportImageInfo: ImageInfo = null, 
        public oEmployeePhotoUpload: ImageInfo = null,
        public oBankPassbookUpload: ImageInfo = null,
        public oCallLetterUpload: ImageInfo = null,
        public oAadharUpload: ImageInfo = null

    ) {

    }
}




