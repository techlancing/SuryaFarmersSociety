import { ImageInfo } from './image.model';
export class IntraTransaction {
    constructor(       
        public sTransactionId : number = null,//unique: true},        
        public sDate : string = '',
        public sBranchName : string = '',
        public sBranchCode : string = '',
        public sAccountNumber : string = '',
        public sTransactionEmployee : string = '',        
        public sNarration : string = '',        
        public nAmount : number = null,
        

    ) {

    }
}