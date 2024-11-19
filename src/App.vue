<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "app"
};
</script>

<style lang="scss">
// CoreUI Icons Set
@import "~@coreui/icons/css/coreui-icons.min.css";
/* Import Font Awesome Icons Set */
$fa-font-path: "~font-awesome/fonts/";
@import "~font-awesome/scss/font-awesome.scss";
/* Import Simple Line Icons Set */
$simple-line-font-path: "~simple-line-icons/fonts/";
@import "~simple-line-icons/scss/simple-line-icons.scss";
/* Import Flag Icons Set */
@import "~flag-icon-css/css/flag-icon.min.css";
/* Import Bootstrap Vue Styles */
@import "~bootstrap-vue/dist/bootstrap-vue.css";
// Import Main styles for this application
@import "assets/scss/style";

.b-table-sticky-header,
.table-responsive,
[class*="table-responsive-"] {
  margin-bottom: 0;
}

.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}
.form-group {
  margin-bottom: 5px;
}

@media (min-width: 992px) {
  .sidebar-minimized .sidebar .nav-dropdown-items .nav-item .nav-link {
    padding-left: 5px;
  }
}
</style>
