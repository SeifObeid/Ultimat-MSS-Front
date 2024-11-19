<template>
  <b-card
    class="card card-accent-primary"
    no-body
    v-if="show"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div slot="header">
      <span v-if="RoleId<0">{{$t("AddNewRole")}}</span>
      <span v-if="RoleId>0">{{$t("EditRole")}}</span>
      {{$t("RolesList")}}
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
            <router-link :to="{ name: 'RolesList'}" class="btn btn-secondary">
              <i class="fa fa-arrow-left"></i>
              {{$t("BackToList")}}
            </router-link>
          </div>
        </div>
        <br />

        <div class="row">
          <div class="col-md-6">
            <div class="form-group" :class="{'has-error':errors.has('RoleValidation.RoleName')}">
              <label class="col-form-label">{{$t("RoleName")}}</label>
              <label class="required">*</label>
              <input
                type="text"
                name="RoleName"
                class="form-control"
                v-model="RoleObj.name"
                v-validate="'required'"
                data-vv-scope="RoleValidation"
                :data-vv-as="$t('RoleName')"
                :maxlength="$store.getters.getMaxLength.length40"
                autocomplete="off"
              />
              <div
                class="help-block"
                v-if="errors.has('RoleValidation.RoleName')"
              >{{ errors.first('RoleValidation.RoleName') }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <label class="col-form-label">Role privileges</label>
            <br />

            <div class="mb-5">
              <el-tree
                :data="RoleObj.privilages"
                show-checkbox
                highlight-current
                node-key="id"
                :default-checked-keys="checkedPrivilegesKeys"
                ref="tree"
                :props="defaultProps"
              ></el-tree>
            </div>
          </div>
        </div>
        <div>
          <button class="btn btn-primary" v-on:click="sendForm()">
            <i class="fa fa-save"></i>
            {{$t("Save")}}
          </button>
        </div>
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
      RoleObj: {
        id: "",
        name: "",
        rolePrivilage: [],
        privilages: []
      },

      RoleId: this.$route.params.RoleId,
      checkedPrivilegesKeys: [],
      defaultProps: {
        children: "chilldrenPrivilages",
        label: "description"
      }
    };
  },

  methods: {
    fillCheckedNodes() {
      this.$refs.tree.getCheckedNodes(false, true).forEach(node => {
        this.RoleObj.rolePrivilage.push(node.id);
      });
    },
    clearAll() {
      this.RoleObj = {
        id: "",
        name: "",
        rolePrivilage: [],
        privilages: []
      };
    },

    setPrivilegeChildData: function(parent) {
      if (parent.chilldrenPrivilages.length > 0) {
        for (var i = 0; i < parent.chilldrenPrivilages.length; i++) {
          this.setPrivilegeChildData(parent.chilldrenPrivilages[i]);
        }
      } else if (parent.havePrivilage === true) {
        this.checkedPrivilegesKeys.push(parent.id);
      }
    },

    getRoleInfoFromService: function() {
      this.loading = true;
      this.fullscreenLoading = true;
      var urlStr = this.$store.getters.serverURI + "api/Role/" + this.RoleId;

      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.fullscreenLoading = false;
            this.RoleObj = data.body;
            this.RoleObj.privilages = data.body.privilage;

            if (this.RoleId) {
              var checkedParentPrivilegesObjects = this.RoleObj.privilages.filter(
                priv => priv.havePrivilage === true
              );

              checkedParentPrivilegesObjects.forEach(privilage => {
                this.setPrivilegeChildData(privilage);
              });
            } else {
              this.RoleObj.name = "";
            }
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
      this.$validator.validateAll("RoleValidation").then(result => {
        if (result) {
          if (this.isValid) {
            this.fillCheckedNodes();
            if (this.RoleId) {
              this.fullscreenLoading = true;
              var urlStr = this.$store.getters.serverURI + "api/Role";
              this.$http
                .put(urlStr, this.RoleObj, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
                })
                .then(
                  response => {
                    this.fullscreenLoading = false;
                    this.$message({
                      showClose: true,
                      duration: this.$store.getters.getMessagesDuration,
                      type: "success",
                      message: this.$t("RoleUpdatedSuccessfully")
                    });
                    this.$router.push({ path: "/userManagement/RolesList" });
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
            } else {
              this.fullscreenLoading = true;
              var urlStr = this.$store.getters.serverURI + "api/Role";
              this.$http
                .post(urlStr, this.RoleObj, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
                })
                .then(
                  response => {
                    this.fullscreenLoading = false;
                    this.$message({
                      showClose: true,
                      duration: this.$store.getters.getMessagesDuration,
                      type: "success",
                      message: this.$t("RoleAddedSuccessfully")
                    });
                    this.clearAll();
                    this.$router.push({ path: "/userManagement/RolesList" });
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
          }
        }
      });
      this.isValid = true;
    }
  },

  created: function() {
    this.getRoleInfoFromService();
  }
};
</script>