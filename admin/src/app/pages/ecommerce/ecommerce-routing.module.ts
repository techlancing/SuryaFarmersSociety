import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddcarComponent } from './addcar/addcar.component';
import { AdddriverComponent } from './adddriver/adddriver.component';

const routes: Routes = [
    {
        path: 'addcar',
        component: AddcarComponent
    },
    {
        path: 'adddriver',
        component: AdddriverComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EcommerceRoutingModule {}
