<template>
    <div class="DAP-popView">
        <div class="my-modal-wrap">
            <ul class="popView-body" :class="rowNum">
                <li class="popView-body-row">
                    <span class="popView-name _popView-name">考核时间:</span>
                    <div class="popView-input">
                        <DatePicker type="month" placeholder="请选择时间" v-model="date" :clearable="false"></DatePicker>
                    </div>
                </li>
                <li class="popView-body-row">
                    <span class="popView-name _popView-name">目标司机招聘数:</span>
                    <div class="popView-input">
                        <div class="append-input-wrap">
                            <InputNumber
                                :min="0"
                                :max="9999999"
                                class="my-number-input percent-input"
                                v-model="driverNum"
                                :formatter="value => `${value}`">
                            </InputNumber>
                            <div class="append-input">人</div>
                        </div>
                    </div>
                </li>
                <li class="popView-body-row">
                    <span class="popView-name _popView-name">临时事件完成率:</span>
                    <div class="popView-input">
                        <div class="append-input-wrap">
                            <InputNumber
                                :min="0"
                                :max="100"
                                class="my-number-input percent-input"
                                v-model="percent"
                                :formatter="value => `${value}`"
                                :parser="value => value.replace('%', '')">
                            </InputNumber>
                            <div class="append-input">%</div>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="popView-footer-wrap">
                <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
                <Button size="large" type="primary" @click="commit(1)" :loading="loading">下一步</Button>
            </div>
        </div>
        <Modal 
            v-model="showResult" 
            title="考核结果查看" 
            :mask-closable="false" 
            footer-hide 
            :width="750"
            @on-cancel="closeModal">
            <div class="result-wrap">
                <div class="result-title-wrap">
                    <Button type="primary" class="prev-btn" @click="perv">上一步</Button>
                    <div>运营商：{{carrierInfo.name}}</div>
                    <div class="result-title">考核时间：{{$moment(this.date).format('YYYY-MM')}}</div>
                    <Button type="primary" class="result-btn" @click="exportFile">导出</Button>
                </div>
                <Table :columns="columns" :data="tabledata"></Table>
                <div class="result-bottom-wrap">
                    <div>KPI得分：{{params.KPI}}</div>
                    <div>{{params.deduct}}</div>
                    <div>{{params.subsidy}}</div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import { exportFile } from '@/libs/tools.js'
import { columns } from './basic-info.js'
import { checkResult } from '@/api/operator-carrier.js'

export default {
    props: {
        config: Array,
        rowNum: {
            default: '',
            type: String
        },
        popView: Boolean,
        carrierInfo: Object
    },
    data () {
        return {
            showResult: false,
            loading: false,
            date: '',               // 考核时间
            driverNum: Number(),    // 目标司机招聘数
            percent: Number(),      // 临时事件完成率
            tabledata: [],
            columns: [],
            params: {}
        }
    },
    watch: {
        'popView': function(){
            if(this.popView){
                this.date = ''
                this.driverNum = 0
                this.percent = 0
                this.loading = false
            }
        }
    },
    mounted(){
        this.columns = columns
    },
    methods: {
        exportFile: function(){
            let params = {
                agentUuid: this.$route.query.uuid,
                startTimestamp: Date.parse(this.date),
                targetRecruitmentNum: this.driverNum,
                tempCompletionRate: this.percent
            }
            exportFile(params, '/admin/sysAgent/assessment/result/export', '考核结果')
        },
        closeModal () {
            this.commit(0)
        },
        perv () {
            this.showResult = false
        },
        commit: function(temp){
            if(temp){
                let params = {
                    agentUuid: this.$route.query.uuid,
                    startTimestamp: Date.parse(this.date),
                    targetRecruitmentNum: this.driverNum,
                    tempCompletionRate: this.percent
                }
                if(this.date !== ''){
                    this.loading = true
                    checkResult(params).then(res => {
                        this.loading = false
                        if(res.data.data !== null){
                            this.params = res.data.data
                            this.showResult = true
                            this.tabledata = this.params.assessmentDetail
                        } else {
                            this.$Message.warning(res.data.msg)
                        }
                    })
                } else {
                    this.$Message.warning('考核时间不得为空!')
                }
            } else {
                this.$emit('on-confirm', temp)
            }
            
        }
    }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less"> 
    .popView-body-row ._popView-name{
        width: 115px;
    }
    .result-title-wrap{
        margin: 0 0 12px 0;
        text-align: center;
        position: relative;
    }
    .result-title{
        padding-top: 4px;
    }
    .result-btn{
        position: absolute;
        right: 10px;
        bottom: 0;
    }
    .prev-btn{
        position: absolute;
        left: 10px;
        bottom: 0;
    }
    .result-bottom-wrap{
        border: 1px solid #e8eaec;
        border-top: 0;
        padding: 15px;
        margin-bottom: 10px;
    }
</style>
