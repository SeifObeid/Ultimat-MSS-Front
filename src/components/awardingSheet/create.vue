<template>
  <div>
    <div class="row" v-loading.fullscreen.lock="fullscreenLoading">
      <div class="col-md-12">
        <router-link :to="{ name: 'awardingList'}" class="btn btn-secondary">
          <i class="fa fa-arrow-left"></i>
          {{$t("BackToList")}}
        </router-link>
      </div>
    </div>
    <br />
    <b-card class="card card-accent-primary" no-body>
      <div slot="header">
        <span>{{ $t("AwardedSheetInformation")}}</span>
      </div>
      <b-collapse id="collapse1" visible>
        <b-card-body>
          <div class="row">
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{'has-error':errors.has('awardingValidation.calculationSheet')}"
                  >
                    <label class="col-form-label">{{$t("QuotationReference")}}</label>
                    <el-select
                      v-if="!awardingID"
                      v-model="calculationSheetID"
                      name="calculationSheet"
                      :placeholder="$t('Select')"
                      clearable
                      filterable
                      data-vv-scope="awardingValidation"
                      v-validate="'required'"
                      @change="selectCalculationSheet()"
                    >
                      <el-option
                        v-for="option in calculationSheetList"
                        :value="option.id"
                        :key="option.id"
                        :label="option.tenderNumber"
                      ></el-option>
                    </el-select>
                    <input
                      v-if="awardingID"
                      type="text"
                      name="tenderNumber"
                      class="form-control"
                      v-model="AwardingSheets.tenderNumber"
                      v-validate="'required'"
                      disabled
                      autocomplete="off"
                    />
                    <div
                      class="help-block"
                      v-if="errors.has('awardingValidation.calculationSheet')"
                    >
                      <label class="mt-1">{{ errors.first('awardingValidation.calculationSheet') }}</label>
                    </div>
                  </div>
                </div>

                <div class="row col-md-12 pr-0">
                  <div class="col-md-6 pr-0">
                    <div
                      class="form-group"
                      :class="{'has-error':errors.has('awardingValidation.CustomerName')}"
                    >
                      <label class="col-form-label">{{$t("CustomerName")}}</label>
                      <input
                        type="text"
                        name="CustomerName"
                        class="form-control"
                        v-model="AwardingSheets.customerName"
                        v-validate="'required'"
                        data-vv-scope="awardingValidation"
                        disabled
                        autocomplete="off"
                      />
                      <div
                        class="help-block"
                        v-if="errors.has('awardingValidation.CustomerName')"
                      >{{ errors.first('awardingValidation.CustomerName') }}</div>
                    </div>
                  </div>
                  <div class="col-md-6 pr-0">
                    <div
                      class="form-group"
                      :class="{'has-error':errors.has('awardingValidation.quoteNumber')}"
                    >
                      <label class="col-form-label">{{$t("quoteNumber")}}</label>
                      <input
                        type="text"
                        name="quoteNumber"
                        class="form-control"
                        v-model="AwardingSheets.quoteNumber"
                        v-validate="'required'"
                        data-vv-scope="awardingValidation"
                        disabled
                        autocomplete="off"
                      />
                      <div
                        class="help-block"
                        v-if="errors.has('awardingValidation.quoteNumber')"
                      >{{ errors.first('awardingValidation.quoteNumber') }}</div>
                    </div>
                  </div>
                </div>

                <div class="row col-md-12 pr-0">
                  <div class="col-md-6 pr-0">
                    <div
                      class="form-group"
                      :class="{'has-error':errors.has('awardingValidation.WarrantyTerms')}"
                    >
                      <label class="col-form-label">{{$t("WarrantyTerms")}}</label>
                      <input
                        type="text"
                        name="WarrantyTerms"
                        class="form-control"
                        v-model="AwardingSheets.WarrantyTerms"
                        v-validate="'required'"
                        data-vv-scope="awardingValidation"
                        disabled
                        autocomplete="off"
                      />
                      <div
                        class="help-block"
                        v-if="errors.has('awardingValidation.WarrantyTerms')"
                      >{{ errors.first('awardingValidation.WarrantyTerms') }}</div>
                    </div>
                  </div>
                  <div class="col-md-6 pr-0">
                    <div
                      class="form-group"
                      :class="{'has-error':errors.has('awardingValidation.Subject')}"
                    >
                      <label class="col-form-label">{{$t("Subject")}}</label>
                      <input
                        type="text"
                        name="Subject"
                        class="form-control"
                        v-model="AwardingSheets.subject"
                        v-validate="'required'"
                        data-vv-scope="awardingValidation"
                        disabled
                        autocomplete="off"
                      />
                      <div
                        class="help-block"
                        v-if="errors.has('awardingValidation.Subject')"
                      >{{ errors.first('awardingValidation.Subject') }}</div>
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{'has-error':errors.has('awardingValidation.PaymentMethod')}"
                  >
                    <label class="col-form-label">{{$t("PaymentMethod")}}</label>
                    <input
                      type="text"
                      name="PaymentMethod"
                      class="form-control"
                      v-model="AwardingSheets.paymentMethod"
                      v-validate="'required'"
                      data-vv-scope="awardingValidation"
                      autocomplete="off"
                      :maxlength="$store.getters.getMaxLength.length30"
                    />
                    <div
                      class="help-block"
                      v-if="errors.has('awardingValidation.PaymentMethod')"
                    >{{ errors.first('awardingValidation.PaymentMethod') }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="row">
                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{'has-error':errors.has('awardingValidation.TenderClosingDate')}"
                  >
                    <label class="col-form-label">{{$t("TenderClosingDate")}}</label>
                    <el-date-picker
                      v-model="AwardingSheets.tenderClosingDate"
                      name="TenderClosingDate"
                      data-vv-scope="awardingValidation"
                      type="date"
                      v-validate="'required'"
                      v-bind:format="this.$store.getters.getDateFormat"
                    ></el-date-picker>
                    <div
                      class="help-block"
                      v-if="errors.has('awardingValidation.TenderClosingDate')"
                    >
                      <label class="mt-1">{{ errors.first('awardingValidation.TenderClosingDate') }}</label>
                    </div>
                  </div>
                </div>

                <div class="row col-md-12 pr-0">
                  <div class="col-md-6">
                    <div
                      class="form-group"
                      :class="{'has-error':errors.has('awardingValidation.VatValue')}"
                    >
                      <label class="col-form-label">{{$t("VatValue")}}</label>
                      <input
                        type="text"
                        name="VatValue"
                        class="form-control"
                        v-model="AwardingSheets.vatValue"
                        v-validate="'required'"
                        data-vv-scope="awardingValidation"
                        disabled
                        autocomplete="off"
                      />
                      <div
                        class="help-block"
                        v-if="errors.has('awardingValidation.VatValue')"
                      >{{ errors.first('awardingValidation.VatValue') }}</div>
                    </div>
                  </div>
                  <div class="col-md-6 pr-0">
                    <div
                      class="form-group"
                      :class="{'has-error':errors.has('awardingValidation.FunderName')}"
                    >
                      <label class="col-form-label">{{$t("FunderName")}}</label>
                      <input
                        type="text"
                        name="FunderName"
                        class="form-control"
                        v-model="AwardingSheets.funderName"
                        v-validate="'required'"
                        data-vv-scope="awardingValidation"
                        disabled
                        autocomplete="off"
                      />
                      <div
                        class="help-block"
                        v-if="errors.has('awardingValidation.FunderName')"
                      >{{ errors.first('awardingValidation.FunderName') }}</div>
                    </div>
                  </div>
                </div>

                <div class="row col-md-12 pr-0">
                  <div class="col-md-6 pr-0">
                    <div
                      class="form-group"
                      :class="{'has-error':errors.has('awardingValidation.Validity')}"
                    >
                      <label class="col-form-label">{{$t("Validity")}}</label>
                      <input
                        type="text"
                        name="Validity"
                        class="form-control"
                        v-model="AwardingSheets.validity"
                        v-validate="'required'"
                        data-vv-scope="awardingValidation"
                        disabled
                        autocomplete="off"
                      />
                      <div
                        class="help-block"
                        v-if="errors.has('awardingValidation.Validity')"
                      >{{ errors.first('awardingValidation.Validity') }}</div>
                    </div>
                  </div>
                  <div class="col-md-6 pr-0">
                    <div
                      class="form-group"
                      :class="{'has-error':errors.has('awardingValidation.TenderCurrency')}"
                    >
                      <label class="col-form-label">{{$t("TenderCurrency")}}</label>
                      <input
                        type="text"
                        name="TenderCurrency"
                        class="form-control"
                        v-model="AwardingSheets.TenderCurrency"
                        v-validate="'required'"
                        data-vv-scope="awardingValidation"
                        disabled
                        autocomplete="off"
                      />
                      <div
                        class="help-block"
                        v-if="errors.has('awardingValidation.TenderCurrency')"
                      >{{ errors.first('awardingValidation.TenderCurrency') }}</div>
                    </div>
                  </div>
                </div>

                <div class="col-md-12 mb-2">
                  <div
                    class="form-group"
                    :class="{'has-error':errors.has('awardingValidation.PONumber')}"
                  >
                    <label class="col-form-label">{{$t("PONumber")}}</label>
                    <input
                      type="text"
                      name="PONumber"
                      class="form-control"
                      v-model="AwardingSheets.poNumber"
                      data-vv-scope="awardingValidation"
                      autocomplete="off"
                      :maxlength="$store.getters.getMaxLength.length30"
                      v-validate="'required'"
                    />
                    <div
                      class="help-block"
                      v-if="errors.has('awardingValidation.PONumber')"
                    >{{ errors.first('awardingValidation.PONumber') }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card class="card card-accent-primary" no-body v-if="calculationSheetCurrencyRate.length > 0">
      <div slot="header">
        {{$t("CurrencyRate")}}
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
          <div class="tableDiv col-md-12 mt-3 mb-3">
            <table class="table table-bordered table-striped table-sm">
              <thead>
                <tr>
                  <th scope="col" class="pt-2 pb-2 text-center">{{$t("CurrencyName")}}</th>
                  <th scope="col" class="pt-2 pb-2 text-center">{{$t("CurrencyCode")}}</th>
                  <th scope="col" class="pt-2 pb-2 text-center">{{$t("CurrencyRateManual")}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(currency, index) in calculationSheetCurrencyRate" v-bind:key="index">
                  <td class="align-middle text-center">{{currency.currencyName}}</td>
                  <td class="align-middle text-center">
                    <label v-if="currency.currencyCode === 'Dollar'">USD</label>
                    <label v-if="currency.currencyCode === 'Dinar'">JD</label>
                    <label v-if="currency.currencyCode === 'Shekel'">NIS</label>
                    <label v-if="currency.currencyCode === 'Euro'">EUR</label>
                  </td>
                  <td class="align-middle text-center">{{currency.manualCurrencyRate}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card class="card card-accent-primary" no-body v-if="calculationSheetItems.length > 0">
      <div slot="header">
        {{$t("calculationSheetGroups")}}
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
          <b-row
            v-if="calculationSheetItems.length > 0"
            v-for="(CalcGroup,index) in calculationSheetItems"
          >
            <b-col lg="12" md="12">
              <br />
              <b-card class="card card-accent-primary" no-body>
                <div slot="header">
                  <div class="row">
                    <label class="col-sm-2 col-form-label">
                      {{
                      $t("Item")}}-{{index+1}}
                    </label>
                    <label class="col-form-label">{{ $t('name')}} - {{ CalcGroup.name}}</label>
                    <div class="col-md-1 col-sm-1"></div>
                  </div>
                </div>
                <b-collapse :id="'mainItem-'+index" visible>
                  <b-card-body>
                    <div class="table-responsive-lg table-responsive">
                      <el-table
                        v-if="CalcGroup.calculationSheetItem.length > 0"
                        class="table-sm table-responsive custom-table"
                        :data="CalcGroup.calculationSheetItem"
                        size="mini"
                        style="width: 100%"
                      >
                        <el-table-column label width="20">
                          <template slot-scope="scope">
                            <a
                              class="text-danger"
                              @click="removeCalcuationSheetMainItems(index,scope.row)"
                            >
                              <i class="fa fa-trash"></i>
                            </a>
                          </template>
                        </el-table-column>
                        <el-table-column type="index" :min-width="50"></el-table-column>
                        <el-table-column prop="code" label="Code" :min-width="30"></el-table-column>
                        <el-table-column prop="name" label="Name" :min-width="80"></el-table-column>
                        <el-table-column prop="currencyCode" label="Currency" :min-width="50"></el-table-column>
                        <el-table-column prop="vendor" label="Vendor" :min-width="50"></el-table-column>
                        <el-table-column prop="quantity" label="Quantity" :min-width="50"></el-table-column>
                        <el-table-column
                          prop="deliveredItems"
                          label="Delieverd item"
                          :min-width="70"
                        >
                          <template slot-scope="scope">
                            <el-input
                              :name="'DelieverdItem-'+index"
                              v-model="scope.row.deliveredItems"
                              size="mini"
                              autocomplete="off"
                              @change="calculatorPending(scope.row,scope.$index)"
                              v-validate="{regex:/^[0-9]*$/ }"
                            ></el-input>
                            <div
                              class="help-block"
                              v-if="scope.row.deliveredItems && scope.row.msg"
                            >
                              <label style="color:red;">{{scope.row.msg}}</label>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="pendingItems" label="Pending items" :min-width="50"></el-table-column>
                      </el-table>
                    </div>
                    <br />

                    <b-card
                      class="card card-accent-primary"
                      no-body
                      v-if="CalcGroup.calculationSheetAlternativeGroup && alternativeGroup.calculationSheetItem.length > 0"
                      v-for="(alternativeGroup,alternativeGroupIndex) in CalcGroup.calculationSheetAlternativeGroup"
                    >
                      <div slot="header">
                        <div class="row">
                          <label
                            class="col-sm-2 col-form-label"
                          >{{$t("Item")}}-{{index+1}} {{ $t('AlternativeGroup')}} {{ alternativeGroupIndex+1}}</label>
                          <label class="col-form-label">{{ $t('name')}} - {{ alternativeGroup.name}}</label>
                          <div class="col-md-1 col-sm-1"></div>
                      
                        </div>
                      </div>
                      <b-collapse :id="'alternativeGroup-'+index+alternativeGroupIndex" visible>
                        <b-card-body>
                          <div class="table-responsive-lg table-responsive">
                            <el-table
                              v-if="alternativeGroup.calculationSheetItem.length > 0"
                              class="table-sm table-responsive custom-table"
                              :data="alternativeGroup.calculationSheetItem"
                              size="mini"
                              style="width: 100%"
                            >
                              <el-table-column label width="20">
                                <template slot-scope="scope">
                                  <a
                                    class="text-danger"
                                    @click="removeAlternativeItem(index,alternativeGroupIndex,scope.row)"
                                  >
                                    <i class="fa fa-trash"></i>
                                  </a>
                                </template>
                              </el-table-column>
                              <el-table-column type="index" :min-width="50"></el-table-column>
                              <el-table-column prop="code" label="Code" :min-width="30"></el-table-column>
                              <el-table-column prop="name" label="Name" :min-width="80"></el-table-column>
                              <el-table-column prop="currencyCode" label="Currency" :min-width="50"></el-table-column>
                              <el-table-column prop="vendor" label="Vendor" :min-width="50"></el-table-column>
                              <el-table-column prop="quantity" label="Quantity" :min-width="50"></el-table-column>
                              <el-table-column
                                prop="deliveredItems"
                                label="Delieverd item"
                                :min-width="70"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.deliveredItems"
                                    size="mini"
                                    autocomplete="off"
                                    @change="calculatorPending(scope.row,scope.$index)"
                                    v-validate="{regex:/^[0-9]*$/ }"
                                  ></el-input>
                                  <div
                                    class="help-block"
                                    v-if="scope.row.deliveredItems && scope.row.msg"
                                  >
                                    <label style="color:red;">{{scope.row.msg}}</label>
                                  </div>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="pendingItems"
                                label="Pending items"
                                :min-width="50"
                              ></el-table-column>
                            </el-table>
                          </div>
                          <br />
                          <br />
                        </b-card-body>
                      </b-collapse>
                    </b-card>

                  </b-card-body>
                </b-collapse>
              </b-card>
              <br />
            </b-col>
          </b-row>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card class="card card-accent-primary" no-body v-if="awardingSheetItems.length > 0">
      <div slot="header">
        {{$t("calculationSheetGroups")}}
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
          <b-row
            v-if="awardingSheetItems.length > 0"
            v-for="(CalcGroup,index) in awardingSheetItems"
          >
            <b-col lg="12" md="12">
              <br />
              <b-card class="card card-accent-primary" no-body>
                <div slot="header">
                  <div class="row">
                    <label class="col-sm-2 col-form-label">
                      {{
                      $t("Item")}}-{{index+1}}
                    </label>
                    <label
                      class="col-form-label"
                    >{{ $t('name')}} - {{ CalcGroup.calculationSheetMainGroup.name}}</label>
                    <div class="col-md-1 col-sm-1"></div>
                  </div>
                </div>
                <b-collapse :id="'mainItem-'+index" visible>
                  <b-card-body>
                    <div class="table-responsive-lg table-responsive">
                      <el-table
                        v-if="CalcGroup.awardingSheetItem.length > 0"
                        class="table-sm table-responsive custom-table"
                        :data="CalcGroup.awardingSheetItem"
                        size="mini"
                        style="width: 100%"
                      >
                        <el-table-column label width="20">
                          <template slot-scope="scope">
                            <a
                              class="text-danger"
                              @click="removeCalcuationSheetMainItems(index,scope.row)"
                            >
                              <i class="fa fa-trash"></i>
                            </a>
                          </template>
                        </el-table-column>
                        <el-table-column type="index" :min-width="50"></el-table-column>
                        <el-table-column
                          prop="calculationSheetItem.code"
                          label="Code"
                          :min-width="30"
                        ></el-table-column>
                        <el-table-column
                          prop="calculationSheetItem.name"
                          label="Name"
                          :min-width="80"
                        ></el-table-column>
                        <el-table-column
                          prop="calculationSheetItem.currencyCode"
                          label="Currency"
                          :min-width="50"
                        ></el-table-column>
                        <el-table-column
                          prop="calculationSheetItem.vendor"
                          label="Vendor"
                          :min-width="50"
                        ></el-table-column>
                        <el-table-column
                          prop="calculationSheetItem.quantity"
                          label="Quantity"
                          :min-width="50"
                        ></el-table-column>
                        <el-table-column
                          prop="deliveredItems"
                          label="Delieverd item"
                          :min-width="70"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.deliveredItems"
                              size="mini"
                                 
                              autocomplete="off"
                              @change="calculatorPendingForPut(scope.row,scope.$index)"
                              v-validate="{regex:/^[0-9]*$/ }"
                            ></el-input>
                            <div
                              class="help-block"
                              v-if="scope.row.deliveredItems && scope.row.calculationSheetItem.msg"
                            >
                              <label style="color:red;">{{scope.row.calculationSheetItem.msg}}</label>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="calculationSheetItem.pendingItems"
                          label="Pending items"
                          :min-width="50"
                        ></el-table-column>
                      </el-table>
                    </div>
                    <br />
                    <b-card
                      class="card card-accent-primary"
                      no-body
                      v-if="CalcGroup.awardingSheetAlternativeGroup"
                      v-for="(alternativeGroup,alternativeGroupIndex) in CalcGroup.awardingSheetAlternativeGroup"
                    >
                      <div slot="header">
                        <div class="row">
                          <label
                            class="col-sm-2 col-form-label"
                          >{{ $t('AlternativeGroup')}} {{ alternativeGroupIndex+1}}</label>

                          <label
                            class="col-form-label"
                          >{{ $t('name')}} - {{ alternativeGroup.calculationSheetAlternativeGroup.name}}</label>
                          <div class="col-md-1 col-sm-1"></div>
            
                        </div>
                      </div>
                      <b-collapse :id="'alternativeGroup-'+index+alternativeGroupIndex" visible>
                        <b-card-body>
                          <div class="table-responsive-lg table-responsive">
                            <el-table
                              v-if="alternativeGroup.awardingSheetItem.length > 0"
                              class="table-sm table-responsive custom-table"
                              :data="alternativeGroup.awardingSheetItem"
                              size="mini"
                              style="width: 100%"
                            >
                              <el-table-column label width="20">
                                <template slot-scope="scope">
                                  <a
                                    class="text-danger"
                                    @click="removeAlternativeItem(index,alternativeGroupIndex,scope.row)"
                                  >
                                    <i class="fa fa-trash"></i>
                                  </a>
                                </template>
                              </el-table-column>
                              <el-table-column type="index" :min-width="50"></el-table-column>
                              <el-table-column
                                prop="calculationSheetItem.code"
                                label="Code"
                                :min-width="30"
                              ></el-table-column>
                              <el-table-column
                                prop="calculationSheetItem.name"
                                label="Name"
                                :min-width="80"
                              ></el-table-column>
                              <el-table-column
                                prop="calculationSheetItem.currencyCode"
                                label="Currency"
                                :min-width="50"
                              ></el-table-column>
                              <el-table-column
                                prop="calculationSheetItem.vendor"
                                label="Vendor"
                                :min-width="50"
                              ></el-table-column>
                              <el-table-column
                                prop="calculationSheetItem.quantity"
                                label="Quantity"
                                :min-width="50"
                              ></el-table-column>
                              <el-table-column
                                prop="deliveredItems"
                                label="Delieverd item"
                                :min-width="70"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.deliveredItems"
                                    size="mini"
                                       
                                    autocomplete="off"
                                    @change="calculatorPendingForPut(scope.row,scope.$index)"
                                    v-validate="{regex:/^[0-9]*$/ }"
                                  ></el-input>
                                  <div
                                    class="help-block"
                                    v-if="scope.row.deliveredItems && scope.row.calculationSheetItem.msg"
                                  >
                                    <label style="color:red;">{{scope.row.calculationSheetItem.msg}}</label>
                                  </div>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="calculationSheetItem.pendingItems"
                                label="Pending items"
                                :min-width="50"
                              ></el-table-column>
                            </el-table>
                          </div>
                          <br />
                          <br />
                        </b-card-body>
                      </b-collapse>
                    </b-card>
                    <b-card
                      class="card card-accent-primary mt-3"
                      v-if=" CalcGroup.awardingSheetOptionalGroup"
                    >
                      <div slot="header">
                        {{$t('OptionalItems')}}
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
                            v-if="CalcGroup.awardingSheetOptionalGroup.calculationSheetItem.length > 0 && CalcGroup.awardingSheetOptionalGroup"
                            class="table-sm table-responsive custom-table"
                            :data="CalcGroup.awardingSheetOptionalGroup.awardingSheetItem"
                            size="mini"
                            style="width: 100%"
                          >
                            <el-table-column label width="20">
                              <template slot-scope="scope">
                                <a
                                  class="text-danger"
                                  @click="removeOptionalItem(index,scope.row)"
                                >
                                  <i class="fa fa-trash"></i>
                                </a>
                              </template>
                            </el-table-column>
                            <el-table-column type="index" :min-width="50"></el-table-column>
                            <el-table-column
                              prop="calculationSheetItem.code"
                              label="Code"
                              :min-width="30"
                            ></el-table-column>
                            <el-table-column
                              prop="calculationSheetItem.name"
                              label="Name"
                              :min-width="80"
                            ></el-table-column>
                            <el-table-column
                              prop="calculationSheetItem.currencyCode"
                              label="Currency"
                              :min-width="50"
                            ></el-table-column>
                            <el-table-column
                              prop="calculationSheetItem.vendor"
                              label="Vendor"
                              :min-width="50"
                            ></el-table-column>
                            <el-table-column
                              prop="calculationSheetItem.quantity"
                              label="Quantity"
                              :min-width="50"
                            ></el-table-column>
                            <el-table-column
                              prop="deliveredItems"
                              label="Delieverd item"
                              :min-width="70"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.deliveredItems"
                                  size="mini"
                                     
                                  autocomplete="off"
                                  @change="calculatorPendingForPut(scope.row,scope.$index)"
                                  v-validate="{regex:/^[0-9]*$/ }"
                                ></el-input>
                                <div
                                  class="help-block"
                                  v-if="scope.row.deliveredItems && scope.row.calculationSheetItem.msg"
                                >
                                  <label style="color:red;">{{scope.row.calculationSheetItem.msg}}</label>
                                </div>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="calculationSheetItem.pendingItems"
                              label="Pending items"
                              :min-width="50"
                            ></el-table-column>
                          </el-table>
                        </div>
                        <br />
                      </b-collapse>
                    </b-card>
                  </b-card-body>
                </b-collapse>
              </b-card>
              <br />
            </b-col>
          </b-row>
        </b-card-body>
      </b-collapse>
    </b-card>

    <div class="text-center mb-5">
      <div>
        <button class="btn btn-primary" v-on:click="save()">
          <i class="fa fa-save"></i>
          {{$t("Save")}}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-body,
.card-header {
  padding: 5px 8px;
}
.table-sm th,
.table-sm td {
  /*padding:0px 0.05px !important;*/
  padding: 0px 1.2px !important;
  border-top: 0px;
}
.table-sm td {
  padding-top: 1px !important;
  padding-bottom: 1px !important;
  border-top: 0px;
}
.table-sm th {
  vertical-align: middle;
}

.has-error {
  border-color: red !important;
}

.mwp-130 {
  min-width: 130% !important;
}

.wc-150 {
  min-width: 150px !important;
}

.wc-95 {
  min-width: 95px !important;
}

.wc-40 {
  min-width: 40px !important;
}

.wc-120 {
  min-width: 120px !important;
}
.width100 {
  width: 100%;
}
</style>
<script>
import moment from "moment";
export default {
  name: "create",
  data() {
    return {
      fullscreenLoading: false,
      tenderDate: "",
      calculationSheetID: "",
      calculationSheetItems: [],
      awardingSheetItems: [],
      calculationSheetList: [],
      calculationSheetCurrencyRate: [],
      AwardingSheets: {
        calculationSheetId: this.calculationSheetID,
        subject: "",
        quoteNumber: "",
        customerName: "",
        vatValue: "",
        WarrantyTerms: "",
        TenderCurrency: "",
        funderName: "",
        validity: "",
        poNumber: "",
        paymentMethod: "",
        tenderClosingDate: "",
        tenderNumber: "",
        calculationSheetMainGroup: []
      },
      awardingID: this.$route.params.awardingID
    };
  },
  mounted() {},
  created() {
    if (!this.awardingID) {
      this.getCalculationSheetList();
    }
    if (this.awardingID) {
      this.fetchAwardingData(this.awardingID);
    }
  },
  methods: {
    removeCalcuationSheetMainItems(index, item) {
      if (this.awardingID) {
        this.awardingSheetItems[index].awardingSheetItem.splice(
          this.awardingSheetItems[index].awardingSheetItem.indexOf(item),
          1
        );
      } else {
        this.calculationSheetItems[index].calculationSheetItem.splice(
          this.calculationSheetItems[index].calculationSheetItem.indexOf(item),
          1
        );
      }
    },
    removeAlternativeItem(index, alternativeGroupIndex, item) {
      if (this.awardingID) {
        this.awardingSheetItems[index].awardingSheetAlternativeGroup[
          alternativeGroupIndex
        ].awardingSheetItems.splice(
          this.awardingSheetItems[index].awardingSheetAlternativeGroup[
            alternativeGroupIndex
          ].awardingSheetItems.indexOf(item),
          1
        );
      } else {
        this.calculationSheetItems[index].calculationSheetAlternativeGroup[
          alternativeGroupIndex
        ].calculationSheetItem.splice(
          this.calculationSheetItems[index].calculationSheetAlternativeGroup[
            alternativeGroupIndex
          ].calculationSheetItem.indexOf(item),
          1
        );
      }
    },
    removeOptionalItem(index, item) {
      if (this.awardingID) {
        this.awardingSheetItems[
          index
        ].awardingSheetOptionalGroup.awardingSheetItem.splice(
          this.awardingSheetItems[
            index
          ].awardingSheetOptionalGroup.awardingSheetItem.indexOf(item),
          1
        );
      } else {
        this.calculationSheetItems[
          index
        ].calculationSheetOptionalGroup.calculationSheetItem.splice(
          this.calculationSheetItems[
            index
          ].calculationSheetOptionalGroup.calculationSheetItem.indexOf(item),
          1
        );
      }
    },
    hasNumber(myString) {
      var matches = myString.match(/^[0-9]*$/g);
      if (matches != null) {
        return true;
      } else {
        return false;
      }
    },
    calculatorPending(rowItem, rowIndex) {
      var reg = new RegExp("^[0-9]*$");
      if (!reg.test(rowItem.deliveredItems)) {
        rowItem.msg = "input should be less than quantity";
        rowItem.pendingItems = "";
        return;
      } else {
        if (parseFloat(rowItem.quantity) < parseFloat(rowItem.deliveredItems)) {
          rowItem.msg = "input should be less than quantity";
          rowItem.pendingItems = "";
          return;
        } else {
          rowItem.msg = "";
        }
      }

      if (
        parseInt(rowItem.quantity) >= parseInt(rowItem.deliveredItems) &&
        rowItem.deliveredItems &&
        rowItem.deliveredItems != ""
      ) {
        var urlStr = "";
        if (this.awardingID) {
          var urlStr =
            this.$store.getters.serverURI +
            "api/AwardingSheet/ValidateAwardingSheetItemForPut";
        } else {
          var urlStr =
            this.$store.getters.serverURI +
            "api/AwardingSheet/ValidateAwardingSheetItemForPost";
        }
        this.$http
          .post(urlStr, rowItem, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            response => {
              if (!response.data.flag) {
                rowItem.pendingItems = "";
                rowItem.msg = "Delivered should be less than pending";
              } else {
                rowItem.pendingItems = response.data.result;
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
      }
    },
    calculatorPendingForPut(rowItem, rowIndex) {
      var reg = new RegExp("^[0-9]*$");
      if (!reg.test(rowItem.deliveredItems)) {
        rowItem.calculationSheetItem.msg = "input should be less than quantity";
        rowItem.calculationSheetItem.pendingItems = "";
        return;
      } else {
        if (
          parseFloat(rowItem.calculationSheetItem.quantity) <
          parseFloat(rowItem.deliveredItems)
        ) {
          rowItem.calculationSheetItem.msg =
            "input should be less than quantity";
          rowItem.calculationSheetItem.pendingItems = "";
          return;
        } else {
          rowItem.calculationSheetItem.msg = "";
        }
      }
      if (
        rowItem.deliveredItems &&
        rowItem.deliveredItems != "" &&
        parseFloat(rowItem.calculationSheetItem.quantity) >=
          parseFloat(rowItem.deliveredItems)
      ) {
        var urlStr = "";
        if (this.awardingID) {
          var urlStr =
            this.$store.getters.serverURI +
            "api/AwardingSheet/ValidateAwardingSheetItemForPut";
        } else {
          var urlStr =
            this.$store.getters.serverURI +
            "api/AwardingSheet/ValidateAwardingSheetItemForPost";
        }
        this.$http
          .post(urlStr, rowItem, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            response => {
              if (!response.data.flag) {
                rowItem.calculationSheetItem.pendingItems = "";
                rowItem.calculationSheetItem.msg =
                  "Delivered should be less than pending";
              } else {
                rowItem.calculationSheetItem.pendingItems =
                  response.data.result;
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
      }
    },
    selectCalculationSheet() {
      if (this.calculationSheetID) {
        var urlStr =
          this.$store.getters.serverURI +
          "api/PriceQuotation/GetPriceQuotationBySheetId/" +
          this.calculationSheetID;
        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj
          })
          .then(
            function(data) {
              this.AwardingSheets.customerName =
                data.body.calculationSheet.mssCustomerName != ""
                  ? data.body.calculationSheet.mssCustomerName
                  : data.body.calculationSheet.nonMssCustomerName;
              this.AwardingSheets.quoteNumber = data.body.quoteNumber
                ? data.body.quoteNumber
                : "";
              this.AwardingSheets.vatValue = data.body.calculationSheet.vatValue
                ? data.body.calculationSheet.vatValue
                : "";
              this.AwardingSheets.funderName = data.body.calculationSheet
                .funderName
                ? data.body.calculationSheet.funderName
                : "";
              this.AwardingSheets.WarrantyTerms = data.body.calculationSheet
                .warranty
                ? data.body.calculationSheet.warranty
                : "";

              this.AwardingSheets.TenderCurrency = data.body.calculationSheet
                .tenderCurrencyCode
                ? data.body.calculationSheet.tenderCurrencyCode
                : "";
              this.AwardingSheets.subject = data.body.subject
                ? data.body.subject
                : "";
              this.AwardingSheets.calculationSheetId = this.calculationSheetID;
             
              this.$validator.reset();
              this.fullscreenLoading = false;
              if (!this.awardingID) {
                this.getcalculationSheetItemss(this.calculationSheetID);
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
      }
    },
    getcalculationSheetItemss(calculationSheedId) {
      var urlStr =
        this.$store.getters.serverURI +
        "api/CalculationSheet/" +
        calculationSheedId +
        "/GetSelectedItemsForAwardingSheets";

      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.calculationSheetItems =
              data.body.calculationSheetMainGroupViewModel;

            this.calculationSheetCurrencyRate =
              data.body.calculationSheetBasicInfoViewModel.calculationSheetCurrencyRate;

            this.AwardingSheets.validity = data.body
              .calculationSheetBasicInfoViewModel.validityLookup.name
              ? data.body.calculationSheetBasicInfoViewModel.validityLookup.name
              : " ";
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
    save: function() {
      this.$validator.validateAll("awardingValidation").then(result => {
        if (result) {
          if (this.awardingID) {
            this.AwardingSheets.calculationSheetMainGroup = this.awardingSheetItems;
            let date = moment(this.AwardingSheets.tenderClosingDate).format(
              "YYYY-MM-DD[T]HH:mm:ss"
            );
            this.AwardingSheets.tenderClosingDate = date;
            var urlStr = this.$store.getters.serverURI + "api/AwardingSheet";
            this.fullscreenLoading = true
            this.$http
              .put(urlStr, this.AwardingSheets, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                response => {
                  this.fullscreenLoading =false
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "success",
                    message: this.$t("AwardingSheetUpdatedSuccessfully")
                  });
                  this.$router.push({ path: "/AwardingList/list" });
                },
                function(error) {
                  this.fullscreenLoading = false
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "error",
                    message: this.$t("ErrorMessage")
                  });
                }
              );
          } else {
            var urlStr = this.$store.getters.serverURI + "api/AwardingSheet";
            let date = moment(this.AwardingSheets.tenderClosingDate).format(
              "YYYY-MM-DD[T]HH:mm:ss"
            );
            this.AwardingSheets.tenderClosingDate = date;
            this.AwardingSheets.calculationSheetMainGroup = this.calculationSheetItems;
            this.fullscreenLoading = true
            this.$http
              .post(urlStr, this.AwardingSheets, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                response => {
                  this.fullscreenLoading = false
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "success",
                    message: this.$t("AwardingSheetCreatedSuccessfully")
                  });
                  this.$router.push({ path: "/AwardingList/list" });
                },
                function(error) {
                  this.fullscreenLoading = false
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
    getCalculationSheetList(query = "") {
      var urlStr =
        this.$store.getters.serverURI + "api/CalculationSheets/Awarded";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.calculationSheetList = data.body;
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
    fetchAwardingData(awardingID) {
      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI + "api/AwardingSheet/" + awardingID;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.AwardingSheets = data.body;
            this.calculationSheetID = data.body.calculationSheetId;
            this.AwardingSheets.calculationSheedId = this.calculationSheetID;
            this.awardingSheetItems = data.body.awardingSheetMainGroup;
            this.calculationSheetCurrencyRate =
              data.body.calculationSheetBasicInfoViewModel.calculationSheetCurrencyRate;
            this.AwardingSheets.tenderNumber =
              data.body.calculationSheetBasicInfoViewModel.tenderNumber;
           
            this.AwardingSheets.validity = data.body
              .calculationSheetBasicInfoViewModel.validityLookup.name
              ? data.body.calculationSheetBasicInfoViewModel.validityLookup.name
              : " ";
            
            this.selectCalculationSheet();
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
};
</script>
