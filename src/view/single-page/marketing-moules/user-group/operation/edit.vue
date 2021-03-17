<template>
	<div>
		<Steps :current="current" style="margin-bottom: 25px;">
            <Step title="基础信息" content="填写用户群名称和类型"></Step>
            <Step title="条件" content="填写或导入用户群配置"></Step>
            <Step title="完成" content="确认填写或导入的信息"></Step>
        </Steps>
        <div v-show="current === 0" class="form-body">
            <Form ref="basicForm" :label-width="100">
                <FormItem label="用户群名称 :">
                    <Input :maxlength="15" v-model="params.userGroupName" style="width: 250px" readonly></Input> 
                </FormItem>
                <FormItem label="用户群类型 :">
                    <Input :maxlength="15" v-model="params.displayType" style="width: 250px" readonly></Input> 
                </FormItem>
            </Form>
        </div>
        <div v-show="current === 1" class="form-body">
            <div v-if="params.userGroupType === '1'">
                <div style="display: flex;">
                    <Upload
                        type="drag"
                        class="file-box"
                        ref="importFile"
                        :action="_baseUrl + '/common/uploadFile'"
                        :headers="headers"
                        :show-upload-list='false'
                        :before-upload="beforeUpload"
                        :on-progress="onProgress"
                        :on-format-error="formatError"
                        :on-success="importSuccess"
                        :on-error="importFiled"
                        :format="['zip','xlsx', 'xls']"
                        style="width: 450px;">
                        <div style="padding: 20px 0;">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>点击(拖拽)上传文件</p>
                        </div>
                        <Progress :percent="percent" v-show="loading"/>
                    </Upload>
                    <div class="upload-right-wrap">
                        <Alert type="warning" style="width: 450px;">请先下载导入模板，根据规则填写模板，然后再导入填好的模板数据！</Alert>
                        <Alert type="warning" style="width: 250px;">可以多次导入、增量导入</Alert>
                        <Button type="primary" ghost :to="_baseUrl + '/download/UserGroupTemplate.xlsx'" target="_blank">
                            <Icon type="ios-cloud-download-outline" size="16"/>下载模板
                        </Button>
                    </div>
                </div>
            </div>
            <div v-if="params.userGroupType === '2'">
                <Form :model="cityConfig" ref="cityCheck" :rules="cityConfigRules">
                    <table>
                        <tr>
                            <td><Checkbox @on-change="changeCheck('cityCheck')" v-model="checkStatus.cityCheck"></Checkbox>城市</td>
                            <td class="second-td">
                                <FormItem prop="cityType" class="second-td-formItem">
                                    <Select v-model="cityConfig.cityType" style="width: 100px">
                                        <Option value="1">注册城市</Option>
                                        <Option value="2">下单城市</Option>
                                        <Option value="3">冒泡城市</Option>
                                    </Select>
                                </FormItem>
                                <FormItem prop="cityCode" class="second-td-formItem">
                                    <TreeInput
                                        ref="treeInput"
                                        :data="cityTree"
                                        inputHeight="38px"
                                        inputWidth="200px"
                                        v-model="cityConfig.cityCode"
                                        @on-change="selectCity">
                                    </TreeInput>
                                </FormItem>
                            </td>
                            <td>
                                <div v-if="checkStatus.cityCheck && current === 1">
                                    城市 ：
                                    <span v-for="(item, index) in $refs.treeInput.selectLists">
                                        {{item.title}}
                                        <span v-if="index !== $refs.treeInput.selectLists.length - 1">/</span>
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </Form>
                <Form :model="sexConfig" ref="sexCheck" :rules="sexConfigRules">
                    <table>
                        <tr>
                            <td><Checkbox @on-change="changeCheck('sexCheck')" v-model="checkStatus.sexCheck"></Checkbox>性别</td>
                            <td class="second-td">
                                <FormItem prop="sex" class="second-td-formItem">
                                    <RadioGroup v-model="sexConfig.sex">
                                        <Radio label="1">男</Radio>
                                        <Radio label="0">女</Radio>
                                        <Radio label="2">未知</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </td>
                            <td>
                                <div v-if="checkStatus.sexCheck">性别 ：{{sexMap[sexConfig.sex]}}</div>
                            </td>
                        </tr>
                    </table>
                </Form>
                <Form :model="ageConfig" ref="ageCheck" :rules="ageConfigRules">
                    <table>
                        <tr>
                            <td><Checkbox @on-change="changeCheck('ageCheck')" v-model="checkStatus.ageCheck"></Checkbox>年龄</td>
                            <td class="second-td">
                                <FormItem prop="startAge" class="second-td-formItem">
                                    <NumberInput
                                        :min="1"
                                        :max="120"
                                        :precision="0" 
                                        :styles="{width: '60px'}" 
                                        appendText="岁" 
                                        v-model="ageConfig.startAge"
                                        @on-change="printAge">
                                    </NumberInput>
                                </FormItem>
                                <span>至</span>
                                <FormItem prop="endAge" class="second-td-formItem">
                                    <NumberInput
                                        :min="1"
                                        :max="120"
                                        :precision="0"
                                        :styles="{width: '60px'}"
                                        appendText="岁"
                                        v-model="ageConfig.endAge"
                                        @on-change="printAge">
                                    </NumberInput>
                                </FormItem>
                                <div style="width: 90px;"></div>
                            </td>
                            <td>
                                <div v-if="checkStatus.ageCheck">年龄 ：{{ageConfig.startAge}}岁 至 {{ageConfig.endAge}}岁</div>
                            </td>
                        </tr>
                    </table>
                </Form>
                <Form :model="orderDateRange" ref="orderCheck" :rules="orderDateRangeRules">
                    <table>
                        <tr>
                            <td style="border-bottom: none;">
                                <Checkbox v-model="checkStatus.orderCheck" @on-change="changeMainOrder"></Checkbox>订单
                            </td>
                            <td class="second-td">
                                <div style="margin-left: 20px;">下单时间</div>
                                <FormItem prop="timeType" class="second-td-formItem">
                                    <Select style="width: 100px" v-model="orderDateRange.timeType" @on-change="selectType(0)">
                                        <Option value="1">最近</Option>
                                        <Option value="2">固定时间范围</Option>
                                    </Select>
                                </FormItem>
                                <FormItem prop="orderRecentDay" v-if="orderDateRange.timeType === '1'" class="second-td-formItem">
                                    <NumberInput
                                        :min="0"
                                        :max="9999"
                                        :styles="{width: '73px'}" 
                                        :precision="0" 
                                        appendText="天" 
                                        v-model="orderDateRange.orderRecentDay"> 
                                    </NumberInput>
                                </FormItem>
                                <FormItem prop="timeRange" v-if="orderDateRange.timeType === '2'" class="second-td-formItem">
                                    <DatePicker
                                        v-model="orderDateRange.timeRange"
                                        type="datetimerange" 
                                        placeholder="请选择时间范围" 
                                        @on-change="selectOrderDateRange"
                                        style="width: 100px">
                                    </DatePicker>
                                </FormItem>
                            </td>
                            <td>
                                <div v-if="checkStatus.orderCheck">
                                    下单时间 ：
                                    <span v-if="orderDateRange.timeType === '1'">
                                        {{timeTypeMap[orderDateRange.timeType]}} {{orderDateRange.orderRecentDay}} 天
                                    </span>
                                    <span v-if="orderDateRange.timeType === '2'">
                                        {{orderDateRange.timeRange[0]}} - {{orderDateRange.timeRange[1]}}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </Form>
                <Form :model="orderNumConfig" ref="orderNumCheck" :rules="orderNumConfigRules">
                    <table>
                        <tr>
                            <td class="no-border-td"><Checkbox style="display: none;" v-model="checkStatus.orderCheck"></Checkbox></td>
                            <td class="second-td">
                                <div>
                                    <Checkbox 
                                        @on-change="changeOrderCheck('orderNumCheck')" 
                                        v-model="insideStatus.orderNumCheck">
                                    </Checkbox>完单数量
                                </div>
                                <FormItem prop="finishCountTag" class="second-td-formItem">
                                    <Select style="width: 100px" v-model="orderNumConfig.finishCountTag">
                                        <Option value="=">=</Option>
                                        <Option value=">">></Option>
                                        <Option value="<"><</Option>
                                        <Option value="≥">≥</Option>
                                        <Option value="≤">≤</Option>
                                    </Select>
                                </FormItem>
                                <FormItem prop="finishCount" class="second-td-formItem">
                                    <NumberInput 
                                        :min="0"
                                        :max="9999"
                                        :styles="{width: '73px'}"
                                        :precision="0"
                                        appendText="单"
                                        v-model="orderNumConfig.finishCount">  
                                    </NumberInput>
                                </FormItem>
                            </td>
                            <td>
                                <div v-if="insideStatus.orderNumCheck && checkStatus.orderCheck">
                                    完单数量 ： 订单 {{orderNumConfig.finishCountTag}} {{orderNumConfig.finishCount}} 单
                                </div>
                            </td>
                        </tr>
                    </table>
                </Form>
                <Form :model="orderTimeRange" ref="orderTimeRangeCheck" :rules="orderTimeRangeRules">
                    <table>
                        <tr>
                            <td class="no-border-td"><Checkbox v-model="checkStatus.orderCheck" style="display: none;"></Checkbox></td>
                            <td class="second-td">
                                <div>
                                    <Checkbox 
                                        @on-change="changeOrderCheck('orderTimeRangeCheck')" 
                                        v-model="insideStatus.orderTimeRangeCheck">
                                    </Checkbox>下单时段
                                </div>
                                <FormItem prop="timeRange" class="second-td-formItem">
                                    <TimePicker 
                                        v-model="orderTimeRange.timeRange"
                                        type="timerange" 
                                        placeholder="请选择下单时间段" 
                                        style="width: 168px"> 
                                    </TimePicker>
                                </FormItem>
                            </td>
                            <td>
                                <div v-if="insideStatus.orderTimeRangeCheck && checkStatus.orderCheck">
                                    下单时段 ：{{orderTimeRange.timeRange[0]}} - {{orderTimeRange.timeRange[1]}}
                                </div>
                            </td>
                        </tr>
                    </table>
                </Form>
                <Form :model="timeConfig" ref="timeCheck" :rules="timeConfigRules">
                    <table>
                        <tr>
                            <td><Checkbox @on-change="changeCheck('timeCheck')" v-model="checkStatus.timeCheck"></Checkbox>注册时间</td>
                            <td class="second-td">
                                <FormItem prop="timeType" class="second-td-formItem">
                                    <Select style="width: 120px" v-model="timeConfig.timeType" @on-change="selectType(1)">
                                        <Option value="1">最近</Option>
                                        <Option value="2">固定时间范围</Option>
                                    </Select>
                                </FormItem>
                                <FormItem prop="registRecentDay" v-if="timeConfig.timeType === '1'" class="second-td-formItem">
                                    <NumberInput
                                        :min="0"
                                        :max="9999"
                                        :styles="{width: '100px'}"
                                        :precision="0"
                                        appendText="天"
                                        v-model="timeConfig.registRecentDay">
                                    </NumberInput>
                                </FormItem>
                                <FormItem prop="timeRange" v-if="timeConfig.timeType === '2'" class="second-td-formItem">
                                    <DatePicker
                                        type="datetimerange"
                                        placeholder="请选择时间范围"
                                        style="width: 168px"
                                        @on-change="selectRegisterDateRange"
                                        v-model="timeConfig.timeRange">
                                    </DatePicker>
                                </FormItem>
                            </td>
                            <td>
                                <div v-if="checkStatus.timeCheck">
                                    注册时间 ：
                                    <span v-if="timeConfig.timeType === '1'">
                                        {{timeTypeMap[timeConfig.timeType]}} {{timeConfig.registRecentDay}} 天
                                    </span>
                                    <span v-if="timeConfig.timeType === '2'">
                                        {{timeConfig.timeRange[0]}} - {{timeConfig.timeRange[1]}}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </Form>
                <Form :model="bubbleConfig" ref="bubbleCheck" :rules="bubbleConfigRules">
                    <table>
                        <tr>
                            <td><Checkbox @on-change="changeCheck('bubbleCheck')" v-model="checkStatus.bubbleCheck"></Checkbox>最近一次冒泡时间</td>
                            <td class="second-td">
                                <FormItem prop="timeType" class="second-td-formItem">
                                    <Select style="width: 120px" v-model="bubbleConfig.timeType" @on-change="selectType(2)">
                                        <Option value="1">最近</Option>
                                        <Option value="2">固定时间范围</Option>
                                    </Select>
                                </FormItem>
                                <FormItem prop="lastLoginTimeDay" v-if="bubbleConfig.timeType === '1'" class="second-td-formItem">
                                    <NumberInput
                                        :min="0"
                                        :max="9999"
                                        :styles="{width: '100px'}"
                                        :precision="0"
                                        appendText="天"
                                        v-model="bubbleConfig.lastLoginTimeDay">
                                    </NumberInput>
                                </FormItem>
                                <FormItem prop="timeRange" v-if="bubbleConfig.timeType === '2'" class="second-td-formItem">
                                    <DatePicker
                                        type="datetimerange"
                                        placeholder="请选择时间范围"
                                        style="width: 168px"
                                        @on-change="selectBubbleDateRange"
                                        v-model="bubbleConfig.timeRange">
                                    </DatePicker>
                                </FormItem>
                            </td>
                            <td>
                                <div v-if="checkStatus.bubbleCheck">
                                    最近一次冒泡时间 ：
                                    <span v-if="bubbleConfig.timeType === '1'">
                                        {{timeTypeMap[bubbleConfig.timeType]}} {{bubbleConfig.lastLoginTimeDay}} 天
                                    </span>
                                    <span v-if="bubbleConfig.timeType === '2'">
                                        {{bubbleConfig.timeRange[0]}} - {{bubbleConfig.timeRange[1]}}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </Form>
            </div>
        </div>
        <div v-show="current === 2" class="form-body">
            <Form>
                <FormItem label="用户群名称 :">
                    {{params.userGroupName}}
                </FormItem>
                <FormItem label="用户群类型 :">
                    {{conditionType[params.userGroupType]}}         
                </FormItem>
                <FormItem label="用户群人数 :" v-if="params.userGroupType === '1'">
                    <span style="font-weight: bold;">{{params.userGroupCount}}人</span>
                </FormItem>
                <FormItem label="用户群人数 :" v-if="params.userGroupType === '2'">
                    <span style="font-weight: bold;">计算中...</span>
                </FormItem>
                <FormItem v-if="params.userGroupType === '1'">
                    <Button type="primary" @click="mulDownload('ossUrl')">下载用户清单</Button>
                </FormItem>
            </Form>
        </div>
        <div class="step-btn-wrap">
            <Button @click="cancel">取消</Button>
            <Button
                class="step-btn"
                type="primary"
                v-if="current !== 0"
                :loading="btnLoading"
                @click="prevStep">上一步
            </Button>
            <Button 
                class="step-btn" 
                type="primary" 
                v-if="current !== 2" 
                :loading="btnLoading"
                @click="nextStep(current)">下一步
            </Button>
            <Button 
                class="step-btn" 
                type="primary" 
                v-if="current === 2" 
                :loading="btnLoading"
                @click="complete">完成
            </Button>
        </div>
        <Modal v-model="importFiledView" title="提示" ok-text="下载清单" cancel-text="关闭" :mask-closable="false" footer-hide>
            <div slot="header" class="ivu-modal-confirm-head">
                <div class="ivu-modal-confirm-head-icon ivu-modal-confirm-head-icon-warning">
                    <i class="ivu-icon ivu-icon-ios-alert"></i>
                </div>
                <div class="ivu-modal-confirm-head-title">提示</div>
            </div>
            <div>导入成功{{params.successCount}}条，导入失败{{params.failedCount}}条，是否下载导入失败清单？</div>
            <div style="text-align: right;margin-top: 15px;">
                <Button size="large" type="text" @click="importFiledView = false" style="margin-right: 8px;">关闭</Button>
                <Button size="large" type="primary" @click="mulDownload('ossFailedUrl')">下载清单</Button>
            </div>
        </Modal>
	</div>
</template>

<script>
import NumberInput from '_a/input-number/input-number'
import TreeInput from '_a/tree-input/tree-input.vue'
import { sexMap, timeTypeMap, conditionType, checkBoxMap, insideCheckBoxMap } from '../index'
import { changeKeyMethod } from '@/libs/tools'
import { updateUserGroup, pollingUploadResult, userGroupConfirm, getUserGroupDetail } from '@/api/marketing'
import { getToken } from '@/libs/util'

export default {
    components: {
        NumberInput,
        TreeInput
    },
    data() {
        const cityType = (rule, value, callback) => {
            let data = value || null
            this.checkConfig(this.checkStatus.cityCheck, data === null, callback)
        }
        const cityCode = (rule, value, callback) => {
            let data = value || []
            this.checkConfig(this.checkStatus.cityCheck, !data.length, callback)
        }
        const sex = (rule, value, callback) => {
            let data = value || null
            this.checkConfig(this.checkStatus.sexCheck, data === null, callback)
        }
        const startAge = (rule, value, callback) => {
            let data = value || null
            if(data === null && this.checkStatus.ageCheck) callback(new Error('请输入起始年龄'))
            if(data !== null && this.checkStatus.ageCheck) {
                if(this.ageConfig.startAge > this.ageConfig.endAge) callback(new Error('起始年龄不得大于结束年龄'))
                else callback()
            }
        }
        const endAge = (rule, value, callback) => {
            let data = value || null
            if(data === null && this.checkStatus.ageCheck) callback(new Error('请输入起始年龄'))
            if(data !== null && this.checkStatus.ageCheck) {
                if(this.ageConfig.startAge > this.ageConfig.endAge) callback(new Error('起始年龄不得大于结束年龄'))
                else callback()
            }
        }
        const orderDays = (rule, value, callback) => {
            let data = value || null
            this.checkConfig(this.checkStatus.orderCheck, data === null, callback)
        }
        const orderRange = (rule, value, callback) => {
            let data = value || []
            let error = !data.length || data[0] === ''
            this.checkConfig(this.checkStatus.orderCheck, error, callback)
        }
        const finishCountTag = (rule, value, callback) => {
            let data = value || null
            this.checkConfig(this.insideStatus.orderNumCheck, data === null, callback)
        }
        const finishCount = (rule, value, callback) => {
            let data = value || null
            this.checkConfig(this.insideStatus.orderNumCheck, data === null, callback)
        }
        const timeRange = (rule, value, callback) => {
            let data = value || []
            let error = !data.length || data[0] === ''
            this.checkConfig(this.insideStatus.orderTimeRangeCheck, error, callback)
        }
        const timeDays = (rule, value, callback) => {
            let data = value || null
            this.checkConfig(this.checkStatus.timeCheck, data === null, callback)
        }
        const dateRange = (rule, value, callback) => {
            let data = value || []
            let error = !data.length || data[0] === ''
            this.checkConfig(this.checkStatus.timeCheck, error, callback)
        }
        const bubbleDays = (rule, value, callback) => {
            let data = value || null
            this.checkConfig(this.checkStatus.bubbleCheck, data === null, callback)
        }
        const bubbleRange = (rule, value, callback) => {
            let data = value || []
            let error = !data.length || data[0] === ''
            this.checkConfig(this.checkStatus.bubbleCheck, error, callback)
        }
        return {
            sexMap,
            timeTypeMap,
            checkBoxMap,
            insideCheckBoxMap,
            conditionType,
            timer: null,            // 进度条计时器
            callBackTimer: null,    // 回调请求计时器
            cityTree: [],
            selectCityNodes: [],
            loading: false,         // 上传文件进度条展示
            btnLoading: false,      // 下一步的loading动画
            importFiledView: false, // 弹出导入失败弹窗
            current: 0,             // 步骤条位置
            percent: 0,             // 进度条百分比
            cityConfigRules: {      // 城市行校验
                cityType: [{ required: true, trigger: 'change', validator: cityType, message: '请选择城市类型' }],
                cityCode: [{ required: true, trigger: 'change', validator: cityCode, message: '请选择城市' }]
            },
            sexConfigRules: {   // 性别行校验
                sex: [{ required: true, trigger: 'change', validator: sex, message: '请选择性别' }],
            },
            ageConfigRules: {   // 年龄行校验
                startAge: [{ required: true, trigger: 'change', validator: startAge }],
                endAge: [{ required: true, trigger: 'change', validator: endAge }]
            },
            orderNumConfigRules: { // 订单-完单数量校验
                finishCountTag: [{ required: true, trigger: 'change', validator: finishCountTag, message: '请选择符号' }],
                finishCount: [{ required: true, trigger: 'change', validator: finishCount, message: '请输入订单数' }]
            },
            orderDateRangeRules: { // 订单-下单时间校验
                orderRecentDay: [{ required: true, trigger: 'change', validator: orderDays, message: '请输入天数' }],
                timeRange: [{ required: true, trigger: 'change', validator: orderRange, message: '请选择下单时间段' }]
            },
            orderTimeRangeRules: { // 订单-下单时段校验
                timeRange: [{ required: true, trigger: 'change', validator: timeRange, message: '请选择时段' }]
            },
            timeConfigRules: {     // 注册时间校验
                registRecentDay: [{ required: true, trigger: 'change', validator: timeDays, message: '请输入天数' }],
                timeRange: [{ required: true, trigger: 'change', validator: dateRange, message: '请选择时间范围' }]
            },
            bubbleConfigRules: {
                lastLoginTimeDay: [{ required: true, trigger: 'change', validator: bubbleDays, message: '请输入天数' }],
                timeRange: [{ required: true, trigger: 'change', validator: bubbleRange, message: '请选择时间范围' }]
            },
            checkStatus: {
                orderCheck: false,          // 订单勾选状态
                cityCheck: false,           // 城市勾选状态
                sexCheck: false,            // 性别勾选状态
                ageCheck: false,            // 年龄勾选状态
                timeCheck: false,           // 注册时间勾选状态
                bubbleCheck: false,         // 最近一次冒泡时间勾选状态
            },
            insideStatus: {
                orderNumCheck: false,       // 完单数量勾选状态
                orderTimeRangeCheck: false, // 下单时段勾选状态
            },
            headers: { 'Authorization': getToken() },
            uploadData: '',     // 条件上传，返回计算结果后，记录此次上传的uuid
            params: {           // 基础信息参数
                userGroupType: '2'
            },
            cityConfig: {},     // 城市参数
            sexConfig: {},      // 性别参数
            ageConfig: {},      // 年龄参数
            orderDateRange: {   // 下单时间参数
                timeType: '1',
                timeRange: [],
                orderRecentDay: null
            },
            orderNumConfig: {}, // 完单数量参数
            orderTimeRange: {}, // 下单时段参数
            timeConfig: {       // 注册时间参数
                timeType: '1',
                timeRange: [],
                registRecentDay: null
            },
            bubbleConfig: {    // 最后一次冒泡时间参数
                timeType: '1',
                timeRange: [],
                lastLoginTimeDay: null
            }
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.getUserGroupDetail()
        next()
    },
    beforeRouteLeave (to, from, next) {
        clearInterval(this.callBackTimer)
        next()
    },
    created () {
        let city = JSON.parse(localStorage.getItem('provinceCityList'))
        changeKeyMethod(city, 'label', 'title')
        this.cityTree = [{
            children: JSON.parse(JSON.stringify(city)),
            title: '全国',
            value: '0',
            expand: true
        }]
        this.getUserGroupDetail()
    },
    methods: {
        getUserGroupDetail () {
            let params = {
                uuid: this.$route.query.uuid,
                userGroupType: Number(this.$route.query.userGroupType),
            }
            getUserGroupDetail(params).then(res => {
                let data = res.data.data || {}
                let conditionData = data.userGroupFeatureCfg || {}
                this.params = {
                    userGroupName: data.userGroupName,
                    userGroupType: data.userGroupType.toString(),
                    displayType: this.conditionType[data.userGroupType]
                }
                if (this.params.userGroupType === '2') { // 条件类
                    for (let key in conditionData) {
                        conditionData[key] = conditionData[key] || null
                    }
                    if (conditionData.cityType !== null) { // 勾选城市
                        this.checkStatus.cityCheck = true
                        let cityList = conditionData.cityCode
                        cityList.forEach(item => { // 选择全国
                            if (item === '1') cityList = this.$refs.treeInput.getAllLeaves()
                        })
                        this.cityConfig = {
                            cityType: conditionData.cityType.toString(),
                            cityCode: cityList
                        }
                    }
                    if (conditionData.sex !== null) { // 勾选性别
                        this.checkStatus.sexCheck = true
                        this.sexConfig = { sex: conditionData.sex }
                    }
                    if (conditionData.startAge !== null) { // 勾选年龄
                        this.checkStatus.ageCheck = true
                        this.ageConfig = {
                            startAge: conditionData.startAge,
                            endAge: conditionData.endAge
                        }
                    }
                    if (conditionData.orderStartDate !== null || conditionData.orderRecentDay !== null) { // 勾选下单时间
                        this.checkStatus.orderCheck = true
                        if (conditionData.orderRecentDay === null) { // 选择了时间范围
                            this.orderDateRange.timeType = '2'
                            this.orderDateRange.timeRange = [conditionData.orderStartDate, conditionData.orderEndDate]
                        } else { // 选择了最近天数
                            this.orderDateRange.timeType = '1'
                            this.orderDateRange.orderRecentDay = conditionData.orderRecentDay
                        }
                    }
                    if (conditionData.finishCount !== null) { // 勾选完单数量
                        this.checkStatus.orderCheck = true
                        this.insideStatus.orderNumCheck = true
                        this.orderNumConfig = {
                            finishCountTag: conditionData.finishCountTag,
                            finishCount: conditionData.finishCount
                        }
                    }
                    if (conditionData.orderStartTime !== null) { // 勾选下单时段
                        this.checkStatus.orderCheck = true
                        this.insideStatus.orderTimeRangeCheck = true
                        this.orderTimeRange.timeRange = [conditionData.orderStartTime, conditionData.orderEndTime]
                    }
                    if (conditionData.registStartDate !== null || conditionData.registRecentDay !== null) { // 勾选注册时间
                        this.checkStatus.timeCheck = true
                        if (conditionData.registRecentDay === null) { // 选择了时间范围
                            this.timeConfig.timeType = '2'
                            this.timeConfig.timeRange = [conditionData.registStartDate, conditionData.registEndDate]
                        } else { // 选择了最近天数
                            this.timeConfig.timeType = '1'
                            this.timeConfig.registRecentDay = conditionData.registRecentDay
                        }
                    }
                    if (conditionData.lastLoginTimeStartDate !== null || conditionData.lastLoginTimeDay !== null) {
                    // 勾选最后一次冒泡时间
                        this.checkStatus.bubbleCheck = true
                        if (conditionData.lastLoginTimeDay === null) { // 选择了时间范围
                            this.bubbleConfig.timeType = '2'
                            this.bubbleConfig.timeRange = [
                                conditionData.lastLoginTimeStartDate, 
                                conditionData.lastLoginTimeEndDate
                            ]
                        } else { // 选择了最近天数
                            this.bubbleConfig.timeType = '1'
                            this.bubbleConfig.lastLoginTimeDay = conditionData.lastLoginTimeDay
                        }
                    }
                }
            })
        },
        prevStep () { // 上一步
            this.current --
        },
        nextStep (step) { // 下一步
            if (step === 0) { // 第一步
                this.current ++
            }
            if (step === 1) { // 第二步
                this.loading = false
                let temp = true, flag = false // temp：判断校验是否全部通过，flag：判断是否至少勾选了一行
                for(let key in this.checkStatus) { // 校验表格
                    if(this.checkStatus[key]) { // 非订单行校验
                        flag = true
                        this.$refs[key].validate(res => {
                            if(!res) temp = false
                        })
                    }
                }
                for(let key in this.insideStatus) { // 校验表格
                    if(this.insideStatus[key] && this.checkStatus.orderCheck) { // 订单行校验
                        flag = true
                        this.$refs[key].validate(res => {
                            if(!res) temp = false
                        })
                    }
                }
                if (!flag && this.params.userGroupType === '2') {
                    this.$Message.warning('请至少勾选一项')
                }
                if (this.uploadData === '' && this.params.userGroupType === '1') {
                    this.$Message.warning('请先导入文件')
                }
                if (temp && flag) { // 条件类的第二步校验通过
                    this.current ++
                }
                if (this.uploadData !== '' && this.params.userGroupType === '1') { // 导入类的第二步校验通过
                    this.current ++
                }
            }
        },
        beforeUpload (res, file) { // 上传文件前回调
            this.percent = 0
            if (this.uploadData === '') { // 第一次上传文件
                return new Promise((resolve, rejuct) => {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '此项操作会覆盖原有数据，是否继续？确认则继续操作覆盖，取消则不覆盖。',
                        onOk: () => {
                            resolve()
                        },
                        onCancel: () => {
                            rejuct()
                        }
                    })
                })
            }
        },
        formatError (file) { // 文件类型校验回调
            this.$Message.warning('文件类型有误！')
        },
        onProgress () { // 文件上传中
            this.loading = true
            this.timer = setInterval(() => {
                if (this.percent < 99) this.percent ++
            }, 200)
        },
        importSuccess (res, file) { // 上传文件成功回调
            clearInterval(this.timer)
            let t = setInterval(() => {
                if (this.percent < 100) this.percent ++
                else clearInterval(t)
            }, 10)
            this.getImportResult(res)
        },
        importFiled (res, file) { // 上传文件失败回调
            clearInterval(this.timer)
            let t = setInterval(() => {
                if (this.percent < 100) this.percent ++
                else clearInterval(t)
            }, 10)
            this.$Message.error('上传失败！')
        },
        pollingUploadResult () { // 每10s轮询，直至返回计算结果
            return new Promise((resvole, reject) => {
                this.callBackTimer = setInterval(() => {
                    pollingUploadResult({ uuid: this.uploadData }).then(res => {
                        let data = res.data.data || null
                        if (data !== null) { // 得到计算结果
                            clearInterval(this.callBackTimer) // 结束轮询
                            data.userGroupType = data.userGroupType.toString()
                            this.params = Object.assign(this.params, data)
                            this.btnLoading = false
                            resvole(data)
                        }
                    }).catch(Error => {
                        clearInterval(this.callBackTimer) // 结束轮询
                        this.uploadData = ''
                        this.btnLoading = false
                        this.$Message.error('计算失败')
                        reject(Error)
                    })
                }, 5000)
            })
        },
        getImportResult (response) { // 获取导入类结果
            let tempParams = JSON.parse(JSON.stringify(this.params))
            let params = {
                uuid: this.uploadData,
                ossUrl: response.data.fileUrl,
                userGroupType: Number(tempParams.userGroupType),
                userGroupName: tempParams.userGroupName
            }
            if (this.uploadData === '') params.uuid = this.$route.query.uuid // 第一次导入
            this.btnLoading = true // 将下一步按钮变为加载中
            this.$Notice.warning({
                title: '提示',
                name: 'groupNotice',
                duration: 0,
                render: h => {
                    return h('span', '用户群人数计算中，请稍后...')
                }
            })
            updateUserGroup(params).then(res => {
                this.uploadData = res.data.data
                this.pollingUploadResult().then(() => {
                    this.$Notice.close('groupNotice')
                    if (this.params.failedCount > 0) { // 本次导入存在失败项
                        this.importFiledView = true // 弹出下载失败清单窗口
                    } else if ((this.params.failedCount === 0 || this.params.failedCount === null) && 
                        this.params.successCount > 0) { // 无失败项，有成功项
                        this.$Modal.confirm({
                            title: '提示',
                            content: '导入成功' + this.params.successCount + '条！'
                        })
                    } else { // 导入未成功
                        this.$Notice.warning({
                            title: '提示',
                            duration: 0,
                            render: h => {
                                return h('span', '计算失败！')
                            }
                        })
                    }
                    if (this.params.userGroupCount === 0 || this.params.userGroupCount === null) { // 导入成功，符合条件人数为0
                        this.uploadData = ''
                        this.$Notice.warning({
                            title: '提示',
                            duration: 0,
                            render: h => {
                                return h('span', '用户群人数为0，请重新导入')
                            }
                        })
                    }
                }).catch(() => {
                    this.btnLoading = false
                    this.$Notice.close('groupNotice')
                })
            }).catch(() => {
                this.btnLoading = false
                this.$Notice.close('groupNotice')
            })
        },
        getConditionResult () { // 获取条件类结果
            let params = {}
            params = Object.assign(params, this.params)
            params.uuid = this.$route.query.uuid
            params.userGroupType = Number(params.userGroupType)
            for (let key in this.checkStatus) { // 将勾选的参数合并
                if (this.checkStatus[key]) {
                    params = Object.assign(params, this[this.checkBoxMap[key]])
                    if (key === 'sexCheck') params.sex = Number(params.sex)
                    if (key === 'cityCheck') {
                        params.cityType = Number(params.cityType)
                        this.selectCityNodes.forEach(item => { // 若全国被勾选
                            if (item.value === '1') params.cityCode = ['1']
                        })
                        params.cityCode = params.cityCode.join(',')
                    }
                    if (key === 'orderCheck' && this.orderDateRange.timeType === '1') { // 下单时间勾选状态(最近时间范围)
                        params.orderStartDate = this.orderDateRange.timeRange[0]
                        params.orderEndDate = this.orderDateRange.timeRange[1]
                    }
                    if (key === 'timeCheck' && this.timeConfig.timeType === '1') { // 注册时间勾选状态
                        params.registStartDate = this.timeConfig.timeRange[0]
                        params.registEndDate = this.timeConfig.timeRange[1]
                    }
                    if (key === 'bubbleCheck' && this.bubbleConfig.timeType === '1') { // 冒泡时间
                        params.lastLoginTimeStartDate = this.bubbleConfig.timeRange[0]
                        params.lastLoginTimeEndDate = this.bubbleConfig.timeRange[1]
                    }
                }
            }
            for (let key in this.insideStatus) { // 将勾选的参数合并（完单数量、下单时段）
                if (this.insideStatus[key] && this.checkStatus.orderCheck) {
                    params = Object.assign(params, this[this.insideCheckBoxMap[key]])
                    if (key === 'orderTimeRangeCheck') { // 下单时段勾选状态
                        params.orderStartTime = this.orderTimeRange.timeRange[0]
                        params.orderEndTime = this.orderTimeRange.timeRange[1]
                    }
                }
            }
            return params
        },
        checkConfig (status, error, callback) { // 统一校验方法
            if(status){
                if(error) {
                    callback(new Error())
                } else callback()
            } else {
                callback()
            }
        },
        changeMainOrder (temp) { // 勾选/取消勾选订单
            if(!temp) { // 取消勾选订单
                this.$refs.orderCheck.resetFields() // 重置下单时间校验
                for(let key in this.insideStatus) {
                    this.$refs[key].resetFields() // 重置校验
                }
            }
        },
        changeOrderCheck (key) { // 勾选/取消勾选订单内部选项
            if(!this.insideStatus[key]) this.$refs[key].resetFields() // 重置校验
        },
        changeCheck (key) { // 勾选/取消勾选第一列
            if(!this.checkStatus[key]) this.$refs[key].resetFields() // 重置校验
        },
        selectCity (cityList, selectNodes) { // 选择城市
            this.selectCityNodes = selectNodes
            this.$refs.cityCheck.validateField('cityCode')
        },
        printAge () { // 输入年龄时，重新校验
            this.$refs.ageCheck.validateField('endAge')
            this.$refs.ageCheck.validateField('startAge')
        },
        selectType (status) { // 最近/固定时间范围 切换
            if(status === 1) { // 注册时间
                let params = {...this.timeConfig}
                this.$refs.timeCheck.resetFields()
                this.timeConfig = {...params}   // 保持下拉框选项不被清空
                this.timeConfig.timeRange = []  // 清空其他数据
                this.timeConfig.registRecentDay = null
            } else if (status === 0) { // 下单时间
                let params = {...this.orderDateRange}
                this.$refs.orderCheck.resetFields()
                this.orderDateRange = {...params}
                this.orderDateRange.timeRange = []
                this.orderDateRange.orderRecentDay = null
            } else {
                let params = {...this.bubbleConfig}
                this.$refs.bubbleCheck.resetFields()
                this.bubbleConfig = {...params}
                this.bubbleConfig.timeRange = []
                this.bubbleConfig.lastLoginTimeDay = null
            }
        },
        selectOrderDateRange (date) { // 选择订单下单时间 范围
            this.orderDateRange.timeRange = date
        },
        selectRegisterDateRange (date) { // 选择注册时间 范围
            this.timeConfig.timeRange = date
        },
        selectBubbleDateRange (date) { // 选择最近一次冒泡时间 范围
            this.bubbleConfig.timeRange = date
        },
        mulDownload (url) { // 下载用户清单
            this.params[url] = this.params[url] || ''
            this.params[url] = this.params[url].split(',')
            this.params[url].forEach(item => {
                if (item !== '') window.location.href = item
                else this.$Message.warning('文件地址错误！')
            })
        },
        cancel () { // 取消
            this.$Modal.confirm({
                title: '取消',
                content: '<p>确认取消编辑用户群？</p>',
                onOk: () => {
                    this.$router.push({ name: 'user-group' })
                }
            })
        },
        complete (params) { // 完成(提交)
            this.btnLoading = true
            if (this.params.userGroupType === '1') { // 导入类
                userGroupConfirm({ uuid: this.uploadData }).then(res => {
                    this.btnLoading = false
                    this.$Message.success('更新成功！')
                    this.$router.push({ name: 'user-group' })
                }).catch(() => {
                    this.btnLoading = false
                })
            } else { // 条件类
                let params = this.getConditionResult()
                addUserGroup(params).then(res => {
                    this.uploadData = res.data.data || ''
                    if (this.uploadData === '') {
                        this.btnLoading = false
                        this.$Message.warning('用户群更新失败！')
                    } else {
                        userGroupConfirm({ uuid: this.uploadData }).then(res => {
                            this.btnLoading = false
                            this.$Message.success('更新成功！')
                            this.$router.push({ name: 'user-group' })
                        }).catch(() => {
                            this.btnLoading = false
                        })
                    }
                }).catch(() => {
                    this.btnLoading = false
                })
            }
        }
    }
}
</script>

<style scoped>
    .step-btn-wrap{
        text-align: center;
        border-top: 1px solid #e8eaec;
        margin-top: 30px;
        padding-top: 15px;
    }
	.step-btn{
        margin-left: 15px;
    }
    .form-body{
        padding: 0 20px;
    }
    .upload-right-wrap{
        margin-left: 35px;
        padding-left: 35px;
        border-left: 1px solid #e8eaec;
    }
    table{
        border-collapse: collapse;
    }
    table tr td{
        height: 70px;
        vertical-align: middle;
        padding: 0 18px;
        border: 1px solid #e8eaec;
    }
    table tr td:nth-of-type(1) {
        width: 160px;
        min-width: 160px;
    }
    table tr td:nth-of-type(2) {
        width: 350px;
    }
    table tr td:nth-of-type(3) {
        width: 100%;
        border: none;
        color: #999;
    }
    .no-border-td{
        border-top: none;
        border-bottom: none;
    }
    .second-td{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .second-td-formItem{
        margin-bottom: 0;
    }
</style>