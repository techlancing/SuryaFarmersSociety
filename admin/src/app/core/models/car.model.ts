import { ImageInfo } from './image.model';
export class Car {
    constructor(
        public nCarId : number = null,//unique: true},
        public sCarName : string = '',
        public sCarType : string = '',
        public sCarSeating : string = '',
        public sCarRent : number = null,
        public sCarDistanceCost : number = null,
        public sCarTimeCost : number = null,
        public oImageInfo: ImageInfo = null
    ) {

    }
}




