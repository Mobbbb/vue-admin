<template>
    <div>
        <Button type="primary" @click="popAddView">新建支付方式</Button>
        <VTable 
            :isShowPage="false"
            :parColumns="columns" 
            :parTableData="tableData"
            style="margin-top: 20px;"> 
        </VTable>
        <Modal
            :width="450"
            :mask-closable="false"
            :title="popviewTitle"
            v-model="popUpdateViewStatus"
            footer-hide>
            <Update :parentParams="params" v-model="popUpdateViewStatus" @on-confirm="confirm"></Update>
        </Modal>
    </div>
</template>

<script>
import { returnColumns } from './index.js'
import { getPaywayList } from '@/api/finance'
import Update from './update'

export default {
    components: {
        Update
    },
    data () {
        return {
            params: {},
            tableData: [],
            columns: [],
            popviewTitle: '新建支付方式',
            popUpdateViewStatus: false
        }
    },
    mounted() {
        this.columns = returnColumns(this)
        this.getTableList()
    },
    methods: {
        getTableList () { // 获取表格数据
            let params = {
                currPage: 1,
                pageSize: 100
            }
            this.$store.commit('changeLoadingFlag', true)
            getPaywayList(params).then(res => {
                this.tableData = res.data.data.list
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        popAddView () {
            this.popUpdateViewStatus = true
            this.popviewTitle = '新建支付方式'
            this.params = {}
        },
        confirm () {
            this.getTableList()
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    
</style>
