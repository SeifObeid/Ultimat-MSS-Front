import Vue from 'vue'
import store from '../store/store'
import Router from 'vue-router'
import moment from "moment"
import { checkPagePermession } from "../shared/utils"

// Containers
const DefaultContainer = () => import('@/containers/DefaultContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

const Colors = () => import('@/views/theme/Colors')
const Typography = () => import('@/views/theme/Typography')

const Charts = () => import('@/views/Charts')
const Widgets = () => import('@/views/Widgets')

// Views - Components
/*const Cards = () => import('@/views/base/Cards')
const Forms = () => import('@/views/base/Forms')
const Switches = () => import('@/views/base/Switches')
const Tables = () => import('@/views/base/Tables')
const Tabs = () => import('@/views/base/Tabs')
const Breadcrumbs = () => import('@/views/base/Breadcrumbs')
const Carousels = () => import('@/views/base/Carousels')
const Collapses = () => import('@/views/base/Collapses')
const Jumbotrons = () => import('@/views/base/Jumbotrons')
const ListGroups = () => import('@/views/base/ListGroups')
const Navs = () => import('@/views/base/Navs')
const Navbars = () => import('@/views/base/Navbars')
const Paginations = () => import('@/views/base/Paginations')
const Popovers = () => import('@/views/base/Popovers')
const ProgressBars = () => import('@/views/base/ProgressBars')
const Tooltips = () => import('@/views/base/Tooltips')*/

// Views - Buttons
const StandardButtons = () => import('@/views/buttons/StandardButtons')
const ButtonGroups = () => import('@/views/buttons/ButtonGroups')
const Dropdowns = () => import('@/views/buttons/Dropdowns')
const BrandButtons = () => import('@/views/buttons/BrandButtons')

// Views - Icons
const Flags = () => import('@/views/icons/Flags')
const FontAwesome = () => import('@/views/icons/FontAwesome')
const SimpleLineIcons = () => import('@/views/icons/SimpleLineIcons')
const CoreUIIcons = () => import('@/views/icons/CoreUIIcons')

// Views - Notifications
const Alerts = () => import('@/views/notifications/Alerts')
const Badges = () => import('@/views/notifications/Badges')
const Modals = () => import('@/views/notifications/Modals')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Register = () => import('@/views/pages/Register')
const Forget = () => import('@/views/pages/ForgetPassword')
const Reset = () => import('@/views/pages/ResetPassword')
const Verify = () => import('@/views/pages/VerifyEmail')

// Users
const Users = () => import('@/views/users/Users')
const User = () => import('@/views/users/User')

//User Management
const RolesList = () => import('@/components/userManagement/roles/RolesList')

const AddEditRole = () => import('@/components/userManagement/roles/AddEditRole')
const UsersList = () => import('@/components/userManagement/users/UsersList')
const AddEditUser = () => import('@/components/userManagement/users/AddEditUser')
const UserProfile = () => import('@/components/userManagement/users/UserProfile')

//Events
const Calendar = () => import('@/components/events/Calendar')
const EmailSettings = () => import('@/components/events/EmailSettings')

//Calculation Sheet
const ItemsGroupConfiguration = () => import('@/components/ItemsGroup/ItemsGroupConfiguration')
const ItemsGroupList = () => import('@/components/ItemsGroup/ItemsGroupList')

const ItemsManagmentList = () => import('@/components/Items/index')
const Items = () => import('@/components/Items/create')


const calculationSheetList = () => import('@/components/calculationSheet/CalculationSheetList')

const CalculationSheetMaster = () => import('@/components/calculationSheet/CalculationSheetMaster')
const CalcualtionSheetView = () => import('@/components/calculationSheet/show')
// const MasterCalculationSheet = () => import('@/components/masterCalculationSheet/index')

const WorkflowDefinitionList = () => import('@/components/WorkflowDefinition/WorkflowDefinitionList')
const AddEditWorkflow = () => import('@/components/WorkflowDefinition/AddEditWorkflow')
const WorkflowLog = () => import('@/components/WorkflowDefinition/WorkflowLog')

const awardingSheetList = () => import('@/components/awardingSheet/index')
const newAwardingSheet = () => import('@/components/awardingSheet/create')
const showAwardingSheet = () => import('@/components/awardingSheet/show')


const priceQuotationList = () => import('@/components/priceQuotations/index')
const newPriceQuotation = () => import('@/components/priceQuotations/create')
const showPriceQuotation = () => import('@/components/priceQuotations/show')


const TrackingSheetList = () => import('@/components/trackingSheet/TrackingSheetList')


//---------------------------Tender-----------------------------------------------
//Events
const tenderCalendar = () => import('@/components/tenderEvents/Calendar')

//Calculation Sheet
const tenderItemsGroupConfiguration = () => import('@/components/tenderItemsGroup/ItemsGroupConfiguration')
const tenderItemsGroupList = () => import('@/components/tenderItemsGroup/ItemsGroupList')

const tenderItemsManagmentList = () => import('@/components/tenderItems/index')
const tenderItems = () => import('@/components/tenderItems/create')


const tenderCalculationSheetList = () => import('@/components/tenderCalculationSheet/CalculationSheetList')

const tenderCalculationSheetMaster = () => import('@/components/tenderCalculationSheet/CalculationSheetMaster')
const tenderCalcualtionSheetView = () => import('@/components/tenderCalculationSheet/show')
// const tenderMasterCalculationSheet = () => import('@/components/tenderMasterCalculationSheet/index')

const tenderWorkflowDefinitionList = () => import('@/components/tenderWorkflowDefinition/WorkflowDefinitionList')
const tenderAddEditWorkflow = () => import('@/components/tenderWorkflowDefinition/AddEditWorkflow')
const tenderWorkflowLog = () => import('@/components/tenderWorkflowDefinition/WorkflowLog')
const labWorkflowLog = () => import('@/components/tenderWorkflowDefinition/labWorkflowLog')

const tenderAwardingSheetList = () => import('@/components/tenderAwardingSheet/index')
// const tenderNewAwardingSheet = () => import('@/components/tenderAwardingSheet/create')
const tenderShowAwardingSheet = () => import('@/components/tenderAwardingSheet/show')


const tenderPriceQuotationList = () => import('@/components/tenderPriceQuotations/index')
const tenderNewPriceQuotation = () => import('@/components/tenderPriceQuotations/create')
const tenderShowPriceQuotation = () => import('@/components/tenderPriceQuotations/show')
//-------------------------- End Tender ------------------------------------------

//Calculation Sheet


const labCalculationSheetList = () => import('@/components/LabCalculationSheet/CalculationSheetList')

const labCalculationSheetMaster = () => import('@/components/LabCalculationSheet/CalculationSheetMaster')
const labCalcualtionSheetView = () => import('@/components/LabCalculationSheet/show')
//const LabMasterCalculationSheet = () => import('@/components/LabMasterCalculationSheet/index')


//-------------------------- End Lab ------------------------------------------



Vue.use(Router);
Vue.use(moment);


export const router = new Router({
  // mode: 'hash', // https://router.vuejs.org/api/#mode
  // mode:"hash",
  root: '/',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        permission: 'all'
      }
    },
    {
      path: '/forget',
      name: 'forget',
      component: Forget,
      meta: {
        permission: 'all'
      }
    },
    {
      path: '/reset',
      name: 'reset',
      component: Reset,
      meta: {
        permission: 'all'
      }
    },
    {
      path: '/Verify/:UserId?',
      name: 'Verify',
      component: Verify,
      meta: {
        permission: 'all'
      }
    },
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: DefaultContainer,
      meta: {
        permission: 'all'
      },
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: Dashboard,
          meta: {
            permission: 'all'
          }
        },
        {
          path: '/theme',
          redirect: 'theme/colors',
          name: 'Theme',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'colors',
              name: 'Colors',
              component: Colors
            },
            {
              path: 'typography',
              name: 'Typography',
              component: Typography
            }
          ]
        },
        {
          path: '/charts',
          name: 'Charts',
          component: Charts
        },
        {
          path: '/widgets',
          name: 'Widgets',
          component: Widgets
        },
        {
          path: '/users',
          meta: {
            label: 'Users',
            permission: 'all'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              component: Users,
              meta: {
                permission: 'all'
              }
            },
            {
              path: ':id',
              meta: { label: 'User Details', permission: 'all' },
              name: 'User',
              component: User,
            },
          ]
        },
        // {
        //     path: '/base',
        //     redirect: 'base/cards',
        //     name: 'Base',
        //     component: {
        //         render(c) {
        //             return c('router-view')
        //         }
        //     },
        //     children: [
        //         {
        //             path: 'cards',
        //             name: 'Cards',
        //             component: Cards
        //         },
        //         {
        //             path: 'forms',
        //             name: 'Forms',
        //             component: Forms
        //         },
        //         {
        //             path: 'switches',
        //             name: 'Switches',
        //             component: Switches
        //         },
        //         {
        //             path: 'tables',
        //             name: 'Tables',
        //             component: Tables
        //         },
        //         {
        //             path: 'tabs',
        //             name: 'Tabs',
        //             component: Tabs
        //         },
        //         {
        //             path: 'breadcrumbs',
        //             name: 'Breadcrumbs',
        //             component: Breadcrumbs
        //         },
        //         {
        //             path: 'carousels',
        //             name: 'Carousels',
        //             component: Carousels
        //         },
        //         {
        //             path: 'collapses',
        //             name: 'Collapses',
        //             component: Collapses
        //         },
        //         {
        //             path: 'jumbotrons',
        //             name: 'Jumbotrons',
        //             component: Jumbotrons
        //         },
        //         {
        //             path: 'list-groups',
        //             name: 'List Groups',
        //             component: ListGroups
        //         },
        //         {
        //             path: 'navs',
        //             name: 'Navs',
        //             component: Navs
        //         },
        //         {
        //             path: 'navbars',
        //             name: 'Navbars',
        //             component: Navbars
        //         },
        //         {
        //             path: 'paginations',
        //             name: 'Paginations',
        //             component: Paginations
        //         },
        //         {
        //             path: 'popovers',
        //             name: 'Popovers',
        //             component: Popovers
        //         },
        //         {
        //             path: 'progress-bars',
        //             name: 'Progress Bars',
        //             component: ProgressBars
        //         },
        //         {
        //             path: 'tooltips',
        //             name: 'Tooltips',
        //             component: Tooltips
        //         }
        //     ]
        // },
        {
          path: 'buttons',
          redirect: 'buttons/standard-buttons',
          name: 'Buttons',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'standard-buttons',
              name: 'Standard Buttons',
              component: StandardButtons
            },
            {
              path: 'button-groups',
              name: 'Button Groups',
              component: ButtonGroups
            },
            {
              path: 'dropdowns',
              name: 'Dropdowns',
              component: Dropdowns
            },
            {
              path: 'brand-buttons',
              name: 'Brand Buttons',
              component: BrandButtons
            }
          ]
        },
        {
          path: '/icons',
          redirect: 'icons/font-awesome',
          name: 'Icons',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'coreui-icons',
              name: 'CoreUI Icons',
              component: CoreUIIcons
            },
            {
              path: 'flags',
              name: 'Flags',
              component: Flags
            },
            {
              path: 'font-awesome',
              name: 'Font Awesome',
              component: FontAwesome
            },
            {
              path: 'simple-line-icons',
              name: 'Simple Line Icons',
              component: SimpleLineIcons
            }
          ]
        },
        {
          path: '/notifications',
          redirect: 'notifications/alerts',
          name: 'Notifications',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'alerts',
              name: 'Alerts',
              component: Alerts
            },
            {
              path: 'badges',
              name: 'Badges',
              component: Badges
            },
            {
              path: 'modals',
              name: 'Modals',
              component: Modals
            }
          ]
        },
        {
          path: '/pages',
          redirect: 'pages/404',
          name: 'Pages',
          meta: {
            permission: 'all'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '404',
              name: 'Page404',
              component: Page404,
              meta: {
                permission: 'all'
              }
            },
            {
              path: '500',
              name: 'Page500',
              component: Page500,
              meta: {
                permission: 'all'
              }
            },

            {
              path: 'register',
              name: 'Register',
              component: Register,
              meta: {
                permission: 'all'
              }
            }
          ]
        },
        {
          path: '/events',
          redirect: 'events/calendar',
          name: 'Events',
          meta: {
            permission: 'Calendar Event'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'calendar',
              name: 'Calendar',
              component: Calendar,
              meta: {
                permission: 'Calendar Event'
              }
            },
            {
              path: 'emailSettings',
              name: 'EmailSettings',
              component: EmailSettings,
              meta: {
                permission: 'Email Setting'
              }
            },
          ]
        },
        //---tender
        {
          path: '/tenderEvents',
          redirect: 'tenderEvents/Calendar',
          name: 'tenderEvents',
          meta: {
            permission: 'Tender Calendar Event'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'Calendar',
              name: 'tenderCalendar',
              component: tenderCalendar,
              meta: {
                permission: 'Tender Calendar Event'
              }
            },
          ]
        },
        //---end tender
        {
          path: '/sheets',
          redirect: 'sheets/tracking',
          name: 'Tracking calculation sheet',
          meta: {
            permission: 'Tracking'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'tracking',
              name: 'tracking',
              component: TrackingSheetList,
              meta: {
                description: 'Tracking calulation sheet list',
                label: 'Tracking calulation sheet list',
                permission: 'Tracking'
              },
            }
          ]
        },
        {
          path: '/userManagement',
          redirect: 'userManagement/usersList',
          name: 'UserManagement',
          meta: {
            label: 'User and role management',
            permission: 'User'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'RolesList',
              name: 'RolesList',
              component: RolesList,
              meta: {
                description: 'Roles list',
                label: 'Roles list',
                permission: 'Role'
              },
            },
            {
              path: 'AddEditRole/:RoleId?',
              name: 'AddEditRole',
              component: AddEditRole,
              meta: {
                description: 'Add/Edit role',
                label: 'Add/Edit role',
                permission: 'Role'
              }
            },
            {
              path: 'UsersList',
              name: 'UsersList',
              component: UsersList,
              meta: {
                description: 'Users list',
                label: 'Users list',
                permission: 'User'
              }
            },
            {
              path: 'AddEditUser/:UserId?',
              name: 'AddEditUser',
              component: AddEditUser,
              meta: {
                description: 'Add/Edit user',
                label: 'AddEditUser',
                permission: 'User'
              }
            },
            {
              path: 'UserProfile',
              name: 'UserProfile',
              component: UserProfile,
              meta: {
                description: 'Show my profile/Edit user',
                label: 'User Profile',
                permission: 'all'
              }
            },
          ]
        },
        {
          path: '/calculationSheets',
          // name: 'calculationSheetList',
          // redirect: 'calculationSheets/list',
          /*meta: {
            permission: 'Calculation Sheet'
          },*/
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'NewCalculationSheet/:CalSheetId?',
              name: 'NewCalculationSheet',
              component: CalculationSheetMaster,
              meta: {
                description: 'Calculation Sheet Master',
                label: 'New calculation sheet',
                permission: 'Calculation Sheet'
              }
            },
            {
              path: 'view/:CalSheetId',
              name: 'viewCalculationSheet',
              component: CalcualtionSheetView,
              meta: {
                description: 'Calculation Sheet Master',
                label: 'Calculation sheet',
                permission: 'Calculation Sheet'
              }
            },
            {
              path: '/NewCalculationSheet',
              name: 'createCalcuationSheet',
              component: CalculationSheetMaster,
              meta: {
                description: 'Calculation sheet master',
                label: 'New calculation sheet',
                permission: 'Calculation Sheet'
              },
              props: true
            },
            {
              path: '/',
              name: "calculationSheetList",
              component: calculationSheetList,
              meta: {
                label: 'Calculation sheet list',
                permission: 'Calculation Sheet'
              }

            },
          ],
          meta: {
            description: 'Calculation sheet  list',
            label: 'Calculation sheets list ',
            permission: 'Calculation Sheet'
          }
        },
        {
          path: '/AwardingList',
          // name: 'awardingList',
          redirect: 'AwardingList/list',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '/newAwardingSheet/:awardingID?',
              name: 'NewAwardingSheet',
              component: newAwardingSheet,
              meta: {
                label: 'New awarding sheet',
                permission: 'Awarding Sheet'
              }
            },
            {
              path: '/AwardingList/list',
              name: "awardingList",
              component: awardingSheetList,
              meta: {
                label: 'Awarding sheet',
                permission: 'Awarding Sheet'
              }
            },
            {
              path: 'view/:CalSheetId/:CalSheetType?',
              name: 'viewAwardingSheet',
              component: showAwardingSheet,
              meta: {
                description: 'Awarding sheet',
                label: 'Awarding sheets',
                permission: 'Awarding Sheet'
              }
            },
          ],
          meta: {
            description: 'Awarding sheet  list',
            label: 'Awarding sheet list ',
            permission: 'Awarding Sheet'
          }
        },
        {
          path: '/priceQuotations',
          // name: 'awardingList',
          redirect: 'priceQuotations/list',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'priceQuotation/:quoteID?',
              name: 'newPriceQuotation',
              component: newPriceQuotation,
              meta: {
                label: 'New price quote',
                permission: 'Price Quotation'
              }
            },
            {
              path: 'viewPriceQuotation/:quoteID?',
              name: "viewPriceQuotation",
              component: showPriceQuotation,
              meta: {
                label: 'price quotes',
                permission: 'Price Quotation'
              }
            },
            {
              path: '/priceQuotations/list',
              name: "PriceQuotationsList",
              component: priceQuotationList,
              meta: {
                label: 'Price quotes ',
                permission: 'Price Quotation'
              }
            },
          ],
          meta: {
            description: 'Awarding sheet  list',
            label: 'Price quotation list ',
            permission: 'Price Quotation'
          }
        },
        {
          path: '/items',
          redirect: 'items/list',
          name: 'Items Management',
          meta: {
            permission: 'Manual Item'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'additem/:Id?',
              name: 'newItem',
              component: Items,
              meta: {
                description: 'add new item',
                label: 'add new item',
                permission: 'Manual Item'
              }
            },
            {
              path: '/items/list',
              name: "ItemsList",
              component: ItemsManagmentList,
              meta: {
                label: 'Items management list',
                permission: 'Manual Item'
              }
            },
          ]
        },

        //------Tender-----------
        {
          path: '/tenderCalculationSheets',
          // name: 'calculationSheetList',
          // redirect: 'calculationSheets/list',
          /*meta: {
            permission: 'Tender Calculation Sheet'
          },*/
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'tenderNewCalculationSheet/:CalSheetId?',
              name: 'tenderNewCalculationSheet',
              component: tenderCalculationSheetMaster,
              meta: {
                description: 'Tender Calculation Sheet Master',
                label: 'Tender New calculation sheet',
                permission: 'Tender Calculation Sheet'
              }
            },
            {
              path: 'view/:CalSheetId',
              name: 'tenderViewCalculationSheet',
              component: tenderCalcualtionSheetView,
              meta: {
                description: 'Tender Calculation Sheet Master',
                label: 'Tender Calculation sheet',
                permission: 'Tender Calculation Sheet'
              }
            },
            {
              path: '/NewTenderCalculationSheet',
              name: 'tenderCreateCalcuationSheet',
              component: tenderCalculationSheetMaster,
              meta: {
                description: 'Tender Calculation sheet master',
                label: 'New Tender calculation sheet',
                permission: 'Tender Calculation Sheet'
              },
              props: true
            },
            {
              path: '/',
              name: "tenderCalculationSheetList",
              component: tenderCalculationSheetList,
              meta: {
                label: 'Calculation sheet list',
                permission: 'Tender Calculation Sheet'
              }

            },
          ],
          meta: {
            description: 'Tender Calculation sheet  list',
            label: 'Tender Calculation sheets list ',
            permission: 'Tender Calculation Sheet'
          }
        },
        //------Lab-----------
        {
          path: '/labCalculationSheets',
          // name: 'calculationSheetList',
          // redirect: 'calculationSheets/list',
          /*meta: {
            permission: 'Lab Calculation Sheet'
          },*/
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'labNewCalculationSheet/:CalSheetId?',
              name: 'labNewCalculationSheet',
              component: labCalculationSheetMaster,
              meta: {
                description: 'Lab Calculation Sheet Master',
                label: 'Lab New calculation sheet',
                permission: 'Lab Calculation Sheet'
              }
            },
            {
              path: 'view/:CalSheetId',
              name: 'LabViewCalculationSheet',
              component: labCalcualtionSheetView,
              meta: {
                description: 'Lab Calculation Sheet Master',
                label: 'Lab Calculation sheet',
                permission: 'Lab Calculation Sheet'
              }
            },
            {
              path: '/NewLabCalculationSheet',
              name: 'labCreateCalcuationSheet',
              component: labCalculationSheetMaster,
              meta: {
                description: 'Lab Calculation sheet master',
                label: 'New Lab calculation sheet',
                permission: 'Lab Calculation Sheet'
              },
              props: true
            },
            {
              path: '/',
              name: "labCalculationSheetList",
              component: labCalculationSheetList,
              meta: {
                label: 'Calculation sheet list',
                permission: 'Lab Calculation Sheet'
              }

            },
          ],
          meta: {
            description: 'Lab Calculation sheet  list',
            label: 'Lab Calculation sheets list ',
            permission: 'Lab Calculation Sheet'
          }
        },
        {
          path: '/tenderAwardingList',
          // name: 'awardingList',
          redirect: 'tenderAwardingList/list',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '/tenderNewAwardingSheet/:awardingID?',
              name: 'tenderNewAwardingSheet',
              component: newAwardingSheet,
              meta: {
                label: 'Tender New awarding sheet',
                permission: 'Tender Awarding Sheet'
              }
            },
            {
              path: '/tenderAwardingList/list',
              name: "tenderAwardingList",
              component: tenderAwardingSheetList,
              meta: {
                label: 'Tender Awarding sheet',
                permission: 'Tender Awarding Sheet'
              }
            },
            {
              path: 'tenderView/:CalSheetId?',
              name: 'tenderViewAwardingSheet',
              component: tenderShowAwardingSheet,
              meta: {
                description: 'Tender Awarding sheet',
                label: 'Tender Awarding sheets',
                permission: 'Tender Awarding Sheet'
              }
            },
          ],
          meta: {
            description: 'Tender Awarding sheet  list',
            label: 'Tender Awarding sheet list ',
            permission: 'Tender Awarding Sheet'
          }
        },
        {
          path: '/tenderPriceQuotations',
          // name: 'awardingList',
          redirect: 'tenderPriceQuotations/list',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'tenderPriceQuotation/:quoteID?',
              name: 'tenderNewPriceQuotation',
              component: tenderNewPriceQuotation,
              meta: {
                label: 'New price quote',
                permission: 'Price Quotation'
              }
            },
            {
              path: 'tenderViewPriceQuotation/:quoteID?',
              name: "tenderViewPriceQuotation",
              component: tenderShowPriceQuotation,
              meta: {
                label: 'tender price quotes',
                permission: 'Tender Price Quotation'
              }
            },
            {
              path: '/tenderPriceQuotations/list',
              name: "tenderPriceQuotationsList",
              component: tenderPriceQuotationList,
              meta: {
                label: 'Tender Price quotes ',
                permission: 'Tender Price Quotation'
              }
            },
          ],
          meta: {
            description: 'Tender Awarding sheet  list',
            label: 'Tender Price quotation list ',
            permission: 'Tender Price Quotation'
          }
        },
        {
          path: '/tenderItems',
          redirect: 'tenderItems/list',
          name: 'Tender Items Management',
          meta: {
            permission: 'Tender Manual Item'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'additem/:Id?',
              name: 'tenderNewItem',
              component: tenderItems,
              meta: {
                description: 'add new item',
                label: 'add new item',
                permission: 'Manual Item'
              }
            },
            {
              path: '/items/list',
              name: "tenderItemsList",
              component: tenderItemsManagmentList,
              meta: {
                label: 'Items management list',
                permission: 'Manual Item'
              }
            },
          ]
        },
        //---------
        {
          path: '/items-group',
          redirect: 'items-group/ItemsGroupList',
          name: 'Items configuration',
          meta: {
            permission: 'Items'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'ItemsGroupList',
              name: 'ItemsGroupList',
              component: ItemsGroupList,
              meta: {
                description: 'Items Group List',
                label: 'Items group list',
                permission: 'Items'
              }
            },
            {
              path: 'ItemsGroupConfiguration/:GroupId?',
              name: 'ItemsGroupConfiguration',
              component: ItemsGroupConfiguration,
              meta: {
                description: 'Add/Edit Item Group',
                label: 'Items group list',
                permission: 'Items'
              }
            }
          ]
        },
        //--tender---
        {
          path: '/tender-items-group',
          redirect: 'tender-items-group/ItemsGroupList',
          name: 'Tender Items configuration',
          meta: {
            permission: 'TenderItems'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'tenderItemsGroupList',
              name: 'tenderItemsGroupList',
              component: tenderItemsGroupList,
              meta: {
                description: 'Tender Items Group List',
                label: 'Tender Items group list',
                permission: 'TenderItems'
              }
            },
            {
              path: 'tenderItemsGroupConfiguration/:GroupId?',
              name: 'tenderItemsGroupConfiguration',
              component: tenderItemsGroupConfiguration,
              meta: {
                description: 'Add/Edit Tender Item Group',
                label: 'Tender Items group list',
                permission: 'TenderItems'
              }
            }
          ]
        },
        //-------------
        {
          path: 'workflow-definition',
          redirect: '/workflow-definition/WorkflowDefinitionList',
          name: 'workflow-definition',
          meta: {
            permission: 'Workflow'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'WorkflowDefinitionList',
              name: 'WorkflowDefinitionList',
              component: WorkflowDefinitionList,
              meta: {
                label: 'Workflow definition list',
                description: 'Workflow definition list',
                permission: 'Workflow'
              }
            },
            {
              path: 'AddEditWorkflow/:WorkflowId?',
              name: 'AddEditWorkflow',
              component: AddEditWorkflow,
              meta: {
                label: 'Add/Edit Workflow',
                description: 'Add/Edit Workflow',
                permission: 'Workflow'
              }
            }, {
              path: 'WorkflowLog/:calculationSheetId',
              name: 'WorkflowLog',
              component: WorkflowLog,
              meta: {
                label: 'Workflow log',
                description: 'Workflow log',
                permission: 'all'
              }
            },

          ]
        },

        //----Tender--------
        {
          path: 'tender-workflow-definition',
          redirect: '/tender-workflow-definition/WorkflowDefinitionList',
          name: 'tender-workflow-definition',
          meta: {
            permission: 'Workflow'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'tenderWorkflowDefinitionList',
              name: 'tenderWorkflowDefinitionList',
              component: tenderWorkflowDefinitionList,
              meta: {
                label: 'Tender Workflow definition list',
                description: 'Tender Workflow definition list',
                permission: 'tenderWorkflow'
              }
            },
            {
              path: 'tenderAddEditWorkflow/:WorkflowId?',
              name: 'tenderAddEditWorkflow',
              component: tenderAddEditWorkflow,
              meta: {
                label: 'Add/Edit Workflow',
                description: 'Add/Edit Workflow',
                permission: 'tenderWorkflow'
              }
            }, {
              path: 'tenderWorkflowLog/:tenderCalculationSheetId',
              name: 'tenderWorkflowLog',
              component: tenderWorkflowLog,
              meta: {
                label: 'Tender Workflow log',
                description: 'Tender Workflow log',
                permission: 'all'
              }
            },

          ]
        },
        //------------------
        
        //----Lab--------
        {
          path: 'lab-workflow-definition',
          // redirect: '/lab-workflow-definition/WorkflowDefinitionList',
          // name: 'lab-workflow-definition',
          meta: {
            permission: 'Workflow'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'labWorkflowLog/:labCalculationSheetId',
              name: 'labWorkflowLog',
              component: labWorkflowLog,
              meta: {
                label: 'Lab Workflow log',
                description: 'Lab Workflow log',
                permission: 'all'
              }
            },

          ]
        },
        //------------------

      ]
    },
    // {
    //   path: '404',
    //   name: 'Page404',
    //   component: Page404
    // }
  ]
});

const checkToken = () => {
  if (localStorage.getItem('token') == (null || '' || 'null') || store.getters.getToken == (null || 'null')) {
    return false;
  }
  else {
    var tokenExpireDate = localStorage.getItem('TokenExpireDate') ? localStorage.getItem('TokenExpireDate') : null;
    if (tokenExpireDate) {
      var duration = moment.duration(moment(tokenExpireDate).diff(moment()));
      var hours = duration.asHours();
      if (hours > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

router.beforeEach((to, from, next) => {
  //calender:
  //  /events/calendar

  //calculationSheet: 
  //  /calculationSheets
  //  /calculationSheets/NewCalculationSheet
  //  /calculationSheets/view
  //  /workflow-definition/WorkflowLog

  if (to.path != "/login" && to.path != "/forget" && to.path != "/reset" && !to.path.includes('Verify')) {
    if (checkToken()) {
      next();
      //  return;
      if (to.path.includes('pages/404')) {
        next()
      } else {
        if (to.meta.permission == 'all') {
          next();
        }
        else if (checkPagePermession(to.meta.permission)) {
          if (to.path == '/NewCalculationSheet' && from.path.includes('calculationSheets/NewCalculationSheet/')) {
            router.replace({ path: '/calculationSheets/NewCalculationSheet' }, () => {
              router.go(0)
            })
          } else if (to.path == '/NewTenderCalculationSheet' && from.path.includes('tenderCalculationSheets/tenderNewCalculationSheet')) {
            router.replace({ path: '/tenderCalculationSheets/tenderNewCalculationSheet' }, () => {
              router.go(0)
            })
          } else if (to.path == '/NewLabCalculationSheet' && from.path.includes('labCalculationSheets/labNewCalculationSheet')) {
            router.replace({ path: '/labCalculationSheets/labNewCalculationSheet' }, () => {
              router.go(0)
            })
          } else {
            next();
          }
        } else {
          next({ name: 'Pages' })
        }
      }
      // console.log(checkPagePermession(to.meta.permission))
      // if (checkPagePermession(to.meta.permission) && !to.path.includes('pages/404')) {
      //     console.log('has permession')
      // } else {
      //     console.log('no permession')
      //     next({ name: 'pages/404' })
      // }
    } else {
      store.commit("SET_USER", null);
      store.commit("SET_TOKEN", null);
      store.commit("SET_FIREBASETOKEN", null);
      window.localStorage.setItem("user", null);
      window.localStorage.setItem("token", null);
      window.localStorage.setItem("firebaseToken", null);
      
      next({ name: 'login', query: { from: to.path } })
      // if (to.path.includes('calculationSheets/NewCalculationSheet')) {
      //     next({ name: 'login', query: { from: to.path } })
      // } else {
      //     next({ name: 'login'})
      // }
      // router.push('/login');
    }
  } else if (to.path == '/login') {
    next();
  } else if (to.path == '/forget') {
    next();
  }
  else if (to.path == '/reset') {
    next();
  }
  else if (to.path.includes('Verify')) {
    next();
  }
});
