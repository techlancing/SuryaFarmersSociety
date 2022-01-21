import { MenuItem } from './menu.model';
export const MMENU: MenuItem[] = [ 
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 25,
        label: 'MENUITEMS.ECOMMERCE.LIST.ADDEMPLOYEE',
        link: '/addemployee',
        parentId: 10
    },
    {
        id: 4,
        label: 'MENUITEMS.DASHBOARDS.LIST.ALLACCOUNTS',
        link: '/allaccounts',
        parentId: 2
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
    
];