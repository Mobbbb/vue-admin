<!--订单信息-->
<template>
    <div>
        <VTable
            :total="total"
            :current="current"
            :pageSize="pageSize"
            :parColumns="orderColumns"
            :parTableData="orderData"
            @changePage="changePage"
            @changePageSize="changePageSize">
        </VTable>
    </div>
</template>

<script>
import {getOrderList} from '@/api/vehicle.js'

export default {
    name:'order-list',
    created(){
        this.getList()
    },
    data(){
        return{
            orderStatusMap,
            orderData:[],
            orderColumns:[
                {
                    type:'index',
                    title:'序号',
                    width: 80
                },
                {
                    key:'type',
                    title:'订单类型',
                    minWidth: 100,
                    tooltip: true,
                    render:(h,params)=>{
                        return h('div',[
                            h('span',{
                                style:{
                                    display:params.row.orderType==1? "inline-block" :"none" 
                                }
                            },"出租车"),
                            h('span',{
                                style:{
                                    display:params.row.orderType==2? "inline-block" : "none" 
                                }
                            },"专车"),
                            h('span',{
                                style:{
                                    display:params.row.orderType==3? "inline-block" : "none" 
                                }
                            },"拼车"),
                            h('span',{
                                style:{
                                    display:params.row.orderType==4? "inline-block" : "none" 
                                }
                            },"快车"),
                            h('span',{
                                style:{
                                    display:params.row.orderType==5? "inline-block" : "none" 
                                }
                            },"货的"),
                            h('span',{
                                style:{
                                    display:params.row.orderType==6? "inline-block" : "none" 
                                }
                            },"骑手"),
                            h('span',{
                                style:{
                                    display:params.row.orderType==7? "inline-block" : "none" 
                                }
                            },"搬家"),

                        ])
                    }
                },
                {
                    key:'createTime',
                    title:'下单时间',
                    minWidth: 100,
                    tooltip: true
                },
                {
                    key:'who',
                    title:'乘车人姓名/电话',
                    minWidth: 150,
                    tooltip: true,
                    render:(h,params)=>{
                        return h('div',[
                            h('span',params.row.actualPasNam + "/"),
                            h('span',params.row.actualPasMob),
                        ])
                    }
                },
                {
                    key:'action',
                    title:'司机姓名/电话',
                    minWidth: 150,
                    tooltip: true,
                    render:(h,params)=>{
                        return h('div',[
                            h('span',params.row.driverName +'/'),
                            h('span',params.row.driverMobile),
                        ])
                    }
                },
                {
                    key:'originAddress',
                    title:'出发地',
                    minWidth: 100,
                    tooltip: true
                },
                {
                    key:'destAddress',
                    title:'目的地',
                    minWidth: 100,
                    tooltip: true
                },
                {
                    key:'mainStatus',
                    title:'订单状态',
                    minWidth: 100,
                    tooltip: true,
                    render:(h,params) =>{
                        return h('div', orderStatusMap[params.row.mainStatus])
                    }
                },
                {
                    key:'planFare',
                    title:'订单金额',
                    minWidth: 100,
                    tooltip: true
                },
                {
                    key:'routeNo',
                    title: '订单编号',
                    minWidth: 190,
                    tooltip: true,
                    render:(h,params)=>{
                        return h('div',[
                            h('a',{
                                on:{
                                    click:()=>{
                                        let id = params.row.uuid
                                        this.goToOrderDetail(id)
                                    }
                                }
                            },params.row.routeNo)
                        ])
                    }
                }
            ],
            total: null,
            current: 1,
            pageSize: 10,
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
            getOrderList(data).then(res =>{
                this.$store.commit('changeLoadingFlag', false)
                this.orderData = res.data.data.list
                this.total = res.data.data.totalCount
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
        goToOrderDetail(id){
            this.$router.push({name:'order-detail',params:{id:id}})
        }
    }
}
</script>