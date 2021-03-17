<template>
    <div style="padding-right: 20px;">
        <Form ref="formValidate" :model="params" :rules="rules" :label-width="130">
            <FormItem label="支付方式 :" prop="payChannel" placeholder="请选择支付方式">
                <Select v-model="params.payChannel" style="width: 200px;" v-if="popviewType === 'add'">
                    <Option value="1">支付宝</Option>
                    <Option value="2">微信</Option>
                    <Option value="3">一网通</Option>
                </Select>
                <Input :value="payChannelMap[params.payChannel]" readonly v-else></Input>
            </FormItem>
            <FormItem label="支付方式展示名称: " prop="payName">
                <Input v-model="params.payName" placeholder="请输入支付方式展示名称" :maxlength="14" @on-blur="inputName(0)"></Input> 
            </FormItem>
            <FormItem label="优惠文案: ">
                <Input v-model="params.preferentialText" placeholder="请输入优惠文案" :maxlength="22" @on-blur="inputName(1)"></Input>
            </FormItem>
        </Form>
        <div class="popView-footer-wrap">
            <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
            <Button size="large" type="primary" @click="commit(1)">确定</Button>
        </div>
    </div>
</template>

<script>
import '@/styles/cyk-style.css'
import { payChannelMap } from './index.js'
import { changePaywayStatus, addPayway } from '@/api/finance'

export default {
    props: ['value', 'parentParams'],
    data () {
        return {
            payChannelMap,
            popviewType: '',
            params: {},
            rules: {
                payChannel:[{
                    required: true, trigger: 'change', message: '支付方式不得为空'
                }],
                payName:[{
                    required: true, trigger: 'change', message: '支付方式展示名称不得为空'
                }]
            }
        }
    },
    watch: {
        'value' () {
            if (this.value) {
                this.popviewType = this.parentParams.uuid || 'add'
                this.$refs.formValidate.resetFields()
                if (this.popviewType === 'add') { // 新建
                    this.params = {}
                } else { // 编辑
                    this.params = JSON.parse(JSON.stringify(this.parentParams))
                    this.params.payChannel = this.params.payChannel.toString()
                }
            }
        }
    },
    methods: {
        inputName (type) {
            let reg = /[~!！￥……（）——@“”《》？#$%^&*()/\|，。、：；‘’【】,.<>?"'();:_+=\[\]{}-]/g // 特殊符号正则匹配
            if (type) this.params.preferentialText = this.params.preferentialText.replace(reg, '')
            else this.params.payName = this.params.payName.replace(reg, '')
        },
        commit (temp) {
            if(temp) {
                this.$refs.formValidate.validate(res => {
                    if(res) {
                        let params = {...this.params}
                        params.payChannel = Number(params.payChannel)
                        if (this.popviewType === 'add') { // 新建
                            addPayway(this.params).then(res => {
                                this.$Message.success('创建成功')
                                this.$emit('input', false)
                                this.$emit('on-confirm')
                            })
                        } else { // 编辑
                            changePaywayStatus(this.params).then(res => {
                                this.$Message.success('编辑成功')
                                this.$emit('input', false)
                                this.$emit('on-confirm')
                            })
                        }
                    }
                })
            }
            else this.$emit('input', false)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    
</style>
