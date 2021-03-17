<template>
	<div>
		<SearchList :inputList="inputList" @on-search="search" @on-reset="reset"></SearchList>
		<Button type="primary" @click="trunToAddPage">新建用户分群</Button>
		<VTable
			:total="total"
            :current="current"
            :pageSize="pageSize"
            :parColumns="columns"
            :parTableData="tableData"
            @changePage="changePage"
            @changePageSize="changePageSize"
            style="margin-top: 25px;">
            <template slot-scope="params" slot="action">
            	<Button class="actionBtn" type="warning" size="small" ghost @click="trunToEditPage(params)">编辑</Button>
            	<Button class="actionBtn" type="primary" size="small" ghost @click="trunToDetailPage(params)">详情</Button>
            	<Button
                    ghost
                    type="error"
                    size="small"
                    class="actionBtn"
                    @click="updateStatus(params, 2 , '停用')"
                    v-if="params.data.row.userGroupStatus === 1">停用
                </Button>
                <Button
                    ghost
                    type="success"
                    size="small"
                    class="actionBtn"
                    @click="updateStatus(params, 1, '启用')"
                    v-if="params.data.row.userGroupStatus === 2">启用
                </Button>
                <!--<Button type="error" size="small" ghost @click="popHistoryViewStatus = true">操作记录</Button>-->
            </template>
		</VTable>
        <Modal 
            :width="1000" 
            :mask-closable="false" 
            v-model="popHistoryViewStatus" 
            title="操作记录"
            footer-hide>
            <History uuid="asdas"></History>
        </Modal>
	</div>
</template>

<script>
import { inputList, columns } from './index'
import { getUserGroupList, updateUserGroupStatus } from '@/api/marketing'
import History from './operation/history'

export default {
    components: {
        History
    },
    data() {
        return {
            inputList: [],
            columns,
            tableData: [],
            searchParams: {},
            total: 0,
			current: 1,
			pageSize: 10,
			popHistoryViewStatus: false
        }
    },
    mounted() {
        this.inputList = JSON.parse(JSON.stringify(inputList))
        this.getTableList()
    },
    methods: {
    	getTableList () { // 获取表格数据
            let params = JSON.parse(JSON.stringify(this.searchParams))
            params.pageSize = this.pageSize
            params.currPage = this.current
            this.$store.commit('changeLoadingFlag', true)
            getUserGroupList(params).then(res => {
                let data = res.data.data
                this.tableData = data && data.list || []
                this.total = data.totalCount || 0
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        trunToAddPage () {
        	this.$router.push({ 
                name: 'add-user-group'
            })
        },
        trunToEditPage (params) {
            this.$router.push({
                name: 'edit-user-group',
                query: {
                    uuid: params.data.row.uuid,
                    userGroupType: params.data.row.userGroupType
                }
            })
        },
        trunToDetailPage (params) {
            this.$router.push({
                name: 'detail-user-group',
                query: {
                    uuid: params.data.row.uuid,
                    userGroupType: params.data.row.userGroupType
                }
            })
        },
        updateStatus (params, status, text) {
            let data = {
                status,
                uuid: params.data.row.uuid,
            }
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确定要'+ text +'吗？</p>',
                onOk: () => {
                    updateUserGroupStatus(data).then(res => {
                        this.getTableList()
                        this.$Message.success('操作成功')
                    })
                }
            })
        },
        search (data) {
            this.current = 1
            this.searchParams = data
            this.getTableList()
        },
        reset (data) {
            this.current = 1
            this.searchParams = data
            this.getTableList()
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

<style scoped>
	.actionBtn{
		margin-right: 15px;
	}
</style>