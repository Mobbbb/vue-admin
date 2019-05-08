<template>
    <div>
        <Tabs v-model="activeIndex" @on-click="clickTab">
            <TabPane label="详情信息" name="0">
                <OrderDetail :activeIndex="activeIndex" v-show="activeIndex === '0'"></OrderDetail>
            </TabPane>
            <TabPane label="订单轨迹" name="1">
                <OrderMap :id="id" :activeIndex="activeIndex" v-show="activeIndex === '1'"></OrderMap>
            </TabPane>
            <TabPane label="目的地/途径点修改记录" name="2">
                <WaypointRecord :activeIndex="activeIndex" v-show="activeIndex === '2'"></WaypointRecord>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
import OrderDetail from './components/order-detail.vue'
import OrderMap from './components/order-map.vue'
import WaypointRecord from './components/waypoint-record.vue'

export default {
    components: {
        OrderDetail,    // 详情信息
        OrderMap,       // 订单轨迹
        WaypointRecord  // 途经点修改记录
    },
    data() {
        return {
            activeIndex: '0',
            id: this.$route.params.id
        }
    },
    methods: {
        clickTab(index) {
            this.activeIndex = index
        }
    },
    watch: {
        '$route.params.id'(newVal){
            this.id = newVal
        }
    }
}
</script>

<style scoped>
    
</style>
