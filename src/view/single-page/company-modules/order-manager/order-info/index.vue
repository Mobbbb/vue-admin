<template>
  <div class="dispatchcar">
    <div class="searchlist">
      <SearchList :inputList="inputList" @on-search="search" @on-reset="reset"></SearchList>
    </div>
    <div class="searchBtn">
      <Button type="primary" @click="addNewOrder">新增订单</Button>
    </div>
    <VTable
      :total="tabelData.total"
      :current="tabelData.current"
      :pageSize="tabelData.pageSize"
      :isLoading="tabelData.isLoading"
      :parColumns="tabelData.parColumns"
      :parTableData="tabelData.tableDataCom"
      @changePage="changePage"
      @changePageSize="changePageSize"
      class="top20"
    ></VTable>
    <modal
      v-model="mapStatus"
      title="出发地选择"
      :mask-closable="false"
      :width="800"
      class="dispatchmodal"
    >
      <div class="mapArea">
        <el-amap
          vid="amapcode"
          :zoom="zoom"
          class="amapStyle"
          :zooms="[4,16]"
          :center="center"
          :events="events"
          ref="map"
          style="height: 500px;"
        ></el-amap>
        <div class="positionSearch">
          <el-amap-search-box
            class="search-box"
            :search-option="searchOption"
            :on-search-result="onSearchResult"
            ref="searchBox"
          ></el-amap-search-box>
        </div>
        <div class="currentchoice">当前选择位置：{{mapAdress || '暂无'}}</div>
      </div>
    </modal>
    <modal
      v-model="newMobel"
      title="新增订单"
      :mask-closable="false"
      :width="836"
      class="dispatchmodal"
    >
      <div class="ordedetail">
        <Form :model="csmModalData" ref="csmForm" :rules="csmRules" :label-width="120">
          <FormItem label="下单人：" prop="passengerUuid" class="postionreal">
            <!-- <multiSselect
              :url="companyUrl"
              query="phone"
              data-key="employeeId"
              data-label="name"
              @on-success="getcompany"
              :width="200"
              :titlefront="titlefront"
              ref="muselect"
            ></multiSselect> -->
            <!-- :remote-method='' -->
            <Select
            v-model="csmModalData.passengerUuid" 
            remote
            placeholder="请输入手机号"
            label-in-value
            @on-change='getcompany'
            @on-query-change='queryPassenger'
            style="width: 200px"
            filterable>
                <Option v-for="(item, i) in allOrderUser" :value="item.employeeId" :key="i">{{ item.phone }}</Option>
            </Select>
          </FormItem>
          <div class="adduseing">
            <Button type="primary" long @click="addUsingPerson">添加乘车人</Button>
          </div>
          <div class="useingblock" v-for="(item, index) in csmModalData.useingData" :key="index">
            <div class="closeBtn" @click="deletUseingItem(index)">
              <Icon type="md-close" size="20"/>
            </div>
            <FormItem label="乘车人姓名：">
              <Input v-model="item.name" placeholder="请输入乘车人姓名" style="width: 200px" clearable/>
            </FormItem>
            <FormItem
              label="乘车人手机号："
              :class="['ivu-form-item-required', 'afterblock', item.haserror? 'ivu-form-item-error': '']"
            >
              <Input
                v-model="item.mobile"
                placeholder="请输入乘车人手机号"
                style="width: 200px"
                :maxlength="11"
                clearable
                @on-change="invalidMobile(index)"
                @on-clear="invalidContClear(index)"
              />
              <div class="ivu-form-item-error-tip" v-if="item.haserror">乘车人手机号不能为空</div>
            </FormItem>
          </div>
          <FormItem label="出发地：" prop="origimdestination">
            <div class="origindest">
              <Input
                v-model="csmModalData.origimdestination"
                style="width: 0px;height: 0px;padding: 0;"
                class="noinput"
              />
              <div class="mapchoice">
                <p>{{origindestinationData.mapAdress}}</p>
                <p class="mapchoicetitle" @click="mapChoice('origin')">地图选择</p>
              </div>
            </div>
          </FormItem>
          <div class="adduseing">
            <Button type="primary" long @click="addPassPoints">添加途径点</Button>
          </div>
          <FormItem
            v-for="(item, index) in passpointsList"
            :key="'key'+index"
            :label="'途径点' + (index+1)+ '：'"
          >
            <div class="origindest">
              <Input v-model="item.address" style="width: 0;height: 0" class="noinput"/>
              <div class="mapchoice">
                <p>{{item.address}}</p>
                <p class="mapchoicetitle" @click="mapChoice('passingpoints', index)">地图选择</p>
              </div>
              <div class="deletePassing" @click="deleteBtn(index)">
                <Icon type="ios-close" size="24"/>
              </div>
            </div>
          </FormItem>
          <FormItem label="目的地：" prop="destination">
            <div class="origindest">
              <Input
                v-model="csmModalData.destination"
                style="width: 0px;height: 0px;padding: 0;"
                class="noinput"
              />
              <div class="mapchoice">
                <p>{{destinationData.mapAdress}}</p>
                <p class="mapchoicetitle" @click="mapChoice('destination')">地图选择</p>
              </div>
            </div>
          </FormItem>
          <FormItem label="订单类型：" prop="orderType">
            <Select
              v-model="csmModalData.orderType"
              clearable
              style="width:200px"
              @on-change="dispatchChange"
            >
              <Option
                v-for="item in orderTypeList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="预计用车时间：" prop="useCarTime" v-if="csmModalData.orderType == 2">
            <DatePicker
              type="datetime"
              placeholder="选择预约用车时间"
              style="width: 200px"
              format="yyyy-MM-dd HH:mm"
              v-model="csmModalData.useCarTime"
              clearable
            ></DatePicker>
          </FormItem>
          <FormItem label="派单方式：" prop="dispatchingType">
            <Select v-model="csmModalData.dispatchingType" clearable style="width:200px">
              <Option
                v-for="item in dispatchList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="车辆类型：" prop="bussinesType" v-if="csmModalData.dispatchingType == 0">
            <Select v-model="csmModalData.businessType" clearable style="width:200px">
              <Option
                v-for="item in bussineTypeList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div class="ordedetail driverchoose" v-if="csmModalData.dispatchingType == 1">
        <div class="titles">选择司机</div>
        <SearchList :inputList="modalSearchList" @on-search="search" @on-reset="reset"></SearchList>
        <div class="tabelmstyles">
          <VTable
            :total="modalData.total"
            :current="modalData.current"
            :pageSize="modalData.pageSize"
            :isLoading="modalData.isLoading"
            :parColumns="modalData.parColumns"
            :parTableData="modalData.tableDataCom"
            @changePage="changeModalPage"
            @changePageSize="changeModalPageSize"
            @rowClickHandle="getitemData"
            class="top20"
          ></VTable>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" @click="newMobel = false">取消</Button>
        <Button type="primary" @click="asyncOK">确认</Button>
      </div>
    </modal>
  </div>
</template>
<script>
import { returnFields, inputList, modalSearchList, columns } from "./fields.js";
import { debug } from "util";
import {
  getOrderList,
  orderInsert,
  orderChooseDriver,
  orderQueryUser
} from "@/api/enterpriseVehicle.js";
import {vagueCommonHandle} from '@/api/common.js';
import multiSselect from "_a/multi-select/multi-select";
import { constants } from "crypto";
export default {
  components: {
    multiSselect
  },
  data() {
    const self = this;
    const passengerUuid = (rule, value, callback) => {
      if (this.csmModalData.passengerUuid) {
        callback();
      } else {
        callback(new Error("下单人不能为空"));
      }
    };
    const origimdestination = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("出发地不能为空"));
      }
    };
    const destination = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("目的地不能为空"));
      }
    };
    const orderType = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("订单类型不能为空"));
      }
    };
    const useCarTime = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("预约用车时间不能为空"));
      }
    };
    const dispatchingType = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("派单方式不能为空"));
      }
    };
    const bussinesType = (rule, value, callback) => {
      if (this.csmModalData.businessType) {
        callback();
      } else {
        callback(new Error("车辆类型不能为空"));
      }
    };
    return {
      allOrderUser: [],
      orderUser: '',
      bussineTypeList: [
        {
          label: "专车",
          value: 2
        },
        {
          label: "快车",
          value: 4
        }
      ],
      inputList: [],
      searchParams: {},
      tabelData: {
        total: 0,
        current: 1,
        pageSize: 10,
        isLoading: false,
        parColumns: [],
        tableDataCom: []
      },
      newMobel: false,
      madalParams: {},
      modalData: {
        total: 0,
        current: 1,
        pageSize: 10,
        isLoading: false,
        parColumns: [],
        tableDataCom: []
      },
      modalSearchList,
      csmModalData: {
        passengerUuid: "",
        useingData: [
          {
            name: "",
            mobile: "",
            haserror: false
          }
        ],
        origimdestination: "",
        destination: "",
        orderType: "",
        useCarTime: "",
        dsipatchingType: "",
        passengerUuid: "",
        passengerName: "",
        passengerPhone: ""
      },
      csmRules: {
        passengerUuid: [
          {
            required: true,
            trigger: "change",
            message: '必填'
          }
        ],
        name: [
          {
            required: false,
            trigger: "change",
            message: "乘车人姓名不能为空"
          }
        ],
        mobile: [
          {
            required: false,
            trigger: "change",
            validator: "mobile"
          }
        ],
        origimdestination: [
          {
            required: true,
            trigger: "change",
            validator: origimdestination
          }
        ],
        destination: [
          {
            required: true,
            trigger: "change",
            validator: destination
          }
        ],
        orderType: [
          {
            required: true,
            trigger: "change",
            validator: orderType
          }
        ],
        useCarTime: [
          {
            required: true,
            trigger: "change",
            validator: useCarTime
          }
        ],
        bussinesType: [
          {
            required: true,
            trigger: "change",
            validator: bussinesType
          }
        ],
        dispatchingType: [
          {
            required: true,
            trigger: "change",
            validator: dispatchingType
          }
        ]
      },
      orderTypeList: [
        {
          label: "实时",
          value: 1
        },
        {
          label: "预约",
          value: 2
        }
      ],
      dispatchList: [
        {
          label: "自动派单",
          value: "0"
        },
        {
          label: "指定司机",
          value: 1
        }
      ],
      mapAdress: "",
      destinationData: {
        mapAdress: "",
        lnglat: []
      },
      origindestinationData: {
        mapAdress: "",
        lnglat: []
      },
      geocoder: null, //高德地图转化对象初始化
      zoom: 4, // 地图显示级别//全国范围
      myMap: null, // 初始化地图对象
      autoTips: null, //初始化地图地点搜索对象
      driving: null, // 路线对象
      center: [31.916035, 118.821222],
      events: {
        init(o) {
          //初始化地图对象
          self.myMap = self.$refs.map.$$getInstance();
        }
      },
      mapStatus: false,
      markerObj: null,
      addressname: "",
      searchOption: {
        // 地图搜索表单限制
        city: "",
        citylimit: true
      },
      markers: [], //无用点集合
      mapchoicetitle: "",
      passIndex: "", //记录途径点选择序号
      passpointsList: [
        // 途径点集合
        {
          lnglat: [],
          address: ""
        }
      ],
      addNewOrderData: {},
      companyUrl: "/admin/company/order/queryUser",
      titlefront: "",
      planTripADuration: {}
    };
  },
  created() {
    this.inputList = JSON.parse(JSON.stringify(inputList));
    this.modalData.parColumns = JSON.parse(JSON.stringify(columns));
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.tabelData.parColumns.push(value);
    });
    let newArray = [];
    for (let i = 0; i < 50; i++) {
      let NewJson = {};
      let currentnum = 50 + i;
      NewJson["label"] = "4." + currentnum + "以上";
      NewJson["value"] = i + 1;
      newArray.push(NewJson);
    }
    this.modalSearchList[3].dropList = newArray;
    if (this.modalSearchList[0].cascaderList.length === 0) {
      let operatorList = localStorage.getItem("pcOperatorList") || [];
      JSON.parse(operatorList).forEach(item => {
        this.modalSearchList[0].cascaderList.push(item);
      });
    }
  },
  watch: {
    newMobel: function() {
      this.modalSearchList = JSON.parse(JSON.stringify(modalSearchList));
      if (!this.newMobel) {
        this.csmModalData = {
          passengerUuid: "",
          useingData: [
            {
              name: "",
              mobile: "",
              haserror: false
            }
          ],
          origimdestination: "",
          destination: "",
          orderType: "",
          useCarTime: "",
          dsipatchingType: "",
          passengerName: "",
          passengerPhone: "",
          companyName:"",
          companyUuid:""
        };
        this.driving = null;
        this.passpointsList = [
          // 途径点集合
          {
            lnglat: [],
            address: ""
          }
        ];
        this.planTripADuration = {};
        this.titlefront = "";
      }
    },
    mapStatus: function() {
      if (!this.mapStatus) {
        this.markers.length && this.myMap.remove(this.markers);
        this.markers = [];
        let searchBox = this.$refs.searchBox;
        searchBox.$el.children[0].children[0].value = "";
      }
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    deleteBtn(index) {
      this.passpointsList.splice(index, 1);
    },
    dispatchChange(val) {
      if (val == 1) {
        this.dispatchList = [
          {
            label: "自动派单",
            value: "0"
          }
        ];
      } else {
        this.dispatchList = [
          {
            label: "自动派单",
            value: "0"
          },
          {
            label: "指定司机",
            value: 1
          }
        ];
      }
    },
    getcompany(data) {
        if(data && data.value) {
            let store = {}
            this.allOrderUser.some(item=>{
                if(item.employeeId === data.value) {
                    store = item;
                }
            })
        this.csmModalData.passengerUuid = store.employeeId;
        this.csmModalData.passengerName = store.name;
        this.csmModalData.passengerPhone = store.phone;
        this.csmModalData.companyName = store.enterpriseName;
        this.csmModalData.companyUuid = store.enterpriseId;
        }
    },
    queryPassenger(query) {
        if(query !== '') {
            let params = {
                pageSize: 100,//单选暂不支持分页
                currPage: 1,
                phone:query
            }
            vagueCommonHandle(this.companyUrl,params).then(res=>{
                if(res.data.success){
                    this.allOrderUser = res.data.data.list;
                }
            })
        } else {
            this.allOrderUser = []
            this.csmModalData.passengerUuid = '';
        }
    },
    search(data) {
      if (this.newMobel) {
        this.madalParams = data;
        this.$store.commit("changeLoadingFlag", false);
        this.getDreverList();
      } else {
        this.searchParams = data;
        this.tabelData.current = 1;
        this.getList();
      }
    },
    reset() {
      if (this.newMobel) {
        this.$store.commit("changeLoadingFlag", false);
        this.madalParams = {};
        this.getDreverList();
      } else {
        this.searchParams = {};
        this.tabelData.current = 1;
        this.tabelData.pageSize = 10;
        this.getList();
      }
    },
    changePage(val) {
      this.tabelData.current = val;
      this.getList();
    },
    changePageSize(val) {
      this.tabelData.pageSize = val;
      this.getList();
    },
    changeModalPage(val) {
      this.modalData.current = val;
      this.getDreverList();
    },
    changeModalPageSize(val) {
      this.modalData.pageSize = val;
      this.getDreverList();
    },
    getList() {
      let data = Object.assign(
        {},
        {
          currPage: this.tabelData.current,
          pageSize: this.tabelData.pageSize
        },
        this.searchParams
      );
      getOrderList(data)
        .then(res => {
          this.tabelData.total = res.data.data.totalCount;
          this.tabelData.tableDataCom = res.data.data.list;
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch(err => {
          this.tabelData.total = 0;
          this.tabelData.tableDataCom = [];
          this.$store.commit("changeLoadingFlag", false);
        });
    },
    asyncOK() {
      this.$refs.csmForm.validate().then(res => {
        if (res) {
          let newJson = {};
          let newArray = [];
          let passingArray = [];
          this.csmModalData.useingData.forEach(item => {
            let innerJson = {};
            innerJson["mobile"] = item.mobile;
            innerJson["name"] = item.name;
            innerJson["type"] = 1;
            newArray.push(innerJson);
          });
          this.passpointsList.forEach((item, index) => {
            let innerJson = {};
            innerJson["addressDetail"] = item.address;
            innerJson["address"] = item.township;
            innerJson["lon"] = item.lnglat[0];
            innerJson["lat"] = item.lnglat[1];
            innerJson["sort"] = index + 1;
            passingArray.push(innerJson);
          });
          newJson["applyRiderDto"] = {
            applyPassengerDtos: newArray
          };
          newJson["applyWayPointList"] = passingArray;
          newJson["departTime"] = new Date(
            this.csmModalData.useCarTime
          ).getTime();
          newJson["ordAndDestPoint"] = {
            destAddress: this.destinationData.township,
            destAddressDetail: this.destinationData.mapAdress,
            destLat: this.destinationData.lnglat[1],
            destLon: this.destinationData.lnglat[0],
            destCode: this.destinationData.areaCode,
            orgAddress: this.origindestinationData.township,
            orgAddressDetail: this.origindestinationData.mapAdress,
            orgLat: this.origindestinationData.lnglat[1],
            orgLon: this.origindestinationData.lnglat[0],
            orgCode: this.origindestinationData.areaCode
          };
          newJson["toNotice"] = 4;
          newJson["typeTime"] = this.csmModalData.orderType;
          newJson["mode"] = this.csmModalData.dsipatchingType;
          newJson["driverUuid"] = this.addNewOrderData.driverUuid;
          newJson["passengerUuid"] = this.csmModalData.passengerUuid;
          newJson["passengerName"] = this.csmModalData.passengerName;
          newJson["passengerPhone"] = this.csmModalData.passengerPhone;
          newJson["companyName"] = this.csmModalData.companyName;
          if (this.csmModalData.dispatchingType == 0) {
            newJson["applyBusinessDtos"] = [
              {
                businessCarNum: 1,
                businessType: this.csmModalData.businessType
              }
            ];
          } else {
            newJson["applyBusinessDtos"] = [
              {
                businessCarNum: 1,
                businessType: this.addNewOrderData.businessType
              }
            ];
          }
          if (this.csmModalData.orderType == 1) {
            newJson["departTime"] = new Date().getTime();
          }
          newJson["businessType"] =
            this.csmModalData.businessType || this.addNewOrderData.businessType;
          this.getPlanTripDuration(newJson);
        }
      });
    },
    getPlanTripDuration(newJson) {
      let that = this;
      let passingArray = [];
      if (!this.driving) {
        this.driving = new AMap.Driving({
          map: that.myMap
        });
      }
      if (this.passpointsList.length) {
        this.passpointsList.forEach(item => {
          item.lnglat.length && passingArray.push(item.lnglat);
        });
      }
      let self = this;
      this.driving &&this.driving.search(
          this.destinationData.lnglat,
          this.origindestinationData.lnglat,
          {
            waypoints: passingArray
          },
          function(status, result) {
            if (status === "complete") {
              let routes = result.routes[0];
              // that.planTripADuration.planTrip = routes.distance && (routes.distance / 1000) || 0;
              // that.planTripADuration.planDuration = routes.time && (routes.time / 60) || 0;
              newJson["planTrip"] =
                (routes.distance && routes.distance / 1000) || 0;
              newJson["planDuration"] = (routes.time && routes.time / 60) || 0;
              orderInsert(newJson).then(res => {
                that.$Message.success(res.data.msg);
                that.getList();
                that.newMobel = false;
              });
            } else {
            }
          }
        );
    },
    addNewOrder() {
      this.destinationData.mapAdress = "";
      this.destinationData.lnglat = "";
      this.origindestinationData.mapAdress = "";
      this.origindestinationData.lnglat = "";
      this.markerObj && this.myMap.remove(this.markerObj);
      this.markerObj = null;
      this.getDreverList();
      this.newMobel = true;
       this.$refs.csmForm.resetFields();
    },
    getDreverList() {
      let data = Object.assign(
        {},
        {
          currPage: this.modalData.current,
          pageSize: this.modalData.pageSize
        },
        this.madalParams
      );
      orderChooseDriver(data)
        .then(res => {
          this.modalData.total = res.data.data.totalCount;
          this.modalData.tableDataCom = res.data.data.list;
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch(err => {
          this.$store.commit("changeLoadingFlag", false);
        });
    },
    addUsingPerson() {
      // 添加乘车人信息
      if (this.csmModalData.useingData.length >= 1) {
        this.$Message.warning("已达到乘车人添加上限");
        return false;
      }
      this.csmModalData.useingData.push({
        name: "",
        mobile: "",
        haserror: false
      });
    },
    deletUseingItem(index) {
      // 删除乘车人信息块
      this.csmModalData.useingData.splice(index, 1);
    },
    invalidMobile(index) {
      // 乘车人手机号验证状态改变
      if (this.csmModalData.useingData) {
        if (this.csmModalData.useingData[index].mobile) {
          this.csmModalData.useingData[index].haserror = false;
        } else {
          this.csmModalData.useingData[index].haserror = true;
        }
      }
    },
    invalidContClear(index) {
      // 乘车人手机号验证状态
      this.csmModalData.useingData[index].haserror = true;
    },
    mapChoice(typename, index) {
      this.mapStatus = true;
      this.mapchoicetitle = typename;
      this.passIndex = index;
      this.getCurentLocation();
    },
    getCurentLocation() {
      // 获取所在城市、渲染选择点位置以及经纬度转化地理位置
      let that = this;
      let citysearch = new AMap.CitySearch();
      citysearch.getLocalCity(function(status, result) {
        if (status === "complete" && result.info === "OK") {
          if (result && result.city && result.bounds) {
            let cityinfo = result.city;
            let citybounds = result.bounds;
            that.searchOption.city = cityinfo;
            //地图显示当前城市
            that.myMap.setBounds(citybounds);
            if (that.mapchoicetitle == "origin") {
              if (that.markerObj && that.origindestinationData.lnglat.length) {
                that.markerObj.setPosition(that.origindestinationData.lnglat);
              } else {
                that.markerObj && that.myMap.remove(that.markerObj);
                that.markerObj = null;
              }
            }
            if (that.mapchoicetitle == "destination") {
              if (that.markerObj && that.destinationData.lnglat.length) {
                that.markerObj.setPosition(that.destinationData.lnglat);
              } else {
                that.markerObj && that.myMap.remove(that.markerObj);
                that.markerObj = null;
              }
            }
            if (that.mapchoicetitle == "passingpoints") {
              if (
                that.markerObj &&
                that.passpointsList[that.passIndex].lnglat.length
              ) {
                that.markerObj.setPosition(
                  that.passpointsList[that.passIndex].lnglat
                );
              } else {
                that.markerObj && that.myMap.remove(that.markerObj);
                that.markerObj = null;
              }
            }
            that.markerObj && that.myMap.add(that.markerObj);
            that.markerObj && that.myMap.setFitView(that.markerObj);
            that.myMap.on("click", function(e) {
              let lng = e.lnglat.getLng();
              let lat = e.lnglat.getLat();
              if (!that.markerObj) {
                that.markerObj = new AMap.Marker({});
              }
              that.markerObj &&
                that.markerObj.setPosition([
                  e.lnglat.getLng(),
                  e.lnglat.getLat()
                ]);
              // 将创建的点标记添加到已有的地图实例：
              that.markerObj && that.myMap.add(that.markerObj);
              if (!that.geocoder) {
                that.geocoder = new AMap.Geocoder({
                  radius: 1000 //范围，默认：500
                });
              }
              that.geocoder &&
                that.geocoder.getAddress([lng, lat], function(status, result) {
                  if (status === "complete" && result.info === "OK") {
                    let address = result.regeocode.formattedAddress;
                    let addressComponent = result.regeocode.addressComponent;
                    let township =
                      result.regeocode.addressComponent.township +
                      result.regeocode.addressComponent.streetNumber;
                    that.mapAdress = address;
                    if (that.mapchoicetitle == "origin") {
                      that.origindestinationData.mapAdress = address;
                      that.origindestinationData.township = township;
                      that.origindestinationData.lnglat = [lng, lat];
                      that.csmModalData.origimdestination = `${lng},${lat}`;
                      that.origindestinationData.areaCode =
                        addressComponent.adcode;
                    }
                    if (that.mapchoicetitle == "destination") {
                      that.destinationData.mapAdress = address;
                      that.destinationData.township = township;
                      that.destinationData.lnglat = [lng, lat];
                      that.csmModalData.destination = `${lng},${lat}`;
                      that.destinationData.areaCode = addressComponent.adcode;
                    }
                    if (that.mapchoicetitle == "passingpoints") {
                      that.passpointsList[that.passIndex].address = address;
                      that.passpointsList[that.passIndex].township = township;
                      that.passpointsList[that.passIndex].lnglat = [lng, lat];
                    }
                  }
                });
            });
          }
        }
      });
    },
    onSearchResult(pois) {
      this.markers = [];
      if (pois.length) {
        pois.forEach(poi => {
          this.markers.push(
            new AMap.Marker({
              map: this.myMap,
              position: [poi.lng, poi.lat]
            })
          );
        });
        this.markers.length && this.myMap.remove(this.markers);
        this.markers.length && this.myMap.setFitView(this.markers);
        this.markers = [];
      }
    },
    addPassPoints() {
      if (this.passpointsList.length > 2) {
        this.$Message.warning("最多添加三个途径点");
        return false;
      }
      this.passpointsList.push({
        lnglat: [],
        address: ""
      });
    },
    getitemData(data) {
      this.addNewOrderData.driverUuid = data.driverId;
      this.addNewOrderData.businessType = data.businessId;
    }
  }
};
</script>
<style lang="less" scope>
.ordedetail {
  border: 1px solid #f2f2f2;
  padding: 10px;
  letter-spacing: 1px;
  margin-bottom: 10px;
  .adduseing {
    max-width: 200px;
    margin-left: 120px;
    margin-bottom: 10px;
  }
  .useingblock {
    border: 1px solid #f2f2f2;
    width: 340px;
    padding-top: 20px;
    margin-bottom: 20px;
    position: relative;
    .closeBtn {
      cursor: pointer;
      position: absolute;
      right: 2px;
      top: 2px;
      z-index: 999;
      display: none;
    }
    &:hover {
      .closeBtn {
        display: block;
      }
    }
    .afterblock {
      .ivu-form-item-required .ivu-form-item-label:before {
        content: "*";
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 12px;
        color: #ed4014;
      }
    }
  }
  .origindest {
    display: flex;
    align-items: center;
    .noinput {
      position: absolute;
      left: 100%;
      top: 0;
      opacity: 0;
    }
    .mapchoice {
      display: flex;
      align-items: center;
      .mapchoicetitle {
        cursor: pointer;
        color: #0000ff;
        text-decoration: underline;
        margin-left: 30px;
      }
      p:first-child {
        max-width: 300px;
      }
    }
    .deletePassing {
      cursor: pointer;
    }
  }
  .titles {
    font-size: 16px;
    color: #000;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .detailcontent {
    .lists {
      font-size: 14px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      p {
        width: 300px;
        span {
          font-weight: 600;
        }
      }
    }
  }

  .tabelmstyle {
    .ivu-table-overflowX {
      max-height: 200px;
      overflow: scroll;
      &::-webkit-scrollbar {
        //滚动条的宽度
        width: 9px;
        height: 9px;
        border-radius: 4.5px 4.5px;
      }
      &::-webkit-scrollbar-track-piece {
        //滚动条凹槽的颜色，还可以设置边框属性
        background-color: #f8f8f8;
      }
      &::-webkit-scrollbar-thumb {
        //滚动条的设置
        background-color: #dddddd;
        background-clip: padding-box;
        min-height: 28px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background-color: #bbb;
      }
    }
  }
}
.dispatchmodal {
  .mapArea {
    position: relative;
    width: 100%;
    .amapStyle {
      height: 700px;
    }
    .positionSearch {
      box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
      position: absolute;
      left: 10px;
      top: 10px;
    }
    .currentchoice {
      position: absolute;
      left: 10px;
      top: 60px;
      font-size: 14px;
      color: #666;
      text-align: left;
      letter-spacing: 1px;
      background: #fff;
      max-width: 360px;
      padding: 10px;
    }
  }
}
.postionreal {
  position: relative;
  .posionab {
    position: absolute;
    left: -1000px;
  }
}
</style>
