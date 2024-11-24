<template>
  <div>
  
      <b-card class="card card-accent-primary" no-body v-loading.fullscreen.lock="fullscreenLoading">
  
          <div slot="header">
  
              {{$t("BasicInformation")}}
  
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
  
                              <div class="form-group" :class="{'has-error':errors.has('QuotationNumber')}">
  
                                  <label class="col-form-label">{{$t("QuotationNumber")}}</label>
  
                                  <input type="text" name="QuotationNumber" class="form-control" v-model="BasicInfoObj.tenderNumber"  autocomplete="off" disabled />
  
                              </div>
  
                          </div>
  
  
  
                          <div class="col-md-3">
  
                              <div class="form-group">
  
                                  <label class="col-form-label">{{$t("Currency(Multiply)")}}</label>
  
                                  <input type="text" name="tenderCurrencyCode" class="form-control" v-model="BasicInfoObj.tenderCurrencyCode"  autocomplete="off" disabled />
  
                              </div>
  
                          </div>
  
  
  
                          <div class="col-md-3">
  
                              <div class="form-group" :class="{'has-error':errors.has('vatValue') || VAT > 100 || VAT < 0 }">
  
                                  <label class="col-form-label">VAT value (%)</label>
  
                                  <input v-if="BasicInfoObj.isVat" type="number" @change="reBuildItems();getTotalAmountTotalGrossMarginTotalGrossMarginValue()" min="0" max="100" name="vatValue" class="form-control" v-model="VAT" v-validate="BasicInfoObj.isVat ? 'required' : ''" :data-vv-as="$t('VatValue')" autocomplete="off" />
                              <div class="help-block"
                                   v-if="errors.has('vatValue') && BasicInfoObj.isVat && errors.items[0].rule == 'decimal'">{{ $t('vatValidation')}}
                              </div>
                              <div class="help-block" v-if="VAT > 100 || VAT < 0" >{{ $t('vatValidation')}}</div>
                                  <input v-if="!BasicInfoObj.isVat" disabled type="text" value="0" name="vatValue1" class="form-control" autocomplete="off" />
                              </div>
                          </div>
  
  
  
                          <div class="col-md-3">
  
                              <div class="form-group">
  
                                  <label class="col-form-label">{{$t("SubmissionDate")}}</label>
  
                                  <input type="text" name="BasicInfoObj.submissionDate" class="form-control" v-model="BasicInfoObj.submissionDate"  autocomplete="off" disabled />
  
                              </div>
  
                          </div>
  
                      </div>
  
                  </form>
  
              </b-card-body>
  
          </b-collapse>
  
      </b-card>
  
  
  
      <b-card class="card card-accent-primary" no-body>
  
          <div slot="header">
  
              {{$t("CalculationSheetGroups")}}
  
              <div class="card-header-actions"></div>
  
          </div>
  
          <b-collapse id="collapse1" visible>
  
              <b-card-body>
  
                  <b-row>
  
                      <b-col lg="12">
                         <!-- <input type="file" class="my_input" @change="importExcel" id="upload" />Import -->
                          <button @click="ShowExcelSheetDialog()" class="pull-right btn btn-secondary mt-1 mb-2" variant="secondary">
                               <i class="fa fa-file-excel-o"></i> 
                              {{ $t('ImportFromExcelSheet')}}
                          </button>
                          <button class="btn csubmit pull-right mr-1 mt-1 mb-2" variant="primary" @click="Excel()">
                              <i class="fa fa-file-excel-o"></i>
                              Export excel
                          </button>
                          <el-button @click="ShowDialogToFetchItemFromMainConfigs()" class="btn btn-secondary mt-1 mb-2">{{ $t('BuildTenderCalculationSheetItem')}}</el-button>
                          <el-button @click="addNewGroup()" class="btn btn-secondary mt-1 mb-2" v-if="tenderCalculationSheetGroups.length==0">
                              <i class="fa fa-plus"></i> {{ $t('newGroup')}}
                              
                          </el-button>
                      </b-col>
  
                  </b-row>
                  
                  <b-row :key='index' v-for="(CalcGroup,index) in tenderCalculationSheetGroups">
  
                      <b-col lg="12" class="parent-card">
  
                          <b-card class="card card-accent-primary" no-body>
  
                              <div slot="header">
  
                                  <div class="row">
  
                                      <!-- <input type="radio" :name="'name'+index" :value="CalcGroup.selected" :checked="CalcGroup.selected" style="margin-left: 15px;margin-top: 10px;width: 23px;height: 17px;" @change="selectMainGroup(CalcGroup,index,$event)" /> -->
                                      <a href="javascript:void(0)" class="text-success" @click="showDuplicateGroupDialog(index)" style="margin-left: 20px; margin-top: 10px;">
                                          <i class="fa fa-copy"></i>
                                      </a>
                                      <label for="inputEmail3" class="col-sm-1 col-md-1 col-xl-1 col-form-label">{{$t("Item")}}-{{index+1}}</label>
  
                                      <div class="row col-md-10 col-lg-10 col-xl-10">
  
                                          <div class="col-md-3 col-lg-3 col-xl-3">
  
                                              <div class="form-group">
  
                                                  <label class="col-form-label">{{$t("name")}}</label>
  
                                                  <input type="text" class="form-control" id="inputEmail3"  v-model="CalcGroup.name" autocomplete="off" :maxlength="$store.getters.getMaxLength.length200" />
  
                                              </div>
  
                                          </div>
  
                                          <div class="col-md-3 col-lg-3 col-xl-3">
  
                                              <div class="form-group">
  
                                                  <label class="col-form-label">{{$t("TenderItemNumber")}}</label>
  
                                                  <input type="text" class="form-control" id="inputEmail4"  v-model="CalcGroup.number" autocomplete="off" :maxlength="$store.getters.getMaxLength.length30" />
  
                                              </div>
  
                                          </div>
  
  
  
                                          <div class="col-md-3 col-lg-3 col-xl-3">
  
                                              <div class="form-group">
  
                                                  <label class="col-form-label">{{$t("DeliveryTerms")}}</label>
  
                                                  <input class="form-control" id="inputEmail3"  v-model="CalcGroup.deliveryTerms" autocomplete="off" :maxlength="$store.getters.getMaxLength.length30" />
  
                                              </div>
  
                                          </div>
  
  
  
                                          <div class="col-md-3 col-lg-3 col-xl-3">
  
                                              <div class="form-group">
  
                                                  <label class="col-form-label">{{$t("Warranty")}}</label>
  
                                                  <input min="1" class="form-control" id="inputEmail4" v-model="CalcGroup.warranty" autocomplete="off" :maxlength="$store.getters.getMaxLength.length30" :disabled="BasicInfoObj.warrantyForAllGroups" />
  
                                              </div>
  
                                          </div>
  
                                      </div>
  
                                      <div class="pabsolute">
  
                                          <div class="card-header-actions">
  
                                              <b-link class="card-header-action btn-minimize" v-b-toggle="'mainItem-'+index">
  
                                                  <span class="when-opened">
  
                              <i class="icon-arrow-up"></i>
  
                            </span>
  
                                                  <span class="when-closed">
  
                              <i class="icon-arrow-down"></i>
  
                            </span>
  
                                              </b-link>
  
                                              <b-link class="card-header-action" @click="removeSingleGroup(index)">
  
                                                  <i class="fa fa-close"></i>
  
                                              </b-link>
  
                                          </div>
  
                                      </div>
  
                                  </div>
  
                              </div>

                              <b-collapse :id="'mainItem-'+index" visible>
  
                                  <b-card-body>
  
                                      <div class="table-responsive-lg table-responsive">
                                          <el-table class="table-sm table-responsive custom-table" :data="CalcGroup.tenderCalculationSheetItem" size="mini" style="width: 100%">
  

                                              <el-table-column label width="50" fixed>

                                                  <template slot="header" slot-scope="scope">
                                                      <button
                                                          @click="deleteSelectedForCalcuationSheetMainItems(index)"
                                                          style="background-color: red; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer;"
                                                      >
                                                      <i class="fa fa-trash"></i>
                                                  </button>
                                                  </template>

                                                  <template slot-scope="scope"> 

                                                      <input type="checkbox" v-model="scope.row.selected"   :key="'mainItem-'+scope.row.id"   :id="'mainItemCheckbox'+scope.$index"  :name="'mainItemCheckbox'+scope.$index"
                                                  style="margin-left: 4px;margin-top: 10px;width: 23px;height: 17px;" />

                                                  </template>

                                              </el-table-column>  

                                              <el-table-column label width="20" fixed>
  
                                                  <template slot-scope="scope">
  
                                                              <a class="text-danger" @mousedown="removeCalcuationSheetMainItems(index,scope.row)" >  <i class="fa fa-trash"></i> </a>
                                                  </template>
                                              </el-table-column>

                                              <el-table-column type="index" width="40" fixed></el-table-column>
                                              <el-table-column
                              prop="Name"
                              label="Item Code"
                              width="150"
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
                          width="240"
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


                                              <el-table-column prop="vendor" label="Company" width="120">
                                                  <template slot-scope="scope">
                                                      <el-input  readonly v-model="scope.row.vendor" disabled size="mini" autocomplete="off">
                                                      
                                                      </el-input>
                                                  </template>
                                              </el-table-column>


                     <el-table-column prop="winningProbability" label="WinProb" width="80">
                          <template slot-scope="scope">
                              <b-form class="form-inline"> <b-form-checkbox v-model="scope.row.winningProbability"></b-form-checkbox></b-form>
                          </template>
                      </el-table-column>



                                          <el-table-column prop="onHandPrice" label="OH price" width="110">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.onHandPrice" size="mini"  disabled autocomplete="off">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <!-- <el-table-column prop="onHandPriceCurrencySymbol" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.onHandPriceCurrencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column> -->

              <el-table-column prop="onHandQuantity" label="OH Qty" width="110">
                      <template slot-scope="scope">
                          <el-input v-model="scope.row.onHandQuantity" size="mini"  disabled autocomplete="off">
                          
                          </el-input>
                      </template>
                      </el-table-column>

                       <el-table-column prop="Cost" label="Cost" width="100">
                      <template slot-scope="scope">
                          <el-input v-model="scope.row.cost" @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off">
                          
                          </el-input>
                      </template>
              </el-table-column>


<!-- <el-table-column prop="discount1" label="Disc1%" width="120">
<template slot-scope="scope">
  <el-input v-model="scope.row.discount1" @input="handleDecimal(scope.row)" @change="calculatorMainItemChange(scope.row)" size="mini" autocomplete="off"   >
  
  </el-input>
</template>
                      </el-table-column>

                      <el-table-column prop="discount2" label="Disc2%" width="120">
<template slot-scope="scope">
  <el-input v-model="scope.row.discount2" @input="handleDecimal(scope.row)" @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->

                     <el-table-column prop="costType" label="Cost type " width="110">
                          <template slot-scope="scope">
                              <el-select v-model="scope.row.costType" @change="changeCostType(scope.row)" clearable filterable name="costType" class="full-width padding-3" size="mini">
                                  <el-option v-for="option in costTypeList" :value="option.id" :label="option.name" :key="option.id"></el-option>
                              </el-select>
                          </template>
                      </el-table-column> 

            <!--                 <el-table-column prop="shipment" label="S&C" width="120">
<template slot-scope="scope">
  <el-input @change="calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.shipment" size="mini" autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->

            <!--              <el-table-column prop="landedCost" label="Landed cost" width="120">
<template slot-scope="scope">
  <el-input     v-model="scope.row.landedCost" size="mini" disabled autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->

       <!--               <el-table-column prop="grossMargin" label="GM%" width="120">
<template slot-scope="scope">
  <el-input @input="handleDecimal(scope.row)" @change="calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.grossMargin" size="mini" autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column>

                       <el-table-column prop="Gross margin" label="Gross margin" width="120">
<template slot-scope="scope">
  <el-input   @change="calculatorMainItemChange(scope.row)" v-model="scope.row.grossMarginValue" disabled size="mini" autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->


<el-table-column prop="shelfLife" label="Shelf Life" width="120">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.shelfLife" size="mini" autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>


                      <el-table-column prop="countryOfOrigin" label="Country of Origin" width="160">

<template slot-scope="scope">
  <el-select
                      :loading="loadingAccount" v-model="scope.row.countryofOriginIds" @change="handleCountryofOriginIds(scope.row)"
                       clearable filterable 
                       class="full-width padding-3"
                        size="mini"
                        multiple
                        collapse-tags
                        >
      <el-option v-for="option in countryList" :value="option.id" :label="option.name" :key="option.value"></el-option>
  </el-select>
</template>
                      </el-table-column>

                      <el-table-column prop="tenderUnit" label="Tender Unit" width="120">
                          <template slot-scope="scope">
                              <el-select
                                  @change="handleTeenderUnitChange(scope.row)"
                                  :loading="loadingAccount" v-model="scope.row.tenderUnitM"
                                  clearable filterable 
                                  class="full-width padding-3"
                                  size="mini">
                                  <el-option v-for="option in tenderUnitMList" :value="option.value" :label="option.name" :key="option.value"></el-option>
                              </el-select>
                          </template>
                      </el-table-column>
                      <el-table-column prop="tenderUnitValue" label="Tender Unit Value" width="120">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.tenderUnitValue" :disabled="scope.row.tenderUnitM !== 0" @change="calculatorMainItemChange(scope.row)" size="mini" autocomplete="off">
                              </el-input>
                          </template>
                      </el-table-column>
                      <el-table-column prop="msS_Unit" label="MSS Unit" width="100">
                          <template slot-scope="scope">
                              <el-select
                                  @change="handleMSSUnitChange(scope.row)"
                                  :loading="loadingAccount" v-model="scope.row.msS_Unit"
                                  clearable filterable 
                                  class="full-width padding-3"
                                  size="mini">
                                  <el-option v-for="option in mssUnitList" :value="option.value" :label="option.name" 
                                  :key="option.value"></el-option>
                              </el-select>
                          </template>
                      </el-table-column>
                      <el-table-column prop="mssUnitValue" label="MSS Unit Value" width="120">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.mssUnitValue" :disabled="scope.row.msS_Unit != '0'" @change="calculatorMainItemChange(scope.row)" size="mini" autocomplete="off">
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="TenderQuantity" label="Tender Quantity" width="120">

                      <template slot-scope="scope">
                          <el-input v-model="scope.row.tenderQuantity" @change="calculatorMainItemChange(scope.row)" size="mini" autocomplete="off">
                          
                          </el-input>
                      </template>
                      </el-table-column>  
                      
                      <el-table-column prop="msS_Quantity" label="MSS Quantity" width="120">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.msS_Quantity" disabled size="mini" autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="currencyCode" label="Currency" width="110">
                          <template slot-scope="scope">
                              <el-select remote :remote-method="remoteMethodCurrency"
                                              :loading="loadingAccount"  v-model="scope.row.currencyCode" clearable filterable class="full-width padding-3" @change="currencyChanged(scope.row);calculatorMainItemChange(scope.row)" size="mini">
                                  <el-option v-for="option in currenciesList " :value="option.code" :label="option.code" :key="option.code"></el-option>
                              </el-select>
                          </template>
                      </el-table-column>
                      
      <el-table-column prop="foB_MSS_Unit" label="FOB MSS UNIT" width="120">
          <template slot-scope="scope">
              <el-input v-model="scope.row.foB_MSS_Unit" :disabled="scope.row.costTypeCode != 3" 
                      @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off">                
              </el-input>
          </template>
          </el-table-column>
          


                      <el-table-column prop="shippingExpenses" label="Shipping Expenses" width="200">
                          <template slot-scope="scope">
                              <b-row class="align-items-center">
                                  <b-col lg="12" class="d-flex align-items-center">
                                  <el-input v-model="scope.row.shippingExpenses" :disabled="true"  @change="calculatorMainItemChange(scope.row)" size="mini" autocomplete="off" class="pr-2"></el-input>
                                  <el-button @click="showShippingExpensesDialog(scope.row)" :disabled="scope.row.costTypeCode != 3">
                                  <i class="fa fa-eye"></i> 
                                  </el-button>
                              
                              </b-col>    
                          </b-row>    
                          </template>
                       
                      </el-table-column>
                      
                     
                     
                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>
                      <el-table-column prop="shippingExpenseType" label="Value or percentage" width="150">
                          <template slot-scope="scope">
                              <el-select 
                                  :disabled="scope.row.costTypeCode != 3"
                                   @change="calculatorMainItemChange(scope.row)"
                                  class="input-custom"
                                  v-model="scope.row.shippingExpenseType"
                                  :placeholder="$t('Select')"
                                  :name="'shippingExpenseType'"
                                  data-vv-scope="EventCreationValidation"
                                  clearable>
                                  <el-option :value="true" label="Value" :key="true"></el-option>
                                  <el-option :value="false" label="Percentage" :key="false"></el-option>
                              </el-select>
                          </template>
                      </el-table-column> 

                      <el-table-column prop="foc" label="FOC / Discount" width="120">
                          <template slot-scope="scope">
                          <label class="form-checkbox pb-1"></label>
                          <input type="checkbox" v-model="scope.row.foc" @click="changeFoc(scope.row)" :id="'foc'+scope.$index" :name="'foc'+scope.$index"/>
                          </template>
                      </el-table-column>

                      <el-table-column prop="foC_Value" label="FOC / Discount Value" width="150">
                              <template slot-scope="scope">

                              <el-input v-model="scope.row.foC_Value" :disabled="!scope.row.foc" @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off">
                                  
                                  </el-input>

                              </template>
                      </el-table-column>

                      <el-table-column prop="cif" label="CIF" width="80">
                      <template slot-scope="scope">
                          <el-input @input="handleDecimal(scope.row)" disabled @change="reEquation('cif',scope.row); calculatorShipmentMarginItemChange(scope.row);scope.row.cifPlaceHolder=''" v-model="scope.row.cif" size="mini" autocomplete="off">
                          
                          </el-input>
                      </template>
                      </el-table-column>  

                      <el-table-column prop="cifValueInTheSelectedCurrency" label="CIF value in selected currency" width="120">
                      <template slot-scope="scope">
                          <el-input @input="handleDecimal(scope.row)" :disabled="scope.row.costTypeCode == 3" @change="reEquation('cif',scope.row); calculatorShipmentMarginItemChange(scope.row);scope.row.cifPlaceHolder=''" v-model="scope.row.cifValueInTheSelectedCurrency" size="mini" autocomplete="off" :placeholder="scope.row.cifPlaceHolder">
                          
                          </el-input>
                      </template>
                      </el-table-column> 

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                  <el-table-column prop="factor" label="Factor" width="110">
                      <template slot-scope="scope">
                          <el-input @input="handleDecimal(scope.row)" :disabled="scope.row.costTypeCode == 2" @change="reEquation('factor',scope.row); calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.factor" size="mini" autocomplete="off"></el-input>
                      </template>
                  </el-table-column>   
                
                 <el-table-column prop="" label="Item currency" width="120">
                      <template slot-scope="scope">
                          <label>{{scope.row.currencyCode}} </label> 
                      </template>
                  </el-table-column>   

                  <el-table-column prop="suggestedQuotedPrice_WO_VAT" :label="SuggestionLabel()"  width="320">
                      <template slot-scope="scope">
                          <el-input   @change="reEquation('suggested',scope.row); calculatorMainItemChange(scope.row,'suggestedQuotedPrice_WO_VAT');scope.row.suggestedQuotedPrice_WO_VATPlaceHolder=''" v-model="scope.row.suggestedQuotedPrice_WO_VAT" size="mini" autocomplete="off" ></el-input>
                      </template>
                  </el-table-column> 
                 
                  <el-table-column prop="suggestedPrice_WO_VAT_SelectedCurrency" label="Suggested qouted price W/O VAT in selected currency"  width="320">
                      <template slot-scope="scope">
                          <el-input   @change="reEquation('suggested',scope.row); calculatorMainItemChange(scope.row);scope.row.suggestedQuotedPrice_WO_VATPlaceHolder=''" v-model="scope.row.suggestedPrice_WO_VAT_SelectedCurrency" size="mini" autocomplete="off" :placeholder="scope.row.suggestedQuotedPrice_WO_VATPlaceHolder" ></el-input>
                      </template>
                  </el-table-column> 

                  <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                 <el-table-column prop="lastWinningPrice_WO_VAT" label="Last winning price w/o VAT" width="180">
                      <template slot-scope="scope">
                          <el-input    @change="calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.lastWinningPrice_WO_VAT" size="mini" autocomplete="off">
                          
                          </el-input>
                      </template>
                  </el-table-column>

                  <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                       <el-table-column prop="total_WO_VAT" label="Total Quoted Price W/O VAT" width="180">
                          <template slot-scope="scope">
                              <el-input  disabled @change="calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.total_WO_VAT" size="mini" autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="profitPercentage" label="Profit %" width="120">
                          <template slot-scope="scope">
                              <el-input @input="handleDecimal(scope.row)" v-model="(scope.row.profitPercentage * 100).toFixed(3)" size="mini" disabled autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="profitAmount" label="Profit #" width="120">
                      <template slot-scope="scope">
                          <el-input     v-model="scope.row.profitAmount" size="mini" disabled autocomplete="off">
                          
                          </el-input>
                      </template>
                      </el-table-column>
                      


                    <!--    <el-table-column prop="adjustedTenderUnitPrice" label="Total" width="120">
                        
<template slot-scope="scope">
  <el-input     v-model="scope.row.adjustedTenderUnitPrice" size="mini" disabled autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->

                      <el-table-column prop="tenderUnitPrice" label="Tender Unit Price" width="120">
          <template slot-scope="scope">
              <el-input     v-model="scope.row.tenderUnitPrice" size="mini" disabled autocomplete="off">
              
              </el-input>
          </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="adjustedTenderUnitPrice" label="Adjusted" width="120">
                  <template slot-scope="scope">
                      <el-input     v-model="scope.row.adjustedTenderUnitPrice" size="mini" disabled autocomplete="off">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>


                      <el-table-column prop="totalQuotationPrice" label="Total Quotation Price With VAT" width="200">
                          <template slot-scope="scope">
                              <el-input     v-model="scope.row.totalQuotationPrice" size="mini" disabled autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="regularPrice" label="Regular price" width="120">
                          <template slot-scope="scope">
                              <el-input autocomplete="off" v-model="scope.row.regularPrice" size="mini"></el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="note" label="Note" width="120">
                          <template slot-scope="scope">
                              <el-input autocomplete="off"     v-model="scope.row.note" size="mini">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                    </el-table>
                  </div>

                  <b-row class="mt-1">
                    <b-col lg="4">
                      <el-button
                        v-if=" CalcGroup.tenderCalculationSheetAlternativeGroup.length > 0 "
                        @click="addNewMainSheetItem(index)"
                        class="btn btn-secondary mt-2 mb-2">
                        <span class="fa fa-plus"></span>
                        {{$t('Item')}}
                      </el-button>

                      <el-button
                        @click="addNewMainSheetItem(index)"
                        v-if=" !CalcGroup.tenderCalculationSheetAlternativeGroup.length >0 "
                        class="btn btn-secondary"
                      >
                        <span class="fa fa-plus"></span>
                        {{$t('Item')}}
                      </el-button>
                      
                      <el-button @click="addNewAlternativeGroup(index)" class="btn btn-secondary">
                        <span class="fa fa-plus"></span>
                        {{ $t("addalternative")}}
                      </el-button>
                      <el-button @click="ShowDialogToFetchAlternativeItemFromMainConfigs(index)" class="btn btn-secondary mt-1 mb-1 build-btn">{{ $t('BuildCalculationSheetForAlternative')}}</el-button>
                  </b-col>
                    <b-col lg="2">{{$t('TotalQuotedPriceWOVAT')}} {{CalcGroup.groupTotal_WO_VAT | toUSD}}
                         <strong>{{tenderCalculationSheetCode}}</strong>
                    </b-col>
                    <b-col lg="2">{{$t('TotalQuotationPriceWithVAT')}} {{CalcGroup.groupTotalQuotationPrice | toUSD}}
                         <strong>{{tenderCalculationSheetCode}}</strong>
                    </b-col>
                    <b-col lg="2">{{$t('TotalProfit%')}} 
                      {{CalcGroup.totalProfit | toUSD}} %</b-col>
                    <b-col lg="2">{{$t('TotalProfitAmount')}} {{CalcGroup.totalAmount | toUSD}}
                         <strong>{{tenderCalculationSheetCode}}</strong>
                    </b-col>
                     
                  </b-row>
                  <b-row>
                      <b-col>
                          <el-button @click="addNewOptionalGroup(index)"
                              v-if="!CalcGroup.tenderCalculationSheetOptionalGroup"
                              class="btn btn-secondary mt-1">
                              <span class="fa fa-plus"></span>
                              {{ $t("addoptional")}}
                          </el-button>
                      </b-col>
                  </b-row>
                  <b-row class="mt-1"
                      v-if="CalcGroup.tenderCalculationSheetOptionalGroup && CalcGroup.tenderCalculationSheetOptionalGroup.tenderCalculationSheetItem.length>0">
                      <b-col lg="5">
                          <el-button @click="addNewOptionalItem(index)"
                              class="btn btn-secondary mt-2 mb-1">
                              <span class="fa fa-plus"></span>
                              {{$t('Item')}}
                          </el-button>
                      </b-col>
                  </b-row>


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

                        <b-link
                          class="card-header-action btn-minimize"
                          @click="removeSingleOptionalGroup(index)"
                        >
                          <i class="fa fa-close"></i>
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


                          <el-table-column label width="50" fixed>

                              <template slot="header" slot-scope="scope">
                                  <button
                                      @click="deleteSelectedForCalcuationSheetOptionalGroupItems(index)"
                                      style="background-color: red; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer;"
                                  >
                                  <i class="fa fa-trash"></i>
                              </button>
                              </template>

                              <template slot-scope="scope"> 

                                  <input type="checkbox" v-model="scope.row.selected"   :key="'ItemoptionalGroup-'+scope.row.id"   :id="'ItemoptionalGroupCheckbox'+scope.$index"  :name="'ItemoptionalGroupCheckbox'+scope.$index"
                              style="margin-left: 4px;margin-top: 10px;width: 23px;height: 17px;" />

                              </template>

                          </el-table-column> 

                          <el-table-column label width="20" fixed>
                              <template slot-scope="scope">
                                  <a class="text-danger" @mousedown="removeOptionalItem(index,scope.row)">
                                      <i class="fa fa-trash"></i>      
                                  </a>
                              </template>
                          </el-table-column>

                          <el-table-column type="index" width="40" fixed></el-table-column>

                          <el-table-column
                              prop="Name"
                              label="Item Code"
                              width="150"
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
                          width="240"
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


                         <el-table-column prop="vendor" label="Company" width="120">
                          <template slot-scope="scope">
                              <el-input  readonly v-model="scope.row.vendor" disabled size="mini" autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="winningProbability" label="WinProb" width="80">
                          <template slot-scope="scope">
                              <b-form class="form-inline"> <b-form-checkbox v-model="scope.row.winningProbability"></b-form-checkbox></b-form>
                          </template>
                      </el-table-column>

                       <el-table-column prop="onHandPrice" label="OH price" width="110">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.onHandPrice" size="mini"  disabled autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <!-- <el-table-column prop="onHandPriceCurrencySymbol" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.onHandPriceCurrencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column> -->

                      <el-table-column prop="onHandQuantity" label="OH Qty" width="110">
                      <template slot-scope="scope">
                          <el-input v-model="scope.row.onHandQuantity" size="mini"  disabled autocomplete="off">
                          
                          </el-input>
                      </template>
                      </el-table-column>

                      <el-table-column prop="Cost" label="Cost" width="100">
                      <template slot-scope="scope">
                          <el-input v-model="scope.row.cost" @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off">
                          
                          </el-input>
                      </template>
                      </el-table-column>


<!--  <el-table-column prop="discount1" label="Disc1%" width="120">
<template slot-scope="scope">
  <el-input v-model="scope.row.discount1" @input="handleDecimal(scope.row)" @change="calculatorMainItemChange(scope.row)" size="mini" autocomplete="off"   >
  
  </el-input>
</template>
                      </el-table-column>

                      <el-table-column prop="discount2" label="Disc2%" width="120">
<template slot-scope="scope">
  <el-input v-model="scope.row.discount2" @input="handleDecimal(scope.row)" @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->

                        <el-table-column prop="costType" label="Cost type " width="110">
                          <template slot-scope="scope">
                              <el-select v-model="scope.row.costType" @change="changeCostType(scope.row)" clearable filterable name="costType" class="full-width padding-3" size="mini">
                              
                                  <el-option v-for="option in costTypeList" :value="option.id" :label="option.name" :key="option.id"></el-option>
                              
                              </el-select>
                          </template>
                      </el-table-column>

   <!--                   <el-table-column prop="shipment" label="S&C" width="120">
<template slot-scope="scope">
  <el-input @change="calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.shipment" size="mini" autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->

            <!--              <el-table-column prop="landedCost" label="Landed cost" width="120">
<template slot-scope="scope">
  <el-input     v-model="scope.row.landedCost" size="mini" disabled autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->

 <!--                     <el-table-column prop="grossMargin" label="GM%" width="120">
<template slot-scope="scope">
  <el-input @input="handleDecimal(scope.row)" @change="calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.grossMargin" size="mini" autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> 

                       <el-table-column prop="Gross margin" label="Gross margin" width="120">
<template slot-scope="scope">
  <el-input   @change="calculatorMainItemChange(scope.row)" v-model="scope.row.grossMarginValue" disabled size="mini" autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column>-->


                      <el-table-column prop="shelfLife" label="Shelf Life" width="120">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.shelfLife" size="mini" autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>


                      <el-table-column prop="countryOfOrigin" label="Country of Origin" width="160">

                  <template slot-scope="scope">
                      <el-select
                                          :loading="loadingAccount" v-model="scope.row.countryofOriginIds" @change="handleCountryofOriginIds(scope.row)"
                                          clearable filterable 
                                          class="full-width padding-3"
                                          size="mini"
                                          multiple
                                          collapse-tags
                                          >
                          <el-option v-for="option in countryList" :value="option.id" :label="option.name" :key="option.value"></el-option>
                      </el-select>
                  </template>
                      </el-table-column>

                      <el-table-column prop="tenderUnit" label="Tender Unit" width="120">
                          <template slot-scope="scope">
                              <el-select
                              @change="handleTeenderUnitChange(scope.row)"
                                                  :loading="loadingAccount" v-model="scope.row.tenderUnitM"
                                                  clearable filterable 
                                                  class="full-width padding-3"
                                                  size="mini">
                                  <el-option v-for="option in tenderUnitMList" :value="option.value" :label="option.name" 
                                  :key="option.value"></el-option>
                              </el-select>
                          </template>
                      </el-table-column>
                      <el-table-column prop="tenderUnitValue" label="Tender Unit Value" width="120">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.tenderUnitValue" :disabled="scope.row.tenderUnitM !== 0"
                               @change="calculatorMainItemChange(scope.row)" size="mini" autocomplete="off">
                              </el-input>
                          </template>
                      </el-table-column>

                        <el-table-column prop="msS_Unit" label="MSS Unit" width="100">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.msS_Unit" @change="calculatorMainItemChange(scope.row)" size="mini"  autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="TenderQuantity" label="Tender Quantity" width="120">

                      <template slot-scope="scope">
                          <el-input v-model="scope.row.tenderQuantity" @change="calculatorMainItemChange(scope.row)" size="mini" autocomplete="off">
                          
                          </el-input>
                      </template>
                      </el-table-column>  
                      
                      <el-table-column prop="msS_Quantity" label="MSS Quantity" width="120">
                      <template slot-scope="scope">
                          <el-input v-model="scope.row.msS_Quantity" disabled size="mini" autocomplete="off">
                          
                          </el-input>
                      </template>
                      </el-table-column>

                      <el-table-column prop="currencyCode" label="Currency" width="110">
                          <template slot-scope="scope">
                              <el-select remote :remote-method="remoteMethodCurrency"
                                          :loading="loadingAccount"  v-model="scope.row.currencyCode" clearable filterable class="full-width padding-3" @change="currencyChanged(scope.row);calculatorMainItemChange(scope.row)" size="mini">
                                  <el-option v-for="option in currenciesList " :value="option.code" :label="option.code" :key="option.code"></el-option>
                              </el-select>
                          </template>
                      </el-table-column>
                      
                       <el-table-column prop="foB_MSS_Unit" label="FOB MSS UNIT" width="120">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.foB_MSS_Unit" :disabled="scope.row.costTypeCode != 3"  @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>
                      


                       <el-table-column prop="shippingExpenses" label="Shipping Expenses" width="180">
                      <template slot-scope="scope">
                          <el-input v-model="scope.row.shippingExpenses" :disabled="scope.row.costTypeCode != 3"  @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off"></el-input>
                      </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="shippingExpenseType" label="Value or percentage" width="150">
                          <template slot-scope="scope">
                              <el-select 
                                  :disabled="scope.row.costTypeCode != 3"
                                   @change="calculatorMainItemChange(scope.row)"
                                  class="input-custom"
                                  v-model="scope.row.shippingExpenseType"
                                  :placeholder="$t('Select')"
                                  :name="'shippingExpenseType'"
                                  data-vv-scope="EventCreationValidation"
                                  clearable>
                                  <el-option :value="true" label="Value" :key="true"></el-option>
                                  <el-option :value="false" label="Percentage" :key="false"></el-option>
                              </el-select>
                          </template>
                      </el-table-column> 

                        <el-table-column prop="foc" label="FOC / Discount" width="120">
                          <template slot-scope="scope">

                          <label class="form-checkbox pb-1"></label>
                          <input type="checkbox" v-model="scope.row.foc" @click="changeFoc(scope.row)" :id="'foc'+scope.$index" :name="'foc'+scope.$index"/>

                          </template>
                      </el-table-column>

                        <el-table-column prop="foC_Value" label="FOC / Discount Value" width="150">
                          <template slot-scope="scope">

                          <el-input v-model="scope.row.foC_Value" :disabled="!scope.row.foc" @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off">
                              
                              </el-input>

                          </template>
                      </el-table-column>

                      <el-table-column prop="cif" label="CIF" width="80">
                          <template slot-scope="scope">
                              <el-input @input="handleDecimal(scope.row)" disabled @change="reEquation('cif',scope.row); calculatorShipmentMarginItemChange(scope.row);scope.row.cifPlaceHolder=''" v-model="scope.row.cif" size="mini" autocomplete="off" >
                              
                              </el-input>
                          </template>
                      </el-table-column> 

                      <el-table-column prop="cifValueInTheSelectedCurrency" label="CIF value in selected currency" width="120">
                      <template slot-scope="scope">
                          <el-input @input="handleDecimal(scope.row)" :disabled="scope.row.costTypeCode == 3" @change="reEquation('cif',scope.row); calculatorShipmentMarginItemChange(scope.row);scope.row.cifPlaceHolder=''" v-model="scope.row.cifValueInTheSelectedCurrency" size="mini" autocomplete="off" :placeholder="scope.row.cifPlaceHolder">
                          
                          </el-input>
                      </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>   

                       <el-table-column prop="factor" label="Factor" width="110">
                          <template slot-scope="scope">
                              <el-input @input=" handleDecimal(scope.row)" :disabled="scope.row.costTypeCode == 2" @change="reEquation('factor',scope.row); calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.factor" size="mini" autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>   
                      
                      <el-table-column prop="" label="Item currency" width="120">
                      <template slot-scope="scope">
                          <label>{{scope.row.currencyCode}} </label>
                      </template>
                  </el-table-column>   

                         <el-table-column prop="suggestedQuotedPrice_WO_VAT" :label="SuggestionLabel()" width="320">
                          <template slot-scope="scope">
                              <el-input    @change="reEquation('suggested',scope.row); calculatorMainItemChange(scope.row);scope.row.suggestedQuotedPrice_WO_VATPlaceHolder=''" v-model="scope.row.suggestedQuotedPrice_WO_VAT" size="mini" autocomplete="off" ></el-input>
                          </template>
                      </el-table-column> 

                      <el-table-column prop="suggestedPrice_WO_VAT_SelectedCurrency" label="Suggested qouted price W/O VAT in selected currency"  width="320">
                          <template slot-scope="scope">
                              <el-input   @change="reEquation('suggested',scope.row); calculatorMainItemChange(scope.row);scope.row.suggestedQuotedPrice_WO_VATPlaceHolder=''" v-model="scope.row.suggestedPrice_WO_VAT_SelectedCurrency" size="mini" autocomplete="off" :placeholder="scope.row.suggestedQuotedPrice_WO_VATPlaceHolder"></el-input>
                          </template>
                      </el-table-column> 

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                         <el-table-column prop="lastWinningPrice_WO_VAT" label="Last winning price w/o VAT" width="180">
                      <template slot-scope="scope">
                          <el-input @change="calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.lastWinningPrice_WO_VAT" size="mini" autocomplete="off">
                          
                          </el-input>
                      </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                       <el-table-column prop="total_WO_VAT" label="Total Quoted Price W/O VAT" width="180">
                          <template slot-scope="scope">
                              <el-input  disabled @change="calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.total_WO_VAT" size="mini" autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="profitPercentage" label="Profit %" width="120">
                          <template slot-scope="scope">
                              <el-input @input="handleDecimal(scope.row)" v-model="(scope.row.profitPercentage * 100).toFixed(3)" size="mini" disabled autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="profitAmount" label="Profit #" width="120">
                          <template slot-scope="scope">
                              <el-input     v-model="scope.row.profitAmount" size="mini" disabled autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>
                      


                    <!--    <el-table-column prop="adjustedTenderUnitPrice" label="Total" width="120">
                        
<template slot-scope="scope">
  <el-input     v-model="scope.row.adjustedTenderUnitPrice" size="mini" disabled autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->

                      <el-table-column prop="tenderUnitPrice" label="Tender Unit Price" width="120">
                          <template slot-scope="scope">
                              <el-input     v-model="scope.row.tenderUnitPrice" size="mini" disabled autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="adjustedTenderUnitPrice" label="Adjusted" width="120">
                          <template slot-scope="scope">
                              <el-input     v-model="scope.row.adjustedTenderUnitPrice" size="mini" disabled autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="totalQuotationPrice" label="Total Quotation Price With VAT" width="200">
                          <template slot-scope="scope">
                              <el-input     v-model="scope.row.totalQuotationPrice" size="mini" disabled autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                  <el-table-column prop="regularPrice" label="Regular price" width="120">
                                              <template slot-scope="scope">
                                                  <el-input autocomplete="off" v-model="scope.row.regularPrice" size="mini"></el-input>
                                              </template>
                                          </el-table-column>

                                          <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                                          <el-table-column prop="note" label="Note" width="120">
                  <template slot-scope="scope">
                      <el-input autocomplete="off"     v-model="scope.row.note" size="mini">
                      
                      </el-input>
                  </template>
                      </el-table-column>


                        </el-table>
                      </div>
                      <b-row class="mt-1">
                        <b-col lg="4">
                        </b-col>

                        <b-col lg="2">>{{$t('TotalQuotedPriceWOVAT')}} {{CalcGroup.groupTotal_WO_VAT | toUSD}}
                             <strong>{{tenderCalculationSheetCode}}</strong>
                        </b-col>
                        <b-col lg="2">{{$t('TotalQuotationPriceWithVAT')}} {{CalcGroup.groupTotalQuotationPrice | toUSD}}
                             <strong>{{tenderCalculationSheetCode}}</strong>
                        </b-col>
                        <b-col lg="2">{{$t('TotalProfit%')}} {{CalcGroup.tenderCalculationSheetOptionalGroup.totalProfit | toUSD}} %</b-col>
                        <b-col lg="2">{{$t('TotalProfitAmount')}} {{CalcGroup.tenderCalculationSheetOptionalGroup.totalAmount | toUSD}}
                             <strong>{{tenderCalculationSheetCode}}</strong>
                        </b-col>
                      </b-row>
                    </b-collapse>
                  </b-card>

                  <b-card
                    class="card card-accent-primary"
                    no-body
                    v-for="(alternativeGroup,alternativeGroupIndex) in CalcGroup.tenderCalculationSheetAlternativeGroup"
                    :key="alternativeGroupIndex"
                  >
                    <div slot="header">
                      <div class="row">
                        <!-- <input
                          type="radio"
                          :name="'name'+index"
                          style="margin-left: 15px;margin-top: 10px;width: 23px;height: 17px;"
                          :value="alternativeGroup.selected"
                          :checked="alternativeGroup.selected"
                          @change="selectAlternativGroup(CalcGroup,alternativeGroup,alternativeGroupIndex,index)"
                        /> -->
                        <label
                          for="inputEmail3"
                          class="col-sm-2 col-form-label"
                        >{{ $t('AlternativeGroup')}} {{ alternativeGroupIndex+1}}</label>
                        <label for="inputEmail3" class="col-form-label">{{ $t('name')}}</label>
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
                              v-b-toggle="'alternativeGroup-'+index+alternativeGroupIndex"
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
                              @click="removeSingleAlternativeGroup(index,alternativeGroupIndex)"
                            >
                              <i class="fa fa-close"></i>
                            </b-link>
                          </div>
                        </div>
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

                          <el-table-column label width="50" fixed>

                              <template slot="header" slot-scope="scope">
                                  <button
                                      @click="deleteSelectedForCalcuationSheetAlternativeItem(index,alternativeGroupIndex)"
                                      style="background-color: red; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer;"
                                  >
                                  <i class="fa fa-trash"></i>
                              </button>
                              </template>

                              <template slot-scope="scope"> 

                                  <input type="checkbox" v-model="scope.row.selected"   :key="'alternativeGroup-'+scope.row.id"   :id="'alternativeGroupCheckbox'+scope.$index"  :name="'alternativeGroupCheckbox'+scope.$index"
                              style="margin-left: 4px;margin-top: 10px;width: 23px;height: 17px;" />

                              </template>

                          </el-table-column>  






                            <el-table-column label width="20" fixed>
                      <template slot-scope="scope">
                          <a class="text-danger" @mousedown="removeAlternativeItem(index,alternativeGroupIndex,scope.row)">
                          
                                                              <i class="fa fa-trash"></i>
                          
                                                          </a>
                      </template>
                            </el-table-column>

                            <el-table-column type="index" width="40" fixed></el-table-column>
                           
                            <el-table-column
                              prop="Name"
                              label="Item Code"
                              width="150"
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
                          width="240"
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


                         <el-table-column prop="vendor" label="Company" width="120">
                          <template slot-scope="scope">
                              <el-input  readonly v-model="scope.row.vendor" disabled size="mini" autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="winningProbability" label="WinProb" width="80">
                          <template slot-scope="scope">
                              <b-form class="form-inline"> <b-form-checkbox v-model="scope.row.winningProbability"></b-form-checkbox></b-form>
                          </template>
                      </el-table-column>

                       <el-table-column prop="onHandPrice" label="OH price" width="110">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.onHandPrice" size="mini"  disabled autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <!-- <el-table-column prop="onHandPriceCurrencySymbol" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.onHandPriceCurrencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column> -->

                      <el-table-column prop="onHandQuantity" label="OH Qty" width="110">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.onHandQuantity" size="mini"  disabled autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                              <el-table-column prop="Cost" label="Cost" width="100">
<template slot-scope="scope">
  <el-input v-model="scope.row.cost" @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column>


<!--  <el-table-column prop="discount1" label="Disc1%" width="120">
<template slot-scope="scope">
  <el-input v-model="scope.row.discount1" @input="handleDecimal(scope.row)" @change="calculatorMainItemChange(scope.row)" size="mini" autocomplete="off"   >
  
  </el-input>
</template>
                      </el-table-column>

                      <el-table-column prop="discount2" label="Disc2%" width="120">
<template slot-scope="scope">
  <el-input v-model="scope.row.discount2" @input="handleDecimal(scope.row)" @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->

                        <el-table-column prop="costType" label="Cost type " width="110">
                          <template slot-scope="scope">
                              <el-select v-model="scope.row.costType" @change="changeCostType(scope.row)" clearable filterable name="costType" class="full-width padding-3" size="mini">
                              
                                  <el-option v-for="option in costTypeList"   :value="option.id" :label="option.name" :key="option.id"></el-option>
                              
                              </el-select>
                          </template>
                      </el-table-column>

   <!--                       <el-table-column prop="shipment" label="S&C" width="120">
<template slot-scope="scope">
  <el-input @change="calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.shipment" size="mini" autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->

           <!--               <el-table-column prop="landedCost" label="Landed cost" width="120">
<template slot-scope="scope">
  <el-input     v-model="scope.row.landedCost" size="mini" disabled autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->

    <!--                      <el-table-column prop="grossMargin" label="GM%" width="120">
<template slot-scope="scope">
  <el-input @input="handleDecimal(scope.row)" @change="calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.grossMargin" size="mini" autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> 

                       <el-table-column prop="Gross margin" label="Gross margin" width="120">
<template slot-scope="scope">
  <el-input   @change="calculatorMainItemChange(scope.row)" v-model="scope.row.grossMarginValue" disabled size="mini" autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column>-->


                      <el-table-column prop="shelfLife" label="Shelf Life" width="120">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.shelfLife" size="mini" autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

               

                      <el-table-column prop="countryOfOrigin" label="Country of Origin" width="160">

                          <template slot-scope="scope">
                              <el-select
                                                  :loading="loadingAccount" v-model="scope.row.countryofOriginIds" @change="handleCountryofOriginIds(scope.row)"
                                                  clearable filterable 
                                                  class="full-width padding-3"
                                                  size="mini"
                                                  multiple
                                                  collapse-tags
                                                  >
                                  <el-option v-for="option in countryList" :value="option.id" :label="option.name" :key="option.value"></el-option>
                              </el-select>
                          </template>
                      </el-table-column>

                      <el-table-column prop="tenderUnit" label="Tender Unit" width="120">
                          <template slot-scope="scope">
                              <el-select
                              @change="handleTeenderUnitChange(scope.row)"
                                                  :loading="loadingAccount" v-model="scope.row.tenderUnitM"
                                                  clearable filterable 
                                                  class="full-width padding-3"
                                                  size="mini">
                                  <el-option v-for="option in tenderUnitMList" :value="option.value" :label="option.name" 
                                  :key="option.value"></el-option>
                              </el-select>
                          </template>
                      </el-table-column>
                      <el-table-column prop="tenderUnitValue" label="Tender Unit Value" width="120">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.tenderUnitValue" :disabled="scope.row.tenderUnitM !== 0"
                               @change="calculatorMainItemChange(scope.row)" size="mini" autocomplete="off">
                              </el-input>
                          </template>
                      </el-table-column>

                        <el-table-column prop="msS_Unit" label="MSS Unit" width="100">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.msS_Unit" @change="calculatorMainItemChange(scope.row)" size="mini"  autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="TenderQuantity" label="Tender Quantity" width="120">

                      <template slot-scope="scope">
                          <el-input v-model="scope.row.tenderQuantity" @change="calculatorMainItemChange(scope.row)" size="mini" autocomplete="off">
                          
                          </el-input>
                      </template>
                      </el-table-column>  
                      
                      <el-table-column prop="msS_Quantity" label="MSS Quantity" width="120">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.msS_Quantity" disabled size="mini" autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="currencyCode" label="Currency" width="110">
                  <template slot-scope="scope">
                      <el-select remote :remote-method="remoteMethodCurrency"
                              :loading="loadingAccount"  v-model="scope.row.currencyCode" clearable filterable class="full-width padding-3" @change="currencyChanged(scope.row);calculatorMainItemChange(scope.row)" size="mini">
                          <el-option v-for="option in currenciesList " :value="option.code" :label="option.code" :key="option.code"></el-option>
                      </el-select>
                  </template>
                      </el-table-column>
                      
  <el-table-column prop="foB_MSS_Unit" label="FOB MSS UNIT" width="120">
          <template slot-scope="scope">
              <el-input v-model="scope.row.foB_MSS_Unit" :disabled="scope.row.costTypeCode != 3"  @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off">
              
              </el-input>
          </template>
      </el-table-column>
                      


                       <el-table-column prop="shippingExpenses" label="Shipping Expenses" width="200">
                          <template slot-scope="scope">
                              <b-row class="align-items-center">
                                  <b-col lg="12" class="d-flex align-items-center">
                                      <el-input v-model="scope.row.shippingExpenses" :disabled="true"  @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off" class="pr-2"></el-input>
                                      <el-button @click="showShippingExpensesDialog(scope.row)" :disabled="scope.row.costTypeCode != 3">
                                       <i class="fa fa-eye"></i> 
                                      </el-button>
                              
                                  </b-col>
                              </b-row>
                          </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="shippingExpenseType" label="Value or percentage" width="150">
                          <template slot-scope="scope">
                              <el-select 
                                  :disabled="scope.row.costTypeCode != 3"
                                  @change="calculatorMainItemChange(scope.row)"
                                  class="input-custom"
                                  v-model="scope.row.shippingExpenseType"
                                  :placeholder="$t('Select')"
                                  :name="'shippingExpenseType'"
                                  data-vv-scope="EventCreationValidation"
                                  clearable>
                                  <el-option :value="true" label="Value" :key="true"></el-option>
                                  <el-option :value="false" label="Percentage" :key="false"></el-option>
                              </el-select>
                          </template>
                      </el-table-column> 

                       <el-table-column prop="foc" label="FOC / Discount" width="120">
                              <template slot-scope="scope">

                              <label class="form-checkbox pb-1"></label>
                          <input type="checkbox" v-model="scope.row.foc" @click="changeFoc(scope.row)" :id="'foc'+scope.$index" :name="'foc'+scope.$index"/>

                              </template>
                      </el-table-column>

                        <el-table-column prop="foC_Value" label="FOC / Discount Value" width="150">
                          <template slot-scope="scope">

                          <el-input v-model="scope.row.foC_Value" :disabled="!scope.row.foc" @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off">
                              
                              </el-input>

                          </template>
                      </el-table-column>

                      <el-table-column prop="cif" label="CIF" width="80">
                          <template slot-scope="scope">
                              <el-input @input="handleDecimal(scope.row)" disabled @change="reEquation('cif',scope.row);calculatorShipmentMarginItemChange(scope.row);scope.row.cifPlaceHolder=''" v-model="scope.row.cif" size="mini" autocomplete="off" >
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="cifValueInTheSelectedCurrency" label="CIF value in selected currency" width="120">
                      <template slot-scope="scope">
                          <el-input @input="handleDecimal(scope.row)" :disabled="scope.row.costTypeCode == 3" @change="reEquation('cif',scope.row); calculatorShipmentMarginItemChange(scope.row);scope.row.cifPlaceHolder=''" v-model="scope.row.cifValueInTheSelectedCurrency" size="mini" autocomplete="off" :placeholder="scope.row.cifPlaceHolder">
                          
                          </el-input>
                      </template>
                      </el-table-column>  

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>  

                       <el-table-column prop="factor" label="Factor" width="110">
                          <template slot-scope="scope">
                              <el-input @input="handleDecimal(scope.row)" :disabled="scope.row.costTypeCode == 2" @change="reEquation('factor',scope.row);calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.factor" size="mini" autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>   
                      
                      <el-table-column prop="" label="Item currency" width="120">
                      <template slot-scope="scope">
                          <label>{{scope.row.currencyCode}} </label>
                      </template>
                  </el-table-column>   

                         <el-table-column prop="suggestedQuotedPrice_WO_VAT" :label="SuggestionLabel()" width="320">
                          <template slot-scope="scope">
                              <el-input   @change="reEquation('suggested',scope.row); calculatorShipmentMarginItemChange(scope.row);scope.row.suggestedQuotedPrice_WO_VATPlaceHolder=''" v-model="scope.row.suggestedQuotedPrice_WO_VAT" size="mini" autocomplete="off" ></el-input>
                          </template>
                      </el-table-column> 

                  <el-table-column prop="suggestedPrice_WO_VAT_SelectedCurrency" label="Suggested qouted price W/O VAT in selected currency"  width="320">
                      <template slot-scope="scope">
                          <el-input   @change="reEquation('suggested',scope.row); calculatorMainItemChange(scope.row);scope.row.suggestedQuotedPrice_WO_VATPlaceHolder=''" v-model="scope.row.suggestedPrice_WO_VAT_SelectedCurrency" size="mini" autocomplete="off" :placeholder="scope.row.suggestedQuotedPrice_WO_VATPlaceHolder"></el-input>
                      </template>
                  </el-table-column> 

                  <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                   <el-table-column prop="lastWinningPrice_WO_VAT" label="Last winning price w/o VAT" width="180">
                      <template slot-scope="scope">
                            <el-input @change="calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.lastWinningPrice_WO_VAT" size="mini" autocomplete="off">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                       <el-table-column prop="total_WO_VAT" label="Total Quoted Price W/O VAT" width="180">
                          <template slot-scope="scope">
                              <el-input  disabled @change="calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.total_WO_VAT" size="mini" autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="profitPercentage" label="Profit %" width="120">
                          <template slot-scope="scope">
                              <el-input @input="handleDecimal(scope.row)" v-model="(scope.row.profitPercentage * 100).toFixed(3)" size="mini" disabled autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="profitAmount" label="Profit #" width="120">
                      <template slot-scope="scope">
                          <el-input     v-model="scope.row.profitAmount" size="mini" disabled autocomplete="off">
                          
                          </el-input>
                      </template>
                      </el-table-column>
                      


            <!--            <el-table-column prop="adjustedTenderUnitPrice" label="Total" width="120">
                        
<template slot-scope="scope">
  <el-input     v-model="scope.row.adjustedTenderUnitPrice" size="mini" disabled autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->

                      <el-table-column prop="tenderUnitPrice" label="Tender Unit Price" width="120">
                      <template slot-scope="scope">
                          <el-input     v-model="scope.row.tenderUnitPrice" size="mini" disabled autocomplete="off">
                          
                          </el-input>
                      </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="adjustedTenderUnitPrice" label="Adjusted" width="120">
                      <template slot-scope="scope">
                          <el-input     v-model="scope.row.adjustedTenderUnitPrice" size="mini" disabled autocomplete="off">
                          
                          </el-input>
                      </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>


                      <el-table-column prop="totalQuotationPrice" label="Total Quotation Price With VAT" width="200">
                  <template slot-scope="scope">
                      <el-input     v-model="scope.row.totalQuotationPrice" size="mini" disabled autocomplete="off">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                         <el-table-column prop="regularPrice" label="Regular price" width="120">
                          <template slot-scope="scope">
                              <el-input autocomplete="off" v-model="scope.row.regularPrice" size="mini"></el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>


                      <el-table-column prop="note" label="Note" width="120">
                      <template slot-scope="scope">
                          <el-input autocomplete="off"     v-model="scope.row.note" size="mini">
                          
                          </el-input>
                      </template>
                      </el-table-column>


                          </el-table>
                        </div>

                        <b-row class="mt-1">
                          <b-col lg="4">
                            <el-button
                              @click="addNewAternativeItem(index,alternativeGroupIndex)"
                              class="btn btn-secondary mt-2 mb-1"
                            >
                              <span class="fa fa-plus"></span>
                              {{$t("Item")}}
                            </el-button>
                         
                          </b-col>
                          <b-col lg="2">{{$t('TotalQuotedPriceWOVAT')}} {{alternativeGroup.groupTotal_WO_VAT | toUSD}}
                              <strong>{{tenderCalculationSheetCode}}</strong>
                          </b-col>
                          <b-col lg="2">{{$t('TotalQuotationPriceWithVAT')}} {{alternativeGroup.groupTotalQuotationPrice | toUSD}}
                              <strong>{{tenderCalculationSheetCode}}</strong>
                          </b-col>
                          <b-col lg="2">{{$t('TotalProfit%')}} {{alternativeGroup.totalProfit | toUSD}} %</b-col>
                          <b-col lg="2">{{$t('TotalProfitAmount')}} {{alternativeGroup.totalAmount | toUSD}}
                              <strong>{{tenderCalculationSheetCode}}</strong>
                          </b-col>
                        </b-row>
                          <el-button
                              @click="addNewAternativeOptionalGroup(index,alternativeGroupIndex)"
                              v-if="!alternativeGroup.tenderCalculationSheetAlternativeOptionalGroup"
                              class="btn btn-secondary">
                              <span class="fa fa-plus"></span>
                              {{ $t("addoptional")}}
                          </el-button>
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

                              <b-link
                                class="card-header-action btn-minimize"
                                @click="removeSingleAlternativeOptionalGroup(index,alternativeGroupIndex)"
                              >
                                <i class="fa fa-close"></i>
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


                          <el-table-column label width="50" fixed>

                              <template slot="header" slot-scope="scope">
                                  <button
                                      @click="deleteSelectedForCalcuationSheetAlternativeOptionalItem(index,alternativeGroupIndex)"
                                      style="background-color: red; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer;"
                                  >
                                  <i class="fa fa-trash"></i>
                              </button>
                              </template>

                              <template slot-scope="scope"> 

                                  <input type="checkbox" v-model="scope.row.selected"   :key="'optionalGroup-'+scope.row.id"   :id="'optionalGroupCheckbox'+scope.$index"  :name="'optionalGroupCheckbox'+scope.$index"
                              style="margin-left: 4px;margin-top: 10px;width: 23px;height: 17px;" />

                              </template>

                          </el-table-column>  




                          <el-table-column label width="20" fixed>
                                  <template slot-scope="scope">
                                      <a class="text-danger" @mousedown="removeAlternativeOptionalItem(index,alternativeGroupIndex,scope.row)">
                                      
                                                                              <i class="fa fa-trash"></i>
                                      
                                                                          </a>
                                  </template>
                                </el-table-column>

                                <el-table-column type="index" width="40" fixed></el-table-column>

                                <el-table-column
                              prop="Name"
                              label="Item Code"
                              width="150"
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
                          width="240"
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


                         <el-table-column prop="vendor" label="Company" width="120">
                          <template slot-scope="scope">
                              <el-input  readonly v-model="scope.row.vendor" disabled size="mini" autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                    <el-table-column prop="winningProbability" label="WinProb" width="80">
                          <template slot-scope="scope">
                              <b-form class="form-inline"> <b-form-checkbox v-model="scope.row.winningProbability"></b-form-checkbox></b-form>
                          </template>
                      </el-table-column>

                       <el-table-column prop="onHandPrice" label="OH price" width="110">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.onHandPrice" size="mini"  disabled autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <!-- <el-table-column prop="onHandPriceCurrencySymbol" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.onHandPriceCurrencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column> -->

                      <el-table-column prop="onHandQuantity" label="OH Qty" width="110">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.onHandQuantity" size="mini"  disabled autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                              <el-table-column prop="Cost" label="Cost" width="100">
<template slot-scope="scope">
  <el-input v-model="scope.row.cost" @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column>


<!--  <el-table-column prop="discount1" label="Disc1%" width="120">
<template slot-scope="scope">
  <el-input v-model="scope.row.discount1" @input="handleDecimal(scope.row)" @change="calculatorMainItemChange(scope.row)" size="mini" autocomplete="off"   >
  
  </el-input>
</template>
                      </el-table-column>

                      <el-table-column prop="discount2" label="Disc2%" width="120">
<template slot-scope="scope">
  <el-input v-model="scope.row.discount2" @input="handleDecimal(scope.row)" @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->

                        <el-table-column prop="costType" label="Cost type " width="110">
                          <template slot-scope="scope">
                              <el-select v-model="scope.row.costType" @change="changeCostType(scope.row)" clearable filterable name="costType" class="full-width padding-3" size="mini">
                              
                                  <el-option v-for="option in costTypeList"   :value="option.id" :label="option.name" :key="option.id"></el-option>
                              
                              </el-select>
                          </template>
                      </el-table-column>

         <!--                    <el-table-column prop="shipment" label="S&C" width="120">
<template slot-scope="scope">
  <el-input @change="calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.shipment" size="mini" autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->

                 <!--         <el-table-column prop="landedCost" label="Landed cost" width="120">
<template slot-scope="scope">
  <el-input     v-model="scope.row.landedCost" size="mini" disabled autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->

           <!--           <el-table-column prop="grossMargin" label="GM%" width="120">
<template slot-scope="scope">
  <el-input @input="handleDecimal(scope.row)" @change="calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.grossMargin" size="mini" autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->

       <!--                <el-table-column prop="Gross margin" label="Gross margin" width="120">
<template slot-scope="scope">
  <el-input   @change="calculatorMainItemChange(scope.row)" v-model="scope.row.grossMarginValue" disabled size="mini" autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->


                      <el-table-column prop="shelfLife" label="Shelf Life" width="120">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.shelfLife" size="mini" autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

               

                      <el-table-column prop="countryOfOrigin" label="Country of Origin" width="160">

                      <template slot-scope="scope">
                          <el-select
                                              :loading="loadingAccount" v-model="scope.row.countryofOriginIds" @change="handleCountryofOriginIds(scope.row)"
                                              clearable filterable 
                                              class="full-width padding-3"
                                              size="mini"
                                              multiple
                                              collapse-tags
                                              >
                              <el-option v-for="option in countryList" :value="option.id" :label="option.name" :key="option.value"></el-option>
                          </el-select>
                      </template>
                      </el-table-column>

                      <el-table-column prop="tenderUnit" label="Tender Unit" width="120">
                          <template slot-scope="scope">
                              <el-select
                              @change="handleTeenderUnitChange(scope.row)"
                                                  :loading="loadingAccount" v-model="scope.row.tenderUnitM"
                                                  clearable filterable 
                                                  class="full-width padding-3"
                                                  size="mini">
                                  <el-option v-for="option in tenderUnitMList" :value="option.value" :label="option.name" 
                                  :key="option.value"></el-option>
                              </el-select>
                          </template>
                      </el-table-column>
                      <el-table-column prop="tenderUnitValue" label="Tender Unit Value" width="120">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.tenderUnitValue" :disabled="scope.row.tenderUnitM !== 0"
                               @change="calculatorMainItemChange(scope.row)" size="mini" autocomplete="off">
                              </el-input>
                          </template>
                      </el-table-column>

                        <el-table-column prop="msS_Unit" label="MSS Unit" width="100">
                      <template slot-scope="scope">
                          <el-input v-model="scope.row.msS_Unit" @change="calculatorMainItemChange(scope.row)" size="mini" autocomplete="off">
                          
                          </el-input>
                      </template>
                      </el-table-column>

                      <el-table-column prop="TenderQuantity" label="Tender Quantity" width="120">

                          <template slot-scope="scope">
                              <el-input v-model="scope.row.tenderQuantity" @change="calculatorMainItemChange(scope.row)" size="mini" autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>  
                      
                      <el-table-column prop="msS_Quantity" label="MSS Quantity" width="120">
                      <template slot-scope="scope">
                          <el-input v-model="scope.row.msS_Quantity" disabled size="mini" autocomplete="off">
                          
                          </el-input>
                      </template>
                      </el-table-column>

                      <el-table-column prop="currencyCode" label="Currency" width="110">
                          <template slot-scope="scope">
                              <el-select remote :remote-method="remoteMethodCurrency"
                                          :loading="loadingAccount"  v-model="scope.row.currencyCode" clearable filterable class="full-width padding-3" @change="currencyChanged(scope.row);calculatorMainItemChange(scope.row)" size="mini">
                                  <el-option v-for="option in currenciesList " :value="option.code" :label="option.code" :key="option.code"></el-option>
                              </el-select>
                          </template>
                      </el-table-column>
                      
                  <el-table-column prop="foB_MSS_Unit" label="FOB MSS UNIT" width="120">
                      <template slot-scope="scope">
                          <el-input v-model="scope.row.foB_MSS_Unit" :disabled="scope.row.costTypeCode != 3"  @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off">
                          
                          </el-input>
                      </template>
                   </el-table-column>


                       <el-table-column prop="shippingExpenses" label="Shipping Expenses" width="180">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.shippingExpenses" :disabled="scope.row.costTypeCode != 3"  @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off"></el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="shippingExpenseType" label="Value or percentage" width="150">
                          <template slot-scope="scope">
                              <el-select 
                                  @change="calculatorMainItemChange(scope.row)"
                                  :disabled="scope.row.costTypeCode != 3"
                                  class="input-custom"
                                  v-model="scope.row.shippingExpenseType"
                                  :placeholder="$t('Select')"
                                  :name="'shippingExpenseType'"
                                  data-vv-scope="EventCreationValidation"
                                  clearable>
                                  <el-option :value="true" label="Value" :key="true"></el-option>
                                  <el-option :value="false" label="Percentage" :key="false"></el-option>
                              </el-select>
                          </template>
                      </el-table-column> 

                      <el-table-column prop="foc" label="FOC / Discount" width="120">
                          <template slot-scope="scope">

                          <label class="form-checkbox pb-1"></label>
                          <input type="checkbox" v-model="scope.row.foc" @click="changeFoc(scope.row)" :id="'foc'+scope.$index" :name="'foc'+scope.$index"/>

                          </template>
                       </el-table-column>

                        <el-table-column prop="foC_Value" label="FOC / Discount Value" width="150">
                          <template slot-scope="scope">

                          <el-input v-model="scope.row.foC_Value" :disabled="!scope.row.foc" @change="calculatorMainItemChange(scope.row)" size="mini"   autocomplete="off">
                              
                              </el-input>

                          </template>
                      </el-table-column>

                      <el-table-column prop="cif" label="CIF" width="80">
                      <template slot-scope="scope">
                          <el-input @input="handleDecimal(scope.row)" disabled @change="reEquation('cif',scope.row); calculatorShipmentMarginItemChange(scope.row);scope.row.cifPlaceHolder=''" v-model="scope.row.cif" size="mini" autocomplete="off" >
                          
                          </el-input>
                      </template>
                      </el-table-column>   

                      <el-table-column prop="cifValueInTheSelectedCurrency" label="CIF value in selected currency" width="120">
                      <template slot-scope="scope">
                          <el-input @input="handleDecimal(scope.row)" :disabled="scope.row.costTypeCode == 3" @change="reEquation('cif',scope.row); calculatorShipmentMarginItemChange(scope.row);scope.row.cifPlaceHolder=''" v-model="scope.row.cifValueInTheSelectedCurrency" size="mini" autocomplete="off" :placeholder="scope.row.cifPlaceHolder">
                          
                          </el-input>
                      </template>
                      </el-table-column> 

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                       <el-table-column prop="factor" label="Factor" width="110">
                          <template slot-scope="scope">
                              <el-input @input="handleDecimal(scope.row)" :disabled="scope.row.costTypeCode == 2" @change="reEquation('factor',scope.row); calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.factor" size="mini" autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column> 

                      <el-table-column prop="" label="Item currency" width="120">
                      <template slot-scope="scope">
                          <label>{{scope.row.currencyCode}} </label>
                      </template>
                  </el-table-column>   

                      
                  <el-table-column prop="suggestedQuotedPrice_WO_VAT" :label="SuggestionLabel()" width="250">
                      <template slot-scope="scope">
                          <el-input   @change="reEquation('suggested',scope.row); calculatorShipmentMarginItemChange(scope.row);scope.row.suggestedQuotedPrice_WO_VATPlaceHolder=''" v-model="scope.row.suggestedQuotedPrice_WO_VAT" size="mini" autocomplete="off" ></el-input>
                      </template>
                  </el-table-column> 

                  <el-table-column prop="suggestedPrice_WO_VAT_SelectedCurrency" label="Suggested qouted price W/O VAT in selected currency"  width="320">
                      <template slot-scope="scope">
                          <el-input   @change="reEquation('suggested',scope.row); calculatorMainItemChange(scope.row);scope.row.suggestedQuotedPrice_WO_VATPlaceHolder=''" v-model="scope.row.suggestedPrice_WO_VAT_SelectedCurrency" size="mini" autocomplete="off" :placeholder="scope.row.suggestedQuotedPrice_WO_VATPlaceHolder"></el-input>
                      </template>
                  </el-table-column> 

                  <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                         <el-table-column prop="lastWinningPrice_WO_VAT" label="Last winning price w/o VAT" width="180">
                          <template slot-scope="scope">
                              <el-input @change="calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.lastWinningPrice_WO_VAT" size="mini" autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                       <el-table-column prop="total_WO_VAT" label="Total Quoted Price W/O VAT" width="180">
                  <template slot-scope="scope">
                      <el-input  disabled @change="calculatorShipmentMarginItemChange(scope.row)" v-model="scope.row.total_WO_VAT" size="mini" autocomplete="off">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="profitPercentage" label="Profit %" width="120">
                          <template slot-scope="scope">
                              <el-input @input="handleDecimal(scope.row)" v-model="(scope.row.profitPercentage * 100).toFixed(3)" size="mini" disabled autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="profitAmount" label="Profit #" width="120">
                          <template slot-scope="scope">
                              <el-input     v-model="scope.row.profitAmount" size="mini" disabled autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>
                      


             <!--           <el-table-column prop="adjustedTenderUnitPrice" label="Total" width="120">
                        
<template slot-scope="scope">
  <el-input     v-model="scope.row.adjustedTenderUnitPrice" size="mini" disabled autocomplete="off">
  
  </el-input>
</template>
                      </el-table-column> -->

                      <el-table-column prop="tenderUnitPrice" label="Tender Unit Price" width="120">
                          <template slot-scope="scope">
                              <el-input     v-model="scope.row.tenderUnitPrice" size="mini" disabled autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="adjustedTenderUnitPrice" label="Adjusted" width="120">
                      <template slot-scope="scope">
                          <el-input     v-model="scope.row.adjustedTenderUnitPrice" size="mini" disabled autocomplete="off">
                          
                          </el-input>
                      </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="totalQuotationPrice" label="Total Quotation Price With VAT" width="200">
                          <template slot-scope="scope">
                              <el-input     v-model="scope.row.totalQuotationPrice" size="mini" disabled autocomplete="off">
                              
                              </el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="regularPrice" label="Regular price" width="120">
                          <template slot-scope="scope">
                              <el-input autocomplete="off" v-model="scope.row.regularPrice" size="mini"></el-input>
                          </template>
                      </el-table-column>

                      <el-table-column prop="sign" label=" " width="70">
                  <template slot-scope="scope">
                      <el-input :value="scope.row.currencySymbol" size="mini"  disabled autocomplete="off" class="font-lg">
                      
                      </el-input>
                  </template>
                      </el-table-column>

                      <el-table-column prop="note" label="Note" width="120">
                      <template slot-scope="scope">
                          <el-input autocomplete="off"     v-model="scope.row.note" size="mini">
                          
                          </el-input>
                          
                      </template>
                      </el-table-column>


                              </el-table>
                            </div>
                            
                            <b-row class="mt-1">
                              <b-col lg="4">
                                <el-button
                                  @click="addNewAlternativeOptionalItem(index,alternativeGroupIndex)"
                                  class="btn btn-secondary mt-2 mb-1"
                                >
                                  <span class="fa fa-plus"></span>
                                  {{$t('Item')}}
                                </el-button>
                              </b-col>

                              <b-col lg="2">{{$t('TotalQuotedPriceWOVAT')}} {{alternativeGroup.tenderCalculationSheetAlternativeOptionalGroup.groupTotal_WO_VAT | toUSD}}
                                  {{tenderCalculationSheetCode}}
                              </b-col>
                              <b-col lg="2">{{$t('TotalQuotationPriceWithVAT')}} {{alternativeGroup.tenderCalculationSheetAlternativeOptionalGroup.groupTotalQuotationPrice | toUSD}}
                                   <strong>{{tenderCalculationSheetCode}}</strong>
                              </b-col>
                              <b-col lg="2">{{$t('TotalProfit%')}} {{alternativeGroup.tenderCalculationSheetAlternativeOptionalGroup.totalProfit | toUSD}} %</b-col>
                              <b-col lg="2">{{$t('TotalProfitAmount')}} {{alternativeGroup.tenderCalculationSheetAlternativeOptionalGroup.totalAmount | toUSD}}
                                  <strong>{{tenderCalculationSheetCode}}</strong>
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
          <b-col lg="12" style="padding-bottom: 10px;">
            <el-button
              @click="addNewGroup()"
              class="btn btn-secondary"
              v-if="tenderCalculationSheetGroups.length > 0"
            >
              <i class="fa fa-plus"></i>
              {{$t("newGroup")}}
            </el-button>
          </b-col>
        </b-row>

        <div class="mt-2">
          <h6>{{$t("BankInformation")}}</h6>
          <div class="mb-3" style="border: 1px solid rgb(192, 211, 230);">
            <div class="row mt-2 mr-1 ml-1">
                  <div class="row col-12">
                    <div class="col-md-2">
                    <div>{{$t("BankGuarantee")}}</div>
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
                          @change="bankBlockViewModel.currencyCode='';getTotalAmountTotalGrossMarginTotalGrossMarginValue()">
                          <el-option :value="true" label="Percentage" :key="true"></el-option>
                          <el-option :value="false" label="Value" :key="false"></el-option>
                          </el-select>
                      </div>
                    </div>
                    <div class="col-md-2">
                          <div>{{$t("BankGuaranteeValue")}}</div>
                          <div>
                              <input
                              type="text"
                              :disabled="bankGuaranteeDisabled"
                              class="form-control"
                              v-model="bankBlockViewModel.bankGuarantee"
                              autocomplete="off"
                              :maxlength="$store.getters.getMaxLength.length30"
                              @change="getTotalAmountTotalGrossMarginTotalGrossMarginValue()"
                              />
                          </div>
                    </div>
                  <div class="col-md-2">
                      <div>{{$t("Currency")}}</div>
                          <div>
                              <el-select remote :remote-method="remoteMethodCurrency"
                                  :loading="loadingAccount" :disabled="(bankGuaranteeDisabled) || bankBlockViewModel.bankGuaranteeType == true" v-model="bankBlockViewModel.currencyCode" clearable filterable class="full-width">
                              <el-option v-for="option in currenciesList " :value="option.code" :label="option.code" :key="option.code"></el-option>
                          </el-select>
                      </div>
                    </div>
                <!-- </div> -->
              <!-- <div class="row col-12 mt-2"> -->
              <div class="col-md-2">
                <div>{{$t("BankGuaranteeValidTill")}}</div>
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
                <div>{{$t("GuaranteeType")}}</div>
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
                <div>{{$t("GuaranteeDeliveryLocation")}}</div>
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
                <div>{{$t("Total_Quotation_Price_With_VAT")}}</div>
                <div>
                  <label>
                    {{bankBlockViewModel.total_Quotation_Price_With_VAT | toUSD}}
                     <strong>{{tenderCalculationSheetCode}}</strong>
                  </label>
                </div>
              </div>
              <div class="col-md-3">
                <div>{{$t("Total_Quoted_Price_WO_VAT")}}</div>
                <div>
                  <label>
                    {{bankBlockViewModel.total_Quoted_Price_WO_VAT | toUSD}}
                    <strong>{{tenderCalculationSheetCode}}</strong>
                  </label>
                </div>
              </div>
              <div class="col-md-3">
                <div>{{$t("Total_Profit_Percentage")}}</div>
                <div>
                  <label>
                    {{bankBlockViewModel.total_Profit_Percentage | toUSD}} %
                  </label>                   
                </div>
              </div>
              <div class="col-md-3">
                 <div>{{$t("Total_Profit_Amount")}}</div>
                <div>
                  <label>
                    {{bankBlockViewModel.total_Profit_Amount | toUSD}}
                     <strong>{{tenderCalculationSheetCode}}</strong>
                  </label>                   
                </div>
              </div>
              

              <div class="col-md-3" v-if="bankBlockViewModel.bankGuaranteeType == true">
                <div>{{$t("bankGranteeInCaseOfPercentage")}}</div>
                <div>
                  <label>
                    {{bankBlockViewModel.bankGranteeInCaseOfPercentage | toUSD}}
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
      {{$t("Previous")}}
    </button>

    <button
      class="btn csubmit ml-3"
      v-on:click="saveDataAction(false)"
      :disabled="BasicInfoObj.status ==  $store.getters.getSheetStatus.Awarded || BasicInfoObj.status == $store.getters.getSheetStatus.Approved ||  BasicInfoObj.status ==  $store.getters.getSheetStatus.Rejected_Closed  || (BasicInfoObj.createdBy == loggeduser && BasicInfoObj.status == $store.getters.getSheetStatus.Waiting_for_Approval)"
    >
      <i class="fa fa-save"></i>
      {{$t("Save")}}
    </button>

    <button
      class="btn csubmit ml-3"
      v-on:click="submitCaluctionSheet()"
      variant="primary"
      :disabled="calSheetId == '' || BasicInfoObj.status == $store.getters.getSheetStatus.Awarded || BasicInfoObj.status == $store.getters.getSheetStatus.Waiting_for_Approval ||  BasicInfoObj.status == $store.getters.getSheetStatus.Approved ||  BasicInfoObj.status == $store.getters.getSheetStatus.Rejected_Closed">
      <i class="fa fa-send-o"></i>
      {{$t("submit")}}
    </button>

    <button
      class="btn csubmit ml-3"
      variant="primary"
      v-for="(workflowaction, workflowactionIndex) in workflowStepActionSetting"
      :key="workflowactionIndex"
      @click="workflowAction(workflowaction.id , workflowaction.nextStepLastStepApproved , workflowaction.type)"
      :disabled="isClickWrokflow"
    >
      <i class="fa fa-true"></i>
      {{ workflowaction.name}}
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
              <!-- <div onclick="document.getElementById('upload').click()">
                <i class="cui-cloud-upload icons font-2xl d-block"></i>
                <div>Upload files</div>
              </div>
              <input data-v-459e9c6b type="file" id="upload" class="form-control-file" @change="importExcel" style="display: none" autocomplete="off"/> -->
              <dropzone id="importDropzone" :useCustomSlot="true" :options="dropzoneOptions" @vdropzone-files-added="importExcel">
                <i class="cui-cloud-upload icons font-2xl d-block"></i>
                <div>Upload file</div>
              </dropzone>
            </div>
           <div class="mt-2">
              <strong>{{$t("ExcelHint")}} <a download :href="excelLink" target="_blank">download template</a></strong>
              
           </div>             
        </b-form-group>
      </b-col>
    </b-row>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cloaeExcelSheetDialog()">{{$t("Close")}}</el-button>
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
        <b-form-group :class="{'has-error':errors.has('ItemsGroupValidation.principal')}">
          <label class="col-form-label" sm="4">{{$t('PrincipalName')}}</label>
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
            @change="getAllItemsGroupByPrincipleId(ItemsGroupObj.principalId)">
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
          >{{ errors.first('ItemsGroupValidation.principal') }}</div>
        </b-form-group>
      </b-col>

      <b-col sm="3">
        <b-form-group>
          <label class="col-form-label" sm="4">{{$t('Category')}}</label>

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
          >{{ errors.first('ItemsGroupValidation.category') }}</div>
        </b-form-group>
      </b-col>

      <b-col sm="3">
        <b-form-group>
          <label class="col-form-label" sm="4">{{$t('Model')}}</label>

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
          >{{ errors.first('ItemsGroupValidation.model') }}</div>
        </b-form-group>
      </b-col>
      <b-col sm="3">
        <b-form-group>
          <label class="col-form-label" sm="4">{{$t('tenderReference')}}</label>

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
          >{{ errors.first('ItemsGroupValidation.tenderReference') }}</div>
        </b-form-group>
      </b-col>
      <b-col sm="3">
        <b-form-group :class="{'has-error':errors.has('ItemsGroupValidation.principal')}">
          <el-button
            style="margin-top: 32px;"
            type="primary"
            @click="getMainConfigByPrincipalCategoryItem()"
          >{{$t('Search')}}</el-button>
        </b-form-group>
      </b-col>
    </b-row>
    <br />
    <strong v-if="mainConfigItems.length == 0 && isSearch">{{$t('NoRecordFound')}}</strong>
    <br />
    <b-row>
      <b-col sm="4" v-for="(mainConfigs, mainConfigsIndex) in mainConfigItems " :key="mainConfigsIndex">
        <b-card no-body :header="mainConfigs.groupName" footer-tag="footer">
          <b-list-group flush >
            <b-list-group-item v-for="(mainConfig, mainConfigIndex) in mainConfigs.itemGroupMainConfig" :key="mainConfigIndex">
              <b-form-checkbox-group stacked v-model="prelist">
                <b-form-checkbox
                  :value="{
                                   itemGroupId:mainConfigs.id,
                                   mainConfigId:mainConfig.id,
                                           }"
                >{{ mainConfig.name}}</b-form-checkbox>
              </b-form-checkbox-group>
            </b-list-group-item>
          </b-list-group>
          <b-card-footer>
            <b-list-group-item v-if="mainConfigs.itemGroupOptionalItem.length > 0" slot="footer">
              <b-form-checkbox-group stacked v-model="optionalList">
                <b-form-checkbox
                  :value="mainConfigs.id"
                >{{ $t("IncludeOptionalItems")}}</b-form-checkbox>
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
      >{{$t('select')}}</el-button>
      <el-button
        v-else-if="mainConfigItems.length > 0"
        type="primary"
        @click="extractMainConfigGroupItem3()"
      >{{$t('select')}}</el-button>
      <el-button @click="closeBuildTenderCalculationSheet()">{{$t("Cancel")}}</el-button>
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
        <b-form-group :class="{'has-error':errors.has('duplicateGroupValidation.isDuplicateMainGroup')}">
          <label class="col-form-label" sm="6">{{$t('Category')}}</label>
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
          >{{ errors.first('duplicateGroupValidation.isDuplicateMainGroup') }}</div>
        </b-form-group>
      </b-col>
    </b-row>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="duplicateGroup()"
      >{{$t('select')}}</el-button>
      <el-button @click="closeDuplicateGroup()">{{$t("Cancel")}}</el-button>
    </span>
  </el-dialog>



                      <el-dialog
                          :title="$t('ShippingExpenses')"
                          :visible="isShowShippingExpensesDialog"
                          :show-close="false"
                          :close-on-press-escape="false"
                          :destroy-on-close="false"
                          :width="'70%'"
                          >
                          <b-row>
                              <b-col sm="12">
                                  <b-form-group>
                                      <label class="col-form-label" sm="4">{{$t('EachContainer')}}</label>

                                      <el-input v-model="ShippingExpensesDialog.sE_EachContainer" size="mini"   autocomplete="off"></el-input>
                                  </b-form-group>
                              </b-col> 
                          </b-row>
                          <b-row>
                              <b-col sm="12">
                                  <b-form-group>
                                      <label class="col-form-label" sm="4">{{$t('EachPallet')}}</label>

                                      <el-input v-model="ShippingExpensesDialog.sE_EachPallet" size="mini"   autocomplete="off"></el-input>
                                  </b-form-group>
                              </b-col> 
                          </b-row>
                          <b-row>
                              <b-col sm="12">
                                  <b-form-group>
                                      <label class="col-form-label" sm="4">{{$t('CostPerContainer')}}</label>

                                      <el-input v-model="ShippingExpensesDialog.sE_CostPerContainer"  size="mini"   autocomplete="off"></el-input>
                                  </b-form-group>
                              </b-col> 
                          </b-row>

                          <span slot="footer" class="dialog-footer">
                              <el-button type="primary" @click="saveShippingExpensesDialog()">{{$t('Save')}}</el-button>

                              <button type="button" class="btn btn-secondary ml-1" @click="hideShippingExpensesDialog()">
                              <i class="fa fa-ban"></i>
                              {{$t("Cancel")}}
                              </button>
                          </span>
                      </el-dialog>
  

           
</div>
</template>

<script>



import cTable from "../Table/Table.vue";
import moment from "moment";
import xlsx from "xlsx";
import axios from "axios";
import dropzone from "vue2-dropzone"

export default {
  props: {
      calSheetId: Number,
      active: Number
  },
  name: "items",
  data() {
      return {
          isShowShippingExpensesDialog:false,
          ShippingExpensesDialog:{
              sE_CostPerContainer:"",
              sE_EachPallet:"",
              sE_EachContainer:""
          },
          currentRow:null,
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
              // The Url Where Dropped or Selected files will be sent
              url: `https://httpbin.org/post`,
              // File Size allowed in MB
              maxFilesize: 102400000,
              // Authentication Headers like Access_Token of your application
              // headers: {
              //   Authorization: `Access Token`
              // },
              // The way you want to receive the files in the server
              paramName: function() {
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
          groupsCount:[],
          excelLink:"",
          tenderUnitMList: [ { value:1, name: 'Single' } , { value: 1000, name:'TH' } , { value: -1, name:'MSS_Unit' }, { value:10, name:'10'}, { value:20, name:'20'}, { value:30, name:'30'}, { value:40, name:'40'}, { value:50, name:'50'}, { value:60, name:'60'}, { value:70, name:'70'}, { value:80, name:'80'}, { value:90, name:'90'}, { value:100, name:'100'}, { value:0, name:'Other'} ],
          mssUnitList: [ { value:"1", name: 'Single' } , { value: "1000", name:'TH' } , { value: "-1", name:'MSS_Unit' }, { value:"10", name:'10'}, { value:"20", name:'20'}, { value:"30", name:'30'}, { value:"40", name:'40'}, { value:"50", name:'50'}, { value:"60", name:'60'}, { value:"70", name:'70'}, { value:"80", name:'80'}, { value:"90", name:'90'}, { value:"100", name:'100'}, { value:"0", name:'Other'} ],
          countryList:[],// [ { id:1, name: 'Palestine' } , { id: 2, name:'USA' } , { id: 3, name:'Canada' }, { id: 4, name:'Ghana' }],
          tenderUnitList: [ { code: 1, name: 'unit1' } , { code: 2, name:'unit2' } ],
          loadingAccount:false,
          fullscreenLoading: false,
          costWithDiscount: 0,
          guaranteeTypes: [],
          loggeduser: 0,
          isClickWrokflow: false,
          workflowStepActionSetting: [],
          isSearch: false,
          selected: 0,
          BasicInfoObj: {},
          totalAmountIndex: null,
          totalAlternativeAmountIndex: null,
          totalOptionalAmountIndex: null,
          calculationAmount: [],
          guaranteeDeliveryLocations: [],
          bankGuaranteeType: true,
          currentGroupIndex: null,
          loadingFetchdata: false,
          systemItemsList: [],
          tenderCalculationSheetMainGroups: [],
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
          bulidTenderCalculationSheetDialog: false,
          isAlternative: false,
          ExcelsheetDialog:false,
          tenderCalculationSheetGroups: [],
          bankBlockViewModel: {
              currencyCode: "",
              total_Quotation_Price_With_VAT:0.0,
              total_Quoted_Price_WO_VAT:0.0,
              total_Profit_Percentage:0.0,
              total_Profit_Amount:0.0,
              bankGranteeInCaseOfPercentage:0.0,
            
              bankGuarantee: 0.0,
              guaranteeType: "",
              guaranteeDeliveryLocation: "",
              bankGuaranteeType: true,
              bankGuaranteeValidTill: "",
              vatValue:0
          },
          GuaranteeTypeLIst: [],
          mainGroupPrevCount: null,
          tenderCalculationSheetCode: "",
          calcuationSheetRates: "",
          tenderCalculationSheetName:"",
          isVat: false,
          VAT: "",
          costTypeList: [],
          currenciesList: [],
          calculationSheetCurrency:{code:''}
      };
  },
  filters: {
      toUSD(value) {
        if(value){
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }else{
          return "0.0"
        }
      },
      percentage(value){
          if(value){
            return parseFloat((parseFloat(value).toFixed(5).slice(0,-1)) * 100).toFixed(3).slice(0,-1)
        }else{
          return "0.0"
        } 
      }
  },
  computed: {
      bankGuaranteeDisabled() {
          return !(this.BasicInfoObj.bankGuaranteeLookup && (this.BasicInfoObj.bankGuaranteeLookup.code == 1 || this.BasicInfoObj.bankGuaranteeLookup.code == 3));
      },
  },
  created() {
      this.excelLink =  this.$store.getters.serverURI+"ExcelTemplates/TenderCalculationSheetItemsTemplete.xlsx"
      this.getCalculationSheetCurrency("")
      this.loggeduser = this.$store.getters.getUserData.id;
      //this.getRemoteItemsByCode();
    
      this.getGuaranteeDeliveryLocationLookups();
      this.getPrincipalNames();
      this.getTenderReferences();
      this.fillGuaranteeType();
      this.FillCostTypeList();
      //this.FillCurrencyList();
      this.fillCountryList();

      this.geTtenderCalculationSheetData();
      // if (this.calSheetId) { // should be called after getCalculationSheetData
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
      saveShippingExpensesDialog(){
          this.currentRow.sE_EachContainer =this.ShippingExpensesDialog.sE_EachContainer
          this.currentRow.sE_EachPallet =this.ShippingExpensesDialog.sE_EachPallet
          this.currentRow.sE_CostPerContainer =this.ShippingExpensesDialog.sE_CostPerContainer
          this.currentRow.shippingExpenses =  parseFloat((this.currentRow.sE_CostPerContainer /(this.currentRow.sE_EachContainer *   this.currentRow.sE_EachPallet))).toFixed(3)
          this.hideShippingExpensesDialog();
          
      },
      showShippingExpensesDialog(row) {
          this.isShowShippingExpensesDialog = true;
          this.currentRow= row;
          this.ShippingExpensesDialog.sE_EachContainer =  this.currentRow.sE_EachContainer; 
          this.ShippingExpensesDialog.sE_EachPallet =   this.currentRow.sE_EachPallet ;
          this.ShippingExpensesDialog.sE_CostPerContainer =     this.currentRow.sE_CostPerContainer ;

      },
      hideShippingExpensesDialog() {
          this.isShowShippingExpensesDialog = false;
      },
      showDuplicateGroupDialog(index) {
          this.groupIndexToDuplicate = index;
          this.duplicateGroupDialog = true;
      },
  duplicateGroup(){
      this.$validator.validateAll("duplicateGroupValidation").then(result => {
          if (result) {
              if (this.isDuplicateMainGroup) {
                  var groupToDuplicate = JSON.parse(JSON.stringify(this.tenderCalculationSheetGroups[this.groupIndexToDuplicate]));
                  this.tenderCalculationSheetGroups.push(groupToDuplicate)
                  this.totalAmountIndex = this.tenderCalculationSheetGroups.length - 1;
              }
              else {
                  var mainItemsList = JSON.parse(JSON.stringify(this.tenderCalculationSheetGroups[this.groupIndexToDuplicate].tenderCalculationSheetItem)),
                      optionalItems = JSON.parse(JSON.stringify(this.tenderCalculationSheetGroups[this.groupIndexToDuplicate].tenderCalculationSheetOptionalGroup));
                  this.tenderCalculationSheetGroups[this.groupIndexToDuplicate].tenderCalculationSheetAlternativeGroup.push(
                      {
                          name: "",
                          selected: false,
                          totalAmount: "",
                          totalCost: "",
                          totalProfit: "",
                          groupTotalQuotationPrice: "",
                          groupTotal_WO_VAT: "",
                          tenderCalculationSheetMainGroupId: this.tenderCalculationSheetGroups[this.groupIndexToDuplicate].id ?
                              this.tenderCalculationSheetGroups[this.groupIndexToDuplicate].id :
                              "",
                          tenderCalculationSheetItem: mainItemsList,
                          tenderCalculationSheetAlternativeOptionalGroup: optionalItems,
                          calculationAlternativeAmount: []
                      });
                  this.totalAlternativeAmountIndex =
                      this.tenderCalculationSheetGroups[this.groupIndexToDuplicate].tenderCalculationSheetAlternativeGroup
                      .length - 1;
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
              h("span", null, this.$t("CloseConfirmationMessage"))
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
              }
          });
      },
      calculateTotal(){
          var val = this.tenderCalculationSheetGroups;
          if (val && val.length > 0) {
                  val.forEach((element) => {

                      var Amount = 0.0;
                      var _groupTotal_WO_VAT = 0.0;
                      var _groupTotalQuotationPrice = 0.0;
                      // var _totalProfit = 0.0
                      element.tenderCalculationSheetItem.forEach((_element) => {
                          // if(_element.msS_Quantity){
                          //      _element.msS_Quantity = this.toFormat(_element.msS_Quantity);
                          //  }

                          //  if(_element.suggestedQuotedPrice_WO_VAT != ""){
                          //     _element.suggestedQuotedPrice_WO_VAT = this.toFormat(_element.suggestedQuotedPrice_WO_VAT);
                          //  }

                          //  if(_element.total_WO_VAT != ""){
                          //     _element.total_WO_VAT = this.toFormat(_element.total_WO_VAT);
                          //  }

                           if(_element.profitAmount != ""){
                              Amount += parseFloat(_element.profitAmount);
                           }
                           if(_element.total_WO_VAT != ""){
                               _groupTotal_WO_VAT += parseFloat(_element.total_WO_VAT);
                           }
                           if(_element.totalQuotationPrice != ""){
                               _groupTotalQuotationPrice += parseFloat(_element.totalQuotationPrice);
                           }
                          //  if(_element.profitPercentage != ""){
                          //     _totalProfit += parseFloat(_element.profitPercentage);
                          //  }
                          
                           
                      });
                     
                      element.totalAmount =  Amount.toFixed(3)//.slice(0,-1);
                      element.groupTotal_WO_VAT = Number.isNaN(_groupTotal_WO_VAT) ? 0.0 : _groupTotal_WO_VAT.toFixed(3)//.slice(0,-1);                             
                      // var totalPofitePercentage = Number.isNaN(_totalProfit) ? 0.0 : _totalProfit.toFixed(3)//.slice(0,-1);     
                      element.groupTotalQuotationPrice = Number.isNaN(_groupTotalQuotationPrice) ? 0.0 : _groupTotalQuotationPrice.toFixed(3)//.slice(0,-1);   
                      element.totalProfit = Number.isNaN(element.totalAmount/element.groupTotal_WO_VAT) ? 0.0 : ((element.totalAmount/element.groupTotal_WO_VAT)*100).toFixed(3)//.slice(0,-1);

                      element.tenderCalculationSheetAlternativeGroup.forEach(alterElement => {
                          var AlternativeAmount = 0.0;
                          var _AlternativeGroupTotal_WO_VAT = 0.0;
                          var _AlternativeGroupTotalQuotationPrice = 0.0;
                          // var _AlternativeGroupTotalProfit = 0.0
                          alterElement.tenderCalculationSheetItem.forEach((_element) => {
                          //    if(_element.msS_Quantity){
                          //          _element.msS_Quantity = this.toFormat(_element.msS_Quantity);
                          //     }

                          //     if(_element.suggestedQuotedPrice_WO_VAT != ""){
                          //         _element.suggestedQuotedPrice_WO_VAT = this.toFormat(_element.suggestedQuotedPrice_WO_VAT)
                          //     }

                          //     if(_element.total_WO_VAT != ""){
                          //         _element.total_WO_VAT = this.toFormat(_element.total_WO_VAT)
                          //     }
                             
                             if(_element.profitAmount != ""){
                                  AlternativeAmount += parseFloat(_element.profitAmount);
                              }
                              if(_element.total_WO_VAT != ""){
                                  _AlternativeGroupTotal_WO_VAT += parseFloat(_element.total_WO_VAT);
                              }
                              if(_element.totalQuotationPrice != ""){
                                  _AlternativeGroupTotalQuotationPrice += parseFloat(_element.totalQuotationPrice);
                              }
                              // if(_element.profitPercentage != ""){
                              //     _AlternativeGroupTotalProfit += parseFloat(_element.profitPercentage);
                              // }

                              

                          });
                         
                          alterElement.groupTotal_WO_VAT = Number.isNaN(_AlternativeGroupTotal_WO_VAT) ? 0.0 : _AlternativeGroupTotal_WO_VAT.toFixed(3)//.slice(0,-1); 
                          alterElement.totalAmount = Number.isNaN(AlternativeAmount) ? 0.0 : AlternativeAmount.toFixed(3)//.slice(0,-1);
                          // var alternativeTotalPofitePercentage =  Number.isNaN(_AlternativeGroupTotalProfit) ? 0.0 : _AlternativeGroupTotalProfit.toFixed(3)//.slice(0,-1);
                          alterElement.groupTotalQuotationPrice = Number.isNaN(_AlternativeGroupTotalQuotationPrice) ? 0.0 : _AlternativeGroupTotalQuotationPrice.toFixed(3)//.slice(0,-1);							 
                          alterElement.totalProfit = Number.isNaN(alterElement.totalAmount/alterElement.groupTotal_WO_VAT) ? 0.0 : ((alterElement.totalAmount/alterElement.groupTotal_WO_VAT)*100).toFixed(3)//.slice(0,-1);


                          if (
                              alterElement.tenderCalculationSheetAlternativeOptionalGroup != null
                          ) {
                              var AlternativeOptionalAmount = 0.0;
                              var _AlternativeOptionalGroupTotal_WO_VAT = 0.0;
                              var _AlternativeOptionalGroupTotalQuotationPrice = 0.0;
                              // var __alternativeOptionalGroupTotalProfit = 0.0;

                              alterElement.tenderCalculationSheetAlternativeOptionalGroup.tenderCalculationSheetItem.forEach(
                                  (_elementOptional) => {
                                  if(_elementOptional.profitAmount != ""){
                                      AlternativeOptionalAmount += parseFloat(_elementOptional.profitAmount);
                                  }
                                  if(_elementOptional.total_WO_VAT != ""){
                                   _AlternativeOptionalGroupTotal_WO_VAT += parseFloat(_elementOptional.total_WO_VAT);
                                  }
                                  if(_elementOptional.totalQuotationPrice != ""){
                                      _AlternativeOptionalGroupTotalQuotationPrice += parseFloat(_elementOptional.totalQuotationPrice);
                                  }
                                  // if(_elementOptional.profitPercentage != ""){
                                  //  __alternativeOptionalGroupTotalProfit += parseFloat(_elementOptional.profitPercentage);
                                  // }
                                    });
                                    alterElement.tenderCalculationSheetAlternativeOptionalGroup.groupTotal_WO_VAT = Number.isNaN(_AlternativeOptionalGroupTotal_WO_VAT) ? 0.0 : _AlternativeOptionalGroupTotal_WO_VAT.toFixed(3)//.slice(0,-1); 
                                    alterElement.tenderCalculationSheetAlternativeOptionalGroup.groupTotalQuotationPrice = Number.isNaN(_AlternativeOptionalGroupTotalQuotationPrice) ? 0.0 : _AlternativeOptionalGroupTotalQuotationPrice.toFixed(3)//.slice(0,-1);							 
                                    alterElement.tenderCalculationSheetAlternativeOptionalGroup.totalAmount = Number.isNaN(AlternativeOptionalAmount) ? 0.0 : AlternativeOptionalAmount.toFixed(3)//.slice(0,-1);
                              // var alternativeOptionalGroupTotalProfit = Number.isNaN(__alternativeOptionalGroupTotalProfit) ? 0.0 : AlternativeOptionalAmount.toFixed(3)//.slice(0,-1);
                              alterElement.tenderCalculationSheetAlternativeOptionalGroup.totalProfit = Number.isNaN(alterElement.tenderCalculationSheetAlternativeOptionalGroup.totalAmount/alterElement.tenderCalculationSheetAlternativeOptionalGroup.groupTotal_WO_VAT) ? 0.0 : ((alterElement.tenderCalculationSheetAlternativeOptionalGroup.totalAmount/alterElement.tenderCalculationSheetAlternativeOptionalGroup.groupTotal_WO_VAT)*100).toFixed(3)//.slice(0,-1);
                             
                          }
                      });

                      if (element.tenderCalculationSheetOptionalGroup) {
                          var OptionalAmount = 0.0;
                          var _OptionalGroupTotal_WO_VAT = 0.0;
                          var _OptionalGroupTotalQuotationPrice = 0.0;
                          // var _OptionalGroupTotalProfit = 0.0;

                          element.tenderCalculationSheetOptionalGroup.tenderCalculationSheetItem.forEach(
                              (_element) => {
                                  if(_element.profitAmount != ""){
                                      OptionalAmount += parseFloat(_element.profitAmount);
                                  }
                                  if(_element.total_WO_VAT != ""){
                                       _OptionalGroupTotal_WO_VAT += parseFloat(_element.total_WO_VAT);
                                  }
                                  if(_element.totalQuotationPrice != ""){
                                      _OptionalGroupTotalQuotationPrice += parseFloat(_element.totalQuotationPrice);
                                  }
                                  // if(_element.profitPercentage != ""){
                                  //  _OptionalGroupTotalProfit += parseFloat(_element.profitPercentage);
                                  // }
                              }
                          );
                         
                          element.tenderCalculationSheetOptionalGroup.groupTotal_WO_VAT = Number.isNaN(_OptionalGroupTotal_WO_VAT) ? 0.0 : _OptionalGroupTotal_WO_VAT.toFixed(3)//.slice(0,-1); 
                          element.tenderCalculationSheetOptionalGroup.totalAmount = Number.isNaN(OptionalAmount) ? 0.0 : OptionalAmount.toFixed(3)//.slice(0,-1);
                          // var OptionalTotalProfit =  Number.isNaN( _OptionalGroupTotalProfit ) ? 0.0 : OptionalMargin.toFixed(3)//.slice(0,-1);
                          element.tenderCalculationSheetOptionalGroup.groupTotalQuotationPrice = Number.isNaN(_OptionalGroupTotalQuotationPrice) ? 0.0 : _OptionalGroupTotalQuotationPrice.toFixed(3)//.slice(0,-1);							 
                          element.tenderCalculationSheetOptionalGroup.totalProfit = Number.isNaN(element.tenderCalculationSheetOptionalGroup.totalAmount/element.tenderCalculationSheetOptionalGroup.groupTotal_WO_VAT) ? 0.0 : ((element.tenderCalculationSheetOptionalGroup.totalAmount/element.tenderCalculationSheetOptionalGroup.groupTotal_WO_VAT)*100).toFixed(3)//.slice(0,-1)
                      }
                  });
              }
      },
  Excel() {

    this.fullscreenLoading = true;
    var urlStr =
      this.$store.getters.serverURI +
      "api/TenderCalculationSheets/"+this.calSheetId+"/Export"

    axios({
      method: "post",
      url: urlStr,
      headers: this.$store.getters.tokenAuthonticationHeaderObj,
      responseType: "blob"
    }).then(response => {
      this.fullscreenLoading = false;
      var fileURL = window.URL.createObjectURL(new Blob([response.data]));
      var fileLink = document.createElement("a");

      fileLink.href = fileURL;
      let fileName = this.BasicInfoObj.tenderNumber + "_" + (this.BasicInfoObj.mssCustomerName?this.BasicInfoObj.mssCustomerName:this.BasicInfoObj.nonMssCustomerName);
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
  SuggestionLabel(){
      return this.$t("SuggestedQuotedPriceWOVAT")+" - "+this.tenderCalculationSheetCode  
  },
  toFormat(value) {
      if(value){
            return (value).toLocaleString('en-us', {minimumFractionDigits: 2})
      }else{
       return "0.0"
      }
  },
  changeCostType(row){
      // CIF: 1
      // On hand: 2
      // FOB: 3
      var item =  this.costTypeList.filter(x=>x.id == row.costType);
      if(item.length > 0)
         row.costTypeCode = item[0].code
            
      this.calculatorMainItemChange(row)
  },
  changeFoc(row){
      row.foc = !row.foc
      if(row.foc == false) {
          row.foC_Value = "1";
          if(row.costTypeCode == 3){
              row.factor = ''
              row.suggestedQuotedPrice_WO_VAT = ''
              row.suggestedPrice_WO_VAT_SelectedCurrency = ''
          }
      }
      this.calculatorMainItemChange(row)
  },
  handleTeenderUnitChange(rowItem){
          if(rowItem.tenderUnitM == -1){
              rowItem.msS_Unit = 1;// why ?!
          }else{
              rowItem.tenderUnit = rowItem.tenderUnitM;
          }
          if(rowItem.tenderUnitM !== 0){
              rowItem.tenderUnitValue = "";
          }
          else rowItem.tenderUnitValue = "1";
          this.calculatorMainItemChange(rowItem);
      },
      handleMSSUnitChange(rowItem){
          if(rowItem.msS_Unit != "0"){
              rowItem.mssUnitValue = "";
          }
          else rowItem.mssUnitValue = "1";
          this.calculatorMainItemChange(rowItem);
      },
  importExcel(files) {
  //   const files = e.target.files;
    if (!files.length) {
      return ;
    }
    else if (files.length > 1) {
      this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("MaxFilesReached")
          });
      return
    } 
    else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
          this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("InvalidFile")
          });
      return
    }
    this.fullscreenLoading = true;
    const fileReader = new FileReader();
    fileReader.onload = ev => {
      try {
        const data = ev.target.result;
        const XLSX = xlsx;
        const workbook = XLSX.read(data, {
          type: "binary"
        });
        const wsname = workbook.SheetNames[0]; // Take the first sheet，wb.SheetNames[0] :Take the name of the first sheet in the sheets
        const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname], {header: 1}); // Generate JSON table content，wb.Sheets[Sheet名]    Get the data of the first sheet
        const excellist = [];  // Clear received data
        var codes = [];
        // begin from 8 to skip the headers
        for (var i = 8; i < ws.length; i++) {
          excellist.push(ws[i]);
          if (ws[i].length && ws[i][0]) codes.push(String(ws[i][3]))
        }
        this.checkItemsByCodeOrName(codes, excellist)
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
          var urlStr = this.$store.getters.serverURI + "api/Item/CheckItemsByCodeOrName";
          this.$http
              .post(
                  urlStr, {
                      codes: codes,
                  }, {
                      headers: this.$store.getters.tokenAuthonticationHeaderObj
                  }
              )
              .then(
                  (data) => {
                      this.pushFromImport(excellist, data.body);        
                  },
                  function() {
                      this.pushFromImport(excellist, []);
                  }
              );
      
      },
  pushFromImport(excellist, validCodes) {
      var skippedItems = [];
      if(excellist.length > 0){
              excellist.forEach(row => {
               if(row.length){//to skip empty row
                  var calWarranty = "";
                  if (this.BasicInfoObj.warrantyForAllGroups) {
                      calWarranty = this.BasicInfoObj.warranty;
                  }
                  if (row[0]){//to skip total row
                      let tenderCalculationSheetItem = {
                          quantity: "",
                          cost: row[6],
                          costType: this.costTypeList.find(x=>x.name==row[9])?this.costTypeList.find(x=>x.name==row[9]).id:14,
                          discount1: "",
                          discount2: "",
                          currencyCode: row[20] || this.tenderCalculationSheetCode,
                          currencySymbol:this.currenciesList.find(x=>x.code==row[20])?this.currenciesList.find(x=>x.code==row[20]).currencySymbol:this.currenciesList.find(x=>x.code==this.tenderCalculationSheetCode).currencySymbol,
                          shipment: "",
                          landedCost: "",
                          grossMargin: "",
                          unitPrice: "",
                          amount: "",
                          grossMarginValue: "",
                          note: row[40] || " ",
                          approve: false,
                          //----------------
                          shelfLife:row[11] || "",
                          countryOfOrigin: "",
                          countryofOriginIds: row[13]?row[13].split(",").map((x)=>{return parseInt(x);}):[],
                          tenderUnitM: row[14] ? parseInt(row[14]) : -1,
                          tenderUnit: row[14] ? parseInt(row[14]) : "",
                          tenderUnitValue: row[15] ? parseInt(row[15]) : "",
                          msS_Unit: row[16] || "1",
                          mssUnitValue: row[17] || "1",
                          tenderQuantity: row[18] || "",
                          msS_Quantity: row[19] || "",
                          lastWinningPrice_WO_VAT : row[32] || 0.0,
                          total_WO_VAT: row[33] || "",
                          foB_MSS_Unit:row[21] || "",
                          foB_MSS: "",
                          foC_Value: row[26] || "1",
                          shippingExpenses: row[23] || "",
                          foc: row[25] || false,
                          cif: row[27] || "",
                          cifPlaceHolder:"",
                          cifValueInTheSelectedCurrency:row[28] || "",
                          exchangeRate: "",
                          profitPercentage: row[34] || "",
                          profitAmount: row[35] || "",
                          tenderUnitPrice: row[36] || "",
                          adjustedTenderUnitPrice: row[37] || "",
                          totalQuotationPrice: row[38] || "",
                          factor: row[29] || "",
                          suggestedQuotedPrice_WO_VAT:row[30] || "",
                          suggestedQuotedPrice_WO_VATPlaceHolder:"",
                          suggestedPrice_WO_VAT_SelectedCurrency:row[31] || "",
                          regularPrice:row[39] || "",
                          winningProbability:false,
                          costTypeCode: this.costTypeList.find(x=>x.name==row[9])?this.costTypeList.find(x=>x.name==row[9]).code:1,
                          shippingExpenseType: row[24] ? row[24]=="Value" : true,
                          itemToCalculate:"",

                          ciF_not_rounded:"",
                          factor_not_rounded:"",
                          shippingExpenses_not_rounded:"",
                          suggestedQuotedPrice_WO_VAT_not_rounded:"", 
                          totalQuotationPrice_not_rounded:"",
                          total_WO_VAT_not_rounded:"",
                          adjustedTenderUnitPrice_not_rounded:"",
                          tenderUnitPrice_not_rounded:"",
                          profitPercentage_not_rounded:"",
                          profitAmount_not_rounded:"",
                      };
                      if (row[3]) {
                          let obj = validCodes.find((x) => (x.code).toLowerCase() === (String(row[3])).toLowerCase());
                          if (obj) {
                              tenderCalculationSheetItem.code = obj.code;
                              tenderCalculationSheetItem.name = obj.name;
                              tenderCalculationSheetItem.vendor = obj.vendor;
                              tenderCalculationSheetItem.onHandPrice = obj.onHandPrice;
                              if (!tenderCalculationSheetItem.cost) tenderCalculationSheetItem.cost = obj.onHandPrice;
                              tenderCalculationSheetItem.onHandPriceCurrency = obj.currency
                              tenderCalculationSheetItem.onHandPriceCurrencySymbol = obj.currencySymbol
                              tenderCalculationSheetItem.onHandQuantity = obj.onHandQuantity;
                              tenderCalculationSheetItem.fromERB = obj.fromERB
                          }else skippedItems.push(row[3]);
                      }
                      else if(row[4]) {
                          let obj = validCodes.find((x) => x.name === row[4]);
                          if (obj) {
                              tenderCalculationSheetItem.code = obj.code;
                              tenderCalculationSheetItem.name = obj.name;
                              tenderCalculationSheetItem.vendor = obj.vendor;
                              tenderCalculationSheetItem.onHandPrice = obj.onHandPrice;
                              if (!tenderCalculationSheetItem.cost) tenderCalculationSheetItem.cost = obj.onHandPrice;
                              tenderCalculationSheetItem.onHandPriceCurrency = obj.currency
                              tenderCalculationSheetItem.onHandPriceCurrencySymbol = obj.currencySymbol
                              tenderCalculationSheetItem.onHandQuantity = obj.onHandQuantity;
                              tenderCalculationSheetItem.fromERB = obj.fromERB
                          }else skippedItems.push(row[4]);
                      }
                      if (tenderCalculationSheetItem.code) {
                          this.calculatorMainItemChange(tenderCalculationSheetItem);
                          let groupTitle = row[0].split(" ");
                          if (groupTitle.length==1) {//to add main groups
                              let groupIndex = groupTitle[0].split("-")[1]-1;
                              let groupObj = this.tenderCalculationSheetGroups.find((x, index) => index==groupIndex);
                              if (!groupObj)
                              this.tenderCalculationSheetGroups.push({
                                  tenderCalculationSheetId: this.calSheetId,
                                  name: row[1] || "",
                                  number: row[2] || "",
                                  deliveryTerms: "",
                                  warranty: calWarranty,
                                  totalAmount: "",
                                  totalCost: "",
                                  totalProfit: "",
                                  groupTotalQuotationPrice: "",
                                  groupTotal_WO_VAT: "",
                                  selected: false,
                                  tenderCalculationSheetAlternativeGroup: [],
                                  tenderCalculationSheetItem: [tenderCalculationSheetItem],
                                  tenderCalculationSheetOptionalGroup: null
                              });
                              else {
                                  groupObj.tenderCalculationSheetItem.push(tenderCalculationSheetItem);
                              }
                          }
                          else {//to add alternative groups
                              let groupIndex = groupTitle[0].split("-")[1]-1;
                              let alternativeGroupIndex = groupTitle[groupTitle.length-1]-1;
                              let groupObj = this.tenderCalculationSheetGroups[groupIndex];
                              let alternativeGroupObj = groupObj.tenderCalculationSheetAlternativeGroup.find((x,index)=>index==alternativeGroupIndex)
                              if (!alternativeGroupObj)
                              groupObj.tenderCalculationSheetAlternativeGroup.push(
                                  {
                                      name: row[1] || "",
                                      selected: false,
                                      totalAmount: "",
                                      totalCost: "",
                                      totalProfit: "",
                                      groupTotalQuotationPrice: "",
                                      groupTotal_WO_VAT: "",
                                      tenderCalculationSheetMainGroupId: groupObj.id ? groupObj.id : "",
                                      tenderCalculationSheetItem: [tenderCalculationSheetItem],
                                      tenderCalculationSheetAlternativeOptionalGroup: null,
                                      calculationAlternativeAmount: []
                                  }
                              );
                              else {
                                  alternativeGroupObj.push(tenderCalculationSheetItem);
                              }

                          }
                      }
                  }
                  
               }
              })
              
          }
          this.calculateTotal()
          this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
          if(skippedItems.length) this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "error",
              message: this.$t("UndefinedItems",{items: skippedItems})
          });
  },
      handleCountryofOriginIds:function(row){
          row.selectedCountryofOriginIds = row.countryofOriginIds;
      },
  getCalculationSheetCurrency: function(query = "") {
      // if (query !== "") {
          this.loadingAccount = true;
          var urlStr =
              this.$store.getters.serverURI +
              "api/Item/GetAllCurrencies?PageIndex=" +
              1 +
      "&PageSize=" + this.$store.getters.getReturnPage +
              "&name=" +
              query+"&code="+query+"&calculationSheetId="+this.calSheetId
              +"&department="+ this.$store.getters.getDepartmentCode.tender;
          this.$http
              .get(urlStr, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                  function(data) {
                      this.currenciesList = data.body;
                      this.loadingAccount = false;
                      this.calculateTotal()
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
      // } else this.currenciesList = [];
  },
  remoteMethodCurrency: function(query = "") {
      // if (query !== "") {
          this.loadingAccount = true;
          var urlStr =
              this.$store.getters.serverURI +
              "api/Item/GetAllCurrencies?PageIndex=" +
              1 +
      "&PageSize=" + this.$store.getters.getReturnPage +
              "&name=" +
              query+"&code="+query+"&calculationSheetId="+this.calSheetId
              +"&department="+ this.$store.getters.getDepartmentCode.tender;
          this.$http
              .get(urlStr, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                  function(data) {
                      this.currenciesList = data.body;
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
      // } else this.currenciesList = [];
  },
  remoteMethodItemsName: function(query) {
  if (query !== "") {
          this.loadingAccount = true;
          var urlStr =
              this.$store.getters.serverURI +
              "api/item/GetAllItems?PageIndex=" +
              1 + "&PageSize=" + this.$store.getters.getReturnPage +
        "&name=" +
        query+"&code=";
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
       remoteMethodItemsCode: function(query) {
  if (query !== "") {
          this.loadingAccount = true;
          var urlStr =
              this.$store.getters.serverURI +
              "api/item/GetAllItems?PageIndex=" +
              1 + "&PageSize=" + this.$store.getters.getReturnPage +
                  "&name=&code="+query;
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
          if (rowItem.discount1) {
              if (parseFloat(rowItem.discount1) > 100) {
                  rowItem.discount1 = 0;
              }
          }
          if (rowItem.profitPercentage) {
              if (parseFloat(rowItem.profitPercentage) > 100) {
                  rowItem.profitPercentage = 0;
              }
          }
      },
      getItemCodeName(item, fromImport) {
          var code = item.code;
          var name = "";
          var customer= this.BasicInfoObj.mssCustomerCode? this.BasicInfoObj.mssCustomerCode:""

          var urlStr =
              this.$store.getters.serverURI +
              "api/Item/GetByCodeOrName?name=" +
              name +
              "&code=" +
              code + 
              "&customerId="+ customer;
          this.calSheetId;
          this.$http
              .get(urlStr, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(function(data) {
                  // item.code = data.body.code;
                  item.name = data.body.name;
                  item.vendor = data.body.vendor;
                  item.onHandPrice=0.0;
                  item.cost =0.0;
                  if(data.body.onHandPrice){
                      item.onHandPrice = data.body.onHandPrice.toFixed(3);
                      if(!fromImport) item.cost = data.body.onHandPrice.toFixed(3);
                  }
                  item.onHandPriceCurrency = data.body.currency
                  item.onHandPriceCurrencySymbol = data.body.currencySymbol
                  item.onHandQuantity = data.body.onHandQuantity;
                  item.fromERB = data.body.fromERB;
                  item.regularPrice=0.0;
                  if(item.regularPrice){
                      item.regularPrice = data.body.unitPrice
                  }
                  
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
              code
              "&customerId="+ this.BasicInfoObj.mssCustomerCode;
          this.calSheetId;
          this.$http
              .get(urlStr, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(function(data) {
                  item.code = data.body.code;
                  // item.name = data.body.name;
                  item.vendor = data.body.vendor;
                  item.onHandPrice=0.0;
                  item.cost =0.0;
                  if(data.body.onHandPrice){
                      item.onHandPrice = data.body.onHandPrice.toFixed(3);
                      if(!fromImport) item.cost = data.body.onHandPrice.toFixed(3);
                  }
                  
                  item.onHandPriceCurrency = data.body.currency
                  item.onHandPriceCurrencySymbol = data.body.currencySymbol
                  item.onHandQuantity = data.body.onHandQuantity;
                  item.fromERB = data.body.fromERB;
                  item.regularPrice=0.0;
                  if(item.regularPrice){
                      item.regularPrice = data.body.unitPrice.toFixed(3);
                  }
                  

              });
      },
      getCurrentStep() {
          var urlStr =
              this.$store.getters.serverURI +
              "api/TenderWorkflowLog/GetCurrentStep?id=" +
              this.calSheetId;
          this.$http
              .get(urlStr, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(function(data) {
                  if(data.body != null){
                      this.StepId = data.body.id;
                      this.WorkflowId = data.body.workflowSettingId;
                      this.workflowStepActionSetting = data.body.workflowStepActionSetting;
                  }
              });
      },
      workflowAction(actionId, isLastApprove,type) {
       this.$validator.validateAll().then(result => {
        if (result) {
          if (
              // !this.getSelection() || 
              (this.tenderCalculationSheetGroups.length == 0) &&
              this.BasicInfoObj.status == this.$store.getters.getSheetStatus.Waiting_for_Approval &&
              this.BasicInfoObj.actionId == null && type == 1
          ) {
              this.$message({
                  showClose: true,
                  duration: this.$store.getters.getMessagesDuration,
                  type: "error",
                  message: this.$t("Pleasechoosegroup")
              });
              return;
          }

          // if (!this.checkSelection() && isLastApprove) {
          //     this.$message({
          //         showClose: true,
          //         duration: this.$store.getters.getMessagesDuration,
          //         type: "error",
          //         message: this.$t("MissingValues")
          //     });
          //     return;
          // }

          this.isClickWrokflow = true;
          this.fullscreenLoading = true;
          var urlStr = this.$store.getters.serverURI + "api/TenderWorkflowLog";
          this.$http
              .post(
                  urlStr, {
                      id: 0,
                      tenderCalculationSheetId: this.calSheetId,
                      WorkflowId: this.WorkflowId,
                      StepId: this.StepId,
                      ActionId: actionId,
                      tenderCalculationSheetMainGroup:this.tenderCalculationSheetGroups,
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
                          message: this.$t("ProcessDone")
                      });
                      //  this.geTtenderCalculationSheetData();
                      this.$emit("withoutConfirm");
                      this.$router.push({ name: "tenderCalculationSheetList" });
                                  
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
        }
       });
      },
      cloaeExcelSheetDialog(){
          this.ExcelsheetDialog = true;
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
                          this.ExcelsheetDialog = false;
                          done();
                      } else {
                          this.ExcelsheetDialog = true;
                          done();
                      }
                      }
                  });        
      },
      closeBuildTenderCalculationSheet() {
          this.bulidTenderCalculationSheetDialog = true;
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
              }
          });
      },
      // selectAlternativGroup(alternative, main, alternativeIndex, index) {
      //     var AlternativeAmount = 0.0;
      //     this.totalAlternativeAmountIndex = alternativeIndex;
      //     this.totalAmountIndex = index;

      //     this.tenderCalculationSheetGroups[
      //         index
      //     ].tenderCalculationSheetAlternativeGroup.forEach(element => {
      //         element.selected = false;
      //     });
      //     this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[
      //         alternativeIndex
      //     ].selected = true;

      //     this.tenderCalculationSheetGroups[index].selected = false;
      //     this.tenderCalculationSheetGroups.splice("", 0);
      //     if (this.tenderCalculationSheetGroups[index]) {
      //         if (
      //             this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup &&
      //             this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[
      //                 alternativeIndex
      //             ].tenderCalculationSheetItem.length > 0
      //         ) {
      //             this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[
      //                 alternativeIndex
      //             ].tenderCalculationSheetItem.forEach(element => {
      //                 AlternativeAmount += parseFloat(element.amount);
      //             });
      //             this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[
      //                 alternativeIndex
      //             ].totalAmount = AlternativeAmount.toFixed(3).slice(0,-1);
      //         }
      //     }
      //     this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
      // },
      // selectMainGroup(object, index, e) {
      //     this.totalAmountIndex = index;

      //     if (this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup) {
      //         this.tenderCalculationSheetGroups[
      //             index
      //         ].tenderCalculationSheetAlternativeGroup.forEach(_element => {
      //             _element.selected = false;
      //         });
      //     }

      //     this.tenderCalculationSheetGroups[index].selected = true;
      //     this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
      // },
      getTotalAmountTotalGrossMarginTotalGrossMarginValue() {

          var Total_Quoted_Price_WO_VAT = 0.0;
          var Total_Quotation_Price_With_VAT = 0.0;
          // var Total_Profit_Percentage = 0.0;
          var Total_Profit_Amount = 0.0;
          
          this.tenderCalculationSheetGroups.forEach(element => {
                  if (element.tenderCalculationSheetItem &&
                      element.tenderCalculationSheetItem.length > 0
                  ) {
                          if(element.groupTotal_WO_VAT != ""){
                              Total_Quoted_Price_WO_VAT += parseFloat(element.groupTotal_WO_VAT);
                          }

                          if(element.totalAmount != ""){
                              Total_Profit_Amount += parseFloat(element.totalAmount);
                          }

                          // if(element.totalProfit != ""  && !Number.isNaN(element.totalProfit)){
                          //     Total_Profit_Percentage += parseFloat(element.totalProfit);
                          // }

                          if(element.groupTotalQuotationPrice != ""){
                              Total_Quotation_Price_With_VAT += parseFloat(element.groupTotalQuotationPrice);
                          }
                  }
              // } else {
                  if (
                      element.tenderCalculationSheetAlternativeGroup &&
                      element.tenderCalculationSheetAlternativeGroup.length > 0
                  ) {
                      element.tenderCalculationSheetAlternativeGroup.forEach(_element => {
                              // if (_element.selected == true) {
                              
                              if(_element.groupTotal_WO_VAT != ""){
                                  Total_Quoted_Price_WO_VAT += parseFloat(_element.groupTotal_WO_VAT);
                              }

                              if(_element.totalAmount != ""){
                                  Total_Profit_Amount += parseFloat(_element.totalAmount);
                              }

                              // if(_element.totalProfit != "" && !Number.isNaN(_element.totalProfit)){
                              //     Total_Profit_Percentage += parseFloat(_element.totalProfit);
                              // }

                              if(_element.groupTotalQuotationPrice != ""){
                                  Total_Quotation_Price_With_VAT += parseFloat(_element.groupTotalQuotationPrice);
                              }
                          // }
                      });
                  }
              // }
          });

          this.bankBlockViewModel.total_Quotation_Price_With_VAT = Number.isNaN(Total_Quotation_Price_With_VAT) ? 0.0 : Total_Quotation_Price_With_VAT.toFixed(3)//.slice(0,-1);
          this.bankBlockViewModel.total_Quoted_Price_WO_VAT = Number.isNaN(Total_Quoted_Price_WO_VAT) ? 0.0 : Total_Quoted_Price_WO_VAT.toFixed(3)//.slice(0,-1);
          this.bankBlockViewModel.total_Profit_Amount = Number.isNaN(Total_Profit_Amount) ? 0.0 : Total_Profit_Amount.toFixed(3)//.slice(0,-1);
          this.bankBlockViewModel.total_Profit_Percentage = Number.isNaN(this.bankBlockViewModel.total_Profit_Amount/this.bankBlockViewModel.total_Quoted_Price_WO_VAT ) ? 0.0 : ((this.bankBlockViewModel.total_Profit_Amount/this.bankBlockViewModel.total_Quoted_Price_WO_VAT)*100).toFixed(3)//.slice(0,-1);
          
          if(this.bankBlockViewModel.bankGuaranteeType == true){
              this.bankBlockViewModel.bankGranteeInCaseOfPercentage = Number.isNaN((Number(this.bankBlockViewModel.bankGuarantee)/100)*this.bankBlockViewModel.total_Quotation_Price_With_VAT ) ? 0.0 : (((Number(this.bankBlockViewModel.bankGuarantee)/100)*this.bankBlockViewModel.total_Quotation_Price_With_VAT)).toFixed(3)//.slice(0,-1);
          }else{
              this.bankBlockViewModel.bankGranteeInCaseOfPercentage = 0.0
          }
      },
      submitCaluctionSheet() {
      this.$validator.validateAll().then(result => {
      if (result) {
          if(this.BasicInfoObj.isVat){
               this.bankBlockViewModel.vatValue = this.VAT
          }else{
              this.bankBlockViewModel.vatValue = null
          }
          var urlStr;
           if (this.mainGroupPrevCount) {
              if (this.calSheetId) {
                  this.fullscreenLoading = true;
                  urlStr =
                      this.$store.getters.serverURI +
                      "api/TenderCalculationSheet/" +
                      this.calSheetId +
                      "/Submission";
                  this.$http
                      .put(
                          urlStr, {
                              tenderCalculationSheetMainGroup: this.tenderCalculationSheetGroups,
                              bankBlockViewModel: this.bankBlockViewModel
                          }, {
                              headers: this.$store.getters.tokenAuthonticationHeaderObj
                          }
                      )
                      .then(
                          response => {
                              this.fullscreenLoading = false;
                              if (response.status == this.$store.getters.getErrorCode) {
                                  this.$message({
                                      showClose: true,
                                      duration: this.$store.getters.getMessagesDuration,
                                      type: "warning",
                                      message: response.data.message
                                  });
                              } else {
                                  // this.geTtenderCalculationSheetData();
                                  this.$emit("withoutConfirm");
                                  this.$router.push({ name: "tenderCalculationSheetList" });
                                  this.$message({
                                      showClose: true,
                                      duration: this.$store.getters.getMessagesDuration,
                                      type: "success",
                                      message: response.data.message
                                  });
                              }
                              //window.location.reload(true);
                              // this.$router.push({ path: "/tenderCalculationSheets" });
                          },
                          function(error) {
                              this.fullscreenLoading = false;
                              if (error.status == this.$store.getters.getErrorCode) {
                                  this.$message({
                                      showClose: true,
                                      duration: this.$store.getters.getMessagesDuration,
                                      type: "warning",
                                      message: error.data.message
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
          } else {
              if (this.calSheetId) {
                  this.fullscreenLoading = true;
                  urlStr =
                      this.$store.getters.serverURI +
                      "api/TenderCalculationSheet/" +
                      this.calSheetId +
                      "/Submission";
                  this.$http
                      .post(
                          urlStr, {
                              tenderCalculationSheetMainGroup: this.tenderCalculationSheetGroups,
                              bankBlockViewModel: this.bankBlockViewModel
                          }, {
                              headers: this.$store.getters.tokenAuthonticationHeaderObj
                          }
                      )
                      .then(
                          response => {
                              this.fullscreenLoading = false;
                              if (response.status == this.$store.getters.getErrorCode) {
                                  this.$message({
                                      showClose: true,
                                      duration: this.$store.getters.getMessagesDuration,
                                      type: "warning",
                                      message: response.data.message
                                  });
                              } else {
                                  // this.geTtenderCalculationSheetData();
                                  this.$emit("withoutConfirm");
                                  this.$router.push({ name: "tenderCalculationSheetList" });
                                  this.$message({
                                      showClose: true,
                                      duration: this.$store.getters.getMessagesDuration,
                                      type: "success",
                                      message: response.data.message
                                  });
                              }

                              // window.location.reload(true);
                              // this.$router.push({ path: "/tenderCalculationSheets" });
                          },
                          function(error) {
                              this.fullscreenLoading = false;
                              if (error.status == this.$store.getters.getErrorCode) {
                                  this.$message({
                                      showClose: true,
                                      duration: this.$store.getters.getMessagesDuration,
                                      type: "warning",
                                      message: error.data.message
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
          }
        }
      });
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
      getRemoteItemsByName(qurey) {
          this.loadingFetchdata = true;
          var urlStr =
              this.$store.getters.serverURI + "api/item/GetAllItems?name=" + qurey;

          this.$http
              .get(urlStr, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                  function(data) {
                      this.systemItemsList = data.body;
                      this.loadingFetchdata = false;
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
      getRemoteItemsByCode(qurey) {
          this.loadingFetchdata = true;
          var urlStr =
              this.$store.getters.serverURI + "api/item/GetAllItems?code=" + qurey;
          this.$http
              .get(urlStr, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                  function(data) {
                      this.systemItemsList = data.body;
                      this.loadingFetchdata = false;
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
      currencyChanged(rowItem){
          if(this.currenciesList&&this.currenciesList.length){
              if(rowItem.currencyCode){
                  rowItem.currencySymbol=this.currenciesList.filter(x=>x.code==rowItem.currencyCode)[0].currencySymbol
              }
              else{
                  rowItem.currencySymbol=''
              }
          }
          
      },
      calculatorMainItemChange(rowItem,columnName) {
          
          var TenderQty = 0.0;
          var MSSUnit = 0.0
          var fOBMSSUnit = 0.0
          var fOCValue = 0.0
          var ShippingExpenses = 0.0;
          var Factor = 0.0;
          var SuggestedQuotedPrice_WO_VAT =  0.0;
          var AdjustedTenderUnitPrice = 0.0;
          var TenderUnit = 0.0;
          var TenderUnitM = -1;
          var CIF = 0.0;
          var CIF_EXCHANGE = 0.0;
          var SUGGESTION_EXCHANGE = 0.0;
          var SuggestedQuotedPrice_WO_VAT_EXCHANGE = 0.0;

         
          if (rowItem.tenderUnit !== "") {// the same of lab.
            TenderUnit = rowItem.tenderUnit == 0 && rowItem.tenderUnitValue ? rowItem.tenderUnitValue : rowItem.tenderUnit;
          }

          if (rowItem.tenderUnitM !== "") {
            TenderUnitM = rowItem.tenderUnitM;
          }

         
          if (rowItem.msS_Unit && rowItem.msS_Unit != "") {
            MSSUnit = rowItem.msS_Unit == "0" && rowItem.mssUnitValue ? rowItem.mssUnitValue : rowItem.msS_Unit;
          }

          if (rowItem.adjustedTenderUnitPrice && rowItem.adjustedTenderUnitPrice != "") {
            AdjustedTenderUnitPrice = rowItem.adjustedTenderUnitPrice;
          }

          // if (rowItem.adjustedTenderUnitPrice_not_rounded == "" || rowItem.adjustedTenderUnitPrice_not_rounded == 0.0) {
          //    rowItem.adjustedTenderUnitPrice_not_rounded = AdjustedTenderUnitPrice
          // }

          //start_new_equations
          let currencyConversion = this.changeAmountCurrency(this.tenderCalculationSheetCode,rowItem.currencyCode,1);

          if (rowItem.suggestedPrice_WO_VAT_SelectedCurrency && rowItem.suggestedPrice_WO_VAT_SelectedCurrency != "") {
             if(columnName == "suggestedQuotedPrice_WO_VAT"){
              rowItem.suggestedPrice_WO_VAT_SelectedCurrency=parseFloat(rowItem.suggestedQuotedPrice_WO_VAT/currencyConversion).toFixed(3);
             }
             SuggestedQuotedPrice_WO_VAT = rowItem.suggestedPrice_WO_VAT_SelectedCurrency;
          }
          else{
              if(columnName == "suggestedQuotedPrice_WO_VAT"){
                  rowItem.suggestedPrice_WO_VAT_SelectedCurrency =parseFloat(rowItem.suggestedQuotedPrice_WO_VAT/currencyConversion).toFixed(3);
                  SuggestedQuotedPrice_WO_VAT =rowItem.suggestedPrice_WO_VAT_SelectedCurrency;
              }
          }

          
          // if (rowItem.suggestedQuotedPrice_WO_VAT_not_rounded == "" || rowItem.suggestedQuotedPrice_WO_VAT_not_rounded == 0.0) {
          //    rowItem.suggestedQuotedPrice_WO_VAT_not_rounded = SuggestedQuotedPrice_WO_VAT
          // }

          if (rowItem.factor && rowItem.factor != "") {
            Factor = rowItem.factor;
          }
          
          // if (rowItem.factor_not_rounded == "" || rowItem.factor_not_rounded == 0.0) {
          //    rowItem.factor_not_rounded = Factor
          // }
          if (rowItem.sE_CostPerContainer && rowItem.sE_CostPerContainer != "" && rowItem.sE_EachContainer && rowItem.sE_EachContainer != ""&& rowItem.sE_EachPallet && rowItem.sE_EachPallet != "") { 

              rowItem.shippingExpenses =  parseFloat((rowItem.sE_CostPerContainer /(rowItem.sE_EachContainer *   rowItem.sE_EachPallet))).toFixed(3); // seif MSS-108
          }

          if (rowItem.shippingExpenses && rowItem.shippingExpenses != "") { //seif108
            ShippingExpenses = rowItem.shippingExpenses;
          }
          // if (rowItem.shippingExpenses_not_rounded == "" || rowItem.shippingExpenses_not_rounded == 0.0) {
          //    rowItem.shippingExpenses_not_rounded = ShippingExpenses
          // }

          if (rowItem.foC_Value && rowItem.foC_Value != "") {
            fOCValue = rowItem.foC_Value;
          }

          if (rowItem.foB_MSS_Unit && rowItem.foB_MSS_Unit != "") {
            fOBMSSUnit = rowItem.foB_MSS_Unit;
          }

          

          if (rowItem.tenderQuantity && rowItem.tenderQuantity != "") {
             TenderQty = rowItem.tenderQuantity;
          }

          if (rowItem.cifValueInTheSelectedCurrency && rowItem.cifValueInTheSelectedCurrency != "") {
             CIF = rowItem.cifValueInTheSelectedCurrency;
          }
          
          rowItem.ciF_not_rounded = CIF            
          rowItem.factor_not_rounded = Factor
          rowItem.shippingExpenses_not_rounded = ShippingExpenses
          rowItem.suggestedQuotedPrice_WO_VAT_not_rounded = SuggestedQuotedPrice_WO_VAT


          // if (rowItem.ciF_not_rounded == "" || rowItem.ciF_not_rounded == 0.0) {
          //    rowItem.ciF_not_rounded = CIF
          // }

        
          
          if(rowItem.shippingExpenseType == true){
              //value
              ShippingExpenses = parseFloat(rowItem.shippingExpenses)
              ShippingExpenses =  Number.isNaN(ShippingExpenses) ? 0.0 :ShippingExpenses
          }else{
              //percentage
              ShippingExpenses = parseFloat(fOBMSSUnit) * (parseFloat(rowItem.shippingExpenses)/100)
              ShippingExpenses =  Number.isNaN(ShippingExpenses) ? 0.0 :ShippingExpenses
              // rowItem.shippingExpenses = ShippingExpenses
          }
          var tenderUnit = TenderUnitM == -1 ? Number(MSSUnit) : Number(TenderUnit);
          if(MSSUnit != 0.0){
              var ms_qty = ((parseFloat(TenderQty) * parseFloat(tenderUnit)) / parseFloat(MSSUnit))//.toFixed(3).slice(0,-1);
              rowItem.msS_Quantity = ms_qty
              rowItem.msS_Quantity = Number.isNaN(rowItem.msS_Quantity) ? 0.0 : rowItem.msS_Quantity;
          }

          // CIF: 1
          // On hand: 2
          // FOB: 3
          var calculatedCIF;
          if(rowItem.costTypeCode == 3){
              if(fOCValue != 0.0){
                  calculatedCIF = (parseFloat(fOBMSSUnit) / parseFloat(fOCValue)) + parseFloat(ShippingExpenses);
                  CIF =  parseFloat(calculatedCIF)//.toFixed(4).slice(0,-1); 
                  CIF_EXCHANGE = parseFloat(CIF) * currencyConversion;
                  CIF_EXCHANGE = parseFloat(CIF_EXCHANGE)//.toFixed(4).slice(0,-1);
                  rowItem.cifValueInTheSelectedCurrency = parseFloat(CIF).toFixed(3)
                  rowItem.cif = parseFloat(CIF_EXCHANGE).toFixed(3);
                  rowItem.ciF_not_rounded = parseFloat(CIF_EXCHANGE)
                  SuggestedQuotedPrice_WO_VAT_EXCHANGE = parseFloat(SuggestedQuotedPrice_WO_VAT) * currencyConversion;
                  SuggestedQuotedPrice_WO_VAT_EXCHANGE = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE)
                  rowItem.suggestedQuotedPrice_WO_VAT = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE).toFixed(3)
                  rowItem.suggestedQuotedPrice_WO_VAT_not_rounded = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE)
                  
                  if(Factor != 0.0){
                      SuggestedQuotedPrice_WO_VAT_EXCHANGE = (parseFloat(CIF_EXCHANGE) / parseFloat(Factor))///.toFixed(2).slice(0,-1)
                      SuggestedQuotedPrice_WO_VAT_EXCHANGE =  Number.isNaN(SuggestedQuotedPrice_WO_VAT_EXCHANGE) ? 0.0 :SuggestedQuotedPrice_WO_VAT_EXCHANGE
                      SuggestedQuotedPrice_WO_VAT = (parseFloat(CIF) / parseFloat(Factor))///.toFixed(2).slice(0,-1)
                      SuggestedQuotedPrice_WO_VAT =  Number.isNaN(SuggestedQuotedPrice_WO_VAT) ? 0.0 :SuggestedQuotedPrice_WO_VAT
                      rowItem.suggestedQuotedPrice_WO_VAT = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE).toFixed(3);
                      rowItem.suggestedQuotedPrice_WO_VAT_not_rounded = SuggestedQuotedPrice_WO_VAT_EXCHANGE;
                      rowItem.suggestedPrice_WO_VAT_SelectedCurrency = parseFloat(SuggestedQuotedPrice_WO_VAT).toFixed(3);
                      SuggestedQuotedPrice_WO_VAT_EXCHANGE =  rowItem.suggestedQuotedPrice_WO_VAT;
                  }
                  else if(SuggestedQuotedPrice_WO_VAT != 0.0){
                      SuggestedQuotedPrice_WO_VAT_EXCHANGE = parseFloat(SuggestedQuotedPrice_WO_VAT) * currencyConversion;
                      SuggestedQuotedPrice_WO_VAT_EXCHANGE = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE)
                      rowItem.suggestedQuotedPrice_WO_VAT = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE).toFixed(3)
                      rowItem.suggestedQuotedPrice_WO_VAT_not_rounded = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE)
                      Factor = (parseFloat(CIF_EXCHANGE) / parseFloat(rowItem.suggestedQuotedPrice_WO_VAT_not_rounded))//.toFixed(3).slice(0,-1)
                      Factor =  Number.isNaN(Factor) ? 0.0 :Factor
                      // rowItem.factor = parseFloat(Factor).toFixed(3);
                      rowItem.factor = Factor;
                      rowItem.factor_not_rounded = Factor;
                  }
              }else{                        
                  fOCValue = 1;
                  calculatedCIF = (parseFloat(fOBMSSUnit) / parseFloat(fOCValue)) + parseFloat(ShippingExpenses);
                  CIF =  parseFloat(calculatedCIF)//.toFixed(4).slice(0,-1); 
                  CIF_EXCHANGE = parseFloat(CIF) * currencyConversion;
                  CIF_EXCHANGE = parseFloat(CIF_EXCHANGE)//.toFixed(4).slice(0,-1);
                  rowItem.cifValueInTheSelectedCurrency = parseFloat(CIF).toFixed(3)
                  rowItem.cif = parseFloat(CIF_EXCHANGE).toFixed(3);
                  rowItem.ciF_not_rounded = parseFloat(CIF_EXCHANGE);
                  //rowItem.suggestedQuotedPrice_WO_VAT = SuggestedQuotedPrice_WO_VAT;
                  SuggestedQuotedPrice_WO_VAT_EXCHANGE = parseFloat(SuggestedQuotedPrice_WO_VAT) * currencyConversion;
                  SuggestedQuotedPrice_WO_VAT_EXCHANGE = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE)
                  rowItem.suggestedQuotedPrice_WO_VAT = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE).toFixed(3)
                  rowItem.suggestedQuotedPrice_WO_VAT_not_rounded = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE)
                  if(Factor != 0.0){
                      SuggestedQuotedPrice_WO_VAT = (parseFloat(CIF) / parseFloat(Factor))//.toFixed(2).slice(0,-1)
                      SuggestedQuotedPrice_WO_VAT_EXCHANGE = (parseFloat(CIF_EXCHANGE) / parseFloat(Factor))//.toFixed(2).slice(0,-1)
                      rowItem.suggestedQuotedPrice_WO_VAT = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE).toFixed(3);
                      rowItem.suggestedPrice_WO_VAT_SelectedCurrency = parseFloat(SuggestedQuotedPrice_WO_VAT).toFixed(3);
                      rowItem.suggestedQuotedPrice_WO_VAT_not_rounded = SuggestedQuotedPrice_WO_VAT_EXCHANGE;
                  }
                  else if(SuggestedQuotedPrice_WO_VAT != 0.0){
                      SuggestedQuotedPrice_WO_VAT_EXCHANGE = parseFloat(SuggestedQuotedPrice_WO_VAT) * currencyConversion;
                      SuggestedQuotedPrice_WO_VAT_EXCHANGE = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE)
                      rowItem.suggestedQuotedPrice_WO_VAT = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE).toFixed(3)
                      rowItem.suggestedQuotedPrice_WO_VAT_not_rounded = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE)
                      Factor = (parseFloat(CIF_EXCHANGE) / parseFloat(rowItem.suggestedQuotedPrice_WO_VAT_not_rounded))//.toFixed(3).slice(0,-1)
                      Factor =  Number.isNaN(Factor) ? 0.0 :Factor
                      rowItem.factor = Factor //parseFloat(Factor).toFixed(3);
                      rowItem.factor_not_rounded = Factor;
                  }
              }
          }
       
          if(rowItem.costTypeCode == 1){
                  calculatedCIF = parseFloat(CIF)
                  CIF =  parseFloat(calculatedCIF)//.toFixed(4).slice(0,-1); 
                  CIF_EXCHANGE = parseFloat(CIF) * currencyConversion;
                  CIF_EXCHANGE = parseFloat(CIF_EXCHANGE)//.toFixed(4).slice(0,-1);
                  rowItem.cif = parseFloat(CIF_EXCHANGE).toFixed(3)
                  rowItem.ciF_not_rounded = parseFloat(CIF_EXCHANGE)
                  SuggestedQuotedPrice_WO_VAT_EXCHANGE = parseFloat(SuggestedQuotedPrice_WO_VAT) * currencyConversion;
                  SuggestedQuotedPrice_WO_VAT_EXCHANGE = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE)
                  rowItem.suggestedQuotedPrice_WO_VAT = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE).toFixed(3)
                  rowItem.suggestedQuotedPrice_WO_VAT_not_rounded = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE)
                      // SuggestedQuotedPrice_WO_VAT = (parseFloat(CIF_EXCHANGE) / parseFloat(Factor))//.toFixed(2).slice(0,-1)
                  if(Factor != 0.0 && CIF_EXCHANGE != 0.0 && SuggestedQuotedPrice_WO_VAT==0.0){
                      SuggestedQuotedPrice_WO_VAT = (parseFloat(CIF) / parseFloat(Factor))//.toFixed(2).slice(0,-1)
                      SuggestedQuotedPrice_WO_VAT_EXCHANGE = (parseFloat(CIF_EXCHANGE) / parseFloat(Factor))
                      rowItem.suggestedPrice_WO_VAT_SelectedCurrency = parseFloat(SuggestedQuotedPrice_WO_VAT).toFixed(3);
                      rowItem.suggestedQuotedPrice_WO_VAT = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE).toFixed(3);
                      rowItem.suggestedQuotedPrice_WO_VAT_not_rounded = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE);
                      rowItem.itemToCalculate = this.$store.getters.getCalculatedItem.suggestedQuotedPrice
                  }
                  else if(SuggestedQuotedPrice_WO_VAT != 0.0 && CIF_EXCHANGE != 0.0 && Factor==0.0){
                      Factor = (parseFloat(CIF_EXCHANGE) / parseFloat(rowItem.suggestedQuotedPrice_WO_VAT_not_rounded))//.toFixed(3).slice(0,-1)
                      rowItem.factor = Factor //parseFloat(Factor).toFixed(3);
                      rowItem.factor_not_rounded = Factor;
                      rowItem.itemToCalculate = this.$store.getters.getCalculatedItem.factor
                  }
                  else if(Factor != 0.0 && SuggestedQuotedPrice_WO_VAT != 0.0 && CIF_EXCHANGE==0.0){
                      CIF = (parseFloat(Factor) * parseFloat(SuggestedQuotedPrice_WO_VAT))//.toFixed(3).slice(0,-1)
                      CIF_EXCHANGE = (parseFloat(Factor) * parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE))
                      CIF_EXCHANGE = parseFloat(CIF_EXCHANGE)//.toFixed(4).slice(0,-1);
                      rowItem.cifValueInTheSelectedCurrency = parseFloat(CIF).toFixed(3)
                      rowItem.cif = parseFloat(CIF_EXCHANGE).toFixed(3)
                      rowItem.ciF_not_rounded = CIF_EXCHANGE
                      rowItem.itemToCalculate = this.$store.getters.getCalculatedItem.cif
                  }

          }

          if(rowItem.costTypeCode == 2){ 
              calculatedCIF = parseFloat(CIF)
              CIF =  parseFloat(calculatedCIF)//.toFixed(4).slice(0,-1); 
              CIF_EXCHANGE = parseFloat(CIF) * currencyConversion;
              CIF_EXCHANGE = parseFloat(CIF_EXCHANGE)//.toFixed(4).slice(0,-1);
              rowItem.cif = parseFloat(CIF_EXCHANGE).toFixed(3)
              rowItem.ciF_not_rounded = parseFloat(CIF_EXCHANGE)
              SuggestedQuotedPrice_WO_VAT_EXCHANGE = parseFloat(SuggestedQuotedPrice_WO_VAT) * currencyConversion;
              SuggestedQuotedPrice_WO_VAT_EXCHANGE = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE)
              rowItem.suggestedQuotedPrice_WO_VAT = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE).toFixed(3)
              rowItem.suggestedQuotedPrice_WO_VAT_not_rounded = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE)
              if(Factor != 0.0 && CIF_EXCHANGE != 0.0){
                  SuggestedQuotedPrice_WO_VAT = (parseFloat(CIF) / parseFloat(Factor))//.toFixed(2).slice(0,-1)
                  SuggestedQuotedPrice_WO_VAT_EXCHANGE = (parseFloat(CIF_EXCHANGE) / parseFloat(Factor))
                  rowItem.suggestedPrice_WO_VAT_SelectedCurrency = parseFloat(SuggestedQuotedPrice_WO_VAT).toFixed(3);
                  rowItem.suggestedQuotedPrice_WO_VAT = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE).toFixed(3);
                  rowItem.suggestedQuotedPrice_WO_VAT_not_rounded = parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE);
                  rowItem.itemToCalculate = this.$store.getters.getCalculatedItem.suggestedQuotedPrice
              }
              else if(SuggestedQuotedPrice_WO_VAT != 0.0 && CIF_EXCHANGE != 0.0){
                  Factor = (parseFloat(CIF_EXCHANGE) / parseFloat(rowItem.suggestedQuotedPrice_WO_VAT_not_rounded))//.toFixed(3).slice(0,-1)
                  rowItem.factor = Factor //parseFloat(Factor).toFixed(3);
                  rowItem.factor_not_rounded = Factor;
                  rowItem.itemToCalculate = this.$store.getters.getCalculatedItem.factor
              }
              else if(Factor != 0.0 && SuggestedQuotedPrice_WO_VAT != 0.0){
                  CIF = (parseFloat(Factor) * parseFloat(SuggestedQuotedPrice_WO_VAT))//.toFixed(3).slice(0,-1)
                  CIF_EXCHANGE = (parseFloat(Factor) * parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE))
                  CIF_EXCHANGE = parseFloat(CIF_EXCHANGE)//.toFixed(4).slice(0,-1);
                  rowItem.cifValueInTheSelectedCurrency = parseFloat(CIF).toFixed(3)
                  rowItem.cif = parseFloat(CIF_EXCHANGE).toFixed(3)
                  rowItem.ciF_not_rounded = CIF_EXCHANGE
                  rowItem.itemToCalculate = this.$store.getters.getCalculatedItem.cif
              }
          }
          
          SUGGESTION_EXCHANGE =  parseFloat(SuggestedQuotedPrice_WO_VAT_EXCHANGE)

          if(rowItem.msS_Quantity != 0.0){
             rowItem.total_WO_VAT = (parseFloat(SUGGESTION_EXCHANGE) * parseFloat(rowItem.msS_Quantity)).toFixed(3)//.slice(0,-1)
             rowItem.total_WO_VAT_not_rounded = (parseFloat(SUGGESTION_EXCHANGE) * parseFloat(rowItem.msS_Quantity));
          }
          else{
              rowItem.total_WO_VAT = 0.0
              rowItem.total_WO_VAT_not_rounded = 0.0
          }

           if(rowItem.suggestedQuotedPrice_WO_VAT != 0.0){

              rowItem.profitPercentage_not_rounded=
              ((parseFloat(rowItem.suggestedQuotedPrice_WO_VAT) -  parseFloat(rowItem.ciF_not_rounded))/parseFloat(rowItem.suggestedQuotedPrice_WO_VAT)); 
              rowItem.profitPercentage =(rowItem.profitPercentage_not_rounded).toFixed(3);
              rowItem.profitAmount_not_rounded =  rowItem.profitPercentage * parseFloat(rowItem.suggestedQuotedPrice_WO_VAT) * parseFloat(rowItem.msS_Quantity);
              rowItem.profitAmount = (rowItem.profitAmount_not_rounded).toFixed(3);
              

          }
          else{
              rowItem.profitAmount = 0.0
              rowItem.profitAmount_not_rounded = 0.0

              rowItem.profitPercentage = 0.0
              rowItem.profitPercentage_not_rounded = 0.0
          }

          if(MSSUnit != 0.0){
              if (this.isVat == true && this.VAT > 0) {
                  rowItem.tenderUnitPrice = ((parseFloat(SUGGESTION_EXCHANGE)/parseFloat(MSSUnit)) * parseFloat(tenderUnit) * (1 + parseFloat(this.VAT / 100))/*.toFixed(3).slice(0,-1)*/).toFixed(3)//.slice(0,-1);
                  rowItem.tenderUnitPrice_not_rounded = ((parseFloat(SUGGESTION_EXCHANGE)/parseFloat(MSSUnit)) * parseFloat(tenderUnit) * (1 + parseFloat(this.VAT / 100))/*.toFixed(3).slice(0,-1)*/)//.toFixed(3).slice(0,-1);
              }
              else{
                  rowItem.tenderUnitPrice = ((parseFloat(SUGGESTION_EXCHANGE)/parseFloat(MSSUnit))*parseFloat(tenderUnit)).toFixed(3)//.slice(0,-1);
                  rowItem.tenderUnitPrice_not_rounded = ((parseFloat(SUGGESTION_EXCHANGE)/parseFloat(MSSUnit))*parseFloat(tenderUnit))//.toFixed(3).slice(0,-1);
              }
          }
         else{
              rowItem.tenderUnitPrice = 0.0;
              rowItem.tenderUnitPrice_not_rounded = 0.0;
         }

          rowItem.adjustedTenderUnitPrice =  parseFloat(rowItem.tenderUnitPrice_not_rounded).toFixed(3);
          rowItem.adjustedTenderUnitPrice_not_rounded =  parseFloat(rowItem.tenderUnitPrice_not_rounded)//.toFixed(2);
          AdjustedTenderUnitPrice = rowItem.adjustedTenderUnitPrice;
          rowItem.totalQuotationPrice_not_rounded = (parseFloat(AdjustedTenderUnitPrice) * parseFloat(TenderQty).toFixed(3))//.toFixed(3).slice(0,-1);
          rowItem.totalQuotationPrice = parseFloat(rowItem.totalQuotationPrice_not_rounded).toFixed(3)//.slice(0,-1);

          if(rowItem.cif != ''){
               rowItem.cif = Number.isNaN(rowItem.ciF_not_rounded) ? 0.0 : parseFloat(rowItem.ciF_not_rounded).toFixed(3)//.slice(0,-1);
               rowItem.ciF_not_rounded = Number.isNaN(rowItem.ciF_not_rounded) ? 0.0 : parseFloat(rowItem.ciF_not_rounded)//.toFixed(4).slice(0,-1);
          }

          // this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
      },
      // calculatoionDiscount(rowItem, itemIndex) {
          // var costWithDiscount = 0.0;
          // var discount1 = 0.0;
          // var discount2 = 0.0;


          // if (rowItem.discount1 != "") {
          //   discount1 = rowItem.discount1;
          // }

          // if (rowItem.discount2 != "") {
          //   discount2 = rowItem.discount2;
          // }

          // if (discount1 != 0.0 && discount2 == 0.0) {
          //     rowItem.discount1 = this.valueAfterRegex(rowItem.discount1);

          //     if (rowItem.cost) {
          //         costWithDiscount = (
          //             parseFloat(rowItem.cost) *
          //             (1 - parseFloat(discount1) / 100)
          //         ).toFixed(3).slice(0,-1);
          //     }
          // }

          // if (rowItem.discount2 != "") {
          //     rowItem.discount2 = this.valueAfterRegex(rowItem.discount2);
          // }

          // if (discount1 != 0.0 && discount2 != 0.0) {
          //     if (rowItem.cost) {
          //         let costWithDiscount1 = (
          //             parseFloat(rowItem.cost) *
          //             (1 - parseFloat(discount1) / 100)
          //         ).toFixed(3).slice(0,-1);
          //         costWithDiscount = (
          //             parseFloat(costWithDiscount1) *
          //             (1 - parseFloat(discount2) / 100)
          //         ).toFixed(3).slice(0,-1);
          //     }
          // }

          // return costWithDiscount;
      // },
      valueAfterRegex(val) {
          var reg = new RegExp("^[0-9]+(.[0-9]{1,2})?$");
          if (!reg.test(val)) {
              return parseFloat(val).toFixed(3).slice(0,-1);
          } else {
              return val;
          }
      },
      // calculatorGrossMarginItemChange(rowItem, itemIndex) {
      //     this.calculatorMainItemChange(rowItem);
      // },
      calculatorShipmentMarginItemChange(rowItem) {
          this.calculatorMainItemChange(rowItem);
      },
      reEquation(key,row){
          if(row.costTypeCode == 1){
              if(key == 'cif' && row.suggestedPrice_WO_VAT_SelectedCurrency != '' && row.factor != ''){
                  row.suggestedQuotedPrice_WO_VAT = ''
                  row.suggestedPrice_WO_VAT_SelectedCurrency = ''
                  // row.factor = ''
              }
              if(key == 'factor' && row.cifValueInTheSelectedCurrency != '' && row.suggestedPrice_WO_VAT_SelectedCurrency != ''){
                  row.cifPlaceHolder=row.cifValueInTheSelectedCurrency
                  row.cif = ''
                  row.cifValueInTheSelectedCurrency = ''
                  row.suggestedQuotedPrice_WO_VATPlaceHolder=row.suggestedPrice_WO_VAT_SelectedCurrency
                  row.suggestedQuotedPrice_WO_VAT = ''
                  row.suggestedPrice_WO_VAT_SelectedCurrency = ''
              }
              if(key == 'suggested' && row.cifValueInTheSelectedCurrency != '' && row.factor != ''){
                  row.cif = ''
                  row.cifValueInTheSelectedCurrency = ''
                  // row.factor = ''
              }
          }
          if(row.costTypeCode == 2){
              if(key == 'cif' && row.cifValueInTheSelectedCurrency == '' && row.suggestedPrice_WO_VAT_SelectedCurrency != '' && row.factor != ''){
                  row.suggestedQuotedPrice_WO_VAT = ''
                  row.suggestedPrice_WO_VAT_SelectedCurrency = ''
                  row.cif = ''
                  row.cifValueInTheSelectedCurrency = ''
                  row.factor = ''
              }
              if(key == 'suggested' && row.cifValueInTheSelectedCurrency != ''  && row.suggestedPrice_WO_VAT_SelectedCurrency == '' && row.factor != ''){
                  row.cif = ''
                  row.cifValueInTheSelectedCurrency = ''
                  row.suggestedQuotedPrice_WO_VAT = ''
                  row.suggestedPrice_WO_VAT_SelectedCurrency = ''
                  row.factor = ''
              }
          }
          if(row.costTypeCode == 3){
              if(key == 'factor' && row.cifValueInTheSelectedCurrency != '' && row.suggestedPrice_WO_VAT_SelectedCurrency != ''){
                  // row.factor = ''
                  row.suggestedQuotedPrice_WO_VAT = ''
                  row.suggestedPrice_WO_VAT_SelectedCurrency = ''
              }
              if(key == 'suggested' && row.cifValueInTheSelectedCurrency != '' && row.factor != ''){
                  // row.suggestedQuotedPrice_WO_VAT = ''
                  // row.suggestedPrice_WO_VAT_SelectedCurrency = ''
                  row.factor = ''
              }
          }
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
          this.currenciesList.forEach(function(val) {
              if (val.code == currency) {
                  currencyVal = val.manualRate//? val.manualRate: val.value;
              }
          });
          return currencyVal;
      },
      geTtenderCalculationSheetData: function() {
          var urlStr =
              this.$store.getters.serverURI +
              "api/TenderCalculationSheet/GetBasicInfoDetail/" +
              this.calSheetId;
          this.$http
              .get(urlStr, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                  function(data) {
                      this.BasicInfoObj = data.body;
                      if (this.BasicInfoObj.submissionDate) {
                          this.BasicInfoObj.submissionDate = moment(
                              data.body.submissionDate
                          ).format("YYYY-MM-DD");
                      }

                      this.tenderCalculationSheetCode = data.body.tenderCurrencyCode;
                      this.calcuationSheetRates = data.body.tenderCalculationSheetCurrencyRate;
                      // this.tenderCalculationSheetCode = data.body.
                      this.isVat = this.BasicInfoObj.isVat;
                      this.VAT = this.BasicInfoObj.vatValue;

                      if(this.BasicInfoObj && this.BasicInfoObj.status != this.$store.getters.getSheetStatus.New){
                          this.getCurrentStep();
                      }
                      if (this.calSheetId) {// it should be called here as the calculations depend on data in getCalculationSheetData, abdalhadi.
                          this.FillData();
                      }
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
      FillCostTypeList: function() {
          var urlStr =
              this.$store.getters.serverURI +
              "api/lookup/GetCostTypeForTender";
          this.$http
              .get(urlStr, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                  function(data) {
                      this.costTypeList = data.body;
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
      FillItemsList: function() {
          var urlStr = this.$store.getters.serverURI + "api/item/GetAllItems";
          this.$http
              .get(urlStr, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                  function(data) {
                      this.systemItemsList = data.body;
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
      FillData: function() {
          this.fullscreenLoading = true;
          var urlStr =
              this.$store.getters.serverURI +
              "api/TenderCalculationSheet/GetMainGroup/" +
              this.calSheetId;
          this.$http
              .get(urlStr, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                  function(data) {
                      this.mainGroupPrevCount = data.body.tenderCalculationSheetMainGroup ? data.body.tenderCalculationSheetMainGroup.length : 0;
                    
                      this.bankBlockViewModel.bankGuaranteeValidTill = data.body.bankGuaranteeValidTill;
                    

                  //   Total_Quotation_Price_With_VAT:0.0,
                  //   Total_Quoted_Price_WO_VAT:0.0,
                  //   Total_Profit_Percentage:0.0,
                  //   Total_Profit_Amount:0.0,
                      this.bankBlockViewModel = data.body.bankBlockViewModel;

                      this.bankBlockViewModel.total_Profit_Amount = data.body.bankBlockViewModel.total_Profit_Amount;
                      this.bankBlockViewModel.total_Profit_Percentage = data.body.bankBlockViewModel.total_Profit_Percentage;
                      this.bankBlockViewModel.total_Quoted_Price_WO_VAT = data.body.bankBlockViewModel.total_Quoted_Price_WO_VAT;
                      this.bankBlockViewModel.total_Quotation_Price_With_VAT = data.body.bankBlockViewModel.total_Quotation_Price_With_VAT;
                      this.bankBlockViewModel.bankGranteeInCaseOfPercentage = data.body.bankBlockViewModel.bankGranteeInCaseOfPercentage;
                      this.bankBlockViewModel.currencyCode = data.body.bankBlockViewModel.currencyCode

                      if (data.body.tenderCalculationSheetMainGroup.length) {
                          this.tenderCalculationSheetGroups = data.body.tenderCalculationSheetMainGroup;
                          this.tenderCalculationSheetGroups.forEach(element => {
                              this.groupsCount.push(element.tenderCalculationSheetItem.length)
                          });
                          this.tenderCalculationSheetGroups.forEach(_element => {
                              if(_element.tenderCalculationSheetItem.length > 0 ){
                                  _element.tenderCalculationSheetItem.forEach((element)=>{
                                      element.selectedCountryofOriginIds = element.countryofOriginIds;
                                  });
                              }
                              if(_element.tenderCalculationSheetAlternativeGroup.length > 0){
                                   _element.tenderCalculationSheetAlternativeGroup.forEach((element)=>{
                                      element.selectedCountryofOriginIds = element.countryofOriginIds;
                                  });
                              }
                          //    if(element.tenderCalculationSheetItem.length > 0 ){
                          //         element.tenderCalculationSheetItem.forEach((element)=>{
                          //             row.selectedCountryofOriginIds = row.countryofOriginIds;
                          //         });
                          //     }
                          });
                      }

                      this.totalAmountIndex = 0;
                      this.totalAlternativeAmountIndex = 0;
                      this.totalOptionalAmountIndex = 0;
                      this.fullscreenLoading = false;
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
      fillCountryList: function() {
          var urlStr =
              this.$store.getters.serverURI +
              "api/lookup/GetByType/" +
              this.$store.getters.getLookupCategory.country;
          this.$http
              .get(urlStr, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                  function(data) {
                      this.countryList = data.body;
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
      addNewMainSheetItem(index) {
          this.totalAmountIndex = index;
          this.tenderCalculationSheetGroups[index].tenderCalculationSheetItem.push({
              name: "",
              vendor: "",
              fromERB:null,
              quantity: "",
              onHandPrice: "",
              onHandPriceCurrency:"",
              onHandPriceCurrencySymbol:"",
              onHandQuantity: "",
              cost: "",
              costType: 14,
              discount1: "",
              discount2: "",
              currencyCode: this.tenderCalculationSheetCode,
              currencySymbol:this.currenciesList.filter(x=>x.code==this.tenderCalculationSheetCode)[0].currencySymbol,
              shipment: "",
              landedCost: "",
              grossMargin: "",
              unitPrice: "",
              amount: "",
              grossMarginValue: "",
              note: " ",
              approve: false,
              //----------------
              shelfLife:"",
              countryOfOrigin: "",
              tenderUnitM: -1,
              tenderUnit: "",
              msS_Unit: "1",
              tenderUnitValue: "",
              mssUnitValue:"",
              tenderQuantity: "",
              msS_Quantity: "",
              lastWinningPrice_WO_VAT : 0.0,
              total_WO_VAT: "",
              foB_MSS_Unit:"",
              foB_MSS: "",
              foC_Value: "1",
              shippingExpenses: "",
              sE_CostPerContainer:"",
              sE_EachContainer:"",
              sE_EachPallet:"",
              foc: false,
              cif: "",
              cifPlaceHolder:"",
              cifValueInTheSelectedCurrency:"",
              exchangeRate: "",
              profitPercentage: "",
              profitAmount: "",
              tenderUnitPrice: "",
              adjustedTenderUnitPrice: "",
              totalQuotationPrice: "",
              factor: "",
              suggestedQuotedPrice_WO_VAT:"",
              suggestedQuotedPrice_WO_VATPlaceHolder:"",
              suggestedPrice_WO_VAT_SelectedCurrency:"",
              regularPrice:"",
              winningProbability:false,
              costTypeCode: 1,
              shippingExpenseType: true,
              itemToCalculate:"",

              // not rounded
              ciF_not_rounded:"",
              factor_not_rounded:"",
              shippingExpenses_not_rounded:"",
              suggestedQuotedPrice_WO_VAT_not_rounded:"", 
              totalQuotationPrice_not_rounded:"",
              total_WO_VAT_not_rounded:"",
              adjustedTenderUnitPrice_not_rounded:"",
              tenderUnitPrice_not_rounded:"",
              profitPercentage_not_rounded:"",
              profitAmount_not_rounded:"",
          });
          //this.tenderCalculationSheetGroups[index].totalAmount = 0.0;
      },
      addNewOptionalGroup(index) {
          this.totalAmountIndex = index;

          this.tenderCalculationSheetGroups[index].tenderCalculationSheetOptionalGroup = {
              name: "",
              totalAmount: "",
              tenderCalculationSheetMainGroupId: this.tenderCalculationSheetGroups[index].id ?
                  this.tenderCalculationSheetGroups[index].id :
                  "",
              tenderCalculationSheetItem: [{
                  name: "",
                  vendor: "",
                  fromERB:null,
                  quantity: "",
                  onHandPrice: "",
                  onHandPriceCurrency:"",
                  onHandPriceCurrencySymbol:"",
                  onHandQuantity: "",
                  cost: "",
                  costType: 14,
                  discount1: "",
                  discount2: "",
                  currencyCode: this.tenderCalculationSheetCode,
                  currencySymbol:this.currenciesList.filter(x=>x.code==this.tenderCalculationSheetCode)[0].currencySymbol,
                  shipment: "",
                  landedCost: "",
                  grossMargin: "",
                  unitPrice: "",
                  amount: "",
                  grossMarginValue: "",
                  note: " ",
                  approve: false,
                  //-
                  shelfLife:"",
                  countryOfOrigin: "",
                  tenderUnitM: -1,
                  tenderUnit: "",
                  msS_Unit: "1",
                  tenderUnitValue: "",
                  mssUnitValue:"",
                  tenderQuantity: "",
                  msS_Quantity: "",
                  lastWinningPrice_WO_VAT : 0.0,
                  total_WO_VAT: "",
                  foB_MSS_Unit:"",
                  foB_MSS: "",
                  foC_Value: "1",
                  shippingExpenses: "",
                  sE_CostPerContainer:"",
                  sE_EachContainer:"",
                  sE_EachPallet:"",

                  foc: false,
                  cif: "",
                  cifPlaceHolder:"",
                  cifValueInTheSelectedCurrency:"",
                  exchangeRate: "",
                  profitPercentage: "",
                  profitAmount: "",
                  tenderUnitPrice: "",
                  adjustedTenderUnitPrice: "",
                  totalQuotationPrice: "",
                  factor: "",
                  suggestedQuotedPrice_WO_VAT:"",
                  suggestedQuotedPrice_WO_VATPlaceHolder:"",
                  suggestedPrice_WO_VAT_SelectedCurrency:"",
                  regularPrice:"",
                  winningProbability:false,
                  costTypeCode: 1,
                  shippingExpenseType: true,
                  itemToCalculate:"",

                  ciF_not_rounded:"",
                  factor_not_rounded:"",
                  shippingExpenses_not_rounded:"",
                  suggestedQuotedPrice_WO_VAT_not_rounded:"", 
                  totalQuotationPrice_not_rounded:"",
                  total_WO_VAT_not_rounded:"",
                  adjustedTenderUnitPrice_not_rounded:"",
                  tenderUnitPrice_not_rounded:"",
                  profitPercentage_not_rounded:"",
                  profitAmount_not_rounded:"",
              }],
              totalCost: "",
              totalProfit: "",
              groupTotalQuotationPrice: "",
              groupTotal_WO_VAT: "",
          };

          this.totalOptionalAmountIndex =
              this.tenderCalculationSheetGroups[index].tenderCalculationSheetOptionalGroup
              .length - 1;
      },
      addNewAlternativeGroup(index) {
          this.totalAmountIndex = index;
          this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup.push(
              {
              name: "",
              selected: false,
              totalAmount: "",
              totalCost: "",
              totalProfit: "",
              groupTotalQuotationPrice: "",
              groupTotal_WO_VAT: "",
              tenderCalculationSheetMainGroupId: this.tenderCalculationSheetGroups[index].id ?
                  this.tenderCalculationSheetGroups[index].id :
                  "",
              tenderCalculationSheetItem: [{
                  name: "",
                  vendor: "",
                  fromERB:null,
                  quantity: "",
                  onHandPrice: "",
                  onHandPriceCurrency:"",
                  onHandPriceCurrencySymbol:"",
                  onHandQuantity: "",
                  cost: "",
                  costType: 14,
                  discount1: "",
                  discount2: "",
                  currencyCode: this.tenderCalculationSheetCode,
                  currencySymbol:this.currenciesList.filter(x=>x.code==this.tenderCalculationSheetCode)[0].currencySymbol,
                  shipment: "",
                  landedCost: "",
                  grossMargin: "",
                  unitPrice: "",
                  amount: "",
                  grossMarginValue: "",
                  note: " ",
                  approve: false,
                  //------
                  shelfLife:"",
                  countryOfOrigin: "",
                  tenderUnitM: -1,
                  tenderUnit: "",
                  msS_Unit: "1",
                  tenderUnitValue: "",
                  mssUnitValue:"",
                  tenderQuantity: "",
                  msS_Quantity: "",
                  lastWinningPrice_WO_VAT : 0.0,
                  total_WO_VAT: "",
                  foB_MSS_Unit:"",
                  foB_MSS: "",
                  foC_Value: "1",
                  shippingExpenses: "",
                  sE_CostPerContainer:"",
                  sE_EachContainer:"",
                  sE_EachPallet:"",

                  foc: false,
                  cif: "",
                  cifPlaceHolder:"",
                  cifValueInTheSelectedCurrency:"",
                  exchangeRate: "",
                  profitPercentage: "",
                  profitAmount: "",
                  tenderUnitPrice: "",
                  adjustedTenderUnitPrice: "",
                  totalQuotationPrice: "",
                  factor: "",
                  suggestedQuotedPrice_WO_VAT:"",
                  suggestedQuotedPrice_WO_VATPlaceHolder:"",
                  suggestedPrice_WO_VAT_SelectedCurrency:"",
                  regularPrice:"",
                  winningProbability:false,
                  costTypeCode: 1,
                  shippingExpenseType: true,
                  itemToCalculate:"",

                  ciF_not_rounded:"",
                  factor_not_rounded:"",
                  shippingExpenses_not_rounded:"",
                  suggestedQuotedPrice_WO_VAT_not_rounded:"", 
                  totalQuotationPrice_not_rounded:"",
                  total_WO_VAT_not_rounded:"",
                  adjustedTenderUnitPrice_not_rounded:"",
                  tenderUnitPrice_not_rounded:"",
                  profitPercentage_not_rounded:"",
                  profitAmount_not_rounded:"",
              }],
              tenderCalculationSheetAlternativeOptionalGroup: null,
              calculationAlternativeAmount: []
          }
          );
          this.totalAlternativeAmountIndex =
              this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup
              .length - 1;
      },
      addNewAternativeOptionalGroup(index, indexOfAlternativeGroup) {
          this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[
              indexOfAlternativeGroup
          ].tenderCalculationSheetAlternativeOptionalGroup = {
              name: "",
              code: "",
              totalAmount: "",
              totalCost: "",
              totalProfit: "",
              groupTotalQuotationPrice: "",
              groupTotal_WO_VAT: "",
              tenderCalculationSheetAlternativeGroupId: this.tenderCalculationSheetGroups[index]
                  .tenderCalculationSheetAlternativeGroup.id ?
                  this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup
                  .id :
                  "",
              tenderCalculationSheetItem: [{
                  name: "",
                  vendor: "",
                  fromERB:null,
                  quantity: "",
                  onHandPrice: "",
                  onHandPriceCurrency:"",
                  onHandPriceCurrencySymbol:"",
                  onHandQuantity: "",
                  cost: "",
                  costType: 14,
                  discount1: "",
                  discount2: "",
                  currencyCode: this.tenderCalculationSheetCode,
                  currencySymbol:this.currenciesList.filter(x=>x.code==this.tenderCalculationSheetCode)[0].currencySymbol,
                  shipment: "",
                  landedCost: "",
                  grossMargin: "",
                  unitPrice: "",
                  amount: "",
                  grossMarginValue: "",
                  note: " ",
                  approve: false,
                  //---
                  shelfLife:"",
                  countryOfOrigin: "",
                  tenderUnitM: -1,
                  tenderUnit: "",
                  msS_Unit: "1",
                  tenderUnitValue: "",
                  mssUnitValue:"",
                  tenderQuantity: "",
                  msS_Quantity: "",
                  lastWinningPrice_WO_VAT : 0.0,
                  total_WO_VAT: "",
                  foB_MSS_Unit:"",
                  foB_MSS: "",
                  foC_Value: "1",
                  shippingExpenses: "",
                  sE_CostPerContainer:"",
                  sE_EachContainer:"",
                  sE_EachPallet:"",

                  foc: false,
                  cif: "",
                  cifPlaceHolder:"",
                  cifValueInTheSelectedCurrency:"",
                  exchangeRate: "",
                  profitPercentage: "",
                  profitAmount: "",
                  tenderUnitPrice: "",
                  adjustedTenderUnitPrice: "",
                  totalQuotationPrice: "",
                  factor: "",
                  suggestedQuotedPrice_WO_VAT:"",
                  suggestedQuotedPrice_WO_VATPlaceHolder:"",
                  suggestedPrice_WO_VAT_SelectedCurrency:"",
                  regularPrice:"",
                  winningProbability:false,
                  costTypeCode: 1,
                  shippingExpenseType: true,
                  itemToCalculate:"",
                  
                  ciF_not_rounded:"",
                  factor_not_rounded:"",
                  shippingExpenses_not_rounded:"",
                  suggestedQuotedPrice_WO_VAT_not_rounded:"", 
                  totalQuotationPrice_not_rounded:"",
                  total_WO_VAT_not_rounded:"",
                  adjustedTenderUnitPrice_not_rounded:"",
                  tenderUnitPrice_not_rounded:"",
                  profitPercentage_not_rounded:"",
                  profitAmount_not_rounded:"",
              }]
          };

      },
      addNewAternativeItem(index, indexOfAlternativeGroup) {

          this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[
              indexOfAlternativeGroup
          ].tenderCalculationSheetItem.push({
              name: "",
              vendor: "",
              fromERB:null,
              quantity: "",
              onHandPrice: "",
              onHandPriceCurrency:"",
              onHandPriceCurrencySymbol:"",
              onHandQuantity: "",
              cost: "",
              costType: 14,
              discount1: "",
              discount2: "",
              currencyCode: this.tenderCalculationSheetCode,
              currencySymbol:this.currenciesList.filter(x=>x.code==this.tenderCalculationSheetCode)[0].currencySymbol,
              shipment: "",
              landedCost: "",
              grossMargin: "",
              unitPrice: "",
              amount: "",
              grossMarginValue: "",
              note: " ",
              approve: false,
              //----------------
              shelfLife:"",          
              countryOfOrigin: "",
              tenderUnitM: -1,
              tenderUnit: "",
              msS_Unit: "1",
              tenderUnitValue: "",
              mssUnitValue:"",
              tenderQuantity: "",
              msS_Quantity: "",
              lastWinningPrice_WO_VAT : 0.0,
              total_WO_VAT: "",
              foB_MSS_Unit:"",
              foB_MSS: "",
              foC_Value: "1",
              shippingExpenses: "",
              sE_CostPerContainer:"",
              sE_EachContainer:"",
              sE_EachPallet:"",

              foc: false,
              cif: "",
              cifPlaceHolder:"",
              cifValueInTheSelectedCurrency:"",
              exchangeRate: "",
              profitPercentage: "",
              profitAmount: "",
              tenderUnitPrice: "",
              adjustedTenderUnitPrice: "",
              totalQuotationPrice: "",
              factor: "",
              suggestedQuotedPrice_WO_VAT:"",
              suggestedQuotedPrice_WO_VATPlaceHolder:"",
              suggestedPrice_WO_VAT_SelectedCurrency:"",
              regularPrice:"",
              winningProbability:false,
              costTypeCode: 1,
              shippingExpenseType: true,
              itemToCalculate:"",

              ciF_not_rounded:"",
              factor_not_rounded:"",
              shippingExpenses_not_rounded:"",
              suggestedQuotedPrice_WO_VAT_not_rounded:"", 
              totalQuotationPrice_not_rounded:"",
              total_WO_VAT_not_rounded:"",
              adjustedTenderUnitPrice_not_rounded:"",
              tenderUnitPrice_not_rounded:"",
              profitPercentage_not_rounded:"",
              profitAmount_not_rounded:"",
          });


      },
      addNewOptionalItem(index) {
          this.totalOptionalAmountIndex = index;
          this.tenderCalculationSheetGroups[
              index
          ].tenderCalculationSheetOptionalGroup.tenderCalculationSheetItem.push({
              name: "",
              vendor: "",
              fromERB:null,
              quantity: "",
              onHandPrice: "",
              onHandPriceCurrency:"",
              onHandPriceCurrencySymbol:"",
              onHandQuantity: "",
              cost: "",
              costType: 14,
              discount1: "",
              discount2: "",
              currencyCode: this.tenderCalculationSheetCode,
              currencySymbol:this.currenciesList.filter(x=>x.code==this.tenderCalculationSheetCode)[0].currencySymbol,
              shipment: "",
              landedCost: "",
              grossMargin: "",
              unitPrice: "",
              amount: "",
              grossMarginValue: "",
              note: " ",
              approve: false,
              //----------------
              shelfLife:"",
              countryOfOrigin: "",
              tenderUnitM: -1,
              tenderUnit: "",
              msS_Unit: "1",
              tenderUnitValue: "",
              mssUnitValue:"",
              tenderQuantity: "",
              msS_Quantity: "",
              lastWinningPrice_WO_VAT : 0.0,
              total_WO_VAT: "",
              foB_MSS_Unit:"",
              foB_MSS: "",
              foC_Value: "1",
              shippingExpenses: "",
              sE_CostPerContainer:"",
              sE_EachContainer:"",
              sE_EachPallet:"",

              foc: false,
              cif: "",
              cifPlaceHolder:"",
              cifValueInTheSelectedCurrency:"",
              exchangeRate: "",
              profitPercentage: "",
              profitAmount: "",
              tenderUnitPrice: "",
              adjustedTenderUnitPrice: "",
              totalQuotationPrice: "",
              factor: "",
              suggestedQuotedPrice_WO_VAT:"",
              suggestedQuotedPrice_WO_VATPlaceHolder:"",
              suggestedPrice_WO_VAT_SelectedCurrency:"",
              regularPrice:"",
              winningProbability:false,
              costTypeCode: 1,
              shippingExpenseType: true,
              itemToCalculate:"",

              ciF_not_rounded:"",
              factor_not_rounded:"",
              shippingExpenses_not_rounded:"",
              suggestedQuotedPrice_WO_VAT_not_rounded:"", 
              totalQuotationPrice_not_rounded:"",
              total_WO_VAT_not_rounded:"",
              adjustedTenderUnitPrice_not_rounded:"",
              tenderUnitPrice_not_rounded:"",
              profitPercentage_not_rounded:"",
              profitAmount_not_rounded:"",
          });
      },
      addNewAlternativeOptionalItem(index, alternativeGroupIndex) {
          this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[
              alternativeGroupIndex
          ].tenderCalculationSheetAlternativeOptionalGroup.tenderCalculationSheetItem.push({
              name: "",
              vendor: "",
              fromERB:null,
              quantity: "",
              onHandPrice: "",
              onHandPriceCurrency:"",
              onHandPriceCurrencySymbol:"",
              onHandQuantity: "",
              cost: "",
              costType: 14,
              discount1: "",
              discount2: "",
              currencyCode: this.tenderCalculationSheetCode,
              currencySymbol:this.currenciesList.filter(x=>x.code==this.tenderCalculationSheetCode)[0].currencySymbol,
              shipment: "",
              landedCost: "",
              grossMargin: "",
              unitPrice: "",
              amount: "",
              grossMarginValue: "",
              note: " ",
              approve: false,
              //------
              shelfLife:"",
              countryOfOrigin: "",
              tenderUnitM: -1,
              tenderUnit: "",
              msS_Unit: "1",
              tenderUnitValue: "",
              mssUnitValue:"",
              tenderQuantity: "",
              msS_Quantity: "",
              lastWinningPrice_WO_VAT : 0.0,
              total_WO_VAT: "",
              foB_MSS_Unit:"",
              foB_MSS: "",
              foC_Value: "1",
              shippingExpenses: "",
              sE_CostPerContainer:"",
              sE_EachContainer:"",
              sE_EachPallet:"",
              
              foc: false,
              cif: "",
              cifPlaceHolder:"",
              cifValueInTheSelectedCurrency:"",
              exchangeRate: "",
              profitPercentage: "",
              profitAmount: "",
              tenderUnitPrice: "",
              adjustedTenderUnitPrice: "",
              totalQuotationPrice: "",
              factor: "",
              suggestedQuotedPrice_WO_VAT:"",
              suggestedQuotedPrice_WO_VATPlaceHolder:"",
              suggestedPrice_WO_VAT_SelectedCurrency:"",
              regularPrice:"",
              winningProbability:false,
              costTypeCode: 1,
              shippingExpenseType: true,
              itemToCalculate:"",

              ciF_not_rounded:"",
              factor_not_rounded:"",
              shippingExpenses_not_rounded:"",
              suggestedQuotedPrice_WO_VAT_not_rounded:"", 
              totalQuotationPrice_not_rounded:"",
              total_WO_VAT_not_rounded:"",
              adjustedTenderUnitPrice_not_rounded:"",
              tenderUnitPrice_not_rounded:"",
              profitPercentage_not_rounded:"",
              profitAmount_not_rounded:"",
          });
      },
      removeSingleAlternativeGroup(index, alternativeGroupIndex) {
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
                  this.tenderCalculationSheetGroups[
                      index
                  ].tenderCalculationSheetAlternativeGroup.splice(alternativeGroupIndex, 1);
                  done();
              } else {
                  done();
               }
              }
          });
      },
      removeSingleOptionalGroup(index) {
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
                  this.tenderCalculationSheetGroups[index].tenderCalculationSheetOptionalGroup = null;
                  done();
              } else {
                  done();
               }
              }
          });
      },
      removeSingleAlternativeOptionalGroup(index, alternativeGroupIndex) {
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
                   this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[
              alternativeGroupIndex
          ].tenderCalculationSheetAlternativeOptionalGroup = null;
                  done();
              } else {
                  done();
               }
              }
          });
      },
      removeSingleGroup(index) {
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
                this.tenderCalculationSheetGroups.splice(index, 1);
                  done();
              } else {
                  done();
               }
              }
          });
      },
      removeCalcuationSheetMainItems(index, item) {
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
                  this.tenderCalculationSheetGroups[index].tenderCalculationSheetItem.splice(
                  this.tenderCalculationSheetGroups[index].tenderCalculationSheetItem.indexOf(item),
                  1);
                  this.totalAmount = index;
                  this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
                  done();
              } else {
                  done();
               }
              }
          });
      },
      removeAlternativeItem(index, alternativeGroupIndex, item) {
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
                            this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[
              alternativeGroupIndex
          ].tenderCalculationSheetItem.splice(
              this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[
                  alternativeGroupIndex
              ].tenderCalculationSheetItem.indexOf(item),
              1
          );
          this.totalAmountIndex = index;
          this.totalAlternativeAmountIndex = alternativeGroupIndex;
          this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
                  done();
              } else {
                  done();
               }
              }
          });
      },
      removeOptionalItem(index, item) {
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
                  this.tenderCalculationSheetGroups[
              index
          ].tenderCalculationSheetOptionalGroup.tenderCalculationSheetItem.splice(
              this.tenderCalculationSheetGroups[
                  index
              ].tenderCalculationSheetOptionalGroup.tenderCalculationSheetItem.indexOf(item),
              1
          );
                  done();
              } else {
                  done();
               }
              }
          });
      },
      removeAlternativeOptionalItem(index, alternativeGroupIndex, item) {
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
                 this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[
              alternativeGroupIndex
          ].tenderCalculationSheetAlternativeOptionalGroup.tenderCalculationSheetItem.splice(
              this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[
                  alternativeGroupIndex
              ].tenderCalculationSheetAlternativeOptionalGroup.tenderCalculationSheetItem.indexOf(
                  item
              ),
              1
          );

                  done();
              } else {
                  done();
               }
              }
          });
      },
      updateAction() {},
      saveDataAction(isPrevious) {
         this.$validator.validateAll().then(result => {
              if (result) {
                      if (this.mainGroupPrevCount) {
                          this.UpdateMainGroup();
                          if (isPrevious) {
                              this.$emit("previous-step");
                          }
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
                      "api/TenderCalculationSheet/" +
                      this.calSheetId +
                      "/MainGroup";
                  this.$http
                      .post(
                          urlStr, {
                              tenderCalculationSheetMainGroup: this.tenderCalculationSheetGroups,
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
                                  // this.geTtenderCalculationSheetData()
                              } else {
                                  this.FillData();
                                  // this.geTtenderCalculationSheetData()
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
              } 
          });
      },
      UpdateMainGroup() {
           if(this.BasicInfoObj.isVat){
              this.bankBlockViewModel.vatValue = this.VAT
          }else{
               this.bankBlockViewModel.vatValue = null
          }

          this.fullscreenLoading = true;
          var urlStr =
              this.$store.getters.serverURI +
              "api/TenderCalculationSheet/" +
              this.calSheetId +
              "/UpdateMainGroup/";
          this.$http
              .put(
                  urlStr, {
                      tenderCalculationSheetMainGroup: this.tenderCalculationSheetGroups,
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
                          message: this.$t("CalculationSheetUpdatedSuccessfully")
                      });
                      this.status = "New";
                      this.geTtenderCalculationSheetData()
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
      },
      ShowExcelSheetDialog(){
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
      ShowDialogToFetchAlternativeItemFromMainConfigs(indexOfCalculationSheetGroup) {
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
              prelistConfigs.map(function(prelistItemGroup) {
                  vm.mainConfigItems.map(function(MainConfigGroup) {
                      if (prelistItemGroup.itemGroupId == MainConfigGroup.id) {
                          optionalitems = [];
                          prelistOptionalConfig.map(function(val) {
                              if (val == MainConfigGroup.id) {
                                  MainConfigGroup.itemGroupOptionalItem.map(function(value) {
                                      var item = {
                                          name: value.itemName,
                                          code :value.itemCode,
                                          vendor: value.vendor,
                                          quantity: "",
                                          onHandPrice: value.onHandPrice,
                                          onHandPriceCurrency: value.onHandPriceCurrency,
                                          onHandPriceCurrencySymbol: value.onHandPriceCurrencySymbol,
                                          onHandQuantity: value.onHandQuantity,
                                          cost: value.onHandPrice,
                                          costType: 14,
                                          discount1: "",
                                          discount2: "",
                                          currencyCode: vm.tenderCalculationSheetCode,
                                          currencySymbol:vm.currenciesList.filter(x=>x.code==vm.tenderCalculationSheetCode)[0].currencySymbol,
                                          shipment: "",
                                          landedCost: "",
                                          grossMargin: "",
                                          unitPrice: "",
                                          amount: "",
                                          grossMarginValue: "",
                                          note: " ",
                                          approve: "",
                                          //////
                                          shelfLife:"",
                                          countryOfOrigin: "",
                                          tenderUnitM: -1,
                                          tenderUnit: "",
                                          msS_Unit: "1",
                                          tenderUnitValue: "",
                                          mssUnitValue:"",
                                          tenderQuantity: "",
                                          msS_Quantity: "",
                                          lastWinningPrice_WO_VAT : 0.0,
                                          total_WO_VAT: "",
                                          foB_MSS_Unit:"",
                                          foB_MSS: "",
                                          foC_Value: "1",
                                          shippingExpenses: "",
                                          sE_CostPerContainer:"",
                                          sE_EachContainer:"",
                                          sE_EachPallet:"",

                                          foc: false,
                                          cif: "",
                                          cifPlaceHolder:"",
                                          cifValueInTheSelectedCurrency:"",
                                          exchangeRate: "",
                                          profitPercentage: "",
                                          profitAmount: "",
                                          tenderUnitPrice: "",
                                          adjustedTenderUnitPrice: "",
                                          totalQuotationPrice: "",
                                          factor: "",
                                          suggestedQuotedPrice_WO_VAT:"",
                                          suggestedQuotedPrice_WO_VATPlaceHolder:"",
                                          suggestedPrice_WO_VAT_SelectedCurrency:"",
                                          regularPrice:"",
                                          winningProbability:false,
                                          costTypeCode: 1,
                                          shippingExpenseType: true,
                                          itemToCalculate:"",

                                          ciF_not_rounded:"",
                                          factor_not_rounded:"",
                                          shippingExpenses_not_rounded:"",
                                          suggestedQuotedPrice_WO_VAT_not_rounded:"", 
                                          totalQuotationPrice_not_rounded:"",
                                          total_WO_VAT_not_rounded:"",
                                          adjustedTenderUnitPrice_not_rounded:"",
                                          tenderUnitPrice_not_rounded:"",
                                          profitPercentage_not_rounded:"",
                                          profitAmount_not_rounded:"",
                                      }
                                      optionalitems.push(item);
                                      //vm.getItemCodeName(item)
                                      //vm.getItemCodeNameByName(item)
                                  });
                              }
                          });
                          MainConfigGroup.itemGroupMainConfig.map(function(
                              mainConfigItems
                          ) {
                              mainItemsConfig = [];
                              if (prelistItemGroup.mainConfigId == mainConfigItems.id) {
                                  mainConfigItems.itemGroupMainConfigItems.map(function(
                                      groupMainConfigItemsObjectOfArray
                                  ) {
                                      var item = {
                                          name: groupMainConfigItemsObjectOfArray.itemName,
                                          code :groupMainConfigItemsObjectOfArray.itemCode,
                                          vendor: groupMainConfigItemsObjectOfArray.vendor,
                                          quantity: "",
                                          onHandPrice: groupMainConfigItemsObjectOfArray.onHandPrice,
                                          onHandPriceCurrency: groupMainConfigItemsObjectOfArray.onHandPriceCurrency,
                                          onHandPriceCurrencySymbol: groupMainConfigItemsObjectOfArray.onHandPriceCurrencySymbol,
                                          onHandQuantity: groupMainConfigItemsObjectOfArray.onHandQuantity,
                                          cost: groupMainConfigItemsObjectOfArray.onHandPrice,
                                          costType: 14,
                                          discount1: "",
                                          discount2: "",
                                          currencyCode: vm.tenderCalculationSheetCode,
                                          currencySymbol:vm.currenciesList.filter(x=>x.code==vm.tenderCalculationSheetCode)[0].currencySymbol,
                                          shipment: "",
                                          landedCost: "",
                                          grossMargin: "",
                                          unitPrice: "",
                                          amount: "",
                                          grossMarginValue: "",
                                          note: " ",
                                          approve: false,
                                          //---
                                          shelfLife:"",
                                          countryOfOrigin: "",
                                          tenderUnitM: -1,
                                          tenderUnit: "",
                                          msS_Unit: "1",
                                          tenderUnitValue: "",
                                          mssUnitValue:"",
                                          tenderQuantity: "",
                                          msS_Quantity: "",
                                          lastWinningPrice_WO_VAT : 0.0,
                                          total_WO_VAT: "",
                                          foB_MSS_Unit:"",
                                          foB_MSS: "",
                                          foC_Value: "1",
                                          shippingExpenses: "",
                                          sE_CostPerContainer:"",
                                          sE_EachContainer:"",
                                          sE_EachPallet:"",

                                          foc: false,
                                          cif: "",
                                          cifPlaceHolder:"",
                                          cifValueInTheSelectedCurrency:"",
                                          exchangeRate: "",
                                          profitPercentage: "",
                                          profitAmount: "",
                                          tenderUnitPrice: "",
                                          adjustedTenderUnitPrice: "",
                                          totalQuotationPrice: "",
                                          factor: "",
                                          suggestedQuotedPrice_WO_VAT:"",
                                          suggestedQuotedPrice_WO_VATPlaceHolder:"",
                                          suggestedPrice_WO_VAT_SelectedCurrency:"",
                                          regularPrice:"",
                                          winningProbability:false,
                                          costTypeCode: 1,
                                          shippingExpenseType: true,
                                          itemToCalculate:"",

                                          ciF_not_rounded:"",
                                          factor_not_rounded:"",
                                          shippingExpenses_not_rounded:"",
                                          suggestedQuotedPrice_WO_VAT_not_rounded:"", 
                                          totalQuotationPrice_not_rounded:"",
                                          total_WO_VAT_not_rounded:"",
                                          adjustedTenderUnitPrice_not_rounded:"",
                                          tenderUnitPrice_not_rounded:"",
                                          profitPercentage_not_rounded:"",
                                          profitAmount_not_rounded:"",
                                      }
                                      mainItemsConfig.push(item);
                                      //vm.getItemCodeName(item)
                                      //vm.getItemCodeNameByName(item)
                                  });
                                  vm.AddAlternativeGroupByMainConfig(mainItemsConfig, optionalitems);
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
          var index = this.currentGroupIndex

          if (OptionalItemList.length > 0) {
              optionalItems = {
                  name: "",
                  code: "",
                  totalAmount: "",
                  totalCost: "",
                  totalProfit: "",
                  groupTotalQuotationPrice: "",
                  groupTotal_WO_VAT: "",
                  tenderCalculationSheetAlternativeGroupId: "",
                  tenderCalculationSheetItem: OptionalItemList
              };
          }

          this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup.push(
          {
              name: "",
              selected: false,
              totalAmount: "",
              totalCost: "",
              totalProfit: "",
              groupTotalQuotationPrice: "",
              groupTotal_WO_VAT: "",
              tenderCalculationSheetMainGroupId: this.tenderCalculationSheetGroups[index].id ?
                  this.tenderCalculationSheetGroups[index].id :
                  "",
              tenderCalculationSheetItem: mainItemsList,
              tenderCalculationSheetAlternativeOptionalGroup: optionalItems,
              calculationAlternativeAmount: []
          }
          );
          this.totalAlternativeAmountIndex =
              this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup
              .length - 1;
      },
      addNewGroup() {
          var calWarranty = "";
          if (this.BasicInfoObj.warrantyForAllGroups) {
              calWarranty = this.BasicInfoObj.warranty;
          }
          this.tenderCalculationSheetGroups.push({
              tenderCalculationSheetId: this.calSheetId,
              name: "",
              number: "",
              deliveryTerms: "",
              warranty: calWarranty,
              totalAmount: "",
              totalCost: "",
              totalProfit: "",
              groupTotalQuotationPrice: "",
              groupTotal_WO_VAT: "",
              selected: false,
              tenderCalculationSheetAlternativeGroup: [],
              tenderCalculationSheetItem: [{
                  name: "",
                  vendor: "",
                  fromERB:null,
                  quantity: "",
                  onHandPrice: "",
                  onHandPriceCurrency:"",
                  onHandPriceCurrencySymbol:"",
                  onHandQuantity: "",
                  cost: "",
                  costType: 14,
                  discount1: "",
                  discount2: "",
                  currencyCode: this.tenderCalculationSheetCode,
                  currencySymbol:this.currenciesList.filter(x=>x.code==this.tenderCalculationSheetCode)[0].currencySymbol,
                  shipment: "",
                  landedCost: "",
                  grossMargin: "",
                  unitPrice: "",
                  amount: "",
                  grossMarginValue: "",
                  note: " ",
                  approve: false,
                  //----------->
                  shelfLife:"",
                  countryOfOrigin: "",
                  tenderUnitM: -1,
                  tenderUnit: "",
                  msS_Unit: "1",
                  tenderUnitValue: "",
              mssUnitValue:"",
                  tenderQuantity: "",
                  msS_Quantity: "",
                  lastWinningPrice_WO_VAT : 0.0,
                  total_WO_VAT: "",
                  foB_MSS_Unit:"",
                  foB_MSS: "",
                  foC_Value: "1",
                  shippingExpenses: "",
                  sE_CostPerContainer:"",
                  sE_EachContainer:"",
                  sE_EachPallet:"",

                  foc: false,
                  cif: "",
                  cifPlaceHolder:"",
                  cifValueInTheSelectedCurrency:"",
                  exchangeRate: "",
                  profitPercentage: "",
                  profitAmount: "",
                  tenderUnitPrice: "",
                  adjustedTenderUnitPrice: "",
                  totalQuotationPrice: "",
                  factor: "",
                  suggestedQuotedPrice_WO_VAT:"",
                  suggestedQuotedPrice_WO_VATPlaceHolder:"",
                  suggestedPrice_WO_VAT_SelectedCurrency:"",
                  regularPrice:"",
                  winningProbability:false,
                  costTypeCode: 1,
                  shippingExpenseType: true,
                  itemToCalculate:"",

                  ciF_not_rounded:"",
                  factor_not_rounded:"",
                  shippingExpenses_not_rounded:"",
                  suggestedQuotedPrice_WO_VAT_not_rounded:"", 
                  totalQuotationPrice_not_rounded:"",
                  total_WO_VAT_not_rounded:"",
                  adjustedTenderUnitPrice_not_rounded:"",
                  tenderUnitPrice_not_rounded:"",
                  profitPercentage_not_rounded:"",
                  profitAmount_not_rounded:"",
              }],
              tenderCalculationSheetOptionalGroup: null
          });
          this.totalAmountIndex = this.tenderCalculationSheetGroups.length - 1;
      },
      extractMainConfigGroupItem3() {
          var prelistConfigs = this.prelist;
          var prelistOptionalConfig = this.optionalList;
          var vm = this;
          var mainItemsConfig = [];
          var optionalitems = [];
          if (this.mainConfigItems.length > 0) {
              prelistConfigs.map(function(prelistItemGroup) {
                  vm.mainConfigItems.map(function(MainConfigGroup) {
                      if (prelistItemGroup.itemGroupId == MainConfigGroup.id) {
                          optionalitems = [];
                          prelistOptionalConfig.map(function(val) {
                              if (val == MainConfigGroup.id) {
                                  MainConfigGroup.itemGroupOptionalItem.map(function(value) {
                                      var item = {
                                          name: value.itemName,
                                          code :value.itemCode,
                                          vendor: value.vendor,
                                          quantity: "",
                                          onHandPrice: value.onHandPrice,
                                          onHandPriceCurrency: value.onHandPriceCurrency,
                                          onHandPriceCurrencySymbol: value.onHandPriceCurrencySymbol,
                                          onHandQuantity: value.onHandQuantity,
                                          cost: value.onHandPrice,
                                          costType: 14,
                                          discount1: "",
                                          discount2: "",
                                          currencyCode: vm.tenderCalculationSheetCode,
                                          currencySymbol:vm.currenciesList.filter(x=>x.code==vm.tenderCalculationSheetCode)[0].currencySymbol,
                                          shipment: "",
                                          landedCost: "",
                                          grossMargin: "",
                                          unitPrice: "",
                                          amount: "",
                                          grossMarginValue: "",
                                          note: " ",
                                          approve: "",
                                          //////
                                          shelfLife:"",
                                          countryOfOrigin: "",
                                          tenderUnitM: -1,
                                          tenderUnit: "",
                                          msS_Unit: "1",
                                          tenderUnitValue: "",
                                          mssUnitValue:"",
                                          tenderQuantity: "",
                                          msS_Quantity: "",
                                          lastWinningPrice_WO_VAT : 0.0,
                                          total_WO_VAT: "",
                                          foB_MSS_Unit:"",
                                          foB_MSS: "",
                                          foC_Value: "1",
                                          shippingExpenses: "",
                                          sE_CostPerContainer:"",
                                          sE_EachContainer:"",
                                          sE_EachPallet:"",

                                          foc: false,
                                          cif: "",
                                          cifPlaceHolder:"",
                                          cifValueInTheSelectedCurrency:"",
                                          exchangeRate: "",
                                          profitPercentage: "",
                                          profitAmount: "",
                                          tenderUnitPrice: "",
                                          adjustedTenderUnitPrice: "",
                                          totalQuotationPrice: "",
                                          factor: "",
                                          suggestedQuotedPrice_WO_VAT:"",
                                          suggestedQuotedPrice_WO_VATPlaceHolder:"",
                                          suggestedPrice_WO_VAT_SelectedCurrency:"",
                                          regularPrice:"",
                                          winningProbability:false,
                                          costTypeCode: 1,
                                          shippingExpenseType: true,
                                          itemToCalculate:"",

                                          ciF_not_rounded:"",
                                          factor_not_rounded:"",
                                          shippingExpenses_not_rounded:"",
                                          suggestedQuotedPrice_WO_VAT_not_rounded:"", 
                                          totalQuotationPrice_not_rounded:"",
                                          total_WO_VAT_not_rounded:"",
                                          adjustedTenderUnitPrice_not_rounded:"",
                                          tenderUnitPrice_not_rounded:"",
                                          profitPercentage_not_rounded:"",
                                          profitAmount_not_rounded:"",
                                      }
                                      optionalitems.push(item);
                                      //vm.getItemCodeName(item)
                                      //vm.getItemCodeNameByName(item)
                                  });
                              }
                          });
                          MainConfigGroup.itemGroupMainConfig.map(function(
                              mainConfigItems
                          ) {
                              mainItemsConfig = [];
                              if (prelistItemGroup.mainConfigId == mainConfigItems.id) {
                                  mainConfigItems.itemGroupMainConfigItems.map(function(
                                      groupMainConfigItemsObjectOfArray
                                  ) {
                                      var item = {
                                          name: groupMainConfigItemsObjectOfArray.itemName,
                                          code :groupMainConfigItemsObjectOfArray.itemCode,
                                          vendor: groupMainConfigItemsObjectOfArray.vendor,
                                          quantity: "",
                                          onHandPrice: groupMainConfigItemsObjectOfArray.onHandPrice,
                                          onHandPriceCurrency: groupMainConfigItemsObjectOfArray.onHandPriceCurrency,
                                          onHandPriceCurrencySymbol: groupMainConfigItemsObjectOfArray.onHandPriceCurrencySymbol,
                                          onHandQuantity: groupMainConfigItemsObjectOfArray.onHandQuantity,
                                          cost: groupMainConfigItemsObjectOfArray.onHandPrice,
                                          costType: 14,
                                          discount1: "",
                                          discount2: "",
                                          currencyCode: vm.tenderCalculationSheetCode,
                                          currencySymbol:vm.currenciesList.filter(x=>x.code==vm.tenderCalculationSheetCode)[0].currencySymbol,
                                          shipment: "",
                                          landedCost: "",
                                          grossMargin: "",
                                          unitPrice: "",
                                          amount: "",
                                          grossMarginValue: "",
                                          note: " ",
                                          approve: false,
                                          //---
                                          shelfLife:"",
                                          countryOfOrigin: "",
                                          tenderUnitM: -1,
                                          tenderUnit: "",
                                          msS_Unit: "1",
                                          tenderUnitValue: "",
                                          mssUnitValue:"",
                                          tenderQuantity: "",
                                          msS_Quantity: "",
                                          lastWinningPrice_WO_VAT : 0.0,
                                          total_WO_VAT: "",
                                          foB_MSS_Unit:"",
                                          foB_MSS: "",
                                          foC_Value: "1",
                                          shippingExpenses: "",
                                          sE_CostPerContainer:"",
                                          sE_EachContainer:"",
                                          sE_EachPallet:"",

                                          foc: false,
                                          cif: "",
                                          cifPlaceHolder:"",
                                          cifValueInTheSelectedCurrency:"",
                                          exchangeRate: "",
                                          profitPercentage: "",
                                          profitAmount: "",
                                          tenderUnitPrice: "",
                                          adjustedTenderUnitPrice: "",
                                          totalQuotationPrice: "",
                                          factor: "",
                                          suggestedQuotedPrice_WO_VAT:"",
                                          suggestedQuotedPrice_WO_VATPlaceHolder:"",
                                          suggestedPrice_WO_VAT_SelectedCurrency:"",
                                          regularPrice:"",
                                          winningProbability:false,
                                          costTypeCode: 1,
                                          shippingExpenseType: true,
                                          itemToCalculate:"",

                                          ciF_not_rounded:"",
                                          factor_not_rounded:"",
                                          shippingExpenses_not_rounded:"",
                                          suggestedQuotedPrice_WO_VAT_not_rounded:"", 
                                          totalQuotationPrice_not_rounded:"",
                                          total_WO_VAT_not_rounded:"",
                                          adjustedTenderUnitPrice_not_rounded:"",
                                          tenderUnitPrice_not_rounded:"",
                                          profitPercentage_not_rounded:"",
                                          profitAmount_not_rounded:"",
                                      }
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
                  totalAmount: "",
                  totalCost: "",
                  totalProfit: "",
                  tenderCalculationSheetItem: OptionalItemList
              };
          }
          if (this.BasicInfoObj.warrantyForAllGroups) {
              calWarranty = this.BasicInfoObj.warranty;
          }

          this.tenderCalculationSheetGroups.push({
              tenderCalculationSheetId: this.calSheetId,
              name: "",
              number: "",
              deliveryTerms: "",
              warranty: calWarranty,
              totalAmount: "",
              totalCost: "",
              totalProfit: "",
              groupTotalQuotationPrice: "",
              groupTotal_WO_VAT: "",
              selected: false,
              tenderCalculationSheetAlternativeGroup: [],
              tenderCalculationSheetItem: mainItemsList,
              tenderCalculationSheetOptionalGroup: optionalItems
          });
      },
      extractMainConfigGroupItem() {
          var prelistConfigs = this.prelist;
          // var mainConfigItemsExtract = [];
          var tenderCalculationSheetGroups = this.tenderCalculationSheetGroups[
              this.currentGroupIndex
          ];

          if (this.mainConfigItems.length > 0) {
              this.mainConfigItems.map(function(mainConfigGroup) {
                  if (mainConfigGroup.itemGroupMainConfig.length > 0) {
                      mainConfigGroup.itemGroupMainConfig.map(function(mainConfig) {
                          if (prelistConfigs.includes(mainConfig.id)) {
                              if (mainConfig.itemGroupMainConfigItems.length > 0) {
                                  mainConfig.itemGroupMainConfigItems.map(function(
                                      groupMainConfigItemsObjectOfArray
                                  ) {
                                      tenderCalculationSheetGroups.tenderCalculationSheetItem.push({
                                          name: groupMainConfigItemsObjectOfArray.itemName,
                                          vendor: "",
                                          fromERB:null,
                                          quantity: "",
                                          onHandPrice: "",
                                          onHandPriceCurrency:"",
                                          onHandPriceCurrencySymbol:"",
                                          onHandQuantity: "",
                                          cost: "",
                                          costType: 14,
                                          discount1: "",
                                          discount2: "",
                                          currencyCode: this.tenderCalculationSheetCode,
                                          currencySymbol:this.currenciesList.filter(x=>x.code==this.tenderCalculationSheetCode)[0].currencySymbol,
                                          shipment: "",
                                          landedCost: "",
                                          grossMargin: "",
                                          unitPrice: "",
                                          amount: "",
                                          grossMarginValue: "",
                                          note: " ",
                                          approve: false,
                                          //----------
                                          shelfLife:"",
                                          countryOfOrigin: "",
                                          tenderUnitM: -1,
                                          tenderUnit: "",
                                          msS_Unit: "1",
                                          tenderUnitValue: "",
                                          mssUnitValue:"",
                                          tenderQuantity: "",
                                          msS_Quantity: "",
                                          lastWinningPrice_WO_VAT : 0.0,
                                          total_WO_VAT: "",
                                          foB_MSS_Unit:"",
                                          foB_MSS: "",
                                          foC_Value: "1",
                                          shippingExpenses: "",
                                          sE_CostPerContainer:"",
                                          sE_EachContainer:"",
                                          sE_EachPallet:"",

                                          foc: false,
                                          cif: "",
                                          cifPlaceHolder:"",
                                          cifValueInTheSelectedCurrency:"",
                                          exchangeRate: "",
                                          profitPercentage: "",
                                          profitAmount: "",
                                          tenderUnitPrice: "",
                                          adjustedTenderUnitPrice: "",
                                          totalQuotationPrice: "",
                                          factor: "",
                                          suggestedQuotedPrice_WO_VAT:"",
                                          suggestedQuotedPrice_WO_VATPlaceHolder:"",
                                          suggestedPrice_WO_VAT_SelectedCurrency:"",
                                          regularPrice:"",
                                          winningProbability:false,
                                          costTypeCode: 1,
                                          shippingExpenseType: true,
                                          itemToCalculate:"",

                                          ciF_not_rounded:"",
                                          factor_not_rounded:"",
                                          shippingExpenses_not_rounded:"",
                                          suggestedQuotedPrice_WO_VAT_not_rounded:"", 
                                          totalQuotationPrice_not_rounded:"",
                                          total_WO_VAT_not_rounded:"",
                                          adjustedTenderUnitPrice_not_rounded:"",
                                          tenderUnitPrice_not_rounded:"",
                                          profitPercentage_not_rounded:"",
                                          profitAmount_not_rounded:"",
                                      });
                                  });
                              }
                          }
                      });
                  }
              });
          }
          this.bulidTenderCalculationSheetDialog = false;
      },
      nextStep: function() {
          this.$emit("next-step");
      },
      previousStep: function() {
          if (
              this.BasicInfoObj.createdBy == this.loggeduser &&
              this.BasicInfoObj.status == this.$store.getters.getSheetStatus.Waiting_for_Approval
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
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(
                  function(data) {
                      this.principals = data.body;
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
      getMainConfigByPrincipalCategoryItem() {
           this.mainConfigItems = []
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
                      headers: this.$store.getters.tokenAuthonticationHeaderObj
                  })
                  .then(
                      function(data) {
                          this.mainConfigItems = data.body.itemsGroupList;
                          this.enableModel = true;
                          this.isSearch = true;
                      }.bind(this),
                      function() {
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
              itemGroupOptionalItem: []
          };
      },
      getSelection() {
          var trueArr = [];
          this.tenderCalculationSheetGroups.forEach(element => {
              if (element) {
                  if (element.selected == true) {
                      trueArr.push(element.selected);
                  } else {
                      element.tenderCalculationSheetAlternativeGroup.forEach(alterElement => {
                          if (alterElement.selected == true) {
                              trueArr.push(alterElement.selected);
                          }
                      });
                  }
              }
          });

          if (trueArr.length == this.tenderCalculationSheetGroups.length) {
              return true;
          } else {
              return false;
          }
      },
      checkSelection() {
          var isValidArr = [];
          this.tenderCalculationSheetGroups.forEach(element => {
              if (element) {
                  if (element.selected == true) {
                      if (element.tenderCalculationSheetItem.length > 0) {
                          element.tenderCalculationSheetItem.forEach((_element) => {
                              if (
                                  _element.name == "" ||
                                  _element.cost == "" ||
                                  _element.quantity == ""
                              ) {
                                  isValidArr.push(false);
                                  return isValidArr;
                              }
                          });
                      } else {
                          isValidArr.push(false);
                      }
                  } else {
                      element.tenderCalculationSheetAlternativeGroup.forEach(alterElement => {
                          if (alterElement.selected == true) {
                              if (element.tenderCalculationSheetItem.length > 0) {
                                  alterElement.tenderCalculationSheetItem.forEach(
                                      (_element) => {
                                          if (
                                              _element.name == "" ||
                                              _element.cost == "" ||
                                              _element.quantity == ""
                                          ) {
                                              isValidArr.push(false);
                                              return isValidArr;
                                          }
                                      }
                                  );
                              } else {
                                  isValidArr.push(false);
                              }
                          }
                      });
                  }
              }
          });
          let result = isValidArr.filter(word => word == false);
          return result.length > 0 ? false : true;
      },
      getAllItemsGroupByPrincipleId(val) {
          if(this.ItemsGroupObj.principalId != ""){
                  this.ItemsGroupObj.category = ""
                  this.ItemsGroupObj.model = ""
          }
          var urlStr =
              this.$store.getters.serverURI +
              "api/ItemsGroup/categories?principalCode=" +
              val;
          this.$http
              .get(urlStr, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(function(data) {              
                  this.enableCategory = true;
                  this.categories = data.body;
              });
      },
      getTenderReferences() {
          var urlStr =
              this.$store.getters.serverURI +
              "api/ItemsGroup/tenderReferences";
          this.$http
              .get(urlStr, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(function(data) {
                  this.tenderReferences = data.body;
              });
      },
      getAllItemsGroupByCategoryId(val) {
          if(this.ItemsGroupObj.category != ""){
              this.ItemsGroupObj.model = ""
          }
          var urlStr =
              this.$store.getters.serverURI +
              "api/ItemsGroup/models?categoryCode=" +
              val;
          this.$http
              .get(urlStr, {
                  headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(function(data) {
                  this.enableModel = true;
                  this.models = data.body;
              });
      },
      reBuildItems(){
           var val = this.tenderCalculationSheetGroups
               if (val && val.length > 0) {
                  val.forEach((element) => {
                      element.tenderCalculationSheetItem.forEach((_element) => {
                        this.calculatorMainItemChange(_element)
                      });

                      element.tenderCalculationSheetAlternativeGroup.forEach(alterElement => {
                          alterElement.tenderCalculationSheetItem.forEach((_element) => {
                               this.calculatorMainItemChange(_element)
                          });


                          if (alterElement.tenderCalculationSheetAlternativeOptionalGroup != null) {
                              alterElement.tenderCalculationSheetAlternativeOptionalGroup.tenderCalculationSheetItem.forEach(
                                  (_elementOptional) => {
                                     this.calculatorMainItemChange(_elementOptional)
                                  }
                              );
                          }
                      });

                      if (element.tenderCalculationSheetOptionalGroup) {
                          element.tenderCalculationSheetOptionalGroup.tenderCalculationSheetItem.forEach(
                              (_element) => {
                                 this.calculatorMainItemChange(_element)
                              }
                          );
                      }
                  });
              }
              // this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
              // this.getSelection();
      },
      saveAndLeave() {
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
              "api/TenderCalculationSheet/" +
              this.calSheetId +
              "/MainGroup";
          this.$http
              .post(
                  urlStr, {
                      tenderCalculationSheetMainGroup: this.tenderCalculationSheetGroups,
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
     },



     deleteSelectedForCalcuationSheetAlternativeItem(index,alternativeGroupIndex){

      if(!this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[ alternativeGroupIndex ].tenderCalculationSheetItem ||
      this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[ alternativeGroupIndex ].tenderCalculationSheetItem.length ==0)
          return;
          
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
                  
                  this.$set( this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[ alternativeGroupIndex ], "tenderCalculationSheetItem",  
                  this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[ alternativeGroupIndex ].tenderCalculationSheetItem.filter(  item => !item.selected ) );

                  this.totalAmountIndex = index;
                  this.totalAlternativeAmountIndex = alternativeGroupIndex;
                  this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
                  done();
              } else {
                  done();
               }
              }
          });

     },

     deleteSelectedForCalcuationSheetMainItems(index){
      if(!this.tenderCalculationSheetGroups[index].tenderCalculationSheetItem ||
      this.tenderCalculationSheetGroups[index].tenderCalculationSheetItem.length ==0)
          return;
      

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

                  this.$set( this.tenderCalculationSheetGroups[index], "tenderCalculationSheetItem",  
                  this.tenderCalculationSheetGroups[index].tenderCalculationSheetItem.filter(  item => !item.selected ) );

                  this.totalAmount = index;
                  this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
                  done();
              } else {
                  done();
               }
              }
          });


     },

     deleteSelectedForCalcuationSheetOptionalGroupItems(index){
      if(! this.tenderCalculationSheetGroups[index].tenderCalculationSheetOptionalGroup.tenderCalculationSheetItem ||
      this.tenderCalculationSheetGroups[index].tenderCalculationSheetOptionalGroup.tenderCalculationSheetItem.length ==0)
          return;

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
                  this.$set( this.tenderCalculationSheetGroups[index].tenderCalculationSheetOptionalGroup, "tenderCalculationSheetItem",  
                  this.tenderCalculationSheetGroups[index].tenderCalculationSheetOptionalGroup.tenderCalculationSheetItem.filter(  item => !item.selected ) );
                  done();
              } else {
                  done();
               }
              }
          });


     },

     deleteSelectedForCalcuationSheetAlternativeOptionalItem(index,alternativeGroupIndex){
      
      if(! this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[ alternativeGroupIndex ].tenderCalculationSheetAlternativeOptionalGroup.tenderCalculationSheetItem ||
      this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[ alternativeGroupIndex ].tenderCalculationSheetAlternativeOptionalGroup.tenderCalculationSheetItem.length ==0)
          return;


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
                  this.$set( this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[ alternativeGroupIndex ].tenderCalculationSheetAlternativeOptionalGroup, "tenderCalculationSheetItem",  
                  this.tenderCalculationSheetGroups[index].tenderCalculationSheetAlternativeGroup[ alternativeGroupIndex ].tenderCalculationSheetAlternativeOptionalGroup.tenderCalculationSheetItem.filter(  item => !item.selected ) );
                  done();
              } else {
                  done();
               }
              }
          });
     }

  },
  watch: {
      tenderCalculationSheetGroups: {
          handler() {
              this.calculateTotal();
              
              this.getTotalAmountTotalGrossMarginTotalGrossMarginValue();
              // this.getSelection();
          },
          deep: true
      },

      bankBlockViewModel: {
          handler() {},
          deep: true
      },
  }
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

.el-table_1_column_18 {
  color:red !important;
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

.build-btn{
  margin-left: 0;
}
</style>