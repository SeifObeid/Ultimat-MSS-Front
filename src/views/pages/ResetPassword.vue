<template>
  <div class="app flex-row align-items-center" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6 " align="center">
          <img src="img/brand/logo.png" />
          <br />
          <br />
          <h5>{{$t('MSS')}}</h5>
        </b-col>
      </b-row>

      <br />
      <b-row class="justify-content-center">
        <b-col md="6">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form @submit.prevent="reset">
                  <h1>{{$t('ResetPassword')}}</h1>
                  <p class="text-muted"></p>
                  <b-input-group class="mb-4" :class="{'has-error':errors.has('password')}">
                    <b-input-group-prepend>
                      <b-input-group-text>
                        <i class="icon-lock"></i>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="password"
                      name="password"
                      class="form-control"
                      autocomplete="off"
                      :placeholder="$t('Password')"
                      v-model="password"
                      v-validate="'required'"
                      :data-vv-as="$t('Password')"
                    />
                  </b-input-group>
                  <b-input-group class="mb-4" :class="{'has-error':errors.has('ConfirmPassword')}">
                    <b-input-group-prepend>
                      <b-input-group-text>
                        <i class="icon-lock"></i>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="password"
                      name="ConfirmPassword"
                      class="form-control"
                      autocomplete="off"
                      :placeholder="$t('ConfirmPassword')"
                      v-model="confirm"
                      v-validate="'required'"
                      :data-vv-as="$t('ConfirmPassword')"
                    />
                  </b-input-group>
                  <b-row>
                    <b-col cols="6">
                      <b-button variant="primary" class="px-4" type="submit">{{$t('Reset')}}</b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
            <!-- <b-card no-body class="text-white bg-primary py-5 d-md-down-none" style="width:44%">
                  <b-card-body class="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                      <b-button variant="primary" class="active mt-3">Register Now!</b-button>
                    </div>
                  </b-card-body>
            </b-card>-->
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "Login",

  data(router) {
    return {
      section: "Login",
      fullscreenLoading: false,
      password: "",
      confirm: ""
      // base_url:this.$store.getters.serverURI,
    };
  },

  methods: {
    reset: function() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.fullscreenLoading = true;
          const params = {
            token: this.$route.query.token,
            newPassword: this.password
          };
          this.$http
            .post(
              this.$store.getters.serverURI +
                "api/Users/ChangePasswordUsingToken",
              params
            )
            .then(
              function(response) {
                this.fullscreenLoading = false;
                this.$message({
                  showClose: true,
                  message: response.data.message,
                  type: "success"
                });
                this.$router.push({ path: "/login" });
              },
              function(error) {
                this.fullscreenLoading = false;
                this.password = "";
                this.confirm = "";
                this.$validator.reset();
                this.$message({
                  showClose: true,
                  message: error.data.message,
                  type: "error"
                });
              }
            );
        }
      });
    },
    checkToken() {
      this.fullscreenLoading = true;
      this.$http
        .get(
          this.$store.getters.serverURI +
            "api/Users/ValidatePasswordToken?token=" +
            this.$route.query.token
        )
        .then(
          function(response) {
            this.fullscreenLoading = false;
            if (response.body != true) {
              this.$message({
                showClose: true,
                message: this.$t("tokenInvalid"),
                type: "error"
              });
              this.$router.push({ path: "/forget" });
            }
          },
          function(error) {
            this.fullscreenLoading = false;
            this.$message({
              showClose: true,
              message: error.data.message,
              type: "error"
            });
          }
        );
    }
  },
  created() {
    this.checkToken();
  }
};
</script>

<style>
body .has-error .form-control,
.input-group.has-error .input-group-addon {
  border-color: #a94442;
}
</style>

