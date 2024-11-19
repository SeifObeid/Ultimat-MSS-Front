<template>
  <b-card class="card card-accent-primary" no-body v-if="show">
    <div slot="header">
      {{$t("RolesList")}} / {{$t('SearchFields')}}
      <div class="card-header-actions">
        <b-link class="card-header-action btn-minimize" v-b-toggle.collapse1>
          <span class="when-opened">
            <i class="icon-arrow-up"></i>
          </span>
          <span class="when-closed">
            <i class="icon-arrow-down"></i>
          </span>
        </b-link>
      </div>
    </div>
    <b-collapse id="collapse1" visible>
      <b-card-body>
        <form class="form-horizontal" @submit.prevent="getRolesFromService">
          <div class="row">
            <div class="col-md-3">
              <div class="form-group">
                <label class="col-form-label">{{$t("RoleName")}}</label>
                <input
                  class="form-control"
                  v-model="search.RoleNameField"
                  id="txtRoleName"
                  autocomplete="off"
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 mt-3 mb-3">
              <button type="button" class="btn btn-danger pull-right" @click="resetSearchForm">
                <i class="fa fa-remove"></i>
                {{$t("Clear")}}
              </button>

              <button
                type="submit"
                class="btn btn-primary pull-right mr-1"
                @click="getRolesFromService"
              >
                <i class="fa fa-search"></i>
                {{$t("Search")}}
              </button>

              <button class="btn csubmit pull-right mr-1" variant="primary" @click="Excel()">
                <i class="fa fa-file-excel-o"></i>
                Export Excel
              </button>

              <router-link
                v-if="checkActions('Insert')"
                :to="{ name: 'AddEditRole'}"
                class="btn btn-success pull-left"
              >
                <i class="fa fa-plus-square-o"></i>
                {{$t("NewRole")}}
              </router-link>
            </div>
          </div>
        </form>
        <div class="tableDiv" v-loading.fullscreen.lock="fullscreenLoading">
          <table class="table table-bordered table-striped table-sm">
            <thead>
              <tr>
                <th scope="col" class="text-left" width="8%">#</th>
                <th scope="col" class="text-left">{{$t("RoleName")}}</th>
                <th scope="col" class="action-column text-center" width="8%">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(Role, index) in Roles" v-bind:key="index">
                <td class="text-left">{{index+1}}</td>
                <td class="text-left">{{Role.name}}</td>
                <td class="action-column">
                  <router-link
                    v-if="checkActions('Edit')"
                    :title="$t('Edit')"
                    class="text-primary"
                    :to="{ name: 'AddEditRole', params: {RoleId: Role.id}}"
                  >
                    <i class="fa fa-edit"></i>
                  </router-link>
                  <a
                    v-if="checkActions('Delete')"
                    :title="$t('Delete')"
                    class="text-danger"
                    v-on:click="deleteRole(Role.id);"
                    style="margin-left:3px"
                  >
                    <i class="fa fa-trash"></i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="text-center">
            <el-pagination
              v-if="this.page.totalItems > this.page.itemsPerPage"
              @current-change="pageChanged"
              current-page="this.page.currentPage"
              :page-size="this.page.itemsPerPage"
              layout="prev, pager, next"
              :total="this.page.totalItems"
            ></el-pagination>
          </div>
        </div>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>
<script type="text/javascript">
var moment = require("moment");
import { checkRoles } from "../../../shared/utils";
import axios from "axios";

export default {
  data() {
    return {
      show: true,
      Roles: [],
      page: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: this.$store.getters.getLargePagging
      },
      search: {
        RoleNameField: "",
        CreateDateToField: "",
        CreateDateFromField: ""
      },
      visible: false,
      fullscreenLoading: false
    };
  },

  methods: {
    Excel() {
      var fromDate = "";
      var toDate = "";
      var RoleNametxt = "";
      if (this.search.CreateDateFromField) {
        fromDate = moment(this.search.CreateDateFromField).format(
          this.$store.getters.getWebAPIDateFormatMoment
        );
      }
      if (this.search.CreateDateToField) {
        toDate = moment(this.search.CreateDateToField).format(
          this.$store.getters.getWebAPIDateFormatMoment
        );
      }
      if (this.search.RoleNameField) {
        RoleNametxt = this.search.RoleNameField;
      }
      var urlStr =
        this.$store.getters.serverURI +
        "api/Roles/ExportToExcel?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&RowsCount=&createDateFrom=" +
        fromDate +
        "&createDateTo=" +
        toDate +
        "&roleName=" +
        RoleNametxt;

      axios({
        method: "post",
        url: urlStr,
        headers: this.$store.getters.tokenAuthonticationHeaderObj,
        responseType: "blob"
      }).then(response => {
        this.fullscreenLoading = false;
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", "roles.xlsx");
        document.body.appendChild(fileLink);

        fileLink.click();
      })
      .catch((error) => {
        this.fullscreenLoading = false;
        this.$message({
            showClose: true,
            duration: this.$store.getters.getMessagesDuration,
            type: "error",
            message: error.body.message
        });
      });
    },
    checkActions(roleName) {
      return checkRoles("Role", roleName);
    },
    resetSearchForm() {
      this.page = {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: this.$store.getters.getLargePagging
      };
      this.search = {
        RoleNameField: "",
        CreateDateToField: "",
        CreateDateFromField: ""
      };
      this.getRolesFromService();
    },
    pageChanged: function(pageNum) {
      this.page.currentPage = pageNum;
      this.getRolesFromService();
    },
    deleteRole(RoleId) {
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("DeleteConfirmationMessage"))
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Ok"),
        cancelButtonText: this.$t("Cancel"),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = this.$t("Deleting");

            var urlStr = this.$store.getters.serverURI + "api/Role/" + RoleId;
            this.$http
              .delete(urlStr, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(function(data) {
                done();
                instance.confirmButtonLoading = false;
                this.getRolesFromService();
              })
              .catch(data => {
                done();
                instance.confirmButtonLoading = false;
                this.$message({
                  showClose: true,
                  duration: this.$store.getters.getMessagesDuration,
                  type: "error",
                  message: data.body.message
                });
              });
          } else {
            done();
          }
        }
      });
    },

    getRolesFromService() {
      var fromDate = "";
      var toDate = "";
      var RoleNametxt = "";
      if (this.search.CreateDateFromField) {
        fromDate = moment(this.search.CreateDateFromField).format(
          this.$store.getters.getWebAPIDateFormatMoment
        );
      }
      if (this.search.CreateDateToField) {
        toDate = moment(this.search.CreateDateToField).format(
          this.$store.getters.getWebAPIDateFormatMoment
        );
      }
      if (this.search.RoleNameField) {
        RoleNametxt = this.search.RoleNameField;
      }
      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/Role?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&RowsCount=&createDateFrom=" +
        fromDate +
        "&createDateTo=" +
        toDate +
        "&roleName=" +
        RoleNametxt;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.Roles = data.body.roleViewList;
            this.page.totalItems = data.body.pagingInfo.rowsCount;
            this.fullscreenLoading = false;
          },
          function(error) {
            this.fullscreenLoading = false;
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage")
            });
          }
        );
    }
  },

  created: function() {
    this.getRolesFromService();
  }
};
</script>