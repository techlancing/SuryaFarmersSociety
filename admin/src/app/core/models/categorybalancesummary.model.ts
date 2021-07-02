import { ImageInfo } from './image.model';
export class CategoryBalanceSummary {
    constructor(
        public sSanctionAmount : string = '',        
        public sTransactionId : number = null,//unique: true},        
        public sDate : string = '',               
    ) {

    }
}
