<template>
  <b-card
    class="card card-accent-primary"
    no-body
    v-if="show"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div slot="header">
      {{$t("ItemData")}}
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
            <router-link :to="{ name: 'Tender Items Management'}" class="btn btn-secondary">
              <i class="fa fa-arrow-left"></i>
              {{$t("BackToList")}}
            </router-link>
          </div>
        </div>
        <br />

        <div class="row">
          <div class="col-md-6">
            <div class="form-group" :class="{'has-error':errors.has('RoleValidation.itemName')}">
              <label class="col-form-label">{{$t("itemName")}}</label>
              <label class="required">*</label>
              <input
                type="text"
                name="itemName"
                class="form-control"
                v-model="Obj.itemName"
                v-validate="'required'"
                data-vv-scope="RoleValidation"
                :data-vv-as="$t('itemName')"
                :maxlength="$store.getters.getMaxLength.length40"
                autocomplete="off"
              />
              <div
                class="help-block"
                v-if="errors.has('RoleValidation.itemName')"
              >{{ errors.first('RoleValidation.itemName') }}</div>
            </div>
          </div>
           <div class="col-md-6">
            <div class="form-group" :class="{'has-error':errors.has('RoleValidation.itemCode')}">
              <label class="col-form-label">{{$t("itemCode")}}</label>
              <label class="required">*</label>
              <input
                type="text"
                name="itemCode"
                class="form-control"
                v-model="Obj.itemCode"
                v-validate="'required'"
                data-vv-scope="RoleValidation"
                :data-vv-as="$t('itemCode')"
                :maxlength="$store.getters.getMaxLength.length40"
                autocomplete="off"
              />
              <div
                class="help-block"
                v-if="errors.has('RoleValidation.itemCode')"
              >{{ errors.first('RoleValidation.itemCode') }}</div>
            </div>
          </div>
        </div>

        <div>
          <button v-if="checkActions('Insert') || checkActions('Edit')" class="btn btn-primary mt-3" v-on:click="sendForm()">
            <i class="fa fa-save"></i>
            {{$t("Save")}}
          </button>
        </div>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>


<script type="text/javascript">
import { checkRoles } from "../../shared/utils";

export default {
  data() {
    return {
      show: true,
      fullscreenLoading: false,
      Obj: {
        id:"",
        itemName: "",
        itemCode: ""
      },

      Id: this.$route.params.Id,
      checkedPrivilegesKeys: [],
      defaultProps: {
        children: "chilldrenPrivilages",
        label: "privilageKey"
      }
    };
  },

  methods: {
    checkActions(roleName) {
      return checkRoles("Manual Item", roleName);
    },
    clearAll() {
      this.Obj = {
        id:"",
        itemName: "",
        itemCode: ""
      };
    },

    getItemInfoFromService: function() {
      this.loading = true;
      this.fullscreenLoading = true;
      var urlStr = this.$store.getters.serverURI + "api/TenderManualItems/" + this.Id;

      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.fullscreenLoading = false;
            this.Obj = data.body;
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
            if (this.Id) {
              this.Obj.Id = this.Id
              this.fullscreenLoading = true;
              var urlStr = this.$store.getters.serverURI + "api/TenderManualItems";
              this.$http
                .put(urlStr, this.Obj, {
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
                    this.$router.push({ path: "/tenderItems/list" });
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
            } else {
              this.fullscreenLoading = true;
              var urlStr = this.$store.getters.serverURI + "api/TenderManualItems";
              this.$http
                .post(urlStr, this.Obj, {
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
                    this.clearAll();
                    this.$router.push({ path: "/tenderItems/list" });
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
        }
      });
      this.isValid = true;
    }
  },

  created: function() {
      if(this.Id){
        this.getItemInfoFromService();
      }
  }
};
</script>