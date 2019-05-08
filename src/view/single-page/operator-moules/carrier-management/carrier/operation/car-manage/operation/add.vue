<template>
    <div class="DM-edit">
        <div class="my-modal-wrap">
            <Form ref="formValidate" :model="params" :rules="ruleUser" :label-width="120" style="padding-right: 10px;">
                <FormItem label="状态：" v-if="type === 'edit'">
                    <div>{{params.status}}</div>
                </FormItem>
                <FormItem label="所属运营商：">
                    <div>{{carrierInfo.name}}</div>
                </FormItem>
                <FormItem label="姓名：" prop="userName">
                    <Input v-model="params.userName" placeholder="请输入姓名" :maxlength="18" :disabled="disabled"></Input>
                </FormItem>
                <FormItem label="性别：" prop="sex">
                    <RadioGroup v-model="params.sex">
                        <Radio label="1" :disabled="disabled">男</Radio>
                        <Radio label="0" :disabled="disabled">女</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="手机号：" prop="mobile">
                    <Input v-model="params.mobile" placeholder="请输入手机号" :maxlength="11" :disabled="disabled"></Input>
                </FormItem>
                <FormItem label="入职时间：" prop="startTime">
                    <DatePicker v-model="params.startTime" placeholder="请选择入职时间" :disabled="disabled"></DatePicker>
                </FormItem>
                <FormItem label="登录密码：" prop="password">
                    <Input v-model="params.password" type="password" placeholder="请输入登录密码" :disabled="disabled"></Input>
                </FormItem>
                <FormItem label="确认密码：" prop="twicePassword">
                    <Input v-model="params.twicePassword" type="password" placeholder="请再次输入密码" :disabled="disabled"></Input>
                </FormItem>
                <FormItem label="紧急联系人：" prop="linkman">
                    <Input v-model="params.linkman" placeholder="请输入紧急联系人姓名" :disabled="disabled"></Input>
                </FormItem>
                <FormItem label="紧急联系人电话：" prop="linkmobile">
                    <Input v-model="params.linkmobile" placeholder="请输入紧急联系人电话" :disabled="disabled"></Input>
                </FormItem>
                <FormItem label="备   注：" prop="remark">
                    <Input v-model="params.remark" type="textarea" placeholder="请输入备注" :disabled="disabled"></Input>
                </FormItem>
            </Form>
            <div class="popView-footer-wrap">
                <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
                <Button size="large" type="primary" @click="commit(1)" :disabled="disabled">保存</Button>
            </div>
        </div>
    </div>
</template>

<script>
import { regTest } from '@/libs/tools'

export default {
    props: {
        popView: Boolean,
        carrierInfo: Object,
        type: String,
        params: Object,
    },
    data () {
        const isNull = (rule, value, callback) => {
            if(value !== null && value !== '' && typeof(value) !== 'undefined') callback()
            else {
                switch (rule.field) {
                    case 'startTime':
                        callback(new Error('入职时间不得为空'))
                    case 'sex':
                        callback(new Error('请选择性别'))
                    default:
                        callback(new Error('未定义的错误'))
                }
            }
        }
        const mobile = (rule, value, callback) => {
            if(rule.field === 'mobile'){
                if(regTest(value, 'mobile')) callback()
                else callback(new Error('请输入正确的手机号'))
            } else if(rule.field === 'linkmobile' && value !== null && value !== '' && typeof(value) !== 'undefined'){
                if(regTest(value, 'mobile')) callback()
                else callback(new Error('请输入正确的手机号'))
            } else {
                callback()
            }
        }
        const password = (rule, value, callback) => {
            if(rule.field === 'password'){
                if(value !== null && value !== '' && typeof(value) !== 'undefined') callback()
                else callback(new Error('密码不得为空'))
            }
            if(rule.field === 'twicePassword'){
                if(value === this.params.password) callback()
                else callback(new Error('两次密码输入不一致'))
            }
        }
        return {
            disabled: false,
            ruleUser: {
                userName: [{
                    required: true, message: '姓名不得为空', trigger: 'change'
                }],
                mobile: [{
                    required: true, validator: mobile, trigger: 'change'
                }],
                startTime: [{
                    required: true, validator: isNull, trigger: 'change'
                }],
                sex: [{
                    required: true, validator: isNull, trigger: 'change'
                }],
                password: [{
                    required: true, validator: password, trigger: 'change'
                }],
                twicePassword: [{
                    required: true, validator: password, trigger: 'change'
                }],
                linkmobile: [{
                    validator: mobile, trigger: 'change'
                }]
            }
        }
    },
    watch: {
        'popView': function(){
            if(this.popView){
                this.$refs.formValidate.resetFields()
                if(this.type === 'edit'){
                    if(this.params.status === 3 || this.params.status === 2){
                        this.disabled = true
                    } else {
                        this.disabled = false
                    }
                }
            }
        }
    },
    methods: {
        commit: function(temp){
            if(temp){
                this.$refs.formValidate.validate().then(res => {
                    if(res){
                        this.$emit('on-confirm', 1)
                    }
                })                
            } else {
                this.$emit('on-confirm')
            }
        }
    }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
