<template>
  <div>
    <div class="row" v-loading.fullscreen.lock="fullscreenLoading">
      <div class="col-md-12">
        <router-link
          :to="{ name: 'PriceQuotationsList' }"
          class="btn btn-secondary"
        >
          <i class="fa fa-arrow-left"></i>
          {{ $t("BackToList") }}
        </router-link>
      </div>
    </div>
    <br />
    <b-card class="card card-accent-primary" no-body>
      <div slot="header">
        <span>{{ $t("QuoteInformation") }}</span>
      </div>
      <b-collapse id="collapse1" visible>
        <b-card-body>
          <div class="row">
            <div class="col-md-6">
              <div>
                <div
                  class="form-group"
                  :class="{
                    'has-error': errors.has(
                      'priceQouteValidation.calculationSheet'
                    ),
                  }"
                >
                  <label class="col-form-label">{{
                    $t("QuotationReference")
                  }}</label>
                  <label class="required"> *</label>
                  <el-select
                    v-if="!CalSheetId"
                    v-model="formdata.calculationSheetId"
                    name="calculationSheet"
                    clearable
                    filterable
                    v-validate="'required'"
                    data-vv-scope="priceQouteValidation"
                    :placeholder="$t('Select')"
                    @change="selectCalculationSheet()"
                  >
                    <el-option
                      v-for="option in calculationSheetList"
                      v-bind:value="option.id"
                      v-bind:label="option.tenderNumber"
                      v-bind:key="option.id"
                    ></el-option>
                  </el-select>

                  <input
                    v-if="CalSheetId && !qouteID"
                    type="text"
                    name="tenderNumber"
                    class="form-control"
                    v-model="formdata.tenderNumber"
                    v-validate="'required'"
                    disabled
                    autocomplete="off"
                  />

                  <div
                    class="help-block"
                    v-if="errors.has('priceQouteValidation.calculationSheet')"
                  >
                    <label class="mt-1">{{
                      errors.first("priceQouteValidation.calculationSheet")
                    }}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div>
                <div
                  class="form-group"
                  :class="{
                    'has-error': errors.has('priceQouteValidation.quoteNumber'),
                  }"
                >
                  <label class="col-form-label">{{ $t("quoteNumber") }}</label>
                  <input
                    type="text"
                    name="quoteNumber"
                    class="form-control"
                    v-model="formdata.quoteNumber"
                    v-validate="'required'"
                    disabled
                    autocomplete="off"
                  />
                  <div
                    class="help-block"
                    v-if="errors.has('priceQouteValidation.quoteNumber')"
                  >
                    <label class="mt-1">{{
                      errors.first("priceQouteValidation.quoteNumber")
                    }}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="row">
                <div class="row col-md-12 pr-0">
                  <div class="col-md-6 pr-0">
                    <div
                      class="form-group"
                      :class="{
                        'has-error': errors.has(
                          'priceQouteValidation.TenderName'
                        ),
                      }"
                    >
                      <label class="col-form-label">{{
                        $t("TenderName")
                      }}</label>
                      <input
                        type="text"
                        name="TenderName"
                        class="form-control"
                        v-model="formdata.tenderName"
                        v-validate="'required'"
                        data-vv-scope="priceQouteValidation"
                        disabled
                        autocomplete="off"
                      />
                      <div
                        class="help-block"
                        v-if="errors.has('priceQouteValidation.TenderName')"
                      >
                        {{ errors.first("priceQouteValidation.TenderName") }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 pr-0">
                    <div
                      class="form-group"
                      :class="{
                        'has-error': errors.has(
                          'priceQouteValidation.WarrantyTerms'
                        ),
                      }"
                    >
                      <label class="col-form-label">{{
                        $t("WarrantyTerms")
                      }}</label>
                      <input
                        type="text"
                        name="WarrantyTerms"
                        class="form-control"
                        v-model="formdata.warranty"
                        v-validate="'required'"
                        data-vv-scope="priceQouteValidation"
                        disabled
                        autocomplete="off"
                      />
                      <div
                        class="help-block"
                        v-if="errors.has('priceQouteValidation.WarrantyTerms')"
                      >
                        {{ errors.first("priceQouteValidation.WarrantyTerms") }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row col-md-12 pr-0">
                  <div class="col-md-12 pr-0">
                    <div
                      class="form-group"
                      :class="{
                        'has-error': errors.has(
                          'priceQouteValidation.PriceValidity'
                        ),
                      }"
                    >
                      <label class="col-form-label">{{
                        $t("PriceValidity")
                      }}</label>
                      <input
                        type="text"
                        name="PriceValidity"
                        class="form-control"
                        v-model="formdata.PriceValidity"
                        v-validate="'required'"
                        data-vv-scope="priceQouteValidation"
                        disabled
                        autocomplete="off"
                      />
                      <div
                        class="help-block"
                        v-if="errors.has('priceQouteValidation.PriceValidity')"
                      >
                        {{ errors.first("priceQouteValidation.PriceValidity") }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="form-group">
                    <label class="col-form-label">{{
                      $t("SalesPerson")
                    }}</label>
                    <input
                      type="text"
                      name="SalesPerson"
                      class="form-control"
                      v-model="formdata.salesPerson"
                      autocomplete="off"
                      :maxlength="$store.getters.getMaxLength.length40"
                    />
                  </div>
                </div>

                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{
                      'has-error': errors.has('priceQouteValidation.total'),
                    }"
                  >
                    <label class="col-form-label">{{ $t("total") }}</label>
                    <input
                      type="text"
                      name="total"
                      class="form-control"
                      v-model="formdata.total"
                      v-validate="'required'"
                      data-vv-scope="priceQouteValidation"
                      disabled
                      autocomplete="off"
                    />
                    <div
                      class="help-block"
                      v-if="errors.has('priceQouteValidation.total')"
                    >
                      {{ errors.first("priceQouteValidation.total") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="row">
                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{
                      'has-error': errors.has('priceQouteValidation.subject'),
                    }"
                  >
                    <label class="col-form-label">{{ $t("subject") }}</label>
                    <label class="required"> *</label>
                    <input
                      type="text"
                      name="subject"
                      class="form-control"
                      v-model="formdata.subject"
                      v-validate="'required'"
                      data-vv-scope="priceQouteValidation"
                      autocomplete="off"
                      :maxlength="$store.getters.getMaxLength.length30"
                    />
                    <div
                      class="help-block"
                      v-if="errors.has('priceQouteValidation.subject')"
                    >
                      {{ errors.first("priceQouteValidation.subject") }}
                    </div>
                  </div>
                </div>

                <div class="row col-md-12 pr-0">
                  <div class="col-md-6">
                    <div
                      class="form-group"
                      :class="{
                        'has-error': errors.has(
                          'priceQouteValidation.VatValue'
                        ),
                      }"
                    >
                      <label class="col-form-label">{{ $t("VatValue") }}</label>
                      <input
                        type="text"
                        name="VatValue"
                        class="form-control"
                        v-model="formdata.vatValue"
                        v-validate="'required'"
                        data-vv-scope="priceQouteValidation"
                        disabled
                        autocomplete="off"
                      />
                      <div
                        class="help-block"
                        v-if="errors.has('priceQouteValidation.VatValue')"
                      >
                        {{ errors.first("priceQouteValidation.VatValue") }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6 pr-0">
                    <div
                      class="form-group"
                      :class="{
                        'has-error': errors.has(
                          'priceQouteValidation.TenderType'
                        ),
                      }"
                    >
                      <label class="col-form-label">{{
                        $t("TenderType")
                      }}</label>
                      <input
                        type="text"
                        name="TenderType"
                        class="form-control"
                        v-model="formdata.tenderType"
                        v-validate="'required'"
                        data-vv-scope="priceQouteValidation"
                        disabled
                        autocomplete="off"
                      />
                      <div
                        class="help-block"
                        v-if="errors.has('priceQouteValidation.TenderType')"
                      >
                        {{ errors.first("priceQouteValidation.TenderType") }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row col-md-12 pr-0">
                  <div class="col-md-12 pr-0">
                    <div
                      class="form-group"
                      :class="{
                        'has-error': errors.has(
                          'priceQouteValidation.TenderCurrency'
                        ),
                      }"
                    >
                      <label class="col-form-label">{{
                        $t("TenderCurrency")
                      }}</label>
                      <input
                        type="text"
                        name="TenderCurrency"
                        class="form-control"
                        v-model="formdata.tenderCurrencyCode"
                        v-validate="'required'"
                        data-vv-scope="priceQouteValidation"
                        disabled
                        autocomplete="off"
                      />
                      <div
                        class="help-block"
                        v-if="errors.has('priceQouteValidation.TenderCurrency')"
                      >
                        {{
                          errors.first("priceQouteValidation.TenderCurrency")
                        }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-12">
                  <div
                    class="form-group"
                    :class="{
                      'has-error': errors.has(
                        'priceQouteValidation.QuoteStage'
                      ),
                    }"
                  >
                    <label class="col-form-label">{{ $t("QuoteStage") }}</label>
                    <el-select
                      v-model="formdata.stageId"
                      :data-vv-as="$t('QuoteStage')"
                      name="QuoteStage"
                      :placeholder="$t('Select')"
                      clearable
                      filterable
                      class="full-width"
                      v-validate="'required'"
                      data-vv-scope="priceQouteValidation"
                    >
                      <el-option
                        v-for="option in stagelist"
                        :value="option.id"
                        :label="option.name"
                        :key="option.id"
                      ></el-option>
                    </el-select>
                    <div
                      class="help-block"
                      v-if="errors.has('priceQouteValidation.QuoteStage')"
                    >
                      {{ errors.first("priceQouteValidation.QuoteStage") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div
                class="form-group"
                :class="{
                  'has-error': errors.has(
                    'priceQouteValidation.calculationSheetType'
                  ),
                }"
              >
                <label class="col-form-label">{{
                  $t("calculationSheetType")
                }}</label>
                <el-select
                  v-model="formdata.calculationSheetType"
                  :data-vv-as="$t('calculationSheetType')"
                  name="calculationSheetType"
                  :placeholder="$t('Select')"
                  clearable
                  filterable
                  class="full-width"
                  v-validate="'required'"
                  disabled
                  data-vv-scope="priceQouteValidation"
                >
                  <el-option
                    v-for="option in calculationSheetTypeList"
                    :value="option.id"
                    :label="option.name"
                    :key="option.id"
                  ></el-option>
                </el-select>
                <div
                  class="help-block"
                  v-if="errors.has('priceQouteValidation.calculationSheetType')"
                >
                  {{
                    errors.first("priceQouteValidation.calculationSheetType")
                  }}
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3">
            <b-collapse id="collapse2" visible>
              <b-card-body>
                <b-row
                  v-if="calculationSheetItem.length > 0"
                  v-for="(CalcGroup, index) in calculationSheetItem"
                  :key="CalcGroup.id"
                >
                  <b-col lg="12" md="12">
                    <b-card class="card card-accent-primary" no-body>
                      <div slot="header">
                        <div class="row">
                          <input
                            style="margin-top: 12px"
                            type="checkbox"
                            :id="index"
                            :value="CalcGroup.selectedForPriceQuotation"
                            v-model="CalcGroup.selectedForPriceQuotation"
                          />
                          <label class="col-sm-2 col-form-label"
                            >{{ $t("Item") }}-{{ index + 1 }}</label
                          >
                          <label class="col-form-label"
                            >{{ $t("DeliveryTerms") }} -
                            {{ CalcGroup.deliveryTerms }}</label
                          >
                          <div class="col-md-3 col-sm-3"></div>
                          <label class="col-form-label"
                            >{{ $t("Warranty") }} -
                            {{ CalcGroup.warranty }}</label
                          >
                          <div class="col-md-3 col-sm-3"></div>
                        </div>
                      </div>
                      <b-collapse :id="'mainItem-' + index" visible>
                        <b-card-body>
                          <div class="table-responsive-lg table-responsive">
                            <el-table
                              v-if="CalcGroup.calculationSheetItem.length > 0"
                              class="table-sm table-responsive custom-table"
                              :data="CalcGroup.calculationSheetItem"
                              size="mini"
                              style="width: 100%"
                            >
                              <el-table-column
                                type="index"
                                :min-width="50"
                              ></el-table-column>
                              <el-table-column
                                prop="code"
                                label="Code"
                                :min-width="30"
                              ></el-table-column>
                              <el-table-column
                                prop="name"
                                label="Name"
                                :min-width="80"
                              ></el-table-column>
                              <el-table-column
                                prop="quantity"
                                label="Quantity"
                                :min-width="50"
                              ></el-table-column>
                              <el-table-column
                                prop="unitPrice"
                                label="Unit price"
                                :min-width="50"
                              ></el-table-column>
                              <el-table-column
                                prop="amount"
                                label="Amount"
                                :min-width="50"
                              ></el-table-column>
                            </el-table>
                          </div>
                          <br />
                          <b-card
                            class="card card-accent-primary mt-3"
                            v-if="CalcGroup.calculationSheetOptionalGroup"
                          >
                            <div slot="header">
                              <input
                                style="margin-top: 12px"
                                type="checkbox"
                                :id="index"
                                :value="
                                  CalcGroup.calculationSheetOptionalGroup
                                    .selectedForPriceQuotation
                                "
                                v-model="
                                  CalcGroup.calculationSheetOptionalGroup
                                    .selectedForPriceQuotation
                                "
                              />
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
                            <b-collapse
                              :id="'ItemoptionalGroup-' + index"
                              visible
                            >
                              <div class="table-responsive-lg table-responsive">
                                <el-table
                                  class="table-sm table-responsive custom-table"
                                  :data="
                                    CalcGroup.calculationSheetOptionalGroup
                                      .calculationSheetItem
                                  "
                                  size="mini"
                                  style="width: 100%"
                                >
                                  <el-table-column
                                    type="index"
                                    :min-width="50"
                                  ></el-table-column>
                                  <el-table-column
                                    prop="code"
                                    label="Code"
                                    :min-width="30"
                                  ></el-table-column>
                                  <el-table-column
                                    prop="name"
                                    label="Name"
                                    :min-width="80"
                                  ></el-table-column>
                                  <el-table-column
                                    prop="quantity"
                                    label="Quantity"
                                    :min-width="50"
                                  ></el-table-column>
                                  <el-table-column
                                    prop="unitPrice"
                                    label="Unit price"
                                    :min-width="50"
                                  ></el-table-column>
                                  <el-table-column
                                    prop="amount"
                                    label="Amount"
                                    :min-width="50"
                                  ></el-table-column>
                                  <!-- <el-table-column type="index" width="50"></el-table-column>
                                  <el-table-column sortable prop="name" label="Name" width="180"></el-table-column>
                                  <el-table-column
                                    sortable
                                    prop="vendor"
                                    label="Vendor"
                                    width="180"
                                  ></el-table-column>
                                  <el-table-column
                                    sortable
                                    prop="quantity"
                                    label="Quantity"
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
                                    label="Price list"
                                    width="120"
                                  ></el-table-column>
                                  <el-table-column
                                    sortable
                                    prop="costType"
                                    label="Cost type "
                                    width="120"
                                  ></el-table-column>
                                  <el-table-column
                                    sortable
                                    prop="discount1"
                                    label="Disc1%"
                                    width="120"
                                  ></el-table-column>
                                  <el-table-column
                                    sortable
                                    prop="discount2"
                                    label="Disc2%"
                                    width="120"
                                  ></el-table-column>
                                  <el-table-column
                                    sortable
                                    prop="currencyCode"
                                    label="Currency"
                                    width="120"
                                  ></el-table-column>
                                  <el-table-column
                                    sortable
                                    prop="shipment"
                                    label="S&C %"
                                    width="120"
                                  ></el-table-column>
                                  <el-table-column
                                    sortable
                                    prop="landedCost"
                                    label="Landed cost"
                                    width="120"
                                  ></el-table-column>
                                  <el-table-column
                                    sortable
                                    prop="grossMargin"
                                    label="GM%"
                                    width="120"
                                  ></el-table-column>
                                  <el-table-column
                                    sortable
                                    prop="grossMarginValue"
                                    label="Gross margin value"
                                    width="160"
                                  ></el-table-column>
                                  <el-table-column
                                    sortable
                                    prop="unitPrice"
                                    label="Unit price"
                                    width="120"
                                  ></el-table-column>
                                  <el-table-column
                                    sortable
                                    prop="amount"
                                    label="Amount"
                                    width="120"
                                  ></el-table-column>
                                  <el-table-column sortable prop="note" label="note" width="120"></el-table-column>-->
                                </el-table>
                              </div>
                              <br />
                            </b-collapse>
                          </b-card>
                          <br />
                          <b-card
                            class="card card-accent-primary"
                            no-body
                            v-if="
                              CalcGroup.calculationSheetAlternativeGroup
                                .length > 0
                            "
                            v-for="(
                              alternativeGroup, alternativeGroupIndex
                            ) in CalcGroup.calculationSheetAlternativeGroup"
                            :key="alternativeGroup.id"
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
                                <input
                                  style="margin-top: 12px"
                                  type="checkbox"
                                  :id="alternativeGroupIndex"
                                  :value="
                                    alternativeGroup.selectedForPriceQuotation
                                  "
                                  v-model="
                                    alternativeGroup.selectedForPriceQuotation
                                  "
                                />
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
                                'alternativeGroup-' +
                                index +
                                alternativeGroupIndex
                              "
                              visible
                            >
                              <b-card-body>
                                <div
                                  class="table-responsive-lg table-responsive"
                                >
                                  <el-table
                                    class="table-sm table-responsive custom-table"
                                    :data="
                                      alternativeGroup.calculationSheetItem
                                    "
                                    size="mini"
                                    style="width: 100%"
                                  >
                                    <el-table-column
                                      type="index"
                                      :min-width="50"
                                    ></el-table-column>
                                    <el-table-column
                                      prop="code"
                                      label="Code"
                                      :min-width="30"
                                    ></el-table-column>
                                    <el-table-column
                                      prop="name"
                                      label="Name"
                                      :min-width="80"
                                    ></el-table-column>
                                    <el-table-column
                                      prop="quantity"
                                      label="Quantity"
                                      :min-width="50"
                                    ></el-table-column>
                                    <el-table-column
                                      prop="unitPrice"
                                      label="Unit price"
                                      :min-width="50"
                                    ></el-table-column>
                                    <el-table-column
                                      prop="amount"
                                      label="Amount"
                                      :min-width="50"
                                    ></el-table-column>
                                    <!-- <el-table-column type="index" width="50"></el-table-column>
                                    <el-table-column sortable prop="name" label="Name" width="180"></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="vendor"
                                      label="Vendor"
                                      width="180"
                                    ></el-table-column>

                                    <el-table-column
                                      sortable
                                      prop="quantity"
                                      label="Quantity"
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
                                      label="Price list"
                                      width="120"
                                    ></el-table-column>

                                    <el-table-column
                                      sortable
                                      prop="costType"
                                      label="Cost type "
                                      width="120"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="discount1"
                                      label="Disc1%"
                                      width="120"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="discount2"
                                      label="Disc2%"
                                      width="120"
                                    ></el-table-column>

                                    <el-table-column
                                      sortable
                                      prop="currencyCode"
                                      label="Currency"
                                      width="120"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="shipment"
                                      label="S&C %"
                                      width="120"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="landedCost"
                                      label="Landed cost"
                                      width="120"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="grossMargin"
                                      label="GM%"
                                      width="120"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="grossMarginValue"
                                      label="Gross margin value"
                                      width="160"
                                    ></el-table-column>
                                    <el-table-column
                                      sortable
                                      prop="unitPrice"
                                      label="Unit price"
                                      width="120"
                                    ></el-table-column>

                                    <el-table-column
                                      sortable
                                      prop="amount"
                                      label="Amount"
                                      width="120"
                                    ></el-table-column>

                                    <el-table-column sortable prop="note" label="note" width="120"></el-table-column>-->
                                  </el-table>
                                  <br />
                                  <b-card
                                    class="card card-accent-primary mt-3"
                                    v-if="
                                      alternativeGroup.calculationSheetAlternativeOptionalGroup !=
                                      null
                                    "
                                  >
                                    <div slot="header">
                                      <input
                                        style="margin-top: 12px"
                                        type="checkbox"
                                        :id="'optionalGroup-' + index"
                                        :value="
                                          alternativeGroup
                                            .calculationSheetAlternativeOptionalGroup
                                            .selectedForPriceQuotation
                                        "
                                        v-model="
                                          alternativeGroup
                                            .calculationSheetAlternativeOptionalGroup
                                            .selectedForPriceQuotation
                                        "
                                      />
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
                                              .calculationSheetAlternativeOptionalGroup
                                              .calculationSheetItem
                                          "
                                          size="mini"
                                          style="width: 100%"
                                        >
                                          <el-table-column
                                            type="index"
                                            :min-width="50"
                                          ></el-table-column>
                                          <el-table-column
                                            prop="code"
                                            label="Code"
                                            :min-width="30"
                                          ></el-table-column>
                                          <el-table-column
                                            prop="name"
                                            label="Name"
                                            :min-width="80"
                                          ></el-table-column>
                                          <el-table-column
                                            prop="quantity"
                                            label="Quantity"
                                            :min-width="50"
                                          ></el-table-column>
                                          <el-table-column
                                            prop="unitPrice"
                                            label="Unit price"
                                            :min-width="50"
                                          ></el-table-column>
                                          <el-table-column
                                            prop="amount"
                                            label="Amount"
                                            :min-width="50"
                                          ></el-table-column>

                                          <!-- <el-table-column type="index" width="50"></el-table-column>

                                          <el-table-column
                                            sortable
                                            prop="name"
                                            label="Name"
                                            width="180"
                                          ></el-table-column>
                                          <el-table-column
                                            sortable
                                            prop="vendor"
                                            label="Vendor"
                                            width="180"
                                          ></el-table-column>

                                          <el-table-column
                                            sortable
                                            prop="quantity"
                                            label="Quantity"
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
                                            label="Price list"
                                            width="120"
                                          ></el-table-column>

                                          <el-table-column
                                            sortable
                                            prop="costType"
                                            label="Cost type "
                                            width="120"
                                          ></el-table-column>
                                          <el-table-column
                                            sortable
                                            prop="discount1"
                                            label="Disc1%"
                                            width="120"
                                          ></el-table-column>
                                          <el-table-column
                                            sortable
                                            prop="discount2"
                                            label="Disc2%"
                                            width="120"
                                          ></el-table-column>

                                          <el-table-column
                                            sortable
                                            prop="currencyCode"
                                            label="Currency"
                                            width="120"
                                          ></el-table-column>
                                          <el-table-column
                                            sortable
                                            prop="shipment"
                                            label="S&C %"
                                            width="120"
                                          ></el-table-column>
                                          <el-table-column
                                            sortable
                                            prop="landedCost"
                                            label="Landed cost"
                                            width="120"
                                          ></el-table-column>
                                          <el-table-column
                                            sortable
                                            prop="grossMargin"
                                            label="GM%"
                                            width="120"
                                          ></el-table-column>
                                          <el-table-column
                                            sortable
                                            prop="grossMarginValue"
                                            label="Gross margin value"
                                            width="160"
                                          ></el-table-column>
                                          <el-table-column
                                            sortable
                                            prop="unitPrice"
                                            label="Unit price"
                                            width="120"
                                          ></el-table-column>

                                          <el-table-column
                                            sortable
                                            prop="amount"
                                            label="Amount"
                                            width="120"
                                          ></el-table-column>

                                          <el-table-column
                                            sortable
                                            prop="note"
                                            label="note"
                                            width="120"
                                          ></el-table-column>-->
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
              </b-card-body>
            </b-collapse>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card class="card card-accent-primary" no-body>
      <div slot="header">
        {{ $t("CustomerAndContactInformation") }}
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
            <div class="col-md-3">
              <div
                class="form-group"
                :class="{
                  'has-error': errors.has('priceQouteValidation.CustomerName'),
                }"
              >
                <label class="col-form-label">{{ $t("CustomerName") }}</label>
                <input
                  type="text"
                  name="CustomerName"
                  class="form-control"
                  v-model="formdata.customerName"
                  data-vv-scope="priceQouteValidation"
                  disabled
                  autocomplete="off"
                />
                <div
                  class="help-block"
                  v-if="errors.has('priceQouteValidation.CustomerName')"
                >
                  {{ errors.first("priceQouteValidation.CustomerName") }}
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div
                class="form-group"
                :class="{
                  'has-error': errors.has('priceQouteValidation.CustomerFax'),
                }"
              >
                <label class="col-form-label">{{ $t("CustomerFax") }}</label>
                <input
                  type="text"
                  name="CustomerFax"
                  class="form-control"
                  v-model="formdata.customerFax"
                  v-validate="{ regex: /^(?=(.*\d){0})[a-zA-Z\d]{0,20}$/ }"
                  data-vv-scope="priceQouteValidation"
                  autocomplete="off"
                  :maxlength="$store.getters.getMaxLength.length20"
                />
                <div
                  class="help-block"
                  v-if="
                    errors.has('priceQouteValidation.CustomerFax') &&
                    errors.items[0].rule == 'required'
                  "
                >
                  {{ errors.first("priceQouteValidation.CustomerFax") }}
                </div>
                <div
                  class="help-block"
                  v-if="
                    errors.has('priceQouteValidation.CustomerFax') &&
                    errors.items[0].rule == 'regex'
                  "
                >
                  {{ $t("CustomerFaxPlaceHolder") }}
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div
                class="form-group"
                :class="{
                  'has-error': errors.has('priceQouteValidation.CustomerPhone'),
                }"
              >
                <label class="col-form-label">{{ $t("CustomerPhone") }}</label>
                <input
                  type="text"
                  name="CustomerPhone"
                  class="form-control"
                  v-model="formdata.customerPhone"
                  v-validate="{
                    required: false,
                    regex: /^(?=(.*\d){0})[a-zA-Z\d]{0,20}$/,
                  }"
                  data-vv-scope="priceQouteValidation"
                  autocomplete="off"
                  :maxlength="$store.getters.getMaxLength.length20"
                />
                <div
                  class="help-block"
                  v-if="
                    errors.has('priceQouteValidation.CustomerPhone') &&
                    errors.items[0].rule == 'required'
                  "
                >
                  {{ errors.first("priceQouteValidation.CustomerPhone") }}
                </div>
                <div
                  class="help-block"
                  v-if="
                    errors.has('priceQouteValidation.CustomerPhone') &&
                    errors.items[0].rule == 'regex'
                  "
                >
                  {{ $t("CustomerPhonePlaceHolder") }}
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div
                class="form-group"
                :class="{
                  'has-error': errors.has(
                    'priceQouteValidation.CustomerAddress'
                  ),
                }"
              >
                <label class="col-form-label">{{
                  $t("CustomerAddress")
                }}</label>
                <input
                  type="text"
                  name="CustomerAddress"
                  class="form-control"
                  v-model="formdata.customerAddress"
                  data-vv-scope="priceQouteValidation"
                  autocomplete="off"
                  :maxlength="$store.getters.getMaxLength.length30"
                />
                <div
                  class="help-block"
                  v-if="errors.has('priceQouteValidation.CustomerAddress')"
                >
                  {{ errors.first("priceQouteValidation.CustomerAddress") }}
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-3">
              <div
                class="form-group"
                :class="{
                  'has-error': errors.has('priceQouteValidation.ContactName'),
                }"
              >
                <label class="col-form-label">{{ $t("ContactName") }}</label>
                <input
                  type="text"
                  name="ContactName"
                  class="form-control"
                  v-model="formdata.contactName"
                  v-validate="'required'"
                  data-vv-scope="priceQouteValidation"
                  autocomplete="off"
                  :maxlength="$store.getters.getMaxLength.length30"
                />
                <div
                  class="help-block"
                  v-if="errors.has('priceQouteValidation.CustomerName')"
                >
                  {{ errors.first("priceQouteValidation.CustomerName") }}
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div
                class="form-group"
                :class="{
                  'has-error': errors.has('priceQouteValidation.ContactPhone'),
                }"
              >
                <label class="col-form-label">{{ $t("ContactPhone") }}</label>
                <input
                  type="text"
                  name="ContactPhone"
                  class="form-control"
                  v-model="formdata.contactPhone"
                  v-validate="{
                    required: true,
                    regex: /^(?=(.*\d){0})[a-zA-Z\d]{0,20}$/,
                  }"
                  data-vv-scope="priceQouteValidation"
                  autocomplete="off"
                  :maxlength="$store.getters.getMaxLength.length20"
                />
                <div
                  class="help-block"
                  v-if="
                    errors.has('priceQouteValidation.ContactPhone') &&
                    errors.items[0].rule == 'required'
                  "
                >
                  {{ errors.first("priceQouteValidation.ContactPhone") }}
                </div>
                <div
                  class="help-block"
                  v-if="
                    errors.has('priceQouteValidation.ContactPhone') &&
                    errors.items[0].rule == 'regex'
                  "
                >
                  {{ $t("CustomerPhonePlaceHolder") }}
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div
                class="form-group"
                :class="{
                  'has-error': errors.has('priceQouteValidation.ContactEmail'),
                }"
              >
                <label class="col-form-label">{{ $t("ContactEmail") }}</label>
                <input
                  type="text"
                  name="ContactEmail"
                  class="form-control"
                  v-model="formdata.contactEmail"
                  v-validate="'required|email'"
                  data-vv-scope="priceQouteValidation"
                  autocomplete="off"
                />
                <div
                  class="help-block"
                  v-if="errors.has('priceQouteValidation.ContactEmail')"
                >
                  {{ errors.first("priceQouteValidation.ContactEmail") }}
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div
                class="form-group"
                :class="{
                  'has-error': errors.has('priceQouteValidation.Date'),
                }"
              >
                <label class="col-form-label">{{ $t("SubmissionDate") }}</label>

                <input
                  type="text"
                  name="Date"
                  class="form-control"
                  v-model="formdata.date"
                  v-validate="'required|email'"
                  data-vv-scope="priceQouteValidation"
                  autocomplete="off"
                  disabled
                />
                <div
                  class="help-block"
                  v-if="errors.has('priceQouteValidation.SubmissionDate')"
                >
                  {{ errors.first("priceQouteValidation.SubmissionDate") }}
                </div>
              </div>
            </div>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card class="card card-accent-primary">
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
              /> -->
              <dropzone
                id="dropzone"
                :useCustomSlot="true"
                :options="dropzoneOptions"
                @vdropzone-files-added="onFileChange"
              >
                <i class="cui-cloud-upload icons font-2xl d-block"></i>
                <div>Upload files</div>
              </dropzone>
            </div>

            <div class="col-md-10">
              <div class="form-row" v-if="formdata.priceQuotationAttachment">
                <table
                  class="table table-striped table-hover col-md-8 el-col-md-offset-2 table-outline"
                >
                  <thead>
                    <tr>
                      <th>File name</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody v-if="formdata.priceQuotationAttachment.length > 0">
                    <tr
                      v-for="(
                        attachemnt, index
                      ) in formdata.priceQuotationAttachment"
                      v-if="!attachemnt.deleted"
                    >
                      <td>{{ attachemnt.fileName }}</td>
                      <td>
                        <input
                          type="text"
                          :name="attachemnt.quid"
                          class="form-control"
                          v-model="attachemnt.description"
                          autocomplete="off"
                          :maxlength="$store.getters.getMaxLength.length30"
                        />
                      </td>
                      <td>
                        <a
                          :title="$t('Delete')"
                          class="text-danger"
                          @click="removAttachment(attachemnt)"
                        >
                          <i class="fa fa-trash"></i>
                        </a>

                        <a
                          style="cursor: pointer"
                          @click="
                            downloadAttachment(
                              attachemnt.quid,
                              attachemnt.fileName
                            )
                          "
                          v-if="attachemnt.id"
                          class="ml-1"
                        >
                          <i class="fa fa-download"></i>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <div class="text-center mb-5">
      <div>
        <button class="btn btn-primary" v-on:click="save()">
          <i class="fa fa-save"></i>
          {{ $t("Save") }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
.has-error {
  border-color: red !important;
}
</style>
<script>
import moment from "moment";
import axios from "axios";
import dropzone from "vue2-dropzone";

export default {
  name: "create",
  components: {
    dropzone,
  },

  data() {
    return {
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
        parallelUploads: 20,
      },
      fullscreenLoading: false,
      quoteType: "",
      quoteList: [],
      stagelist: [],
      calculationSheetTypeList: [
        { id: 1, name: "Medical Equipment" },
        { id: 2, name: "Tender" },
        { id: 3, name: "Lab" },
      ],
      usersList: [],
      calculationSheetList: [],
      calculationSheetItem: [],
      formdata: {
        id: 0,
        subject: "",
        calculationSheetId: null,
        TenderClosingDate: "",
        quoteNumber: "",
        tenderNumber: "",
        tenderName: "",
        tenderType: "",
        tenderCurrencyCode: "",
        warranty: "",
        PriceValidity: "",
        vatValue: "",
        deliveryTerms: "",
        paymentTerms: "",
        stageId: null,
        CustomerName: "",
        customerPhone: "",
        customerFax: "",
        customerAddress: "",
        contactName: "Ahmad AlSherif",
        contactPhone: "0569400580",
        contactEmail: "a.sharif@msspal.com",
        ContactDate: "",
        date: "",
        priceQuotationAttachment: [],
        total: "",
        salesPerson: "",
        calculationSheetMainGroup: [],
        calculationSheetType: "",
      },
      customerName: "",
      qouteID: this.$route.params.quoteID,
      appLink: this.$store.getters.serverURI
        ? this.$store.getters.serverURI
        : "",
      CalSheetId: this.$route.params.CalSheetId,
    };
  },
  mounted() {},

  async created() {
    await this.getCalculationSheetList();
    this.FillQuoteType();
    this.FillUsersList();
    this.FillStageType();

    if (this.qouteID != -1 && !this.CalSheetId) {
      this.fetchPriceQuotationData(this.qouteID);
    }

    if (this.CalSheetId && this.qouteID == -1) {
      this.qouteID = null;
      this.formdata.calculationSheetId = this.CalSheetId;
      this.selectCalculationSheet();
    }
  },
  methods: {
    toUSD(value) {
      if (value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return "0.0";
      }
    },
    selectCalculationSheet() {
      const selectedCalSheet = this.calculationSheetList.find(
        (x) => x.id == this.formdata.calculationSheetId
      );

      this.formdata.calculationSheetType =
        selectedCalSheet.calculationSheetType;
      this.fullscreenLoading = true;

      var urlStr =
        this.$store.getters.serverURI +
        "api/PriceQuotation/CalculationSheet/" +
        this.formdata.calculationSheetId +
        "/" +
        this.formdata.calculationSheetType +
        "/GetSelectedItems";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.fullscreenLoading = false;
            this.formdata.total = parseFloat(
              data.body.bankBlockViewModel.totalAmount
            )
              .toFixed(3)
              .slice(0, -1);
            this.formdata.total = this.toUSD(this.formdata.total);
            this.calculationSheetItem =
              data.body.calculationSheetMainGroupViewModel;

            if (this.formdata.calculationSheetType == 2) {
              //tender

              for (const val of Object.values(this.calculationSheetItem)) {
                val.calculationSheetItem = val.tenderCalculationSheetItem;
                val.calculationSheetOptionalGroupMapper =
                  val.tenderCalculationSheetOptionalGroup;
              }
            } else if (this.formdata.calculationSheetType == 3) {
              //lab
              for (const val of Object.values(this.calculationSheetItem)) {
                val.calculationSheetItem = val.labCalculationSheetItem;
                val.calculationSheetOptionalGroupMapper =
                  val.labCalculationSheetOptionalGroup;
              }
            }

            this.formdata.vatValue =
              data.body.calculationSheetBasicInfoViewModel.vatValue;
            this.formdata.tenderName =
              data.body.calculationSheetBasicInfoViewModel.tenderName;
            this.formdata.tenderNumber =
              data.body.calculationSheetBasicInfoViewModel.tenderNumber;
            this.formdata.tenderType =
              data.body.calculationSheetBasicInfoViewModel.tenderTypeName;
            this.formdata.warranty =
              data.body.calculationSheetBasicInfoViewModel.warranty;
            this.formdata.tenderCurrencyCode =
              data.body.calculationSheetBasicInfoViewModel.tenderCurrencyCode;
            if (data.body.calculationSheetBasicInfoViewModel.validTillDate) {
              this.formdata.PriceValidity = moment(
                data.body.calculationSheetBasicInfoViewModel.validTillDate
              ).format("YYYY-MM-DD");
            } else {
              this.formdata.PriceValidity = "";
            }
            if (data.body.calculationSheetBasicInfoViewModel.submissionDate) {
              this.formdata.date = moment(
                data.body.calculationSheetBasicInfoViewModel.submissionDate
              ).format("YYYY-MM-DD");
            } else {
              this.formdata.date = "";
            }

            this.formdata.customerName =
              data.body.calculationSheetBasicInfoViewModel.mssCustomerName != ""
                ? data.body.calculationSheetBasicInfoViewModel.mssCustomerName
                : data.body.calculationSheetBasicInfoViewModel
                    .nonMssCustomerName;

            this.formdata.calculationSheetMainGroup =
              data.body.calculationSheetMainGroupViewModel;

            this.formdata.quoteNumber = data.body.quoteNumber;

            this.fullscreenLoading = false;
          },
          function (error) {
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
    save: function () {
      this.$validator.validateAll("priceQouteValidation").then((result) => {
        if (result) {
          var urlStr = this.$store.getters.serverURI + "api/PriceQuotation";
          if (this.qouteID) {
            this.formdata.id = this.qouteID;
            this.fullscreenLoading = true;
            this.$http
              .put(urlStr, this.formdata, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj,
              })
              .then(
                (response) => {
                  this.fullscreenLoading = false;
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "success",
                    message: this.$t("PriceQuotationUpdatedSuccessfully"),
                  });
                  this.$router.push({ path: "/priceQuotations/list" });
                },
                function (error) {
                  this.fullscreenLoading = false;
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "error",
                    message: this.$t("ErrorMessage"),
                  });
                }
              );
          } else {
            this.fullscreenLoading = true;
            if (this.qouteID && !this.CalSheetId) {
              formdata.PriceValidity = "";
            }

            this.$http
              .post(urlStr, this.formdata, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj,
              })
              .then(
                (response) => {
                  this.fullscreenLoading = false;
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "success",
                    message: this.$t("PriceQuotationCreatedSuccessfully"),
                  });
                  this.$router.push({ path: "/priceQuotations/list" });
                },
                function (error) {
                  this.fullscreenLoading = false;
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "error",
                    message: this.$t("ErrorMessage"),
                  });
                }
              );
          }
        }
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
              message: this.$t("20MB"),
            });
          }
        }
      }
      // this.resetFileInput();
    },
    createImage(file, fileName) {
      var reader = new FileReader();
      var vm = this;
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        var filebase64 = e.target.result;
        var filebasee64Array = filebase64.split(",");
        vm.formdata.priceQuotationAttachment.push({
          id: 0,
          fileName: fileName,
          priceQuotationId: this.qouteID ? this.qouteID : 0,
          creationDate: "",
          updateDate: "",
          base64FileString: filebasee64Array[1],
        });
      };
    },
    removAttachment(item) {
      this.formdata.priceQuotationAttachment.splice(
        this.formdata.priceQuotationAttachment.indexOf(item),
        1
      );
    },
    downloadAttachment(quid, name) {
      let urlStr =
        this.$store.getters.serverURI +
        "api/PriceQuotation/DownLoadFile/" +
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

    resetFileInput() {
      document.getElementById("fileInputMulti").value = "";
    },
    fetchPriceQuotationData(priceQuoteID) {
      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI + "api/PriceQuotation/" + priceQuoteID;
      var vm = this;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            if (data.body) {
              this.formdata.subject = data.body.subject;
              this.formdata.calculationSheetId = data.body.calculationSheetId;
              this.formdata.quoteNumber = data.body.quoteNumber;
              this.formdata.stageId = data.body.stageId;
              this.formdata.customerPhone = data.body.customerPhone;
              this.formdata.customerFax = data.body.customerFax;
              this.formdata.customerAddress = data.body.customerAddress;

              this.formdata.contactName = data.body.contactName;
              this.formdata.contactPhone = data.body.contactPhone;
              this.formdata.contactEmail = data.body.contactEmail;
              this.formdata.salesPerson = data.body.salesPerson;

              this.formdata.priceQuotationAttachment =
                data.body.priceQuotationAttachment;

              this.formdata.paymentTerms = data.body.paymentTerms;
              this.formdata.deliveryTerms = data.body.deliveryTerms;
              this.formdata.calculationSheetMainGroup =
                data.body.calculationSheetMainGroup;
              this.formdata.calculationSheetType =
                data.body.calculationSheetType;

              if (!this.CalSheetId) {
                this.selectCalculationSheet();
              }
            }
          },
          function (error) {
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
    async getCalculationSheetList(query = "") {
      var urlStr = "";
      if (this.qouteID && this.qouteID != -1) {
        urlStr =
          this.$store.getters.serverURI +
          "api/CalculationSheet/GetCalculationSheetsThatHasNoPriceQuotation?priceQuotationId=" +
          this.qouteID;
      } else {
        urlStr =
          this.$store.getters.serverURI +
          "api/CalculationSheet/GetCalculationSheetsThatHasNoPriceQuotation?priceQuotationId=0";
      }
      await this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.calculationSheetList = data.body;
          },
          function (error) {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage"),
            });
          }
        );
    },
    FillQuoteType: function () {
      var urlStr =
        this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.priceQouteType;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.quoteList = data.body;
          },
          function (error) {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage"),
            });
          }
        );
    },
    FillUsersList: function () {
      var urlStr = this.$store.getters.serverURI + "api/User/GetAll";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.usersList = data.body;
          },
          function (error) {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage"),
            });
          }
        );
    },
    FillStageType: function () {
      var urlStr =
        this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.stageType;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.stagelist = data.body;
            this.stagelist.forEach((element) => {
              if (element.id == 29 && !this.qouteID) {
                this.formdata.stageId = 29;
              }
            });
          },
          function (error) {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("ErrorMessage"),
            });
          }
        );
    },
  },
  watch: {
    formdata: {
      handler(val) {},
      deep: true,
    },
  },
};
</script>
