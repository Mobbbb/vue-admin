<template>
    <div class="driver">
        <searchList :inputList="inputList" @on-search="search" @on-reset="reset"></searchList>
		<VTable 
            :total="total"
            :current="currPage"
            :pageSize="pageSize"
            :isLoading="true"
            :parColumns="parColumns"
            :parTableData="tableData"
            @changePage="changePage"
            @changePageSize="changePageSize"
            style="margin-top: 25px;">
        </VTable>
    </div>
</template>

<script>
import VTable from '_a/v-table/v-table'
import { returnFields, searchConfig, getDriverList } from './index.js'
import searchList from '_a/search-list/search-list.vue'

export default {
    components: {
        VTable,
        searchList
    },
    data () {
        return {
            ...returnFields(this),
            inputList: JSON.parse(JSON.stringify(searchConfig)),
            searchParams: {},
            tableData: [],
            parColumns: []
        }
    },
    mounted(){
        Object.entries(this.columns).forEach(([key, value])=> {this.parColumns.push(value)})
        this.getTableList()
    },
    methods: {
        getTableList: function(){ // 获取表格数据
            let params = JSON.parse(JSON.stringify(this.searchParams))
            params.userType = 2
            params.pageSize = this.pageSize
            params.currPage = this.currPage
            getDriverList(params).then(res => {
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
