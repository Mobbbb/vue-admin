<template>
    <div>
        <div class="edit-discount-header">
            <Form ref="topFormValidate" :model="topParams" :rules="topRules" :label-width="110" class="top-form">
                <FormItem label="所选城市 :">
                    {{parentParams.cityName}}
                </FormItem>
                <FormItem label="业务类型 :">
                    {{typeModuleMap[parentParams.businessType]}} 
                </FormItem>
                <FormItem label="折扣矩阵名称 :" prop="ruleName">
                    <span v-if="!addViewStatus">{{topParams.ruleName}}</span>
                    <Input
                        :maxlength="15"
                        v-if="addViewStatus"
                        v-model="topParams.ruleName"
                        placeholder="请输入折扣矩阵名称"
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
                <FormItem label="订单类型 :" prop="typeTime">
                    <span v-if="!addViewStatus">{{typeTimeMap2[topParams.typeTime]}}用车</span>
                    <Select
                        v-if="addViewStatus"
                        v-model="topParams.typeTime"
                        placeholder="请选择订单类型"
                        style="width:200px">
                        <Option value="1">即时用车</Option>
                        <Option value="2">预约用车</Option>
                    </Select>
                </FormItem>
            </Form>
            <Button type="dashed" @click="addConfig" class="edit-discount-btn" v-show="addViewStatus">添加折扣时段</Button>
        </div>
        <div v-show="loading" style="height: 70px;position: relative;">  
            <Spin fix>
                <Icon type="ios-loading" size=20 class="table-spin-icon-load"></Icon>
                <div style="margin-top: 5px;">加载中...</div>
            </Spin>
        </div>
        <div v-show="!loading" style="padding: 0 20px;">
            <!--详情页面&&无数据-->
            <div class="no-data-text" v-show="!addViewStatus && !params.discountList.length">
                <div>暂无数据</div>
            </div>
            <!--详情页面&&有数据-->
            <div class="discount-form-wrap" v-show="!addViewStatus && params.discountList.length">
                <div class="display-content" v-for="(item, index) in params.discountList" :key="index">
                    <div>折扣时段{{index + 1}} ：{{item.startTime}} - {{item.endTime}}</div>
                    <div style="margin-top: 10px;">折扣系数{{index + 1}} ：{{item.rate}}</div>
                </div>
            </div>
            <!--新增页面-->
            <Form
                v-show="addViewStatus"
                :model="params" 
                :label-width="80"
                ref="formValidate"
                class="discount-form-wrap">
                <FormItem
                    v-for="(item, index) in params.discountList"
                    :key="index"
                    :prop="'discountList.' + index"
                    :label-width="0"
                    :rules="ruleValidate"
                    style="width: 330px;">
                    <div style="margin-bottom: 10px;">
                        <span>折扣时段{{index + 1}} ：</span>
                        <TimePicker
                            :placement="index%2 === 0 ? 'bottom-start' : 'bottom-end'"
                            :value="item.startTime"
                            format="HH:mm:ss"
                            placeholder="请选择起始折扣时段"
                            @on-open-change="openTimePicker(index)"
                            @on-change="selectStartTime"
                            style="width: 120px;">
                        </TimePicker>
                        <span> - </span>
                        <TimePicker
                            :placement="index%2 === 0 ? 'bottom-start' : 'bottom-end'"
                            :value="item.endTime"
                            format="HH:mm:ss"
                            placeholder="请选择结束折扣时段"
                            @on-open-change="openTimePicker(index)"
                            @on-change="selectEndTime"
                            style="width: 120px;">
                        </TimePicker>
                    </div>
                    <div>
                        <span>折扣系数{{index + 1}} ：</span>
                        <InputNumber
                            v-model="item.rate"
                            :max="1"
                            :min="0"
                            :formatter="value => `${Math.floor(value * 100) / 100}`"
                            placeholder="请输入折扣系数">
                        </InputNumber>
                        <span class="iconfont icon-delete" @click="deleteConfig(index)"></span>
                    </div>
                </FormItem>
            </Form>
        </div>
        <div class="popView-footer-wrap">
            <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
            <Button size="large" type="primary" @click="commit(addViewStatus)">确定</Button>
        </div>
    </div>
</template>

<script>
import { addDiscount, discountDetail } from '@/api/openCity'
import { typeModuleMap, typeTimeMap2 } from '@/libs/status-map'
import { hasTimesection } from '@/libs/tools.js'
import '@/styles/icon-font/iconfont.css'
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
        const discountList = (rule, value, callback) => {
            /*
            * @param {Array} value 当前校验项
            * @param {Array} arr   除当前项之外折扣时段集合
            */
            let index = Number(rule.fullField.substring(rule.fullField.length - 1))
            let arr = JSON.parse(JSON.stringify(this.params.discountList))
            let [temp, flag] = [true, true]
            let arrTemp = []
            arr.splice(index, 1)
            if (value.startTime === '' || value.endTime === '' || value.rate === null) {
                callback(new Error('请填写折扣时段及系数'))
                flag = false
            }
            if (value.startTime === value.endTime) {
                callback(new Error('起始时段不可等于结束时段'))
                temp = false
            }
            if (value.rate === 0) {
                callback(new Error('折扣系数不可为0'))
                flag = false
            }
            for (let i = 0; i < arr.length; i++) { // 拆分跨零点的时间段
                let startTimestamp = new Date('2000-01-10 ' + arr[i].startTime)
                let endTimestamp = new Date('2000-01-10 ' + arr[i].endTime)
                if (startTimestamp > endTimestamp) { // 跨零点的时间段
                    // 拆分为两个时间段
                    arrTemp.push({ // 第一天的起始时间至0点
                        startTime: arr[i].startTime,
                        endTime: '23:59:59'
                    })
                    arrTemp.push({ // 0点至第二天的结束时间
                        startTime: '00:00:00',
                        endTime: arr[i].endTime
                    })
                    arr.splice(i, 1)
                    i --
                }
            }
            arrTemp.forEach(item => { arr.push(item) })
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].endTime !== '' && arr[i].startTime !== '' && 
                    value.endTime !== '' && value.startTime !== '') {

                    let validateTime = []
                    let startTimestamp = new Date('2000-01-10 ' + value.startTime)
                    let endTimestamp = new Date('2000-01-10 ' + value.endTime)

                    if (startTimestamp > endTimestamp) { // 跨零点的时间段
                        // 拆分为两个时间段
                        validateTime.push([value.startTime, '23:59:59']) // 第一天的起始时间至0点
                        validateTime.push(['00:00:00', value.endTime])   // 0点至第二天的结束时间
                    } else { // 正常时间
                        validateTime.push([value.startTime, value.endTime])
                    }
                    validateTime.forEach(item => {
                        if (!hasTimesection(item, [arr[i].startTime, arr[i].endTime])) temp = false
                    }) 
                }
            }
            if(!temp) callback(new Error('折扣时段不可交叉'))
            if(temp && flag) callback()
        }
        return {
            typeTimeMap2,
            typeModuleMap,
            loading: true,
            addViewStatus: true,    // true：新增  false：详情
            calendarIndex: '',      // 当前选中的矩阵框index
            params: {},             // 折扣矩阵参数
            topParams: {},          // 上半部分参数
            ruleValidate: {required: true, validator: discountList, trigger: 'change'}, // 矩阵规则校验
            topRules: {                     // 上半部分规则校验
                ruleName: [{required: true, message: '请输入折扣矩阵名称', trigger: 'change'}],
                effectiveTime: [{required: true, trigger: 'change', validator: effectiveTime }],
                typeTime: [{required: true, message: '请选择订单类型', trigger: 'change'}]
            }
        }
    },
    watch: {
        value () {
            if (this.value) {
                if(this.parentParams.detailUuid === null) { // 新增折扣矩阵
                    this.addViewStatus = true
                    this.loading = false
                    this.params = {
                        discountList: [{
                            startTime: '',
                            endTime: '',
                            rate: 0
                        }]
                    }
                    this.topParams = {}
                    this.$refs.topFormValidate.resetFields()
                    this.$refs.formValidate.resetFields()
                } else { // 折扣矩阵详情
                    this.addViewStatus = false
                    this.$refs.topFormValidate.resetFields()
                    this.$refs.formValidate.resetFields()
                    this.getDetail()
                }
            }
        }
    },
    methods: {
        getDetail () {
            this.loading = true
            discountDetail({ uuid: this.parentParams.detailUuid }).then(res => {
                this.loading = false
                this.params.discountList = JSON.parse(res.data.data.content)
                this.topParams = res.data.data
            })
        },
        selectDate (date) {
            this.params.effectiveTime = date
        },
        commit (status) { // 点击保存
            if(status){
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
                        let params = { content: [...this.params.discountList] }
                        params = Object.assign(params, this.parentParams)
                        params = Object.assign(params, this.topParams)
                        params.businessType = Number(params.businessType)
                        params.typeTime = Number(params.typeTime)
                        addDiscount(params).then(res => {
                            this.$Message.success('保存成功！')
                            this.$emit('input', false)
                            this.$emit('on-confirm') 
                        })
                    }
                })
            } else this.$emit('input', false)
        },
        openTimePicker: function(index){
            this.calendarIndex = index
        },
        selectStartTime (date) {
            this.params.discountList[this.calendarIndex].startTime = date
        },
        selectEndTime (date) {
            this.params.discountList[this.calendarIndex].endTime = date
        },
        deleteConfig: function(index){
            this.params.discountList.splice(index, 1)
        },
        addConfig: function(){
            this.params.discountList.push({
                startTime: '',
                endTime: '',
                rate: 0
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    .top-form{
        width: 310px;
        margin: 0 auto;
    }
    .discount-wrap{
        position: relative;
        min-height: 170px;
        max-height: 650px;
        overflow-y: auto;
    }
    .edit-discount-header{
        position: relative;
        border-bottom: 1px solid #e8eaec;
        margin-bottom: 20px;
    }
    .edit-discount-btn{
        position: absolute;
        z-index: 10000;
        bottom: 5px;
        right: 5px;
    }
    .discount-form-wrap {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: 20px;
    }
    .icon-delete{
        font-size: 14px;
        margin-left: 10px;
    }
    .icon-delete:hover{
        cursor: pointer;
    }
    .no-data-text{
        padding-top: 40px;
        margin: auto;
        text-align: center;
    }
    .display-content{
        width: 320px;
        font-size: 13px;
        margin-bottom: 24px;
    }
    .table-spin-icon-load{
        animation: ani-table-spin 1s linear infinite;
    }
    @keyframes ani-table-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
</style>
