<template>
  <div class="animated fadeIn">
    <div class="text-right mb-2">
      <button class="btn csubmit ml-3" variant="primary" @click="Excel()">
        <i class="fa fa-file-excel-o"></i>
        Export Excel
      </button>
    </div>

    <transition name="fade">
      <b-card
        class="card card-accent-primary"
        no-body
        v-if="show"
        v-loading.fullscreen.lock="fullscreenLoading"
      >
        <div slot="header">
          Calendar
          <div class="card-header-actions">
            <b-link class="card-header-action btn-minimize" v-b-toggle.collapse1>
              <span class="when-opened">
                <i class="icon-arrow-up"></i>
              </span>

              <span class="when-closed">
                <i class="icon-arrow-down"></i>
              </span>
            </b-link>

            <!--<b-link href="#" class="card-header-action btn-close" v-on:click="show = !show">-->

            <!--<i class="icon-close"></i>-->

            <!--</b-link>-->
          </div>
        </div>

        <b-collapse id="collapse1" visible>
          <b-card-body>
            <full-calendar
              :events="events"
              :config="config"
              id="calendar"
              @event-selected="eventSelected"
              @event-mouseover="eventMouseover"
              @event-mouseout="eventMouseout"
              @event-drop="eventDrop"
              @event-resize="eventResize"
              @event-created="eventCreated"
              @event-receive="eventReceive"
              @event-render="eventRender"
              @view-render="viewRender"
              @day-click="dayClick"
              :selectable="true"
              :selectHelper="true"
              :editable="false"
            ></full-calendar>
          </b-card-body>
        </b-collapse>
      </b-card>
    </transition>

    <el-dialog
      :title="$t('EventCreation')"
      :visible="showCreateEventDialog"
      :show-close="false"
      :close-on-press-escape="false"
      :destroy-on-close="false"
    >
      <div class="row">
        <div class="col-sm-12">
          <div class="form-group">
            <label class="col-form-label">{{$t("quotationDescription")}}</label>
            <textarea
              name="Description"
              class="form-control"
              :maxlength="$store.getters.getMaxLength.length300"
              v-model="APICalenderEventObject.quotationDescription"
            />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div
            class="form-group"
            :class="{'has-error':errors.has('EventCreationValidation.TenderName')}"
          >
            <label class="col-form-label">{{$t("TenderName")}}</label>
            <label class="required">*</label>

            <input
              type="text"
              name="TenderName"
              class="form-control"
              v-model="APICalenderEventObject.tenderName"
              v-validate="'required'"
              data-vv-scope="EventCreationValidation"
              :data-vv-as="$t('TenderName')"
              autocomplete="off"
            />

            <div
              class="help-block"
              v-if="errors.has('EventCreationValidation.TenderName')"
            >{{ errors.first('EventCreationValidation.TenderName') }}</div>
          </div>
        </div>

        <div class="col-md-6">
          <div
            class="form-group"
            :class="{'has-error':errors.has('EventCreationValidation.TenderLocation')}"
          >
            <label class="col-form-label">{{$t("TenderLocation")}}</label>
            <label class="required">*</label>

            <br />

            <el-select
              v-model="APICalenderEventObject.tenderLocation"
              v-validate="'required'"
              :data-vv-as="$t('TenderLocation')"
              data-vv-scope="EventCreationValidation"
              name="TenderLocation"
              :placeholder="$t('Select')"
              clearable
              filterable
            >
              <el-option
                v-for="option in tenderLocations"
                v-bind:value="option.id"
                :label="option.name"
                v-bind:key="option.id"
              ></el-option>
            </el-select>

            <div class="help-block" v-if="errors.has('EventCreationValidation.TenderLocation')">
              <label class="mt-1">{{ errors.first('EventCreationValidation.TenderLocation') }}</label>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <b-form inline>
            <b-form-checkbox v-model="isNonMSSCustomerName">{{$t("NonMSSCustomerName")}}</b-form-checkbox>
          </b-form>

          <div
            class="form-group"
            :class="{'has-error':errors.has('EventCreationValidation.MSSCustomerName')}"
            v-if="!isNonMSSCustomerName"
          >
            <label class="col-form-label">{{$t("MSSCustomerName")}}</label>
            <label class="required">*</label>

            <br />

            <el-select
              remote
              reserve-keyword
              :remote-method="remoteMethodMSSCustomerFunction"
              :loading="loadingAccount"
              v-model="APICalenderEventObject.mssCustomerCode"
              name="MSSCustomerName"
              :placeholder="$t('Select')"
              clearable
              filterable
              class="full-width"
              v-validate="'required'"
              data-vv-scope="EventCreationValidation"
              :data-vv-as="$t('MSSCustomerName')"
              :value="APICalenderEventObject.mssCustomerCode"
            >
              <el-option
                v-for="option in mssCustomers"
                v-bind:value="option.code"
                :label="option.name"
                v-bind:key="option.code"
              ></el-option>
            </el-select>

            <div class="help-block" v-if="errors.has('EventCreationValidation.MSSCustomerName')">
              <label
                class="mt-1"
              >{{ $t('requiredField')}} {{ errors.first('EventCreationValidation.MSSCustomerName') }}</label>
            </div>
          </div>

          <div
            class="form-group"
            :class="{'has-error':errors.has('EventCreationValidation.NonMSSCustomerName')}"
            v-if="isNonMSSCustomerName"
          >
            <label class="col-form-label">{{$t("MSSCustomerName")}}</label>
            <label class="required" v-if="isNonMSSCustomerName">*</label>

            <input
              type="text"
              name="NonMSSCustomerName"
              class="form-control"
              v-model="APICalenderEventObject.nonMssCustomerName"
              data-vv-scope="EventCreationValidation"
              :data-vv-as="$t('MSSCustomerName')"
              v-validate="'required'"
              autocomplete="off"
            />

            <div
              class="help-block"
              v-if="errors.has('EventCreationValidation.NonMSSCustomerName')"
            >{{ $t('requiredField')}} {{errors.first('EventCreationValidation.NonMSSCustomerName') }}</div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div
            class="form-group"
            :class="{'has-error':errors.has('EventCreationValidation.releaseDate')}"
          >
            <label class="col-form-label">{{$t("ReleaseDate")}}</label>

            <label class="required">*</label>

            <el-date-picker
              v-model="APICalenderEventObject.releaseDate"
              name="releaseDate"
              :data-vv-as="$t('ReleaseDate')"
              data-vv-scope="EventCreationValidation"
              v-validate="'required'"
              type="date"
              :picker-options="dateLessThanToday"
              v-bind:format="this.$store.getters.getDateFormat"
            ></el-date-picker>

            <div class="help-block" v-if="errors.has('EventCreationValidation.releaseDate')">
              <label class="mt-1">{{ errors.first('EventCreationValidation.releaseDate') }}</label>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div
            class="form-group"
            :class="{'has-error':errors.has('EventCreationValidation.submissionDate')}"
          >
            <label class="col-form-label">{{$t("SubmissionDate")}}</label>

            <label class="required">*</label>

            <el-date-picker
              v-model="APICalenderEventObject.submissionDate"
              name="submissionDate"
              :data-vv-as="$t('SubmissionDate')"
              v-validate="'required'"
              type="datetime"
              data-vv-scope="EventCreationValidation"
              :picker-options="dateGreaterThanToday"
              v-bind:format="this.$store.getters.getDateTimeFormat"
              v-bind:default-time="this.$store.getters.getDefaultTime"
            ></el-date-picker>

            <div class="help-block" v-if="errors.has('EventCreationValidation.submissionDate')">
              <label class="mt-1">{{ errors.first('EventCreationValidation.submissionDate') }}</label>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div
            class="form-group"
            :class="{'has-error':errors.has('EventCreationValidation.TenderType')}"
          >
            <label class="col-form-label">{{$t("TenderType")}}</label>

            <label class="required">*</label>

            <br />

            <el-select
              v-model="APICalenderEventObject.typeOfEvent"
              v-validate="'required'"
              :data-vv-as="$t('TenderType')"
              name="TenderType"
              data-vv-scope="EventCreationValidation"
              :placeholder="$t('Select')"
              clearable
              filterable
            >
              <el-option
                v-for="option in tenderTypes"
                v-bind:value="option.id"
                :label="option.name"
                v-bind:key="option.id"
              ></el-option>
            </el-select>

            <div class="help-block" v-if="errors.has('EventCreationValidation.TenderType')">
              <label class="mt-1">{{ errors.first('EventCreationValidation.TenderType') }}</label>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div
            class="form-group"
            :class="{'has-error':errors.has('EventCreationValidation.SubmissionAddress')}"
          >
            <label class="col-form-label">{{$t("SubmissionAddress")}}</label>

            <label class="required">*</label>

            <input
              type="text"
              name="SubmissionAddress"
              class="form-control"
              v-model="APICalenderEventObject.submissionAddress"
              v-validate="'required'"
              data-vv-scope="EventCreationValidation"
              :data-vv-as="$t('SubmissionAddress')"
              autocomplete="off"
            />

            <div
              class="help-block"
              v-if="errors.has('EventCreationValidation.SubmissionAddress')"
            >{{ errors.first('EventCreationValidation.SubmissionAddress') }}</div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div
            class="form-group"
            :class="{'has-error':errors.has('EventCreationValidation.assignToUsers')}"
          >
            <label class="col-form-label">{{$t("assignToUsers")}}</label>
            <label class="required">*</label>

            <el-select
              v-model="APICalenderEventObject.calenderEventUser"
              multiple
              name="assignToUsers"
              value-key="userId"
              placeholder="Select"
              :data-vv-as="$t('assignToUsers')"
              collapse-tags
              @change="calenderEventUserChanged()"
            >
              <el-option
                v-for="item in userslist"
                :key="item.id"
                :label="item.userName"
                :value="item"
              ></el-option>
            </el-select>

            <div class="help-block" v-if="errors.has('EventCreationValidation.assignToUsers')">
              <label class="mt-1">{{ errors.first('EventCreationValidation.assignToUsers') }}</label>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div
            class="form-group"
            :class="{'has-error':errors.has('EventCreationValidation.assignToRoles')}"
          >
            <label class="col-form-label">{{$t("assignToRoles")}}</label>
            <label class="required">*</label>

            <el-select
              v-model="APICalenderEventObject.calenderEventRole"
              value-key="roleId"
              name="assignToRoles"
              multiple
              placeholder="Select"
              :data-vv-as="$t('assignToRoles')"
              collapse-tags
              disabled
            >
              <el-option v-for="item in roleslist" :key="item.id" :label="item.name" :value="item"></el-option>
            </el-select>

            <div class="help-block" v-if="errors.has('EventCreationValidation.assignToRoles')">
              <label class="mt-1">{{ errors.first('EventCreationValidation.assignToRoles') }}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div
            class="form-group"
            :class="{'has-error':errors.has('EventCreationValidation.departmentId')|| workflowTypeValidation != ''}"
          >
            <label class="col-form-label">{{$t("WorkflowType")}}</label>
            <label class="required" v-if="workflowTypeValidation != ''">*</label>

            <br />

            <el-select
              v-model="APICalenderEventObject.departmentId"
              v-validate="''"
              :data-vv-as="$t('WorkflowType')"
              data-vv-scope="EventCreationValidation"
              name="departmentId"
              :placeholder="$t('Select')"
              clearable
              filterable
              @change="workflowTypeValidation=''"
              :disabled="Boolean(loggedUserType)"
            >
              <el-option
                v-for="option in workflowTypes"
                v-bind:value="option.code"
                :label="option.name"
                v-bind:key="option.code"
              ></el-option>
            </el-select>

            <div class="help-block" v-if="errors.has('EventCreationValidation.departmentId')|| workflowTypeValidation != ''">
              <label class="mt-1">{{ errors.first('EventCreationValidation.departmentId') }}</label>
              <label class="mt-1">{{ workflowTypeValidation }}</label>
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <button
          class="btn btn-secondary"
          v-if="(hasCalculationSheet == false || hasCalculationSheet == null) && checkActions('CalenderCreateSheet')"
          v-on:click="saveTenderAndCalculationSheet()"
        >
          <i class="fa fa-plus"></i>
          {{$t('createCalculationSheet')}}
        </button>

        <router-link
          class="btn btn-secondary"
          v-if="APICalenderEventObject.departmentId && APICalenderEventObject.departmentId==$store.getters.getDepartmentCode.medical && APICalenderEventObject.calculationSheetId && hasCalculationSheet == true && checkCalculationSheetActions('View')"
          :to="{ name: 'viewCalculationSheet', params: {CalSheetId: APICalenderEventObject.calculationSheetId}}"
        >
          <i class="fa fa-eye"></i>
          {{$t('viewCalculationSheet')}}
        </router-link>
        <router-link
          class="btn btn-secondary"
          v-if="APICalenderEventObject.departmentId && APICalenderEventObject.departmentId==$store.getters.getDepartmentCode.tender && APICalenderEventObject.calculationSheetId && hasCalculationSheet == true && checkTenderCalculationSheetActions('View')"
          :to="{ name: 'tenderViewCalculationSheet', params: {CalSheetId: APICalenderEventObject.calculationSheetId}}"
        >
          <i class="fa fa-eye"></i>
          {{$t('viewCalculationSheet')}}
        </router-link>
        <router-link
          class="btn btn-secondary"
          v-if="APICalenderEventObject.departmentId && APICalenderEventObject.departmentId==$store.getters.getDepartmentCode.lab && APICalenderEventObject.calculationSheetId && hasCalculationSheet == true && checkLabCalculationSheetActions('View')"
          :to="{ name: 'LabViewCalculationSheet', params: {CalSheetId: APICalenderEventObject.calculationSheetId}}"
        >
          <i class="fa fa-eye"></i>
          {{$t('viewCalculationSheet')}}
        </router-link>

        <button
          v-if="checkActions('Insert')"
          class="btn btn-primary active"
          v-on:click="saveEvent(false)"
        >
          <i class="fa fa-save"></i>
          {{$t("Save")}}
        </button>

        <button
          v-if="APICalenderEventObject.id !='' && checkActions('Delete')"
          class="btn btn-danger btn btn-danger"
          v-on:click="deleteEvent(APICalenderEventObject.id)"
        >
          <i class="fa fa-ban"></i>
          {{$t("Delete")}}
        </button>
           <button
              type="button"
              class="btn btn-secondary ml-1"
              @click="cancelItem()">
              <i class="fa fa-ban"></i>
              {{$t("Cancel")}}
            </button>
      </span>
      <div></div>
    </el-dialog>
  </div>
</template>

<script type='text/javascript'>
import { FullCalendar } from "vue-full-calendar";
import moment from "moment";
import business_moment from "moment-business-days";

import { router } from "../../router";
import { checkRoles } from "../../shared/utils";
import axios from "axios";

export default {
  name: "Calendar",

  components: {
    FullCalendar
  },

  data() {
    return {
      loggedUserType:null,
      loadingAccount: false,
      fullscreenLoading: false,
      hasCalculationSheet: false,
      showConfirm: true,
      userslist: [],
      roleslist: [],
      dateGreaterThanToday: {
        disabledDate(date) {
          return moment() >= date;
        }
      },
      dateLessThanToday: {
        disabledDate(date) {
          return moment() < date;
        }
      },
      shareData: {},
      isNonMSSCustomerName: false,
      customer: "",
      mssCustomer: "",
      eventObj: {
        id: "",
        title: "",
        start: "",
        end: "",
        allDay: false
      },
      show: true,
      showCreateEventDialog: false,
      APICalenderEventList: [],
      APICalenderEventObject: {
        id: "",
        typeOfEvent: "",
        quotationDescription: "",
        tenderName: "",
        mssCustomerCode: "",
        customerName: "",
        tenderLocation: "",
        tenderType: "",
        releaseDate: "",
        fromDate: "",
        toDate: "",
        description: "",
        submissionDate: "",
        nonMssCustomerName: "",
        submissionAddress: "",
        calenderEventUser: [],
        calenderEventRole: [],
        hasCalculationSheet: false,
        calculationSheetId: "",
        departmentId:null
      },
      addedYears: [],
      today: moment(),
      tomorrow: moment().add(1, "day"),
      yesterday: moment().subtract(1, "day"),
      typeOfEvents: [],
      tenderLocations: [],
      workflowTypes:[],
      tenderTypes: [],
      events: [
        // {
        //     id:22,
        //     title  : 'x11111111',
        //     start  : '2019-01-02T08:00:00+02:00',
        //     end    : '2019-01-02T10:30:00+02:00',
        // },
      ],
      mssCustomers: [],
      config: {
        expandRows: true,
        height: '100%',
        defaultView: "month",
        displayEventTime: true,
        timezone: "local" // it works for day time, but for days selecting it is not working.
        // ignoreTimezone :false
      },
      workflowTypeValidation:''
    };
  },
  methods: {
    calenderEventUserChanged() {
      this.APICalenderEventObject.calenderEventRole = [];
      if (this.APICalenderEventObject.calenderEventUser.length) {
        this.APICalenderEventObject.calenderEventUser.forEach((eventUser) => {
          if (eventUser.userRole.length) {
            eventUser.userRole.forEach((userRole) => {
              let obj = this.APICalenderEventObject.calenderEventRole.find((x) => x.roleId==userRole);
              if (!obj) this.APICalenderEventObject.calenderEventRole.push({roleId: userRole})
            })
          }
        });

      }
    },
    cancelItem() {
        this.workflowTypeValidation=''
        this.showCreateEventDialog = true;
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
              this.showCreateEventDialog = false;
              done();
            } else {
              this.showCreateEventDialog = true;
              done();
            }
          }
        });
    },
    remoteMethodMSSCustomerFunction: function(query) {
      if (query !== "") {
        this.loadingAccount = true;
        var urlStr =
          this.$store.getters.serverURI +
          "api/item/GetAllMssCustomer?PageIndex=1&PageSize=" +
          this.$store.getters.getReturnPage +
          "&name=" +
          query +
          "&code=&department="+this.loggedUserType;
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
    Excel() {
      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/CalendarEvents/ExportToExcel?startDate=&endDate=&roleId=";

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
        fileLink.setAttribute("download", "Calendar.xlsx");
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
    checkCalculationSheetActions(roleName) {
      return checkRoles("Calculation Sheet", roleName);
    },
    checkTenderCalculationSheetActions(roleName) {
      return checkRoles("Tender Calculation Sheet", roleName);
    },
    checkLabCalculationSheetActions(roleName) {
      return checkRoles("Lab Calculation Sheet", roleName);
    },
    checkActions(roleName) {
      return checkRoles("Calendar Event", roleName);
    },
    forceRerender() {
      this.$router.go(0);
    },
    saveTenderAndCalculationSheet: function() {
       this.$validator.validateAll("EventCreationValidation").then(result => {
         if(result){
              if (!this.APICalenderEventObject.departmentId) {
                this.workflowTypeValidation=this.$t("WorkflowTypeRequired")
                return;
              }
              this.fullscreenLoading = true;
              var urlStr =
                this.$store.getters.serverURI +
                "api/CalculationSheet/WorkflowValidationForCreatingSheet";
              this.$http
                .get(urlStr, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
                })
                .then(
                  response => {
                    if (response.body.message) {
                      this.fullscreenLoading = false;

                      this.$message({
                        showClose: true,
                        duration: this.$store.getters.getMessagesDuration,
                        type: "error",
                        message: response.body.message
                      });
                    } else {
                      this.$validator
                        .validateAll("EventCreationValidation")
                        .then(() => {
                          this.saveEvent(true);
                        });
                    }
                  },
                  function(error) {
                    this.fullscreenLoading = false;
                    this.$message({
                      showClose: true,
                      duration: this.$store.getters.getMessagesDuration,
                      type: "error",
                      message: error.body.message
                    });
                  }
                )
                .catch(error => {
                  this.fullscreenLoading = false;
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "error",
                    message: error.body.message
                  });
                });
         }
       });
   },
    eventSelected: function(event) {
      this.resetAPICalenderEventObject();
      this.getEventDetailsFromService(event.id);
    },
    getEventDetailsFromService: function(eventId) {
      this.fullscreenLoading = true;
      this.loading = true;
      var urlStr =
        this.$store.getters.serverURI + "api/CalenderEvent/" + eventId;

      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.fullscreenLoading = false;
            if (data.body) {
              if (data.body.mssCustomerCode && data.body.customerName) {
                this.customer = {
                  code: data.body.mssCustomerCode,
                  name: data.body.customerName
                };
              }
              this.APICalenderEventObject = data.body;

              let obj = {
                code: data.body.mssCustomerCode,
                name: data.body.mssCustomerName
              };
              this.mssCustomers= [obj];

              this.hasCalculationSheet = data.body.hasCalculationSheet;
              data.body.fromDate
                ? (this.APICalenderEventObject.fromDate = moment(
                    data.body.fromDate
                  ).toDate())
                : "";
              data.body.toDate
                ? (this.APICalenderEventObject.toDate = moment(
                    data.body.toDate
                  ).toDate())
                : "";
              this.showCreateEventDialog = true;
            } else {
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "error",
                message: "Warning while fetching data "
              });
            }
          },
          function(error) {
            this.fullscreenLoading = false;
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: error.body.message
            });
          }
        );
    },
    eventMouseover: function() {},
    eventMouseout: function() {},
    eventDrop: function() {},
    eventResize: function() {},
    eventCreated: function(event) {
      this.resetAPICalenderEventObject();
      this.APICalenderEventObject.fromDate = event.start.local().toDate(); //convert moment local to date object.
      this.APICalenderEventObject.toDate = event.end.local().toDate(); //convert moment local to date object.
      var workflowTypeObj= this.workflowTypes.filter(x=>x.id==this.loggedUserType)[0]
      this.APICalenderEventObject.departmentId= workflowTypeObj? workflowTypeObj.code:null
      this.showCreateEventDialog = true;
    },
    eventReceive: function() {},
    eventRender: function() {},
    viewRender: function(view) {
      this.addedYears = [];
      this.events = [];
      this.APICalenderEventList = [];
      var yearStartOld = this.addedYears.filter(
        year => year == view.start.year()
      );
      if (yearStartOld.length == 0) {
        this.fullscreenLoading = true;

        /*var urlStr =
          this.$store.getters.serverURI +
          "api/CalenderEvent?startDate=" +
          view.end
            .startOf("year")
            .format(this.$store.getters.getWebAPIDateTimeFormat) +
          "&endDate=" +
          view.end
            .endOf("year")
            .format(this.$store.getters.getWebAPIDateTimeFormat);*/

          //-----changed by ahmed zaalan on 14-12-2021---please re-check---------------------------------------------
          var urlStr =
          this.$store.getters.serverURI +
          "api/CalenderEvent?startDate=" +
          view.start
            .format(this.$store.getters.getWebAPIDateTimeFormat) +
          "&endDate=" +
          moment(view.end).add(-1, 'seconds')
            .format(this.$store.getters.getWebAPIDateTimeFormat);
          //-----------------------------------------------------

        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function(data) {
              this.fullscreenLoading = false;
              if (this.APICalenderEventList.length == 0) {
                this.APICalenderEventList = data.body//.list;
              } else {
                this.APICalenderEventList = this.APICalenderEventList.concat(
                  data.body//.list
                );
              }
              this.convertToEvents(data.body);
              this.addedYears.push(view.start.year());
            },
            function(error) {
              this.fullscreenLoading = false;
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "error",
                message: error.body.message
              });
            }
          );
      }
    },
    convertToEvents: function(APICalenderEventArray) {
      for (var i = 0; i < APICalenderEventArray.length; i++) {
        var eventOld = this.events.filter(
          event => event.id == APICalenderEventArray[i].id
        )[0];
        var name;
        if (eventOld) {
          // if (APICalenderEventArray[i].calculationSheet) {
          //   name = APICalenderEventArray[i].calculationSheet.tenderNumber;
          // } else {
            // name = APICalenderEventArray[i].mssCustomerName ? APICalenderEventArray[i].mssCustomerName : APICalenderEventArray[i].nonMssCustomerName;
          // }
          name = "";
          if (APICalenderEventArray[i].calculationSheet) 
            name += APICalenderEventArray[i].calculationSheet.tenderNumber + " - ";
          if (APICalenderEventArray[i].mssCustomerName) {
            let customer = APICalenderEventArray[i].mssCustomerName;
            name += customer.slice(customer.indexOf(" ")+1);
          }
          else name += APICalenderEventArray[i].nonMssCustomerName;
          eventOld.title = name;
          eventOld.start = moment(APICalenderEventArray[i].submissionDate);
          eventOld.end = moment(APICalenderEventArray[i].submissionDate);
          eventOld.color = this.getEventColor(
            APICalenderEventArray[i].submissionDate,
            APICalenderEventArray[i].calculationSheet
          );
          //"#DDEBF7";
          if (
            APICalenderEventArray[i].typeOfEvent ==
            this.$store.getters.getTypeOfEventLookup.Tender
          ) {
            eventOld.start = moment(APICalenderEventArray[i].submissionDate);
            eventOld.end = moment(APICalenderEventArray[i].submissionDate);
            eventOld.color = this.getEventColor(
              APICalenderEventArray[i].submissionDate,
              APICalenderEventArray[i].calculationSheet
            );
          }
        } else {
          // if (APICalenderEventArray[i].calculationSheet) {
          //   name = APICalenderEventArray[i].calculationSheet.tenderNumber;
          // } else {
            // name = APICalenderEventArray[i].mssCustomerName ? APICalenderEventArray[i].mssCustomerName : APICalenderEventArray[i].nonMssCustomerName;
          // }
          name = "";
          if (APICalenderEventArray[i].calculationSheet) 
            name += APICalenderEventArray[i].calculationSheet.tenderNumber + " - ";
          if (APICalenderEventArray[i].mssCustomerName) {
            let customer = APICalenderEventArray[i].mssCustomerName;
            name += customer.slice(customer.indexOf(" ")+1);
          }
          else name += APICalenderEventArray[i].nonMssCustomerName;
          var eventNew = {
            id: APICalenderEventArray[i].id,
            title: name,
            start: moment(APICalenderEventArray[i].submissionDate),
            end: moment(APICalenderEventArray[i].submissionDate),
            color: this.getEventColor(APICalenderEventArray[i].submissionDate, 
            APICalenderEventArray[i].calculationSheet)
            // "#DDEBF7"
          };
          if (
            APICalenderEventArray[i].typeOfEvent ==
            this.$store.getters.getTypeOfEventLookup.Tender
          ) {
            eventNew.start = moment(APICalenderEventArray[i].submissionDate);
            eventNew.end = moment(APICalenderEventArray[i].submissionDate);
            eventNew.color = this.getEventColor(
              APICalenderEventArray[i].submissionDate,
              APICalenderEventArray[i].calculationSheet
            );
          }

          this.events.push(eventNew);
        }
      }
    },
    RemoveEvent: function(eventId) {
      this.events = this.events.filter(event => event.id != eventId);
    },
    dayClick: function() {},
    selectEvent: function() {},
    saveEvent: function(hasCalculationSheet) {
      this.$validator.validateAll("EventCreationValidation").then(result => {
        this.APICalenderEventObject.hasCalculationSheet = hasCalculationSheet;
        // this.$validator.validateAll().then((result) => {
        if (result) {
          if (
            this.APICalenderEventObject.calenderEventUser.length == 0 &&
            this.APICalenderEventObject.calenderEventRole.length == 0
          ) {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("RoleUserValidation")
            });
            return;
          }
          this.fullscreenLoading = true;
          var urlStr;
          if (this.APICalenderEventObject.id) {
            urlStr = this.$store.getters.serverURI + "api/CalenderEvent";

            this.APICalenderEventObject.fromDate = moment(
              this.APICalenderEventObject.fromDate
            ).format(this.$store.getters.getWebAPIDateTimeFormat);
            //this.APICalenderEventObject.start.format("YYYY-MM-DD HH:mm:ss.SSS");
            if (this.APICalenderEventObject.toDate) {
              this.APICalenderEventObject.toDate = moment(
                this.APICalenderEventObject.toDate
              ).format(this.$store.getters.getWebAPIDateTimeFormat);
              //this.APICalenderEventObject.end.format("YYYY-MM-DD HH:mm:ss.SSS");
            }

            this.APICalenderEventObject.hasCalculationSheet = hasCalculationSheet;
            this.APICalenderEventObject.departmentId = this.APICalenderEventObject.departmentId?this.APICalenderEventObject.departmentId:null;
            if (hasCalculationSheet == true) {
              this.APICalenderEventObject.calculationSheetId = null;
            }
            this.$http
              .put(urlStr, this.APICalenderEventObject, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                response => {
                  this.fullscreenLoading = false;

                  // console.log(JSON.stringify(response.body));
                  this.showConfirm = false;
                  this.showCreateEventDialog = false;
                  // var arrayObject = [response.body];
                  //this.convertToEvents(arrayObject);
                  // this.APICalenderEventObject.id = "";
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "success",
                    message: this.$t("UpdatedSuccessfully")
                  });

                  if (hasCalculationSheet == true) {
                    // router.push({
                    //   name: "NewCalculationSheet",
                    //   params: { CalSheetId: response.body }
                    // });
                    if(this.APICalenderEventObject.departmentId==this.$store.getters.getDepartmentCode.medical)
                      router.push({
                        name: "NewCalculationSheet",
                        params: { CalSheetId: response.body }
                      });
                    else if(this.APICalenderEventObject.departmentId==this.$store.getters.getDepartmentCode.tender){
                      // this.$store.commit("SET_PREDATA", this.APICalenderEventObject);
                      router.push({
                        name: "tenderNewCalculationSheet",
                        params: { CalSheetId: response.body }
                      });
                    }
                    else if(this.APICalenderEventObject.departmentId==this.$store.getters.getDepartmentCode.lab){
                      // this.$store.commit("SET_PREDATA", this.APICalenderEventObject);
                      router.push({
                        name: "labNewCalculationSheet",
                        params: { CalSheetId: response.body }
                      });
                    }
                  } else {
                    this.forceRerender();
                  }

                  //add the record to calender.
                },
                function(error) {
                  this.fullscreenLoading = false;
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "error",
                    message: error.body.message
                  });
                  // console.log(error);
                }
              );
          } else {
            this.fullscreenLoading = true;
            urlStr = this.$store.getters.serverURI + "api/CalenderEvent";

            this.APICalenderEventObject.fromDate = moment(
              this.APICalenderEventObject.fromDate
            ).format(this.$store.getters.getWebAPIDateTimeFormat);
            if (this.APICalenderEventObject.toDate) {
              this.APICalenderEventObject.toDate = moment(
                this.APICalenderEventObject.toDate
              ).format(this.$store.getters.getWebAPIDateTimeFormat);
            }
            this.$http
              .post(urlStr, this.APICalenderEventObject, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                response => {
                  this.fullscreenLoading = false;
                  if (hasCalculationSheet == true) {
                    this.APICalenderEventObject.calculationSheetId = null;
                  }
                  this.showConfirm = false;
                  this.showCreateEventDialog = false;
                  // var arrayObject = [response.body];
                  //this.convertToEvents(arrayObject);
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "success",
                    message: this.$t("AddedSuccessfully")
                  });
                  if (hasCalculationSheet == true) {
                    
                    if(this.APICalenderEventObject.departmentId==this.$store.getters.getDepartmentCode.medical)
                      router.push({
                        name: "NewCalculationSheet",
                        params: { CalSheetId: response.body }
                      });
                    else if(this.APICalenderEventObject.departmentId==this.$store.getters.getDepartmentCode.tender){
                      // this.$store.commit("SET_PREDATA", this.APICalenderEventObject);
                      router.push({
                        name: "tenderNewCalculationSheet",
                        params: { CalSheetId: response.body }
                      });
                    }
                    else if(this.APICalenderEventObject.departmentId==this.$store.getters.getDepartmentCode.lab){
                      // this.$store.commit("SET_PREDATA", this.APICalenderEventObject);
                      router.push({
                        name: "labNewCalculationSheet",
                        params: { CalSheetId: response.body }
                      });
                    }
                  } else {
                    this.forceRerender();
                  }
                },
                function(error) {
                  this.fullscreenLoading = false;
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "error",
                    message: error.body.message
                  });
                }
              );
          }
        }
      });
    },
    cancelEvent() {
      this.showCreateEventDialog = true;
      if (this.showConfirm == false) {
        this.showCreateEventDialog = false;
        this.hasCalculationSheet = false;
        this.resetAPICalenderEventObject();
        return;
      }
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("CancelConfirmationMessage"))
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Yes"),
        cancelButtonText: this.$t("No"),
        beforeClose: (action, instance, done) => {
          if (action != "confirm") {
            done();
            this.showCreateEventDialog = false;
            this.hasCalculationSheet = false;
            this.resetAPICalenderEventObject();
          } else {
            if (this.checkActions("Edit")) {
              this.hasCalculationSheet = false;
              done();
              this.saveEvent(false);
            } else {
              done();
              this.showCreateEventDialog = false;
              this.hasCalculationSheet = false;
              this.resetAPICalenderEventObject();
            }
          }
        }
      });
    },
    deleteEvent(eventId) {
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
              this.$store.getters.serverURI + "api/CalenderEvent/" + eventId;
            this.$http
              .delete(urlStr, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(function() {
                done();
                instance.confirmButtonLoading = false;
                this.resetAPICalenderEventObject();
                this.showCreateEventDialog = false;
                this.RemoveEvent(eventId);
                this.showConfirm = false;
                this.showCreateEventDialog = false;
                this.forceRerender();
                //this.getCarsFromService();
              });
          } else {
            done();
          }
        }
      })
        .then(() => {
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
    resetAPICalenderEventObject() {
      if (this.APICalenderEventObject) {
        this.APICalenderEventObject.id = "";
        this.APICalenderEventObject.typeOfEvent = "";
        this.APICalenderEventObject.quotationDescription
          ? (this.APICalenderEventObject.quotationDescription = null)
          : "";
        this.APICalenderEventObject.tenderName = "";
        this.APICalenderEventObject.customerName = "";
        this.APICalenderEventObject.mssCustomerCode = "";
        this.APICalenderEventObject.tenderLocation = "";
        this.APICalenderEventObject.fromDate = "";
        this.APICalenderEventObject.toDate = "";
        this.APICalenderEventObject.submissionDate = "";
        this.APICalenderEventObject.releaseDate = "";
        this.APICalenderEventObject.submissionAddress = "";
        this.APICalenderEventObject.description = "";
        this.APICalenderEventObject.calenderEventRole = [];
        this.APICalenderEventObject.calenderEventUser = [];
        this.isNonMSSCustomerName = false;
        this.APICalenderEventObject.departmentId=null;
      }

      this.$validator.reset();
    },
    getEventColor(startDateMoment,calculationSheet) {
      var status=calculationSheet?calculationSheet.status:''
      var today = moment();
      startDateMoment = moment(startDateMoment);
      var diff = business_moment(startDateMoment).businessDiff(today, false);
      if (status && status == this.$store.getters.getSheetStatus.Approved) return "#4d93f0"
      if (diff >= 0 && diff <= 5) return "#e82424";
      if (diff > 5 && diff <= 10) return "#FFEB9C";
      if (diff > 10) return "#C6EFCE";
    },
    getTypeOfEventLookups: function() {
      var urlTypesStr =
        this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.TypeOfEvent;
      this.$http
        .get(urlTypesStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(function(data) {
          this.typeOfEvents = data.body;
        });
    },
    getTenderLocationLookups: function() {
      var urlTypesStr =
        this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.TenderLocation;
      this.$http
        .get(urlTypesStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(function(data) {
          this.tenderLocations = data.body;
        });
    },
    getWorkflowTypesLookups: function() {
      var urlTypesStr =
        this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.WorkflowType;
      this.$http
        .get(urlTypesStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(function(data) {
          this.workflowTypes = data.body;
        });
    },
    getTenderTypeLookups: function() {
      var urlTypesStr =
        this.$store.getters.serverURI + "api/lookup/GetByCode/TenderType";
      this.$http
        .get(urlTypesStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(function(data) {
          this.tenderTypes = data.body;
        });
    },
    // FillMssCustomers: function() {
    //   var urlStr = this.$store.getters.serverURI + "api/Item/GetAllMssCustomer";
    //   this.$http
    //     .get(urlStr, {
    //       headers: this.$store.getters.tokenAuthonticationHeaderObj
    //     })
    //     .then(
    //       function(data) {
    //         this.mssCustomers = data.body;
    //       },
    //       function() {
    //         this.$message({
    //           showClose: true,
    //           duration: this.$store.getters.getMessagesDuration,
    //           type: "error",
    //           message: this.$t("ErrorMessage")
    //         });
    //       }
    //     );
    // },
    getUsersFromService: function() {
      var UserstStr =
        this.$store.getters.serverURI +
        "api/User?PageIndex=&PageSize=-1&RowsCount=&email=&role=&department="+this.loggedUserType;
      this.$http
        .get(UserstStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            if (data.body.userViewList.length) {
              var usersdata = data.body.userViewList;
              usersdata.forEach(
                function(userObj) {
                  this.userslist.push({
                    userId: userObj.id,
                    userName: `${userObj.firstName} ${userObj.lastName} - ${userObj.userName}`,
                  });
                }.bind(this)
              );
            }
            // this.userslist =  data.body.userViewList;
          },
          function() {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage")
            });
          }
        );
    },
    getRolesFromService: function() {
      var RolestStr = this.$store.getters.serverURI + "api/Role/GetAll";
      this.$http
        .get(RolestStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            if (data.body.length) {
              var rolesData = data.body;
              rolesData.forEach(
                function(element) {
                  this.roleslist.push({
                    roleId: element.id,
                    name: element.name
                  });
                }.bind(this)
              );
            }
          },
          function() {
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
  watch: {
    APICalenderEventObject: {
      handler(val) {
        if (val.mssCustomerCode && val.customerName) {
          this.isNonMSSCustomerName = false;
          val.nonMssCustomerName = "";
        } else if (val.nonMssCustomerName) {
          val.mssCustomerCode = "";
          this.isNonMSSCustomerName = true;
        } else {
          this.isNonMSSCustomerName = false;
        }
        val.submissionDate = val.submissionDate
          ? moment(val.submissionDate).format("YYYY-MM-DD HH:mm:ss")
          : "";
        val.releaseDate = val.releaseDate
          ? moment(val.releaseDate).format("YYYY-MM-DD HH:mm:ss")
          : "";
        val.fromDate = val.fromDate
          ? moment(val.fromDate).format("YYYY-MM-DD HH:mm:ss")
          : "";
        val.toDate = val.toDate
          ? moment(val.toDate).format("YYYY-MM-DD HH:mm:ss")
          : "";

        this.shareData.isNonMSSCustomerName = this.isNonMSSCustomerName;
        this.shareData.mssCustomerName = val.customerName;
        this.shareData.mssCustomerCode = val.mssCustomerCode;
        this.shareData.nonMssCustomerName = val.nonMssCustomerName;
        this.shareData.submissionDate = val.submissionDate;
        this.shareData.releaseDate = val.releaseDate;
        this.shareData.quotationDescription = val.quotationDescription;
      },
      deep: true
    }
  },
  computed: {
    isTenderEvent: function() {
      if (
        this.APICalenderEventObject.typeOfEvent &&
        this.typeOfEvents.length > 0 &&
        this.typeOfEvents.filter(
          t => t.id == this.APICalenderEventObject.typeOfEvent
        )[0].code == this.$store.getters.getTypeOfEventLookup.Tender
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {
    business_moment.updateLocale("us", {
      workingWeekdays: [0, 1, 2, 3, 4]
    });
    var loggeduser = this.$store.getters.getUserData;
    this.loggedUserType = loggeduser && loggeduser.userType? loggeduser.userType:null
      
    this.getTypeOfEventLookups();
    this.getTenderLocationLookups();
    this.getWorkflowTypesLookups();
    //this.FillMssCustomers();
    this.getUsersFromService();
    this.getRolesFromService();
    this.getTenderTypeLookups();
  }
};
</script>

<style scoped>
  ::v-deep .fc-event{
    cursor: pointer ;
  }
</style>