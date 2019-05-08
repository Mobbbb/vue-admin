<!--历史使用人-->
<template>
    <div>
        <VTable
            :total="total"
            :current="current"
            :pageSize="pageSize"
            :isLoading="isLoading"
            :parColumns="carUserColumns"
            :parTableData="carUserData"
            @changePage="changePage"
            @changePageSize="changePageSize">
        </VTable>
    </div>
</template>

<script>
import {getHistoricalUser} from '@/api/vehicle.js'

export default {
    name:'car-user-list',
    created(){
        this.getList()
    },
    data(){
        return{
            carUserData:[
                {
                    index: '1',
                    date: '2018-10-01 12:00:00',
                    where: '地点1',
                    who:'xxx',
                    phone: '13857487596',
                    start: '2018-10-01 12:00:00',
                    end: '2018-10-01 12:00:00',
                }
            ],
            carUserColumns:[
                {
                    type:'index',
                    title:'序号'
                },
                {
                    key:'name',
                    title:'司机姓名'
                },
                {
                    key:'mobile',
                    title:'联系方式'
                },
                {
                    key:'authorizationStart',
                    title:'授权开始时间'
                },
                {
                    key:'authorizationEnd',
                    title:'授权结束时间'
                },
                
            ],
            total: null,
            current: 1,
            pageSize: 10,
            isLoading: false,
        }
    },
    methods:{
        getList(){
            let data= {
                currPage: this.current,
                pageSize: this.pageSize,
                vin: this.$route.params.id
            }
            this.$store.commit('changeLoadingFlag', true)
            getHistoricalUser(data).then(res =>{
                this.$store.commit('changeLoadingFlag', false)
                this.carUserData = res.data.data.list
            })
        },
        changePageSize(val){
            this.pageSize = val;
            this.getList()
        },
        changePage(val){
            this.current = val
            this.getList()
        },
    }
}
</script>
