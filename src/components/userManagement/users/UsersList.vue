<template>
  <b-card
    class="card card-accent-primary"
    no-body
    v-if="show"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div slot="header">
      {{$t("UsersList")}} / {{$t('SearchFields')}}
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
        <form class="form-horizontal" @submit.prevent="getUsersFromService">
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label class="col-form-label">{{$t("Email")}}</label>
                <input
                  class="form-control"
                  v-model="search.email"
                  id="txtEmail"
                  autocomplete="off"
                />
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label class="col-form-label">{{$t("RoleName")}}</label>
                <input
                  class="form-control"
                  v-model="search.role"
                  id="txtRole"
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
                @click="getUsersFromService"
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
                :to="{ name: 'AddEditUser'}"
                class="btn btn-success pull-left"
              >
                <i class="fa fa-plus-square-o"></i>
                {{$t("NewUser")}}
              </router-link>
            </div>
          </div>
        </form>
        <div class="tableDiv">
          <table class="table table-bordered table-striped table-sm">
            <thead>
              <tr>
                <th scope="col" class="text-left" width="3%">#</th>
                <th scope="col" class="text-left">{{$t("FirstName")}}</th>
                <th scope="col" class="text-left">{{$t("LastName")}}</th>
                <th scope="col" class="text-left">{{$t("UserName")}}</th>
                <th scope="col" class="action-column text-center" width="8%">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(User, index) in Users" v-bind:key="index">
                <td class="text-left">{{index+1}}</td>
                <td class="text-left">{{User.firstName}}</td>
                <td class="text-left">{{User.lastName}}</td>
                <td class="text-left">{{User.userName}}</td>
                <td class="action-column">
                  <router-link
                    v-if="checkActions('Edit')"
                    :title="$t('Edit')"
                    class="text-primary"
                    :to="{ name: 'AddEditUser', params: {UserId: User.id}}"
                  >
                    <i class="fa fa-edit"></i>
                  </router-link>
                  <a
                    v-if="checkActions('Delete')"
                    :title="$t('Delete')"
                    class="text-danger"
                    v-on:click="deleteUser(User.id);"
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
              :current-page="this.page.currentPage"
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
      fullscreenLoading: false,
      Users: [],
      page: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: this.$store.getters.getLargePagging
      },
      search: {
        role: "",
        email: "",
        UserNameField: "",
        CreateDateToField: "",
        CreateDateFromField: ""
      },
      visible: false
    };
  },

  methods: {
    Excel() {
      var role = "";
      var email = "";
      if (this.search.role) {
        role = this.search.role;
      }
      if (this.search.email) {
        email = this.search.email;
      }
      var urlStr =
        this.$store.getters.serverURI +
        "api/Users/ExportToExcel?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&RowsCount=&role=" +
        role +
        "&email=" +
        email;

      // window.open(urlStr, "_blank");

      
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
        fileLink.setAttribute("download", "users.xlsx");
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
      return checkRoles("User", roleName);
    },
    resetSearchForm() {
      this.search = {
        UserNameField: "",
        CreateDateToField: "",
        CreateDateFromField: "",
        role: "",
        email: ""
      };
      this.page = {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: this.$store.getters.getLargePagging
      };
      this.getUsersFromService();
    },
    pageChanged: function(pageNum) {
      this.page.currentPage = pageNum;
      this.getUsersFromService();
    },

    deleteUser(UserId) {
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

            var urlStr = this.$store.getters.serverURI + "api/User/" + UserId;
            this.$http
              .delete(urlStr, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(function(data) {
                done();
                instance.confirmButtonLoading = false;
                this.getUsersFromService();
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
    getUsersFromService() {
      var role = "";
      var email = "";
      if (this.search.role) {
        role = this.search.role;
      }
      if (this.search.email) {
        email = this.search.email;
      }
      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/User?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&RowsCount=&role=" +
        role +
        "&email=" +
        email;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.fullscreenLoading = false;
            this.Users = data.body.userViewList;
            this.page.totalItems = data.body.pagingInfo.rowsCount;
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
    this.getUsersFromService();
  }
};
</script>