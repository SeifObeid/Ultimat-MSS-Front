<template>
  <div>
    <div class="text-right mb-2">
      <!-- <button class="btn btn-success" variant="primary" @click="Excel()">
        <i class="fa fa-dollar"></i>
        Create price quotation
      </button>-->
      <button
        v-if="
          BasicInfoObj.status == $store.getters.getSheetStatus.Approved &&
          BasicInfoObj.isFinalVersion != false
        "
        class="btn btn-primary mr-2"
        variant="primary"
        @click="Award()"
      >
        <i class="fa fa-check"></i>
        Award
      </button>
      
      <router-link
        v-if="
          BasicInfoObj.status == $store.getters.getSheetStatus.Approved &&
          checkPriceActions('Insert') &&
          BasicInfoObj.isFinalVersion != false &&
          BasicInfoObj.hasPriceQuotation != true
        "
        title="Create price quotation"
        class="btn btn-success"
        :to="{
          name: 'newPriceQuotation',
          params: { CalSheetId: BasicInfoObj.id, quoteID: -1 ,CalSheetType:3 },
        }"
      >
        <i class="fa fa-edit"></i>
        Create price quotation
      </router-link>
      

      <!-- v-if="BasicInfoObj.status == 4 && checkPriceActions('Insert') && BasicInfoObj.isFinalVersion != false && BasicInfoObj.hasPriceQuotation != true"-->
      <!-- <router-link
        v-if="BasicInfoObj.status == 4 && checkPriceActions('Insert') && BasicInfoObj.isFinalVersion != false && BasicInfoObj.hasPriceQuotation != true"
        title="Create price quotation"
        class="btn btn-success"
        :to="{ name: 'tenderNewPriceQuotation', params: {calSheetId: BasicInfoObj.id}}"
      >
        <i class="fa fa-edit"></i>
        Create price quotation
      </router-link> -->

      <button
        class="btn csubmit ml-2"
        variant="primary"
        @click="exportToExcel()"
      >
        <i class="fa fa-file-excel-o"></i>
        Export to Excel
      </button>

      <!-- <button class="btn btn-danger mr-1" variant="primary" @click="Excel()">
        <i class="fa fa-file-excel-o"></i>
        Create price quotation 
      </button>-->
    </div>

    <b-card
      class="card card-accent-primary"
      no-body
      v-loading.fullscreen.lock="fullscreenLoading"
    >
      <div slot="header">
        {{ $t("BasicInformation") }}
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
          <form class="form-horizontal">
            <div class="row">
              <div class="col-md-4">
                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('TenderNameCustomer') }"
                  >
                    <label class="col-form-label">{{
                      $t("TenderNameCustomer")
                    }}</label>
                    <input
                      type="text"
                      name="TenderNameCustomer"
                      class="form-control"
                      v-model="BasicInfoObj.tenderName"
                      v-validate="'required'"
                      data-vv-scope="EventCreationValidation"
                      :data-vv-as="$t('TenderNameCustomer')"
                      disabled
                      autocomplete="off"
                    />
                    <div
                      class="help-block"
                      v-if="errors.has('TenderNameCustomer')"
                    >
                      {{ errors.first("TenderNameCustomer") }}
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('TenderType') }"
                  >
                    <label class="col-form-label">{{ $t("TenderType") }}</label>

                    <br />
                    <el-select
                      v-model="BasicInfoObj.tenderType"
                      v-validate="'required'"
                      :data-vv-as="$t('TenderType')"
                      name="TenderType"
                      data-vv-scope="EventCreationValidation"
                      clearable
                      filterable
                      disabled
                    >
                      <el-option
                        v-for="option in tenderTypes"
                        v-bind:value="option.id"
                        :label="option.name"
                        v-bind:key="option.id"
                      ></el-option>
                    </el-select>
                    <div class="help-block" v-if="errors.has('TenderType')">
                      {{ errors.first("TenderType") }}
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('QuotationNumber') }"
                  >
                    <label class="col-form-label">{{
                      $t("QuotationNumber")
                    }}</label>
                    <input
                      type="text"
                      name="QuotationNumber"
                      class="form-control"
                      v-model="BasicInfoObj.tenderNumber"
                      v-validate="'required'"
                      data-vv-scope="EventCreationValidation"
                      :data-vv-as="$t('QuotationNumber')"
                      disabled
                      autocomplete="off"
                    />
                    <div
                      class="help-block"
                      v-if="errors.has('QuotationNumber')"
                    >
                      {{ errors.first("QuotationNumber") }}
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('quotationDescription') }"
                  >
                    <label class="col-form-label">{{
                      $t("quotationDescription")
                    }}</label>
                    <input
                      type="text"
                      name="quotationDescription"
                      class="form-control"
                      v-model="BasicInfoObj.quotationDescription"
                      v-validate="'required'"
                      :data-vv-as="$t('quotationDescription')"
                      disabled
                      autocomplete="off"
                    />
                    <div
                      class="help-block"
                      v-if="errors.has('quotationDescription')"
                    >
                      {{ $t("requiredField") }}
                      <!--{{ errors.first('Subject') }}-->
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <b-form inline>
                    <b-form-checkbox
                      disabled
                      v-model="BasicInfoObj.isNonMSSCustomerName"
                      >{{ $t("NonMSSCustomerName") }}</b-form-checkbox
                    >
                  </b-form>

                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('MSSCustomerName') }"
                    v-if="!BasicInfoObj.isNonMSSCustomerName"
                  >
                    <label class="col-form-label">{{
                      $t("MSSCustomerName")
                    }}</label>
                    <label
                      class="required"
                      v-if="!BasicInfoObj.nonMSSCustomerName"
                      >*</label
                    >
                    <br />
                    <!-- <el-select
                      v-model="BasicInfoObj.mssCustomerCode"
                      v-validate="!BasicInfoObj.isNonMSSCustomerName ? 'required' : ''"
                      :data-vv-as="$t('MSSCustomerName')"
                      name="MSSCustomerName"
                      
                      clearable
                      filterable
                      class="full-width"
                      disabled
                      :value="BasicInfoObj.mssCustomerCode"
                    >
                      <el-option
                        v-if="mssCustomers.length"
                        v-for="option in mssCustomers"
                        v-bind:value="option.code"
                        :label="option.name"
                        v-bind:key="option.code"
                      ></el-option>
                    </el-select>-->
                    <input
                      type="text"
                      name="MSSCustomerName"
                      class="form-control"
                      v-model="BasicInfoObj.mssCustomerName"
                      :data-vv-as="$t('NonMSSCustomerName')"
                      disabled
                      autocomplete="off"
                    />
                    <div
                      class="help-block"
                      v-if="errors.has('MSSCustomerName')"
                    >
                      {{ $t("requiredField") }}
                      <!--{{ errors.first('MSSCustomerName') }}-->
                    </div>
                  </div>

                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('NonMSSCustomerName') }"
                    v-if="BasicInfoObj.isNonMSSCustomerName"
                  >
                    <label class="col-form-label">{{
                      $t("MSSCustomerName")
                    }}</label>

                    <input
                      type="text"
                      name="NonMSSCustomerName"
                      class="form-control"
                      v-model="BasicInfoObj.nonMssCustomerName"
                      v-validate="
                        BasicInfoObj.isNonMSSCustomerName ? 'required' : ''
                      "
                      :data-vv-as="$t('NonMSSCustomerName')"
                      disabled
                      autocomplete="off"
                    />
                    <div
                      class="help-block"
                      v-if="errors.has('NonMSSCustomerName')"
                    >
                      {{ $t("requiredField") }}
                      <!--{{errors.first('NonMSSCustomerName') }}-->
                    </div>
                  </div>
                  <!-- <div class="form-group">
                    <br />
                    <strong
                      v-if="BasicInfoObj.parentCalculationId && BasicInfoObj.parentCalculationId !=0"
                    >
                      {{$t("VersionNo")}}: {{BasicInfoObj.versionNo}} - {{$t("ParentID")}}:
                      <router-link
                        :to="{ name: 'tenderNewCalculationSheet', params: {calSheetId: BasicInfoObj.parentCalculationId}}"
                      >{{BasicInfoObj.parentCalculationId}}</router-link>
                    </strong>
                  </div>-->
                </div>
              </div>
              <div class="col-md-4">
                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('ReleaseDate') }"
                  >
                    <label class="col-form-label">{{
                      $t("ReleaseDate")
                    }}</label>

                    <el-date-picker
                      v-model="BasicInfoObj.releaseDate"
                      name="ReleaseDate"
                      :data-vv-as="$t('ReleaseDate')"
                      v-validate="'required'"
                      type="date"
                      v-bind:format="this.$store.getters.getDateFormat"
                      disabled
                    ></el-date-picker>
                    <div class="help-block" v-if="errors.has('ReleaseDate')">
                      {{ $t("requiredField") }}
                      <!--{{ errors.first('ReleaseDate') }}-->
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('SubmissionDate') }"
                  >
                    <label class="col-form-label">{{
                      $t("SubmissionDate")
                    }}</label>

                    <el-date-picker
                      v-model="BasicInfoObj.submissionDate"
                      name="SubmissionDate"
                      :data-vv-as="$t('SubmissionDate')"
                      v-validate="'required'"
                      type="date"
                      v-bind:format="this.$store.getters.getDateFormat"
                      disabled
                    ></el-date-picker>
                    <div class="help-block" v-if="errors.has('SubmissionDate')">
                      {{ $t("requiredField") }}
                      <!--{{ // errors.first('SubmissionDate') }}-->
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('Validity') }"
                  >
                    <label class="col-form-label">{{ $t("Validity") }}</label>

                    <br />
                    <el-select
                      v-model="BasicInfoObj.validity"
                      v-validate="'required'"
                      :data-vv-as="$t('Validity')"
                      name="Validity"
                      clearable
                      filterable
                      class="full-width"
                      disabled
                    >
                      <el-option
                        v-for="option in validityList"
                        v-bind:value="option.id"
                        :label="option.name"
                        v-bind:key="option.id"
                      ></el-option>
                    </el-select>
                    <div class="help-block" v-if="errors.has('Validity')">
                      {{ $t("requiredField") }}
                      <!--{{ errors.first('Validity') }}-->
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="form-group">
                    <label class="col-form-label">{{
                      $t("ValidityHint")
                    }}</label>
                    <input
                      disabled
                      type="text"
                      name="ValidityHint"
                      class="form-control"
                      v-model="validtill"
                      autocomplete="off"
                    />
                  </div>
                </div>

                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('IsFunded') }"
                  >
                    <b-form-checkbox disabled v-model="BasicInfoObj.isFunded">{{
                      $t("IsFunded")
                    }}</b-form-checkbox>

                    <!--  -->
                    <div class="help-block" v-if="errors.has('IsFunded')">
                      {{ $t("requiredField") }}
                      <!--{{ errors.first('IsFunded') }}-->
                    </div>
                  </div>

                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('FunderName') }"
                    v-if="BasicInfoObj.isFunded"
                  >
                    <label class="col-form-label">{{ $t("FunderName") }}</label>

                    <input
                      type="text"
                      name="FunderName"
                      class="form-control"
                      v-model="BasicInfoObj.funderName"
                      v-validate="BasicInfoObj.isFunded ? 'required' : ''"
                      :data-vv-as="$t('FunderName')"
                      disabled
                      autocomplete="off"
                    />
                    <div class="help-block" v-if="errors.has('FunderName')">
                      {{ $t("requiredField") }}
                      <!--{{ errors.first('FunderName') }}-->
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('Status') }"
                  >
                    <label class="col-form-label">{{ $t("Status") }}</label>
                    <br />
                    <input
                      type="text"
                      name="Status"
                      class="form-control"
                      v-model="status"
                      :data-vv-as="$t('Status')"
                      disabled
                      autocomplete="off"
                    />
                    <div class="help-block" v-if="errors.has('Status')">
                      {{ $t("requiredField") }}
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('TenderCurrency') }"
                  >
                    <label class="col-form-label">{{
                      $t("TenderCurrency")
                    }}</label>

                    <br />
                    <el-select
                      v-model="BasicInfoObj.tenderCurrencyCode"
                      v-validate="'required'"
                      :data-vv-as="$t('TenderCurrency')"
                      name="TenderCurrency"
                      clearable
                      filterable
                      class="full-width"
                      @change="fillCalculationCurrencyRate()"
                      disabled
                    >
                      <el-option
                        v-for="option in tenderCurrencies"
                        v-bind:value="option.code"
                        :label="option.name"
                        v-bind:key="option.code"
                      ></el-option>
                    </el-select>
                    <div class="help-block" v-if="errors.has('TenderCurrency')">
                      {{ $t("requiredField") }}
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{
                      'has-error': errors.has(
                        'EventCreationValidation.Warranty'
                      ),
                    }"
                  >
                    <label class="col-form-label">{{ $t("Warranty") }}</label>

                    <input
                      type="text"
                      name="Warranty"
                      class="form-control"
                      v-model="BasicInfoObj.warranty"
                      v-validate="'required'"
                      data-vv-scope="EventCreationValidation"
                      :data-vv-as="$t('Warranty')"
                      disabled
                      autocomplete="off"
                    />
                    <div
                      class="help-block"
                      v-if="errors.has('EventCreationValidation.Warranty')"
                    >
                      {{ errors.first("EventCreationValidation.Warranty") }}
                    </div>
                  </div>
                </div>

                <div class="col-md-12" style="margin-top: -5px">
                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('PaymentTerms') }"
                  >
                    <label class="col-form-label">{{
                      $t("PaymentTerms")
                    }}</label>
                    <input
                      type="text"
                      name="paymentTerms"
                      class="form-control"
                      v-model="BasicInfoObj.paymentTerms"
                      v-validate="
                        BasicInfoObj.paymentTerms ? 'required|max:30' : ''
                      "
                      :data-vv-as="$t('PaymentTerms')"
                      autocomplete="off"
                      disabled
                    />
                    <div class="help-block" v-if="errors.has('paymentTerms')">
                      {{ errors.first("paymentTerms") }}
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('IsVat') }"
                  >
                    <div class="row">
                      <div class="col-md-12">
                        <b-form-checkbox
                          disabled
                          v-model="BasicInfoObj.isVat"
                          >{{ $t("IsVat") }}</b-form-checkbox
                        >

                        <!---->
                        <div class="help-block" v-if="errors.has('IsVat')">
                          {{ errors.first("IsVat") }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('VatValue') }"
                    v-if="BasicInfoObj.isVat"
                  >
                    <label class="col-form-label">VAT value (%)</label>

                    <input
                      type="text"
                      name="FunderName"
                      class="form-control"
                      v-model="BasicInfoObj.vatValue"
                      v-validate="BasicInfoObj.isVat ? 'required' : ''"
                      :data-vv-as="$t('VatValue')"
                      disabled
                      autocomplete="off"
                    />
                    <div class="help-block" v-if="errors.has('VatValue')">
                      {{ $t("requiredField") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <!--
  <div class="col-md-4">
                <div class="col-md-12">
                  <div class="form-group" :class="{'has-error':errors.has('Department')}">
                    <label class="col-form-label">{{$t("Department")}}</label>
                    <label class="required">*</label>
                    <br />

                 <input
                      type="text"
                      name="DepartmentName"
                      class="form-control"
                      v-model="this.loggeduser.lookup1.name"
                      v-validate="'required'"
                      autocomplete="off"
                      disabled
                      :data-vv-as="$t('DepartmentName')"
                    />

                    <div class="help-block" v-if="errors.has('Department')">
                      <label class="mt-1">{{ $t('Department')}}</label>
                    </div>
                  </div>
                </div>
              </div>
            -->

              <div class="col-md-4">
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="col-form-label"></label>
                    <br />
                    <b-form class="form-inline pt-3 pb-1">
                      <b-form-checkbox
                        disabled
                        v-model="BasicInfoObj.winningProbability"
                        >{{ $t("WinningProbability") }}</b-form-checkbox
                      >
                    </b-form>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="col-form-label">{{ $t("Region") }}</label>
                    <br />
                    <el-select
                      v-model="BasicInfoObj.regionId"
                      :data-vv-as="$t('Region')"
                      name="region"
                      clearable
                      filterable
                      disabled
                      class="full-width"
                    >
                      <el-option
                        v-for="option in regionsArrayList"
                        v-bind:value="option.id"
                        :label="option.name"
                        v-bind:key="option.id"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="col-form-label">{{
                      $t("BankGuarantee")
                    }}</label>
                    <label class="required">*</label>
                    <br />
                    <el-select
                      disabled
                      v-model="BasicInfoObj.bankGuaranteeId"
                      :data-vv-as="$t('BankGuarantee')"
                      name="bankGuarantee"
                      clearable
                      filterable
                      class="full-width"
                    >
                      <el-option
                        v-for="option in bankGuaranteeArrayList"
                        v-bind:value="option.id"
                        :label="option.name"
                        v-bind:key="option.id"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card
      class="card card-accent-primary"
      no-body
      v-if="
        BasicInfoObj.labCalculationSheetAttachment.length > 0 &&
        BasicInfoObj.labCalculationSheetAttachment
      "
    >
      <div slot="header">
        {{ $t("attachment") }}
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
          <div
            id="__BVID__254"
            role="group"
            aria-labelledby="__BVID__254__BV_label_"
            class="b-form-group form-group"
          >
            <div class="form-row">
              <div class="col-md-12">
                <div
                  class="offset-3"
                  v-if="BasicInfoObj.labCalculationSheetAttachment.length > 0"
                >
                  <table
                    class="table table-striped table-hover col-md-8 table-outline"
                  >
                    <thead>
                      <tr>
                        <th>File name</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody
                      v-if="
                        BasicInfoObj.labCalculationSheetAttachment.length > 0
                      "
                    >
                      <template
                        v-for="(
                          attachemnt, index
                        ) in BasicInfoObj.labCalculationSheetAttachment"
                      >
                        <tr :key="index" v-if="!attachemnt.deleted">
                          <td>{{ attachemnt.fileName }}</td>
                          <td>{{ attachemnt.description }}</td>
                          <td>
                            <a
                              style="cursor: pointer"
                              @click="
                                downloadAttachment(
                                  attachemnt.quid,
                                  attachemnt.fileName
                                )
                              "
                              v-if="attachemnt.quid"
                              class="ml-1"
                            >
                              <i class="fa fa-download"></i>
                            </a>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
                <div
                  class="form-row"
                  v-if="
                    BasicInfoObj.labCalculationSheetAttachment.length == 0 ||
                    !BasicInfoObj.labCalculationSheetAttachment.length
                  "
                >
                  <h4>No data to show</h4>
                </div>
              </div>
            </div>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card class="card card-accent-primary" no-body>
      <div slot="header">
        {{ $t("calculationSheetGroups") }}
        <div class="card-header-actions">
          <b-link
            class="card-header-action btn-minimize"
            v-b-toggle.collapseView
          >
            <span class="when-opened">
              <i class="icon-arrow-up"></i>
            </span>
            <span class="when-closed">
              <i class="icon-arrow-down"></i>
            </span>
          </b-link>
        </div>
      </div>
      <b-collapse id="collapseView" visible>
        <b-card-body>
          <b-row
            v-for="(CalcGroup, index) in tenderCalculationSheetGroups"
            :key="index"
          >
            <b-col lg="12">
              <b-card class="card card-accent-primary" no-body>
                <div slot="header">
                  <div class="row">
                    <label class="col-sm-1 col-form-label"
                      >{{ $t("Item") }}-{{ index + 1 }}</label
                    >
                    <label class="col-form-label"
                      >{{ $t("name") }} - {{ CalcGroup.name }}</label
                    >
                    &nbsp; &nbsp; &nbsp; &nbsp;
                    <label class="col-form-label"
                      >{{ $t("number") }} - {{ CalcGroup.number }}</label
                    >
                    &nbsp; &nbsp; &nbsp; &nbsp;
                    <label class="col-form-label"
                      >{{ $t("DeliveryTerms") }} -
                      {{ CalcGroup.deliveryTerms }}</label
                    >
                    &nbsp; &nbsp; &nbsp; &nbsp;
                    <label class="col-form-label"
                      >{{ $t("Warranty") }} - {{ CalcGroup.warranty }}</label
                    >
                  </div>
                </div>
                <b-collapse :id="'mainItem-' + index" visible>
                  <b-card-body>
                    <div class="table-responsive-lg table-responsive">
                      <el-table
                        class="table-sm table-responsive custom-table"
                        :data="CalcGroup.labCalculationSheetItem"
                        size="mini"
                        style="width: 100%"
                      >
                        <el-table-column
                          type="index"
                          width="50"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="code"
                          label="Item code"
                          width="140"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="name"
                          label="MSS name"
                          width="180"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="vendor"
                          label="Company"
                          width="120"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="costTypeLookup.name"
                          label="Cost type"
                          width="120"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="onHandPrice"
                          label="OH price"
                          width="100"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="onHandQuantity"
                          label="OH Qty"
                          width="70"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="cost"
                          label="Cost"
                          width="70"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="currencyCode"
                          label="Currency"
                          width="120"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="currencySymbol"
                          label=" "
                          width="70"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="tenderUnit"
                          label="Tender Unit"
                          width="110"
                        >
                          <template slot-scope="scope">
                            {{ scope.row.tenderUnit | toUSD }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          sortable
                          prop="tenderUnitValue"
                          label="Tender Unit Value"
                          width="120"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="msS_Unit"
                          label="MSS Unit"
                          width="120"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="tenderQuantity"
                          label="Tender Quantity"
                          width="140"
                        >
                          <template slot-scope="scope">
                            {{ scope.row.tenderQuantity | toUSD }}
                          </template>
                        </el-table-column>

                        <el-table-column
                          sortable
                          prop="msS_Quantity"
                          label="MSS Quantity"
                          width="140"
                        >
                          <template slot-scope="scope">
                            {{ scope.row.msS_Quantity | toUSD }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          sortable
                          prop="shipment"
                          label="S&C%"
                          width="140"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="landedCostInSelectedCurrency"
                          label="Landed cost in selected currency"
                          width="160"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="currencySymbol"
                          label=" "
                          width="70"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="landedCost"
                          label="Landed cost"
                          width="160"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="currency"
                          label=" "
                          width="70"
                        >
                          <template slot-scope="">
                            {{ BasicInfoObj.currencyModel.currencySymbol }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          sortable
                          prop="totalLandedCost"
                          label="Total landed cost"
                          width="160"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="currency"
                          label=" "
                          width="70"
                        >
                          <template slot-scope="">
                            {{ BasicInfoObj.currencyModel.currencySymbol }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          sortable
                          prop="totalLandedCostInSelectedCurrency"
                          label="Total landed cost in selected currency"
                          width="160"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="currencySymbol"
                          label=" "
                          width="70"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="grossMargin"
                          label="GM%"
                          width="150"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="quotationSupplier_WithOut_Vat"
                          label="Quotation P./Supplier (without VAT)"
                          width="200"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="currency"
                          label=" "
                          width="70"
                        >
                          <template slot-scope="">
                            {{ BasicInfoObj.currencyModel.currencySymbol }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          sortable
                          prop="quotationSupplier_With_Vat"
                          label="Quotation P./Supplier (with VAT)"
                          width="140"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="currency"
                          label=" "
                          width="70"
                        >
                          <template slot-scope="">
                            {{ BasicInfoObj.currencyModel.currencySymbol }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          sortable
                          prop="finalUnitPrice"
                          label="Final unit price"
                          width="140"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="currency"
                          label=" "
                          width="70"
                        >
                          <template slot-scope="">
                            {{ BasicInfoObj.currencyModel.currencySymbol }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          sortable
                          prop="totalQuotationPrice"
                          label="Total amount"
                          width="160"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="currency"
                          label=" "
                          width="70"
                        >
                          <template slot-scope="">
                            {{ BasicInfoObj.currencyModel.currencySymbol }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          sortable
                          prop="grossMarginValue"
                          label="Gross margin"
                          width="120"
                        ></el-table-column>
                        <el-table-column
                          sortable
                          prop="currency"
                          label=" "
                          width="70"
                        >
                          <template slot-scope="">
                            {{ BasicInfoObj.currencyModel.currencySymbol }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          sortable
                          prop="note"
                          label="note"
                          width="120"
                        ></el-table-column>
                      </el-table>
                    </div>
                    <br />
                    <b-card
                      class="card card-accent-primary mt-3"
                      v-if="CalcGroup.labCalculationSheetOptionalGroup"
                    >
                      <div slot="header">
                        {{ $t("Item") }}-{{ index + 1 }}
                        {{ $t("optionalItems") }}
                        <div class="card-header-actions">
                          <b-link
                            class="card-header-action btn-minimize"
                            v-b-toggle="'ItemoptionalGroup-' + index"
                          >
                            <span class="when-opened">
                              <i class="icon-arrow-up"></i>
                            </span>
                            <span class="when-closed">
                              <i class="icon-arrow-down"></i>
                            </span>
                          </b-link>
                        </div>
                      </div>
                      <b-collapse :id="'ItemoptionalGroup-' + index" visible>
                        <div class="table-responsive-lg table-responsive">
                          <el-table
                            class="table-sm table-responsive custom-table"
                            :data="
                              CalcGroup.labCalculationSheetOptionalGroup
                                .labCalculationSheetItem
                            "
                            size="mini"
                            style="width: 100%"
                          >
                            <el-table-column
                              type="index"
                              width="50"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="code"
                              label="Item code"
                              width="180"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="name"
                              label="MSS name"
                              width="180"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="vendor"
                              label="Company"
                              width="180"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="costTypeLookup.name"
                              label="Cost type"
                              width="120"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="onHandPrice"
                              label="OH price"
                              width="140"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="onHandQuantity"
                              label="OH Qty"
                              width="140"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="cost"
                              label="Cost"
                              width="140"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="currencyCode"
                              label="Currency"
                              width="120"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="currencySymbol"
                              label=" "
                              width="70"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="tenderUnit"
                              label="Tender Unit"
                              width="120"
                            >
                              <template slot-scope="scope">
                                {{ scope.row.tenderUnit | toUSD }}
                              </template>
                            </el-table-column>
                            <el-table-column
                              sortable
                              prop="msS_Unit"
                              label="MSS Unit"
                              width="120"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="tenderQuantity"
                              label="Tender Quantity"
                              width="140"
                            >
                              <template slot-scope="scope">
                                {{ scope.row.tenderQuantity | toUSD }}
                              </template>
                            </el-table-column>

                            <el-table-column
                              sortable
                              prop="msS_Quantity"
                              label="MSS Quantity"
                              width="140"
                            >
                              <template slot-scope="scope">
                                {{ scope.row.msS_Quantity | toUSD }}
                              </template>
                            </el-table-column>
                            <el-table-column
                              sortable
                              prop="shipment"
                              label="S&C%"
                              width="140"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="landedCostInSelectedCurrency"
                              label="Landed cost in selected currency"
                              width="160"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="currencySymbol"
                              label=" "
                              width="70"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="landedCost"
                              label="Landed cost"
                              width="160"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="currency"
                              label=" "
                              width="70"
                            >
                              <template slot-scope="">
                                {{ BasicInfoObj.currencyModel.currencySymbol }}
                              </template>
                            </el-table-column>
                            <el-table-column
                              sortable
                              prop="totalLandedCost"
                              label="Total landed cost"
                              width="160"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="currency"
                              label=" "
                              width="70"
                            >
                              <template slot-scope="">
                                {{ BasicInfoObj.currencyModel.currencySymbol }}
                              </template>
                            </el-table-column>
                            <el-table-column
                              sortable
                              prop="totalLandedCostInSelectedCurrency"
                              label="Total landed cost in selected currency"
                              width="160"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="currencySymbol"
                              label=" "
                              width="70"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="grossMargin"
                              label="GM%"
                              width="150"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="quotationSupplier_WithOut_Vat"
                              label="Quotation P./Supplier (without VAT)"
                              width="200"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="currency"
                              label=" "
                              width="70"
                            >
                              <template slot-scope="">
                                {{ BasicInfoObj.currencyModel.currencySymbol }}
                              </template>
                            </el-table-column>
                            <el-table-column
                              sortable
                              prop="quotationSupplier_With_Vat"
                              label="Quotation P./Supplier (with VAT)"
                              width="140"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="currency"
                              label=" "
                              width="70"
                            >
                              <template slot-scope="">
                                {{ BasicInfoObj.currencyModel.currencySymbol }}
                              </template>
                            </el-table-column>
                            <el-table-column
                              sortable
                              prop="finalUnitPrice"
                              label="Final unit price"
                              width="140"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="currency"
                              label=" "
                              width="70"
                            >
                              <template slot-scope="">
                                {{ BasicInfoObj.currencyModel.currencySymbol }}
                              </template>
                            </el-table-column>
                            <el-table-column
                              sortable
                              prop="totalQuotationPrice"
                              label="Total amount"
                              width="160"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="currency"
                              label=" "
                              width="70"
                            >
                              <template slot-scope="">
                                {{ BasicInfoObj.currencyModel.currencySymbol }}
                              </template>
                            </el-table-column>
                            <el-table-column
                              sortable
                              prop="grossMarginValue"
                              label="Gross margin"
                              width="120"
                            ></el-table-column>
                            <el-table-column
                              sortable
                              prop="currency"
                              label=" "
                              width="70"
                            >
                              <template slot-scope="">
                                {{ BasicInfoObj.currencyModel.currencySymbol }}
                              </template>
                            </el-table-column>
                            <el-table-column
                              sortable
                              prop="note"
                              label="note"
                              width="120"
                            ></el-table-column>
                          </el-table>
                        </div>
                        <br />
                      </b-collapse>
                    </b-card>
                    <br />
                    <b-card
                      class="card card-accent-primary"
                      no-body
                      v-for="(
                        alternativeGroup, alternativeGroupIndex
                      ) in CalcGroup.labCalculationSheetAlternativeGroup"
                      :key="alternativeGroupIndex"
                    >
                      <div slot="header">
                        <div class="pabsolute">
                          <div class="card-header-actions">
                            <b-link
                              class="card-header-action btn-minimize"
                              v-b-toggle="
                                'alternativeGroup-' +
                                index +
                                alternativeGroupIndex
                              "
                            >
                              <span class="when-opened">
                                <i class="icon-arrow-up"></i>
                              </span>
                              <span class="when-closed">
                                <i class="icon-arrow-down"></i>
                              </span>
                            </b-link>
                          </div>
                        </div>
                        <div class="row">
                          <label class="col-sm-4 col-form-label"
                            >{{ $t("AlternativeGroup") }}
                            {{ alternativeGroupIndex + 1 }}</label
                          >
                          <label class="col-form-label"
                            >{{ $t("name") }} -
                            {{ alternativeGroup.name }}</label
                          >
                        </div>
                      </div>
                      <b-collapse
                        :id="
                          'alternativeGroup-' + index + alternativeGroupIndex
                        "
                        visible
                      >
                        <b-card-body>
                          <div class="table-responsive-lg table-responsive">
                            <el-table
                              class="table-sm table-responsive custom-table"
                              :data="alternativeGroup.labCalculationSheetItem"
                              size="mini"
                              style="width: 100%"
                            >
                              <el-table-column
                                type="index"
                                width="50"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="code"
                                label="Item code"
                                width="180"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="name"
                                label="MSS name"
                                width="180"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="vendor"
                                label="Company"
                                width="180"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="costTypeLookup.name"
                                label="Cost type"
                                width="120"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="onHandPrice"
                                label="OH price"
                                width="140"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="onHandQuantity"
                                label="OH Qty"
                                width="140"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="cost"
                                label="Cost"
                                width="140"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="currencyCode"
                                label="Currency"
                                width="120"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="currencySymbol"
                                label=" "
                                width="70"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="tenderUnit"
                                label="Tender Unit"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  {{ scope.row.tenderUnit | toUSD }}
                                </template>
                              </el-table-column>
                              <el-table-column
                                sortable
                                prop="msS_Unit"
                                label="MSS Unit"
                                width="120"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="tenderQuantity"
                                label="Tender Quantity"
                                width="140"
                              >
                                <template slot-scope="scope">
                                  {{ scope.row.tenderQuantity | toUSD }}
                                </template>
                              </el-table-column>

                              <el-table-column
                                sortable
                                prop="msS_Quantity"
                                label="MSS Quantity"
                                width="140"
                              >
                                <template slot-scope="scope">
                                  {{ scope.row.msS_Quantity | toUSD }}
                                </template>
                              </el-table-column>
                              <el-table-column
                                sortable
                                prop="shipment"
                                label="S&C%"
                                width="140"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="landedCostInSelectedCurrency"
                                label="Landed cost in selected currency"
                                width="160"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="currencySymbol"
                                label=" "
                                width="70"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="landedCost"
                                label="Landed cost"
                                width="160"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="currency"
                                label=" "
                                width="70"
                              >
                                <template slot-scope="">
                                  {{
                                    BasicInfoObj.currencyModel.currencySymbol
                                  }}
                                </template>
                              </el-table-column>
                              <el-table-column
                                sortable
                                prop="totalLandedCost"
                                label="Total landed cost"
                                width="160"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="currency"
                                label=" "
                                width="70"
                              >
                                <template slot-scope="">
                                  {{
                                    BasicInfoObj.currencyModel.currencySymbol
                                  }}
                                </template>
                              </el-table-column>
                              <el-table-column
                                sortable
                                prop="totalLandedCostInSelectedCurrency"
                                label="Total landed cost in selected currency"
                                width="160"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="currencySymbol"
                                label=" "
                                width="70"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="grossMargin"
                                label="GM%"
                                width="150"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="quotationSupplier_WithOut_Vat"
                                label="Quotation P./Supplier (without VAT)"
                                width="200"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="currency"
                                label=" "
                                width="70"
                              >
                                <template slot-scope="">
                                  {{
                                    BasicInfoObj.currencyModel.currencySymbol
                                  }}
                                </template>
                              </el-table-column>
                              <el-table-column
                                sortable
                                prop="quotationSupplier_With_Vat"
                                label="Quotation P./Supplier (with VAT)"
                                width="140"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="currency"
                                label=" "
                                width="70"
                              >
                                <template slot-scope="">
                                  {{
                                    BasicInfoObj.currencyModel.currencySymbol
                                  }}
                                </template>
                              </el-table-column>
                              <el-table-column
                                sortable
                                prop="finalUnitPrice"
                                label="Final unit price"
                                width="140"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="currency"
                                label=" "
                                width="70"
                              >
                                <template slot-scope="">
                                  {{
                                    BasicInfoObj.currencyModel.currencySymbol
                                  }}
                                </template>
                              </el-table-column>
                              <el-table-column
                                sortable
                                prop="totalQuotationPrice"
                                label="Total amount"
                                width="160"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="currency"
                                label=" "
                                width="70"
                              >
                                <template slot-scope="">
                                  {{
                                    BasicInfoObj.currencyModel.currencySymbol
                                  }}
                                </template>
                              </el-table-column>
                              <el-table-column
                                sortable
                                prop="grossMarginValue"
                                label="Gross margin"
                                width="120"
                              ></el-table-column>
                              <el-table-column
                                sortable
                                prop="currency"
                                label=" "
                                width="70"
                              >
                                <template slot-scope="">
                                  {{
                                    BasicInfoObj.currencyModel.currencySymbol
                                  }}
                                </template>
                              </el-table-column>
                              <el-table-column
                                sortable
                                prop="note"
                                label="note"
                                width="120"
                              ></el-table-column>
                            </el-table>
                            <br />
                            <b-card
                              class="card card-accent-primary mt-3"
                              v-if="
                                alternativeGroup.tenderCalculationSheetAlternativeOptionalGroup !=
                                null
                              "
                            >
                              <div slot="header">
                                {{ $t("AlternativeGroup") }}
                                {{ alternativeGroupIndex + 1 }}
                                {{ $t("optionalItems") }}
                                <div class="card-header-actions">
                                  <b-link
                                    class="card-header-action btn-minimize"
                                    v-b-toggle="'optionalGroup-' + index"
                                  >
                                    <span class="when-opened">
                                      <i class="icon-arrow-up"></i>
                                    </span>
                                    <span class="when-closed">
                                      <i class="icon-arrow-down"></i>
                                    </span>
                                  </b-link>
                                </div>
                              </div>
                              <b-collapse
                                :id="'optionalGroup-' + index"
                                visible
                              >
                                <div
                                  class="table-responsive-lg table-responsive"
                                >
                                  <el-table
                                    class="table-sm table-responsive custom-table"
                                    :data="
                                      alternativeGroup
                                        .tenderCalculationSheetAlternativeOptionalGroup
                                        .labCalculationSheetItem
                                    "
                                    size="mini"
                                    style="width: 100%"
                                  >
                                    <el-table-column
                                      type="index"
                                      width="50"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="code"
                                      label="Item code"
                                      width="180"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="name"
                                      label="MSS name"
                                      width="180"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="vendor"
                                      label="Company"
                                      width="180"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="costTypeLookup.name"
                                      label="Cost type"
                                      width="120"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="onHandPrice"
                                      label="OH price"
                                      width="140"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="onHandQuantity"
                                      label="OH Qty"
                                      width="140"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="cost"
                                      label="Cost"
                                      width="140"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="currencyCode"
                                      label="Currency"
                                      width="120"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="currencySymbol"
                                      label=" "
                                      width="70"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="tenderUnit"
                                      label="Tender Unit"
                                      width="120"
                                    >
                                      <template slot-scope="scope">
                                        {{ scope.row.tenderUnit | toUSD }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="msS_Unit"
                                      label="MSS Unit"
                                      width="120"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="tenderQuantity"
                                      label="Tender Quantity"
                                      width="140"
                                    >
                                      <template slot-scope="scope">
                                        {{ scope.row.tenderQuantity | toUSD }}
                                      </template>
                                    </el-table-column>

                                    <el-table-column
                                      sortable
                                      prop="msS_Quantity"
                                      label="MSS Quantity"
                                      width="140"
                                    >
                                      <template slot-scope="scope">
                                        {{ scope.row.msS_Quantity | toUSD }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="shipment"
                                      label="S&C%"
                                      width="140"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="landedCostInSelectedCurrency"
                                      label="Landed cost in selected currency"
                                      width="160"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="currencySymbol"
                                      label=" "
                                      width="70"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="landedCost"
                                      label="Landed cost"
                                      width="160"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="currency"
                                      label=" "
                                      width="70"
                                    >
                                      <template slot-scope="">
                                        {{
                                          BasicInfoObj.currencyModel
                                            .currencySymbol
                                        }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="totalLandedCost"
                                      label="Total landed cost"
                                      width="160"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="currency"
                                      label=" "
                                      width="70"
                                    >
                                      <template slot-scope="">
                                        {{
                                          BasicInfoObj.currencyModel
                                            .currencySymbol
                                        }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="totalLandedCostInSelectedCurrency"
                                      label="Total landed cost in selected currency"
                                      width="160"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="currencySymbol"
                                      label=" "
                                      width="70"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="grossMargin"
                                      label="GM%"
                                      width="150"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="quotationSupplier_WithOut_Vat"
                                      label="Quotation P./Supplier (without VAT)"
                                      width="200"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="currency"
                                      label=" "
                                      width="70"
                                    >
                                      <template slot-scope="">
                                        {{
                                          BasicInfoObj.currencyModel
                                            .currencySymbol
                                        }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="quotationSupplier_With_Vat"
                                      label="Quotation P./Supplier (with VAT)"
                                      width="140"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="currency"
                                      label=" "
                                      width="70"
                                    >
                                      <template slot-scope="">
                                        {{
                                          BasicInfoObj.currencyModel
                                            .currencySymbol
                                        }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="finalUnitPrice"
                                      label="Final unit price"
                                      width="140"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="currency"
                                      label=" "
                                      width="70"
                                    >
                                      <template slot-scope="">
                                        {{
                                          BasicInfoObj.currencyModel
                                            .currencySymbol
                                        }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="totalQuotationPrice"
                                      label="Total amount"
                                      width="160"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="currency"
                                      label=" "
                                      width="70"
                                    >
                                      <template slot-scope="">
                                        {{
                                          BasicInfoObj.currencyModel
                                            .currencySymbol
                                        }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="grossMarginValue"
                                      label="Gross margin"
                                      width="120"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="currency"
                                      label=" "
                                      width="70"
                                    >
                                      <template slot-scope="">
                                        {{
                                          BasicInfoObj.currencyModel
                                            .currencySymbol
                                        }}
                                      </template>
                                    </el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="note"
                                      label="note"
                                      width="120"
                                    ></el-table-column>
                                  </el-table>
                                </div>
                                <br />
                              </b-collapse>
                            </b-card>
                          </div>
                          <br />
                        </b-card-body>
                      </b-collapse>
                    </b-card>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </b-col>
          </b-row>
          <br />
          <div
            class="form-row"
            v-if="
              tenderCalculationSheetGroups.length == 0 ||
              !tenderCalculationSheetGroups
            "
          >
            <h4>No data to show</h4>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card class="card card-accent-primary" no-body>
      <div slot="header">
        {{ $t("BankInformation") }}
        <div class="card-header-actions">
          <b-link
            class="card-header-action btn-minimize"
            v-b-toggle.collapseVersion
          >
            <span class="when-opened">
              <i class="icon-arrow-up"></i>
            </span>
            <span class="when-closed">
              <i class="icon-arrow-down"></i>
            </span>
          </b-link>
        </div>
      </div>
      <b-collapse id="collapseVersion" visible>
        <b-card-body>
          <b-row>
            <div class="row mt-2 mr-1 ml-1">
              <div class="row col-12">
                <div class="col-md-2">
                  <div>{{ $t("BankGuarantee") }}</div>
                  <div>
                    <el-select
                      :disabled="true"
                      class="input-custom"
                      v-model="bankBlockViewModel.bankGuaranteeType"
                      :placeholder="$t('Select')"
                      name="bankGuarantee"
                      data-vv-scope="EventCreationValidation"
                      clearable
                      filterable
                      @change="
                        getTotalAmountTotalGrossMarginTotalGrossMarginValue()
                      "
                    >
                      <el-option
                        :value="true"
                        label="Percentage"
                        :key="true"
                      ></el-option>
                      <el-option
                        :value="false"
                        label="Value"
                        :key="false"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col-md-2">
                  <div>{{ $t("BankGuaranteeValue") }}</div>
                  <div>
                    <input
                      :disabled="true"
                      type="text"
                      class="form-control"
                      v-model="bankBlockViewModel.bankGuarantee"
                      autocomplete="off"
                      :maxlength="$store.getters.getMaxLength.length30"
                      @change="
                        getTotalAmountTotalGrossMarginTotalGrossMarginValue()
                      "
                    />
                  </div>
                </div>
                <div class="col-md-2">
                  <div>{{ $t("Currency") }}</div>
                  <div>
                    <el-select
                      :disabled="true"
                      :loading="loadingAccount"
                      v-model="bankBlockViewModel.currencyCode"
                      clearable
                      filterable
                      class="full-width"
                    >
                      <el-option
                        v-for="option in currenciesList"
                        :value="option.code"
                        :label="option.code"
                        :key="option.code"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <!-- </div> -->
                <!-- <div class="row col-12 mt-2"> -->
                <div class="col-md-2">
                  <div>{{ $t("BankGuaranteeValidTill") }}</div>
                  <div>
                    <input
                      :disabled="true"
                      type="number"
                      min="0"
                      class="form-control"
                      v-model="bankBlockViewModel.bankGuaranteeValidTill"
                      autocomplete="off"
                    />
                  </div>
                </div>
                <div class="col-md-2">
                  <div>{{ $t("GuaranteeType") }}</div>
                  <div>
                    <el-select
                      :disabled="true"
                      class="input-custom"
                      v-model="bankBlockViewModel.guaranteeType"
                      :placeholder="$t('Select')"
                      name="guaranteeDeliveryLocation"
                      data-vv-scope="EventCreationValidation"
                      clearable
                      filterable
                    >
                      <el-option
                        v-for="option in guaranteeTypes"
                        v-bind:value="option.id"
                        v-bind:label="option.name"
                        v-bind:key="option.id"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="col-md-2">
                  <div>{{ $t("GuaranteeDeliveryLocation") }}</div>
                  <div>
                    <el-select
                      :disabled="true"
                      class="input-custom"
                      v-model="bankBlockViewModel.guaranteeDeliveryLocation"
                      :placeholder="$t('Select')"
                      name="guaranteeDeliveryLocation"
                      data-vv-scope="EventCreationValidation"
                      clearable
                      filterable
                    >
                      <el-option
                        v-for="option in guaranteeDeliveryLocations"
                        v-bind:value="option.id"
                        :label="option.name"
                        v-bind:key="option.id"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
            <div class="row col-12 mb-2 mt-4 mr-1 ml-1">
              <div class="col-md-3">
                <div>
                  {{
                    $t("totalIn", { currency: BasicInfoObj.tenderCurrencyCode })
                  }}
                </div>
                <div>
                  <label>
                    {{
                      bankBlockViewModel.total_Quotation_Price_With_VAT | toUSD
                    }}
                    <strong>{{ BasicInfoObj.tenderCurrencyCode }}</strong>
                  </label>
                </div>
              </div>
              <div class="col-md-3">
                <div>
                  {{
                    $t("totalInCurrencyWithoutVat", {
                      currency: BasicInfoObj.tenderCurrencyCode,
                    })
                  }}
                </div>
                <div>
                  <label>
                    {{ bankBlockViewModel.total_Quoted_Price_WO_VAT | toUSD }}
                    <strong>{{ BasicInfoObj.tenderCurrencyCode }}</strong>
                  </label>
                </div>
              </div>
              <div class="col-md-3">
                <div>{{ $t("margin%") }}</div>
                <div>
                  <label>
                    {{ bankBlockViewModel.totalGrossMargin | toUSD }} %
                  </label>
                </div>
              </div>
              <div class="col-md-3">
                <div>
                  {{
                    $t("grossMargin", {
                      currency: BasicInfoObj.tenderCurrencyCode,
                    })
                  }}
                </div>
                <div>
                  <label>
                    {{ bankBlockViewModel.totalGrossMarginValue | toUSD }}
                    <strong>{{ BasicInfoObj.tenderCurrencyCode }}</strong>
                  </label>
                </div>
              </div>

              <div
                class="col-md-3"
                v-if="bankBlockViewModel.bankGuaranteeType == true"
              >
                <div>{{ $t("bankGranteeInCaseOfPercentage") }}</div>
                <div>
                  <label>
                    {{
                      bankBlockViewModel.bankGranteeInCaseOfPercentage | toUSD
                    }}
                  </label>
                </div>
              </div>
            </div>
          </b-row>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card class="card card-accent-primary" no-body v-if="versions.length > 0">
      <div slot="header">
        {{ $t("Versions") }}
        <div class="card-header-actions">
          <b-link
            class="card-header-action btn-minimize"
            v-b-toggle.collapseVersion
          >
            <span class="when-opened">
              <i class="icon-arrow-up"></i>
            </span>
            <span class="when-closed">
              <i class="icon-arrow-down"></i>
            </span>
          </b-link>
        </div>
      </div>
      <b-collapse id="collapseVersion" visible>
        <b-card-body>
          <b-row v-if="versions.length > 0">
            <div class="tableDiv col-md-12">
              <table class="table table-bordered table-striped table-sm">
                <thead>
                  <tr>
                    <th scope="col" class="pt-1 pb-1 text-center">
                      {{ $t("VersionName") }}
                    </th>
                    <th scope="col" class="pt-1 pb-1 text-center">
                      {{ $t("VersionNumber") }}
                    </th>
                    <th scope="col" class="pt-1 pb-1 text-center">
                      {{ $t("Actions") }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(version, index) in versions" v-bind:key="index">
                    <td class="align-middle text-center">
                      <span v-if="index == 0">Original</span>
                      <span v-if="index > 0">Version {{ index }}</span>
                    </td>
                    <td class="align-middle text-center">
                      {{ version.tenderNumber }}
                    </td>
                    <td class="align-middle text-center">
                      <router-link
                        target="_blank"
                        title="Action"
                        class="text-primary"
                        :to="{
                          name: 'tenderViewTenderCalculationSheet',
                          params: { calSheetId: version.id },
                        }"
                      >
                        <i class="fa fa-eye"></i>
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </b-row>
          <br />
          <div class="form-row" v-if="versions.length == 0">
            <h4>No data to show</h4>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script type='text/javascript'>
import moment from "moment";
import axios from "axios";
import { checkRoles } from "../../shared/utils";

export default {
  data() {
    return {
      loadingAccount: false,
      currenciesList: [],
      guaranteeTypes: [],
      guaranteeDeliveryLocations: [],
      tenderCalculationSheetCode: "",
      bankGuaranteeArrayList: [],
      regionsArrayList: [],
      fullscreenLoading: false,
      appLink: this.$store.getters.serverURI
        ? this.$store.getters.serverURI
        : "",
      validtill: "",
      validityList: [],
      tenderTypes: [],
      mssCustomers: [],
      status: [],
      versions: [],
      tenderCurrencies: [],
      WorkflowId: null,
      StepId: null,
      workflowStepActionSetting: [],
      calSheetId: this.$route.params.CalSheetId,
      currentCalcNumber: 1,
      tenderCalculationSheetGroups: [],
      BasicInfoObj: {
        currencyModel: { currencySymbol: "" },
        id: "",
        subject: "",
        tenderCurrencyCode: "",
        mssCustomerCode: "",
        nonMssCustomerName: "",
        releaseDate: "",
        submissionDate: "",
        validity: "",
        isFunded: false,
        funderName: "",
        isVat: false,
        vatValue: 16.5,
        labCalculationSheetCurrencyRate: [],
        isNonMSSCustomerName: false,
        mssCustomerName: "",
        status: 1,
        creator: 0,
        type: 1,
        tenderType: "",
        tenderNumber: "",
        tenderName: "",
        warranty: "",
        labCalculationSheetAttachment: [],
        versionNo: 0,
        parentCalculationId: 0,
        paymentTerms: "",
        isFinalVersion: false,
        hasPriceQuotation: false,
      },
      bankBlockViewModel: {
        currencyCode: "",
        total_Quotation_Price_With_VAT: 0.0,
        total_Quoted_Price_WO_VAT: 0.0,
        totalGrossMargin: 0.0,
        totalGrossMarginValue: 0.0,
        bankGranteeInCaseOfPercentage: 0.0,

        bankGuarantee: 0.0,
        guaranteeType: "",
        guaranteeDeliveryLocation: "",
        bankGuaranteeType: true,
        bankGuaranteeValidTill: "",
        vatValue: 0,
      },
    };
  },
  created: function () {
    this.init_component();
  },

  // watch: {
  //   // will fire on route changes
  //   //'$route.params.id': function(val, oldVal){ // Same
  //   "$route.path": function(val, oldVal) {
  //     this.init_component();
  //   }
  // },

  watch: {
    "$route.path": function () {
      this.init_component();
    },
    BasicInfoObj: {
      handler(val) {
        if (val.nonMssCustomerName) {
          this.BasicInfoObj.isNonMSSCustomerName = true;
        } else {
          this.BasicInfoObj.isNonMSSCustomerName = false;
        }

        // if (val.releaseDate) {
        //   this.BasicInfoObj.releaseDate = moment(val.releaseDate).format(
        //     "YYYY-MM-DD"
        //   );
        // }

        // if (val.submissionDate) {
        //   this.BasicInfoObj.submissionDate = moment(val.submissionDate).format(
        //     "YYYY-MM-DD"
        //   );
        // }
        // if (val.isNonMSSCustomerName) {
        //   this.BasicInfoObj.mssCustomerCode = "";
        //   this.BasicInfoObj.mssCustomerName = "";
        // }
        // if (val.mssCustomerCode) {
        //   this.BasicInfoObj.mssCustomerName = val.mssCustomerCode
        //     ? this.mssCustomers.filter(
        //         item => item.code == val.mssCustomerCode
        //       )[0].name
        //     : "";
        // }
        // if (val.validity) {
        //   let days = this.validityList.filter(
        //     item => item.id == val.validity
        //   )[0].name;
        //   let daysNumber = parseInt(days, 10);
        //   console.log(daysNumber);
        //   let validTillDate = moment(val.submissionDate, "YYYY-MM-DD").add(
        //     daysNumber,
        //     "days"
        //   );
        //   this.validtill = moment(validTillDate).format("DD/MM/YYYY");
        // }
      },
      deep: true,
    },
  },
  filters: {
    toUSD(value) {
      if (value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return "0.0";
      }
    },
    percentage(value) {
      if (value) {
        return parseFloat(parseFloat(value).toFixed(5).slice(0, -1) * 100)
          .toFixed(3)
          .slice(0, -1);
      } else {
        return "0.0";
      }
    },
  },
  methods: {
    FillCurrencyList: function () {
      var urlStr =
        this.$store.getters.serverURI + "api/LabItem/GetAllCurrencies";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.currenciesList = data.body;
          },
          function () {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage"),
            });
          }
        );
    },
    fillGuaranteeType: function () {
      var urlStr =
        this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.GuaranteType;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.guaranteeTypes = data.body;
          },
          function () {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage"),
            });
          }
        );
    },
    getGuaranteeDeliveryLocationLookups: function () {
      var urlTypesStr =
        this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.TenderLocation;
      this.$http
        .get(urlTypesStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(function (data) {
          this.guaranteeDeliveryLocations = data.body;
        });
    },
    FillRegionList: function () {
      var urlStr = this.$store.getters.serverURI + "api/Region";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.regionsArrayList = data.body.regionViewModels;
          },
          function () {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage"),
            });
          }
        );
    },

    FillGuaranteeList: function () {
      var urlStr =
        this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.BankGuarantee;

      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.bankGuaranteeArrayList = data.body;
          },
          function () {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage"),
            });
          }
        );
    },

    checkPriceActions(roleName) {
      return checkRoles("Price Quotation", roleName);
    },
    Award() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/LabCalculationSheets/" +
        this.calSheetId +
        "/Award";
      this.$http
        .put(
          urlStr,
          {},
          {
            headers: this.$store.getters.tokenAuthonticationHeaderObj,
          }
        )
        .then(
          () => {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "success",
              message: this.$t("UpdatedSuccessfully"),
            });
            this.FillData();
          },
          function () {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage"),
            });
          }
        );
    },
    downloadAttachment(quid, name) {
      let urlStr =
        this.$store.getters.serverURI +
        "api/LabCalculationSheet/DownLoadFile/" +
        quid +
        "/?name=" +
        name;

      axios({
        method: "post",
        url: urlStr,
        headers: this.$store.getters.tokenAuthonticationHeaderObj,
        responseType: "blob",
      })
        .then((response) => {
          this.fullscreenLoading = false;
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");
          var fileName = name;
          fileLink.href = fileURL;
          fileLink.setAttribute("download", fileName);
          document.body.appendChild(fileLink);

          fileLink.click();
        })
        .catch((error) => {
          this.fullscreenLoading = false;
          this.$message({
            showClose: true,
            duration: this.$store.getters.getMessagesDuration,
            type: "error",
            message: error.body.message,
          });
        });
    },
    init_component() {
      this.FillCurrencyList();
      this.fillGuaranteeType();
      this.getGuaranteeDeliveryLocationLookups();
      this.FillGuaranteeList();
      this.FillRegionList();
      this.FillValidityList();
      this.getTenderTypeLookups();
      // this.FillMssCustomers();
      this.FillData();
      this.FillCalcuationSheetGroupItemsData();
    },
    exportToExcel() {
      let urlStr =
        this.$store.getters.serverURI +
        "api/LabCalculationSheets/" +
        this.calSheetId +
        "/ExportFullSheet";
      // window.open(urlStr, "_blank");

      axios({
        method: "post",
        url: urlStr,
        headers: this.$store.getters.tokenAuthonticationHeaderObj,
        responseType: "blob",
      })
        .then((response) => {
          this.fullscreenLoading = false;
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");
          var fileName =
            this.BasicInfoObj.tenderNumber +
            "_" +
            (this.BasicInfoObj.mssCustomerName
              ? this.BasicInfoObj.mssCustomerName
              : this.BasicInfoObj.nonMssCustomerName);
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
            message: error.body.message,
          });
        });
    },
    FillMssCustomers: function () {
      var urlStr =
        this.$store.getters.serverURI + "api/LabItem/GetAllMssCustomer";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.mssCustomers = data.body;
          },
          function () {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage"),
            });
          }
        );
    },
    getTenderTypeLookups: function () {
      var urlTypesStr =
        this.$store.getters.serverURI + "api/lookup/GetByCode/TenderType";
      this.$http
        .get(urlTypesStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(function (data) {
          this.tenderTypes = data.body;
        });
    },
    FillValidityList: function () {
      var urlStr =
        this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.Validity;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.validityList = data.body;
          },
          function () {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage"),
            });
          }
        );
    },
    workflowAction(actionId) {
      var urlStr = this.$store.getters.serverURI + "api/WorkflowLog";
      this.$http
        .post(
          urlStr,
          {
            id: 0,
            labCalculationSheetId: this.calSheetId,
            WorkflowId: this.WorkflowId,
            StepId: this.StepId,
            ActionId: actionId,
          },
          {
            headers: this.$store.getters.tokenAuthonticationHeaderObj,
          }
        )
        .then(
          () => {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "success",
              message: "process done ",
            });
            this.$router.push({ path: "/tenderCalculationSheets" });
          },
          function () {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage"),
            });
          }
        );
    },
    FillCalcuationSheetGroupItemsData: function () {
      var urlStr =
        this.$store.getters.serverURI +
        "api/LabCalculationSheet/GetMainGroup/" +
        this.calSheetId;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            if (data.body.labCalculationSheetMainGroup.length) {
              this.tenderCalculationSheetGroups =
                data.body.labCalculationSheetMainGroup;
            }
            this.bankBlockViewModel = data.body.bankBlockViewModel;
          },
          function () {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage"),
            });
          }
        );
    },
    FillData: function () {
      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/LabCalculationSheet/GetBasicInfoDetail/" +
        this.calSheetId;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.fullscreenLoading = false;
            this.BasicInfoObj = data.body;
            let days = this.validityList.filter(
              (item) => item.id == this.BasicInfoObj.validity
            )[0].name;
            let daysNumber = parseInt(days, 10);
            let validTillDate = moment(
              this.BasicInfoObj.submissionDate,
              "YYYY-MM-DD"
            ).add(daysNumber, "days");
            this.validtill = moment(validTillDate).format("DD/MM/YYYY");

            this.BasicInfoObj.tenderNumber = data.body.tenderNumber
              ? data.body.tenderNumber
              : "";

            // if (data.body.calculationSheetStatus) {
            //   this.status = data.body.calculationSheetStatus.name;
            // }
            this.BasicInfoObj.labCalculationSheetCurrencyRate =
              data.body.labCalculationSheetCurrencyRate;

            this.status = data.body.formattedStatus;
            this.versions = data.body.previousVersionsOfLabCalculationSheets;
          },
          function () {
            this.fullscreenLoading = false;
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage"),
            });
          }
        );
    },
    getCurrentStep() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/WorkflowLog/GetCurrentStep?id=" +
        this.calSheetId;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(function (data) {
          this.StepId = data.body.id;
          this.WorkflowId = data.body.workflowSettingId;
          this.workflowStepActionSetting = data.body.workflowStepActionSetting;
        });
    },
  },
};
</script>

