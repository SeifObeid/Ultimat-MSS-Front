// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'core-js/es6/promise'
import 'core-js/es6/string'
import 'core-js/es7/array'
// import cssVars from 'css-vars-ponyfill'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import store from './store/store'
import {router} from './router'
import i18n from './lang/lang'
import VeeValidate from 'vee-validate';
import VueResource from 'vue-resource'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css';
import 'fullcalendar/dist/fullcalendar.css';
import RoundValueInput from './components/custom/RoundValueInput';
import "@/google/firebaseMessaging";
// import XLSX from 'xlsx'
//window.$ = require('jquery')

// todo
// cssVars()

Number.prototype.toFixedDown = function(digits) {
  var dec = Math.pow(10, digits);
     return parseInt(this * dec) / dec;
};

Vue.use(BootstrapVue);
Vue.use(VeeValidate);
Vue.use(VueResource);
Vue.use(Element, { locale });
Vue.component('rounded-input', RoundValueInput);

// Check local storage to handle refreshes
if (window.localStorage) {
  var localUserString = window.localStorage.getItem('user') || 'null';
  var tokenString = window.localStorage.getItem('token')
  var localUser = localUserString;
  if (localUser && store.state.user !== localUser) {
    store.commit('SET_USER', localUser);
    
  }
  store.commit('SET_TOKEN', tokenString);
  store.commit('SET_FIREBASETOKEN', window.localStorage.getItem('firebaseToken'));
  // store.commit('SET_TOKENEXPIREDATE', window.localStorage.getItem('TokenExpireDate'));

  var localUserDataString=window.localStorage.getItem('userData') || 'null'
  if(localUserDataString){
    var localUserData=JSON.parse(localUserDataString);
    store.commit('SET_USERDATA', localUserData);
  }
  // else{
  //   router.push({path:'/'});
  // }
  
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store:store,
  router:router,
  i18n,
  template: '<App/>',
  components: {
    App
  }
})
