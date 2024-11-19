<template>
  <b-card class="card card-accent-primary" no-body v-loading.fullscreen.lock="fullscreenLoading">
    <div slot="header">
      {{$t("Pricequotetions")}} / {{$t('SearchFields')}}
      <div class="card-header-actions"></div>
    </div>
    <b-collapse id="collapse1" visible>
      <b-card-body>
        <form class="form-horizontal" @submit.prevent>
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label class="col-form-label">{{$t("QuotationReference")}}</label>
                <el-input
                  autocomplete="off"
                  v-model="calculationSheetId"
                  type="text"
                ></el-input>
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-group">
                <label class="col-form-label">{{$t("quoteNumber")}}</label>
                <el-input
                  autocomplete="off"
                  v-model="quoteNumber"
                  type="text"
                ></el-input>
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-group">
                <label class="col-form-label">{{$t("QuoteStage")}}</label>
                <el-select
                  v-model="stageId"
                  :data-vv-as="$t('QuoteStage')"
                  name="QuoteStage"
                  :placeholder="$t('Select')"
                  clearable
                  filterable
                  class="full-width"
                >
                  <el-option
                    v-if="stagelist.length"
                    v-for="option in stagelist"
                    v-bind:value="option.id"
                    :label="option.name"
                    v-bind:key="option.id"
                  ></el-option>
                </el-select>
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-group">
                <label class="col-form-label">{{$t("subject")}}</label>
                <el-input
                  autocomplete="off"
                  v-model="title"
                  type="text"
                ></el-input>
              </div>
            </div>

            <div class="col-md-4">
              <div class="form-group">
                <label class="col-form-label">{{$t("total")}}</label>
                <el-input
                  autocomplete="off"
                  v-model="totalAmount"
                  type="text"
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

              <button type="submit" class="btn btn-primary pull-right mr-1" @click="getPriceQuotes">
                <i class="fa fa-search"></i>
                {{$t("Search")}}
              </button>

              <button class="btn csubmit pull-right mr-1" variant="primary" @click="Excel()">
                <i class="fa fa-file-excel-o"></i>
                Export Excel
              </button>

              <router-link
                v-if="checkActions('Insert')"
                :to="{ name: 'newPriceQuotation'}"
                class="btn btn-success pull-left"
              >
                <i class="fa fa-plus-square-o"></i>
                {{$t("createPriceQuote")}}
              </router-link>
            </div>
          </div>
        </form>

        <div class="tableDiv">
          <table class="table table-bordered table-striped table-sm">
            <thead>
              <tr>
                <th scope="col" class="mw-220 text-left">{{$t("quoteNumber")}}</th>
                <th scope="col" class="text-left mw-130">{{$t("Subject")}}</th>
                <th scope="col" class="text-left mw-130">{{$t("QuotationReference")}}</th>
                <th scope="col" class="text-left mw-130">{{$t("QuoteStage")}}</th>
                <th scope="col" class="text-left mw-130">{{$t("Total")}}</th>
                <th scope="col" class="text-left mw-130">{{$t("calculationSheetType")}}</th>
                <th scope="col" class="text-center mw-130" width="7%">Actions</th>
              </tr>
            </thead>
            <tbody v-if="priceQuotes.length">
              <tr v-for="quote in priceQuotes">
                <td class="text-left">{{ quote.quoteNumber}}</td>
                <td class="text-left">{{ quote.subject}}</td>
                <td class="text-left">{{ quote.tenderNumber}}</td>
                <td class="text-left">{{quote.lookup.name}}</td>
                <td class="text-left">{{formatedNumber(quote.totalAmount)}}</td>
                <td class="text-left">{{getCalculationSheetTypeName(quote.calculationSheetType)}}</td>
                <td class="action-column text-center">
                  <router-link
                    v-if="checkActions('View')"
                    title="Action"
                    class="text-primary"
                    :to="{ name: 'viewPriceQuotation', params: {quoteID: quote.id}}"
                  >
                    <i class="fa fa-eye"></i>
                  </router-link>

                  <router-link
                    v-if="checkActions('Edit')"
                    :title="$t('Edit')"
                    class="text-primary"
                    :to="{ name: 'newPriceQuotation', params: {quoteID: quote.id}}"
                  >
                    <i class="fa fa-edit"></i>
                  </router-link>
                  <a
                    v-if="checkActions('Delete')"
                    :title="$t('Delete')"
                    class="text-danger"
                    v-on:click="deletePriceQoutes(quote.id);"
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
      calculationSheetList: [],
      stageId: "",
      sheetNumber: "",
      SheetType: "",
      totalAmount: "",
      title: "",
      quoteNumber: "",
      assignToUserId: "",
      calculationSheetId: "",
      usersList: [],
      stagelist: [],
      priceQuotes: [],
      page: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: parseInt(this.$store.getters.getLargePagging)
      }
    };
  },
  methods: {
    Excel() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/PriceQuotations/ExportToExcel/?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&subject=" +
        this.title +
        "&stageId=" +
        this.stageId +
        "&quoteNumber=" +
        this.quoteNumber +
        "&totalAmount=" +
        this.totalAmount +
        "&tenderNumber=" +
        this.calculationSheetId;

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
        fileLink.setAttribute("download", "Pricequotations.xlsx");
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
      // window.open(urlStr, "_blank");
    },
    getCalculationSheetTypeName(calculationSheetType){
      if(calculationSheetType ==1){
        return 'Medical Equipment';
      }else if(calculationSheetType ==2){
        return 'Tender';
      }
      else if (calculationSheetType){
        return 'Lab';
      }

    },
    formatedNumber(val) {
      return parseFloat(val).toFixed(3).slice(0,-1);
    },
    checkActions(roleName) {
      return checkRoles("Price Quotation", roleName);
    },
    resetSearchForm() {
      this.stageId = "";
      this.sheetNumber = "";
      this.SheetType = "";
      this.totalAmount = "";
      this.title = "";
      this.quoteNumber = "";
      this.assignToUserId = "";
      this.calculationSheetId = "";
      this.page = {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: parseInt(this.$store.getters.getLargePagging)
      };
      this.getPriceQuotes();
    },
    pageChanged: function(pageNum) {
      this.page.currentPage = pageNum;
      this.getPriceQuotes();
    },
    FillStageType: function() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.stageType;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.stagelist = data.body;
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
    FillUsersList: function() {
      var urlStr = this.$store.getters.serverURI + "api/User/GetAll";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.usersList = data.body;
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
    getPriceQuotes() {
      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/PriceQuotation?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&subject=" +
        this.title +
        "&stageId=" +
        this.stageId +
        "&quoteNumber=" +
        this.quoteNumber +
        "&totalAmount=" +
        this.totalAmount +
        "&tenderNumber=" +
        this.calculationSheetId;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.fullscreenLoading = false;
            
            this.priceQuotes = data.body.priceQuotationViewList;
            this.page.totalItems = data.body.pagingInfo.rowsCount;
            this.page.currentPage = data.body.pagingInfo.pageIndex;
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

    deletePriceQoutes(priceQuoteID) {
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
              "api/PriceQuotation/" +
              priceQuoteID;
            this.$http
              .delete(urlStr, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(function(data) {
                done();
                this.getPriceQuotes();
                instance.confirmButtonLoading = false;
                this.getPriceQuotes();
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
        .catch(() => {});
    },

    changeDateFormat(date) {
      return moment(date).format("MM/DD/YYYY");
    }
  },
  created: function() {
    this.FillUsersList();
    this.FillStageType();
    this.getPriceQuotes();
  }
};
</script>

<style scoped>
</style>