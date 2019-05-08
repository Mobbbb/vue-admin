<template>
  <div class="changepwd">
    <div class="formcontent">
        <div class="top_logo">
            <img :src="maxLogo" alt="" class="logostyle">
        </div>
        <h2 class="titlefont">修改密码</h2>
        <div class="content_area">
            <Form ref="formInline" :model="formInline" :rules="ruleInline" block @keydown.enter.native="handleSubmit('formInline')">
                <FormItem prop="userAccount">
                    <Input type="text" v-model="formInline.userAccount" placeholder="用户名">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="oldPwd">
                    <Input type="password" v-model="formInline.oldPwd" placeholder="旧密码">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="newPwd">
                    <Input type="password" v-model="formInline.newPwd" placeholder="新密码">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="rePwd">
                    <Input type="password" v-model="formInline.rePwd" placeholder="确认新密码">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formInline')" long>提交</Button>
                </FormItem>
            </Form>
        </div>
    </div>
  </div>
</template>
<script>
import maxLogo from '@/assets/images/logo.png'
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex'
import {
    deleteCookie
} from '@/libs/util'
export default {
    data() {
        return {
            maxLogo: '',
            formInline: {
                    oldPwd: '',
                    newPwd: '',
                    rePwd: '',
                    userAccount: ''
                },
            ruleInline: {
                userAccount: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                oldPwd: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' }
                ],
                newPwd: [
                    { required: true, message: '请输入新密码', trigger: 'blur' }
                ],
                rePwd: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' }
                ]
            },
            forbidsubclick: true // 禁止表单重复连续提交
        }
    },
    mounted() {
        this.maxLogo = maxLogo
        this.formInline.userAccount = this.userAccount? this.userAccount : ''
    },
    computed: {
        ...mapGetters([
            'userAccount'
        ])
    },
    methods: {
        ...mapActions([
            'handleChangePwd',
            'handleLogin',
            'getUserInfo'
        ]),
        handleSubmit(name) {
            if (!this.forbidsubclick) { return }
            this.forbidsubclick = false
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let submitdata = {
                        userAccount: this.formInline.userAccount,
                        oldPwd: this.formInline.oldPwd,
                        newPwd: this.formInline.newPwd,
                        rePwd: this.formInline.rePwd
                    }
                    this.handleChangePwd(submitdata).then(res => {
                        this.forbidsubclick = true
                        deleteCookie('token')
                        this.$Message.success(res.data.msg)
                        this.handleLogin({ userName: this.formInline.userAccount, password: this.formInline.newPwd }).then(res => {
                            this.getUserInfo().then(res => {
                                this.$router.push({
                                    name: this.$config.homeName
                                })
                            })
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
<style lang="less">
  @import './change_pwd.less';
</style>
