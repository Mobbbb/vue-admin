<template>
    <div>
        <SearchList :inputList="inputList" @on-search='search' @on-reset="reset"></SearchList>
        <VTable 
            :total="total"
            :current="current" 
            :pageSize="pageSize"
            :parColumns="columns" 
            :parTableData="tableData"
            @changePage="changePage"
            @changePageSize="changePageSize"
            class="top20">
            <template slot-scope="params" slot="action">
                <Button 
                    ghost 
                    size="small" 
                    type="primary" 
                    style="margin-right: 15px;" 
                    @click="operation(params, 0)">唤醒
                </Button>
                <Button 
                    ghost 
                    size="small" 
                    type="warning" 
                    style="margin-right: 15px;" 
                    @click="operation(params, 1)">重启
                </Button>
                <Button 
                    ghost 
                    size="small" 
                    type="primary" 
                    style="margin-right: 15px;" 
                    @click="operation(params, 2)">拉取日志
                </Button>
                <Button ghost size="small" type="success">操作记录</Button>
            </template>
        </VTable>
        <Modal
            footer-hide
            :width="500"
            :title="title"
            :mask-closable="false"
            v-model="popOperationStatus">
            <Operation v-model="popOperationStatus" :parentParams="params" @on-confirm="confirm"></Operation>
        </Modal>
    </div>
</template>

<script>
import { inputList, columns } from './index'
import Operation from './operation/operation'

export default {
    components: {
        Operation
    },
    data() {
        return {
            columns,
            inputList,
            total: 0,
            current: 1,
            pageSize: 10,
            tableData: [],
            params: {},         // 弹出窗操作用参数
            searchParams: {},   // 搜索用参数
            title: '车辆唤醒',   // 弹出窗标题
            popOperationStatus: false,
        }
    },
    mounted() {
        this.getTableList()
    },
    methods: {
        getTableList () {
            this.$store.commit('changeLoadingFlag', false)
            this.tableData = [{}]
        },
        operation (params, type) {
            this.params = { type: type }
            this.params = Object.assign(this.params, params)
            this.popOperationStatus = true
            if (type === 0) {
                this.title = '车辆唤醒'
            } else if (type === 1) {
                this.title = '车辆重启'
            } else {
                this.title = '拉取日志'
            }
        },
        search (val) {
            this.current = 1
            this.searchParams = val
            this.getTableList()
        },
        reset () {
            this.searchParams = {}
            this.getTableList()
        },
        changePage (val) {
            this.current = val
            this.getTableList()
        },
        changePageSize (val) {
            this.pageSize = val
            this.getTableList()
        },
        confirm () {
            this.getTableList()
        }
    }
}
</script>
