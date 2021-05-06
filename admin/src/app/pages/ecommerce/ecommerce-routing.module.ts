import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopsComponent } from './shops/shops.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartComponent } from './cart/cart.component';
import { AddproductComponent } from './addproduct/addproduct.component';
import { CustomersComponent } from './customers/customers.component';
import { AllordersComponent } from './allorders/allorders.component';
import { AllretailersComponent } from './allretailers/allretailers.component';
import { AllusersComponent } from './allusers/allusers.component';
import { AddmanufacturerComponent } from './addmanufacturer/addmanufacturer.component';
import { AddconfigurationtypeComponent } from './addconfigurationtype/addconfigurationtype.component';
import { AddconfigurationvalueComponent } from './addconfigurationvalue/addconfigurationvalue.component';
import { AddvendorComponent } from './addvendor/addvendor.component';
import { InvoicelistComponent } from './invoicelist/invoicelist.component';
import { InvoicedetailsComponent } from './invoicedetails/invoicedetails.component';
import { AddcarComponent } from './addcar/addcar.component';
import { AdddriverComponent } from './adddriver/adddriver.component';
import { AddtripComponent } from './addtrip/addtrip.component';
const routes: Routes = [
    {
        path: 'addcar',
        component: AddcarComponent
    },
    {
        path: 'adddriver',
        component: AdddriverComponent
    },
    {
        path: 'addtrip',
        component: AddtripComponent
    },
    {
      path: 'addconfigurationtype',
      component: AddconfigurationtypeComponent
    },
    {
      path: 'addconfigurationvalue',
      component: AddconfigurationvalueComponent
    },
    {
        path: 'addmanufacturer',
        component: AddmanufacturerComponent
    },
    {
        path: 'shops',
        component: ShopsComponent
    },
    {
        path: 'checkout',
        component: CheckoutComponent
    },
    {
        path: 'cart',
        component: CartComponent
    },
    {
        path: 'addvendor',
        component: AddvendorComponent
    },
    {
        path: 'customers',
        component: CustomersComponent
    },
    {
        path: 'allorders',
        component: AllordersComponent
    },
    {
        path: 'retailers',
        component: AllretailersComponent
    },
    {
        path: 'endusers',
        component: AllusersComponent
    },
    {
        path: 'invoicelist',
        component: InvoicelistComponent
    },
    {
        path: 'invoicelist/:orderId',
        component: InvoicedetailsComponent
    },
    {
        path: 'invoicedetails',
        component: InvoicedetailsComponent

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EcommerceRoutingModule {}
