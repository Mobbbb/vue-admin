<!--编辑集团||编辑子机构-->
<template>
    <div style="padding: 0 20px;">
        <Form :model="params" :label-width="80" ref="formValidate" :rules="ruleValidate">
            <FormItem label="集团名称 :" prop="name" v-if="params.type === 0">
                <Input v-model="params.name" :maxlength="20"/>
            </FormItem>
            <div v-else>
                <FormItem prop="name" label="机构名称 :" :maxlength="20">
                    <Input v-model="params.name" placeholder="请输入机构名称" />
                </FormItem>
                <FormItem prop="type" label="机构类型 :" placeholder="请选择机构类型">
                    <Select v-model="params.type">
                        <Option v-for="item in orgTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="nature" label="公司类型 :" placeholder="请选择公司类型" v-if="params.type === 1">
                    <Select v-model="params.nature">
                        <Option v-for="item in comTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="stockRatio" label="股比 :" placeholder="请输入股比" v-if="params.nature === 3 && params.type === 1"> 
                    <div class="append-input-wrap">
                        <InputNumber
                            :min="0"
                            :max="100"
                            v-model="params.stockRatio"
                            class="my-number-input"
                            placeholder="请输入"
                            :formatter="value => `${value}`"
                            :parser="value => value.replace('%', '')">
                        </InputNumber>
                        <div class="append-input">%</div>
                    </div>
                </FormItem>
                <FormItem prop="remark" label="备注 :">
                    <Input v-model="params.remark" type="textarea"  :maxlength="200" />
                </FormItem>
            </div>
        </Form>
        <div class="popView-footer-wrap">
            <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
            <Button size="large" type="primary" @click="commit(1)">确定</Button>
        </div>
    </div>
</template>

<script>
import { editOrg } from '@/api/organization'
import { orgTypeList, comTypeList } from '../index.js'

export default {
    props: ['popView', 'params'],
    data(){
        const stockRatio = (rule, value, callback) => {
            if(value !== null) callback()
            else callback(new Error('股比不得为空'))
        }
        const name = (rule, value, callback) => {
            if(this.params.type === 0 && value === '') {
                callback(new Error('集团名称不得为空'))
            } else if(this.params.type !== 0 && value === ''){
                callback(new Error('机构名称不得为空'))
            } else callback()
        }
        const type = (rule, value, callback) => {
            if(value !== null && typeof(value) !== 'undefined') callback()
            else callback(new Error('机构类型不得为空'))
        }
        const nature = (rule, value, callback) => {
            if(value !== null && typeof(value) !== 'undefined') callback()
            else callback(new Error('公司类型不得为空'))
        }
        return {
            comTypeList,
            orgTypeList,
            ruleValidate: {
                name: [{
                    required: true, trigger: 'change', validator: name
                }],
                type: [{
                    required: true, trigger: 'change', validator: type
                }],
                nature: [{
                    required: true, trigger: 'change', validator: nature
                }],
                stockRatio: [{
                    required: true, trigger: 'change', validator: stockRatio
                }]
            }
        }
    },
    watch: {
        'popView': function(){
            if(this.popView){ // 弹出弹框时
                this.$refs.formValidate.resetFields() // 重置表单校验
            }
        }
    },
    mounted(){

    },
    methods:{
        commit: function(temp){
            if(temp) {
                this.$refs.formValidate.validate().then(res => { // 表单验证通过后
                    if(res){
                        editOrg(this.params).then(res => {
                            this.$Message.success('编辑成功！')
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
<style lang="less">

</style>