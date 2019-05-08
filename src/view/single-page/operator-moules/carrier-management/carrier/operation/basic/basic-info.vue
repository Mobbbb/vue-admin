<template>
    <div class="basic-info">
        <div class="basic-top">
            <div class="carrier-header-title">基础信息：</div>
            <Row class="carrier-header-content">
                <Col span="6" class="basic-title">
                    <span>运营商名称：</span><span>{{carrierInfo.name}}</span>
                </Col>
                <Col span="6" class="basic-title">
                    <span>所属省 / 运营区域：</span><span>{{carrierInfo.provinceName}} / {{carrierInfo.cityName}}</span>
                </Col>
                <Col span="6" class="basic-title">
                    <span>邮箱：</span><span>{{carrierInfo.email}}</span>
                </Col>
                <Col span="6" class="basic-title">
                    <span>地址：</span><span>{{carrierInfo.address}}</span>
                </Col>
            </Row>
            <Row class="carrier-header-content">
                <Col span="6" class="basic-title">
                    <span>运营商账号：</span><span>{{carrierInfo.accountNumber}}</span>
                </Col>
                <Col span="6" class="basic-title" v-for="(item, index) in carrierInfo.mobileList" :key="index">
                    <span>电话{{index + 1}}：</span><span>{{item.area}} - {{item.number}}</span>
                </Col>
            </Row>
            <Row class="carrier-header-content">
                <Col span="24" class="basic-title" v-for="(item, index) in carrierInfo.interviewAddressList" :key="index">
                    <span>面试地址{{index + 1}}：{{item.address}}</span>
                </Col>
            </Row>
        </div>
        <div class="basic-header-wrap">
            <div class="basic-header">
                <div class="carrier-header-title">考核规则：</div>
                <div v-if="isEdit">
                    <Button @click="edit" type="primary" class="editBtn">编辑</Button>
                </div>
                <div v-else>
                    <Button @click="cancel" class="editBtn">取消</Button>
                    <Button @click="save" type="primary" class="editBtn">保存</Button>
                </div>
            </div>
            <div><Button @click="checkResult" type="primary" class="editBtn">考核结果查看</Button></div>
        </div>
        <div class="rule-table-wrap">
            <Form>
                <Spin fix size="large" style="border: 1px solid #e8eaec;" v-if="spinShow"></Spin>
                <table class="test-rule-table">
                    <tr style="background-color: #f8f8f9;">
                        <th>序号</th>
                        <th>考核内容</th>
                        <th></th><th></th>
                        <th>A</th><th>B</th><th>C</th><th>D</th>
                    </tr>
                    <tr>
                        <th></th><th></th>
                        <th class="incline-box-wrap">
                            <div class="incline-box"></div>
                            <div class="incline-box-top">分值</div>
                            <div class="incline-box-bottom">权重</div>
                        </th>
                        <th>0</th><th>0.6</th><th>0.8</th><th>1</th><th>1.2</th>
                    </tr>
                    <tr v-for="(item, index) in config">
                        <!-- index: 行号，temp: 列号 -->
                        <td>{{index + 1}}</td>
                        <td>{{item.assessment}}</td>
                        <td v-for="(i, temp) in item.lineValue">
                            <div v-if="isEdit" class="config-input-wrap">
                                <div v-if="temp === 0" class="config-input">{{i.value}}{{item.unit[0]}}</div>
                                <div v-else class="config-input">
                                    <div v-if="index !== 6 && index !== 7">
                                        [ {{i.value}} ,
                                        <span v-if="temp <= 4">{{item.lineValue[temp + 1].value}}</span>
                                        <span v-if="temp === 5">{{item.lastConfig}}</span>
                                        <span v-if="index >= 2 && temp === 5 && index !== 6 && index !== 7"> ]</span>
                                        <span v-else-if="index === 6 && temp === 1"> ]</span>
                                        <span v-else-if="index === 7 && temp === 1"> ]</span>
                                        <span v-else> )</span>
                                    </div>
                                    <div v-else>
                                        <span v-if="temp <= 4">[ {{item.lineValue[temp + 1].value}}</span>
                                        <span v-if="temp === 5">[ {{item.lastConfig}}</span>
                                        <span>, {{i.value}} )</span>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="config-input-wrap">
                                <FormItem v-if="temp === 0" :style="{marginBottom: '0'}">
                                    <div class="config-input">
                                        <div class="append-input-wrap">
                                            <InputNumber
                                                :min="0"
                                                :max="100"
                                                v-model="i.value"
                                                class="my-number-input"
                                                placeholder="请输入"
                                                :formatter="value => `${value}`"
                                                :parser="value => value.replace('%', '')">
                                            </InputNumber>
                                            <div class="append-input">{{item.unit[0]}}</div>
                                        </div>
                                    </div>
                                </FormItem>
                                <FormItem v-else :style="{marginBottom: '0'}">
                                    <div class="config-input">
                                        <span class="fixed-amount">{{i.value}}
                                            <span slot="append" v-if="index <= 4 && temp >= 1">{{item.unit[1]}}</span>
                                        </span>
                                        <span>~</span>
                                        <div class="append-input-wrap _append-input-wrap" v-if="temp <= 4">
                                            <InputNumber
                                                :min="item.min"
                                                :max="item.max"
                                                :value="item.lineValue[temp + 1].value"
                                                :class="errorList[index][temp] ? 'error-number-input': ''"
                                                placeholder="请输入"
                                                class="my-number-input"
                                                @on-change="testLineConfig(index)"
                                                v-model="item.lineValue[temp + 1].value"
                                                :parser="value => value.replace('%', '')">
                                            </InputNumber>
                                            <div 
                                                :class="errorList[index][temp] ? 'show-error-msg' : ''" 
                                                class="ivu-form-item-error-tip error-msg">
                                                输入的区间有误!
                                            </div>
                                            <div class="append-input" v-if="index <= 4 && temp >= 1">{{item.unit[1]}}</div>
                                            <div class="append-input" v-else>{{item.unit[0]}}</div>
                                        </div>
                                        <span v-if="temp === 5">{{item.lastConfig}}</span>
                                    </div>
                                </FormItem>
                            </div>
                        </td>
                    </tr>
                </table>
            </Form>
        </div>
        <Modal v-model="isPopPrepare" title="考核结果查看" :mask-closable="false" :width="350" footer-hide>
            <PopView :config="config" :popView="isPopPrepare" :carrierInfo="carrierInfo" @on-confirm="confirm"></PopView>
        </Modal>
    </div>
</template>

<script>
import { config } from './basic-info.js'
import { rulesInfo, updateRules } from '@/api/operator-carrier.js'
import PopView from './popView'
import '@/styles/cyk-style.css'

export default {
    components: {
        PopView
    },
    props: [ 'activeTab', 'carrierInfo' ],
    data () {
        return {
            errorList: new Array, // 存放每一个输入框的校验状态
            errorInputMsg: '',
            activeTemp: '',
            focusTemp: '',
            spinShow: true,
            isEdit: true,
            isPopPrepare: false,
            isPopResult: false,
            config: [],     // 配置信息
            prevConfig:[],  // 修改前的配置信息
            totalPercent: 0
        }
    },
    mounted () {
        for(let i = 0; i < 13; i++){ // 创建5×13的数组，false标识该项验证失败
            this.errorList[i] = new Array()
            for (let j = 0; j < 5; j++) this.errorList[i][j] = false
        }
        this.$store.commit('changeLoadingFlag', false)
        this.getRuleInfo()
    },
    methods: {
        getRuleInfo: function(){
            this.config = JSON.parse(JSON.stringify(config))
            rulesInfo({agentUuid: this.$route.query.uuid}).then(res => {
                this.spinShow = false
                this.config = JSON.parse(JSON.stringify(config))
                let getConfigData = res.data.data
                if(res.data.data.length){
                    this.config.forEach(function(item, index){
                        let str = getConfigData[index].weights + ',' + getConfigData[index].value
                        let arr = str.split(',')
                        item.lineValue = []
                        item.uuid = getConfigData[index].uuid
                        arr.forEach(function(_item, index){
                            item.lineValue.push({
                                value: Number(_item)
                            })
                        })
                    })
                }
                this.prevConfig = JSON.parse(JSON.stringify(this.config))
            })
        },
        /*close: function(){
            this.isPopPrepare = false
        },*/
        checkResult: function(){
            this.isPopPrepare = true
        },
        confirm: function(data){
            if(!data) this.isPopPrepare = false 
        },
        testLineConfig (index) { // 校验一行
            let temp = true
            let newArr = this.errorList.slice(0) // 克隆数组
            let lineConfig = JSON.parse(JSON.stringify(this.config[index].lineValue))
            for(let j = 0; j < lineConfig.length - 1; j++){
                let prevData = lineConfig[j].value
                let data = lineConfig[j+1].value
                if(index >= 6 && index <= 7) { // 第7、8行
                    if(data < prevData){
                        newArr[index][j] = false
                        if(data === 0 || data === null) newArr[index][j] = true
                    } else {
                        newArr[index][j] = true
                        temp = false
                    }
                } else {
                    if(data > prevData){
                        newArr[index][j] = false
                    } else {
                        newArr[index][j] = true
                        temp = false
                    }
                }
                if(data < this.config[index].min || data > this.config[index].max){
                    newArr[index][j] = true
                    temp = false
                }
            }

            this.errorList = newArr
        },
        testConfig: function(){ // 校验整个table
            let temp = true
            let newArr = this.errorList.slice(0) // 克隆数组
            this.totalPercent = 0
            for(let i = 0; i < this.config.length; i++){
                for(let j = 0; j < this.config[i].lineValue.length - 1; j++){
                    let prevData = this.config[i].lineValue[j].value
                    let data = this.config[i].lineValue[j+1].value
                    if(j === 0) { // 第1列
                        this.totalPercent += prevData
                    } else if(i >= 6 && i <= 7) { // 第7、8行
                        if(data < prevData){
                            newArr[i][j] = false
                            if(data === 0 || data === null) newArr[i][j] = true
                        } else {
                            newArr[i][j] = true
                            temp = false
                        }
                    } else {
                        if(data > prevData){
                            newArr[i][j] = false
                        } else {
                            newArr[i][j] = true
                            temp = false
                        }
                    }
                    if(data < this.config[i].min || data > this.config[i].max){
                        newArr[i][j] = true
                        temp = false
                    }
                }
            }

            this.errorList = newArr // 整体重新赋值
            return temp
        },
        edit: function(){
            this.isEdit = false
            for(let i = 0; i < 13; i++){ // 清空验证
                this.errorList[i] = new Array()
                for (let j = 0; j < 5; j++) this.errorList[i][j] = false
            } 
        },
        cancel: function(){
            this.config = JSON.parse(JSON.stringify(this.prevConfig))
            this.isEdit = true
        },
        save: function(){
            let params = JSON.parse(JSON.stringify(this.config))
            if(this.testConfig() && this.totalPercent === 100) {
                for(let i = 0; i < params.length; i++) { // 后端接收数据处理
                    params[i].weights = params[i].lineValue[0].value
                    params[i].value = ''
                    params[i].agentUuid = this.$route.query.uuid
                    params[i].lineValue.forEach((item, index) => {
                        if(index !== 0 && index !== params[i].lineValue.length - 1){
                            params[i].value += item.value + ','
                        }
                        if(index === params[i].lineValue.length - 1){
                            params[i].value += item.value
                        }
                    })
                }
                updateRules(params).then(res => {
                    this.$Message.success('操作成功!')
                    this.isEdit = true
                    this.prevConfig = JSON.parse(JSON.stringify(this.config))
                })
            }
            if(this.totalPercent !== 100){
                this.$Message.error('权重之和需为100%，当前为'+this.totalPercent.toString()+'%，请调整')
            } 
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .basic-header-wrap{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .basic-header{
        display: flex;
        align-items: center;
    }
    .carrier-header-title{
        font-size: 14px;
        margin: 20px 0;
        font-weight: bold;
    }
    .editBtn{
        margin: 0 5px 0 5px;
    }
    .rule-table-wrap{
        position: relative;
    }
    .test-rule-table{
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
    }
    .test-rule-table tr td,.test-rule-table tr th{
        padding: 13px 8px;
        border: 1px solid #e8eaec;
        min-width: 40px;
    }
    .test-rule-table tr:hover{
        background-color: #ebf7ff;
    }
    .test-rule-table tr td:nth-of-type(8n+1){
        text-align: center;
    }
    .test-rule-table tr td:nth-of-type(8n){
        width: 110px;
        text-align: center;
    }
    .test-rule-table tr td:nth-of-type(8n) .config-input-wrap .config-input .fixed-amount{
        width: auto;
        text-align: center;
    }
    .test-rule-table tr td:nth-of-type(8n+4){
        width: 200px;
    }
    .test-rule-table tr td:nth-of-type(8n+5){
        width: 200px;
    }
    .test-rule-table tr td:nth-of-type(8n+6){
        width: 200px;
    }
    .test-rule-table tr td:nth-of-type(8n+7){
        width: 200px;
    }
    .incline-box-wrap{
        position: relative;
        width: 140px;
        overflow: hidden;
    }
    .incline-box{
        width: 200px;
        height: 200px;
        top: 0;
        left: 0;
        transform: rotate(17deg);
        transform-origin: left top;
        border: 1px solid #e8eaec;
        position: absolute;
    }
    .incline-box-top{
        position: absolute;
        top: 5px;
        right: 15px;
    }
    .incline-box-bottom{
        position: absolute;
        bottom: 5px;
        left: 15px;
    }
    .config-input{
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 36px;
    }
    .fixed-amount{
        text-align: center;
        overflow: hidden;
        width: 60px;
    }
    .error-number-input {
        border: 1px solid #ed4014;
    }
    .error-msg{
        display: none;
    }
    .show-error-msg{
        display: block;
        padding-top: 4px;
    }
    .basic-title span{
        font-size: 14px;
    }
    .carrier-header-content{
        
    }
    .basic-title{
        margin-bottom: 20px;
    }
    ._append-input-wrap{
        margin: 0 10px;
    }
</style>
