import { ImageInfo } from './image.model';
export class DailySavingDebit {
    constructor(       
        public nTransactionId : number = null,//unique: true},        
        public sDate : string = '',
        public sDayAmount : string = '',
        public sTotaldays : string = '',
        public sReceiverName : string = '',        
        public sNarration : string = '',        
        public nAmount : number = null,
        

    ) {

    }
}
