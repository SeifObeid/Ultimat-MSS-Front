<template>
  <b-card
    class="card card-accent-primary"
    no-body
    v-if="show"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div slot="header">
      <span >{{$t("userProfile")}}</span>
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
            <img
              v-bind:src="UserObj.profileImage"
              width="80"
              height="80"
              class="img-responsive rounded-circle"
              onclick="document.getElementById('fileInputMulti').click()"
            />
            <input
              data-v-459e9c6b
              type="file"
              id="fileInputMulti"
              class="form-control-file"
              @change="onFileChange"
              style="display: none"
            />
            <input
              type="text"
              v-model="UserObj.name"
              id="name1"
              class="form-control"
              style="display: none"
            />
          </div>
        </div>
        <div class="row mt-2">
          <div class="col-md-6">
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
              />
              <div
                class="help-block"
                v-if="errors.has('UserValidation.FirstName')"
              >{{ errors.first('UserValidation.FirstName') }}</div>
            </div>
          </div>
          <div class="col-md-6">
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
              />
              <div
                class="help-block"
                v-if="errors.has('UserValidation.LastName')"
              >{{ errors.first('UserValidation.LastName') }}</div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
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
              />
              <div
                class="help-block"
                v-if="errors.has('UserValidation.UserName')"
              >{{ errors.first('UserValidation.UserName') }}</div>
            </div>
          </div>

          <div class="col-md-6">
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
        </div>

        <div class="mt-2">
          <button class="btn btn-primary" v-on:click="sendForm()">
            <i class="fa fa-save"></i>
            {{$t("Save")}}
          </button>&nbsp;&nbsp;
          <button type="button" class="btn btn-danger" @click="showResetPassPop = true">
            <i class="fas fa-redo"></i>
            {{$t("ChangePassword")}}
          </button>
        </div>

        <el-dialog
          :title="$t('ChangePassword')"
          :visible="showResetPassPop"
          :show-close="false"
          :close-on-press-escape="false"
          :destroy-on-close="false"
        >
          <div class="row">
            <div class="col-md-12">
              <div
                class="form-group"
                :class="{'has-error':errors.has('ResetPasswordContent.OldPassword')}"
              >
                <label class="col-form-label">{{$t("OldPassword")}}</label>
                <label class="required">*</label>
                <input
                  type="password"
                  name="OldPassword"
                  class="form-control"
                  ref="OldPassword"
                  v-model="resetPasswordObj.oldPassword"
                  v-validate="'required'"
                  :data-vv-as="$t('OldPassword')"
                  data-vv-scope="ResetPasswordContent"
                  autocomplete="off"
                />
                <div
                  class="help-block"
                  v-if="errors.has('ResetPasswordContent.OldPassword')"
                >{{ errors.first('ResetPasswordContent.OldPassword') }}</div>
              </div>
            </div>
            <div class="col-md-12">
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
                  v-model="resetPasswordObj.newPassword"
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
            <div class="col-md-12">
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

          <button class="btn btn-info mt-2" type="button" @click="saveResetPassword()">
            <i class="fa fa-save"></i>
            {{$t("Save")}}
          </button>
          <button
            type="button"
            style="margin-left:3px"
            class="btn btn-secondary mt-2"
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
      fullscreenLoading: false,
      imgPath: "img/avatars/profile.png",
      UserObj: {
        id: "",
        name: "",
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        userName: "",
        profileImage: this.imgPath,
        base64String: "",
        fileName: "",
        isAdmin: false
      },
      ConfirmPassword: "",
      PasswordFieldsVisible: false,
      showResetPassPop: false,
      resetPasswordObj: {
        newPassword: "",
        oldPassword: ""
      },
      confirmResetPassword: "",
      UserId: this.$store.getters.getUserData.id
    };
  },
  methods: {
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      else if (files.length >= 1) {
        for (var i = 0; i < files.length; i++) {
          if (files[i].size / (1024 * 1024) <= 20) {
            this.createImage(files[i], files[i].name);
          } else {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "warning",
              message: this.$t("20MB")
            });
          }
          if (
            files[0]["type"] !== "image/jpeg" &&
            files[0]["type"] !== "image/png" &&
            files[0]["type"] !== "image/jpg"
          ) {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("InvalidImageFormat")
            });
          }
        }
      }
      this.resetFileInput();
    },
    resetFileInput() {
      document.getElementById("fileInputMulti").value = "";
    },
    createImage(file, fileName) {
      // var image = new Image();
      var reader = new FileReader();
      var vm = this;
      reader.readAsDataURL(file);
      reader.onload = e => {
        var filebase64 = e.target.result;
        var filebasee64Array = filebase64.split(",");
        vm.UserObj.base64String = filebasee64Array[1];
        vm.UserObj.fileName = fileName;
      };
      reader.addEventListener(
        "load",
        function() {
          vm.UserObj.profileImage = reader.result;
          vm.UserObj.name = "test";
        }.bind(this),
        false
      );
    },
    getUserInfoFromService: function() {
      this.fullscreenLoading = true;
      var urlStr = this.$store.getters.serverURI + "api/User/" + this.UserId;
      var urlStrProfile =
        this.$store.getters.serverURI + "api/User/" + this.UserId + "/Photo";

      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.fullscreenLoading = false;
            this.UserObj.id = data.body.id;
            this.UserObj.firstName = data.body.firstName;
            this.UserObj.lastName = data.body.lastName;
            this.UserObj.email = data.body.email;
            this.UserObj.userName = data.body.userName;
            this.UserObj.isAdmin = data.body.isAdmin;
            this.$http
              .get(urlStrProfile, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                function(_data) {
                  this.UserObj.profileImage = urlStrProfile;
                  data.body.profileImage = this.UserObj.profileImage;
                  this.$store.commit("SET_USERDATA", data.body);
                  window.localStorage.setItem(
                    "userData",
                    JSON.stringify(data.body)
                  );
                },
                function(error) {
                  this.UserObj.profileImage = this.imgPath;
                  data.body.profileImage = this.UserObj.profileImage;
                  this.$store.commit("SET_USERDATA", data.body);
                  window.localStorage.setItem(
                    "userData",
                    JSON.stringify(data.body)
                  );
                }
              )
              .catch(error => {
                this.UserObj.profileImage = this.imgPath;
                data.body.profileImage = this.UserObj.profileImage;
                this.$store.commit("SET_USERDATA", data.body);
                window.localStorage.setItem(
                  "userData",
                  JSON.stringify(data.body)
                );
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
    sendForm() {
      this.$validator.validateAll("UserValidation").then(result => {
        if (result) {
          if (this.isValid) {
            this.UserObj.profileImage = null;
            this.UserObj.password = null;
            this.UserObj.name = null;
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
                    this.getUserInfoFromService();
                    setTimeout(() => {
                      this.$router.go(0);
                    }, 2000);
                  },
                  function(error) {
                    this.fullscreenLoading = false;
                    // let msg = error.body.modelState.userName[0];
                    this.$message({
                      showClose: true,
                      duration: this.$store.getters.getMessagesDuration,
                      type: "error",
                      message: this.$t("ErrorMessage")
                    });
                  }
                );
            }
          }
        }
      });
      this.isValid = true;
    },
    logout() {
      this.$store.commit("SET_USER", null);
      this.$store.commit("SET_TOKEN", null);
      this.$store.commit("SET_FIREBASETOKEN", null);
      this.$store.commit("SET_USERDATA", null);
      this.$store.commit("SET_TOKENEXPIREDATE", null);
      this.$store.commit("SET_NOTIFICATIONS", null);

      if (window.localStorage) {
        window.localStorage.setItem("user", null);
        window.localStorage.setItem("token", null);
        window.localStorage.setItem("firebaseToken", null);
        window.localStorage.setItem("userData", null);
        window.localStorage.setItem("TokenExpireDate", null);
        window.localStorage.setItem("roles", null);
      }
      this.$router.push("/login");
    },
    saveResetPassword() {
      this.$validator.validateAll("ResetPasswordContent").then(result => {
        if (result) {
          this.fullscreenLoading = true;
          var urlStr =
            this.$store.getters.serverURI +
            "api/User/" +
            this.UserId +
            "/change-password";
          this.$http
            .put(urlStr, this.resetPasswordObj, {
              headers: this.$store.getters.tokenAuthonticationHeaderObj
            })
            .then(
              response => {
                this.fullscreenLoading = false;
                //get user after update and save it in local storage
                this.$message({
                  showClose: true,
                  duration: this.$store.getters.getMessagesDuration,
                  type: "success",
                  message: this.$t("UpdatedSuccessfully")
                });
                // this.cancelResetPassword();
                this.showResetPassPop = false;
                this.resetPasswordObj.newPassword = "";
                this.resetPasswordObj.oldPassword = "";
                this.resetPasswordObj.confirmResetPassword = "";
                this.confirmResetPassword = "";
                this.$validator.reset();
                this.errors.clear("ResetPasswordContent");
                this.logout();
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
                this.resetPasswordObj.newPassword = "";
                this.resetPasswordObj.oldPassword = "";
                this.resetPasswordObj.confirmResetPassword = "";
                this.confirmResetPassword = "";
                this.$validator.reset();
                this.errors.clear("ResetPasswordContent");
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
      this.resetPasswordObj.newPassword = "";
      this.resetPasswordObj.oldPassword = "";
      this.resetPasswordObj.confirmResetPassword = "";
      this.confirmResetPassword = "";
      this.$validator.reset();
      this.errors.clear("ResetPasswordContent");
    }
  },
  created: function() {
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
