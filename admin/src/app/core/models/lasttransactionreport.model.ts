import { ImageInfo } from './image.model';
export class LastTransaction {
    constructor(       
        public sCredit : number = null,//unique: true},        
        public sDate : string = '',
        public sDebit : string = '',        
        public sBalance : string = '',        
        public nNarration : number = null,
        public sRemark : string = '',        

    ) {

    }
}
