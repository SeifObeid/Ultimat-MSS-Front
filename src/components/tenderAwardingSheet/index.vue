<template>
  <b-card class="card card-accent-primary" no-body v-loading.fullscreen.lock="fullscreenLoading">
    <div slot="header">
      {{$t("Awardingsheet")}} / {{$t('SearchFields')}}
      <div class="card-header-actions"></div>
    </div>
    <b-collapse id="collapse1" visible>
      <b-card-body>
        <form class="form-horizontal" @submit.prevent>
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label class="col-form-label">{{$t("sheetNumber")}}</label>
                <el-input v-model="sheetNumber" type="text"></el-input>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label class="col-form-label">{{$t("quoteNumber")}}</label>
                <el-select
                  v-model="quoteNumber"
                  name="quoteNumber"
                  clearable
                  filterable
                  :placeholder="$t('Select')"
                >
                  <el-option
                    v-for="option in quoteNumbers"
                    v-bind:value="option.id"
                    v-bind:label="option.quoteNumber"
                    v-bind:key="option.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label class="col-form-label">{{$t("QuotationReference")}}</label>
                <el-select
                  v-model="tenderCalculationSheetId"
                  name="tenderCalculationSheet"
                  clearable
                  filterable
                  :placeholder="$t('Select')"
                >
                  <el-option
                    v-for="option in tenderCalculationSheetList"
                    v-bind:value="option.id"
                    v-bind:label="option.tenderNumber"
                    v-bind:key="option.id"
                  ></el-option>
                </el-select>
              </div>
            </div>

          </div>

          <div class="row"></div>

          <div class="row">
            <div class="col-md-12 mt-3 mb-3">
              <button type="button" class="btn btn-danger pull-right" @click="resetSearchForm">
                <i class="fa fa-remove"></i>
                {{$t("Clear")}}
              </button>

              <button
                type="submit"
                class="btn btn-primary pull-right mr-1"
                @click="getAwardingSheetList"
              >
                <i class="fa fa-search"></i>
                {{$t("Search")}}
              </button>

              <button class="btn csubmit pull-right mr-1" variant="primary" @click="Excel()">
                <i class="fa fa-file-excel-o"></i>
                Export Excel
              </button>

              <!-- <router-link
                v-if="checkActions('Insert')"
                :to="{ name: 'tenderNewAwardingSheet'}"
                class="btn btn-success pull-left"
              >
                <i class="fa fa-plus-square-o"></i>
                {{$t("CreateAwardingSheet")}}
              </router-link> -->
            </div>
          </div>
        </form>
        <div class="tableDiv">
          <table class="table table-bordered table-striped table-sm">
            <thead>
              <tr>
                <!-- <th scope="col" width="8%" class="text-left">{{ $t('sheet#')}}</th> -->
                <th scope="col" class="mw-200 text-left" width="20%">{{ $t('quotationDescription')}}</th>
                <th scope="col" class="text-left mw-130" width="10%">{{ $t('QuotationReference')}}</th>
                <th scope="col" class="text-left mw-130" width="10%">{{ $t('SubmissionDate')}}</th>
                <th scope="col" class="text-center mw-130" width="7%">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="awardingSheets.length" v-for="awarding in awardingSheets">
                <!-- <td class="text-left">{{awarding.id}}</td> -->
                <td class="text-left">{{awarding.quotationDescription}}</td>
                <td class="text-left">{{awarding.tenderNumber}}</td>
                <td class="text-left">{{ changeDateFormat(awarding.submissionDate)}}</td>
                <td class="action-column text-center">
                  <router-link
                    v-if="checkActions('View')"
                    title="Action"
                    class="text-primary"
                   :to="{ name: 'tenderViewAwardingSheet', params: {CalSheetId: awarding.id}}">
                    <i class="fa fa-eye"></i>
                  </router-link>
                  <!-- <router-link
                    v-if="checkActions('Edit')"
                    :title="$t('Edit')"
                    class="text-primary"
                    :to="{ name: 'tenderNewAwardingSheet', params: {awardingID: awarding.id}}">
                    <i class="fa fa-edit"></i>
                  </router-link> -->
                  <a
                    v-if="checkActions('Delete')"
                    :title="$t('Delete')"
                    class="text-danger"
                    v-on:click="deleteAwardingSheet(awarding.id);"
                  >
                    <i class="fa fa-trash"></i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
var moment = require("moment");
import { checkRoles } from "../../shared/utils";
import axios from "axios";

export default {
  name: "index",
  data() {
    return {
      fullscreenLoading: false,
      tenderCalculationSheetId: "",
      quoteNumber: "",
      sheetNumber: "",
      SheetType: "",
      title: "",
      tenderCalculationSheetList: [],
      awardingSheets: [],
      quoteNumbers: [],
      SheetTypeList: [
        { id: 1, name: "type 01" },
        { id: 2, name: "type 02" }
      ],
      page: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: parseInt(this.$store.getters.getLargePagging)
      }
    };
  },
  methods: {
    changeDateFormat(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    Excel() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/TenderCalculationSheet/ExportToExcel?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&RowsCount=&awardingSheetId=" +
        this.sheetNumber +
        "&tenderCalculationSheetId=" +
        this.tenderCalculationSheetId +
        "&priceQuotationId=" +
        this.quoteNumber +
        "&sheetType=" +
        this.SheetType + "&status=7";

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
        fileLink.setAttribute("download", "AwardingSheet.xlsx");
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
      return checkRoles("Awarding Sheet", roleName);
    },
    resetSearchForm() {
      this.sheetNumber = "";
      this.SheetType = "";
      this.tenderCalculationSheetId = "";
      this.quoteNumber = "";
      this.title = "";
      this.page = {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: parseInt(this.$store.getters.getLargePagging)
      };
      this.getAwardingSheetList();
    },
    pageChanged: function(pageNum) {
      this.page.currentPage = pageNum;
      this.getAwardingSheetList();
    },
    getAwardingSheetList() {
      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/TenderCalculationSheet?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&RowsCount=&awardingSheetId=" +
        this.sheetNumber +
        "&tenderCalculationSheetId=" +
        this.tenderCalculationSheetId +
        "&priceQuotationId=" +
        this.quoteNumber +
        "&sheetType=" +
        this.SheetType + "&status=7";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            
            this.awardingSheets = data.body.list;
            this.page.totalItems = data.body.pagingInfo.rowsCount;
            this.page.currentPage = data.body.pagingInfo.pageIndex;
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
    },
    deleteAwardingSheet(awardingSheetID) {
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
              "api/TenderCalculationSheet?tenderCalculationSheetId=" + awardingSheetID;
            this.$http
              .delete(urlStr, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(function(data) {
                done();
                this.getAwardingSheetList();
                instance.confirmButtonLoading = false;
                this.getAwardingSheetList();
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

        });
    },
    changeDateFormat(date) {
      return moment(date).format("MM/DD/YYYY");
    },
    geTtenderCalculationSheetRefernce() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/TenderCalculationSheets/geTtenderCalculationSheetsTinyModelOfAwardingSheets";

      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            
            this.tenderCalculationSheetList = data.body;
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
    getQuoteNumbers() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/TenderPriceQuotation/getPriceQuotationsTinyModelOfAwardingSheets";

      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            
            this.quoteNumbers = data.body;
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
    }
  },
  created: function() {
    this.geTtenderCalculationSheetRefernce();
    this.getQuoteNumbers();
    this.getAwardingSheetList();
  }
};
</script>

<style scoped>
</style>