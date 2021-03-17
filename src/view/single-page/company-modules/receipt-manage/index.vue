<template>
    <div>
        <Tabs v-model="value" @on-click="selectHandle">
            <TabPane label="已开具发票" name="1">
                <invoiced ref="invoice"></invoiced>
            </TabPane>
            <TabPane label="申请中发票" name="2">
                <applyInvoice ref="apply"></applyInvoice>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
import applyInvoice from './applyInvoice';
import invoiced from './invoiced';
export default {
    components:{
        invoiced,
        applyInvoice
    },
    data(){
        return {
            value: '1',
        }
    },
    methods: {
        selectHandle(name){
            if (name == '1') {
                this.$refs.invoice.getList();
            } else {
                this.$refs.apply.getList();
            }
        }
    }
}
</script>
