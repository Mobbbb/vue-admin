<template>
    <div>
        <SearchList
        	ref="searchList"
        	:inputList="inputList"
        	@on-search="search"
        	@on-reset="reset">
        </SearchList>
        <Button type="primary" @click="turnToAdd">新建券模板</Button>
        <VTable
            :total="total"
            :current="currPage"
            :pageSize="pageSize"
            :parColumns="columns"
            :parTableData="tableData"
            @changePage="changePage"
            @changePageSize="changePageSize"
            style="margin-top: 25px;">
            <template slot-scope="params" slot="index">
	            <span>{{(currPage - 1)*pageSize + params.data.index + 1}}</span>
	        </template>
            <template slot-scope="params" slot="action">
	            <Button 
	            	ghost 
	            	type="primary" 
	            	size="small" 
	            	@click="turnToDetail(params)" 
	            	style="margin-right: 15px">详情
	            </Button>
                <Button 
                    ghost
                    type="error"
                    size="small"
                    style="margin-right: 15px"
                    v-if="params.data.row.status === 1"
                    @click="changeStatus(params)">停用
                </Button>
	            <!--<Button ghost type="success" size="small" @click="popHistoryView(row)">操作记录</Button>-->
	        </template>
        </VTable>
        <Modal v-model="popHistoryStatus" :width="800" title="操作记录" :mask-closable="false" footer-hide>
            <History v-model="popHistoryStatus" :uuid="uuid"></History>
        </Modal>
    </div>
</template>

<script>
import { inputList, columns } from './index'
import { getCouponsTemplateList, banCouponsTemplate } from '@/api/marketing'
import History from './popview/history.vue'

export default {
	components: {
		History
	},
    data () {
        return {
        	columns,
        	uuid: null, // 操作记录用uuid
        	inputList: [],
        	total: 0,
        	pageSize: 10,
			currPage: 1,
            tableData: [],
            searchParams: {},
            popHistoryStatus: false
        }
    },
    mounted () {
        this.inputList = JSON.parse(JSON.stringify(inputList))
        this.getTableList()
    },
    methods: {
        getTableList () { // 获取表格数据
            let params = JSON.parse(JSON.stringify(this.searchParams))
            params.pageSize = this.pageSize
            params.currPage = this.currPage
            this.$store.commit('changeLoadingFlag', true)
            getCouponsTemplateList(params).then(res => {
                this.tableData = res.data.data && res.data.data.list || []
                this.total = res.data.data.totalCount || 0
                this.$store.commit('changeLoadingFlag', false)
            }) 
        },
        turnToAdd () {
        	this.$router.push({
        		name: 'add-coupons-template'
        	})
        },
        turnToDetail (params) {
        	this.$router.push({
        		name: 'coupons-template-detail',
        		query: {
        			uuid: params.data.row.uuid
        		}
        	})
        },
        changeStatus (params) {
            this.$Modal.confirm({
                title: '提示',
                content: '确定要停用此模板吗？',
                onOk: () => {
                    banCouponsTemplate({ uuid: params.data.row.uuid }).then(res => {
                        this.$Message.success('操作成功')
                        this.getTableList()
                    })
                }
            }) 
        },
        popHistoryView (params) {
        	this.uuid = params.data.row.uuid
        	this.popHistoryStatus = true
        },
        search (data) {
            this.currPage = 1
            this.searchParams = data
            this.getTableList()
        },
        reset (data) {
            this.currPage = 1
            this.searchParams = data
            this.getTableList()
        },
        changePage (val) {
            this.currPage = val
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
