import { ImageInfo } from './image.model';
export class DailySavingsDeposit {
    constructor( 
        public sAccountNo : string = '', 
        public nAccountId : number = null,   
        public sTransactionId : string = '',//unique: true},        
        public sStartDate : string = '',
        public sEndDate : string = '',
        public nDayAmount : number = null,
        public nTotaldays : number = null,
        public sReceiverName : string = '',        
        public sNarration : string = '',        
        public nAmount : number = null,
        

    ) {

    }
}
