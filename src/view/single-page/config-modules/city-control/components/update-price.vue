<template>
    <div>
        <Form ref="formValidate" :model="params" :rules="ruleValidate" :label-width="210">
            <FormItem label="所选城市 :">
                {{parentParams.cityName}}
            </FormItem>
            <FormItem label="业务类型 :">
                {{typeModuleMap[parentParams.businessType]}} 
            </FormItem>
            <FormItem label="策略名称 :" prop="fareTypeNote">
                <span v-if="!addViewStatus">{{params.fareTypeNote}}</span>
                <Input
                    v-if="addViewStatus"
                    :maxlength="15"
                    v-model="params.fareTypeNote"
                    placeholder="请输入策略名称"
                    style="width: 200px">
                </Input> 
            </FormItem>
            <FormItem label="生效时间 :" prop="effectiveTime">
                <span v-if="!addViewStatus">{{params.effectiveTime}}</span>
                <DatePicker
                    v-if="addViewStatus"
                    v-model="params.effectiveTime" 
                    type="datetime" 
                    placeholder="请选择生效时间" 
                    style="width: 200px"
                    @on-change="selectDate"></DatePicker>
            </FormItem>
            <FormItem label="订单类型 :" prop="typeTime">
                <span v-if="!addViewStatus">{{typeTimeMap2[params.typeTime]}}用车</span>
                <Select v-if="addViewStatus" v-model="params.typeTime" placeholder="请选择订单类型" style="width: 200px">
                    <Option value="1">即时用车</Option>
                    <Option value="2">预约用车</Option>
                </Select>
            </FormItem>
            <FormItem label="起步费（元） :" prop="startFare">
                <span v-if="!addViewStatus">{{params.startFare}}</span>
                <InputNumber
                    style="width: 200px"
                    v-if="addViewStatus"
                    :min="0"
                    :formatter="value => `${Math.floor(value * 100) / 100}`"
                    v-model="params.startFare"
                    placeholder="请输入起步费">  
                </InputNumber>
            </FormItem>
            <FormItem label="起步里程（公里） :" prop="startTrip">
                <span v-if="!addViewStatus">{{params.startTrip}}</span>
                <InputNumber
                    style="width: 200px"
                    v-if="addViewStatus"
                    :min="0"
                    :formatter="value => `${Math.floor(value * 100) / 100}`"
                    v-model="params.startTrip"
                    placeholder="请输入起步里程">  
                </InputNumber>
            </FormItem>
            <FormItem label="起步时长（分钟） :" prop="startDuration">
                <span v-if="!addViewStatus">{{params.startDuration}}</span>
                <InputNumber
                    style="width: 200px"
                    v-if="addViewStatus"
                    :min="0"
                    :precision="0"
                    v-model="params.startDuration"
                    placeholder="请输入起步时长">  
                </InputNumber>
            </FormItem>
            <FormItem label="时长费（元/分钟） :" prop="beyondTimeFare">
                <span v-if="!addViewStatus">{{params.beyondTimeFare}}</span>
                <InputNumber
                    style="width: 200px"
                    v-if="addViewStatus"
                    :min="0"
                    :formatter="value => `${Math.floor(value * 100) / 100}`"
                    v-model="params.beyondTimeFare"
                    placeholder="请输入起步里程">
                </InputNumber>
            </FormItem>
            <FormItem label="里程费（元/公里） :" prop="beyondTripFare">
                <span v-if="!addViewStatus">{{params.beyondTripFare}}</span>
                <InputNumber
                    style="width: 200px"
                    v-if="addViewStatus"
                    :min="0"
                    :formatter="value => `${Math.floor(value * 100) / 100}`"
                    v-model="params.beyondTripFare"
                    placeholder="请输入起步里程">
                </InputNumber>
            </FormItem>
            <FormItem label="超时等待费（元/分钟） :">
                <span v-if="!addViewStatus">{{params.beyondWaitFare}}</span>
                <InputNumber
                    style="width: 200px"
                    v-if="addViewStatus"
                    :min="0"
                    :formatter="value => `${Math.floor(value * 100) / 100}`"
                    v-model="params.beyondWaitFare"
                    placeholder="请输入超时等待费">
                </InputNumber>
            </FormItem>

            <FormItem label="免费等待时长（分钟） :" prop="freeWaitTime">
                <span v-if="!addViewStatus">{{params.freeWaitTime}}</span>
                <InputNumber
                    style="width: 200px"
                    v-if="addViewStatus"
                    :min="0"
                    :precision="0"
                    v-model="params.freeWaitTime"
                    placeholder="请输入起步时长">
                </InputNumber>
            </FormItem>
            <FormItem label="预约单司机可迟到时间（分钟） :" prop="allowLateTime" v-if="params.typeTime === '2'">
                <span v-if="!addViewStatus">{{params.allowLateTime}}</span>
                <InputNumber
                    style="width: 200px"
                    v-if="addViewStatus"
                    :min="0"
                    :precision="0"
                    v-model="params.allowLateTime"
                    placeholder="请输入司机可迟到时间">
                </InputNumber>
            </FormItem>

            <FormItem label="远程里程（公里） :" prop="haulBackTrip">
                <span v-if="!addViewStatus">{{params.haulBackTrip}}</span>
                <InputNumber
                    style="width: 200px"
                    v-if="addViewStatus"
                    :min="0"
                    :formatter="value => `${Math.floor(value * 100) / 100}`"
                    v-model="params.haulBackTrip"
                    placeholder="请输入远程里程">  
                </InputNumber>
            </FormItem>
            <FormItem label="远程里程费（元/公里） :" prop="haulBackTripFare">
                <span v-if="!addViewStatus">{{params.haulBackTripFare}}</span>
                <InputNumber
                    style="width: 200px"
                    v-if="addViewStatus"
                    :min="0"
                    :formatter="value => `${Math.floor(value * 100) / 100}`"
                    v-model="params.haulBackTripFare"
                    placeholder="请输入远程里程费">  
                </InputNumber>
            </FormItem>
            <FormItem label="夜间费（元/公里） :" prop="nightTripFare">
                <span v-if="!addViewStatus">{{params.nightTripFare}}</span>
                <InputNumber
                    style="width: 200px"
                    v-if="addViewStatus"
                    :min="0"
                    :formatter="value => `${Math.floor(value * 100) / 100}`"
                    v-model="params.nightTripFare"
                    placeholder="请输入夜间费">
                </InputNumber>
            </FormItem>
        </Form>
        <div class="popView-footer-wrap">
            <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
            <Button size="large" type="primary" @click="commit(1)">确定</Button>
        </div>
    </div>
</template>

<script>
import { addPriceStrategy, priceStrategyDetail } from '@/api/openCity'
import { typeTimeMap2, typeModuleMap } from '@/libs/status-map'
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
        const validateNum = (rule, value, callback) => {
            if (value === null) callback(new Error('请填写内容'))
            else callback()
        }
        return {
            typeTimeMap2,
            typeModuleMap,
            addViewStatus: false,   // true：新增  false：详情
            params: {},             // 定价策略参数
            initParams: {
                typeTime: '',
                startFare: null,
                startTrip: null,
                startDuration: null,
                beyondTimeFare: null,
                beyondTripFare: null,
                beyondWaitFare: null,
                freeWaitTime: null,
                allowLateTime: null,
                haulBackTrip: null,
                haulBackTripFare: null,
                nightTripFare: null
            },
            ruleValidate: {
                fareTypeNote: [{ required: true, message: '请输入定价策略名称', trigger: 'change' }],
                effectiveTime: [{ required: true, validator: effectiveTime, trigger: 'change' }],
                typeTime: [{ required: true, message: '请选择订单类型', trigger: 'change' }],
                startFare: [{ required: true, validator: validateNum, trigger: 'change' }],
                startTrip: [{ required: true, validator: validateNum, trigger: 'change' }],
                startDuratio: [{ required: true, validator: validateNum, trigger: 'change' }],
                startDuration: [{ required: true, validator: validateNum, trigger: 'change' }],
                beyondTimeFare: [{ required: true, validator: validateNum, trigger: 'change' }],
                beyondTripFare: [{ required: true, validator: validateNum, trigger: 'change' }],

                freeWaitTime: [{ required: true, validator: validateNum, trigger: 'change' }],
                allowLateTime: [{ required: true, validator: validateNum, trigger: 'change' }],

                haulBackTrip: [{ required: true, validator: validateNum, trigger: 'change' }],
                haulBackTripFare: [{ required: true, validator: validateNum, trigger: 'change' }],
                nightTripFare: [{ required: true, validator: validateNum, trigger: 'change' }],
                premiumOneRate: [{ required: true, validator: validateNum, trigger: 'change' }],
                premiumTwoRate: [{ required: true, validator: validateNum, trigger: 'change' }]
            }
        }
    },
    watch: {
        value () {
            if (this.value) {
                if (this.parentParams.detailUuid === null) { // 新增定价
                    this.addViewStatus = true
                    this.params = {...this.initParams}
                    this.$refs.formValidate.resetFields()
                } else { // 定价详情
                    this.addViewStatus = false
                    this.$refs.formValidate.resetFields()
                    this.getDetail()
                }
            }
        }
    },
    methods: {
        getDetail () { // 获取详情信息
            priceStrategyDetail({ uuid: this.parentParams.detailUuid }).then(res => {
                this.params = res.data.data
            })
        },
        selectDate (date) {
            this.params.effectiveTime = date
        },
        commit (temp) {
            if (temp) {
                this.$refs.formValidate.validate().then(status => {
                    if (status) {
                        let params = {...this.params}
                        params = Object.assign(params, this.parentParams)
                        params.typeTime = Number(params.typeTime)
                        params.businessType = Number(params.businessType)
                        addPriceStrategy(params).then(res => {
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
    
</style>
