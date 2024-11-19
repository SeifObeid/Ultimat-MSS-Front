<template>
  <div class="app">
    <AppHeader fixed>
      <SidebarToggler class="d-lg-none" display="md" mobile />
      <b-link class="navbar-brand" to="/dashboard">
        <!-- <img class="navbar-brand-full" src="img/brand/logo.svg" width="89" height="25" alt="CoreUI Logo"> -->
        <img
          class="navbar-brand-full"
          src="img/brand/logo2.png"
          width="40"
          alt="CoreUI Logo"
        />
        <img
          class="navbar-brand-minimized"
          src="img/brand/logo2.png"
          width="30"
          height="30"
          alt="CoreUI Logo"
        />
        <h5>MSS TMS</h5>
      </b-link>
      <SidebarToggler
        class="d-md-down-none"
        style="display: none"
        display="lg"
      />
      <!--<b-navbar-nav class="d-md-down-none">-->
      <!--<b-nav-item class="px-3" to="/dashboard">Dashboard</b-nav-item>-->
      <!--<b-nav-item class="px-3" to="/users" exact>Users</b-nav-item>-->
      <!--<b-nav-item class="px-3">Settings</b-nav-item>-->
      <!--</b-navbar-nav>-->
      <b-navbar-nav class="ml-auto">
        <!-- <b-nav-item class="d-md-down-none">
              <i class="icon-bell"></i>
              <b-badge pill variant="danger">5</b-badge>
            </b-nav-item>-->
        <!--<b-nav-item class="d-md-down-none">-->
        <!--<i class="icon-list"></i>-->
        <!--</b-nav-item>-->
        <!--<b-nav-item class="d-md-down-none">-->
        <!--<i class="icon-location-pin"></i>-->
        <!--</b-nav-item>-->
        <b-nav-item-dropdown right no-caret ref="dropdown">
          <template #button-content>
            <span class="el-dropdown-link">
              <el-badge :value="unreadNotificationsCount" :hidden="!unreadNotificationsCount">
                <el-button type="info" icon="el-icon-bell" circle size="medium"/>
              </el-badge>
            </span>
          </template>
          <el-table
            class="myTable"
            ref="myTable"
            :data="notifications"
            style="width: 340px"
            max-height="240"
            :row-class-name="rowClass"
            @row-click="setAsRead"
          >
            <el-table-column prop="" label=" " :min-width="20">
              <template slot-scope="scope">
                <div class="row">
                  <div class="col-md-8">{{ scope.row.notificationTitle }}</div>
                  <div class="col-md-4">{{ changeDateFormat(scope.row.creationDate) }}</div>
                </div>
                <span> {{ scope.row.notificationBody }}</span>
              </template>
            </el-table-column>
            <infinite-loading
              spinner="spiral"
              slot="append"
              @infinite="getMyNotifications"
              force-use-infinite-wrapper=".el-table__body-wrapper">
              <div
                    v-for="(slot, index) in ['no-more', 'no-results']"
                    :key="index"
                    :slot="slot"
                    class="white"
                >
                    <p class="pt-3">
                        {{ $t("NoMoreNotifications") }}
                    </p>
                </div>
            </infinite-loading>
          </el-table>
        </b-nav-item-dropdown>|
        <DefaultHeaderDropdownAccnt />
      </b-navbar-nav>
      <!--<AsideToggler class="d-none d-lg-block" />-->
      <!--<AsideToggler class="d-lg-none" mobile />-->
    </AppHeader>
    <div class="app-body">
      <AppSidebar fixed>
        <SidebarHeader />
        <SidebarForm />
        <SidebarNav :navItems="nav"></SidebarNav>
        <SidebarFooter />
        <SidebarMinimizer />
      </AppSidebar>
      <main class="main">
        <Breadcrumb :list="list" />
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
      <!--<AppAside fixed>-->
      <!--&lt;!&ndash;aside&ndash;&gt;-->
      <!--<DefaultAside/>-->
      <!--</AppAside>-->
    </div>
    <TheFooter>
      <!--footer-->
      <div>
        Copyright &copy;
        <a href="http://www.msspal.com/">MSS</a>
        <span class="ml-1">{{ year }}</span>
      </div>
      <div class="ml-auto">
        <span class="mr-1">Powered by</span>
        <a href="http://www.ultimitats.com/">ULTIMIT</a>
      </div>
    </TheFooter>
  </div>
</template>

<script>
var moment = require("moment");
import infiniteLoading from "vue-infinite-loading"
import nav from "@/_nav";
import {
  Header as AppHeader,
  SidebarToggler,
  Sidebar as AppSidebar,
  SidebarFooter,
  SidebarForm,
  SidebarHeader,
  SidebarMinimizer,
  SidebarNav,
  Aside as AppAside,
  AsideToggler,
  Footer as TheFooter,
  Breadcrumb,
} from "@coreui/vue";
import DefaultAside from "./DefaultAside";
import DefaultHeaderDropdownAccnt from "./DefaultHeaderDropdownAccnt";
import { checkPagePermession } from "../shared/utils";
import axios from "axios";

export default {
  name: "DefaultContainer",
  components: {
    infiniteLoading,
    AsideToggler,
    AppHeader,
    AppSidebar,
    AppAside,
    TheFooter,
    Breadcrumb,
    DefaultAside,
    DefaultHeaderDropdownAccnt,
    SidebarForm,
    SidebarFooter,
    SidebarToggler,
    SidebarHeader,
    SidebarNav,
    SidebarMinimizer,
  },
  data() {
    return {
      year: new Date().getFullYear(),
      unreadNotificationsCount: 0,
      page: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: this.$store.getters.getLargePagging
      },
      rowsCount: 0,
      currentPage: 1,
      //nav: []
      //nav.items
    };
  },
  computed: {
    base_url() {
      return this.$store.getters.serverURI;
    },
    notifications() {
      let notifications = [];
      if ( this.$store.getters.getNotifications) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.unreadNotificationsCount = this.$store.getters.getNotifications.pagingInfo.unreadNotificationCount;
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.rowsCount = this.$store.getters.getNotifications.pagingInfo.rowsCount;
        notifications = this.$store.getters.getNotifications.firebaseNotificationViewModel;
      }
      
      return notifications;
    },
    name() {
      return this.$route.name;
    },
    list() {
      return this.$route.matched.filter(
        (route) => route.name || route.meta.label
      );
    },
    nav() {
      let $items = [];
      $items.push(nav.Dashboard);
      if (checkPagePermession("Tracking")) {
        $items.push(nav.Tracking);
      }
      
      if (checkPagePermession("Calendar Event")) {
        $items.push(nav.Calendar);
      }

      if (checkPagePermession("Email Setting")) {
        $items.push(nav.EmailSettings);
      }
      if (checkPagePermession("Price Quotation")) {
        $items.push(nav.Price_Quotation);
      }
      if (checkPagePermession("Awarding Sheet")) {
        $items.push(nav.Awarding_sheet);
      }
      if ((checkPagePermession("Calculation Sheet") || checkPagePermession("Price Quotation") 
           || checkPagePermession("Awarding Sheet"))  && !$items.includes(nav.Medical)){
            $items.push(nav.Medical);
      }
      if (checkPagePermession("Calculation Sheet")) {
        $items.push(nav.Calculation_Sheets);
      }
     

   
      //------Tender--------------------
      if ((checkPagePermession("Tender Calculation Sheet"))  && !$items.includes(nav.Tender)){
            $items.push(nav.Tender);
      }
      
      if (checkPagePermession("Tender Calculation Sheet")) {
        $items.push(nav.Tender_Calculation_Sheets);
      }
      //------Lab--------------------
      if ((checkPagePermession("Lab Calculation Sheet"))  && !$items.includes(nav.Lab)){
            $items.push(nav.Lab);
      }
      
      if (checkPagePermession("Lab Calculation Sheet")) {
        $items.push(nav.Lab_Calculation_Sheets);
      }


      // if (checkPagePermession("Tender Calendar Event")) {
      //   $items.push(nav.Tender_Calendar);
      // }
      // if (checkPagePermession("Tender Price Quotation")) {
      //   $items.push(nav.Tender_Price_Quotation);
      // }
      // if (checkPagePermession("Tender Awarding Sheet")) {
      //   $items.push(nav.Tender_Awarding_sheet);
      // }
      // if (checkPagePermession("TenderWorkflow")) {
      //   $items.push(nav.Settings.children[3]);
      // }
      //------End Tender----------------
      if ((checkPagePermession("Role") || checkPagePermession("User") || checkPagePermession("Workflow") 
          || checkPagePermession("Manual Item") || checkPagePermession("Items"))  && !$items.includes(nav.Administration)){
          $items.push(nav.Administration);
      }

      if (checkPagePermession("Role")) {
        $items.push(nav.Roles);
      }
      if (checkPagePermession("User")) {
        $items.push(nav.Users);
      }
      if (checkPagePermession("Workflow")) {
        $items.push(nav.Settings.children[2]);
      }
      if (checkPagePermession("Manual Item")) {
        $items.push(nav.Settings.children[0]);
      }
      if (checkPagePermession("Items")) {
        $items.push(nav.Settings.children[1]);
      }

      return $items;
    },
  },
  methods: {
    rowClass({row}) {
      if(!row) return "";
      if(!row.isRead) return "grey"; else return "white";
    },
    changeDateFormat(date) {
      return moment(date).format("MM/DD/YYYY");
    },
    setAsRead(notification){
      this.$refs.dropdown.visible = false;
      var vm = this;
      var urlStr = this.$store.getters.serverURI + `api/User/${notification.id}/UpdateNotificationStatus`;
      if (!notification.isRead) axios({
        method: "put",
        url: urlStr,
        headers: this.$store.getters.tokenAuthonticationHeaderObj
      })
        .then(function() {
          vm.$store.commit("MARK_AS_READ" , notification);
        },
        function(error) {
          console.error(error);
        })
      let department = this.$store.getters.getDepartmentCodeWithRouterName.find((x)=>x.code==notification.calculationSheetType);
      if (department) this.$router.push({
        name: department.name,
        params: { CalSheetId: notification.calculationSheetId }
      });
    },
    getMyNotifications(payload){
      var vm = this;
      if (payload && vm.notifications.length === vm.rowsCount) {
        payload.complete();
        return;
      }
      var urlStr = this.$store.getters.serverURI + "api/Users/GetMyNotification?PageIndex=" +
      this.currentPage +
      "&PageSize=" +
      this.$store.getters.getLargePagging +
      "&RowsCount=";
      axios({
        method: "get",
        url: urlStr,
        headers: this.$store.getters.tokenAuthonticationHeaderObj
      })
        .then(function(response) {
          let notifications = {
            firebaseNotificationViewModel: vm.$store.getters.getNotifications ? [...vm.$store.getters.getNotifications.firebaseNotificationViewModel, ...response.data.firebaseNotificationViewModel] : response.data.firebaseNotificationViewModel,
            pagingInfo: {
              rowsCount: response.data.pagingInfo.rowsCount,
              unreadNotificationCount: response.data.pagingInfo.unreadNotificationCount--,
            }
          }
          vm.$store.commit("SET_NOTIFICATIONS",notifications);
          vm.currentPage += 1;
          if (!payload) return;

          if (vm.notifications.length === response.data.pagingInfo.rowsCount) payload.complete();
          else payload.loaded();
        },
        function(error) {
          console.error(error);
        })
    },
  },
  created() {
    this.getMyNotifications();
  }
};
</script>
<style scoped>
::v-deep .el-table .white {
  background-color: #FFFFFF;
}
::v-deep .el-table .grey {
  background-color: #f5f5f5 !important
}
::v-deep .myTable .el-table__header{
  display: none;
}
</style>