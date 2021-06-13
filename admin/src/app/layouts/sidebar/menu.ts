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
                label: 'MENUITEMS.ECOMMERCE.LIST.ADDDISTRICT',
                link: '/adddistrict',
                parentId: 10
            },
            {
                id: 20,
                label: 'MENUITEMS.ECOMMERCE.LIST.ADDMANDAL',
                link: '/addmandal',
                parentId: 10
            },
            {
                id: 21,
                label: 'MENUITEMS.ECOMMERCE.LIST.ADDVILLAGE',
                link: '/addvillage',
                parentId: 10
            },
            {
                id: 22,
                label: 'MENUITEMS.ECOMMERCE.LIST.ADDACCOUNT',
                link: '/newaccountform',
                parentId: 10
            },
            {
                id: 25,
                label: 'MENUITEMS.ECOMMERCE.LIST.ADDEMPLOYEE',
                link: '/addemployee',
                parentId: 10
            }
        ]
    },
  {
    id: 35,
    label: 'MENUITEMS.PASSBOOK.TEXT',
    icon: 'bx-book-open',
    subItems: [
        {
            id: 36,
            label: 'MENUITEMS.PASSBOOK.LIST.PASSBOOKPRINT',
            link: '/passbookprint',
            parentId: 35
        },
        {
            id: 37,
            label: 'MENUITEMS.PASSBOOK.LIST.ALLTRANSACTIONPRINT',
            link: '/alltranactionprint',
            parentId: 35
        }
    ]
},
{
    id: 40,
    label: 'MENUITEMS.ACCOUNTTRANSACTION.TEXT',
    icon: 'bx-user',
    subItems: [
          {
            id: 42,
            label: 'MENUITEMS.ACCOUNTTRANSACTION.LIST.DEBIT',
            link: '/debit',
            parentId: 40
        },
        {
            id: 43,
            label: 'MENUITEMS.ACCOUNTTRANSACTION.LIST.DAILYSAVINGDEBIT',
            link: '/dailysavingdebit',
            parentId: 40
        },
        {
            id: 44,
            label: 'MENUITEMS.ACCOUNTTRANSACTION.LIST.CREDIT',
            link: '/credit',
            parentId: 40
        },
        {
            id: 45,
            label: 'MENUITEMS.ACCOUNTTRANSACTION.LIST.CREDITLOAN',
            link: '/creditloan',
            parentId: 40
        },
        {
            id: 46,
            label: 'MENUITEMS.ACCOUNTTRANSACTION.LIST.INTRATRANSACTION',
            link: '/intratransaction',
            parentId: 40
        }
    ]
},
{
    id: 47,
    label: 'MENUITEMS.ACCOUNTSTATEMENT.TEXT',
    icon: 'bx-note',
    subItems: [
        {
            id: 36,
            label: 'MENUITEMS.PASSBOOK.LIST.PASSBOOKPRINT',
            link: '/passbookprint',
            parentId: 35
        }
    ]
},
{
    id: 47,
    label: 'MENUITEMS.REPORTS.TEXT',
    icon: 'bxs-report',
    subItems: [
        {
            id: 36,
            label: 'MENUITEMS.PASSBOOK.LIST.PASSBOOKPRINT',
            link: '/passbookprint',
            parentId: 35
        }
    ]
}
];

