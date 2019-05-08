<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <div class="account-style">
          <DropdownItem style="text-align: center">姓名：{{getUserName}}</DropdownItem>
        </div>
        <!--<DropdownItem name="changePsd" style="text-align: center">修改密码</DropdownItem>-->
        <DropdownItem name="logout" style="text-align: center">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import "./user.less";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "User",
  props: {
    userAvator: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapGetters(["getUserName"])
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    handleClick(name) {
      switch (name) {
        case "logout":
          this.handleLogOut().then(() => {
            this.$router.push({
              name: "login"
            });
          });
          break;
        default:
          console.log('error!!!')
      }
    }
  }
};
</script>
