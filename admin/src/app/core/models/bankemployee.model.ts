import { ImageInfo } from './image.model';
export class BankEmployee {
    constructor(
        
        public sDate : string = '',        
        public sFatherOrHusbandName : string = '',
        public sMotherName : string = '',        
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
        public sAadharNo : string = '',
        public sJoiningDate : string = '',
        public sAccountNo : number = null,
        public oPassportImageInfo: ImageInfo = null, 
        public oEmployeePhotoUpload: ImageInfo = null,
        public oBankPassbookUpload: ImageInfo = null,
        public oCallLetterUpload: ImageInfo = null,
        public oAadharUpload: ImageInfo = null

    ) {

    }
}




