import { ImageInfo } from './image.model';
export class PassBookPrint {
    constructor(
        public sAddress : string = '',
        public sBranchCode : string = '',        
        public sAccountNo : string = null,
        public sDate : string = '',
        public sCustomerName : string = '',
        public sBranchName : string = '',
        public sSerialId : string = '',        
        public sAccountType : string = '',        
        public sFatherOrHusbandName : string = '',        
        public sBranchAddress : string = '',
        public sSerialID : string = '',        
        public sMobileNumber : string = '',
    ) {

    }
}