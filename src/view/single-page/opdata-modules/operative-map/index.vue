<template>
  <div>
    <div class="pagetitle">
      <p>车辆分布图</p>
      <p class="closearrow" @click="arrowtoright(true)" v-if="choosecar">关闭详情信息</p>
    </div>
    <div class="maprea">
      <!-- 地图 -->
      <div class="amap-page-container">
        <el-amap
          vid="amapcode"
          :center="center"
          :zoom="zoom"
          class="amap-demo"
          :events="events"
          :zooms="[3, 20]"
          mapStyle="amap://styles/macaron"
          ref="map"
        >
          <el-amap-marker
            v-for="(marker, key) in markers"
            :key="key"
            :position="marker.position"
            :events="marker.events"
            :vid="key"
          ></el-amap-marker>
        </el-amap>
      </div>
      <!-- 右侧车辆信息 -->
      <div :class="[choosecar? 'animation' : '', 'carsmsg']" @click.stop>
        <div class="floatmodal" v-if="!sitePoints">
          <div class="conttitle">
            <div class="title_header">实时信息</div>
          </div>
          <div class="contents">
            <div class="timecontmsg">
              <div class="ennergy">
                <p>剩余能耗</p>
                <p>{{realTimeData.soc || 0 }}%</p>
              </div>
              <div class="ennergy">
                <p>续航里程</p>
                <p>{{ realTimeData.enduranceMileage || 0 }}Km</p>
              </div>
              <div class="ennergy">
                <p>当前车速</p>
                <p>{{realTimeData.speed || 0 }}Km/h</p>
              </div>
            </div>
            <div class="adressplace">
              <Icon type="md-pin" size="18" color="#aaa"/>
              <p>{{realTimeData.address || '暂无'}}</p>
            </div>
          </div>
          <div class="conttitle">
            <div class="title_header">司机信息</div>
            <div class="morethan" @click="toSightDriver(currentCarMsg.driverUuid)">更多</div>
          </div>
          <div class="contents">
            <div class="drivermsg">
              <div class="driver-item bottom15">
                <p>司机姓名</p>
                <p class="hascolor">{{driverMsgData.name || '暂无'}}</p>
              </div>
              <div class="driver-item bottom15">
                <p>司机电话</p>
                <div>
                  <span class="hascolor">{{driverMsgData.mobile || '暂无'}}</span>
                  <Icon type="ios-mail" size="26" class="blue-color" @click="sendMassage(driverMsgData.mobile)"/>
                </div>
              </div>
              <div class="driver-item" v-if="driverMsgData.status===1">
                <p>运营管理</p>
                <p class="blue-color" @click="offlineModal=true;switchTitle='强制下线'">强制下线</p>
              </div>
              <div class="driver-item" v-if="driverMsgData.status===8">
                <p>运营管理</p>
                <p class="blue-color" @click="offlineModal=true;switchTitle='允许上线'">允许上线</p>
              </div>
            </div>
          </div>
          <div class="conttitle">
            <div class="title_header">车辆信息</div>
            <div class="morethan" @click="carOrderlistsight">当日订单</div>
            <div class="morethan" @click="carDetail">更多</div>
          </div>
          <div class="contents">
            <div class="drivermsg">
              <div class="driver-item bottom15">
                <p>车牌号码</p>
                <p class="hascolor">{{carBasicMsg.plateNumber || '暂无'}}</p>
              </div>
              <div class="driver-item bottom15">
                <p>业务类型</p>
                <p class="hascolor">{{ carBasicMsgBType || '暂无'}}</p>
              </div>
              <div class="driver-item bottom15">
                <p>运营商</p>
                <p class="hascolor">{{ driverMsgData.agentName || '暂无'}}</p>
              </div>
              <div class="driver-item bottom15">
                <p>品牌</p>
                <p class="hascolor">{{carBasicMsg.brandName || '暂无'}}</p>
              </div>
              <div class="driver-item bottom15">
                <p>车型名称</p>
                <p class="hascolor">{{carBasicMsg.modelName || '暂无'}}</p>
              </div>
              <div class="driver-item">
                <p>颜色</p>
                <p class="hascolor">{{ carBasicMsg.colour || '暂无'}}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 周边场地信息 -->
        <div class="sitedetail" v-else>
          <div class="msgcontent">
            <p class="msgtitles">周边设施站点信息</p>
            <p class="msgfont">
              <span>设施站点名称：</span>
              <span>{{ siteMsgData.name || '暂无' }}</span>
            </p>
            <p class="msgfont">
              <span>设施站点省：</span>
              <span>{{ siteMsgData.province || '暂无' }}</span>
            </p>
            <p class="msgfont">
              <span>设施站点市：</span>
              <span>{{ siteMsgData.city || '暂无' }}</span>
            </p>
            <p class="msgfont">
              <span>设施站点所在地址：</span>
              <span>{{ siteMsgData.address || '暂无' }}</span>
            </p>
          </div>
        </div>
      </div>
      <!-- 左侧条件查询 -->
      <div class="leftshadow">
        <!-- 城市 -->
        <div class="locationquery borderbottom">
          <div class="selectline disflexstyle">
            <div class="selecttitles">城市</div>
            <Cascader
              :data="citysdata"
              trigger="hover"
              v-model="cityvalue"
              :clearable="false"
              @on-change="chooseCity"
              placeholder="请选择城市"
              style="width:190px"
            ></Cascader>
          </div>
        </div>
        <!-- 车辆 -->
        <div class="locationquery">
          <div class="selectfont">定位查询</div>
          <div class="selectline">
            <div class="selectmargin disflexstyle">
              <div class="selecttitles">运营商</div>
              <Select
                clearable
                v-model="currentChangeData.agentUUID"
                multiple
                style="width:190px"
                placeholder="请选择运营商"
                @on-change="getAgentByoperation"
              >
                <Option
                  v-for="(item, index) in agentList"
                  :value="item.value"
                  :key="item.value + index"
                >{{ item.label }}</Option>
              </Select>
            </div>
            <div class="selectmargin disflexstyle">
              <div class="selecttitles">司管</div>
              <Select
                clearable
                v-model="currentChangeData.driverManagerId"
                multiple
                style="width:190px"
                placeholder="请选择司管"
              >
                <Option
                  v-for="item in driverManagerList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </div>
            <div class="selectmargin disflexstyle">
              <div class="selecttitles">业务线</div>
              <Select
                v-model="currentChangeData.carType"
                style="width:190px"
                multiple
                placeholder="请选择业务线"
                clearable
              >
                <Option
                  v-for="item in businessTypeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </div>
            <div class="selectmargin disflexstyle">
              <div class="selecttitles">运营状态</div>
              <Select
                clearable
                multiple
                v-model="currentChangeData.operationStatus"
                style="width:190px"
                placeholder="请选择车辆运营状态"
              >
                <Option
                  v-for="item in carStatusList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </div>
            <div class="selectmargin disflexstyle">
              <div class="selecttitles">车牌号/手机号</div>
              <Input
                clearable
                placeholder="请输入车牌号或手机号"
                style="width: 190px"
                v-model="currentChangeData.carNoOrMobile"
              />
            </div>
          </div>
          <div class="searchbtn">
            <LoadingButton class="right15" :width="110" btntitle="清空" loadingtitle="清空中..." :loading="isClearloading" @on-click="onSearchBtn(chooseCityMsg,true)"></LoadingButton>
            <LoadingButton type="primary" :loading="isloading" @on-click="onSearchBtn(chooseCityMsg)"></LoadingButton>
          </div>
        </div>
        <!-- 场地 -->
        <div class="locationquery borderbottom">
          <div class="selectline">
            <div class="selectidx">
              <CheckboxGroup
                v-model="othermarkSelect.checkAllGroup"
                @on-change="checkAllGroupChange"
              >
                <div class="sortvcolum">
                  <div class="gropustyle">
                    <Checkbox label="1">
                      <div class="checkboxstyle">
                        <p
                          class="imgstyle"
                          :style="{'border-color': comCheckStatus[1]? '#2d8cf0':''}"
                        >
                          <Icon
                            type="md-battery-charging"
                            size="30"
                            :style="{'color':comCheckStatus[1]?'#2d8cf0': ''}"
                          />
                        </p>
                        <p>充电站</p>
                      </div>
                    </Checkbox>
                  </div>
                  <div class="gropustyle">
                    <Checkbox label="0">
                      <div class="checkboxstyle">
                        <p
                          class="imgstyle"
                          :style="{'border-color': comCheckStatus[0]? '#2d8cf0':''}"
                        >
                          <Icon
                            type="ios-beer"
                            size="30"
                            :style="{'color':comCheckStatus[0]?'#2d8cf0': ''}"
                          />
                        </p>
                        <p>加油站</p>
                      </div>
                    </Checkbox>
                  </div>
                  <div class="gropustyle">
                    <Checkbox label="2">
                      <div class="checkboxstyle">
                        <p
                          class="imgstyle"
                          :style="{'border-color': comCheckStatus[2]? '#2d8cf0':''}"
                        >
                          <Icon
                            type="ios-flame"
                            size="30"
                            :style="{'color':comCheckStatus[2]?'#2d8cf0': ''}"
                          />
                        </p>
                        <p>充气站</p>
                      </div>
                    </Checkbox>
                  </div>
                  <div class="gropustyle">
                    <Checkbox label="4">
                      <div class="checkboxstyle">
                        <p
                          class="imgstyle"
                          :style="{'border-color': comCheckStatus[4]? '#2d8cf0':''}"
                        >
                          <Icon
                            type="md-contacts"
                            size="30"
                            :style="{'color':comCheckStatus[4]?'#2d8cf0': ''}"
                          />
                        </p>
                        <p>司机之家</p>
                      </div>
                    </Checkbox>
                  </div>
                  <div class="gropustyle">
                    <Checkbox label="3">
                      <div class="checkboxstyle">
                        <p
                          class="imgstyle"
                          :style="{'border-color': comCheckStatus[3]? '#2d8cf0':''}"
                        >
                          <Icon
                            type="ios-construct"
                            size="30"
                            :style="{'color':comCheckStatus[3]?'#2d8cf0': ''}"
                          />
                        </p>
                        <p>维修站</p>
                      </div>
                    </Checkbox>
                  </div>
                </div>
              </CheckboxGroup>
            </div>
          </div>
        </div>
        <!-- 电子围栏 -->
        <div class="locationquery">
          <div class="selectfont">电子围栏</div>
          <div class="selectline">
            <div class="selectmargin disflexstyle">
              <div class="selecttitles">围栏类型</div>
              <Select
                :clearable="true"
                v-model="enclosureTypeData.enclosuretype"
                style="width:190px"
                placeholder="请选择围栏类型"
                @on-change="getElefenceList"
              >
                <Option
                  v-for="item in railTypeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </div>
            <div class="selectmargin disflexstyle">
              <div class="selecttitles">选择围栏</div>
              <Select
                :clearable="true"
                multiple
                v-model="enclosureTypeData.enclosureitem"
                style="width:190px"
                placeholder="请选择围栏"
              >
                <Option
                  v-for="item in elefenlist"
                  :value="item.uuid"
                  :key="item.uuid"
                >{{ item.name }}</Option>
              </Select>
            </div>
          </div>
          <div class="searchbtn">
            <Button class="right15" style="width:110px" @click="cllearElefence()">清空</Button>
            <Button type="primary" @click="renderElefence(enclosureTypeData.enclosureitem)" style="width:190px">查询</Button>
          </div>
        </div>
      </div>
      <!-- 地图左上-刷新热力图路况 -->
      <div class="lefttopshadow">
        <div class="btnstyle-shadow animatestyle" @click="refreshMap(true)">
          <Icon
            type="md-sync"
            size="26"
            :class="['animated', isrefresh ?'rotateIn': '']"
            :style="{'color': isrefresh? '#2d8cf0' : ''}"
          />
          <p :style="{'color': isrefresh? '#2d8cf0' : ''}">刷新</p>
        </div>
        <div class="btnstyle-shadow" @click="sightThermogram">
          <Icon
            type="ios-disc-outline"
            size="26"
            :style="{'color': ishowThermogram? '#2d8cf0' : ''}"
          />
          <p :style="{'color': ishowThermogram? '#2d8cf0' : ''}">热力图</p>
        </div>
        <div class="btnstyle-shadow" @click="getTrafficTileLayer">
          <Icon
            type="ios-paper-plane-outline"
            size="26"
            :style="{'color': isVisibleToggle? '#2d8cf0' : ''}"
          />
          <p :style="{'color': isVisibleToggle? '#2d8cf0' : ''}">实时路况</p>
        </div>
      </div>
      <!-- 地图下方，标识解读 -->
      <div class="leftbottomshadow">
        <div class="detailexplain margin_rights">
          <p class="extile">业务线：</p>
          <div class="small-shadow detailexplain">
            <div class="smallbtnstyle backbg_s" @click="carTypeChoice(2)">专车</div>
            <div class="smallbtnstyle backbg_h" @click="carTypeChoice(4)">快车</div>
            <div class="smallbtnstyle backbg_t" @click="carTypeChoice(1)">出租车</div>
          </div>
        </div>
        <div class="detailexplain">
          <p class="extile">运营状态：</p>
          <div class="small-shadow detailexplain">
            <div class="survey">
              <span class="dots dots_s"></span>
              <span>服务中</span>
              <!-- 3 绿色-->
            </div>
            <div class="survey">
              <span class="dots dots_g"></span>
              <span>接乘中</span>
              <!-- 2 蓝色-->
            </div>
            <div class="survey">
              <span class="dots dots_f"></span>
              <span>巡游中</span>
              <!-- 1 红色-->
            </div>
            <div class="survey">
              <span class="dots dots_o"></span>
              <span>下线</span>
              <!-- 0 灰色-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 强制下线 -->
    <Modal :title="switchTitle" v-model="offlineModal" :width="700" class-name="vertical-center-modal">
      <Row>
        <Col span="12">
          <div class="disstyle">
            <p class="sendobj sendtitle">司机ID：</p>
            <div class="sentchoice">{{driverMsgData.driverNo || '暂无'}}</div>
          </div>
        </Col>
        <Col span="12">
          <div class="disstyle">
            <p class="sendobj sendtitle">司机电话：</p>
            <div class="sentchoice">{{driverMsgData.mobile || '暂无'}}</div>
          </div>
        </Col>
      </Row>
      <Row class="bottom15">
        <Col span="12">
          <div class="disstyle">
            <p class="sendobj sendtitle">司机姓名：</p>
            <div class="sentchoice">{{driverMsgData.name || '暂无'}}</div>
          </div>
        </Col>
        <Col span="12">
          <div class="disstyle">
            <p class="sendobj sendtitle">身份证号：</p>
            <div class="sentchoice">{{driverMsgData.idCard || '暂无'}}</div>
          </div>
        </Col>
      </Row>
      
      <div class="messagedistance">
        <p class="sendobj sendtitle"><span class="must-tag">*</span>备注：</p>
        <div class="addmessage">
          <Input
            v-model="offlineRemark"
            type="textarea"
            style="width: 560px;"
            :maxlength="remarklength"
            :rows="4"
            placeholder="请输入备注"
            @on-change="iptevent"
          />
          <span class="iptfontnums">{{offlineRemark.length}}/200</span>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" @click="offlineModal=false;offlineRemark=''">取消</Button>
        <Button type="primary" @click="axiosOffline">确认</Button>
      </div>
    </Modal>
    <!-- 发送短信弹窗 -->
    <Modal title="发送短信" v-model="messagesent" class-name="vertical-center-modal">
      <div class="disstyle">
        <p class="sendobj sendtitle">司机电话：</p>
        <div class="sentchoice">{{driverMsgData.mobile}}</div>
      </div>
      <div class="messagedistance">
        <p class="sendobj sendtitle">短信内容：</p>
        <div class="addmessage">
          <Input
            v-model="addmsg"
            type="textarea"
            style="width: 300px;"
            :maxlength="remarklength"
            :rows="6"
            placeholder="请输入短信内容"
            @on-change="iptevent"
          />
          <span class="iptfontnums">{{iptfontnums}}/200</span>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" @click="cancelMessage">取消</Button>
        <Button type="primary" @click="confirmSave">确认</Button>
      </div>
    </Modal>
    <!-- 当日订单列表弹窗 -->
    <Modal title="当日订单列表" v-model="carslists" :width="1330" class-name="vertical-center-modal">
      <div class="listcontent">
        <div class="listtabel">
          <VTable
            :total="carlistdata.total"
            :current="carlistdata.current"
            :pageSize="carlistdata.pageSize"
            :parColumns="carlistdata.parColumns"
            :parTableData="carlistdata.parTableData"
            :pageSizeOpts="carlistdata.pageSizeOpts"
            :height="carlistdata.height"
            :width="carlistdata.width"
            :isShowPage="false"
            @selectObj="selectObj"
            @changePage="changePage"
            @changePageSize="changePageSize"
            class="top15"
          ></VTable>
        </div>
        <div class="pagegranption"></div>
      </div>
    </Modal>
  </div>
</template>
<script>
import VTable from "_a/v-table/v-table";
import LoadingButton from "_a/loading-button/index";
import { returnFields } from "./fields";
import { mapGetters } from "vuex";
import {
  getSiteList,
  queryCarListByRemote,
  findOneByVin,
  getElefenServiceSelect,
  getAgentByCity,
  getOpmanerByOrgan,
  sendSms,
  getRmoteEdit,
  getCarByVin,
  getDriverDetail,
  getDriverOrderPage,
  axiosForcedOffline,
  axiosAllowOnline
} from "@/api/configData.js";
import { getProvinceCityList } from "@/api/common.js";
import { timeFormat } from "@/libs/util";
import siteImg from "@/assets/images/mapsicon/icons.svg";
import black from "@/assets/images/carstatus/black.png";
import yellow from "@/assets/images/carstatus/yellow.png";
import white from "@/assets/images/carstatus/white.png";
import grayImg from "@/assets/images/carstatus/grayImg.png";
import redImg from "@/assets/images/carstatus/redImg.png";
import blueImg from "@/assets/images/carstatus/blueImg.png";
import greenImg from "@/assets/images/carstatus/greenImg.png";
import { constants } from "crypto";
export default {
  name: "operativeMap",
  components: {
    VTable,
    LoadingButton
  },
  filters: {
    twodecimal(x) {
      var f = parseFloat(x);
      if (isNaN(f)) {
        return false;
      }
      var f = Math.round(x * 100) / 100;
      var s = f.toString();
      var rs = s.indexOf(".");
      if (rs < 0) {
        rs = s.length;
        s += ".";
      }
      while (s.length <= rs + 1) {
        s += "0";
      }
      return s;
    }
  },
  data() {
    let self = this;
    return {
      switchTitle:'强制下线',
      offlineModal: false,//强制下线弹窗
      offlineRemark: '',//强制下线备注
      MarkTime: 0,
      allstatus: "allstatus",
      cityvalue: [],
      cluster: null,
      mmk: [],
      mmkCarData: [],
      othermarkSelect: {
        indeterminate: false,
        checkAll: false,
        checkAllGroup: []
      },
      addmsg: "",
      messagesent: false,
      choosecar: false,
      sitePoints: false, // 站点详情
      carslists: false,
      carlistdata: {
        total: 0,
        current: 1,
        pageSize: 10000,
        height: 350,
        width: 1300,
        parColumns: [],
        parTableData: [],
        pageSizeOpts: [5, 10, 20, 30, 40]
      },
      zoom: 4, // 地图显示级别//全国范围
      center: [116.286278, 34.22237],
      markers: [],
      markerRefs: [],
      myMap: null,
      events: {
        init(o) {
          self.cluster = new AMap.MarkerClusterer(o, self.markerRefs, {
            gridSize: 80
          });
        }
      },
      citysdata: [],
      siteData: {
        onedata: [],
        twodata: [],
        threedata: [],
        fourdata: [],
        fivedata: []
      },
      oldcheckdata: [], // 存储站点站码
      mmkSiteData: [],
      currentChangeData: {
        agentUUID: "", // 运营商id
        driverManagerId: "", // 司管id
        carType: "", // 1：出租车、2：专车、3：跨城拼车、4：快车、5：货的、6：骑手、7：搬家、8：展会
        operationStatus: "", // 0:待运营，1:待绑定，2:运营中，3:维护中，4：退出运营，5：冻结
        carNoOrMobile: "" // 	车牌或电话
      },
      enclosureTypeData: {
        enclosuretype: "",
        enclosureitem: []
      },
      realTimeData: {},
      carBasicMsg: {},
      driverMsgData: {}, //司机信息
      chooseCityMsg: {}, // 选择的城市信息
      remarklength: 200, // 短信发送最大限度长度
      siteMsgData: {}, // 站点信息存贮
      currentRenderSite: [], // 渲染站点点集合
      railTypeList: [
        {
          value: '1',
          label: "运营围栏"
        },
        {
          value: '2',
          label: "流水奖励围栏"
        },
        {
          value: '3',
          label: "营销活动围栏"
        }
      ],
      carStatusList: [
        {
          value: '3',
          label: "服务中"
        },
        {
          value: '2',
          label: "接乘中"
        },
        {
          value: '1',
          label: "巡游中"
        },
        {
          value: '0',
          label: "下线"
        }
      ],
      businessTypeList: [
        {
          value: '2',
          label: "专车"
        },
        {
          value: '4',
          label: "快车"
        },
        {
          value: '1',
          label: "出租车"
        }
      ],
      ishowThermogram: false,
      isrefresh: false,
      district: null,
      currentCarMsg: {}, // 存储当前车辆的信息
      agentList: [], // 运营商列表
      driverManagerList: [], // 司管列表
      elefenlist: [], // 电子围栏列表
      overlays: [], // 电子围栏对象列表
      isVisibleToggle: false,
      trafficLayer: null, // 路况对象
      heatmap: null, //热力图对象,
      polygonVal: "", // 电子围栏uuid存储
      railType: "", // 司管id存储
      isloading: false, // 按钮请求态
      isClearloading: false // 清空按钮请求态
    };
  },
  created() {
    this.getCityList();
    this.getCurentLocation();
  },
  computed: {
    ...mapGetters(["userId"]),
    iptfontnums() {
      return this.addmsg.toString().length > 200
        ? 200
        : this.addmsg.toString().length;
    },
    carBasicMsgBType() {
      let carBasicMsg = this.carBasicMsg;
      switch (carBasicMsg.businessType) {
        case 1:
          return "出租车";
        case 2:
          return "专车";
        case 3:
          return "跨城";
        case 4:
          return "快车";
      }
    },
    fuelType() {
      let carBasicMsg = this.carBasicMsg;
      switch (carBasicMsg.fuelType) {
        case "A":
          return "汽油";
        case "B":
          return "B柴油";
        case "C":
          return "电力";
        case "D":
          return "混合油";
        case "E":
          return "天然气";
        case "F":
          return "液化石油气";
        case "L":
          return "甲醇";
        case "M":
          return "乙醇";
        case "N":
          return "太阳能";
        case "O":
          return "混合动力";
        case "Y":
          return "无";
        case "Z":
          return "其他";
      }
    },
    elefenceClolr(){
      let type = this.enclosureTypeData.enclosuretype
      switch (type) {
        case "1":
          return '#2196f3'
        case "2":
          return '#009688'
        default:
          return '#e91e63'
      }
    },
    comCheckStatus() {
      let checkGroup = JSON.parse(
        JSON.stringify(this.othermarkSelect.checkAllGroup)
      );
      let current = {};
      checkGroup.forEach(item => {
        current[item] = true;
      });
      return current;
    }
  },
  mounted() {
    this.$nextTick(function () {
      let that = this
      document.addEventListener('click',()=>{
        this.arrowtoright()
      })
      let Modals = document.getElementsByClassName('vertical-center-modal')
      for(let val of Modals){
        val.addEventListener('click',(e)=>{
          e.stopPropagation();
        })
      }
    })
  },
  methods: {
    // 强制下线/允许上线
    axiosOffline(){
      // 提交短信发送
      if (!this.offlineRemark) {
        this.$Message.warning("请填写备注内容");
        return false;
      }
      let that = this
      let params = {
        driverUuid: this.driverMsgData.uuid,
        operateRemark: this.offlineRemark
      };
      let axiosFun = this.driverMsgData.status===1?axiosForcedOffline:axiosAllowOnline
      axiosFun(params).then(res => {
        if(res.data.success){
          this.offlineModal = false;
          this.offlineRemark = ''
          this.$Message.success(res.data.msg||'操作成功');
          this.getDriverDetailMsg({driverUuid: that.driverMsgData.uuid})
          this.refreshMap()
        }else{
          this.$Message.success(res.data.msg||'操作失败');
        }
        
      })
    },
    getCurentLocation() {
      let that = this;
      let defaultCityCode = '320100'
      let citysearch = new AMap.CitySearch();
      citysearch.getLocalCity(function(status, result) {
        if (status === "complete" && result.info === "OK") {
          if (result && result.city && result.bounds) {
            let cityinfo = result.city;
            let citybounds = result.bounds;
            //地图显示当前城市
            let cityArray = JSON.parse(JSON.stringify(that.citysdata));
            let city_province = [];
            cityArray.forEach(item => {
              if (item.cityID == defaultCityCode) {
                city_province.push(item.province);
                city_province = [item.provinceID, item.cityID];
              }
            });
            if(city_province.length>0){
              that.cityvalue = city_province;
              that.chooseCity(city_province);
            }else{
              that.cityvalue = []
            }
          }
        }
      });
    },
    // 根据城市获取运营商
    getOptationByCitycode(cityCode) {
      // 根据城市获取运营商
      this.agentList = []; // 切换城市时清空运营商列表，避免无返回依存
      getAgentByCity({ cityCode })
        .then(res => {
          let agentList = res.data.data;
          agentList.forEach(item => {
            item.label = item.name;
            item.value = item.uuid;
          });
          this.agentList = agentList;
        })
        .catch(err => {});
    },
    // 根据运营商获取司管
    getAgentByoperation(agentUuiddata) {
      // 根据运营商获取司管
      if (!agentUuiddata.length) {
        return;
      }
      this.driverManagerList = []; // 切换城市时清空司管列表，避免无返回依存
      getOpmanerByOrgan({ agentUuids: agentUuiddata })
        .then(res => {
          let driverManagerList = res.data.data;
          driverManagerList.forEach(item => {
            item.label = item.realName;
            item.value = item.uuid;
          });
          this.driverManagerList = driverManagerList;
        })
        .catch(err => {});
    },
    // 根据围栏类型获取围栏
    getElefenceList(val,isRefearsh) {
      !isRefearsh && (this.enclosureTypeData.enclosureitem = [])
      if (!val) {
        return;
      }
      let cityCodeData = this.chooseCityMsg;
      this.railType = val;
      getElefenServiceSelect({
        cityCode: cityCodeData.cityID,
        railType: val
      })
        .then(res => {
          let map = this.$refs.map.$$getInstance();
          let polygons = map.getAllOverlays("polygon"); //获取地图上所有得图形区域
          this.elefenlist = res.data.data;
          // this.enclosureTypeData.enclosureitem = "";
          // polygons.length && map.remove(polygons); // 清楚地图上的所有图形区域
          // this.polygons && this.polygons.length && map.add(this.polygons); // 添加行政边界图
          // this.polygons &&
          //   this.polygons.length &&
          //   map.setFitView(this.polygons); //视口自适应
        })
        .catch(err => {});
    },
    // 清除所有电子围栏
    cllearElefence(){
      this.elefenlist = []//清除选择围栏列表
      this.polygonVal = []; // 清除存储的当前选中的围栏图形
      // 清除电子围栏筛选条件
      this.$set(this.enclosureTypeData,'enclosuretype','')
      this.$set(this.enclosureTypeData,'enclosureitem',[])
      // 清除地图电子围栏
      let map = this.$refs.map.$$getInstance();
      let polygons = map.getAllOverlays("polygon"); //获取地图上所有得图形区域
      map.remove(polygons);
      this.polygons && this.polygons.length && map.add(this.polygons); // 添加行政边界图
    },
    // 添加电子围栏
    renderElefence(val) {
      // 渲染电子围栏
      let eleList = JSON.parse(JSON.stringify(this.elefenlist));
      let map = this.$refs.map.$$getInstance();
      let polygons = map.getAllOverlays("polygon"); //获取地图上所有得图形区域
      this.polygonVal = val; // 存储当前选中的围栏图形
      polygons.length && map.remove(polygons); // 清楚地图上的所有图形区域
      this.polygons && this.polygons.length && map.add(this.polygons); // 添加行政边界图
      // 保持当前比例尺
      // this.polygons && this.polygons.length && map.setFitView(this.polygons); //视口自适应
      if(val.length===0){
        return false
      }
      this.overlays = [];
      eleList.forEach(item => {
        if (val.indexOf(item.uuid)>-1) {
          let scopes = item.scope;
          let plioylist = scopes.split("&");
          let polyitem = [];
          let ployitemLngLat = [];
          plioylist.forEach(ele => {
            let lonlat = ele.split(";");
            polyitem.push(lonlat);
          });
          polyitem.forEach(item => {
            let currentArray = [];
            item.forEach(i => {
              currentArray.push(i.split(","));
            });
            this.overlays.push(
              new AMap.Polygon({
                path: currentArray,
                fillColor: this.elefenceClolr,
                strokeColor: this.elefenceClolr,
                strokeWeight: 2,
                strokeOpacity: 0.3,
                fillOpacity: 0.15,
                zIndex: 1
              })
            );
          });
          this.overlays.forEach(item => {
            item.setMap(map);
          });
        }
      });
    },
    // 获取司机详情
    getDriverDetailMsg(data) {
      // 获取司机详情信息
      let that = this;
      getDriverDetail({ driverUuid: data.driverUuid })
        .then(res => {
          that.driverMsgData = (res.data && res.data.data) || {};
        })
        .catch(err => {
          that.driverMsgData = {};
        });
    },
    // 获取车辆基本信息
    getCarByVinMsg(data) {
      // 获取车辆基本信息
      getCarByVin({ otherIndex: data.vin })
        .then(res => {
          this.carBasicMsg = res.data.data || {};
        })
        .catch(err => {
          this.carBasicMsg = {};
        });
    },
    // 获取车辆实时信息
    getfindOneByVinMsg(data) {
      // 获取车辆实时信息
      findOneByVin({ otherIndex: data.vin })
        .then(res => {
          let that = this;
          let realTimeData = res.data.data;
          if (realTimeData.longitude) {
            let geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: "all"
            });
            geocoder.getAddress(
              [realTimeData.longitude, realTimeData.latitude],
              function(status, result) {
                if (status === "complete" && result.info === "OK") {
                  if (result && result.regeocode) {
                    realTimeData["address"] = result.regeocode.formattedAddress;
                    that.realTimeData = realTimeData;
                  }
                }
              }
            );
          } else {
            this.realTimeData = realTimeData;
          }
        })
        .catch(err => {
          this.realTimeData = {};
        });
    },
    // 获取城市列表（已开通）
    getCityList() {
      let data = {};
      const ergodic = arrays => {
        for (let i = 0; i < arrays.length; i++) {
          arrays[i]["label"] = arrays[i].province;
          arrays[i]["value"] = arrays[i].provinceID;
          if (arrays[i].nodes && arrays[i].nodes.length) {
            let currentarray = arrays[i].nodes;
            for (let j = 0; j < currentarray.length; j++) {
              currentarray[j]["label"] = currentarray[j].city;
              currentarray[j]["value"] = currentarray[j].cityID;
            }
            arrays[i]["children"] = arrays[i].nodes;
            delete arrays[i].nodes;
          }
        }
        return arrays;
      };
      let citylistfromlocal = JSON.parse(
        localStorage.getItem("provinceCityList")
      );
      this.citysdata = ergodic(citylistfromlocal);
    },
    // 标记汽车
    renderMarkers(fakeAarry, valcitycode) {
      // 生成点'城市地理位置信息表聚合标记点
      let that = this;
      let map = this.$refs.map.$$getInstance();
      // 0: 下线, 1:  巡游中, 2: 接乘中, 3:  服务中
      // 2：专车， 4： 快车， 1： 出租车
      const setImg = status => {
        switch (status) {
          case 1:
            return yellow;
          case 2:
            return black;
          case 4:
            return white;
        }
      };
      const carStatus = status => {
        switch (status) {
          case 0:
            return grayImg;
          case 1:
            return redImg;
          case 2:
            return blueImg;
          case 3:
            return greenImg;
        }
      };
      if (this.mmkCarData.length > 0) {
        // clear markers
        this.cluster.removeMarkers(this.mmkCarData);
      }
      let mmkCarData = [];
      let currentData = [];
      let latalon = [];
      fakeAarry.forEach(item => {
        let markers = [];
        let { currentLng, currentLat } = item;
        latalon = [currentLng, currentLat];
        markers = new AMap.Marker({
          position: [currentLng, currentLat],
          offset: new AMap.Pixel(-26, -23),
          icon: new AMap.Icon({
            size: new AMap.Size(35, 46), //图标的大小
            image: setImg(item.bussinessId)
          }),
          shadow: new AMap.Icon({
            size: new AMap.Size(35, 46), //图标的大小
            image: carStatus(item.driverStatus)
          }),
          zIndex: 88,
          angle: 0,
          // angle: item.direction,
          extData: item,
          clickable: true
        });
        markers.on("click", function(e) {
          let newData = markers.getExtData();
          that.getCarNodemsg(newData);
          // that.mmkCarData.forEach(item => {
          //   item.setAnimation("AMAP_ANIMATION_NONE");
          // });
          // this.setAnimation("AMAP_ANIMATION_DROP");
          that.sitePoints = false;
          that.choosecar = true;
          that.MarkTime = new Date().getTime()
        });
        currentData.push(markers);
      });
      that.mmkCarData = currentData;
      that.cluster.addMarkers(currentData);
      that.cluster.setMaxZoom(16);
      if (this.currentChangeData && this.currentChangeData.carNoOrMobile) {
        map.panTo(latalon);
      }
    },
    compositeArray(tragetAarry) {
      // 生成下拉列表点聚合标记(加油站，充电桩等)
      let that = this;
      let markers = [];
      let currentData = [];
      let siteData = that.siteData;
      let siteArry = Object.keys(siteData);
      let map = this.$refs.map.$$getInstance() || this.mymap;
      const mapixel = type => {
        switch (type) {
          case 0:
            return new AMap.Pixel(-158, -5); // 加油站
          case 1:
            return new AMap.Pixel(-5, -5); // 充电站
          case 2:
            return new AMap.Pixel(-238, -5); // 充气站
          case 3:
            return new AMap.Pixel(-80, -5); // 维修站
          case 4:
            return new AMap.Pixel(-318, -5); // 司机之家
        }
      };
      const zIndexMap = [19, 20, 18, 16, 17]
      if (this.currentRenderSite.length > 0) {
        // clear markers
        map.remove(this.currentRenderSite);
        this.currentRenderSite = [];
      }
      tragetAarry.forEach(item => {
        let { longitude, latitude, type } = item;
        markers = new AMap.Marker({
          position: [longitude, latitude],
          offset: new AMap.Pixel(-20, -25),
          icon: new AMap.Icon({
            size: new AMap.Size(40, 50), //图标的大小
            image: siteImg,
            imageOffset: mapixel(type)
          }),
          zIndex: zIndexMap[type],
          clickable: true,
          extData: item
        });
        markers.on("click", function(e) {
          that.siteMsgData = this.getExtData();
          // that.mmkSiteData.forEach(item => {
          //   item.setAnimation("AMAP_ANIMATION_NONE");
          // });
          // this.setAnimation("AMAP_ANIMATION_DROP");
          that.sitePoints = true;
          that.choosecar = true;
          that.MarkTime = new Date().getTime()
        });
        currentData.push(markers);
      });
      that.mmkSiteData = that.mmkSiteData.concat(currentData); // 存储Markers点
      that.currentRenderSite = currentData;
      map.add(currentData)
    },
    checkAllGroupChange(data) {
      // 下拉列表每一个checkbox点击事件。以及获取站点信息事件调用
      let that = this;
      let len = data.length;
      let type = data[data.length - 1];
      const getArrDifference = (arr1, arr2) => {
        return arr1.concat(arr2).filter(function(v, i, arr) {
          return arr.indexOf(v) === arr.lastIndexOf(v);
        });
      };
      if (len === 5) {
        this.othermarkSelect.indeterminate = false;
        this.othermarkSelect.checkAll = true;
      } else if (len > 0) {
        this.othermarkSelect.indeterminate = true;
        this.othermarkSelect.checkAll = false;
      } else {
        this.othermarkSelect.indeterminate = false;
        this.othermarkSelect.checkAll = false;
      }
      that.oldcheckdata = data; // 存储选择得站点码
      if (data.length) {
        this.getServiceSitePageList(data);
      } else {
        if (this.currentRenderSite.length > 0) {
          // clear markers
          // this.cluster.removeMarkers(this.currentRenderSite);
          let map = this.$refs.map.$$getInstance();
          map.remove(this.currentRenderSite);
          this.currentRenderSite = [];
        }
      }
    },
    getServiceSitePageList(typeList) {
      // 获取充电桩，加油站等选项站点信息以及点标记
      let that = this;
      getSiteList({ typeList, cityCode: this.chooseCityMsg.cityID })
        .then(res => {
          let resdata = res.data.data;
          that.compositeArray(resdata);
        })
        .catch(err => {});
    },
    getCarNodemsg(data) {
      // 地图上点标记信息集合,获取司机车辆信息集合
      let that = this;
      that.currentCarMsg = data;
      that.getfindOneByVinMsg(data); // 获取实时信息
      that.getDriverDetailMsg(data); // 获取司机信息
      that.getCarByVinMsg(data); // 获取车辆信息
    },
    iptevent(e) {},
    arrowtoright(isClose) {
      if(!this.choosecar){
        return false
      }
      // 因为Marker点击事件中，没有阻止冒泡的功能，方出此下策。
      let Time = new Date().getTime()
      let isBlankClose = Time-this.MarkTime>500?true:false
      if(isClose || isBlankClose){
        // 隐藏车辆信息弹窗
        this.choosecar = false;
        this.mmkSiteData.length &&
          this.mmkSiteData.forEach(item => {
            item.setAnimation("AMAP_ANIMATION_NONE");
          });
        this.mmkCarData.length &&
          this.mmkCarData.forEach(item => {
            item.setAnimation("AMAP_ANIMATION_NONE");
          });
      }
      
    },
    getTrafficTileLayer() {
      //获取实时路况
      let map = this.$refs.map.$$getInstance();
      if (this.isVisibleToggle) {
        this.trafficLayer && this.trafficLayer.hide();
        this.isVisibleToggle = false;
      } else {
        this.trafficLayer = new AMap.TileLayer.Traffic({
          zIndex: 66
        });
        this.trafficLayer && this.trafficLayer.setMap(map);
        this.trafficLayer && this.trafficLayer.show();
        this.isVisibleToggle = true;
      }
    },
    selectObj() {},
    changePage(val) {
      this.carlistdata.current = val;
      this.carOrderlistsight();
    },
    changePageSize(val) {
      this.carlistdata.pageSize = val;
      this.carOrderlistsight();
    },
    carOrderlistsight() {
      // 获取每日订单列表
      if (!this.carlistdata.parColumns.length) {
        Object.entries(returnFields(this)).forEach(([key, value]) => {
          this.carlistdata.parColumns.push(value);
        });
      }
      let currentTime = new Date();
      let year = currentTime.getFullYear();
      let month =
        (currentTime.getMonth() + 1).toString().length == 1
          ? "0" + (currentTime.getMonth() + 1).toString()
          : currentTime.getMonth() + 1;
      let date = currentTime.getDate();
      let currents = year + "-" + month + "-" + date + " " + "00:00:00";
      let startTime = Date.parse(new Date(currents.replace(/-/g, "/")));
      let data = {
        pageSize: this.carlistdata.pageSize,
        currentPage: this.carlistdata.current,
        vin: this.currentCarMsg.vin,
        startTime,
        endTime: Date.parse(new Date())
      };
      this.$store.commit("changeLoadingFlag", true);
      getDriverOrderPage(data)
        .then(res => {
          this.carlistdata.parTableData = res.data.data.list;
          this.carlistdata.total = res.data.data.totalCount;
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch(err => {});
      this.carslists = true;
    },
    toSightDriver(driverUuid) {
      // console.log("点击司机详情，跳转到司机详情页面。");
      if (!driverUuid) {
        this.$Message.warning("暂无司机信息");
        return;
      }
      this.$router.push({ name: "staff-detail", params: { id: driverUuid } });
    },
    sendMassage(mobile) {
      // console.log("点击短信发送，可向该司机发送手机短信。");
      if (!mobile) {
        this.$Message.warning("暂无司机信息");
        return;
      }
      this.messagesent = true;
    },
    carDetail() {
      let { vin } = this.currentCarMsg;
      this.$router.push({ name: "vehicle-detail", params: { id: vin } });
      // console.log("点击车辆详情，跳转到车辆详情页面。");
    },
    chooseCity(value) {
      // 选择城市时该城市车辆数获取
      let that = this;
      let map = this.$refs.map.$$getInstance() || this.mymap;
      let valcitycode = value.length > 1 ? value[1] : value[0];
      let polygons = map.getAllOverlays("polygon"); // 切换城市时 假如地图上存在围栏则清空
      polygons.length && map.remove(polygons);
      this.polygonVal = [];
      this.enclosureTypeData = {
        // 重置已选择的围栏select
        enclosuretype: "",
        enclosureitem: []
      };
      // 绘制区域图
      if (!this.district) {
        //实例化DistrictSearch
        let opts = {
          subdistrict: 0, //获取边界不需要返回下级行政区
          extensions: "all", //返回行政区边界坐标组等具体信息
          level: "district" //查询行政级别为 市
        };
        this.district = new AMap.DistrictSearch(opts);
      }
      this.district && this.district.setLevel("district");
      this.district &&
        this.district.search(valcitycode, function(status, result) {
          that.polygons && that.polygons.length && map.remove(that.polygons); //清除上次结果
          that.polygons = [];
          let bounds = result.districtList[0].boundaries;
          if (bounds) {
            for (let i = 0, l = bounds.length; i < l; i++) {
              //生成行政区划polygon
              let polygon = new AMap.Polygon({
                strokeWeight: 2,
                strokeStyle: "dashed",
                path: bounds[i],
                fillOpacity: 0.1,
                fillColor: "#fff",
                strokeColor: "#551A8B"
              });
              that.polygons.push(polygon);
            }
          }
          that.polygons && that.polygons.length && map.add(that.polygons);
          that.polygons &&
            that.polygons.length &&
            map.setFitView(that.polygons); //视口自适应
          that.spinShowMap = false;
        });
      this.chooseCityMsg = { cityID: valcitycode };
      this.currentChangeData = {
        agentUUID: "", // 运营商id
        driverManagerId: "", // 司管id
        carType: "", // 1：出租车、2：专车、3：跨城拼车、4：快车、5：货的、6：骑手、7：搬家、8：展会
        operationStatus: "", // 0:待运营，1:待绑定，2:运营中，3:维护中，4：退出运营，5：冻结
        carNoOrMobile: "" // 	车牌或电话
      };
      this.onSearchApi({ cityID: valcitycode });
      this.getOptationByCitycode(valcitycode);
      if (this.oldcheckdata.length) {
        this.getServiceSitePageList(this.oldcheckdata);
      }
      AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
        map.addControl(new BasicControl.Zoom({
          position: 'rb', //left top，左上角
          showZoomNum: false //显示zoom值
        }));
      })
      map.addControl(new AMap.Scale());
    },
    onSearchBtn(chooseCityMsg,isClear) {
      if (!isClear){
        this.isloading = true;
      } else {
        this.isClearloading = true;
        this.driverManagerList.splice(0,this.driverManagerList.length)
        this.currentChangeData = {
          agentUUID: "", // 运营商id
          driverManagerId: "", // 司管id
          carType: "", // 1：出租车、2：专车、3：跨城拼车、4：快车、5：货的、6：骑手、7：搬家、8：展会
          operationStatus: "", // 0:待运营，1:待绑定，2:运营中，3:维护中，4：退出运营，5：冻结
          carNoOrMobile: "" // 	车牌或电话
        };
      }
      this.onSearchApi(chooseCityMsg);
    },
    onSearchApi(addData) {
      // 城市车辆点标记以及左侧数据列表请求方法
      let that = this;
      let selectDataCopy = {...this.currentChangeData}
      if (selectDataCopy.agentUUID) {
        if (selectDataCopy.agentUUID.constructor === Array) {
          selectDataCopy.agentUUID = selectDataCopy.agentUUID.join(',')
        }
      }
      if (selectDataCopy.driverManagerId) {
        if (selectDataCopy.driverManagerId.constructor === Array) {
          selectDataCopy.driverManagerId = selectDataCopy.driverManagerId.join(',')
        }
      }
      let data = Object.assign(
        {},
        selectDataCopy,
        addData || { cityID: this.chooseCityMsg.cityID }
      );
      queryCarListByRemote(data)
        .then(res => {
          let markersData = res.data.data || [];
          if (!markersData.length) {
            that.$Message.warning('没有查询到相关车辆')
          }
          that.citychoicest = true;
          this.isloading = false;
          this.isClearloading = false;
          that.renderMarkers(
            markersData,
            (addData && addData.cityID) || this.chooseCityMsg.cityID
          );
        })
        .catch(err => {});
    },
    carTypeChoice(val) {
      return false
      this.currentChangeData.carType = val;
      this.onSearchApi();
    },
    confirmSave() {
      // 提交短信发送
      if (!this.addmsg) {
        this.$Message.warning("请填写发送内容");
        return false;
      }
      let data = {
        sendName: 1,
        driver: 2,
        phone: this.driverMsgData.mobile,
        sendContent: this.addmsg
      };
      sendSms(data)
        .then(res => {
          this.messagesent = false;
          this.$Message.success(res.data.msg);
        })
        .catch(err => {});
    },
    cancelMessage() {
      this.messagesent = false;
      this.addmsg = "";
    },
    sightThermogram() {
      let map = this.$refs.map.$$getInstance();
      if (!this.ishowThermogram) {
        this.heatmap = new AMap.Heatmap(map, {
          radius: 25, //给定半径
          opacity: [0, 0.4],
          zIndex: 77
        });
        //设置数据集：该数据为北京部分“公园”数据
        this.heatmap.setDataSet({
          data: heatmapData,
          max: 100
        });
        this.heatmap && this.heatmap.show();
        this.ishowThermogram = true;
      } else {
        this.heatmap && this.heatmap.hide();
        this.ishowThermogram = false;
      }
    },
    refreshMap(isClick) {
      if(isClick){
        this.isrefresh = true;
        this.choosecar = false;
      }
      if (this.oldcheckdata.length) {
        this.getServiceSitePageList(this.oldcheckdata);
      }
      if (this.chooseCityMsg && this.chooseCityMsg.cityID) {
        this.onSearchApi(this.chooseCityMsg);
        this.getOptationByCitycode(this.chooseCityMsg.cityID);
      }
      if (this.railType) {
        this.getElefenceList(this.railType,true);
        this.renderElefence(this.enclosureTypeData.enclosureitem)
      }
      if (this.polygonVal) {
        this.renderElefence(this.polygonVal);
      }
      isClick && setTimeout(() => {
        this.isrefresh = false;
      }, 1000);
    }
  },
  watch: {
    messagesent: function() {
      if (!this.messagesent) {
        this.addmsg = "";
      }
    },
    carslists: function() {
      if (!this.carslists) {
        this.total = 0;
        this.current = 1;
        this.pageSize = 5;
      }
    }
  }
};
</script>
<style lang="less">
@import "./index.less";
</style>
