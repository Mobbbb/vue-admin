<style lang="less">
  @import './login.less';
</style>

<template>
    <div class="login">
        <div class="left_bac_img">
            <img src="../../assets/images/login/loginBac.png" :height="Scheight" :style="{'marginLeft': '-150px'}">
        </div>
        <div class="login-con">
            <Card icon="log-in" bordered style="height:420px ;right: 15%;">
                <div class="title_header">
                    <p class="title_style">管理后台</p>
                </div>
                <div class="form-con">
                    <login-form @on-success-valid="handleSubmit"></login-form>
                    <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
                </div>
            </Card>
        </div>
        <Modal v-model="popChangePwdStatus" :width="600" :mask-closable="false" footer-hide title="修改初始密码">
            <ChangePwd v-model="popChangePwdStatus" :oldPwd="oldPwd" :token="token"></ChangePwd>
        </Modal>
    </div>
</template>

<script>
import LoginForm from '_c/login-form'
import ChangePwd from '@/view/change_pwd/change_pwd'
import { mapActions } from 'vuex'

export default {
    components: {
        LoginForm,
        ChangePwd
    },
    data () {
        return {
            Scheight: window.outerHeight,
            popChangePwdStatus: false,
            oldPwd: '',
            token: ''
        }
    },
    methods: {
        ...mapActions([
            'handleLogin',
            'getNavList',
            'getCommonData'
        ]),
        handleSubmit ({ userName, password }) {
            this.handleLogin({ userName, password }).then(res => {
                localStorage.setItem(this.$config.usernameStorageKey, userName)
                if (res.data.code === 4105) { // 未修改密码首次登录
                    this.oldPwd = password
                    this.token = res.data.data.access_token
                    this.popChangePwdStatus = true
                } else {
                    this.$router.push({ name: this.$config.homeName })
                    this.getNavList() // 获取菜单列表
                    this.getCommonData() // 获取公用信息
                }
            })
        }
    }
}
</script>