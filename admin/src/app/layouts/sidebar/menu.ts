import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.DASHBOARDS.LIST.DEFAULT',
                link: '/dashboard',
                parentId: 2
            }
        ]
    },
    {
        id: 7,
        label: 'MENUITEMS.APPS.TEXT',
        isTitle: true
    },
    {
        id: 10,
        label: 'MENUITEMS.ECOMMERCE.TEXT',
        icon: 'bx-store',
        subItems: [
            {
                id: 19,
                label: 'MENUITEMS.ECOMMERCE.LIST.ADDACCOUNT',
                link: '/newaccountform',
                parentId: 10
            },
            {
                id: 20,
                label: 'MENUITEMS.ECOMMERCE.LIST.ADDDISTRICT',
                link: '/adddistrict',
                parentId: 10
            },
            {
                id: 25,
                label: 'MENUITEMS.ECOMMERCE.LIST.ADDMANDAL',
                link: '/addmandal',
                parentId: 10
            }
        ]
    },
  {
    id: 35,
    label: 'MENUITEMS.PROMOTIONUSER.TEXT',
    icon: 'bx-briefcase-alt-2',
    subItems: [
        {
            id: 36,
            label: 'MENUITEMS.PROMOTIONUSER.LIST.ADDHOMEMAINBANNER',
            link: '/promotion/addhomemainbanner',
            parentId: 35
        }
    ]
},
{
    id: 40,
    label: 'MENUITEMS.CUSTOMERS.TEXT',
    icon: 'bx-user',
    subItems: [
          {
            id: 42,
            label: 'MENUITEMS.CUSTOMERS.LIST.ENDUSERS',
            link: '/ecommerce/endusers',
            parentId: 40
        }
    ]
},
{
  id: 43,
  label: 'MENUITEMS.TRANSACTIONS.TEXT',
  icon: 'bx-dollar-circle',
  subItems: [
      {
          id: 44,
          label: 'MENUITEMS.TRANSACTIONS.LIST.ALLORDERS',
          link: '/ecommerce/allorders',
          parentId: 43
      }
  ]
},
{
    id: 45,
    label: 'MENUITEMS.INVOICES.TEXT',
    icon: 'bx-receipt',
    subItems: [
        {
            id: 46,
            label: 'MENUITEMS.INVOICES.LIST.INVOICELIST',
            link: '/ecommerce/invoicelist',
            parentId: 45
        },
        {
            id: 47,
            label: 'MENUITEMS.INVOICES.LIST.INVOICEDETAILS',
            link: '/ecommerce/invoicedetails',
            parentId: 45
        }
    ]
  }
];

