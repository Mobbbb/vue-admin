<template>
  <div class="changepwd">
    <div class="formcontent">
        <div class="top_logo">
            <img :src="maxLogo" alt="" class="logostyle">
        </div>
        <div class="content_area">
            <Alert type="warning" show-icon style="margin-bottom: 20px;">
                请设置至少8位的密码，必须包含数字和大小写字母
            </Alert>
            <Form ref="formInline" :model="formInline" :rules="ruleInline" @keydown.enter.native="handleSubmit">
                <FormItem prop="oldPwd" v-show="oldPwd === ''">
                    <Input type="password" v-model="formInline.oldPwd" placeholder="旧密码" :maxlength="50">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="newPwd">
                    <Input 
                        type="password" 
                        v-model="formInline.newPwd" 
                        placeholder="新密码" 
                        :maxlength="50">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="rePwd">
                    <Input 
                        type="password" 
                        v-model="formInline.rePwd" 
                        placeholder="确认新密码" 
                        :maxlength="50">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <div style="text-align: right;">
                    <Button size="large" type="primary" @click="handleSubmit">确定</Button>
                </div>
            </Form>
        </div>
    </div>
  </div>
</template>

<script>
import maxLogo from '@/assets/images/logo.jpg'
import { mapActions } from 'vuex'
import { TOKEN_KEY, setCookie, getToken } from '@/libs/util'
import { regTest } from '@/libs/tools'

export default {
    props: {
        value: {
            type: Boolean
        },
        oldPwd: {
            type: String,
            default: ''
        },
        token: {
            type: String,
            default: ''
        }
    },
    data() {
        const newPwd = (rule, value, callback) => {
            let data = value || null
            if (data === null) callback(new Error('请输入新密码'))
            else if (data.length < 8) callback(new Error('密码长度至少8位'))
            else if (!regTest(data, 'password')) callback(new Error('新密码必须包含大小写字母和数字'))
            else if (data === this.formInline.oldPwd) callback(new Error('新密码不得与旧密码一致'))
            else callback()
        }
        const rePwd = (rule, value, callback) => {
            let data = value || null
            if (data === null) callback(new Error('请再次输入新密码'))
            else if (data !== this.formInline.newPwd) callback(new Error('两次密码输入不一致'))
            else callback()
        }
        return {
            maxLogo,
            authorization: '',
            formInline: {
                oldPwd: '',
                newPwd: '',
                rePwd: ''
            },
            ruleInline: {
                oldPwd: [ { required: true, message: '请输入旧密码', trigger: 'blur' } ],
                newPwd: [ { required: true, trigger: 'blur', validator: newPwd } ],
                rePwd: [ { required: true, trigger: 'blur', validator: rePwd } ]
            },
            forbidsubclick: true // 禁止表单重复连续提交
        }
    },
    watch: {
        value () {
            if (this.value) {
                this.$refs.formInline.resetFields()
                this.formInline = {
                    oldPwd: '',
                    newPwd: '',
                    rePwd: ''
                }
            }
        },
        oldPwd () {
            if (this.oldPwd !== '') {
                this.formInline.oldPwd = this.oldPwd
            }
        }
    },
    methods: {
        ...mapActions([
            'handleChangePwd',
            'handleLogin',
            'getUserInfo'
        ]),
        handleSubmit () {
            if (!this.forbidsubclick) { return }
            this.forbidsubclick = false
            this.$refs.formInline.validate((valid) => {
                if (valid) {
                    if (this.token === '') this.authorization = getToken()
                    else this.authorization = this.token
                    let submitdata = {
                        oldPwd: this.formInline.oldPwd,
                        newPwd: this.formInline.newPwd,
                        rePwd: this.formInline.rePwd,
                        authorization: this.authorization
                    }
                    this.handleChangePwd(submitdata).then(res => {
                        setCookie(TOKEN_KEY, '')
                        let loginData = {
                            userName: localStorage.getItem(this.$config.usernameStorageKey),
                            password: this.formInline.newPwd
                        }
                        this.forbidsubclick = true
                        this.$Message.success('修改成功！')
                        this.$emit('input', false)
                        this.handleLogin(loginData).then(res => { //  重新登录
                            this.$router.push({ name: this.$config.homeName })
                            this.getUserInfo()      // 获取用户信息
                            this.getNavList()       // 获取菜单列表
                            this.getCommonData()    // 获取公用信息
                        })
                    }).catch(err => {
                        setTimeout(() => {
                            this.forbidsubclick = true
                        }, 2500)
                    })
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
  @import './change_pwd.less';
</style>
