<!--车管管理-->
<template>
    <div class="CM">
        <div class="CM-header">
            <SearchList :inputList="inputList" @on-search="search" @on-reset="reset"></SearchList>
            <div style="display: flex;justify-content: space-between;">
                <div>
                    <!--<Upload 
                        :data="{agentUuid: carrierInfo.uuid}"
                        @on-success="importCallback"
                        toDownTemplateUrl="/admin/carManager/downloadFile"
                        importFileUrl="/admin/carManager/importVehicleManager" 
                        btnText="导入" 
                        style="display: inline-block;margin-right: 20px;"> 
                    </Upload>
                    <Button type="primary" @click="exportFile" style="width: 80px;">导 出</Button>-->
                </div>
                <TableConfig
                    @on-confirm="changeTableColumn"
                    v-model="selectFields"
                    :customList="totalFields">    
                </TableConfig>
            </div>
        </div>
        <div class="CM-content">
            <VTable 
                :total="total"
                :current="current"
                :pageSize="pageSize"
                :isLoading="isLoading"
                :parColumns="customFields"
                :parTableData="tableData"
                @changePage="changePage"
                @changePageSize="changePageSize"
                style="margin-top: 25px;">
            </VTable>
            <Modal v-model="popEdit" :width="350" title="编辑车管" :mask-closable="false" footer-hide>
                <PopEditView @on-confirm="confirm" :popView="popEdit" :params="params"></PopEditView>
            </Modal>
            <Modal
                width="80%"
                v-model="isPopDetail"
                @on-cancel="closeDetail"
                title="车辆列表"
                :mask-closable="false"
                footer-hide>
                <CarList ref="popDetailView" :popView="isPopDetail"></CarList>
            </Modal>
            <Modal v-model="isPopDis" :width="1200" title="车辆分配" :mask-closable="false" footer-hide>
                <Distribution @on-confirm="confirm" :popView="isPopDis"></Distribution>
            </Modal>
            <Modal v-model="popAdd" :width="450" title="新增车管" :mask-closable="false" footer-hide>
                <Add @on-confirm="confirm" :popView="popAdd" :carrierInfo="carrierInfo" :type="addOrEdit" :params="params"></Add>
            </Modal>
        </div>
    </div>
</template>

<script>
import { getCustomFields } from '@/libs/tools.js'
import { returnFields, inputList } from './car-manage.js'
import { getCarManagerList } from '@/api/operator-carrier.js'
import { exportFile } from '@/libs/tools.js'
import PopEditView from './operation/edit.vue'
import Add from './operation/add.vue'
import CarList from './operation/car-list.vue'
import Distribution from './operation/distribution.vue'
import SearchList from '_a/search-list/search-list'
import Upload from '_a/import-file/index'
import VTable from '_a/v-table/v-table'
import TableConfig from '_a/table-columns/table-columns'
 
export default {
    components: {
        PopEditView,    // 编辑车管
        Add,            // 新增车管
        CarList,        // 车辆列表
        Distribution,   // 司机分配
        VTable,
        SearchList,
        TableConfig,
        Upload
    },
    props: {
        activeTab: String,
        carrierInfo: Object
    },
    data () {
        return {
            selectFields: [],   // 展示的表头
            totalFields: [],    // 全部表头
            customFields: [],   // 自定义的部分表头
            tableData:[],
            inputList: [],
            addOrEdit: '',      // 弹出框类型
            params: {},         // 编辑使用的参数
            searchParams: {},   // 搜索参数
            isPopDetail: false, // 弹出车辆列表
            popEdit: false,     // 弹出编辑
            isPopDis: false,    // 弹出车辆分配
            isLoading: true,    // table是否加载中
            popAdd: false,      // 弹出新增车辆
            current: 1,
            pageSize: 10,
            total: 0
        }
    },
    watch: {
        'activeTab': function(){
            if(this.activeTab === '6') {
                this.getTableList()
                this.inputList = JSON.parse(JSON.stringify(inputList))
            }
        }
    },
    mounted () {
        this.selectFields = []
        this.totalFields = returnFields(this)
        this.changeTableColumn()
    },
    methods: {
        exportFile: function(){
            let params = JSON.parse(JSON.stringify(this.searchParams))
            params.agentUuid = this.$route.query.uuid
            params.excelHeader = this.selectFields
            params.excelTitle = ''
            exportFile(params, '/admin/carManager/exportVehicleManager', '车管列表导出')
        },
        importCallback: function(res){
            if(res.success){
                this.$Message.success('导入成功')
                this.getTableList()
            }
        },
        addDriverManager: function(){
            this.popAdd = true
            this.params = {}
            this.addOrEdit = 'add'
        },
        changeTableColumn: function(){ // 自定义表头点击确定触发
            this.customFields = getCustomFields(this.totalFields, this.selectFields)
        },
        getTableList: function(){ // 获取表格数据
            let params = this.searchParams
            params.agentUuid = this.$route.query.uuid
            params.pageSize = this.pageSize
            params.currPage = this.current
            this.$store.commit('changeLoadingFlag', true)
            getCarManagerList(params).then(res => {
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
            this.isPopDis = false
            this.popAdd = false
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
    .CM-header{
        margin-top: 10px;
    }
</style>

