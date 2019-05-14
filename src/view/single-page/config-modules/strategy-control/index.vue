<!--系统策略-->
<template>
  <div>
    <Tabs value="orderpricve" @on-click="tabschange">
      <TabPane label="免费取消策略设置" name="orderpricve">
        <div class="opttop">
          <div class="liststaus">
            状态筛选：
            <Select
              v-model="orderlistSearch.isDel"
              style="width:200px"
              @on-change="selectStatusOrder"
            >
              <Option
                v-for="item in statsulist"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
        </div>
        <div style="display: flex;justify-content: space-between;margin-top: 20px;">
          <!--<div class="dateHolidayWrap">
            工作日日历：
            <i-button type="primary" @click="holidayModel = !holidayModel">
              <span v-show="holidayModel === false">查看日历</span>
              <span v-show="holidayModel === true">关闭日历</span>
            </i-button>
            <holidayDate
              style="z-index: 100"
              class="holiday"
              v-show="holidayModel"
              :holidayModel="holidayModel"
              v-on:datepickmodal="datepickmodal"
            ></holidayDate>
          </div>-->
          <Button
            type="primary"
            @click="addnewstrategry"
            v-hasAuth="'strategy_control-addOrder'"
          >新建策略</Button>
        </div>
        <VTable
          :total="orderpricvedata.total"
          :current="orderpricvedata.current"
          :pageSize="orderpricvedata.pageSize"
          :isLoading="orderpricvedata.isLoading"
          :parColumns="orderpricvedata.tableColumns"
          :parTableData="orderpricvedata.rootTabelData"
          @selectObj="selectObj"
          @changePage="changePage"
          @changePageSize="changePageSize"
          class="top20"
        ></VTable>
      </TabPane>
      <TabPane label="偏离报警策略设置" name="callpolice">
        <searchList :inputList="inputList" @on-search="queryList" @on-reset="handelReset"></searchList>
        <Button
          type="primary"
          @click="addnewCallPolice"
          v-hasAuth="'strategy_control-addAlarm'"
        >新建策略</Button>
        <VTable
          :total="callpolicetabeldata.total"
          :current="callpolicetabeldata.current"
          :pageSize="callpolicetabeldata.pageSize"
          :isLoading="callpolicetabeldata.isLoading"
          :parColumns="callpolicetabeldata.tableColumns"
          :parTableData="callpolicetabeldata.rootTabelData"
          @selectObj="selectObj"
          @changePage="changePage"
          @changePageSize="changePageSize"
          class="top20"
        ></VTable>
      </TabPane>
    </Tabs>
    <!-- 新增和编辑弹框 订单计费策略-->
    <modal v-model="newMobel" :title="modaltitle" :width="440" :mask-closable="false">
      <Form :model="csmModalData" ref="csmForm" :rules="csmRules" :label-width="100">
        <Alert type="success">策略类型：乘客有条件免费取消次数定义</Alert>
        <FormItem label="适用城市" v-if="type === 'edit'">
          <Input v-model="csmModalData.city" readonly></Input>
        </FormItem>
        <FormItem label="策略名称" prop="strategyName">
          <Input v-model="csmModalData.strategyName" placeholder="请输入策略名称" style="width: 200px"/>
        </FormItem>
        <FormItem label="次数(次/月)" prop="number">
          <InputNumber v-model="csmModalData.number" placeholder="请输入次数" style="width:200px;"></InputNumber>
        </FormItem>
        <FormItem label="取消支付金额" prop="money">
          <InputNumber v-model="csmModalData.money" placeholder="请输入支付金额" style="width:200px;"></InputNumber>
        </FormItem>
        <FormItem label="适用城市" v-if="type === 'add'" prop="city">
          <Cascader
            :data="cityList"
            v-model="csmModalData.city"
            trigger="hover"
            style="width:200px;display: inline-block;"
          ></Cascader>
        </FormItem>
      </Form>
      <!-- <div style="padding: 0 20px;">
        <div v-if="type === 'edit'">适用城市：{{csmModalData.city}}</div>
        <div :class="type === 'add' ? '' : 'top15'">策略类型：乘客有条件免费取消次数定义 </div>
        <div class="top15">
          策略名称：<Input v-model="csmModalData.strategyName" placeholder style="width: 300px"/>
        </div>
        <div class="top15">
          次数(次/月)：<Input v-model="csmModalData.number" placeholder="请输入次数" style="width: 290px"/>
        </div>
         <div class="top15">
         取消支付金额：<Input v-model="csmModalData.money" placeholder="请输入取消金额" style="width: 200px"/>
        </div>
        <div class="top15" v-if="type === 'add'">
          适用城市：<Cascader :data="cityList" v-model="csmModalData.city" trigger="hover" style="width:300px;display: inline-block;"></Cascader>
        </div>
      </div>-->
      <div slot="footer">
        <Button type="text" @click="newMobel=false">取消</Button>
        <Button type="primary" @click="asyncOK">确定</Button>
      </div>
    </modal>
    <!-- 停用弹框 -->
    <modal v-model="deleteModel" title="停用策略" @on-ok="deleteOK">
      <div>确定停用该策略?</div>
    </modal>
    <!-- 启用弹框 -->
    <modal v-model="restartModel" title="启用策略" @on-ok="restartOK">
      <div>确定启用该策略?</div>
    </modal>
    <!-- 偏离报警 编辑和新建 -->
    <modal v-model="callpolicemodal" :title="callpolicetitle" :width="460" :mask-closable="false">
      <div style="padding-left: 20px;">
        <div>
          名称：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Input
            v-model="callpolicedata.name"
            placeholder
            style="width: 300px"
            :readonly="policedisabled"
          />
        </div>
        <div class="top15">
          业务类型：
          <Select
            v-model="callpolicedata.serviceType"
            style="width:300px"
            :disabled="policedisabled">
            <Option
              v-for="(item,index) in productList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</Option>
          </Select>
        </div>
        <div class="top15">
          偏离时限：
          <InputNumber
            v-model="callpolicedata.divergeTime"
            :min="minnumber"
            :max="maxnumber"
            style="width: 300px"
            :readonly="policedisabled"
          ></InputNumber>
          <span style="margin: 0 20px 0 5px">分钟</span>
        </div>
        <div class="top15">
          偏离次数：
          <InputNumber
            v-model.trim="callpolicedata.divergeNum"
            :min="minnumber"
            :max="maxnumber"
            style="width: 300px"
            :readonly="policedisabled">
          </InputNumber>
          <span style="margin: 0 32px 0 5px">次</span>
        </div>
        <div class="top15">
          偏离里程占比：
          <Select
            v-model="callpolicedata.divergePercent"
            style="width:280px"
            :disabled="policedisabled">
            <Option v-for="index in 99" :value="index" :key="index">{{ index }}%</Option>
          </Select>
        </div>
        <div class="top15">
          适用城市：
          <Cascader
            v-if="isAdd"
            :data="citysdata"
            trigger="hover"
            v-model="cityvalues"
            @on-change="chooseCity"
            placeholder="请选择城市"
            style="width:305px;display: inline-block;"
          ></Cascader>
          <span>{{callpolicedata.cityName}}</span>
        </div>
        <div class="top15">
          备注：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Input
            v-model="callpolicedata.remark"
            placeholder="请填写备注"
            type="textarea"
            style="width: 305px"
            :readonly="policedisabled"/>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" @click="callpolicemodal=false">取消</Button>
        <Button type="primary" @click="policeOK">确定</Button>
      </div>
    </modal>
  </div>
</template>

<script>
import holidayDate from "_a/holiday-date/holiday-date";
import {
  attendanceStrategyDetail,
  attendanceStrategyDelete,
  attendanceStrategyPage,
  attendanceStrategySave,
  attendanceStrategyUpdate,
  orderStrategyDelete,
  orderStrategyAdd,
  orderselectAll,
  orderUpdateStrategy,
  getChoiceCity,
  calenderUpdate,
  calenderSelectByParam,
  calenderInsertCalendar,
  alarmList,
  alarmListDdetail,
  alarmUpate,
  alarmSave
} from "@/api/configData.js";
import { getProvinceCityList } from "@/api/common.js";
import { returnFields, inputList } from "./fields.js";
import { mapGetters } from "vuex";

export default {
  name: "agreementControl",
  components: {
    holidayDate
  },
  data() {
    return {
      inputList: [],
      restartModel: false,
      hideopt: false,
      isAdd: true, //偏离报警是否新增
      minnumber: 0,
      maxnumber: 9999,
      maxlengths: 4,
      cityCodeArray: [],
      cityCodeArrayCheckon: [],
      optionArray: [],
      orderpricvedata: {
        total: 0,
        current: 1,
        pageSize: 10,
        isLoading: true,
        tableColumns: [], // 表格头
        tableData: [], //表格数据
        rootTabelData: [] // 表格元数据
      },
      callpolicetabeldata: {
        total: 0,
        current: 1,
        pageSize: 10,
        isLoading: true,
        tableColumns: [], // 表格头
        tableData: [], //表格数据
        rootTabelData: [] // 表格元数据
      },
      pageSizeOpts: [15, 30, 50, 100],
      isTableView: true,
      isCustomDrop: false,
      csmModalData: {
        strategyName: "", //策略名称
        city: [], // 适用城市
        number: null, // 次数
        money: 1
      },
      csmRules: {
        number: [{ required: true, message: "必填" }],
        money: [{ required: true, message: "必填" }],
        city: [{ required: true, message: "必填" }],
        strategyName: [{ required: true, message: "必填" }]
      },
      cityvalues: [],
      callpolicedata: {
        name: "", //名称
        serviceType: "", //业务类型
        divergeTime: 0, // 偏离时限
        divergeNum: 0, // //偏离次数
        divergePercent: "", //偏离里程占比
        remark: "", // 备注
        creater: "", // 创建人
        cityCode: "", // 适用城市
        uuid: ""
      },
      tabNamePone: "orderpricve",
      callpolicemodal: false,
      newMobel: false, //新建弹出框
      lookMobel: false, //查看弹出框
      datePickBor: false, //选择日期是否显示
      peakStartTime1: "", //策略1开始时间
      peakEndTime1: "",
      peakStartTime2: "",
      peakEndTime2: "",
      holidayList: [
        {
          day: 16,
          resttype: "W"
        },
        {
          day: 1,
          resttype: "R"
        }
      ],
      deleteModel: false, //删除弹框
      agrList: [
        {
          value: 1,
          label: "用户协议"
        },
        {
          value: 2,
          label: "不可更新协议"
        }
      ],
      cityList: [],
      productList: [
        {
          value: 4,
          label: "快车"
        },
        {
          value: 2,
          label: "专车"
        },
        {
          value: 1,
          label: "出租车"
        }
      ],
      yewuList: [
        {
          value: 1,
          label: "全选"
        },
        {
          value: 2,
          label: "预约用车"
        },
        {
          value: 3,
          label: "即时用车"
        }
      ],
      conditionreals: [
        {
          value: 1,
          label: "同时满足"
        },
        {
          value: 2,
          label: "非不同时满足"
        }
      ],
      divergePercentData: 100,
      holidayModel: false,
      type: "add",
      modaltitle: "新建",
      callpolicetitle: "新建",
      isdisabled: false,
      deleteIndex: "",
      deleteflag: "",
      editStatus: false,
      policeeditStatus: false,
      policedisabled: false,
      editIndex: "",
      FORBIDCLICK: false, // 禁止表单重复提交
      orderlistSearch: {
        isDel: ""
      },
      statsulist: [
        {
          value: 999,
          label: "全部"
        },
        {
          value: 0,
          label: "使用中"
        },
        {
          value: 1,
          label: "已停用"
        }
      ],
      returnColumfieldsCheckon: [],
      citysdata: [],
      cityvalue: []
    };
  },
  created() {
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.orderpricvedata.tableColumns.push(value);
    });
    this.inputList = JSON.parse(JSON.stringify(inputList));
    this.inputList[0].cascaderList = JSON.parse(
      localStorage.getItem("provinceCityList")
    );
    this.callpolicedata.creater = this.userAccount;
    this.getCityList();
  },
  computed: {
    ...mapGetters(["userAccount"]),
    customList() {
      return { ...fields };
    },
    tiomebetween() {
      return this.checkonmadaldata.dayOnlineEnable ? "启用" : "关闭";
    },
    orderfinishfont() {
      return this.checkonmadaldata.dayOrdersEnable ? "启用" : "关闭";
    },
    getDayOnlineNum() {
      let dayOnline = JSON.parse(JSON.stringify(this.checkonmadaldata));
    }
  },
  mounted() {
    this.getOrdersStragyList();
    this.getCalcudate();
  },
  methods: {
    queryList(data) {
      this.getPoliceStragyList(data);
    },
    handelReset(data) {
      this.getPoliceStragyList({});
    },
    chooseCity(data) {
      // 选择城市触发
      this.callpolicedata.cityCode = data[1];
    },
    getCityList() {
      this.cityList = JSON.parse(localStorage.getItem("provinceCityList"));
      this.citysdata = JSON.parse(localStorage.getItem("provinceCityList"));
    },
    selectStatusOrder(data) {
      this.orderpricvedata.pageSize = 10;
      this.orderpricvedata.current = 1;
      this.getOrdersStragyList(data);
    },
    selectStatusCheckon(data) {
      this.checkon.pageSize = 10;
      this.checkon.current = 1;
      this.getattendanceStragyList(data);
    },
    restartOK() {
      let uuid = this.orderpricvedata.tableData[this.deleteIndex].uuid;
      orderUpdateStrategy({ uuid, status: 1 }).then(res => {
        this.restartModel = false;
        this.$Message.success(res.data.msg);
        this.getOrdersStragyList();
      });
    },
    getCalcudate() {
      let date = new Date();
      let currentYear = date.getFullYear();
      if (
        localStorage.getItem("hasCurrentYear") &&
        currentYear == localStorage.getItem("hasCurrentYear")
      ) {
        return false;
      } else {
        /*calenderInsertCalendar(`?year=${currentYear}`).then(res => {
        }).catch(err => {
          if (err.data.errCode == 12306) {
            localStorage.setItem('hasCurrentYear', JSON.stringify(currentYear))
          }
        })*/
      }
    },
    datedifference(sDate1, sDate2) {
      let dateSpan, tempDate, iDays;
      sDate1 = Date.parse(sDate1);
      sDate2 = Date.parse(sDate2);
      dateSpan = sDate2 - sDate1;
      dateSpan = Math.abs(dateSpan);
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
      return iDays;
    },
    getOrdersStragyList(data) {
      let orderpricvedata = this.orderpricvedata;
      let dataJson = {
        pageSize: orderpricvedata.pageSize,
        currPage: orderpricvedata.current,
        isDel: data
      };
      if (data == 999) {
        delete dataJson.isDel;
      }
      this.$store.commit("changeLoadingFlag", true);
      orderselectAll(dataJson).then(res => {
        let newdatalist = res.data.data.list;
        this.orderpricvedata.tableData = JSON.parse(
          JSON.stringify(newdatalist)
        );
        this.orderpricvedata.rootTabelData = newdatalist;
        this.orderpricvedata.total = res.data.data.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    reset: function(data) {},
    selectObj: function() {},
    changePage: function(val) {
      if (this.tabNamePone == "orderpricve") {
        this.orderpricvedata.current = val;
        this.getOrdersStragyList();
      } else if (this.tabNamePone == "callpolice") {
        this.callpolice.current = val;
        this.getPoliceStragyList();
      }
    },
    changePageSize: function(val) {
      if (this.tabNamePone == "orderpricve") {
        this.orderpricvedata.pageSize = val;
        this.getOrdersStragyList();
      } else if (this.tabNamePone == "callpolice") {
        this.callpolice.pageSize = val;
        this.getPoliceStragyList();
      }
    },
    strategyChange: function(value) {},
    asyncOK: function() {
      // let that = this;
      let data = JSON.parse(JSON.stringify(this.csmModalData));
      // if (this.FORBIDCLICK) {
      //   return;
      // }
      // if (!data.strategyName) {
      //   this.$Message.warning("请填写策略名称");
      //   return false;
      // }
      // if (!data.number) {
      //   this.$Message.warning("请填写月次数");
      //   return false;
      // } else {
      //   let reg = /^[1-9]\d*$|^0$/;
      //   if (!reg.test(data.number)) {
      //     this.$Message.warning("填写的月次数不是数字");
      //     return false;
      //   }
      // }
      // if (!data.city) {
      //   this.$Message.warning("请选择适用城市");
      //   return false;
      // }
      this.$refs.csmForm.validate(valid => {
        if (valid) {
          if (this.editStatus) {
            // 新增
            let uuid = this.orderpricvedata.tableData[this.editIndex].uuid;
            data.uuid = uuid;
            orderUpdateStrategy(data).then(res => {
              this.newMobel = false;
              this.$Message.success(res.data.msg);
              this.getOrdersStragyList();
              // this.FORBIDCLICK = false;
            });
          } else {
            // 编辑
            data.cityCode = data.city[1];
            orderStrategyAdd(data).then(res => {
              this.newMobel = false;
              this.$Message.success(res.data.msg);
              this.getOrdersStragyList();
              // this.FORBIDCLICK = false;
            });
          }
        }
      });
    },
    deleteOK() {
      let orderdata = this.orderpricvedata.tableData;
      let uuid = orderdata[this.deleteIndex].uuid;
      orderStrategyDelete({ uuid }).then(res => {
        this.$Message.success(res.data.msg);
        this.getOrdersStragyList();
        this.deleteModel = false;
      });
    },
    policeOK() {
      let data = this.callpolicedata;
      if (this.policedisabled) {
        this.callpolicemodal = false;
        return false;
      }
      if (!data.name) {
        this.$Message.warning("请填写名称");
        return false;
      }
      if (!data.serviceType) {
        this.$Message.warning("请选择业务类型");
        return false;
      }
      if (!data.divergeTime) {
        this.$Message.warning("请填写偏离时限");
        return false;
      }
      if (!data.divergeNum) {
        this.$Message.warning("请填写偏离次数");
        return false;
      }
      if (!data.divergePercent) {
        this.$Message.warning("请选择偏离里程占比");
        return false;
      }
      data.creator = this.userAccount;
      if (data.uuid) {
        alarmUpate(data).then(res => {
          this.$Message.success(res.data.msg || "更新成功");
          this.callpolicemodal = false;
          this.getPoliceStragyList({});
        });
      } else {
        alarmSave(data).then(res => {
          this.$Message.success(res.data.msg || "保存成功");
          this.callpolicemodal = false;
          this.getPoliceStragyList({});
        });
      }
    },
    datepickmodal(status) {
      this.holidayModel = status;
    },
    addnewstrategry() {
      this.editStatus = false;
      (this.csmModalData = {
        strategyName: "", //策略名称
        city: [], // 适用城市
        number: null, // 次数
        money: 1
      }),
        (this.modaltitle = "新建策略");
      this.type = "add";
      this.newMobel = true;
      this.$refs.csmForm.resetFields();
    },
    addnewCallPolice() {
      this.policedisabled = false;
      this.isAdd = true;
      (this.callpolicedata = {
        name: "", //名称
        serviceType: "", //业务类型
        divergeTime: 0, // 偏离时限
        divergeNum: 0, // //偏离次数
        divergePercent: "", //偏离里程占比
        remark: "", // 备注
        creater: "", // 创建人
        uuid: ""
      }),
        (this.cityvalues = []);
      this.callpolicetitle = "新建策略";
      this.cityCodeArray = [];
      this.callpolicemodal = true;
    },
    tabschange(name) {
      this.tabNamePone = name;
      if (name == "orderpricve" && !this.orderpricvedata.tableColumns.length) {
        Object.entries(returnFields(this, name)).forEach(([key, value]) => {
          this.orderpricvedata.tableColumns.push(value);
        });
        this.getOrdersStragyList();
      } else if (
        name == "callpolice" &&
        !this.callpolicetabeldata.tableColumns.length
      ) {
        Object.entries(returnFields(this, name)).forEach(([key, value]) => {
          this.callpolicetabeldata.tableColumns.push(value);
        });
        this.getPoliceStragyList();
      }
    },
    getPoliceStragyList(argundata) {
      let callpolicetabeldata = this.callpolicetabeldata;
      let data = {
        pageSize: callpolicetabeldata.pageSize,
        currPage: callpolicetabeldata.current
      };
      let apidata = Object.assign(data, argundata);
      this.$store.commit("changeLoadingFlag", true);
      alarmList(apidata).then(res => {
        this.callpolicetabeldata.tableData = JSON.parse(
          JSON.stringify(res.data.data.list)
        );
        this.callpolicetabeldata.rootTabelData = res.data.data.list;
        this.callpolicetabeldata.total = res.data.data.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    dailyevent(event) {
      this.checkonmadaldata.dayOnline =
        Number(this.checkonmadaldata.dayOnline) > 1440
          ? 1440
          : this.checkonmadaldata.dayOnline;
    },
    ordersnumevent(event) {
      this.checkonmadaldata.dayOrders =
        Number(this.checkonmadaldata.dayOrders) > 1440
          ? 1440
          : this.checkonmadaldata.dayOrders;
    },
    getSelectCity(data) {
      if (!data.length) return;
      data.forEach(item => {
        if (item == "1") {
          this.cityCodeArrayCheckon = ["1"];
          this.checkonmadaldata.city = this.cityCodeArrayCheckon.join(",");
        } else {
          this.checkonmadaldata.city = data.join(",");
        }
      });
    },
    getOptionSelect(data) {
      this.checkonmadaldata.operatorUuid = data.join(",");
    }
  }
};
</script>
<style lang="less" scoped>
.dateHolidayWrap {
  position: relative;
  left: 0;
}
.holiday {
  position: absolute;
  left: 0;
  right: 0;
  background: #fff;
  width: 300px;
}
// .opttop{
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   .liststaus{
//     margin-left: 100px;
//     margin-top: 20px;
//   }
// }
</style>
