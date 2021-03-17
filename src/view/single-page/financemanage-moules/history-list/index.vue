<template>
  <div>
    <Row type="flex" align="middle">
      <i-col span="12">任务名称：{{billName}}</i-col>
      <i-col span="12"><Button  type="primary" @click="add" style="float: right">手动创建 </Button></i-col>
    </Row>
    <Form>
      <FormItem label='对账结果'>
        <CheckboxGroup v-model='reconciliationStatus'>
          <Checkbox v-for="(item, index) in stateType" :label="index" :key="index">{{item}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label='操作结果'>
        <CheckboxGroup v-model='processStatus'>
          <Checkbox v-for="(item, index) in operationType":label="index" :key="index">{{item}}</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="search" style="margin-right:20px;">查询</Button>
        <Button @click="reset">清空</Button>
      </FormItem>
    </Form>
    <VTable
      :total="total"
      :current="currPage"
      :pageSize="pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
      style="margin-top: 25px;">
    </VTable>
    <!--手动创建-->
    <Modal v-model="isShowRuleModal" :title="ruleModalTitle" :mask-closable="false">
      <Form ref="formData" :model="formData" :rules="rule" :label-width="100">
        <FormItem label='账单日' v-if="isEstablish" prop="reconciliationDate">
          <div class="establish-time">
            <DatePicker
              :clearable="false"
              type="date"
              v-model="formData.reconciliationDate"
              format="yyyy-MM-dd"
              :editable="false"
              placeholder="请选择时间"
              @on-change="changeDate"
            >
            </DatePicker>
          </div>
        </FormItem>
        <FormItem label='备忘记录' v-if="!isEstablish">
          <Input v-model="memo" type="textarea" :rows="4" :disabled="!isModify"></Input>
        </FormItem>
        <FormItem v-if="!isEstablish">
          <Upload
            :action="upBaseUrl"
            :headers="headers"
            :show-upload-list="false"
            :on-success="uoloadSuccess"
          >
            <Button icon="ios-cloud-upload-outline" type="primary" :disabled="!isModify">上传文件</Button>
          </Upload>
        </FormItem>
        <FormItem>
          <ul class="ivu-upload-list" >
            <li class="ivu-upload-list-file ivu-upload-list-file-finish" v-for="(item, index) in memoAddr" @click="uploadRemove(index)">
              <span>
                <i class="ivu-icon ivu-icon-md-document"></i>{{item.name}}
              </span>
              <i class="ivu-icon ivu-icon-ios-close ivu-upload-list-remove"></i>
            </li>
          </ul>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button @click="isShowRuleModal = false">取消</Button>
        <Button type="success" v-if="isEstablish" @click="generateBills">生成账单日</Button>
        <Button type="success" v-if="!isEstablish" @click="memoSave" :disabled="!isModify">保存</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  import VTable from '_a/v-table/v-table'
  import {billName,stateType,operationType, returnFields } from './index'
  import { historyList,addBillDay, deal, addMemo,} from '@/api/finance'
  import {getToken} from '@/libs/util.js';

  export default {
    name: "historyList",
    data() {
      return {
        ...returnFields(this),
        tableData: [],
        parColumns: [],
        reconciliationStatus: [],
        stateType: stateType,
        processStatus: [],
        operationType: operationType,
        isShowRuleModal: false,
        ruleModalTitle: '手动创建',
        upBaseUrl: `${this._baseUrl}/admin/finance/bill/uploadMemoFile`,
        isEstablish: true,
        isModify: true,
        reconciliationDate: "",
        formData:{
          channelId:'',
          reconciliationDate:'',
        },
        rule: {
          reconciliationDate: [
            {required: true, message: '账单日不能为空'}
          ],
        },

        queryAjaxPramas:{},
        billName:"",
        uuid:"",
        memo:'',
        memoAddr:[],
        headers:{
          'Authorization': getToken()
        },
      };
    },
    created() {},
    mounted() {
      Object.entries(this.columns).forEach(([key, value])=> {this.parColumns.push(value)});
      this.formData.channelId = this.$route.params.id;
      this.billName = billName[this.formData.channelId];
      this.getTableList();
    },
    methods: {
      getTableList(){ // 获取表格数据
        this.$store.commit('changeLoadingFlag', true);
        let params = {
          currPage:this.currPage,
          pageSize:this.pageSize,
          channelId:this.formData.channelId
        }
        let obj = Object.assign(params, this.queryAjaxPramas);
        historyList(obj).then(res => {
          this.tableData = res.data.data.list;
          this.total = res.data.data.totalCount;
          this.$store.commit('changeLoadingFlag', false);
        })
      },
      changePage(val){
        this.currPage = val;
        this.getTableList();
      },
      changePageSize(val){
        this.pageSize = val;
        this.getTableList();
      },
      add(){ //手动创建
        this.isShowRuleModal = true;
        this.isEstablish = true;
        this.ruleModalTitle = '手动创建';
      },
      search(){ //查询
        this.currPage = 1;
        this.queryAjaxPramas.reconciliationStatueList = this.reconciliationStatus;
        this.queryAjaxPramas.processStatueList = this.processStatus;
        this.getTableList();
      },
      reset(){ //重置
        this.currPage = 1;
        this.queryAjaxPramas = {};
        this.reconciliationStatus = [];
        this.processStatus = [];
        this.getTableList();
      },
      changeDate(val){
        this.formData.reconciliationDate = val;
      },
      generateBills(){ //生成账单日
        this.$refs.formData.validate((valid) => {
          if (valid) {
            addBillDay(this.formData).then(res => {
              if(res.data.success){
                this.isShowRuleModal = false;
                this.getTableList();
              }
            })
          }
        })
      },
      processed(data){ //已处理
        this.$Modal.confirm({
          title: '处理',
          content: '<p>是否确定处理？</p>',
          onOk: () => {
            deal(data).then(res => {
              if(res.data.success){
                this.getTableList();
              }
            })
          }
        });
      },
      Memo(val){ //备忘
        this.isShowRuleModal = true;
        this.isEstablish = false;
        this.ruleModalTitle = '备忘';
        this.isModify = val;
      },
      memoSave(){ //备忘保存
        let data = {
          uuid:this.uuid,
          memo: this.memo,
          memoAddr: JSON.stringify(this.memoAddr),
        }
        addMemo(data).then(res => {
          if(res.data.success){
            this.isShowRuleModal = false;
            this.getTableList();
          }
        })
      },
      uoloadSuccess(response, file, fileList){
        if(response.success){
          this.memoAddr.push({
            name:response.data.name,
            url:response.data.url,
          })
        }else {
          this.$Message.error({
            content:'上传失败',
            duration: 2
          });
        }
      },
      uploadRemove(index){ //移除文件
        this.memoAddr.splice(index);
      },
    },
  };
</script>
<style lang="less">
  .ivu-form-item {
    margin-bottom: 5px;
  }
  .ivu-upload-list .ivu-upload-list-file .ivu-icon-ios-close{
    line-height: 32px;
  }

</style>
