<template>
    <div class="operator-data">
        <div class="operator-header-wrap">
            <div class="operator-header">实时数据</div>
            <div class="operator-update-time">更新时间：2018-10-10 10:10:10</div>
        </div>
        <Row :gutter="16" style="padding: 0 15px;">
            <Col span="6" class="card-wrap">
                <infor-card shadow color="#ffe699" icon="ios-car" :icon-size="36">
                    <count-to :end="realtimeData.onLineVehicle" count-class="count-style"/>
                    <p>在线车辆数</p>
                </infor-card>
            </Col>
            <Col span="6" class="card-wrap">
                <infor-card shadow color="#ffe6e6" icon="ios-headset" :icon-size="36">
                    <count-to :end="realtimeData.serviceVehicle" count-class="count-style"/>
                    <p>服务中车辆数</p>
                </infor-card>
            </Col>
            <Col span="6" class="card-wrap">
                <infor-card shadow color="#ccecbe" icon="ios-plane" :icon-size="36">
                    <count-to :end="realtimeData.waitingVehicle" count-class="count-style"/>
                    <p>空驶车辆数</p>
                </infor-card>
            </Col>
            <Col span="6" class="card-wrap">
                <infor-card shadow color="#8cc8ff" icon="ios-eye-off" :icon-size="36">
                    <count-to :end="realtimeData.offLineVehicle" count-class="count-style"/>
                    <p>下线车辆数</p>
                </infor-card>
            </Col>
        </Row>
        <div class="operator-header-wrap">
            <div class="operator-header">统计数据</div>
        </div>
        <div class="limit-group-wrap">
            <div class="limit-group">
                <span>数据选择：</span>
                <CheckboxGroup v-model="checkList" @on-change="changeDisplayData">
                    <Checkbox :label="0">总订单</Checkbox>
                    <Checkbox :label="1">总流水</Checkbox>
                    <Checkbox :label="2">总车辆数</Checkbox>
                </CheckboxGroup>
            </div>
            <div class="limit-group">
                <span>维度统计：</span>
                <RadioGroup v-model="dataType" type="button" @on-change="changeDateType">
                    <Radio :label="0">按日</Radio>
                    <Radio :label="1">按周</Radio>
                    <Radio :label="2">按月</Radio>
                </RadioGroup>
            </div>
            <div class="limit-group">
                <span>时间选择：</span>
                <DatePicker
                    @on-change="changeDate"
                    class="time-interval-input"
                    :clearable="false"
                    v-model="dayInterval"
                    v-show="dataType === 0" 
                    type="daterange" 
                    :options="dayOptions"
                    placeholder="请选择起止日期">   
                </DatePicker>
                <DatePicker
                    @on-change="changeDate"
                    class="time-interval-input"
                    :clearable="false"
                    v-model="weekInterval"
                    v-show="dataType === 1" 
                    type="daterange" 
                    show-week-numbers 
                    :options="dayOptions"
                    placeholder="请选择起止周内的日期">  
                </DatePicker>
                <div v-show="dataType === 2" class="month-date-wrap">
                    <DatePicker
                        @on-change="changeMonthStartDate"
                        type="month"
                        :clearable="false"
                        style="width: 120px;"
                        placeholder="请选择起始月"
                        :options="startMonthyOptions"
                        v-model="startMonth">
                    </DatePicker>
                    <span style="padding: 0 5px;color: #cbccce;"> — </span>
                    <DatePicker
                        @on-change="changeMonthEndDate"
                        type="month"
                        :clearable="false"
                        style="width: 120px;"
                        placeholder="请选择结尾月"
                        :options="dayOptions"
                        v-model="endMonth">
                    </DatePicker>
                </div>
            </div>
        </div>
        <div class="yLabel-wrap">
            <div>
                <span v-if="yLabel.length !== 0 && yLabel[0].isShow" :style="{ color: yLabel[0].color }">{{yLabel[0].name}}</span>
            </div>
            <div>
                <span v-if="yLabel.length === 2 && yLabel[1].isShow" :style="{ color: yLabel[1].color }">{{yLabel[1].name}}</span>
            </div>
        </div>
        <div ref="dom" class="operator-echarts" id="operator-echarts"></div>
    </div>
</template>

<script>
import echarts from 'echarts'
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { on, off } from '@/libs/tools'
import { option, yAxisConfig, orderLine, waterLine, carLine } from './operator-data.js'
import { carrierRealtimeData, carrierLineData } from '@/api/operator-carrier'

export default {
    components: {
        InforCard,
        CountTo
    },
    props: {
        activeTab: String,
        carrierInfo: Object
    },
    data () {
        let that = this
        return {
            chart: null,            // 存放echarts对象
            realtimeData: {
                onLineVehicle: 0,
                serviceVehicle: 0,
                waitingVehicle: 0,
                offLineVehicle: 0
            },
            dayOptions: {
                disabledDate(date) {
                    return date && date.valueOf() > Date.now()
                }
            },
            startMonthyOptions: {
                disabledDate(date) {
                    return date && date.valueOf() > Date.now()
                }
            },
            dayInterval: ['',''],   // 起始日期、结束日期(按日统计)
            weekInterval: ['',''],  // 起始日期、结束日期(按周统计)
            startMonth: '',         // 起始月份
            endMonth: '',           // 结束月份
            dataType: 0,            // 时间维度 0：按日统计 1：按周统计 2：按月统计        
            checkList: [0, 1],      // 当前勾选项 0：总订单数 1：总流水数 2：总车次数
            option: {},             // 轴线配置
            orderLine: {},          // 订单折线配置
            waterLine: {},          // 流水折线配置
            carLine: {},            // 车辆折线配置
            params: {               // 请求参数
                beginDateStr: '',   // 开始日期
                endDateStr: '',     // 结束日期
                dateFlag: '0',      // 时间维度 0：按日统计 1：按周统计 2：按月统计
                statisticalFlag: '' // 当前勾选项 0：总订单数 1：总流水数 2：总车次数
            },
            yLabel: [               // y轴名称配置
                {
                    name: '总订单/单',
                    color: '#3398db',
                    isShow: true
                },
                {
                    name: '总流水/元',
                    color: '#3fc768',
                    isShow: true
                }
            ]
        }
    },
    watch: {
        'activeTab': function(){
            if(this.activeTab === '4') {
                this.init()
                carrierRealtimeData({uuid: this.$route.query.uuid}).then(res => {
                    this.realtimeData = res.data.data
                })
            } else {
                this.realtimeData = {
                    onLineVehicle: 0,
                    serviceVehicle: 0,
                    waitingVehicle: 0,
                    offLineVehicle: 0
                }
            }
        }
    },
    mounted () {
        this.option = option
        this.orderLine = orderLine
        this.waterLine = waterLine
        this.carLine = carLine
    },
    methods: {
        init () {
            this.dayInterval = [Date.now() - 1000 * 60 * 60 * 24 * parseInt(6), Date.now()] // 前七天
            this.weekInterval = [Date.now() - 1000 * 60 * 60 * 24 * parseInt(21), Date.now()] // 前四周
            this.startMonth = new Date(this.getThreeMonthAgo()) // 前三月
            this.endMonth = new Date(Date.now()) // 当前月
            this.changeDate()
            /*this.params.beginDate = this.$moment(this.dayInterval[0]).format('YYYY-MM-DD')
            this.params.endDate = this.$moment(this.dayInterval[1]).format('YYYY-MM-DD')

            this.getLineDataByCheckList(this.params)    // 获取数据
            this.fillData()                             // 装入数据, 创建echarts*/
            on(window, 'resize', this.resize)
        },
        getLineDataByCheckList: function(params){ // 根据勾选条件，循环获取数据
            params.uuid = this.$route.query.uuid
            for(let i = 0; i < this.checkList.length; i++){
                switch (this.checkList[i]) {
                    case 0: // 订单
                        let orderParams = JSON.parse(JSON.stringify(params))
                        orderParams.statisticalFlag = '0'
                        this.getLineData(orderParams).then(value => {
                            this.orderLine.data = value
                        })
                        break
                    case 1: // 流水
                        let waterParams = JSON.parse(JSON.stringify(params))
                        waterParams.statisticalFlag = '1'
                        this.getLineData(waterParams).then(value => {
                            this.waterLine.data = value
                        })
                        break
                    case 2: // 车辆
                        let carParams = JSON.parse(JSON.stringify(params))
                        carParams.statisticalFlag = '2'
                        this.getLineData(carParams).then(value => {
                            this.carLine.data = value
                        })
                        break
                }
            }
        },
        getLineData: function(params){ // 发起请求
            return carrierLineData(params).then(res => {
                let response = res.data.data
                let value = []
                let keys = []
                for(let key in response){
                    value.push(response[key])
                    keys.push(key)
                }
                this.option.xAxis[0].data = keys
                return new Promise(function (resolve, reject) {
                    resolve(value)
                })
            })
            /*let response = {
                '2008-1-1': Math.random()*100,
                '2008-1-2': Math.random()*100,
                '2008-1-3': Math.random()*100,
                '2008-1-4': Math.random()*100,
                '2008-1-5': Math.random()*100,
                '2008-1-6': Math.random()*100,
                '2008-1-7': Math.random()*100,
            }
            let value = []
            let keys = []
            for(let key in response){
                value.push(response[key])
                keys.push(key)
            }
            this.option.xAxis[0].data = keys
            return new Promise(function (resolve, reject) {
                resolve(value)
            })*/
        },
        getThreeMonthAgo: function(){
            let time = new Date(Date.now())
            let month = time.getMonth()
            let year = time.getFullYear()
            if(month < 2){ // 1月、2月
                month = 12 + month - 2
                year --
            } else {
                month = month - 2
            }
            month ++
            return year + '-' + month
        },
        changeMonthStartDate: function(date){ // 起始月份选择
            this.params.beginDateStr = this.$moment(this.startMonth).format('YYYY-MM')
            this.params.endDateStr = this.$moment(this.endMonth).format('YYYY-MM')
            this.getLineDataByCheckList(this.params)    // 获取数据
        },
        changeMonthEndDate: function(date){ // 结束月份选择
            let that = this
            this.startMonthyOptions = {
                disabledDate(date) {
                    return date && date.valueOf() > that.endMonth.valueOf()
                }
            }
            if(Date.parse(this.endMonth) < Date.parse(this.startMonth)){
                this.startMonth = this.endMonth
            }
            this.params.beginDateStr = this.$moment(this.startMonth).format('YYYY-MM')
            this.params.endDateStr = this.$moment(this.endMonth).format('YYYY-MM')
            this.getLineDataByCheckList(this.params)    // 获取数据
        },
        changeDate: function(date){ // 日、周起止日期选择
            if(this.params.dateFlag === '0'){ // 按日
                this.params.beginDateStr = this.$moment(this.dayInterval[0]).format('YYYY-MM-DD')
                this.params.endDateStr = this.$moment(this.dayInterval[1]).format('YYYY-MM-DD')
            } 
            if(this.params.dateFlag === '1'){ // 按周
                this.params.beginDateStr = this.$moment(this.weekInterval[0]).format('YYYY-MM-DD')
                this.params.endDateStr = this.$moment(this.weekInterval[1]).format('YYYY-MM-DD')
            }
            this.getLineDataByCheckList(this.params)    // 获取数据
            this.fillData()                             // 装入数据, 创建echarts
        },
        changeDateType: function(list){ // 时间维度切换
            this.params.dateFlag = list.toString()
            if(list === 2){ // 按月
                this.params.beginDateStr = this.$moment(this.startMonth).format('YYYY-MM')
                this.params.endDateStr = this.$moment(this.endMonth).format('YYYY-MM')
            }
            if(list === 1){ // 按周
                this.params.beginDateStr = this.$moment(this.weekInterval[0]).format('YYYY-MM-DD')
                this.params.endDateStr = this.$moment(this.weekInterval[1]).format('YYYY-MM-DD')
            } 
            if(list === 0) { // 按日
                this.params.beginDateStr = this.$moment(this.dayInterval[0]).format('YYYY-MM-DD')
                this.params.endDateStr = this.$moment(this.dayInterval[1]).format('YYYY-MM-DD')
            }
            this.getLineDataByCheckList(this.params)    // 获取数据
            this.fillData()                             // 装入数据, 创建echarts
        },
        changeDisplayData: function(list){ // 数据选择切换
            if(list.length === 3) this.checkList.shift()
            this.getLineDataByCheckList(this.params)    // 获取数据
            this.fillData()                             // 装入数据, 创建echarts
        },
        resize () { // 大小自适应
            this.chart.resize()
        },
        fillData () { // 装入数据
            let labelColor = ['#3fc768', '#3398db'] // 颜色配置
            this.option.series = [] // y轴数据
            this.option.yAxis = [] // y轴配置
            this.yLabel = []
            for(let i = 0; i < this.checkList.length; i++){ // 装入y轴数据
                this.yLabel.push({ name: '', color: '', isShow: true })
                switch (this.checkList[i]) {
                case 0:
                    this.option.series[i] = JSON.parse(JSON.stringify(this.orderLine))
                    this.yLabel[i].name = '总订单/单'
                    break
                case 1:
                    this.option.series[i] = JSON.parse(JSON.stringify(this.waterLine))
                    this.yLabel[i].name = '总流水/元'
                    break
                case 2:
                    this.option.series[i] = JSON.parse(JSON.stringify(this.carLine))
                    this.yLabel[i].name = '总车辆数/辆'
                    break
                }
            }
            for(let i = 0; i < this.checkList.length; i++){ // 按照多选框勾选顺序排列y轴从左到右对应
                this.yLabel[i].color = labelColor[i]
                this.option.legend.data = this.checkList.slice(0)
                this.option.series[i].yAxisIndex = i
                this.option.series[i].itemStyle.color = labelColor[i]

                this.option.yAxis[i] = JSON.parse(JSON.stringify(yAxisConfig))
                this.option.yAxis[i].axisLabel.color = labelColor[i]
                this.option.yAxis[i].nameTextStyle.color = labelColor[i]
            }
            if(this.checkList.length === 2) this.option.yAxis[1].splitLine.show = false
            if(this.checkList.length !== 0) this.initChart()
            else this.destory()
        },
        destory () { // 销毁chart
            let canvas = this.$refs.dom.childNodes
            for(var i=0; i < canvas.length;i++){
                if(!/\s/.test(canvas.nodeValue)){
                    this.$refs.dom.removeChild(canvas[i])
                }
            }
        },
        initChart () { // 渲染chart
            let that = this
            this.$refs.dom.removeAttribute('_echarts_instance_')
            this.chart = echarts.init(this.$refs.dom)
            this.chart.setOption(this.option)
            this.chart.on('legendselectchanged', function(o){
                let index = 0
                for(let item in o.selected){
                    that.yLabel[index].isShow = o.selected[item]
                    index ++
                }
            })
        }
    },
    beforeDestroy () {
        off(window, 'resize', this.resize)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
    .operator-header-wrap{
        display: flex;
        align-items: flex-end;
        padding: 15px;
        border-bottom: 1px solid #ebebeb;
        margin-bottom: 20px;
    }
    .operator-header{
        font-size: 16px;
        font-weight: bold;
    }
    .operator-update-time{
        margin-left: 20px;
    }
    .operator-echarts{
        width: 100%;
        height: 350px;
        padding-bottom: 30px;
    }
    .count-style{
        font-size: 50px;
    }
    .card-wrap{
        padding-bottom: 10px;
        height: 120px;
    }
    .limit-group-wrap{
        padding: 0 15px;
    }
    .limit-group{
        display: flex;
        align-items: center;
        margin: 20px 0;
    }
    .month-date-wrap{
        display: flex;
        align-items: center;
    }
    .time-interval-input{
        width: 200px;
    }
    .yLabel-wrap{
        display: flex;
        width: 100%;
        justify-content: space-between;
        padding: 0 27px 0 27px;
        font-size: 14px;
        margin-bottom: -35px;
    }
</style>
