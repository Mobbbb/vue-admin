<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNavList } from '@/api/user'
import { getProvinceCityList, getCityOperatorTree } from '@/api/common'
import { cpTranslate, cppTranslate } from '@/libs/tools'
import { checkStrong } from '@/libs/util'

export default {
    components: {
        LoginForm
    },
    methods: {
        ...mapActions([
            'handleLogin',
            'getNavList'
        ]),
        handleSubmit ({ userName, password }) {
            this.handleLogin({ userName, password }).then(res => {
                //localStorage[config.adminNavList] = []
                this.$router.push({
                    name: this.$config.homeName
                })
                this.getNavList()// 获取菜单列表
                this.getCommonData() // 获取公用信息
            })
        },
        getCommonData: function(){
            getProvinceCityList().then(response => { // 获取省、市级联列表
                let transformData = JSON.stringify(cpTranslate(response.data.data))
                localStorage.setItem('provinceCityList', transformData)
            })
            getCityOperatorTree().then(response => { // 获取省、市、运营商级联列表
                let transformData = JSON.stringify(cppTranslate(response.data.data))
                localStorage.setItem('pcOperatorList', transformData)
            })
        }
    }
}
</script>