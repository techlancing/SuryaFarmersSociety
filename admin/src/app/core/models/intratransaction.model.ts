import { ImageInfo } from './image.model';
export class IntraTransaction {
    constructor(       
        public sTransactionId : string = '',//unique: true},        
        public sDate : string = '',
        public sSenderAccountNumber : string = '',
        public sRecieverAccountNumber : string = '',
        public sTransactionEmployee : string = '',        
        public sNarration : string = '',        
        public nAmount : number = null,
        public sRecieverAccountType: string = '',
        public nLoanId: number = null,
        public nReceiverAccountId: number = null,
        public nSenderAccountId: number = null

    ) {

    }
}