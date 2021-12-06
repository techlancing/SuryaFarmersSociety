import { ImageInfo } from './image.model';
export class BankEmployee {
    constructor(
         
        public nEmployeeID : String = '',
        public sAccountNo : number = null,
        public sEmployeeName : string = '',
        public sReligion : string = '',
        public sNationality : string = '',
        public sSpeakLanguage : string = '',
        public sFatherOrHusbandName : string = '',
        public sMotherName : string = '',        
        public sMobileNumber : string = '',
        public sEmployeeCallLetterID : string = '',
        public sCallLetterIssuedDate : string = '',
        public sAppointmentType : string = '',
        public sDesignation : string = '',
        public sIFSCCode : string = '',
        public sBranchName : string = '',
        public sPlace : string = '',
        public sAadharNo : string = '',
        public sJoiningDate : string = '',
        public oPassportImageInfo: ImageInfo = null, 
        public oEmployeePhotoUpload: ImageInfo = null,
        public oBankPassBookUpload: ImageInfo = null,
        public oCallLetterUpload: ImageInfo = null,
        public oAadharUpload: ImageInfo = null

    ) {

    }
}




