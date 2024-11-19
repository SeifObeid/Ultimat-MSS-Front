<template>
  <b-card
    class="card card-accent-primary"
    no-body
    v-if="show"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div slot="header">
      {{$t("ItemsManagementList")}} / {{$t('SearchFields')}}
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
        <form class="form-horizontal" @submit.prevent="getItemsGroupFromService">
          <div class="row">
           
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-form-label">{{$t("itemName")}}</label>
                <el-input
                  v-model="search.itemName"
                  type="text"
                  autocomplete="off"
                ></el-input>
              </div>
            </div>

             <div class="col-md-6">
              <div class="form-group">
                <label class="col-form-label">{{$t("itemCode")}}</label>
                <el-input
                  v-model="search.itemCode"
                  type="text"
                  autocomplete="off"
                ></el-input>
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
                @click="getItemsGroupFromService"
              >
                <i class="fa fa-search"></i>
                {{$t("Search")}}
              </button>

              <!-- <button class="btn csubmit pull-right mr-1" variant="primary" @click="Excel()">
                <i class="fa fa-file-excel-o"></i>
                Export Excel
              </button> -->

              <router-link
                v-if="checkActions('Insert')"
                :to="{ name: 'tenderNewItem'}"
                class="btn btn-success pull-left"
              >
                <i class="fa fa-plus-square-o"></i>
                {{$t("NewItem")}}
              </router-link>
            </div>
          </div>
        </form>
        <div class="tableDiv">
          <table class="table table-bordered table-striped table-sm">
            <thead>
              <tr>
                <th scope="col" class="text-left" width="8%">#</th>
                <th scope="col" class="text-left">{{$t("itemName")}}</th>
                <th scope="col" class="text-left">{{$t("itemCode")}}</th>
                <th scope="col" class="action-column text-center" width="8%">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(Group, index) in ItemsGroup" v-bind:key="index">
                <td class="text-left">{{index+1}}</td>
                <td class="text-left">{{Group.itemName}}</td>
                <td class="text-left">{{Group.itemCode}}</td>
                <td class="action-column">
                  <router-link
                    v-if="checkActions('Edit')"
                    :title="$t('Edit')"
                    class="text-primary"
                    :to="{ name: 'tenderNewItem', params: {Id: Group.id}}">
                    <i class="fa fa-edit"></i>
                  </router-link>
                  <a
                    v-if="checkActions('Delete')"
                    :title="$t('Delete')"
                    class="text-danger"
                    v-on:click="deleteItemsGroup(Group.id);"
                    style="margin-left:3px">
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
import { checkRoles } from "../../shared/utils";
import axios from "axios";

export default {
  data() {
    return {
      show: true,
      fullscreenLoading: false,
      ItemsGroup: [],
      principals: [],
      page: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: this.$store.getters.getLargePagging
      },
      search: {
        itemName: "",
        itemCode: ""     
      },
      visible: false
    };
  },

  methods: {
    Excel() {
      var principalCode = "";
      var categoryCode = "";
      var modelCode = "";
      var urlStr =
        this.$store.getters.serverURI +
        "api/TenderItemsGroup/ExportToExcel?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&RowsCount=" +
        "&principalCode=" +
        this.search.principalCodeField +
        "&Category=" +
        this.search.categoryCodeField +
        "&Model=" +
        this.search.modelCodeField;

      // window.open(url, "_blank");

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
        fileLink.setAttribute("download", "ItemGroups.xlsx");
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
      return checkRoles("Manual Item", roleName);
    },

    resetSearchForm() {
      this.page = {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: this.$store.getters.getLargePagging
      };
      this.search = {
        itemName: "",
        itemCode: ""
      };
      this.getItemsGroupFromService();
    },

    pageChanged: function(pageNum) {
      this.page.currentPage = pageNum;
      this.getItemsGroupFromService();
    },
    deleteItemsGroup(GroupId) {
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
            var urlStr =
              this.$store.getters.serverURI + "api/TenderManualItems/" + GroupId;
            this.$http
              .delete(urlStr, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(function(data) {
                done();
                instance.confirmButtonLoading = false;
                this.getItemsGroupFromService();
              });
          } else {
            done();
          }
        }
      })
        .then(action => {
          this.$message({
            showClose: true,
            duration: this.$store.getters.getMessagesDuration,
            type: "success",
            message: this.$t("DeletedSuccessfully")
          });
        })
        .catch(() => {
          // this.$message({
          //     type: 'info',
          //     message: 'Delete canceled'
          // });
        });
    },

    getItemsGroupFromService() {
      var principalCode = "";
      var categoryCode = "";
      var modelCode = "";
      //   if (this.search.principalCodeField) {
      //     principalCode = moment(this.search.principalCodeField).format(
      //       this.$store.getters.getWebAPIDateFormatMoment
      //     );
      //   }
      //   if (this.search.categoryCodeField) {
      //     categoryCode = moment(this.search.categoryCodeField).format(
      //       this.$store.getters.getWebAPIDateFormatMoment
      //     );
      //   }
      //   if (this.search.modelCodeField) {
      //     modelCode = moment(this.search.modelCodeField).format(
      //       this.$store.getters.getWebAPIDateFormatMoment
      //     );
      //   }

      var urlStr =
        this.$store.getters.serverURI +
        "api/TenderManualItems?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&itemName=" +
        this.search.itemName +
        "&itemCode=" +
        this.search.itemCode;
       

      //var urlStr = this.$store.getters.serverURI+ "api/TenderItemsGroup/GetAll";
      this.fullscreenLoading = true;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.fullscreenLoading = false;
            this.ItemsGroup = data.body.manualItemViewModels;
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
    this.getItemsGroupFromService();
  }
};
</script>