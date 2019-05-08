<template>
    <div>
        <Button 
            type="primary" 
            @click="addProvider" 
            v-hasAuth="'rechargeLevel-management-add'"
            style="margin: 10px 0 20px 0;">新 增
        </Button>
        <VTable 
            :isShowPage="false"
            :parColumns="columns" 
            :parTableData="tableData"> 
        </VTable>
        <Modal v-model="popAddStatus" :width="350" title="新增充值档位" :mask-closable="false" footer-hide>
            <Add @on-confirm="confirm" :popView="popAddStatus"></Add>
        </Modal>
    </div>
</template>

<script>
import { returnColumns } from './index.js'
import { getRechargeLevelList } from '@/api/finance'
import Add from './operation/add.vue'

export default {
    components: {
        Add
    },
    data () {
        return {
            tableData: [],
            columns: [],
            popAddStatus: false
        }
    },
    mounted() {
        this.columns = returnColumns(this)
        this.getTableList()
    },
    methods: {
        getTableList: function(){ // 获取表格数据
            let params = {
                currPage: 1,
                pageSize: 100
            }
            getRechargeLevelList(params).then(res => {
                this.tableData = res.data.data.list
                this.$store.commit('changeLoadingFlag', false)
            })
        },
        addProvider: function(){
            this.popAddStatus = true
        },
        confirm: function(data){
            if(data) this.getTableList()
            this.popAddStatus = false
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    
</style>
