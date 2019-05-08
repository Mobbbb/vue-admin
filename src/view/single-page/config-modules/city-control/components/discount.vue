<!--折扣矩阵-->
<template>
    <div class="discount-wrap">
        <div class="edit-discount-header">
            <Tabs v-model="typeTime" type="line" @on-click="changeTab" name="tab-discount">
                <TabPane label="即时用车" name='1' tab="tab-discount"></TabPane>
                <TabPane label="预约用车" name='2' tab="tab-discount"></TabPane>
            </Tabs>
            <Button type="dashed" @click="addConfig" class="edit-discount-btn" v-show="editTemp">添加折扣时段</Button>
        </div>
        <div v-if="loading" style="height: 70px;position: relative;">  
            <Spin fix>
                <Icon type="ios-loading" size=20 class="table-spin-icon-load"></Icon>
                <div style="margin-top: 5px;">加载中...</div>
            </Spin>
        </div>
        <div v-else>
            <div class="no-data-text" v-if="!editTemp && !params.discountList.length">
                <div>暂无数据</div>
            </div>
            <div class="discount-form-wrap" v-else-if="!editTemp && params.discountList.length">
                <div class="display-content" v-for="(item, index) in params.discountList" :key="index">
                    <div>折扣时段{{index + 1}} ：{{item.discountTime[0]}} - {{item.discountTime[1]}}</div>
                    <div style="margin-top: 10px;">折扣系数{{index + 1}} ：{{item.discountNumber}}</div>
                </div>
            </div>
            <Form
                v-else
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
                    style="width: 320px;">
                    <div style="margin-bottom: 10px;">
                        <span>折扣时段{{index + 1}} ：</span>
                        <TimePicker
                            :placement="index%2 === 0 ? 'bottom-start' : 'bottom-end'"
                            :value="item.discountTime"
                            format="HH:mm:ss" 
                            type="timerange" 
                            placeholder="请选择折扣时段"
                            @on-open-change="openTimePicker(index)"
                            @on-change="selectTime"
                            style="width: 230px;">
                        </TimePicker>
                    </div>
                    <div>
                        <span>折扣系数{{index + 1}} ：</span>
                        <InputNumber 
                            v-model="item.discountNumber" 
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
        <div class="popView-footer-wrap" style="margin-top: 80px;">
            <Button type="primary" @click="edit" v-if="!editTemp && !loading">编辑</Button>
            <div v-if="editTemp && !loading" style="display: flex;">
                <Button @click="cancel" style="margin-right: 8px;">取消</Button>
                <Button type="primary" @click="commit">保存</Button>
            </div>
        </div>
    </div>
</template>

<script>
import { saveDiscount, getDiscountInfo } from '@/api/configData'
import { hasTimesection } from '@/libs/tools.js'
import '@/styles/icon-font/iconfont.css'
import '@/styles/cyk-style.css'

export default {
    props: {
        popView: Boolean,
        cityId: String,
        tabName: String
    },
    data () {
        const discountList = (rule, value, callback) => {
            let index = Number(rule.fullField.substring(rule.fullField.length-1))
            let arr = JSON.parse(JSON.stringify(this.params.discountList))
            let [temp, flag] = [true, true]
            arr.splice(index, 1)
            if(value.discountTime[0] === value.discountTime[1]) {
                callback(new Error('折扣时段不可交叉'))
                temp = false
            }
            if(value.discountTime[0] === '' || !value.discountTime.length || value.discountNumber === null) {
                callback(new Error('请填写折扣时段及系数'))
                flag = false
            }
            if(value.discountNumber === 0){
                callback(new Error('折扣系数不可为0'))
                flag = false
            }
            for(let i = 0; i < arr.length; i++){
                if( arr[i].discountTime.length && arr[i].discountTime[0] !== '' && 
                    value.discountTime.length && value.discountTime[0] !== ''){
                    if(!hasTimesection(value.discountTime, arr[i].discountTime)) {
                        callback(new Error('折扣时段不可交叉'))
                        temp = false
                    }
                }
            }
            if(temp && flag) callback()
        }
        return {
            uuid: '',
            params: { 
                discountList: [],
            },
            loading: true,
            displayData: [],
            typeTime: '1',
            calendarIndex: '',
            editTemp: false,
            ruleValidate: {required: true, validator: discountList, trigger: 'change'}
        }
    },
    watch: {
        'popView': function(){
            if(this.popView){
                this.typeTime = '1'
                this.params.discountList = []
                this.getDiscountInfo()
                this.editTemp = false
            }
        }
    },
    methods: {
        getDiscountInfo: function(){
            let params = {
                cityUuid: this.cityId,
                typeTime: this.typeTime,
                businessType: this.tabName
            }
            this.loading = true
            getDiscountInfo(params).then(res => {
                this.params.discountList = []
                this.uuid = ''
                this.loading = false
                let data = res.data.data.content
                if(typeof(res.data.data.uuid) !== 'undefined') this.uuid = res.data.data.uuid
                if(data.length){
                    for(let i = 0; i < data.length; i++){
                        this.params.discountList.push({
                            discountTime: [data[i].startTime, data[i].endTime],
                            discountNumber: parseFloat(data[i].rate)
                        })
                    }
                }
                this.displayData = JSON.parse(JSON.stringify(this.params.discountList))
            })
        },
        changeTab: function(){
            this.params.discountList = []
            this.getDiscountInfo()
            this.editTemp = false
        },
        edit: function(){
            this.editTemp = true
        },
        cancel: function(){
            this.params.discountList = JSON.parse(JSON.stringify(this.displayData))
            this.editTemp = false
        },
        commit: function(){ // 点击保存
            let params = {
                cityUuid: this.cityId,
                content: [],
                typeTime: this.typeTime,
                businessType: this.tabName
            }
            if(!this.params.discountList.length){
                if(this.uuid !== '') params.uuid = this.uuid
                this.saveRequest(params)
            }
            this.$refs.formValidate.validate().then(res => {
                if(res){
                    let data = []
                    for(let i = 0; i < this.params.discountList.length; i++){
                        data.push({
                            startTime: this.params.discountList[i].discountTime[0],
                            endTime: this.params.discountList[i].discountTime[1],
                            rate: this.params.discountList[i].discountNumber
                        })
                    }
                    params.content = data
                    if(this.uuid !== '') params.uuid = this.uuid
                    this.saveRequest(params)
                }
            })
        },
        saveRequest: function(params){
            saveDiscount(params).then(res => {
                this.editTemp = false
                this.$Message.success('保存成功！')
                this.getDiscountInfo()
            })
        },
        openTimePicker: function(index){
            this.calendarIndex = index
        },
        selectTime: function(date){
            this.params.discountList[this.calendarIndex].discountTime = date
        },
        deleteConfig: function(index){
            this.params.discountList.splice(index, 1)
        },
        addConfig: function(){
            this.params.discountList.push({
                discountTime: [],
                discountNumber: 0
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
    .discount-wrap{
        position: relative;
        min-height: 170px;
        max-height: 650px;
        overflow-y: auto;
    }
    .edit-discount-header{
        position: relative;
    }
    .edit-discount-btn{
        position: absolute;
        z-index: 10000;
        top: 2px;
        right: 5px;
    }
    .discount-form-wrap {
        display: flex;
        flex-wrap: wrap;
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
