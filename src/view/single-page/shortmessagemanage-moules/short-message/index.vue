<template>
  <div>
    <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
    <div>
      <Button type="primary" @click="createMsg" v-hasAuth="'shortmessage-manage-add'">新建消息</Button>
    </div>
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
    <!-- 详情 -->
    <Modal :title="modalTitle" :mask-closable="false" v-model="isShowDetail" width="600">
      <div class="manageDetail">
        <p>
          <span class="editName">发送对象：</span>
          <span>{{sendMap[detailMessageObj.sendName]}}</span>
        </p>
        <div v-if="roleId == 0">
          <p>
            <span class="editName">发送范围：</span>
            <span class="editDetail" v-if="detailMessageObj.driver==2">指定乘客</span>
            <span class="editDetail" v-if="detailMessageObj.driver==6">指定条件</span>
            <span class="editDetail" v-if="detailMessageObj.driver==5">批量</span>
          </p>
          <p v-if="scopeId == 2">
            <span class="editName"></span>
            <span class="editDetail">{{detailMessageObj.phone}}</span>
          </p>
          <p v-if="scopeId == 6">
            <span class="editName">城市：</span>
            <span class="editDetail" style="width: 150px">{{detailMessageObj.cityName}}</span>
            <span class="editName">性别：</span>
            <span class="editDetail" style="width: 100px" v-if="detailMessageObj.sex==-1">全部</span>
            <span class="editDetail" style="width: 100px" v-if="detailMessageObj.sex==1">男</span>
            <span class="editDetail" style="width: 100px" v-if="detailMessageObj.sex==2">女</span>
          </p>
          <p v-if="scopeId == 5">
            <span class="editName"></span>
            <ExportFile :exportUrl="exportMsgUrl" ajaxMethod="GET"></ExportFile>
          </p>
        </div>

        <!-- 司机详情 -->
        <div v-if="roleId == 1">
          <p>
            <span class="editName">发送范围：</span>
            <span class="editDetail" v-if="detailMessageObj.driver==3">指定司机</span>
            <span class="editDetail" v-if="detailMessageObj.driver==4">指定运营商</span>
            <span class="editDetail" v-if="detailMessageObj.driver==7">批量</span>
          </p>
          <p v-if="scopeId == 3">
            <span class="editName"></span>
            <!-- {{detailMessageObj.phone}} -->
            <span class="editDetail">
              {{detailMessageObj.phone}}
              </span>
          </p>
          <!-- 指定运营商 -->
          <p v-if="scopeId == 4">
             <span class="editName">指定运营商: </span>
             <span class="editDetail">
               {{detailMessageObj.zdyys}}
              </span>
          </p>
          <!-- 指定司机批量 -->
          <p v-if="scopeId == 7">
            <span class="editName"></span>
            <ExportFile :exportUrl="exportMsgUrl" ajaxMethod="GET"></ExportFile>
          </p>
        </div>
        <!-- <div>
          <p>
            <span class="editName">发送范围：</span>
            <span>{{sendRange[detailMessageObj.sysNo]}}</span>
          </p>
        </div> -->
        <p>
          <span class="editName">消息内容：</span>
          <span class="editDetail">{{detailMessageObj.contents}}</span>
        </p>
      </div>
      <div slot="footer">
        <Button @click="isShowDetail=false">关闭</Button>
      </div>
    </Modal>
    <!-- 新建 -->
    <Modal :title="modalTitle" :mask-closable="false" v-model="isShowModal" width="600">
      <Form :model="addMessageObj" :label-width="80" :rules="addMsgRule" ref="addmsgForm">
        <FormItem label="发送对象" prop="sendName">
          <Select
            v-model="addMessageObj.sendName"
            @on-change="selectSendRole"
            clearable
            filterable
            style="width:200px"
          >
            <Option value="0">乘客</Option>
            <Option value="1">司机</Option>
          </Select>
        </FormItem>
        <!-- 选择乘客 -->
        <Row v-if="roleId == 0">
          <FormItem label="发送范围" prop="driver">
            <Select
              v-model="addMessageObj.driver"
              @on-change="changeSendScope"
              clearable
              filterable
              style="width:200px">
              <Option :value="2">指定乘客</Option>
              <!--<Option :value="6">指定条件</Option>-->
              <Option :value="5">批量</Option>
            </Select>
          </FormItem>
          <FormItem v-if="scopeId == 2" prop="phone">
            <Input
              v-model="addMessageObj.phone"
              type="textarea"
              :rows="4"
              placeholder="请输入乘客手机号，以英文逗号隔开"/>
          </FormItem>
          <div v-if="scopeId == 6">
            <FormItem label="选择城市" style="display:inline-block;">
              <Select v-model="addMessageObj.cityUuid" clearable filterable style="width:200px">
                <Option
                  v-for="(item, index) in cityList"
                  :value="item.cityUuid"
                  :key="index"
                >{{ item.city }}</Option>
              </Select>
            </FormItem>
            <FormItem label="选择性别" style="display:inline-block;">
              <Select v-model="addMessageObj.sex" clearable filterable style="width:200px">
                <Option :value="-1">全部</Option>
                <Option :value="1">男</Option>
                <Option :value="2">女</Option>
              </Select>
            </FormItem>
          </div>
          <FormItem v-if="scopeId == 5">
            <ImportFile
              :importFileUrl="importUrl"
              @on-success="passengerSuccess"
              toDownTemplateUrl="/MessageTemplate.xlsx"
              style="display: inline-block;"
            ></ImportFile>
          </FormItem>
        </Row>
        <!-- 选择司机 -->
        <Row v-if="roleId == 1">
          <FormItem label="发送范围" prop="driver">
            <Select
              v-model="addMessageObj.driver"
              @on-change="changeSendScope"
              clearable
              filterable
              style="width:200px">
              <Option :value="3">指定司机</Option>
              <Option :value="4">指定运营商</Option>
              <Option :value="7">批量</Option>
            </Select>
          </FormItem>
          <FormItem v-if="scopeId == 3" prop="phone">
            <Input
              v-model="addMessageObj.phone"
              type="textarea"
              :rows="4"
              placeholder="请输入司机手机号，以英文逗号隔开"/>
          </FormItem>
          <div v-if="scopeId == 4">
            <FormItem label="业务类型" prop="businessType" style="display:inline-block;">
              <Select
                multiple
                clearable
                filterable
                v-model="addMessageObj.businessType"
                style="width:200px">
                <Option
                  v-for="(item, index) in businessTypes"
                  :value="item.value"
                  :key="index"
                >{{ item.text }}</Option>
              </Select>
            </FormItem>
            <FormItem label="运营商" prop="agentUuid">
              <TreeInput
                :data="operatorGroup"
                @on-change="selectNode"
                v-model="addMessageObj.agentUuid"
              ></TreeInput>
            </FormItem>
          </div>
          <FormItem v-if="scopeId == 7">
            <!-- 司机的批量导入 -->
            <ImportFile
              @on-success='importSuccess'
              :importFileUrl="importUrl"
              toDownTemplateUrl="/MessageTemplate.xlsx"
              style="display: inline-block;"
            ></ImportFile>
          </FormItem>
        </Row>
        <FormItem label="消息内容" prop="sendContent">
          <Input
            v-model="addMessageObj.sendContent"
            type="textarea"
            :rows="4"
            placeholder="请输入短信内容"
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="sendMessage" :loading="isNotloading" type="primary">
          <span v-if="!isNotloading">确定</span>
          <span v-else>请稍后...</span>
        </Button>
        <Button @click="isShowModal=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import TreeInput from "_a/tree-input/tree-input.vue";
import ImportFile from "_a/import-file/index.vue";
import ExportFile from "_a/export-file/exportFile.vue";
import {
  tableTitle,
  pageData,
  sendMap,
  sendRange,
  inputList
} from "./fields.js";
import { shortMsgList, sendMsg, viewMsgDetail } from "@/api/driver.js";

export default {
  components: {
    ImportFile,
    ExportFile,
    TreeInput
  },
  data() {
    const businessType = (rule, value, callback) => {
        if(typeof(value) !== 'undefined' && value.length) callback()
        else callback(new Error('业务类型不得为空'))
    }
    const agentUuid = (rule, value, callback) => {
      if(this.addMessageObj.agentUuid.length) callback()
      else callback(new Error('运营商不得为空'))
    }
    return {
      addMsgRule:{
        sendName: [{required: true, message: '请选择发送对象'}],
        driver: [{required: true, message: '请选择发送范围'}],
        phone: [{required: true, message: '请填写手机号', trigger: 'change'}],
        sendContent: [{required: true, message: '请输入发送内容', trigger: 'change'}],
        businessType: [{required: true, validator: businessType, trigger: 'change'}],
        agentUuid: [{required: true, validator: agentUuid, trigger: 'change'}],
      },
      inputList: [],
      ...pageData,
      sendMap,
      sendRange,
      importUrl: "/admin/sms/importExcel",
      exportMsgUrl: "/admin/sms/export/"
    };
  },
  computed: {
    cityList() {
      return this.$store.state.cityList;
    }
  },
  created() {
    this.inputList = JSON.parse(JSON.stringify(inputList));
    this.getTableColumns();
    this.getList();
    this.operatorGroup = JSON.parse(localStorage.getItem('pcOperatorList'))
    this.$store.dispatch("getCityList");
  },
  methods: {
    selectNode() {
      this.$refs.addmsgForm.validateField('agentUuid')
    },
    clearQueryData(data) {
      this.queryAjaxPramas = {};
      this.current = 1;
      this.getList();
    },
    queryData(data) {
      this.current = 1;
      this.queryAjaxPramas = data;
      this.getList();
    },
    getList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize
      };
      Object.assign(params, this.queryAjaxPramas);
      shortMsgList(params).then(res => {
        this.total = res.data.data.totalCount;
        this.tableData = res.data.data.list;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    getTableColumns() {
      let data = [];
      let actions = {
        key: "action",
        title: "详情",
        width: 100,
        render: (h, params) => {
          return h(
            "Button",
            {
              props: {
                type: "success",
                size: "small",
                ghost: true
              },
              directives: [{
                name: 'hasAuth',
                value: 'shortmessage-manage-detail'
              }],
              on: {
                click: () => {
                  this.viewDetail(params.row.batchNo);
                }
              }
            },
            "详情"
          );
        }
      };
      data = [...tableTitle];
      data.push(actions);
      this.tableColumns = data;
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    changePage(val) {
      this.current = val;
      this.getList();
    },
    viewDetail(batchNo) {
      this.scopeId = -1;
      this.roleId = -1;
      this.detailMessageObj = {}
      this.exportMsgUrl = '/admin/sms/export/' + batchNo;
      this.isShowDetail = true;
      this.modalTitle = "查看详情";
      viewMsgDetail({ batchNo: batchNo }).then(res => {
        // 后端返回的字段胡宏昌定义
        if (res.data.success) {
          let obj = res.data.data;
          this.roleId = obj.sendName;
          this.scopeId = obj.driver;
          let allPhone = [];
          if (obj.driver == 2 && obj.zdck) {
            // 指定乘客
            allPhone = obj.zdck;
          } else if (obj.driver == 3 && obj.zdsj) {
            // 指定司机
            allPhone = obj.zdsj;
          }
          if (allPhone.length > 0) {
            //拿到所有乘客或者司机的姓名+手机号
            let phones = [];
            allPhone.map(item => {
              let singlePassenger = (item.name ? item.name : "") + item.phone;
              phones.push(singlePassenger);
            });
            this.detailMessageObj.phone = phones.join();
          }
          if (obj.driver == 6 && obj.zdtj) {
            // 指定条件
            this.detailMessageObj.cityName = obj.zdtj.cityName;
            this.detailMessageObj.sex = obj.zdtj.sex;
          } else if (obj.driver == 4 && obj.zdyys) {
            // 指定运营商
            this.detailMessageObj.zdyys = obj.zdyys.join(',');
          }
          this.detailMessageObj.contents = obj.contents;
          this.detailMessageObj.sendName = obj.sendName;
          this.detailMessageObj.driver = obj.driver;
          // let data = res.data.data;
          // let obj = Array.isArray(data) ? data[0] : data;
          // this.detailMessageObj = obj;
          // this.roleId = obj.sendName;
          // this.scopeId = obj.driver;
          // //指定乘客或者指定司机
          // if ((obj.driver == 1 || obj.driver == 2) && data.length > 1) {
          //   let allDriver = [];
          //   data.map(item => {
          //     let singleDriver = (item.name ? item.name : "") + item.phone;
          //     allDriver.push(singleDriver);
          //   });
          //   this.detailMessageObj.phone = allDriver.join();
          // }

          // if (obj.driver == 3) {
          //   let allPlat = [];
          //   data.map(item => {
          //     let singlePlat = item.name;
          //     allPlat.push(singlePlat);
          //   });
          //   this.detailMessageObj.name = allPlat.join();
          // }
        }
      });
    },
    changeSendScope(data) {
      // 选择乘客下的发送范围
      if (data) {
        this.scopeId = data;
      }
      delete this.addMessageObj.sessionId;
    },
    importSuccess(res) {//司机的批量导入
      if (res.success) {
        this.addMessageObj.sessionId = res.data;
        this.getList();
      }
    },
    passengerSuccess(res) {// 乘客的批量导入
      if (res.success) {
        this.addMessageObj.sessionId = res.data;
        this.getList();
      }
    },
    sendMessage() {
      this.$refs.addmsgForm.validate(valid => {
        if (valid) {
          let msg = {};
          this.isNotloading = true;
          let isValidPhone = true;
          let params = "sendSms"; // 用变量记录批量导入和其他的接口
          msg.driver = this.addMessageObj.driver; //发送范围
          msg.sendName = this.addMessageObj.sendName; //发送对象
          msg.sendContent = this.addMessageObj.sendContent; //发送内容
          if (
            (this.scopeId == 2 && this.roleId == 0) ||
            (this.scopeId == 3 && this.roleId == 1)
          ) {
            //乘客或者司机输入手机号以发送消息
            let phones = this.addMessageObj.phone.split(",");
            let rule = /^1[3456789]\d{9}$/;
            isValidPhone = phones.every(item => {
              return rule.test(item);
            });
            if (isValidPhone) {
              msg.phone = this.addMessageObj.phone;
            } else {
              this.isNotloading = false;
              this.$Message.error("请输入合法的手机号！");
            }
          } else if (this.scopeId == 6 && this.roleId == 0) {
            // 指定乘客指定条件
            msg.city = this.addMessageObj.cityUuid;
            msg.sex = this.addMessageObj.sex;
          } else if (this.scopeId == 4 && this.roleId == 1) {
            //指定司机指定运营商
            params = "sendSms";
            msg.agentUuid = [];
            this.addMessageObj.agentUuid.forEach(item => {
              if (item.length !== 6) {
                msg.agentUuid.push(item);
              }
            });
            msg.businessType = this.addMessageObj.businessType;
          } else if (this.scopeId == 5 || this.scopeId == 7) {
            //批量发送
            if (!this.addMessageObj.sessionId){
              this.isNotloading = false;
              return this.$Message.warning("请先导入数据");
            }
            params = "insertExcel";
            msg.sessionId = this.addMessageObj.sessionId;
          }
          if (isValidPhone) {
            sendMsg(params, msg)
              .then(res => {
                if (res.data.success) {
                  this.$Message.success(res.data.msg);
                  this.isNotloading = false;
                  this.isShowModal = false;
                  this.getList();
                } else {
                  this.$Message.error(res.data.msg);
                }
              })
              .catch(err => {
                this.isNotloading = false;
              });
          }
        }
      });
    },
    createMsg() {
      this.isShowModal = true;
      this.isNotloading = false;
      this.modalTitle = "新建消息";
      this.addMessageObj = {
        agentUuid: []
      };
      this.scopeId = -1;
      this.$refs.addmsgForm.resetFields();
    },
    selectSendRole(data) {
      //选择发送对象
      if (data) {
        this.addMessageObj = {};
        this.addMessageObj.sendName = data;
        this.roleId = data;
      }
      this.$refs.addmsgForm.resetFields();
    }
  }
};
</script>

<style scoped>
.manageDetail p {
  line-height: 30px;
  display: flex;
  padding-left: 50px;
  text-align: left;
}
.manageDetail .editName {
  width: 76px;
  padding: 0;
  display: inline-block;
}
.manageDetail .editDetail {
  width: 400px;
  display: inline-block;
}
</style>
