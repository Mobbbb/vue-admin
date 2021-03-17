<template>
    <diV>
        <Tabs v-model="tabName" @on-click="getTabsName">
            <TabPane label="日考勤规则" name="D"></TabPane>
            <TabPane label="月考勤规则" name="M"></TabPane>
        </Tabs>
        <SearchList :inputList="inputList" @on-search="searchBtn" @on-reset="resetSearch"></SearchList>
        <Button type="primary" @click="addData" v-hasAuth="'assessment-rule-month-add'">新建</Button>
        <VTable
            :total="total"
            :current="current"
            :pageSize="pageSize"
            :parColumns="columns"
            :parTableData="tableDataCom"
            @changePage="changePage"
            @changePageSize="changePageSize"
            style="margin-top: 25px;">  
            <template slot-scope="params" slot="action">
                <Button 
                    ghost 
                    size="small" 
                    type="warning"
                    @click="editRules(params)"
                    style="margin-right: 15px;"
                    v-hasAuth="'assessment-rule-month-edit'">编辑
                </Button>
                <Button 
                    ghost 
                    size="small"
                    type="success"
                    @click="checkRevisons(params)">查看历史版本
                </Button>
            </template>  
        </VTable>
        <Modal 
            v-model="popAddStatus" 
            title="新建考勤规则" 
            :mask-closable="false" 
            :footer-hide='true' 
            :width="width">
            <Add 
                :type="tabName" 
                v-model="popAddStatus"
                @on-confirm="confirm">
            </Add>
        </Modal>
        <Modal 
            v-model="popEditStatus" 
            title="编辑考勤规则" 
            :mask-closable="false" 
            :footer-hide='true' 
            width="400">
            <Edit 
                :parentParams="params" 
                v-model="popEditStatus"
                @on-confirm="confirm">
            </Edit>
        </Modal>
        <Modal 
            v-model="popRevisionStatus" 
            title="历史版本" 
            :mask-closable="false" 
            :footer-hide='true' 
            width="900">
            <Revisions :parentParams="params" :type="tabName" v-model="popRevisionStatus"></Revisions>
        </Modal>
    </div>
</template>

<script>
import { returnDayilyFields, returnMonthFields, dInputList, mInputList } from "./fields"
import { attendanceRuleList } from '@/api/driver.js'
import Add from './popview/add'
import Edit from './popview/edit'
import Revisions from './popview/revisions'

export default {
    components: {
        Add,
        Edit,
        Revisions
    },
    name: 'assessmentRule',
    data () {
        return {
            dInputList,
            mInputList,
            inputList: [],
            tabName: 'D',
            width: 400,
            total: 0,
            current: 1,
            pageSize: 10,
            columns: [],
            tableDataCom: [],
            popAddStatus: false,        // 新增弹窗
            popRevisionStatus: false,   // 历史版本弹窗
            popEditStatus: false,       // 编辑弹窗
            dSearchData: {},            // 日考勤搜索条件
            mSearchData: {},            // 月考勤搜索条件
            params: {},                 // 编辑/历史记录用参数
        }
    },
    created() {
        this.columns = returnDayilyFields(this)
        this.dInputList[0].cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
        this.mInputList[0].cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
        this.inputList = JSON.parse(JSON.stringify(this.dInputList))
    },
    mounted () {
        this.getAttendanceList()
    },
    methods: {
        getAttendanceList () {
            let data =  this.tabName === 'M' ? this.mSearchData : this.dSearchData
            let params = JSON.parse(JSON.stringify(data))
            params.pageSize = this.pageSize
            params.currPage = this.current
            params.examineType = this.tabName
            this.$store.commit('changeLoadingFlag', true)
            attendanceRuleList(params).then(res => {
                this.total = res.data.data.totalCount
                this.tableDataCom = res.data.data.list
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        getTabsName (val) { // 点击切换tab
            if (this.tabName == 'M') {
                this.width = 700
                this.columns = returnMonthFields(this)
                this.inputList = JSON.parse(JSON.stringify(this.mInputList))
            }
            else {
                this.width = 400
                this.columns = returnDayilyFields(this)
                this.inputList = JSON.parse(JSON.stringify(this.dInputList))
            }
            this.getAttendanceList()
        },
        confirm () {
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
        resetSearch (data) {
            this.current = 1
            if (this.tabName == 'M') this.mSearchData = data
            else this.dSearchData = data
            this.getAttendanceList()
        },
        searchBtn (data) {
            this.current = 1
            if (this.tabName == 'M') this.mSearchData = data
            else this.dSearchData = data
            this.getAttendanceList()
        },
        editRules (params) { // 弹出编辑
            this.popEditStatus = true
            this.params = {
                uuid: params.data.row.uuid,
                examineType: this.tabName,
                month: params.data.row.month,
                onlineDuration: params.data.row.onlineDuration,
                heightDuration: params.data.row.heightDuration,
                day: params.data.row.day || null
            }
        },
        checkRevisons (params) { // 弹出历史版本
            this.popRevisionStatus = true
            this.params = {
                cityUuid: params.data.row.cityUuid[0] || 0,
                examineType: this.tabName,
                cityName: params.data.row.cityName,
                month: Number(params.data.row.month),
                examineYear: Number(params.data.row.examineYear)
            }
        },
        addData () { // 弹出新建考勤规则
            this.popAddStatus = true
        }
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
