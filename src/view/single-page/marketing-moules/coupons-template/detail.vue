<template>
    <div>
        <Form ref="formInline" :model="formInline" :label-width="120">
            <FormItem label="优惠券状态">
                {{couponTempleteMap[formInline.couponState]}}
            </FormItem>
            <FormItem label="优惠券类型">
                {{couponTypeMap[formInline.couponType]}}
            </FormItem>
            <FormItem label="使用方">
                {{platformTypeMap[formInline.platformType]}}
            </FormItem>
            <FormItem label="业务范围">
                {{useTypeMap[formInline.useType]}}
            </FormItem>
            <FormItem label="业务限制">
                {{useLimitMap[formInline.useLimit]}}
            </FormItem>
            <FormItem label="优惠券模板名称">
                {{formInline.templateName}}
            </FormItem>
            <FormItem label="折扣" v-show="formInline.couponType===1">
                {{formInline.discount}}折
            </FormItem>
            <FormItem label="最高抵扣金额" v-show="formInline.couponType===1">
                {{formInline.highestMoney}}元
            </FormItem>
            <FormItem label="面额" v-show="formInline.couponType===2">
                {{formInline.couponMoney}}元
            </FormItem>
            <FormItem label="使用条件" v-show="formInline.couponType===2">
                满{{formInline.astrict}}元使用
            </FormItem>
        </Form>
        <div class="bottom">
            <p>新增：{{formInline.createName}}</p>
            <p>新增时间：{{formInline.createdOn}}</p>
            <div v-show="formInline.couponState===2">
                <p>停用：{{formInline.updateName}}</p>
                <p>停用时间：{{formInline.updateOn}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import { templateInfo } from '@/api/passenger';
import { pageData } from './fields'
export default {
    data(){
        return {
            ...pageData,
            formInline: {},
            params: this.$router.currentRoute.params.id,
        }
    },
    beforeRouteUpdate(to, from, next) {
        this.params = to.params.id
        this.detail(this.params)
        next();
    },
    created(){
        this.detail(this.params)
    },
    methods:{
        detail(id){
            let params = {
                uuid: id
            }
            templateInfo(params).then(res => {
                if(res.data.success){
                    this.formInline = res.data.data
                } else {
                    this.$Message.error(res.data.errorMsg)
                }
            })
        }
    }
}
</script>
<style lang="less">
.bottom{
    border: 1px dashed #000000;
    padding: 20px;
    width: 250px;
    p{
        margin: 0;
        padding: 10px 0;
    }
}
</style>
