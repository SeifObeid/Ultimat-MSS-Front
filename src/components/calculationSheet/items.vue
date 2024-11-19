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
              <div class="col-md-2">
                <div
                  class="form-group"
                  :class="{ 'has-error': errors.has('tenderName') }"
                >
                  <label class="col-form-label">{{
                    $t("TenderNameMedical")
                  }}</label>

                  <input
                    type="text"
                    name="tenderName"
                    class="form-control"
                    v-model="BasicInfoObj.tenderName"
                    autocomplete="off"
                    disabled
                    :title="BasicInfoObj.tenderName"
                  />
                </div>
              </div>

              <div class="col-md-2">
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

              <div class="col-md-2">
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

              <div class="col-md-2">
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

              <div class="col-md-2">
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
              <div class="col-md-2">
                <div v-if="checkWarrantyAccepted(BasicInfoObj.warrantyLookup)">
                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('Warranty') }"
                  >
                    <label class="col-form-label">{{ $t("Warranty") }}</label>

                    <el-select
                      v-model="BasicInfoObj.warrantyId"
                      disabled
                      :data-vv-as="$t('Warranty')"
                      name="warrantyId"
                      :placeholder="$t('Select')"
                      clearable
                      filterable
                      class="full-width"
                    >
                      <el-option
                        v-for="option in warrantyList"
                        v-bind:value="option.id"
                        :label="option.name"
                        v-bind:key="option.id"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <div v-else>
                  <div
                    class="form-group"
                    :class="{ 'has-error': errors.has('Warranty') }"
                  >
                    <label class="col-form-label">{{ $t("Warranty") }}</label>

                    <input
                      type="text"
                      name="Warranty"
                      class="form-control"
                      v-model="BasicInfoObj.warranty"
                      :data-vv-as="$t('Warranty')"
                      autocomplete="off"
                    />
                    <div class="help-block" v-if="errors.has('Warranty')">
                      {{ errors.first("Warranty") }}
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
      </div>
      <b-collapse id="collapse2" visible>
        <b-card-body
          v-if="
            BasicInfoObj.calculationSheetCurrencyRate.length > 0 &&
            BasicInfoObj.tenderCurrencyCode != ''
          "
        >
          <div class="table-wrapper-scroll-y my-custom-scrollbar col-md-12">
            <table class="table table-bordered table-striped table-sm">
              <thead>
                <tr>
                  <th scope="col" class="pt-1 pb-1 text-center" width="30%">
                    {{ $t("CurrencyName") }}
                  </th>
                  <th scope="col" class="pt-1 pb-1 text-center" width="20%">
                    {{ $t("CurrencyCode") }}
                  </th>
                  <th scope="col" class="pt-1 pb-1 text-center" width="25%">
                    {{ $t("ERPCurrencyRate") }}
                  </th>
                  <th scope="col" class="pt-1 pb-1 text-center" width="25%">
                    {{ $t("CurrencyRateManual") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(
                    currency, index
                  ) in BasicInfoObj.calculationSheetCurrencyRate"
                  v-bind:key="index"
                >
                  <td class="align-middle text-center">
                    {{ currency.currencyName }}
                  </td>
                  <td class="align-middle text-center">
                    {{ currency.currencyCode }}
                  </td>
                  <td class="align-middle text-center">
                    {{ currency.erbCurrencyRate }}
                  </td>
                  <td class="align-middle text-center">
                    <div class="row">
                      <div class="col-sm-10">
                        <input
                          type="text"
                          :id="'t' + index"
                          :name="'t' + index"
                          class="form-control"
                          :class="{ 'has-error': errors.has('t' + index) }"
                          v-model="currency.manualCurrencyRate"
                          v-validate="'required|decimal:4'"
                          autocomplete="off"
                          disabled
                        />
                      </div>
                      <div class="col-sm-1 pl-0">
                        <label class="required">*</label>
                      </div>
                    </div>
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
        {{ $t("calculationSheetGroups") }}

        <div class="card-header-actions"></div>
      </div>

      <b-collapse id="collapse1" visible>
        <b-card-body>
          <b-row>
            <b-col lg="12">
              <el-button
                @click="ShowDialogToFetchItemFromMainConfigs()"
                class="btn btn-secondary mt-1 mb-2"
                >{{ $t("BuildCalculationSheetItem") }}</el-button
              >

              <el-button
                @click="addNewGroup()"
                class="btn btn-secondary mt-1 mb-2"
                v-if="calculationSheetGroups.length == 0"
              >
                <i class="fa fa-plus"></i> {{ $t("newGroup") }}
              </el-button>
              <button
                @click="ExcelsheetDialog = true"
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
                Export Excel
              </button>
            </b-col>
          </b-row>
          <b-row
            v-for="(CalcGroup, index) in calculationSheetGroups"
            :key="index"
          >
            <b-col lg="12" class="parent-card">
              <!-- v-if="CalcGroup.calculationSheetItem.length > 0 " -->
              <el-button
                @click="addNewMainSheetItem(index)"
                class="btn btn-secondary mt-2 mb-2"
              >
                <span class="fa fa-plus"></span>
                {{ $t("Item") }}
              </el-button>
              <b-card class="card card-accent-primary" no-body>
                <div slot="header">
                  <div class="row">
                    <input
                      type="checkbox"
                      v-model="CalcGroup.selected"
                      style="
                        margin-left: 15px;
                        margin-top: 10px;
                        width: 23px;
                        height: 17px;
                      "
                      @click="selectMainGroup(CalcGroup, index)"
                      :id="'name' + index"
                      :name="'name' + index"
                    />
                    <a
                      href="javascript:void(0)"
                      class="text-success"
                      @click="showDuplicateGroupDialog(index)"
                      style="
                        margin-left: 15px;
                        margin-top: 10px;
                        width: 23px;
                        height: 17px;
                      "
                    >
                      <i class="fa fa-copy"></i>
                    </a>
                    <label
                      for="inputEmail3"
                      class="col-sm-1 col-md-1 col-xl-1 col-form-label"
                      >{{ $t("Item") }}-{{ index + 1 }}</label
                    >

                    <div class="row col-md-10 col-lg-10 col-xl-10">
                      <div class="col-md-2 col-lg-2 col-xl-2">
                        <div class="form-group">
                          <label class="col-form-label">{{ $t("name") }}</label>
                          <el-input
                            type="text"
                            id="inputEmail3"
                            v-model="CalcGroup.name"
                            size="mini"
                            :maxlength="$store.getters.getMaxLength.length200"
                          ></el-input>
                        </div>
                      </div>
                      <div class="col-md-2 col-lg-2 col-xl-2">
                        <div class="form-group">
                          <label class="col-form-label">{{
                            $t("TenderItemNumber")
                          }}</label>
                          <el-input
                            type="text"
                            id="inputEmail4"
                            v-model="CalcGroup.number"
                            size="mini"
                            :maxlength="$store.getters.getMaxLength.length30"
                          ></el-input>
                        </div>
                      </div>
                      <div class="col-md-2 col-lg-2 col-xl-2">
                        <div class="form-group">
                          <label class="col-form-label">{{
                            $t("DeliveryTerms")
                          }}</label>
                          <el-input
                            id="inputEmail3"
                            v-model="CalcGroup.deliveryTerms"
                            size="mini"
                            :maxlength="$store.getters.getMaxLength.length30"
                          >
                          </el-input>
                        </div>
                      </div>
                      <div class="col-md-2 col-lg-2 col-xl-2">
                        <div class="form-group">
                          <div
                            v-if="
                              checkWarrantyAccepted(
                                BasicInfoObj.warrantyLookup,
                                CalcGroup
                              )
                            "
                          >
                            <div
                              class="form-group"
                              :class="{ 'has-error': errors.has('Warranty') }"
                            >
                              <label class="col-form-label">{{
                                $t("Warranty")
                              }}</label>

                              <input
                                type="text"
                                :key="'items-' + CalcGroup.id"
                                disabled
                                name="Warranty"
                                class="form-control"
                                v-model="CalcGroup.warranty"
                                :data-vv-as="$t('Warranty')"
                                autocomplete="off"
                              />
                              <div
                                class="help-block"
                                v-if="errors.has('Warranty')"
                              >
                                {{ errors.first("Warranty") }}
                              </div>
                            </div>
                          </div>
                          <div v-else>
                            <div
                              class="form-group"
                              :class="{ 'has-error': errors.has('Warranty') }"
                            >
                              <label class="col-form-label">{{
                                $t("Warranty")
                              }}</label>

                              <input
                                type="text"
                                name="Warranty"
                                class="form-control"
                                v-model="CalcGroup.warranty"
                                :data-vv-as="$t('Warranty')"
                                autocomplete="off"
                              />
                              <div
                                class="help-block"
                                v-if="errors.has('Warranty')"
                              >
                                {{ errors.first("Warranty") }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="row col-md-12 col-lg-12 col-xl-12 m-1">
                        <hr width="100%" style="border: 1px solid gray" />
                      </div>

                      <div class="row col-md-12 col-lg-12 col-xl-12">
                        <div class="col-md-2 col-lg-2 col-xl-2">
                          <div class="form-group">
                            <label class="col-form-label">{{
                              $t("Currency")
                            }}</label>
                            <el-select
                              :loading="loadingAccount"
                              v-model="CalcGroup.bulkObj.currencyCode"
                              clearable
                              filterable
                              class="full-width padding-0"
                              size="mini"
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
                        <div class="col-md-2 col-lg-2 col-xl-2">
                          <div class="form-group">
                            <label class="col-form-label">{{
                              $t("Discount1")
                            }}</label>
                            <el-input
                              v-model="CalcGroup.bulkObj.discount1"
                              size="mini"
                              autocomplete="off"
                            ></el-input>
                          </div>
                        </div>
                        <div class="col-md-2 col-lg-2 col-xl-2">
                          <div class="form-group">
                            <label class="col-form-label">{{
                              $t("Discount2")
                            }}</label>
                            <el-input
                              v-model="CalcGroup.bulkObj.discount2"
                              size="mini"
                              autocomplete="off"
                            ></el-input>
                          </div>
                        </div>
                        <div class="col-md-2 col-lg-2 col-xl-2">
                          <div class="form-group">
                            <label class="col-form-label">{{
                              $t("ShipmentSG")
                            }}</label>
                            <el-input
                              v-model="CalcGroup.bulkObj.shipment"
                              size="mini"
                              autocomplete="off"
                            ></el-input>
                          </div>
                        </div>
                        <div class="col-md-2 col-lg-2 col-xl-2">
                          <div class="form-group">
                            <label class="col-form-label">{{
                              $t("GrossMargin")
                            }}</label>
                            <el-input
                              v-model="CalcGroup.bulkObj.grossMargin"
                              size="mini"
                              autocomplete="off"
                            ></el-input>
                          </div>
                        </div>
                        <div class="col-md-2 col-lg-2 col-xl-2">
                          <div class="form-group">
                            <label class="col-form-label">{{
                              $t("Quantity")
                            }}</label>
                            <el-input
                              v-model="CalcGroup.bulkObj.quantity"
                              size="mini"
                              autocomplete="off"
                            ></el-input>
                          </div>
                        </div>
                        <div class="col-md-2 col-lg-2 col-xl-2">
                          <div class="form-group">
                            <label class="col-form-label">{{
                              $t("CostType")
                            }}</label>
                            <el-select
                              v-model="CalcGroup.bulkObj.costType"
                              clearable
                              filterable
                              name="CostType"
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
                          </div>
                        </div>

                        <div class="col-md-2 col-lg-2 col-xl-2">
                          <div class="form-group">
                            <button
                              type="submit"
                              class="btn btn-success bulk"
                              @click="addBulkItems(CalcGroup)"
                            >
                              <i class="fa fa-plus"></i>
                              {{ $t("bulkUpdate") }}
                            </button>
                          </div>
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
                        :data="CalcGroup.calculationSheetItem"
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
                        <el-table-column label width="50" fixed>
                          <template slot-scope="scope">
                            <a
                              class="text-danger"
                              @mousedown="
                                removeCalcuationSheetMainItems(index, scope.row)
                              "
                            >
                              <i class="fa fa-trash"></i> </a
                            >&nbsp;
                            <a
                              href="javascript:void(0)"
                              class="text-success"
                              @click="duplicateRow(index, scope.row)"
                            >
                              <i class="fa fa-copy"></i>
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
                          label="Item code"
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
                                  class="full-width"
                                  @change="getItemCodeName(scope.row)"
                                >
                                  <el-option
                                    v-for="item in systemItemsList"
                                    :key="item.id"
                                    :label="item.code"
                                    :value="item.code"
                                  ></el-option> </el-select
                              ></b-col>
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
                          label="item description"
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
                          label="Vendor"
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
                        <!--<el-table-column prop="onHandPriceCurrencySymbol" label=" " width="70">
                                                    <template slot-scope="scope">
                                                        <el-input :value="scope.row.onHandPriceCurrencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                                                        
                                                        </el-input>
                                                    </template>
                                                </el-table-column>-->
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
                          prop="discount1"
                          label="Disc1%"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.discount1"
                              @input="handleDecimal(scope.row)"
                              @change="calculatorMainItemChange(scope.row)"
                              size="mini"
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="discount2"
                          label="Disc2%"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.discount2"
                              @input="handleDecimal(scope.row)"
                              @change="calculatorMainItemChange(scope.row)"
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
                          prop="foc"
                          label="Discount"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <label class="form-checkbox pb-1"></label>
                            <input
                              type="checkbox"
                              v-model="scope.row.foc"
                              @click="changeFoc(scope.row)"
                              :id="'foc' + scope.$index"
                              :name="'foc' + scope.$index"
                            />
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="foC_Value"
                          label="Disc %"
                          width="150"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.foC_Value"
                              :disabled="!scope.row.foc"
                              @change="calculatorMainItemChange(scope.row)"
                              size="mini"
                              autocomplete="off"
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
                              @input="handleDecimal(scope.row)"
                              @change="
                                calculatorShipmentMarginItemChange(scope.row)
                              "
                              v-model="scope.row.grossMargin"
                              size="mini"
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="unitPrice"
                          label="Unit price"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.unitPrice"
                              size="mini"
                              disabled
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
                          prop="Quantity"
                          label="Quantity"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.quantity"
                              @change="calculatorMainItemChange(scope.row)"
                              size="mini"
                              autocomplete="off"
                            >
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="amount"
                          label="Total price"
                          width="120"
                        >
                          <template slot-scope="scope">
                            <el-input
                              v-model="scope.row.amount"
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
                      <b-col lg="6">
                        <!-- <el-button
                                            v-if=" CalcGroup.calculationSheetAlternativeGroup.length > 0 "
                                            @click="addNewMainSheetItem(index)"
                                            class="btn btn-secondary mt-2 mb-2">
                                            <span class="fa fa-plus"></span>
                                            {{$t('Item')}}
                                            </el-button>

                                            <el-button
                                            @click="addNewMainSheetItem(index)"
                                            v-if=" !CalcGroup.calculationSheetAlternativeGroup.length >0 "
                                            class="btn btn-secondary"
                                            >
                                            <span class="fa fa-plus"></span>
                                            {{$t('Item')}}
                                            </el-button> -->

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
                          class="btn btn-secondary"
                          >{{
                            $t("BuildCalculationSheetForAlternative")
                          }}</el-button
                        >
                      </b-col>
                      <b-col lg="2"
                        >{{ $t("TotalLandedCost") }}
                        {{ CalcGroup.totalCost | toUSD }}
                        <strong>{{ calculationSheetCode }}</strong></b-col
                      >
                      <b-col lg="2"
                        >{{ $t("TotalMargin") }}
                        {{ CalcGroup.totalMargin | toUSD }}
                        <strong>{{ calculationSheetCode }}</strong></b-col
                      >
                      <b-col lg="2"
                        >{{ $t("TotalAmount") }}
                        {{ CalcGroup.totalAmount | toUSD }}
                        <strong>{{ calculationSheetCode }}</strong></b-col
                      >

                      <b-col lg="2"
                        >{{ $t("margin%") }}
                        {{
                          getMargin(
                            CalcGroup.totalMargin,
                            CalcGroup.totalAmount
                          )
                        }}%
                      </b-col>
                      <b-col lg="2"
                        >{{ $t("S&C") }}
                        {{
                          getSC(CalcGroup.totalCost, CalcGroup.totalCostRaw)
                        }}%
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col>
                        <el-button
                          @click="addNewOptionalGroup(index)"
                          v-if="!CalcGroup.calculationSheetOptionalGroup"
                          class="btn btn-secondary mt-1"
                        >
                          <span class="fa fa-plus"></span>
                          {{ $t("addoptional") }}
                        </el-button>
                      </b-col>
                    </b-row>
                    <b-row
                      class="mt-1"
                      v-if="
                        CalcGroup.calculationSheetOptionalGroup &&
                        CalcGroup.calculationSheetOptionalGroup
                          .calculationSheetItem.length > 0
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
                    <b-card
                      class="card card-accent-primary mt-0"
                      v-if="CalcGroup.calculationSheetOptionalGroup"
                    >
                      <div slot="header">
                        <div class="row">
                          <label
                            class="col-sm-1 col-md-1 col-xl-1 col-form-label"
                            >{{ $t("Item") }}-{{ index + 1 }}
                            {{ $t("optionalItems") }}</label
                          >
                          <div class="row col-md-10 col-lg-10 col-xl-10">
                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <div class="form-group">
                                <label class="col-form-label">{{
                                  $t("Currency")
                                }}</label>
                                <el-select
                                  :loading="loadingAccount"
                                  v-model="
                                    CalcGroup.calculationSheetOptionalGroup
                                      .bulkObj.currencyCode
                                  "
                                  clearable
                                  filterable
                                  class="full-width padding-0"
                                  size="mini"
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
                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <div class="form-group">
                                <label class="col-form-label">{{
                                  $t("Discount1")
                                }}</label>
                                <el-input
                                  v-model="
                                    CalcGroup.calculationSheetOptionalGroup
                                      .bulkObj.discount1
                                  "
                                  size="mini"
                                  autocomplete="off"
                                ></el-input>
                              </div>
                            </div>
                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <div class="form-group">
                                <label class="col-form-label">{{
                                  $t("Discount2")
                                }}</label>
                                <el-input
                                  v-model="
                                    CalcGroup.calculationSheetOptionalGroup
                                      .bulkObj.discount2
                                  "
                                  size="mini"
                                  autocomplete="off"
                                ></el-input>
                              </div>
                            </div>
                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <div class="form-group">
                                <label class="col-form-label">{{
                                  $t("ShipmentSG")
                                }}</label>
                                <el-input
                                  v-model="
                                    CalcGroup.calculationSheetOptionalGroup
                                      .bulkObj.shipment
                                  "
                                  size="mini"
                                  autocomplete="off"
                                ></el-input>
                              </div>
                            </div>
                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <div class="form-group">
                                <label class="col-form-label">{{
                                  $t("GrossMargin")
                                }}</label>
                                <el-input
                                  v-model="
                                    CalcGroup.calculationSheetOptionalGroup
                                      .bulkObj.grossMargin
                                  "
                                  size="mini"
                                  autocomplete="off"
                                ></el-input>
                              </div>
                            </div>
                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <div class="form-group">
                                <label class="col-form-label">{{
                                  $t("Quantity")
                                }}</label>
                                <el-input
                                  v-model="
                                    CalcGroup.calculationSheetOptionalGroup
                                      .bulkObj.quantity
                                  "
                                  size="mini"
                                  autocomplete="off"
                                ></el-input>
                              </div>
                            </div>
                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <div class="form-group">
                                <label class="col-form-label">{{
                                  $t("CostType")
                                }}</label>
                                <el-select
                                  v-model="
                                    CalcGroup.calculationSheetOptionalGroup
                                      .bulkObj.costType
                                  "
                                  clearable
                                  filterable
                                  name="CostType"
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
                              </div>
                            </div>
                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <div class="form-group">
                                <button
                                  type="submit"
                                  class="btn btn-success bulk"
                                  @click="addBulkOptionalItems(CalcGroup)"
                                >
                                  <i class="fa fa-plus"></i>
                                  {{ $t("bulkUpdate") }}
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="pabsolute">
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
                        </div>
                      </div>
                      <b-collapse :id="'ItemoptionalGroup-' + index" visible>
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

                            <el-table-column label width="60" fixed>
                              <template slot-scope="scope">
                                <a
                                  class="text-danger"
                                  @mousedown="
                                    removeOptionalItem(index, scope.row)
                                  "
                                >
                                  <i class="fa fa-trash"></i>
                                </a>
                                &nbsp;
                                <a
                                  href="javascript:void(0)"
                                  class="text-success"
                                  @click="
                                    duplicateOptionalRow(index, scope.row)
                                  "
                                >
                                  <i class="fa fa-copy"></i>
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
                              label="Item code"
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
                              label="item description"
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
                              label="Vendor"
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
                            <!--<el-table-column prop="onHandPriceCurrencySymbol" label=" " width="70">
                                                        <template slot-scope="scope">
                                                            <el-input :value="scope.row.onHandPriceCurrencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                                                            
                                                            </el-input>
                                                        </template>
                                                    </el-table-column>-->
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
                              prop="discount1"
                              label="Disc1%"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.discount1"
                                  @input="handleDecimal(scope.row)"
                                  @change="calculatorMainItemChange(scope.row)"
                                  size="mini"
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="discount2"
                              label="Disc2%"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.discount2"
                                  @change="calculatorMainItemChange(scope.row)"
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
                              prop="shipment"
                              label="S&C%"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
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
                              prop="foc"
                              label="Discount"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <label class="form-checkbox pb-1"></label>
                                <input
                                  type="checkbox"
                                  v-model="scope.row.foc"
                                  @click="changeFoc(scope.row)"
                                  :id="'foc' + scope.$index"
                                  :name="'foc' + scope.$index"
                                />
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="foC_Value"
                              label="Disc %"
                              width="150"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.foC_Value"
                                  :disabled="!scope.row.foc"
                                  @change="calculatorMainItemChange(scope.row)"
                                  size="mini"
                                  autocomplete="off"
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
                                  @input="handleDecimal(scope.row)"
                                  @change="
                                    calculatorShipmentMarginItemChange(
                                      scope.row
                                    )
                                  "
                                  v-model="scope.row.grossMargin"
                                  size="mini"
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="unitPrice"
                              label="Unit price"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.unitPrice"
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
                              prop="Quantity"
                              label="Quantity"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.quantity"
                                  @change="calculatorMainItemChange(scope.row)"
                                  size="mini"
                                  autocomplete="off"
                                >
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                              prop="amount"
                              label="Total price"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.amount"
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
                              prop="Gross margin"
                              label="Gross margin"
                              width="120"
                            >
                              <template slot-scope="scope">
                                <el-input
                                  v-model="scope.row.grossMarginValue"
                                  disabled
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
                          <b-col lg="5">
                            <!-- <el-button
                                                @click="addNewOptionalItem(index)"
                                                class="btn btn-secondary mt-2 mb-1"
                                                >
                                                <span class="fa fa-plus"></span>
                                                {{$t('Item')}}
                                                </el-button> -->
                          </b-col>
                          <b-col lg="3"
                            >{{ $t("TotalLandedCost") }}
                            {{
                              CalcGroup.calculationSheetOptionalGroup.totalCost
                                | toUSD
                            }}
                            <strong>{{ calculationSheetCode }}</strong></b-col
                          >
                          <b-col lg="2"
                            >{{ $t("TotalMargin") }}
                            {{
                              CalcGroup.calculationSheetOptionalGroup
                                .totalMargin | toUSD
                            }}
                            <strong>{{ calculationSheetCode }}</strong></b-col
                          >

                          <b-col lg="2"
                            >{{ $t("TotalAmount") }}
                            {{
                              CalcGroup.calculationSheetOptionalGroup
                                .totalAmount | toUSD
                            }}
                            <strong>{{ calculationSheetCode }}</strong></b-col
                          >

                          <b-col lg="2"
                            >{{ $t("margin%") }}
                            {{
                              getMargin(
                                CalcGroup.calculationSheetOptionalGroup
                                  .totalMargin,
                                CalcGroup.calculationSheetOptionalGroup
                                  .totalAmount
                              )
                            }}%
                          </b-col>
                          <b-col lg="2"
                            >{{ $t("S&C") }}
                            {{
                              getSC(
                                CalcGroup.calculationSheetOptionalGroup
                                  .totalCost,
                                CalcGroup.calculationSheetOptionalGroup
                                  .totalCostRaw
                              )
                            }}%
                          </b-col>
                        </b-row>
                      </b-collapse>
                    </b-card>

                    <b-card
                      class="card card-accent-primary mt-60"
                      no-body
                      v-for="(
                        alternativeGroup, alternativeGroupIndex
                      ) in CalcGroup.calculationSheetAlternativeGroup"
                      :key="alternativeGroupIndex"
                    >
                      <b-row class="mt-1 float-button">
                        <b-col lg="5">
                          <el-button
                            @click="
                              addNewAternativeItem(index, alternativeGroupIndex)
                            "
                            class="btn btn-secondary mt-2 mb-1"
                          >
                            <span class="fa fa-plus"></span>
                            {{ $t("Item") }}
                          </el-button>
                        </b-col>
                      </b-row>
                      <div slot="header">
                        <div class="row">
                          <input
                            type="checkbox"
                            v-model="alternativeGroup.selected"
                            style="
                              margin-left: 15px;
                              margin-top: 10px;
                              width: 23px;
                              height: 17px;
                            "
                            @click="
                              selectAlternativGroup(
                                alternativeGroupIndex,
                                index
                              )
                            "
                            :id="'name' + index"
                            :name="'name' + index"
                          />
                          <!-- <label for="inputEmail3" class="col-sm-2 col-form-label">{{ $t('AlternativeGroup')}} {{ alternativeGroupIndex+1}}</label> -->
                          <!-- <label for="inputEmail3" class="col-form-label">{{ $t('name')}}</label> -->
                          <label
                            for="inputEmail3"
                            class="col-sm-1 col-md-1 col-xl-1 col-form-label"
                            >{{ $t("AlternativeGroup") }}
                            {{ alternativeGroupIndex + 1 }}</label
                          >
                          <div class="row col-md-10 col-lg-10 col-xl-10">
                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <div class="form-group">
                                <label class="col-form-label">{{
                                  $t("Name")
                                }}</label>
                                <el-input
                                  :maxlength="
                                    $store.getters.getMaxLength.length30
                                  "
                                  v-model="alternativeGroup.name"
                                  size="mini"
                                  autocomplete="off"
                                ></el-input>
                              </div>
                            </div>

                            <div class="row col-md-12 col-lg-12 col-xl-12 m-1">
                              <hr width="100%" style="border: 1px solid gray" />
                            </div>

                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <div class="form-group">
                                <label class="col-form-label">{{
                                  $t("Currency")
                                }}</label>
                                <el-select
                                  :loading="loadingAccount"
                                  v-model="
                                    alternativeGroup.bulkObj.currencyCode
                                  "
                                  clearable
                                  filterable
                                  class="full-width padding-0"
                                  size="mini"
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
                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <div class="form-group">
                                <label class="col-form-label">{{
                                  $t("Discount1")
                                }}</label>
                                <el-input
                                  v-model="alternativeGroup.bulkObj.discount1"
                                  size="mini"
                                  autocomplete="off"
                                ></el-input>
                              </div>
                            </div>
                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <div class="form-group">
                                <label class="col-form-label">{{
                                  $t("Discount2")
                                }}</label>
                                <el-input
                                  v-model="alternativeGroup.bulkObj.discount2"
                                  size="mini"
                                  autocomplete="off"
                                ></el-input>
                              </div>
                            </div>
                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <div class="form-group">
                                <label class="col-form-label">{{
                                  $t("ShipmentSG")
                                }}</label>
                                <el-input
                                  v-model="alternativeGroup.bulkObj.shipment"
                                  size="mini"
                                  autocomplete="off"
                                ></el-input>
                              </div>
                            </div>
                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <div class="form-group">
                                <label class="col-form-label">{{
                                  $t("GrossMargin")
                                }}</label>
                                <el-input
                                  v-model="alternativeGroup.bulkObj.grossMargin"
                                  size="mini"
                                  autocomplete="off"
                                ></el-input>
                              </div>
                            </div>
                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <div class="form-group">
                                <label class="col-form-label">{{
                                  $t("Quantity")
                                }}</label>
                                <el-input
                                  v-model="alternativeGroup.bulkObj.quantity"
                                  size="mini"
                                  autocomplete="off"
                                ></el-input>
                              </div>
                            </div>
                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <div class="form-group">
                                <label class="col-form-label">{{
                                  $t("CostType")
                                }}</label>
                                <el-select
                                  v-model="alternativeGroup.bulkObj.costType"
                                  clearable
                                  filterable
                                  name="CostType"
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
                              </div>
                            </div>
                            <div class="col-md-2 col-lg-2 col-xl-2">
                              <div class="form-group">
                                <button
                                  type="submit"
                                  class="btn btn-success bulk"
                                  @click="
                                    addBulkAlternativeItems(
                                      CalcGroup,
                                      alternativeGroupIndex
                                    )
                                  "
                                >
                                  <i class="fa fa-plus"></i>
                                  {{ $t("bulkUpdate") }}
                                </button>
                              </div>
                            </div>
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
                              :data="alternativeGroup.calculationSheetItem"
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

                              <el-table-column label width="60" fixed>
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
                                    <i class="fa fa-trash"></i> </a
                                  >&nbsp;
                                  <a
                                    href="javascript:void(0)"
                                    class="text-success"
                                    @click="
                                      duplicateAlternativeItem(
                                        index,
                                        alternativeGroupIndex,
                                        scope.row
                                      )
                                    "
                                  >
                                    <i class="fa fa-copy"></i>
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
                                label="Item code"
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
                                label="item description"
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
                                label="Vendor"
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
                              <!--<el-table-column prop="onHandPriceCurrencySymbol" label=" " width="70">
                                    <template slot-scope="scope">
                                        <el-input :value="scope.row.onHandPriceCurrencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                                        
                                        </el-input>
                                    </template>
                                </el-table-column>-->
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
                                prop="discount1"
                                label="Disc1%"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.discount1"
                                    @input="handleDecimal(scope.row)"
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
                                prop="discount2"
                                label="Disc2%"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.discount2"
                                    @input="handleDecimal(scope.row)"
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
                                prop="shipment"
                                label="S&C%"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
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
                                prop="foc"
                                label="Discount"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <label class="form-checkbox pb-1"></label>
                                  <input
                                    type="checkbox"
                                    v-model="scope.row.foc"
                                    @click="changeFoc(scope.row)"
                                    :id="'foc' + scope.$index"
                                    :name="'foc' + scope.$index"
                                  />
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="foC_Value"
                                label="Disc %"
                                width="150"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.foC_Value"
                                    :disabled="!scope.row.foc"
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
                                prop="grossMargin"
                                label="GM%"
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
                                    v-model="scope.row.grossMargin"
                                    size="mini"
                                    autocomplete="off"
                                  >
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column
                                prop="unitPrice"
                                label="Unit price"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.unitPrice"
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
                                prop="Quantity"
                                label="Quantity"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.quantity"
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
                                prop="amount"
                                label="Total price"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.amount"
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
                                prop="Gross margin"
                                label="Gross margin"
                                width="120"
                              >
                                <template slot-scope="scope">
                                  <el-input
                                    v-model="scope.row.grossMarginValue"
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
                            <b-col lg="3">
                              <!-- <el-button
                                    @click="addNewAternativeItem(index,alternativeGroupIndex)"
                                    class="btn btn-secondary mt-2 mb-1">
                                    <span class="fa fa-plus"></span>
                                    {{$t("Item")}}
                              </el-button> -->
                              <el-button
                                @click="
                                  addNewAternativeOptionalGroup(
                                    index,
                                    alternativeGroupIndex
                                  )
                                "
                                v-if="
                                  !alternativeGroup.calculationSheetAlternativeOptionalGroup
                                "
                                class="btn btn-secondary"
                              >
                                <span class="fa fa-plus"></span>
                                {{ $t("addoptional") }}
                              </el-button>
                            </b-col>

                            <b-col lg="2"
                              >{{ $t("TotalLandedCost") }}
                              {{ alternativeGroup.totalCost | toUSD }}
                              <strong>{{ calculationSheetCode }}</strong></b-col
                            >
                            <b-col lg="2"
                              >{{ $t("TotalMargin") }}
                              {{ alternativeGroup.totalMargin | toUSD }}
                              <strong>{{ calculationSheetCode }}</strong></b-col
                            >
                            <b-col lg="2"
                              >{{ $t("TotalAmount") }}
                              {{ alternativeGroup.totalAmount | toUSD }}
                              <strong>{{ calculationSheetCode }}</strong></b-col
                            >

                            <b-col lg="2"
                              >{{ $t("margin%") }}
                              {{
                                getMargin(
                                  alternativeGroup.totalMargin,
                                  alternativeGroup.totalAmount
                                )
                              }}%
                            </b-col>
                            <b-col lg="1"
                              >{{ $t("S&C") }}
                              {{
                                getSC(
                                  alternativeGroup.totalCost,
                                  alternativeGroup.totalCostRaw
                                )
                              }}%
                            </b-col>
                          </b-row>

                          <b-row
                            class="mt-1"
                            v-if="
                              alternativeGroup.calculationSheetAlternativeOptionalGroup &&
                              alternativeGroup
                                .calculationSheetAlternativeOptionalGroup
                                .calculationSheetItem.length > 0
                            "
                          >
                            <b-col lg="5">
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
                          </b-row>
                          <b-card
                            class="card card-accent-primary mt-0"
                            v-if="
                              alternativeGroup.calculationSheetAlternativeOptionalGroup !=
                              null
                            "
                          >
                            <div slot="header">
                              <div class="row">
                                <label
                                  class="col-sm-1 col-md-1 col-xl-1 col-form-label"
                                  >{{ $t("AlternativeGroup") }}
                                  {{ alternativeGroupIndex + 1 }}
                                  {{ $t("optionalItems") }}</label
                                >
                                <div class="row col-md-10 col-lg-10 col-xl-10">
                                  <div class="col-md-2 col-lg-2 col-xl-2">
                                    <div class="form-group">
                                      <label class="col-form-label">{{
                                        $t("Currency")
                                      }}</label>
                                      <el-select
                                        :loading="loadingAccount"
                                        v-model="
                                          alternativeGroup
                                            .calculationSheetAlternativeOptionalGroup
                                            .bulkObj.currencyCode
                                        "
                                        clearable
                                        filterable
                                        class="full-width padding-0"
                                        size="mini"
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
                                  <div class="col-md-2 col-lg-2 col-xl-2">
                                    <div class="form-group">
                                      <label class="col-form-label">{{
                                        $t("Discount1")
                                      }}</label>
                                      <el-input
                                        v-model="
                                          alternativeGroup
                                            .calculationSheetAlternativeOptionalGroup
                                            .bulkObj.discount1
                                        "
                                        size="mini"
                                        autocomplete="off"
                                      ></el-input>
                                    </div>
                                  </div>
                                  <div class="col-md-2 col-lg-2 col-xl-2">
                                    <div class="form-group">
                                      <label class="col-form-label">{{
                                        $t("Discount2")
                                      }}</label>
                                      <el-input
                                        v-model="
                                          alternativeGroup
                                            .calculationSheetAlternativeOptionalGroup
                                            .bulkObj.discount2
                                        "
                                        size="mini"
                                        autocomplete="off"
                                      ></el-input>
                                    </div>
                                  </div>
                                  <div class="col-md-2 col-lg-2 col-xl-2">
                                    <div class="form-group">
                                      <label class="col-form-label">{{
                                        $t("ShipmentSG")
                                      }}</label>
                                      <el-input
                                        v-model="
                                          alternativeGroup
                                            .calculationSheetAlternativeOptionalGroup
                                            .bulkObj.shipment
                                        "
                                        size="mini"
                                        autocomplete="off"
                                      ></el-input>
                                    </div>
                                  </div>
                                  <div class="col-md-2 col-lg-2 col-xl-2">
                                    <div class="form-group">
                                      <label class="col-form-label">{{
                                        $t("GrossMargin")
                                      }}</label>
                                      <el-input
                                        v-model="
                                          alternativeGroup
                                            .calculationSheetAlternativeOptionalGroup
                                            .bulkObj.grossMargin
                                        "
                                        size="mini"
                                        autocomplete="off"
                                      ></el-input>
                                    </div>
                                  </div>
                                  <div class="col-md-2 col-lg-2 col-xl-2">
                                    <div class="form-group">
                                      <label class="col-form-label">{{
                                        $t("Quantity")
                                      }}</label>
                                      <el-input
                                        v-model="
                                          alternativeGroup
                                            .calculationSheetAlternativeOptionalGroup
                                            .bulkObj.quantity
                                        "
                                        size="mini"
                                        autocomplete="off"
                                      ></el-input>
                                    </div>
                                  </div>
                                  <div class="col-md-2 col-lg-2 col-xl-2">
                                    <div class="form-group">
                                      <label class="col-form-label">{{
                                        $t("CostType")
                                      }}</label>
                                      <el-select
                                        v-model="
                                          alternativeGroup
                                            .calculationSheetAlternativeOptionalGroup
                                            .bulkObj.costType
                                        "
                                        clearable
                                        filterable
                                        name="CostType"
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
                                    </div>
                                  </div>
                                  <div class="col-md-2 col-lg-2 col-xl-2">
                                    <div class="form-group">
                                      <button
                                        type="submit"
                                        class="btn btn-success bulk"
                                        @click="
                                          addBulkAlternativeOptionalItems(
                                            CalcGroup,
                                            alternativeGroupIndex
                                          )
                                        "
                                      >
                                        <i class="fa fa-plus"></i>
                                        {{ $t("bulkUpdate") }}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div class="pabsolute">
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
                              </div>
                            </div>
                            <b-collapse :id="'optionalGroup-' + index" visible>
                              <div class="table-responsive-lg table-responsive">
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

                                  <el-table-column label width="60" fixed>
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
                                        <i class="fa fa-trash"></i> </a
                                      >&nbsp;
                                      <a
                                        href="javascript:void(0)"
                                        class="text-success"
                                        @click="
                                          duplicateAlternativeOptionalItem(
                                            index,
                                            alternativeGroupIndex,
                                            scope.row
                                          )
                                        "
                                      >
                                        <i class="fa fa-copy"></i>
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
                                    label="Item code"
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
                                            class="full-width"
                                            @change="getItemCodeName(scope.row)"
                                          >
                                            <el-option
                                              v-for="item in systemItemsList"
                                              :key="item.id"
                                              :label="item.code"
                                              :value="item.code"
                                            ></el-option> </el-select
                                        ></b-col>
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
                                    label="item description"
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
                                    label="Vendor"
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
                                  <!--<el-table-column prop="onHandPriceCurrencySymbol" label=" " width="70">
                                        <template slot-scope="scope">
                                            <el-input :value="scope.row.onHandPriceCurrencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                                            
                                            </el-input>
                                        </template>
                                    </el-table-column>-->
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
                                    prop="discount1"
                                    label="Disc1%"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="scope.row.discount1"
                                        @input="handleDecimal(scope.row)"
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
                                    prop="discount2"
                                    label="Disc2%"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="scope.row.discount2"
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
                                    prop="shipment"
                                    label="S&C%"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
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
                                    prop="foc"
                                    label="Discount"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <label class="form-checkbox pb-1"></label>
                                      <input
                                        type="checkbox"
                                        v-model="scope.row.foc"
                                        @click="changeFoc(scope.row)"
                                        :id="'foc' + scope.$index"
                                        :name="'foc' + scope.$index"
                                      />
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="foC_Value"
                                    label="Disc %"
                                    width="150"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="scope.row.foC_Value"
                                        :disabled="!scope.row.foc"
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
                                    prop="grossMargin"
                                    label="GM%"
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
                                        v-model="scope.row.grossMargin"
                                        size="mini"
                                        autocomplete="off"
                                      >
                                      </el-input>
                                    </template>
                                  </el-table-column>
                                  <el-table-column
                                    prop="unitPrice"
                                    label="Unit price"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="scope.row.unitPrice"
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
                                    prop="Quantity"
                                    label="Quantity"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="scope.row.quantity"
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
                                    prop="amount"
                                    label="Total price"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
                                        v-model="scope.row.amount"
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
                                    prop="Gross margin"
                                    label="Gross margin"
                                    width="120"
                                  >
                                    <template slot-scope="scope">
                                      <el-input
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
                                <b-col lg="5">
                                  <!-- <el-button
                                    @click="addNewAlternativeOptionalItem(index,alternativeGroupIndex)"
                                    class="btn btn-secondary mt-2 mb-1">
                                    <span class="fa fa-plus"></span>
                                    {{$t('Item')}}
                                  </el-button> -->
                                </b-col>
                                <b-col lg="3"
                                  >{{ $t("TotalLandedCost") }}
                                  {{
                                    alternativeGroup
                                      .calculationSheetAlternativeOptionalGroup
                                      .totalCost | toUSD
                                  }}
                                  <strong>{{
                                    calculationSheetCode
                                  }}</strong></b-col
                                >
                                <b-col lg="2"
                                  >{{ $t("TotalMargin") }}
                                  {{
                                    alternativeGroup
                                      .calculationSheetAlternativeOptionalGroup
                                      .totalMargin | toUSD
                                  }}
                                  <strong>{{
                                    calculationSheetCode
                                  }}</strong></b-col
                                >
                                <b-col lg="2"
                                  >{{ $t("TotalAmount") }}
                                  {{
                                    alternativeGroup
                                      .calculationSheetAlternativeOptionalGroup
                                      .totalAmount | toUSD
                                  }}
                                  <strong>{{
                                    calculationSheetCode
                                  }}</strong></b-col
                                >
                                <b-col lg="2"
                                  >{{ $t("margin%") }}
                                  {{
                                    getMargin(
                                      alternativeGroup
                                        .calculationSheetAlternativeOptionalGroup
                                        .totalMargin,
                                      alternativeGroup
                                        .calculationSheetAlternativeOptionalGroup
                                        .totalAmount
                                    )
                                  }}%
                                </b-col>

                                <b-col lg="2"
                                  >{{ $t("S&C") }}
                                  {{
                                    getSC(
                                      alternativeGroup
                                        .calculationSheetAlternativeOptionalGroup
                                        .totalCost,
                                      alternativeGroup
                                        .calculationSheetAlternativeOptionalGroup
                                        .totalCostRaw
                                    )
                                  }}%
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
                v-if="calculationSheetGroups.length > 0"
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
                <div class="col-md-3">
                  <div>{{ $t("BankGuarantee") }}</div>
                  <div>
                    <div class="row">
                      <div class="col-md-6">
                        <el-select
                          class="input-custom"
                          v-model="bankBlockViewModel.bankGuaranteeType"
                          :placeholder="$t('Select')"
                          :disabled="bankGuaranteeDisabled"
                          name="bankGuarantee"
                          data-vv-scope="EventCreationValidation"
                          clearable
                          filterable
                        >
                          <el-option
                            :value="true"
                            label="percentage"
                            :key="true"
                          ></el-option>
                          <el-option
                            :value="false"
                            label="value"
                            :key="false"
                          ></el-option>
                        </el-select>
                      </div>
                      <div class="col-md-6">
                        <input
                          type="text"
                          class="form-control"
                          v-model="bankBlockViewModel.bankGuarantee"
                          :disabled="bankGuaranteeDisabled"
                          autocomplete="off"
                          :maxlength="$store.getters.getMaxLength.length30"
                        />
                      </div>
                    </div>
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
                      min="0"
                      class="form-control"
                      v-model="bankBlockViewModel.bankGuaranteeValidTill"
                      :disabled="bankGuaranteeDisabled"
                      autocomplete="off"
                    />
                  </div>
                </div>
                <div class="col-md-2">
                  <div>{{ $t("GuaranteeType") }}</div>
                  <div>
                    <el-select
                      class="input-custom"
                      v-model="bankBlockViewModel.guaranteeType"
                      :disabled="bankGuaranteeDisabled"
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
                      class="input-custom"
                      v-model="bankBlockViewModel.guaranteeDeliveryLocation"
                      :disabled="bankGuaranteeDisabled"
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
              <div class="row mb-2 mt-2 mr-1 ml-1">
                <div class="col-md-3">
                  <div>{{ $t("SheetTotalAmount") }}</div>
                  <div>
                    <label>
                      {{ bankBlockViewModel.totalAmount | toUSD }}
                      <strong>{{ calculationSheetCode }}</strong>
                      <!-- <strong
                        v-if="calculationSheetCode === 'Dollar'"
                      >{{calculationSheetCode}}</strong>
                      <strong v-if="calculationSheetCode === 'Dinar'">JD</strong>
                      <strong v-if="calculationSheetCode === 'Shekel'">NIS</strong>
                      <strong v-if="calculationSheetCode === 'Euro'">EUR</strong> -->
                    </label>
                    <!-- <input
                          type="text"
                          disabled
                          class="form-control"
                          v-model="bankBlockViewModel.totalAmount"
                          autocomplete="off"
                    />-->
                  </div>
                </div>
                <div class="col-md-3">
                  <div>{{ $t("SheetTotalGrossMarginValue") }}</div>
                  <div>
                    <label>
                      {{ bankBlockViewModel.totalGrossMarginValue | toUSD }}
                      <strong>{{ calculationSheetCode }}</strong>
                    </label>
                    <!-- <input
                      type="text"
                      disabled
                      class="form-control"
                      v-model="bankBlockViewModel.totalGrossMarginValue"
                      autocomplete="off"
                    />-->
                  </div>
                </div>
                <div class="col-md-3">
                  <div>{{ $t("SheetTotalGrossMargin") }}</div>
                  <div>
                    <label>
                      {{ bankBlockViewModel.totalGrossMargin | percentage }}%
                      <!-- <strong></strong> -->
                    </label>
                  </div>
                </div>
                <div class="col-md-3">
                  <div></div>
                  <div></div>
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
        @click="
          workflowAction(
            workflowaction.id,
            workflowaction.nextStepLastStepApproved,
            workflowaction.type
          )
        "
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
      :visible="bulidCalculationSheetDialog"
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
        <el-button @click="closeBuildCalculationSheet()">{{
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
import axios from "axios";
import xlsx from "xlsx";
import dropzone from "vue2-dropzone";
import Vue from "vue";

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
      warrantyList: [],

      selectionCurrency: "",
      tenderCurrenciesTabel: [],
      duplicateGroupDialog: false,
      groupIndexToDuplicate: null,
      isDuplicateMainGroup: null,
      excelLink: "",
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
      ExcelsheetDialog: false,
      isAlternative: false,
      groupsCount: [],
      groupsCount2: [],
      loadingAccount: false,
      fullscreenLoading: false,
      costWithDiscount: 0,
      guaranteeTypes: [],
      loggeduser: 0,
      isClickWrokflow: false,
      workflowStepActionSetting: [],
      isSearch: false,
      selected: 0,
      isWarrantyAccepted: false,
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
        warrantyLookup: null,
      },
      totalAmountIndex: null,
      totalAlternativeAmountIndex: null,
      totalOptionalAmountIndex: null,
      calculationAmount: [],
      guaranteeDeliveryLocations: [],
      bankGuaranteeType: true,
      currentGroupIndex: null,
      loadingFetchdata: false,
      systemItemsList: [],
      calculationSheetMainGroups: [],
      optionalList: [],
      prelist: [],
      mainConfigItemsExtract: [],
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
      captions: ["id", "ItemName"],
      bulidCalculationSheetDialog: false,
      calculationSheetGroups: [],
      bankBlockViewModel: {
        totalAmount: 0.0,
        totalGrossMargin: 0.0,
        totalGrossMarginValue: 0.0,
        bankGuarantee: 0.0,
        guaranteeType: "",
        guaranteeDeliveryLocation: "",
        bankGuaranteeType: true,
        bankGuaranteeValidTill: "",
        vatValue: 0,
        currencyCode: "",
      },
      GuaranteeTypeLIst: [],
      mainGroupPrevCount: null,
      calculationSheetCode: "",
      calcuationSheetRates: "",
      calculationSheetName: "",
      isVat: false,
      VAT: "",
      costTypeList: [],
      currenciesList: [],
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
  computed: {
    calculationSheetCurrencySymbol() {
      return this.currenciesList.length && this.calculationSheetCode
        ? this.currenciesList.find((x) => x.code == this.calculationSheetCode)
            .currencySymbol
        : "";
    },
    bankGuaranteeDisabled() {
      let v = !(
        this.BasicInfoObj.bankGuaranteeLookup &&
        this.BasicInfoObj.bankGuaranteeLookup.code == 1
      );
      return v;
    },
  },

  created() {
    this.excelLink =
      this.$store.getters.serverURI +
      "ExcelTemplates/calculation_sheet_groups.xlsx";
    this.remoteMethodCurrency("");
    this.loggeduser = this.$store.getters.getUserData.id;
    //this.getRemoteItemsByCode();

    this.getGuaranteeDeliveryLocationLookups();
    this.getPrincipalNames();
    this.getTenderReferences();
    this.fillGuaranteeType();
    this.FillCostTypeList();
    this.FillWarrantyList();

    //this.FillCurrencyList();

    this.getCalculationSheetData();
    // if (this.calSheetId) {// should be called after getCalculationSheetData
    //     this.FillData();
    // }
  },
  mounted() {},

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
            message: this.$t("Copied!"),
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
                this.calculationSheetGroups[this.groupIndexToDuplicate]
              )
            );
            this.calculationSheetGroups.push(groupToDuplicate);
            this.totalAmountIndex = this.calculationSheetGroups.length - 1;
          } else {
            var mainItemsList = JSON.parse(
                JSON.stringify(
                  this.calculationSheetGroups[this.groupIndexToDuplicate]
                    .calculationSheetItem
                )
              ),
              optionalItems = JSON.parse(
                JSON.stringify(
                  this.calculationSheetGroups[this.groupIndexToDuplicate]
                    .calculationSheetOptionalGroup
                )
              );
            this.calculationSheetGroups[
              this.groupIndexToDuplicate
            ].calculationSheetAlternativeGroup.forEach((element) => {
              element.selected = false;
            });

            this.calculationSheetGroups[
              this.groupIndexToDuplicate
            ].selected = false;
            this.calculationSheetGroups[
              this.groupIndexToDuplicate
            ].calculationSheetAlternativeGroup.push({
              name: "",
              selected: true,
              totalAmount: "",
              totalCost: "",
              totalMargin: "",
              calculationSheetMainGroupId: this.calculationSheetGroups[
                this.groupIndexToDuplicate
              ].id
                ? this.calculationSheetGroups[this.groupIndexToDuplicate].id
                : "",
              calculationSheetItem: mainItemsList,
              calculationSheetAlternativeOptionalGroup: optionalItems,
              calculationAlternativeAmount: [],
              bulkObj: {
                currencyCode: "",
                discount1: "",
                discount2: "",
                shipment: "",
                grossMargin: "",
                quantity: "",
                costType: "",
              },
            });
            this.totalAlternativeAmountIndex =
              this.calculationSheetGroups[this.groupIndexToDuplicate]
                .calculationSheetAlternativeGroup.length - 1;
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
    importExcel(files) {
      //   const files = e.target.files;
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
      //   var input = document.getElementById("upload");
      //   input.value = "";
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
              let calculationSheetItem = {
                quantity: row[6] || "",
                cost: row[9] || "0",
                costType: this.costTypeList.find((x) => x.name == row[10])
                  ? this.costTypeList.find((x) => x.name == row[10]).id
                  : 14,
                discount1: row[11] || "",
                discount2: row[12] || "",
                currencyCode: row[13] || this.calculationSheetCode,
                currencySymbol: this.currenciesList.find(
                  (x) => x.code == row[13]
                )
                  ? this.currenciesList.find((x) => x.code == row[13])
                      .currencySymbol
                  : this.currenciesList.find(
                      (x) => x.code == this.calculationSheetCode
                    ).currencySymbol,
                shipment: row[14] || "",
                landedCost: row[15] || "",
                grossMargin: row[18] || "",
                unitPrice: row[20] || "",
                amount: row[21] || "",
                grossMarginValue: row[19] || "",
                note: row[22] || " ",
                approve: false,
                //----------------
                foC_Value: row[17] || "",
                foc: row[16] || false,
              };
              if (row[3]) {
                let obj = validCodes.find(
                  (x) => x.code.toLowerCase() === String(row[3]).toLowerCase()
                );
                if (obj) {
                  calculationSheetItem.code = obj.code;
                  calculationSheetItem.name = obj.name;
                  calculationSheetItem.vendor = obj.vendor;
                  calculationSheetItem.onHandPrice = obj.onHandPrice;
                  if (!calculationSheetItem.cost)
                    calculationSheetItem.cost = obj.onHandPrice;
                  calculationSheetItem.onHandPriceCurrency = obj.currency;
                  calculationSheetItem.onHandPriceCurrencySymbol =
                    obj.currencySymbol;
                  calculationSheetItem.onHandQuantity = obj.onHandQuantity;
                  calculationSheetItem.fromERB = obj.fromERB;
                } else skippedItems.push(row[3]);
              } else if (row[4]) {
                let obj = validCodes.find((x) => x.name === row[4]);
                if (obj) {
                  calculationSheetItem.code = obj.code;
                  calculationSheetItem.name = obj.name;
                  calculationSheetItem.vendor = obj.vendor;
                  calculationSheetItem.onHandPrice = obj.onHandPrice;
                  if (!calculationSheetItem.cost)
                    calculationSheetItem.cost = obj.onHandPrice;
                  calculationSheetItem.onHandPriceCurrency = obj.currency;
                  calculationSheetItem.onHandPriceCurrencySymbol =
                    obj.currencySymbol;
                  calculationSheetItem.onHandQuantity = obj.onHandQuantity;
                  calculationSheetItem.fromERB = obj.fromERB;
                } else skippedItems.push(row[4]);
              }
              if (calculationSheetItem.code) {
                this.calculatorMainItemChange(calculationSheetItem);
                let groupTitle = row[0].split(" ");
                if (groupTitle.length == 1) {
                  //to add main groups
                  let groupIndex = parseInt(groupTitle[0].split("-")[1]) - 1;
                  let groupObj = this.calculationSheetGroups.find(
                    (x, index) => index == groupIndex
                  );
                  if (!groupObj)
                    this.calculationSheetGroups.push({
                      calculationSheetId: this.calSheetId,
                      name: row[1] || "",
                      number: row[2] || "",
                      deliveryTerms: "",
                      warranty: calWarranty,
                      totalAmount: "",
                      totalCost: "",
                      totalMargin: "",
                      selected: true,
                      calculationSheetAlternativeGroup: [],
                      calculationSheetItem: [calculationSheetItem],
                      calculationSheetOptionalGroup: null,
                      bulkObj: {
                        currencyCode: "",
                        discount1: "",
                        discount2: "",
                        shipment: "",
                        grossMargin: "",
                        quantity: "",
                        costType: "",
                      },
                    });
                  else {
                    groupObj.calculationSheetItem.push(calculationSheetItem);
                  }
                } else if (
                  groupTitle[0].split("-")[0] == "Item" &&
                  groupTitle[2] == "Alternative" &&
                  groupTitle[5] == "Optional"
                ) {
                  //to add optional alternative groups
                  let groupIndex = parseInt(groupTitle[0].split("-")[1]) - 1;
                  let groupObj = this.calculationSheetGroups[groupIndex];
                  let alternativeGroupIndex =
                    parseInt(groupTitle[3].split("-")[1]) - 1;
                  let alternativeGroupObj =
                    groupObj.calculationSheetAlternativeGroup.find(
                      (x, index) => index == alternativeGroupIndex
                    );
                  let optionalAlternativeObj =
                    groupObj.calculationSheetAlternativeGroup[
                      alternativeGroupIndex
                    ].calculationSheetAlternativeOptionalGroup;
                  if (!optionalAlternativeObj)
                    alternativeGroupObj.calculationSheetAlternativeOptionalGroup =
                      {
                        name: "",
                        code: "",
                        totalAmount: "",
                        totalCost: "",
                        totalMargin: "",
                        calculationSheetAlternativeGroupId:
                          alternativeGroupObj.id ? alternativeGroupObj.id : "",
                        calculationSheetItem: [calculationSheetItem],
                        bulkObj: {
                          currencyCode: "",
                          discount1: "",
                          discount2: "",
                          shipment: "",
                          grossMargin: "",
                          quantity: "",
                          costType: "",
                        },
                      };
                  else {
                    alternativeGroupObj.calculationSheetAlternativeOptionalGroup.calculationSheetItem.push(
                      calculationSheetItem
                    );
                  }
                } else if (
                  groupTitle[0].split("-")[0] == "Item" &&
                  groupTitle[2] == "Optional"
                ) {
                  //to add optional
                  let groupIndex = parseInt(groupTitle[0].split("-")[1]) - 1;
                  let groupObj = this.calculationSheetGroups[groupIndex];
                  let optionalObj = groupObj.calculationSheetOptionalGroup;
                  if (!optionalObj)
                    groupObj.calculationSheetOptionalGroup = {
                      name: "",
                      totalAmount: "",
                      totalCost: "",
                      totalMargin: "",
                      calculationSheetMainGroupId: groupObj.id
                        ? groupObj.id
                        : "",
                      calculationSheetItem: [calculationSheetItem],
                      bulkObj: {
                        currencyCode: "",
                        discount1: "",
                        discount2: "",
                        shipment: "",
                        grossMargin: "",
                        quantity: "",
                        costType: "",
                      },
                    };
                  else {
                    groupObj.calculationSheetOptionalGroup.calculationSheetItem.push(
                      calculationSheetItem
                    );
                  }
                } else {
                  //to add alternative groups
                  let groupIndex = parseInt(groupTitle[0].split("-")[1]) - 1;
                  let alternativeGroupIndex =
                    parseInt(groupTitle[groupTitle.length - 1]) - 1;
                  let groupObj = this.calculationSheetGroups[groupIndex];
                  let alternativeGroupObj =
                    groupObj.calculationSheetAlternativeGroup.find(
                      (x, index) => index == alternativeGroupIndex
                    );
                  if (!alternativeGroupObj) {
                    this.calculationSheetGroups[
                      groupIndex
                    ].calculationSheetAlternativeGroup.forEach((element) => {
                      element.selected = false;
                    });

                    this.calculationSheetGroups[groupIndex].selected = false;
                    groupObj.calculationSheetAlternativeGroup.push({
                      name: row[1] || "",
                      selected: true,
                      totalAmount: "",
                      totalCost: "",
                      totalMargin: "",
                      calculationSheetMainGroupId: groupObj.id
                        ? groupObj.id
                        : "",
                      calculationSheetItem: [calculationSheetItem],
                      calculationSheetAlternativeOptionalGroup: null,
                      calculationAlternativeAmount: [],
                      bulkObj: {
                        currencyCode: "",
                        discount1: "",
                        discount2: "",
                        shipment: "",
                        grossMargin: "",
                        quantity: "",
                        costType: "",
                      },
                    });
                  } else {
                    alternativeGroupObj.calculationSheetItem.push(
                      calculationSheetItem
                    );
                  }
                }
              }
            }
          }
        });
      }
      this.calculateTotalAmountTotalMarginTotalLandedCost();
      this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
      if (skippedItems.length)
        this.$message({
          showClose: true,
          duration: this.$store.getters.getMessagesDuration,
          type: "error",
          message: this.$t("UndefinedItems", { items: skippedItems }),
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

    Excel() {
      this.fullscreenLoading = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/CalculationSheets/" +
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
    addBulkItems(item) {
      if (item.calculationSheetItem && item.calculationSheetItem.length > 0) {
        let bulkObj = item.bulkObj;
        item.calculationSheetItem.forEach((element, index) => {
          if (bulkObj.currencyCode && bulkObj.currencyCode != "") {
            element.currencyCode = bulkObj.currencyCode;
            element.currencySymbol = this.currenciesList.filter(
              (x) => x.code == bulkObj.currencyCode
            )[0].currencySymbol;
          }
          if (bulkObj.discount1 && bulkObj.discount1 != "")
            element.discount1 = bulkObj.discount1;
          if (bulkObj.discount2 && bulkObj.discount2 != "")
            element.discount2 = bulkObj.discount2;
          if (bulkObj.shipment && bulkObj.shipment != "")
            element.shipment = bulkObj.shipment;
          if (bulkObj.grossMargin && bulkObj.grossMargin != "")
            element.grossMargin = bulkObj.grossMargin;
          if (bulkObj.quantity && bulkObj.quantity != "")
            element.quantity = bulkObj.quantity;
          if (bulkObj.costType && bulkObj.costType != "")
            element.costType = bulkObj.costType;

          this.handleDecimal(element, index);
          this.calculatorMainItemChange(element);
        });
        item.bulkObj = {
          currencyCode: "",
          discount1: "",
          discount2: "",
          shipment: "",
          grossMargin: "",
          quantity: "",
          costType: "",
        };
      }
    },
    addBulkAlternativeItems(item, indexOfAlternativeGroup) {
      if (
        item.calculationSheetAlternativeGroup[indexOfAlternativeGroup] &&
        item.calculationSheetAlternativeGroup[indexOfAlternativeGroup]
          .calculationSheetItem.length > 0
      ) {
        let bulkObj =
          item.calculationSheetAlternativeGroup[indexOfAlternativeGroup]
            .bulkObj;
        item.calculationSheetAlternativeGroup[
          indexOfAlternativeGroup
        ].calculationSheetItem.forEach((element, index) => {
          if (bulkObj.currencyCode && bulkObj.currencyCode != "")
            element.currencyCode = bulkObj.currencyCode;
          if (bulkObj.discount1 && bulkObj.discount1 != "")
            element.discount1 = bulkObj.discount1;
          if (bulkObj.discount2 && bulkObj.discount2 != "")
            element.discount2 = bulkObj.discount2;
          if (bulkObj.shipment && bulkObj.shipment != "")
            element.shipment = bulkObj.shipment;
          if (bulkObj.grossMargin && bulkObj.grossMargin != "")
            element.grossMargin = bulkObj.grossMargin;
          if (bulkObj.quantity && bulkObj.quantity != "")
            element.quantity = bulkObj.quantity;
          if (bulkObj.costType && bulkObj.costType != "")
            element.costType = bulkObj.costType;

          this.handleDecimal(element, index);
          this.calculatorMainItemChange(element);
        });
        item.calculationSheetAlternativeGroup[indexOfAlternativeGroup].bulkObj =
          {
            currencyCode: "",
            discount1: "",
            discount2: "",
            shipment: "",
            grossMargin: "",
            quantity: "",
            costType: "",
          };
      }
    },
    addBulkOptionalItems(item) {
      if (
        item.calculationSheetOptionalGroup &&
        item.calculationSheetOptionalGroup.calculationSheetItem &&
        item.calculationSheetOptionalGroup.calculationSheetItem.length > 0
      ) {
        let bulkObj = item.calculationSheetOptionalGroup.bulkObj;
        item.calculationSheetOptionalGroup.calculationSheetItem.forEach(
          (element, index) => {
            if (bulkObj.currencyCode && bulkObj.currencyCode != "")
              element.currencyCode = bulkObj.currencyCode;
            if (bulkObj.discount1 && bulkObj.discount1 != "")
              element.discount1 = bulkObj.discount1;
            if (bulkObj.discount2 && bulkObj.discount2 != "")
              element.discount2 = bulkObj.discount2;
            if (bulkObj.shipment && bulkObj.shipment != "")
              element.shipment = bulkObj.shipment;
            if (bulkObj.grossMargin && bulkObj.grossMargin != "")
              element.grossMargin = bulkObj.grossMargin;
            if (bulkObj.quantity && bulkObj.quantity != "")
              element.quantity = bulkObj.quantity;
            if (bulkObj.costType && bulkObj.costType != "")
              element.costType = bulkObj.costType;

            this.handleDecimal(element, index);
            this.calculatorMainItemChange(element);
          }
        );
        item.calculationSheetOptionalGroup.bulkObj = {
          currencyCode: "",
          discount1: "",
          discount2: "",
          shipment: "",
          grossMargin: "",
          quantity: "",
          costType: "",
        };
      }
    },
    addBulkAlternativeOptionalItems(item, indexOfAlternativeGroup) {
      if (
        item.calculationSheetAlternativeGroup[indexOfAlternativeGroup] &&
        item.calculationSheetAlternativeGroup[indexOfAlternativeGroup]
          .calculationSheetAlternativeOptionalGroup &&
        item.calculationSheetAlternativeGroup[indexOfAlternativeGroup]
          .calculationSheetAlternativeOptionalGroup.calculationSheetItem
          .length > 0
      ) {
        let bulkObj =
          item.calculationSheetAlternativeGroup[indexOfAlternativeGroup]
            .calculationSheetAlternativeOptionalGroup.bulkObj;
        item.calculationSheetAlternativeGroup[
          indexOfAlternativeGroup
        ].calculationSheetAlternativeOptionalGroup.calculationSheetItem.forEach(
          (element, index) => {
            if (bulkObj.currencyCode && bulkObj.currencyCode != "")
              element.currencyCode = bulkObj.currencyCode;
            if (bulkObj.discount1 && bulkObj.discount1 != "")
              element.discount1 = bulkObj.discount1;
            if (bulkObj.discount2 && bulkObj.discount2 != "")
              element.discount2 = bulkObj.discount2;
            if (bulkObj.shipment && bulkObj.shipment != "")
              element.shipment = bulkObj.shipment;
            if (bulkObj.grossMargin && bulkObj.grossMargin != "")
              element.grossMargin = bulkObj.grossMargin;
            if (bulkObj.quantity && bulkObj.quantity != "")
              element.quantity = bulkObj.quantity;
            if (bulkObj.costType && bulkObj.costType != "")
              element.costType = bulkObj.costType;

            this.handleDecimal(element, index);
            this.calculatorMainItemChange(element);
          }
        );
        item.calculationSheetAlternativeGroup[
          indexOfAlternativeGroup
        ].calculationSheetAlternativeOptionalGroup.bulkObj = {
          currencyCode: "",
          discount1: "",
          discount2: "",
          shipment: "",
          grossMargin: "",
          quantity: "",
          costType: "",
        };
      }
    },
    duplicateRow(index, rowItem) {
      var newObject = JSON.parse(JSON.stringify(rowItem));
      this.calculationSheetGroups[index].calculationSheetItem.push(newObject);
    },
    duplicateAlternativeItem(index, alternativeIndex, rowItem) {
      var newObject = JSON.parse(JSON.stringify(rowItem));
      this.calculationSheetGroups[index].calculationSheetAlternativeGroup[
        alternativeIndex
      ].calculationSheetItem.push(newObject);
    },
    duplicateOptionalRow(index, rowItem) {
      var newObject = JSON.parse(JSON.stringify(rowItem));
      this.calculationSheetGroups[
        index
      ].calculationSheetOptionalGroup.calculationSheetItem.push(newObject);
    },
    duplicateAlternativeOptionalItem(index, alternativeIndex, rowItem) {
      var newObject = JSON.parse(JSON.stringify(rowItem));
      this.calculationSheetGroups[index].calculationSheetAlternativeGroup[
        alternativeIndex
      ].calculationSheetAlternativeOptionalGroup.calculationSheetItem.push(
        newObject
      );
    },
    remoteMethodCurrency: function (query = "") {
      // if (query !== "") {
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
        "&calculationSheetID=" +
        this.calSheetId +
        "&department=" +
        this.$store.getters.getDepartmentCode.medical;

      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.currenciesList = data.body;
            this.loadingAccount = false;
            this.calculateTotalAmountTotalMarginTotalLandedCost();
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
      // } else this.currenciesList = [];
    },
    remoteMethodItemsName: function (query) {
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
          "&code=&department=ME";
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
          "api/item/GetAllItems?PageIndex=" +
          1 +
          "&PageSize=" +
          this.$store.getters.getReturnPage +
          "&name=&code=" +
          query +
          "&department=ME";
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
      if (rowItem.discount1) {
        if (parseFloat(rowItem.discount1) > 100) {
          rowItem.discount1 = 0;
        }
      }
      if (rowItem.discount2) {
        if (parseFloat(rowItem.discount2) > 100) {
          rowItem.discount2 = 0;
        }
      }
      if (rowItem.shipment) {
        if (parseFloat(rowItem.shipment) > 100) {
          rowItem.shipment = 0;
        }
      }
      if (rowItem.grossMargin) {
        if (parseFloat(rowItem.grossMargin) > 100) {
          rowItem.grossMargin = 0;
        }
      }
    },
    getItemCodeName(item, fromImport) {
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
          // item.code = data.body.code;
          item.name = data.body.name;
          item.vendor = data.body.vendor;
          item.onHandPrice = data.body.onHandPrice;
          if (!fromImport) item.cost = data.body.onHandPrice;
          item.onHandPriceCurrency = data.body.currency;
          item.onHandPriceCurrencySymbol = data.body.currencySymbol;
          item.onHandQuantity = data.body.onHandQuantity;
          item.fromERB = data.body.fromERB;
        });
    },
    getItemCodeNameByName(item, fromImport) {
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
          // item.name = data.body.name;
          item.vendor = data.body.vendor;
          item.onHandPrice = data.body.onHandPrice;
          if (!fromImport) item.cost = data.body.onHandPrice;
          item.onHandPriceCurrency = data.body.currency;
          item.onHandPriceCurrencySymbol = data.body.currencySymbol;
          item.onHandQuantity = data.body.onHandQuantity;
          item.fromERB = data.body.fromERB;
        });
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
          this.StepId = data.body ? data.body.id : "";
          this.WorkflowId = data.body ? data.body.workflowSettingId : "";
          this.workflowStepActionSetting = data.body
            ? data.body.workflowStepActionSetting
            : "";
        });
    },
    workflowAction(actionId, isLastApprove, type) {
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (
            (!this.getSelection() || this.calculationSheetGroups.length == 0) &&
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

          if (isLastApprove) {
            let result = this.checkSelection();
            if (!result) return;
          }

          this.isClickWrokflow = true;
          this.fullscreenLoading = true;
          var urlStr = this.$store.getters.serverURI + "api/WorkflowLog";
          this.$http
            .post(
              urlStr,
              {
                id: 0,
                CalculationSheetId: this.calSheetId,
                WorkflowId: this.WorkflowId,
                StepId: this.StepId,
                ActionId: actionId,
                calculationSheetMainGroup: this.calculationSheetGroups,
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
                //    this.getCalculationSheetData()
                this.$emit("withoutConfirm");
                this.$router.push({ name: "calculationSheetList" });
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
    closeBuildCalculationSheet() {
      this.bulidCalculationSheetDialog = true;
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
            this.bulidCalculationSheetDialog = false;
            this.isAlternative = false;
            done();
          } else {
            this.bulidCalculationSheetDialog = true;
            done();
          }
        },
      });
    },
    selectAlternativGroup(alternativeIndex, index) {
      var AlternativeAmount = 0.0;
      this.totalAlternativeAmountIndex = alternativeIndex;
      this.totalAmountIndex = index;

      this.calculationSheetGroups[
        index
      ].calculationSheetAlternativeGroup.forEach((element) => {
        element.selected = false;
      });
      this.calculationSheetGroups[index].calculationSheetAlternativeGroup[
        alternativeIndex
      ].selected = true;

      this.calculationSheetGroups[index].selected = false;
      this.calculationSheetGroups.splice("", 0);
      if (this.calculationSheetGroups[index]) {
        if (
          this.calculationSheetGroups[index].calculationSheetAlternativeGroup &&
          this.calculationSheetGroups[index].calculationSheetAlternativeGroup[
            alternativeIndex
          ].calculationSheetItem.length > 0
        ) {
          this.calculationSheetGroups[index].calculationSheetAlternativeGroup[
            alternativeIndex
          ].calculationSheetItem.forEach((element) => {
            AlternativeAmount += parseFloat(element.amount);
          });
          this.calculationSheetGroups[index].calculationSheetAlternativeGroup[
            alternativeIndex
          ].totalAmount = AlternativeAmount.toFixed(3).slice(0, -1);
        }
      }
      this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
    },
    selectMainGroup(object, index) {
      this.totalAmountIndex = index;
      // var Amount = 0.0;

      if (this.calculationSheetGroups[index].calculationSheetAlternativeGroup) {
        this.calculationSheetGroups[
          index
        ].calculationSheetAlternativeGroup.forEach((_element) => {
          _element.selected = false;
        });
      }

      this.calculationSheetGroups[index].selected = true;
      this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
    },

    getTotalAmountTotalGrossMarginTotalGrossMarginValue() {
      var totalAmount = 0.0;
      var totalAmountWithoutVat = 0.0;
      // var totalGrossMargin = 0.0;
      var totalGrossMarginValue = 0.0;
      // var totalPrice = 0.0;
      var allLandedCost = 0.0;
      this.calculationSheetGroups.forEach((element) => {
        if (element.selected == true) {
          if (
            element.calculationSheetItem &&
            element.calculationSheetItem.length > 0
          ) {
            element.calculationSheetItem.forEach((elm) => {
              let fOCValue = 0.0;
              if (elm.foC_Value && elm.foC_Value != "" && elm.foC_Value != 0) {
                fOCValue = elm.foC_Value;
              }
              if (elm.amount != "") {
                if (
                  elm.foC_Value &&
                  elm.foC_Value != "" &&
                  elm.foC_Value != 0
                ) {
                  let unitprice = parseFloat(
                    elm.landedCost * (1 - parseFloat(fOCValue) / 100)
                  )
                    .toFixed(3)
                    .slice(0, -1);
                  let finalTotal = parseFloat(elm.quantity * unitprice)
                    .toFixed(3)
                    .slice(0, -1);
                  totalAmountWithoutVat += parseFloat(finalTotal);
                  totalAmount += parseFloat(elm.amount);
                } else {
                  let unitprice = parseFloat(
                    elm.landedCost / (1 - parseFloat(elm.grossMargin) / 100)
                  )
                    .toFixed(3)
                    .slice(0, -1);
                  let finalTotal = parseFloat(elm.quantity * unitprice)
                    .toFixed(3)
                    .slice(0, -1);
                  totalAmountWithoutVat += parseFloat(finalTotal);
                  totalAmount += parseFloat(elm.amount);
                }
              }

              //  if(elm.unitPrice != "" && elm.landedCost != "" && elm.quantity != ""){
              //     if (elm.foC_Value && elm.foC_Value != "" && elm.foC_Value !=0){
              //         let unitprice = parseFloat((elm.landedCost * (1 - parseFloat(fOCValue) / 100))).toFixed(3).slice(0,-1);
              //         totalGrossMarginValue += (parseFloat(unitprice) - parseFloat(elm.landedCost)) * parseFloat(elm.quantity)
              //     }
              //     else {
              //         let unitprice = (elm.landedCost / (1 - parseFloat(elm.grossMargin) / 100)).toFixed(3).slice(0,-1);
              //         totalGrossMarginValue += (parseFloat(unitprice) - parseFloat(elm.landedCost)) * parseFloat(elm.quantity)
              //     }
              // }

              if (elm.grossMarginValue != "") {
                totalGrossMarginValue += parseFloat(elm.grossMarginValue);
              }
              if (elm.quantity != "" && elm.landedCost != "") {
                allLandedCost +=
                  parseFloat(elm.landedCost) * parseFloat(elm.quantity);
              }
            });
          }
        } else {
          if (
            element.calculationSheetAlternativeGroup &&
            element.calculationSheetAlternativeGroup.length > 0
          ) {
            element.calculationSheetAlternativeGroup.forEach((_element) => {
              if (_element.selected == true) {
                _element.calculationSheetItem.forEach((elm) => {
                  let fOCValue = 0.0;
                  if (
                    elm.foC_Value &&
                    elm.foC_Value != "" &&
                    elm.foC_Value != 0
                  ) {
                    fOCValue = elm.foC_Value;
                  }
                  if (elm.amount != "") {
                    if (
                      elm.foC_Value &&
                      elm.foC_Value != "" &&
                      elm.foC_Value != 0
                    ) {
                      let unitprice = parseFloat(
                        elm.landedCost * (1 - parseFloat(fOCValue) / 100)
                      )
                        .toFixed(3)
                        .slice(0, -1);
                      let finalTotal = parseFloat(elm.quantity * unitprice)
                        .toFixed(3)
                        .slice(0, -1);
                      totalAmountWithoutVat += parseFloat(finalTotal);

                      totalAmount += parseFloat(elm.amount);
                    } else {
                      let unitprice = parseFloat(
                        elm.landedCost / (1 - parseFloat(elm.grossMargin) / 100)
                      )
                        .toFixed(3)
                        .slice(0, -1);
                      let finalTotal = parseFloat(elm.quantity * unitprice)
                        .toFixed(3)
                        .slice(0, -1);
                      totalAmountWithoutVat += parseFloat(finalTotal);

                      // if (this.isVat == true && Number(this.VAT) > 0) {

                      // } else{
                      //     let other_unitprice = (elm.landedCost / (1 - parseFloat(elm.grossMargin) / 100)).toFixed(3).slice(0,-1);
                      //     let vatUnitPrice = parseFloat(parseFloat(other_unitprice).toFixed(3).slice(0,-1) * (1 + parseFloat(this.VAT / 100))).toFixed(3).slice(0,-1);
                      //     let finalTotal = parseFloat(elm.quantity * vatUnitPrice).toFixed(3).slice(0,-1);
                      //     totalAmountWithoutVat +=  parseFloat(finalTotal)
                      // }
                      totalAmount += parseFloat(elm.amount);
                    }
                  }

                  // if(elm.unitPrice != "" && elm.landedCost != "" && elm.quantity != ""){
                  //     if (elm.foC_Value && elm.foC_Value != "" && elm.foC_Value !=0){
                  //         let unitprice = parseFloat((elm.landedCost * (1 - parseFloat(fOCValue) / 100))).toFixed(3).slice(0,-1);
                  //         totalGrossMarginValue += (parseFloat(unitprice) - parseFloat(elm.landedCost)) * parseFloat(elm.quantity)
                  //     }
                  //     else {
                  //      let unitprice = (elm.landedCost / (1 - parseFloat(elm.grossMargin) / 100)).toFixed(3).slice(0,-1);
                  //      totalGrossMarginValue += (parseFloat(unitprice) - parseFloat(elm.landedCost)) * parseFloat(elm.quantity)
                  //     }
                  // }
                  if (elm.grossMarginValue != "") {
                    totalGrossMarginValue += parseFloat(elm.grossMarginValue);
                  }
                  if (elm.quantity != "" && elm.landedCost != "") {
                    allLandedCost +=
                      parseFloat(elm.landedCost) * parseFloat(elm.quantity);
                  }
                });
              }
            });
          }
        }
      });

      // this.bankBlockViewModel.totalAmount = parseFloat(totalAmount).toFixed(3).slice(0,-1);
      // this.bankBlockViewModel.totalGrossMarginValue = parseFloat(
      //   totalGrossMarginValue
      // ).toFixed(3).slice(0,-1);

      this.bankBlockViewModel.totalAmount = Number.isNaN(totalAmount)
        ? 0.0
        : totalAmount.toFixed(3).slice(0, -1);
      this.bankBlockViewModel.totalGrossMarginValue = Number.isNaN(
        totalGrossMarginValue
      )
        ? 0.0
        : totalGrossMarginValue.toFixed(3).slice(0, -1);

      if (parseFloat(totalAmountWithoutVat) > 0) {
        // this.bankBlockViewModel.totalGrossMargin = ((parseFloat(this.bankBlockViewModel.totalGrossMarginValue).toFixed(4) ) / parseFloat(this.bankBlockViewModel.totalAmount).toFixed(4) / (1+ this.VAT / 100)).toFixed(4);
        this.bankBlockViewModel.totalGrossMargin = (
          parseFloat(this.bankBlockViewModel.totalGrossMarginValue).toFixed(4) /
          (parseFloat(this.bankBlockViewModel.totalAmount).toFixed(4) /
            (1 + this.VAT / 100))
        ).toFixed(4); // new change  abdalhadi 21-12-2023.
      } else {
        this.bankBlockViewModel.totalGrossMargin = 0.0;
      }
    },
    getAmountsForMainAndAlternative() {
      let val = this.calculationSheetGroups;
      var Amount = 0.0;
      var AlternativeAmount = 0.0;
      // var OptionalAmount = 0.0;
      if (val[this.totalAmountIndex]) {
        val[this.totalAmountIndex].calculationSheetItem.forEach(function (
          _val
        ) {
          Amount += parseFloat(_val.amount);
        });
        val[this.totalAmountIndex].totalAmount = Amount.toFixed(3).slice(0, -1);

        if (
          val[this.totalAmountIndex].calculationSheetAlternativeGroup &&
          val[this.totalAmountIndex].calculationSheetAlternativeGroup[
            this.totalAlternativeAmountIndex
          ].calculationSheetItem.length > 0
        ) {
          val[this.totalAmountIndex].calculationSheetAlternativeGroup[
            this.totalAlternativeAmountIndex
          ].calculationSheetItem.forEach((element) => {
            AlternativeAmount += parseFloat(element.amount);
          });
          val[this.totalAmountIndex].calculationSheetAlternativeGroup[
            this.totalAlternativeAmountIndex
          ].totalAmount = AlternativeAmount.toFixed(3).slice(0, -1);
        }
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
                "api/CalculationSheet/" +
                this.calSheetId +
                "/Submission";
              this.$http
                .put(
                  urlStr,
                  {
                    calculationSheetMainGroup: this.calculationSheetGroups,
                    bankBlockViewModel: this.bankBlockViewModel,
                    warranty: this.BasicInfoObj.warranty,
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
                      // this.getCalculationSheetData();
                      this.$emit("withoutConfirm");
                      this.$router.push({ name: "calculationSheetList" });
                      this.$message({
                        showClose: true,
                        duration: this.$store.getters.getMessagesDuration,
                        type: "success",
                        message: response.data.message,
                      });
                    }
                    //this.$router.push({ path: "/calculationSheets" });
                    //window.location.reload(true);
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
                "api/CalculationSheet/" +
                this.calSheetId +
                "/Submission";
              this.$http
                .post(
                  urlStr,
                  {
                    calculationSheetMainGroup: this.calculationSheetGroups,
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
                      // this.getCalculationSheetData();
                      this.$emit("withoutConfirm");
                      this.$router.push({ name: "calculationSheetList" });
                      this.$message({
                        showClose: true,
                        duration: this.$store.getters.getMessagesDuration,
                        type: "success",
                        message: response.data.message,
                      });
                    }

                    //window.location.reload(true);
                    //this.$router.push({ path: "/calculationSheets" });
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
    getRemoteItemsByName(qurey) {
      this.loadingFetchdata = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/Item/GetAllItems?name=" +
        qurey +
        "&department=ME";

      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.systemItemsList = data.body;
            this.loadingFetchdata = false;
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
    getRemoteItemsByCode(qurey) {
      this.loadingFetchdata = true;
      var urlStr =
        this.$store.getters.serverURI +
        "api/Item/GetAllItems?code=" +
        qurey +
        "&department=ME";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.systemItemsList = data.body;
            this.loadingFetchdata = false;
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
    changeFoc(row) {
      row.foc = !row.foc;
      if (row.foc == false) {
        row.foC_Value = "";
      } else row.foC_Value = 0.0;
      this.calculatorMainItemChange(row);
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
      var quantity = 0.0;
      var cost = 0.0;
      var discount1 = 0.0;
      var discount2 = 0.0;
      var shipment = 0.0;
      var grossMargin = 0.0;
      var fOCValue = 0.0;

      if (rowItem.cost != "") {
        cost = rowItem.cost;
      }

      if (rowItem.shipment != "") {
        shipment = rowItem.shipment;
      }

      if (rowItem.grossMargin != "") {
        grossMargin = rowItem.grossMargin;
      }

      if (rowItem.quantity != "") {
        quantity = rowItem.quantity;
      }

      if (rowItem.discount1 != "") {
        discount1 = rowItem.discount1;
      }

      if (rowItem.discount2 != "") {
        discount2 = rowItem.discount2;
      }

      // let costWithdiscount = this.calculatoionDiscount(rowItem);

      if (rowItem.shipment) {
        rowItem.shipment = this.valueAfterRegex(shipment);
      }

      if (rowItem.grossMargin) {
        rowItem.grossMargin = this.valueAfterRegex(grossMargin);
      }

      if (rowItem.foC_Value && rowItem.foC_Value != "") {
        fOCValue = rowItem.foC_Value;
      }

      // if (rowItem.cost && rowItem.cost != "") {

      let currencyConversion = this.changeAmountCurrency(
        this.calculationSheetCode,
        rowItem.currencyCode,
        1
      );

      // if (parseFloat(discount1) != 0 && parseFloat(discount2) == 0) {
      //     rowItem.landedCost = parseFloat(parseFloat(costWithdiscount) * ((1 + parseFloat(shipment) / 100))).toFixed(3).slice(0,-1);
      // } else if (parseFloat(discount1) != 0 && parseFloat(discount2) != 0) {
      //     rowItem.landedCost = parseFloat(parseFloat(costWithdiscount) * ((1 + parseFloat(shipment) / 100))).toFixed(3).slice(0,-1);
      // } else if (parseFloat(discount1) == 0 && parseFloat(discount2) == 0) {
      rowItem.landedCost = parseFloat(
        parseFloat(cost) *
          currencyConversion *
          (1 + parseFloat(shipment) / 100) *
          (1 - parseFloat(discount1) / 100) *
          (1 - parseFloat(discount2) / 100)
      ).toFixed(2); //.slice(0,-1);
      // }

      // }

      // if (rowItem.cost && rowItem.landedCost) {
      if (
        rowItem.foC_Value &&
        rowItem.foC_Value != "" &&
        rowItem.foC_Value != 0
      ) {
        var unitPrice = (
          (rowItem.landedCost / (1 - parseFloat(grossMargin) / 100)) *
          (1 - parseFloat(fOCValue) / 100)
        )
          .toFixed(3)
          .slice(0, -1);

        rowItem.unitPrice = unitPrice;
        if (this.isVat == true) {
          rowItem.unitPrice = (
            parseFloat(unitPrice).toFixed(3).slice(0, -1) *
            (1 + parseFloat(this.VAT / 100))
          )
            .toFixed(3)
            .slice(0, -1);
        }
        let newUnitPrice = parseFloat(
          (rowItem.landedCost * (1 - parseFloat(fOCValue) / 100)) /
            (1 - parseFloat(grossMargin) / 100)
        )
          .toFixed(3)
          .slice(0, -1);
        rowItem.grossMarginValue = parseFloat(
          (parseFloat(newUnitPrice) - parseFloat(rowItem.landedCost)) *
            parseFloat(quantity)
        )
          .toFixed(3)
          .slice(0, -1);
        // rowItem.grossMarginValue =( (rowItem.unitPrice / (1 + parseFloat(this.VAT / 100)) - parseFloat(rowItem.landedCost))
        //  * parseFloat(quantity)).toFixed(3).slice(0,-1);
      } else {
        var unitPrice = (
          rowItem.landedCost /
          (1 - parseFloat(grossMargin) / 100)
        )
          .toFixed(3)
          .slice(0, -1);

        rowItem.unitPrice = unitPrice;
        if (this.isVat == true) {
          rowItem.unitPrice = (
            parseFloat(unitPrice).toFixed(3).slice(0, -1) *
            (1 + parseFloat(this.VAT / 100))
          )
            .toFixed(3)
            .slice(0, -1);
        }
        let newUnitPrice = parseFloat(
          rowItem.landedCost / (1 - parseFloat(grossMargin) / 100)
        )
          .toFixed(3)
          .slice(0, -1);
        rowItem.grossMarginValue = parseFloat(
          (parseFloat(newUnitPrice) - parseFloat(rowItem.landedCost)) *
            parseFloat(quantity)
        )
          .toFixed(3)
          .slice(0, -1);
        // rowItem.grossMarginValue =( (rowItem.unitPrice / (1 + parseFloat(this.VAT / 100)) - parseFloat(rowItem.landedCost))
        //  * parseFloat(quantity)).toFixed(3).slice(0,-1);
      }

      // }

      // if (rowItem.unitPrice) {
      rowItem.amount = parseFloat(quantity * rowItem.unitPrice)
        .toFixed(3)
        .slice(0, -1);
      // let unitPrice = (
      //     parseFloat(rowItem.landedCost) /
      //     (1 - parseFloat(grossMargin) / 100)
      // ).toFixed(3).slice(0,-1);

      // }

      // console.log(rowItem.quantity);
      // console.log(rowItem.unitPrice);
    },
    calculatoionDiscount(rowItem) {
      var costWithDiscount = 0.0;
      var discount1 = 0.0;
      var discount2 = 0.0;

      let currencyConversion = this.changeAmountCurrency(
        this.calculationSheetCode,
        rowItem.currencyCode,
        1
      );

      if (rowItem.discount1 != "") {
        discount1 = rowItem.discount1;
      }

      if (rowItem.discount2 != "") {
        discount2 = rowItem.discount2;
      }

      if (discount1 != 0.0 && discount2 == 0.0) {
        rowItem.discount1 = this.valueAfterRegex(rowItem.discount1);

        if (rowItem.cost) {
          costWithDiscount = (
            parseFloat(rowItem.cost) *
            currencyConversion *
            (1 - parseFloat(discount1) / 100)
          )
            .toFixed(3)
            .slice(0, -1);
        }
      }

      if (rowItem.discount2 != "") {
        rowItem.discount2 = this.valueAfterRegex(rowItem.discount2);
      }

      if (discount1 != 0.0 && discount2 != 0.0) {
        if (rowItem.cost) {
          let costWithDiscount1 = (
            parseFloat(rowItem.cost) *
            currencyConversion *
            (1 - parseFloat(discount1) / 100)
          )
            .toFixed(3)
            .slice(0, -1);
          costWithDiscount = (
            parseFloat(costWithDiscount1) *
            (1 - parseFloat(discount2) / 100)
          )
            .toFixed(3)
            .slice(0, -1);
        }
      }

      return costWithDiscount;
    },
    valueAfterRegex(val) {
      var reg = new RegExp("^[0-9]+(.[0-9]{1,2})?$");
      if (!reg.test(val)) {
        return parseFloat(val); //.toFixed(3).slice(0,-1);
      } else {
        return val;
      }
    },
    calculatorGrossMarginItemChange(rowItem) {
      this.calculatorMainItemChange(rowItem);
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
    getCalculationSheetData: function () {
      var urlStr =
        this.$store.getters.serverURI +
        "api/CalculationSheet/GetBasicInfoDetail/" +
        this.calSheetId;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.VAT = data.body.vatValue;

            if (this.calSheetId) {
              // it should be called here as the calculations depend on data in getCalculationSheetData, abdalhadi.
              this.FillData();
            }

            this.BasicInfoObj = data.body;

            if (this.BasicInfoObj.submissionDate) {
              this.BasicInfoObj.submissionDate = moment(
                data.body.submissionDate
              ).format("YYYY-MM-DD");
            }

            this.calculationSheetCode = data.body.tenderCurrencyCode;
            this.calcuationSheetRates = data.body.calculationSheetCurrencyRate;
            // this.calculationSheetCode = data.body.
            this.isVat = this.BasicInfoObj.isVat;

            if (this.BasicInfoObj && this.BasicInfoObj.status != 1) {
              this.getCurrentStep();
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
        this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.CostType;
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
    FillCurrencyList: function () {
      var urlStr = this.$store.getters.serverURI + "api/Item/GetAllCurrencies";
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
    FillItemsList: function () {
      var urlStr =
        this.$store.getters.serverURI + "api/Item/GetAllItems?department=ME";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.systemItemsList = data.body;
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
        "api/CalculationSheet/GetMainGroup/" +
        this.calSheetId;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.mainGroupPrevCount = data.body.calculationSheetMainGroup
              ? data.body.calculationSheetMainGroup.length
              : 0;
            this.bankBlockViewModel.bankGuaranteeValidTill =
              data.body.bankGuaranteeValidTill;
            this.bankBlockViewModel.totalGrossMarginValue =
              data.body.bankBlockViewModel.totalGrossMarginValue;

            this.bankBlockViewModel.totalAmount =
              data.body.bankBlockViewModel.totalAmount;

            this.bankBlockViewModel = data.body.bankBlockViewModel;

            if (data.body.calculationSheetMainGroup.length) {
              this.calculationSheetGroups =
                data.body.calculationSheetMainGroup.map((element) => {
                  element.bulkObj = {
                    currencyCode: "",
                    discount1: "",
                    discount2: "",
                    shipment: "",
                    grossMargin: "",
                    quantity: "",
                    costType: "",
                  };
                  if (element.calculationSheetOptionalGroup)
                    element.calculationSheetOptionalGroup.bulkObj = {
                      currencyCode: "",
                      discount1: "",
                      discount2: "",
                      shipment: "",
                      grossMargin: "",
                      quantity: "",
                      costType: "",
                    };
                  element.calculationSheetAlternativeGroup =
                    element.calculationSheetAlternativeGroup.map((alter) => {
                      alter.bulkObj = {
                        currencyCode: "",
                        discount1: "",
                        discount2: "",
                        shipment: "",
                        grossMargin: "",
                        quantity: "",
                        costType: "",
                      };
                      if (alter.calculationSheetAlternativeOptionalGroup)
                        alter.calculationSheetAlternativeOptionalGroup.bulkObj =
                          {
                            currencyCode: "",
                            discount1: "",
                            discount2: "",
                            shipment: "",
                            grossMargin: "",
                            quantity: "",
                            costType: "",
                          };
                      return alter;
                    });

                  return element;
                });
            }
            this.calculationSheetGroups.forEach((element) => {
              this.groupsCount.push(element.calculationSheetItem.length);
              element.calculationSheetItem.forEach((item) => {
                item.selected = false;
                return item;
              });
              // element.calculationSheetAlternativeGroup
              // element.calculationSheetOptionalGroup.calculationSheetItem
            });
            this.totalAmountIndex = 0;
            this.totalAlternativeAmountIndex = 0;
            this.totalOptionalAmountIndex = 0;
            this.fullscreenLoading = false;

            this.reBuildItems();
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
    FillWarrantyList() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/lookup/GetByType/" +
        this.$store.getters.getLookupCategory.Warranty;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj,
        })
        .then(
          function (data) {
            this.warrantyList = data.body;
            this.warrantyList = this.warrantyList.sort(
              (a, b) => parseInt(a.code) - parseInt(b.code)
            );
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
    addNewMainSheetItem(index) {
      this.totalAmountIndex = index;
      this.calculationSheetGroups[index].calculationSheetItem.push({
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
        currencyCode: this.calculationSheetCode,
        currencySymbol: this.currenciesList.filter(
          (x) => x.code == this.calculationSheetCode
        )[0].currencySymbol,
        shipment: "",
        landedCost: "",
        foc: false,
        foC_Value: "",
        grossMargin: "",
        unitPrice: "",
        amount: "",
        grossMarginValue: "",
        note: " ",
        approve: false,
      });
      //this.calculationSheetGroups[index].totalAmount = 0.0;
    },
    addNewOptionalGroup(index) {
      this.totalAmountIndex = index;

      this.calculationSheetGroups[index].calculationSheetOptionalGroup = {
        name: "",
        calculationSheetMainGroupId: this.calculationSheetGroups[index].id
          ? this.calculationSheetGroups[index].id
          : "",
        calculationSheetItem: [
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
            currencyCode: this.calculationSheetCode,
            currencySymbol: this.currenciesList.filter(
              (x) => x.code == this.calculationSheetCode
            )[0].currencySymbol,
            shipment: "",
            landedCost: "",
            foc: false,
            foC_Value: "",
            grossMargin: "",
            unitPrice: "",
            amount: "",
            grossMarginValue: "",
            note: " ",
            approve: false,
          },
        ],
        totalAmount: "",
        totalCost: "",
        totalMargin: "",
        bulkObj: {
          currencyCode: "",
          discount1: "",
          discount2: "",
          shipment: "",
          grossMargin: "",
          quantity: "",
          costType: "",
        },
      };

      this.totalOptionalAmountIndex =
        this.calculationSheetGroups[index].calculationSheetOptionalGroup
          .length - 1;
    },
    addNewAlternativeGroup(index) {
      this.totalAmountIndex = index;
      this.calculationSheetGroups[
        index
      ].calculationSheetAlternativeGroup.forEach((element) => {
        element.selected = false;
      });

      this.calculationSheetGroups[index].selected = false;
      this.calculationSheetGroups[index].calculationSheetAlternativeGroup.push({
        name: "",
        selected: true,
        totalAmount: "",
        totalCost: "",
        totalMargin: "",
        calculationSheetMainGroupId: this.calculationSheetGroups[index].id
          ? this.calculationSheetGroups[index].id
          : "",
        calculationSheetItem: [
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
            currencyCode: this.calculationSheetCode,
            currencySymbol: this.currenciesList.filter(
              (x) => x.code == this.calculationSheetCode
            )[0].currencySymbol,
            shipment: "",
            landedCost: "",
            foc: false,
            foC_Value: "",
            grossMargin: "",
            unitPrice: "",
            amount: "",
            grossMarginValue: "",
            note: " ",
            approve: false,
          },
        ],
        calculationSheetAlternativeOptionalGroup: null,
        calculationAlternativeAmount: [],
        bulkObj: {
          currencyCode: "",
          discount1: "",
          discount2: "",
          shipment: "",
          grossMargin: "",
          quantity: "",
          costType: "",
        },
      });
      this.totalAlternativeAmountIndex =
        this.calculationSheetGroups[index].calculationSheetAlternativeGroup
          .length - 1;
    },
    addNewAternativeOptionalGroup(index, indexOfAlternativeGroup) {
      this.calculationSheetGroups[index].calculationSheetAlternativeGroup[
        indexOfAlternativeGroup
      ].calculationSheetAlternativeOptionalGroup = {
        name: "",
        code: "",
        totalAmount: "",
        totalCost: "",
        totalMargin: "",
        calculationSheetAlternativeGroupId: this.calculationSheetGroups[index]
          .calculationSheetAlternativeGroup.id
          ? this.calculationSheetGroups[index].calculationSheetAlternativeGroup
              .id
          : "",
        calculationSheetItem: [
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
            currencyCode: this.calculationSheetCode,
            currencySymbol: this.currenciesList.filter(
              (x) => x.code == this.calculationSheetCode
            )[0].currencySymbol,
            shipment: "",
            landedCost: "",
            foc: false,
            foC_Value: "",
            grossMargin: "",
            unitPrice: "",
            amount: "",
            grossMarginValue: "",
            note: " ",
            approve: false,
          },
        ],
        bulkObj: {
          currencyCode: "",
          discount1: "",
          discount2: "",
          shipment: "",
          grossMargin: "",
          quantity: "",
          costType: "",
        },
      };
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
          "&calculationSheetId=null" +
          "&department=" +
          this.$store.getters.getDepartmentCode.medical;
        this.$http
          .get(urlStr, {
            headers: this.$store.getters.tokenAuthonticationHeaderObj,
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
                message: error.body.message,
              });
            }
          );
      } else this.tenderCurrenciesTabel = [];
    },
    addNewAternativeItem(index, indexOfAlternativeGroup) {
      this.calculationSheetGroups[index].calculationSheetAlternativeGroup[
        indexOfAlternativeGroup
      ].calculationSheetItem.push({
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
        currencyCode: this.calculationSheetCode,
        currencySymbol: this.currenciesList.filter(
          (x) => x.code == this.calculationSheetCode
        )[0].currencySymbol,
        shipment: "",
        landedCost: "",
        foc: false,
        foC_Value: "",
        grossMargin: "",
        unitPrice: "",
        amount: "",
        grossMarginValue: "",
        note: " ",
        approve: false,
      });
    },
    addNewOptionalItem(index) {
      this.totalOptionalAmountIndex = index;
      this.calculationSheetGroups[
        index
      ].calculationSheetOptionalGroup.calculationSheetItem.push({
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
        currencyCode: this.calculationSheetCode,
        currencySymbol: this.currenciesList.filter(
          (x) => x.code == this.calculationSheetCode
        )[0].currencySymbol,
        shipment: "",
        landedCost: "",
        foc: false,
        foC_Value: "",
        grossMargin: "",
        unitPrice: "",
        amount: "",
        grossMarginValue: "",
        note: " ",
        approve: false,
      });
    },
    addNewAlternativeOptionalItem(index, alternativeGroupIndex) {
      this.calculationSheetGroups[index].calculationSheetAlternativeGroup[
        alternativeGroupIndex
      ].calculationSheetAlternativeOptionalGroup.calculationSheetItem.push({
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
        currencyCode: this.calculationSheetCode,
        currencySymbol: this.currenciesList.filter(
          (x) => x.code == this.calculationSheetCode
        )[0].currencySymbol,
        shipment: "",
        landedCost: "",
        foc: false,
        foC_Value: "",
        grossMargin: "",
        unitPrice: "",
        amount: "",
        grossMarginValue: "",
        note: " ",
        approve: false,
      });
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
            this.calculationSheetGroups[
              index
            ].calculationSheetAlternativeGroup.splice(alternativeGroupIndex, 1);
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
            this.calculationSheetGroups[index].calculationSheetOptionalGroup =
              null;
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
            this.calculationSheetGroups[index].calculationSheetAlternativeGroup[
              alternativeGroupIndex
            ].calculationSheetAlternativeOptionalGroup = null;
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
            this.calculationSheetGroups.splice(index, 1);
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
            this.calculationSheetGroups[index].calculationSheetItem.splice(
              this.calculationSheetGroups[index].calculationSheetItem.indexOf(
                item
              ),
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
            this.calculationSheetGroups[index].calculationSheetAlternativeGroup[
              alternativeGroupIndex
            ].calculationSheetItem.splice(
              this.calculationSheetGroups[
                index
              ].calculationSheetAlternativeGroup[
                alternativeGroupIndex
              ].calculationSheetItem.indexOf(item),
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
            this.calculationSheetGroups[
              index
            ].calculationSheetOptionalGroup.calculationSheetItem.splice(
              this.calculationSheetGroups[
                index
              ].calculationSheetOptionalGroup.calculationSheetItem.indexOf(
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
            this.calculationSheetGroups[index].calculationSheetAlternativeGroup[
              alternativeGroupIndex
            ].calculationSheetAlternativeOptionalGroup.calculationSheetItem.splice(
              this.calculationSheetGroups[
                index
              ].calculationSheetAlternativeGroup[
                alternativeGroupIndex
              ].calculationSheetAlternativeOptionalGroup.calculationSheetItem.indexOf(
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
    updateAction() {},
    getMargin(totalMargin, totalAmount) {
      return totalAmount == 0
        ? 0
        : ((totalMargin / totalAmount) * 100).toFixed(3);
    },
    getSC(totalLandingCost, totalCost) {
      return totalCost == 0
        ? 0
        : ((totalLandingCost / totalCost) * 100).toFixed(3);
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
            "api/CalculationSheet/" +
            this.calSheetId +
            "/MainGroup";
          this.$http
            .post(
              urlStr,
              {
                calculationSheetMainGroup: this.calculationSheetGroups,
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
                  // this.getCalculationSheetData()
                } else {
                  this.FillData();
                  // this.getCalculationSheetData()
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
        "api/CalculationSheet/" +
        this.calSheetId +
        "/UpdateMainGroup/";
      this.$http
        .put(
          urlStr,
          {
            calculationSheetMainGroup: this.calculationSheetGroups,
            bankBlockViewModel: this.bankBlockViewModel,
            warranty: this.BasicInfoObj.warranty,
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
            this.getCalculationSheetData();
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
    ShowDialogToFetchItemFromMainConfigs(indexOfCalculationSheetGroup) {
      this.currentGroupIndex = indexOfCalculationSheetGroup;
      this.bulidCalculationSheetDialog = true;
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
      this.bulidCalculationSheetDialog = true;
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
    addNewGroup() {
      var calWarranty = "";
      if (this.BasicInfoObj.warrantyForAllGroups) {
        calWarranty = this.BasicInfoObj.warranty;
      }
      this.calculationSheetGroups.push({
        calculationSheetId: this.calSheetId,
        name: "",
        number: "",
        deliveryTerms: "",
        warranty: calWarranty,
        totalAmount: "",
        totalCost: "",
        totalMargin: "",
        selected: true,
        calculationSheetAlternativeGroup: [],
        calculationSheetItem: [
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
            currencyCode: this.calculationSheetCode,
            currencySymbol: this.currenciesList.filter(
              (x) => x.code == this.calculationSheetCode
            )[0].currencySymbol,
            shipment: "",
            landedCost: "",
            foc: false,
            foC_Value: "",
            grossMargin: "",
            unitPrice: "",
            amount: "",
            grossMarginValue: "",
            note: " ",
            approve: false,
          },
        ],
        calculationSheetOptionalGroup: null,
        bulkObj: {
          currencyCode: "",
          discount1: "",
          discount2: "",
          shipment: "",
          grossMargin: "",
          quantity: "",
          costType: "",
        },
      });
      this.totalAmountIndex = this.calculationSheetGroups.length - 1;
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
                    var item = {
                      name: value.itemName,
                      code: value.itemCode,
                      vendor: value.vendor,
                      quantity: "",
                      onHandPrice: value.onHandPrice,
                      onHandPriceCurrency: value.onHandPriceCurrency,
                      onHandPriceCurrencySymbol:
                        value.onHandPriceCurrencySymbol,
                      onHandQuantity: value.onHandQuantity,
                      cost: value.onHandPrice,
                      costType: 14,
                      discount1: "",
                      discount2: "",
                      currencyCode: vm.calculationSheetCode,
                      currencySymbol: vm.currenciesList.filter(
                        (x) => x.code == vm.calculationSheetCode
                      )[0].currencySymbol,
                      shipment: "",
                      landedCost: "",
                      foc: false,
                      foC_Value: "",
                      grossMargin: "",
                      unitPrice: "",
                      amount: "",
                      grossMarginValue: "",
                      note: " ",
                      approve: "",
                    };
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
                    var item = {
                      name: groupMainConfigItemsObjectOfArray.itemName,
                      code: groupMainConfigItemsObjectOfArray.itemCode,
                      vendor: groupMainConfigItemsObjectOfArray.vendor,
                      quantity: "",
                      onHandPrice:
                        groupMainConfigItemsObjectOfArray.onHandPrice,
                      onHandPriceCurrency:
                        groupMainConfigItemsObjectOfArray.onHandPriceCurrency,
                      onHandPriceCurrencySymbol:
                        groupMainConfigItemsObjectOfArray.onHandPriceCurrencySymbol,
                      onHandQuantity:
                        groupMainConfigItemsObjectOfArray.onHandQuantity,
                      cost: groupMainConfigItemsObjectOfArray.onHandPrice,
                      costType: 14,
                      discount1: "",
                      discount2: "",
                      currencyCode: vm.calculationSheetCode,
                      currencySymbol: vm.currenciesList.filter(
                        (x) => x.code == vm.calculationSheetCode
                      )[0].currencySymbol,
                      shipment: "",
                      landedCost: "",
                      foc: false,
                      foC_Value: "",
                      grossMargin: "",
                      unitPrice: "",
                      amount: "",
                      grossMarginValue: "",
                      note: " ",
                      approve: false,
                    };
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
      this.bulidCalculationSheetDialog = false;
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
                    var item = {
                      name: value.itemName,
                      code: value.itemCode,
                      vendor: value.vendor,
                      quantity: "",
                      onHandPrice: value.onHandPrice,
                      onHandPriceCurrency: value.onHandPriceCurrency,
                      onHandPriceCurrencySymbol:
                        value.onHandPriceCurrencySymbol,
                      onHandQuantity: value.onHandQuantity,
                      cost: value.onHandPrice,
                      costType: 14,
                      discount1: "",
                      discount2: "",
                      currencyCode: vm.calculationSheetCode,
                      currencySymbol: vm.currenciesList.filter(
                        (x) => x.code == vm.calculationSheetCode
                      )[0].currencySymbol,
                      shipment: "",
                      landedCost: "",
                      foc: false,
                      foC_Value: "",
                      grossMargin: "",
                      unitPrice: "",
                      amount: "",
                      grossMarginValue: "",
                      note: " ",
                      approve: "",
                    };
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
                    var item = {
                      name: groupMainConfigItemsObjectOfArray.itemName,
                      code: groupMainConfigItemsObjectOfArray.itemCode,
                      vendor: groupMainConfigItemsObjectOfArray.vendor,
                      quantity: "",
                      onHandPrice:
                        groupMainConfigItemsObjectOfArray.onHandPrice,
                      onHandPriceCurrency:
                        groupMainConfigItemsObjectOfArray.onHandPriceCurrency,
                      onHandPriceCurrencySymbol:
                        groupMainConfigItemsObjectOfArray.onHandPriceCurrencySymbol,
                      onHandQuantity:
                        groupMainConfigItemsObjectOfArray.onHandQuantity,
                      cost: groupMainConfigItemsObjectOfArray.onHandPrice,
                      costType: 14,
                      discount1: "",
                      discount2: "",
                      currencyCode: vm.calculationSheetCode,
                      currencySymbol: vm.currenciesList.filter(
                        (x) => x.code == vm.calculationSheetCode
                      )[0].currencySymbol,
                      shipment: "",
                      landedCost: "",
                      foc: false,
                      foC_Value: "",
                      grossMargin: "",
                      unitPrice: "",
                      amount: "",
                      grossMarginValue: "",
                      note: " ",
                      approve: false,
                    };
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
      this.bulidCalculationSheetDialog = false;
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
      // var calWarranty = "";
      var index = this.currentGroupIndex;

      if (OptionalItemList.length > 0) {
        optionalItems = {
          name: "",
          code: "",
          totalAmount: "",
          totalCost: "",
          totalMargin: "",
          calculationSheetAlternativeGroupId: "",
          calculationSheetItem: OptionalItemList,
          bulkObj: {
            currencyCode: "",
            discount1: "",
            discount2: "",
            shipment: "",
            grossMargin: "",
            quantity: "",
            costType: "",
          },
        };
      }
      this.calculationSheetGroups[
        index
      ].calculationSheetAlternativeGroup.forEach((element) => {
        element.selected = false;
      });

      this.calculationSheetGroups[index].selected = false;

      this.calculationSheetGroups[index].calculationSheetAlternativeGroup.push({
        name: "",
        selected: true,
        totalAmount: "",
        totalCost: "",
        totalMargin: "",
        calculationSheetMainGroupId: this.calculationSheetGroups[index].id
          ? this.calculationSheetGroups[index].id
          : "",
        calculationSheetItem: mainItemsList,
        calculationSheetAlternativeOptionalGroup: optionalItems,
        calculationAlternativeAmount: [],
        bulkObj: {
          currencyCode: "",
          discount1: "",
          discount2: "",
          shipment: "",
          grossMargin: "",
          quantity: "",
          costType: "",
        },
      });
      this.totalAlternativeAmountIndex =
        this.calculationSheetGroups[index].calculationSheetAlternativeGroup
          .length - 1;
    },
    AddGroupByMainConfig(mainItemsList, OptionalItemList) {
      var optionalItems = null;
      var calWarranty = "";

      if (OptionalItemList.length > 0) {
        optionalItems = {
          name: "",
          totalAmount: "",
          totalCost: "",
          totalMargin: "",
          calculationSheetItem: OptionalItemList,
          bulkObj: {
            currencyCode: "",
            discount1: "",
            discount2: "",
            shipment: "",
            grossMargin: "",
            quantity: "",
            costType: "",
          },
        };
      }
      if (this.BasicInfoObj.warrantyForAllGroups) {
        calWarranty = this.BasicInfoObj.warranty;
      }

      this.calculationSheetGroups.push({
        calculationSheetId: this.calSheetId,
        name: "",
        number: "",
        deliveryTerms: "",
        warranty: calWarranty,
        totalAmount: "",
        totalCost: "",
        totalMargin: "",
        selected: true,
        calculationSheetAlternativeGroup: [],
        calculationSheetItem: mainItemsList,
        calculationSheetOptionalGroup: optionalItems,
        bulkObj: {
          currencyCode: "",
          discount1: "",
          discount2: "",
          shipment: "",
          grossMargin: "",
          quantity: "",
          costType: "",
        },
      });
    },
    extractMainConfigGroupItem() {
      var prelistConfigs = this.prelist;
      // var mainConfigItemsExtract = [];
      var calculationSheetGroups =
        this.calculationSheetGroups[this.currentGroupIndex];

      if (this.mainConfigItems.length > 0) {
        this.mainConfigItems.map(function (mainConfigGroup) {
          if (mainConfigGroup.itemGroupMainConfig.length > 0) {
            mainConfigGroup.itemGroupMainConfig.map(function (mainConfig) {
              if (prelistConfigs.includes(mainConfig.id)) {
                if (mainConfig.itemGroupMainConfigItems.length > 0) {
                  mainConfig.itemGroupMainConfigItems.map(function (
                    groupMainConfigItemsObjectOfArray
                  ) {
                    calculationSheetGroups.calculationSheetItem.push({
                      name: groupMainConfigItemsObjectOfArray.itemName,
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
                      currencyCode: this.calculationSheetCode,
                      currencySymbol: this.currenciesList.filter(
                        (x) => x.code == this.calculationSheetCode
                      )[0].currencySymbol,
                      shipment: "",
                      landedCost: "",
                      foc: false,
                      foC_Value: "",
                      grossMargin: "",
                      unitPrice: "",
                      amount: "",
                      grossMarginValue: "",
                      note: " ",
                      approve: false,
                    });
                  });
                }
              }
            });
          }
        });
      }
      this.bulidCalculationSheetDialog = false;
    },
    nextStep: function () {
      this.$emit("next-step");
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
    clearAll() {
      this.ItemsGroupObj = {
        groupName: "",
        principalId: "",
        categoryId: "",
        modelId: "",
        isActive: true,
        itemGroupMainConfig: [],
        itemGroupOptionalItem: [],
      };
    },
    getSelection() {
      var trueArr = [];
      this.calculationSheetGroups.forEach((element) => {
        if (element) {
          if (element.selected == true) {
            trueArr.push(element.selected);
          } else {
            element.calculationSheetAlternativeGroup.forEach((alterElement) => {
              if (alterElement.selected == true) {
                trueArr.push(alterElement.selected);
              }
            });
          }
        }
      });

      if (trueArr.length == this.calculationSheetGroups.length) {
        return true;
      } else {
        return false;
      }
    },
    checkSelection() {
      // var trueArr = [];
      var isValidArr = [];
      let result = true;
      this.calculationSheetGroups.forEach((element) => {
        if (element) {
          if (element.selected == true) {
            if (element.calculationSheetItem.length > 0) {
              element.calculationSheetItem.forEach((_element) => {
                if (_element.name == "") {
                  isValidArr.push(false);
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "error",
                    message: this.$t("PleaseAddItemDescription"),
                  });
                  result = false;
                  // return isValidArr;
                }
                // else if ( _element.cost == "" ) {//seif upon client need -via email-
                //     isValidArr.push(false);
                //     this.$message({
                //         showClose: true,
                //         duration: this.$store.getters.getMessagesDuration,
                //         type: "error",
                //         message: this.$t("PleaseAddItemCost")
                //     });
                //     result = false;
                //     // return isValidArr;
                // }
                else if (_element.quantity == "") {
                  isValidArr.push(false);
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "error",
                    message: this.$t("PleaseAddItemQuantity"),
                  });
                  result = false;
                  // return isValidArr;
                }
              });
            } else {
              isValidArr.push(false);
              this.$message({
                showClose: true,
                duration: this.$store.getters.getMessagesDuration,
                type: "error",
                message: this.$t("PleaseAddItem"),
              });
              result = false;
            }
          } else {
            element.calculationSheetAlternativeGroup.forEach((alterElement) => {
              if (alterElement.selected == true) {
                if (element.calculationSheetItem.length > 0) {
                  alterElement.calculationSheetItem.forEach((_element) => {
                    if (_element.name == "") {
                      isValidArr.push(false);
                      this.$message({
                        showClose: true,
                        duration: this.$store.getters.getMessagesDuration,
                        type: "error",
                        message: this.$t("PleaseAddItemDescription"),
                      });
                      result = false;
                      // return isValidArr;
                    }
                    // else if ( _element.cost == "" ) {//seif upon client need -via email-
                    //     isValidArr.push(false);
                    //     this.$message({
                    //         showClose: true,
                    //         duration: this.$store.getters.getMessagesDuration,
                    //         type: "error",
                    //         message: this.$t("PleaseAddItemCost")
                    //     });
                    //     result = false;
                    //     // return isValidArr;
                    // }
                    else if (_element.quantity == "") {
                      isValidArr.push(false);
                      this.$message({
                        showClose: true,
                        duration: this.$store.getters.getMessagesDuration,
                        type: "error",
                        message: this.$t("PleaseAddItemQuantity"),
                      });
                      result = false;
                      // return isValidArr;
                    }
                  });
                } else {
                  isValidArr.push(false);
                  this.$message({
                    showClose: true,
                    duration: this.$store.getters.getMessagesDuration,
                    type: "error",
                    message: this.$t("PleaseAddItem"),
                  });
                  result = false;
                }
              }
            });
          }
        }
      });
      // let result = isValidArr.filter(word => word == false);
      // return result.length > 0 ? false : true;
      return result;
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
    reBuildItems() {
      var val = this.calculationSheetGroups;
      if (val && val.length > 0) {
        val.forEach((element) => {
          element.calculationSheetItem.forEach((_element) => {
            this.calculatorMainItemChange(_element);
          });

          element.calculationSheetAlternativeGroup.forEach((alterElement) => {
            alterElement.calculationSheetItem.forEach((_element) => {
              this.calculatorMainItemChange(_element);
            });

            if (alterElement.calculationSheetAlternativeOptionalGroup != null) {
              alterElement.calculationSheetAlternativeOptionalGroup.calculationSheetItem.forEach(
                (_elementOptional) => {
                  this.calculatorMainItemChange(_elementOptional);
                }
              );
            }
          });

          if (element.calculationSheetOptionalGroup) {
            element.calculationSheetOptionalGroup.calculationSheetItem.forEach(
              (_element) => {
                this.calculatorMainItemChange(_element);
              }
            );
          }
        });
      }
      // this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
      this.getSelection();
    },
    /*saveAndLeave() {
            if (this.mainGroupPrevCount) {
                this.UpdateMainGroup();
                return;
            }
            
            this.fullscreenLoading = true;
            if(this.BasicInfoObj.isVat){
                this.bankBlockViewModel.vatValue = this.VAT
            }else{
                this.bankBlockViewModel.vatValue = null
            }
            
            var urlStr =
                this.$store.getters.serverURI +
                "api/CalculationSheet/" +
                this.calSheetId +
                "/MainGroup";
            this.$http
                .post(
                    urlStr, {
                        calculationSheetMainGroup: this.calculationSheetGroups,
                        bankBlockViewModel: this.bankBlockViewModel
                    }, {
                        headers: this.$store.getters.tokenAuthonticationHeaderObj
                    }
                )
                .then(
                    () => {
                        this.fullscreenLoading = false;
                        this.$message({
                            showClose: true,
                            duration: this.$store.getters.getMessagesDuration,
                            type: "success",
                            message: this.$t("CalculationSheetItemsCreateItems")
                        });
                        this.status = "New";
                        if (isPrevious) {
                            this.$emit("previous-step");
                            // this.getCalculationSheetData()
                        } else {
                            this.FillData();
                            // this.getCalculationSheetData()
                        }
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
       },*/

    checkWarrantyAccepted(warrantyLookup, CalcGroup) {
      if (!warrantyLookup) return false;
      const arrCode = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // MSSTMSSUP-115 -  if 1 year .. 10 years should be same, if varies or unspecified should be opened to edit

      if (arrCode.includes(warrantyLookup.code)) {
        if (CalcGroup && CalcGroup.warranty !== undefined) {
          CalcGroup.warranty = this.BasicInfoObj.warrantyLookup.name;
        }
        this.isWarrantyAccepted = true;
        return true;
      }
      return false;
    },
    calculateTotalAmountTotalMarginTotalLandedCost() {
      var val = this.calculationSheetGroups;
      if (val && val.length > 0) {
        val.forEach((element) => {
          var Amount = 0.0;
          var LandingCost = 0.0;
          var Margin = 0.0;
          var Cost = 0.0;

          element.calculationSheetItem.forEach((_element) => {
            if (_element.amount != "") {
              Amount += parseFloat(_element.amount);
            }
            if (_element.landedCost != "" && _element.quantity != "") {
              LandingCost +=
                parseFloat(_element.landedCost) * parseFloat(_element.quantity);
            }
            if (_element.grossMarginValue != "") {
              Margin += parseFloat(_element.grossMarginValue);
            }
            if (_element.cost != "") {
              Cost += parseFloat(_element.cost);
            }
          });

          // element.totalAmount = Number.isNaN(Amount) ? 0.0 : Amount.toFixed(3).slice(0,-1);
          element.totalAmount = Amount.toFixed(3).slice(0, -1);
          element.totalCost = Number.isNaN(LandingCost)
            ? 0.0
            : LandingCost.toFixed(3).slice(0, -1);
          element.totalMargin = Number.isNaN(Margin)
            ? 0.0
            : Margin.toFixed(3).slice(0, -1);

          element.totalCostRaw = Number.isNaN(Cost)
            ? 0.0
            : Cost.toFixed(3).slice(0, -1);

          element.calculationSheetAlternativeGroup.forEach((alterElement) => {
            var AlternativeAmount = 0.0;
            var AlternativeLandingCost = 0.0;
            var AlternativeMargin = 0.0;
            var AlternativeCost = 0.0;

            alterElement.calculationSheetItem.forEach((_element) => {
              if (_element.amount != "") {
                AlternativeAmount += parseFloat(_element.amount);
              }
              if (_element.landedCost != "" && _element.quantity != "") {
                AlternativeLandingCost +=
                  parseFloat(_element.landedCost) *
                  parseFloat(_element.quantity);
              }
              if (_element.grossMarginValue != "") {
                AlternativeMargin += parseFloat(_element.grossMarginValue);
              }
              if (_element.cost != "") {
                AlternativeCost += parseFloat(_element.cost);
              }
            });

            alterElement.totalAmount = Number.isNaN(AlternativeAmount)
              ? 0.0
              : AlternativeAmount.toFixed(3).slice(0, -1);
            alterElement.totalCost = Number.isNaN(AlternativeLandingCost)
              ? 0.0
              : AlternativeLandingCost.toFixed(3).slice(0, -1);
            alterElement.totalMargin = Number.isNaN(AlternativeMargin)
              ? 0.0
              : AlternativeMargin.toFixed(3).slice(0, -1);
            alterElement.totalCostRaw = Number.isNaN(AlternativeCost)
              ? 0.0
              : AlternativeCost.toFixed(3).slice(0, -1);

            if (alterElement.calculationSheetAlternativeOptionalGroup != null) {
              var AlternativeOptionalAmount = 0.0;
              var AlternativeOptionalLandingCost = 0.0;
              var AlternativeOptionalMargin = 0.0;
              var AlternativeOptionalCost = 0.0;

              alterElement.calculationSheetAlternativeOptionalGroup.calculationSheetItem.forEach(
                (_elementOptional) => {
                  if (_elementOptional.amount != "") {
                    AlternativeOptionalAmount += parseFloat(
                      _elementOptional.amount
                    );
                  }
                  if (
                    _elementOptional.landedCost != "" &&
                    _elementOptional.quantity != ""
                  ) {
                    AlternativeOptionalLandingCost +=
                      parseFloat(_elementOptional.landedCost) *
                      parseFloat(_elementOptional.quantity);
                  }
                  if (_elementOptional.grossMarginValue != "") {
                    AlternativeOptionalMargin += parseFloat(
                      _elementOptional.grossMarginValue
                    );
                  }
                  if (_elementOptional.cost != "") {
                    AlternativeOptionalCost += parseFloat(
                      _elementOptional.cost
                    );
                  }
                }
              );

              alterElement.calculationSheetAlternativeOptionalGroup.totalAmount =
                Number.isNaN(AlternativeOptionalAmount)
                  ? 0.0
                  : AlternativeOptionalAmount.toFixed(3).slice(0, -1);
              alterElement.calculationSheetAlternativeOptionalGroup.totalCost =
                Number.isNaN(AlternativeOptionalLandingCost)
                  ? 0.0
                  : AlternativeOptionalLandingCost.toFixed(3).slice(0, -1);
              alterElement.calculationSheetAlternativeOptionalGroup.totalMargin =
                Number.isNaN(AlternativeOptionalMargin)
                  ? 0.0
                  : AlternativeOptionalMargin.toFixed(3).slice(0, -1);

              alterElement.calculationSheetAlternativeOptionalGroup.totalCostRaw =
                Number.isNaN(AlternativeOptionalCost)
                  ? 0.0
                  : AlternativeOptionalCost.toFixed(3).slice(0, -1);
            }
          });

          if (element.calculationSheetOptionalGroup) {
            var OptionalAmount = 0.0;
            var OptionalLandingCost = 0.0;
            var OptionalMargin = 0.0;
            var OptionalCost = 0.0;

            element.calculationSheetOptionalGroup.calculationSheetItem.forEach(
              (_element) => {
                if (_element.amount != "") {
                  OptionalAmount += parseFloat(_element.amount);
                }
                if (_element.landedCost != "" && _element.quantity != "") {
                  OptionalLandingCost +=
                    parseFloat(_element.landedCost) *
                    parseFloat(_element.quantity);
                }
                if (_element.grossMarginValue != "") {
                  OptionalMargin += parseFloat(_element.grossMarginValue);
                }
                if (_element.cost != "") {
                  OptionalCost += parseFloat(_element.cost);
                }
              }
            );

            element.calculationSheetOptionalGroup.totalAmount = Number.isNaN(
              OptionalAmount
            )
              ? 0.0
              : OptionalAmount.toFixed(3).slice(0, -1);
            element.calculationSheetOptionalGroup.totalCost = Number.isNaN(
              OptionalLandingCost
            )
              ? 0.0
              : OptionalLandingCost.toFixed(3).slice(0, -1);
            element.calculationSheetOptionalGroup.totalMargin = Number.isNaN(
              OptionalMargin
            )
              ? 0.0
              : OptionalMargin.toFixed(3).slice(0, -1);

            element.calculationSheetOptionalGroup.totalCostRaw = Number.isNaN(
              OptionalCost
            )
              ? 0.0
              : OptionalCost.toFixed(3).slice(0, -1);
          }
        });
      }
    },
    deleteSelectedForCalcuationSheetMainItems(index) {
      if (
        !this.calculationSheetGroups[index].calculationSheetItem ||
        this.calculationSheetGroups[index].calculationSheetItem.length == 0
      )
        return;

      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("DeleteSelectedItemsConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Ok"),
        cancelButtonText: this.$t("Cancel"),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            // Filter out selected items without using splice directly
            this.$set(
              this.calculationSheetGroups[index],
              "calculationSheetItem",
              this.calculationSheetGroups[index].calculationSheetItem.filter(
                (item) => !item.selected
              )
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
    deleteSelectedForCalcuationSheetOptionalGroupItems(index) {
      if (
        !this.calculationSheetGroups[index].calculationSheetOptionalGroup
          .calculationSheetItem ||
        this.calculationSheetGroups[index].calculationSheetOptionalGroup
          .calculationSheetItem.length == 0
      )
        return;

      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("DeleteSelectedItemsConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Ok"),
        cancelButtonText: this.$t("Cancel"),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            // Filter out selected items without using splice directly
            this.$set(
              this.calculationSheetGroups[index].calculationSheetOptionalGroup,
              "calculationSheetItem",
              this.calculationSheetGroups[
                index
              ].calculationSheetOptionalGroup.calculationSheetItem.filter(
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
        !this.calculationSheetGroups[index].calculationSheetAlternativeGroup[
          alternativeGroupIndex
        ].calculationSheetAlternativeOptionalGroup.calculationSheetItem ||
        this.calculationSheetGroups[index].calculationSheetAlternativeGroup[
          alternativeGroupIndex
        ].calculationSheetAlternativeOptionalGroup.calculationSheetItem
          .length == 0
      )
        return;

      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("DeleteSelectedItemsConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Ok"),
        cancelButtonText: this.$t("Cancel"),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            // Filter out selected items without using splice directly
            this.$set(
              this.calculationSheetGroups[index]
                .calculationSheetAlternativeGroup[alternativeGroupIndex]
                .calculationSheetAlternativeOptionalGroup,
              "calculationSheetItem",
              this.calculationSheetGroups[
                index
              ].calculationSheetAlternativeGroup[
                alternativeGroupIndex
              ].calculationSheetAlternativeOptionalGroup.calculationSheetItem.filter(
                (item) => !item.selected
              )
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
        !this.calculationSheetGroups[index].calculationSheetAlternativeGroup[
          alternativeGroupIndex
        ].calculationSheetItem ||
        this.calculationSheetGroups[index].calculationSheetAlternativeGroup[
          alternativeGroupIndex
        ].calculationSheetItem.length == 0
      )
        return;

      const h = this.$createElement;
      this.$msgbox({
        title: this.$t("Confirm"),
        message: h("p", null, [
          h("span", null, this.$t("DeleteSelectedItemsConfirmationMessage")),
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t("Ok"),
        cancelButtonText: this.$t("Cancel"),
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            // Filter out selected items without using splice directly

            this.$set(
              this.calculationSheetGroups[index]
                .calculationSheetAlternativeGroup[alternativeGroupIndex],
              "calculationSheetItem",
              this.calculationSheetGroups[
                index
              ].calculationSheetAlternativeGroup[
                alternativeGroupIndex
              ].calculationSheetItem.filter((item) => !item.selected)
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
  },

  watch: {
    calculationSheetGroups: {
      handler() {
        this.calculateTotalAmountTotalMarginTotalLandedCost();

        this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
        this.getSelection();
      },
      deep: true,
    },

    bankBlockViewModel: {
      handler() {},
      deep: true,
    },
  },
};
</script>

<style scoped>
.bulk {
  top: 28px;
  position: absolute;
}
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

.height-35 {
  height: 35px;
}

.card {
  margin-bottom: 0.5rem;
}

.mt-60 {
  margin-top: 60px !important;
}

.float-button {
  position: absolute;
  padding-top: -35px !important;
  top: -60px;
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
</style>