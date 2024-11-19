<template>
  <b-card
    class="card card-accent-primary"
    no-body
    v-if="show"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div slot="header">
      <span>{{$t('Configuration')}}</span>
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
            <router-link :to="{ name: 'ItemsGroupList'}" class="btn btn-secondary">
              <i class="fa fa-arrow-left"></i>
              {{$t("BackToList")}}
            </router-link>
            <button
              v-if="GroupId"
              class="btn csubmit ml-2 pull-right"
              variant="primary"
              @click="Excel()"
            >
              <i class="fa fa-file-excel-o"></i>
              Export to Excel
            </button>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4">
            <b-form-group :class="{'has-error':errors.has('ItemsGroupValidation.principal')}">
              <label class="col-form-label" md="4">{{$t('PrincipalName')}}</label>
              <label class="required">*</label>

              <el-select
                v-model="ItemsGroupObj.principalCode"
                name="principal"
                filterable
                clearable
                v-bind:placeholder="$t('Select')"
                v-validate="'required'"
                :data-vv-as="'principal name'"
                data-vv-scope="ItemsGroupValidation"
                @change="onPrincipalChange()"
              >
                <el-option
                  v-for="item in principals"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>

              <div class="help-block" v-if="errors.has('ItemsGroupValidation.principal')">
                <label class="mt-1">{{ errors.first('ItemsGroupValidation.principal') }}</label>
              </div>
            </b-form-group>
          </div>

          <div class="col-md-4">
            <b-form-group :class="{'has-error':errors.has('ItemsGroupValidation.categoryCode')}">
              <label class="col-form-label" for="categoryCode" cols="4">{{$t('categoryCode')}}</label>

              <label class="required">*</label>

              <b-form-input
                id="categoryCode"
                v-model="ItemsGroupObj.category"
                name="categoryCode"
                v-validate="'required'"
                :data-vv-as="'category'"
                data-vv-scope="ItemsGroupValidation"
                autocomplete="off"
              ></b-form-input>

              <div
                class="help-block"
                v-if="errors.has('ItemsGroupValidation.categoryCode')"
              >{{ errors.first('ItemsGroupValidation.categoryCode') }}</div>
            </b-form-group>
          </div>

          <div class="col-md-4">
            <b-form-group :class="{'has-error':errors.has('ItemsGroupValidation.modelCode')}">
              <label class="col-form-label" for="modelCode" cols="4">{{$t('modelCode')}}</label>

              <label class="required">*</label>

              <b-form-input
                id="modelCode"
                v-model="ItemsGroupObj.model"
                name="modelCode"
                v-validate="'required'"
                :data-vv-as="'modelCode'"
                data-vv-scope="ItemsGroupValidation"
                autocomplete="off"
              ></b-form-input>

              <div
                class="help-block"
                v-if="errors.has('ItemsGroupValidation.modelCode')"
              >{{ errors.first('ItemsGroupValidation.modelCode') }}</div>
            </b-form-group>
          </div>
          <div class="col-md-4">
            <b-form-group :class="{'has-error':errors.has('ItemsGroupValidation.tenderReference')}">
              <label class="col-form-label" for="tenderReference" cols="4">{{$t('tenderReference')}}</label>

              <b-form-input
                id="tenderReference"
                v-model="ItemsGroupObj.tenderReference"
                name="tenderReference"
                autocomplete="off"
              ></b-form-input>

              <div
                class="help-block"
                v-if="errors.has('ItemsGroupValidation.tenderReference')"
              >{{ errors.first('ItemsGroupValidation.tenderReference') }}</div>
            </b-form-group>
          </div>
          <!-- 
          <div class="col-md-3">
            <b-form-group :class="{'has-error':errors.has('ItemsGroupValidation.groupName')}">
              <label class="col-form-label" for="groupName" cols="4">{{$t('itemGroupName')}}</label>

              <label class="required">*</label>

              <b-form-input
                id="groupName"
                v-model="ItemsGroupObj.groupName"
                name="groupName"
                v-validate="'required'"
                :data-vv-as="'items group name'"
                data-vv-scope="ItemsGroupValidation"
                autocomplete="off"
              ></b-form-input>

              <div
                class="help-block"
                v-if="errors.has('ItemsGroupValidation.groupName')"
              >{{ errors.first('ItemsGroupValidation.groupName') }}</div>
            </b-form-group>
          </div>-->
        </div>

        <div class="row mt-4">
          <div class="col-md-8">
            <div class="form-group">
              <h5>{{$t('MainConfig')}}</h5>
            </div>
          </div>

          <div class="col-md-4 mb-1">
            <button
              v-if="ItemsGroupObj.principalCode != ''"
              type="button"
              class="btn btn-secondary float-right mb-1"
              @click="isOptional=false;newMainConfigDialoge()"
            >
              <i class="fa fa-plus-square-o"></i>
              {{$t("MainConfig")}}
            </button>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <table class="table table-bordered table-striped table-sm">
              <thead>
                <tr>
                  <th scope="col">{{$t('configurationName')}}</th>
                  <th scope="col" class="action-column text-center" width="10%">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in ItemsGroupObj.itemGroupMainConfig" v-bind:key="index">
                  <td>{{item.name}}</td>
                  <td class="action-column">
                    <a :title="$t('Copy')" class="text-primary" v-on:click="copy(item);">
                      <i class="fa fa-copy"></i>
                    </a>
                    <a
                      :title="$t('Edit')"
                      class="text-primary"
                      v-on:click="mainConfigDetails(index);"
                    >
                      <i class="fa fa-edit"></i>
                    </a>
                    <a
                      :title="$t('delete')"
                      class="text-danger ml-1"
                      v-on:click="deleteFromMain(index)"
                    >
                      <i class="fa fa-trash"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="row">
          <div class="col-md-10">
            <div class="form-group">
              <h5>{{$t('OptionalItems')}}</h5>
            </div>
          </div>

          <div class="col-md-2 mb-1">
            <button
              v-if="ItemsGroupObj.principalCode != ''"
              type="button"
              class="btn btn-secondary float-right mb-1"
              @click="isOptional=true;newMainConfigDialoge()"
            >
              <i class="fa fa-plus-square-o"></i>
              {{$t("Item")}}
            </button>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <table class="table table-bordered table-striped table-sm">
              <thead>
                <tr>
                  <th scope="col" width="25%">{{$t('ItemCode')}}</th>
                  <th scope="col">{{$t('ItemName')}}</th>
                  <th scope="col" class="action-column text-center" width="5%">Action</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in ItemsGroupObj.itemGroupOptionalItem" v-bind:key="index">
                  <td>{{item.itemCode}}</td>
                  <td>{{item.itemName}}</td>
                  <td class="action-column">
                    <a
                      :title="$t('delete')"
                      class="text-danger"
                      v-on:click="deleteFromOption(index)"
                      style="margin-left:3px"
                    >
                      <i class="fa fa-trash"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <button class="btn btn-primary" v-on:click="addItemsGroup()">
            <i class="fa fa-save"></i>
            {{$t("Save")}}
          </button>
        </div>

        <el-dialog
          :title="isOptional?$t('optionalItem'):$t('NewMainConfig')"
          :visible="dialogMainConfigVisible"
          :show-close="false"
          :close-on-press-escape="false"
          :destroy-on-close="false"
          :width="isOptional?'50%' : '70%'"
        >
          <div class="row">
            <div v-if="!isOptional" :class="{'col-md-4':!isOptional}">
              <b-form-group :class="{'has-error':errors.has('mainConfigValidation.name')}">
                <label class="col-form-label" cols="4">{{$t('configurationName')}}</label>
                <label class="required">*</label>

                <b-form-input
                  id="name"
                  v-model="name"
                  name="name"
                  v-validate="'required'"
                  :data-vv-as="'name'"
                  data-vv-scope="mainConfigValidation"
                  autocomplete="off"
                ></b-form-input>

                <div
                  class="help-block"
                  v-if="errors.has('mainConfigValidation.name')"
                >{{ errors.first('mainConfigValidation.name') }}</div>
              </b-form-group>
            </div>
            <div :class="[!isOptional ? 'col-md-6' : 'col-md-10']">
              <b-form-group>
                <label class="col-form-label" cols="4">{{$t('Item')}}</label>
                <el-select
                  remote
                  reserve-keyword
                  :remote-method="remoteMethodItemsName"
                  :loading="loadingAccount"
                  v-model="selectedItemsList"
                  filterable
                  class="full-width padding-3"
                  multiple
                  value-key="code"
                  collapse-tags
                >
                  <el-option 
                    v-for="item in systemItemsList"
                    :label="item.codeAndName"
                    :value="item"
                    :key="item.codeAndName"
                  ></el-option>

                  <template slot="append">.com</template>
                </el-select>
              </b-form-group>
            </div>
            <div class="col-md-2">
              <b-form-group>
                <button
                  type="button"
                  class="btn btn-secondary"
                  style="margin-top:35px"
                  @click="addSelectedItems()"
                >
                  <i class="fa fa-plus-square-o"></i>
                  {{$t("Item")}}
                </button>
              </b-form-group>
            </div>
          </div>
          <br />
          <div class="row">
            <div class="col-md-12">
              <table class="table table-bordered table-striped table-sm">
                <thead>
                  <tr>
                    <th scope="col" width="25%">{{$t('ItemCode')}}</th>
                    <th scope="col">{{$t('ItemName')}}</th>
                    <th scope="col" class="action-column text-center" width="15%">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in itemGroupMainConfigItems" v-bind:key="index">
                    <td>{{item.itemCode}}</td>
                    <td>{{item.itemName}}</td>
                    <td class="action-column config-btn">
                      <a
                        :title="$t('delete')"
                        class="text-danger"
                        v-on:click="deleteFromItems(index)"
                      >
                        <i class="fa fa-trash"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <button class="btn btn-info" type="button" @click="addMainConfig()">
              <i class="fa fa-save"></i>
              {{$t("Update")}}
            </button>

            <button type="button" class="btn btn-secondary ml-1" @click="cancelItem()">
              <i class="fa fa-ban"></i>
              {{$t("Cancel")}}
            </button>
          </span>
        </el-dialog>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>


<script type='text/javascript'>
import axios from "axios";

export default {
  data() {
    return {
      groupsCount:[],
      type: "",
      loadingAccount: false,
      show: true,
      fullscreenLoading: false,
      code: "",
      name: "",
      itemCode: "",
      itemName: "",
      principals: [],
      categories: [],
      models: [],
      configOptions: [],
      ItemList: [],
      selectedItems: [],
      itemGroupMainConfigItems: [],
      enableCategory: false,
      enableModel: false,
      enableConfig: false,
      isOptional: false,
      dialogMainConfigVisible: false,
      dialogItemVisible: false,
      mainConfigIndex: -1,
      selectAll: false,
      formLabelWidth: "120px",
      selectedItemsList: [],
      systemItemsList: [],
      showConfirm: true,
      copyNo: 0,
      ItemsGroupObj: {
        groupName: "",
        principalCode: "",
        category: "",
        model: "",
        tenderReference: "",
        isActive: true,
        itemGroupMainConfig: [],
        itemGroupOptionalItem: []
      },

      ItemsGroupObjEdit: {
        id: "",
        groupName: "",
        principalCode: "",
        category: "",
        model: "",
        tenderReference: "",
        itemGroupMainConfig: [],
        itemGroupOptionalItem: []
      },

      GroupId: this.$route.params.GroupId,
      withoutConfirm: false,
    };
  },
  beforeRouteLeave (to, from , next) {
      // debugger
      
        var groupsCount2=[]
        this.ItemsGroupObj.itemGroupMainConfig.forEach(element => {
          groupsCount2.push(element.itemGroupMainConfigItems.length)
        });
        groupsCount2.push(this.ItemsGroupObj.itemGroupOptionalItem.length)
        var isEqualFlag= this.isEqual(this.groupsCount, groupsCount2)
      
      
        if(!(isEqualFlag||this.withoutConfirm)){
          const h = this.$createElement;
          this.$msgbox({
            title: this.$t("Confirm"),
            message: h("p", null, [
              h("span", null, this.$t("ConfirmLeave"))
            ]),
            showCancelButton: true,
            confirmButtonText: this.$t("Leave"),
            cancelButtonText: this.$t("Stay"),
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                next();
                done();
              } else {
                done();
              }
            }
          })
        }else{
          this.withoutConfirm = false;
          next()
        }
      
  },
  computed: {
    filteredList() {
      return this.ItemList.filter(item => {
        return item.code.toLowerCase().includes(this.itemCode.toLowerCase());
      });
    }
  },

  update() {},

  methods: {
    isEqual(arr1,arr2){
        // Check if the arrays are the same length
        if (arr1.length !== arr2.length) return false;

        // Check if all items exist and are in the same order
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true
    },
    cancelItem() {
      this.dialogMainConfigVisible = true;
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
            this.dialogMainConfigVisible = false;
            done();
          } else {
            this.dialogMainConfigVisible = true;
            done();
          }
        }
      });
    },
    Excel() {
      let urlStr =
        this.$store.getters.serverURI +
        "api/itemsGroup/" +
        this.GroupId +
        "/Export";

      axios({
        method: "post",
        url: urlStr,
        headers: this.$store.getters.tokenAuthonticationHeaderObj,
        responseType: "blob"
      }).then(response => {
        this.fullscreenLoading = false;
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        var fileName = "Items_group_" + this.GroupId;
        fileLink.href = fileURL;
        fileLink.setAttribute("download", fileName + ".xlsx");
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
    remoteMethodItemsName: function(query) {
      if (query !== "") {
        this.loadingAccount = true;
        var urlStr =
          this.$store.getters.serverURI +
          "api/item/GetAllItems?PageIndex=" +
          1 +
          "&PageSize=" +
          this.$store.getters.getReturnPage +
          "&name=" +
          query +
          "&code=" +
          query ;
          // "&principalCode=" +
          // this.ItemsGroupObj.principalCode;
        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function(data) {
              this.systemItemsList = data.body;
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
      } else this.systemItemsList = [];
    },
    getRemoteItemsByName(qurey) {
      var urlStr =
        this.$store.getters.serverURI + "api/Item/GetAllItems?name=" + qurey;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })

        .then(
          function(data) {
            this.systemItemsList = data.body;
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
    getPrincipalNames() {
      var urlStr =
        this.$store.getters.serverURI + "api/ItemsGroup/GetItemPrinicipals";

      this.$http

        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })

        .then(
          function(data) {
            this.principals = data.body;
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
    getCategoryNames() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/ItemsGroup/GetAllItemCategories/" +
        this.ItemsGroupObj.principalCode;

      this.$http

        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })

        .then(
          function(data) {
            this.categories = data.body;
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
    getModelNames() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/ItemsGroup/GetAllItemModels/" +
        this.ItemsGroupObj.category;

      this.$http

        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })

        .then(
          function(data) {
            this.models = data.body;
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
    Reset() {
      this.itemCode = "";
      this.itemName = "";

      // this.searchItemList();
    },
    addSelectedItems() {
      for (let i in this.selectedItemsList) {
        this.itemGroupMainConfigItems.push({
          itemCode: this.selectedItemsList[i].code,
          itemName: this.selectedItemsList[i].name
        });
      }
      this.selectedItemsList = [];
    },
    deleteOptionalItems(index, row) {
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
            this.ItemsGroupObj.itemGroupOptionalItem.splice(index, 1);
            done();
          } else {
            done();
          }
        }
      });
    },
    deleteFromMain(index) {
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
            if (this.GroupId) {
              if (this.copyNo > 1) {
                this.copyNo = this.copyNo - 1;
              } else {
                this.copyNo = 0;
              }
            }else{
               if (this.copyNo > 1) {
                this.copyNo = this.copyNo - 1;
              } else {
                this.copyNo = 0;
              }
            }
            this.ItemsGroupObj.itemGroupMainConfig.splice(index, 1);
            done();
          } else {
            done();
          }
        }
      });
    },
    deleteFromOption(index) {
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
            this.ItemsGroupObj.itemGroupOptionalItem.splice(index, 1);
            done();
          } else {
            done();
          }
        }
      });
    },
    mainConfigDetails(index) {
      this.isOptional = false;
      this.type = "";
      var item = this.ItemsGroupObj.itemGroupMainConfig[index];
      this.mainConfigIndex = index;
      this.code = item.code;
      this.name = item.name;
      this.itemGroupMainConfigItems = item.itemGroupMainConfigItems;
      this.dialogMainConfigVisible = true;
    },
    deleteFromItems(index) {
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
            this.itemGroupMainConfigItems.splice(index, 1);
            done();
          } else {
            done();
          }
        }
      });
    },
    handleSelectionChange(val) {
      this.selectedItems = val;
    },
    onPrincipalChange() {
      this.enableModel = false;
    },
    onCategoryChange() {
      if (this.ItemsGroupObj.category != "") {
        var urlStr =
          this.$store.getters.serverURI +
          "api/ItemsGroup/GetAllItemModels/" +
          this.ItemsGroupObj.category;

        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function(data) {
              this.models = data.body;
              this.enableModel = true;
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
      } else {
        this.enableModel = false;
      }
      this.ItemsGroupObj.model = "";
    },
    addMainConfig: function(e) {
      if (!this.isOptional) {
        this.$validator.validateAll("mainConfigValidation").then(result => {
          if (result) {
            if (this.mainConfigIndex != -1) {
              ///edit
              var item = this.ItemsGroupObj.itemGroupMainConfig[
                this.mainConfigIndex
              ];

              item.code = this.code;
              item.name = this.name;
              item.itemGroupMainConfigItems = this.itemGroupMainConfigItems;
              item.itemGroupMainConfigItems = item.itemGroupMainConfigItems;
              this.dialogMainConfigVisible = false;
            } else {
              this.copyNo = 0;
              this.ItemsGroupObj.itemGroupMainConfigItems = this.itemGroupMainConfigItems;
              this.ItemsGroupObj.itemGroupMainConfig.push({
                code: this.code,
                name: this.name,
                itemGroupMainConfigItems: this.itemGroupMainConfigItems
              });
              this.code = "";
              this.name = "";
              this.selectedItemsList = [];
              this.$validator.reset();
              this.dialogMainConfigVisible = false;
            }
          }
        });
      }

      if (this.isOptional) {
        this.itemGroupMainConfigItems.forEach(
          function(element) {
            this.ItemsGroupObj.itemGroupOptionalItem.push({
              itemCode: element.itemCode,
              itemName: element.itemName
            });
          }.bind(this)
        );
        this.dialogMainConfigVisible = false;
      }
    },
    copy(item) {
      var orignalName = "";
      this.mainConfigIndex = -1;
      this.copyNo++;
    
      var newObject = JSON.parse(JSON.stringify(item));

      if (item.name.includes(" copy")) {
        orignalName = item.name.substr(0, item.name.indexOf(" copy"));
      } else {
        orignalName = item.name;
      }

      let checkContainsCopyBefore = this.ItemsGroupObj.itemGroupMainConfig.filter(
        x => {
          let currentOriginalName = x.name.substr(0, x.name.indexOf(" copy"));
          if (orignalName === currentOriginalName) {
            return x.name.includes(" copy");
          } else {
            return [];
          }
        }
      );

      if (this.GroupId) {
        let checkContainsCopyBefore = this.ItemsGroupObj.itemGroupMainConfig.filter(
          x => {
            let currentOriginalName = x.name.substr(0, x.name.indexOf(" copy"));
            return (
              x.name.includes(" copy") && orignalName === currentOriginalName
            );
          }
        );
        this.copyNo = checkContainsCopyBefore.length;
        this.copyNo++;
        newObject.id = 0;
      }

      if (checkContainsCopyBefore.length > 0) {
        newObject.name = orignalName + " copy " + this.copyNo;
      } else {
        newObject.name = newObject.name + " copy " + this.copyNo;
      }

      this.ItemsGroupObj.itemGroupMainConfig.push(newObject);
    },
    newMainConfigDialoge() {
      this.errors.clear("mainConfigValidation");
      this.mainConfigIndex = -1;
      this.code = "";
      this.name = "";
      this.itemGroupMainConfigItems = [];
      this.ItemList = [];
      this.dialogMainConfigVisible = true;
      this.selectedItemsList = [];
      this.$validator.reset();
    },
    selectAllItems() {
      this.selectedItems = [];
      if (!this.selectAll) {
        for (let i in this.ItemList) {
          this.selectedItems.push(this.ItemList[i]);
        }
      }
    },
    clearAll() {
      this.ItemsGroupObj = {
        groupName: "",
        principalCode: "",
        category: "",
        model: "",
        tenderReference: "",
        isActive: true,
        itemGroupMainConfig: [],
        itemGroupOptionalItem: []
      };
    },
    addItemsGroup() {
      this.$validator.validateAll("ItemsGroupValidation").then(result => {
        if (result) {
          this.ItemsGroupObjEdit.id = this.ItemsGroupObj.id;
          this.ItemsGroupObjEdit.groupName = this.ItemsGroupObj.groupName;
          this.ItemsGroupObjEdit.principalCode = this.ItemsGroupObj.principalCode;
          this.ItemsGroupObjEdit.category = this.ItemsGroupObj.category;
          this.ItemsGroupObjEdit.model = this.ItemsGroupObj.model;
          this.ItemsGroupObjEdit.tenderReference = this.ItemsGroupObj.tenderReference;

          for (let i in this.ItemsGroupObj.itemGroupMainConfig) {
            var itemGroupMainConfigItemsEdit = [];

            for (let j in this.ItemsGroupObj.itemGroupMainConfig[i]
              .itemGroupMainConfigItems) {
              itemGroupMainConfigItemsEdit.push({
                id: this.ItemsGroupObj.itemGroupMainConfig[i]
                  .itemGroupMainConfigItems[j].id,

                itemName: this.ItemsGroupObj.itemGroupMainConfig[i]
                  .itemGroupMainConfigItems[j].itemName,

                itemCode: this.ItemsGroupObj.itemGroupMainConfig[i]
                  .itemGroupMainConfigItems[j].itemCode
              });
            }

            this.ItemsGroupObjEdit.itemGroupMainConfig.push({
              id: this.ItemsGroupObj.itemGroupMainConfig[i].id,
              name: this.ItemsGroupObj.itemGroupMainConfig[i].name,
              code: this.ItemsGroupObj.itemGroupMainConfig[i].code,
              itemGroupMainConfigItems: itemGroupMainConfigItemsEdit
            });
          }

          for (let i in this.ItemsGroupObj.itemGroupOptionalItem) {
            this.ItemsGroupObjEdit.itemGroupOptionalItem.push({
              id: this.ItemsGroupObj.itemGroupOptionalItem[i].id,
              itemName: this.ItemsGroupObj.itemGroupOptionalItem[i].itemName,
              itemCode: this.ItemsGroupObj.itemGroupOptionalItem[i].itemCode
            });
          }

          this.fullscreenLoading = true;

          var urlStr = this.$store.getters.serverURI + "api/ItemsGroup";

          if (this.GroupId) {
            this.$http
              .put(urlStr, this.ItemsGroupObj, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })

              .then(
                response => {
                  this.fullscreenLoading = false;
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "success",
                    message: this.$t("updatedSuccessfully")
                  });
                  this.clearAll();
                  this.withoutConfirm = true;
                  this.$router.push({
                    name: "ItemsGroupList"
                  });
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

            this.$http
              .post(urlStr, this.ItemsGroupObjEdit, {
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
                  this.withoutConfirm = true;
                  this.$router.push({
                    name: "ItemsGroupList"
                  });
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
    getItemsGroupFromService: function() {
      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI + "api/ItemsGroup/" + this.GroupId;

      this.$http

        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })

        .then(
          function(data) {
            this.fullscreenLoading = false;
            
            this.ItemsGroupObj = data.body;
            this.ItemsGroupObj.itemGroupMainConfig.forEach(element => {
                this.groupsCount.push(element.itemGroupMainConfigItems.length)
            });
            this.groupsCount.push(this.ItemsGroupObj.itemGroupOptionalItem.length)
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
  },

  created: function() {
    this.getPrincipalNames();
    // this.getRemoteItemsByName();
    if (this.GroupId) {
      this.enableCategory = true;
      this.enableModel = true;
      this.getItemsGroupFromService();
    }
  }
};
</script>