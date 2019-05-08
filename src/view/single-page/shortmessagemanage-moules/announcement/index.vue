<template>
    <div class="announcement">
        <SearchList :inputList="inputList" @on-search='handleSearch' @on-reset="reset"></SearchList>
        <Button type="primary" @click="handleAdd" v-hasAuth="'announcement-center-add'">添加</Button>
        <Row :style="{marginTop:'20px'}">
            <VTable 
                :total="total"
                :current="current" 
                :pageSize="pageSize"
                :parColumns="announceColumn" 
                :parTableData="announceList"
                @changePage="changePage"
                @changePageSize="changePageSize"> 
            </VTable>
        </Row>
        <Modal 
            :width="470"
            :mask-closable="false"
            v-model="popDetail"
            title="详情公告">
            <Detail :detailInfo="detailInfo" :popView="popDetail"></Detail>
        </Modal>
    </div>
</template>

<script>
import { inputList, page } from './fields.js'
import { getAnnounceList } from '@/api/announcement.js'
import Detail from './detail.vue'

export default {
    components: {
        Detail
    },
    data() {
        return {
            inputList: [],
            ...page(this),
            announceList: [],
            searchParams: {},
            undoVisible: false,
            popDetail: false,
            detailInfo: {}
        }
    },
    mounted() {
        this.getTableList()
        this.inputList = JSON.parse(JSON.stringify(inputList))
    },
    methods: {
        handleSearch(val) { // 搜索
            this.current = 1
            this.searchParams = val
            this.getTableList()
        },
        reset(val){
            this.searchParams = val
            this.getTableList()
        },
        getTableList() {
            let params = JSON.parse(JSON.stringify(this.searchParams))
            params.pageSize = this.pageSize
            params.currPage = this.current
            getAnnounceList(params).then(res => {
                this.announceList = res.data.data.list
                this.total = res.data.data.totalCount
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        handleAdd(){ // 新增公告
            this.$router.push({
                path: 'announcement-add'
            })
        },
        changePage: function(val){
            this.current = val
            this.getTableList()
        },
        changePageSize: function(val){
            this.pageSize = val
            this.getTableList()
        }
    }
}
</script>
