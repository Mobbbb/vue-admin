<template>
    <div class="passenger">
        <searchList :inputList="inputList" @on-search="search" @on-reset="reset"></searchList>
        <!--<TableConfig
            @on-confirm="changeTableColumn"
            v-model="selectColumns"
            :customList="columns">
        </TableConfig>-->
		<VTable 
            :total="total"
            :current="currPage"
            :pageSize="pageSize"
            :isLoading="true"
            :parColumns="customColumns"
            :parTableData="tableData"
            @changePage="changePage"
            @changePageSize="changePageSize"
            style="margin-top: 25px;">
        </VTable>
    </div>
</template>

<script>
import { getCustomFields } from '@/libs/tools.js'
import { returnFields, searchConfig, getPassengerList } from './index.js'
import searchList from '_a/search-list/search-list.vue'
import TableConfig from '_a/table-columns/table-columns'
import VTable from '_a/v-table/v-table'

export default {
    components: {
        VTable,
        searchList,
        TableConfig
    },
    data() {
        return {
            ...returnFields(this),
            inputList: JSON.parse(JSON.stringify(searchConfig)),
            searchParams: {},
            tableData: [],
            selectColumns: [], // 展示的表头
            customColumns: [], // 自定义的部分表头
        }
    },
    mounted() {
        this.changeTableColumn()
        this.getTableList()
    },
    methods: {
        changeTableColumn: function(){ // 自定义表头点击确定触发
            this.customColumns = getCustomFields(this.columns, this.selectColumns)
        },
        getTableList() { // 获取表格数据
            let params = JSON.parse(JSON.stringify(this.searchParams))
            params.userType = 1
            params.pageSize = this.pageSize
            params.currPage = this.currPage
            getPassengerList(params).then(res => {
                this.tableData = res.data.data.list
                this.total = res.data.data.totalCount
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        changePage(val) {
            this.currPage = val
            this.getTableList()
        },
        changePageSize(val) {
            this.pageSize = val
            this.getTableList()
        },
        search(val) {
            this.current = 1
            this.searchParams = val
            this.getTableList()
        },
        reset(val) {
            this.searchParams = val
            this.getTableList()
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    
</style>
