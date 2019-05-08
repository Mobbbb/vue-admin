<!--司管管理-->
<template>
    <div class="DM">
        <div class="DM-header">
            <SearchList :inputList="inputList" @on-search="search" @on-reset="reset"></SearchList>
            <!--<Upload
                :data="{agentId: carrierInfo.uuid}"
                @on-success="importCallback"
                toDownTemplateUrl="/download/导入司管模板.xlsx"
                importFileUrl="/manager/driver/manager/importDriverAdmin" 
                btnText="导入" 
                style="display: inline-block;margin-right: 20px;">    
            </Upload>
            <Button type="primary" @click="exportFile" style="width: 80px;">导 出</Button>-->
        </div>
        <div class="DM-content">
            <VTable 
                :total="total"
                :current="current"
                :pageSize="pageSize"
                :isLoading="isLoading"
                :parColumns="totalFields"
                :parTableData="tableData"
                @changePage="changePage"
                @changePageSize="changePageSize"
                style="margin-top: 25px;">
            </VTable>
            <Modal v-model="popEdit" :width="350" title="编辑司管" :mask-closable="false" footer-hide>
                <PopEditView @on-confirm="confirm" :popView="popEdit" :params="params"></PopEditView>
            </Modal>
            <Modal
                width="80%"
                v-model="popDetail" 
                @on-cancel="closeDetail" 
                title="司机列表"
                :mask-closable="false" 
                footer-hide>
                <PopDetailView ref="popDetailView" :popView="popDetail" :driverMId="driverMId"></PopDetailView>
            </Modal>
        </div>
    </div>
</template>

<script>
import { returnFields, inputList } from './driver-manage.js'
import { exportFile } from '@/libs/tools.js'
import { driverMList } from '@/api/operator-carrier.js'
import VTable from '_a/v-table/v-table'
import PopEditView from './operation/edit.vue'
import PopDetailView from './operation/detail.vue'
import SearchList from '_a/search-list/search-list'
import Upload from '_a/import-file/index'
 
export default {
    components: {
        VTable,
        SearchList,
        PopEditView,
        PopDetailView,
        Upload
    },
    props: {
        activeTab: String,
        carrierInfo: Object
    },
    data () {
        return {
            driverMId: '',      // 当前点击的司管id
            searchParams: {},   // 搜索参数
            params: {},         // 编辑用的参数
            totalFields: [],    // 全部表头
            tableData:[],
            inputList: [],
            popDetail: false,
            popEdit: false,
            current: 1,
            pageSize: 10,
            isLoading: true,
            total: 0
        }
    },
    watch: {
        'activeTab': function(){
            if(this.activeTab === '5') {
                this.getTableList()
                this.inputList = JSON.parse(JSON.stringify(inputList))
            }
        }
    },
    mounted () {
        this.totalFields = returnFields(this)
    },
    methods: {
        exportFile: function(){
            let params = JSON.parse(JSON.stringify(this.searchParams))
            params.agentUuid = this.$route.query.uuid
            exportFile(params, '/manager/driver/manager/exportDriverAdmin',  '司管列表导出')
        },
        importCallback: function(res){
            if(res.success){
                this.$Message.success('导入成功')
                this.getTableList()
            }
        },
        getTableList: function(){ // 获取表格数据
            let params = JSON.parse(JSON.stringify(this.searchParams))
            params.agentUuid = this.$route.query.uuid
            params.pageSize = this.pageSize
            params.currPage = this.current
            params.orderColumn = 'real_name'
            this.$store.commit('changeLoadingFlag', true)
            driverMList(params).then(res => {
                this.tableData = res.data.data.list
                this.total = res.data.data.totalCount
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        popView: function(){
            this.popEdit = true
        },
        confirm: function(data){
            if(data) this.getTableList()
            this.popEdit = false
        },
        closeDetail: function(){
            if(this.$refs.popDetailView.isUpdate) this.getTableList()
        },
        search: function(data){
            this.current = 1
            this.searchParams = data
            this.getTableList()
        },
        reset: function(data){
            this.searchParams = data
            this.getTableList()
        },
        changePage: function(val){
            this.current = val
            this.getTableList()
        },
        changePageSize: function(val){
            this.pageSize = val
            this.getTableList()
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .DM-header{
        margin-top: 10px;
    }
</style>

