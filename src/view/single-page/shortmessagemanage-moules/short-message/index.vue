<template>
    <div>
        <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
        <Button type="primary" @click="createAssignment" v-hasAuth="'shortmessage-manage-add'">新建任务</Button>
        <VTable
            :total="total"
            :current="current"
            :pageSize="pageSize"
            :parColumns="columns"
            :parTableData="tableData"
            @changePage="changePage"
            @changePageSize="changePageSize"
            style="margin-top: 25px;">
            <template slot-scope="params" slot="index">
                <span>{{(current - 1)*pageSize + params.data.index + 1}}</span>
            </template>
            <template slot-scope="params" slot="action">
                <Button 
                    ghost
                    type="success"
                    size="small"
                    v-hasAuth="'shortmessage-manage-detail'"
                    @click="popDetailView(params)">详情
                </Button>
            </template>
        </VTable>
        <Modal title="新建任务" :mask-closable="false" v-model="addViewStatus" footer-hide width="550">
            <Add v-model="addViewStatus" @on-confirm="confirm"></Add>
        </Modal>
        <Modal title="任务详情" :mask-closable="false" v-model="detailViewStatus" footer-hide>
            <Detail v-model="detailViewStatus" :uuid="uuid"></Detail>
        </Modal>
    </div>
</template>

<script>
import Add from "./popview/add"
import Detail from './popview/detail'
import { columns, sendMap, inputList } from "./fields.js"
import { shortMsgList } from "@/api/announcement.js"

export default {
    components: {
        Detail,
        Add
    },
    data() {
        return {
            uuid: '', // 详情用uuid
            queryAjaxPramas: {},
            total: 0,
            current: 1,
            pageSize: 10,
            tableData: [],
            addViewStatus: false,
            detailViewStatus: false,
            inputList,
            columns,
            sendMap,
        }
    },
    created() {
        this.getList()
    },
    methods: {
        createAssignment () {
            this.addViewStatus = true
        },
        clearQueryData(data) {
            this.queryAjaxPramas = {}
            this.current = 1
            this.getList()
        },
        queryData(data) {
            this.current = 1
            this.queryAjaxPramas = data
            this.getList()
        },
        getList() {
            let params = {
                currPage: this.current,
                pageSize: this.pageSize
            };
            Object.assign(params, this.queryAjaxPramas)
            shortMsgList(params).then(res => {
                this.total = res.data.data.totalCount
                this.tableData = res.data.data.list
                this.$store.commit("changeLoadingFlag", false)
            })
        },
        popDetailView (params) {
            this.uuid = params.data.row.uuid || ''
            this.detailViewStatus = true
        },
        changePageSize(val) {
            this.pageSize = val
            this.getList()
        },
        changePage(val) {
            this.current = val
            this.getList()
        },
        confirm () {
            this.getList()
        }
    }
}
</script>

<style scoped>
    .manageDetail p {
        line-height: 30px;
        display: flex;
        padding-left: 50px;
        text-align: left;
    }
    .manageDetail .editName {
        width: 76px;
        padding: 0;
        display: inline-block;
    }
    .manageDetail .editDetail {
        width: 400px;
        display: inline-block;
    }
</style>
