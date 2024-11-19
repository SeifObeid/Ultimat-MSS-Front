<template>
  <b-card class="card card-accent-primary" no-body v-if="show" v-loading.fullscreen.lock="fullscreenLoading">
    <div slot="header">
      <span v-if="!GroupId">{{$t("AddItemsGroupConfiguration")}}</span>
      <span v-if="GroupId>0">{{$t("EditItemsGroupConfiguration")}}</span>
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
            <router-link :to="{ name: 'calculationSheet'}" class="btn btn-secondary">
              <i class="fa fa-arrow-left"></i>
              {{$t("BackToList")}}
            </router-link>
          </div>
        </div>
        <br />

        <div class="row">
          <div class="col-md-6">
            <b-form-group :class="{'has-error':errors.has('ItemsGroupValidation.groupName')}">
              <label class="col-form-label" for="groupName" cols="4">{{$t('ItemsGroupName')}}</label>
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
          </div>

          <div class="col-md-6">
            <b-form-group :class="{'has-error':errors.has('ItemsGroupValidation.principal')}">
              <label class="col-form-label" for="principal" md="4">{{$t('PrincipalName')}}</label>
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
        </div>
        <div class="row">
          <div class="col-md-6">
            <b-form-group :class="{'has-error':errors.has('ItemsGroupValidation.category')}">
              <label class="col-form-label" for="category" md="4">{{$t('Category')}}</label>
              <label class="required">*</label>
              <el-select
                v-model="ItemsGroupObj.categoryCode"
                name="category"
                filterable
                clearable
                v-bind:placeholder="$t('Select')"
                v-validate="'required'"
                :data-vv-as="'category'"
                data-vv-scope="ItemsGroupValidation"
                :disabled="!enableCategory"
                @change="onCategoryChange()"
              >
                <el-option
                  v-for="item in categories"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>

              <div class="help-block" v-if="errors.has('ItemsGroupValidation.category')">
                <label class="mt-1">{{ errors.first('ItemsGroupValidation.category') }}</label>
              </div>
            </b-form-group>
          </div>

          <div class="col-md-6">
            <b-form-group :class="{'has-error':errors.has('ItemsGroupValidation.model')}">
              <label class="col-form-label" for="model" md="4">{{$t('Model')}}</label>
              <label class="required">*</label>

              <el-select
                v-model="ItemsGroupObj.modelCode"
                name="model"
                filterable
                clearable
                v-bind:placeholder="$t('Select')"
                v-validate="'required'"
                :data-vv-as="'model'"
                data-vv-scope="ItemsGroupValidation"
                :disabled="!enableModel"
              >
                <el-option
                  v-for="item in models"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>

              <div class="help-block" v-if="errors.has('ItemsGroupValidation.model')">
                <label class="mt-1">{{ errors.first('ItemsGroupValidation.model') }}</label>
              </div>
            </b-form-group>
          </div>
        </div>

        <div class="row">
          <div class="col-md-10">
            <div class="form-group">
              <h4>{{$t('MainConfig')}}</h4>
            </div>
          </div>
          <div class="col-md-2">
            <button
              type="button"
              class="btn btn-secondary float-right"
              @click="newMainConfigDialoge()"
            >
              <i class="fa fa-plus-square-o"></i>
              {{$t("NewMainConfig")}}
            </button>
          </div>

          <div class="col-md-12">
            <table class="table table-bordered table-striped dataTable">
              <thead>
                <tr>
                  <th scope="col">{{$t('ItemCode')}}</th>
                  <th scope="col">{{$t('ItemName')}}</th>
                  <th scope="col" class="action-column"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in ItemsGroupObj.itemGroupMainConfig" v-bind:key="index">
                  <td>{{item.code}}</td>
                  <td>{{item.name}}</td>
                  <td class="action-column">
                    <a
                      :title="$t('Edit')"
                      class="text-primary"
                      v-on:click="mainConfigDetails(index);"
                    >
                      <i class="fa fa-edit"></i>
                    </a>
                    <a
                      :title="$t('delete')"
                      class="text-danger"
                      v-on:click="ItemsGroupObj.itemGroupMainConfig.splice(index, 1);"
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

        <br />
        <br />

        <br />
        <br />

        <div class="row">
          <div class="col-md-10">
            <div class="form-group">
              <h4>{{$t('OptionalItems')}}</h4>
            </div>
          </div>
          <div class="col-md-2">
            <button
              type="button"
              class="btn btn-secondary float-right"
              @click="isOptional=true;showItemsdialog()"
            >
              <i class="fa fa-plus-square-o"></i>
              {{$t("AddItem")}}
            </button>
          </div>

          <div class="col-md-12">
            <table class="table table-bordered table-striped dataTable">
              <thead>
                <tr>
                  <th scope="col">{{$t('ItemCode')}}</th>
                  <th scope="col">{{$t('ItemName')}}</th>
                  <th scope="col" class="action-column"></th>
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
                      v-on:click="ItemsGroupObj.itemGroupOptionalItem.splice(index, 1);"
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

        <el-dialog :title="$t('NewConfig')" :visible.sync="dialogMainConfigVisible">
          <div class="row">
            <div class="col-md-6">
              <b-form-group :class="{'has-error':errors.has('mainConfigValidation.code')}">
                <label class="col-form-label" for="code" cols="4">{{$t('ItemCode')}}</label>
                <label class="required">*</label>

                <b-form-input
                  id="code"
                  v-model="code"
                  name="code"
                  v-validate="'required'"
                  :data-vv-as="'config node'"
                  data-vv-scope="mainConfigValidation"
                  autocomplete="off"
                ></b-form-input>
                <div
                  class="help-block"
                  v-if="errors.has('mainConfigValidation.code')"
                >{{ errors.first('mainConfigValidation.code') }}</div>
              </b-form-group>
            </div>
            <div class="col-md-6">
              <b-form-group :class="{'has-error':errors.has('mainConfigValidation.name')}">
                <label class="col-form-label" for="name" b-cols="4">{{$t('ItemName')}}</label>
                <label class="required">*</label>

                <b-form-input
                  id="name"
                  v-model="name"
                  name="name"
                  v-validate="'required'"
                  :data-vv-as="'config name'"
                  data-vv-scope="mainConfigValidation"
                  autocomplete="off"
                ></b-form-input>
                <div
                  class="help-block"
                  v-if="errors.has('mainConfigValidation.name')"
                >{{ errors.first('mainConfigValidation.name') }}</div>
              </b-form-group>
            </div>
            <div class="col-md-12">
              <button
                type="button"
                class="btn btn-secondary"
                style="margin-bottom:5px"
                @click="isOptional=false;showItemsdialog()"
              >
                <i class="fa fa-plus-square-o"></i>
                {{$t("AddItem")}}
              </button>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <table class="table table-bordered table-striped dataTable">
                <thead>
                  <tr>
                    <th scope="col">{{$t('ItemCode')}}</th>
                    <th scope="col">{{$t('ItemName')}}</th>
                    <th scope="col" class="action-column"></th>
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
                        v-on:click="itemGroupMainConfigItems.splice(index, 1);"
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

          <span slot="footer" class="dialog-footer">
            <button class="btn btn-info" type="button" @click="addMainConfig()">
              <i class="fa fa-save"></i>
              {{$t("Save")}}
            </button>
            <button
              type="button"
              style="margin-left:3px"
              class="btn btn-secondary"
              @click="dialogMainConfigVisible = false"
            >
              <i class="fa fa-ban"></i>
              {{$t("Cancel")}}
            </button>
          </span>
        </el-dialog>

        <!-- Form -->
        <el-dialog :title="$t('ItemList')" :visible.sync="dialogItemVisible">
          <el-form>
            <div class="row">
              <div class="col-md-6">
                <b-form-group
                  :label="$t('ItemCode')"
                  label-for="itemCode"
                  :label-cols="4"
                  :horizontal="true"
                >
                  <b-form-input id="itemCode" v-model="itemCode" autocomplete="off"></b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-6">
                <b-form-group
                  :label="$t('ItemName')"
                  label-for="itemName"
                  :label-cols="4"
                  :horizontal="true"
                >
                  <b-form-input id="itemName" v-model="itemName" autocomplete="off"></b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-12" style="margin-bottom:5px">
                <button
                  type="button"
                  style="margin-left:5px"
                  class="btn btn-secondary float-right"
                  @click="Reset()"
                >
                  <i class="fas fa-redo"></i>
                  {{$t("Reset")}}
                </button>
                <button type="button" class="btn btn-info float-right" @click="searchItemList()">
                  <i class="fa fa-search"></i>
                  {{$t("Search")}}
                </button>
              </div>
            </div>

            <!-- searchItemList -->
          </el-form>
          <div class="row">
            <div class="col-md-12">
              <table class="table table-bordered table-striped dataTable">
                <thead>
                  <tr>
                    <th scope="col">
                      <label class="form-checkbox">
                        <input type="checkbox" v-model="selectAll" @click="selectAllItems" />
                        <i class="form-icon"></i>
                      </label>
                    </th>
                    <th scope="col">{{$t('ItemCode')}}</th>
                    <th scope="col">{{$t('ItemName')}}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in ItemList"
                    v-bind:key="index"
                    @selection-change="handleSelectionChange"
                  >
                    <td width="3%">
                      <label class="form-checkbox">
                        <input type="checkbox" :value="item" v-model="selectedItems" />
                        <i class="form-icon"></i>
                      </label>
                    </td>
                    <td>{{item.code}}</td>
                    <td>{{item.name}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <button class="btn btn-info" type="button" @click="addItems()">{{$t("Select")}}</button>
            <button
              type="button"
              style="margin-left:3px"
              class="btn btn-secondary"
              @click="dialogItemVisible = false"
            >
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
export default {
  data() {
    return {
      fullscreenLoading:false,
      show: true,
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
      ItemsGroupObj: {
        groupName: "",
        principalCode: "",
        categoryCode: "",
        modelCode: "",
        isActive: true,
        itemGroupMainConfig: [],
        itemGroupOptionalItem: []
      },
      ItemsGroupObjEdit: {
        id: "",
        groupName: "",
        principalCode: "",
        categoryCode: "",
        modelCode: "",
        itemGroupMainConfig: [], //{id:'',name:'',code:'',itemGroupMainConfigItems: [{ id:'',itemCode:'',itemName:''}]}
        itemGroupOptionalItem: [] // {id:'',itemName:'',itemCode:''}
      },
      GroupId: this.$route.params.GroupId
    };
  },
  computed: {
    filteredList() {
      return this.ItemList.filter(item => {
        return item.code.toLowerCase().includes(this.itemCode.toLowerCase());
      });
    }
  },
  update() {
    //alert('update');
  },

  methods: {
    getPrincipalNames() {
      var urlStr =
        this.$store.getters.serverURI + "api/ItemsGroup/GetAllItemPrinicipals";
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
        this.ItemsGroupObj.categoryCode;
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
    showItemsdialog() {
      this.searchItemList();
      this.itemCode = "";
      this.itemName = "";
      this.selectAll = false;
      if (this.isOptional) {
        this.selectedItems = [];
        for (let i in this.ItemsGroupObj.itemGroupOptionalItem) {
          this.selectedItems.push({
            code: this.ItemsGroupObj.itemGroupOptionalItem[i].itemCode,
            name: this.ItemsGroupObj.itemGroupOptionalItem[i].itemName
          });
        }
      } else {
        if (this.mainConfigIndex == -1) {
          this.selectedItems = [];
        } else {
          var item = this.ItemsGroupObj.itemGroupMainConfig[
            this.mainConfigIndex
          ];
          this.selectedItems = [];
          for (let i in item.itemGroupMainConfigItems) {
            this.selectedItems.push({
              code: item.itemGroupMainConfigItems[i].itemCode,
              name: item.itemGroupMainConfigItems[i].itemName
            });
          }
        }
      }

      this.dialogItemVisible = true;
    },
    searchItemList() {
      //Get Items from API
      var urlStr = this.$store.getters.serverURI + "api/Item/GetAllItems?department=ME";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.ItemList = data.body.filter(item => {
              return (
                item.code.toLowerCase().includes(this.itemCode.toLowerCase()) &&
                item.name.toLowerCase().includes(this.itemName.toLowerCase())
              );
            });
            for (let i in this.ItemList) {
              this.ItemList[i] = {
                code: this.ItemList[i].code,
                name: this.ItemList[i].name
              };
            }
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
      this.searchItemList();
    },
    addItems() {
      this.dialogItemVisible = false;
      if (this.isOptional == true) {
        this.ItemsGroupObj.itemGroupOptionalItem = [];
        for (let i in this.selectedItems) {
          this.ItemsGroupObj.itemGroupOptionalItem.push({
            itemCode: this.selectedItems[i].code,
            itemName: this.selectedItems[i].name
          });
        }
        this.selectedItems = [];
      } else {
        this.itemGroupMainConfigItems = [];
        for (let i in this.selectedItems) {
          this.itemGroupMainConfigItems.push({
            itemCode: this.selectedItems[i].code,
            itemName: this.selectedItems[i].name
          });
        }
        this.selectedItems = [];
      }
    },
    deleteOptionalItems(index, row) {
      this.ItemsGroupObj.itemGroupOptionalItem.splice(index, 1);
    },
    handleSelectionChange(val) {
      this.selectedItems = val;
    },
    onPrincipalChange() {
      if (this.ItemsGroupObj.principalCode != "") {
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

              this.enableCategory = true;
            },
            function(error) {
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "error",
                message: this.$t("ErrorMessage")
              });
              //   alert(error);
            }
          );
      } else {
        this.enableCategory = false;
      }

      this.enableModel = false;
      this.ItemsGroupObj.categoryCode = "";
      this.ItemsGroupObj.modelCode = "";
    },
    onCategoryChange() {
      if (this.ItemsGroupObj.categoryCode != "") {
        var urlStr =
          this.$store.getters.serverURI +
          "api/ItemsGroup/GetAllItemModels/" +
          this.ItemsGroupObj.categoryCode;
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

      this.ItemsGroupObj.modelCode = "";
    },
    addMainConfig: function(e) {
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
          } else {
            this.ItemsGroupObj.itemGroupMainConfigItems = this.itemGroupMainConfigItems;
            this.ItemsGroupObj.itemGroupMainConfig.push({
              code: this.code,
              name: this.name,
              itemGroupMainConfigItems: this.itemGroupMainConfigItems
            });
          }
          this.dialogMainConfigVisible = false;
        }
      });
    },
    mainConfigDetails(index) {
      var item = this.ItemsGroupObj.itemGroupMainConfig[index];

      this.mainConfigIndex = index;
      this.code = item.code;
      this.name = item.name;
      this.itemGroupMainConfigItems = item.itemGroupMainConfigItems;
      this.dialogMainConfigVisible = true;
    },
    newMainConfigDialoge() {
      this.errors.clear("mainConfigValidation");
      this.mainConfigIndex = -1;
      this.code = "";
      this.name = "";
      this.itemGroupMainConfigItems = [];
      this.ItemList = [];
      this.dialogMainConfigVisible = true;
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
        categoryCode: "",
        modelCode: "",
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
          this.ItemsGroupObjEdit.categoryCode = this.ItemsGroupObj.categoryCode;
          this.ItemsGroupObjEdit.modelCode = this.ItemsGroupObj.modelCode;

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

          var urlStr = this.$store.getters.serverURI + "api/ItemsGroup";
          if (this.GroupId) {
            this.$http
              .put(urlStr, this.ItemsGroupObj, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                response => {
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "success",
                    message: this.$t("updatedSuccessfully")
                  });
                  this.clearAll();
                  this.$router.push({
                    path: "/calculationSheet/ItemsGroupList"
                  });
                },
                function(error) {
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "error",
                    message: error.body.message
                  });
                }
              );
          } else {
            this.$http
              .post(urlStr, this.ItemsGroupObjEdit, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                response => {
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "success",
                    message: this.$t("AddedSuccessfully")
                  });
                  this.clearAll();
                  //  this.$router.push({ path: "/RolesList" });
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
          }
        }
      });
    },
    getItemsGroupFromService: function() {
      this.fullscreenLoading=true
      var urlStr =
        this.$store.getters.serverURI + "api/ItemsGroup/" + this.GroupId;

      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.fullscreenLoading=false
            this.ItemsGroupObj = data.body;
            this.getCategoryNames();
            this.getModelNames();
          },
          function(error) {
            this.fullscreenLoading=false
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
  beforeCreate() {
    // this.getPrincipalNames();
  },
  created: function() {
    this.getPrincipalNames();
    if (this.GroupId) {
      this.enableCategory = true;
      this.enableModel = true;
      this.getItemsGroupFromService();
    }
  }
};
</script>