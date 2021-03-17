<template>
    <div>
        <VTable
            :height="500"
            :total="total"
            :current="current"
            :pageSize="pageSize"
            :parColumns="historyColumns"
            :parTableData="tableData"
            @changePage="changePage"
            @changePageSize="changePageSize"
            style="margin-top: 25px;">
            <template slot-scope="params" slot="index">
                <span>{{params.data.index + 1 + pageSize*(current - 1)}}</span>
            </template>
        </VTable>
    </div>
</template>

<script>
import { historyColumns } from '../index'

export default {
    props: {
        uuid: {
            default: '',
            type: String
        }
    },
    data () {
        return {
            total: 0,
            current: 1,
            pageSize: 0,
            tableData: [{}],
            historyColumns
        }
    },
    mounted () {
        
    },
    methods: {
        getTableList () {
            this.$store.commit('changeLoadingFlag', false)
        },
        changePage (val) {
            this.current = val
            this.getTableList()
        },
        changePageSize (val) {
            this.pageSize = val
            this.getTableList()
        }
    }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped> 
    
</style>
