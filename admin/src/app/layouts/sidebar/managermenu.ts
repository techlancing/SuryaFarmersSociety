import { MenuItem } from './menu.model';
export const MMENU: MenuItem[] = [ 
    {
        id: 200,
        label: 'MENUITEMS.MANAGERMENU.MESSAGE'
    },
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 400,
        label: 'MENUITEMS.MANAGEREMPLOYEE.TEXT',
        icon: 'bx-store',
        subItems: [
                {
                    id: 25,
                    label: 'MENUITEMS.MANAGEREMPLOYEE.LIST.ADDEMPLOYEE',
                    link: '/addemployee',
                    parentId: 400
                },
        ]
    },

    {
        id: 100,
        label: 'MENUITEMS.MANAGERAPPROVAL.TEXT',
        icon: 'bx-store',
        subItems: [
            {
                id: 101,
                label: 'MENUITEMS.MANAGERAPPROVAL.LIST.LOANAPPROVAL',
                link: '/loanapproval',
                parentId: 100
            },
            {
                id: 102,
                label: 'MENUITEMS.MANAGERAPPROVAL.LIST.CREDITAPPROVAL',
                link: '/creditapproval',
                parentId: 100
            },
            {
                id: 103,
                label: 'MENUITEMS.MANAGERAPPROVAL.LIST.SAVINGSTYPEAPPROVAL',
                link: '/savingsapproval',
                parentId: 100
            },
        ]
    },

    {
        id: 35,
        label: 'MENUITEMS.MANAGERCLOSING.TEXT',
        icon: 'bx-book-open',
        subItems: [
            {
                id: 37,
                label: 'MENUITEMS.MANAGERCLOSING.LIST.SAVINGTYPECLOSING',
                link: '/accountClosing',
                parentId: 35
            },
            {
                id: 38,
                label: 'MENUITEMS.MANAGERCLOSING.LIST.VIEWCLOSEDACCOUNTS',
                link: '/closedaccounts',
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
    },
    {
        id: 401,
        label: 'MENUITEMS.MANAGERACCOUNTS.TEXT',
        icon: 'bx-store',
        subItems: [
                    {
                        id: 4,
                        label: 'MENUITEMS.MANAGERACCOUNTS.LIST.BANKACCOUNTUPDATE',
                        link: '/allaccounts',
                        parentId: 401
                    }
        ]
    },
    {
        id: 500,
        label: 'MENUITEMS.LOGOUT.TEXT',
        icon: 'bx-home-circle',
        link : '/logout'
    }
    
];