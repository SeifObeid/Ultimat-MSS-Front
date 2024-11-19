<template>
  <b-card
    class="card card-accent-primary"
    no-body
    v-if="show"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div slot="header">
      {{$t("WorkflowDefinitionList")}} / {{$t('SearchFields')}}
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
        <form class="form-horizontal" @submit.prevent="getWorkflowDefinitionFromService">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-form-label">{{$t("WorkflowName")}}</label>
                <el-input
                  v-model="search.WorkflowName"
                  type="text"
                  autocomplete="off"
                ></el-input>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label class="col-form-label">{{$t("WorkflowType")}}</label>
                <el-select
                  v-model="search.WorkflowType"
                  name="type"
                  filterable
                  clearable
                  v-bind:placeholder="$t('Select')"
                  v-validate="'required'"
                  :data-vv-as="'type name'"
                  data-vv-scope="WorkflowValidation"
                >
                  <el-option
                    v-for="item in types"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
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
                @click="getWorkflowDefinitionFromService"
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
                :to="{ name: 'tenderAddEditWorkflow'}"
                class="btn btn-success pull-left"
              >
                <i class="fa fa-plus-square-o"></i>
                {{$t("NewWorkflow")}}
              </router-link>
            </div>
          </div>
        </form>
        <div class="tableDiv">
          <table class="table table-bordered table-striped table-sm">
            <thead>
              <tr>
                <th scope="col" class="text-left" width="8%">#</th>
                <th scope="col" class="text-left">{{$t("WorkflowName")}}</th>
                <th scope="col" class="text-left">{{$t("Type")}}</th>
                <th scope="col" class="text-left">{{$t("description")}}</th>
                <th scope="col" class="text-left">{{$t("Status")}}</th>
                <th scope="col" class="action-column text-center" width="10%">{{$t("Action")}}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(Workflow, index) in WorkflowDefinition" v-bind:key="index">
                <td class="text-left">{{index+1}}</td>
                <td class="text-left">{{Workflow.name}}</td>
                <td class="text-left">{{Workflow.typeLookup.name}}</td>
                <td class="text-left">{{Workflow.description}}</td>
                <td class="text-left">{{Workflow.status?$t("Active"):$t("InActive")}}</td>
                <td class="action-column text-center">
                  <router-link
                    v-if="checkActions('Edit')"
                    :title="$t('Edit')"
                    class="text-primary"
                    :to="{ name: 'tenderAddEditWorkflow', params: {WorkflowId: Workflow.id}}"
                  >
                    <i class="fa fa-edit"></i>
                  </router-link>
                  <a
                    v-if="checkActions('Delete')"
                    :title="$t('Delete')"
                    class="text-danger"
                    v-on:click="deleteWorkflowDefinition(Workflow.id);"
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
import { checkRoles } from "../../shared/utils";
import axios from "axios";

export default {
  data() {
    return {
      show: true,
      fullscreenLoading: false,
      WorkflowDefinition: [],
      types: [],
      page: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: this.$store.getters.getLargePagging
      },
      search: {
        WorkflowName: "",
        WorkflowType: ""
      },
      visible: false
    };
  },

  methods: {
    Excel() {
      var WorkflowName = "";
      var WorkflowType = "";
      if (this.search.WorkflowName) {
        WorkflowName = this.search.WorkflowName;
      }
      if (this.search.WorkflowType) {
        WorkflowType = this.search.WorkflowType;
      }
      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/TenderWorkflowSetting/ExportToExcel?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&RowsCount=" +
        "&name=" +
        WorkflowName +
        "&type=" +
        WorkflowType;

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
        fileLink.setAttribute("download", "Workflow.xlsx");
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
      return checkRoles("Workflow", roleName);
    },
    resetSearchForm() {
      this.page = {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: this.$store.getters.getLargePagging
      };
      this.search = {
        WorkflowName: "",
        WorkflowType: ""
      };
      this.getWorkflowDefinitionFromService();
    },
    pageChanged: function(pageNum) {
      this.page.currentPage = pageNum;
      this.getWorkflowDefinitionFromService();
    },

    getWorkflowDefinitionFromService() {
      var WorkflowName = "";
      var WorkflowType = "";
      if (this.search.WorkflowName) {
        WorkflowName = this.search.WorkflowName;
      }
      if (this.search.WorkflowType) {
        WorkflowType = this.search.WorkflowType;
      }
      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/TenderWorkflowSetting?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&RowsCount=" +
        "&name=" +
        WorkflowName +
        "&type=" +
        WorkflowType;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.fullscreenLoading = false;
            this.WorkflowDefinition = data.body.list;
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
    },

    getWorkflowTypeFromService: function() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.WorkflowType;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.types = data.body;
          },
          function(error) {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage")
            });
          }
        );
    },

    deleteWorkflowDefinition(WorkflowId) {
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
              this.$store.getters.serverURI +
              "api/TenderWorkflowSetting/" +
              WorkflowId;
            this.$http
              .delete(urlStr, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(function(data) {
                done();
                instance.confirmButtonLoading = false;
                this.getWorkflowDefinitionFromService();
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
    }
  },

  created: function() {
    this.getWorkflowTypeFromService();
    this.getWorkflowDefinitionFromService();
  }
};
</script>