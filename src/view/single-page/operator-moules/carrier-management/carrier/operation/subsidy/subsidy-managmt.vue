<!-- 补贴管理 -->
<template>
    <div class="subsidy-managmt">
        <div class="subsidy-header">
            <SearchList :inputList="inputList" @on-search="search" @on-reset="reset"></SearchList>
            <Button type="primary" @click="popView">新建补贴设置</Button>
        </div>
        <div class="DAP-content">
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
            <Modal 
                :width="590"
                v-model="isPopAdd" 
                title="新建补贴设置" 
                :mask-closable="false" 
                footer-hide>
                <PopAddView @on-confirm="confirm" :carrierInfo="carrierInfo" :popView="isPopAdd"></PopAddView>
            </Modal>
            <Modal
                :width="300"
                v-model="isPopEdit"
                title="编辑补贴设置" 
                :mask-closable="false" 
                footer-hide>
                <PopEditlView @on-confirm="confirm" :popView="isPopEdit" :uuid="subsidyUuid"></PopEditlView>
            </Modal>
        </div>
    </div>
</template>

<script>
import { returnFields, inputList } from './subsidy-managmt.js'
import { getSubsidyList } from '@/api/operator-carrier.js'
import VTable from '_a/v-table/v-table'
import PopAddView from './operation/add.vue'
import PopEditlView from './operation/edit.vue'
import SearchList from '_a/search-list/search-list'
 
export default {
    components: {
        VTable,
        SearchList,
        PopAddView,
        PopEditlView
    },
    props: [ 'carrierInfo', 'activeTab' ],
    data () {
        return {
            searchParams: {},
            subsidyUuid: '',
            totalFields: [],
            tableData:[],
            inputList: [],
            isPopEdit: false,
            isPopAdd: false,
            current: 1,
            pageSize: 10,
            isLoading: true,
            total: 0
        }
    },
    watch: {
        'activeTab': function(){
            if(this.activeTab === '3') {
                this.getTableList()
                this.inputList = JSON.parse(JSON.stringify(inputList))
            }
        }
    },
    mounted () {
        this.totalFields = returnFields(this)
    },
    methods: {
        getTableList: function(){ // 获取表格数据
            let params = JSON.parse(JSON.stringify(this.searchParams))
            params.agentUuid = this.$route.query.uuid
            params.pageSize = this.pageSize
            params.currPage = this.current
            this.$store.commit('changeLoadingFlag', true)
            getSubsidyList(params).then(res => {
                this.tableData = res.data.data.list
                this.total = res.data.data.totalCount
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        popView: function(){
            this.isPopAdd = true
        },
        confirm: function(data){
            if(data) this.getTableList()
            this.isPopAdd = false
            this.isPopEdit = false
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
    .subsidy-header{
        margin-top: 10px;
    }
</style>
