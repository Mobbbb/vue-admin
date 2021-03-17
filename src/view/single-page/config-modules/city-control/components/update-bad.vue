<template>
    <div>
        <Form ref="topFormValidate" :model="topParams" :rules="topRules" :label-width="110" class="top-form">
            <FormItem label="所选城市 :">
                {{parentParams.cityName}}
            </FormItem>
            <FormItem label="业务类型 :">
                {{typeModuleMap[parentParams.businessType]}} 
            </FormItem>
            <FormItem label="策略名称 :" prop="name">
                <span v-if="!addViewStatus">{{topParams.name}}</span>
                <Input
                    :maxlength="15"
                    v-if="addViewStatus"
                    v-model="topParams.name" 
                    placeholder="请输入策略名称" 
                    style="width: 200px">
                </Input> 
            </FormItem>
            <FormItem label="生效时间 :" prop="effectiveTime">
                <span v-if="!addViewStatus">{{topParams.effectiveTime}}</span>
                <DatePicker 
                    v-model="topParams.effectiveTime" 
                    type="datetime" 
                    v-if="addViewStatus"
                    placeholder="请选择生效时间" 
                    style="width: 200px"
                    @on-change="selectDate">
                </DatePicker>
            </FormItem>
        </Form>
        <div class="form-item-title">
            <div style="width: 80px;"></div>
            <span>数值</span>
            <span>参考值</span>
        </div>
        <Form ref="formValidate" :model="params" :rules="ruleValidate" :label-width="0" class="bottom-form">
            <FormItem prop='realNameFare'>
                <div class="form-item-wrap">
                    <div class="red-start-content">实名额度</div>
                    <span v-if="!addViewStatus">{{params.realNameFare}}</span>
                    <InputNumber
                        style="width: 112px"
                        v-if="addViewStatus"
                        :min="0"
                        :max="100"
                        :precision="0"
                        v-model="params.realNameFare"
                        placeholder="请输入">  
                    </InputNumber>
                    <span>0-100</span>
                </div>
            </FormItem>
            <FormItem prop="cityFare">
                <div class="form-item-wrap">
                    <div class="red-start-content">城市级别</div>
                    <span v-if="!addViewStatus">{{params.cityFare}}</span>
                    <InputNumber
                        style="width: 112px"
                        v-if="addViewStatus"
                        :min="0"
                        :max="100"
                        :precision="0"
                        v-model="params.cityFare"
                        placeholder="请输入">  
                    </InputNumber>
                    <span>0-100</span>
                </div>
            </FormItem>
            <FormItem prop="companyFare">
                <div class="form-item-wrap">
                    <div class="red-start-content">企业员工</div>
                    <span v-if="!addViewStatus">{{params.companyFare}}</span>
                    <InputNumber
                        style="width: 112px"
                        v-if="addViewStatus"
                        :min="0"
                        :max="100"
                        :precision="0"
                        v-model="params.companyFare"
                        placeholder="请输入">  
                    </InputNumber>
                    <span>0-100</span>
                </div>
            </FormItem>
            <FormItem prop="userLevelA">
                <div class="form-item-wrap">
                    <div class="red-start-content">用户等级A</div>
                    <span v-if="!addViewStatus">{{params.userLevelA}}</span>
                    <InputNumber
                        style="width: 112px"
                        v-if="addViewStatus"
                        :min="0"
                        :max="100"
                        :precision="0"
                        v-model="params.userLevelA"
                        placeholder="请输入">  
                    </InputNumber>
                    <span>0-100</span>
                </div>
            </FormItem>
            <FormItem prop="userLevelB">
                <div class="form-item-wrap">
                    <div class="red-start-content">用户等级B</div>
                    <span v-if="!addViewStatus">{{params.userLevelB}}</span>
                    <InputNumber
                        style="width: 112px"
                        v-if="addViewStatus"
                        :min="0"
                        :max="100"
                        :precision="0"
                        v-model="params.userLevelB"
                        placeholder="请输入">  
                    </InputNumber>
                    <span>0-100</span>
                </div>
            </FormItem>
            <FormItem prop="userLevelC">
                <div class="form-item-wrap">
                    <div class="red-start-content">用户等级C</div>
                    <span v-if="!addViewStatus">{{params.userLevelC}}</span>
                    <InputNumber
                        style="width: 112px"
                        v-if="addViewStatus"
                        :min="0"
                        :max="100"
                        :precision="0"
                        v-model="params.userLevelC"
                        placeholder="请输入">  
                    </InputNumber>
                    <span>0-100</span>
                </div>
            </FormItem>
            <FormItem prop="userLevelD">
                <div class="form-item-wrap">
                    <div class="red-start-content">用户等级D</div>
                    <span v-if="!addViewStatus">{{params.userLevelD}}</span>
                    <InputNumber
                        style="width: 112px"
                        v-if="addViewStatus"
                        :min="0"
                        :max="100"
                        :precision="0"
                        v-model="params.userLevelD"
                        placeholder="请输入">  
                    </InputNumber>
                    <span>0-100</span>
                </div>
            </FormItem>
            <FormItem prop="userLevelE">
                <div class="form-item-wrap">
                    <div class="red-start-content">用户等级E</div>
                    <span v-if="!addViewStatus">{{params.userLevelE}}</span>
                    <InputNumber
                        style="width: 112px"
                        v-if="addViewStatus"
                        :min="0"
                        :max="100"
                        :precision="0"
                        v-model="params.userLevelE"
                        placeholder="请输入">  
                    </InputNumber>
                    <span>0-100</span>
                </div>
            </FormItem>
        </Form>
        <div class="popView-footer-wrap">
            <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
            <Button size="large" type="primary" @click="commit(addViewStatus)">确定</Button>
        </div>
    </div>
</template>

<script>
import { typeModuleMap } from '@/libs/status-map'
import { addBadDebt, badDebtDetail } from '@/api/openCity'
import '@/styles/cyk-style.css'

export default {
    props: [ 'value', 'parentParams' ],
    data () {
        const effectiveTime = (rule, value, callback) => {
            let date = value || null
            if (date === null) callback(new Error('请选择生效时间'))
            else {
                let timestamp = new Date(date).getTime()
                if (timestamp < Date.now()) {
                    callback(new Error('生效时间不得小于当前时间'))
                } else callback()
            }
        }
        const validateZHNum = (rule, value, callback) => {
            if (value === null) callback(new Error('请填写内容'))
            else callback()
        }
        return {
            typeModuleMap,
            addViewStatus: false,   // true：新增  false：详情
            params: {},             // 坏账策略参数
            initParams: {
                realNameFare: null,
                cityFare: null,
                companyFare: null,
                userLevelA: null,
                userLevelB: null,
                userLevelC: null,
                userLevelD: null,
                userLevelE: null
            },
            topParams: {},          // 上半部分参数
            topRules: {             // 上半部分规则校验
                name: [{required: true, message: '请输入策略名称', trigger: 'change'}],
                effectiveTime: [{required: true, trigger: 'change', validator: effectiveTime }]
            },
            ruleValidate: {         // 坏账策略规则校验
                realNameFare: [{ validator: validateZHNum, trigger: 'change' }],
                cityFare: [{ validator: validateZHNum, trigger: 'change' }],
                companyFare: [{ validator: validateZHNum, trigger: 'change' }],
                userLevelA: [{ validator: validateZHNum, trigger: 'change' }],
                userLevelB: [{ validator: validateZHNum, trigger: 'change' }],
                userLevelC: [{ validator: validateZHNum, trigger: 'change' }],
                userLevelD: [{ validator: validateZHNum, trigger: 'change' }],
                userLevelE: [{ validator: validateZHNum, trigger: 'change' }],
            }
        }
    },
    watch: {
        value () {
            if (this.value) {
                if (this.parentParams.detailUuid === null) { // 新增坏账
                    this.addViewStatus = true
                    this.params = {...this.initParams}
                    this.topParams = {}
                    this.$refs.formValidate.resetFields()
                    this.$refs.topFormValidate.resetFields()
                } else { // 坏账详情
                    this.addViewStatus = false
                    this.$refs.formValidate.resetFields()
                    this.$refs.topFormValidate.resetFields()
                    this.getDetail()
                }
            }
        }
    },
    methods: {
        getDetail () {
            badDebtDetail({ uuid: this.parentParams.detailUuid }).then(res => {
                this.params = res.data.data
                this.topParams = res.data.data
            })
        },
        selectDate (date) {
            this.params.effectiveTime = date
        },
        commit (status) {
            if (status) {
                let [temp, flag] = [false, false]
                this.$refs.topFormValidate.validate().then(res => {
                    temp = res
                    return new Promise((resolve) => { resolve() })
                }).then(() => {
                    return this.$refs.formValidate.validate().then(res => {
                        flag = res
                        return new Promise((resolve) => { resolve() })
                    })
                }).then(() => {
                    if (temp && flag) {
                        let params = {...this.params}
                        params = Object.assign(params, this.parentParams)
                        params = Object.assign(params, this.topParams)
                        params.businessType = Number(params.businessType)
                        addBadDebt(params).then(res => {
                            this.$Message.success('新建成功')
                            this.$emit('input', false)
                            this.$emit('on-confirm')
                        })
                    }
                })
            } else {
                this.$emit('input', false)
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .top-form{
        width: 310px;
        margin: 0 auto;
    }
    .form-item-title{
        display: flex;
        justify-content: space-between;
        padding: 0 40px 15px 40px;
        border-bottom: 1px solid #e8eaec;
        margin-bottom: 20px;
    }
    .form-item-wrap{
        display: flex;
        justify-content: space-between;
    }
    .red-start-content{
        width: 80px;
        vertical-align: middle;
        color: #515a6e;
        line-height: 1;
        padding: 10px 12px 10px 0;
        box-sizing: border-box;
    }
    .red-start-content:before{
        content: '*';
        display: inline-block;
        margin-right: 4px;
        margin-top: 3px;
        line-height: 1px;
        font-size: 12px;
        color: #ed4014;
        vertical-align: middle;
    }
    .bottom-form{
        padding: 0 40px;
    }
    >>>.bottom-form .ivu-form-item .ivu-form-item-content .ivu-form-item-error-tip{
         left: 163px;
    }
</style>
