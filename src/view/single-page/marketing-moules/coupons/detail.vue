<template>
  <div>
    <Form ref="formInline" :model="formInline" :label-width="100">
        <FormItem label='优惠券名称'>
          {{formInline.couponName}}
        </FormItem>
        <FormItem label='优惠券模板'>
          {{formInline.templateName}}
        </FormItem>
        <FormItem label='使用城市'>
          <ul style="display:flex;flex-wrap:wrap;width:250px;">
            <li style="margin-right:10px;" v-for="(item, index) in formInline.listCity" :key="index">{{item.cityName}}</li>
          </ul>
        </FormItem>
        <FormItem label='使用时段'>
          {{formInline.periodBegin}}时-{{formInline.periodEnd}}时
        </FormItem>
        <FormItem label='有效期'>
          获取后{{formInline.expiryDay}}天内使用
        </FormItem>
        <FormItem label='优惠券数量' prop='totalNumber'>
          {{formInline.totalNumber}}
        </FormItem>
      </Form>
  </div>
</template>
<script>
import {pageData} from './fields'
import { couponInfo } from '@/api/passenger';
export default {
  data(){
    return {
      ...pageData,
      id: this.$router.currentRoute.params.id
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.id = to.params.id
    this.detail(this.id)
    next();
  },
  created(){
    this.detail(this.id)
  },
  methods:{
    detail(id) {
      this.formInline = {}
      couponInfo(id).then(res => {
        if(res.data.success) {          
          this.formInline = res.data.data
        } else {
          this.$Message.error(res.data.errorMsg)
        }
      })
    }    
  }
}
</script>
