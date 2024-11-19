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
                <b-form @submit.prevent="login" autocomplete="off">
                  <h1>{{$t('Login')}}</h1>
                  <p class="text-muted">{{$t('FillUserNameAndPassword')}}</p>
                  <b-input-group class="mb-3" :class="{'has-error':errors.has('username')}">
                    <b-input-group-prepend>
                      <b-input-group-text>
                        <i class="icon-user"></i>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="text"
                      name="username"
                      class="form-control"
                      autocomplete="off"
                      :placeholder="$t('UserName')"
                      v-model="username"
                      v-validate="'required'"
                      :data-vv-as="$t('UserName')"
                    />
                  </b-input-group>
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
                  <b-row>
                    <b-col cols="6">
                      <b-button variant="primary" class="px-4" type="submit">{{$t('Login')}}</b-button>
                    </b-col>
                    <b-col cols="6" class="text-right">
                      <router-link class="px-0" :to="{ name: 'forget'}">{{$t('ForgetPassword')}}?</router-link>
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
import firebaseMessaging from "../../google/firebaseMessaging";

export default {
  name: "Login",

  data() {
    return {
      fullscreenLoading: false,
      section: "Login",
      loading: false,
      username: "",
      password: "",
      response: "",
      returnUrl: ""
      // base_url:this.$store.getters.serverURI,
    };
  },
  methods: {
    login: function() {
      this.$validator.validateAll().then(result => {
        if (result) {
          if (window.localStorage) window.localStorage.setItem("firebaseToken", null);
          this.$store.commit("SET_FIREBASETOKEN", null);
          this.loading = true;
          this.fullscreenLoading = true;
          this.$http
        .post(
          this.$store.getters.serverURI + "connect/token",
          "UserName=" +
            this.username +
            "&Password=" +
            this.password +
            "&grant_type=password",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        )
        .then(
          function(data) {
            this.$store.commit("SET_USER", this.username);
            this.$store.commit("SET_TOKEN", data.body.access_token);
            this.$store.commit(
              "SET_TOKENEXPIREDATE",
              moment().add(23, "hours")
            );
            if (window.localStorage) {
              window.localStorage.setItem("user", this.username);
              window.localStorage.setItem("token", data.body.access_token);
              window.localStorage.setItem(
                "TokenExpireDate",
                moment().add(23, "hours")
              );
            }
            this.insertFirebaseToken();
            this.$http
              .get(this.$store.getters.serverURI + "api/User/LoggedIn", {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(function(data) {
                var urlStrProfile =
                  this.$store.getters.serverURI +
                  "api/User/" +
                  data.body.id +
                  "/Photo";

                this.$http
                  .get(urlStrProfile, {
                    headers: this.$store.getters
                      .tokenAuthonticationHeaderObj
                  })
                  .then(
                    function() {
                      data.body.profileImage = urlStrProfile;
                      this.$store.commit("SET_USERDATA", data.body);
                      window.localStorage.setItem(
                        "userData",
                        JSON.stringify(data.body)
                      );
                    },
                    function() {
                      data.body.profileImage = "/img/avatars/profile.png";
                      this.$store.commit("SET_USERDATA", data.body);
                      window.localStorage.setItem(
                        "userData",
                        JSON.stringify(data.body)
                      );
                    }
                  )
                  .catch(() => {
                    data.body.profileImage = "/img/avatars/profile.png";
                    this.$store.commit("SET_USERDATA", data.body);
                    window.localStorage.setItem(
                      "userData",
                      JSON.stringify(data.body)
                    );
                  });

                this.$http
                  .get(
                    this.$store.getters.serverURI +
                      "api/Users/" +
                      data.body.id +
                      "/Privileges",
                    {
                      headers: this.$store.getters
                        .tokenAuthonticationHeaderObj
                    }
                  )
                  .then(function(data) {
                    window.localStorage.setItem(
                      "roles",
                      JSON.stringify(data.body)
                    );
                    
                  });
              }),
              setTimeout(() => {
                this.fullscreenLoading = false;
                if (this.$route.query.from) {
                  if (
                    this.$route.query.from.includes(
                      "calculationSheets/NewCalculationSheet"
                    )
                  ) {
                    this.$router.push(this.returnUrl);
                  } else {
                    this.$router.push("/dashboard");
                  }
                } else {
                  this.$router.push("/dashboard");
                }
              }, 2000);
          },
          function(error) {
            this.fullscreenLoading = false;
            this.password = "";
            this.$validator.reset();
            this.loading = false;
            if (error.status == 0) {
              this.$message({
                showClose: true,
                message: this.$t("ErrorWhenConnectingToServer"),
                type: "error"
              });
            } else if (error.status == 400) {
              this.fullscreenLoading = false;
              this.$message({
                showClose: true,
                message: this.$t("InvalidUsernameOrPassword"),
                type: "error"
              });
            } else if (error.status == 401) {
              this.fullscreenLoading = false;
              this.$message({
                showClose: true,
                message: this.$t("AuthorizationDeniedForRequest"),
                type: "error"
              });
            } else if (error.body.Message) {
              this.fullscreenLoading = false;
              this.$message({
                showClose: true,
                message: error.body.Message,
                type: "error"
              });
            } else {
              this.fullscreenLoading = false;
              this.$message({
                showClose: true,
                message: this.$t("UnknownError"),
                type: "error"
              });
            }
          }
        );
        }
      });
    },
    async insertFirebaseToken() {
      let isSupportedFirebase = await firebaseMessaging.isSupportedFirebase();
      console.log(isSupportedFirebase)
      if (isSupportedFirebase) {
        await firebaseMessaging.fbToken()
        .then((response) => {
            if (window.localStorage) window.localStorage.setItem("firebaseToken", response);
            this.$store.commit("SET_FIREBASETOKEN", response);
            this.$http
            .post(
              this.$store.getters.serverURI + "api/Users/InsertFirebaseToken",
              { Token: response },
              {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              }
            )
            .then(
                () => { },
                function() {
                    this.$message({
                        showClose: true,
                        duration: this.$store.getters.getMessagesDuration,
                        type: "error",
                        message: this.$t("ErrorMessage")
                    });
                }
            );
        })
        .catch((error) =>  {console.log(error);});
      }
    }
  },
  created() {
    this.returnUrl = this.$route.query.from;
  }
};
</script>

<style>
body .has-error .form-control,
.input-group.has-error .input-group-addon {
  border-color: #a94442;
}
</style>

