<template>
  <div>
    <p
      style="margin-left: 10px;font-size: 24px;color: #000;margin-bottom:20px;font-weight: bold"
    >退款试算</p>
    <Form :label-width="120">
      <FormItem label="开户行公司名称">
        <div>{{refundDetail.companyName}}</div>
      </FormItem>
      <FormItem label="开户行银行">
        <div>{{refundDetail.bankName}}</div>
      </FormItem>
      <FormItem label="汇款账号">
        <div>{{refundDetail.bankCardNo}}</div>
      </FormItem>
      <FormItem label="账户现金金额">
        <div>{{formatAmount(refundDetail.remainCash)}}</div>
      </FormItem>
      <FormItem label="可退款现金">
        <div>{{formatAmount(refundDetail.refundCash)}}</div>
      </FormItem>
    </Form>
    <div>
        <Button type="primary" @click="goback">关闭</Button>
    </div>
  </div>
</template>
<script>
import { formatAmount } from "@/libs/util.js";
import { refundWallet } from "@/api/enterpriseVehicle.js";
export default {
  name: "refundDetail",
  data() {
    return {
      companyId: this.$route.params.id,
      refundDetail: {}
    };
  },
  mounted() {
    this.getrefundDetail();
  },
  methods: {
    getrefundDetail() {
      refundWallet(this.companyId)
        .then(res => {
          this.refundDetail = res.data.data;
        })
        .catch(err => {});
    },
    goback() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less">
</style>