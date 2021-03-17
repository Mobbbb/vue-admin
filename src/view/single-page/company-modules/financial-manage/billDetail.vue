<template>
  <div class="billDetail">
    <Card :bordered="false">
      <p slot="title">账单明细</p>
      <Form :label-width="140" ref="pushForm">
        <Row>
          <Col span="6">
            <FormItem label="账单编号：">
              <span>{{detailData.billNo || '暂无'}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="企业名称：">
              <span>{{detailData.companyName || '暂无'}}</span>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="账单周期：">
              <span
                v-if="detailData.billingCycleEnd"
              >{{detailData.billingCycleBegin}}~{{detailData.billingCycleEnd}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="本期应结算金额：">
              <span
                v-if="detailData.currentSettlementAmount"
              >￥{{detailData.currentSettlementAmount || '暂无'}}</span>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="付款到期日：">
              <span>{{detailData.paymentDueDate || '暂无'}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row class="redStyle">
          <Col span="6">
            <FormItem label="已付款金额：">
              <span v-if="detailData.paidAmount">￥{{detailData.paidAmount || '暂无'}}</span>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="实际付款日：">
              <span>{{detailData.actualPaymentDate || '暂无'}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6" offset="12">
            <a style="color: #169bd5" @click="downLoadfile" id="downloadBtn">附件下载</a>
          </Col>
        </Row>
      </Form>
      <VTable
        class="staff-table-container"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="tableColumns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
        style="margin-top: 25px;"
      ></VTable>
    </Card>
  </div>
</template>
<script>
import { pageData, tablecolumdetail } from "./fields.js";
import { billInfo,downloadZip } from "@/api/company-api/company.js";
export default {
  data() {
    return {
      ...pageData,
      detailData: {}
    };
  },
  mounted() {
    this.gettableTitle();
    this.getList();
  },
  methods: {
    changePage(val) {
      this.current = val;
      this.getList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    getList() {
      let data = {
        currPage: this.current,
        pageSize: this.pageSize,
        billNo: this.$route.params.id
      };
      billInfo(data)
        .then(res => {
          this.total = res.data.data.routeInfos.totalCount;
          this.tableData = res.data.data.routeInfos.list;
          this.detailData = res.data.data;
          this.detailData.billingCycleBegin=this.$moment(this.detailData.billingCycleBegin).format('YYYY-MM-DD');
          this.detailData.billingCycleEnd=this.$moment(this.detailData.billingCycleEnd).format('YYYY-MM-DD');
          this.detailData.paymentDueDate=this.detailData.paymentDueDate?this.$moment(this.detailData.paymentDueDate).format('YYYY-MM-DD'):'';
          this.detailData.actualPaymentDate=this.detailData.actualPaymentDate?this.$moment(this.detailData.actualPaymentDate).format('YYYY-MM-DD'):'';
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch(err => {
          this.total = 0;
          this.tableData = [];
          this.$store.commit("changeLoadingFlag", false);
        });
    },
    gettableTitle() {
      let data = [];
      data = [...tablecolumdetail];
      this.tableColumns = data;
    },
    downLoadfile() {
      // 下载链接
      let data={
        fileName:"账单明细下载.zip",
        files:this.detailData.files
      }
      downloadZip(data)
      .then(res=>{

      })
    }
  }
};
</script>

<style>
.billDetail .ivu-form-item {
  margin-bottom: 5px !important;
}
.redStyle {
  color: red !important;
}
.redStyle .ivu-form-item-label {
  color: red !important;
}
</style>


