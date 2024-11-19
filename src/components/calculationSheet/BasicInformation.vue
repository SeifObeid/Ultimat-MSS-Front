<template>
  <div refs="calcuationSheetBasicInfo">
    <b-card class="card card-accent-primary" no-body v-loading.fullscreen.lock="fullscreenLoading">
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
                  <div class="form-group" :class="{ 'has-error': errors.has('TenderNameCustomer') }">
                    <label class="col-form-label">{{ $t("TenderNameMedical") }}</label>
                    <label class="required">*</label>
                    <input type="text" name="TenderNameCustomer" class="form-control" v-model="BasicInfoObj.tenderName"
                      v-validate="'required'" autocomplete="off" :data-vv-as="$t('TenderNameCustomer')" />
                    <div class="help-block" v-if="errors.has('TenderNameCustomer')">{{
                      errors.first('TenderNameCustomer') }}</div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('TenderType') }">
                    <label class="col-form-label">{{ $t("TenderType") }}</label>
                    <label class="required">*</label>
                    <br />
                    <el-select v-model="BasicInfoObj.tenderType" v-validate="'required'" :data-vv-as="$t('TenderType')"
                      name="TenderType" :placeholder="$t('Select')" clearable filterable>
                      <el-option v-for="option in tenderTypes" v-bind:value="option.id" :label="option.name"
                        v-bind:key="option.id"></el-option>
                    </el-select>
                    <div class="help-block" v-if="errors.has('TenderType')">
                      <label class="mt-1">{{ $t('TenderType') }}</label>
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('QuotationNumber') }">
                    <label class="col-form-label">{{ $t("QuotationNumber") }}</label>
                    <input type="text" name="QuotationNumber" class="form-control" v-model="BasicInfoObj.tenderNumber"
                      v-validate="'required'" :data-vv-as="$t('QuotationNumber')" autocomplete="off" disabled />
                    <div class="help-block" v-if="errors.has('QuotationNumber')">{{ errors.first('QuotationNumber') }}
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('quotationDescription') }">
                    <label class="col-form-label">{{ $t("quotationDescription") }}</label>
                    <label class="required">*</label>
                    <textarea rows="2" name="quotationDescription" class="form-control"
                      :maxlength="$store.getters.getMaxLength.length300" v-model="BasicInfoObj.quotationDescription"
                      v-validate="'required|max:300'" autocomplete="off" :data-vv-as="$t('quotationDescription')">
                      </textarea>
                    <div class="help-block" v-if="errors.has('quotationDescription')">{{
                      errors.first('quotationDescription') }}</div>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('ReleaseDate') }">
                    <label class="col-form-label">{{ $t("ReleaseDate") }}</label>
                    <label class="required">*</label>
                    <!-- :picker-options="dateLessThanToday" -->
                    <el-date-picker v-model="BasicInfoObj.releaseDate" name="ReleaseDate"
                      :data-vv-as="$t('ReleaseDate')" v-validate="'required'" type="date"
                      v-bind:format="this.$store.getters.getDateFormat"></el-date-picker>
                    <div class="help-block" v-if="errors.has('ReleaseDate')">
                      <label class="mt-1">{{ $t('requiredField') }}</label>
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('SubmissionDate') || ErrorDate == true }">
                    <label class="col-form-label">{{ $t("SubmissionDate") }}</label>
                    <label class="required">*</label>
                    <el-date-picker v-model="BasicInfoObj.submissionDate" name="SubmissionDate"
                      :data-vv-as="$t('SubmissionDate')" v-validate="'required'" type="datetime"
                      :picker-options="disableDates"
                      v-bind:format="this.$store.getters.getDateTimeFormat"></el-date-picker>
                    <div class="help-block" v-if="errors.has('SubmissionDate')">
                      <label class="mt-1">{{ $t('requiredField') }}</label>
                    </div>
                    <div class="help-block" v-if="ErrorDate == true">
                      <label class="mt-1">{{ $t('ErrorDate') }}</label>
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('Validity') }">
                    <label class="col-form-label">{{ $t("Validity") }}</label>
                    <label class="required">*</label>
                    <br />
                    <el-select v-model="BasicInfoObj.validity" v-validate="'required'" :data-vv-as="$t('Validity')"
                      name="Validity" :placeholder="$t('Select')" clearable filterable class="full-width">
                      <el-option v-for="option in validityList" v-bind:value="option.id" :label="option.name"
                        v-bind:key="option.id"></el-option>
                    </el-select>
                    <div class="help-block" v-if="errors.has('Validity')">
                      <label class="mt-1">{{ $t('requiredField') }}</label>
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="form-group">
                    <label class="col-form-label">{{ $t("ValidityHint") }}</label>
                    <input disabled type="text" name="ValidityHint" class="form-control" v-model="validtill"
                      autocomplete="off" />
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('Status') }">
                    <label class="col-form-label">{{ $t("Status") }}</label>
                    <br />
                    <input type="text" name="Status" class="form-control" v-model="status" :data-vv-as="$t('Status')"
                      disabled autocomplete="off" />
                    <div class="help-block" v-if="errors.has('Status')">
                      {{ $t('requiredField') }}
                      <!--{{ errors.first('Status') }}-->
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('Currency(Multiply)') }">
                    <label class="col-form-label">{{ $t("Currency(Multiply)") }}</label>
                    <label class="required">*</label>
                    <br />
                    <!-- :disabled="isMssCustomerDisabled" -->
                    <el-select v-model="BasicInfoObj.tenderCurrencyCode" name="Currency(Multiply)" remote
                      reserve-keyword :remote-method="remoteMethodCurrency" :loading="loadingAccount"
                      :placeholder="$t('Select')" :data-vv-as="$t('Currency(Multiply)')" clearable filterable
                      v-validate="'required'" @change="fillCalculationCurrencyRate()">
                      <el-option v-for="option in tenderCurrencies" v-bind:value="option.code"
                        :label="option.nameAndCode" v-bind:key="option.code"></el-option>
                    </el-select>
                    <div class="help-block" v-if="errors.has('Currency(Multiply)')">
                      <label class="mt-1">{{ $t('requiredField') }}</label>
                    </div>
                  </div>
                </div>


              <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('Warranty') }">
                    <b-form class="form-inline pt-3 pb-1">
                      <b-form-checkbox v-model="BasicInfoObj.warrantyForAllGroups">{{ $t("Warranty")
                        }}</b-form-checkbox>
                    </b-form>
                    <el-select v-model="BasicInfoObj.warrantyId"  :data-vv-as="$t('Warranty')"
                      name="warrantyId" :placeholder="$t('Select')" clearable filterable class="full-width">
                      <el-option v-for="option in warrantyList" v-bind:value="option.id" :label="option.name"
                        v-bind:key="option.id"></el-option>
                    </el-select>
                   
                  </div>
                </div>


                <!-- seif -->
                <!-- <div class="col-md-12" style="display: none;">
                  <div class="form-group" :class="{ 'has-error': errors.has('Warranty') }">
                    <b-form class="form-inline pt-3 pb-1">
                      <b-form-checkbox v-model="BasicInfoObj.warrantyForAllGroups">{{ $t("Warranty")
                        }}</b-form-checkbox>
                    </b-form>
      
                    <input type="text" name="Warranty" class="form-control" v-model="BasicInfoObj.warranty"
                      v-validate="BasicInfoObj.warrantyForAllGroups ? 'required|max:30' : ''"
                      :data-vv-as="$t('Warranty')" autocomplete="off" />
                    <div class="help-block" v-if="errors.has('Warranty')">{{ errors.first('Warranty') }}</div>
                  </div>
                </div> -->

                <div class="col-md-12" style="margin-top: -5px;">
                  <div class="form-group" :class="{ 'has-error': errors.has('paymentTerms') }">
                    <label class="col-form-label">{{ $t("PaymentTerms") }}</label>
                    <!-- <label class="required">*</label> -->
                    <input type="text" name="paymentTerms" class="form-control" v-model="BasicInfoObj.paymentTerms"
                      v-validate="BasicInfoObj.paymentTerms ? 'required|max:30' : ''" :data-vv-as="$t('PaymentTerms')"
                      autocomplete="off" />
                    <div class="help-block" v-if="errors.has('paymentTerms')">{{ errors.first('paymentTerms') }}</div>
                  </div>
                </div>

              </div>
            </div>
            <div class="row">
              <div class="col-md-4">
                <div class="col-md-12">
                  <b-form inline>
                    <b-form-checkbox v-model="BasicInfoObj.isNonMSSCustomerName">{{ $t("NonMSSCustomerName")
                      }}</b-form-checkbox>
                  </b-form>

                  <div class="form-group" :class="{ 'has-error': errors.has('MSSCustomerName') }"
                    v-if="!BasicInfoObj.isNonMSSCustomerName">
                    <label class="col-form-label">{{ $t("MSSCustomerName") }}</label>
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
                      @input="MssCustomerUpdated"
                      class="full-width"
                      :disabled="isMssCustomerDisabled"
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

                    <el-select v-model="BasicInfoObj.mssCustomerCode" name="MSSCustomerName" remote reserve-keyword
                      :remote-method="remoteMethodMSSCustomer" :loading="loadingAccount" :placeholder="$t('Select')"
                      clearable filterable :data-vv-as="$t('MSSCustomerName')" :disabled="isMssCustomerDisabled"
                      @input="MssCustomerUpdated" :value="BasicInfoObj.mssCustomerCode"
                      v-validate="!BasicInfoObj.isNonMSSCustomerName ? 'required' : ''">
                      <el-option v-for="option in mssCustomers" v-bind:value="option.code" :label="option.name"
                        v-bind:key="option.code"></el-option>
                    </el-select>

                    <div class="help-block" v-if="errors.has('MSSCustomerName')">
                      <label class="mt-1">{{ $t('requiredField') }}</label>
                    </div>
                  </div>

                  <div class="form-group" :class="{ 'has-error': errors.has('NonMSSCustomerName') }"
                    v-if="BasicInfoObj.isNonMSSCustomerName">
                    <label class="col-form-label">{{ $t("MSSCustomerName") }}</label>
                    <label class="required">*</label>
                    <input type="text" name="NonMSSCustomerName" class="form-control"
                      v-model="BasicInfoObj.nonMssCustomerName"
                      v-validate="BasicInfoObj.isNonMSSCustomerName ? 'required|max:30' : ''"
                      :data-vv-as="$t('NonMSSCustomerName')" autocomplete="off" />
                    <div class="help-block" v-if="errors.has('NonMSSCustomerName')">{{
                      errors.first('NonMSSCustomerName') }}</div>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('IsFunded') }">
                    <b-form-checkbox v-model="BasicInfoObj.isFunded">{{ $t("IsFunded") }}</b-form-checkbox>
                    <div class="help-block" v-if="errors.has('IsFunded')">{{ $t('requiredField') }}</div>
                  </div>

                  <div class="form-group" :class="{ 'has-error': errors.has('FunderName') }">
                    <label class="col-form-label">{{ $t("FunderName") }}</label>
                    <label class="required">*</label>
                    <input :disabled="!BasicInfoObj.isFunded" type="text" name="FunderName" class="form-control"
                      v-model="BasicInfoObj.funderName" v-validate="BasicInfoObj.isFunded ? 'required|max:30' : ''"
                      :data-vv-as="$t('FunderName')" autocomplete="off" />
                    <div class="help-block" v-if="errors.has('FunderName')">{{ errors.first('FunderName') }}</div>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('IsVat') }">
                    <div class="row">
                      <div class="col-md-12">
                        <b-form-checkbox v-model="BasicInfoObj.isVat">{{ $t("IsVat") }}</b-form-checkbox>
                        <div class="help-block" v-if="errors.has('IsVat')">
                          {{ errors.first('IsVat') }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="form-group" :class="{ 'has-error': errors.has('vatValue') }">
                    <label class="col-form-label">VAT value (%)</label>
                    <label class="required">*</label>
                    <input v-if="BasicInfoObj.isVat" type="number" min="0" max="100" name="vatValue"
                      class="form-control" v-model="BasicInfoObj.vatValue"
                      v-validate="BasicInfoObj.isVat ? 'required' : ''" :data-vv-as="$t('VatValue')"
                      autocomplete="off" />
                    <input v-if="!BasicInfoObj.isVat" disabled type="text" name="vatValue1" class="form-control"
                      autocomplete="off" />
                    <div class="help-block"
                      v-if="errors.has('vatValue') && BasicInfoObj.isVat && errors.items[0].rule == 'decimal'">{{
                        $t('vatValidation') }}</div>
                    <div class="help-block"
                      v-if="errors.has('vatValue') && BasicInfoObj.isVat && errors.items[0].rule == 'max_value'">{{
                        $t('vatValidationLessThan100') }}</div>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('bankGuarantee') }">
                    <label class="col-form-label">{{ $t("BankGuaranteeRequired") }}</label>
                    <label class="required">*</label>
                    <br />
                    <!-- BankGuaranteeRequired same as bankGuaranteeId in db --seif -->
                    <el-select v-model="BasicInfoObj.bankGuaranteeId" v-validate="'required'"
                      :data-vv-as="$t('BankGuarantee')" name="bankGuarantee" :placeholder="$t('Select')" clearable
                      filterable class="full-width">
                      <el-option v-for="option in bankGuaranteeArrayList" v-bind:value="option.id" :label="option.name"
                        v-bind:key="option.id"></el-option>
                    </el-select>
                    <div class="help-block" v-if="errors.has('bankGuarantee')">
                      <label class="mt-1">{{ $t('requiredField') }}</label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <div class="col-md-12">
                  <div class="form-group" >
                    <label class="col-form-label">{{ $t("BankGuaranteeType") }}</label>
                    <br />
                    <el-select v-model="BasicInfoObj.basicBankGuaranteeTypeDtl" 
                      :data-vv-as="$t('BankGuaranteeType')" name="BankGuaranteeType" :placeholder="$t('Select')" clearable
                      filterable class="full-width">
                      <el-option v-for="option in basicBankGuaranteeTypeArrayList" v-bind:value="option.id" :label="option.name"
                        v-bind:key="option.id"></el-option>
                    </el-select>
                  </div>
                </div>
              </div>


              <div class="col-md-4">
                <div class="col-md-12">

                  <div class="form-group" :class="{ 'has-error': errors.has('bankGuaranteeDuration') }">
                    <label class="col-form-label">{{ $t("bankGuaranteeDuration") }}</label>
                    <!-- <label class="required">*</label> -->
                    <input type="text" name="bankGuaranteeDuration" class="form-control"
                      v-model="BasicInfoObj.bankGuaranteeDuration"
                      v-validate="BasicInfoObj.bankGuaranteeDuration ? 'required|max:30' : ''"
                      :data-vv-as="$t('bankGuaranteeDuration')" autocomplete="off" />
                    <div class="help-block" v-if="errors.has('bankGuaranteeDuration')">{{
                      errors.first('bankGuaranteeDuration') }}</div>
                  </div>
                </div>

              </div>




              <div class="col-md-4">
                <div class="col-md-12">
                  <!-- :class="{'has-error':errors.has('deadlineForInquires')}" -->
                  <div class="form-group">
                    <label class="col-form-label">{{ $t("deadlineForInquires") }}</label>

                    <el-date-picker v-model="BasicInfoObj.deadlineForInquires" name="deadlineForInquires"
                      :data-vv-as="$t('deadlineForInquires')" type="date"
                      v-bind:format="this.$store.getters.getDateFormat"></el-date-picker>
                    <div class="help-block" v-if="errors.has('deadlineForInquires')">{{
                      errors.first('deadlineForInquires') }}</div>
                  </div>

                </div>

              </div>
              <!-- seif %%%%%%%%%%%%%%%%%%%%% start%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%-->

              <div class="col-md-4" style="margin-top: -5px;">
                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('endUser') }">
                    <label class="col-form-label">{{ $t("endUser") }}</label>
                    <!-- <label class="required">*</label> -->
                    <input type="text" name="endUser" class="form-control" v-model="BasicInfoObj.endUser"
                      v-validate="BasicInfoObj.endUser ? 'required|max:30' : ''" :data-vv-as="$t('endUser')"
                      autocomplete="off" />
                    <div class="help-block" v-if="errors.has('endUser')">{{ errors.first('endUser') }}</div>
                  </div>

                </div>

              </div>

              <div class="col-md-4" style="margin-top: -5px;">
                <div class="col-md-12">
                  <div class="form-group" >
                    <label class="col-form-label">{{ $t("Companies") }}</label>

                    <!-- <el-select v-model="BasicInfoObj.bankGuaranteeId" v-validate="'required'"
                      :data-vv-as="$t('BankGuarantee')" name="bankGuarantee" :placeholder="$t('Select')" clearable
                      filterable class="full-width">
                      <el-option v-for="option in bankGuaranteeArrayList" v-bind:value="option.id" :label="option.name"
                        v-bind:key="option.id"></el-option>
                    </el-select> -->

                    <el-select  v-model="BasicInfoObj.selectedCompanies"  multiple collapse-tags :data-vv-as="$t('Companies')"  name="Companies"
                      placeholder="Select"  clearable filterable  class="full-width"  >
                        <el-option v-for="option in companiesArrayList" v-bind:value="option.value" :label="option.description" v-bind:key="option.value" > </el-option>
                      
                    </el-select>
                  </div>

                </div>

              </div>

              <div class="col-md-4" style="margin-top: -5px;">
                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('numberOfItems') }">
                    <label class="col-form-label">{{ $t("numberOfItems") }}</label>
                    <!-- <label class="required">*</label> -->
                    <input type="text" name="numberOfItems" class="form-control" v-model="BasicInfoObj.numberOfItems"
                      v-validate="BasicInfoObj.numberOfItems ? 'required|max:30' : ''" :data-vv-as="$t('numberOfItems')"
                      autocomplete="off" />
                    <div class="help-block" v-if="errors.has('numberOfItems')">{{ errors.first('numberOfItems') }}</div>
                  </div>

                </div>

              </div>
              <div class="col-md-4" style="margin-top: -5px;">
                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('deliveryTerms') }">
                    <label class="col-form-label">{{ $t("deliveryTerms") }}</label>
                    <!-- <label class="required">*</label> -->
                    <input type="text" name="deliveryTerms" class="form-control" v-model="BasicInfoObj.deliveryTerms"
                      v-validate="BasicInfoObj.deliveryTerms ? 'required|max:30' : ''" :data-vv-as="$t('deliveryTerms')"
                      autocomplete="off" />
                    <div class="help-block" v-if="errors.has('deliveryTerms')">{{ errors.first('deliveryTerms') }}</div>
                  </div>

                </div>

              </div>
              <div class="col-md-4" style="margin-top: -5px;">
                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('criteriaOfFinancialEvaluation') }">
                    <label class="col-form-label">{{ $t("criteriaOfFinancialEvaluation") }}</label>
                    <!-- <label class="required">*</label> -->
                    <input type="text" name="criteriaOfFinancialEvaluation" class="form-control"
                      v-model="BasicInfoObj.criteriaOfFinancialEvaluation"
                      v-validate="BasicInfoObj.criteriaOfFinancialEvaluation ? 'required|max:30' : ''"
                      :data-vv-as="$t('criteriaOfFinancialEvaluation')" autocomplete="off" />
                    <div class="help-block" v-if="errors.has('criteriaOfFinancialEvaluation')">{{
                      errors.first('criteriaOfFinancialEvaluation') }}</div>
                  </div>

                </div>

              </div>


              <div class="col-md-4">
                <div class="col-md-12">
                  <!-- :class="{'has-error':errors.has('deadlineOfInquires')}" -->
                  <div class="form-group">
                    <label class="col-form-label">{{ $t("deadlineOfInquires") }}</label>

                    <el-date-picker v-model="BasicInfoObj.deadlineOfInquires" name="deadlineOfInquires"
                      :data-vv-as="$t('deadlineOfInquires')" type="datetime"
                      :picker-options="disableDates"
                      v-bind:format="this.$store.getters.getDateTimeFormat"></el-date-picker>


                    <div class="help-block" v-if="errors.has('deadlineOfInquires')">{{
                      errors.first('deadlineOfInquires') }}</div>
                  </div>

                </div>

              </div>
              <div class="col-md-4" style="margin-top: -5px;">
                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('penalties') }">
                    <label class="col-form-label">{{ $t("penalties") }}</label>
                    <!-- <label class="required">*</label> -->
                    <input type="text" name="penalties" class="form-control" v-model="BasicInfoObj.penalties"
                      v-validate="BasicInfoObj.penalties ? 'required|max:30' : ''" :data-vv-as="$t('penalties')"
                      autocomplete="off" />
                    <div class="help-block" v-if="errors.has('penalties')">{{ errors.first('penalties') }}</div>
                  </div>

                </div>

              </div>
              <div class="col-md-4" style="margin-top: -5px;">
                <div class="col-md-12">
                  <div class="form-group"
                    :class="{ 'has-error': errors.has('submissionAddressForCalenderEventTable') }">
                    <label class="col-form-label">{{ $t("SubmissionAddress") }}</label>
                    <!-- <label class="required">*</label> -->
                    <input type="text" name="submissionAddressForCalenderEventTable" class="form-control"
                      v-model="BasicInfoObj.submissionAddressForCalenderEventTable"
                      v-validate="BasicInfoObj.submissionAddressForCalenderEventTable ? 'required|max:30' : ''"
                      :data-vv-as="$t('SubmissionAddress')" autocomplete="off" />
                    <div class="help-block" v-if="errors.has('submissionAddressForCalenderEventTable')">{{
                      errors.first('submissionAddressForCalenderEventTable') }}</div>
                  </div>

                </div>

              </div>
              <div class="col-md-4">
                <div class="col-md-12">
                  <div class="form-group" :class="{ 'has-error': errors.has('alternative') }">
                    <label class="col-form-label">{{ $t("alternative") }}</label>

                    <br />
                    <el-select v-model="BasicInfoObj.alternativeId" :data-vv-as="$t('alternative')" name="alternative"
                      :placeholder="$t('Select')" clearable filterable class="full-width">
                      <el-option v-for="option in alternativeArrayList" v-bind:value="option.id" :label="option.name"
                        v-bind:key="option.id"></el-option>
                    </el-select>

                  </div>
                </div>
              </div>

              <!-- seif %%%%%%%%%%%%%%%%%%%%% end %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%-->
            



              <div class="col-12 m-3 ">
                        <h6>{{$t("BankInformation")}}</h6>
                        <div class="mb-3 pb-3 mr-4" style="border: 1px solid rgb(192, 211, 230); ">
                            <div class="row mt-2 mr-1 ml-1">
                                <div class="col-md-4">
                                    <div>{{$t("BankGuarantee")}}</div>
                                    <div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <el-select class="input-custom"
                                                    v-model="BasicInfoObj.basicBankGuaranteeType"
                                                    :placeholder="$t('Select')" :disabled="bankGuaranteeDisabled"
                                                    name="bankGuarantee" data-vv-scope="EventCreationValidation"
                                                    clearable filterable>
                                                    <el-option :value="true" label="percentage" :key="true"></el-option>
                                                    <el-option :value="false" label="value" :key="false"></el-option>
                                                </el-select>
                                            </div>
                                            <div class="col-md-6">
                                                <input type="text" class="form-control"
                                                    v-model="BasicInfoObj.basicBankGuarantee"
                                                    :disabled="bankGuaranteeDisabled" autocomplete="off"
                                                    :maxlength="$store.getters.getMaxLength.length30" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div>{{$t("Currency")}}</div>
                                    <div>
                                        <el-select remote :remote-method="remoteMethodCurrency"
                                            :loading="loadingAccount"
                                            :disabled="bankGuaranteeDisabled || BasicInfoObj.basicBankGuaranteeType == true"
                                            v-model="BasicInfoObj.basicBankBlockCurrencyCode" clearable filterable
                                            class="full-width">
                                            <el-option v-for="option in currenciesList" :value="option.code"
                                                :label="option.code" :key="option.code"></el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div>{{$t("BankGuaranteeValidTill")}}</div>
                                    <div>
                                        <input type="number" min="0" class="form-control"
                                            v-model="BasicInfoObj.basicBankGuaranteeValidTill"
                                            :disabled="bankGuaranteeDisabled" autocomplete="off" />
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div>{{$t("GuaranteeType")}}</div>
                                    <div>
                                        <el-select class="input-custom" v-model="BasicInfoObj.basicGuaranteeType"
                                            :disabled="bankGuaranteeDisabled" :placeholder="$t('Select')"
                                            name="guaranteeDeliveryLocation" data-vv-scope="EventCreationValidation"
                                            clearable filterable>
                                            <el-option v-for="option in guaranteeTypes" v-bind:value="option.id"
                                                v-bind:label="option.name" v-bind:key="option.id"></el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div>{{$t("GuaranteeDeliveryLocation")}}</div>
                                    <div>
                                        <el-select class="input-custom"
                                            v-model="BasicInfoObj.basicGuaranteeDeliveryLocation"
                                            :disabled="bankGuaranteeDisabled" :placeholder="$t('Select')"
                                            name="guaranteeDeliveryLocation" data-vv-scope="EventCreationValidation"
                                            clearable filterable>
                                            <el-option v-for="option in guaranteeDeliveryLocations"
                                                v-bind:value="option.id" :label="option.name"
                                                v-bind:key="option.id"></el-option>
                                        </el-select>
                                    </div>
                                </div>

                            </div>
                        
                        </div>
                    </div>






            </div>
          </form>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card class="card card-accent-primary" no-body>
      <div slot="header">
        {{ $t("CurrencyRate") }}
        <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups" style="float:right">
          <div class="btn-group mr-2" role="group" aria-label="First group" style="width: 350px;">
            <el-select v-model="selectionCurrency" name="selectionCurrency" remote reserve-keyword
              :remote-method="remoteMethodCurrencyTable" :loading="loadingAccount" :placeholder="$t('Select')" clearable
              filterable>
              <el-option v-for="option in tenderCurrenciesTabel" v-bind:value="option.code" :label="option.nameAndCode"
                v-bind:key="option.code"></el-option>
            </el-select>
          </div>
          <div class="btn-group mr-2" role="group" aria-label="Second group" style="margin-top: 2px;">
            <button @click="addCurrency()" type="button" class="btn btn-secondary">
              <i class="fa fa-plus"></i>
            </button>
          </div>
          <div class="btn-group" role="group" aria-label="Third group">
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
     
      </div>
      <b-collapse id="collapse2" visible>
        <b-card-body
          v-if="BasicInfoObj.calculationSheetCurrencyRate.length > 0 && BasicInfoObj.tenderCurrencyCode != ''">
          <div class="table-wrapper-scroll-y my-custom-scrollbar col-md-12">
            <table class="table table-bordered table-striped table-sm">
              <thead>
                <tr>
                  <th scope="col" class="pt-1 pb-1 text-center" width="30%">{{ $t("CurrencyName") }}</th>
                  <th scope="col" class="pt-1 pb-1 text-center" width="20%">{{ $t("CurrencyCode") }}</th>
                  <th scope="col" class="pt-1 pb-1 text-center" width="25%">{{ $t("ERPCurrencyRate") }}</th>
                  <th scope="col" class="pt-1 pb-1 text-center" width="20%">{{ $t("CurrencyRateManual") }}</th>
                  <th scope="col" class="pt-1 pb-1 text-center" width="5%"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(currency, index) in BasicInfoObj.calculationSheetCurrencyRate" v-bind:key="index">
                  <td class="align-middle text-center">{{ currency.currencyName }}</td>
                  <td class="align-middle text-center">
                    {{ currency.currencyCode }}
                  </td>
                  <td class="align-middle text-center">{{ currency.erbCurrencyRate }}</td>
                  <td class="align-middle text-center">
                    <div class="row">
                      <div class="col-sm-10">
                        <input type="text" :id="'t' + index" :name="'t' + index" class="form-control"
                          :class="{ 'has-error': errors.has('t' + index) }" v-model="currency.manualCurrencyRate"
                          v-validate="'required|decimal:4'" autocomplete="off" />
                      </div>
                      <div class="col-sm-1 pl-0">
                        <label class="required">*</label>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle text-center">
                    <a :title="$t('Delete')" class="text-danger" v-on:click="deleteCurrencyRate(index);">
                      <i class="fa fa-trash"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    

    <b-card class="card card-accent-primary" no-body>
      <div slot="header">
        {{ $t("attachment") }}
        <div class="card-header-actions">
          <b-link class="card-header-action btn-minimize" v-b-toggle.collapse3>
            <span class="when-opened">
              <i class="icon-arrow-up"></i>
            </span>
            <span class="when-closed">
              <i class="icon-arrow-down"></i>
            </span>
          </b-link>
        </div>
      </div>
      <b-collapse id="collapse3" visible>
        <b-card-body>
          <div id="__BVID__254" role="group" aria-labelledby="__BVID__254__BV_label_" class="b-form-group form-group">
            <div class="form-row">
              <div class="col-md-2 uplaod-btn">
                <!-- <div onclick="document.getElementById('fileInputMulti').click()">
                  <i class="cui-cloud-upload icons font-2xl d-block"></i>
                  <div>Upload files</div>
                </div>
                <input
                  data-v-459e9c6b
                  type="file"
                  id="fileInputMulti"
                  multiple="multiple"
                  class="form-control-file"
                  @change="onFileChange"
                  style="display: none"
                  autocomplete="off"
                /> -->
                <dropzone id="dropzone" :useCustomSlot="true" :options="dropzoneOptions"
                  @vdropzone-files-added="onFileChange">
                  <i class="cui-cloud-upload icons font-2xl d-block"></i>
                  <div>Upload files</div>
                </dropzone>
              </div>
              <div class="col-md-10">
                <div class="form-row" v-if="calculationSheetAttachment">
                  <table class="table table-striped table-hover col-md-8 el-col-md-offset-2 table-outline">
                    <thead>
                      <tr>
                        <th>File name</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody v-if="calculationSheetAttachment.length > 0">
                      <template v-for="(attachemnt, index) in calculationSheetAttachment">
                        <tr :key="index" v-if="!attachemnt.deleted">
                          <td>{{ attachemnt.fileName }}</td>
                          <td>
                            <input type="text" :name="attachemnt.quid" class="form-control"
                              v-model="attachemnt.description" autocomplete="off"
                              :maxlength="$store.getters.getMaxLength.length30" />
                          </td>
                          <td>
                            <a v-if="checkActions('DeleteAttachment')" style="cursor: pointer;" class="text-danger"
                              @click="removAttachment(attachemnt)">
                              <i class="fa fa-trash"></i>
                            </a>
                            <a class="ml-1" style="cursor: pointer;"
                              @click="downloadAttachment(attachemnt.quid, attachemnt.fileName)" v-if="attachemnt.quid">
                              <i class="fa fa-download"></i>
                            </a>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <div class="text-center mb-5">
      <router-link class="btn csubmit ml-3" :to="{ name: 'calculationSheetList' }">
        <i class="fa fa-angle-left fa-lg"></i>
        {{ $t("cancel") }}
      </router-link>
    
      <button class="btn csubmit ml-3" v-on:click="saveCalSheet()" variant="primary"
        :disabled="BasicInfoObj.status == $store.getters.getSheetStatus.Approved || 
                   BasicInfoObj.status == $store.getters.getSheetStatus.Rejected_Closed || 
                   BasicInfoObj.status == $store.getters.getSheetStatus.Awarded || 
                   (BasicInfoObj.creator == loggeduser.id && BasicInfoObj.status == $store.getters.getSheetStatus.Waiting_for_Approval)">
        <i class="fa fa-save"></i>
        {{ $t("Save") }}
      </button>

      <button class="btn csubmit ml-3" v-on:click="closeCaluationSheet()" variant="primary"
        v-if="calSheetId && BasicInfoObj.status == $store.getters.getSheetStatus.Rejected && ((BasicInfoObj.creator == loggeduser.id) || (loggeduser.isAdmin))">
        <i class="fa fa-close"></i>
        {{ $t("closeCalculationSheet") }}
      </button>

      <button class="btn csubmit ml-3" v-on:click="nextStep(BasicInfoObj)">
        {{ $t("Next") }}
        <i class="fa fa-angle-right fa-lg"></i>
      </button>
      <button class="btn csubmit ml-3" v-on:click="previousStep()" v-if="active != 0">
        <!-- <i class="fa fa-save"></i> -->
        {{ $t("Previous") }}
      </button>
    </div>
  </div>
</template>
<style scoped>
.has-error {
  border-color: red !important;
}

.uplaod-btn {
  border: 1px solid #cccc;
  text-align: center;
  padding-top: 6px;
  padding-bottom: 10px;
  height: 55px !important;
}

.uplaod-btn:hover {
  cursor: pointer;
  background-color: #eeeff0;
}

.my-custom-scrollbar {
  position: relative;
  height: auto;
  min-height: 100px;
  height: auto !important;
  height: 100px;
  overflow: auto;
}

.table-wrapper-scroll-y {
  display: block;
}
</style>
<script type='text/javascript'>
import moment from "moment";
import axios from "axios";
import dropzone from "vue2-dropzone"
import { checkRoles } from "../../shared/utils";

export default {
  props: {
    calSheetId: Number,
    active: Number,
    predata: Object
  },
  components: {
    dropzone,
  },

  data() {
    return {
      companiesArrayList: [],

      dropzoneOptions: {
        // The Url Where Dropped or Selected files will be sent
        url: `https://httpbin.org/post`,
        // File Size allowed in MB
        maxFilesize: 102400000,
        // Authentication Headers like Access_Token of your application
        // headers: {
        //   Authorization: `Access Token`
        // },
        // The way you want to receive the files in the server
        paramName: function () {
          return "file[]";
        },
        dictDefaultMessage: "Upload Files Here xD",
        includeStyling: false,
        previewsContainer: false,
        // thumbnailWidth: 250,
        // thumbnailHeight: 140,
        uploadMultiple: true,
        parallelUploads: 20
      },
      selectionCurrency: "",
      fullscreenLoading: false,
      isClickWrokflow: false,
      ErrorDate: false,
      workflowStepActionSetting: [],
      guaranteeDeliveryLocations: [],
      currenciesList: [],
      guaranteeTypes: [],
      basicBankGuaranteeTypeArrayList: [],
      validtill: "",
      tenderTypes: [],
      calculationSheetAttachment: [],
      actionType: "post",
      appLink: this.$store.getters.serverURI
        ? this.$store.getters.serverURI
        : "",
      bankGuaranteeArrayList: [],
      alternativeArrayList: [],
      BasicInfoObj: {
        id: "",
        subject: "",
        tenderCurrencyCode: "",
        mssCustomerCode: "",
        nonMssCustomerName: "",
        releaseDate: "",
        submissionDate: "",
        validity: "",
        isFunded: true,
        funderName: "",
        isVat: false,
        vatValue: 16,
        calculationSheetCurrencyRate: [],
        isNonMSSCustomerName: false,
        mssCustomerName: "",
        status: 1,
        creator: 0,
        type: 1,
        tenderType: "",
        tenderNumber: "",
        tenderName: "",
        warranty: "",
        calculationSheetAttachment: [],
        versionNo: 0,
        parentCalculationId: 0,
        formattedStatus: "",
        warrantyForAllGroups: false,
        paymentTerms: "",
        bankGuaranteeId: "",
        bankGuaranteeDuration: "",
        deadlineForInquires: "",

        endUser: "",
        numberOfItems: "",
        deliveryTerms: "",
        criteriaOfFinancialEvaluation: "",
        deadlineOfInquires: "",
        penalties: "",

        submissionAddressForCalenderEventTable: "",
        alternativeId: "",
        warrantyId: "",

        basicBankGuaranteeType: "",
        basicBankGuarantee: "",
        basicBankGuaranteeValidTill: "",
        basicGuaranteeType: "",
        basicGuaranteeDeliveryLocation: "",
        basicBankBlockCurrencyCode: "",
        basicBankGuaranteeTypeDtl: "",
        
        selectedCompanies: "",
        
        
      },

      disableDates: {
        disabledDate(date) {
          return moment() <= date;
        }
      },
      dateLessThanToday: {
        disabledDate(date) {
          return moment() <= date;
        }
      },

      status: "New",
      tenderCurrencies: [],
      tenderCurrenciesTabel: [],
      mssCustomers: [],
      validityList: [],
      warrantyList: [],
      isNonMssCustomerDisabled: false,
      isMssCustomerDisabled: false,
      tempDataBodyCalculationSheetCurrencyRate: [],
      loggeduser: {},
      loadingAccount: false

    };
  },
  computed:{
    
    bankGuaranteeDisabled() {
            let val = false;
            if(this.bankGuaranteeArrayList && this.bankGuaranteeArrayList.length != 0 &&this.BasicInfoObj.bankGuaranteeId&& this.bankGuaranteeArrayList.find(x=>x.id == this.BasicInfoObj.bankGuaranteeId).code == 1 )
              val = true;
     
            return !val;
        },
  },
  methods: {
    
    FillCompaniesArrayList: function() {
      var urlStr = this.$store.getters.serverURI + "Api/CalculationSheets/GetCompanies";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.companiesArrayList = data.body;
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
    
    fillBasicBankGuaranteeTypes: function() {
            var urlStr =
                this.$store.getters.serverURI +
                "api/lookup/GetByType/" +
                this.$store.getters.getLookupCategory.MECalBasicBankGuaranteeType;
            this.$http
                .get(urlStr, {
                    headers: this.$store.getters.tokenAuthonticationHeaderObj
                })
                .then(
                    function(data) {
                        this.basicBankGuaranteeTypeArrayList = data.body;
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
    fillGuaranteeType: function() {
            var urlStr =
                this.$store.getters.serverURI +
                "api/lookup/GetByType/" +
                this.$store.getters.getLookupCategory.GuaranteType;
            this.$http
                .get(urlStr, {
                    headers: this.$store.getters.tokenAuthonticationHeaderObj
                })
                .then(
                    function(data) {
                        this.guaranteeTypes = data.body;
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
    FillCurrencyList: function() {
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
    getGuaranteeDeliveryLocationLookups: function() {
            var urlTypesStr =
                this.$store.getters.serverURI +
                "api/lookup/GetByType/" +
                this.$store.getters.getLookupCategory.TenderLocation;
            this.$http
                .get(urlTypesStr, {
                    headers: this.$store.getters.tokenAuthonticationHeaderObj
                })
                .then(function(data) {
                    this.guaranteeDeliveryLocations = data.body;
                });
        },

    FillGuaranteeList: function () {
      var urlStr = this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.CalculationSheetBankGuarantee;

      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
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
              message: this.$t("ErrorMessage")
            });
          }
        );
    },
    FillAlternativeList: function () {
      var urlStr = this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.Alternative;

      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function (data) {
            this.alternativeArrayList = data.body;
          },
          function () {
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
      return checkRoles("Calculation Sheet", roleName);
    },
    deleteCurrencyRate(index) {
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
            this.BasicInfoObj.calculationSheetCurrencyRate.splice(index, 1);
            done();
          } else {
            done();
          }
        }
      })
    },
    addCurrency() {
      var obj = this.tenderCurrenciesTabel.find(
        x => x.code === this.selectionCurrency
      );
      if (this.BasicInfoObj.tenderCurrencyCode != obj.code) {
        var check_exsits = this.BasicInfoObj.calculationSheetCurrencyRate.find(
          x => x.currencyCode == obj.code
        );
        if (!check_exsits) {
          if (this.calSheetId) {
            this.BasicInfoObj.calculationSheetCurrencyRate.push({
              id: obj.id,
              calculationSheetId: this.calSheetId,
              currencyName: obj.name,
              currencyCode: obj.code,
              erbCurrencyRate: obj.value
                ? parseFloat(obj.value).toFixed(4)
                : "0.0000",
              manualCurrencyRate: obj.value
                ? parseFloat(obj.value).toFixed(4)
                : "0.0000"
            });
          } else {
            this.BasicInfoObj.calculationSheetCurrencyRate.push({
              id: "",
              currencyName: obj.name,
              currencyCode: obj.code,
              erbCurrencyRate: obj.value
                ? parseFloat(obj.value).toFixed(4)
                : "0.0000",
              manualCurrencyRate: obj.value
                ? parseFloat(obj.value).toFixed(4)
                : "0.0000"
            });
          }
        } else {
          this.$message({
            showClose: true,
            duration: this.$store.getters.getMessagesDuration,
            type: "error",
            message: this.$t("Cureencyalreadyexists")
          });
        }
      } else {
        this.$message({
          showClose: true,
          duration: this.$store.getters.getMessagesDuration,
          type: "error",
          message: this.$t("SheetCurrency")
        });
      }
      this.tenderCurrenciesTabel = [];
      this.selectionCurrency = "";
    },
    remoteMethodCurrency: function (query) {
      this.tenderCurrencies = []
      if (query !== "") {
        this.loadingAccount = true;
        var urlStr =
          this.$store.getters.serverURI +
          "api/item/GetAllCurrencies?PageIndex=" +
          1 +
          "&PageSize=" +
          this.$store.getters.getReturnPage +
          "&name=" +
          query +
          "&code=" +
          query +
          "&calculationSheetId=null"
          + "&department=" + this.$store.getters.getDepartmentCode.medical;
        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function (data) {
              this.tenderCurrencies = data.body;
              this.loadingAccount = false;
            },
            function (error) {
              this.loadingAccount = false;
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "error",
                message: error.body.message
              });
            }
          );
      } else this.tenderCurrencies = [];
    },
    remoteMethodCurrencyTable: function (query) {
      if (query !== "") {
        this.loadingAccount = true;
        var urlStr =
          this.$store.getters.serverURI +
          "api/item/GetAllCurrencies?PageIndex=" +
          1 +
          "&PageSize=" +
          this.$store.getters.getReturnPage +
          "&name=" +
          query +
          "&code=" +
          query +
          "&calculationSheetId=null"
          + "&department=" + this.$store.getters.getDepartmentCode.medical;
        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function (data) {
              this.tenderCurrenciesTabel = data.body;
              this.loadingAccount = false;
            },
            function (error) {
              this.loadingAccount = false;
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "error",
                message: error.body.message
              });
            }
          );
      } else this.tenderCurrenciesTabel = [];
    },
    remoteMethodMSSCustomer: function (query) {
      if (query !== "") {
        this.loadingAccount = true;
        var loggeduser = this.$store.getters.getUserData;
        this.loggedUserType = loggeduser && loggeduser.userType ? loggeduser.userType : 22

        var urlStr =
          this.$store.getters.serverURI +
          "api/item/GetAllMssCustomer?PageIndex=" +
          1 +
          "&PageSize=" +
          this.$store.getters.getReturnPage +
          "&name=" +
          query +
          "&department=" + this.loggedUserType +
          "&code=";
        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function (data) {
              this.mssCustomers = data.body;
              this.loadingAccount = false;
            },
            function (error) {
              this.loadingAccount = false;
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "error",
                message: error.body.message
              });
            }
          );
      } else this.mssCustomers = [];
    },
    workflowAction(actionId) {
      this.isClickWrokflow = true;
      var urlStr = this.$store.getters.serverURI + "api/WorkflowLog";
      this.$http
        .post(
          urlStr,
          {
            id: 0,
            CalculationSheetId: this.calSheetId,
            WorkflowId: this.WorkflowId,
            StepId: this.StepId,
            ActionId: actionId
          },
          {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          }
        )
        .then(
          () => {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "success",
              message: this.$t("ProcessDone")
            });
            this.$router.push({ path: "/calculationSheets" });
          },
          function () {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage")
            });
          }
        );
    },
    fetchData: function () {
      var urlStr =
        this.$store.getters.serverURI +
        "api/CalculationSheet/GetAttachment/" +
        this.calSheetId;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function (data) {
            this.calculationSheetAttachment = data.body;
            if (this.calculationSheetAttachment.length > 0) {
              this.actionType = "put";
            }
          },
          function () {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage")
            });
          }
        );
    },
    removAttachment(item) {
      this.calculationSheetAttachment.splice(
        this.calculationSheetAttachment.indexOf(item),
        1
      );
    },
    downloadAttachment(quid, name) {
      let urlStr =
        this.$store.getters.serverURI +
        "api/CalculationSheet/DownLoadFile/" +
        quid +
        "/?name=" +
        name;

      axios({
        method: "post",
        url: urlStr,
        headers: this.$store.getters.tokenAuthonticationHeaderObj,
        responseType: "blob"
      }).then(response => {
        this.fullscreenLoading = false;
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        // var fileName = name;
        fileLink.href = fileURL;
        fileLink.setAttribute("download", name);
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
    onFileChange(files) {
      // var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      else if (files.length >= 1) {
        for (var i = 0; i < files.length; i++) {
          if (files[i].size / (1024 * 1024) <= 20) {
            this.createImage(files[i], files[i].name);
          } else {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "warning",
              message: this.$t("20MB")
            });
          }
        }
      }
      // this.resetFileInput();
    },
    resetFileInput() {
      document.getElementById("fileInputMulti").value = "";
    },
    createImage(file, fileName) {
      var reader = new FileReader();
      var vm = this;
      reader.readAsDataURL(file);
      reader.onload = e => {
        var filebase64 = e.target.result;
        var filebasee64Array = filebase64.split(",");
        vm.calculationSheetAttachment.push({
          fileName: fileName,
          creationDate: "",
          updateDate: "",
          calculationSheetId: vm.calSheetId,
          base64FileString: filebasee64Array[1]
        });
      };
    },
    storeAttachmentFiles() {
      if (!this.calSheetId) return;
      if (this.actionType == "post") {
        var urlStr =
          this.$store.getters.serverURI +
          "api/CalculationSheet/InsertAttachment";
        this.$http
          .post(
            urlStr,
            {
              calculationSheetAttachment: this.calculationSheetAttachment
            },
            {
              headers: this.$store.getters.tokenAuthonticationHeaderObj
            }
          )
          .then(
            () => {
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "success",
                message: this.$t("AddedSuccessfully")
              });
              this.status = "New";
              this.fetchData();
            },
            function () {
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "error",
                message: this.$t("ErrorMessage")
              });
            }
          );
      } else if (this.actionType == "put") {
        var urlStr =
          this.$store.getters.serverURI +
          "api/CalculationSheet/UpdateAttachment?calculationSheetId=" +
          this.calSheetId;
        this.$http
          .put(
            urlStr,
            {
              calculationSheetAttachment: this.calculationSheetAttachment
            },
            {
              headers: this.$store.getters.tokenAuthonticationHeaderObj
            }
          )
          .then(
            () => {
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "success",
                message: this.$t("UpdatedSuccessfully")
              });
              this.status = "New";
            },
            function () {
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
    fillCalculationCurrencyRate() {
      // if (this.tenderCurrencies.length > 0) {
      //   this.BasicInfoObj.calculationSheetCurrencyRate = [];
      //   this.tenderCurrencies.forEach(element => {
      //     if (element.code != this.BasicInfoObj.tenderCurrencyCode) {
      //       if (this.calSheetId) {
      //         this.BasicInfoObj.calculationSheetCurrencyRate.push({
      //           id: element.id,
      //           calculationSheetId: this.calSheetId,
      //           currencyName: element.name,
      //           currencyCode: element.code,
      //           erbCurrencyRate: element.value
      //             ? parseFloat(element.value).toFixed(4)
      //             : "0.0000",
      //           manualCurrencyRate: element.value
      //             ? parseFloat(element.value).toFixed(4)
      //             : "0.0000"
      //         });
      //       } else {
      //         this.BasicInfoObj.calculationSheetCurrencyRate.push({
      //           id: "",
      //           currencyName: element.name,
      //           currencyCode: element.code,
      //           erbCurrencyRate: element.value
      //             ? parseFloat(element.value).toFixed(4)
      //             : "0.0000",
      //           manualCurrencyRate: element.value
      //             ? parseFloat(element.value).toFixed(4)
      //             : "0.0000"
      //         });
      //       }
      //     }
      //   });
      // }
    },
    FillAllCurrencies: function () {
      var urlStr = this.$store.getters.serverURI + "api/Item/GetAllCurrencies";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function (data) {
            this.tenderCurrencies = data.body;
            if (this.calSheetId) {
              this.fillCalculationCurrencyRate();
            }
          },
          function () {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage")
            });
          }
        );
    },
    FillMssCustomers: function () {
      var urlStr = this.$store.getters.serverURI + "api/Item/GetAllMssCustomer";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
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
              message: this.$t("ErrorMessage")
            });
          }
        );
    },
    FillWarrantyList(){
      var urlStr =
        this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.Warranty;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function (data) {
            this.warrantyList = data.body;
            this.warrantyList = this.warrantyList.sort((a, b) => parseInt(a.code) - parseInt(b.code))
          },
          function () {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage")
            });
          }
        );
    }, 
    FillValidityList: function () {
      var urlStr =
        this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.Validity;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function (data) {
            this.validityList = data.body;
            this.validityList = this.validityList.sort((a, b) => parseInt(a.code) - parseInt(b.code))
          },
          function () {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage")
            });
          }
        );
    },
    getTenderTypeLookups: function () {
      var urlTypesStr =
        this.$store.getters.serverURI + "api/lookup/GetByCode/TenderType";
      this.$http
        .get(urlTypesStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(function (data) {
          this.tenderTypes = data.body;
        });
    },
    FillData: function () {
      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/CalculationSheet/GetBasicInfoDetail/" +
        this.calSheetId;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function (data) {
            this.fullscreenLoading = false;
            this.BasicInfoObj.id = data.body.id;
            this.BasicInfoObj.tenderCurrencyCode = data.body.tenderCurrencyCode;
            this.BasicInfoObj.mssCustomerCode = data.body.mssCustomerCode;
            this.BasicInfoObj.nonMssCustomerName = data.body.nonMssCustomerName;
            this.BasicInfoObj.mssCustomerName = data.body.mssCustomerName;
            this.BasicInfoObj.releaseDate = data.body.releaseDate;
            this.BasicInfoObj.submissionDate = data.body.submissionDate;
            this.BasicInfoObj.validity = data.body.validity;
            this.BasicInfoObj.isFunded = data.body.isFunded;
            this.BasicInfoObj.funderName = data.body.funderName;
            this.BasicInfoObj.isVat = data.body.isVat;
            this.BasicInfoObj.vatValue = data.body.vatValue;
            this.BasicInfoObj.status = data.body.status;
            this.BasicInfoObj.creator = data.body.createdBy;

            this.BasicInfoObj.warranty = data.body.warranty;
            this.BasicInfoObj.warrantyId = data.body.warrantyId;

            this.BasicInfoObj.tenderName = data.body.tenderName;
            this.BasicInfoObj.tenderType = data.body.tenderType;

            this.BasicInfoObj.bankGuaranteeId = data.body.bankGuaranteeId;
            this.BasicInfoObj.bankGuaranteeDuration = data.body.bankGuaranteeDuration;
            this.BasicInfoObj.deadlineForInquires = data.body.deadlineForInquires;

            this.BasicInfoObj.endUser = data.body.endUser;
            this.BasicInfoObj.selectedCompanies = data.body.selectedCompanies;
            this.BasicInfoObj.numberOfItems = data.body.numberOfItems;
            this.BasicInfoObj.deliveryTerms = data.body.deliveryTerms;
            this.BasicInfoObj.criteriaOfFinancialEvaluation = data.body.criteriaOfFinancialEvaluation;
            this.BasicInfoObj.deadlineOfInquires = data.body.deadlineOfInquires;
            this.BasicInfoObj.penalties = data.body.penalties;

            this.BasicInfoObj.submissionAddressForCalenderEventTable = data.body.submissionAddressForCalenderEventTable;
            this.BasicInfoObj.alternativeId = data.body.alternativeId;

            this.BasicInfoObj.basicBankGuaranteeType = data.body.basicBankGuaranteeType;
            this.BasicInfoObj.basicBankGuarantee = data.body.basicBankGuarantee;
            this.BasicInfoObj.basicBankBlockCurrencyCode = data.body.basicBankBlockCurrencyCode;
            this.BasicInfoObj.basicBankGuaranteeValidTill = data.body.basicBankGuaranteeValidTill;
            this.BasicInfoObj.basicGuaranteeType = data.body.basicGuaranteeType;
            this.BasicInfoObj.basicGuaranteeDeliveryLocation = data.body.basicGuaranteeDeliveryLocation;
            this.BasicInfoObj.basicBankGuaranteeTypeDtl = data.body.basicBankGuaranteeTypeDtl;
            
            this.BasicInfoObj.formattedStatus = data.body.formattedStatus;
            this.BasicInfoObj.paymentTerms = data.body.paymentTerms;
            this.BasicInfoObj.warrantyForAllGroups =
              data.body.warrantyForAllGroups;

            this.BasicInfoObj.tenderNumber = data.body.tenderNumber
              ? data.body.tenderNumber
              : "";

            this.BasicInfoObj.quotationDescription =
              data.body.quotationDescription;

            this.calculationSheetAttachment =
              data.body.calculationSheetAttachment;

            if (data.body.calculationSheetStatus) {
              var stepid = "";
              if (this.BasicInfoObj.status == this.$store.getters.getSheetStatus.Approved) {
                stepid = "_" + data.body.stepId;
              }

              this.status = data.body.calculationSheetStatus.name + stepid;
            }
            this.BasicInfoObj.calculationSheetCurrencyRate =
              data.body.calculationSheetCurrencyRate;

            this.status = data.body.formattedStatus;
            let obj = {
              code: data.body.mssCustomerCode,
              name: data.body.mssCustomerName
            };
            this.mssCustomers = []
            this.mssCustomers.push(obj);

            let currencyObj = {
              code: data.body.currencyModel.code,
              nameAndCode: data.body.currencyModel.nameAndCode
            };
            this.tenderCurrencies = [];
            this.tenderCurrencies.push(currencyObj);
          },
          function () {
            this.fullscreenLoading = true;
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage")
            });
          }
        );
    },
    saveCalSheet(gonext) {
      this.BasicInfoObj.parentCalculationId = null;
      return this.saveOrUpdate(gonext);
    },
    saveOrUpdate(gonext) {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.fullscreenLoading = true;
          this.BasicInfoObj.calculationSheetAttachment = this.calculationSheetAttachment;
          if (this.calSheetId) {
            var urlStr =
              this.$store.getters.serverURI +
              "api/CalculationSheet/UpdateBasicInfo";
            this.$http
              .put(urlStr, this.BasicInfoObj, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                () => {
                  this.fullscreenLoading = false;
                  if (gonext) {
                    this.$emit("next-step");
                  }
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "success",
                    message: this.$t("CalculationSheetUpdatedSuccessfully")
                  });
                  // this.$refs.calcuationSheetBasicInfo.refresh();
                },
                function (error) {
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
            var urlStr =
              this.$store.getters.serverURI + "api/CalculationSheet/BasicInfo";
            this.$http
              .post(urlStr, this.BasicInfoObj, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                response => {
                  this.fullscreenLoading = false;
                  this.calSheetId = response.body;
                  this.calSheetId
                    ? this.$router.push({
                      name: "NewCalculationSheet",
                      params: { CalSheetId: this.calSheetId }
                    })
                    : "";
                  this.setCalcSheetId();
                  if (gonext) {
                    this.$emit("next-step");
                  }
                  if (!gonext) {
                    this.FillData();
                  }
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "success",
                    message: this.$t("CalculationSheetCreatedSuccessfully")
                  });
                  this.status = "New";
                },
                function () {
                  this.fullscreenLoading = false;
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "error",
                    message: this.$t("ErrorMessage")
                  });
                }
              )
              .catch(data => {
                this.fullscreenLoading = false;
                done();
                this.$message({
                  showClose: true,
                  duration: this.$store.getters.getMessagesDuration,
                  type: "error",
                  message: data.body.message
                });
              });
          }
          return true;
        } else {
          return false;
        }
      });
    },
    MssCustomerUpdated: function (selected) {
      if (selected) {
        this.BasicInfoObj.nonMssCustomerName = "";
        this.isNonMssCustomerDisabled = true;
      } else {
        this.isNonMssCustomerDisabled = false;
      }
    },
    setCalcSheetId() {
      this.$emit("clicked", this.calSheetId);
    },
    nextStep(obj) {
      if (obj.creator == this.loggeduser.id && obj.status == this.$store.getters.getSheetStatus.Waiting_for_Approval) {
        this.$emit("next-step");
      } else {
        this.saveCalSheet(true);
      }
    },
    previousStep: function () {
      this.$emit("previous-step");
    },
    closeCaluationSheet() {
      if (this.calSheetId) {
        var urlStr =
          this.$store.getters.serverURI +
          "api/CalculationSheet/Close/" +
          this.calSheetId;
        this.$http
          .put(
            urlStr,
            { id: this.calSheetId },
            {
              headers: this.$store.getters.tokenAuthonticationHeaderObj
            }
          )
          .then(
            response => {
              if (response.status == this.$store.getters.getErrorCode) {
                this.$message({
                  showClose: true,
                  duration: this.$store.getters.getMessagesDuration,
                  type: "warning",
                  message: response.data.message
                });
              } else {
                this.$message({
                  showClose: true,
                  duration: this.$store.getters.getMessagesDuration,
                  type: "success",
                  message: response.data.message
                });
              }

              window.location.reload(true);
            },
            function (error) {
              if (error.status == this.$store.getters.getErrorCode) {
                this.$message({
                  showClose: true,
                  duration: this.$store.getters.getMessagesDuration,
                  type: "warning",
                  message: response.data.message
                });
              } else {
                this.$message({
                  showClose: true,
                  duration: this.$store.getters.getMessagesDuration,
                  type: "error",
                  message: this.$t("ErrorMessage")
                });
              }
            }
          );
      }
    },
    checkWorkflow() {
      // this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/CalculationSheet/WorkflowValidationForCreatingSheet";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          response => {
            if (response.body.message) {
              this.fullscreenLoading = false;
              this.$router.push({ name: "calculationSheetList" });
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "error",
                message: response.body.message
              });
            }
          },
          function (error) {
            this.fullscreenLoading = false;
            this.$router.push({ name: "calculationSheetList" });
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: error.body.message
            });
          }
        )
        .catch(error => {
          this.fullscreenLoading = false;
          this.$message({
            showClose: true,
            duration: this.$store.getters.getMessagesDuration,
            type: "error",
            message: error.body.message
          });
        });
    },
    saveAndLeave() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.BasicInfoObj.calculationSheetAttachment = this.calculationSheetAttachment;
          if (this.calSheetId) {
            var urlStr =
              this.$store.getters.serverURI +
              "api/CalculationSheet/UpdateBasicInfo";
            this.$http
              .put(urlStr, this.BasicInfoObj, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                () => {
                  this.fullscreenLoading = false;
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "success",
                    message: this.$t("CalculationSheetUpdatedSuccessfully")
                  });
                },
                function (error) {
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
            var urlStr =
              this.$store.getters.serverURI + "api/CalculationSheet/BasicInfo";
            this.$http
              .post(urlStr, this.BasicInfoObj, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                response => {
                  this.fullscreenLoading = false;
                  this.calSheetId = response.body;
                  this.calSheetId
                    ? this.$router.push({
                      name: "NewCalculationSheet",
                      params: { CalSheetId: this.calSheetId }
                    })
                    : "";
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "success",
                    message: this.$t("CalculationSheetCreatedSuccessfully")
                  });
                  this.status = "New";
                },
                function () {
                  this.fullscreenLoading = false;
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "error",
                    message: this.$t("ErrorMessage")
                  });
                }
              )
              .catch(data => {
                this.fullscreenLoading = false;
                done();
                this.$message({
                  showClose: true,
                  duration: this.$store.getters.getMessagesDuration,
                  type: "error",
                  message: data.body.message
                });
              });
          }
          return true;
        } else {
          return false;
        }
      });
    },
  },

  created: function () {
    this.FillGuaranteeList();
    this.checkWorkflow();
    this.FillValidityList();
    this.FillWarrantyList();
    this.getTenderTypeLookups();
    this.FillAlternativeList();
    this.getGuaranteeDeliveryLocationLookups();
    this.FillCurrencyList();
    this.fillGuaranteeType();
    this.fillBasicBankGuaranteeTypes();
    this.FillCompaniesArrayList();
    if (this.calSheetId) {
      this.FillData();
      if (this.BasicInfoObj.status == this.$store.getters.getSheetStatus.Approved) {
        this.$router.push({ name: "calculationSheetList" });
      }
    }

    if (this.$router.params) {
      if (this.$router.params.predata) {
        let data = this.$router.params.predata;
        this.BasicInfoObj.id = data.id;
        this.BasicInfoObj.quotationDescription = data.quotationDescription;
        this.BasicInfoObj.tenderCurrencyCode = data.tenderCurrencyCode;
        this.BasicInfoObj.mssCustomerCode = data.mssCustomerCode;
        this.BasicInfoObj.nonMssCustomerName = data.nonMssCustomerName;
        this.BasicInfoObj.mssCustomerName = data.mssCustomerName;
        this.BasicInfoObj.releaseDate = data.releaseDate;
        this.BasicInfoObj.submissionDate = data.submissionDate;
        this.BasicInfoObj.validity = data.validity;
        this.BasicInfoObj.isFunded = data.isFunded;
        this.BasicInfoObj.funderName = data.funderName;
        this.BasicInfoObj.isVat = data.isVat;
        this.BasicInfoObj.vatValue = data.vatValue;
        this.BasicInfoObj.status = data.status;
        this.BasicInfoObj.creator = data.createdBy;
        this.BasicInfoObj.tenderName = data.tenderName;
        this.BasicInfoObj.tenderType = data.tenderType;
      }
    }
  },
  watch: {
    BasicInfoObj: {
      handler(val) {
        // if(val.isNonMSSCustomerName != true){
        //  this.BasicInfoObj.nonMssCustomerName = ""
        // }

        if (val.nonMssCustomerName) {
          this.isMssCustomerDisabled = true;
          this.BasicInfoObj.isNonMSSCustomerName = true;
        } else {
          this.isMssCustomerDisabled = false;
        }

        if (val.releaseDate) {
          this.BasicInfoObj.releaseDate = moment(val.releaseDate).format(
            "YYYY-MM-DD"
          );
          this.disableDates = {
            disabledDate(date) {
              return moment(val.releaseDate) > date;
            }
          };
          if (this.BasicInfoObj.submissionDate < this.BasicInfoObj.releaseDate && this.BasicInfoObj.submissionDate != '') {
            this.ErrorDate = true
          } else {
            this.ErrorDate = false
          }
        }
        if (val.submissionDate) {
          this.BasicInfoObj.submissionDate = moment(val.submissionDate).format("YYYY-MM-DD HH:mm:ss");

          if (this.BasicInfoObj.submissionDate < this.BasicInfoObj.releaseDate && this.BasicInfoObj.submissionDate != '') {
            this.ErrorDate = true
          } else {
            this.ErrorDate = false
          }
        }
        if (val.isNonMSSCustomerName) {
          this.BasicInfoObj.mssCustomerCode = "";
          this.BasicInfoObj.mssCustomerName = "";
        }
        if (val.mssCustomerCode) {
          this.BasicInfoObj.mssCustomerName = val.mssCustomerCode
            ? this.mssCustomers.filter(
              item => item.code == val.mssCustomerCode
            )[0].name
            : "";
        }
        if (val.validity) {
          let days = this.validityList.filter(
            item => item.id == val.validity
          )[0].name;
          let daysNumber = parseInt(days, 10);
          let validTillDate = moment(val.submissionDate, "YYYY-MM-DD").add(
            daysNumber,
            "days"
          );
          this.validtill = moment(validTillDate).format("DD/MM/YYYY");
        }
        if (val.tenderCurrencyCode) {
          var obj = this.BasicInfoObj.calculationSheetCurrencyRate.find(x => x.currencyCode === val.tenderCurrencyCode);
          if (obj) {
            let index = this.BasicInfoObj.calculationSheetCurrencyRate.findIndex(x => x.currencyCode == val.tenderCurrencyCode);
            this.BasicInfoObj.calculationSheetCurrencyRate.splice(index, 1);
          }
        }

      },
      deep: true
    }
  },
  mounted() {
    this.loggeduser = this.$store.getters.getUserData;

    if (this.predata) {
      let data = this.predata;

      this.BasicInfoObj.id = this.predata.id;
      this.BasicInfoObj.quotationDescription = data.subject;
      this.BasicInfoObj.tenderCurrencyCode = data.tenderCurrencyCode;
      this.BasicInfoObj.mssCustomerCode = data.mssCustomerCode;
      this.BasicInfoObj.nonMssCustomerName = data.nonMssCustomerName;
      this.BasicInfoObj.mssCustomerName = data.mssCustomerName;
      this.BasicInfoObj.releaseDate = data.releaseDate;
      this.BasicInfoObj.submissionDate = data.submissionDate;
      this.BasicInfoObj.validity = data.validity;
      this.BasicInfoObj.isFunded = data.isFunded;
      this.BasicInfoObj.funderName = data.funderName;
      this.BasicInfoObj.isVat = data.isVat;
      this.BasicInfoObj.status = data.status;
      this.BasicInfoObj.creator = data.createdBy;
      this.BasicInfoObj.tenderName = data.tenderName;
      this.BasicInfoObj.tenderType = data.tenderType;
    }
  }
};
</script>