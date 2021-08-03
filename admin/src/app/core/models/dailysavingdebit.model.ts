import { ImageInfo } from './image.model';
export class DailySavingDebit {
    constructor( 
        public sAccountNo : string = '',     
        public nTransactionId : number = null,//unique: true},        
        public sStartDate : string = '',
        public sEndDate : string = '',
        public nDayAmount : number = null,
        public sTotaldays : number = null,
        public sReceiverName : string = '',        
        public sNarration : string = '',        
        public nAmount : number = null,
        

    ) {

    }
}
