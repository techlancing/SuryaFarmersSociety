import { ImageInfo } from './image.model';
export class Category {
    constructor(
        public nCategoryId : number = null,//unique: true},
        public sCategoryName : string = '',
        public sCategoryURL : string = '',
        public oImageInfo: ImageInfo = null
    ) {

    }
}




