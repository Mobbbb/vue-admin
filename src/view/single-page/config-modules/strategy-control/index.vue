<!--系统策略-->
<template>
  <div>
    <Tabs :value="tabObj.tabNamePone" @on-click="tabschange">
      <TabPane label="取消策略" name="cancelTab">
        <search-table
          v-if="tabObj.tabNamePone==='cancelTab'"
          ref="cancelTable"
          tabNum="1"
          @addnew="addNew('1')"
          @axiosDetail="axiosDetail"
        ></search-table>
      </TabPane>
      <TabPane label="偏离报警策略" name="deviateTab">
        <search-table
          v-if="tabObj.tabNamePone==='deviateTab'"
          ref="deviateTable"
          tabNum="2"
          @addnew="addNew('2')"
          @axiosDetail="axiosDetail"
          @axiosDelete="axiosDelete"
        ></search-table>
      </TabPane>
      <TabPane label="时间段及高峰策略" name="timeTab">
        <search-table
          v-if="tabObj.tabNamePone==='timeTab'"
          ref="timeTable"
          tabNum="3"
          @addnew="addNew('3')"
          @axiosDetail="axiosDetail"
          @axiosDelete="axiosDelete"
        ></search-table>
      </TabPane>
    </Tabs>
    <!-- 新增取消策略-->
    <modal v-model="cancelModal" :title="cancelTitle" :width="750" :mask-closable="false" @on-cancel="handleReset('cancelForm')">
      <Form :model="cancelModelData" ref="cancelForm" :rules="cancelRules" :label-width="145">
        <div class="twoinline">
          <FormItem label="订单类型：" prop="typeTime">
            <Select v-model="cancelModelData.typeTime" :disabled="isCancelEdit" style="width:200px" placeholder="请选择订单类型">
              <Option :value="1">实时</Option>
              <Option :value="2">预约</Option>
            </Select>
          </FormItem>
          <FormItem v-if="!isCancelEdit" label="适用城市：" prop="city">
            <Cascader v-model="cancelModelData.city" :disabled="isCancelEdit" :data="provinceCityList" trigger="hover" filterable  style="width:200px;display: inline-block;"></Cascader>
          </FormItem>
          <FormItem v-else label="适用城市：">
            <span>{{cancelModelData.cityName}}</span>
          </FormItem>
        </div>
        <div v-if="cancelModelData.typeTime===1||cancelModelData.typeTime===2">
          <div class="twoinline">
            <FormItem label="策略名称：" prop="strategyName">
              <Input v-model="cancelModelData.strategyName" placeholder="请输入策略名称" style="width: 200px"/>
            </FormItem>
            <FormItem label="取消费(元)：" prop="money">
              <InputNumber :min="0.1" :max="100" v-model="cancelModelData.money" @on-blur="judgeMoney" placeholder="请输入取消费" style="width:200px;"></InputNumber>
            </FormItem>
          </div>
          <FormItem label="生效时间：" prop="effectiveTime">
            <DatePicker
              v-if="cancelModal"
              v-model="cancelModelData.effectiveTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              :editable="false"
              :options="dateOptions"
              placeholder="请选择日期"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
          <div v-if="cancelModelData.typeTime===1">
            <FormItem label="接单后免费取消时间：" prop="freeCancleMinute">
              <InputNumber :min="0" :max="60" v-model="cancelModelData.freeCancleMinute" placeholder="请输入" style="width:160px;"></InputNumber>
              分钟
            </FormItem>
            <FormItem label="接单后超时取消时间：" prop="outCancleMinute">
              <InputNumber :min="1" :max="60" v-model="cancelModelData.outCancleMinute" placeholder="请输入" style="width:160px;"></InputNumber>
              分钟
            </FormItem>
            <FormItem label="连续取消次数限制：">
              <Checkbox v-model="cancelModelData.continuedCancelLimit">启用</Checkbox>
            </FormItem>
            <div class="form-in-line" v-if="cancelModelData.continuedCancelLimit">
              <FormItem label="在" prop="continuedCancelMinute" class="left36">
                <InputNumber :min="1" :max="60" v-model="cancelModelData.continuedCancelMinute" placeholder="请输入" style="width:100px;"></InputNumber>
              </FormItem>
              分钟内连续主动取消
              <FormItem prop="continuedCancelNum">
                <InputNumber :min="1" :max="100" v-model="cancelModelData.continuedCancelNum" placeholder="请输入" style="width:100px;"></InputNumber>
              </FormItem>
              次任意订单，禁止下单
              <FormItem prop="continuedCancelNoMinute">
                <InputNumber :min="1" :max="1440" v-model="cancelModelData.continuedCancelNoMinute" placeholder="请输入" style="width:100px;"></InputNumber>
              </FormItem>
              分钟
            </div>
          </div>
          <div v-else>
            <FormItem label="无责取消时间：" prop="noResponseCancelMinute">
              <InputNumber :min="0" v-model="cancelModelData.noResponseCancelMinute" placeholder="请输入" style="width:160px;"></InputNumber>
              分钟
            </FormItem>
            <FormItem label="司机可迟到时间：" prop="driverLaterMinute">
              <InputNumber :min="1" :max="60" v-model="cancelModelData.driverLaterMinute" placeholder="请输入" style="width:160px;"></InputNumber>
              分钟
            </FormItem>
          </div>
          <div>
            <FormItem label="每日取消次数限制：">
              <Checkbox v-model="cancelModelData.dailyCancelLimit">启用</Checkbox>
            </FormItem>
            <div class="form-in-line" v-if="cancelModelData.dailyCancelLimit && cancelModelData.typeTime===1">
              <FormItem label="每自然日在接单后" prop="dailyCancelMinute" class="left120">
                <InputNumber :min="1" :max="60" v-model="cancelModelData.dailyCancelMinute" placeholder="请输入" style="width:100px;"></InputNumber>
              </FormItem>
              分钟内主动取消
              <FormItem prop="dailyCancelNum">
                <InputNumber :min="1" :max="100" v-model="cancelModelData.dailyCancelNum" placeholder="请输入" style="width:100px;"></InputNumber>
              </FormItem>
              次实时单，
              <FormItem prop="dailyCancelNoMinute">
                <InputNumber :min="1" :max="1440" v-model="cancelModelData.dailyCancelNoMinute" placeholder="请输入" style="width:100px;"></InputNumber>
              </FormItem>
              分钟内禁止下单
            </div>
            <div class="form-in-line" v-if="cancelModelData.dailyCancelLimit && cancelModelData.typeTime===2">
              <FormItem label="每自然日内主动取消" prop="dailyCancelNum" class="left120">
                <InputNumber :min="1" :max="100" v-model="cancelModelData.dailyCancelNum" placeholder="请输入" style="width:100px;"></InputNumber>
              </FormItem>
              次预约单，
              <FormItem prop="dailyCancelNoMinute">
                <InputNumber :min="1" :max="1440" v-model="cancelModelData.dailyCancelNoMinute" placeholder="请输入" style="width:100px;"></InputNumber>
              </FormItem>
              分钟内禁止下单
            </div>
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelModal=false;handleReset('cancelForm')">取消</Button>
        <Button type="primary" @click="cancelSubmit('cancelForm')">确定</Button>
      </div>
    </modal>
    <!-- 偏离报警新建 -->
    <modal v-model="deviateModal" :title="deviateTitle" :width="600" :mask-closable="false"  @on-cancel="handleReset('deviateForm')">
      <Form :model="deviateModelData" ref="deviateForm" :rules="deviateRules" :label-width="140">
        <FormItem label="策略名称：" prop="strategyName">
          <Input v-model="deviateModelData.strategyName" placeholder="请输入策略名称" style="width: 200px"/>
        </FormItem>
        <FormItem v-if="!isDeviateEdit" label="适用城市：" prop="city">
          <Cascader v-model="deviateModelData.city" :disabled="isDeviateEdit" :data="provinceCityList" trigger="hover" filterable  style="width:200px;display: inline-block;"></Cascader>
        </FormItem>
        <FormItem v-else label="适用城市：">
          <span>{{deviateModelData.cityName}}</span>
        </FormItem>
        <FormItem label="业务线：" prop="serviceType">
          <Select v-model="deviateModelData.serviceType"  :disabled="isDeviateEdit" style="width:200px" placeholder="请选择业务线">
            <Option v-for="item in businessTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="生效时间：" prop="effectiveTime">
          <DatePicker
            v-if="deviateModal"
            v-model="deviateModelData.effectiveTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            :editable="false"
            :options="dateOptions"
            placeholder="请选择日期"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <FormItem label="偏离时限(分钟)：" prop="divergeTime">
          <InputNumber :min="1" v-model="deviateModelData.divergeTime" placeholder="请输入偏离时限" style="width:200px;"></InputNumber>
        </FormItem>
        <FormItem label="偏离次数：" prop="divergeNum">
          <InputNumber :min="1" v-model="deviateModelData.divergeNum" placeholder="请输入偏离次数" style="width:200px;"></InputNumber>
        </FormItem>
        <FormItem label="偏离里程占比：" prop="divergePercent">
          <Select v-model="deviateModelData.divergePercent" style="width:200px" placeholder="请选择偏离里程占比">
            <Option v-for="item in 99" :value="item" :key="item">{{ item }}%</Option>
          </Select>
        </FormItem>
        <FormItem label="备注：">
          <Input v-model="deviateModelData.remark" type="textarea" :rows="4" placeholder="备注"  style="width:350px;"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="deviateModal=false;handleReset('deviateForm')">取消</Button>
        <Button type="primary" @click="deviateSubmit">确定</Button>
      </div>
    </modal>
    <!-- 时间段及高峰策略 -->
    <modal v-model="timeModal" :title="timeTitle" :width="600" :mask-closable="false"  @on-cancel="handleReset('timeForm')">
      <Form :model="timeModelData" ref="timeForm" :rules="timeRules" :label-width="140">
        <FormItem label="策略名称：" prop="strategyName">
          <Input v-model="timeModelData.strategyName" placeholder="请输入策略名称" style="width: 200px"/>
        </FormItem>
        <FormItem v-if="!isTimeEdit" label="适用城市：" prop="city">
          <Cascader v-model="timeModelData.city" :disabled="isTimeEdit" :data="provinceCityList" trigger="hover" filterable  style="width:200px;display: inline-block;"></Cascader>
        </FormItem>
        <FormItem v-else label="适用城市：">
          <span>{{timeModelData.cityName}}</span>
        </FormItem>
        <FormItem label="生效时间：" prop="effectiveTime">
          <DatePicker
            v-if="timeModal"
            v-model="timeModelData.effectiveTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            :editable="false"
            :options="dateOptions"
            placeholder="请选择日期"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <div class="inline-form-item">
          <FormItem label="夜间服务时段：" prop="nightServiceBeginTime">
            <TimePicker type="time" placeholder="开始时间" style="width: 110px" v-model="timeModelData.nightServiceBeginTime" format="HH:mm:ss"></TimePicker>
            <span>至</span>
          </FormItem>
          <FormItem prop="nightServiceEndTime" class="no-left-margin">
            <TimePicker type="time" placeholder="结束时间" style="width: 110px" v-model="timeModelData.nightServiceEndTime" format="HH:mm:ss"></TimePicker>
          </FormItem>
        </div>
        <div class="inline-form-item">
          <FormItem label="早高峰时段：" prop="morningPeakBeginTime">
            <TimePicker type="time" placeholder="开始时间" style="width: 110px" v-model="timeModelData.morningPeakBeginTime" format="HH:mm:ss"></TimePicker>
            <span>至</span>
          </FormItem>
          <FormItem prop="morningPeakEndTime" class="no-left-margin">
            <TimePicker type="time" placeholder="结束时间" style="width: 110px" v-model="timeModelData.morningPeakEndTime" format="HH:mm:ss"></TimePicker>
          </FormItem>
        </div>
        <div class="inline-form-item">
          <FormItem label="晚高峰时段：" prop="eveningPeakBeginTime">
            <TimePicker type="time" placeholder="开始时间" style="width: 110px" v-model="timeModelData.eveningPeakBeginTime" format="HH:mm:ss"></TimePicker>
            <span>至</span>
          </FormItem>
          <FormItem prop="eveningPeakEndTime" class="no-left-margin">
            <TimePicker type="time" placeholder="结束时间" style="width: 110px" v-model="timeModelData.eveningPeakEndTime" format="HH:mm:ss"></TimePicker>
          </FormItem>
        </div>
        <div class="inline-form-item">
          <FormItem label="其他高峰时段：">
            <TimePicker type="time" placeholder="开始时间" style="width: 110px" v-model="timeModelData.otherPeakBeginTime" format="HH:mm:ss"></TimePicker>
            <span>至</span>
          </FormItem>
          <FormItem class="no-left-margin">
            <TimePicker type="time" placeholder="结束时间" style="width: 110px" v-model="timeModelData.otherPeakEndTime" format="HH:mm:ss"></TimePicker>
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
        <Button type="text" @click="timeModal=false;handleReset('timeForm')">取消</Button>
        <Button type="primary" @click="timeSubmit">确定</Button>
      </div>
    </modal>
    <!-- 取消策略详情 -->
    <modal v-model="cancelDetailModal" class="detail-modal" title="取消策略详情" :width="750" :mask-closable="false">
      <Form :model="cancelModelData" :label-width="145">
        <div class="twoinline">
          <FormItem label="订单类型：">
            {{cancelModelData.typeTime===1?'实时':'预约'}}
          </FormItem>
          <FormItem label="适用城市：">
            {{cancelModelData.cityName}}
          </FormItem>
        </div>
        <div v-if="cancelModelData.typeTime===1||cancelModelData.typeTime===2">
          <div class="twoinline">
            <FormItem label="策略名称：">
              {{cancelModelData.strategyName}}
            </FormItem>
            <FormItem label="取消费(元)：">
              {{cancelModelData.money}}
            </FormItem>
          </div>
          <FormItem label="生效时间：">
            {{cancelModelData.effectiveTime}}
          </FormItem>
          <div v-if="cancelModelData.typeTime===1">
            <FormItem label="接单后免费取消时间：">
              {{cancelModelData.freeCancleMinute}} 分钟
            </FormItem>
            <FormItem label="接单后超时取消时间：">
              {{cancelModelData.outCancleMinute}} 分钟
            </FormItem>
            <FormItem label="连续取消次数限制：">
              {{cancelModelData.continuedCancelLimit?'启用':'未启用'}}
            </FormItem>
            <div class="form-in-line" v-if="cancelModelData.continuedCancelLimit">
              在 {{cancelModelData.continuedCancelMinute}} 分钟内连续主动取消 {{cancelModelData.continuedCancelNum}} 次任意订单，禁止下单 {{cancelModelData.continuedCancelNoMinute}} 分钟
            </div>
          </div>
          <div v-else>
            <FormItem label="无责取消时间：">
              {{cancelModelData.noResponseCancelMinute}} 分钟
            </FormItem>
            <FormItem label="司机可迟到时间：">
              {{cancelModelData.driverLaterMinute}} 分钟
            </FormItem>
          </div>
          <div>
            <FormItem label="每日取消次数限制：">
              {{cancelModelData.dailyCancelLimit ? '启用':'未启用'}}
            </FormItem>
            <div class="form-in-line" v-if="cancelModelData.dailyCancelLimit && cancelModelData.typeTime===1">
              每自然日在接单后 {{cancelModelData.dailyCancelMinute}} 分钟内主动取消 {{cancelModelData.dailyCancelNum}} 次实时单，{{cancelModelData.dailyCancelNoMinute}} 分钟内禁止下单
            </div>
            <div class="form-in-line" v-if="cancelModelData.dailyCancelLimit && cancelModelData.typeTime===2">
              每自然日内主动取消 {{cancelModelData.dailyCancelNum}}  次预约单，{{cancelModelData.dailyCancelNoMinute}} 分钟内禁止下单
            </div>
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="cancelDetailModal=false">确定</Button>
      </div>
    </modal>
    <!-- 偏离警报策略详情 -->
    <modal v-model="deviateDetailModal" class="detail-modal" title="偏离报警策略详情" :width="600" :mask-closable="false">
      <Form :model="deviateModelData" :label-width="140">
        <FormItem label="策略名称：">
          {{deviateModelData.strategyName}}
        </FormItem>
        <FormItem label="适用城市：">
          {{deviateModelData.cityName}}
        </FormItem>
        <FormItem label="业务线：">
          {{serviceTypeMap[deviateModelData.serviceType]}}
        </FormItem>
        <FormItem label="生效时间：">
          {{deviateModelData.effectiveTime}}
        </FormItem>
        <FormItem label="偏离时限(分钟)：">
          {{deviateModelData.divergeTime}}
        </FormItem>
        <FormItem label="偏离次数：">
          {{deviateModelData.divergeNum}}
        </FormItem>
        <FormItem label="偏离里程占比：">
          {{deviateModelData.divergePercent}}%
        </FormItem>
        <FormItem label="备注：">
          {{deviateModelData.remark}}
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="deviateDetailModal=false;">确定</Button>
      </div>
    </modal>
    <!-- 时间段及高峰策略 -->
    <modal v-model="timeDetailModal" class="detail-modal" title="时间段及高峰策略详情" :width="600" :mask-closable="false">
      <Form :model="timeModelData" :label-width="140">
        <FormItem label="策略名称：" prop="strategyName">
          {{timeModelData.strategyName}}
        </FormItem>
        <FormItem label="适用城市：" prop="city">
          {{timeModelData.cityName}}
        </FormItem>
        <FormItem label="生效时间：" prop="effectiveTime">
          {{timeModelData.effectiveTime}}
        </FormItem>
        <div class="inline-form-item">
          <FormItem label="夜间服务时段：">
            {{timeModelData.nightServiceBeginTime}}<span>至</span>{{timeModelData.nightServiceEndTime}}
          </FormItem>
        </div>
        <div class="inline-form-item">
          <FormItem label="早高峰时段：">
            {{timeModelData.morningPeakBeginTime}}<span>至</span>{{timeModelData.morningPeakEndTime}}
          </FormItem>
        </div>
        <div class="inline-form-item">
          <FormItem label="晚高峰时段：">
            {{timeModelData.eveningPeakBeginTime}}<span>至</span>{{timeModelData.eveningPeakEndTime}}
          </FormItem>
        </div>
        <div class="inline-form-item">
          <FormItem label="其他高峰时段：">
            {{timeModelData.otherPeakBeginTime}}<span>至</span>{{timeModelData.otherPeakEndTime}}
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="timeDetailModal=false">确定</Button>
      </div>
    </modal>
  </div>
</template>

<script>
import searchTable from "./components/search-table.vue";
import { homeData,validTimeRange,validNowTime,integerValidate,serviceTypeMap,cityObj } from "./components/fields";
import { timeFormat } from "@/libs/util";
import { getWholeRegion } from "@/api/common";
import { cpTranslate } from "@/libs/tools";
import holidayDate from "_a/holiday-date/holiday-date";
import {
  axiosCancelStrategySave,
  axiosAlarmStrategySave,
  axiosTimeStrategySave,
  axiosCancelStrategyUpdate,
  axiosAlarmStrategyUpdate,
  axiosTimeStrategyUpdate,
  axiosCancelStrategyInfo,
  axiosAlarmStrategyInfo,
  axiosTimeStrategyInfo,
  axiosAlarmStrategyDelete,
  axiosTimeStrategyDelete
} from "@/api/configData.js";
import { getProvinceCityList } from "@/api/common.js";

export default {
  name: "agreementControl",
  components: {
    holidayDate,
    searchTable
  },
  data() {
    return {
      ...homeData, //tab
      serviceTypeMap,
      cancelModal: false, //新建取消策略
      deviateModal: false, //新建偏离报警策略
      timeModal: false, //新建时间段策略
      detailModalTitle: '',
      detailModal: false,
      detailObj: {},
      dateOptions: {}, //时间选择器禁用'
      isCancelEdit: false,
      isDeviateEdit: false,
      isTimeEdit: false,
      cancelDetailModal: false,
      deviateDetailModal: false,
      timeDetailModal: false,
      provinceCityList: [],
      cancelTitle: '新建取消策略',
      deviateTitle: '新建偏离报警策略',
      timeTitle: '新建时间段及高峰策略'
    }
  },
  mounted() {
    this.setDisabedTime();
    this.getCityList()
  },
  methods: {
    addNew(type){
      if(type==='1'){
        this.cancelTitle = '新建取消策略';
        this.cancelModal=true;
        this.isCancelEdit=false;
        // this.handleReset('cancelForm')
        this.cancelModelData = {
          typeTime: null,//订单类型
          strategyName: "", //策略名称
          city: [], // 适用城市
          money: null,//取消费
          effectiveTime: "",
          freeCancleMinute: null,//接单后免费取消时间
          outCancleMinute: null,//接单后超时取消时间
          continuedCancelLimit: false,//连续取消次数限制
          dailyCancelLimit: false,//每日取消次数限制
          continuedCancelMinute: null,//连续取消次数限制-几分钟内
          continuedCancelNum: null,//连续取消次数限制-主动取消次数
          continuedCancelNoMinute: null,//连续取消次数限制-禁止下单分钟
          dailyCancelMinute: null,//每日取消次数限制-几分钟内
          dailyCancelNum: null,//每日取消次数限制-主动取消次数
          dailyCancelNoMinute: null,//每日取消次数限制-禁止下单分钟
          noResponseCancelMinute: null,//无责取消时间
          driverLaterMinute: null,//司机可迟到时间
        }
      }else if(type==='2'){
        this.deviateTitle = '新建偏离报警策略';
        this.deviateModal=true;
        this.isDeviateEdit=false
        this.handleReset('deviateForm')
      }else{
        this.timeTitle = '新建时间段及高峰策略'
        this.timeModal=true;
        this.isTimeEdit=false;
        this.handleReset('timeForm')
      }
    },
    // 获取城市列表
    getCityList() {
      cityObj.cascaderList.splice( 0, cityObj.cascaderList.length );
      // 优先从local中获取数据
      let cityList = localStorage.getItem("codeProvinceCityList");
      if (cityList) {
        let list = JSON.parse(cityList)
        list.forEach(item => {
          item.children.unshift({
            label: "全部",
            value: ""
          });
        });
        cityObj.cascaderList.push(...list);
        this.provinceCityList = JSON.parse(cityList)
        return false;
      }
      getWholeRegion({}).then(res => {
        if (res.data.success) {
          let list = cpTranslate(res.data.data, "", "", "citys");
          let listCopy = JSON.parse(JSON.stringify(list))
          list.forEach(item => {
            item.children.unshift({
              label: "全部",
              value: ""
            });
          });
          cityObj.cascaderList.push(...list);
          this.provinceCityList = listCopy
          // 因列表获取数据较多且不会变动，存入本地
          localStorage.setItem("codeProvinceCityList", JSON.stringify(listCopy));
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    // 取消策略-新增-金额-保留小数点后两位
    judgeMoney(){
      let money = this.cancelModelData.money
      let small = money.toString().split('.')[1]
      if(small&&small.length>1){
        this.$set(this.cancelModelData,'money',Number(money.toFixed(1)))
      }
    },
    // 今天之前的时间禁用
    setDisabedTime() {
      let nowDate = new Date();
      let nowY = nowDate.getFullYear();
      let nowM = nowDate.getMonth() + 1;
      let nowD = nowDate.getDate();
      this.dateOptions = {
        disabledDate(date) {
          let yy = date.getFullYear();
          let mm = date.getMonth() + 1;
          let dd = date.getDate();
          return (
            yy < nowY ||
            (yy === nowY && mm < nowM) ||
            (yy === nowY && mm === nowM && dd < nowD)
          );
        }
      };
    },
    // 取消策略-新增-编辑-提交
    cancelSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = {...this.cancelModelData}
          if(!this.isCancelEdit){
            params.cityCode = params.city[1]
            delete params.city
          }
          params.effectiveTime = timeFormat(new Date(params.effectiveTime).getTime(), "yyyy-mm-dd")
          // 可选项
          if(!params.continuedCancelLimit){
            delete params.continuedCancelMinute
            delete params.continuedCancelNum
            delete params.continuedCancelNoMinute
          }
          if(!params.dailyCancelLimit){
            delete params.dailyCancelMinute
            delete params.dailyCancelNum
            delete params.dailyCancelNoMinute
          }
          let axiosFun = this.isCancelEdit?axiosCancelStrategyUpdate:axiosCancelStrategySave
          
          axiosFun(params).then(res => {
            if(res.data.success){
              this.cancelModal = false;
              // this.handleReset(name);
              this.$refs.cancelTable.judgeGetList(false,true);
              this.$Message.success(res.data.msg||'保存成功')
            }else{
              this.$Message.error(res.data.msg||'操作失败')
            }
          });
        }
      });
    },
    // 偏离警告策略-新增-编辑-提交
    deviateSubmit() {
      this.$refs.deviateForm.validate(valid => {
        if (valid) {
          let params = {...this.deviateModelData}
          if(!this.isDeviateEdit){
            params.cityCode = params.city[1]
            delete params.city
          }
          params.effectiveTime = timeFormat(new Date(params.effectiveTime).getTime(), "yyyy-mm-dd")

          let axiosFun = this.isDeviateEdit?axiosAlarmStrategyUpdate:axiosAlarmStrategySave

          axiosFun(params).then(res => {
            if(res.data.success){
              this.deviateModal = false;
              this.handleReset('deviateForm');
              console.log(13)
              this.$refs.deviateTable.judgeGetList(false,true);
              this.$Message.success(res.data.msg||'保存成功')
            }else{
              this.$Message.error(res.data.msg||'操作失败')
            }
          });
        }
      });
    },
    // 时间段及高峰-新增-提交
    timeSubmit() {
      this.$refs.timeForm.validate(valid => {
        if (valid) {
          let params = {...this.timeModelData}
          if(!this.isTimeEdit){
            params.cityCode = params.city[1]
            delete params.city
          }
          params.effectiveTime = timeFormat(new Date(params.effectiveTime).getTime(), "yyyy-mm-dd")

          let axiosFun = this.isDeviateEdit?axiosTimeStrategyUpdate:axiosTimeStrategySave

          axiosFun(params).then(res => {
            if(res.data.success){
              this.timeModal = false;
              this.handleReset('timeForm');
              this.$refs.timeTable.judgeGetList(false,true);
              this.$Message.success(res.data.msg||'保存成功')
            }else{
              this.$Message.error(res.data.msg||'操作失败')
            }
          }); 
        }
      });
    },
    // 取消新增
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    tabschange(name){
      this.tabObj.tabNamePone = name
    },
    // 详情
    axiosDetail(obj){
      let that = this
      let uuid = obj.uuid
      let type = obj.type
      let isEdit = obj.isEdit
      let params = {
        uuid:uuid
      }
      if(type==='1'){
        this.cancelTitle = '编辑取消策略';
        this.cancelDetail(params,isEdit)
      }else if(type==='2'){
        this.deviateTitle = '编辑偏离报警策略';
        this.alarmDetail(params,isEdit)
      }else if(type==='3'){
        this.timeTitle = '编辑时间段及高峰策略'
        this.timeDetail(params,isEdit)
      }
    },
    cancelDetail(params,isEdit){
      axiosCancelStrategyInfo(params).then(res => {
        if(res.data.success){
          this.cancelModelData = res.data.data||{}
          if(isEdit){
            this.isCancelEdit = true
            this.cancelModal = true
          }else{
            this.cancelDetailModal = true
          }
        }else{
          this.$Message.error(res.data.msg||'请求策略详情出错')
        }
      });
    },
    alarmDetail(params,isEdit){
      axiosAlarmStrategyInfo(params).then(res => {
        if(res.data.success){
          this.deviateModelData = res.data.data||{}
          if(isEdit){
            this.isDeviateEdit = true
            this.deviateModal = true
          }else{
            this.deviateDetailModal = true
          }
        }else{
          this.$Message.error(res.data.msg||'请求策略详情出错')
        }
      });
    },
    timeDetail(params,isEdit){
      axiosTimeStrategyInfo(params).then(res => {
        if(res.data.success){
          this.timeModelData = res.data.data||{}
          if(isEdit){
            this.isTimeEdit = true
            this.timeModal = true
          }else{
            this.timeDetailModal = true
          }
        }else{
          this.$Message.error(res.data.msg||'请求策略详情出错')
        }
      });
    },
    axiosDelete(obj){
      this.$Modal.confirm({
        title: '确认删除该策略？',
        onOk: () => {
          let axiosDeleteFun = obj.type==='2'?axiosAlarmStrategyDelete:axiosTimeStrategyDelete
          let resName = obj.type==='2'? 'deviateTable':'timeTable'
          axiosDeleteFun({uuid: obj.uuid}).then(res => {
            if(res.data.success){
              this.$refs[resName].judgeGetList(false,true);
              this.$Message.success(res.data.msg||'删除成功')
            }else{
              this.$Message.error(res.data.msg||'操作失败')
            }
          });
        }
      });
      
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .ivu-input-number-input-wrap input{
  vertical-align: top
}
.inline-form-item{
  /deep/ .ivu-form-item{
    display: inline-block;
  }
  span{
    display: inline-block;
    margin: 0 8px;
  }
}
.no-left-margin{
  /deep/ .ivu-form-item-content{
    margin-left:0 !important;
  }
}
.detail-modal{
  /deep/ .ivu-form-item{
    margin-bottom:10px;
  }
  /deep/ .ivu-form-item-label{
    color:#333;
  }
  .form-in-line{
    padding-left: 145px;
  }
}
.twoinline{
  display: flex;
  /deep/ .ivu-form-item{
    width:50%;
  }
}
.form-in-line{
  line-height: 32px;
  padding-left: 25px;
  /deep/ .ivu-form-item{
    display: inline-block;
    .ivu-form-item-label{
      width:auto !important;
    }
    .ivu-form-item-content{
      margin-left: 0px !important;
    }
    &.left36 .ivu-form-item-content{
      margin-left: 36px !important;
    }
    &.left120 .ivu-form-item-content{
      margin-left: 120px !important;
    }
  }
}
</style>
