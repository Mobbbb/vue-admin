<template>
    <div style="margin-top: 10px;">
        <VTable 
            :isShowPage="false"
            :parColumns="columns" 
            :parTableData="tableData"> 
        </VTable>
    </div>
</template>

<script>
import { returnColumns } from './index.js'
import { getPaywayList } from '@/api/finance'

export default {
    data () {
        return {
            tableData: [],
            columns: []
        }
    },
    mounted() {
        this.columns = returnColumns(this)
        this.getTableList()
    },
    methods: {
        getTableList: function(){ // 获取表格数据
            let params = {
                currPage: 1,
                pageSize: 100
            }
            getPaywayList(params).then(res => {
                this.tableData = res.data.data.list
                this.$store.commit('changeLoadingFlag', false)
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    
</style>
