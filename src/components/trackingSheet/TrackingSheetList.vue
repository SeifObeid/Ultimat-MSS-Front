<template>
  <b-card
    class="card card-accent-primary"
    no-body
    v-if="show"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div slot="header">
      {{$t("TrackingSheetList")}} / {{$t('SearchFields')}}
      <div class="card-header-actions"></div>
    </div>
    <b-collapse id="collapse1" visible>
      <b-card-body>
        <form class="form-horizontal" @submit.prevent="searchAction">
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
                <label class="col-form-label">{{$t("TenderName")}}</label>
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
                <el-input
                  v-model="searchCustomerName"
                  type="text"
                  autocomplete="off"
                ></el-input>
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
                <label class="col-form-label">{{$t("QuotationReference")}}</label>
                <!-- <el-select
                  v-model="quotationReference"
                  v-validate="'required'"
                  :data-vv-as="$t('QuotationReference')"
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
                </el-select> -->
              
              
               <el-select
               v-model="quotationReference"
                  v-validate="'required'"
                  :data-vv-as="$t('QuotationReference')"
                  name="QuotationReference"
                  class="full-width"
                      remote
                      reserve-keyword
                      :remote-method="remoteMethodQuotationReference"
                      :loading="loadingQuotation"
                      :placeholder="$t('Select')"
                      clearable
                      filterable
                      :value="QuotationReference"
                    >
                      <el-option
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
                <label class="col-form-label">{{$t("Type")}}</label>
                <el-select
                  v-model="sheetType"
                  name="Validity"
                  :placeholder="$t('Select')"
                  clearable
                  filterable
                  class="full-width"
                >
                  <el-option
                    v-if="typeArray.length"
                    v-for="option in typeArray"
                    v-bind:value="option.id"
                    :label="option.name"
                    v-bind:key="option.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </form>
          <div class="row">
            <div class="col-md-12 mt-3 mb-3">
              <button type="button" class="btn btn-danger pull-right" @click="resetSearchForm">
                <i class="fa fa-remove"></i>
                {{$t("Clear")}}
              </button>

              <button v-if="checkActions('View')" type="submit" class="btn btn-primary pull-right mr-1" @click="searchAction">
                <i class="fa fa-search"></i>
                {{$t("Search")}}
              </button>

              <button class="btn csubmit pull-right mr-1" variant="primary" @click="Excel()">
                <i class="fa fa-file-excel-o"></i>
                Export Excel
              </button>

              <button v-if="checkActions('Edit')" type="submit" :disabled="!showSave" class="btn btn-success pull-right mr-1" @click="updateSheets">
                  <i class="fa fa-plus-square-o"></i>
                  {{$t("Update")}} ({{selectedCounts}}) {{$t('Sheet(s)')}}
              </button>

               <!-- <div  class="pull-left pt-2">
                  <strong style="color:red">{{$t('UpdateHint')}}</strong>
              </div> -->
            </div>
          </div>
        <!-- <div class="tableDiv"> -->
        <!-- @sort-change="sort" -->

        <table class="table table-bordered table-striped table-sm">
            <thead>
              <tr>
                <th scope="col" class="pt-2 pb-2 text-center header_align"  width="4%"></th>
                <th scope="col" class="pt-2 pb-2 text-center header_align"  width="6%">Qout. Ref</th>
                <th scope="col" class="pt-2 pb-2 text-center header_align"  width="24%">Tender name</th>
                <th scope="col" class="pt-2 pb-2 text-center header_align"  width="5%">Type</th>
                <th scope="col" class="pt-2 pb-2 text-center header_align"  width="14%">Customer name</th>
                <th scope="col" class="pt-2 pb-2 text-center header_align"  width="7%">Current status</th>
                <th scope="col" class="pt-2 pb-2 text-center header_align"  width="10%">Status</th>
                <th scope="col" class="pt-2 pb-2 text-center header_align"  width="8%">Sub. date</th>
                <th scope="col" class="pt-2 pb-2 text-center header_align"  width="6%">Total  wV</th>
                <th scope="col" class="pt-2 pb-2 text-center header_align"  width="10%">Notes</th>
                <th scope="col" class="pt-2 pb-2 text-center header_align"  width="6%">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in tenderCalculationSheetList" v-bind:key="index" :class="{'has-validation':row.Validation,'has-no-validation':!row.Validation&&row.selected }">
                <td class="align-middle text-center" >
                    <b-form-checkbox style="padding-left:2rem;" :id="'item-'+index" v-model="row.selected" @change="selectedRow(row,index)"></b-form-checkbox>
                </td>
                <td class="align-middle text-center">
                  <!-- <a href="#" @click="goToSheet(row.id,row.type)" >{{row.tenderNumber}}</a> -->
                   <router-link target="_blank" v-if="row.type==2" class="text-primary" 
                    :to="{ name: 'tenderViewCalculationSheet', params: {CalSheetId: row.id}}">
                    {{row.tenderNumber}}
                  </router-link>
                  <router-link target="_blank" v-if="row.type==1" class="text-primary" 
                   :to="{ name: 'viewCalculationSheet', params: {CalSheetId: row.id}}">
                    {{row.tenderNumber}}
                  </router-link>
                </td>
                <td class="align-middle text-center text-break"><span :title="row.tenderName">{{row.tenderName.length>100?row.tenderName.substring(0,100)+'...':row.tenderName}}</span></td>
                <td class="align-middle text-center">
                  <span v-if="row.type == 1">Medical</span>
                  <span v-if="row.type == 2">Tender</span>
                </td>
                  <td class="align-middle text-center">
                  <span v-if="row.mssCustomerName"  style="white-space: pre-wrap;">{{row.mssCustomerName}}</span>
                  <span v-if="row.nonMssCustomerName"  style="white-space: pre-wrap;">{{row.nonMssCustomerName}}</span>
                </td>
                  <td class="align-middle text-center">
                    <span>{{row.calculationSheetStatus.name}}</span>
                  </td>
                  <td class="align-middle text-center">
                    <el-select v-model="row.trackingStatus" clearable filterable name="trackingStatus"  size="mini" @change="checkValidation(row)">
                      <el-option v-for="option in AllStatus" :value="option.id" :label="option.name" :key="option.id"></el-option>
                    </el-select>
                    <!-- <span v-if="row.trackingStatusValidation" style="color:red">{{row.trackingStatusValidation}}</span> -->
                  </td>
                <td class="align-middle text-center">
                  <span>{{changeDateFormat(row.submissionDate)}}</span>
                </td>
                <td class="align-middle text-center">
                    <span>{{row.totalAmountWithoutVat | toUSD}} {{row.tenderCurrencyCode}}</span>
                </td>
                <td class="align-middle text-center">
                  <el-popover v-if="row.notes && row.notes != '' "
                    placement="top-start"
                    title="Notes"
                    width="200"
                    trigger="hover"
                    :content="row.notes">
                      <el-input slot="reference" @input="checkValidation(row)" autocomplete="off" placeholder="Enter note." v-model="row.notes" size="mini" :maxlength="$store.getters.getMaxLength.length100"></el-input>
                  </el-popover>
                  <el-input v-else slot="reference" @input="checkValidation(row)" autocomplete="off" placeholder="Enter note." v-model="row.notes" size="mini" :maxlength="$store.getters.getMaxLength.length100"></el-input>
                  <!-- <span style="color:red">{{row.NoteValidation}}</span> -->
                </td>
                <td class="align-middle text-center">
                    <!-- <el-dropdown trigger="click" style="cursor: pointer;">
                      <span class="el-dropdown-link">
                        Actions<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="viewAction(row.id)" icon="el-icon-view">View Calculation sheet</el-dropdown-item>
                        <el-dropdown-item @click.native="print(row.id,row.tenderName)" icon="el-icon-printer">Print calculation sheet</el-dropdown-item>
                        <el-dropdown-item v-if="row.type == 1" @click.native="viewVersions(row.id)" icon="el-icon-info">Versions</el-dropdown-item>
                        <el-dropdown-item @click.native="addTenderCalculationSheetCopy(row.id)" icon="el-icon-document-copy">Duplicate calculation sheet</el-dropdown-item>
                        <el-dropdown-item @click.native="deleteTenderCalculationSheetItem(row.id);" style="color:red" icon="el-icon-delete">Delete</el-dropdown-item>
                      </el-dropdown-menu>
                  </el-dropdown> -->

                    <a  v-if="checkActions('View') && row.viewOnly" v-on:click="viewAction(row.id,row.type)" title="View Calculation sheet" class="text-primary pr-1 poiter">
                      <i class="fa fa-eye"></i>
                    </a>

                    <a title="Print calculation sheet" class="text-primary pr-1 poiter" v-on:click="print(row.id, row.tenderName, row.type)">
                      <i class="fa fa-print"></i>
                    </a>

                    <a  v-if="row.type == 1 && row.status == $store.getters.getSheetStatus.Approved && row.hasVersions && checkActions('View')" title="Versions" v-on:click="viewVersions(row.id,row.type)" class="text-primary pr-1 poiter">
                      <i class="fa fa-file-text-o"></i>
                    </a>

                    <a title="Duplicate calculation sheet"  class="text-primary pr-1 poiter" v-on:click="addTenderCalculationSheetCopy(row.id, row.type)">
                      <i class="fa fa-copy"></i>
                    </a>

                    <a v-if="row.status != $store.getters.getSheetStatus.Approved && checkActions('Delete')" :title="$t('Delete')" class="text-danger pr-1" v-on:click="deleteTenderCalculationSheetItem(row.id,row.type)">
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
                <tr v-for="(calcsheet, index) in tenderCalculationSheetList" v-bind:key="index">
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
                      :to="{ name: 'tenderViewTenderCalculationSheet', params: {CalSheetId: calcsheet.id}}"
                    >
                      <i class="fa fa-eye"></i>
                    </router-link>

                    <router-link
                      :title="$t('WorkflowLog')"
                      class="text-defualt"
                      :to="{ name: 'WorkflowLog', params: {tenderCalculationSheetId: calcsheet.id}}"
                    >
                      <i class="fa fa-history"></i>
                    </router-link>

                    <router-link
                      :title="$t('Edit')"
                      v-if="calcsheet.status != 4 && checkActions('Edit')"
                      class="text-primary"
                      :to="{ name: 'tenderNewCalculationSheet', params: {CalSheetId: calcsheet.id}}"
                    >
                      <i class="fa fa-edit"></i>
                    </router-link>
                    <a
                      :title="$t('addversion')"
                      @click="addTenderCalculationSheetVersion(calcsheet.id)"
                      v-if="calcsheet.status == 4 && calcsheet.createdBy == loggeduser"
                      class="text-primary"
                    >
                      <i class="fa fa-file-text-o"></i>
                    </a>
                    <a
                      :title="$t('Delete')"
                      class="text-danger"
                      v-if="calcsheet.status !=4 && checkActions('Delete')"
                      v-on:click="deleteTenderCalculationSheetItem(calcsheet.id);"
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


    <el-dialog
      :title="$t('Versions')"
      :visible="dialogVersion"
      :show-close="false"
      :close-on-press-escape="false"
      :destroy-on-close="false"
      :width="'70%'"
    >
      <b-row v-if="versions.length > 0">
        <div class="tableDiv col-md-12">
          <table class="table table-bordered table-striped table-sm">
            <thead>
              <tr>
                <th scope="col" class="pt-1 pb-1 text-center">{{$t("VersionName")}}</th>
                <th scope="col" class="pt-1 pb-1 text-center">{{$t("VersionNumber")}}</th>
                <th scope="col" class="pt-1 pb-1 text-center">{{$t("Actions")}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(version, index) in versions" v-bind:key="index">
                <td class="align-middle text-center">
                  <span v-if="index == 0">Original</span>
                  <span v-if="index > 0">Version {{index}}</span>
                </td>
                <td class="align-middle text-center">{{version.tenderNumber}}</td>
                <td class="align-middle text-center">
                  <router-link
                    target="_blank"
                    title="Action"
                    class="text-primary"
                    :to="{ name: 'viewCalculationSheet', params: {CalSheetId: version.id}}"
                  >
                    <i class="fa fa-eye"></i>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-row>
      <br />
      <div class="form-row" v-if="versions.length == 0">
        <h4>No data to show</h4>
      </div>
      <span slot="footer" class="dialog-footer">
        <button type="button" class="btn btn-secondary ml-1" @click="cancelItem()">
          <i class="fa fa-ban"></i>
          {{$t("Cancel")}}
        </button>
      </span>
    </el-dialog>
    
  </b-card>


  
</template>
<style scoped>
.poiter{
  cursor: pointer;
}
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
.has-validation{
  background-color: #f2e1e1 !important; 
}
.has-no-validation{
  background-color: #e2f2e1 !important; 
}

</style>
<script type="text/javascript">
var moment = require("moment");
import { checkRoles } from "../../shared/utils";
import axios from "axios";

export default {
  data() {
    return {
      typeArray:[{id:0,name:"All Types"},{id:1,name:"Medical equipment"},{id:2,name:"Tender"}],
      showSave:false,
      selectedCounts:0,
      versions:[],
      dialogVersion:false,
      fullscreenLoading: false,
      loggeduser: 0,
      show: true,
      ItemsGroup: [],
      AllStatus:[],
      tenderCalculationSheetList: [],
      searchSubject: "",
      searchStatus: "",
      tenderCurrencyCode: "",
      sheetNumber: "",
      searchCustomerName: "",
      searchreleaseDate: "",
      searchSubmissionDate: "",
      isVat: "",
      isFunded: "",
      sortBy: "",
      orderAsc: "false",
      quotationReference: "",
      tenderType: "",
      sheetType:"",
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
      loadingQuotation: false
    };
  },
  filters: {
      toUSD(value) {
        if(value){
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }else{
          return "0.0"
        }
      },
  },
  methods: {
    remoteMethodQuotationReference: function(query) {
      if (query !== "") {
        this.loadingQuotation = true;
        var urlStr =
          this.$store.getters.serverURI +
          "api/GeneralCalculationSheet/GetCalculationSheetsTinyInfo?PageIndex=" +
          1 +
          "&PageSize=" +
          this.$store.getters.getReturnPage +
          "&code=" +
          query;
        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function(data) {
              this.QotationReferenceList = data.body;
              this.loadingQuotation = false;
            },
            function(error) {
              this.loadingQuotation = false;
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
    goToSheet(id,type){
         if(type == 2)
            this.$router.push({name: "tenderCalculationSheets/view",params: { CalSheetId: id }});
        if(type == 1)
            this.$router.push({name: "calculationSheets/view",params: { CalSheetId: data.body }});
    },
    checkActions(roleName) {
      return checkRoles("Tracking", roleName);
    },
    checkValidation(row){
      if((row.notes != "" && row.notes != null) || (row.trackingStatus != ""  && row.trackingStatus != null)){
        row.Validation = false
      }else{
        row.Validation = true
        this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("StatusIsRequired")
          });
       }
    },
    submitSheets() {
      this.fullscreenLoading=true
      var urlStr = this.$store.getters.serverURI + "api/GeneralCalculationSheet/UpdateTrackingSheet";
      this.$http.put(urlStr, this.tenderCalculationSheetList, {headers: this.$store.getters.tokenAuthonticationHeaderObj}).then(response => {
                  this.fullscreenLoading = false;
                  this.selectedCounts = 0
                  this.showSave = false;
                  this.geTtenderCalculationSheetList();
                  this.$message({
                      showClose: true,
                      duration: this.$store.getters.getMessagesDuration,
                      type: "success",
                      message: this.$t("UpdatedSuccessfully")
                  });
              },
              function(error) {
                  this.fullscreenLoading = false;
                  this.$message({
                      showClose: true,
                      duration: this.$store.getters.getMessagesDuration,
                      type: "error",
                      message: this.$t("ErrorMessage")
              });
         });
     },
    updateSheets(){
      var selectedArr = this.tenderCalculationSheetList.filter(x=>x.selected == true);
      this.selectedCounts = 0
      this.selectedCounts = selectedArr.length
      // this.showSave = false;
      var arr = []
      selectedArr.forEach(element => {
        if(element.selected == true){
          if(((element.trackingStatus == 0 || element.trackingStatus == null) && (element.notes == "" || element.notes == null) )){
            element.Validation = true
          }else{
            element.Validation = false
            arr.push(element)
          }
        }
      });
      if(arr.length == this.selectedCounts) this.submitSheets()
      else return
    },
    getSelectedItems(){
       this.showSave =  this.tenderCalculationSheetList.filter(x=>x.selected == true).length > 0 ? true: false
       this.selectedCounts =  this.tenderCalculationSheetList.filter(x=>x.selected == true).length
    },
    selectedRow(row,index){
      row.selected = !row.selected;
      if(row.selected == true){
        if((row.trackingStatus == 0 || row.trackingStatus == null) && (row.notes == "" || row.notes == null)){
            row.Validation = true
             this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "error",
                message: this.$t("StatusIsRequired")
            });
          }else{
            row.Validation = false
          }
      } else{
         row.Validation = false
      } 
        this.getSelectedItems();
    },
    cancelItem() {
      this.dialogVersion = true;
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("CloseConfirmationMessage"))
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Yes"),
        cancelButtonText: this.$t("No"),
        beforeClose: (action, instance, done) => {
          if (action == "confirm") {
            this.dialogVersion = false;
            done();
          } else {
            this.dialogVersion = true;
            done();
          }
        }
      });
    },
    print(id,tenderNumber,type) {
      this.fullscreenLoading = true;
      let urlStr =
        this.$store.getters.serverURI + `api/GeneralCalculationSheet/${id}/${type}/Export`;
      axios({
        method: "post",
        url: urlStr,
        headers: this.$store.getters.tokenAuthonticationHeaderObj,
        responseType: "blob"
      }).then(response => {
        this.fullscreenLoading = false;
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        var fileName = "Calculation_Sheet_" + tenderNumber;
        fileLink.href = fileURL;
        fileLink.setAttribute("download", fileName + ".xlsx");
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
    FillAllStatus: function() {
        var urlStr =
            this.$store.getters.serverURI +
            "api/lookup/GetByType/16"
        this.$http
            .get(urlStr, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
            })
            .then(
                function(data) {
                    this.AllStatus = data.body;
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
    sort(sortProps) {
      switch (sortProps.prop) {
        case "formattedStatus":
          this.sortBy = "1";
        case "tenderCurrencyCode":
          this.sortBy = "2";
        case "mssCustomerName":
          this.sortBy = "3";
        case "submissionDate":
          this.sortBy = "4";
        default:
          break;
      }
      this.orderAsc = sortProps.order == "ascending" ? "true" : "false";
      this.geTtenderCalculationSheetList();
    },
    Excel() {
      var submissionDate = "";
      var releaseDate = "";
      var principalCode = "";
      var categoryCode = "";
      var modelCode = "";
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

      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/GeneralCalculationSheet/ExportToExcelBoth?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&RowsCount=" +
        "&status=" +
        status +
        "&tenderName=" +subject.trim() +
        "&customerName="+this.searchCustomerName.trim() +
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
        this.tenderType+
        "&tenderGenType="+this.sheetType;

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
        fileLink.setAttribute("download", "Tracking sheets.xlsx");
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
    resetSearchForm() {
      this.selectedCounts = 0;
      this.showSave = false;
      this.sheetType="";
      this.searchStatus = "";
      this.searchSubject = "";
      this.searchSubject = "";
      this.searchStatus = "";
      this.tenderCurrencyCode = "";
      this.sheetNumber = "";
      this.searchCustomerName = "";
      this.searchreleaseDate = "";
      this.searchSubmissionDate = "";
      this.isVat = "";
      this.isFunded = "";
      this.sortBy = "";
      this.orderAsc = "";
      this.quotationReference = "";
      this.tenderType = "";
      this.page = {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: this.$store.getters.getLargePagging
      };
      this.searchAction();
    },
    changeDateFormat(date) {
      return moment(date).format("MM/DD/YYYY");
    },
    pageChanged: function(pageNum) {
      this.page.currentPage = pageNum;
      this.geTtenderCalculationSheetList();
    },
    geTtenderCalculationSheetList() {
      var submissionDate = "";
      var releaseDate = "";
      var principalCode = "";
      var categoryCode = "";
      var modelCode = "";
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

      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/GeneralCalculationSheet/GetBoth?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&RowsCount=" +
        "&status=" +
        status +
        "&tenderName=" +
        subject.trim() +
        "&customerName=" +
        this.searchCustomerName.trim() +
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
        this.tenderType+
        "&tenderGenType="+this.sheetType;

      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.fullscreenLoading = false;
            this.tenderCalculationSheetList = data.body.list;
            this.page.totalItems = data.body.pagingInfo.rowsCount;
            this.tenderCalculationSheetList.forEach(element => {
              element.selected = false
              element.Validation = false
            });
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
        this.$store.getters.serverURI + "api/TenderCalculationSheet/GetAllStatus";
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
    addTenderCalculationSheetCopy(CalcuationSheetID,type) {
      this.fullscreenLoading = true
      var urlStr =
        this.$store.getters.serverURI + `api/GeneralCalculationSheet/AddCopy/${CalcuationSheetID}/${type}`;
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
              if(type == 2)
                this.$router.push({
                  name: "tenderNewCalculationSheet",
                  params: { CalSheetId: data.body }
                });
               if(type == 1)
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
    addTenderCalculationSheetVersion: function(CalcuationSheetID) {
      this.fullscreenLoading = true
      var urlStr =
        this.$store.getters.serverURI +
        "api/TenderCalculationSheet/AddVersion/" +
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
                name: "tenderNewCalculationSheet",
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
      this.selectedCounts = 0;
      this.showSave = false;
      this.geTtenderCalculationSheetList();
    },
    deleteTenderCalculationSheetItem(tenderCalculationSheetId,type) {
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
              `api/GeneralCalculationSheet/Delete/${tenderCalculationSheetId}/${type}`;
            this.$http
              .delete(urlStr, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(function(data) {
                done();
                this.geTtenderCalculationSheetList();
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
    // FillQuotationReference: function() {
    //   var urlStr =
    //     this.$store.getters.serverURI +
    //     "api/GeneralCalculationSheet/GetCalculationSheetsTinyInfo";
    //   this.$http
    //     .get(urlStr, {
    //       headers: this.$store.getters.tokenAuthonticationHeaderObj
    //     })
    //     .then(
    //       function(data) {
    //         
    //         this.QotationReferenceList = data.body;
    //       },
    //       function(error) {
    //         this.$message({
    //           showClose: true,
    //           duration: this.$store.getters.getMessagesDuration,
    //           type: "error",
    //           message: this.$t("ErrorMessage")
    //         });
    //       }
    //     );
    // },
    viewAction(CalSheetId,type){
      if(type == 2){
        this.$router.push({
          name: "tenderViewCalculationSheet",
          params: { CalSheetId: CalSheetId }
        });
      }else{
         this.$router.push({
          name: "viewCalculationSheet",
          params: { CalSheetId: CalSheetId }
        });
      }
     
    },
    viewVersions(CalSheetId,type){
      this.fullscreenLoading = true;
      var urlStr = this.$store.getters.serverURI + `api/GeneralCalculationSheet/GetBasicInfoDetail/${CalSheetId}/${type}` ;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.fullscreenLoading = false;           
            this.versions = data.body.previousVersionsOfCalculationSheets;
            this.dialogVersion = true;
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
    this.loggeduser = this.$store.getters.getUserData.id;
    this.FillAllStatus()
    this.geTtenderCalculationSheetList();
    this.FillAllCurrencies();
    this.FillStatus();
    //this.FillQuotationReference();
    this.FillTenderType();
  }
};
</script>
<style scoped>
  .header_align{
    margin: auto;
    vertical-align: inherit;
  }
</style>