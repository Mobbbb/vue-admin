<template>
  <div class="chargestationmap">
    <template v-if="!noCityData">
      <div class="amap-page-container">
        <el-amap
          :vid="'amapcode'+ id"
          :center="center"
          :zoom="zoom"
          class="amap-demo"
          :events="events"
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
        <Spin size="large" fix v-if="spinShowMap"></Spin>
      </div>
      <div class="leftshadow">
        <div class="dropdownstyle">
          <div style="width: 200px;">
            <area-cascader @select-down="selectAreaDown" @init-down="initDown" :id="id"></area-cascader>
          </div>
          <div class="marginstyle">
            <Select
              v-model="searchParams.chargingType"
              style="width:100px"
              placeholder="请选择类型"
              @on-change="getChargeType"
            >
              <Option
                v-for="item in chargeTypeList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </div>
        </div>
        <div class="stationsearch">
          <Input
            v-model="searchParams.stationName"
            placeholder="输入站点名称"
            clearable
            style="width: 200px"
          />
          <div class="marginstyle">
            <Button @click="getChargeList">站点搜索</Button>
          </div>
        </div>
        <div class="searchresult">
          <div class="searchlist">
            <template v-if="leftChargeList.length">
              <div
                :class="['listitem', acitivedUuid == item.uuid? 'activeditem': '']"
                v-for="(item, index) in leftChargeList"
                :key="index"
                @click="focusActiveList(item)"
              >
                <p>{{item.stationName}}</p>
                <p>{{item.address}}</p>
                <p class="smallfonts">
                  <span class="fresscharge">
                    空闲{{item.freeFastChargesNum}}
                    <font>/</font>
                    共{{item.fastChargesNum}}
                  </span>
                  <span class="fastscharge">
                    空闲{{item.freeSlowChargesNum}}
                    <font>/</font>
                    共{{item.slowChargesNum}}
                  </span>
                </p>
              </div>
            </template>
            <!-- <div class="nolist" v-else>暂无改站点数据</div> -->
          </div>
        </div>
      </div>
      <div class="geographiclocation" @click="getCurentLocation">
        <Icon type="ios-locate-outline" size="34"/>
      </div>
    </template>
    <div class="hasnodata">暂无数据</div>
  </div>
</template>
<script>
import areaCascader from "./area-cascader";
import { stationMap } from "@/api/charge.js";
import chargeloc from "@/assets/images/charge/chargeloc.png";
import { setTimeout } from "timers";
export default {
  name: "operativeMap",
  components: {
    areaCascader
  },
  props: {
    id: {
      default: "",
      type: String
    },
    flagindex: {
      default: 0,
      type: Number
    }
  },
  data() {
    let self = this;
    return {
      firstcitycode: "",
      zoom: 4, // 地图显示级别//全国范围
      center: [118.835672, 31.951945],
      markers: [],
      markerRefs: [],
      myMap: null,
      cluster: null,
      events: {
        init(o) {
          let mymap = self.$refs.map.$$getInstance();
          self.cluster = new AMap.MarkerClusterer(o, self.markerRefs, {
            gridSize: 80
          });
          self.mymap = mymap;
        }
      },
      chargeTypeList: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 1,
          label: "快充"
        },
        {
          value: 2,
          label: "慢充"
        }
      ],
      chargetype: "",
      model1: "",
      stationame: "",
      infoWindow: null,
      district: null,
      polygons: [],
      cityList: [],
      carrierArea: [],
      searchParams: {
        chargingType: "",
        cityId: "",
        stationName: "",
        supplierId: this.id,
        pageSize: 10000
      },
      leftChargeList: [],
      showTolistRend: false,
      spinShowMap: true,
      noCityData: false,
      acitivedUuid: "",
      currentDataMarkers: [],
      location: location,
      geolocation: null
    };
  },
  watch: {
    id: function() {
      if (this.id) {
        console.log(this.id, "iddddddd");
      }
    }
  },
  mounted() {},
  methods: {
    getChargeListByCity() {
      let data = this.searchParams;
      if (!this.searchParams.chargingType) {
        delete this.searchParams.chargingType;
      }
      if (!this.searchParams.stationName) {
        delete this.searchParams.stationName;
      }
      stationMap(data)
        .then(res => {
          let chargelist = res.data.data.list;
          this.leftChargeList = this.showTolistRend ? chargelist : [];
          this.showTolistRend = false;
          !chargelist.length && this.$Message.warning("暂无充电站数据");
          !data.stationName && (this.leftChargeList = []);
          this.renderMarkers(chargelist);
        })
        .catch(err => {});
    },
    getChargeType(val) {
      this.searchParams.chargingType = val;
      this.getChargeListByCity();
    },
    getChargeList() {
      this.showTolistRend = true;
      this.getChargeListByCity();
    },
    getCurentLocation() {
      let that = this
      let map = this.$refs.map.$$getInstance();
      // let citysearch = new AMap.CitySearch();
      // citysearch.getLocalCity(function(status, result) {
      //   if (status === "complete" && result.info === "OK") {
      //     if (result && result.city && result.bounds) {
      //       let cityinfo = result.city;
      //       let citybounds = result.bounds;
      //       //地图显示当前城市
      //       map.setBounds(citybounds);
      //     }
      //   }
      // });
      that.geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 10000, //超过10秒后停止定位，默认：5s
        buttonPosition: "RB", //定位按钮的停靠位置
        buttonOffset: new AMap.Pixel(-1000, -200), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true //定位成功后是否自动调整地图视野到定位点
      });
      map.addControl(that.geolocation);
      that.geolocation.getCurrentPosition(function(status, result) {
        if (status == "complete") {
          that.$Message.success('定位成功');
        } else {
          that.$Message.error('定位失败');
        }
      });
    },
    drawBounds(citycodes) {
      // 绘制区域图
      let that = this;
      let map = this.$refs.map.$$getInstance() || this.mymap;
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
        this.district.search(citycodes, function(status, result) {
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
      this.getChargeListByCity();
    },
    renderMarkers(rendermark) {
      // 生成坐标点所在聚合集合
      let that = this;
      let map = this.$refs.map.$$getInstance();
      let currentData = [];
      this.cluster && this.cluster.clearMarkers();
      rendermark.forEach(item => {
        let markers = [];
        let { longitude, latitude } = item;
        markers = new AMap.Marker({
          position: [longitude, latitude],
          offset: new AMap.Pixel(-10, -10),
          icon: new AMap.Icon({
            size: new AMap.Size(40, 50), //图标的大小
            image: chargeloc,
            imageOffset: new AMap.Pixel(0, 0)
          }),
          extData: item,
          clickable: true
        });
        markers.on("click", function(e) {
          let newData = this.getExtData();
          that.showInfoWindow(newData);
        });
        currentData.push(markers);
      });
      this.currentDataMarkers = currentData;
      this.cluster.addMarkers(currentData);
      that.cluster.setMaxZoom(16)
    },
    showInfoWindow(cont) {
      let that = this;
      let info = [];
      info.push(
        `<div style="padding:20px 0px 10px 0px;text-align: center;" class="outerinfo"><h3 style="text-align: center;font-size: 18px;color: #000;">${
          cont.stationName
        }</h3>`
      );
      info.push(
        `<p style="font-size: 14px;color: #000;font-weight: 600;margin: 10px 0;">${
          cont.address
        }</p>`
      );
      info.push(
        `<p style="margin: 10px 0;"><span style="color:#000;font-weight: 600;font-size: 14px;">快充：</span> <span style="display: inline-block;margin: 0 10px;">空闲</span>${
          cont.freeFastChargesNum
        }&nbsp&nbsp&nbsp&nbsp/&nbsp&nbsp&nbsp&nbsp<span style="display: inline-block;margin: 0 10px;">共</span>${
          cont.fastChargesNum
        }</p>`
      );
      info.push(
        `<pstyle="margin: 10px 0;"><span style="color:#000;font-weight: 600;font-size: 14px;">慢充：</span> <span style="display: inline-block;margin: 0 10px;">空闲</span>${
          cont.freeSlowChargesNum
        }&nbsp&nbsp&nbsp&nbsp/&nbsp&nbsp&nbsp&nbsp<span style="display: inline-block;margin: 0 10px;">共</span>${
          cont.slowChargesNum
        }</p>`
      );
      info.push(
        `<p id='lnglat2container' data-uuid=${
          cont.uuid
        } style="cursor:pointer;color: #2d8cf0;font-size: 14px;text-align:right;margin-top: 20px;">查看详情</p></div></div>`
      );
      that.infoWindow && that.infoWindow.close();
      that.infoWindow = new AMap.InfoWindow({
        content: info.join("") //使用默认信息窗体框样式，显示信息内容
      });
      let position = new AMap.LngLat(cont.longitude, cont.latitude);
      that.infoWindow && that.infoWindow.open(that.mymap, position);
      setTimeout(() => {
        that.getChargeDetail();
      });
    },
    getChargeDetail() {
      let that = this;
      let vNode = document.getElementById("lnglat2container");
      vNode &&
        (vNode.onclick = function() {
          let uuid = this.getAttribute("data-uuid");
          that.$router.push("/chargeCenter/charge-station-detail/" + uuid);
        });
    },
    selectAreaDown(areaList) {
      this.areaVal = JSON.parse(JSON.stringify(areaList));
      let areaCode = this.areaVal[this.areaVal.length - 1];
      if (areaList.length == 2) {
        this.searchParams.cityId = areaCode;
        delete this.searchParams.areaCode;
      } else if (areaList.length == 3) {
        this.searchParams.cityId = this.areaVal[this.areaVal.length - 2];
        this.searchParams.areaCode = areaCode;
      }
      this.drawBounds(this.areaVal[this.areaVal.length - 1]);
    },
    initDown(val) {
      if (!val) {
        this.noCityData = true;
        return;
      }
      this.firstcitycode = val[val.length - 1];
      this.searchParams.cityId = val[val.length - 1];
      this.drawBounds(this.firstcitycode);
    },
    focusActiveList(data) {
      let map = this.$refs.map.$$getInstance() || this.mymap;
      this.acitivedUuid = data.uuid;
      this.currentDataMarkers.forEach(item => {
        item.setAnimation("AMAP_ANIMATION_NONE");
        if (data.uuid == item.getExtData().uuid) {
          map.panTo([data.longitude, data.latitude]);
          map.setFitView(item);
          setTimeout(() => {
            item.setAnimation("AMAP_ANIMATION_BOUNCE");
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.chargestationmap {
  position: relative;
  width: 100%;
  height: 70vh;
  overflow: hidden;
  .amap-page-container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 70vh;
  }
  .leftshadow {
    position: absolute;
    left: 0;
    top: 0;
    background: #fff;
    height: 70vh;
    .dropdownstyle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 30px;
      padding-right: 10px;
      // margin-left: 10px;
      .marginstyle {
        margin-left: 10px;
      }
    }
    .stationsearch {
      // margin-left: 10px;
      margin-top: 20px;
      display: flex;
      align-items: center;
      .marginstyle {
        margin-left: 10px;
      }
    }
    .searchresult {
      margin-top: 25px;
      .searchlist {
        max-height: 40vh;
        overflow-y: scroll;
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
          // 滚动条的设置
          background-color: #dddddd;
          background-clip: padding-box;
          min-height: 28px;
        }
        &::-webkit-scrollbar-thumb:hover {
          background-color: #bbb;
        }
        .listitem {
          border-bottom: 1px solid #eee;
          // margin-left: 10px;
          padding-bottom: 10px;
          padding-top: 10px;
          cursor: pointer;
          p {
            font-size: 14px;
            color: #333;
          }
          p:nth-child(2) {
            color: #adadad;
          }
          .smallfonts {
            letter-spacing: 1px;
            .fresscharge {
              display: inline-block;
              margin-right: 20px;
              font {
                display: inline-block;
                margin: 0 5px;
              }
            }
            .fastscharge {
              display: inline-block;
              font {
                display: inline-block;
                margin: 0 5px;
              }
            }
          }
          &.activeditem {
            p {
              color: #2d8cf0;
            }
          }
        }
        .nolist {
          color: #666;
          font-size: 14px;
          text-align: center;
        }
      }
    }
  }
  .geographiclocation {
    position: absolute;
    right: 50px;
    bottom: 60px;
    background: rgba(225, 225, 225, 0.3);
    box-shadow: 2px 1px 5px rgba(100, 100, 100, 0.4);
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 50%;
    z-index: 99;
  }
  .hasnodata {
    font-size: 16px;
    color: #666;
    text-align: center;
    margin-top: 20px;
  }
}
</style>

