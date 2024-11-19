<template>
  <div>
    <b-card
      class="card card-accent-primary"
      no-body
      v-if="show"
      v-loading.fullscreen.lock="fullscreenLoading"
    >
      <div slot="header">
        <span v-if="!WorkflowId">{{$t("AddWorkflow")}}</span>
        <span v-if="WorkflowId>0">{{$t("EditWorkflow")}}</span>
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
              <router-link :to="{ name: 'tender-workflow-definition'}" class="btn btn-secondary">
                <i class="fa fa-arrow-left"></i>
                {{$t("BackToList")}}
              </router-link>
            </div>
          </div>
          <br />

          <div class="row">
            <div class="col-md-6">
              <b-form-group :class="{'has-error':errors.has('WorkflowValidation.workflowName')}">
                <label class="col-form-label" for="workflowName" cols="4">{{$t('WorkflowName')}}</label>
                <label class="required">*</label>

                <b-form-input
                  id="workflowName"
                  v-model="WorkflowObj.name"
                  name="workflowName"
                  v-validate="'required'"
                  :data-vv-as="'workflow name'"
                  data-vv-scope="WorkflowValidation"
                  autocomplete="off"
                ></b-form-input>
                <div class="help-block" v-if="errors.has('WorkflowValidation.workflowName')">
                  {{
                  errors.first('WorkflowValidation.workflowName') }}
                </div>
              </b-form-group>
            </div>

            <div class="col-md-6">
              <b-form-group :class="{'has-error':errors.has('WorkflowValidation.type')}">
                <label class="col-form-label" for="type" md="4">{{$t('Type')}}</label>
                <label class="required">*</label>

                <el-select
                  v-model="WorkflowObj.type"
                  name="type"
                  filterable
                  clearable
                  v-bind:placeholder="$t('Select')"
                  v-validate="'required'"
                  :data-vv-as="'type name'"
                  data-vv-scope="WorkflowValidation"
                >
                  <el-option
                    v-for="item in types"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>

                <div class="help-block" v-if="errors.has('WorkflowValidation.type')">
                  <label class="mt-1">{{ errors.first('WorkflowValidation.type') }}</label>
                </div>
              </b-form-group>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <b-form-group
                :class="{'has-error':errors.has('WorkflowValidation.workflowDescription')}"
              >
                <label
                  class="col-form-label"
                  for="workflowDescription"
                  cols="4"
                >{{$t('workflowDescription')}}</label>
                <textarea
                  name="Description"
                  class="form-control"
                  v-model="WorkflowObj.description"
                />
              </b-form-group>
            </div>

            <div class="col-md-6">
              <div
                class="form-group"
                :class="{'has-error':errors.has('WorkflowValidation.Active')}"
              >
                <label class="col-form-label" for="Status" cols="4">{{$t('Status')}}</label>
                <label class="required">*</label>
                <div>
                  <div class="radio-custom font-size-default radio-custom-inline">
                    <b-button-toolbar aria-label="Toolbar with buttons group">
                      <b-form-radio-group
                        class="mr-3"
                        id="status"
                        buttons
                        button-variant="outline-secondary"
                        v-model="WorkflowObj.status"
                        name="status"
                      >
                        <b-form-radio class="mx-0" value="true">{{$t("Active")}}</b-form-radio>
                        <b-form-radio class="mx-0" value="false">{{$t("InActive")}}</b-form-radio>
                      </b-form-radio-group>
                    </b-button-toolbar>
                  </div>
                  <div class="help-block" v-if="errors.has('WorkflowValidation.Active')">
                    {{
                    errors.first('WorkflowValidation.Active') }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <el-dialog :title="$t('AddStep')" :visible="dialogStepsVisible"
          :show-close="false"
          :close-on-press-escape="false"
          :destroy-on-close="false">
            <div class="row">
              <div class="col-md-6">
                <b-form-group :class="{'has-error':errors.has('stepsValidation.StepName')}">
                  <label class="col-form-label" for="StepName" cols="4">{{$t('StepName')}}</label>
                  <label class="required">*</label>
                  <b-form-input
                    id="StepName"
                    v-model="StepName"
                    name="StepName"
                    v-validate="'required'"
                    :data-vv-as="'step name'"
                    data-vv-scope="stepsValidation"
                    autocomplete="off"
                  ></b-form-input>
                  <div
                    class="help-block"
                    v-if="errors.has('stepsValidation.StepName')"
                  >{{ errors.first('stepsValidation.StepName') }}</div>
                </b-form-group>
              </div>
              <div class="col-md-6">
                <b-form-group :class="{'has-error':errors.has('stepsValidation.StepType')}">
                  <label class="col-form-label" for="StepType" b-cols="4">{{$t('StepType')}}</label>
                  <label class="required">*</label>
                  <el-select
                    v-model="StepType"
                    id="StepType"
                    name="StepType"
                    filterable
                    clearable
                    v-bind:placeholder="$t('Select')"
                    v-validate="'required'"
                    :data-vv-as="'step type'"
                    data-vv-scope="stepsValidation"
                  >
                    <el-option
                      v-for="item in StepsTypes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>

                  <div class="help-block" v-if="errors.has('stepsValidation.StepType')">
                    <label class="mt-1">{{ errors.first('stepsValidation.StepType') }}</label>
                  </div>
                </b-form-group>
              </div>
            </div>

            <span slot="footer" class="dialog-footer">
              <button class="btn btn-info" type="button" @click="addSteps()">
                <i class="fa fa-save"></i>
                {{$t("Save")}}
              </button>
              <button
                type="button"
                style="margin-left:3px"
                class="btn btn-secondary"
                @click="cancelItem()"
              >
                <i class="fa fa-ban"></i>
                {{$t("Cancel")}}
              </button>
            </span>
          </el-dialog>

          <el-dialog :visible="dialogUsersVisible" 
          :show-close="false"
          :close-on-press-escape="false"
          :destroy-on-close="false">
            <span class="el-dialog__title_new" slot="title">{{$t('userroleslist')}}</span>

            <div class="row">
              <h6 class="col-md-12">{{$t("users")}}</h6>
              <div class="col-md-5">
                <div class="form-group">
                  <el-select
                    v-model="newUser"
                    name="type"
                    filterable
                    clearable
                    v-bind:placeholder="$t('Select')"
                    v-validate="'required'"
                    :data-vv-as="'user name'"
                  >
                    <el-option
                      v-for="item in shownUsers"
                      :key="item.id"
                      :label="item.userName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-md-3">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="addUserTolist()"
                >{{$t("AddUser")}}</button>
              </div>
            </div>
            <div class="row mt-1">
              <div class="col-md-12">
                <table class="table table-bordered table-striped dataTable mt-1">
                  <thead>
                    <tr>
                      <th scope="col" width="5%">#</th>
                      <th scope="col">{{$t('Name')}}</th>
                      <th scope="col" class="action-column text-center" width="15%">{{$t('Action')}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(user, index) in userList" v-bind:key="index">
                      <td>{{index+1}}</td>
                      <td>{{getUserName(user.userId)}}</td>
                      <td class="action-column text-center">
                        <a
                          :title="$t('delete')"
                          class="text-danger"
                          v-on:click="deleteUser(index);"
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
              <h6 class="col-md-12">{{$t("roles")}}</h6>
              <div class="col-md-5">
                <div class="form-group">
                  <el-select
                    v-model="newRole"
                    collapse-tags
                    v-validate="'required'"
                    :data-vv-as="$t('Role')"
                    name="Role"
                    :placeholder="$t('Select')"
                    clearable
                    filterable
                    class="full-width"
                  >
                    <el-option
                      v-for="option in shownRoles"
                      v-bind:value="option.id"
                      :label="option.name"
                      v-bind:key="option.id"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="col-md-3">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="addRoleTolist"
                >{{$t("AddRole")}}</button>
              </div>
            </div>
            <div class="row mt-1">
              <div class="col-md-12">
                <table class="table table-bordered table-striped dataTable mt-1">
                  <thead>
                    <tr>
                      <th scope="col" width="5%">#</th>
                      <th scope="col">{{$t('Name')}}</th>
                      <th scope="col" class="action-column text-center" width="15%">{{$t('Action')}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(role, index) in roleList" v-bind:key="index">
                      <td>{{index+1}}</td>
                      <td>{{getRoleName(role.roleId)}}</td>
                      <td class="action-column">
                        <a
                          :title="$t('delete')"
                          class="text-danger"
                          v-on:click="deleteRole(index);"
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
              <button class="btn btn-info" type="button" @click="saveUserAndRole">
                <i class="fa fa-save"></i>
                {{$t("Save")}}
              </button>
              <button
                type="button"
                style="margin-left:3px"
                class="btn btn-secondary"
                @click="cancelRole()"
              >
                <i class="fa fa-ban"></i>
                {{$t("Cancel")}}
              </button>
            </span>
          </el-dialog>

          <el-dialog :title="$t('ActionsList')" :visible="dialogAllActionsVisible"
          :show-close="false"
          :close-on-press-escape="false"
          :destroy-on-close="false">
            <div class="row">
              <div class="col-md-12">
                <button
                  type="button"
                  class="btn btn-secondary float-right"
                  style="margin-bottom:5px"
                  @click="AddEditAction(-1)"
                >
                  <i class="fa fa-plus-square-o"></i>
                  {{$t("NewAction")}}
                </button>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <table class="table table-bordered table-striped dataTable mt-1">
                  <thead>
                    <tr>
                      <th scope="col">{{$t('Name')}}</th>
                      <th scope="col">{{$t('Action')}}</th>
                      <th scope="col">{{$t('NextStep')}}</th>
                      <th scope="col" class="action-column text-center" width="13%">{{$t('Action')}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in  actionsList" v-bind:key="index">
                      <td>{{item.name}}</td>
                      <td>{{getActionType(item.type)}}</td>
                      <td>{{getStep(item.nextStepId)}}</td>
                      <td class="action-column">
                        <a
                          :title="$t('Edit')"
                          class="text-primary"
                          v-on:click="AddEditAction(index)"
                        >
                          <i class="fa fa-edit"></i>
                        </a>
                        <a
                          :title="$t('delete')"
                          class="text-danger"
                          v-on:click="deleteAction(index)"
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
              <button class="btn btn-info" type="button" @click="saveActions()">
                <i class="fa fa-save"></i>
                {{$t("Save")}}
              </button>
              <button
                type="button"
                style="margin-left:3px"
                class="btn btn-secondary"
                @click="cancelAllAction()"
              >
                <i class="fa fa-ban"></i>
                {{$t("Cancel")}}
              </button>
            </span>
          </el-dialog>

          <el-dialog :title="$t('AddAction')" :visible="dialogActionsVisible"
          :show-close="false"
          :close-on-press-escape="false"
          :destroy-on-close="false">
            <div class="row">
              <div class="col-md-12">
                <b-form-group :class="{'has-error':errors.has('actionsValidation.ActionName')}">
                  <label class="col-form-label" for="ActionName" cols="4">{{$t('ActionName')}}</label>
                  <label class="required">*</label>

                  <b-form-input
                    id="ActionName"
                    v-model="ActionName"
                    name="ActionName"
                    v-validate="'required'"
                    :data-vv-as="'action name'"
                    data-vv-scope="actionsValidation"
                    autocomplete="off"
                  ></b-form-input>
                  <div
                    class="help-block"
                    v-if="errors.has('actionsValidation.ActionName')"
                  >{{ errors.first('actionsValidation.ActionName') }}</div>
                </b-form-group>
              </div>
              <div class="col-md-12">
                <b-form-group :class="{'has-error':errors.has('actionsValidation.ActionType')}">
                  <label class="col-form-label" for="ActionType" b-cols="4">{{$t('ActionType')}}</label>
                  <label class="required">*</label>
                  <el-select
                    id="ActionType"
                    v-model="ActionType"
                    name="ActionType"
                    filterable
                    clearable
                    v-bind:placeholder="$t('Select')"
                    v-validate="'required'"
                    :data-vv-as="'step type'"
                    data-vv-scope="actionsValidation"
                  >
                    <el-option
                      v-for="item in ActionTypes"
                      :key="item.code"
                      :label="item.Name"
                      :value="item.code"
                    ></el-option>
                  </el-select>

                  <div class="help-block" v-if="errors.has('actionsValidation.ActionType')">
                    <label class="mt-1">{{ errors.first('actionsValidation.ActionType') }}</label>
                  </div>
                </b-form-group>
              </div>
              <div class="col-md-12">
                <b-form-checkbox v-model="returnToInitial">{{$t("ReturnInitial")}}</b-form-checkbox>
              </div>
              <div class="col-md-12" v-if="!returnToInitial">
                <b-form-group :class="{'has-error':errors.has('actionsValidation.nextStep')}">
                  <label class="col-form-label" for="nextStep" b-cols="4">{{$t('NextStep')}}</label>
                  <label class="required">*</label>
                  <el-select
                    v-model="NextStep"
                    name="nextStep"
                    filterable
                    clearable
                    v-bind:placeholder="$t('Select')"
                    v-validate="'required'"
                    :data-vv-as="'next step'"
                    data-vv-scope="actionsValidation"
                  >
                    <el-option
                      v-for="item in WorkflowObj.workflowStepSetting.filter(x=>x.id>0)"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <div class="help-block" v-if="errors.has('actionsValidation.nextStep')">
                    <label class="mt-1">{{ errors.first('actionsValidation.nextStep') }}</label>
                  </div>
                </b-form-group>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <button class="btn btn-info" type="button" @click="addAction()">
                <i class="fa fa-save"></i>
                {{$t("Save")}}
              </button>
              <button
                type="button"
                style="margin-left:3px"
                class="btn btn-secondary"
                @click="cancelAction()"
              >
                <i class="fa fa-ban"></i>
                {{$t("Cancel")}}
              </button>
            </span>
          </el-dialog>

        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card class="card card-accent-primary" no-body v-if="show">
      <div slot="header">
        <span>{{$t('Steps')}}</span>
        <div class="card-header-actions">
          <b-link class="card-header-action btn-minimize" v-b-toggle.collapse2>
            <span class="when-opened">
              <i class="icon-arrow-up"></i>
            </span>
            <span class="when-closed">
              <i class="icon-arrow-down"></i>
            </span>
          </b-link>
        </div>
      </div>
      <b-collapse id="collapse2" visible>
        <b-card-body>
          <div class="row">
            <div class="col-md-10">
              <div class="form-group">
                <h4>{{$t('Steps')}}</h4>
              </div>
            </div>

            <div class="col-md-2 pb-1">
              <button type="button" class="btn btn-secondary float-right" @click="AddEditSteps(-1)">
                <i class="fa fa-plus-square-o"></i>
                {{$t("NewStep")}}
              </button>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <table class="table table-bordered table-striped dataTable">
                <thead>
                  <tr>
                    <th scope="col" width="5%">#</th>
                    <th scope="col">{{$t('Name')}}</th>
                    <th scope="col">{{$t('Type')}}</th>
                    <th scope="col" class="action-column text-center" width="15%">{{$t('Action')}}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in WorkflowObj.workflowStepSetting" v-bind:key="index">
                    <td>{{index+1}}</td>
                    <td>{{item.name}}</td>
                    <td>{{getStepType(item.type)}}</td>
                    <td class="action-column">
                      <a :title="$t('Edit')" class="text-primary" v-on:click="AddEditSteps(index)">
                        <i class="fa fa-edit"></i>
                      </a>
                      <a
                        :title="$t('ShowUsers')"
                        class="text-primary"
                        v-on:click="ShowUsersdialog(item.id)"
                        v-if="WorkflowId && item.id
                               && !(getStepCode(item.type)==$store.getters.getLookupStepsTypes.LastStepRejected || getStepCode(item.type)==$store.getters.getLookupStepsTypes.LastStepApproved)"
                      >
                        <i class="fa fa-user"></i>
                      </a>
                      <a
                        :title="$t('ShowAcions')"
                        class="text-primary"
                        v-on:click="ShowAllAcionsdialog(item.id)"
                        v-if="WorkflowId && item.id
                               && !(getStepCode(item.type)==$store.getters.getLookupStepsTypes.LastStepRejected || getStepCode(item.type)==$store.getters.getLookupStepsTypes.LastStepApproved)"
                      >
                        <i class="fa fa-cogs"></i>
                      </a>
                      <a
                        :title="$t('delete')"
                        class="text-danger"
                        v-on:click="deleteStep(index)"
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
        </b-card-body>
      </b-collapse>
    </b-card>

    <div class="text-center mb-5">
      <button class="btn btn-primary" v-on:click="addEditWorkflow()">
        <i class="fa fa-save"></i>
        {{$t("Save")}}
      </button>
    </div>
  </div>
</template>


<script type='text/javascript'>
export default {
  data() {
    return {
      fullscreenLoading: false,
      newRole: "",
      newUser: "",
      show: true,
      StepIndex: "",
      StepId: "",
      StepName: "",
      StepType: "",
      NextStep: "",
      ActionIndex: "",
      ActionName: "",
      ActionType: "",
      returnToInitial: false,
      types: [],
      StepsTypes: [],
      ActionTypes: this.$store.getters.getActionTypes,
      dialogStepsVisible: false,
      dialogUsersVisible: false,
      dialogAllActionsVisible: false,
      dialogActionsVisible: false,
      WorkflowObj: {
        id: "",
        name: "",
        type: "",
        description: "",
        status: false,
        workflowStepSetting: []
      },
      actionsList: [],
      userList: [],
      shownUsers: [],
      systemUsers: [],
      roleList: [],
      systemRoles: [],
      shownRoles: [],
      WorkflowId: this.$route.params.WorkflowId
    };
  },

  methods: {
    cancelAction(){
      this.dialogActionsVisible = true;
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
            this.dialogActionsVisible = false;
            done();
          } else {
            this.dialogActionsVisible = true;
            done();
          }
        }
      });
    },
    cancelAllAction(){
      this.dialogAllActionsVisible = true;
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
            this.dialogAllActionsVisible = false;
            done();
          } else {
            this.dialogAllActionsVisible = true;
            done();
          }
        }
      });
    },
    cancelRole(){
      this.dialogUsersVisible = true;
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
            this.dialogUsersVisible = false;
            done();
          } else {
            this.dialogUsersVisible = true;
            done();
          }
        }
      });
    },
    cancelItem() {
      this.dialogStepsVisible = true;
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
            this.dialogStepsVisible = false;
            done();
          } else {
            this.dialogStepsVisible = true;
            done();
          }
        }
      });
    },
    addUserTolist() {
      var user = this.systemUsers.filter(x => x.id == this.newUser)[0];
      var userinList = this.userList.filter(x => x.userId == this.newUser)[0];
      if (user && !userinList) {
        this.userList.push({ id: 0, stepId: this.StepId, userId: user.id });
      }
      var shUser = [];
      for (var i = 0; i < this.shownUsers.length; i++) {
        if (this.shownUsers[i].id != this.newUser) {
          shUser.push(this.shownUsers[i]);
        }
      }
      this.shownUsers = shUser;
      this.newUser = "";
    },
    deleteUser(index) {
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
              var user = this.userList[index];
              if (user) {
                var Syuser = this.systemUsers.filter(x => x.id == user.userId)[0];
                this.shownUsers.push(Syuser);
              }
              this.userList.splice(index, 1);
              done();
          } else {
              done();
            }
          }
      });
    },
    addRoleTolist() {
      var role = this.systemRoles.filter(x => x.id == this.newRole)[0];
      var roleinList = this.roleList.filter(x => x.roleId == this.newRole)[0];
      if (role && !roleinList) {
        this.roleList.push({ id: 0, stepId: this.StepId, roleId: role.id });
       
      }
      var shRole = [];
      for (var i = 0; i < this.shownRoles.length; i++) {
        if (this.shownRoles[i].id != this.newRole) {
          shRole.push(this.shownRoles[i]);
        }
      }
      this.shownRoles = shRole;
      this.newRole = "";
    },
    deleteRole(index) {
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
              var role = this.roleList[index];
              if (role) {
                var Syrole = this.systemRoles.filter(x => x.id == role.roleId)[0];
                this.shownRoles.push(Syrole);
              }
              this.roleList.splice(index, 1);
              done();
          } else {
              done();
            }
          }
      });


    },
    deleteAction(index) {
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
                this.actionsList.splice(index, 1);
                done();
            } else {
                done();
              }
            }
        });
      },

      getTypes() {
        var urlStr =
          this.$store.getters.serverURI + "api/TenderWorkflow/GetAllWorkflowTypes";
        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function(data) {
              this.types = data.body;
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

      showStepsdialog() {
        this.StepName = "";
        this.StepType = "";
        this.dialogStepsVisible = true;
      },

      showStepsdialog() {
        this.StepName = "";
        this.StepType = "";
        this.StepIndex = "";
        this.dialogStepsVisible = true;
      },

      ShowAcionsdialog() {
        this.dialogActionVisible = true;
      },

      ShowAllAcionsdialog(idVal) {
        this.StepId = idVal;
        if (this.StepIndex > -1) {
          this.getActionsFromService();
        }
        this.dialogAllActionsVisible = true;
      },
      addEditWorkflow() {
        this.$validator.validateAll("WorkflowValidation").then(result => {
          if (result) {
            var urlStr = this.$store.getters.serverURI + "api/TenderWorkflowSetting";
            if (this.WorkflowId) {
              var workflowStep = [];
              for (
                var i = 0;
                i < this.WorkflowObj.workflowStepSetting.length;
                i++
              ) {
                workflowStep.push({
                  id: this.WorkflowObj.workflowStepSetting[i].id,
                  name: this.WorkflowObj.workflowStepSetting[i].name,
                  type: this.WorkflowObj.workflowStepSetting[i].type
                });
              }
              var Workflow = {
                id: this.WorkflowId,
                name: this.WorkflowObj.name,
                type: this.WorkflowObj.type,
                description: this.WorkflowObj.description,
                status: this.WorkflowObj.status,
                workflowStepSetting: workflowStep
              };
              this.fullscreenLoading = true;
              this.$http
                .put(urlStr, Workflow, {
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
                    this.$router.push({
                      path: "/tender-workflow-definition/WorkflowDefinitionList"
                    });
                  },
                  function(error) {
                    this.fullscreenLoading = false;
                    this.$message({
                      showClose: true,
                      duration: this.$store.getters.getMessagesDuration,
                      type: "error",
                      message: error.data.message
                    });
                  }
                );
            } else {
              var workflowStep = [];
              for (
                var i = 0;
                i < this.WorkflowObj.workflowStepSetting.length;
                i++
              ) {
                workflowStep.push({
                  name: this.WorkflowObj.workflowStepSetting[i].name,
                  type: this.WorkflowObj.workflowStepSetting[i].type
                });
              }
              var Workflow = {
                id: "",
                name: this.WorkflowObj.name,
                type: this.WorkflowObj.type,
                description: this.WorkflowObj.description,
                status: this.WorkflowObj.status,
                workflowStepSetting: workflowStep
              };
              this.fullscreenLoading = true;
              this.$http
                .post(urlStr, Workflow, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
                })
                .then(
                  response => {
                    this.fullscreenLoading = false;
                    let msg = response.data.message;
                    this.$message({
                      showClose: true,
                      duration: this.$store.getters.getMessagesDuration,
                      type: "success",
                      message: msg
                    });
                    this.WorkflowId = response.data.id;
                    this.getWorkflowFromService();
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
        });
      },
      AddEditSteps(index) {
        //StepIndex
        this.errors.clear("stepsValidation");
        this.$validator.reset("stepsValidation");
        this.StepIndex = index;
        if (index != -1) {
          var step = this.WorkflowObj.workflowStepSetting[this.StepIndex];
          if (step) {
            this.StepType = step.type;
            this.StepName = step.name;
          }
        } else {
          this.StepType = "";
          this.StepName = "";
        }
        this.dialogStepsVisible = true;
      },
      addSteps: function(e) {
        //StepIndex
        this.$validator.validateAll("stepsValidation").then(result => {
          if (result) {
            if (this.StepIndex != -1) {
              var step = this.WorkflowObj.workflowStepSetting[this.StepIndex];
              if (step) {
                this.WorkflowObj.workflowStepSetting[
                  this.StepIndex
                ].name = this.StepName;
                this.WorkflowObj.workflowStepSetting[
                  this.StepIndex
                ].type = this.StepType;
              }
            } else {
              if (this.WorkflowObj.workflowStepSetting) {
                this.WorkflowObj.workflowStepSetting.push({
                  name: this.StepName,
                  type: this.StepType
                });
              }
            }
            this.StepIndex = "";
            this.dialogStepsVisible = false;
          }
        });
      },
      addAction() {
        this.$validator.validateAll("actionsValidation").then(result => {
          if (result) {
            if (this.ActionIndex != -1) {
              this.actionsList[this.ActionIndex] = {
                name: this.ActionName,
                type: this.ActionType,
                nextStepId: this.NextStep,
                returnToInitial: this.returnToInitial
              };
            } else {
              this.actionsList.push({
                id: 0,
                name: this.ActionName,
                type: this.ActionType,
                nextStepId: this.NextStep,
                returnToInitial: this.returnToInitial,
                stepId: this.StepId
              });
            }
            this.ActionIndex = "";
            this.dialogActionsVisible = false;
          }
        });
      },
      saveActions() {
        var urlStr =
          this.$store.getters.serverURI +
          "api/TenderWorkflowSetting/UpdateActions?stepId=" +
          this.StepId;
        this.$http
          .put(urlStr, this.actionsList, {
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
              this.dialogAllActionsVisible = false;
              this.actionsList = [];
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
      saveUserAndRole() {
        var urlStr =
          this.$store.getters.serverURI +
          "api/TenderWorkflowSetting/UpdateUserAndRole?stepId=" +
          this.StepId;

        var userRole = { userList: this.userList, roleList: this.roleList }; //this.userList={"id": 1,"stepId": 2,"userId": 3}  this.roleList= {"id": 1,"stepId": 2,"roleId": 3}
        this.$http
          .put(urlStr, userRole, {
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
              this.dialogUsersVisible = false;
              this.userList = [];
              this.roleList = [];
              this.shownUsers = this.systemUsers;
              this.newRole = "";
              this.newUser = "";
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
      AddEditAction(index) {
        this.errors.clear("actionsValidation");
        this.$validator.reset("actionsValidation");
        this.ActionIndex = index;
        if (index != -1) {
          var action = this.actionsList[index];
          if (action) {
            this.ActionType = action.type;
            this.ActionName = action.name;
            this.NextStep = action.nextStepId;
            this.returnToInitial = action.returnToInitial;
          }
        } else {
          this.ActionType = "";
          this.ActionName = "";
          this.NextStep = "";
          this.returnToInitial = false;
        }
        this.dialogActionsVisible = true;
      },
      ShowUsersdialog(idVal) {
        this.dialogUsersVisible = false;
        this.userList = [];
        this.roleList = [];
        this.shownUsers = this.systemUsers;
        this.newRole = "";
        this.newUser = "";

        this.StepId = idVal;
        this.getUsersAndRolesFromService();
        this.dialogUsersVisible = true;
      },
      getStepType: function(idVal) {
        var stepType = this.StepsTypes.filter(type => type.id == idVal)[0];
        if (stepType) {
          return stepType.name;
        }
        return "";
      },
      getStepCode: function(idVal) {
        var stepType = this.StepsTypes.filter(type => type.id == idVal)[0];
        if (stepType) {
          return stepType.code;
        }
        return "";
      },
      getRoleName: function(idVal) {
        var role = this.systemRoles.filter(type => type.id == idVal)[0];
        if (role) {
          return role.name;
        }
        return "";
      },
      getUserName: function(idVal) {
        var user = this.systemUsers.filter(x => x.id == idVal)[0];
        if (user) {
          return user.userName;
        }
        return "";
      },
      getStep: function(idVal) {
        var step = this.WorkflowObj.workflowStepSetting.filter(
          type => type.id == idVal
        )[0];
        if (step) {
          return step.name;
        }
        return "";
      },
      getActionType: function(idVal) {
        var actionType = this.ActionTypes.filter(type => type.code == idVal)[0];
        if (actionType) {
          return actionType.Name;
        }
        return "";
      },
      getWorkflowFromService: function() {
        var urlStr =
          this.$store.getters.serverURI +
          "api/TenderWorkflowSetting/" +
          this.WorkflowId;
        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function(data) {
              this.WorkflowObj = data.body;
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
      clearAll() {
        this.WorkflowObj = {
          id: "",
          name: "",
          type: "",
          description: "",
          status: false,
          workflowStepSetting: []
        };
        this.errors.clear("WorkflowValidation");
        this.$validator.reset("WorkflowValidation");
      },
      getWorkflowTypeFromService: function() {
        var urlStr =
          this.$store.getters.serverURI +
          "api/lookup/GetByType/" +
          this.$store.getters.getLookupCategory.WorkflowType;
        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function(data) {
              this.types = data.body;
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
      getStepTypeFromService: function() {
        var urlStr =
          this.$store.getters.serverURI +
          "api/lookup/GetByType/" +
          this.$store.getters.getLookupCategory.StepType;
        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function(data) {
              this.StepsTypes = data.body;
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
      getActionsFromService: function() {
        var urlStr =
          this.$store.getters.serverURI +
          "api/TenderWorkflowSetting/GetActions/" +
          this.StepId;
        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function(data) {
              this.actionsList = data.body;
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
      getUsersAndRolesFromService: function() {
        var urlStr =
          this.$store.getters.serverURI +
          "api/TenderWorkflowSetting/GetUsersAndRoles/" +
          this.StepId;
        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function(data) {
              var userRole = data.body;
              this.userList = userRole.userList;

              this.shownUsers = [];
              for (var i = 0; i < this.systemUsers.length; i++) {
                var sysUser = this.userList.filter(
                  x => x.userId == this.systemUsers[i].id
                );
                if (!sysUser.length > 0) {
                  this.shownUsers.push(this.systemUsers[i]);
                }
              }

              this.roleList = userRole.roleList;
              this.shownRoles = [];
              for (var i = 0; i < this.systemRoles.length; i++) {
                var sysRole = this.roleList.filter(
                  x => x.roleId == this.systemRoles[i].id
                );
                if (!sysRole.length > 0) {
                  this.shownRoles.push(this.systemRoles[i]);
                }
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
      getRolesFromService: function(idVal) {
        var RolestStr = this.$store.getters.serverURI + "api/Role/GetAll";
        this.$http
          .get(RolestStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function(data) {
              this.shownRoles = data.body;
              this.systemRoles = data.body;
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
      getUsersFromService: function() {
        this.fullscreenLoading = true;
        var UserstStr =
          this.$store.getters.serverURI +
          "api/User?PageIndex=&PageSize=-1&RowsCount=&role=&email=";
        this.$http
          .get(UserstStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function(data) {
              this.fullscreenLoading = false;
              var users = data.body.userViewList;
              this.shownUsers = users;
              this.systemUsers = users;
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

       deleteStep(index) {
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
                this.WorkflowObj.workflowStepSetting.splice(index, 1);
                done();
            } else {
                done();
              }
            }
        });
      },
    },
    created: function() {
      if (this.WorkflowId) {
        this.getWorkflowFromService();
      }
      this.getWorkflowTypeFromService();
      this.getStepTypeFromService();
      this.getRolesFromService();
      this.getUsersFromService();
    }
};
</script>
<style scoped>
.el-dialog__title_new {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
  font-weight: bold;
}
</style>