import { ImageInfo } from './image.model';
export class Trip {
    constructor(
        public nTripId : number = null,//unique: true},
        public sTripFrom : string = '',
        public sTripTo : string = '',
        public sTripType : string = '',
        public sTripFromDate : string = '',
        public sTripToDate : string = '',
        public sTripDistance : number = null,
        public sTripDistanceCost : number = null
    ) {

    }
}




