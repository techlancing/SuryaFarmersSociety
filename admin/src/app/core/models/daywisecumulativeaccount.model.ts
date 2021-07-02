import { ImageInfo } from './image.model';
export class DaywiseCumulativeAccount {
    constructor(
        public sSanctionAmount : string = '',        
        public sTransactionId : number = null,//unique: true},        
        public sDate : string = '',               
    ) {

    }
}
