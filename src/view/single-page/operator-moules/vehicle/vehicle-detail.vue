<!--车辆详情入口-->
<template>
    <div>
        <Tabs v-model="TabFlag">
            <TabPane label='车辆基本信息' name='1'>
                <BasicInfo v-if="TabFlag==1"></BasicInfo>
            </TabPane>
            <TabPane label='准驾司机列表' name='2'>
                <AllowedDriver v-if="TabFlag==2"></AllowedDriver>
            </TabPane>
            <TabPane label='违章记录' name='3'>
                <RecordList v-if="TabFlag==3"></RecordList>
            </TabPane>
            <TabPane label='订单信息' name='4'>
                <OrderInfo v-if="TabFlag==4"></OrderInfo>
            </TabPane>
             <TabPane label='历史使用人' name='5'>
                 <CarUser v-if="TabFlag==5"></CarUser>
             </TabPane>
        </Tabs>
    </div>
</template>

<script>
import BasicInfo from './detailContent/basic.vue'
import AllowedDriver from './detailContent/allowedDriver.vue'
import RecordList from './detailContent/recordList.vue'
import OrderInfo from './detailContent/orderInfo.vue'
import CarUser from './detailContent/carUser.vue'

export default {
    components: {
        BasicInfo,
        AllowedDriver,
        RecordList,
        OrderInfo,
        CarUser
    },
    data(){
        return{
            TabFlag: '1'
        }
    }
}
</script>

