<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <div class="account-style">
          <DropdownItem style="text-align: center">姓名：{{getUserName}}</DropdownItem>
        </div>
        <DropdownItem name="changePsd" style="text-align: center">修改密码</DropdownItem>
        <DropdownItem name="logout" style="text-align: center">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal v-model="popChangePwdStatus" :width="600" :mask-closable="false" footer-hide title="修改密码">
        <ChangePwd v-model="popChangePwdStatus"></ChangePwd>
    </Modal>
  </div>
</template>

<script>
import "./user.less"
import ChangePwd from '@/view/change_pwd/change_pwd'
import { mapActions, mapGetters } from "vuex"

export default {
  name: "User",
  components: {
    ChangePwd
  },
  props: {
    userAvator: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      popChangePwdStatus: false
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
            this.$router.push({ name: "login" })
          })
          break
        case "changePsd":
          this.popChangePwdStatus = true
      }
    }
  }
}
</script>
