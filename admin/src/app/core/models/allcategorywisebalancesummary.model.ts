import { ImageInfo } from './image.model';
export class AllCategoryWiseBalanceSummary {
    constructor(       
        public sTransactionId : number = null,//unique: true},        
        public sDate : string = '',
        public sReceiverName : string = '',        
        public sNarration : string = '',        
        public nAmount : number = null,
        

    ) {

    }
}
