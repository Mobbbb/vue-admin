<template>
    <div>
        <VTable
            :height="500"
            :total="total"
            :current="currPage"
            :pageSize="pageSize"
            :parColumns="historyColumns"
            :parTableData="tableData"
            @changePage="changePage"
            @changePageSize="changePageSize"
            style="margin-top: 25px;">
            <template slot-scope="params" slot="index">
                <span>{{(currPage - 1)*pageSize + params.data.index + 1}}</span>
            </template>
        </VTable>
        <div class="popView-footer-wrap">
            <Button type="primary" @click="close">确定</Button>
        </div>
    </div>
</template>

<script>
import { historyColumns } from '../index'
import '@/styles/cyk-style.css'

export default {
    props: ['value', 'uuid'],
    data () {
        return {
            historyColumns,
            total: 0,
            currPage: 1,
            pageSize: 10,
            tableData: []
        }
    },
    watch: {
        value () {
            if(this.value){
                
            }
        }
    },
    methods: {
        changePage (val) {
            this.currPage = val
            this.getTableList()
        },
        changePageSize (val) {
            this.pageSize = val
            this.getTableList()
        },
        close () {
            this.$emit('input', false)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
    
</style>
