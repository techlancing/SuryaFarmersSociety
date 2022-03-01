import { MenuItem } from './menu.model';
export const CMENU: MenuItem[] = [
    {
        id: 300,
        label: 'MENUITEMS.CHAIRMANMENU.MESSAGE'
    },
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    ,
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
             }

        ]
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
            },
            {
                id: 5,
                label: 'MENUITEMS.DASHBOARDS.LIST.ALLEMPLOYEES',
                link: '/allemployees',
                parentId: 2
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
            },
            {
                id: 38,
                label: 'MENUITEMS.PASSBOOK.LIST.BALANCEENQUIRY',
                link: '/accountBalanceEnquiry',
                parentId: 35
            },
            {
                id: 39,
                label: 'MENUITEMS.PASSBOOK.LIST.BANKACCOUNTSTATEMENT',
                link: '/accountStatement',
                parentId: 35
            }
        ]
    },
    {
        id: 48,
        label: 'MENUITEMS.REPORTS.TEXT',
        icon: 'bxs-report',
        subItems: [
            {
                id: 60,
                label: 'MENUITEMS.REPORTS.LIST.DAYWISETRANSACTIONREPORT',
                link: '/DayWiseTransaction',
                parentId: 48
            },
            {
                id: 61,
                label: 'MENUITEMS.REPORTS.LIST.DAYWISECUMULATIVE',
                link: '/DayWiseCumulative',
                parentId: 49
            },
            {
                id: 60,
                label: 'MENUITEMS.REPORTS.LIST.DAYWISECUMULATIVEACCOUNT',
                link: '/DayWiseCumulativeAccount',
                parentId: 50
            },
            {
                id: 60,
                label: 'MENUITEMS.REPORTS.LIST.LAST12MONTHSTRANSACTION',
                link: '/Last12MonthsTransaction',
                parentId: 52
            },
            {
                id: 60,
                label: 'MENUITEMS.REPORTS.LIST.CATEGORYBALANCESUMMARY',
                link: '/CategoryBalanceSummary',
                parentId: 53
            },
            {
                id: 60,
                label: 'MENUITEMS.REPORTS.LIST.ALLCATEGORYBALANCESUMMARY',
                link: '/AllCategoryBalanceSummary',
                parentId: 54
            }
        ]
    }
];


/*export const MENU: MenuItem[] = [
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
            },
            {
                id: 4,
                label: 'MENUITEMS.DASHBOARDS.LIST.ALLACCOUNTS',
                link: '/allaccounts',
                parentId: 2
            },
            {
                id: 5,
                label: 'MENUITEMS.DASHBOARDS.LIST.ALLEMPLOYEES',
                link: '/allemployees',
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
            },
            {
                id: 45,
                label: 'MENUITEMS.ECOMMERCE.LIST.CREDITLOAN',
                link: '/creditloan',
                parentId: 40
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
            },
            {
                id: 38,
                label: 'MENUITEMS.PASSBOOK.LIST.BALANCEENQUIRY',
                link: '/accountBalanceEnquiry',
                parentId: 35
            },
            {
                id: 39,
                label: 'MENUITEMS.PASSBOOK.LIST.BANKACCOUNTSTATEMENT',
                link: '/accountStatement',
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
                id: 49,
                label: 'MENUITEMS.ACCOUNTTRANSACTION.LIST.DAILYSAVINGSDEPOSIT',
                link: '/dailysavingsdeposit',
                parentId: 40
            },
            {
                id: 62,
                label: 'MENUITEMS.ACCOUNTTRANSACTION.LIST.WITHDRAWAL',
                link: '/withdrawal',
                parentId: 40
            },
            {
                id: 44,
                label: 'MENUITEMS.ACCOUNTTRANSACTION.LIST.CREDIT',
                link: '/credit',
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
        id: 48,
        label: 'MENUITEMS.REPORTS.TEXT',
        icon: 'bxs-report',
        subItems: [
            {
                id: 60,
                label: 'MENUITEMS.REPORTS.LIST.DAYWISETRANSACTIONREPORT',
                link: '/DayWiseTransaction',
                parentId: 48
            },
            {
                id: 61,
                label: 'MENUITEMS.REPORTS.LIST.DAYWISECUMULATIVE',
                link: '/DayWiseCumulative',
                parentId: 49
            },
            {
                id: 60,
                label: 'MENUITEMS.REPORTS.LIST.DAYWISECUMULATIVEACCOUNT',
                link: '/DayWiseCumulativeAccount',
                parentId: 50
            },
            {
                id: 60,
                label: 'MENUITEMS.REPORTS.LIST.LAST12MONTHSTRANSACTION',
                link: '/Last12MonthsTransaction',
                parentId: 52
            },
            {
                id: 60,
                label: 'MENUITEMS.REPORTS.LIST.CATEGORYBALANCESUMMARY',
                link: '/CategoryBalanceSummary',
                parentId: 53
            },
            {
                id: 60,
                label: 'MENUITEMS.REPORTS.LIST.ALLCATEGORYBALANCESUMMARY',
                link: '/AllCategoryBalanceSummary',
                parentId: 54
            }
        ]
    }
];
*/
