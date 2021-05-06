import { ImageInfo } from './image.model';
import { BannerType } from './../enums/banner.enum';

export class Banner {
    constructor(
        public nBannerId: number = null,
        public eBannerType: string = BannerType.MainSlider,
        public sBannerHeading: string = '',
        public sBannerSubHeading: string = '',
        public oImageInfo_desktop: ImageInfo = null,
        public oImageInfo_mobile: ImageInfo = null,
        public sBannerURL: string = ''
    ) {

    }
}

export class BannerSettings {
  constructor(
    public eBannerType: BannerType,
    public nBannerCount: number = null
  ){

  }
}




