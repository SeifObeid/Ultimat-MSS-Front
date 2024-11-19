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
            <router-link :to="{ name: 'Items Management'}" class="btn btn-secondary">
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
          <div class="col-md-6">
            <div class="form-group" :class="{'has-error':errors.has('RoleValidation.principles')}">
              <label class="col-form-label">{{$t("principles")}}</label>
              <label class="required">*</label>
              <el-select
                  v-model="Obj.principalCode"
                  name="principles"
                  filterable
                  clearable
                  v-validate="'required'"
                  data-vv-scope="RoleValidation">
                  <el-option
                    v-for="item in principals"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                    </el-option>
                </el-select>
              <div
                class="help-block"
                v-if="errors.has('RoleValidation.principles')"
              >{{ errors.first('RoleValidation.principles') }}</div>
            </div>
          </div>
           <div class="col-md-6" v-if="Obj.principalCode == -1">
            <div class="form-group" :class="{'has-error':errors.has('RoleValidation.principlesName')}">
              <label class="col-form-label">{{$t("principlesName")}}</label>
              <label class="required">*</label>
              <input
                type="text"
                name="principlesName"
                class="form-control"
                v-model="Obj.otherName"
                v-validate="'required'"
                data-vv-scope="RoleValidation"
                :data-vv-as="$t('itemCode')"
               :maxlength="$store.getters.getMaxLength.length40"
                autocomplete="off"/>
              <div
                class="help-block"
                v-if="errors.has('RoleValidation.principlesName')"
              >{{ errors.first('RoleValidation.principlesName') }}</div>
            </div>
          </div>

          <!-- <div class="col-md-6">
              <div class="form-group" :class="{'has-error':errors.has('RoleValidation.Currency')}">
              <label class="col-form-label">{{$t("Currency")}}</label>
              <label class="required">*</label>
                        <el-select
                          v-model="Obj.currency"
                          v-validate="'required'"
                          :data-vv-as="$t('Currency')"
                          data-vv-scope="RoleValidation"
                          name="Currency"
                          :placeholder="$t('Select')"
                          clearable
                          filterable
                          class="full-width"
                        >
                          <el-option
                            v-for="option in currenciesList"
                            v-bind:value="option.code"
                            :label="option.name"
                            v-bind:key="option.code"
                          ></el-option>
                        </el-select>
              <div
                class="help-block"
                v-if="errors.has('RoleValidation.Currency')"
              >{{ errors.first('RoleValidation.Currency') }}</div>
              </div>

            </div> -->

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
      currenciesList: [],
      principals:[],
      show: true,
      fullscreenLoading: false,
      Obj: {
        id:"",
        itemName: "",
        itemCode: "",
        principalCode:"",
        otherName:"",
        // currency:""
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
    FillAllCurrencies: function() {
      var urlStr = this.$store.getters.serverURI + "api/Item/GetAllCurrencies";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.currenciesList = data.body;
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
    itemNameChanged() {
      
        var urlStr =
          this.$store.getters.serverURI +
          "api/Item/GetByCodeOrName?name=" +
          this.Obj.itemName;

        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function(data) {
              if(data)
                this.Obj.principalCode = data.body.principalCode;
              else
                this.Obj.principalCode = ''

            },
            function() {
              this.Obj.principalCode = ''
              // this.$message({
              //   showClose: true,
              //   duration: this.$store.getters.getMessagesDuration,
              //   type: "error",
              //   message: error.body.message
              // });
            }
          );
     
    },
    getPrincipalNames() {
      var urlStr =
        this.$store.getters.serverURI + "api/ItemsGroup/GetAllItemPrinicipals?getAllGroups=true";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.principals = data.body;
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
      var urlStr = this.$store.getters.serverURI + "api/ManualItems/" + this.Id;

      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.fullscreenLoading = false;
            this.Obj = data.body;
          },
          function() {
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
            var urlStr;
            if (this.Id) {
              this.Obj.Id = this.Id
              this.fullscreenLoading = true;
              urlStr = this.$store.getters.serverURI + "api/ManualItems";
              this.$http
                .put(urlStr, this.Obj, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
                })
                .then(
                  () => {
                    this.fullscreenLoading = false;
                    this.$message({
                      showClose: true,
                      duration: this.$store.getters.getMessagesDuration,
                      type: "success",
                      message: this.$t("UpdatedSuccessfully")
                    });
                    this.$router.push({ path: "/items/list" });
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
              urlStr = this.$store.getters.serverURI + "api/ManualItems";
              this.$http
                .post(urlStr, this.Obj, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
                })
                .then(
                  () => {
                    this.fullscreenLoading = false;
                    this.$message({
                      showClose: true,
                      duration: this.$store.getters.getMessagesDuration,
                      type: "success",
                      message: this.$t("AddedSuccessfully")
                    });
                    this.clearAll();
                    this.$router.push({ path: "/items/list" });
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
      this.FillAllCurrencies();
      this.getPrincipalNames()
      if(this.Id){
        this.getItemInfoFromService();
      }
  }
};
</script>