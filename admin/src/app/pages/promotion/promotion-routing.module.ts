import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BannerType } from '../../core/enums/banner.enum';
import { HomemainbannerComponent } from './homemainbanner/homemainbanner.component';
import { FirstlayoutbannerComponent } from './firstlayoutbanner/firstlayoutbanner.component';
import { SecondlayoutbannerComponent } from './secondlayoutbanner/secondlayoutbanner.component';
import { ThirdlayoutbannerComponent } from './thirdlayoutbanner/thirdlayoutbanner.component';


const routes: Routes = [
  {
    path: 'addhomemainbanner',
    component: HomemainbannerComponent,
    data: {
      type: BannerType.MainSlider
  }
},
  {
    path: 'addfirstlayoutbanner',
    component: FirstlayoutbannerComponent,
    data: {
      type: BannerType.FirstLayout
  }
},
  {
    path: 'addsecondlayoutbanner',
    component: SecondlayoutbannerComponent,
    data: {
      type: BannerType.SecondLayout
  }
  },
  {
    path: 'addthirdlayoutbanner',
    component: ThirdlayoutbannerComponent,
    data: {
      type: BannerType.ThirdLayout
  }
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
