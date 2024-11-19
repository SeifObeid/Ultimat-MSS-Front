<template>
  <div>
    <div class="text-right mb-2">
      <!-- <button class="btn btn-success" variant="primary" @click="Excel()">
        <i class="fa fa-dollar"></i>
        Create price quotation
      </button>-->
      <button
        v-if="BasicInfoObj.status == $store.getters.getSheetStatus.Approved && BasicInfoObj.isFinalVersion != false"
        class="btn btn-primary mr-2"
        variant="primary"
        @click="Award()"
      >
        <i class="fa fa-check"></i>
        Award
      </button>

      <router-link
        v-if="BasicInfoObj.status == $store.getters.getSheetStatus.Approved && checkPriceActions('Insert') && BasicInfoObj.isFinalVersion != false && BasicInfoObj.hasPriceQuotation != true"
        title="Create price quotation"
        class="btn btn-success"
        :to="{ name: 'tendernewPriceQuotation', params: {CalSheetId: BasicInfoObj.id}}"
      >
        <i class="fa fa-edit"></i>
        Create price quotation
      </router-link>

      <button class="btn csubmit ml-2" variant="primary" @click="Excel()">
        <i class="fa fa-file-excel-o"></i>
        Export to Excel
      </button>

      <!-- <button class="btn btn-danger mr-1" variant="primary" @click="Excel()">
        <i class="fa fa-file-excel-o"></i>
        Create price quotation 
      </button>-->
    </div>

    <b-card class="card card-accent-primary" no-body v-loading.fullscreen.lock="fullscreenLoading">
      <div slot="header">
        {{$t("BasicInformation")}}
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
                  <div class="form-group" :class="{'has-error':errors.has('TenderNameCustomer')}">
                    <label class="col-form-label">{{$t("TenderNameCustomer")}}</label>
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
                    >{{ errors.first('TenderNameCustomer') }}</div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="form-group" :class="{'has-error':errors.has('TenderType')}">
                    <label class="col-form-label">{{$t("TenderType")}}</label>

                    <br />
                    <el-select
                      v-model="BasicInfoObj.tenderType"
                      v-validate="'required'"
                      :data-vv-as="$t('TenderType')"
                      name="TenderType"
                      data-vv-scope="EventCreationValidation"
                      :placeholder="$t('Select')"
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
                    <div
                      class="help-block"
                      v-if="errors.has('TenderType')"
                    >{{ errors.first('TenderType') }}</div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="form-group" :class="{'has-error':errors.has('QuotationNumber')}">
                    <label class="col-form-label">{{$t("QuotationNumber")}}</label>
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
                    >{{ errors.first('QuotationNumber') }}</div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="form-group" :class="{'has-error':errors.has('quotationDescription')}">
                    <label class="col-form-label">{{$t("quotationDescription")}}</label>

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
                    <div class="help-block" v-if="errors.has('quotationDescription')">
                      {{ $t('requiredField')}}
                      <!--{{ errors.first('Subject') }}-->
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <b-form inline>
                    <b-form-checkbox
                      disabled
                      v-model="BasicInfoObj.isNonMSSCustomerName"
                    >{{$t("NonMSSCustomerName")}}</b-form-checkbox>
                  </b-form>

                  <div
                    class="form-group"
                    :class="{'has-error':errors.has('MSSCustomerName')}"
                    v-if="!BasicInfoObj.isNonMSSCustomerName"
                  >
                    <label class="col-form-label">{{$t("MSSCustomerName")}}</label>
                    <label class="required" v-if="!BasicInfoObj.nonMSSCustomerName">*</label>
                    <br />
                    <!-- <el-select
                      v-model="BasicInfoObj.mssCustomerCode"
                      v-validate="!BasicInfoObj.isNonMSSCustomerName ? 'required' : ''"
                      :data-vv-as="$t('MSSCustomerName')"
                      name="MSSCustomerName"
                      :placeholder="$t('Select')"
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
                    <div class="help-block" v-if="errors.has('MSSCustomerName')">
                      {{ $t('requiredField')}}
                      <!--{{ errors.first('MSSCustomerName') }}-->
                    </div>
                  </div>

                  <div
                    class="form-group"
                    :class="{'has-error':errors.has('NonMSSCustomerName')}"
                    v-if="BasicInfoObj.isNonMSSCustomerName"
                  >
                    <label class="col-form-label">{{$t("MSSCustomerName")}}</label>

                    <input
                      type="text"
                      name="NonMSSCustomerName"
                      class="form-control"
                      v-model="BasicInfoObj.nonMssCustomerName"
                      v-validate="BasicInfoObj.isNonMSSCustomerName ? 'required' : ''"
                      :data-vv-as="$t('NonMSSCustomerName')"
                      disabled
                      autocomplete="off"
                    />
                    <div class="help-block" v-if="errors.has('NonMSSCustomerName')">
                      {{ $t('requiredField')}}
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
                        :to="{ name: 'tenderNewCalculationSheet', params: {CalSheetId: BasicInfoObj.parentCalculationId}}"
                      >{{BasicInfoObj.parentCalculationId}}</router-link>
                    </strong>
                  </div>-->
                </div>
              </div>
              <div class="col-md-4">
                <div class="col-md-12">
                  <div class="form-group" :class="{'has-error':errors.has('ReleaseDate')}">
                    <label class="col-form-label">{{$t("ReleaseDate")}}</label>

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
                      {{ $t('requiredField')}}
                      <!--{{ errors.first('ReleaseDate') }}-->
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="form-group" :class="{'has-error':errors.has('SubmissionDate')}">
                    <label class="col-form-label">{{$t("SubmissionDate")}}</label>

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
                      {{ $t('requiredField')}}
                      <!--{{ // errors.first('SubmissionDate') }}-->
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="form-group" :class="{'has-error':errors.has('Validity')}">
                    <label class="col-form-label">{{$t("Validity")}}</label>

                    <br />
                    <el-select
                      v-model="BasicInfoObj.validity"
                      v-validate="'required'"
                      :data-vv-as="$t('Validity')"
                      name="Validity"
                      :placeholder="$t('Select')"
                      clearable
                      filterable
                      class="full-width"
                      disabled
                    >
                      <el-option
                        v-if="validityList.length"
                        v-for="option in validityList"
                        v-bind:value="option.id"
                        :label="option.name"
                        v-bind:key="option.id"
                      ></el-option>
                    </el-select>
                    <div class="help-block" v-if="errors.has('Validity')">
                      {{ $t('requiredField')}}
                      <!--{{ errors.first('Validity') }}-->
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="form-group">
                    <label class="col-form-label">{{$t("ValidityHint")}}</label>
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
                  <div class="form-group" :class="{'has-error':errors.has('IsFunded')}">
                    <b-form-checkbox disabled v-model="BasicInfoObj.isFunded">{{$t("IsFunded")}}</b-form-checkbox>

                    <!--  -->
                    <div class="help-block" v-if="errors.has('IsFunded')">
                      {{ $t('requiredField')}}
                      <!--{{ errors.first('IsFunded') }}-->
                    </div>
                  </div>

                  <div
                    class="form-group"
                    :class="{'has-error':errors.has('FunderName')}"
                    v-if="BasicInfoObj.isFunded"
                  >
                    <label class="col-form-label">{{$t("FunderName")}}</label>

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
                      {{ $t('requiredField')}}
                      <!--{{ errors.first('FunderName') }}-->
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="col-md-12">
                  <div class="form-group" :class="{'has-error':errors.has('Status')}">
                    <label class="col-form-label">{{$t("Status")}}</label>
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
                    <div class="help-block" v-if="errors.has('Status')">{{ $t('requiredField')}}</div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="form-group" :class="{'has-error':errors.has('TenderCurrency')}">
                    <label class="col-form-label">{{$t("TenderCurrency")}}</label>

                    <br />
                    <el-select
                      v-model="BasicInfoObj.tenderCurrencyCode"
                      v-validate="'required'"
                      :data-vv-as="$t('TenderCurrency')"
                      name="TenderCurrency"
                      :placeholder="$t('Select')"
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
                    <div
                      class="help-block"
                      v-if="errors.has('TenderCurrency')"
                    >{{ $t('requiredField')}}</div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{'has-error':errors.has('EventCreationValidation.Warranty')}"
                  >
                    <label class="col-form-label">{{$t("Warranty")}}</label>

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
                    >{{ errors.first('EventCreationValidation.Warranty') }}</div>
                  </div>
                </div>

                <div class="col-md-12" style="margin-top: -5px;">
                  <div class="form-group" :class="{'has-error':errors.has('PaymentTerms')}">
                    <label class="col-form-label">{{$t("PaymentTerms")}}</label>
                    <input
                      type="text"
                      name="paymentTerms"
                      class="form-control"
                      v-model="BasicInfoObj.paymentTerms"
                      v-validate="BasicInfoObj.paymentTerms ? 'required|max:30' : ''"
                      :data-vv-as="$t('PaymentTerms')"
                      autocomplete="off"
                      disabled
                    />
                    <div
                      class="help-block"
                      v-if="errors.has('paymentTerms')"
                    >{{ errors.first('paymentTerms') }}</div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="form-group" :class="{'has-error':errors.has('IsVat')}">
                    <div class="row">
                      <div class="col-md-12">
                        <b-form-checkbox disabled v-model="BasicInfoObj.isVat">{{$t("IsVat")}}</b-form-checkbox>

                        <!---->
                        <div class="help-block" v-if="errors.has('IsVat')">
                          {{ errors.first('IsVat')
                          }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="form-group"
                    :class="{'has-error':errors.has('VatValue')}"
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
                    <div class="help-block" v-if="errors.has('VatValue')">{{ $t('requiredField')}}</div>
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
      v-if="BasicInfoObj.tenderCalculationSheetAttachment.length > 0 && BasicInfoObj.tenderCalculationSheetAttachment"
    >
      <div slot="header">
        {{$t("attachment")}}
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
                <div class="offset-3" v-if="BasicInfoObj.tenderCalculationSheetAttachment.length > 0">
                  <table class="table table-striped table-hover col-md-8 table-outline">
                    <thead>
                      <tr>
                        <th>File name</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody v-if="BasicInfoObj.tenderCalculationSheetAttachment.length >0">
                      <tr
                        v-for="(attachemnt,index) in BasicInfoObj.tenderCalculationSheetAttachment"
                        v-if="!attachemnt.deleted"
                      >
                        <td>{{attachemnt.fileName}}</td>
                        <td>{{attachemnt.description}}</td>
                        <td>
                          <a style="cursor: pointer;"
                            @click="downloadAttachment(attachemnt.quid,attachemnt.fileName)"
                            v-if="attachemnt.quid"
                            class="ml-1"
                          >
                            <i class="fa fa-download"></i>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  class="form-row"
                  v-if="BasicInfoObj.tenderCalculationSheetAttachment.length == 0 || !BasicInfoObj.tenderCalculationSheetAttachment.length"
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
        {{$t("tenderCalculationSheetGroups")}}
        <div class="card-header-actions">
          <b-link class="card-header-action btn-minimize" v-b-toggle.collapseView>
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
            v-if="tenderCalculationSheetGroups.length > 0"
            v-for="(CalcGroup,index) in tenderCalculationSheetGroups"
            :key="index"
          >
            <b-col lg="12">
              <b-card class="card card-accent-primary" no-body>
                <div slot="header">
                  <div class="row">
                    <label class="col-sm-1 col-form-label">{{$t("Item")}}-{{index+1}}</label>
                    <label class="col-form-label">{{ $t('name')}} - {{ CalcGroup.name}}</label>
                    &nbsp; &nbsp; &nbsp; &nbsp;
                    <label
                      class="col-form-label"
                    >{{ $t('number')}} - {{ CalcGroup.number}}</label>
                    &nbsp; &nbsp; &nbsp; &nbsp;
                    <label
                      class="col-form-label" 
                    >{{ $t('DeliveryTerms')}} - {{ CalcGroup.deliveryTerms}}</label>
                    &nbsp; &nbsp; &nbsp; &nbsp;
                     <label
                      class="col-form-label" 
                    >{{ $t('Warranty')}} - {{ CalcGroup.warranty}}</label> 
                  </div>
                </div>
                <b-collapse :id="'mainItem-'+index" visible>
                  <b-card-body>
                    <div class="table-responsive-lg table-responsive">
                      <el-table
                        class="table-sm table-responsive custom-table"
                        :data="CalcGroup.tenderCalculationSheetItem"
                        size="mini"
                        style="width: 100%"
                      >
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column sortable prop="name" label="Item description" width="180"></el-table-column>
                        <el-table-column sortable prop="vendor" label="Vendor" width="180"></el-table-column>
                        <el-table-column sortable prop="onHandPrice" label="OH price" width="140"></el-table-column>
                        <el-table-column sortable prop="onHandQuantity" label="OH Qty" width="140"></el-table-column>
                        <el-table-column sortable prop="cost" label="Cost" width="140"></el-table-column>
                        <el-table-column sortable prop="currencyCode" label="Currency" width="120"></el-table-column>

                        <el-table-column sortable prop="discount1" label="Disc1%" width="120"></el-table-column>
                        <el-table-column sortable prop="discount2" label="Disc2%" width="120"></el-table-column>
                        <el-table-column sortable prop="costType" label="Cost type " width="120"></el-table-column>

                        <el-table-column sortable prop="shipment" label="S&C %" width="120"></el-table-column>
                        <el-table-column sortable prop="landedCost" label="Landed cost" width="120"></el-table-column>
                        <el-table-column sortable prop="grossMargin" label="GM%" width="120"></el-table-column>

                        <el-table-column sortable prop="unitPrice" label="Unit price" width="120"></el-table-column>
                        <el-table-column sortable prop="quantity" label="Quantity" width="120"></el-table-column>
                        <el-table-column sortable prop="amount" label="Total price" width="120"></el-table-column>
                        <el-table-column sortable prop="grossMarginValue" label="Gross margin" width="160"></el-table-column>

                        <el-table-column sortable prop="note" label="note" width="120"></el-table-column>


                      </el-table>
                    </div>
                    <br />
                    <b-card
                      class="card card-accent-primary mt-3"
                      v-if="CalcGroup.tenderCalculationSheetOptionalGroup"
                    >
                      <div slot="header">
                        {{$t("Item")}}-{{index+1}} {{$t('optionalItems')}}
                        <div class="card-header-actions">
                          <b-link
                            class="card-header-action btn-minimize"
                            v-b-toggle="'ItemoptionalGroup-'+index"
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
                      <b-collapse :id="'ItemoptionalGroup-'+index" visible>
                        <div class="table-responsive-lg table-responsive">
                          <el-table
                            class="table-sm table-responsive custom-table"
                            :data="CalcGroup.tenderCalculationSheetOptionalGroup.tenderCalculationSheetItem"
                            size="mini"
                            style="width: 100%"
                          >
                              <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column sortable prop="name" label="Item description" width="180"></el-table-column>
                        <el-table-column sortable prop="vendor" label="Vendor" width="180"></el-table-column>
                        <el-table-column sortable prop="onHandPrice" label="OH price" width="140"></el-table-column>
                        <el-table-column sortable prop="onHandQuantity" label="OH Qty" width="140"></el-table-column>
                        <el-table-column sortable prop="cost" label="Cost" width="140"></el-table-column>
                        <el-table-column sortable prop="currencyCode" label="Currency" width="120"></el-table-column>

                        <el-table-column sortable prop="discount1" label="Disc1%" width="120"></el-table-column>
                        <el-table-column sortable prop="discount2" label="Disc2%" width="120"></el-table-column>
                        <el-table-column sortable prop="costType" label="Cost type " width="120"></el-table-column>

                        <el-table-column sortable prop="shipment" label="S&C %" width="120"></el-table-column>
                        <el-table-column sortable prop="landedCost" label="Landed cost" width="120"></el-table-column>
                        <el-table-column sortable prop="grossMargin" label="GM%" width="120"></el-table-column>

                        <el-table-column sortable prop="unitPrice" label="Unit price" width="120"></el-table-column>
                        <el-table-column sortable prop="quantity" label="Quantity" width="120"></el-table-column>
                        <el-table-column sortable prop="amount" label="Total price" width="120"></el-table-column>
                        <el-table-column sortable prop="grossMarginValue" label="Gross margin" width="160"></el-table-column>

                        <el-table-column sortable prop="note" label="note" width="120"></el-table-column>
                          </el-table>
                        </div>
                        <br />
                      </b-collapse>
                    </b-card>
                    <br />
                    <b-card
                      class="card card-accent-primary"
                      no-body
                      v-if="CalcGroup.tenderCalculationSheetAlternativeGroup.length > 0"
                      v-for="(alternativeGroup,alternativeGroupIndex) in CalcGroup.tenderCalculationSheetAlternativeGroup"
                      :key="alternativeGroupIndex"
                    >
                      <div slot="header">
                        <div class="pabsolute">
                          <div class="card-header-actions">
                            <b-link
                              class="card-header-action btn-minimize"
                              v-b-toggle="'alternativeGroup-'+index+alternativeGroupIndex"
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
                          <label
                            class="col-sm-4 col-form-label"
                          >{{ $t('AlternativeGroup')}} {{ alternativeGroupIndex+1}}</label>
                          <label class="col-form-label">{{ $t('name')}} - {{ alternativeGroup.name}}</label>
                        </div>
                      </div>
                      <b-collapse :id="'alternativeGroup-'+index+alternativeGroupIndex" visible>
                        <b-card-body>
                          <div class="table-responsive-lg table-responsive">
                            <el-table
                              class="table-sm table-responsive custom-table"
                              :data="alternativeGroup.tenderCalculationSheetItem"
                              size="mini"
                              style="width: 100%"
                            >
                                <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column sortable prop="name" label="Item description" width="180"></el-table-column>
                        <el-table-column sortable prop="vendor" label="Vendor" width="180"></el-table-column>
                        <el-table-column sortable prop="onHandPrice" label="OH price" width="140"></el-table-column>
                        <el-table-column sortable prop="onHandQuantity" label="OH Qty" width="140"></el-table-column>
                        <el-table-column sortable prop="cost" label="Cost" width="140"></el-table-column>
                        <el-table-column sortable prop="currencyCode" label="Currency" width="120"></el-table-column>

                        <el-table-column sortable prop="discount1" label="Disc1%" width="120"></el-table-column>
                        <el-table-column sortable prop="discount2" label="Disc2%" width="120"></el-table-column>
                        <el-table-column sortable prop="costType" label="Cost type " width="120"></el-table-column>

                        <el-table-column sortable prop="shipment" label="S&C %" width="120"></el-table-column>
                        <el-table-column sortable prop="landedCost" label="Landed cost" width="120"></el-table-column>
                        <el-table-column sortable prop="grossMargin" label="GM%" width="120"></el-table-column>

                        <el-table-column sortable prop="unitPrice" label="Unit price" width="120"></el-table-column>
                        <el-table-column sortable prop="quantity" label="Quantity" width="120"></el-table-column>
                        <el-table-column sortable prop="amount" label="Total price" width="120"></el-table-column>
                        <el-table-column sortable prop="grossMarginValue" label="Gross margin" width="160"></el-table-column>

                        <el-table-column sortable prop="note" label="note" width="120"></el-table-column>
                            </el-table>
                            <br />
                            <b-card
                              class="card card-accent-primary mt-3"
                              v-if="alternativeGroup.tenderCalculationSheetAlternativeOptionalGroup != null"
                            >
                              <div slot="header">
                                {{ $t('AlternativeGroup')}} {{ alternativeGroupIndex+1}} {{$t('optionalItems')}}
                                <div class="card-header-actions">
                                  <b-link
                                    class="card-header-action btn-minimize"
                                    v-b-toggle="'optionalGroup-'+index"
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
                              <b-collapse :id="'optionalGroup-'+index" visible>
                                <div class="table-responsive-lg table-responsive">
                                  <el-table
                                    class="table-sm table-responsive custom-table"
                                    :data="alternativeGroup.tenderCalculationSheetAlternativeOptionalGroup.tenderCalculationSheetItem"
                                    size="mini"
                                    style="width: 100%"
                                  >
                                    <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column sortable prop="name" label="Item description" width="180"></el-table-column>
                        <el-table-column sortable prop="vendor" label="Vendor" width="180"></el-table-column>
                        <el-table-column sortable prop="onHandPrice" label="OH price" width="140"></el-table-column>
                        <el-table-column sortable prop="onHandQuantity" label="OH Qty" width="140"></el-table-column>
                        <el-table-column sortable prop="cost" label="Cost" width="140"></el-table-column>
                        <el-table-column sortable prop="currencyCode" label="Currency" width="120"></el-table-column>

                        <el-table-column sortable prop="discount1" label="Disc1%" width="120"></el-table-column>
                        <el-table-column sortable prop="discount2" label="Disc2%" width="120"></el-table-column>
                        <el-table-column sortable prop="costType" label="Cost type " width="120"></el-table-column>

                        <el-table-column sortable prop="shipment" label="S&C %" width="120"></el-table-column>
                        <el-table-column sortable prop="landedCost" label="Landed cost" width="120"></el-table-column>
                        <el-table-column sortable prop="grossMargin" label="GM%" width="120"></el-table-column>

                        <el-table-column sortable prop="unitPrice" label="Unit price" width="120"></el-table-column>
                        <el-table-column sortable prop="quantity" label="Quantity" width="120"></el-table-column>
                        <el-table-column sortable prop="amount" label="Total price" width="120"></el-table-column>
                        <el-table-column sortable prop="grossMarginValue" label="Gross margin" width="160"></el-table-column>

                        <el-table-column sortable prop="note" label="note" width="120"></el-table-column>
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
            v-if="tenderCalculationSheetGroups.length == 0 || !tenderCalculationSheetGroups"
          >
            <h4>No data to show</h4>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card class="card card-accent-primary" no-body v-if="versions.length > 0">
      <div slot="header">
        {{$t("Versions")}}
        <div class="card-header-actions">
          <b-link class="card-header-action btn-minimize" v-b-toggle.collapseVersion>
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
                    <th scope="col" class="pt-1 pb-1 text-center">{{$t("VersionName")}}</th>
                    <th scope="col" class="pt-1 pb-1 text-center">{{$t("VersionNumber")}}</th>
                    <th scope="col" class="pt-1 pb-1 text-center">{{$t("Actions")}}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(version, index) in versions" v-bind:key="index">
                    <td class="align-middle text-center">
                      <span v-if="index == 0">Original</span>
                      <span v-if="index > 0">Version {{index}}</span>
                    </td>
                    <td class="align-middle text-center">{{version.tenderNumber}}</td>
                    <td class="align-middle text-center">
                      <router-link
                        target="_blank"
                        title="Action"
                        class="text-primary"
                        :to="{ name: 'tenderViewCalculationSheet', params: {CalSheetId: version.id}}"
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
      CalSheetId: this.$route.params.CalSheetId,
      currentCalcNumber: 1,
      tenderCalculationSheetGroups: [],
      BasicInfoObj: {
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
        tenderCalculationSheetCurrencyRate: [],
        isNonMSSCustomerName: false,
        mssCustomerName: "",
        status: 1,
        creator: 0,
        type: 1,
        tenderType: "",
        tenderNumber: "",
        tenderName: "",
        warranty: "",
        tenderCalculationSheetAttachment: [],
        versionNo: 0,
        parentCalculationId: 0,
        paymentTerms: "",
        isFinalVersion:false,
        hasPriceQuotation:false
      }
    };
  },
  created: function() {
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
     "$route.path": function(val, oldVal) {
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
      deep: true
    }
  },

  methods: {
    checkPriceActions(roleName) {
      return checkRoles("Price Quotation", roleName);
    },
    Award() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/TenderCalculationSheets/" +
        this.CalSheetId +
        "/Award";
      this.$http
        .put(
          urlStr,
          {},
          {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          }
        )
        .then(
          response => {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "success",
              message: this.$t("UpdatedSuccessfully")
            });
            this.FillData();
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
        downloadAttachment(quid, name) {
      let urlStr =
        this.$store.getters.serverURI +
        "api/TenderCalculationSheet/DownLoadFile/" +
        quid +
        "/?name=" +name;

      axios({
        method: "post",
        url: urlStr,
        headers: this.$store.getters.tokenAuthonticationHeaderObj,
        responseType: "blob"
      }).then(response => {
        this.fullscreenLoading = false;
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        var fileName = name;
        fileLink.href = fileURL;
        fileLink.setAttribute("download",fileName);
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
    init_component() {
      this.FillValidityList();
      this.getTenderTypeLookups();
      // this.FillMssCustomers();
      this.FillData();
      this.FillCalcuationSheetGroupItemsData();
    },
    Excel() {
      let urlStr =
        this.$store.getters.serverURI +
        "api/TenderCalculationSheets/" +
        this.CalSheetId +
        "/Export";
      // window.open(urlStr, "_blank");

      axios({
        method: "post",
        url: urlStr,
        headers: this.$store.getters.tokenAuthonticationHeaderObj,
        responseType: "blob"
      }).then(response => {
        this.fullscreenLoading = false;
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        var fileName = "Calculation_Sheet_" + this.BasicInfoObj.tenderNumber;
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
    FillMssCustomers: function() {
      var urlStr = this.$store.getters.serverURI + "api/Item/GetAllMssCustomer";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.mssCustomers = data.body;
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
    getTenderTypeLookups: function() {
      var urlTypesStr =
        this.$store.getters.serverURI + "api/lookup/GetByCode/TenderType";
      this.$http
        .get(urlTypesStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(function(data) {
          this.tenderTypes = data.body;
        });
    },
    FillValidityList: function() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.Validity;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.validityList = data.body;
            this.validityList = this.validityList.sort((a,b)=> parseInt(a.code) - parseInt(b.code))
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
    workflowAction(actionId) {
      var urlStr = this.$store.getters.serverURI + "api/WorkflowLog";
      this.$http
        .post(
          urlStr,
          {
            id: 0,
            tenderCalculationSheetId: this.CalSheetId,
            WorkflowId: this.WorkflowId,
            StepId: this.StepId,
            ActionId: actionId
          },
          {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          }
        )
        .then(
          response => {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "success",
              message: "process done "
            });
            this.$router.push({ path: "/tenderCalculationSheets" });
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
    FillCalcuationSheetGroupItemsData: function() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/TenderCalculationSheet/GetMainGroup/" +
        this.CalSheetId;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            if (data.body.tenderCalculationSheetMainGroup.length) {
              this.tenderCalculationSheetGroups = data.body.tenderCalculationSheetMainGroup;
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
    FillData: function() {
      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/TenderCalculationSheet/GetBasicInfoDetail/" +
        this.CalSheetId;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.fullscreenLoading = false;
            
            this.BasicInfoObj = data.body;
            let days = this.validityList.filter(
              item => item.id == this.BasicInfoObj.validity
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

            // if (data.body.tenderCalculationSheetStatus) {
            //   this.status = data.body.tenderCalculationSheetStatus.name;
            // }
            this.BasicInfoObj.tenderCalculationSheetCurrencyRate =
              data.body.tenderCalculationSheetCurrencyRate;

            this.status = data.body.formattedStatus;
            this.versions = data.body.previousVersionsOfTenderCalculationSheets;
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
    getCurrentStep() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/WorkflowLog/GetCurrentStep?id=" +
        this.CalSheetId;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(function(data) {
          this.StepId = data.body.id;
          this.WorkflowId = data.body.workflowSettingId;
          this.workflowStepActionSetting = data.body.workflowStepActionSetting;
        });
    }
  }
};
</script>

