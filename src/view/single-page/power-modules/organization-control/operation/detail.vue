<!--合资公司详情-->
<template>
    <div style="padding: 0 20px;">
        <Form :label-width="80">
            <FormItem label="父机构 :">
                <div>{{params.parentName}}</div>
            </FormItem>
            <FormItem label="父机构类型 :">
                <div>{{params.parentType}}</div>
            </FormItem>
            <FormItem label="机构名称 :">
                <div>{{params.name}}</div>
            </FormItem>
            <FormItem label="机构类型 :">
                <div>{{params.type}}</div>
            </FormItem>
            <FormItem label="公司类型 :">
                <div>{{params.nature}}</div>
            </FormItem>
            <FormItem label="股比 :"> 
                <div>{{params.stockRatio}}</div>
            </FormItem>
            <!--<FormItem label="备注 :">
                <div>{{params.remark}}</div>
            </FormItem>-->
        </Form>
        <div class="popView-footer-wrap">
            <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
            <Button size="large" type="primary" @click="commit(1)">确定</Button>
        </div>
    </div>
</template>

<script>
import { orgDetail } from '@/api/organization' 

export default {
    props: ['popView', 'uuid'],
    data(){
        return {
            params: {}
        }
    },
    watch: {
        'popView': function(){
            if(this.popView){ // 弹出弹框时
                this.params = {}
            }
        }
    },
    mounted(){

    },
    methods:{
        commit: function(temp){
            orgDetail({ id: this.uuid }).then(res => {
                this.params = res.data.data
            })
        }
    }
}
</script>
<style lang="less">

</style>