<template>
    <div>
        <VTable
			class="staff-table-container"
			:total="total"
			:current="current"
			:pageSize="pageSize"
			:parColumns="tableColumns"
			:parTableData="tableData"
			@changePage="changePage"
			@changePageSize="changePageSize"
			style="margin-top: 25px;"
		></VTable>
        <Modal title="发票详情" v-model="isShowModalDetail" footer-hide>
            <div class="font16">
                <section class="padding10 inline width50">
                    <span class="padding10">开票种类:</span>
                    <span>{{invoiceTypeMap[detailInfo.invoiceType]}}</span>
                </section>
                <section class="padding10  inline width50">
                    <span class="padding10">机构名称:</span>
                    <span>{{detailInfo.orgName}}</span>
                </section>
                <section class="padding10 inline width50">
                    <span class="padding10">机构城市:</span>
                    <span>{{detailInfo.orgCity}}</span>
                </section>
                <section class="padding10 inline width50">
                    <span class="padding10">申请人员:</span>
                    <span>{{detailInfo.applicant}}</span>
                </section>
                <section class="padding10 inline width50">
                    <span class="padding10">申请时间:</span>
                    <span>{{detailInfo.applyTime?$moment(detailInfo.applyTime).format('YYYY-MM-DD'): ''}}</span>
                </section>
                <section class="padding10 inline width50">
                    <span class="padding10">联系方式:</span>
                    <span>{{detailInfo.mobile}}</span>
                </section>
                 <section class="padding10 inline width50">
                    <span class="padding10">邮寄地址:</span>
                    <span>{{detailInfo.mailAddress}}</span>
                </section>
                 <section class="padding10 inline width50">
                    <span class="padding10">开票账单:</span>
                    <span>{{detailInfo.billMonths}}</span>
                </section>
                 <section class="padding10 inline width50">
                    <span class="padding10">开票金额:</span>
                    <span>{{detailInfo.money}}</span>
                </section>
                <section class="padding10 inline width50">
                    <span class="padding10">发票抬头:</span>
                    <span>{{detailInfo.header}}</span>
                </section>
                <section class="padding10 inline width50">
                    <span class="padding10">发票内容:</span>
                    <span>{{detailInfo.content}}</span>
                </section>
                <section class="padding10 inline width50">
                    <span class="padding10">发票类型:</span>
                    <span>{{detailInfo.type}}</span>
                </section>
                <Divider>企业信息</Divider>
                <section class="padding10 inline width50">
                    <span class="padding10">纳税人名称:</span>
                    <span>{{companyInfo.taxpayerName}}</span>
                </section>
                 <section class="padding10 inline width50">
                    <span class="padding10">纳税人识别号:</span>
                    <span>{{companyInfo.taxpayerIdentiNum}}</span>
                </section>
                 <section class="padding10 inline width50">
                    <span class="padding10">开户银行名称:</span>
                    <span>{{companyInfo.bankName}}</span>
                </section>
                 <section class="padding10 inline width50">
                    <span class="padding10">开户银行账户:</span>
                    <span>{{companyInfo.bankNo}}</span>
                </section>
                 <section class="padding10 inline width50">
                    <span class="padding10">公司地址:</span>
                    <span>{{companyInfo.address}}</span>
                </section>
                 <section class="padding10 inline width50">
                    <span class="padding10">公司电话:</span>
                   <span>{{companyInfo.telephone}}</span>
                </section>
            </div>
        </Modal>
        <Modal title="送出" v-model="isShowOperateModal" footer-hide>
            <RadioGroup v-model="method" @on-change='changeMethod'>
                <Radio label="1">
                    邮寄
                </Radio>
                <Radio label="2">
                    送达
                </Radio>
            </RadioGroup>
            <div v-if="method == '1'">
                <Form :model='expressForm' :label-width='80'>
                    <FormItem label='快递公司:'>
                        <Select v-model="expressForm.logisticsCompany" style="width:200px">
                            <Option v-for="item in expressList" :value="item.code"
                            :key="item.code">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label='快递单号:'>
                        <Input v-model="expressForm.invoiceNo" style="width:200px"></Input>
                    </FormItem>
                    <FormItem label='发票编号:'>
                        <Input v-model="expressForm.logisticsOrderNo" style="width:200px"></Input>
                    </FormItem>
                </Form>
            </div>
            <div v-else>
                 <Form :model='transportForm' :label-width='80'>
                      <FormItem label='送出时间:'>
                          <span>{{expressForm.currentDate}}</span>
                      </FormItem>
                    <!-- <section class="padding10 mg-bottom14">
                        <span class="padding10">送出时间:</span>
                        <span>{{transportForm.currentDate}}</span>
                    </section> -->
                    <FormItem label='接收人:'>
                        <Input v-model="expressForm.recipient" style="width:200px"></Input>
                    </FormItem>
                    <FormItem label='联系方式:'>
                        <Input v-model="expressForm.recipientMobile" style="width:200px"></Input>
                    </FormItem>
                    <FormItem label='相关文件:'>
                        <Upload :action="rowInfo.relatedFileUrl">
                            <Button icon="ios-cloud-upload-outline">上传文件</Button>
                        </Upload>
                    </FormItem>
                </Form>
            </div>
            <div class="text-right">
                <Button type='primary' @click="transportHandle">送出</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import {applyInvoicePageData, applyColumns, invoiceTypeMap} from './fields.js';
import {getExpress} from '@/api/company-api/common.js';
import {
  invoiceList,invoiceDetail, transportMethod
} from "@/api/company-api/config.js";
import {
getCompanyDetail
} from "@/api/company-api/company.js";

export default {
    name:'applyInvoice',
    data() {
        return {
            rowInfo: {},
            detailInfo:{},
            companyInfo: {},
            invoiceTypeMap,
            ...applyInvoicePageData
        }
    },
    mounted(){
        this.tableColumns = applyColumns(this);
        this.getList();
         this.getExpressList();
    },
    methods:{
        changePage(val) {
            this.current = val;
            this.getList();
       },
       changePageSize(val) {
           this.pageSize = val;
            this.getList();
       },
        getList() {
           this.$store.commit("changeLoadingFlag", true);
           let params = {
               status: 1,
               currPage: this.current,
               pageSize: this.pageSize,
           }
          invoiceList(params).then(res => {
            this.tableData = res.data.data.list;
            this.total = res.data.data.totalCount;
            this.$store.commit("changeLoadingFlag", false);
          });
           this.$store.commit("changeLoadingFlag", false);
       },
       viewDetail(info) {//申请详情
            this.isShowModalDetail = true;
            invoiceDetail({uuid: info.uuid}).then(res=>{
               if(res.data.success) {
                   this.detailInfo = res.data.data;
               }
           })
           getCompanyDetail({uuid: info.uuid}).then(res=>{
               if(res.data.success) {
                   this.companyInfo = res.data.data;
               }
           })
       },
        getExpressList() {
           getExpress().then(res=>{
               if(res.data.success) {
                   this.expressList = res.data.data;
               }
           })
        },
       giveOperate(info) {//送出操作
            this.isShowOperateModal = true;
            this.method = '1';
            this.rowInfo = info;
            this.expressForm = {};
       },
       transportHandle() {
           let params = {
               uuid: this.rowInfo.uuid,
               ...this.expressForm
           }
           transportMethod(params).then(res=>{
               if(res.data.success) {
                   this.$Message.success({
                       content: res.data.msg || '操作成功！',
                       duration: 3
                   })
                   this.isShowOperateModal = false;
               }
           })
       },
       changeMethod(value) {
           this.expressForm = {};
           if(value == '2') {
               this.expressForm.currentDate = this.$moment(Date.now()).format('YYYY-MM-DD hh:mm:ss')
           }
       }
    }
}
</script>
<style lang="less">
@import '../company.less';
</style>


