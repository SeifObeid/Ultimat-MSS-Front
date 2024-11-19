<template>
  <div>
    <b-card
      class="card card-accent-primary"
      no-body
      v-loading.fullscreen.lock="fullscreenLoading"
    >
      <div slot="header">
        {{ $t("BasicInformation") }}
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
          <form class="form-horizontal">
            <div class="row">
              <div class="col-md-3">
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
                    autocomplete="off"
                    disabled
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group">
                  <label class="col-form-label">{{
                    $t("Currency(Multiply)")
                  }}</label>
                  <input
                    type="text"
                    name="tenderCurrencyCode"
                    class="form-control"
                    v-model="BasicInfoObj.tenderCurrencyCode"
                    autocomplete="off"
                    disabled
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div
                  class="form-group"
                  :class="{
                    'has-error': errors.has('vatValue') || VAT > 100 || VAT < 0,
                  }"
                >
                  <label class="col-form-label">VAT value (%)</label>
                  <input
                    v-if="BasicInfoObj.isVat"
                    type="number"
                    @change="
                      reBuildItems();
                      getTotalAmountTotalGrossMarginTotalGrossMarginValue();
                    "
                    min="0"
                    max="100"
                    name="vatValue"
                    class="form-control"
                    v-model="VAT"
                    v-validate="BasicInfoObj.isVat ? 'required' : ''"
                    :data-vv-as="$t('VatValue')"
                    autocomplete="off"
                  />
                  <div
                    class="help-block"
                    v-if="
                      errors.has('vatValue') &&
                      BasicInfoObj.isVat &&
                      errors.items[0].rule == 'decimal'
                    "
                  >
                    {{ $t("vatValidation") }}
                  </div>
                  <div class="help-block" v-if="VAT > 100 || VAT < 0">
                    {{ $t("vatValidation") }}
                  </div>
                  <input
                    v-if="!BasicInfoObj.isVat"
                    disabled
                    type="text"
                    value="0"
                    name="vatValue1"
                    class="form-control"
                    autocomplete="off"
                  />
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group">
                  <label class="col-form-label">{{
                    $t("SubmissionDate")
                  }}</label>
                  <input
                    type="text"
                    name="BasicInfoObj.submissionDate"
                    class="form-control"
                    v-model="BasicInfoObj.submissionDate"
                    autocomplete="off"
                    disabled
                  />
                </div>
              </div>
            </div>
          </form>
        </b-card-body>
      </b-collapse>
    </b-card>
    <b-card class="card card-accent-primary" no-body>
      <div slot="header">
        {{ $t("CalculationSheetGroups") }}
        <div class="card-header-actions"></div>
      </div>
      <b-collapse id="collapse1" visible>
        <b-card-body>
          <b-row>
            <b-col lg="12">
              <button
                @click="ShowExcelSheetDialog()"
                class="pull-right btn btn-secondary mt-1 mb-2"
                variant="secondary"
              >
                <i class="fa fa-file-excel-o"></i>
                {{ $t("ImportFromExcelSheet") }}
              </button>
              <button
                class="btn csubmit pull-right mr-1 mt-1 mb-2"
                variant="primary"
                @click="Excel()"
              >
                <i class="fa fa-file-excel-o"></i>
                Export excel
              </button>
              <el-button
                @click="ShowDialogToFetchItemFromMainConfigs()"
                class="btn btn-secondary mt-1 mb-2"
                >{{ $t("BuildTenderCalculationSheetItem") }}</el-button
              >
              <el-button
                @click="addNewGroup()"
                class="btn btn-secondary mt-1 mb-2"
                v-if="tenderCalculationSheetGroups.length == 0"
              >
                <i class="fa fa-plus"></i> {{ $t("newGroup") }}
              </el-button>
            </b-col>
          </b-row>
          <b-row
            v-for="(CalcGroup, index) in tenderCalculationSheetGroups"
            :key="index"
          >
            <b-col lg="12" class="parent-card">
              <b-card class="card card-accent-primary" no-body>
                <div slot="header">
                  <div class="row">
                    <a
                      href="javascript:void(0)"
                      class="text-success"
                      @click="showDuplicateGroupDialog(index)"
                      style="margin-left: 20px; margin-top: 10px"
                    >
                      <i class="fa fa-copy"></i>
                    </a>
                    <label
                      for="inputEmail3"
                      class="col-sm-1 col-md-1 col-xl-1 col-form-label"
                      >{{ $t("Item") }}-{{ index + 1 }}</label
                    >
                    <div class="row col-md-10 col-lg-10 col-xl-10">
                      <div class="col-md-3 col-lg-3 col-xl-3">
                        <div class="form-group">
                          <label class="col-form-label">{{ $t("name") }}</label>
                          <input
                            type="text"
                            class="form-control"
                            id="inputEmail3"
                            v-model="CalcGroup.name"
                            autocomplete="off"
                            :maxlength="$store.getters.getMaxLength.length200"
                          />
                        </div>
                      </div>
                      <div class="col-md-3 col-lg-3 col-xl-3">
                        <div class="form-group">
                          <label class="col-form-label">{{
                            $t("TenderItemNumber")
                          }}</label>
                          <input
                            type="text"
                            class="form-control"
                            id="inputEmail4"
                            v-model="CalcGroup.number"
                            autocomplete="off"
                            :maxlength="$store.getters.getMaxLength.length30"
                          />
                        </div>
                      </div>
                      <div class="col-md-3 col-lg-3 col-xl-3">
                        <div class="form-group">
                          <label class="col-form-label">{{
                            $t("DeliveryTerms")
                          }}</label>
                          <input
                            class="form-control"
                            id="inputEmail3"
                            v-model="CalcGroup.deliveryTerms"
                            autocomplete="off"
                            :maxlength="$store.getters.getMaxLength.length30"
                          />
                        </div>
                      </div>
                      <div class="col-md-3 col-lg-3 col-xl-3">
                        <div class="form-group">
                          <label class="col-form-label">{{
                            $t("Warranty")
                          }}</label>
                          <input
                            min="1"
                            class="form-control"
                            id="inputEmail4"
                            v-model="CalcGroup.warranty"
                            autocomplete="off"
                            :maxlength="$store.getters.getMaxLength.length30"
                            :disabled="BasicInfoObj.warrantyForAllGroups"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="pabsolute">
                      <div class="card-header-actions">
                        <b-link
                          class="card-header-action btn-minimize"
                          v-b-toggle="'mainItem-' + index"
                        >
                          <span class="when-opened">
                            <i class="icon-arrow-up"></i>
                          </span>
                          <span class="when-closed">
                            <i class="icon-arrow-down"></i>
                          </span>
                        </b-link>
                        <b-link
                          class="card-header-action"
                          @click="removeSingleGroup(index)"
                        >
                          <i class="fa fa-close"></i>
                        </b-link>
                      </div>
                    </div>
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
                        <el-table-column label width="50" fixed>
                          <template slot="header" slot-scope="scope">
                            <button
                              @click="
                                deleteSelectedForCalcuationSheetMainItems(index)
                              "
                              style="
                                background-color: red;
                                color: white;
                                padding: 5px 10px;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                              "
                            >
                              <i class="fa fa-trash"></i>
                            </button>
                          </template>

                          <template slot-scope="scope">
                            <input
                              type="checkbox"
                              v-model="scope.row.selected"
                              :key="'mainItem-' + scope.row.id"
                              :id="'mainItemCheckbox' + scope.$index"
                              :name="'mainItemCheckbox' + scope.$index"
                              style="
                                margin-left: 4px;
                                margin-top: 10px;
                                width: 23px;
                                height: 17px;
                              "
                            />
                          </template>
                        </el-table-column>
                        <el-table-column label width="20" fixed>
                          <template slot-scope="scope">
                            <a
                              class="text-danger"
                              @mousedown="
                                removeCalcuationSheetMainItems(index, scope.row)
                              "
                            >
                              <i class="fa fa-trash"></i>
                            </a>
                          </template>
                        </el-table-column>
                        <el-table-column
                          type="index"
                          width="40"
                          fixed
                        ></el-table-column>
                        <el-table-column
                          prop="Name"
                          label="Item Code"
                          width="180"
                          fixed
                        >
                          <template slot-scope="scope">
                            <b-row>
                              <b-col class="pr-0">
                                <el-select
                                  remote
                                  reserve-keyword
                                  :remote-method="remoteMethodItemsCode"
                                  :loading="loadingAccount"
                                  v-model="scope.row.code"
                                  filterable
                                  size="mini"
                                  class="full-width padding-3"
                                  @change="getItemCodeName(scope.row)"
                                >
                                  <el-option
                                    v-for="item in systemItemsList"
                                    :key="item.id"
                                    :label="item.code"
                                    :value="item.code"
                                  ></el-option>
                                </el-select>
                              </b-col>
                              <b-col md="2" class="pl-2">
                                <el-tooltip
                                  class="box-item"
                                  effect="dark"
                                  content="Copy item code"
                                  placement="top-start"
                                >
                                  <a
                                    href="javascript:void(0)"
                                    class="text-success"
                                    @click="copyItemCode(scope.row.code)"
                                  >
                                    <i class="fa fa-copy"></i>
                                  </a>
                                </el-tooltip>
                              </b-col>
                            </b-row>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="Name"
                          label="MSS Name"
                          width="280"
                          fixed
                        >
                          <template slot-scope="scope">
                            <b-row>
                              <b-col class="pr-0">
                                <el-select
                                  remote
                                  reserve-keyword
                                  :remote-method="remoteMethodItemsName"
                                  :loading="loadingAccount"
                                  v-model="scope.row.name"
                                  filterable
                                  size="mini"
                                  class="full-width padding-3"
                                  @change="getItemCodeNameByName(scope.row)"
                                >
                                  <el-option
                                    v-for="item in systemItemsList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.name"
                                  ></el-option>
                                </el-select>
                              </b-col>
                              <b-col md="2" class="pl-2">
                                <el-tooltip
                                  class="box-item"
                                  effect="dark"
                                  content="Copy item name"
                                  placement="top-start"
                                >
                                  <a
                                    href="javascript:void(0)"
                                    class="text-success"
                                    @click="copyItemCode(scope.row.name)"
                                  >
                                    <i class="fa fa-copy"></i>
                                  </a>
                                </el-tooltip>
                              </b-col>
                            </b-row>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="vendor"
                          label="Company"
                          width="180"
                        >
                          <template slot-scope="scope">
                            <el-input
                              readonly
                              v-model="scope.row.vendor"
                              disabled
                              size="mini"
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="costType"
                          label="Cost type "
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-select
                              v-model="scope.row.costType"
                              clearable
                              filterable
                              name="costType"
                              class="full-width padding-3"
                              size="mini"
                            >
                              <el-option
                                v-for="option in costTypeList"
                                :value="option.id"
                                :label="option.name"
                                :key="option.id"
                              ></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="onHandPrice"
                          label="OH price"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.onHandPrice"
                              size="mini"
                              disabled
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="onHandQuantity"
                          label="OH Qty"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.onHandQuantity"
                              size="mini"
                              disabled
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="Cost" label="Cost" width="120">
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.cost"
                              @change="calculatorMainItemChange(scope.row)"
                              size="mini"
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="currencyCode"
                          label="Currency"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-select
                              remote
                              :remote-method="remoteMethodCurrency"
                              :loading="loadingAccount"
                              v-model="scope.row.currencyCode"
                              clearable
                              filterable
                              class="full-width padding-3"
                              @change="
                                currencyChanged(scope.row);
                                calculatorMainItemChange(scope.row);
                              "
                              size="mini"
                            >
                              <el-option
                                v-for="option in currenciesList"
                                :value="option.code"
                                :label="option.code"
                                :key="option.code"
                              ></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="sign" label=" " width="70">
                          <template slot-scope="scope">
                            <el-input
                              :value="scope.row.currencySymbol"
                              size="mini"
                              disabled
                              autocomplete="off"
                              class="font-lg"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="tenderUnit"
                          label="Tender Unit"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-select
                              @change="handleTeenderUnitChange(scope.row)"
                              :loading="loadingAccount"
                              v-model="scope.row.tenderUnitM"
                              clearable
                              filterable
                              class="full-width padding-3"
                              size="mini"
                            >
                              <el-option
                                v-for="option in tenderUnitMList"
                                :value="option.value"
                                :label="option.name"
                                :key="option.value"
                              ></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="tenderUnitValue"
                          label="Tender Unit Value"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.tenderUnitValue"
                              :disabled="scope.row.tenderUnitM !== 0"
                              @change="calculatorMainItemChange(scope.row)"
                              size="mini"
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="msS_Unit"
                          label="MSS Unit"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-select
                              @change="handleMSSUnitChange(scope.row)"
                              :loading="loadingAccount"
                              v-model="scope.row.msS_Unit"
                              clearable
                              filterable
                              class="full-width padding-3"
                              size="mini"
                            >
                              <el-option
                                v-for="option in mssUnitList"
                                :value="option.value"
                                :label="option.name"
                                :key="option.value"
                              ></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="mssUnitValue"
                          label="MSS Unit Value"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.mssUnitValue"
                              :disabled="scope.row.msS_Unit != '0'"
                              @change="calculatorMainItemChange(scope.row)"
                              size="mini"
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="TenderQuantity"
                          label="Tender Quantity"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.tenderQuantity"
                              @change="calculatorMainItemChange(scope.row)"
                              size="mini"
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="msS_Quantity"
                          label="MSS Quantity"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.msS_Quantity"
                              disabled
                              size="mini"
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="shipment"
                          label="S&C%"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              @input="handleDecimal(scope.row)"
                              @change="
                                calculatorShipmentMarginItemChange(scope.row)
                              "
                              v-model="scope.row.shipment"
                              size="mini"
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="landedCostInSelectedCurrency"
                          label="Landed cost in selected currency"
                          width="210"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.landedCostInSelectedCurrency"
                              size="mini"
                              disabled
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="sign" label=" " width="70">
                          <template slot-scope="scope">
                            <el-input
                              :value="scope.row.currencySymbol"
                              size="mini"
                              disabled
                              autocomplete="off"
                              class="font-lg"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="landedCost"
                          label="Landed cost"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.landedCost"
                              size="mini"
                              disabled
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="sign" label=" " width="70">
                          <template slot-scope="">
                            <el-input
                              :value="calculationSheetCurrencySymbol"
                              size="mini"
                              disabled
                              autocomplete="off"
                              class="font-lg"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="totalLandedCost"
                          label="Total landed cost"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.totalLandedCost"
                              size="mini"
                              disabled
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="sign" label=" " width="70">
                          <template slot-scope="">
                            <el-input
                              :value="calculationSheetCurrencySymbol"
                              size="mini"
                              disabled
                              autocomplete="off"
                              class="font-lg"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="totalLandedCostInSelectedCurrency"
                          label="Total landed cost in selected currency"
                          width="130"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="
                                scope.row.totalLandedCostInSelectedCurrency
                              "
                              size="mini"
                              disabled
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="sign" label=" " width="70">
                          <template slot-scope="scope">
                            <el-input
                              :value="scope.row.currencySymbol"
                              size="mini"
                              disabled
                              autocomplete="off"
                              class="font-lg"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="grossMargin"
                          label="GM%"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              disabled
                              v-model="scope.row.grossMargin"
                              size="mini"
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="quotationSupplier_WithOut_Vat"
                          label="Quotation P./Supplier (without VAT)"
                          width="150"
                        >
                          <template slot-scope="scope">
                            <el-input
                              disabled
                              @change="
                                calculatorShipmentMarginItemChange(scope.row)
                              "
                              v-model="scope.row.quotationSupplier_WithOut_Vat"
                              size="mini"
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="sign" label=" " width="70">
                          <template slot-scope="">
                            <el-input
                              :value="calculationSheetCurrencySymbol"
                              size="mini"
                              disabled
                              autocomplete="off"
                              class="font-lg"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="quotationSupplier_With_Vat"
                          label="Quotation P./Supplier (with VAT)"
                          width="150"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.quotationSupplier_With_Vat"
                              size="mini"
                              disabled
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="sign" label=" " width="70">
                          <template slot-scope="">
                            <el-input
                              :value="calculationSheetCurrencySymbol"
                              size="mini"
                              disabled
                              autocomplete="off"
                              class="font-lg"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="finalUnitPrice"
                          label="Final unit price"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              @change="
                                calculatorShipmentMarginItemChange(scope.row)
                              "
                              v-model="scope.row.finalUnitPrice"
                              size="mini"
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="sign" label=" " width="70">
                          <template>
                            <el-input
                              :value="calculationSheetCurrencySymbol"
                              size="mini"
                              disabled
                              autocomplete="off"
                              class="font-lg"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="totalQuotationPrice"
                          label="Total amount"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.totalQuotationPrice"
                              disabled
                              size="mini"
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="sign" label=" " width="70">
                          <template>
                            <el-input
                              :value="calculationSheetCurrencySymbol"
                              size="mini"
                              disabled
                              autocomplete="off"
                              class="font-lg"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="Gross margin"
                          label="Gross margin"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              @change="calculatorMainItemChange(scope.row)"
                              v-model="scope.row.grossMarginValue"
                              disabled
                              size="mini"
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="sign" label=" " width="70">
                          <template>
                            <el-input
                              :value="calculationSheetCurrencySymbol"
                              size="mini"
                              disabled
                              autocomplete="off"
                              class="font-lg"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="note" label="Note" width="120">
                          <template slot-scope="scope">
                            <el-input
                              autocomplete="off"
                              v-model="scope.row.note"
                              size="mini"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    <b-row class="mt-1">
                      <b-col lg="4">
                        <el-button
                          v-if="
                            CalcGroup.labCalculationSheetAlternativeGroup
                              .length > 0
                          "
                          @click="addNewMainSheetItem(index)"
                          class="btn btn-secondary mt-2 mb-2"
                        >
                          <span class="fa fa-plus"></span>
                          {{ $t("Item") }}
                        </el-button>
                        <el-button
                          @click="addNewMainSheetItem(index)"
                          v-if="
                            !CalcGroup.labCalculationSheetAlternativeGroup
                              .length > 0
                          "
                          class="btn btn-secondary"
                        >
                          <span class="fa fa-plus"></span>
                          {{ $t("Item") }}
                        </el-button>

                        <el-button
                          @click="addNewAlternativeGroup(index)"
                          class="btn btn-secondary"
                        >
                          <span class="fa fa-plus"></span>
                          {{ $t("addalternative") }}
                        </el-button>

                        <el-button
                          @click="
                            ShowDialogToFetchAlternativeItemFromMainConfigs(
                              index
                            )
                          "
                          class="btn btn-secondary mt-1 mb-1 build-btn"
                          >{{
                            $t("BuildCalculationSheetForAlternative")
                          }}</el-button
                        >
                        <el-button
                          @click="addNewOptionalGroup(index)"
                          v-if="!CalcGroup.labCalculationSheetOptionalGroup"
                          class="btn btn-secondary mt-1"
                        >
                          <span class="fa fa-plus"></span>
                          {{ $t("addoptional") }}
                        </el-button>

                        <b-row
                          class="mt-1"
                          v-if="
                            CalcGroup.labCalculationSheetOptionalGroup &&
                            CalcGroup.labCalculationSheetOptionalGroup
                              .labCalculationSheetItem.length >= 0
                          "
                        >
                          <b-col lg="5">
                            <el-button
                              @click="addNewOptionalItem(index)"
                              class="btn btn-secondary mt-2 mb-1"
                            >
                              <span class="fa fa-plus"></span>
                              {{ $t("Item") }}
                            </el-button>
                          </b-col>
                        </b-row>
                      </b-col>
                      <b-col lg="2"
                        >{{
                          $t("totalIn", {
                            currency: tenderCalculationSheetCode,
                          })
                        }}
                        {{ CalcGroup.groupTotalQuotationPrice | toUSD }}
                        <strong>{{ tenderCalculationSheetCode }}</strong>
                      </b-col>
                      <b-col lg="2">
                        {{
                          $t("totalInCurrencyWithoutVat", {
                            currency: tenderCalculationSheetCode,
                          })
                        }}
                        {{ CalcGroup.groupTotal_WO_VAT | toUSD }}
                        <strong>{{ tenderCalculationSheetCode }}</strong>
                      </b-col>
                      <b-col lg="2">
                        {{ $t("margin%") }}
                        {{ CalcGroup.totalMargin | toUSD }} %</b-col
                      >
                      <b-col lg="2"
                        >{{
                          $t("grossMargin", {
                            currency: tenderCalculationSheetCode,
                          })
                        }}
                        {{ CalcGroup.totalGrossMarginValue | toUSD }}
                        <strong>{{ tenderCalculationSheetCode }}</strong>
                      </b-col>
                    </b-row>

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
                          <b-link
                            class="card-header-action btn-minimize"
                            @click="removeSingleOptionalGroup(index)"
                          >
                            <i class="fa fa-close"></i>
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
                            <el-table-column label width="50" fixed>
                              <template slot="header" slot-scope="scope">
                                <button
                                  @click="
                                    deleteSelectedForCalcuationSheetOptionalGroupItems(
                                      index
                                    )
                                  "
                                  style="
                                    background-color: red;
                                    color: white;
                                    padding: 5px 10px;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                  "
                                >
                                  <i class="fa fa-trash"></i>
                                </button>
                              </template>

                              <template slot-scope="scope">
                                <input
                                  type="checkbox"
                                  v-model="scope.row.selected"
                                  :key="'ItemoptionalGroup-' + scope.row.id"
                                  :id="
                                    'ItemoptionalGroupCheckbox' + scope.$index
                                  "
                                  :name="
                                    'ItemoptionalGroupCheckbox' + scope.$index
                                  "
                                  style="
                                    margin-left: 4px;
                                    margin-top: 10px;
                                    width: 23px;
                                    height: 17px;
                                  "
                                />
                              </template>
                            </el-table-column>

                            <el-table-column label width="20" fixed>
                              <template slot-scope="scope">
                                <a
                                  class="text-danger"
                                  @mousedown="
                                    removeOptionalItem(index, scope.row)
                                  "
                                >
                                  <i class="fa fa-trash"></i>
                                </a>
                              </template>
                            </el-table-column>
                            <el-table-column
                              type="index"
                              width="40"
                              fixed
                            ></el-table-column>
                            <el-table-column
                              prop="Name"
                              label="Item Code"
                              width="180"
                              fixed
                            >
                              <template slot-scope="scope">
                                <b-row>
                                  <b-col class="pr-0">
                                    <el-select
                                      remote
                                      reserve-keyword
                                      :remote-method="remoteMethodItemsCode"
                                      :loading="loadingAccount"
                                      v-model="scope.row.code"
                                      filterable
                                      size="mini"
                                      class="full-width padding-3"
                                      @change="getItemCodeName(scope.row)"
                                    >
                                      <el-option
                                        v-for="item in systemItemsList"
                                        :key="item.id"
                                        :label="item.code"
                                        :value="item.code"
                                      ></el-option>
                                    </el-select>
                                  </b-col>
                                  <b-col md="2" class="pl-2">
                                    <el-tooltip
                                      class="box-item"
                                      effect="dark"
                                      content="Copy item code"
                                      placement="top-start"
                                    >
                                      <a
                                        href="javascript:void(0)"
                                        class="text-success"
                                        @click="copyItemCode(scope.row.code)"
                                      >
                                        <i class="fa fa-copy"></i>
                                      </a>
                                    </el-tooltip>
                                  </b-col>
                                </b-row>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="Name"
                              label="MSS Name"
                              width="280"
                              fixed
                            >
                              <template slot-scope="scope">
                                <b-row>
                                  <b-col class="pr-0">
                                    <el-select
                                      remote
                                      reserve-keyword
                                      :remote-method="remoteMethodItemsName"
                                      :loading="loadingAccount"
                                      v-model="scope.row.name"
                                      filterable
                                      size="mini"
                                      class="full-width padding-3"
                                      @change="getItemCodeNameByName(scope.row)"
                                    >
                                      <el-option
                                        v-for="item in systemItemsList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.name"
                                      ></el-option>
                                    </el-select>
                                  </b-col>
                                  <b-col md="2" class="pl-2">
                                    <el-tooltip
                                      class="box-item"
                                      effect="dark"
                                      content="Copy item name"
                                      placement="top-start"
                                    >
                                      <a
                                        href="javascript:void(0)"
                                        class="text-success"
                                        @click="copyItemCode(scope.row.name)"
                                      >
                                        <i class="fa fa-copy"></i>
                                      </a>
                                    </el-tooltip>
                                  </b-col>
                                </b-row>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="vendor"
                              label="Company"
                              width="180"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  readonly
                                  v-model="scope.row.vendor"
                                  disabled
                                  size="mini"
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="costType"
                              label="Cost type "
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-select
                                  v-model="scope.row.costType"
                                  clearable
                                  filterable
                                  name="costType"
                                  class="full-width padding-3"
                                  size="mini"
                                >
                                  <el-option
                                    v-for="option in costTypeList"
                                    :value="option.id"
                                    :label="option.name"
                                    :key="option.id"
                                  ></el-option>
                                </el-select>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="onHandPrice"
                              label="OH price"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.onHandPrice"
                                  size="mini"
                                  disabled
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="onHandQuantity"
                              label="OH Qty"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.onHandQuantity"
                                  size="mini"
                                  disabled
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="Cost"
                              label="Cost"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.cost"
                                  @change="calculatorMainItemChange(scope.row)"
                                  size="mini"
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="currencyCode"
                              label="Currency"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-select
                                  remote
                                  :remote-method="remoteMethodCurrency"
                                  :loading="loadingAccount"
                                  v-model="scope.row.currencyCode"
                                  clearable
                                  filterable
                                  class="full-width padding-3"
                                  @change="
                                    currencyChanged(scope.row);
                                    calculatorMainItemChange(scope.row);
                                  "
                                  size="mini"
                                >
                                  <el-option
                                    v-for="option in currenciesList"
                                    :value="option.code"
                                    :label="option.code"
                                    :key="option.code"
                                  ></el-option>
                                </el-select>
                              </template>
                            </el-table-column>
                            <el-table-column prop="sign" label=" " width="70">
                              <template slot-scope="scope">
                                <el-input
                                  :value="scope.row.currencySymbol"
                                  size="mini"
                                  disabled
                                  autocomplete="off"
                                  class="font-lg"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="tenderUnit"
                              label="Tender Unit"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-select
                                  @change="handleTeenderUnitChange(scope.row)"
                                  :loading="loadingAccount"
                                  v-model="scope.row.tenderUnitM"
                                  clearable
                                  filterable
                                  class="full-width padding-3"
                                  size="mini"
                                >
                                  <el-option
                                    v-for="option in tenderUnitMList"
                                    :value="option.value"
                                    :label="option.name"
                                    :key="option.value"
                                  ></el-option>
                                </el-select>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="tenderUnitValue"
                              label="Tender Unit Value"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.tenderUnitValue"
                                  :disabled="scope.row.tenderUnitM !== 0"
                                  @change="calculatorMainItemChange(scope.row)"
                                  size="mini"
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="msS_Unit"
                              label="MSS Unit"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-select
                                  @change="handleMSSUnitChange(scope.row)"
                                  :loading="loadingAccount"
                                  v-model="scope.row.msS_Unit"
                                  clearable
                                  filterable
                                  class="full-width padding-3"
                                  size="mini"
                                >
                                  <el-option
                                    v-for="option in mssUnitList"
                                    :value="option.value"
                                    :label="option.name"
                                    :key="option.value"
                                  ></el-option>
                                </el-select>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="mssUnitValue"
                              label="MSS Unit Value"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.mssUnitValue"
                                  :disabled="scope.row.msS_Unit != '0'"
                                  @change="calculatorMainItemChange(scope.row)"
                                  size="mini"
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="TenderQuantity"
                              label="Tender Quantity"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.tenderQuantity"
                                  @change="calculatorMainItemChange(scope.row)"
                                  size="mini"
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="msS_Quantity"
                              label="MSS Quantity"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.msS_Quantity"
                                  disabled
                                  size="mini"
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="shipment"
                              label="S&C%"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  @input="handleDecimal(scope.row)"
                                  @change="
                                    calculatorShipmentMarginItemChange(
                                      scope.row
                                    )
                                  "
                                  v-model="scope.row.shipment"
                                  size="mini"
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="landedCostInSelectedCurrency"
                              label="Landed cost in selected currency"
                              width="210"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="
                                    scope.row.landedCostInSelectedCurrency
                                  "
                                  size="mini"
                                  disabled
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column prop="sign" label=" " width="70">
                              <template slot-scope="scope">
                                <el-input
                                  :value="scope.row.currencySymbol"
                                  size="mini"
                                  disabled
                                  autocomplete="off"
                                  class="font-lg"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="landedCost"
                              label="Landed cost"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.landedCost"
                                  size="mini"
                                  disabled
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column prop="sign" label=" " width="70">
                              <template slot-scope="">
                                <el-input
                                  :value="calculationSheetCurrencySymbol"
                                  size="mini"
                                  disabled
                                  autocomplete="off"
                                  class="font-lg"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="totalLandedCost"
                              label="Total landed cost"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.totalLandedCost"
                                  size="mini"
                                  disabled
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column prop="sign" label=" " width="70">
                              <template slot-scope="">
                                <el-input
                                  :value="calculationSheetCurrencySymbol"
                                  size="mini"
                                  disabled
                                  autocomplete="off"
                                  class="font-lg"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="totalLandedCostInSelectedCurrency"
                              label="Total landed cost in selected currency"
                              width="130"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="
                                    scope.row.totalLandedCostInSelectedCurrency
                                  "
                                  size="mini"
                                  disabled
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column prop="sign" label=" " width="70">
                              <template slot-scope="scope">
                                <el-input
                                  :value="scope.row.currencySymbol"
                                  size="mini"
                                  disabled
                                  autocomplete="off"
                                  class="font-lg"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="grossMargin"
                              label="GM%"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  disabled
                                  v-model="scope.row.grossMargin"
                                  size="mini"
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="quotationSupplier_WithOut_Vat"
                              label="Quotation P./Supplier (without VAT)"
                              width="150"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  disabled
                                  @change="
                                    calculatorShipmentMarginItemChange(
                                      scope.row
                                    )
                                  "
                                  v-model="
                                    scope.row.quotationSupplier_WithOut_Vat
                                  "
                                  size="mini"
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column prop="sign" label=" " width="70">
                              <template slot-scope="">
                                <el-input
                                  :value="calculationSheetCurrencySymbol"
                                  size="mini"
                                  disabled
                                  autocomplete="off"
                                  class="font-lg"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="quotationSupplier_With_Vat"
                              label="Quotation P./Supplier (with VAT)"
                              width="150"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.quotationSupplier_With_Vat"
                                  size="mini"
                                  disabled
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column prop="sign" label=" " width="70">
                              <template slot-scope="">
                                <el-input
                                  :value="calculationSheetCurrencySymbol"
                                  size="mini"
                                  disabled
                                  autocomplete="off"
                                  class="font-lg"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="finalUnitPrice"
                              label="Final unit price"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  @change="
                                    calculatorShipmentMarginItemChange(
                                      scope.row
                                    )
                                  "
                                  v-model="scope.row.finalUnitPrice"
                                  size="mini"
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column prop="sign" label=" " width="70">
                              <template>
                                <el-input
                                  :value="calculationSheetCurrencySymbol"
                                  size="mini"
                                  disabled
                                  autocomplete="off"
                                  class="font-lg"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="totalQuotationPrice"
                              label="Total amount"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.totalQuotationPrice"
                                  disabled
                                  size="mini"
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column prop="sign" label=" " width="70">
                              <template>
                                <el-input
                                  :value="calculationSheetCurrencySymbol"
                                  size="mini"
                                  disabled
                                  autocomplete="off"
                                  class="font-lg"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="Gross margin"
                              label="Gross margin"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  @change="calculatorMainItemChange(scope.row)"
                                  v-model="scope.row.grossMarginValue"
                                  disabled
                                  size="mini"
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column prop="sign" label=" " width="70">
                              <template>
                                <el-input
                                  :value="calculationSheetCurrencySymbol"
                                  size="mini"
                                  disabled
                                  autocomplete="off"
                                  class="font-lg"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="note"
                              label="Note"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  autocomplete="off"
                                  v-model="scope.row.note"
                                  size="mini"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                        <b-row class="mt-1">
                          <b-col lg="4"> </b-col>
                          <!-- seif options -->
                          <b-col lg="2"
                            >{{
                              $t("totalIn", {
                                currency: tenderCalculationSheetCode,
                              })
                            }}
                            {{
                              CalcGroup.labCalculationSheetOptionalGroup
                                .groupTotalQuotationPrice | toUSD
                            }}
                            <strong>{{ tenderCalculationSheetCode }}</strong>
                          </b-col>
                          <b-col lg="2">
                            {{
                              $t("totalInCurrencyWithoutVat", {
                                currency: tenderCalculationSheetCode,
                              })
                            }}
                            {{
                              CalcGroup.labCalculationSheetOptionalGroup
                                .groupTotal_WO_VAT | toUSD
                            }}
                            <strong>{{ tenderCalculationSheetCode }}</strong>
                          </b-col>
                          <b-col lg="2"
                            >{{ $t("margin%") }}
                            {{
                              CalcGroup.labCalculationSheetOptionalGroup
                                .totalMargin | toUSD
                            }}
                            %</b-col
                          >
                          <b-col lg="2"
                            >{{
                              $t("grossMargin", {
                                currency: tenderCalculationSheetCode,
                              })
                            }}
                            {{
                              CalcGroup.labCalculationSheetOptionalGroup
                                .totalGrossMarginValue | toUSD
                            }}
                            <strong>{{ tenderCalculationSheetCode }}</strong>
                          </b-col>
                        </b-row>
                      </b-collapse>
                    </b-card>
                    <b-card
                      class="card card-accent-primary"
                      no-body
                      v-for="(
                        alternativeGroup, alternativeGroupIndex
                      ) in CalcGroup.labCalculationSheetAlternativeGroup"
                      :key="alternativeGroupIndex"
                    >
                      <div slot="header">
                        <div class="row">
                          <label
                            for="inputEmail3"
                            class="col-sm-2 col-form-label"
                            >{{ $t("AlternativeGroup") }}
                            {{ alternativeGroupIndex + 1 }}
                          </label>
                          <label for="inputEmail3" class="col-form-label">{{
                            $t("name")
                          }}</label>
                          <div class="col-sm-3">
                            <input
                              type="text"
                              class="form-control"
                              id="inputEmail3"
                              v-model="alternativeGroup.name"
                              autocomplete="off"
                              :maxlength="$store.getters.getMaxLength.length30"
                            />
                          </div>
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
                              <b-link
                                class="card-header-action btn-minimize"
                                @click="
                                  removeSingleAlternativeGroup(
                                    index,
                                    alternativeGroupIndex
                                  )
                                "
                              >
                                <i class="fa fa-close"></i>
                              </b-link>
                            </div>
                          </div>
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
                              <el-table-column label width="50" fixed>
                                <template slot="header" slot-scope="scope">
                                  <button
                                    @click="
                                      deleteSelectedForCalcuationSheetAlternativeItem(
                                        index,
                                        alternativeGroupIndex
                                      )
                                    "
                                    style="
                                      background-color: red;
                                      color: white;
                                      padding: 5px 10px;
                                      border: none;
                                      border-radius: 4px;
                                      cursor: pointer;
                                    "
                                  >
                                    <i class="fa fa-trash"></i>
                                  </button>
                                </template>

                                <template slot-scope="scope">
                                  <input
                                    type="checkbox"
                                    v-model="scope.row.selected"
                                    :key="'alternativeGroup-' + scope.row.id"
                                    :id="
                                      'alternativeGroupCheckbox' + scope.$index
                                    "
                                    :name="
                                      'alternativeGroupCheckbox' + scope.$index
                                    "
                                    style="
                                      margin-left: 4px;
                                      margin-top: 10px;
                                      width: 23px;
                                      height: 17px;
                                    "
                                  />
                                </template>
                              </el-table-column>
                              <el-table-column label width="20" fixed>
                                <template slot-scope="scope">
                                  <a
                                    class="text-danger"
                                    @mousedown="
                                      removeAlternativeItem(
                                        index,
                                        alternativeGroupIndex,
                                        scope.row
                                      )
                                    "
                                  >
                                    <i class="fa fa-trash"></i>
                                  </a>
                                </template>
                              </el-table-column>
                              <el-table-column
                                type="index"
                                width="40"
                                fixed
                              ></el-table-column>
                              <el-table-column
                                prop="Name"
                                label="Item Code"
                                width="180"
                                fixed
                              >
                                <template slot-scope="scope">
                                  <b-row>
                                    <b-col class="pr-0">
                                      <el-select
                                        remote
                                        reserve-keyword
                                        :remote-method="remoteMethodItemsCode"
                                        :loading="loadingAccount"
                                        v-model="scope.row.code"
                                        filterable
                                        size="mini"
                                        class="full-width padding-3"
                                        @change="getItemCodeName(scope.row)"
                                      >
                                        <el-option
                                          v-for="item in systemItemsList"
                                          :key="item.id"
                                          :label="item.code"
                                          :value="item.code"
                                        ></el-option>
                                      </el-select>
                                    </b-col>
                                    <b-col md="2" class="pl-2">
                                      <el-tooltip
                                        class="box-item"
                                        effect="dark"
                                        content="Copy item code"
                                        placement="top-start"
                                      >
                                        <a
                                          href="javascript:void(0)"
                                          class="text-success"
                                          @click="copyItemCode(scope.row.code)"
                                        >
                                          <i class="fa fa-copy"></i>
                                        </a>
                                      </el-tooltip>
                                    </b-col>
                                  </b-row>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="Name"
                                label="MSS Name"
                                width="280"
                                fixed
                              >
                                <template slot-scope="scope">
                                  <b-row>
                                    <b-col class="pr-0">
                                      <el-select
                                        remote
                                        reserve-keyword
                                        :remote-method="remoteMethodItemsName"
                                        :loading="loadingAccount"
                                        v-model="scope.row.name"
                                        filterable
                                        size="mini"
                                        class="full-width padding-3"
                                        @change="
                                          getItemCodeNameByName(scope.row)
                                        "
                                      >
                                        <el-option
                                          v-for="item in systemItemsList"
                                          :key="item.id"
                                          :label="item.name"
                                          :value="item.name"
                                        ></el-option>
                                      </el-select>
                                    </b-col>
                                    <b-col md="2" class="pl-2">
                                      <el-tooltip
                                        class="box-item"
                                        effect="dark"
                                        content="Copy item name"
                                        placement="top-start"
                                      >
                                        <a
                                          href="javascript:void(0)"
                                          class="text-success"
                                          @click="copyItemCode(scope.row.name)"
                                        >
                                          <i class="fa fa-copy"></i>
                                        </a>
                                      </el-tooltip>
                                    </b-col>
                                  </b-row>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="vendor"
                                label="Company"
                                width="180"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    readonly
                                    v-model="scope.row.vendor"
                                    disabled
                                    size="mini"
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="costType"
                                label="Cost type "
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-select
                                    v-model="scope.row.costType"
                                    clearable
                                    filterable
                                    name="costType"
                                    class="full-width padding-3"
                                    size="mini"
                                  >
                                    <el-option
                                      v-for="option in costTypeList"
                                      :value="option.id"
                                      :label="option.name"
                                      :key="option.id"
                                    ></el-option>
                                  </el-select>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="onHandPrice"
                                label="OH price"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.onHandPrice"
                                    size="mini"
                                    disabled
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="onHandQuantity"
                                label="OH Qty"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.onHandQuantity"
                                    size="mini"
                                    disabled
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="Cost"
                                label="Cost"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.cost"
                                    @change="
                                      calculatorMainItemChange(scope.row)
                                    "
                                    size="mini"
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="currencyCode"
                                label="Currency"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-select
                                    remote
                                    :remote-method="remoteMethodCurrency"
                                    :loading="loadingAccount"
                                    v-model="scope.row.currencyCode"
                                    clearable
                                    filterable
                                    class="full-width padding-3"
                                    @change="
                                      currencyChanged(scope.row);
                                      calculatorMainItemChange(scope.row);
                                    "
                                    size="mini"
                                  >
                                    <el-option
                                      v-for="option in currenciesList"
                                      :value="option.code"
                                      :label="option.code"
                                      :key="option.code"
                                    ></el-option>
                                  </el-select>
                                </template>
                              </el-table-column>
                              <el-table-column prop="sign" label=" " width="70">
                                <template slot-scope="scope">
                                  <el-input
                                    :value="scope.row.currencySymbol"
                                    size="mini"
                                    disabled
                                    autocomplete="off"
                                    class="font-lg"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="tenderUnit"
                                label="Tender Unit"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-select
                                    @change="handleTeenderUnitChange(scope.row)"
                                    :loading="loadingAccount"
                                    v-model="scope.row.tenderUnitM"
                                    clearable
                                    filterable
                                    class="full-width padding-3"
                                    size="mini"
                                  >
                                    <el-option
                                      v-for="option in tenderUnitMList"
                                      :value="option.value"
                                      :label="option.name"
                                      :key="option.value"
                                    ></el-option>
                                  </el-select>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="tenderUnitValue"
                                label="Tender Unit Value"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.tenderUnitValue"
                                    :disabled="scope.row.tenderUnitM !== 0"
                                    @change="
                                      calculatorMainItemChange(scope.row)
                                    "
                                    size="mini"
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="msS_Unit"
                                label="MSS Unit"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-select
                                    @change="handleMSSUnitChange(scope.row)"
                                    :loading="loadingAccount"
                                    v-model="scope.row.msS_Unit"
                                    clearable
                                    filterable
                                    class="full-width padding-3"
                                    size="mini"
                                  >
                                    <el-option
                                      v-for="option in mssUnitList"
                                      :value="option.value"
                                      :label="option.name"
                                      :key="option.value"
                                    ></el-option>
                                  </el-select>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="mssUnitValue"
                                label="MSS Unit Value"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.mssUnitValue"
                                    :disabled="scope.row.msS_Unit != '0'"
                                    @change="
                                      calculatorMainItemChange(scope.row)
                                    "
                                    size="mini"
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="TenderQuantity"
                                label="Tender Quantity"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.tenderQuantity"
                                    @change="
                                      calculatorMainItemChange(scope.row)
                                    "
                                    size="mini"
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="msS_Quantity"
                                label="MSS Quantity"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.msS_Quantity"
                                    disabled
                                    size="mini"
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="shipment"
                                label="S&C%"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    @input="handleDecimal(scope.row)"
                                    @change="
                                      calculatorShipmentMarginItemChange(
                                        scope.row
                                      )
                                    "
                                    v-model="scope.row.shipment"
                                    size="mini"
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="landedCostInSelectedCurrency"
                                label="Landed cost in selected currency"
                                width="210"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="
                                      scope.row.landedCostInSelectedCurrency
                                    "
                                    size="mini"
                                    disabled
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="sign" label=" " width="70">
                                <template slot-scope="scope">
                                  <el-input
                                    :value="scope.row.currencySymbol"
                                    size="mini"
                                    disabled
                                    autocomplete="off"
                                    class="font-lg"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="landedCost"
                                label="Landed cost"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.landedCost"
                                    size="mini"
                                    disabled
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="sign" label=" " width="70">
                                <template slot-scope="">
                                  <el-input
                                    :value="calculationSheetCurrencySymbol"
                                    size="mini"
                                    disabled
                                    autocomplete="off"
                                    class="font-lg"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="totalLandedCost"
                                label="Total landed cost"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.totalLandedCost"
                                    size="mini"
                                    disabled
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="sign" label=" " width="70">
                                <template slot-scope="">
                                  <el-input
                                    :value="calculationSheetCurrencySymbol"
                                    size="mini"
                                    disabled
                                    autocomplete="off"
                                    class="font-lg"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="totalLandedCostInSelectedCurrency"
                                label="Total landed cost in selected currency"
                                width="130"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="
                                      scope.row
                                        .totalLandedCostInSelectedCurrency
                                    "
                                    size="mini"
                                    disabled
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="sign" label=" " width="70">
                                <template slot-scope="scope">
                                  <el-input
                                    :value="scope.row.currencySymbol"
                                    size="mini"
                                    disabled
                                    autocomplete="off"
                                    class="font-lg"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="grossMargin"
                                label="GM%"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    disabled
                                    v-model="scope.row.grossMargin"
                                    size="mini"
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="quotationSupplier_WithOut_Vat"
                                label="Quotation P./Supplier (without VAT)"
                                width="150"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    disabled
                                    @change="
                                      calculatorShipmentMarginItemChange(
                                        scope.row
                                      )
                                    "
                                    v-model="
                                      scope.row.quotationSupplier_WithOut_Vat
                                    "
                                    size="mini"
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="sign" label=" " width="70">
                                <template slot-scope="">
                                  <el-input
                                    :value="calculationSheetCurrencySymbol"
                                    size="mini"
                                    disabled
                                    autocomplete="off"
                                    class="font-lg"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="quotationSupplier_With_Vat"
                                label="Quotation P./Supplier (with VAT)"
                                width="150"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="
                                      scope.row.quotationSupplier_With_Vat
                                    "
                                    size="mini"
                                    disabled
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="sign" label=" " width="70">
                                <template slot-scope="">
                                  <el-input
                                    :value="calculationSheetCurrencySymbol"
                                    size="mini"
                                    disabled
                                    autocomplete="off"
                                    class="font-lg"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="finalUnitPrice"
                                label="Final unit price"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    @change="
                                      calculatorShipmentMarginItemChange(
                                        scope.row
                                      )
                                    "
                                    v-model="scope.row.finalUnitPrice"
                                    size="mini"
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="sign" label=" " width="70">
                                <template>
                                  <el-input
                                    :value="calculationSheetCurrencySymbol"
                                    size="mini"
                                    disabled
                                    autocomplete="off"
                                    class="font-lg"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="totalQuotationPrice"
                                label="Total amount"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.totalQuotationPrice"
                                    disabled
                                    size="mini"
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="sign" label=" " width="70">
                                <template>
                                  <el-input
                                    :value="calculationSheetCurrencySymbol"
                                    size="mini"
                                    disabled
                                    autocomplete="off"
                                    class="font-lg"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="Gross margin"
                                label="Gross margin"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    @change="
                                      calculatorMainItemChange(scope.row)
                                    "
                                    v-model="scope.row.grossMarginValue"
                                    disabled
                                    size="mini"
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="sign" label=" " width="70">
                                <template>
                                  <el-input
                                    :value="calculationSheetCurrencySymbol"
                                    size="mini"
                                    disabled
                                    autocomplete="off"
                                    class="font-lg"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="note"
                                label="Note"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    autocomplete="off"
                                    v-model="scope.row.note"
                                    size="mini"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                            </el-table>
                          </div>
                          <b-row class="mt-1">
                            <b-col lg="4">
                              <el-button
                                @click="
                                  addNewAternativeItem(
                                    index,
                                    alternativeGroupIndex
                                  )
                                "
                                class="btn btn-secondary mt-2 mb-1"
                              >
                                <span class="fa fa-plus"></span>
                                {{ $t("Item") }}
                              </el-button>
                            </b-col>
                            <b-col lg="2"
                              >{{
                                $t("totalIn", {
                                  currency: tenderCalculationSheetCode,
                                })
                              }}
                              {{
                                alternativeGroup.groupTotalQuotationPrice
                                  | toUSD
                              }}
                              <strong>{{ tenderCalculationSheetCode }}</strong>
                            </b-col>
                            <b-col lg="2">
                              {{
                                $t("totalInCurrencyWithoutVat", {
                                  currency: tenderCalculationSheetCode,
                                })
                              }}
                              {{ alternativeGroup.groupTotal_WO_VAT | toUSD }}
                              <strong>{{ tenderCalculationSheetCode }}</strong>
                            </b-col>
                            <b-col lg="2"
                              >{{ $t("margin%") }}
                              {{ alternativeGroup.totalMargin | toUSD }}
                              %</b-col
                            >
                            <b-col lg="2"
                              >{{
                                $t("grossMargin", {
                                  currency: tenderCalculationSheetCode,
                                })
                              }}
                              {{
                                alternativeGroup.totalGrossMarginValue | toUSD
                              }}
                              <strong>{{ tenderCalculationSheetCode }}</strong>
                            </b-col>
                          </b-row>
                          <el-button
                            @click="
                              addNewAternativeOptionalGroup(
                                index,
                                alternativeGroupIndex
                              )
                            "
                            v-if="
                              !alternativeGroup.labCalculationSheetAlternativeOptionalGroup
                            "
                            class="btn btn-secondary"
                          >
                            <span class="fa fa-plus"></span>
                            {{ $t("addoptional") }}
                          </el-button>
                          <b-card
                            class="card card-accent-primary mt-3"
                            v-if="
                              alternativeGroup.labCalculationSheetAlternativeOptionalGroup !=
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
                                <b-link
                                  class="card-header-action btn-minimize"
                                  @click="
                                    removeSingleAlternativeOptionalGroup(
                                      index,
                                      alternativeGroupIndex
                                    )
                                  "
                                >
                                  <i class="fa fa-close"></i>
                                </b-link>
                              </div>
                            </div>
                            <b-collapse :id="'optionalGroup-' + index" visible>
                              <div class="table-responsive-lg table-responsive">
                                <el-table
                                  class="table-sm table-responsive custom-table"
                                  :data="
                                    alternativeGroup
                                      .labCalculationSheetAlternativeOptionalGroup
                                      .labCalculationSheetItem
                                  "
                                  size="mini"
                                  style="width: 100%"
                                >
                                  <el-table-column label width="50" fixed>
                                    <template slot="header" slot-scope="scope">
                                      <button
                                        @click="
                                          deleteSelectedForCalcuationSheetAlternativeOptionalItem(
                                            index,
                                            alternativeGroupIndex
                                          )
                                        "
                                        style="
                                          background-color: red;
                                          color: white;
                                          padding: 5px 10px;
                                          border: none;
                                          border-radius: 4px;
                                          cursor: pointer;
                                        "
                                      >
                                        <i class="fa fa-trash"></i>
                                      </button>
                                    </template>

                                    <template slot-scope="scope">
                                      <input
                                        type="checkbox"
                                        v-model="scope.row.selected"
                                        :key="'optionalGroup-' + scope.row.id"
                                        :id="
                                          'optionalGroupCheckbox' + scope.$index
                                        "
                                        :name="
                                          'optionalGroupCheckbox' + scope.$index
                                        "
                                        style="
                                          margin-left: 4px;
                                          margin-top: 10px;
                                          width: 23px;
                                          height: 17px;
                                        "
                                      />
                                    </template>
                                  </el-table-column>

                                  <el-table-column label width="20" fixed>
                                    <template slot-scope="scope">
                                      <a
                                        class="text-danger"
                                        @mousedown="
                                          removeAlternativeOptionalItem(
                                            index,
                                            alternativeGroupIndex,
                                            scope.row
                                          )
                                        "
                                      >
                                        <i class="fa fa-trash"></i>
                                      </a>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    type="index"
                                    width="40"
                                    fixed
                                  ></el-table-column>
                                  <el-table-column
                                    prop="Name"
                                    label="Item Code"
                                    width="180"
                                    fixed
                                  >
                                    <template slot-scope="scope">
                                      <b-row>
                                        <b-col class="pr-0">
                                          <el-select
                                            remote
                                            reserve-keyword
                                            :remote-method="
                                              remoteMethodItemsCode
                                            "
                                            :loading="loadingAccount"
                                            v-model="scope.row.code"
                                            filterable
                                            size="mini"
                                            class="full-width padding-3"
                                            @change="getItemCodeName(scope.row)"
                                          >
                                            <el-option
                                              v-for="item in systemItemsList"
                                              :key="item.id"
                                              :label="item.code"
                                              :value="item.code"
                                            ></el-option>
                                          </el-select>
                                        </b-col>
                                        <b-col md="2" class="pl-2">
                                          <el-tooltip
                                            class="box-item"
                                            effect="dark"
                                            content="Copy item code"
                                            placement="top-start"
                                          >
                                            <a
                                              href="javascript:void(0)"
                                              class="text-success"
                                              @click="
                                                copyItemCode(scope.row.code)
                                              "
                                            >
                                              <i class="fa fa-copy"></i>
                                            </a>
                                          </el-tooltip>
                                        </b-col>
                                      </b-row>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="Name"
                                    label="MSS Name"
                                    width="280"
                                    fixed
                                  >
                                    <template slot-scope="scope">
                                      <b-row>
                                        <b-col class="pr-0">
                                          <el-select
                                            remote
                                            reserve-keyword
                                            :remote-method="
                                              remoteMethodItemsName
                                            "
                                            :loading="loadingAccount"
                                            v-model="scope.row.name"
                                            filterable
                                            size="mini"
                                            class="full-width padding-3"
                                            @change="
                                              getItemCodeNameByName(scope.row)
                                            "
                                          >
                                            <el-option
                                              v-for="item in systemItemsList"
                                              :key="item.id"
                                              :label="item.name"
                                              :value="item.name"
                                            ></el-option>
                                          </el-select>
                                        </b-col>
                                        <b-col md="2" class="pl-2">
                                          <el-tooltip
                                            class="box-item"
                                            effect="dark"
                                            content="Copy item name"
                                            placement="top-start"
                                          >
                                            <a
                                              href="javascript:void(0)"
                                              class="text-success"
                                              @click="
                                                copyItemCode(scope.row.name)
                                              "
                                            >
                                              <i class="fa fa-copy"></i>
                                            </a>
                                          </el-tooltip>
                                        </b-col>
                                      </b-row>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="vendor"
                                    label="Company"
                                    width="180"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        readonly
                                        v-model="scope.row.vendor"
                                        disabled
                                        size="mini"
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="costType"
                                    label="Cost type "
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-select
                                        v-model="scope.row.costType"
                                        clearable
                                        filterable
                                        name="costType"
                                        class="full-width padding-3"
                                        size="mini"
                                      >
                                        <el-option
                                          v-for="option in costTypeList"
                                          :value="option.id"
                                          :label="option.name"
                                          :key="option.id"
                                        ></el-option>
                                      </el-select>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="onHandPrice"
                                    label="OH price"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="scope.row.onHandPrice"
                                        size="mini"
                                        disabled
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="onHandQuantity"
                                    label="OH Qty"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="scope.row.onHandQuantity"
                                        size="mini"
                                        disabled
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="Cost"
                                    label="Cost"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="scope.row.cost"
                                        @change="
                                          calculatorMainItemChange(scope.row)
                                        "
                                        size="mini"
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="currencyCode"
                                    label="Currency"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-select
                                        remote
                                        :remote-method="remoteMethodCurrency"
                                        :loading="loadingAccount"
                                        v-model="scope.row.currencyCode"
                                        clearable
                                        filterable
                                        class="full-width padding-3"
                                        @change="
                                          currencyChanged(scope.row);
                                          calculatorMainItemChange(scope.row);
                                        "
                                        size="mini"
                                      >
                                        <el-option
                                          v-for="option in currenciesList"
                                          :value="option.code"
                                          :label="option.code"
                                          :key="option.code"
                                        ></el-option>
                                      </el-select>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="sign"
                                    label=" "
                                    width="70"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        :value="scope.row.currencySymbol"
                                        size="mini"
                                        disabled
                                        autocomplete="off"
                                        class="font-lg"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="tenderUnit"
                                    label="Tender Unit"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-select
                                        @change="
                                          handleTeenderUnitChange(scope.row)
                                        "
                                        :loading="loadingAccount"
                                        v-model="scope.row.tenderUnitM"
                                        clearable
                                        filterable
                                        class="full-width padding-3"
                                        size="mini"
                                      >
                                        <el-option
                                          v-for="option in tenderUnitMList"
                                          :value="option.value"
                                          :label="option.name"
                                          :key="option.value"
                                        ></el-option>
                                      </el-select>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="tenderUnitValue"
                                    label="Tender Unit Value"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="scope.row.tenderUnitValue"
                                        :disabled="scope.row.tenderUnitM !== 0"
                                        @change="
                                          calculatorMainItemChange(scope.row)
                                        "
                                        size="mini"
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="msS_Unit"
                                    label="MSS Unit"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-select
                                        @change="handleMSSUnitChange(scope.row)"
                                        :loading="loadingAccount"
                                        v-model="scope.row.msS_Unit"
                                        clearable
                                        filterable
                                        class="full-width padding-3"
                                        size="mini"
                                      >
                                        <el-option
                                          v-for="option in mssUnitList"
                                          :value="option.value"
                                          :label="option.name"
                                          :key="option.value"
                                        ></el-option>
                                      </el-select>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="mssUnitValue"
                                    label="MSS Unit Value"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="scope.row.mssUnitValue"
                                        :disabled="scope.row.msS_Unit != '0'"
                                        @change="
                                          calculatorMainItemChange(scope.row)
                                        "
                                        size="mini"
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="TenderQuantity"
                                    label="Tender Quantity"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="scope.row.tenderQuantity"
                                        @change="
                                          calculatorMainItemChange(scope.row)
                                        "
                                        size="mini"
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="msS_Quantity"
                                    label="MSS Quantity"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="scope.row.msS_Quantity"
                                        disabled
                                        size="mini"
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="shipment"
                                    label="S&C%"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        @input="handleDecimal(scope.row)"
                                        @change="
                                          calculatorShipmentMarginItemChange(
                                            scope.row
                                          )
                                        "
                                        v-model="scope.row.shipment"
                                        size="mini"
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="landedCostInSelectedCurrency"
                                    label="Landed cost in selected currency"
                                    width="210"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="
                                          scope.row.landedCostInSelectedCurrency
                                        "
                                        size="mini"
                                        disabled
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="sign"
                                    label=" "
                                    width="70"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        :value="scope.row.currencySymbol"
                                        size="mini"
                                        disabled
                                        autocomplete="off"
                                        class="font-lg"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="landedCost"
                                    label="Landed cost"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="scope.row.landedCost"
                                        size="mini"
                                        disabled
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="sign"
                                    label=" "
                                    width="70"
                                  >
                                    <template slot-scope="">
                                      <el-input
                                        :value="calculationSheetCurrencySymbol"
                                        size="mini"
                                        disabled
                                        autocomplete="off"
                                        class="font-lg"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="totalLandedCost"
                                    label="Total landed cost"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="scope.row.totalLandedCost"
                                        size="mini"
                                        disabled
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="sign"
                                    label=" "
                                    width="70"
                                  >
                                    <template slot-scope="">
                                      <el-input
                                        :value="calculationSheetCurrencySymbol"
                                        size="mini"
                                        disabled
                                        autocomplete="off"
                                        class="font-lg"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="totalLandedCostInSelectedCurrency"
                                    label="Total landed cost in selected currency"
                                    width="130"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="
                                          scope.row
                                            .totalLandedCostInSelectedCurrency
                                        "
                                        size="mini"
                                        disabled
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="sign"
                                    label=" "
                                    width="70"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        :value="scope.row.currencySymbol"
                                        size="mini"
                                        disabled
                                        autocomplete="off"
                                        class="font-lg"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="grossMargin"
                                    label="GM%"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        disabled
                                        v-model="scope.row.grossMargin"
                                        size="mini"
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="quotationSupplier_WithOut_Vat"
                                    label="Quotation P./Supplier (without VAT)"
                                    width="150"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        disabled
                                        @change="
                                          calculatorShipmentMarginItemChange(
                                            scope.row
                                          )
                                        "
                                        v-model="
                                          scope.row
                                            .quotationSupplier_WithOut_Vat
                                        "
                                        size="mini"
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="sign"
                                    label=" "
                                    width="70"
                                  >
                                    <template slot-scope="">
                                      <el-input
                                        :value="calculationSheetCurrencySymbol"
                                        size="mini"
                                        disabled
                                        autocomplete="off"
                                        class="font-lg"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="quotationSupplier_With_Vat"
                                    label="Quotation P./Supplier (with VAT)"
                                    width="150"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="
                                          scope.row.quotationSupplier_With_Vat
                                        "
                                        size="mini"
                                        disabled
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="sign"
                                    label=" "
                                    width="70"
                                  >
                                    <template slot-scope="">
                                      <el-input
                                        :value="calculationSheetCurrencySymbol"
                                        size="mini"
                                        disabled
                                        autocomplete="off"
                                        class="font-lg"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="finalUnitPrice"
                                    label="Final unit price"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        @change="
                                          calculatorShipmentMarginItemChange(
                                            scope.row
                                          )
                                        "
                                        v-model="scope.row.finalUnitPrice"
                                        size="mini"
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="sign"
                                    label=" "
                                    width="70"
                                  >
                                    <template>
                                      <el-input
                                        :value="calculationSheetCurrencySymbol"
                                        size="mini"
                                        disabled
                                        autocomplete="off"
                                        class="font-lg"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="totalQuotationPrice"
                                    label="Total amount"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="scope.row.totalQuotationPrice"
                                        disabled
                                        size="mini"
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="sign"
                                    label=" "
                                    width="70"
                                  >
                                    <template>
                                      <el-input
                                        :value="calculationSheetCurrencySymbol"
                                        size="mini"
                                        disabled
                                        autocomplete="off"
                                        class="font-lg"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="Gross margin"
                                    label="Gross margin"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        @change="
                                          calculatorMainItemChange(scope.row)
                                        "
                                        v-model="scope.row.grossMarginValue"
                                        disabled
                                        size="mini"
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="sign"
                                    label=" "
                                    width="70"
                                  >
                                    <template>
                                      <el-input
                                        :value="calculationSheetCurrencySymbol"
                                        size="mini"
                                        disabled
                                        autocomplete="off"
                                        class="font-lg"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="note"
                                    label="Note"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        autocomplete="off"
                                        v-model="scope.row.note"
                                        size="mini"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                </el-table>
                              </div>
                              <b-row class="mt-1">
                                <b-col lg="4">
                                  <el-button
                                    @click="
                                      addNewAlternativeOptionalItem(
                                        index,
                                        alternativeGroupIndex
                                      )
                                    "
                                    class="btn btn-secondary mt-2 mb-1"
                                  >
                                    <span class="fa fa-plus"></span>
                                    {{ $t("Item") }}
                                  </el-button>
                                </b-col>
                                <b-col lg="2"
                                  >{{
                                    $t("totalIn", {
                                      currency: tenderCalculationSheetCode,
                                    })
                                  }}
                                  {{
                                    alternativeGroup
                                      .labCalculationSheetAlternativeOptionalGroup
                                      .groupTotalQuotationPrice | toUSD
                                  }}
                                  {{ tenderCalculationSheetCode }}
                                </b-col>
                                <b-col lg="2">
                                  {{
                                    $t("totalInCurrencyWithoutVat", {
                                      currency: tenderCalculationSheetCode,
                                    })
                                  }}
                                  {{
                                    alternativeGroup
                                      .labCalculationSheetAlternativeOptionalGroup
                                      .groupTotal_WO_VAT | toUSD
                                  }}
                                  <strong>{{
                                    tenderCalculationSheetCode
                                  }}</strong>
                                </b-col>
                                <b-col lg="2"
                                  >{{ $t("margin%") }}
                                  {{
                                    alternativeGroup
                                      .labCalculationSheetAlternativeOptionalGroup
                                      .totalMargin | toUSD
                                  }}
                                  %</b-col
                                >
                                <b-col lg="2"
                                  >{{
                                    $t("grossMargin", {
                                      currency: tenderCalculationSheetCode,
                                    })
                                  }}
                                  {{
                                    alternativeGroup
                                      .labCalculationSheetAlternativeOptionalGroup
                                      .totalGrossMarginValue | toUSD
                                  }}
                                  <strong>{{
                                    tenderCalculationSheetCode
                                  }}</strong>
                                </b-col>
                              </b-row>
                            </b-collapse>
                          </b-card>
                        </b-card-body>
                      </b-collapse>
                    </b-card>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="12" style="padding-bottom: 10px">
              <el-button
                @click="addNewGroup()"
                class="btn btn-secondary"
                v-if="tenderCalculationSheetGroups.length > 0"
              >
                <i class="fa fa-plus"></i>
                {{ $t("newGroup") }}
              </el-button>
            </b-col>
          </b-row>
          <div class="mt-2">
            <h6>{{ $t("BankInformation") }}</h6>
            <div class="mb-3" style="border: 1px solid rgb(192, 211, 230)">
              <div class="row mt-2 mr-1 ml-1">
                <div class="row col-12">
                  <div class="col-md-2">
                    <div>{{ $t("BankGuarantee") }}</div>
                    <div>
                      <el-select
                        class="input-custom"
                        v-model="bankBlockViewModel.bankGuaranteeType"
                        :placeholder="$t('Select')"
                        :disabled="bankGuaranteeDisabled"
                        name="bankGuarantee"
                        data-vv-scope="EventCreationValidation"
                        clearable
                        filterable
                        @change="
                          bankBlockViewModel.currencyCode = '';
                          getTotalAmountTotalGrossMarginTotalGrossMarginValue();
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
                        type="text"
                        :disabled="bankGuaranteeDisabled"
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
                        remote
                        :remote-method="remoteMethodCurrency"
                        :loading="loadingAccount"
                        :disabled="
                          bankGuaranteeDisabled ||
                          bankBlockViewModel.bankGuaranteeType == true
                        "
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
                  <div class="col-md-2">
                    <div>{{ $t("BankGuaranteeValidTill") }}</div>
                    <div>
                      <input
                        type="number"
                        :disabled="bankGuaranteeDisabled"
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
                        :disabled="bankGuaranteeDisabled"
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
                        :disabled="bankGuaranteeDisabled"
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
              <div class="row mb-2 mt-4 mr-1 ml-1">
                <div class="col-md-3">
                  <div>
                    {{
                      $t("totalIn", { currency: tenderCalculationSheetCode })
                    }}
                  </div>
                  <div>
                    <label>
                      {{
                        bankBlockViewModel.total_Quotation_Price_With_VAT
                          | toUSD
                      }}
                      <strong>{{ tenderCalculationSheetCode }}</strong>
                    </label>
                  </div>
                </div>
                <div class="col-md-3">
                  <div>
                    {{
                      $t("totalInCurrencyWithoutVat", {
                        currency: tenderCalculationSheetCode,
                      })
                    }}
                  </div>
                  <div>
                    <label>
                      {{ bankBlockViewModel.total_Quoted_Price_WO_VAT | toUSD }}
                      <strong>{{ tenderCalculationSheetCode }}</strong>
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
                        currency: tenderCalculationSheetCode,
                      })
                    }}
                  </div>
                  <div>
                    <label>
                      {{ bankBlockViewModel.totalGrossMarginValue | toUSD }}
                      <strong>{{ tenderCalculationSheetCode }}</strong>
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
            </div>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>
    <div class="text-center mb-5">
      <button class="btn csubmit" v-on:click="previousStep()">
        <i class="fa fa-angle-left fa-lg"></i>
        {{ $t("Previous") }}
      </button>
      <button
        class="btn csubmit ml-3"
        v-on:click="saveDataAction(false)"
        :disabled="
          BasicInfoObj.status == $store.getters.getSheetStatus.Awarded ||
          BasicInfoObj.status == $store.getters.getSheetStatus.Approved ||
          BasicInfoObj.status ==
            $store.getters.getSheetStatus.Rejected_Closed ||
          (BasicInfoObj.createdBy == loggeduser &&
            BasicInfoObj.status ==
              $store.getters.getSheetStatus.Waiting_for_Approval)
        "
      >
        <i class="fa fa-save"></i>
        {{ $t("Save") }}
      </button>
      <button
        class="btn csubmit ml-3"
        v-on:click="submitCaluctionSheet()"
        variant="primary"
        :disabled="
          calSheetId == '' ||
          BasicInfoObj.status == $store.getters.getSheetStatus.Awarded ||
          BasicInfoObj.status ==
            $store.getters.getSheetStatus.Waiting_for_Approval ||
          BasicInfoObj.status == $store.getters.getSheetStatus.Approved ||
          BasicInfoObj.status == $store.getters.getSheetStatus.Rejected_Closed
        "
      >
        <i class="fa fa-send-o"></i>
        {{ $t("submit") }}
      </button>
      <button
        class="btn csubmit ml-3"
        variant="primary"
        v-for="(
          workflowaction, workflowactionIndex
        ) in workflowStepActionSetting"
        :key="workflowactionIndex"
        @click="workflowAction(workflowaction.id, workflowaction.type)"
        :disabled="isClickWrokflow"
      >
        <i class="fa fa-true"></i>
        {{ workflowaction.name }}
      </button>
    </div>
    <el-dialog
      title="Import excel sheet"
      :visible="ExcelsheetDialog"
      :show-close="false"
      :close-on-press-escape="false"
      :destroy-on-close="false"
    >
      <b-row>
        <b-col sm="12">
          <b-form-group>
            <div class="col-md-12 uplaod-btn">
              <dropzone
                id="importDropzone"
                :useCustomSlot="true"
                :options="dropzoneOptions"
                @vdropzone-files-added="importExcel"
              >
                <i class="cui-cloud-upload icons font-2xl d-block"></i>
                <div>Upload file</div>
              </dropzone>
            </div>
            <div class="mt-2">
              <strong
                >{{ $t("ExcelHint") }}
                <a download :href="excelLink" target="_blank"
                  >download template</a
                ></strong
              >
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cloaeExcelSheetDialog()">{{
          $t("Close")
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Build calculation sheet item dialog"
      :visible="bulidTenderCalculationSheetDialog"
      :show-close="false"
      :close-on-press-escape="false"
      :destroy-on-close="false"
    >
      <b-row>
        <b-col sm="3">
          <b-form-group
            :class="{
              'has-error': errors.has('ItemsGroupValidation.principal'),
            }"
          >
            <label class="col-form-label" sm="4">{{
              $t("PrincipalName")
            }}</label>
            <label class="required">*</label>
            <el-select
              v-on:keyup.enter="getMainConfigByPrincipalCategoryItem()"
              v-model="ItemsGroupObj.principalId"
              name="principal"
              filterable
              clearable
              v-bind:placeholder="$t('Select')"
              v-validate="'required'"
              data-vv-scope="ItemsGroupValidation"
              @change="getAllItemsGroupByPrincipleId(ItemsGroupObj.principalId)"
            >
              <el-option
                v-for="item in principals"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
            <div
              class="help-block"
              v-if="errors.has('ItemsGroupValidation.principal')"
            >
              {{ errors.first("ItemsGroupValidation.principal") }}
            </div>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group>
            <label class="col-form-label" sm="4">{{ $t("Category") }}</label>
            <el-select
              v-model="ItemsGroupObj.category"
              filterable
              clearable
              v-bind:placeholder="$t('Select')"
              v-validate="'required'"
              data-vv-scope="ItemsGroupValidation"
              :disabled="!enableCategory"
              @change="getAllItemsGroupByCategoryId(ItemsGroupObj.category)"
            >
              <el-option
                v-for="item in categories"
                :key="item.category"
                :label="item.category"
                :value="item.category"
              ></el-option>
            </el-select>
            <div
              class="help-block"
              v-if="errors.has('ItemsGroupValidation.category')"
            >
              {{ errors.first("ItemsGroupValidation.category") }}
            </div>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group>
            <label class="col-form-label" sm="4">{{ $t("Model") }}</label>
            <el-select
              v-model="ItemsGroupObj.model"
              filterable
              clearable
              :placeholder="$t('Select')"
              v-validate="'required'"
              :data-vv-as="'model'"
              data-vv-scope="ItemsGroupValidation"
              :disabled="!enableModel"
            >
              <el-option
                v-for="item in models"
                :key="item.model"
                :label="item.model"
                :value="item.model"
              ></el-option>
            </el-select>
            <div
              class="help-block"
              v-if="errors.has('ItemsGroupValidation.model')"
            >
              {{ errors.first("ItemsGroupValidation.model") }}
            </div>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group>
            <label class="col-form-label" sm="4">{{
              $t("tenderReference")
            }}</label>
            <el-select
              v-model="ItemsGroupObj.tenderReference"
              filterable
              clearable
              :placeholder="$t('Select')"
            >
              <el-option
                v-for="item in tenderReferences"
                :key="item.code"
                :label="item.code"
                :value="item.code"
              ></el-option>
            </el-select>
            <div
              class="help-block"
              v-if="errors.has('ItemsGroupValidation.tenderReference')"
            >
              {{ errors.first("ItemsGroupValidation.tenderReference") }}
            </div>
          </b-form-group>
        </b-col>
        <b-col sm="3">
          <b-form-group
            :class="{
              'has-error': errors.has('ItemsGroupValidation.principal'),
            }"
          >
            <el-button
              style="margin-top: 32px"
              type="primary"
              @click="getMainConfigByPrincipalCategoryItem()"
              >{{ $t("Search") }}</el-button
            >
          </b-form-group>
        </b-col>
      </b-row>
      <br />
      <strong v-if="mainConfigItems.length == 0 && isSearch">{{
        $t("NoRecordFound")
      }}</strong>
      <br />
      <b-row>
        <b-col
          sm="4"
          v-for="(mainConfigs, mainConfigsIndex) in mainConfigItems"
          :key="mainConfigsIndex"
        >
          <b-card no-body :header="mainConfigs.groupName" footer-tag="footer">
            <b-list-group flush>
              <b-list-group-item
                v-for="(
                  mainConfig, mainConfigIndex
                ) in mainConfigs.itemGroupMainConfig"
                :key="mainConfigIndex"
              >
                <b-form-checkbox-group stacked v-model="prelist">
                  <b-form-checkbox
                    :value="{
                      itemGroupId: mainConfigs.id,
                      mainConfigId: mainConfig.id,
                    }"
                    >{{ mainConfig.name }}</b-form-checkbox
                  >
                </b-form-checkbox-group>
              </b-list-group-item>
            </b-list-group>
            <b-card-footer>
              <b-list-group-item
                v-if="mainConfigs.itemGroupOptionalItem.length > 0"
                slot="footer"
              >
                <b-form-checkbox-group stacked v-model="optionalList">
                  <b-form-checkbox :value="mainConfigs.id">{{
                    $t("IncludeOptionalItems")
                  }}</b-form-checkbox>
                </b-form-checkbox-group>
              </b-list-group-item>
            </b-card-footer>
          </b-card>
        </b-col>
      </b-row>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="mainConfigItems.length > 0 && isAlternative"
          type="primary"
          @click="extractMainConfigAlternativeGroupItem3()"
          >{{ $t("select") }}</el-button
        >
        <el-button
          v-else-if="mainConfigItems.length > 0"
          type="primary"
          @click="extractMainConfigGroupItem3()"
          >{{ $t("select") }}</el-button
        >
        <el-button @click="closeBuildTenderCalculationSheet()">{{
          $t("Cancel")
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Duplicate group items as"
      :visible="duplicateGroupDialog"
      :show-close="false"
      :close-on-press-escape="false"
      :destroy-on-close="false"
    >
      <b-row>
        <b-col sm="6">
          <b-form-group
            :class="{
              'has-error': errors.has(
                'duplicateGroupValidation.isDuplicateMainGroup'
              ),
            }"
          >
            <label class="col-form-label" sm="6">{{ $t("Category") }}</label>
            <label class="required">*</label>
            <el-select
              v-model="isDuplicateMainGroup"
              name="isDuplicateMainGroup"
              filterable
              clearable
              v-bind:placeholder="$t('Select')"
              v-validate="'required'"
              data-vv-scope="duplicateGroupValidation"
              :data-vv-as="$t('Category')"
            >
              <el-option
                v-for="item in duplicateGroupList"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              ></el-option>
            </el-select>
            <div
              class="help-block"
              v-if="errors.has('duplicateGroupValidation.isDuplicateMainGroup')"
            >
              {{
                errors.first("duplicateGroupValidation.isDuplicateMainGroup")
              }}
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="duplicateGroup()">{{
          $t("select")
        }}</el-button>
        <el-button @click="closeDuplicateGroup()">{{ $t("Cancel") }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cTable from "../Table/Table.vue";
import moment from "moment";
import xlsx from "xlsx";
import axios from "axios";
import dropzone from "vue2-dropzone";

export default {
  props: {
    calSheetId: Number,
    active: Number,
  },
  name: "items",
  data() {
    return {
      duplicateGroupList: [
        {
          key: "Main group",
          value: true,
        },
        {
          key: "Alternative group",
          value: false,
        },
      ],
      duplicateGroupDialog: false,
      groupIndexToDuplicate: null,
      isDuplicateMainGroup: null,
      dropzoneOptions: {
        url: `https://httpbin.org/post`,
        maxFilesize: 102400000,
        paramName: function () {
          return "file[]";
        },
        dictDefaultMessage: "Upload Files Here xD",
        includeStyling: false,
        previewsContainer: false,
        uploadMultiple: true,
        parallelUploads: 20,
      },
      groupsCount: [],
      excelLink: "",
      tenderUnitMList: [
        { value: 1, name: "Single" },
        { value: 1000, name: "TH" },
        { value: -1, name: "MSS_Unit" },
        { value: 10, name: "10" },
        { value: 20, name: "20" },
        { value: 30, name: "30" },
        { value: 40, name: "40" },
        { value: 50, name: "50" },
        { value: 60, name: "60" },
        { value: 70, name: "70" },
        { value: 80, name: "80" },
        { value: 90, name: "90" },
        { value: 100, name: "100" },
        { value: 0, name: "Other" },
      ],
      mssUnitList: [
        { value: "1", name: "Single" },
        { value: "1000", name: "TH" },
        { value: "-1", name: "MSS_Unit" },
        { value: "10", name: "10" },
        { value: "20", name: "20" },
        { value: "30", name: "30" },
        { value: "40", name: "40" },
        { value: "50", name: "50" },
        { value: "60", name: "60" },
        { value: "70", name: "70" },
        { value: "80", name: "80" },
        { value: "90", name: "90" },
        { value: "100", name: "100" },
        { value: "0", name: "Other" },
      ],
      loadingAccount: false,
      fullscreenLoading: false,
      guaranteeTypes: [],
      loggeduser: 0,
      isClickWrokflow: false,
      workflowStepActionSetting: [],
      isSearch: false,
      selected: 0,
      BasicInfoObj: {
        id: "",
        tenderCurrencyCode: "",
        nonMssCustomerName: "",
        submissionDate: "",
        isVat: false,
        vatValue: 16,
        labCalculationSheetCurrencyRate: [],
        mssCustomerName: "",
        status: 1,
        type: 1,
        tenderNumber: "",
        warranty: "",
        warrantyForAllGroups: false,
      },
      totalAmountIndex: null,
      totalAlternativeAmountIndex: null,
      totalOptionalAmountIndex: null,
      guaranteeDeliveryLocations: [],
      bankGuaranteeType: true,
      currentGroupIndex: null,
      loadingFetchdata: false,
      systemItemsList: [],
      optionalList: [],
      prelist: [],
      principals: [],
      categories: [],
      models: [],
      tenderReferences: [],
      enableCategory: false,
      enableModel: false,
      mainConfigItems: [],
      ItemsGroupObj: {
        groupName: "",
        principalId: "",
        category: "",
        model: "",
        tenderReference: "",
      },
      bulidTenderCalculationSheetDialog: false,
      isAlternative: false,
      ExcelsheetDialog: false,
      tenderCalculationSheetGroups: [],
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
      mainGroupPrevCount: null,
      tenderCalculationSheetCode: "",
      isVat: false,
      VAT: "",
      costTypeList: [],
      currenciesList: [],
      labCalculationSheetItem: {
        code: "",
        name: "",
        vendor: "",
        fromERB: null,
        onHandPrice: "",
        onHandPriceCurrency: "",
        onHandPriceCurrencySymbol: "",
        onHandQuantity: "",
        cost: "",
        costType: 14,
        currencyCode: "",
        currencySymbol: "",
        shipment: "0",
        landedCost: "",
        landedCostInSelectedCurrency: "",
        grossMargin: "",
        finalUnitPrice: "0",
        grossMarginValue: "",
        total_WO_VAT: "",
        total_WO_VAT_not_rounded: "",
        note: " ",
        approve: false,
        tenderUnitM: -1,
        tenderUnit: "",
        tenderUnitValue: "",
        msS_Unit: "1",
        mssUnitValue: "",
        tenderQuantity: "",
        msS_Quantity: "",
        totalLandedCost: "",
        totalLandedCostInSelectedCurrency: "",
        quotationSupplier_WithOut_Vat: "",
        quotationSupplier_With_Vat: "",
        totalQuotationPrice: "",
        costTypeCode: 1,
        // not rounded
        totalQuotationPrice_not_rounded: "",
      },
      labCalculationSheetAlternativeGroup: {
        code: "",
        name: "",
        selected: false,
        selectedForPriceQuotation: null,
        totalGrossMarginValue: "",
        totalMargin: "",
        totalLandedCost: "",
        groupTotalQuotationPrice: "",
        groupTotal_WO_VAT: "",
        labCalculationSheetMainGroupId: "",
        labCalculationSheetItem: [],
        labCalculationSheetAlternativeOptionalGroup: null,
        calculationAlternativeAmount: [],
      },
      tenderCalculationSheetGroup: {
        labCalculationSheetId: "",
        code: "",
        name: "",
        number: "",
        deliveryTerms: "",
        warranty: "",
        totalGrossMarginValue: "",
        totalMargin: "",
        totalLandedCost: "",
        groupTotalQuotationPrice: "",
        groupTotal_WO_VAT: "",
        selected: false,
        selectedForPriceQuotation: null,
        labCalculationSheetAlternativeGroup: [],
        labCalculationSheetItem: [],
        labCalculationSheetOptionalGroup: null,
      },
    };
  },
  filters: {
    toUSD(value) {
      if (value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return "0.0";
      }
    },
  },
  computed: {
    bankGuaranteeDisabled() {
      return !(
        this.BasicInfoObj.bankGuaranteeLookup &&
        (this.BasicInfoObj.bankGuaranteeLookup.code == 1 ||
          this.BasicInfoObj.bankGuaranteeLookup.code == 3)
      );
    },
    calculationSheetCurrencySymbol() {
      return this.currenciesList.length && this.tenderCalculationSheetCode
        ? this.currenciesList.find(
            (x) => x.code == this.tenderCalculationSheetCode
          ).currencySymbol
        : "";
    },
  },
  created() {
    this.excelLink =
      this.$store.getters.serverURI +
      "ExcelTemplates/LabCalculationSheetItemsTemplete.xlsx";
    this.getCalculationSheetCurrency("");
    this.loggeduser = this.$store.getters.getUserData.id;
    this.getGuaranteeDeliveryLocationLookups();
    this.getPrincipalNames();
    this.getTenderReferences();
    this.fillGuaranteeType();
    this.FillCostTypeList();
    this.geTtenderCalculationSheetData();
    // if (this.calSheetId) {// should be called after getCalculationSheetData
    //     this.FillData();
    // }
  },
  components: { cTable, dropzone },
  methods: {
    copyItemCode(code) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          this.$message({
            showClose: true,
            duration: this.$store.getters.getMessagesDuration,
            type: "success",
            message: this.$t("Code copied!"),
          });
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            duration: this.$store.getters.getMessagesDuration,
            type: "error",
            message: this.$t("error"),
          });
        });
    },
    showDuplicateGroupDialog(index) {
      this.groupIndexToDuplicate = index;
      this.duplicateGroupDialog = true;
    },
    duplicateGroup() {
      this.$validator.validateAll("duplicateGroupValidation").then((result) => {
        if (result) {
          if (this.isDuplicateMainGroup) {
            var groupToDuplicate = JSON.parse(
              JSON.stringify(
                this.tenderCalculationSheetGroups[this.groupIndexToDuplicate]
              )
            );
            this.tenderCalculationSheetGroups.push(groupToDuplicate);
            this.totalAmountIndex =
              this.tenderCalculationSheetGroups.length - 1;
          } else {
            var mainItemsList = JSON.parse(
                JSON.stringify(
                  this.tenderCalculationSheetGroups[this.groupIndexToDuplicate]
                    .labCalculationSheetItem
                )
              ),
              optionalItems = JSON.parse(
                JSON.stringify(
                  this.tenderCalculationSheetGroups[this.groupIndexToDuplicate]
                    .labCalculationSheetOptionalGroup
                )
              );
            let labCalculationSheetAlternativeGroup = JSON.parse(
              JSON.stringify(this.labCalculationSheetAlternativeGroup)
            );
            labCalculationSheetAlternativeGroup.labCalculationSheetMainGroupId =
              this.tenderCalculationSheetGroups[this.groupIndexToDuplicate].id
                ? this.tenderCalculationSheetGroups[this.groupIndexToDuplicate]
                    .id
                : "";
            labCalculationSheetAlternativeGroup.labCalculationSheetItem =
              mainItemsList;
            labCalculationSheetAlternativeGroup.labCalculationSheetAlternativeOptionalGroup =
              optionalItems;
            this.tenderCalculationSheetGroups[
              this.groupIndexToDuplicate
            ].labCalculationSheetAlternativeGroup.push(
              labCalculationSheetAlternativeGroup
            );
            this.totalAlternativeAmountIndex =
              this.tenderCalculationSheetGroups[this.groupIndexToDuplicate]
                .labCalculationSheetAlternativeGroup.length - 1;
          }
          this.resetDuplicateGroup();
        }
      });
    },
    resetDuplicateGroup() {
      this.$validator.reset();
      this.duplicateGroupDialog = false;
      this.groupIndexToDuplicate = null;
      this.isDuplicateMainGroup = null;
    },
    closeDuplicateGroup() {
      this.duplicateGroupDialog = true;
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("CloseConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Yes"),
        cancelButtonText: this.$t("No"),
        beforeClose: (action, instance, done) => {
          if (action == "confirm") {
            this.resetDuplicateGroup();
            done();
          } else {
            this.duplicateGroupDialog = true;
            done();
          }
        },
      });
    },
    calculateTotal() {
      var vatValue = this.VAT;
      var val = this.tenderCalculationSheetGroups;
      if (val && val.length > 0) {
        val.forEach((element) => {
          var _groupTotalLandedCost = 0.0;
          var _groupTotal_WO_VAT = 0.0;
          var _groupTotalQuotationPrice = 0.0;
          var _totalGrossMarginValue = 0.0;
          element.labCalculationSheetItem.forEach((_element) => {
            if (_element.totalLandedCost != "") {
              _groupTotalLandedCost += parseFloat(_element.totalLandedCost);
            }
            if (_element.grossMarginValue != "") {
              _totalGrossMarginValue += parseFloat(_element.grossMarginValue);
            }
            if (_element.total_WO_VAT != "") {
              _groupTotal_WO_VAT += parseFloat(_element.total_WO_VAT);
            }
            if (_element.totalQuotationPrice != "") {
              _groupTotalQuotationPrice += parseFloat(
                _element.totalQuotationPrice
              );
            }
          });
          // element.groupTotal_WO_VAT = Number.isNaN(_groupTotal_WO_VAT) ? 0.0 : _groupTotal_WO_VAT.toFixed(3)//.slice(0,-1);
          element.groupTotalQuotationPrice = Number.isNaN(
            _groupTotalQuotationPrice
          )
            ? 0.0
            : _groupTotalQuotationPrice.toFixed(3); //.slice(0,-1);
          element.groupTotal_WO_VAT = (
            element.groupTotalQuotationPrice /
            (1 + vatValue / 100)
          ).toFixed(3);
          element.totalLandedCost = Number.isNaN(_groupTotalLandedCost)
            ? 0.0
            : _groupTotalLandedCost.toFixed(3); //.slice(0,-1);
          element.totalMargin =
            Number.isNaN(
              (element.groupTotal_WO_VAT - element.totalLandedCost) /
                element.groupTotal_WO_VAT
            ) || element.groupTotal_WO_VAT == 0
              ? 0.0
              : (
                  ((element.groupTotal_WO_VAT - element.totalLandedCost) /
                    element.groupTotal_WO_VAT) *
                  100
                ).toFixed(3);
          //element.totalGrossMarginValue =  Number.isNaN(_totalGrossMarginValue) ? 0.0 : (_totalGrossMarginValue).toFixed(3);
          element.totalGrossMarginValue = (
            element.groupTotal_WO_VAT - element.totalLandedCost
          ).toFixed(3);

          element.labCalculationSheetAlternativeGroup.forEach(
            (alterElement) => {
              var _AlternativeGroupTotalLandedCost = 0.0;
              var _AlternativeGroupTotal_WO_VAT = 0.0;
              var _AlternativeGroupTotalQuotationPrice = 0.0;
              alterElement.labCalculationSheetItem.forEach((_element) => {
                if (_element.totalLandedCost != "") {
                  _AlternativeGroupTotalLandedCost += parseFloat(
                    _element.totalLandedCost
                  );
                }
                if (_element.total_WO_VAT != "") {
                  _AlternativeGroupTotal_WO_VAT += parseFloat(
                    _element.total_WO_VAT
                  );
                }
                if (_element.totalQuotationPrice != "") {
                  _AlternativeGroupTotalQuotationPrice += parseFloat(
                    _element.totalQuotationPrice
                  );
                }
              });
              //alterElement.groupTotal_WO_VAT = Number.isNaN(_AlternativeGroupTotal_WO_VAT) ? 0.0 : _AlternativeGroupTotal_WO_VAT.toFixed(3)//.slice(0,-1);
              alterElement.groupTotalQuotationPrice = Number.isNaN(
                _AlternativeGroupTotalQuotationPrice
              )
                ? 0.0
                : _AlternativeGroupTotalQuotationPrice.toFixed(3); //.slice(0,-1);
              alterElement.groupTotal_WO_VAT = (
                alterElement.groupTotalQuotationPrice /
                (1 + vatValue / 100)
              ).toFixed(3);

              alterElement.totalLandedCost = Number.isNaN(
                _AlternativeGroupTotalLandedCost
              )
                ? 0.0
                : _AlternativeGroupTotalLandedCost.toFixed(3); //.slice(0,-1);
              alterElement.totalMargin =
                Number.isNaN(
                  (alterElement.groupTotal_WO_VAT -
                    alterElement.totalLandedCost) /
                    alterElement.groupTotal_WO_VAT
                ) || alterElement.groupTotal_WO_VAT == 0
                  ? 0.0
                  : (
                      ((alterElement.groupTotal_WO_VAT -
                        alterElement.totalLandedCost) /
                        alterElement.groupTotal_WO_VAT) *
                      100
                    ).toFixed(3); //.slice(0,-1);
              alterElement.totalGrossMarginValue = Number.isNaN(
                alterElement.groupTotal_WO_VAT - alterElement.totalLandedCost
              )
                ? 0.0
                : (
                    alterElement.groupTotal_WO_VAT -
                    alterElement.totalLandedCost
                  ).toFixed(3); //.slice(0,-1);
              if (
                alterElement.labCalculationSheetAlternativeOptionalGroup != null
              ) {
                var _AlternativeOptionalGroupTotalLandedCost = 0.0;
                var _AlternativeOptionalGroupTotal_WO_VAT = 0.0;
                var _AlternativeOptionalGroupTotalQuotationPrice = 0.0;
                alterElement.labCalculationSheetAlternativeOptionalGroup.labCalculationSheetItem.forEach(
                  (_elementOptional) => {
                    if (_elementOptional.totalLandedCost != "") {
                      _AlternativeOptionalGroupTotalLandedCost += parseFloat(
                        _elementOptional.totalLandedCost
                      );
                    }
                    if (_elementOptional.total_WO_VAT != "") {
                      _AlternativeOptionalGroupTotal_WO_VAT += parseFloat(
                        _elementOptional.total_WO_VAT
                      );
                    }
                    if (_elementOptional.totalQuotationPrice != "") {
                      _AlternativeOptionalGroupTotalQuotationPrice +=
                        parseFloat(_elementOptional.totalQuotationPrice);
                    }
                  }
                );
                // alterElement.labCalculationSheetAlternativeOptionalGroup.groupTotal_WO_VAT = Number.isNaN(_AlternativeOptionalGroupTotal_WO_VAT) ? 0.0 : _AlternativeOptionalGroupTotal_WO_VAT.toFixed(3)//.slice(0,-1);
                alterElement.labCalculationSheetAlternativeOptionalGroup.groupTotalQuotationPrice =
                  Number.isNaN(_AlternativeOptionalGroupTotalQuotationPrice)
                    ? 0.0
                    : _AlternativeOptionalGroupTotalQuotationPrice.toFixed(3); //.slice(0,-1);
                alterElement.labCalculationSheetAlternativeOptionalGroup.groupTotal_WO_VAT =
                  (
                    alterElement.labCalculationSheetAlternativeOptionalGroup
                      .groupTotalQuotationPrice /
                    (1 + vatValue / 100)
                  ).toFixed(3);
                alterElement.labCalculationSheetAlternativeOptionalGroup.totalLandedCost =
                  Number.isNaN(_AlternativeOptionalGroupTotalLandedCost)
                    ? 0.0
                    : _AlternativeOptionalGroupTotalLandedCost.toFixed(3); //.slice(0,-1);
                alterElement.labCalculationSheetAlternativeOptionalGroup.totalMargin =
                  Number.isNaN(
                    (alterElement.labCalculationSheetAlternativeOptionalGroup
                      .groupTotal_WO_VAT -
                      alterElement.labCalculationSheetAlternativeOptionalGroup
                        .totalLandedCost) /
                      alterElement.labCalculationSheetAlternativeOptionalGroup
                        .groupTotal_WO_VAT
                  ) ||
                  alterElement.labCalculationSheetAlternativeOptionalGroup
                    .groupTotal_WO_VAT == 0
                    ? 0.0
                    : (
                        ((alterElement
                          .labCalculationSheetAlternativeOptionalGroup
                          .groupTotal_WO_VAT -
                          alterElement
                            .labCalculationSheetAlternativeOptionalGroup
                            .totalLandedCost) /
                          alterElement
                            .labCalculationSheetAlternativeOptionalGroup
                            .groupTotal_WO_VAT) *
                        100
                      ).toFixed(3); //.slice(0,-1);
                alterElement.labCalculationSheetAlternativeOptionalGroup.totalGrossMarginValue =
                  Number.isNaN(
                    alterElement.labCalculationSheetAlternativeOptionalGroup
                      .groupTotal_WO_VAT -
                      alterElement.labCalculationSheetAlternativeOptionalGroup
                        .totalLandedCost
                  )
                    ? 0.0
                    : (
                        alterElement.labCalculationSheetAlternativeOptionalGroup
                          .groupTotal_WO_VAT -
                        alterElement.labCalculationSheetAlternativeOptionalGroup
                          .totalLandedCost
                      ).toFixed(3); //.slice(0,-1);
              }
            }
          );
          if (element.labCalculationSheetOptionalGroup) {
            var _OptionalGroupTotalLandedCost = 0.0;
            var _OptionalGroupTotal_WO_VAT = 0.0;
            var _OptionalGroupTotalQuotationPrice = 0.0;
            element.labCalculationSheetOptionalGroup.labCalculationSheetItem.forEach(
              (_element) => {
                if (_element.totalLandedCost != "") {
                  _OptionalGroupTotalLandedCost += parseFloat(
                    _element.totalLandedCost
                  );
                }
                if (_element.total_WO_VAT != "") {
                  _OptionalGroupTotal_WO_VAT += parseFloat(
                    _element.total_WO_VAT
                  );
                }
                if (_element.totalQuotationPrice != "") {
                  _OptionalGroupTotalQuotationPrice += parseFloat(
                    _element.totalQuotationPrice
                  );
                }
              }
            );
            element.labCalculationSheetOptionalGroup.groupTotal_WO_VAT =
              Number.isNaN(_OptionalGroupTotal_WO_VAT)
                ? 0.0
                : _OptionalGroupTotal_WO_VAT.toFixed(3); //.slice(0,-1);
            element.labCalculationSheetOptionalGroup.groupTotalQuotationPrice =
              Number.isNaN(_OptionalGroupTotalQuotationPrice)
                ? 0.0
                : _OptionalGroupTotalQuotationPrice.toFixed(3); //.slice(0,-1);
            element.labCalculationSheetOptionalGroup.totalLandedCost =
              Number.isNaN(_OptionalGroupTotalLandedCost)
                ? 0.0
                : _OptionalGroupTotalLandedCost.toFixed(3); //.slice(0,-1);
            element.labCalculationSheetOptionalGroup.totalMargin =
              Number.isNaN(
                (element.labCalculationSheetOptionalGroup.groupTotal_WO_VAT -
                  element.labCalculationSheetOptionalGroup.totalLandedCost) /
                  element.labCalculationSheetOptionalGroup.groupTotal_WO_VAT
              ) ||
              element.labCalculationSheetOptionalGroup.groupTotal_WO_VAT == 0
                ? 0.0
                : (
                    ((element.labCalculationSheetOptionalGroup
                      .groupTotal_WO_VAT -
                      element.labCalculationSheetOptionalGroup
                        .totalLandedCost) /
                      element.labCalculationSheetOptionalGroup
                        .groupTotal_WO_VAT) *
                    100
                  ).toFixed(3); //.slice(0,-1)
            element.labCalculationSheetOptionalGroup.totalGrossMarginValue =
              Number.isNaN(
                element.labCalculationSheetOptionalGroup.groupTotal_WO_VAT -
                  element.labCalculationSheetOptionalGroup.totalLandedCost
              )
                ? 0.0
                : (
                    element.labCalculationSheetOptionalGroup.groupTotal_WO_VAT -
                    element.labCalculationSheetOptionalGroup.totalLandedCost
                  ).toFixed(3); //.slice(0,-1);
          }
        });
      }
    },
    Excel() {
      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/LabCalculationSheets/" +
        this.calSheetId +
        "/Export";
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
          fileLink.href = fileURL;
          let fileName =
            this.BasicInfoObj.tenderNumber +
            "_" +
            (this.BasicInfoObj.mssCustomerName
              ? this.BasicInfoObj.mssCustomerName
              : this.BasicInfoObj.nonMssCustomerName);
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
    handleTeenderUnitChange(rowItem) {
      if (rowItem.tenderUnitM == -1) {
        rowItem.msS_Unit = 1;
      } else {
        rowItem.tenderUnit = rowItem.tenderUnitM;
      }
      if (rowItem.tenderUnitM !== 0) {
        rowItem.tenderUnitValue = "";
      } else rowItem.tenderUnitValue = "1";
      this.calculatorMainItemChange(rowItem);
    },
    handleMSSUnitChange(rowItem) {
      if (rowItem.msS_Unit != "0") {
        rowItem.mssUnitValue = "";
      } else rowItem.mssUnitValue = "1";
      this.calculatorMainItemChange(rowItem);
    },
    importExcel(files) {
      if (!files.length) {
        return;
      } else if (files.length > 1) {
        this.$message({
          showClose: true,
          duration: this.$store.getters.getMessagesDuration,
          type: "error",
          message: this.$t("MaxFilesReached"),
        });
        return;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$message({
          showClose: true,
          duration: this.$store.getters.getMessagesDuration,
          type: "error",
          message: this.$t("InvalidFile"),
        });
        return;
      }
      this.fullscreenLoading = true;
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const XLSX = xlsx;
          const workbook = XLSX.read(data, {
            type: "binary",
          });
          const wsname = workbook.SheetNames[0]; // Take the first sheet，wb.SheetNames[0] :Take the name of the first sheet in the sheets
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname], {
            header: 1,
          }); // Generate JSON table content，wb.Sheets[Sheet名]    Get the data of the first sheet
          const excellist = []; // Clear received data
          var codes = [];
          // begin from 8 to skip the headers
          for (var i = 8; i < ws.length; i++) {
            excellist.push(ws[i]);
            if (ws[i].length && ws[i][0]) codes.push(String(ws[i][3]));
          }
          this.checkItemsByCodeOrName(codes, excellist);
        } catch (e) {
          return alert("Read failure!");
        } finally {
          this.fullscreenLoading = false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
      this.ExcelsheetDialog = false;
    },
    pushFromImport(excellist, validCodes) {
      var skippedItems = [];
      if (excellist.length > 0) {
        excellist.forEach((row) => {
          if (row.length) {
            //to skip empty row
            var calWarranty = "";
            if (this.BasicInfoObj.warrantyForAllGroups) {
              calWarranty = this.BasicInfoObj.warranty;
            }
            if (row[0]) {
              //to skip total row
              let labCalculationSheetItem = JSON.parse(
                JSON.stringify(this.labCalculationSheetItem)
              );
              if (row[3]) {
                let obj = validCodes.find(
                  (x) => x.code.toLowerCase() === String(row[3]).toLowerCase()
                );
                if (obj) {
                  labCalculationSheetItem.code = obj.code;
                  labCalculationSheetItem.name = obj.name;
                  labCalculationSheetItem.vendor = obj.vendor;
                  labCalculationSheetItem.onHandPrice = obj.onHandPrice;
                  labCalculationSheetItem.cost = obj.onHandPrice;
                  labCalculationSheetItem.onHandPriceCurrency = obj.currency;
                  labCalculationSheetItem.onHandPriceCurrencySymbol =
                    obj.currencySymbol;
                  labCalculationSheetItem.onHandQuantity = obj.onHandQuantity;
                  labCalculationSheetItem.fromERB = obj.fromERB;
                } else skippedItems.push(row[3]);
              } else if (row[4]) {
                let obj = validCodes.find((x) => x.name === row[4]);
                if (obj) {
                  labCalculationSheetItem.code = obj.code;
                  labCalculationSheetItem.name = obj.name;
                  labCalculationSheetItem.vendor = obj.vendor;
                  labCalculationSheetItem.onHandPrice = obj.onHandPrice;
                  labCalculationSheetItem.costTypeList = obj.onHandPrice;
                  labCalculationSheetItem.onHandPriceCurrency = obj.currency;
                  labCalculationSheetItem.onHandPriceCurrencySymbol =
                    obj.currencySymbol;
                  labCalculationSheetItem.onHandQuantity = obj.onHandQuantity;
                  labCalculationSheetItem.fromERB = obj.fromERB;
                } else skippedItems.push(row[4]);
              }
              if (labCalculationSheetItem.code) {
                labCalculationSheetItem.tenderUnitM = row[5]
                  ? parseInt(row[5])
                  : -1;
                labCalculationSheetItem.tenderUnit = row[5]
                  ? parseInt(row[5])
                  : "";
                labCalculationSheetItem.tenderUnitValue = row[6]
                  ? parseInt(row[6])
                  : "";
                labCalculationSheetItem.msS_Unit = row[7] || "1";
                labCalculationSheetItem.mssUnitValue = row[8] || "";
                labCalculationSheetItem.costType = row[10] || "";
                labCalculationSheetItem.currencyCode =
                  row[13] || this.tenderCalculationSheetCode;
                labCalculationSheetItem.currencySymbol =
                  this.currenciesList.find((x) => x.code == row[13])
                    ? this.currenciesList.find((x) => x.code == row[13])
                        .currencySymbol
                    : this.currenciesList.find(
                        (x) => x.code == this.tenderCalculationSheetCode
                      ).currencySymbol;
                labCalculationSheetItem.tenderQuantity = row[14] || "";
                labCalculationSheetItem.msS_Quantity = row[15] || "";
                if (row[16]) labCalculationSheetItem.cost = row[16];
                labCalculationSheetItem.shipment = row[17] || "0";
                labCalculationSheetItem.landedCost = row[18] || "";
                labCalculationSheetItem.landedCostInSelectedCurrency =
                  row[19] || "";
                labCalculationSheetItem.totalLandedCost = row[20] || "";
                labCalculationSheetItem.totalLandedCostInSelectedCurrency =
                  row[21] || "";
                labCalculationSheetItem.grossMargin = row[22] || "";
                labCalculationSheetItem.quotationSupplier_WithOut_Vat =
                  row[23] || "";
                labCalculationSheetItem.quotationSupplier_With_Vat =
                  row[24] || "";
                labCalculationSheetItem.finalUnitPrice = row[25] || "0";
                labCalculationSheetItem.totalQuotationPrice = row[26] || "";
                labCalculationSheetItem.grossMarginValue = row[27] || "";
                this.calculatorMainItemChange(labCalculationSheetItem);
                let groupTitle = row[0].split(" ");
                if (groupTitle.length == 1) {
                  //to add main groups
                  let groupIndex = groupTitle[0].split("-")[1] - 1;
                  let groupObj = this.tenderCalculationSheetGroups.find(
                    (x, index) => index == groupIndex
                  );
                  let tenderCalculationSheetGroup = JSON.parse(
                    JSON.stringify(this.tenderCalculationSheetGroup)
                  );
                  tenderCalculationSheetGroup.labCalculationSheetId =
                    this.calSheetId;
                  tenderCalculationSheetGroup.name = row[1] || "";
                  tenderCalculationSheetGroup.number = row[2] || "";
                  tenderCalculationSheetGroup.warranty = calWarranty;
                  tenderCalculationSheetGroup.labCalculationSheetItem = [
                    labCalculationSheetItem,
                  ];
                  if (!groupObj)
                    this.tenderCalculationSheetGroups.push(
                      tenderCalculationSheetGroup
                    );
                  else {
                    groupObj.labCalculationSheetItem.push(
                      labCalculationSheetItem
                    );
                  }
                } else {
                  //to add alternative groups
                  let groupIndex = groupTitle[0].split("-")[1] - 1;
                  let alternativeGroupIndex =
                    groupTitle[groupTitle.length - 1] - 1;
                  let groupObj = this.tenderCalculationSheetGroups[groupIndex];
                  let alternativeGroupObj =
                    groupObj.labCalculationSheetAlternativeGroup.find(
                      (x, index) => index == alternativeGroupIndex
                    );
                  let labCalculationSheetAlternativeGroup = JSON.parse(
                    JSON.stringify(this.labCalculationSheetAlternativeGroup)
                  );
                  labCalculationSheetAlternativeGroup.labCalculationSheetMainGroupId =
                    groupObj.id ? groupObj.id : "";
                  labCalculationSheetAlternativeGroup.labCalculationSheetItem =
                    [labCalculationSheetItem];
                  labCalculationSheetAlternativeGroup.name = row[1] || "";
                  if (!alternativeGroupObj)
                    groupObj.labCalculationSheetAlternativeGroup.push(
                      labCalculationSheetAlternativeGroup
                    );
                  else {
                    alternativeGroupObj.push(labCalculationSheetItem);
                  }
                }
              }
            }
          }
        });
      }
      this.calculateTotal();
      this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
      if (skippedItems.length)
        this.$message({
          showClose: true,
          duration: this.$store.getters.getMessagesDuration,
          type: "error",
          message: this.$t("UndefinedItems", { items: skippedItems }),
        });
    },
    getCalculationSheetCurrency: function (query = "") {
      this.loadingAccount = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/Item/GetAllCurrencies?PageIndex=" +
        1 +
        "&PageSize=" +
        this.$store.getters.getReturnPage +
        "&name=" +
        query +
        "&code=" +
        query +
        "&calculationSheetId=" +
        this.calSheetId +
        "&department=" +
        this.$store.getters.getDepartmentCode.lab;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.currenciesList = data.body;
            this.loadingAccount = false;
            this.calculateTotal();
          },
          function (error) {
            this.loadingAccount = false;
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: error.body.message,
            });
          }
        );
    },
    remoteMethodCurrency: function (query = "") {
      this.loadingAccount = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/Item/GetAllCurrencies?PageIndex=" +
        1 +
        "&PageSize=" +
        this.$store.getters.getReturnPage +
        "&name=" +
        query +
        "&code=" +
        query +
        "&calculationSheetId=" +
        this.calSheetId +
        "&department=" +
        this.$store.getters.getDepartmentCode.lab;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.currenciesList = data.body;
            this.loadingAccount = false;
          },
          function (error) {
            this.loadingAccount = false;
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: error.body.message,
            });
          }
        );
    },
    remoteMethodItemsName: function (query) {
      if (query !== "") {
        this.loadingAccount = true;
        var urlStr =
          this.$store.getters.serverURI +
          "api/Item/GetAllItems?PageIndex=" +
          1 +
          "&PageSize=" +
          this.$store.getters.getReturnPage +
          "&Department=Lab" +
          "&name=" +
          query +
          "&code=";
        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj,
          })
          .then(
            function (data) {
              this.systemItemsList = data.body;
              this.loadingAccount = false;
            },
            function (error) {
              this.loadingAccount = false;
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "error",
                message: error.body.message,
              });
            }
          );
      } else this.systemItemsList = [];
    },
    remoteMethodItemsCode: function (query) {
      if (query !== "") {
        this.loadingAccount = true;
        var urlStr =
          this.$store.getters.serverURI +
          "api/Item/GetAllItems?PageIndex=" +
          1 +
          "&PageSize=" +
          this.$store.getters.getReturnPage +
          "&Department=Lab" +
          "&name=&code=" +
          query;
        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj,
          })
          .then(
            function (data) {
              this.systemItemsList = data.body;
              this.loadingAccount = false;
            },
            function (error) {
              this.loadingAccount = false;
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "error",
                message: error.body.message,
              });
            }
          );
      } else this.systemItemsList = [];
    },
    handleDecimal(rowItem) {
      if (rowItem.shipment) {
        if (parseFloat(rowItem.shipment) > 100) {
          rowItem.shipment = 0;
        }
      }
    },

    checkItemsByCodeOrName(codes, excellist) {
      var urlStr =
        this.$store.getters.serverURI + "api/Item/CheckItemsByCodeOrName";
      this.$http
        .post(
          urlStr,
          {
            codes: codes,
          },
          {
            headers: this.$store.getters.tokenAuthonticationHeaderObj,
          }
        )
        .then(
          (data) => {
            this.pushFromImport(excellist, data.body);
          },
          function () {
            this.pushFromImport(excellist, []);
          }
        );
    },
    getItemCodeName(item) {
      var code = item.code;
      var name = "";
      var urlStr =
        this.$store.getters.serverURI +
        "api/Item/GetByCodeOrName?name=" +
        name +
        "&code=" +
        code;
      this.calSheetId;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(function (data) {
          item.name = data.body.name;
          item.vendor = data.body.vendor;
          item.onHandPrice = data.body.onHandPrice;
          item.cost = data.body.onHandPrice;
          item.onHandPriceCurrency = data.body.currency;
          item.onHandPriceCurrencySymbol = data.body.currencySymbol;
          item.onHandQuantity = data.body.onHandQuantity;
          item.fromERB = data.body.fromERB;
        });
    },
    getItemCodeNameByName(item) {
      var code = "";
      var name = item.name;
      var urlStr =
        this.$store.getters.serverURI +
        "api/Item/GetByCodeOrName?name=" +
        name +
        "&code=" +
        code;
      this.calSheetId;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(function (data) {
          item.code = data.body.code;
          item.vendor = data.body.vendor;
          item.onHandPrice = data.body.onHandPrice;
          item.cost = data.body.onHandPrice;
          item.onHandPriceCurrency = data.body.currency;
          item.onHandPriceCurrencySymbol = data.body.currencySymbol;
          item.onHandQuantity = data.body.onHandQuantity;
          item.fromERB = data.body.fromERB;
        });
    },
    getCurrentStep() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/LabWorkflowLog/GetCurrentStep?id=" +
        this.calSheetId;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(function (data) {
          if (data.body != null) {
            this.StepId = data.body.id;
            this.WorkflowId = data.body.workflowSettingId;
            this.workflowStepActionSetting =
              data.body.workflowStepActionSetting;
          }
        });
    },
    workflowAction(actionId, type) {
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (
            this.tenderCalculationSheetGroups.length == 0 &&
            this.BasicInfoObj.status ==
              this.$store.getters.getSheetStatus.Waiting_for_Approval &&
            this.BasicInfoObj.actionId == null &&
            type == 1
          ) {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("Pleasechoosegroup"),
            });
            return;
          }
          this.isClickWrokflow = true;
          this.fullscreenLoading = true;
          var urlStr = this.$store.getters.serverURI + "api/LabWorkflowLog";
          this.$http
            .post(
              urlStr,
              {
                id: 0,
                labCalculationSheetId: this.calSheetId,
                WorkflowId: this.WorkflowId,
                StepId: this.StepId,
                ActionId: actionId,
                labCalculationSheetMainGroup: this.tenderCalculationSheetGroups,
                bankBlockViewModel: this.bankBlockViewModel,
              },
              {
                headers: this.$store.getters.tokenAuthonticationHeaderObj,
              }
            )
            .then(
              () => {
                this.fullscreenLoading = false;
                this.$message({
                  showClose: true,
                  duration: this.$store.getters.getMessagesDuration,
                  type: "success",
                  message: this.$t("ProcessDone"),
                });
                //  this.geTtenderCalculationSheetData();
                this.$emit("withoutConfirm");
                this.$router.push({ name: "labCalculationSheetList" });
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
        }
      });
    },
    cloaeExcelSheetDialog() {
      this.ExcelsheetDialog = true;
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("CloseConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Yes"),
        cancelButtonText: this.$t("No"),
        beforeClose: (action, instance, done) => {
          if (action == "confirm") {
            this.ExcelsheetDialog = false;
            done();
          } else {
            this.ExcelsheetDialog = true;
            done();
          }
        },
      });
    },
    closeBuildTenderCalculationSheet() {
      this.bulidTenderCalculationSheetDialog = true;
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("CloseConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Yes"),
        cancelButtonText: this.$t("No"),
        beforeClose: (action, instance, done) => {
          if (action == "confirm") {
            this.enableModel = false;
            this.isSearch = false;
            this.prelist = [];
            this.optionalList = [];

            this.mainConfigItems = [];
            this.ItemsGroupObj = {
              groupName: "",
              principalId: "",
              category: "",
              model: "",
              tenderReference: "",
            };
            this.$validator.reset();
            this.bulidTenderCalculationSheetDialog = false;
            this.isAlternative = false;
            done();
          } else {
            this.bulidTenderCalculationSheetDialog = true;
            done();
          }
        },
      });
    },
    getTotalAmountTotalGrossMarginTotalGrossMarginValue() {
      var Total_Quoted_Price_WO_VAT = 0.0;
      var Total_Quotation_Price_With_VAT = 0.0;
      var Total_Landed_Cost = 0.0;
      var totalGrossMarginValue = 0.0;
      this.tenderCalculationSheetGroups.forEach((element) => {
        if (
          element.labCalculationSheetItem &&
          element.labCalculationSheetItem.length > 0
        ) {
          if (element.groupTotal_WO_VAT != "") {
            Total_Quoted_Price_WO_VAT += parseFloat(element.groupTotal_WO_VAT);
          }
          if (element.totalLandedCost != "") {
            Total_Landed_Cost += parseFloat(element.totalLandedCost);
          }
          if (element.totalGrossMarginValue != "") {
            totalGrossMarginValue += parseFloat(element.totalGrossMarginValue);
          }
          if (element.groupTotalQuotationPrice != "") {
            Total_Quotation_Price_With_VAT += parseFloat(
              element.groupTotalQuotationPrice
            );
          }
        }
        if (
          element.labCalculationSheetAlternativeGroup &&
          element.labCalculationSheetAlternativeGroup.length > 0
        ) {
          element.labCalculationSheetAlternativeGroup.forEach((_element) => {
            if (_element.groupTotal_WO_VAT != "") {
              Total_Quoted_Price_WO_VAT += parseFloat(
                _element.groupTotal_WO_VAT
              );
            }
            if (_element.totalLandedCost != "") {
              Total_Landed_Cost += parseFloat(_element.totalLandedCost);
            }
            if (element.totalGrossMarginValue != "") {
              totalGrossMarginValue += parseFloat(
                element.totalGrossMarginValue
              );
            }
            if (_element.groupTotalQuotationPrice != "") {
              Total_Quotation_Price_With_VAT += parseFloat(
                _element.groupTotalQuotationPrice
              );
            }
          });
        }
      });
      this.bankBlockViewModel.total_Quotation_Price_With_VAT = Number.isNaN(
        Total_Quotation_Price_With_VAT
      )
        ? 0.0
        : Total_Quotation_Price_With_VAT.toFixed(3); //.slice(0,-1);
      this.bankBlockViewModel.total_Quoted_Price_WO_VAT = Number.isNaN(
        Total_Quoted_Price_WO_VAT
      )
        ? 0.0
        : Total_Quoted_Price_WO_VAT.toFixed(3); //.slice(0,-1);
      this.bankBlockViewModel.totalGrossMarginValue = (
        this.bankBlockViewModel.total_Quoted_Price_WO_VAT - Total_Landed_Cost
      ).toFixed(3); //Number.isNaN(totalGrossMarginValue) ? 0.0 : (totalGrossMarginValue).toFixed(3)//.slice(0,-1);
      this.bankBlockViewModel.totalGrossMargin =
        Number.isNaN(
          (this.bankBlockViewModel.total_Quoted_Price_WO_VAT -
            Total_Landed_Cost) /
            this.bankBlockViewModel.total_Quoted_Price_WO_VAT
        ) || this.bankBlockViewModel.total_Quoted_Price_WO_VAT == 0
          ? 0.0
          : (
              ((this.bankBlockViewModel.total_Quoted_Price_WO_VAT -
                Total_Landed_Cost) /
                this.bankBlockViewModel.total_Quoted_Price_WO_VAT) *
              100
            ).toFixed(3); //.slice(0,-1);
      if (this.bankBlockViewModel.bankGuaranteeType == true) {
        this.bankBlockViewModel.bankGranteeInCaseOfPercentage = Number.isNaN(
          (Number(this.bankBlockViewModel.bankGuarantee) / 100) *
            this.bankBlockViewModel.total_Quotation_Price_With_VAT
        )
          ? 0.0
          : (
              (Number(this.bankBlockViewModel.bankGuarantee) / 100) *
              this.bankBlockViewModel.total_Quotation_Price_With_VAT
            ).toFixed(3); //.slice(0,-1);
      } else {
        this.bankBlockViewModel.bankGranteeInCaseOfPercentage = 0.0;
      }
    },
    submitCaluctionSheet() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (this.BasicInfoObj.isVat) {
            this.bankBlockViewModel.vatValue = this.VAT;
          } else {
            this.bankBlockViewModel.vatValue = null;
          }
          var urlStr;
          if (this.mainGroupPrevCount) {
            if (this.calSheetId) {
              this.fullscreenLoading = true;
              urlStr =
                this.$store.getters.serverURI +
                "api/LabCalculationSheet/" +
                this.calSheetId +
                "/Submission";
              this.$http
                .put(
                  urlStr,
                  {
                    labCalculationSheetMainGroup:
                      this.tenderCalculationSheetGroups,
                    bankBlockViewModel: this.bankBlockViewModel,
                  },
                  {
                    headers: this.$store.getters.tokenAuthonticationHeaderObj,
                  }
                )
                .then(
                  (response) => {
                    this.fullscreenLoading = false;
                    if (response.status == this.$store.getters.getErrorCode) {
                      this.$message({
                        showClose: true,
                        duration: this.$store.getters.getMessagesDuration,
                        type: "warning",
                        message: response.data.message,
                      });
                    } else {
                      // this.geTtenderCalculationSheetData();
                      this.$emit("withoutConfirm");
                      this.$router.push({ name: "labCalculationSheetList" });
                      this.$message({
                        showClose: true,
                        duration: this.$store.getters.getMessagesDuration,
                        type: "success",
                        message: response.data.message,
                      });
                    }
                    //window.location.reload(true);
                    // this.$router.push({ path: "/tenderCalculationSheets" });
                  },
                  function (error) {
                    this.fullscreenLoading = false;
                    if (error.status == this.$store.getters.getErrorCode) {
                      this.$message({
                        showClose: true,
                        duration: this.$store.getters.getMessagesDuration,
                        type: "warning",
                        message: error.data.message,
                      });
                    } else {
                      this.$message({
                        showClose: true,
                        duration: this.$store.getters.getMessagesDuration,
                        type: "error",
                        message: this.$t("ErrorMessage"),
                      });
                    }
                  }
                );
            }
          } else {
            if (this.calSheetId) {
              this.fullscreenLoading = true;
              urlStr =
                this.$store.getters.serverURI +
                "api/LabCalculationSheet/" +
                this.calSheetId +
                "/Submission";
              this.$http
                .post(
                  urlStr,
                  {
                    labCalculationSheetMainGroup:
                      this.tenderCalculationSheetGroups,
                    bankBlockViewModel: this.bankBlockViewModel,
                  },
                  {
                    headers: this.$store.getters.tokenAuthonticationHeaderObj,
                  }
                )
                .then(
                  (response) => {
                    this.fullscreenLoading = false;
                    if (response.status == this.$store.getters.getErrorCode) {
                      this.$message({
                        showClose: true,
                        duration: this.$store.getters.getMessagesDuration,
                        type: "warning",
                        message: response.data.message,
                      });
                    } else {
                      // this.geTtenderCalculationSheetData();
                      this.$emit("withoutConfirm");
                      this.$router.push({ name: "labCalculationSheetList" });
                      this.$message({
                        showClose: true,
                        duration: this.$store.getters.getMessagesDuration,
                        type: "success",
                        message: response.data.message,
                      });
                    }

                    // window.location.reload(true);
                    // this.$router.push({ path: "/tenderCalculationSheets" });
                  },
                  function (error) {
                    this.fullscreenLoading = false;
                    if (error.status == this.$store.getters.getErrorCode) {
                      this.$message({
                        showClose: true,
                        duration: this.$store.getters.getMessagesDuration,
                        type: "warning",
                        message: error.data.message,
                      });
                    } else {
                      this.$message({
                        showClose: true,
                        duration: this.$store.getters.getMessagesDuration,
                        type: "error",
                        message: this.$t("ErrorMessage"),
                      });
                    }
                  }
                );
            }
          }
        }
      });
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
    currencyChanged(rowItem) {
      if (this.currenciesList && this.currenciesList.length) {
        if (rowItem.currencyCode) {
          rowItem.currencySymbol = this.currenciesList.filter(
            (x) => x.code == rowItem.currencyCode
          )[0].currencySymbol;
        } else {
          rowItem.currencySymbol = "";
        }
      }
    },
    calculatorMainItemChange(rowItem) {
      var TenderQty = 0.0;
      var MSSUnit = 0.0;
      var TenderUnit = 0.0;
      var TenderUnitM = -1;

      var cost = 0.0;
      var shipment = 0.0;
      var finalUnitPrice = 0.0;

      if (rowItem.cost != "") {
        cost = rowItem.cost;
      }

      if (rowItem.shipment != "") {
        shipment = rowItem.shipment;
      }

      if (rowItem.shipment) {
        rowItem.shipment = this.valueAfterRegex(shipment);
      }

      if (rowItem.finalUnitPrice != "0") {
        finalUnitPrice = rowItem.finalUnitPrice;
      }

      if (rowItem.tenderUnit !== "") {
        TenderUnit =
          rowItem.tenderUnit == 0 && rowItem.tenderUnitValue
            ? rowItem.tenderUnitValue
            : rowItem.tenderUnit;
      }

      if (rowItem.tenderUnitM !== "") {
        TenderUnitM = rowItem.tenderUnitM;
      }

      if (rowItem.msS_Unit && rowItem.msS_Unit != "") {
        MSSUnit =
          rowItem.msS_Unit == "0" && rowItem.mssUnitValue
            ? rowItem.mssUnitValue
            : rowItem.msS_Unit;
      }

      if (rowItem.tenderQuantity && rowItem.tenderQuantity != "") {
        TenderQty = rowItem.tenderQuantity;
      }

      //start_new_equations
      let currencyConversion = this.changeAmountCurrency(
        this.tenderCalculationSheetCode,
        rowItem.currencyCode,
        1
      );

      var tenderUnit = TenderUnitM == -1 ? Number(MSSUnit) : Number(TenderUnit);
      if (MSSUnit != 0.0) {
        var ms_qty =
          (parseFloat(TenderQty) * parseFloat(tenderUnit)) /
          parseFloat(MSSUnit);
        rowItem.msS_Quantity = ms_qty;
        rowItem.msS_Quantity = Number.isNaN(rowItem.msS_Quantity)
          ? 0.0
          : Math.ceil(rowItem.msS_Quantity);
      }
      let landedCostInSelectedCurrency =
        parseFloat(cost) * (1 + parseFloat(shipment) / 100);
      rowItem.landedCostInSelectedCurrency = parseFloat(
        landedCostInSelectedCurrency
      ).toFixed(3);
      rowItem.landedCost = parseFloat(
        landedCostInSelectedCurrency * currencyConversion
      ).toFixed(3);

      if (rowItem.msS_Quantity != 0.0) {
        rowItem.totalLandedCostInSelectedCurrency = parseFloat(
          landedCostInSelectedCurrency * parseFloat(rowItem.msS_Quantity)
        ).toFixed(3);
        rowItem.totalLandedCost = parseFloat(
          landedCostInSelectedCurrency *
            currencyConversion *
            parseFloat(rowItem.msS_Quantity)
        ).toFixed(3);
      } else {
        rowItem.totalLandedCostInSelectedCurrency = 0.0;
        rowItem.totalLandedCost = 0.0;
      }
      if (finalUnitPrice != 0.0) {
        if (this.isVat == true && this.VAT > 0) {
          rowItem.grossMargin = parseFloat(
            ((parseFloat(finalUnitPrice) / (1 + parseFloat(this.VAT / 100)) -
              parseFloat(rowItem.landedCost)) /
              (parseFloat(finalUnitPrice) / (1 + parseFloat(this.VAT / 100)))) *
              100
          ).toFixed(3);
        } else {
          rowItem.grossMargin = parseFloat(
            ((parseFloat(finalUnitPrice) - parseFloat(rowItem.landedCost)) /
              parseFloat(finalUnitPrice)) *
              100
          ).toFixed(3);
        }
      } else rowItem.grossMargin = 0.0;
      let quotationSupplier_WithOut_Vat =
        parseFloat(landedCostInSelectedCurrency * currencyConversion) /
        (1 - parseFloat(rowItem.grossMargin) / 100);
      rowItem.quotationSupplier_WithOut_Vat = parseFloat(
        quotationSupplier_WithOut_Vat
      ).toFixed(3);

      if (this.isVat == true && this.VAT > 0) {
        rowItem.quotationSupplier_With_Vat = parseFloat(
          parseFloat(quotationSupplier_WithOut_Vat) *
            (1 + parseFloat(this.VAT / 100))
        ).toFixed(3);
      } else {
        rowItem.quotationSupplier_With_Vat = parseFloat(
          quotationSupplier_WithOut_Vat
        ).toFixed(3);
      }
      // rowItem.totalQuotationPrice = parseFloat(rowItem.quotationSupplier_With_Vat * rowItem.msS_Quantity).toFixed(3);

      rowItem.totalQuotationPrice = parseFloat(
        finalUnitPrice * rowItem.msS_Quantity
      ).toFixed(3); // depending on sujoud it should be in this way 15-11-2023.
      rowItem.totalQuotationPrice_not_rounded = parseFloat(
        finalUnitPrice * rowItem.msS_Quantity
      );
      rowItem.total_WO_VAT_not_rounded =
        finalUnitPrice == 0
          ? 0.0
          : finalUnitPrice *
            (1 - parseFloat(this.VAT / 100)) *
            parseFloat(rowItem.msS_Quantity);
      rowItem.total_WO_VAT = rowItem.total_WO_VAT_not_rounded.toFixed(3);
      rowItem.grossMarginValue = parseFloat(
        (parseFloat(rowItem.quotationSupplier_WithOut_Vat) -
          parseFloat(rowItem.landedCost)) *
          parseFloat(rowItem.msS_Quantity)
      ).toFixed(3);

      // this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
    },
    calculatorShipmentMarginItemChange(rowItem) {
      this.calculatorMainItemChange(rowItem);
    },
    changeAmountCurrency(sheetCurrency, convertFromCurrency, Amount) {
      var total = 0;
      if (sheetCurrency == convertFromCurrency) {
        return Amount;
      }
      var currentCurrency = this.getCurrencyRateManualval(convertFromCurrency);

      total = Amount * currentCurrency;
      return total;
    },
    getCurrencyRateManualval(currency) {
      let currencyVal = 0;
      this.currenciesList.forEach(function (val) {
        if (val.code == currency) {
          currencyVal = val.manualRate;
        }
      });
      return currencyVal;
    },
    geTtenderCalculationSheetData: function () {
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
            this.VAT = this.BasicInfoObj.vatValue;

            this.BasicInfoObj = data.body;
            if (this.BasicInfoObj.submissionDate) {
              this.BasicInfoObj.submissionDate = moment(
                data.body.submissionDate
              ).format("YYYY-MM-DD");
            }

            this.tenderCalculationSheetCode = data.body.tenderCurrencyCode;
            this.isVat = this.BasicInfoObj.isVat;

            if (
              this.BasicInfoObj &&
              this.BasicInfoObj.status != this.$store.getters.getSheetStatus.New
            ) {
              this.getCurrentStep();
            }

            if (this.calSheetId) {
              // it should be called here as the calculations depend on data in getCalculationSheetData, abdalhadi.
              this.FillData();
            }
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
    FillCostTypeList: function () {
      var urlStr =
        this.$store.getters.serverURI + "api/lookup/GetCostTypeForTender";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.costTypeList = data.body;
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
        "api/LabCalculationSheet/GetMainGroup/" +
        this.calSheetId;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.mainGroupPrevCount = data.body.labCalculationSheetMainGroup
              ? data.body.labCalculationSheetMainGroup.length
              : 0;
            this.bankBlockViewModel.bankGuaranteeValidTill =
              data.body.bankGuaranteeValidTill;
            this.bankBlockViewModel = data.body.bankBlockViewModel;
            this.bankBlockViewModel.totalGrossMarginValue =
              data.body.bankBlockViewModel.totalGrossMarginValue;
            this.bankBlockViewModel.totalGrossMargin =
              data.body.bankBlockViewModel.totalGrossMargin;
            this.bankBlockViewModel.total_Quoted_Price_WO_VAT =
              data.body.bankBlockViewModel.total_Quoted_Price_WO_VAT;
            this.bankBlockViewModel.total_Quotation_Price_With_VAT =
              data.body.bankBlockViewModel.total_Quotation_Price_With_VAT;
            this.bankBlockViewModel.bankGranteeInCaseOfPercentage =
              data.body.bankBlockViewModel.bankGranteeInCaseOfPercentage;
            this.bankBlockViewModel.currencyCode =
              data.body.bankBlockViewModel.currencyCode;
            if (data.body.labCalculationSheetMainGroup.length) {
              this.tenderCalculationSheetGroups =
                data.body.labCalculationSheetMainGroup;
              this.tenderCalculationSheetGroups.forEach((element) => {
                this.groupsCount.push(element.labCalculationSheetItem.length);
              });
            }
            this.totalAmountIndex = 0;
            this.totalAlternativeAmountIndex = 0;
            this.totalOptionalAmountIndex = 0;
            this.fullscreenLoading = false;
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
    addNewMainSheetItem(index) {
      this.totalAmountIndex = index;
      let labCalculationSheetItem = JSON.parse(
        JSON.stringify(this.labCalculationSheetItem)
      );
      labCalculationSheetItem.currencyCode = this.tenderCalculationSheetCode;
      labCalculationSheetItem.currencySymbol = this.currenciesList.filter(
        (x) => x.code == this.tenderCalculationSheetCode
      )[0].currencySymbol;

      this.tenderCalculationSheetGroups[index].labCalculationSheetItem.push(
        labCalculationSheetItem
      );
      //this.tenderCalculationSheetGroups[index].totalAmount = 0.0;
    },
    addNewAlternativeGroup(index) {
      this.totalAmountIndex = index;
      let labCalculationSheetItem = JSON.parse(
        JSON.stringify(this.labCalculationSheetItem)
      );
      labCalculationSheetItem.currencyCode = this.tenderCalculationSheetCode;
      labCalculationSheetItem.currencySymbol = this.currenciesList.filter(
        (x) => x.code == this.tenderCalculationSheetCode
      )[0].currencySymbol;
      let labCalculationSheetAlternativeGroup = JSON.parse(
        JSON.stringify(this.labCalculationSheetAlternativeGroup)
      );
      labCalculationSheetAlternativeGroup.labCalculationSheetMainGroupId = this
        .tenderCalculationSheetGroups[index].id
        ? this.tenderCalculationSheetGroups[index].id
        : "";
      (labCalculationSheetAlternativeGroup.labCalculationSheetItem = [
        labCalculationSheetItem,
      ]),
        this.tenderCalculationSheetGroups[
          index
        ].labCalculationSheetAlternativeGroup.push(
          labCalculationSheetAlternativeGroup
        );
      this.totalAlternativeAmountIndex =
        this.tenderCalculationSheetGroups[index]
          .labCalculationSheetAlternativeGroup.length - 1;
    },
    addNewAternativeItem(index, indexOfAlternativeGroup) {
      let labCalculationSheetItem = JSON.parse(
        JSON.stringify(this.labCalculationSheetItem)
      );
      labCalculationSheetItem.currencyCode = this.tenderCalculationSheetCode;
      labCalculationSheetItem.currencySymbol = this.currenciesList.filter(
        (x) => x.code == this.tenderCalculationSheetCode
      )[0].currencySymbol;
      this.tenderCalculationSheetGroups[
        index
      ].labCalculationSheetAlternativeGroup[
        indexOfAlternativeGroup
      ].labCalculationSheetItem.push(labCalculationSheetItem);
    },
    addNewAlternativeOptionalItem(index, alternativeGroupIndex) {
      let labCalculationSheetItem = JSON.parse(
        JSON.stringify(this.labCalculationSheetItem)
      );
      labCalculationSheetItem.currencyCode = this.tenderCalculationSheetCode;
      labCalculationSheetItem.currencySymbol = this.currenciesList.filter(
        (x) => x.code == this.tenderCalculationSheetCode
      )[0].currencySymbol;
      this.tenderCalculationSheetGroups[
        index
      ].labCalculationSheetAlternativeGroup[
        alternativeGroupIndex
      ].labCalculationSheetAlternativeOptionalGroup.labCalculationSheetItem.push(
        labCalculationSheetItem
      );
    },
    removeSingleAlternativeGroup(index, alternativeGroupIndex) {
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("DeleteConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Ok"),
        cancelButtonText: this.$t("Cancel"),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            this.tenderCalculationSheetGroups[
              index
            ].labCalculationSheetAlternativeGroup.splice(
              alternativeGroupIndex,
              1
            );
            done();
          } else {
            done();
          }
        },
      });
    },
    removeSingleOptionalGroup(index) {
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("DeleteConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Ok"),
        cancelButtonText: this.$t("Cancel"),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            this.tenderCalculationSheetGroups[
              index
            ].labCalculationSheetOptionalGroup = null;
            done();
          } else {
            done();
          }
        },
      });
    },
    removeSingleAlternativeOptionalGroup(index, alternativeGroupIndex) {
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("DeleteConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Ok"),
        cancelButtonText: this.$t("Cancel"),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            this.tenderCalculationSheetGroups[
              index
            ].labCalculationSheetAlternativeGroup[
              alternativeGroupIndex
            ].labCalculationSheetAlternativeOptionalGroup = null;
            done();
          } else {
            done();
          }
        },
      });
    },
    removeSingleGroup(index) {
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("DeleteConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Ok"),
        cancelButtonText: this.$t("Cancel"),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            this.tenderCalculationSheetGroups.splice(index, 1);
            done();
          } else {
            done();
          }
        },
      });
    },
    removeCalcuationSheetMainItems(index, item) {
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("DeleteConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Ok"),
        cancelButtonText: this.$t("Cancel"),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            this.tenderCalculationSheetGroups[
              index
            ].labCalculationSheetItem.splice(
              this.tenderCalculationSheetGroups[
                index
              ].labCalculationSheetItem.indexOf(item),
              1
            );
            this.totalAmount = index;
            this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
            done();
          } else {
            done();
          }
        },
      });
    },
    removeAlternativeItem(index, alternativeGroupIndex, item) {
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("DeleteConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Ok"),
        cancelButtonText: this.$t("Cancel"),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            this.tenderCalculationSheetGroups[
              index
            ].labCalculationSheetAlternativeGroup[
              alternativeGroupIndex
            ].labCalculationSheetItem.splice(
              this.tenderCalculationSheetGroups[
                index
              ].labCalculationSheetAlternativeGroup[
                alternativeGroupIndex
              ].labCalculationSheetItem.indexOf(item),
              1
            );
            this.totalAmountIndex = index;
            this.totalAlternativeAmountIndex = alternativeGroupIndex;
            this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
            done();
          } else {
            done();
          }
        },
      });
    },
    removeOptionalItem(index, item) {
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("DeleteConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Ok"),
        cancelButtonText: this.$t("Cancel"),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            this.tenderCalculationSheetGroups[
              index
            ].labCalculationSheetOptionalGroup.labCalculationSheetItem.splice(
              this.tenderCalculationSheetGroups[
                index
              ].labCalculationSheetOptionalGroup.labCalculationSheetItem.indexOf(
                item
              ),
              1
            );
            done();
          } else {
            done();
          }
        },
      });
    },
    removeAlternativeOptionalItem(index, alternativeGroupIndex, item) {
      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("DeleteConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Ok"),
        cancelButtonText: this.$t("Cancel"),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            this.tenderCalculationSheetGroups[
              index
            ].labCalculationSheetAlternativeGroup[
              alternativeGroupIndex
            ].labCalculationSheetAlternativeOptionalGroup.labCalculationSheetItem.splice(
              this.tenderCalculationSheetGroups[
                index
              ].labCalculationSheetAlternativeGroup[
                alternativeGroupIndex
              ].labCalculationSheetAlternativeOptionalGroup.labCalculationSheetItem.indexOf(
                item
              ),
              1
            );

            done();
          } else {
            done();
          }
        },
      });
    },
    saveDataAction(isPrevious) {
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (this.mainGroupPrevCount) {
            this.UpdateMainGroup();
            if (isPrevious) {
              this.$emit("previous-step");
            }
            return;
          }

          this.fullscreenLoading = true;
          if (this.BasicInfoObj.isVat) {
            this.bankBlockViewModel.vatValue = this.VAT;
          } else {
            this.bankBlockViewModel.vatValue = null;
          }
          var urlStr =
            this.$store.getters.serverURI +
            "api/LabCalculationSheet/" +
            this.calSheetId +
            "/MainGroup";
          this.$http
            .post(
              urlStr,
              {
                labCalculationSheetMainGroup: this.tenderCalculationSheetGroups,
                bankBlockViewModel: this.bankBlockViewModel,
              },
              {
                headers: this.$store.getters.tokenAuthonticationHeaderObj,
              }
            )
            .then(
              () => {
                this.fullscreenLoading = false;
                this.$message({
                  showClose: true,
                  duration: this.$store.getters.getMessagesDuration,
                  type: "success",
                  message: this.$t("CalculationSheetItemsCreateItems"),
                });
                this.status = "New";
                if (isPrevious) {
                  this.$emit("previous-step");
                  // this.geTtenderCalculationSheetData()
                } else {
                  this.FillData();
                  // this.geTtenderCalculationSheetData()
                }
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
        }
      });
    },
    UpdateMainGroup() {
      if (this.BasicInfoObj.isVat) {
        this.bankBlockViewModel.vatValue = this.VAT;
      } else {
        this.bankBlockViewModel.vatValue = null;
      }

      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/LabCalculationSheet/" +
        this.calSheetId +
        "/UpdateMainGroup/";
      this.$http
        .put(
          urlStr,
          {
            labCalculationSheetMainGroup: this.tenderCalculationSheetGroups,
            bankBlockViewModel: this.bankBlockViewModel,
          },
          {
            headers: this.$store.getters.tokenAuthonticationHeaderObj,
          }
        )
        .then(
          () => {
            this.fullscreenLoading = false;
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "success",
              message: this.$t("CalculationSheetUpdatedSuccessfully"),
            });
            this.status = "New";
            this.geTtenderCalculationSheetData();
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
    ShowExcelSheetDialog() {
      this.ExcelsheetDialog = true;
    },
    ShowDialogToFetchItemFromMainConfigs(indexOfTenderCalculationSheetGroup) {
      this.currentGroupIndex = indexOfTenderCalculationSheetGroup;
      this.bulidTenderCalculationSheetDialog = true;
      this.enableModel = false;
      this.isSearch = false;
      this.prelist = [];
      this.optionalList = [];
      this.mainConfigItems = [];

      this.ItemsGroupObj = {
        groupName: "",
        principalId: "",
        category: "",
        model: "",
        tenderReference: "",
      };
      this.$validator.reset();
    },
    ShowDialogToFetchAlternativeItemFromMainConfigs(
      indexOfCalculationSheetGroup
    ) {
      this.currentGroupIndex = indexOfCalculationSheetGroup;
      this.bulidTenderCalculationSheetDialog = true;
      this.isAlternative = true;
      this.enableModel = false;
      this.isSearch = false;
      this.prelist = [];
      this.optionalList = [];
      this.mainConfigItems = [];

      this.ItemsGroupObj = {
        groupName: "",
        principalId: "",
        category: "",
        model: "",
        tenderReference: "",
      };
      this.$validator.reset();
    },
    extractMainConfigAlternativeGroupItem3() {
      var prelistConfigs = this.prelist;
      var prelistOptionalConfig = this.optionalList;
      var vm = this;
      var mainItemsConfig = [];
      var optionalitems = [];
      if (this.mainConfigItems.length > 0) {
        prelistConfigs.map(function (prelistItemGroup) {
          vm.mainConfigItems.map(function (MainConfigGroup) {
            if (prelistItemGroup.itemGroupId == MainConfigGroup.id) {
              optionalitems = [];
              prelistOptionalConfig.map(function (val) {
                if (val == MainConfigGroup.id) {
                  MainConfigGroup.itemGroupOptionalItem.map(function (value) {
                    var item = JSON.parse(
                      JSON.stringify(this.labCalculationSheetItem)
                    );
                    item.name = value.itemName;
                    item.code = value.itemCode;
                    item.vendor = value.vendor;
                    item.onHandPrice = value.onHandPrice;
                    item.onHandPriceCurrency = value.onHandPriceCurrency;
                    item.onHandPriceCurrencySymbol =
                      value.onHandPriceCurrencySymbol;
                    item.onHandQuantity = value.onHandQuantity;
                    item.cost = value.onHandPrice;
                    item.currencyCode = vm.tenderCalculationSheetCode;
                    item.currencySymbol = vm.currenciesList.filter(
                      (x) => x.code == vm.tenderCalculationSheetCode
                    )[0].currencySymbol;
                    optionalitems.push(item);
                    //vm.getItemCodeName(item)
                    //vm.getItemCodeNameByName(item)
                  });
                }
              });
              MainConfigGroup.itemGroupMainConfig.map(function (
                mainConfigItems
              ) {
                mainItemsConfig = [];
                if (prelistItemGroup.mainConfigId == mainConfigItems.id) {
                  mainConfigItems.itemGroupMainConfigItems.map(function (
                    groupMainConfigItemsObjectOfArray
                  ) {
                    var item = JSON.parse(
                      JSON.stringify(this.labCalculationSheetItem)
                    );
                    item.name = groupMainConfigItemsObjectOfArray.itemName;
                    item.code = groupMainConfigItemsObjectOfArray.itemCode;
                    item.vendor = groupMainConfigItemsObjectOfArray.vendor;
                    item.onHandPrice =
                      groupMainConfigItemsObjectOfArray.onHandPrice;
                    item.onHandPriceCurrency =
                      groupMainConfigItemsObjectOfArray.onHandPriceCurrency;
                    item.onHandPriceCurrencySymbol =
                      groupMainConfigItemsObjectOfArray.onHandPriceCurrencySymbol;
                    item.onHandQuantity =
                      groupMainConfigItemsObjectOfArray.onHandQuantity;
                    item.cost = groupMainConfigItemsObjectOfArray.onHandPrice;
                    item.currencyCode = vm.tenderCalculationSheetCode;
                    item.currencySymbol = vm.currenciesList.filter(
                      (x) => x.code == vm.tenderCalculationSheetCode
                    )[0].currencySymbol;
                    mainItemsConfig.push(item);
                    //vm.getItemCodeName(item)
                    //vm.getItemCodeNameByName(item)
                  });
                  vm.AddAlternativeGroupByMainConfig(
                    mainItemsConfig,
                    optionalitems
                  );
                }
              });
            }
          });
        });
      }

      this.isSearch = false;
      this.bulidTenderCalculationSheetDialog = false;
      this.isAlternative = false;
      this.prelist = [];
      this.optionalList = [];

      this.mainConfigItems = [];
      this.ItemsGroupObj = {
        groupName: "",
        principalId: "",
        category: "",
        model: "",
        tenderReference: "",
      };
      this.$validator.reset();
    },
    AddAlternativeGroupByMainConfig(mainItemsList, OptionalItemList) {
      var optionalItems = null;
      var index = this.currentGroupIndex;

      if (OptionalItemList.length > 0) {
        optionalItems = {
          name: "",
          code: "",
          totalGrossMarginValue: "",
          totalMargin: "",
          totalLandedCost: "",
          groupTotalQuotationPrice: "",
          groupTotal_WO_VAT: "",
          tenderCalculationSheetAlternativeGroupId: "",
          labCalculationSheetItem: OptionalItemList,
        };
      }
      let labCalculationSheetAlternativeGroup = JSON.parse(
        JSON.stringify(this.labCalculationSheetAlternativeGroup)
      );
      labCalculationSheetAlternativeGroup.labCalculationSheetMainGroupId = this
        .tenderCalculationSheetGroups[index].id
        ? this.tenderCalculationSheetGroups[index].id
        : "";
      labCalculationSheetAlternativeGroup.labCalculationSheetItem =
        mainItemsList;
      labCalculationSheetAlternativeGroup.labCalculationSheetAlternativeOptionalGroup =
        optionalItems;
      this.tenderCalculationSheetGroups[
        index
      ].labCalculationSheetAlternativeGroup.push(
        labCalculationSheetAlternativeGroup
      );
      this.totalAlternativeAmountIndex =
        this.tenderCalculationSheetGroups[index]
          .labCalculationSheetAlternativeGroup.length - 1;
    },
    addNewGroup() {
      var calWarranty = "";
      if (this.BasicInfoObj.warrantyForAllGroups) {
        calWarranty = this.BasicInfoObj.warranty;
      }
      let labCalculationSheetItem = JSON.parse(
        JSON.stringify(this.labCalculationSheetItem)
      );
      labCalculationSheetItem.currencyCode = this.tenderCalculationSheetCode;
      labCalculationSheetItem.currencySymbol = this.currenciesList.filter(
        (x) => x.code == this.tenderCalculationSheetCode
      )[0].currencySymbol;
      let tenderCalculationSheetGroup = JSON.parse(
        JSON.stringify(this.tenderCalculationSheetGroup)
      );
      tenderCalculationSheetGroup.labCalculationSheetId = this.calSheetId;
      tenderCalculationSheetGroup.warranty = calWarranty;
      tenderCalculationSheetGroup.labCalculationSheetItem = [
        labCalculationSheetItem,
      ];
      this.tenderCalculationSheetGroups.push(tenderCalculationSheetGroup);
      this.totalAmountIndex = this.tenderCalculationSheetGroups.length - 1;
    },
    extractMainConfigGroupItem3() {
      var prelistConfigs = this.prelist;
      var prelistOptionalConfig = this.optionalList;
      var vm = this;
      var mainItemsConfig = [];
      var optionalitems = [];
      if (this.mainConfigItems.length > 0) {
        prelistConfigs.map(function (prelistItemGroup) {
          vm.mainConfigItems.map(function (MainConfigGroup) {
            if (prelistItemGroup.itemGroupId == MainConfigGroup.id) {
              optionalitems = [];
              prelistOptionalConfig.map(function (val) {
                if (val == MainConfigGroup.id) {
                  MainConfigGroup.itemGroupOptionalItem.map(function (value) {
                    var item = JSON.parse(
                      JSON.stringify(this.labCalculationSheetItem)
                    );
                    item.name = value.itemName;
                    item.code = value.itemCode;
                    item.vendor = value.vendor;
                    item.onHandPrice = value.onHandPrice;
                    item.onHandPriceCurrency = value.onHandPriceCurrency;
                    item.onHandPriceCurrencySymbol =
                      value.onHandPriceCurrencySymbol;
                    item.onHandQuantity = value.onHandQuantity;
                    item.cost = value.onHandPrice;
                    item.currencyCode = vm.tenderCalculationSheetCode;
                    item.currencySymbol = vm.currenciesList.filter(
                      (x) => x.code == vm.tenderCalculationSheetCode
                    )[0].currencySymbol;
                    optionalitems.push(item);
                    //vm.getItemCodeName(item)
                    //vm.getItemCodeNameByName(item)
                  });
                }
              });
              MainConfigGroup.itemGroupMainConfig.map(function (
                mainConfigItems
              ) {
                mainItemsConfig = [];
                if (prelistItemGroup.mainConfigId == mainConfigItems.id) {
                  mainConfigItems.itemGroupMainConfigItems.map(function (
                    groupMainConfigItemsObjectOfArray
                  ) {
                    var item = JSON.parse(
                      JSON.stringify(this.labCalculationSheetItem)
                    );
                    item.name = groupMainConfigItemsObjectOfArray.itemName;
                    item.code = groupMainConfigItemsObjectOfArray.itemCode;
                    item.vendor = groupMainConfigItemsObjectOfArray.vendor;
                    item.onHandPrice =
                      groupMainConfigItemsObjectOfArray.onHandPrice;
                    item.onHandPriceCurrency =
                      groupMainConfigItemsObjectOfArray.onHandPriceCurrency;
                    item.onHandPriceCurrencySymbol =
                      groupMainConfigItemsObjectOfArray.onHandPriceCurrencySymbol;
                    item.onHandQuantity =
                      groupMainConfigItemsObjectOfArray.onHandQuantity;
                    item.cost = groupMainConfigItemsObjectOfArray.onHandPrice;
                    item.currencyCode = vm.tenderCalculationSheetCode;
                    item.currencySymbolvm.currenciesList.filter(
                      (x) => x.code == vm.tenderCalculationSheetCode
                    )[0].currencySymbol;
                    mainItemsConfig.push(item);
                    //vm.getItemCodeName(item)
                    //vm.getItemCodeNameByName(item)
                  });
                  vm.AddGroupByMainConfig(mainItemsConfig, optionalitems);
                }
              });
            }
          });
        });
      }

      this.isSearch = false;
      this.bulidTenderCalculationSheetDialog = false;
      this.prelist = [];
      this.optionalList = [];

      this.mainConfigItems = [];
      this.ItemsGroupObj = {
        groupName: "",
        principalId: "",
        category: "",
        model: "",
        tenderReference: "",
      };
      this.$validator.reset();
    },
    AddGroupByMainConfig(mainItemsList, OptionalItemList) {
      var optionalItems = null;
      var calWarranty = "";

      if (OptionalItemList.length > 0) {
        optionalItems = {
          name: "",
          totalGrossMarginValue: "",
          totalMargin: "",
          totalLandedCost: "",
          groupTotalQuotationPrice: "",
          groupTotal_WO_VAT: "",
          labCalculationSheetItem: OptionalItemList,
        };
      }
      if (this.BasicInfoObj.warrantyForAllGroups) {
        calWarranty = this.BasicInfoObj.warranty;
      }
      let tenderCalculationSheetGroup = JSON.parse(
        JSON.stringify(this.tenderCalculationSheetGroup)
      );
      tenderCalculationSheetGroup.labCalculationSheetId = this.calSheetId;
      tenderCalculationSheetGroup.warranty = calWarranty;
      tenderCalculationSheetGroup.labCalculationSheetItem = mainItemsList;
      tenderCalculationSheetGroup.labCalculationSheetOptionalGroup =
        optionalItems;
      this.tenderCalculationSheetGroups.push(tenderCalculationSheetGroup);
    },
    previousStep: function () {
      if (
        this.BasicInfoObj.createdBy == this.loggeduser &&
        this.BasicInfoObj.status ==
          this.$store.getters.getSheetStatus.Waiting_for_Approval
      ) {
        this.$emit("previous-step");
      } else {
        this.saveDataAction(true);
      }
    },
    getPrincipalNames() {
      var urlStr =
        this.$store.getters.serverURI + "api/ItemsGroup/GetAllItemPrinicipals";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.principals = data.body;
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
    getMainConfigByPrincipalCategoryItem() {
      this.mainConfigItems = [];
      if (this.ItemsGroupObj.principalId) {
        var urlStr =
          this.$store.getters.serverURI +
          "api/ItemsGroup?PageIndex=&PageSize=&RowsCount=&principalCode=" +
          this.ItemsGroupObj.principalId +
          "&category=" +
          this.ItemsGroupObj.category +
          "&model=" +
          this.ItemsGroupObj.model +
          "&tenderReference=" +
          this.ItemsGroupObj.tenderReference;
        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj,
          })
          .then(
            function (data) {
              this.mainConfigItems = data.body.itemsGroupList;
              this.enableModel = true;
              this.isSearch = true;
            }.bind(this),
            function () {
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "error",
                message: this.$t("ErrorMessage"),
              });
            }
          );
      } else {
        this.enableModel = false;
        this.isSearch = false;
      }
    },
    getAllItemsGroupByPrincipleId(val) {
      if (this.ItemsGroupObj.principalId != "") {
        this.ItemsGroupObj.category = "";
        this.ItemsGroupObj.model = "";
      }
      var urlStr =
        this.$store.getters.serverURI +
        "api/ItemsGroup/categories?principalCode=" +
        val;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(function (data) {
          this.enableCategory = true;
          this.categories = data.body;
        });
    },
    getTenderReferences() {
      var urlStr =
        this.$store.getters.serverURI + "api/ItemsGroup/tenderReferences";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(function (data) {
          this.tenderReferences = data.body;
        });
    },
    getAllItemsGroupByCategoryId(val) {
      if (this.ItemsGroupObj.category != "") {
        this.ItemsGroupObj.model = "";
      }
      var urlStr =
        this.$store.getters.serverURI +
        "api/ItemsGroup/models?categoryCode=" +
        val;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(function (data) {
          this.enableModel = true;
          this.models = data.body;
        });
    },
    reBuildItems() {
      var val = this.tenderCalculationSheetGroups;
      if (val && val.length > 0) {
        val.forEach((element) => {
          element.labCalculationSheetItem.forEach((_element) => {
            this.calculatorMainItemChange(_element);
          });

          element.labCalculationSheetAlternativeGroup.forEach(
            (alterElement) => {
              alterElement.labCalculationSheetItem.forEach((_element) => {
                this.calculatorMainItemChange(_element);
              });

              if (
                alterElement.labCalculationSheetAlternativeOptionalGroup != null
              ) {
                alterElement.labCalculationSheetAlternativeOptionalGroup.labCalculationSheetItem.forEach(
                  (_elementOptional) => {
                    this.calculatorMainItemChange(_elementOptional);
                  }
                );
              }
            }
          );

          if (element.labCalculationSheetOptionalGroup) {
            element.labCalculationSheetOptionalGroup.labCalculationSheetItem.forEach(
              (_element) => {
                this.calculatorMainItemChange(_element);
              }
            );
          }
        });
      }
      // this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
    },
    valueAfterRegex(val) {
      var reg = new RegExp("^[0-9]+(.[0-9]{1,2})?$");
      if (!reg.test(val)) {
        return parseFloat(val); //.toFixed(3).slice(0,-1);
      } else {
        return val;
      }
    },

    deleteSelectedForCalcuationSheetMainItems(index) {
      if (
        !this.tenderCalculationSheetGroups[index].labCalculationSheetItem ||
        this.tenderCalculationSheetGroups[index].labCalculationSheetItem
          .length == 0
      )
        return;

      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("DeleteConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Ok"),
        cancelButtonText: this.$t("Cancel"),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            this.$set(
              this.tenderCalculationSheetGroups[index],
              "labCalculationSheetItem",
              this.tenderCalculationSheetGroups[
                index
              ].labCalculationSheetItem.filter((item) => !item.selected)
            );

            this.totalAmount = index;
            this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
            done();
          } else {
            done();
          }
        },
      });
    },

    deleteSelectedForCalcuationSheetAlternativeItem(
      index,
      alternativeGroupIndex
    ) {
      if (
        !this.tenderCalculationSheetGroups[index]
          .labCalculationSheetAlternativeGroup[alternativeGroupIndex]
          .labCalculationSheetItem ||
        this.tenderCalculationSheetGroups[index]
          .labCalculationSheetAlternativeGroup[alternativeGroupIndex]
          .labCalculationSheetItem.length == 0
      )
        return;

      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("DeleteConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Ok"),
        cancelButtonText: this.$t("Cancel"),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            this.$set(
              this.tenderCalculationSheetGroups[index]
                .labCalculationSheetAlternativeGroup[alternativeGroupIndex],
              "labCalculationSheetItem",
              this.tenderCalculationSheetGroups[
                index
              ].labCalculationSheetAlternativeGroup[
                alternativeGroupIndex
              ].labCalculationSheetItem.filter((item) => !item.selected)
            );

            this.totalAmountIndex = index;
            this.totalAlternativeAmountIndex = alternativeGroupIndex;
            this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
            done();
          } else {
            done();
          }
        },
      });
    },

    deleteSelectedForCalcuationSheetOptionalGroupItems(index) {
      if (
        !this.tenderCalculationSheetGroups[index]
          .labCalculationSheetOptionalGroup.labCalculationSheetItem ||
        this.tenderCalculationSheetGroups[index]
          .labCalculationSheetOptionalGroup.labCalculationSheetItem.length == 0
      )
        return;

      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("DeleteConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Ok"),
        cancelButtonText: this.$t("Cancel"),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            this.$set(
              this.tenderCalculationSheetGroups[index]
                .labCalculationSheetOptionalGroup,
              "labCalculationSheetItem",
              this.tenderCalculationSheetGroups[
                index
              ].labCalculationSheetOptionalGroup.labCalculationSheetItem.filter(
                (item) => !item.selected
              )
            );
            done();
          } else {
            done();
          }
        },
      });
    },

    deleteSelectedForCalcuationSheetAlternativeOptionalItem(
      index,
      alternativeGroupIndex
    ) {
      if (
        !this.tenderCalculationSheetGroups[index]
          .labCalculationSheetAlternativeGroup[alternativeGroupIndex]
          .labCalculationSheetAlternativeOptionalGroup
          .labCalculationSheetItem ||
        this.tenderCalculationSheetGroups[index]
          .labCalculationSheetAlternativeGroup[alternativeGroupIndex]
          .labCalculationSheetAlternativeOptionalGroup.labCalculationSheetItem
          .length == 0
      )
        return;

      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("DeleteConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Ok"),
        cancelButtonText: this.$t("Cancel"),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            this.$set(
              this.tenderCalculationSheetGroups[index]
                .labCalculationSheetAlternativeGroup[alternativeGroupIndex]
                .labCalculationSheetAlternativeOptionalGroup,
              "labCalculationSheetItem",
              this.tenderCalculationSheetGroups[
                index
              ].labCalculationSheetAlternativeGroup[
                alternativeGroupIndex
              ].labCalculationSheetAlternativeOptionalGroup.labCalculationSheetItem.filter(
                (item) => !item.selected
              )
            );
            done();
          } else {
            done();
          }
        },
      });
    },

    addNewOptionalGroup(index) {
      this.totalAmountIndex = index;

      this.tenderCalculationSheetGroups[
        index
      ].labCalculationSheetOptionalGroup = {
        name: "",
        totalAmount: "",
        tenderCalculationSheetMainGroupId: this.tenderCalculationSheetGroups[
          index
        ].id
          ? this.tenderCalculationSheetGroups[index].id
          : "",
        labCalculationSheetItem: [
          {
            name: "",
            vendor: "",
            fromERB: null,
            quantity: "",
            onHandPrice: "",
            onHandPriceCurrency: "",
            onHandPriceCurrencySymbol: "",
            onHandQuantity: "",
            cost: "",
            costType: 14,
            discount1: "",
            discount2: "",
            currencyCode: this.tenderCalculationSheetCode,
            currencySymbol: this.currenciesList.filter(
              (x) => x.code == this.tenderCalculationSheetCode
            )[0].currencySymbol,
            shipment: "",
            landedCost: "",
            grossMargin: "",
            unitPrice: "",
            amount: "",
            grossMarginValue: "",
            note: " ",
            approve: false,
            //-
            shelfLife: "",
            countryOfOrigin: "",
            tenderUnitM: -1,
            tenderUnit: "",
            msS_Unit: "1",
            tenderUnitValue: "",
            mssUnitValue: "",
            tenderQuantity: "",
            msS_Quantity: "",
            lastWinningPrice_WO_VAT: 0.0,
            total_WO_VAT: "",
            foB_MSS_Unit: "",
            foB_MSS: "",
            foC_Value: "1",
            shippingExpenses: "",
            sE_CostPerContainer: "",
            sE_EachContainer: "",
            sE_EachPallet: "",

            foc: false,
            cif: "",
            cifPlaceHolder: "",
            cifValueInTheSelectedCurrency: "",
            exchangeRate: "",
            profitPercentage: "",
            profitAmount: "",
            tenderUnitPrice: "",
            adjustedTenderUnitPrice: "",
            totalQuotationPrice: "",
            factor: "",
            suggestedQuotedPrice_WO_VAT: "",
            suggestedQuotedPrice_WO_VATPlaceHolder: "",
            suggestedPrice_WO_VAT_SelectedCurrency: "",
            regularPrice: "",
            winningProbability: false,
            costTypeCode: 1,
            shippingExpenseType: true,
            itemToCalculate: "",

            ciF_not_rounded: "",
            factor_not_rounded: "",
            shippingExpenses_not_rounded: "",
            suggestedQuotedPrice_WO_VAT_not_rounded: "",
            totalQuotationPrice_not_rounded: "",
            total_WO_VAT_not_rounded: "",
            adjustedTenderUnitPrice_not_rounded: "",
            tenderUnitPrice_not_rounded: "",
            profitPercentage_not_rounded: "",
            profitAmount_not_rounded: "",
          },
        ],
        totalCost: "",
        totalProfit: "",
        groupTotalQuotationPrice: "",
        groupTotal_WO_VAT: "",
      };

      this.totalOptionalAmountIndex =
        this.tenderCalculationSheetGroups[index]
          .labCalculationSheetOptionalGroup.length - 1;
    },

    addNewOptionalItem(index) {
      this.totalOptionalAmountIndex = index;
      this.tenderCalculationSheetGroups[
        index
      ].labCalculationSheetOptionalGroup.labCalculationSheetItem.push({
        name: "",
        vendor: "",
        fromERB: null,
        quantity: "",
        onHandPrice: "",
        onHandPriceCurrency: "",
        onHandPriceCurrencySymbol: "",
        onHandQuantity: "",
        cost: "",
        costType: 14,
        discount1: "",
        discount2: "",
        currencyCode: this.tenderCalculationSheetCode,
        currencySymbol: this.currenciesList.filter(
          (x) => x.code == this.tenderCalculationSheetCode
        )[0].currencySymbol,
        shipment: "",
        landedCost: "",
        grossMargin: "",
        unitPrice: "",
        amount: "",
        grossMarginValue: "",
        note: " ",
        approve: false,
        //----------------
        shelfLife: "",
        countryOfOrigin: "",
        tenderUnitM: -1,
        tenderUnit: "",
        msS_Unit: "1",
        tenderUnitValue: "",
        mssUnitValue: "",
        tenderQuantity: "",
        msS_Quantity: "",
        lastWinningPrice_WO_VAT: 0.0,
        total_WO_VAT: "",
        foB_MSS_Unit: "",
        foB_MSS: "",
        foC_Value: "1",
        shippingExpenses: "",
        sE_CostPerContainer: "",
        sE_EachContainer: "",
        sE_EachPallet: "",

        foc: false,
        cif: "",
        cifPlaceHolder: "",
        cifValueInTheSelectedCurrency: "",
        exchangeRate: "",
        profitPercentage: "",
        profitAmount: "",
        tenderUnitPrice: "",
        adjustedTenderUnitPrice: "",
        totalQuotationPrice: "",
        factor: "",
        suggestedQuotedPrice_WO_VAT: "",
        suggestedQuotedPrice_WO_VATPlaceHolder: "",
        suggestedPrice_WO_VAT_SelectedCurrency: "",
        regularPrice: "",
        winningProbability: false,
        costTypeCode: 1,
        shippingExpenseType: true,
        itemToCalculate: "",

        ciF_not_rounded: "",
        factor_not_rounded: "",
        shippingExpenses_not_rounded: "",
        suggestedQuotedPrice_WO_VAT_not_rounded: "",
        totalQuotationPrice_not_rounded: "",
        total_WO_VAT_not_rounded: "",
        adjustedTenderUnitPrice_not_rounded: "",
        tenderUnitPrice_not_rounded: "",
        profitPercentage_not_rounded: "",
        profitAmount_not_rounded: "",
      });
    },
    addNewAternativeOptionalGroup(index, indexOfAlternativeGroup) {
      this.tenderCalculationSheetGroups[
        index
      ].labCalculationSheetAlternativeGroup[
        indexOfAlternativeGroup
      ].labCalculationSheetAlternativeOptionalGroup = {
        name: "",
        code: "",
        totalAmount: "",
        totalCost: "",
        totalProfit: "",
        groupTotalQuotationPrice: "",
        groupTotal_WO_VAT: "",

        tenderCalculationSheetAlternativeGroupId: this
          .tenderCalculationSheetGroups[index]
          .labCalculationSheetAlternativeGroup.id
          ? this.tenderCalculationSheetGroups[index]
              .labCalculationSheetAlternativeGroup.id
          : "",
        labCalculationSheetItem: [
          {
            name: "",
            vendor: "",
            fromERB: null,
            quantity: "",
            onHandPrice: "",
            onHandPriceCurrency: "",
            onHandPriceCurrencySymbol: "",
            onHandQuantity: "",
            cost: "",
            costType: 14,
            discount1: "",
            discount2: "",
            currencyCode: this.tenderCalculationSheetCode,
            currencySymbol: this.currenciesList.filter(
              (x) => x.code == this.tenderCalculationSheetCode
            )[0].currencySymbol,
            shipment: "",
            landedCost: "",
            grossMargin: "",
            unitPrice: "",
            amount: "",
            grossMarginValue: "",
            note: " ",
            approve: false,
            //---
            shelfLife: "",
            countryOfOrigin: "",
            tenderUnitM: -1,
            tenderUnit: "",
            msS_Unit: "1",
            tenderUnitValue: "",
            mssUnitValue: "",
            tenderQuantity: "",
            msS_Quantity: "",
            lastWinningPrice_WO_VAT: 0.0,
            total_WO_VAT: "",
            foB_MSS_Unit: "",
            foB_MSS: "",
            foC_Value: "1",
            shippingExpenses: "",
            sE_CostPerContainer: "",
            sE_EachContainer: "",
            sE_EachPallet: "",

            foc: false,
            cif: "",
            cifPlaceHolder: "",
            cifValueInTheSelectedCurrency: "",
            exchangeRate: "",
            profitPercentage: "",
            profitAmount: "",
            tenderUnitPrice: "",
            adjustedTenderUnitPrice: "",
            totalQuotationPrice: "",
            factor: "",
            suggestedQuotedPrice_WO_VAT: "",
            suggestedQuotedPrice_WO_VATPlaceHolder: "",
            suggestedPrice_WO_VAT_SelectedCurrency: "",
            regularPrice: "",
            winningProbability: false,
            costTypeCode: 1,
            shippingExpenseType: true,
            itemToCalculate: "",

            ciF_not_rounded: "",
            factor_not_rounded: "",
            shippingExpenses_not_rounded: "",
            suggestedQuotedPrice_WO_VAT_not_rounded: "",
            totalQuotationPrice_not_rounded: "",
            total_WO_VAT_not_rounded: "",
            adjustedTenderUnitPrice_not_rounded: "",
            tenderUnitPrice_not_rounded: "",
            profitPercentage_not_rounded: "",
            profitAmount_not_rounded: "",
          },
        ],
      };
    },
  },
  watch: {
    tenderCalculationSheetGroups: {
      handler() {
        this.calculateTotal();
        this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.card-body,
.card-header {
  padding: 5px 8px;
}

.custom-table td,
.custom-table th {
  padding: 0px !important;
}

.el-table td,
.el-table th {
  padding: 0px !important;
}

.padding-3 {
  padding-top: 3px !important;
}

.el-input__inner {
  padding: 0 10px !important;
  height: 35px !important;
}

.table-sm th,
.table-sm td {
  padding: 0px 1.2px !important;
  border-top: 0px;
}

.table-sm td {
  padding-top: 0.5px !important;
  padding-bottom: 0.5px !important;
}

.table-sm th {
  vertical-align: middle;
}

.pabsolute {
  position: absolute;
  right: 14px;
  top: 11px;
}

.card {
  margin-bottom: 0.5rem;
}

.el-table_1_column_18 {
  color: red !important;
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

.build-btn {
  margin-left: 0;
}
</style>
