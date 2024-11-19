<template>
  <div class="container">
    <div>
      <div v-show="currentstep == 1">
        <h3>Step 1</h3>
        <div class="form-group">
          <label>Email address</label>
          <input
            type="email"
            name="email"
            class="form-control"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />
          <small
            id="emailHelp"
            class="form-text text-muted"
          >We'll never share your email with anyone else.</small>
        </div>
        <div class="form-group">
          <label f>Password</label>
          <input
            type="password"
            name="password"
            class="form-control"
            placeholder="Password"
            autocomplete="off"
          />
        </div>
      </div>

      <div v-show="currentstep == 2">
        <h3>Step 2</h3>
        <div class="form-group">
          <label>Example select</label>
          <select class="form-control" name="select">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
        </div>
      </div>

      <div v-show="currentstep == 3">
        <h3>Step 3</h3>
        <div class="form-group">
          <label>Example textarea</label>
          <textarea class="form-control" name="textarea" rows="4"></textarea>
        </div>
        <div class="form-group">
          <label>File input</label>
          <input type="file" class="form-control-file" name="file" aria-describedby="fileHelp" />
          <small
            id="fileHelp"
            class="form-text text-muted"
          >This is some placeholder block-level help text for the above input. It's a bit lighter and easily wraps to a new line.</small>
        </div>
      </div>

      <step
        v-for="step in steps"
        :currentstep="currentstep"
        :key="step.id"
        :step="step"
        :stepcount="steps.length"
        @step-change="stepChanged"
      ></step>

      <script type="x-template" id="step-navigation-template">
  <ol class="step-indicator">
      <li v-for="step in steps" is="step-navigation-step" :key="step.id" :step="step" :currentstep="currentstep">
      </li>
  </ol>
      </script>

      <script type="x-template" id="step-navigation-step-template">
  <li :class="indicatorclass">
      <div class="step"><i :class="step.icon_class"></i></div>
      <div class="caption hidden-xs hidden-sm">Step <span v-text="step.id"></span>: <span v-text="step.title"></span></div>
  </li>
      </script>

      <script type="x-template" id="step-template">
  <div class="step-wrapper" :class="stepWrapperClass">
      <button type="button" class="btn btn-primary" @click="lastStep" :disabled="firststep">
          Back
      </button>
      <button type="button" class="btn btn-primary" @click="nextStep" :disabled="laststep">
          Next
      </button>
      <button type="submit" class="btn btn-primary" v-if="laststep">
          Submit
      </button>
  </div>
      </script>
    </div>
  </div>
</template>

<script type='text/javascript'>
Vue.component("step-navigation-step", {
  template: "#step-navigation-step-template",

  props: ["step", "currentstep"],

  computed: {
    indicatorclass() {
      return {
        active: this.step.id == this.currentstep,
        complete: this.currentstep > this.step.id
      };
    }
  }
});

Vue.component("step-navigation", {
  template: "#step-navigation-template",

  props: ["steps", "currentstep"]
});

Vue.component("step", {
  template: "#step-template",

  props: ["step", "stepcount", "currentstep"],

  computed: {
    active() {
      return this.step.id == this.currentstep;
    },

    firststep() {
      return this.currentstep == 1;
    },

    laststep() {
      return this.currentstep == this.stepcount;
    },

    stepWrapperClass() {
      return {
        active: this.active
      };
    }
  },

  methods: {
    nextStep() {
      this.$emit("step-change", this.currentstep + 1);
    },

    lastStep() {
      this.$emit("step-change", this.currentstep - 1);
    }
  }
});

export default {
  data() {
    return {
      currentstep: 1,

      steps: [
        {
          id: 1,
          title: "Personal",
          icon_class: "fa fa-user-circle-o"
        },
        {
          id: 2,
          title: "Details",
          icon_class: "fa fa-th-list"
        },
        {
          id: 3,
          title: "Send",
          icon_class: "fa fa-paper-plane"
        }
      ]
    };
  },

  methods: {
    stepChanged(step) {
      this.currentstep = step;
    }
  }
};
</script>

<style scoped>
@import "https://fonts.googleapis.com/css?family=Roboto";
.step-wrapper {
  padding: 20px 0;
  display: none;
}
.step-wrapper.active {
  display: block;
}

.step-indicator {
  border-collapse: separate;
  display: table;
  margin-left: 0px;
  position: relative;
  table-layout: fixed;
  text-align: center;
  vertical-align: middle;
  padding-left: 0;
  padding-top: 20px;
}
.step-indicator li {
  display: table-cell;
  position: relative;
  float: none;
  padding: 0;
  width: 1%;
}
.step-indicator li:after {
  background-color: #ccc;
  content: "";
  display: block;
  height: 1px;
  position: absolute;
  width: 100%;
  top: 32px;
}
.step-indicator li:after {
  left: 50%;
}
.step-indicator li:last-child:after {
  display: none;
}
.step-indicator li.active .step {
  border-color: #4183d7;
  color: #4183d7;
}
.step-indicator li.active .caption {
  color: #4183d7;
}
.step-indicator li.complete:after {
  background-color: #87d37c;
}
.step-indicator li.complete .step {
  border-color: #87d37c;
  color: #87d37c;
}
.step-indicator li.complete .caption {
  color: #87d37c;
}
.step-indicator .step {
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #ccc;
  color: #ccc;
  font-size: 24px;
  height: 64px;
  line-height: 64px;
  margin: 0 auto;
  position: relative;
  width: 64px;
  z-index: 1;
}
.step-indicator .step:hover {
  cursor: pointer;
}
.step-indicator .caption {
  color: #ccc;
  padding: 11px 16px;
}
</style>