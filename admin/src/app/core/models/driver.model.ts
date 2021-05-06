import { ImageInfo } from './image.model';
export class Driver {
    constructor(
        public nDriverId : number = null,//unique: true},
        public sDriverName : string = '',
        public sDriverMobile : number = null,
        public sDriverAddress : string = '',
        public sDriverExperience : number = null,
        public sDriverAge : number = null,
        public sDriverLicense : number = null,
        public sDriveavailability : boolean = false,
        public oImageInfo: ImageInfo = null
    ) {

    }
}




