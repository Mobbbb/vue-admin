<template>
    <div class="DAP-popView">
        <div class="my-modal-wrap">
            <Form ref="formValidate" :model="params" :rules="ruleUser" :label-width="150">
                <FormItem label="运营商：">
                    <div class="displayInput">{{carrierInfo.name}}</div>
                </FormItem>
                <FormItem label="运营区域：">
                    <div class="displayInput">{{carrierInfo.cityName}}</div>
                </FormItem>
                <FormItem label="适用年月及抽成比例：" prop="config">
                    <div class="config-wrap" v-for="(item, index) in params.config">
                        <DatePicker
                            multiple
                            type="month"
                            class="config-month"
                            placeholder="请选择适用年月"
                            :options="options"
                            :value="item.yearMonth"
                            @on-open-change="openDatePicker(index)"
                            @on-change="selectMonth">
                        </DatePicker>
                        <span class="link-config">--</span>
                        <div class="append-input-wrap _append-input-wrap">
                            <InputNumber
                                :min="0"
                                :max="100"
                                class="my-number-input percent-input"
                                v-model="item.percentage"
                                :formatter="value => `${value}`"
                                :parser="value => value.replace('%', '')">
                            </InputNumber>
                            <div class="append-input">%</div>
                            <span v-if="index" class="iconfont icon-delete" @click="deleteConfig(index)"></span>
                        </div>
                    </div>
                </FormItem>
                <div class="add-config-wrap">
                    <div class="add-config" @click="addConfig">+添加</div>
                </div>
            </Form>
            <div class="popView-footer-wrap">
                <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
                <Button size="large" type="primary" @click="commit(1)">确定</Button>
            </div>
        </div>
    </div>
</template>

<script>
import '@/styles/cyk-style.css'
import '@/styles/icon-font/iconfont.css'
import { getIntersection, hasOneOf } from '@/libs/tools'
import { addDrp, getExistDrpMonths } from '@/api/operator-carrier.js'

export default {
    props: {
        carrierInfo: Object,
        popView: Boolean
    },
    data () {
        const config = (rule, value, callback) => {
            let that = this
            let [temp, flag] = [true, true]
            that.params.config.forEach(function(item, index){
                let arr = JSON.parse(JSON.stringify(that.params.config))
                arr.splice(index, 1)
                arr.forEach(function(_item, _index){
                    let res = getIntersection(item.yearMonth, _item.yearMonth)
                    if(res.length) {
                        callback(new Error('不可重复设置月份'))
                        temp = false
                    }
                })
                if(!item.yearMonth.length || item.percentage === null) {
                    callback(new Error('请填写适用月及抽成比例'))
                    flag = false
                }
            })
            if(temp && flag) callback()
        }
        return {
            year: '',
            calendarIndex: '',
            params: { config: [] },
            options: {},
            ruleUser: {
                config: [{
                    required: true, trigger: 'change', validator: config
                }]
            }
        }
    },
    watch: {
        'popView': function(){
            if(this.popView) {
                this.$refs.formValidate.resetFields()
                this.getExistMonths()
                this.params = {
                    config: [{
                        months: [],
                        percentage: 0,
                        yearMonth: []
                    }]
                }
            }
        }
    },
    methods: {
        getExistMonths: function(){
            getExistDrpMonths({agentUuid: this.$route.query.uuid}).then(res => {
                let testMonth = res.data && res.data.data && res.data.data.yearMonths || []
                this.options = {
                    disabledDate (date) {
                        let yyyymm = this.$moment(date).format('YYYY-MM')
                        let arr = [yyyymm]
                        let restime = hasOneOf(testMonth, arr)
                        if(restime || (date.valueOf() < Date.now() - 31536000000)) {
                            return true
                        } else {
                            return false
                        }
                    }
                }
            })
        },
        openDatePicker: function(index){
            this.calendarIndex = index
        },
        selectMonth: function(date){
            let that = this
            let temp = true
            let dateArr = []
            if(date !== '') dateArr = date.split(',')
            let endDate = new Date(dateArr[dateArr.length-1])
            that.params.config[that.calendarIndex].months = []
            dateArr.forEach(function(item, index){
                let sigleDate = new Date(item)
                if(endDate.getFullYear() !== sigleDate.getFullYear()){
                    let str = endDate.getFullYear() + '-' + (endDate.getMonth() + 1)
                    that.params.config = [{
                        months: [],
                        percentage: 0,
                        yearMonth: [str]
                    }]
                    that.calendarIndex = 0
                    temp = false
                }
                that.year = endDate.getFullYear()
                that.params.config[that.calendarIndex].months.push(Number(sigleDate.getMonth()) + 1)
            })
            if(temp) this.params.config[that.calendarIndex].yearMonth = JSON.parse(JSON.stringify(dateArr))
        },
        deleteConfig: function(index){
            this.params.config.splice(index, 1)
            this.$refs.formValidate.validate()
        },
        addConfig: function(){
            if(this.params.config.length < 12){
                this.params.config.push({
                    months: [],
                    percentage: 0,
                    yearMonth: []
                })
            } else {
                this.$Message.error('最多可添加12种配置')
            }
        },
        commit: function(temp){
            if(temp){
                this.$refs.formValidate.validate().then(response => {
                    if(response){
                        let params = {}
                        params.agentUuid = this.$route.query.uuid
                        params.year = this.year
                        params.changesArray = this.params.config
                        addDrp(params).then(res => {
                            if(res.data.success){
                                this.$emit('on-confirm', 1)
                                this.$Message.success('添加成功!')
                            }
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
    .config-wrap{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        position: relative;
    }
    .config-wrap:last-child{
        margin-bottom: 0;
    }
    .link-config{
        display: block;
        width: 20px;
        text-align: center;
    }
    .config-month{
        width: 234px;
    }
    .percent-input{
        width: 60px;
        line-height: 29px;
    }
    .icon-delete{
        font-size: 14px;
        position: absolute;
        right: -25px;
    }
    .icon-delete:hover{
        cursor: pointer;
    }
    .add-config{
        margin-left: 150px;
        width: 235px;
        height: 32px;
        color: #a7a5a5;
        line-height: 32px;
        border-radius: 4px;
        text-align: center;
        border: 1px dashed #dcdee2;
        transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out
    }
    .add-config:hover{
        color: #57a3f3;
        border-color: #57a3f3;
        cursor: pointer;
    }
    ._append-input-wrap{
        margin: 0;
        display: flex;
        align-items: center;
    }
</style>
