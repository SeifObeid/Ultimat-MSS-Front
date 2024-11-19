<template>
  <b-card
    class="card card-accent-primary"
    no-body
    v-if="show"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div slot="header">
      {{$t("CalculationSheetList")}} / {{$t('SearchFields')}}
      <div class="card-header-actions"></div>
    </div>
    <b-collapse id="collapse1" visible>
      <b-card-body>
        <form class="form-horizontal" @submit.prevent="getCalculationSheetList">
          <div class="row">
            <!-- <div class="col-md-4">
              <div class="form-group">
                <label class="col-form-label">{{$t("sheetNumber")}}</label>
                <el-input
                  autocomplete="off"
                  v-model="sheetNumber"
                  type="text"
                  v-bind:placeholder="$t('sheetNumber')"
                ></el-input>
              </div>
            </div>-->
            <div class="col-md-3">
              <div class="form-group">
                <label class="col-form-label">{{$t("quotationDescription")}}</label>
                <el-input
                  v-model="searchSubject"
                  type="text"
                  autocomplete="off"
                ></el-input>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label class="col-form-label">{{$t("Status")}}</label>
                <el-select
                  v-model="searchStatus"
                  name="Validity"
                  :placeholder="$t('Select')"
                  clearable
                  filterable
                  class="full-width"
                >
                  <el-option
                    v-if="statusList.length"
                    v-for="option in statusList"
                    v-bind:value="option.id"
                    :label="option.name"
                    v-bind:key="option.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label class="col-form-label">{{$t("TenderCurrency")}}</label>
                <el-select
                  v-model="tenderCurrencyCode"
                  v-validate="'required'"
                  :data-vv-as="$t('TenderCurrency')"
                  name="TenderCurrency"
                  :placeholder="$t('Select')"
                  clearable
                  filterable
                  class="full-width"
                >
                  <el-option
                    v-if="tenderCurrencies.length"
                    v-for="option in tenderCurrencies"
                    v-bind:value="option.code"
                    :label="option.name"
                    v-bind:key="option.code"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label class="col-form-label">{{$t("MSSCustomerName")}}</label>
                <el-select
                      v-model="searchCustomerCode"
                      name="MSSCustomerName"
                      remote
                      reserve-keyword
                      :remote-method="remoteMethodMSSCustomer"
                      :loading="loadingAccount"
                      :placeholder="$t('Select')"
                      clearable
                      filterable
                      :data-vv-as="$t('MSSCustomerName')"
                      
                      
                    >
                      <el-option
                        v-for="option in mssCustomers"
                        v-bind:value="option.code"
                        :label="option.name"
                        v-bind:key="option.code"
                      ></el-option>
                    </el-select>
                <!-- <el-input
                  v-model="searchCustomerName"
                  type="text"
                  autocomplete="off"
                ></el-input> -->
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-3">
              <div class="form-group">
                <label class="col-form-label">{{$t("SubmissionDate")}}</label>
                <el-date-picker
                  v-model="searchSubmissionDate"
                  type="date"
                  v-bind:format="this.$store.getters.getDateFormat"
                ></el-date-picker>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label class="col-form-label">{{$t("TenderType")}}</label>
                <el-select
                  v-model="tenderType "
                  v-validate="'required'"
                  :data-vv-as="$t('TenderType')"
                  name="TenderType"
                  :placeholder="$t('Select')"
                  clearable
                  filterable
                  class="full-width"
                >
                  <el-option
                    v-if="TenderTypeList.length"
                    v-for="option in TenderTypeList"
                    v-bind:value="option.id"
                    :label="option.name"
                    v-bind:key="option.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label class="col-form-label">{{$t("QuotationNumber")}}</label>
                <el-select
                  v-model="quotationReference"
                  v-validate="'required'"
                  :data-vv-as="$t('QuotationNumber')"
                  name="QuotationReference"
                  :placeholder="$t('Select')"
                  clearable
                  filterable
                  class="full-width"
                >
                  <el-option
                    v-if="QotationReferenceList.length"
                    v-for="option in QotationReferenceList"
                    v-bind:value="option.tenderNumber"
                    :label="option.tenderNumber"
                    v-bind:key="option.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label class="col-form-label">{{$t("NonCustomerName")}}</label>
                <el-input
                  v-model="searchNonMSSCustomerName"
                  type="text"
                  autocomplete="off"
                ></el-input>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label class="col-form-label">{{$t("TenderName")}}</label>
                <el-input
                  v-model="searchTenderName"
                  type="text"
                  autocomplete="off"
                ></el-input>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label class="col-form-label">{{$t("FromDate")}}</label>
                <el-date-picker
                  v-model="searchFromDate"
                  type="date"
                  v-bind:format="this.$store.getters.getDateFormat"
                ></el-date-picker>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label class="col-form-label">{{$t("ToDate")}}</label>
                <el-date-picker
                  v-model="searchToDate"
                  type="date"
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

              <button type="submit" class="btn btn-primary pull-right mr-1" @click="searchAction">
                <i class="fa fa-search"></i>
                {{$t("Search")}}
              </button>

              <button class="btn csubmit pull-right mr-1" variant="primary" @click="Excel()">
                <i class="fa fa-file-excel-o"></i>
                Export Excel
              </button>

              <router-link
                v-if="checkActions('Insert')"
                :to="{ name: 'NewCalculationSheet'}"
                class="btn btn-success pull-left"
              >
                <i class="fa fa-plus-square-o"></i>
                {{$t("CreateNewCalculationSheet")}}
              </router-link>
            </div>
          </div>
        </form>
        <!-- <div class="tableDiv"> -->
        <el-table
          ref="myTable"
          :data="calculationSheetList"
          border
          style="width: 100%"
          @sort-change="sort"
        >
          <el-table-column prop="tenderNumber" label="Quotation number" sortable :min-width="22"></el-table-column>
          <el-table-column
            prop="quotationDescription"
            label="Quotation description"
            :min-width="23"
          ></el-table-column>
          <el-table-column prop="tenderName" label="Tender Name" :min-width="15"></el-table-column>
          <el-table-column prop="formattedStatus" label="Status" sortable :min-width="13"></el-table-column>
          <el-table-column prop="tenderCurrencyCode" label="Currency" sortable :min-width="15"></el-table-column>
          <el-table-column label="Customer" sortable :min-width="18">
            <template slot-scope="scope">
              <span v-if="scope.row.mssCustomerName ">{{scope.row.mssCustomerName }}</span>
              <span v-else-if="scope.row.nonMssCustomerName">{{scope.row.nonMssCustomerName}}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="submissionDate" label="Submission date" sortable :min-width="20">
            <template slot-scope="scope">
              <span>{{changeDateFormat(scope.row.submissionDate)}}</span>
            </template>
          </el-table-column>

          <el-table-column label="Last modified date" sortable        
          
          :sort-method="customSort"
           :min-width="18"  >
            <template slot-scope="scope">
              <span v-if="scope.row.updateDate "> {{changeDateFormatToDatetime(scope.row.updateDate)}} </span>
              <span v-else-if="scope.row.creationDate"> {{changeDateFormatToDatetime(scope.row.creationDate)}} </span>
            </template>
 
          </el-table-column>
          
          <el-table-column label="Actions" :min-width="10">
            <template slot-scope="scope">
              <router-link
                v-if="checkActions('View')"
                title="Action"
                class="text-primary pr-1"
                :to="{ name: 'viewCalculationSheet', params: {CalSheetId: scope.row.id}}">
                <i class="fa fa-eye"></i>
              </router-link>

              <router-link
                :title="$t('WorkflowLog')"
                class="text-defualt pr-1"
                v-if="scope.row.viewOnly != true"
                :to="{ name: 'WorkflowLog', params: {calculationSheetId: scope.row.id}}">
                <i class="fa fa-history"></i>
              </router-link>

              <router-link
                :title="$t('Edit')"
                v-if="scope.row.status !=  $store.getters.getSheetStatus.Approved && scope.row.status !=  $store.getters.getSheetStatus.Awarded && scope.row.viewOnly != true && checkActions('Edit')"
                class="text-primary pr-1"
                :to="{ name: 'NewCalculationSheet', params: {CalSheetId: scope.row.id}}">
                <i class="fa fa-edit"></i>
              </router-link>

              <a
                :title="$t('addversion')"
                @click="addCalculationSheetVersion(scope.row.id)"
                v-if="scope.row.status ==  $store.getters.getSheetStatus.Approved && scope.row.status !=  $store.getters.getSheetStatus.Awarded && checkActions('Insert') /*&& scope.row.createdBy == loggeduser*/ && scope.row.viewOnly != true"
                class="text-primary pr-1">
                <i class="fa fa-file-text-o"></i>
              </a>

              <a
                :title="$t('addCopy')"
                @click="addCalculationSheetCopy(scope.row.id)"
                v-if="scope.row.createdBy == loggeduser && scope.row.viewOnly != true"
                class="text-primary pr-1">
                <i class="fa fa-file-word-o"></i>
              </a>

              <a
                :title="$t('Delete')"
                class="text-danger"
                v-if="scope.row.status != $store.getters.getSheetStatus.Approved && scope.row.status != $store.getters.getSheetStatus.Awarded && checkActions('Delete') && scope.row.viewOnly != true"
                v-on:click="deleteCalculationSheetItem(scope.row.id);">
                <i class="fa fa-trash"></i>
              </a>
            </template>
          </el-table-column>
        </el-table>

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
      <!-- </b-collapse>
        </b-card>
      </template>-->

      <!-- <div class="table-responsive">
            <table class="table table-bordered table-sm table-striped dataTable">
              <thead>
                <tr>
                  <th scope="col" width="7%" class="text-left">{{ $t('sheet#')}}</th>
                  <th scope="col" class="mw-220 text-left">{{$t('quotationDescription')}}</th>
                  <th scope="col" class="text-left mw-100">{{$t('Status')}}</th>
                  <th scope="col" class="text-left mw-100">{{$t('TenderCurrency')}}</th>
                  <th scope="col" class="text-left mw-120">{{$t('MSSCustomerName')}}</th>
                  <th scope="col" class="text-left mw-100">{{$t('SubmissionDate')}}</th>
                  <th scope="col" class="action-column text-center mw-mxw-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(calcsheet, index) in calculationSheetList" v-bind:key="index">
                  <td class="text-left">{{calcsheet.id}}</td>
                  <td class="text-left">{{ calcsheet.quotationDescription}}</td>
                  <td class="text-left">{{calcsheet.formattedStatus }}</td>
                  <td class="text-left">{{calcsheet.tenderCurrencyCode}}</td>
                  <td class="text-left">
                    <span v-if="calcsheet.mssCustomerName ">{{calcsheet.mssCustomerName }}</span>
                    <span v-else-if="calcsheet.nonMssCustomerName">{{calcsheet.nonMssCustomerName}}</span>
                  </td>
                  <td class="text-left">{{ changeDateFormat(calcsheet.submissionDate)}}</td>
                  <td class="action-column text-center">
                    <router-link
                      v-if="checkActions('View') && calcsheet.viewOnly"
                      title="View to ction"
                      class="text-primary"
                      :to="{ name: 'viewCalculationSheet', params: {CalSheetId: calcsheet.id}}"
                    >
                      <i class="fa fa-eye"></i>
                    </router-link>

                    <router-link
                      :title="$t('WorkflowLog')"
                      class="text-defualt"
                      :to="{ name: 'WorkflowLog', params: {calculationSheetId: calcsheet.id}}"
                    >
                      <i class="fa fa-history"></i>
                    </router-link>

                    <router-link
                      :title="$t('Edit')"
                      v-if="calcsheet.status != 4 && checkActions('Edit')"
                      class="text-primary"
                      :to="{ name: 'NewCalculationSheet', params: {CalSheetId: calcsheet.id}}"
                    >
                      <i class="fa fa-edit"></i>
                    </router-link>
                    <a
                      :title="$t('addversion')"
                      @click="addCalculationSheetVersion(calcsheet.id)"
                      v-if="calcsheet.status == 4 && calcsheet.createdBy == loggeduser"
                      class="text-primary"
                    >
                      <i class="fa fa-file-text-o"></i>
                    </a>
                    <a
                      :title="$t('Delete')"
                      class="text-danger"
                      v-if="calcsheet.status !=4 && checkActions('Delete')"
                      v-on:click="deleteCalculationSheetItem(calcsheet.id);"
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
      </div>-->
      <!-- </div> -->
      <!-- </b-card-body> -->
    </b-collapse>
  </b-card>
</template>
<style scoped>
.cdatePicker .el-icon-date .el-input__icon {
  width: 50px !important;
}
.mw-mxw-70 {
  max-width: 100px !important;
  min-width: 75px !important;
}
.mw-150 {
  min-width: 150px !important;
}
.mw-130 {
  min-width: 130px !important;
}
.mw-220 {
  min-width: 220px !important;
}
</style>
<script type="text/javascript">
var moment = require("moment");
import { checkRoles } from "../../shared/utils";
import axios from "axios";


export default {
  data() {
    return {
      fullscreenLoading: false,
      loggeduser: 0,
      show: true,
      ItemsGroup: [],
      calculationSheetList: [],
      searchSubject: "",
      searchStatus: "",
      tenderCurrencyCode: "",
      sheetNumber: "",
      searchCustomerName: "",
      searchCustomerCode:"",
      searchreleaseDate: "",
      searchSubmissionDate: "",
      searchTenderName: "",
      searchNonMSSCustomerName: "",
      searchFromDate: "",
      searchToDate: "",

      isVat: "",
      isFunded: "",
      sortBy: "",
      orderAsc: "false",
      quotationReference: "",
      tenderType: "",
      tenderCurrencies: [],
      statusList: [],
      sortByList: [
        { id: 0, name: "TenderNumber" },
        { id: 1, name: "Status" },
        { id: 2, name: "TenderCurrencyCode" },
        { id: 3, name: "CustomerName" },
        { id: 4, name: "SubmissionDate" }
      ],
      TenderTypeList: [],
      QotationReferenceList: [],
      page: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: this.$store.getters.getLargePagging
      },
      search: {
        principalCodeField: "",
        CreateDateFromField: ""
      },

      visible: false,
      mssCustomers: [],
      loadingAccount: false
    };
  },
  methods: {
     customSort(a, b) {
  const dateA = a.UpdateDate ? new Date(a.UpdateDate) : new Date(a.CreationDate)
  const dateB = b.UpdateDate ? new Date(b.UpdateDate) : new Date(b.CreationDate)

  return dateA.getTime() - dateB.getTime()
},
    remoteMethodMSSCustomer: function(query) {
      if (query !== "") {
        this.loadingAccount = true;
        var loggeduser = this.$store.getters.getUserData;
    this.loggedUserType = loggeduser && loggeduser.userType? loggeduser.userType:22

        var urlStr =
          this.$store.getters.serverURI +
          "api/item/GetAllMssCustomer?PageIndex=" +
          1 +
          "&PageSize=" +
          this.$store.getters.getReturnPage +
          "&name=" +
          query +
          "&department="+this.loggedUserType +
          "&code=";
        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function(data) {
              this.mssCustomers = data.body;
              this.loadingAccount = false;
            },
            function(error) {
              this.loadingAccount = false;
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "error",
                message: error.body.message
              });
            }
          );
      } else this.mssCustomers = [];
    },
    addCalculationSheetCopy: function(CalcuationSheetID) {
      this.fullscreenLoading = true
      var urlStr = this.$store.getters.serverURI + "api/CalculationSheet/AddCopy/" + CalcuationSheetID;
      this.$http
        .post(
          urlStr,
          { id: CalcuationSheetID },
          {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          }
        )
        .then(
          function(data) {
            this.fullscreenLoading = false
            if (data.body) {
              this.$router.push({
                name: "NewCalculationSheet",
                params: { CalSheetId: data.body }
              });

              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "success",
                message: "Calculation sheet copied successfully"
              });
            }

            if (data.status == 460) {
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "warning",
                message: response.data.message
              });
            }
          },
          function(error) {
            this.fullscreenLoading = false
            if (error.status == 460) {
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "warning",
                message: response.data.message
              });
            } else {
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "error",
                message: this.$t("ErrorMessage")
              });
            }
          }
        );
    },
    sort(sortProps) {
      switch (sortProps.prop) {
        case "formattedStatus":
          this.sortBy = "1";
          break;
        case "tenderCurrencyCode":
          this.sortBy = "2";
          break;
        case "mssCustomerName":
          this.sortBy = "3";
          break;
        case "submissionDate":
          this.sortBy = "4";
          break;
        case "tenderNumber":
          this.sortBy = "5";
          break;
        default:
          break;
      }
      this.orderAsc = sortProps.order == "ascending" ? "true" : "false";
      this.getCalculationSheetList();
    },
    Excel() {
      var submissionDate = "";
      var releaseDate = "";
      var principalCode = "";
      var categoryCode = "";
      var modelCode = "";
      var status = this.searchStatus;
      var subject = this.searchSubject ? this.searchSubject : "";
      var fromDateFormatted = "";
      var toDateFormatted = "";


      if (this.searchreleaseDate) {
        releaseDate = moment(this.searchreleaseDate).format(
          "YYYY-MM-DD[T]HH:mm:ss"
        );
      }
      if (this.searchSubmissionDate) {
        submissionDate = moment(this.searchSubmissionDate).format(
          "YYYY-MM-DD[T]HH:mm:ss"
        );

      }

      if (this.searchFromDate) {
        fromDateFormatted = moment(this.searchFromDate).format(
          "YYYY-MM-DD[T]HH:mm:ss"
        );
        
      }
      if (this.searchToDate) {
        toDateFormatted = moment(this.searchToDate).format(
          "YYYY-MM-DD[T]HH:mm:ss"
        );
        
      }
      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/CalculationSheets/ExportToExcel?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&RowsCount=" +
        "&status=" +
        status +
        "&quotationDescription=" +
        subject +
        "&customerName=" +
        this.searchCustomerName +
        "&customerCode=" +
        this.searchCustomerCode +
        "&isVat=" +
        this.isVat +
        "&isFunded=" +
        this.isFunded +
        "&tenderCurrencyCode=" +
        this.tenderCurrencyCode +
        "&submissionDate=" +
        submissionDate +
        "&sortBy=" +
        this.sortBy +
        "&orderAsc=" +
        this.orderAsc +
        "&quotationReference=" +
        this.quotationReference +
        "&tenderType=" +
        this.tenderType +
        "&nonMSSCustomerName=" +
        this.searchNonMSSCustomerName+
        "&tenderName=" +
        this.searchTenderName+
        "&fromDate=" +
        fromDateFormatted+
        "&toDate=" +
        toDateFormatted;
      
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
        fileLink.setAttribute("download", "CalculationSheet.xlsx");
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
      return checkRoles("Calculation Sheet", roleName);
    },
    resetSearchForm() {
      this.searchStatus = "";
      this.searchSubject = "";
      this.searchSubject = "";
      this.searchStatus = "";
      this.tenderCurrencyCode = "";
      this.sheetNumber = "";
      this.searchCustomerName = "";
      this.searchCustomerCode="";
      this.searchreleaseDate = "";
      this.searchSubmissionDate = "";
      this.isVat = "";
      this.isFunded = "";
      this.sortBy = "4";
      this.orderAsc = "false";
      this.quotationReference = "";
      this.tenderType = "";
      this.searchNonMSSCustomerName = "";
      this.searchTenderName = "";
      this.searchFromDate = "";
      this.searchToDate = "";

      this.page = {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: this.$store.getters.getLargePagging
      };
      this.searchAction();
    },
    changeDateFormat(date) {
      return moment(date).format("YYYY/MM/DD");
    },
    changeDateFormatToDatetime(date) {
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    pageChanged: function(pageNum) {
      this.page.currentPage = pageNum;
      this.getCalculationSheetList();
    },
    getCalculationSheetList() {
      var submissionDate = "";
      var releaseDate = "";
      var principalCode = "";
      var categoryCode = "";
      var modelCode = "";
      var fromDateFormatted = "";
      var toDateFormatted = "";

      var status = this.searchStatus;
      var subject = this.searchSubject ? this.searchSubject : "";
      if (this.searchreleaseDate) {
        releaseDate = moment(this.searchreleaseDate).format(
          "YYYY-MM-DD[T]HH:mm:ss"
        );
      }
      if (this.searchSubmissionDate) {
        submissionDate = moment(this.searchSubmissionDate).format(
          "YYYY-MM-DD[T]HH:mm:ss"
        );
      }
      if (this.searchFromDate) {
        fromDateFormatted = moment(this.searchFromDate).format(
          "YYYY-MM-DD[T]HH:mm:ss"
        );
      }
      if (this.searchToDate) {
        toDateFormatted = moment(this.searchToDate).format(
          "YYYY-MM-DD[T]HH:mm:ss"
        );   
      }

      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/CalculationSheet?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&RowsCount=" +
        "&status=" +
        status +
        "&quotationDescription=" +
        subject +
        "&customerName=" +
        this.searchCustomerName +
        "&customerCode=" +
        this.searchCustomerCode +
        "&isVat=" +
        this.isVat +
        "&isFunded=" +
        this.isFunded +
        "&tenderCurrencyCode=" +
        this.tenderCurrencyCode +
        "&submissionDate=" +
        submissionDate +
        "&sortBy=" +
        this.sortBy +
        "&orderAsc=" +
        this.orderAsc +
        "&quotationReference=" +
        this.quotationReference +
        "&tenderType=" +
        this.tenderType +
        "&nonMSSCustomerName=" +
        this.searchNonMSSCustomerName+
        "&tenderName=" +
        this.searchTenderName+
        "&fromDate=" +
        fromDateFormatted+
        "&toDate=" +
        toDateFormatted;

      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.fullscreenLoading = false;
            this.calculationSheetList = data.body.list;
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
    FillAllCurrencies: function() {
      var urlStr = this.$store.getters.serverURI + "api/Item/GetAllCurrencies";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.tenderCurrencies = data.body;
            if (this.calSheetId) {
              this.fillCalculationCurrencyRate();
            }
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
    FillStatus: function() {
      var urlStr =
        this.$store.getters.serverURI + "api/CalculationSheet/GetAllStatus";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.statusList = data.body;
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
    addCalculationSheetVersion: function(CalcuationSheetID) {
      this.fullscreenLoading = true
      var urlStr =
        this.$store.getters.serverURI +
        "api/CalculationSheet/AddVersion/" +
        CalcuationSheetID;
      this.$http
        .post(
          urlStr,
          { id: CalcuationSheetID },
          {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          }
        )
        .then(
          function(data) {
            this.fullscreenLoading = false
            if (data.body) {
              this.$router.push({
                name: "NewCalculationSheet",
                params: { CalSheetId: data.body }
              });

              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "success",
                message: "Calculation sheet created successfullyy "
              });
            }

            if (data.status == 460) {
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "warning",
                message: response.data.message
              });
            }
          },
          function(error) {
            this.fullscreenLoading = false
            if (error.status == 460) {
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "warning",
                message: response.data.message
              });
            } else {
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "error",
                message: this.$t("ErrorMessage")
              });
            }
          }
        );
    },
    searchAction() {
      this.getCalculationSheetList();
    },
    deleteCalculationSheetItem(calculationSheetId) {
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
              "api/CalculationSheet?calculationSheetId=" +
              calculationSheetId;
            this.$http
              .delete(urlStr, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(function(data) {
                done();
                this.getCalculationSheetList();
                instance.confirmButtonLoading = false;
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
    FillTenderType: function() {
      var urlStr = this.$store.getters.serverURI + "api/lookup/GetByType/1";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.TenderTypeList = data.body;
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
    FillQuotationReference: function() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/CalculationSheet/GetCalculationSheetsTinyInfo";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.QotationReferenceList = data.body;
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
    this.loggeduser = this.$store.getters.getUserData.id;
    this.getCalculationSheetList();
    this.FillAllCurrencies();
    this.FillStatus();
    this.FillQuotationReference();
    this.FillTenderType();
  }
};
</script>