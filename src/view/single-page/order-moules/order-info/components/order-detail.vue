<template>
    <div style="display: flex;">
        <table class="order-detail-table">
            <tr v-for="(item, index) in orderLeftData" :key="index">
                <td>{{item.title}}</td>
                <td>
                    <Col v-for="(cell, index) in item.value" :span="cell.span" :key="index">
                        <Form class="display-div">
                            <FormItem
                                :label="cell.name + ' :'"
                                style="display: flex;align-items: center;"
                                v-if="cell.star">
                                <Rate v-model="cell.value" disabled/>
                            </FormItem>
                            <FormItem :label="item.name + ' :'" v-else-if="item.content">
                                <p class="detail-content" style="word-wrap: break-word;width: 240px;">{{item.value}}</p>
                            </FormItem>
                            <FormItem :label="cell.name + ' :'" v-else>
                                <p
                                    @click="trunToPage(cell)"
                                    class="right-detail-content link-content"
                                    v-if="typeof(cell.link) !== 'undefined' && cell.link !== 'position'">
                                    {{cell.value}}
                                </p>
                                <div style="line-height: 20px; color: #515a6e;" v-else-if="cell.link === 'position'">
                                    <span class="link-position" @click="popMapView(cell.value)">地图查看</span>
                                    <span class="link-position" @click="popDetailView(cell.value)">车辆实时状态</span>
                                </div>
                                <div style="line-height: 20px; color: #515a6e;" v-else-if="typeof(cell.adjust) !== 'undefined'">
                                    <span>
                                        {{cell.adjust}}元
                                        <span v-if="cell.value !== '' && cell.value !== null">（修改前{{cell.value}}元）</span>
                                    </span>
                                </div>
                                <p class="right-detail-content" v-else>{{cell.value}}{{cell.unit}}</p>
                            </FormItem>
                        </Form>
                    </Col>
                </td>
            </tr>
        </table>
        <div style="flex: 0.3;">
            <Card class="order-detail-card" v-for="(item, index) in orderRightData" :key="index">
                <p slot="title">
                    <Icon type="ios-film-outline"></Icon>
                    {{item.title}}
                </p>
                <Col v-for="(cell, index) in item.value" :span="cell.span" :key="index">
                    <Form class="display-div">
                        <FormItem :label="cell.name + ' :'">
                            <p class="right-detail-content link-content" v-if="cell.link" @click="trunToPage(cell)">{{cell.value}}</p>
                            <p class="right-detail-content" v-else>{{cell.value}}</p>
                        </FormItem>
                    </Form>
                </Col>
            </Card>
        </div>
        <Modal
            footer-hide
            :width="400"
            :mask-closable="false"
            v-model="popDetail"
            title="车辆实时状态">
            <CarDetail v-model="popDetail" :orderCarStatus="orderCarStatus"></CarDetail>
        </Modal>
        <Modal
            footer-hide
            :width="515"
            :mask-closable="false"
            v-model="popMap"
            title="地图查看">
            <CarMap v-model="popMap" :orderCarStatus="orderCarStatus"></CarMap>
        </Modal>
    </div>
</template>

<script>
import "@/styles/cyk-style.css"
import { getOrderDetail } from "@/api/order.js"
import { orderLeftData, orderRightData } from "../fields"
import { 
    orderMainStatusMap, 
    typeTimeMap, 
    typeModuleMap,
    creatorTypeMap,
    cancelTypeMap,
    payTypeMap
} from "@/libs/status-map"
import CarDetail from './detail-popview/car-detail.vue'
import CarMap from './detail-popview/car-map.vue'

export default {
    components: {
        CarDetail,
        CarMap
    },
    data() {
        return {
            orderCarStatus: {},
            popMap: false,
            popDetail: false,
            typeTimeMap,
            payTypeMap,
            creatorTypeMap,
            cancelTypeMap,
            typeModuleMap,
            orderLeftData,
            orderRightData,
            beforeChangeFare: {},
        };
    },
    mounted() {
        this.getDetailInfo()
    },
    methods: {
        /*getAdjustData: function(item) {
            let key = item.key.substring(0, 1).toUpperCase() + item.key.substring(1)
            if (typeof item.changeKey !== "undefined") {
                if (
                    this.beforeChangeFare[item.changeKey + key] !== "" &&
                    this.beforeChangeFare[item.changeKey + key] !== null &&
                    typeof this.beforeChangeFare[item.changeKey + key] !== "undefined"
                ) {
                    return this.beforeChangeFare[item.changeKey + key]
                } else return ""
            } else return ""
        },*/
        getDetailInfo () {
            getOrderDetail({ orderUuid: this.$route.params.id }).then(res => {
                let data = res.data.data || {}

                this.orderRightData.forEach(item => { // 途经点(右侧)处理
                    item.value.forEach(cell => {
                        data.passingPointDtos.forEach((atom, index) => {
                            if(cell.key === 'address' + index) cell.value = atom.address
                        })
                    })
                })
                this.orderLeftData.forEach(item => { // 评价数据处理
                    item.value.forEach(cell => {
                        data.evaluate.forEach(atom => {
                            if(cell.key === 'evaluateTime' + atom.addType) cell.value = atom.createTime
                            if(cell.key === 'evaluateStars' + atom.addType + atom.evaluateType) cell.value = atom.score
                            if(cell.key === 'evaluateTags' + atom.addType + atom.evaluateType) cell.value = atom.evaluateTag
                            if(cell.key === 'evaluateContent' + atom.addType + atom.evaluateType) cell.value = atom.content
                        })
                    })
                })
                this.orderLeftData.forEach(item => { // 车辆位置和时间处理
                    item.value.forEach(cell => {
                        data.orderCarHistoryStatusList.forEach(atom => {
                            if(cell.key === atom.type + '_time') cell.value = atom.time
                            if(cell.key === atom.type + '_position') cell.value = atom
                        })
                        data.passingPointsList.forEach(atom => {
                            if(cell.key === atom.type + '_time') cell.value = atom.time
                            if(cell.key === atom.type + '_position') cell.value = atom
                        })
                    })
                })
                
                for(let key in data) { // 整体赋值
                    this.orderLeftData.forEach(item => {
                        item.value.forEach(cell => {
                            if(cell.key === key) {
                                cell.value = data[key]
                                if(typeof(cell.adjust) !== 'undefined'){
                                    let upperCaseKey = cell.key.substring(0, 1).toUpperCase() + cell.key.substring(1)
                                    cell.adjust = data['adjust' + upperCaseKey]
                                }
                                if(key === 'payType' && cell.value.indexOf(',') !== -1) cell.value = '组合'
                                if(key === 'payType' && cell.value.indexOf(',') === -1) cell.value = payTypeMap[cell.value]
                            }
                        })
                    })
                    this.orderRightData.forEach(item => {
                        item.value.forEach(cell => {
                            if(cell.key === key) {
                                cell.value = data[key]
                                if(key === 'passengerName') cell.uuid = data.passengerUuid
                                if(key === 'actualDriverName') cell.uuid = data.driverUuid
                                if(key === 'typeTime') cell.value = typeTimeMap[cell.value]
                                if(key === 'typeModule') cell.value = typeModuleMap[cell.value]
                                if(key === 'mainStatus') cell.value = orderMainStatusMap[cell.value]
                                if(key === 'creatorType') cell.value = creatorTypeMap[cell.value]
                                if(key === 'cancelType') cell.value = cancelTypeMap[cell.value]
                            }
                        })
                    })
                }
            })
        },
        trunToPage (params) {
            if(params.link === 'vin'){ // 点击vin码
                this.$router.push({
                    name: 'vehicle-detail',
                    params: {
                        id: params.value
                    }
                })
            } else if (params.link === 'coupon'){ // 点击优惠券编号

            } else if (params.link === 'invoice') { // 点击发票编号

            } else if (params.link === 'passenger') {
                this.$router.push({
                    name: 'customer-detail',
                    params: {
                        id: params.uuid
                    }
                })
            } else if (params.link === 'driver') {
                this.$router.push({
                    name: 'staff-detail',
                    params: {
                        id: params.uuid
                    }
                })
            } else {
                console.log('通知前端！！')
            }
        },
        popMapView (params) {
            this.popMap = true
            this.orderCarStatus = params || {}
        },
        popDetailView (params) {
            this.popDetail = true
            this.orderCarStatus = params || {}
        }
    }
}
</script>

<style scoped>
    .order-detail-table{
        flex: 0.7;
        border-collapse: collapse;
    }
    .order-detail-table tr td{
        border: 1px solid #e8eaec;
        box-sizing: border-box;
    }
    .order-detail-table tr td:first-of-type{
        width: 100px;
        text-align: center;
    }
    .order-detail-table tr td:last-of-type{
        padding: 24px 0 0 20px;
    }
    .left-detail-content{
        display: inline-block;
        padding-right: 15px;
    }
    .link-position{
        display: inline-block;
        padding-right: 15px;
        color: #3399ff;
    }
    .link-position:hover{
        text-decoration: underline;
        cursor: pointer;
    }
    .link-content{
        color: #3399ff;
    }
    .link-content:hover{
        text-decoration: underline;
        cursor: pointer;
    }
    .right-detail-content{
        padding-right: 15px;
        line-height: 20px;
    }
</style>
