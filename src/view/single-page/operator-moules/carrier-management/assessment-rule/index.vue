<template>
    <diV>
        <Tabs value="dailyAttendance" @on-click="getTabsName">
            <TabPane label="日考勤规则" name="dailyAttendance">
                <SearchList :inputList="dInputList" @on-search="dSearchBtn" @on-reset="dResetSearch"></SearchList>
                <Button type="primary" @click="addData" v-hasAuth="'assessment-rule-day-add'">新建</Button>
                <VTable
                    :total="total"
                    :current="current"
                    :pageSize="pageSize"
                    :parColumns="dColumns"
                    :parTableData="tableDataCom"
                    @changePage="changePage"
                    @changePageSize="changePageSize"
                    style="margin-top: 25px;">   
                </VTable>
            </TabPane>
            <TabPane label="月考勤规则" name="monthAttendance">
                <SearchList :inputList="mInputList" @on-search="mSearchBtn" @on-reset="mResetSearch"></SearchList>
                <Button type="primary" @click="addData" v-hasAuth="'assessment-rule-month-add'">新建</Button>
                <VTable
                    :total="total"
                    :current="current"
                    :pageSize="pageSize"
                    :parColumns="mColumns"
                    :parTableData="tableDataCom"
                    @changePage="changePage"
                    @changePageSize="changePageSize"
                    style="margin-top: 25px;">    
                </VTable>
            </TabPane>
        </Tabs>
        <Modal v-model="isShowRuleModal" :title="ruleModalTitle" :mask-closable="false" :footer-hide='isReadonly' :width="width">
            <Form :model="commonFormData" :label-width="100" ref='checkForm' :rules='checkRule'>
                <!-- 日考勤 -->
                <div v-if='isShowDayCard'>
                    <FormItem label='日在线时长' prop='onlineDuration' v-show='!isReadonly'>
                        <InputNumber v-model="commonFormData.onlineDuration" :min='1' :max='1440' placeholder="请输入时长: 单位(分钟)" style="width:200px"></InputNumber> 分钟
                    </FormItem>
                    <FormItem label='日高峰时长' prop='heightDuration' v-show='!isReadonly'>
                        <InputNumber v-model="commonFormData.heightDuration" :min='1' :max='1440'  placeholder="请输入时长: 单位(分钟)" style="width:200px"></InputNumber> 分钟
                    </FormItem>
                </div>
                <!-- 月考勤 -->
                <Card  style="text-align:left;margin-bottom: 15px;" v-else>
                    <FormItem label='选择年'  prop="examineYear">
                        <DatePicker type="year" v-model='commonFormData.examineYear' :editable='false' @on-change='selectCheckYear' placeholder="请选择日期" style="width: 200px"></DatePicker>
                    </FormItem>
                    <Col v-for="(data, index) in commonFormData.list" :key='index' style="display: flex;">
                        <FormItem label='月份'>
                            <TreeInput
                                :data="allMonths"
                                inputHeight="50px"
                                v-model="data.month"
                                @on-change="selectMonth">   
                            </TreeInput>
                        </FormItem>
                        <FormItem label='出勤天数' :labelWidth="75">
                            <InputNumber v-model="data.day" :min='1' :max='data.max' placeholder="请选择天数" style="width:160px;"></InputNumber>
                        </FormItem>
                        <Button
                            v-if="!isReadonly"
                            @click="deleteWorkTime(index)"
                            style="height: 32px; margin: 2px 0 0 15px;">
                            <Icon type="md-close" />
                        </Button>
                    </Col>
                    <div style="text-align: right;" v-if="!isReadonly">
                        <Button type="success" ghost @click='setWorkCheckTime'><Icon type="md-add" />添加</Button>
                    </div>
                </Card>
                <FormItem label='适用城市' prop="cityUuids" v-if='!isReadonly&&!isEdit'>
                    <Cascader :data="citysdata" trigger="hover" v-model="commonFormData.cityUuids" placeholder="请选择城市" style="width:190px;"></Cascader>
                </FormItem>
                <FormItem label='日在线时长' v-show='isReadonly'>
                    <div>{{commonFormData.onlineDuration}} 分钟</div>
                </FormItem>
                <FormItem label='日高峰时长' v-show='isReadonly'>
                    <div>{{commonFormData.heightDuration}} 分钟</div>
                </FormItem>
                <FormItem label='适用城市' v-show='isReadonly||isEdit'>
                    {{commonFormData.cityName}}   
                    </Cascader>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="isShowRuleModal = false">关闭</Button>
                <Button v-if='isEdit' type="success" @click="auditRule">保存</Button>
                <Button @click="confirmHandle" v-show="!isEdit" type="primary">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { returnDayilyFields, returnMonthFields, dInputList, mInputList, allMonths, getDaysByMonth } from "./fields"
import { getProvinceCodeByCityKey, treeDataTranslate, getIntersection } from '@/libs/tools'
import { attendanceRuleList, 
        addAttendanceRule,
        attendanceRuleDetail,
        removeAttendanceRule,
        auditAttendanceRule } from '@/api/driver.js'
import TreeInput from '_a/tree-input/tree-input.vue'

export default {
    components: {
        TreeInput
    },
    name: 'assessmentRule',
    data () {
        return {
            allMonths: [],
            dInputList,
            mInputList,
            tabName: 'dailyAttendance',
            width: 400,
            total: 0,
            current: 1,
            pageSize: 10,
            dColumns: [],
            mColumns: [],
            tableDataCom: [],
            isEdit: false,
            isReadonly: false,
            ruleModalTitle: '新增规则',
            isShowRuleModal: false, // 是否显示弹窗
            isShowDayCard: true,
            uuid:'', // 列表uuid
            dSearchData: {},// 日考勤搜索条件
            mSearchData: {},// 月考勤搜索条件
            commonFormData: { list: [] },
            checkRule: {
                onlineDuration: [{required: true, message: '请填写日在线时间'}],
                heightDuration: [{required: true, message: '请填写日高峰时间'}],
                examineYear: [{required: true, message: '请填写年份'}],
                /*month: [{type: 'number', required: true, message: '请填写月份'}],
                day: [{type: 'number',required: true, message: '请填写出勤天数'}],*/
                cityUuids: [{type: 'array',required: true, message: '请填写城市'}],
                //agentUuids: [{type: 'array',required: true, message: '请填写运营商'}]
            }
        }
    },
    created() {
        Object.entries(returnDayilyFields(this)).forEach(([key, value]) => {
            this.dColumns.push(value)
        });
        Object.entries(returnMonthFields(this)).forEach(([key, value]) => {
            this.mColumns.push(value)
        });
        this.dInputList[0].cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
        this.mInputList[0].cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
        this.citysdata = JSON.parse(localStorage.getItem('provinceCityList')) 
    },
    mounted () {
        let month = JSON.parse(JSON.stringify(allMonths))
        this.allMonths = treeDataTranslate(month, 'value')
        this.getAttendanceList()
    },
    methods: {
        getAttendanceList () {
            let data =  this.tabName == 'monthAttendance' ? this.mSearchData : this.dSearchData
            let params = JSON.parse(JSON.stringify(data))
            params.pageSize = this.pageSize
            params.currPage = this.current
            params.examineType = this.tabName == 'monthAttendance' ? "M" : 'D'
            this.$store.commit('changeLoadingFlag', true)
            attendanceRuleList(params).then(res => {
                this.total = res.data.data.totalCount
                this.tableDataCom = res.data.data.list
                this.tableDataCom.forEach(item => {
                    item.edit = false
                })
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        getTabsName (val) { // 点击切换tab
            this.tabName = val
            if (this.tabName == 'monthAttendance') {
                this.isShowDayCard = false
                this.width = 800
            } else {
                this.isShowDayCard = true
                this.width = 400
            }
            this.getAttendanceList()
        },
        changePage (val) {
            this.current = val
            this.getAttendanceList()
        },
        changePageSize (val) {
            this.pageSize = val
            this.getAttendanceList()
        },
        dSearchBtn (data) {
            this.current = 1
            this.dSearchData = data
            this.getAttendanceList()
        },
        dResetSearch (data) {
            this.current = 1
            this.dSearchData = data
            this.getAttendanceList()
        },
        mSearchBtn (data) {
            this.current = 1
            this.mSearchData = data
            this.getAttendanceList()
        },
        mResetSearch (data) {
            this.current = 1
            this.mSearchData = data
            this.getAttendanceList()
        },
        detailHandle(id) {
            this.ruleModalTitle = '查看详情'
            this.isShowRuleModal = true
            this.isReadonly = true
            this.isEdit = false
            this.getSingleData(id)
        },
        getSingleData(id){
            attendanceRuleDetail({uuid: id}).then(res=>{
                let data = res.data.data
                this.isShowDayCard = true
                this.commonFormData = data
                this.commonFormData.cityUuids = [getProvinceCodeByCityKey(data.cityCode), data.cityCode]
                if(data.examineType == 'M') {
                    this.commonFormData.list = JSON.parse(data.examineValue)
                    let isTrue = Array.isArray(this.commonFormData.list)
                    isTrue && this.commonFormData.list.forEach(item=> {
                        item.day = Number(item.day)
                    })
                    this.commonFormData.examineYear = data.examineYear.toString()
                    this.isShowDayCard = false
                }
            })
        },
        auditHandle(editId) {
            this.getSingleData(editId)
            this.ruleModalTitle = '编辑考勤规则'
            this.isShowRuleModal = true
            this.isReadonly = false
            this.isEdit = true
        },
        auditRule(editId) { // 日考勤修改接口
            this.$refs.checkForm.validate(valid=>{
                if(valid){
                    let params = {
                        uuid: this.uuid,
                        examineType: 'D',
                        onlineDuration: this.commonFormData.onlineDuration,
                        heightDuration:  this.commonFormData.heightDuration
                    }
                    auditAttendanceRule(params).then(res=> {
                        this.$Message.success('修改成功！')
                        this.isShowRuleModal = false;
                        this.getAttendanceList()
                    })
                }
            })
        },
        auditMonthRule(params){ // 月考勤修改接口
            auditAttendanceRule(params).then(res=> {
                this.$Message.success('修改成功！')
                this.getAttendanceList()
            })
        },
        addData(){
            this.ruleModalTitle = '新建考勤规则'
            this.isReadonly = false;
            this.isShowRuleModal = true;
            this.isEdit = false;
            this.$refs.checkForm.resetFields()
            this.commonFormData = { 
                list: [
                    { month: [], day: null, max: null},
                    { month: [], day: null, max: null}
                ] 
            }
            this.commonFormData.examineType = this.tabName == 'monthAttendance' ? 'M': 'D';
            this.commonFormData.onlineDuration = null
            this.commonFormData.heightDuration = null;
        },
        selectCheckYear(data) {
            this.commonFormData.examineYear = data
            this.changeMinDay()
        },
        setWorkCheckTime() {
            let obj = {
                month: [],
                day: null,
                max: null
            }
            this.commonFormData.list.push(obj)
        },
        deleteWorkTime(i) {
            let items = this.commonFormData.list
            items.splice(i, 1)
        },
        selectMonth() {
            if(typeof(this.commonFormData.examineYear) !== 'undefined' && this.commonFormData.examineYear !== ''){
                this.changeMinDay()
            }
        },
        changeMinDay() {
            this.commonFormData.list.forEach(item => {
                let arr = []
                item.month.forEach(_item => {
                    var d = new Date(this.commonFormData.examineYear, _item, 0)
                    arr.push(d.getDate())
                })
                if(arr.length) item.max = Math.min(...arr)
                if(item.max < item.day) item.day = item.max
            })
        },
        confirmHandle() {
            this.$refs.checkForm.validate(valid => {
                if(valid){
                    let params = JSON.parse(JSON.stringify(this.commonFormData))
                    if(this.commonFormData.examineType === 'M'){
                        let text = '请添加月份和出勤天数!'
                        let [temp, flag] = [true, true]

                        if(!params.list.length) temp = false
                        else {
                            params.list.forEach((item, index) => {
                                let arr = JSON.parse(JSON.stringify(this.commonFormData.list))
                                arr.splice(index, 1)
                                arr.forEach((_item, _index) => {
                                    let res = getIntersection(item.month, _item.month)
                                    if(res.length) {
                                        text = '不可重复设置月份!'
                                        temp = false
                                    }
                                })

                                if(!item.month.length || item.day === null) {
                                    text = '请填写月份和出勤天数!'
                                    flag = false
                                }
                            })
                        }
                        
                        if (temp && flag) {
                            params.list.forEach(item => { item.month = item.month.join() })
                            addAttendanceRule(params).then(res => {
                                let msg = res.data.msg
                                this.$Message.success('新建成功！')
                                this.isShowRuleModal = false
                                this.getAttendanceList()
                            })
                        } else {
                            this.$Message.error(text)
                        }
                    } else {
                        addAttendanceRule(params).then(res => {
                            let msg = res.data.msg
                            this.$Message.success('新建成功！')
                            this.isShowRuleModal = false
                            this.getAttendanceList()
                        })
                    }  
                }
            })
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .blockline {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .content-container {
        margin: 10px 0 0 0;
    }
    .content-container .operate-wrap {
        margin: 0 0 10px 0;
        text-align: right;
    }
    .search-input-wrap{
        display: flex;
        flex-wrap: wrap;
    }
    .search-input-wrap > div{
        display: flex;
        margin-right: 35px;
    }
    .titlers{
        margin-left: 30px;
    }
</style>
