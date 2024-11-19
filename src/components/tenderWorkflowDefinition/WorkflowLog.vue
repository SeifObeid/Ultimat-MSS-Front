<template>
  <b-card
    class="card card-accent-primary"
    no-body
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div slot="header">
      {{$t("WorkflowLogList")}} / {{$t('SearchFields')}}
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
        <form class="form-horizontal" @submit.prevent="getWorkflowLogsFromService">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label class="col-form-label">{{$t("CreateDateFromField")}}</label>
                <el-date-picker
                  v-model="search.CreateDateFromField"
                  type="date"
                  v-bind:placeholder="$t('PickDate')"
                  v-bind:format="this.$store.getters.getDateFormat"
                ></el-date-picker>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label class="col-form-label">{{$t("CreateDateToField")}}</label>
                <el-date-picker
                  v-model="search.CreateDateToField"
                  type="date"
                  v-bind:placeholder="$t('PickDate')"
                  v-bind:format="this.$store.getters.getDateFormat"
                ></el-date-picker>
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
                @click="getWorkflowLogsFromService"
              >
                <i class="fa fa-search"></i>
                {{$t("Search")}}
              </button>
            </div>
          </div>
        </form>
        <div class="tableDiv">
          <table class="table table-bordered table-striped dataTable">
            <thead>
              <tr>
                <th scope="col" class="text-left" width="5%">#</th>
                <th scope="col" class="text-left">{{$t("Date")}}</th>
                <th scope="col" class="text-left">{{$t("UserName")}}</th>
                <th scope="col" class="text-left">{{$t("StepName")}}</th>
                <!-- <th scope="col" class="text-left">{{$t("WorkflowName")}}</th> -->
                <th scope="col" class="text-left">{{$t("Action")}}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="creationLogViewModel">
                <td class="text-left">1</td>
                <td class="text-left">{{ changeDateFormatToDatetime(creationLogViewModel.creationDate)}}</td>
                <td class="text-left">{{creationLogViewModel.username}}</td>
                <td class="text-left">{{creationLogViewModel.stepName}}</td>
                <!-- <td class="text-left">{{creationLogViewModel.workflowName}}</td> -->
                <td class="text-left">{{creationLogViewModel.action}}</td>
              </tr>
              <tr v-for="(Workflow, index) in Logs">
                <td>{{index+2}}</td>
                <td>{{ changeDateFormatToDatetime(Workflow.actionDate)}}</td>
                <td>{{Workflow.user.firstName}} {{Workflow.user.lastName}}</td>
                <td>
                  <span v-if="Workflow.workflowStepSetting">{{Workflow.workflowStepSetting.name}}</span>
                </td>
                <!-- <td>{{Workflow.workflowSetting.name}}</td> -->
                <td>
                  <span
                    v-if="Workflow.workflowStepActionSetting"
                  >{{Workflow.workflowStepActionSetting.name}}</span>
                </td>
              </tr>
              <tr v-if="awardedLogViewModel">
                <td class="text-left">{{Logs.length+1}}</td>
                <td class="text-left">{{ changeDateFormatToDatetime(awardedLogViewModel.creationDate)}}</td>
                <td class="text-left">{{awardedLogViewModel.username}}</td>
                <td class="text-left">{{awardedLogViewModel.stepName}}</td>
                <!-- <td class="text-left">{{awardedLogViewModel.workflowName}}</td> -->
                <td class="text-left">{{awardedLogViewModel.action}}</td>
              </tr>
              <tr v-if="closingLogViewModel">
                <td class="text-left">
                  <span v-if="awardedLogViewModel">{{Logs.length+2}}</span>
                  <span v-if="!awardedLogViewModel">{{Logs.length+1}}</span>
                </td>
                <td class="text-left">{{ changeDateFormatToDatetime(closingLogViewModel.closingDate)}}</td>
                <td
                  class="text-left"
                >{{closingLogViewModel.user.firstName}} {{closingLogViewModel.user.lastName}}</td>
                <td class="text-left">{{$t("initiator")}}</td>
                <!-- <td></td> -->
                <td class="text-left">{{$t("close")}}</td>
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

export default {
  data() {
    return {
      fullscreenLoading: false,
      closingLogViewModel: {},
      creationLogViewModel: {},
      awardedLogViewModel: {},
      show: true,
      Logs: [],
      page: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: this.$store.getters.getLargePagging
      },
      search: {
        CreateDateFromField: "",
        CreateDateToField: ""
      },
      tenderCalculationSheetId: this.$route.params.tenderCalculationSheetId,
      visible: false
    };
  },

  methods: {
    resetSearchForm() {
      this.page = {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: this.$store.getters.getLargePagging
      };
      this.search = {
        CreateDateFromField: "",
        CreateDateToField: ""
      };
      this.getWorkflowLogsFromService();
    },
    pageChanged: function(pageNum) {
      this.page.currentPage = pageNum;
      this.getWorkflowLogsFromService();
    },
    changeDateFormat(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    changeDateFormatToDatetime(date) {
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    getWorkflowLogsFromService() {
      var CreateDateFromField = "";
      var CreateDateToField = "";

      if (this.search.CreateDateFromField) {
        CreateDateFromField = moment(this.search.CreateDateFromField).format(
          "YYYY-MM-DD[T]HH:mm:ss"
        );
      }
      if (this.search.CreateDateToField) {
        CreateDateToField = moment(this.search.CreateDateToField).format(
          "YYYY-MM-DD[T]HH:mm:ss"
        );
      }

      var urlStr =
        this.$store.getters.serverURI +
        "api/TenderWorkflowLog/" +
        this.tenderCalculationSheetId +
        "?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&RowsCount=" +
        "&actionDateFrom=" +
        CreateDateFromField +
        "&actionDateTo=" +
        CreateDateToField +
        "&actionByUserId=";
      this.fullscreenLoading = true;

      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.Logs = data.body.list;
            this.page.totalItems = data.body.pagingInfo.rowsCount;
            this.closingLogViewModel = data.body.closingLogViewModel;
            this.creationLogViewModel = data.body.creationLogViewModel;
            this.awardedLogViewModel = data.body.awardedLogViewModel;
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
    this.getWorkflowLogsFromService();
  }
};
</script>