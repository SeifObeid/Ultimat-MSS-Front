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
                  <h1>{{$t('VerifyEmail')}}</h1>
                  <p class="text-muted">{{$t('VerifyEmailHint')}}</p>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend>
                      <b-input-group-text>
                        <i class="fa fa-user"></i>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      disabled
                      type="text"
                      name="username"
                      class="form-control"
                      v-model="verifyEmail"
                      v-validate="'required'"
                      autocomplete="off"
                    />
                  </b-input-group>

                  <b-input-group class="mb-3" :class="{'has-error':errors.has('email')}">
                    <b-input-group-prepend>
                      <b-input-group-text>
                        <i class="fa fa-envelope"></i>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="text"
                      name="email"
                      class="form-control"
                      :placeholder="$t('email')"
                      v-model="email"
                      v-validate="'required'"
                      :data-vv-as="$t('email')"
                      autocomplete="off"
                    />
                  </b-input-group>
                  <b-row>
                    <b-col cols="6">
                      <b-button variant="primary" class="px-4" type="submit">{{$t('Send')}}</b-button>
                    </b-col>
                    <b-col cols="6" class="text-right">
                      <b-button variant="link" class="px-0" :to="{ name: 'login'}">{{$t('Login?')}}</b-button>
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
  name: "verify",

  data(router) {
    return {
      fullscreenLoading: false,
      section: "verify",
      loading: false,
      email: "",
      verifyEmail: "",
      username: "",
      response: "",
      userId: this.$route.params.UserId
    };
  },

  methods: {
    hidePartOfEmail(input) {
      var a = input.split("@");
      var b = a[0];
      var newstr = "";
      for (var i in b) {
        if (i > 1 && i < b.length) newstr += "*";
        else newstr += b[i];
      }
      return newstr + "@" + a[1];
    },
    reset: function() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.fullscreenLoading = true;
          const params = {
            Email: this.email
          };
          this.$http
            .post(
              this.$store.getters.serverURI +
                "api/Users/GenerateForgotPasswordToken",
              params
            )
            .then(
              function(response) {
                this.fullscreenLoading = false;
                this.email = "";
                this.$validator.reset();
                this.$router.push({ path: "/login" });
                this.$message({
                  showClose: true,
                  message: response.data.message,
                  type: "success"
                });
              },
              function(error) {
                this.fullscreenLoading = false;
                this.password = "";
                this.$validator.reset();
                this.loading = false;
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
    getUserData: function() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.loading = true;
          this.$http
            .get(
              this.$store.getters.serverURI +
                "api/Users/" +
                this.userId +
                "/GetEmail"
            )
            .then(
              function(response) {
                let orignalEmail = response.body.message;
                this.verifyEmail = this.hidePartOfEmail(orignalEmail);
                // let extenstion = str.split("@")[1];
              },
              function(error) {
                // this.password = "";
                // this.$validator.reset();
                // this.loading = false;
                this.$router.push({ path: "/login" });
                this.$message({
                  showClose: true,
                  message: error.data.message,
                  type: "error"
                });
              }
            );
        }
      });
    }
  },
  created() {
    this.getUserData();
  }
};
</script>

<style>
body .has-error .form-control,
.input-group.has-error .input-group-addon {
  border-color: #a94442;
}
</style>


