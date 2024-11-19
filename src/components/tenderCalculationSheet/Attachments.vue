<template>
  <div>
    <b-card class="card card-accent-primary" no-body>
      <div slot="header">
        {{$t("attachment")}}
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
          <div
            id="__BVID__254"
            role="group"
            aria-labelledby="__BVID__254__BV_label_"
            class="b-form-group form-group"
          >
            <div class="form-row">
              <!--<label id="__BVID__254__BV_label_" for="fileInputMulti" class="col-sm-3 col-form-label">-->

              <!--</label>-->
              <div class="col-md-2 uplaod-btn">
                <div onclick="document.getElementById('fileInputMulti').click()">
                  <i class="cui-cloud-upload icons font-3xl d-block"></i>
                  <div>Upload files</div>
                </div>
                <!--<label for="fileInputMulti">-->
                <!--Upload files-->
                <!--</label>-->

                <input
                  data-v-459e9c6b
                  type="file"
                  id="fileInputMulti"
                  multiple="multiple"
                  class="form-control-file"
                  autocomplete="off"
                  @change="onFileChange"
                  style="display: none"
                />
                <!---->
                <!---->
                <!---->
              </div>
              <div class="col-md-10">
                <div class="form-row" v-if="tenderCalculationSheetAttachment">
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
                    <tbody v-if="tenderCalculationSheetAttachment.length >0">
                      <tr
                        v-for="(attachemnt,index) in tenderCalculationSheetAttachment"
                        v-if="!attachemnt.deleted"
                      >
                        <td>{{attachemnt.fileName}}</td>
                        <td>
                          <input
                            type="text"
                            :name="attachemnt.quid"
                            class="form-control"
                            v-model="attachemnt.description"
                            autocomplete="off"
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
                            :href="appLink+'api/TenderCalculationSheet/DownLoadFile/'+attachemnt.quid"
                            download
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
              </div>
            </div>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <div class="text-center mb-5">
      <button class="btn csubmit" v-on:click="previousStep()" v-if="active != 0">
        <i class="fa fa-angle-left fa-lg"></i>
        {{$t("Previous")}}
      </button>
      <button class="btn csubmit ml-3" v-on:click="storeAttachmentFiles()" variant="primary">
        <i class="fa fa-save"></i>
        {{$t("Save")}}
      </button>
    </div>
  </div>
</template>
<style scoped>
.uplaod-btn {
  border: 1px solid #cccc;
  text-align: center;
  padding-top: 22px;
  padding-bottom: 10px;
  height: 100px !important;
}

.uplaod-btn:hover {
  cursor: pointer;
  background-color: #eeeff0;
}
</style>
<script>
export default {
  props: {
    calSheetId: Number,
    active: Number
  },
  name: "attachment",
  data() {
    return {
      tenderCalculationSheetAttachment: [],
      actionType: "post",
      appLink: this.$store.getters.serverURI
        ? this.$store.getters.serverURI
        : ""
    };
  },
  created() {
    if (this.calSheetId) {
      this.fetchData();
    }
  },
  mounted() {},
  methods: {
    fetchData: function() {
      var urlStr =
        this.$store.getters.serverURI +
        "api/TenderCalculationSheet/GetAttachment/" +
        this.calSheetId;
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.tenderCalculationSheetAttachment = data.body;
            if (this.tenderCalculationSheetAttachment.length > 0) {
              this.actionType = "put";
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
    removAttachment(item) {
      this.tenderCalculationSheetAttachment.splice(
        this.tenderCalculationSheetAttachment.indexOf(item),
        1
      );
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      else if (files.length >= 1) {
        for (var i = 0; i < files.length; i++) {
          if (files[i].size / (1024 * 1024) <= 5) {
            this.createImage(files[i], files[i].name);
          } else {
            this.$message({
              showClose: true,
              duration: this.$store.getters.getMessagesDuration,
              type: "warning",
              message: this.$t("5 MB max acceptable file size ")
            });
          }
        }
      }
      this.resetFileInput();
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
        vm.tenderCalculationSheetAttachment.push({
          fileName: fileName,
          creationDate: "",
          updateDate: "",
          tenderCalculationSheetId: vm.calSheetId,
          base64FileString: filebasee64Array[1]
        });
      };
    },
    storeAttachmentFiles() {
      if (!this.calSheetId) return;
      if (this.actionType == "post") {
        var urlStr =
          this.$store.getters.serverURI +
          "api/TenderCalculationSheet/InsertAttachment";
        this.$http
          .post(
            urlStr,
            {
              tenderCalculationSheetAttachment: this.tenderCalculationSheetAttachment
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
                message: this.$t("AddedSuccessfully")
              });
              this.status = "New";
              this.fetchData();
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
      } else if (this.actionType == "put") {
        var urlStr =
          this.$store.getters.serverURI +
          "api/TenderCalculationSheet/UpdateAttachment?tenderCalculationSheetId=" +
          this.calSheetId;
        this.$http
          .put(
            urlStr,
            {
              tenderCalculationSheetAttachment: this.tenderCalculationSheetAttachment
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
                message: this.$t("UpdatedSuccessfully")
              });
              this.status = "New";
              //this.$router.push({path:'/'});
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
    previousStep: function() {
      this.$emit("previous-step");
    }
  }
};
</script>
