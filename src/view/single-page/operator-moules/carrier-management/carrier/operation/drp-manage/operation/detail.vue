<template>
    <div class="DAP-popView">
        <div class="my-modal-wrap">
            <Form ref="formValidate" :model="params" :rules="ruleUser" :label-width="135">
                <FormItem label="运营商：">
                    <div style="display: flex;">
                        <div class="displayInput">{{params.agentName}}</div>
                        <div class="DAP-edit-btn-wrap">
                            <Button type="primary" @click="edit" v-if="!isEdit">编辑</Button>
                            <div v-else style="display: flex;">
                                <Button @click="cancel" style="margin-right: 5px;">取消</Button>
                                <Button type="primary" @click="commit">保存</Button>
                            </div>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="运营区域：">
                    <div class="displayInput">{{params.agentArea}}</div>
                </FormItem>
                <FormItem label="适用年月：">
                    <div class="displayInput">{{params.year}} - {{params.month}}月</div>
                </FormItem>
                <FormItem label="抽成比例：" prop="commision">
                    <div class="popView-input" v-if="isEdit">
                        <div class="append-input-wrap">
                            <InputNumber
                                :min="0"
                                :max="100"
                                class="my-number-input percent-input"
                                v-model="params.commision"
                                :formatter="value => `${value}`"
                                :parser="value => value.replace('%', '')">
                            </InputNumber>
                            <div class="append-input">%</div>
                        </div>
                    </div>
                    <div class="popView-input" v-else>
                        <div class="displayInput">{{params.commision}}%</div>
                    </div>
                </FormItem>
                <FormItem label="特殊日期及抽成比例：" prop="editConfig" v-show="isEdit && params.editConfig.length">
                    <div v-for="(item, index) in params.editConfig" class="config-wrap">
                        <DatePicker
                            :clearable="false"
                            :options="options"
                            type="daterange"
                            class="config-year"
                            v-model="item.date"
                            :start-date="startDate"
                            placeholder="请选择日期">
                        </DatePicker>
                        <span class="link-config">--</span>
                        <div class="append-input-wrap">
                            <InputNumber
                                :min="0"
                                :max="100"
                                class="my-number-input percent-input"
                                v-model="item.percent"
                                :formatter="value => `${value}`"
                                :parser="value => value.replace('%', '')">
                            </InputNumber>
                            <div class="append-input">%</div>
                            <span class="iconfont icon-delete" @click="deleteConfig(index)"></span>
                        </div>
                    </div>
                </FormItem>
                <div class="add-config-wrap">
                    <div class="add-config" @click="addConfig" v-if="isEdit">+添加特殊日期及抽成比例</div>
                </div>
                <FormItem label="特殊日期及抽成比例：" v-if="!isEdit && config.length">
                    <div v-for="(item, index) in config" class="config-wrap config-wrap-detail displayInput">
                        <span>
                            {{item.showDate[0].getFullYear()}}-
                            {{item.showDate[0].getMonth() + 1}}-
                            {{item.showDate[0].getDate()}}
                        </span>
                        <span class="link-config">~</span>
                        <span>
                            {{item.showDate[1].getFullYear()}}-
                            {{item.showDate[1].getMonth() + 1}}-
                            {{item.showDate[1].getDate()}}
                        </span>
                        <span class="detail-percent">({{item.percent}}%)</span>
                    </div>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
import '@/styles/cyk-style.css'
import '@/styles/icon-font/iconfont.css'
import { hasDatesection } from '@/libs/tools'
import { updateDrp, drpDetail } from '@/api/operator-carrier.js'

export default {
    props: {
        uuid: String,
        popView: Boolean
    },
    data () {
        let that = this
        const editConfig = (rule, value, callback) => {
            let that = this
            let temp = true,flag = true
            that.params.editConfig.forEach(function(item, index){
                let arr = JSON.parse(JSON.stringify(that.params.editConfig))
                arr.splice(index, 1)
                arr.forEach(function(_item, _index){
                    if(!hasDatesection(item.date, _item.date)) {
                        callback(new Error('不可重复设置时段'))
                        temp = false
                    }
                    if(item.date[0] === '' || item.percent === null) {
                        callback(new Error('请填写特殊月及抽成比例'))
                        flag = false
                    }
                })
            })
            if(temp && flag) callback()
        }
        const commision = (rule, value, callback) => {
            if(value !== null) callback()
            else callback(new Error('抽成比例不得为空'))
        }
        return {
            isUpdate: false,
            isEdit: false,
            startDate: new Date(),
            options: {
                disabledDate(date) {
                    const disabledMonth = date.getMonth()
                    if(disabledMonth !== that.startDate.getMonth()){
                        return true
                    }
                } 
            },
            config: [], // 编辑前的配置
            params: {
                commision: Number(),
                editConfig: [], // 编辑时存储的配置
            },
            ruleUser: {
                commision: [{
                    required: true, trigger: 'change', validator: commision
                }],
                editConfig: [{
                    trigger: 'change', validator: editConfig
                }]
            }
        }
    },
    watch: {
        'popView': function(){
            if(this.popView){
                this.$refs.formValidate.resetFields()
                this.isEdit = false
                this.isUpdate = false
                this.getDrpDetail()
                //this.config = [ {showDate: [new Date(2018, 5, 15),new Date(2018, 5, 16)], percent: 0} ]
                //this.params.editConfig = [ {date: [new Date(2018, 5, 15),new Date(2018, 5, 16)], percent: 0} ]
            }
        }
    },
    methods: {
        getDrpDetail: function(){
            drpDetail({uuid: this.uuid}).then(res => {
                let data = res.data.data.changesArray
                this.params.agentName = res.data.data.agentName
                this.params.agentArea = res.data.data.agentArea
                this.params.year = res.data.data.year
                this.params.month = res.data.data.month
                this.params.commision = res.data.data.commision
                this.params.editConfig = []
                this.startDate = new Date(res.data.data.year, res.data.data.month - 1)
                this.config = []
                if(data){
                    for(let i = 0; i < data.length; i++){
                        this.config.push({
                            showDate: [new Date(data[i].startDay), new Date(data[i].endDay)],
                            percent: data[i].percentage
                        })
                        this.params.editConfig.push({
                            date: [new Date(data[i].startDay), new Date(data[i].endDay)],
                            percent: data[i].percentage
                        })
                    }
                }
            })
        },
        deleteConfig: function(index){
            this.params.editConfig.splice(index, 1)
            this.$refs.formValidate.validate()
        },
        addConfig: function(){
            if(this.params.editConfig.length < 5){
                this.params.editConfig.push({date: [], percent: 0})
            } else {
                this.$Message.error('最多可添加5种配置')
            }
        },
        commit: function(temp){
            this.$refs.formValidate.validate().then(res => {    
                if(res){
                    let params = []
                    let finallyParams = {}
                    this.config = JSON.parse(JSON.stringify(this.params.editConfig))
                    for(let i = 0; i < this.config.length; i++) {
                        this.config[i].showDate = []
                        this.config[i].showDate.push(new Date(this.config[i].date[0]))
                        this.config[i].showDate.push(new Date(this.config[i].date[1]))
                        params.push({
                            startDay: this.$moment(this.config[i].date[0]).format('YYYY-MM-DD'),
                            endDay: this.$moment(this.config[i].date[1]).format('YYYY-MM-DD'),
                            percentage: this.config[i].percent
                        })
                    }
                    finallyParams.commision = this.params.commision
                    finallyParams.changesArray = params
                    finallyParams.uuid = this.uuid 
                    updateDrp(finallyParams).then(res => {
                        if(res.data.success){
                            this.$Message.success('添加成功')
                            this.isUpdate = true
                            this.isEdit = false
                        }
                    })
                }
            })
        },
        cancel: function(){
            this.isUpdate = false
            this.isEdit = false
        },
        edit: function(){
            this.isEdit = !this.isEdit
        }
    }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .DAP-edit-btn-wrap{
        display: flex;
        justify-content: flex-end;
        margin-right: 5px;
    }
    .config-wrap{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        position: relative;
        height: 32px;
    }
    .config-wrap:last-child{
        margin-bottom: 0;
    }
    .config-wrap-detail{
        margin: 0;
    }
    .link-config{
        display: block;
        width: 20px;
        height: 22px;
        line-height: 22px;
        text-align: center;
    }
    .detail-percent{
        color: red;
        margin-left: 10px;
    }
    .config-year{
        width: 216px;
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
    ._popView-name{
        width: 120px;
    }
    .add-config{
        margin-left: 130px;
        width: 216px;
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
</style>
