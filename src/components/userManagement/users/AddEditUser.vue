<template>
  <b-card
    class="card card-accent-primary"
    no-body
    v-if="show"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div slot="header">
      <span v-if="UserId>0">{{$t("EditUser")}}</span>
      <span v-else>{{$t("AddNewUser")}}</span>
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
        <div class="row">
          <div class="col-md-12">
            <router-link :to="{ name: 'UsersList'}" class="btn btn-secondary">
              <i class="fa fa-arrow-left"></i>
              {{$t("BackToList")}}
            </router-link>

            <button
              type="button"
              class="btn btn-info float-right"
              @click="showResetPassPop = true"
              v-if="this.UserId"
            >
              <i class="fas fa-redo"></i>
              {{$t("ResetPassword")}}
            </button>
          </div>
        </div>
        <br />

        <div class="row">
          <div class="col-md-4">
            <div class="form-group" :class="{'has-error':errors.has('UserValidation.UserName')}">
              <label class="col-form-label">{{$t("UserName")}}</label>
              <label class="required">*</label>
              <input
                type="text"
                name="UserName"
                class="form-control"
                v-model="UserObj.userName"
                v-validate="'required'"
                data-vv-scope="UserValidation"
                :data-vv-as="$t('UserName')"
                autocomplete="off"
                onfocus="this.removeAttribute('readonly');"
                :maxlength="$store.getters.getMaxLength.length30"
              />
              <div
                class="help-block"
                v-if="errors.has('UserValidation.UserName')"
              >{{ errors.first('UserValidation.UserName') }}</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group" :class="{'has-error':errors.has('UserValidation.FirstName')}">
              <label class="col-form-label">{{$t("FirstName")}}</label>
              <label class="required">*</label>
              <input
                type="text"
                name="FirstName"
                class="form-control"
                v-model="UserObj.firstName"
                v-validate="'required'"
                data-vv-scope="UserValidation"
                :data-vv-as="$t('FirstName')"
                autocomplete="off"
                :maxlength="$store.getters.getMaxLength.length30"
              />
              <div
                class="help-block"
                v-if="errors.has('UserValidation.FirstName')"
              >{{ errors.first('UserValidation.FirstName') }}</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group" :class="{'has-error':errors.has('UserValidation.LastName')}">
              <label class="col-form-label">{{$t("LastName")}}</label>
              <label class="required">*</label>
              <input
                type="text"
                name="LastName"
                class="form-control"
                v-model="UserObj.lastName"
                v-validate="'required'"
                data-vv-scope="UserValidation"
                :data-vv-as="$t('LastName')"
                autocomplete="off"
                :maxlength="$store.getters.getMaxLength.length30"
              />
              <div
                class="help-block"
                v-if="errors.has('UserValidation.LastName')"
              >{{ errors.first('UserValidation.LastName') }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="form-group" :class="{'has-error':errors.has('UserValidation.Role') || RoleValidation != ''}">
              <label class="col-form-label">{{$t("Roles")}}</label>
              <label class="required">*</label>
              <br />
              <el-select
                v-model="UserObj.userRole"
                multiple
                collapse-tags
                :data-vv-as="$t('Role')"
                name="Role"
                placeholder="Select"
                clearable
                filterable
                class="full-width"
                @change="onChangeRoles()"
              >
                <el-option
                  v-for="option in Roles"
                  v-bind:value="option.id"
                  :label="option.name"
                  v-bind:key="option.id"
                ></el-option>
              </el-select>
              <div
                class="help-block"
                v-if="errors.has('UserValidation.Role') || RoleValidation != ''"
              >{{ errors.first('UserValidation.Role') }}</div>
               <div
                class="help-block mt-1"
                v-if="RoleValidation != ''">{{ RoleValidation }}</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group" :class="{'has-error':errors.has('UserValidation.Email')}">
              <label class="col-form-label">{{$t("Email")}}</label>
              <label class="required">*</label>
              <input
                type="text"
                name="Email"
                class="form-control"
                v-model="UserObj.email"
                v-validate="'required|email'"
                data-vv-scope="UserValidation"
                :data-vv-as="$t('Email')"
                autocomplete="off"
                onfocus="this.removeAttribute('readonly');"
              />
              <div
                class="help-block"
                v-if="errors.has('UserValidation.Email')"
              >{{ errors.first('UserValidation.Email') }}</div>
            </div>
          </div>
  
          <div class="col-md-4">
            <b-form-group :class="{'has-error':errors.has('UserValidation.userType')}">
              <label class="col-form-label" for="userType" md="4">{{$t('Type')}}</label>
              <el-select
                v-model="UserObj.userType"
                name="userType"
                filterable
                clearable
                v-bind:placeholder="$t('Select')"
                :data-vv-as="'userType'"
                autocomplete="off">
                <el-option
                  v-for="item in types"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>

              <div class="help-block" v-if="errors.has('UserValidation.userType')">
                <label class="mt-1">{{ errors.first('UserValidation.userType') }}</label>
              </div>
            </b-form-group>
          </div>

          <div class="col-md-4">
            <b-form-group :class="{'has-error':errors.has('UserValidation.departmentId')}">
              <label class="col-form-label" for="departmentId" md="4">{{$t('Department')}}</label>
              <el-select
                v-model="UserObj.departmentId"
                name="departmentId"
                filterable
                clearable
                v-bind:placeholder="$t('Select')"
                :data-vv-as="'departmentId'"
                autocomplete="off">
                <el-option
                  v-for="item in departemnts"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>

              <div class="help-block" v-if="errors.has('UserValidation.departmentId')">
                <label class="mt-1">{{ errors.first('UserValidation.departmentId') }}</label>
              </div>
            </b-form-group>
          </div>

          <div class="col-md-4">
            <b-form-group :class="{'has-error':errors.has('UserValidation.positionId')}">
              <label class="col-form-label" for="positionId" md="4">{{$t('Position')}}</label>
              <el-select
                v-model="UserObj.positionId"
                name="positionId"
                filterable
                clearable
                v-bind:placeholder="$t('Select')"
                :data-vv-as="'positionId'"
                autocomplete="off">
                <el-option
                  v-for="item in positions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>

              <div class="help-block" v-if="errors.has('UserValidation.positionId')">
                <label class="mt-1">{{ errors.first('UserValidation.positionId') }}</label>
              </div>
            </b-form-group>
          </div>


        <div class="col-md-4"> 
          <b-form inline class="mt-2 mb-2" style="padding-top:35px">
            <b-form-checkbox v-model="UserObj.isAdmin">{{$t("IsAdmin")}}</b-form-checkbox>
          </b-form>
        </div>
        </div>
        <div class="row" v-if="this.PasswordFieldsVisible">
          <div class="col-md-4">
            <div class="form-group" :class="{'has-error':errors.has('UserValidation.Password')}">
              <label class="col-form-label">{{$t("Password")}}</label>
              <label class="required">*</label>
              <input
                type="password"
                name="Password"
                class="form-control"
                v-model="UserObj.password"
                v-validate="'required'"
                data-vv-scope="UserValidation"
                :data-vv-as="$t('Password')"
                ref="password"
                autocomplete="off"
                onfocus="this.removeAttribute('readonly');"
              />
              <div
                class="help-block"
                v-if="errors.has('UserValidation.Password')"
              >{{ errors.first('UserValidation.Password') }}</div>
            </div>
          </div>
          <div class="col-md-4">
            <div
              class="form-group"
              :class="{'has-error':errors.has('UserValidation.confirmPassword')}"
            >
              <label class="col-form-label">{{$t("ConfirmPassword")}}</label>
              <label class="required">*</label>
              <input
                type="password"
                name="confirmPassword"
                class="form-control"
                v-model="ConfirmPassword"
                v-validate="'required|confirmed:password'"
                data-vv-scope="UserValidation"
                data-vv-as="password"
                autocomplete="off"
                onfocus="this.removeAttribute('readonly');"
              />
              <div
                class="help-block"
                v-if="errors.has('UserValidation.confirmPassword')"
              >{{ errors.first('UserValidation.confirmPassword') }}</div>
            </div>
          </div>
        </div>
        <div class="mt-2">
          <button class="btn btn-primary" v-on:click="sendForm()">
            <i class="fa fa-save"></i>
            {{$t("Save")}}
          </button>
        </div>

        <el-dialog
          :title="$t('ResetPassword')"
          :visible="showResetPassPop"
          :show-close="false"
          :close-on-press-escape="false"
          :destroy-on-close="false">
          <div class="row">
            <div class="col-md-6">
              <div
                class="form-group"
                :class="{'has-error':errors.has('ResetPasswordContent.NewPassword')}"
              >
                <label class="col-form-label">{{$t("NewPassword")}}</label>
                <label class="required">*</label>
                <input
                  type="password"
                  name="NewPassword"
                  class="form-control"
                  ref="NewPassword"
                  v-model="resetPasswordObj.password"
                  v-validate="'required'"
                  :data-vv-as="$t('Password')"
                  data-vv-scope="ResetPasswordContent"
                  autocomplete="off"
                />
                <div
                  class="help-block"
                  v-if="errors.has('ResetPasswordContent.NewPassword')"
                >{{ errors.first('ResetPasswordContent.NewPassword') }}</div>
              </div>
            </div>
            <div class="col-md-6">
              <div
                class="form-group"
                :class="{'has-error':errors.has('ResetPasswordContent.ConfirmNewPassword')}"
              >
                <label class="col-form-label">{{$t("ConfirmNewPassword")}}</label>
                <label class="required">*</label>
                <input
                  type="password"
                  name="ConfirmNewPassword"
                  class="form-control"
                  v-model="confirmResetPassword"
                  v-validate="'required|confirmed:NewPassword'"
                  :data-vv-as="$t('ConfirmPassword')"
                  data-vv-scope="ResetPasswordContent"
                  autocomplete="off"
                />
                <div
                  class="help-block"
                  v-if="errors.has('ResetPasswordContent.ConfirmNewPassword')"
                >{{ errors.first('ResetPasswordContent.ConfirmNewPassword') }}</div>
              </div>
            </div>
          </div>
          <button class="btn btn-info" type="button" @click="saveResetPassword()">
            <i class="fa fa-save"></i>
            {{$t("Save")}}
          </button>
          <button
            type="button"
            style="margin-left:3px"
            class="btn btn-secondary"
            @click="cancelResetPassword()"
          >
            <i class="fa fa-ban"></i>
            {{$t("Cancel")}}
          </button>
        </el-dialog>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
      show: true,
      types: [],
      departemnts:[],
      positions:[],
      fullscreenLoading: false,
      UserObj: {
        id: "",
        name: "",
        firstName: "",
        lastName: "",
        password: "",
        isActive: true,
        isAdmin: false,
        email: "",
        userRole: [],
        departmentId: "",
        positionId:"",
        userType:undefined,
      },
      ConfirmPassword: "",
      Roles: [],
      PasswordFieldsVisible: false,
      showResetPassPop: false,
      resetPasswordObj: {
        password: ""
      },
      confirmResetPassword: "",
      UserId: this.$route.params.UserId,
      RoleValidation : ""
    };
  },

  methods: {
    onChangeRoles(){
      if(this.UserObj.userRole.length>0){
        this.RoleValidation = ""
      }else{
         this.RoleValidation = this.$t("RoleValidation")
      }
    }, 
    getUserInfoFromService: function() {
      this.fullscreenLoading = true;
      var urlStr = this.$store.getters.serverURI + "api/User/" + this.UserId;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.UserObj = data.body;
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
    getLookupsFromService: function() {
      var RolestStr = this.$store.getters.serverURI + "api/Role/GetAll";
      this.$http
        .get(RolestStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.Roles = data.body;
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

    sendForm() {
      if (this.UserObj.userRole.length == 0) {
         this.RoleValidation = this.$t("RoleValidation")
      }
      this.$validator.validateAll("UserValidation").then(result => {
        if (result) {
          if (this.isValid) {
            if (this.UserObj.userRole.length == 0) {
              this.RoleValidation = this.$t("RoleValidation")
              return;
            }
            if (this.UserId) {
              this.fullscreenLoading = true;
              var urlStr = this.$store.getters.serverURI + "api/User";
              this.$http
                .put(urlStr, this.UserObj, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
                })
                .then(
                  response => {
                    this.fullscreenLoading = false;
                    this.$message({
                      showClose: true,
                      duration: this.$store.getters.getMessagesDuration,
                      type: "success",
                      message: this.$t("UpdatedSuccessfully")
                    });
                    this.$router.push({ name: "UsersList" });
                  },
                  function(error) {
                    this.fullscreenLoading = false;
                    let msg = error.body.modelState.userName[0];
                    this.$message({
                      showClose: true,
                      duration: this.$store.getters.getMessagesDuration,
                      type: "error",
                      message: msg
                    });
                  }
                );
            } else {
              if (this.ConfirmPassword === this.UserObj.password) {
                this.fullscreenLoading = true;
                var urlStr = this.$store.getters.serverURI + "api/User";
                this.$http
                  .post(urlStr, this.UserObj, {
                    headers: this.$store.getters.tokenAuthonticationHeaderObj
                  })
                  .then(
                    response => {
                      this.fullscreenLoading = false;
                      this.$message({
                        showClose: true,
                        duration: this.$store.getters.getMessagesDuration,
                        type: "success",
                        message: this.$t("AddedSuccessfully")
                      });
                      this.$router.push({ name: "UsersList" });
                    },
                    function(error) {
                      this.fullscreenLoading = false;
                      let msg = error.body.modelState.userName[0];
                      this.$message({
                        showClose: true,
                        duration: this.$store.getters.getMessagesDuration,
                        type: "error",
                        message: msg
                      });
                    }
                  );
              } else {
                this.$message({
                  showClose: true,
                  duration: this.$store.getters.getMessagesDuration,
                  type: "error",
                  message: this.$t("PasswordNotMatch")
                });
              }
            }
          }
        }
      });
      this.isValid = true;
    },

    saveResetPassword() {
      this.$validator.validateAll("ResetPasswordContent").then(result => {
        if (result) {
          this.fullscreenLoading = true;
          var urlStr =
            this.$store.getters.serverURI +
            "api/User/" +
            this.UserId +
            "/reset-password";
          this.$http
            .put(urlStr, this.resetPasswordObj, {
              headers: this.$store.getters.tokenAuthonticationHeaderObj
            })
            .then(
              response => {
                this.fullscreenLoading = false;
                this.$message({
                  showClose: true,
                  duration: this.$store.getters.getMessagesDuration,
                  type: "success",
                  message: this.$t("UpdatedSuccessfully")
                });
                // this.cancelResetPassword();
                 this.showResetPassPop = false;
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
      });
    },

    showResetPasswordPop() {
      this.errors.clear("ResetPasswordContent");
      this.showResetPassPop = true;
    },
   cancelResetPassword() {
        this.showResetPassPop = true;
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
              this.showResetPassPop = false;
              done();
            } else {
              this.showResetPassPop = true;
              done();
            }
          }
        });


    },
    closeDialog() {
      this.resetFields();
    },
    resetFields() {
      this.resetPasswordObj.password = "";
      this.confirmResetPassword = "";
      this.$validator.reset();
      this.errors.clear("ResetPasswordContent");
    },
    getUserType: function() {
      var urlTypesStr =this.$store.getters.serverURI +"api/lookup/GetByType/" + this.$store.getters.getLookupCategory.WorkflowType;
      this.$http
          .get(urlTypesStr, {
              headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(function(data) {
              this.types = data.body;
          });
    },
    GetPositions: function() {
      var urlTypesStr =this.$store.getters.serverURI +"api/lookup/GetByType/" + this.$store.getters.getLookupCategory.Position;
      this.$http
          .get(urlTypesStr, {
              headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(function(data) {
              this.positions = data.body;
          });
    },
    GetDepartments: function() {
      var urlTypesStr =this.$store.getters.serverURI +"api/lookup/GetByType/" + this.$store.getters.getLookupCategory.Department;
      this.$http
          .get(urlTypesStr, {
              headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(function(data) {
              this.departemnts = data.body;
          });
    },
  },

  created: function() {
    this.getLookupsFromService();
    this.GetPositions();
    this.GetDepartments();
    this.getUserType();
    if (this.UserId) {
      this.getUserInfoFromService();
      this.PasswordFieldsVisible = false;
    } else {
      this.PasswordFieldsVisible = true;
    }
  }
};
</script>

<style>
.full-width {
  width: 100%;
}
</style>
