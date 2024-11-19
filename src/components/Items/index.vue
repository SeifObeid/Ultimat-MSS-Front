<template>
  <div>
    <b-card
      class="card card-accent-primary"
      no-body
      v-if="show"
      v-loading.fullscreen.lock="fullscreenLoading"
    >
      <div slot="header">
        {{$t("ItemsManagementList")}} / {{$t('SearchFields')}}
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
          <form class="form-horizontal" @submit.prevent="getItemsGroupFromService">
            <div class="row">
            
              <div class="col-md-6">
                <div class="form-group">
                  <label class="col-form-label">{{$t("itemName")}}</label>
                  <el-input
                    v-model="search.itemName"
                    type="text"
                    autocomplete="off"
                  ></el-input>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label class="col-form-label">{{$t("itemCode")}}</label>
                  <el-input
                    v-model="search.itemCode"
                    type="text"
                    autocomplete="off"
                  ></el-input>
                </div>
              </div>

            </div>

            <div class="row">
              <div class="col-md-12 mt-3 mb-3">
                <button type="button" class="btn btn-danger pull-right" @click="resetSearchForm">
                  <i class="fa fa-remove"></i>
                  {{$t("Clear")}}
                </button>

                <button
                  type="submit"
                  class="btn btn-primary pull-right mr-1"
                  @click="getItemsGroupFromService"
                >
                  <i class="fa fa-search"></i>
                  {{$t("Search")}}
                </button>

                <!-- <button class="btn csubmit pull-right mr-1" variant="primary" @click="Excel()">
                  <i class="fa fa-file-excel-o"></i>
                  Export Excel
                </button> -->

                <router-link
                  v-if="checkActions('Insert')"
                  :to="{ name: 'newItem'}"
                  class="btn btn-success pull-left"
                >
                  <i class="fa fa-plus-square-o"></i>
                  {{$t("NewItem")}}
                </router-link>
                
                <button @click="ShowExcelSheetDialog()" class="pull-left btn btn-secondary ml-1 mb-2" variant="secondary">
                    <i class="fa fa-file-excel-o"></i> 
                    {{ $t('import')}}
                </button>
              </div>
            </div>
          </form>
          <div class="tableDiv">
            <table class="table table-bordered table-striped table-sm">
              <thead>
                <tr>
                  <th scope="col" class="text-left" width="8%">#</th>
                  <th scope="col" class="text-left" width="50%">{{$t("itemName")}}</th>
                  <th scope="col" class="text-left">{{$t("itemCode")}}</th>
                  <th scope="col" class="text-left">{{$t("Principal")}}</th>
                  <!-- <th scope="col" class="text-left">{{$t("Currency")}}</th> -->
                  <th scope="col" class="action-column text-center" width="8%">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(Group, index) in ItemsGroup" v-bind:key="index">
                  <td class="text-left">{{index+1}}</td>
                  <td class="text-left" style="word-break: break-word;">{{Group.itemName}}</td>
                  <td class="text-left">{{Group.itemCode}}</td>
                  <td class="text-left">
                    <span v-if="Group.principalCode != Group.principalName">{{Group.principalCode}} - {{Group.principalName}}</span>
                    <span v-else>{{Group.principalCode}}</span>
                  </td>
                  <!-- <td class="text-left">{{Group.currency}}</td> -->
                  <td class="action-column">
                    <router-link v-if="checkActions('Edit')" :title="$t('Edit')" class="text-primary" :to="{ name: 'newItem', params: {Id: Group.id}}">
                      <i class="fa fa-edit"></i>
                    </router-link>
                    <a v-if="checkActions('Delete')" :title="$t('Delete')" class="text-danger" v-on:click="deleteItemsGroup(Group.id);" style="margin-left:3px">
                      <i class="fa fa-trash"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="text-center">
              <el-pagination
                v-if="this.page.totalItems > this.page.itemsPerPage"
                @current-change="pageChanged"
                :current-page="this.page.currentPage"
                :page-size="this.page.itemsPerPage"
                layout="prev, pager, next"
                :total="this.page.totalItems"
              ></el-pagination>
            </div>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>
    <el-dialog
        title="Import"
        :visible="ExcelsheetDialog"
        :show-close="false"
        :close-on-press-escape="false"
        :destroy-on-close="false"
        >
        <b-row>
            <b-col sm="12">
            <b-form-group>
                <div class="col-md-12 uplaod-btn">
                    <dropzone id="importDropzone" :useCustomSlot="true" :options="dropzoneOptions" @vdropzone-files-added="importExcelFromService">
                    <i class="cui-cloud-upload icons font-2xl d-block"></i>
                    <div>Upload file</div>
                    </dropzone>
                </div>
                <div class="mt-2">
                    <strong>{{$t("downloadTemplateHint")}} <a download :href="excelLink" target="_blank">download template</a></strong>
                </div>             
            </b-form-group>
            </b-col>
        </b-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cloaeExcelSheetDialog()">{{$t("Close")}}</el-button>
        </span>
        </el-dialog>
  </div>
</template>

<script type="text/javascript">
import { checkRoles } from "../../shared/utils";
import axios from "axios";
import dropzone from "vue2-dropzone"

export default {
  components: { dropzone },
  data() {
    return {
      show: true,
      fullscreenLoading: false,
      ItemsGroup: [],
      principals: [],
      page: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: this.$store.getters.getLargePagging
      },
      search: {
        itemName: "",
        itemCode: ""     
      },
      visible: false,
      ExcelsheetDialog:false,
      dropzoneOptions: {
          url: `https://httpbin.org/post`,
          maxFilesize: 102400000,
          paramName: function() {
          return "file[]";
          },
          dictDefaultMessage: "Upload Files Here xD",
          includeStyling: false,
          previewsContainer: false,
          uploadMultiple: true,
          parallelUploads: 20
      },
      excelLink:"",
    };
  },

  methods: {
    ShowExcelSheetDialog(){
      this.ExcelsheetDialog = true;
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
    importExcelFromService(files) {
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
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = event => {
        let base64File = event.target.result;
        let base64FileArray = base64File.split(",")
        let base64FileString = base64FileArray[1];
        let fileName = files[0].name;
        let urlStr =
        this.$store.getters.serverURI +
        "api/ManualItems/ImportItemGroupFromExcel"
        this.$http
            .post(
                urlStr,
                {
                    FileName: fileName,
                    Base64FileString: base64FileString,
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
                        message: this.$t("ImportedSuccessfully")
                    });
                    this.getItemsGroupFromService();   
                },
                function() {
                    this.$message({
                        showClose: true,
                        duration: this.$store.getters.getMessagesDuration,
                        type: "error",
                        message: this.$t("ErrorMessage")
                    });
                }
            )
            .finally(() => {
                this.fullscreenLoading = false;
                this.ExcelsheetDialog = false;
            });
    };
      
    
    },
    Excel() {
      // var principalCode = "";
      // var categoryCode = "";
      // var modelCode = "";
      var urlStr =
        this.$store.getters.serverURI +
        "api/ItemsGroup/ExportToExcel?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&RowsCount=" +
        "&principalCode=" +
        this.search.principalCodeField +
        "&Category=" +
        this.search.categoryCodeField +
        "&Model=" +
        this.search.modelCodeField;

      // window.open(url, "_blank");

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
        fileLink.setAttribute("download", "ItemGroups.xlsx");
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
    
    checkActions(roleName) {
      return checkRoles("Manual Item", roleName);
    },

    resetSearchForm() {
      this.page = {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: this.$store.getters.getLargePagging
      };
      this.search = {
        itemName: "",
        itemCode: ""
      };
      this.getItemsGroupFromService();
    },

    pageChanged: function(pageNum) {
      this.page.currentPage = pageNum;
      this.getItemsGroupFromService();
    },
    deleteItemsGroup(GroupId) {
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
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = this.$t("Deleting");
            var urlStr =
              this.$store.getters.serverURI + "api/ManualItems/" + GroupId;
            this.$http
              .delete(urlStr, {
                headers: this.$store.getters.tokenAuthonticationHeaderObj
              })
              .then(function() {
                done();
                instance.confirmButtonLoading = false;
                this.getItemsGroupFromService();
              });
          } else {
            done();
          }
        }
      })
        .then(() => {
          this.$message({
            showClose: true,
            duration: this.$store.getters.getMessagesDuration,
            type: "success",
            message: this.$t("DeletedSuccessfully")
          });
        })
        .catch(() => {
          // this.$message({
          //     type: 'info',
          //     message: 'Delete canceled'
          // });
        });
    },

    getItemsGroupFromService() {
      // var principalCode = "";
      // var categoryCode = "";
      // var modelCode = "";
      //   if (this.search.principalCodeField) {
      //     principalCode = moment(this.search.principalCodeField).format(
      //       this.$store.getters.getWebAPIDateFormatMoment
      //     );
      //   }
      //   if (this.search.categoryCodeField) {
      //     categoryCode = moment(this.search.categoryCodeField).format(
      //       this.$store.getters.getWebAPIDateFormatMoment
      //     );
      //   }
      //   if (this.search.modelCodeField) {
      //     modelCode = moment(this.search.modelCodeField).format(
      //       this.$store.getters.getWebAPIDateFormatMoment
      //     );
      //   }

      var urlStr =
        this.$store.getters.serverURI +
        "api/ManualItems?PageIndex=" +
        this.page.currentPage +
        "&PageSize=" +
        this.page.itemsPerPage +
        "&itemName=" +
        this.search.itemName +
        "&itemCode=" +
        this.search.itemCode;
       

      //var urlStr = this.$store.getters.serverURI+ "api/ItemsGroup/GetAll";
      this.fullscreenLoading = true;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.fullscreenLoading = false;
            this.ItemsGroup = data.body.manualItemViewModels;
            this.page.totalItems = data.body.pagingInfo.rowsCount;
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
  },

  created: function() {
    this.excelLink =  this.$store.getters.serverURI+"ExcelTemplates/ItemGroupTemplete.xlsx"
    this.getItemsGroupFromService();
  }
};
</script>
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
</style>