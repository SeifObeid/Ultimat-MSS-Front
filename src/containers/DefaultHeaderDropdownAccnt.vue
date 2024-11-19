<template>
  <div>
    <AppHeaderDropdown right no-caret>
      <template slot="header">
        <strong class="ml-2">{{userName}}</strong>

        <img v-bind:src="profileImage" class="img-avatar" alt style="width: 35px;" />
      </template>\
      <template slot="dropdown">
        <b-dropdown-item v-on:click="myProfile()">
          <i class="fa fa-user" /> Profile
        </b-dropdown-item>
        <b-dropdown-item v-on:click="logout()">
          <i class="fa fa-lock" /> Logout
        </b-dropdown-item>
      </template>
    </AppHeaderDropdown>
  </div>
  
  
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from "@coreui/vue";
export default {
  name: "DefaultHeaderDropdownAccnt",
  components: {
    AppHeaderDropdown
  },
  data: () => {
    return { itemsCount: 42, userName: "", profileImage: "" };
  },
  methods: {
    myProfile() {
      this.$router.push("/userManagement/UserProfile");
    },
    logout() {
      this.$store.commit("SET_USER", null);
      this.$store.commit("SET_TOKEN", null);
      this.$store.commit("SET_FIREBASETOKEN", null);
      this.$store.commit("SET_USERDATA", null);
      this.$store.commit("SET_TOKENEXPIREDATE", null);
      this.$store.commit("SET_NOTIFICATIONS", null);

      if (window.localStorage) {
        window.localStorage.setItem("user", null);
        window.localStorage.setItem("token", null);
        window.localStorage.setItem("firebaseToken", null);
        window.localStorage.setItem("userData", null);
        window.localStorage.setItem("TokenExpireDate", null);
        window.localStorage.setItem("roles", null);
      }

      this.$router.push("/login");
    },
    getData() {
      if (JSON.parse(localStorage.userData)) {
        let userData = JSON.parse(localStorage.userData);
        this.userName = userData.firstName + " " + userData.lastName;
        this.profileImage = userData.profileImage;
      }
    }
  },

  created: function() {
    setTimeout(() => {
      this.getData();
    }, 1000);
  }
};
</script>
