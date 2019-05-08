<!--编辑司管-->
<template>
    <div class="DM-edit">
        <div class="my-modal-wrap">
            <Form ref="formValidate" :model="params" :rules="ruleUser" :label-width="85">
                <FormItem label="姓名：" prop="realName">
                    <Input v-model="params.realName" placeholder="请输入姓名" :maxlength="18"></Input>
                </FormItem>
                <FormItem label="手机号：" prop="mobile">
                    <Input v-model="params.mobile" placeholder="请输入手机号" :maxlength="11"></Input>
                </FormItem>
                <FormItem label="职级：" prop="position">
                    <Input v-model="params.position" placeholder="请输入职级" :maxlength="18"></Input>
                </FormItem>
                <FormItem label="入职时间：" prop="joinTime">
                    <DatePicker v-model="params.joinTime" placeholder="请选择入职时间"></DatePicker>
                </FormItem>
            </Form>
            <div class="popView-footer-wrap">
                <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
                <Button size="large" type="primary" @click="commit(1)">确定</Button>
            </div>
        </div>
    </div>
</template>

<script>
import { regTest } from '@/libs/tools'
import { updateDriverM } from '@/api/operator-carrier.js' 

export default {
    props: {
        rowNum: {
            default: '',
            type: String
        },
        popView: Boolean,
        params: Object
    },
    data () {
        const isNull = (rule, value, callback) => {
            if(value !== null && value !== '') callback()
            else {
                switch (rule.field) {
                    case 'joinTime':
                        callback(new Error('入职时间不得为空'))
                    default:
                        callback(new Error('未定义的错误'))
                } 
            }
        }
        const mobile = (rule, value, callback) => {
            if(regTest(value, 'mobile')) callback()
            else callback(new Error('请输入正确的手机号'))
        }
        return {
            ruleUser: {
                realName: [{
                    required: true, message: '姓名不得为空', trigger: 'change'
                }],
                mobile: [{
                    required: true, validator: mobile, trigger: 'change'
                }],
                position: [{
                    required: true, message: '职级不得为空', trigger: 'change'
                }],
                joinTime: [{
                    required: true, validator: isNull, trigger: 'change'
                }]
            }
        }
    },
    watch: {
        'popView': function(){
            if(this.popView){
                this.$refs.formValidate.resetFields()
            }
        }
    },
    mounted(){

    },
    methods: {
        commit: function(temp){
            if(temp){
                this.$refs.formValidate.validate().then(res => {
                    if(res){
                        let params = JSON.parse(JSON.stringify(this.params))
                        params.joinTime = this.$moment(params.joinTime).format('YYYY-MM-DD')
                        params.joinTime = Date.parse(params.joinTime)
                        updateDriverM(params).then(res => {
                            this.$Message.success('修改成功！')
                            this.$emit('on-confirm', 1)
                        })
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
