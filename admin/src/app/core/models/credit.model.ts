import { ImageInfo } from './image.model';
export class Credit {
    constructor(
        public sAccountNo : string = '',
        public nLoanId : number = null,
        public sTransactionId : string = '',//unique: true},        
        public sDate : string = '',
        public sReceiverName : string = '',        
        public sNarration : string = '',        
        public nAmount : number = null,
        

    ) {

    }
}
