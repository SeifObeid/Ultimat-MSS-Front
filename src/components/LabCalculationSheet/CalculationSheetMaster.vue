<template>
  <div>
    <el-steps :active="active" align-center>
      <el-step
        :title="$t('BasicInformation')"
        @click.native="basicInformationStep()"
        icon="el-icon-info"
      ></el-step>
      <!-- <el-step :title="$t('Items')" @click.native="nextStep(0)" icon="el-icon-tickets"></el-step> -->
      <el-step :title="$t('Items')" @click.native="ItemsStep()" icon="el-icon-tickets"></el-step>
    </el-steps>
    <div class="panel panel-default">
      <div class="panel-body">
        <div class="panel-body container-items">
          <div v-if="active == 0">
            <basic-information
              ref="basic"
              :predata="predata"
              v-bind:calSheetId="calSheetId"
              v-bind:active="active"
              v-on:next-step="nextStep(1)"
              v-on:previous-step="previousStep()"
              @clicked="setCalcSheetId"
            ></basic-information>
          </div>

          <div v-if="active==1">
            <items
              ref="items"
              :calSheetId="calSheetId"
              v-bind:active="active"
              v-on:previous-step="previousStep()"
              @withoutConfirm="withoutConfirm=true"
            ></items>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type='text/javascript'>
import BasicInformation from "./BasicInformation";
import items from "./items";

export default {
  components: {
    BasicInformation,
    items,
  },
  data() {
    return {
      predata:{},
      calSheetId: this.$route.params.CalSheetId
        ? parseInt(this.$route.params.CalSheetId)
        : null,
      active: 0,
      withoutConfirm: false,
    };
  },
  beforeRouteLeave (to, from , next) {
      //  debugger;
    if(this.$refs.items){
      var groupsCount2=[]
      this.$refs.items.tenderCalculationSheetGroups.forEach(element => {
        groupsCount2.push(element.labCalculationSheetItem.length)
      });
      var isEqualFlag= this.isEqual(this.$refs.items.groupsCount, groupsCount2)
      if(!(to.path.includes('labNewCalculationSheet')||isEqualFlag||this.withoutConfirm)){
        const h = this.$createElement;
        this.$msgbox({
          title: this.$t("Confirm"),
          message: h("p", null, [
            h("span", null, this.$t("ConfirmLeave"))
          ]),
          showCancelButton: true,
          confirmButtonText: this.$t("Leave"),
          cancelButtonText: this.$t("Stay"),
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              next();
              done();
            } else {
              done();
            }
          }
        })
      }else{
        this.withoutConfirm = false;
        next()
      }
    }else{
      next()
    }
       
  },
  methods: {
    isEqual(arr1,arr2){
        // Check if the arrays are the same length
        if (arr1.length !== arr2.length) return false;

        // Check if all items exist and are in the same order
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true
    },
    setCalcSheetId: function(value) {
      this.calSheetId = value;
    },
    nextStep: function(step = null) {
      if (!this.calSheetId && this.active == 0) {
        this.$message({
          showClose: true,
          duration: this.$store.getters.getMessagesDuration,
          type: "warning",
          message: this.$t("EnsureSaveFirstStep")
        });
        return false;
      }

      if (step == 0) {
        this.active = 1;
        return;
      }
      this.active++;
    },
    previousStep: function() {
      setTimeout(() => {
        this.$refs.basic.FillData();
      }, 400);
       this.active--;
    },
    basicInformationStep: function() {
      this.$refs.items.saveDataAction(true);
      setTimeout(() => {
        this.$refs.basic.FillData();
      }, 600);

      setTimeout(() => {
        this.active = 0;
      }, 1000);
    },
    ItemsStep: function() {
     var isSuccess =  this.$refs.basic.saveCalSheet(true);
     if(isSuccess){
       setTimeout(() => {
        this.active = 1;
      }, 500);
     }
      // return;
    }
  },

  created: function() {
   window.addEventListener('beforeunload', (event) => {
        event.preventDefault();
        event.returnValue = '';
      });
    window.addEventListener('unload', (event) => {
        event.preventDefault();
        event.returnValue = '';
    });
    if(this.$store.getters.getPredata){
      this.predata=this.$store.getters.getPredata
      this.$store.commit("SET_PREDATA", null);              
    }
  },
};
</script>

<style >
.el-step__icon.is-icon {
  width: 47px;
  padding: 22px !important;
  border-radius: 50% !important;
}
.el-step.is-horizontal .el-step__line {
  top: 20px !important;
}
</style>