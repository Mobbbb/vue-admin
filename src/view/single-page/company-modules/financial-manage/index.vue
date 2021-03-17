<template>
  <div>
      <Form inline :label-width="80" class="formQueryStyle" style="margin-top:20px;margin-left: 4%">
          <FormItem label='企业名称：'>
              <multiSselect :url="companyUrl"  query='companyName'  dataKey="companyId" dataLabel="companyName" @on-success="getcompany" ref="muselect" ></multiSselect>
          </FormItem>
          <FormItem label='账单状态：'>
              <CheckboxGroup v-model="queryForm.status">
                  <Checkbox label="2">已付款</Checkbox>
                  <Checkbox label="1" >未付款</Checkbox>
              </CheckboxGroup>
          </FormItem>
          <Button type="primary" @click='queryData'>查询</Button>
          <Button  @click='reset' style="margin-left: 20px" >清空</Button>
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
    <Modal v-model="isShowDetail" :mask-closable="false" title="确认收款" width="600">
      <div>
        <Form :label-width="140" ref="pushForm">
          <Row>
            <Col span="22">
              <FormItem label="企业名称：">
                <span>{{receiptData.companyName}}</span>
              </FormItem>
              <FormItem label="账单：">
                <Select multiple :clearable="true" @on-change="getbilllist" v-model="billArr">
                  <Option
                    :value="item.billNo"
                    v-for="(item, index) in billVosList"
                    :key="index"
                  >{{item.billMonth}}</Option>
                </Select>
              </FormItem>
              <FormItem label="账单金额：">
                <div style="display: flex">
                  <p>
                    <span>{{calctotalAmount}}</span>元
                  </p>
                  <p
                    @click="viewbillCompanyDetail"
                    style="color: rgb(45, 183, 245);cursor: pointer;margin-left: 20px;"
                  >账单明细</p>
                </div>
              </FormItem>
              <FormItem label="收款金额：">
                <InputNumber
                  :max="receiptData.totalAmount"
                  :min="1"
                  v-model="billAccountPayed"
                  :precision="2"
                ></InputNumber>
              </FormItem>
              <FormItem label="付款原因：">
                <RadioGroup @on-change="getReason">
                  <Radio label="2">线下汇款</Radio>
                  <Radio label="3">其他</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="文件上传：">
                <UploadFile
                  :uploadtitle="uploadtitle"
                  @uploadSuccess="loadSuccessCall"
                  @uploadError="uploadErrorCall"
                ></UploadFile>
              </FormItem>
              <FormItem label="银行流水号：">
                <Input
                  v-model="bankFlowNumber"
                />
              </FormItem>
              <FormItem label="备注：">
                <Input
                  type="textarea"
                  v-model="remarks"
                  :autosize="{minRows: 5,maxRows: 10}"
                  placeholder="请输入备注..."
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button size="large" type="primary" @click="confirmModal">确定收款</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import VTable from "_a/v-table/v-table";
import multiSselect from "_a/multi-select/multi-select";
import UploadFile from "_a/uploadfile/index";
import { inputList, pageData, tableTitle } from "./fields.js";
import {
  getSettlementList,
  receiptQuery,
  receiptEdit,
} from "@/api/company-api/company.js";
export default {
  name: 'finacialManage',
  components: {
    VTable,
    UploadFile,
    multiSselect
  },
  data() {
    return {
      ...pageData,
      inputList: [],
      receiptData: {},
      bankFlowNumber:'',
      remarks: "",
      billAccountPayed: 0,
      calctotalAmount: 0,
      billVosList: [],
      billArr:[],
      uploadtitle: '文件上传',
      uploadfileData: [],
      companyUrl:'/company/wallet/list',
      queryForm:{},
      statusList:[
          {
            'value': 1,
            'label': '未生成'
          },
          {
            'value': 2,
            'label': '未付款'
          },
          {
            'value': 3,
            'label': '已付款'
          },
        ],
    };
  },
  mounted() {
    this.inputList = JSON.parse(JSON.stringify(inputList));
    this.gettableTitle();
    this.getList();
  },
  methods: {
    //查询
    queryData() {
      this.searchParams = this.queryForm;
      this.current = 1;
      this.getList();
      },
    getcompany(value){
      this.queryForm.companyId=value[0];
    },
    search(data) {
      this.searchParams = data;
      this.current = 1;
      this.getList();
    },
    reset() {
      this.searchParams = {};
      this.queryForm= {};
      this.$refs.muselect.clearValue();
      this.current = 1;
      this.pageSize = 10;
      this.getList();
    },
    changePage(val) {
      this.current = val;
      this.getList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    getList() {
      let data = Object.assign(
        {},
        {
          currPage: this.current,
          pageSize: this.pageSize
        },
        this.searchParams
      );
      getSettlementList(data)
        .then(res => {
          this.total = res.data.data.totalCount;
          this.tableData = res.data.data.list;
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch(err => {
          this.total = 0;
          this.tableData = [];
          this.$store.commit("changeLoadingFlag", false);
        });
    },
    getReason(val) {
      this.receiptData["reason"] = val;
    },
    getbilllist(data) {
      let newcal = 0
      let billVosList = JSON.parse(JSON.stringify(this.billVosList))
      billVosList.forEach(item => {
        data.forEach(ele => {
          if (item.companyId == ele) {
            newcal += item.totalAmount
          }
        })
      })
      this.calctotalAmount = newcal
    },
    confirmModal() {
      let receiptData = this.receiptData;
      let data = {
        companyId: receiptData.companyId,
        billNo: this.billArr,
        bankFlowNumber:this.bankFlowNumber,
        billAccountPayed: this.billAccountPayed,
        reason: receiptData.reason,
        remarks: this.remarks,
        files: this.uploadfileData,
        companyName:receiptData.companyName
      };
      receiptEdit(data)
        .then(res => {
          this.isShowDetail = false;
          this.getList();
        })
        .catch(err => {});
    },
    getreceiptList(companyId) {
      receiptQuery(companyId)
        .then(res => {
          this.billVosList = res.data.data.billVos;
        })
        .catch(err => {});
    },
    getAllBill(params) {
      this.$router.push({
        path: `financialManage/allCompanyBill/${params.companyId}`,
        query: {
          companyId: params.companyId,
          companyName: params.companyName
        }
      });
    },
    viewbillCompanyDetail() {
      this.$router.push({
        path: `financialManage/billCompanyDetail/${this.receiptData.billNo}`,
        params: {
          billNo: this.receiptData.billNo
        }
      });
    },
    gettableTitle() {
      let data = [];
      let actions = {
        key: "action",
        title: "操作",
        width: 300,
        fixed: "right",
        align: "center",
        render: (h, params) => {
          return h("div", [
            h(
              "Button",
              {
                props: {
                  type: "success",
                  size: "small"
                },
                attrs: {
                  ghost: "ghost"
                },
                style: {
                  margin: "0 10px",
                  color: "#2db7f5",
                  borderColor: "#2db7f5",
                  float: "left"
                },
                on: {
                  click: () => {
                    this.getAllBill(params.row);
                  }
                }
              },
              "全部账单"
            ),
            h(
              "Button",
              {
                props: {
                  type: "success",
                  size: "small"
                },
                attrs: {
                  ghost: "ghost"
                },
                style: {
                  margin: "0 10px",
                  display: params.row.billStatus == 1 ? "inline-block" : "none"
                },
                on: {
                  click: () => {
                    this.getreceiptList(params.row.companyId);
                    this.receiptData = params.row;
                    this.billArr=[];
                    this.isShowDetail = true;
                  }
                }
              },
              "确认收款"
            )
          ]);
        }
      };
      data = [...tableTitle];
      data.push(actions);
      this.tableColumns = data;
    },
    loadSuccessCall (data) {
      this.uploadfileData.push(data.data)
    },
    uploadErrorCall (errr) {

    },
  }
};
</script>
