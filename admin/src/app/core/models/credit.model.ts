import { ImageInfo } from './image.model';
export class Credit {
    constructor(       
        public sTransactionId : string = '',//unique: true},        
        public sDate : string = '',
        public sReceiverName : string = '',        
        public sNarration : string = '',        
        public nAmount : number = null,
        

    ) {

    }
}
