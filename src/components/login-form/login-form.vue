<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input
        v-model="form.userName"
        placeholder="请输入用户名"
        size="large"
        class="vue_input"
        @on-change="watchForm"
      >
        <span slot="prefix" style="line-height: 33px">
          <img src="../../assets/images/login/icon_Account@2x.png" alt width="16px" height="16px">
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input
        :type="psdType"
        v-model="form.password"
        placeholder="请输入密码"
        size="large"
        class="vue_input"
        @on-change="watchForm"
      >
        <span slot="prefix" style="line-height: 33px">
          <img src="../../assets/images/login/icon_password@2x.png" alt width="16px" height="16px">
        </span>
        <span
          slot="suffix"
          style="line-height: 33px;cursor:pointer"
          @click="changePsdType('password')"
          v-if="psdType == 'text'"
        >
          <img src="../../assets/images/login/icon_Open@2x.png" alt width="17px" height="11px">
        </span>

        <span
          slot="suffix"
          style="line-height: 33px;cursor:pointer"
          @click="changePsdType('text')"
          v-if="psdType == 'password'"
        >
          <img src="../../assets/images/login/icon_shut down@2x.png" alt width="17px" height="12px">
        </span>
      </Input>
    </FormItem>
    <div class="right_item">
      <span>忘记密码</span>
    </div>
    <FormItem>
      <div @click="handleSubmit" type="primary" long size="large" :class="loginClass">登录</div>
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: "LoginForm",
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "账号不能为空", trigger: "blur" }];
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "密码不能为空", trigger: "blur" }];
      }
    }
  },
  data() {
    return {
      form: {
        userName: "",
        password: ""
      },
      psdType: "password",
      loginClass: "orangeBtnNot"
    };
  },
  computed: {
    rules() {
      return {
        userName: this.userNameRules,
        password: this.passwordRules
      };
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$emit("on-success-valid", {
            userName: this.form.userName,
            password: this.form.password
          });
        }
      });
    },
    watchForm() {
      this.$refs.loginForm.validate(res => {
        if (res) {
          this.loginClass = "orangeBtn";
        } else {
          this.loginClass = "orangeBtnNot";
        }
      });
    },
    changePsdType(type) {
      this.psdType = type;
    }
  }
};
</script>
<style lang="less" scoped>
.right_item {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 25px;
  span {
    font-family: PingFangSC-Regular;
    cursor: pointer;
    font-size: 14px;
    color: #ff8533;
  }
}
.orangeBtnNot {
  width: 368px;
  height: 40px;
  opacity: 0.4;
  background: #ff8533;
  border-radius: 4px;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  color: #fff;
  cursor: Default;
}
.orangeBtn {
  background: #ff8533;
  width: 368px;
  height: 40px;
  border-radius: 4px;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
}
/deep/.vue_input input{
  color:#000;
}
/deep/.vue_input input:hover{
  border-color: #ffcead;
}
/deep/.vue_input input:focus{
  border-color: #ffcead;
  box-shadow:none
}
/deep/.ivu-form-item-error-tip{
  padding-top: 8px;
  font-size: 8px;
  color: #FF1A1A;
}
</style>
