<template>
  <el-input v-model="displayValue" size="mini" autocomplete="off" @change="focusOut"></el-input>
</template>
<script>
export default {
  props: ["value"],
  data: function () {
    return {
      realValue: this.value,
      displayValue: this.value.toString(),
      isInputActive: false,
    };
  },
  watch: {
    value: {
      handler(v) {
        this.realValue = v;
        if(isNaN(v)){
            this.displayValue = "";
        }else{
            this.displayValue = parseFloat(v).toFixed(2);
        }
      },
    },
  },
  // computed: {
  //   displayValue: {
  //     get: function() {
  //       return this.realValue.toFixed(2);
  //     },
  //     set: function(modifiedValue) {
  //       this.realValue = parseFloat(modifiedValue);
  //       this.$emit('input', this.realValue);
  //       return modifiedValue;
  //     }
  // }},
  methods: {
    focusOut() {
      var newValue = parseFloat(this.displayValue);
      this.realValue = newValue;
       if(isNaN(newValue)){
           this.displayValue = "";
       }else{
           this.displayValue = newValue.toFixed(2);
       }
      this.$emit("input", this.realValue);
    },
    focusIn() {
      // let newValue = parseFloat(modifiedValue);
      // if (isNaN(newValue)) {
      // newValue = 0
      // }
    },
  },
};
</script>