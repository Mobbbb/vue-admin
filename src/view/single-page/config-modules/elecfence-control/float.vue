<template>
  <div class="popView" v-show="popView">
    <div class="ivu-modal-mask"></div>
    <div class="popView-wrap" :style="{'top': top + 'px'}">
      <div class="popView-content" :style="{'width': width + 'px'}">
        <div class="popView-title-wrap" :style="{'width': width + 'px','top': top + 'px'}">
          <span class="popView-title">{{title}}</span>
          <div class="popView-icon">
            <Icon class="close-icon" type="md-close" @click="commit(0)"/>
          </div>
        </div>
        <router-view></router-view>
        <div class="popView-body-wrap policemodalstyle">
          <Form ref="formValidate" :model="floatParams" :rules="ruleUser" :label-width="100">
            <FormItem label="名称：" prop="name">
              <Input
                clearable
                :maxlength="40"
                :disabled="invalidEditor"
                v-model="floatParams.name"
                placeholder="请输入名称"
                style="width: 300px"
              />
            </FormItem>
            <FormItem label="城市：" prop="carrierArea">
              <Cascader
                :data="cityList"
                :clearable="false"
                v-model="floatParams.carrierArea"
                @on-change="getCity"
                :disabled="invalidEditor"
                style="width: 300px"
                placeholder="请选择城市"
              ></Cascader>
            </FormItem>
            <FormItem label="业务类型：" prop="serviceType">
              <Select
                v-model="floatParams.serviceType"
                style="width:300px"
                :disabled="invalidEditor">
                <Option
                  v-for="(item, index) in optList"
                  :value="item.value"
                  :key="index"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem label="围栏类型：" prop="railType">
              <!-- <span>{{ railType }}</span> -->
              <Select 
                v-model="floatParams.railType" 
                style="width:300px" 
                placeholder="请选择围栏类型"
                :disabled="invalidEditor">
                <Option
                  v-for="item in railTypeList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
              <Alert v-if="floatParams.railType === 1" show-icon>围栏范围内向乘客提供叫车服务</Alert>
              <Alert v-if="floatParams.railType === 2" show-icon>配置完成后请前往司机管理平台配置相关围栏的奖励规则</Alert>
            </FormItem>
            <FormItem label="范围：" prop="scopes">
              <div class="fonttitle">
                <span class="mapchoice" @click="fencechoice" v-if="!invalidEditor">地图选择</span>
                <span class="mapchoice" @click="signtPenScope" v-if="invalidEditor">查看围栏</span>
                <div class="latandlng">
                  <div class="upfonts">{{floatParams.scopes}}</div>
                  <Input
                    v-model="floatParams.scopes"
                    type="textarea"
                    style="width: 300px"
                    class="hidethisipt"
                  />
                </div>
              </div>
            </FormItem>
            <FormItem label="生效时间：" prop="effectiveTime">
              <DatePicker
                type="date"
                @on-change="geteffectiveTime"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择生效时间"
                style="width: 300px"
                :disabled="invalidEditor"
                :options="options"
                v-model="floatParams.effectiveTime"
              ></DatePicker>
            </FormItem>
            <FormItem label="失效时间：" prop="failureTime">
              <DatePicker
                type="date"
                @on-change="getfailureTime"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择失效时间"
                style="width: 300px"
                :disabled="invalidEditor"
                v-model="floatParams.failureTime"
              ></DatePicker>
            </FormItem>
            <FormItem label="备注：" prop="remark">
              <Input
                autosize
                :maxlength="200"
                :disabled="invalidEditor"
                type="textarea"
                placeholder="请填写备注"
                v-model="floatParams.remark"
                style="width: 300px;"
              />
            </FormItem>
          </Form>
          <div class="popView-footer-wrap" v-if="!invalidEditor">
            <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
            <Button size="large" type="primary" @click="commit(1)">确定</Button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="shadowFloat"
      :style="{'opacity':mapmodal? '1': '0','z-index': mapmodal? '1010': '-1'}"
      ref="mapmodaledraw"
    >
      <div class="cancenlbtn" style="width: 100%;">
        <span class="popView-title">{{title}}</span>
        <div class="popView-icon">
          <Icon class="close-icon" type="md-close" @click="cancel"/>
        </div>
      </div>
      <div class="elecfencechoice">
        <div class="someOptBtn" v-if="sightmapScope">
          <div class="mapOpt"></div>
          <div class="deleteaclear">
            <Button type="primary" @click="eitorPolygon">{{btnTitle}}</Button>
            <Button type="primary" @click="clearChoiceMap" class="btndislance">清除围栏</Button>
          </div>
        </div>
        <el-amap ref="map" vid="amapDemo" :events="mapData.events" class="amap-demo"></el-amap>
      </div>
      <div class="popView-footer-wrap" v-if="!invalidEditor">
        <Button size="large" type="text" @click="cancel" style="margin-right: 8px;">取消</Button>
        <Button size="large" type="primary" @click="cancel">确定</Button>
      </div>
    </div>
  </div>
</template>

<script>
import "@/styles/cyk-style.css";
import { regTest } from "@/libs/tools";
import {
  addCarrier,
  editCarrier,
  getCarrierInfo
} from "@/api/operator-carrier";
import { savePen, selectPen, getPenDetail } from "@/api/configData.js";
import { returnFields } from ".";
import { timeFormat } from "@/libs/util";
export default {
  props: {
    popView: Boolean,
    width: Number,
    top: {
      default: 100,
      type: Number
    },
    title: {
      default: "新建弹窗",
      type: String
    },
    type: String,
    uuid: {
      default: "",
      type: String
    },
    cityList: {
      default: () => {
        return [];
      },
      type: Array
    },
    polygonPath: {
      default: () => {
        return [];
      },
      type: Array
    },
    optList: {
      default: () => {
        return [];
      },
      type: Array
    },
    invalidEditor: {
      default: false,
      type: Boolean
    },
    floatParams: {}
  },
  data() {
    let self = this;
    const carrierArea = (rule, value, callback) => {
      if (this.floatParams.carrierArea.length > 0) callback();
      else callback(new Error("城市区域不能为空"));
    };
    const serviceType = (rule, value, callback) => {
      if (this.floatParams.serviceType) callback();
      else callback(new Error("业务类型不能为空"));
    };
    const railType = (rule, value, callback) => {
      if (this.floatParams.railType || this.floatParams.railType === 0)
        callback();
      else callback(new Error("围栏类型不能为空"));
    };
    const effectiveTime = (rule, value, callback) => {
      if (this.floatParams.effectiveTime) {
        let getTime = new Date(this.floatParams.effectiveTime).getTime();
        if (this.floatParams.failureTime) {
          if (getTime > new Date(this.floatParams.failureTime).getTime()) {
            callback(new Error("生效日期不能大于失效日期"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      } else {
        callback(new Error("生效时间不能为空"));
      }
    };
    const failureTime = (rule, value, callback) => {
      if (this.floatParams.failureTime) {
        let getTime = new Date(this.floatParams.failureTime).getTime();
        if (this.floatParams.effectiveTime) {
          if (getTime < new Date(this.floatParams.effectiveTime).getTime()) {
            callback(new Error("失效日期不能小于生效日期"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      } else {
        callback(new Error("失效时间不能为空"));
      }
    };
    const getpathData = (rule, value, callback) => {
      if (this.floatParams.getpathData.length) callback();
      else callback(new Error("围栏位置范围不能为空"));
    };
    return {
      options: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      params: {
        name: "",
        carrierArea: [],
        serviceType: "",
        railType: "",
        scopes: "",
        getpathData: [],
        effectiveTime: "",
        failureTime: "",
        remark: "",
        status: 1
      },
      ruleUser: {
        name: [
          {
            required: true,
            trigger: "change",
            message: "运营商名称不能为空"
          }
        ],
        serviceType: [
          {
            required: true,
            trigger: "change",
            validator: serviceType
          }
        ],
        railType: [
          {
            required: true,
            trigger: "change",
            validator: railType
          }
        ],
        carrierArea: [
          {
            required: true,
            trigger: "change",
            validator: carrierArea
          }
        ],
        scopes: [{ required: true, trigger: "change", validator: getpathData }],
        effectiveTime: [
          {
            required: true,
            trigger: "change",
            validator: effectiveTime
          }
        ],
        failureTime: [
          {
            required: true,
            trigger: "change",
            validator: failureTime
          }
        ],
        remark: [
          { required: false, trigger: "change", message: "备注不能为空" }
        ]
      },
      mapmodal: false,
      mapData: {
        // zoom: 4, // 地图显示级别//全国范围
        center: [116.286278, 34.22237],
        markers: [],
        markerRefs: [],
        events: {
          init(o) {
            self.maps = self.$refs.map.$$getInstance();
          }
        }
      },
      maps: null,
      penType: true,
      MouseTool: null,
      overlays: [],
      titileStatus: true,
      btnTitle: "开始编辑围栏",
      polygonEditor: [],
      rectangleEditor: null,
      circleEditor: null,
      cityCode: "",
      sightmapScope: true,
      maptitle: "围栏范围选择",
      polygon: null,
      railTypeList: [
        // {
        //   value: 0,
        //   label: "全部"
        // },
        {
          value: 1,
          label: "运营围栏"
        },
        {
          value: 2,
          label: "流水奖励围栏"
        }
      ]
    };
  },
  watch: {
    popView: function() {
      this.$refs.formValidate.resetFields();
      if (this.type === "add") {
        this.params = {
          carrierArea: []
        };
      } else {
      }
    }
  },
  mounted() {
    let that = this;
    that.calcModalWidth();
    window.onresize = function() {
      that.calcModalWidth();
    };
  },
  methods: {
    calcModalWidth() {
      let mapdrapEle = this.$refs.mapmodaledraw;
      if (mapdrapEle == void 0) {
        return false;
      }
      if (document.body.clientWidth <= 1280) {
        mapdrapEle.style.width = 590 + "px";
        mapdrapEle.style.height = 600 + "px";
      } else if (
        document.body.clientWidth > 1281 &&
        document.body.clientWidth <= 1440
      ) {
        mapdrapEle.style.width = 800 + "px";
        mapdrapEle.style.height = 600 + "px";
      } else if (document.body.clientWidth > 1440) {
        mapdrapEle.style.width = 1000 + "px";
        mapdrapEle.style.height = 600 + "px";
        if (document.body.clientHeight < 640) {
          mapdrapEle.style.height = 600 + "px";
        }
      }
    },
    signtPenScope() {
      let that = this;
      let maps = this.$refs.map.$$getInstance();
      let polygons = maps.getAllOverlays("polygon");
      polygons.length && maps.remove(polygons);
      this.overlays.length &&
        this.overlays.forEach(item => {
          maps.remove(item);
        });
      let splitArray = that.floatParams.getpathData;
      let objArray = [];
      let newArray = [];
      splitArray.forEach(item => {
        newArray.push(item.split(";"));
      });
      newArray.forEach(item => {
        let arraybox = [];
        item.forEach(iitem => {
          arraybox.push(iitem.split(","));
        });
        objArray.push(arraybox);
      });
      if (!this.overlays.length) {
        objArray.forEach(item => {
          this.overlays.push(
            new AMap.Polygon({
              path: item,
              fillColor: "#00b0ff",
              strokeColor: "#80d8ff",
              strokeWeight: 6,
              strokeOpacity: 0.2,
              fillOpacity: 0.4,
              zIndex: 50
            })
          );
        });
      }
      this.overlays.length &&
        this.overlays.forEach((item, index) => {
          item.setPath(objArray[index]);
        });
      this.overlays.length &&
        this.overlays.forEach(item => {
          item.setMap(maps);
        });
      // 缩放地图到合适的视野级别
      this.overlays.length && maps.setFitView([this.overlays[0]]);
      this.sightmapScope = false;
      this.maptitle = "围栏范围查看";
      this.mapmodal = true;
    },
    getCity(data, value) {
      let maps = this.$refs.map.$$getInstance();
      this.cityCode = data.length > 1 ? data[1] : data[0];
      this.floatParams.city = value[1].province + value[1].province.city;
      maps.setCity(this.cityCode);
    },
    fencechoice() {
      let that = this;
      let maps = this.$refs.map.$$getInstance();
      // this.cityCode && maps.setCity(this.cityCode)
      maps.clearMap();
      this.overlays.length &&
        this.overlays.forEach(item => {
          item.setPath([[]]);
        });
      let polygons = maps.getAllOverlays("polygon");
      polygons.length && maps.remove(polygons);
      this.overlays.length &&
        this.overlays.forEach(item => {
          maps.remove(item);
        });
      if (that.floatParams.getpathData.length) {
        let newArray = [];
        let splitArray = that.floatParams.getpathData;
        let objArray = [];
        splitArray.forEach(item => {
          newArray.push(item.split(";"));
        });
        newArray.forEach(item => {
          let arraybox = [];
          item.forEach(iitem => {
            arraybox.push(iitem.split(","));
          });
          objArray.push(arraybox);
        });
        if (!this.overlays.length) {
          objArray.forEach(item => {
            this.overlays.push(
              new AMap.Polygon({
                path: item,
                fillColor: "#00b0ff",
                strokeColor: "#80d8ff",
                strokeWeight: 6,
                strokeOpacity: 0.2,
                fillOpacity: 0.4,
                zIndex: 50
              })
            );
          });
        }
        this.overlays.length &&
          this.overlays.forEach((item, index) => {
            item.setPath(objArray[index]);
          });
        this.overlays.length &&
          this.overlays.forEach(item => {
            item.setMap(maps);
          });
        this.overlays.length && maps.setFitView([this.overlays[0]]);
      } else {
        // if (!this.MouseTool) {
        //     this.MouseTool = new AMap.MouseTool(maps)
        // }
        this.MouseTool && this.MouseTool.close(true); //关闭，并清除覆盖物
        this.MouseTool = null;
        this.MouseTool = new AMap.MouseTool(maps);
        this.MouseTool.polygon({
          fillColor: "#00b0ff",
          strokeColor: "#80d8ff"
        });
        this.MouseTool.on("draw", function(e) {
          let newarray = [];
          that.overlays.push(e.obj);
          e.obj &&
            e.obj.getPath().forEach(item => {
              let latlng = `${item.lng},${item.lat}`;
              newarray.push(latlng);
            });
          that.floatParams.getpathData.push(newarray.join(";"));
          that.floatParams.getpathData.length &&
            (that.floatParams.scopes = that.floatParams.getpathData.join("|"));
        });
      }
      this.sightmapScope = true;
      this.maptitle = "围栏范围选择";
      this.mapmodal = true;
    },
    eitorPolygon() {
      let that = this;
      if (!this.overlays.length) {
        this.$Message.warning("无可编辑围栏");
        return;
      }
      let maps = this.$refs.map.$$getInstance();
      if (this.titileStatus) {
        let polygonEditor = this.polygonEditor || [];
        if (!this.polygonEditor.length) {
          this.overlays &&
            this.overlays.forEach(item => {
              polygonEditor.push(new AMap.PolyEditor(maps, item));
            });
        }
        polygonEditor.length &&
          polygonEditor.forEach(item => {
            item.open();
          });
        this.polygonEditor = polygonEditor;
        polygonEditor.forEach((item, index) => {
          item.on("end", function(e) {
            let newarray = [];
            that.overlays[index] = e.target;
            e.target &&
              e.target.getPath().forEach(items => {
                let latlng = `${items.lng},${items.lat}`;
                newarray.push(latlng);
              });
            that.floatParams.getpathData[index] = newarray.join(";");
          });
        });
      } else {
        this.polygonEditor.length &&
          this.polygonEditor.forEach(item => {
            item.close();
          });
        this.polygonEditor = [];
      }
      this.titileStatus = !this.titileStatus;
      this.btnTitle = this.titileStatus ? "开始编辑围栏" : "结束编辑";
    },
    clearChoiceMap() {
      if (!this.overlays.length) {
        this.$Message.warning("无可清除围栏");
        return;
      }
      this.titileStatus = false;
      this.btnTitle = "开始编辑围栏";
      this.polygonEditor.length &&
        this.polygonEditor.forEach(item => {
          item.close();
        });
      let maps = this.$refs.map.$$getInstance();
      let polygons = maps.getAllOverlays("polygon");
      polygons.length && maps.remove(polygons);
      this.overlays.length &&
        this.overlays.forEach(item => {
          maps.remove(item);
        });
      this.overlays = [];
      this.floatParams.getpathData = [];
      this.polygonEditor = [];
      this.floatParams.scopes = "";
      this.titileStatus = true;
    },
    cancel() {
      this.mapmodal = false;
      if (!this.sightmapScope) {
        return;
      }
      if (!this.titileStatus) {
        this.polygonEditor.length &&
          this.polygonEditor.forEach(item => {
            item.close();
          });
        this.polygonEditor = [];
        this.titileStatus = true;
      }
      let maps = this.$refs.map.$$getInstance();
      let polygons = maps.getAllOverlays("polygon");
      polygons.length && maps.remove(polygons);
      this.overlays.length &&
        this.overlays.forEach(item => {
          maps.remove(item);
        });
      // this.MouseTool && this.MouseTool.close(true)//关闭，并清除覆盖物
      // this.MouseTool = null
      this.overlays = [];
      this.polygonEditor = [];
      this.isChoiceType = "";
      this.btnTitle = "开始编辑围栏";
      this.titileStatus = true;
    },
    geteffectiveTime(val) {},
    getfailureTime(val) {},
    commit(temp) {
      if (temp) {
        this.$refs.formValidate.validate().then(res => {
          if (res) {
            let data = JSON.parse(JSON.stringify(this.floatParams));
            let begintime = new Date(this.floatParams.effectiveTime).getTime();
            let endtime = new Date(this.floatParams.failureTime).getTime();
            let currentTime = new Date().getTime();
            let newJSON = {};
            newJSON.serviceType = data.serviceType;
            newJSON.name = data.name;
            newJSON.scope = data.getpathData.join('&');
            newJSON.railType = data.railType;
            newJSON.provinceCode = data.carrierArea[0];
            newJSON.cityCode = data.carrierArea[1];
            newJSON.effectiveTime = timeFormat(begintime);
            newJSON.failureTime = timeFormat(endtime);
            newJSON.remark = data.remark;
            if (currentTime < begintime) {
              newJSON.status = 2;
            } else if (currentTime > begintime && currentTime < endtime) {
              newJSON.status = 1;
            } else if (currentTime > endtime) {
              newJSON.status = 3;
            } else {
              newJSON.status = 1;
            }
            if (this.type === "edit") {
              newJSON.uuid = this.uuid;
            }
            savePen(newJSON)
              .then(res => {
                this.$emit("on-confirm", true);
                this.$Message.success(res.data.msg);
              })
              .catch(err => {});
          }
        });
      } else {
        let newparmas = {
          name: "",
          carrierArea: [],
          serviceType: "",
          railType: "",
          scope: "",
          getpathData: [],
          effectiveTime: "",
          failureTime: "",
          remark: "",
          status: 0
        };
        this.$emit("on-confirm", this.floatParams);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.mobile-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}
.mobile-wrap:last-child {
  margin-bottom: 0;
}
.link-mobile {
  display: block;
  width: 20px;
  height: 22px;
  text-align: center;
}
.real-number {
  width: 200px;
}
.area-number {
  width: 100px;
}
.fonttitle {
  font-size: 14px;
  // margin-bottom: 10px;
}
.fonttitle span:first-child {
  display: inline-block;
  width: 100px;
  text-align: left;
}
.mapchoice {
  color: royalblue;
  text-decoration: underline;
  cursor: pointer;
}
.iptwraper {
  display: inline-block;
}
.elecfencechoice {
  position: relative;
  width: 100%;
  height: 500px;
  .someOptBtn {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .deleteaclear {
      opacity: 0.8;
    }
  }
}
.btndislance {
  margin: 0 20px;
}
.latandlng {
  margin-top: 10px;
  max-width: 300px;
  position: relative;
  .upfonts {
    max-height: 60px;
    overflow-y: scroll;
  }
  .hidethisipt {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    z-index: -1;
  }
}
.shadowFloat {
  position: fixed;
  top: 10%;
  left: 25%;
  padding: 20px;
  width: 1000px;
  height: 600px;
  border-radius: 10px;
  background: #fff;
  .cancenlbtn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
}
.ivu-alert.ivu-alert-with-icon{
  margin: 10px 0 0 0;
  width:300px
}
// .policemodalstyle{
//     .ivu-form-item{
//         margin-bottom: 10px;
//     }
// }
// .popView-body-wrap{
//     &::-webkit-scrollbar {
//       background-color: transparent;
//     }
// }
</style>
