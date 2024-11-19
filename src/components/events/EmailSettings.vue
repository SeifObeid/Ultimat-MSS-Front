<template>
  <b-card
    class="card card-accent-primary"
    no-body
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div slot="header">
      <span >{{$t("EmailSettings")}}</span>
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
        <div class="row">
          <div class="col-md-12">
            <div class="form-group" :class="{'has-error':errors.has('formValidation.subject')}">
              <label class="col-form-label">{{$t("Subject")}}</label>
              <label class="required">*</label>
              <input
                type="text"
                name="subject"
                class="form-control"
                v-model="formObj.subject"
                v-validate="'required'"
                data-vv-scope="formValidation"
                :data-vv-as="$t('Subject')"
                autocomplete="off"
              />
              <div
                class="help-block"
                v-if="errors.has('formValidation.subject')"
              >{{ errors.first('formValidation.subject') }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group" :class="{'has-error':errors.has('formValidation.template')}">
              <label class="col-form-label">{{$t("Template")}}</label>
              <label class="required">*</label>
              <ckeditor
									:config="config"
									id="template"
									ref="template"
									:editor="editor"
									v-model="formObj.template"
									v-validate="'required'"
									name="template"
									:data-vv-as="$t('Template')"
									data-vv-scope="formValidation"
								></ckeditor>
              <div
                class="help-block"
                v-if="errors.has('formValidation.template')"
              >{{ errors.first('formValidation.template') }}</div>
            </div>
          </div>
        </div>
        <div class="mt-2">
          <button class="btn btn-primary" v-on:click="sendForm()">
            <i class="fa fa-save"></i>
            {{$t("Save")}}
          </button>
        </div>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script type="text/javascript">
import CKEditor from "@ckeditor/ckeditor5-vue2";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
export default {
	components: {
		ckeditor: CKEditor.component
	},
  data() {
    return {
      fullscreenLoading: false,
      formObj: {
        id: "",
        subject: "",
        template: "",
      },
			config: {},
			editor: ClassicEditor,
    };
  },

  methods: { 
    getDataFromService: function() {
      this.fullscreenLoading = true;
      var urlStr = this.$store.getters.serverURI + "api/EmailSettings/GetEventEmail";
      this.$http
        .get(urlStr, {
          headers: this.$store.getters.tokenAuthonticationHeaderObj
        })
        .then(
          function(data) {
            this.formObj = data.body;
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
    sendForm() {
      this.$validator.validateAll("formValidation").then(result => {
        if (result) {
          this.fullscreenLoading = true;
          var urlStr = this.$store.getters.serverURI + "api/EmailSettings/PutEventEmail";
          this.$http
            .put(urlStr, this.formObj, {
              headers: this.$store.getters.tokenAuthonticationHeaderObj
            })
            .then(
              () => {
                this.fullscreenLoading = false;
                this.$message({
                  showClose: true,
                  duration: this.$store.getters.getMessagesDuration,
                  type: "success",
                  message: this.$t("UpdatedSuccessfully")
                });
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
  },

  created: function() {
    this.getDataFromService();
  }
};
</script>
<style scoped>
::v-deep .ck-editor__editable {
  min-height: 150px;
}
</style>