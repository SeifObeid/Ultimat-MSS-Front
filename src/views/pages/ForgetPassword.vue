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
                <b-form @submit.prevent="validateUser">
                  <h1>{{$t('ForgetPassword')}}</h1>
                  <p class="text-muted">{{$t('EnterUsername')}}</p>
                  <b-input-group class="mb-3" :class="{'has-error':errors.has('username')}">
                    <b-input-group-prepend>
                      <b-input-group-text>
                        <i class="fa fa-envelope"></i>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="text"
                      name="username"
                      class="form-control"
                      :placeholder="$t('username')"
                      v-model="username"
                      v-validate="'required'"
                      :data-vv-as="$t('username')"
                      autocomplete="off"
                    />
                  </b-input-group>
                  <b-row>
                    <b-col cols="6">
                      <b-button variant="primary" class="px-4" type="submit">{{$t('Verify')}}</b-button>
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
  name: "Login",

  data(router) {
    return {
      fullscreenLoading: false,
      section: "Login",
      loading: false,
      email: "",
      username: "",
      response: ""

      // base_url:this.$store.getters.serverURI,
    };
  },

  methods: {
    validateUser: function() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.fullscreenLoading = true;
          const params = {
            UserName: this.username
          };
          this.$http
            .post(
              this.$store.getters.serverURI + "api/Users/ValidateUserName",
              params
            )
            .then(
              function(response) {
                if (response.body.message) {
                  this.fullscreenLoading = false;
                  this.email = "";
                  this.$validator.reset();
                  this.$router.push({
                    path: "/Verify/" + response.body.extra
                  });
                } else {
                  this.fullscreenLoading = false;
                  this.password = "";
                  this.$validator.reset();
                  this.loading = false;
                  this.$message({
                    showClose: true,
                    message: response.data.message,
                    type: "error"
                  });
                }
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
            )
            .catch(() => {
              this.fullscreenLoading = false;
            });
        }
      });
    }
  }
};
</script>

<style>
body .has-error .form-control,
.input-group.has-error .input-group-addon {
  border-color: #a94442;
}
</style>


