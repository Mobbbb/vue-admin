<template>
    <div class="popView" v-show="popView">
        <div class="ivu-modal-mask"></div>
        <div class="popView-wrap" :style="{'top': top + 'px'}">
            <div class="popView-content" :style="{'width': width + 'px'}">
                <div class="popView-title-wrap" :style="{'width': width + 'px','top': top + 'px'}">
                    <span class="popView-title">{{title}}</span>
                    <div class="popView-icon">
                        <Icon class="close-icon" type="md-close" @click="commit(0)"/>
                    </div>
                </div>
                <div class="popView-body-wrap">
                    <Form ref="formValidate" :model="params" :rules="ruleUser" :label-width="90">
                        <FormItem label="用户账号：" prop="userAccount">
                            <Input v-model="params.userAccount" placeholder="请输入用户账号" :maxlength="18" :disabled="disable"></Input>
                        </FormItem>
                        <FormItem label="姓名：" prop="userName">
                            <Input v-model="params.userName" placeholder="请输入姓名" :maxlength="10"></Input>
                        </FormItem>
                        <FormItem label="手机号：" prop="userMobile">
                            <Input v-model="params.userMobile" placeholder="请输入手机号" :maxlength="11"></Input>
                        </FormItem>
                        <FormItem label="角色：" prop="userRole">
                            <Select v-model="params.userRole" class="popView-input" multiple>
                                <Option v-for="item in roleList" :value="item.uuid" :key="item.uuid">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                    <Form ref="groupValidate" :model="params" :rules="ruleGroup" :label-width="90">
                        <FormItem label="所属分组：" prop="userGroupId">
                            <div class="popView-input">
                                <div class="clickInput remodel-placeholder ivu-input" @click="popGroupView" v-if="params.groupName === ''">请选择分组</div>
                                <div class="clickInput ivu-input" v-else @click="popGroupView">{{params.groupName}}</div>
                            </div>
                            <Choose
                                style="line-height: normal;"
                                @on-confirm="getParentGroup"
                                :popView="popGroup"
                                :width='400'>   
                            </Choose>
                        </FormItem>
                    </Form>
                    <div class="popView-footer-wrap">
                        <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
                        <Button size="large" type="primary" @click="commit(1)">确定</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { saveUser, updateUser } from '@/api/power-data'
import Choose from '../../choose-group.vue'
import '@/styles/cyk-style.css'

export default {
    components: {
        Choose
    },
    props: {
        popView: Boolean,
        width: Number,
        top: {
            default: 200,
            type: Number
        },
        title: {
            default: '新建弹窗',
            type: String
        },
        params: {
            default: {},
            type: Object
        },
        roleList: {
            default: () => [],
            type: Array
        }
    },
    data () {
        const accountPass = (rule, value, callback) => {
            if(value !== null && value !== ''){
                if (value.length < 6) callback(new Error('用户名不得小于六位'))
                else callback()
            } else {
                callback(new Error('用户名不得为空'))
            } 
        }
        const mobilePass = (rule, value, callback) => {
            if(!/^1(3|4|5|7|8)\d{9}$/.test(value)) callback(new Error('请输入正确的手机号'))
            else callback()
        }
        const groupPass = (rule, value, callback) => {
            if(value === '' || value === null) callback(new Error('请选择分组'))
            else callback()
        }
        const rolePass = (rule, value, callback) => {
            if(!value.length) callback(new Error('请选择角色'))
            else callback()
        }
        return {
            disable: false,
            popGroup: false,
            ruleGroup: {
                userGroupId: [{
                    required: true, validator: groupPass, trigger: 'change'
                }]
            },
            ruleUser: {
                userAccount: [{
                    required: true, validator: accountPass, trigger: 'change'
                }],
                userName: [{
                    required: true, trigger: 'change', message: '姓名不得为空'
                }],
                userMobile: [{
                    required: true, validator: mobilePass, trigger: 'change'
                }],
                userRole: [{
                    required: true, validator: rolePass, trigger: 'change'
                }]
            }
        }
    },
    watch : {
        'popView': function(){
            if(this.popView){ // 弹出窗口时
                this.$refs.formValidate.resetFields()
                this.$refs.groupValidate.resetFields()
                if(this.params.type === 'add'){
                    this.disable = false
                } else {
                    this.disable = true
                }
            }
        },
    },
    methods: {
        getParentGroup: function(data){
            this.popGroup = false
            if(data !== 0){
                this.params.groupName = data.groupName
                this.params.userGroupId = data.uuid
            }
            this.$refs.groupValidate.validate()
        },
        popGroupView: function(){
            this.popGroup = true
        },
        commit: function(temp){
            if(temp){
                this.$refs.formValidate.validate().then(res1 => {
                    this.$refs.groupValidate.validate().then(res2 => {
                        if(this.params.type === 'add' && res1 && res2){
                            saveUser(this.params).then(res => {
                                if(res.data.success){
                                    this.$Message.success('添加成功!')
                                    this.$emit('on-confirm', 1)
                                }
                            })
                        } 
                        if(this.params.type === 'edit' && res1 && res2){
                            updateUser(this.params).then(res => {
                                if(res.data.success){
                                    this.$Message.success('修改成功!')
                                    this.$emit('on-confirm', 1)
                                }
                            })
                        }
                    })
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
    .popView-name-required:before{
        content: '*';
        box-sizing: border-box;
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-size: 12px;
        color: #ed4014;
    }
    .remodel-placeholder{
        color: rgb(201,204,209);
    }
    .popView-body-row{
        padding-right: 0;
    }
    .popView-name{
        width: 90px;
        padding-right: 12px;
        font-weight: 400;
    }
</style>
