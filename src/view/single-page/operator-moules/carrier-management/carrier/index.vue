<template>
    <div class="carrier">
        <div class="carrier-header">
            <SearchList :inputList="inputList" @on-search="search" @on-reset="reset"></SearchList>
            <Button type="primary" @click="popView" v-hasAuth="'carrier-add'">新建运营商</Button>
        </div>
        <div class="carrier-content">
            <VTable
                :total="total"
                :current="current"
                :pageSize="pageSize"
                :parColumns="parColumns"
                :parTableData="tableData"
                @changePage="changePage"
                @changePageSize="changePageSize"
                style="margin-top: 25px;">
            </VTable>
            <Modal :width="500" v-model="isPop" :title="title" :mask-closable="false" footer-hide>
                <Update
                    :uuid="uuid"
                    :cityList="cityList"
                    :type="updateType"
                    :popView="isPop"
                    @on-confirm="confirm">
                </Update>
            </Modal>
        </div> 
    </div>
</template>

<script>
import { returnFields, inputList } from './index'
import { getCityOperatorTree } from '@/api/common'
import { cppTranslate } from '@/libs/tools'
import { getCarrierList } from '@/api/operator-carrier'
import Update from './operation/update'
 
export default {
    components: {
        Update
    },
    data () {
        return {
            ...returnFields(this),
            title: '新增运营商',
            uuid: '',
            updateType: '',
            tableData: [],
            inputList: [],
            cityList: [],
            isPop: false,
            isLoading: true,
            searchParams: {}
        }
    },
    mounted () {
        this.getTableList()
        this.inputList = JSON.parse(JSON.stringify(inputList))
        this.inputList[0].cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
        this.cityList = JSON.parse(localStorage.getItem('provinceCityList'))
    },
    methods: {
        getTableList: function(){ // 获取表格数据
            let params = JSON.parse(JSON.stringify(this.searchParams))
            params.pageSize = this.pageSize
            params.currPage = this.current
            this.$store.commit('changeLoadingFlag', true)
            getCarrierList(params).then(res => {
                this.tableData = res.data.data.list
                this.total = res.data.data.totalCount
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        popView: function(){
            this.isPop = true
            this.title = '新增运营商'
            this.updateType = 'add'
        },
        confirm: function(data){
            if(data) {
                this.getTableList()
                getCityOperatorTree().then(response => { // 获取省、市、运营商级联列表
                    let transformData = JSON.stringify(cppTranslate(response.data.data))
                    localStorage.setItem('pcOperatorList', transformData)
                })
            }
            this.isPop = false
        },
        search: function(data){
            this.current = 1
            this.searchParams = data
            this.getTableList()
        },
        reset: function(data){
            this.current = 1
            this.searchParams = data
            this.getTableList()
        },
        changePage: function(val){
            this.current = val
            this.getTableList()
        },
        changePageSize: function(val){
            this.pageSize = val
            this.getTableList()
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .carrier-header{
        margin-top: 10px;
    }
</style>
