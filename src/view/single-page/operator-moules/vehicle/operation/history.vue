<template>
    <div>
        <div style="position: relative;height: 540px;border: 1px solid #e8eaec;" v-show="loading">
            <Spin fix>
                <Icon type="ios-loading" size=20 class="table-spin-icon-load"></Icon>
                <div style="margin-top: 5px;">加载中...</div>
            </Spin>
        </div>
        <VTable
            v-show="!loading"
            :height="480"
            :total="total"
            :current="current" 
            :pageSize="pageSize"
            :parColumns="columns" 
            :parTableData="tableData"
            @changePage="changePage"
            @changePageSize="changePageSize"
            class="top20">
            <template slot-scope="params" slot="index">
                <span>{{(current - 1)*pageSize + params.data.index + 1}}</span>
            </template>
            <template slot-scope="params" slot="action" v-if="params.data.row.logSize || false">
                <Button ghost size="small" type="success" @click="download(params)">下载日志</Button>
            </template>
        </VTable>
    </div>
</template>

<script>
import { columns } from '../index.js'
import { downloadLog, getHistoryList } from '@/api/vehicle'

export default {
    props: ['value', 'carId'],
    data () {
        return {
            columns,
            loading: false,
            total: 0,
            current: 1,
            pageSize: 10,
            tableData: [],
            params: {},
        }
    },
    watch: {
        value () {
            if (this.value) {
                this.getTableList()
            }
        }
    },
    methods: {
        getTableList () {
            let params = {
                vin: this.carId,
                currPage: this.current,
                pageSize: this.pageSize
            }
            this.loading = true
            getHistoryList(params).then(res => {
                let data = res.data.data
                this.tableData = data && data.list || []
                this.total = data.totalCount
                this.loading = false
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        changePage (val) {
            this.current = val
            this.getTableList()
        },
        changePageSize (val) {
            this.pageSize = val
            this.getTableList()
        },
        download (params) {
            downloadLog({ key: params.data.row.identifierCode }).then(res => {
                window.location.href = res.data.data.url
            })
        },
        commit () {
            this.$emit('input', false)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped> 
    .table-spin-icon-load{
        animation: ani-table-spin 1s linear infinite;
    }
    @keyframes ani-table-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
</style>