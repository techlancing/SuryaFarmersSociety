import { ImageInfo } from './image.model';
export class Debit {
    constructor(
        public sTransactionId : string = '',//unique: true},
        //public sAccountNo : string = null,
        public sDate : string = '',
        public sReceiverName : string = '',
        public sNarration : string = '',        
        public nAmount : number = null,

    ) {

    }
}
