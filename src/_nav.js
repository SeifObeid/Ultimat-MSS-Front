import { checkPagePermession } from "./shared/utils"

export default {
    Dashboard: {
        name: 'Dashboard',
        url: '/dashboard',
        icon: 'icon-speedometer',
        // badge: {
        //     variant: 'primary',
        //     text: 'NEW'
        // }
    },
    Medical: {
        title: true,
        name: 'Medical equipment ',
        class: '',
        wrapper: {
            element: '',
            attributes: {}
        }
    },
    Calculation_Sheets: {
        name: 'Calculation Sheets',
        url: '/calculationSheets',
        icon: 'icon-calculator',
        children: [
            {
                name: 'Calculation sheet list',
                url: '/calculationSheets',
                icon: 'icon-calculator'
            },
            {
                name: 'Create new',
                url: '/NewCalculationSheet',
                icon: 'icon-plus'
            }
        ]
    },
    Calendar: {
        name: 'Calendar',
        url: '/events/calendar',
        icon: 'icon-calendar',
    },
    EmailSettings: {
        name: 'Email Settings',
        url: '/events/emailSettings',
        icon: 'cui-settings icons',
    },
    Price_Quotation: {
        name: 'Price Quotation',
        url: '/priceQuotations',
        icon: 'cui-dollar icons',

    },
    Awarding_sheet: {
        name: 'Awarding sheet',
        url: '/awardingList',
        icon: 'icon-speedometer',

    },
    //-------Tender---------------
    Tender: {
        title: true,
        name: 'Tender',
        class: '',
        wrapper: {
            element: '',
            attributes: {}
        }
    },
    Tender_Calculation_Sheets: {
        name: 'Calculation Sheets',
        url: '/tenderCalculationSheets',
        icon: 'icon-calculator',
        children: [
            {
                name: 'Calculation sheet list',
                url: '/tenderCalculationSheets',
                icon: 'icon-calculator'
            },
            {
                name: 'Create new',
                url: '/NewTenderCalculationSheet',
                icon: 'icon-plus'
            }
        ]
    },
    Tender_Calendar: {
        name: 'T. Calendar',
        url: '/tenderEvents/calendar',
        icon: 'icon-calendar',
    },
    Tender_Price_Quotation: {
        name: 'T. Price Quotation',
        url: '/tenderPriceQuotations',
        icon: 'cui-dollar icons',
    },
    Tender_Awarding_sheet: {
        name: 'T. Awarding sheet',
        url: '/tenderAwardingList',
        icon: 'icon-speedometer',
    },
    //-------Lab---------------
    Lab: {
        title: true,
        name: 'Lab',
        class: '',
        wrapper: {
            element: '',
            attributes: {}
        }
    },
    Lab_Calculation_Sheets: {
        name: 'Calculation Sheets',
        url: '/labCalculationSheets',
        icon: 'icon-calculator',
        children: [
            {
                name: 'Calculation sheet list',
                url: '/labCalculationSheets',
                icon: 'icon-calculator'
            },
            {
                name: 'Create new',
                url: '/NewLabCalculationSheet',
                icon: 'icon-plus'
            }
        ]
    },
    
    //-------End Tender-----------
    Administration: {
        title: true,
        name: 'Administration',
        class: '',
        wrapper: {
            element: '',
            attributes: {}
        }
    },
    Users: {
        name: 'Users',
        url: '/userManagement/usersList',
        icon: 'cui-people icons',
        linkActiveClass: true,
    },
    Roles: {
        name: 'Roles',
        url: '/userManagement/rolesList',
        icon: 'cui-monitor icons'
    },
    Tracking: {
        name: 'Tracking',
        url: '/sheets/tracking',
        icon: 'icon-list'
    },
    Settings: {
        name: 'Settings',
        // url: '/base',
        icon: 'cui-settings icons',
        children: [
            {
                name: 'Items Management',
                url: '/items',
                icon: 'icon-calculator'
            },
            {
                name: 'Items configuration',
                url: '/items-group',
                icon: 'icon-calculator'
            },
            {
                name: 'Workflow Definition',
                url: '/workflow-definition',
                icon: 'icon-calculator'
            },
            {
                name: 'T. Workflow Definition',
                url: '/tender-workflow-definition',
                icon: 'icon-calculator'
            },
        ],
    },
    items: [],
}

