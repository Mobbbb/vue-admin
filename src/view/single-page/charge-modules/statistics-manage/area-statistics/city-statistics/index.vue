<template>
  <div class="regionalstatistics">
    <div class="topopationlist">
      <div class="topop">
        <div class="citye">
          <div>城市：</div>
          <area-cascader @select-down="selectAreaDown" @init-down="initDown"></area-cascader>
        </div>
        <div>
          <Tabs :value="tabVal">
            <TabPane v-for="tab in supplierList" :key="tab.id" :label="tab.name" :name="tab.id"></TabPane>
          </Tabs>
        </div>
        <div class="timechoice">
          <DatePicker type="date" placeholder="日期选择" style="width: 200px"></DatePicker>
        </div>
        <div class="operationbtn">
          <Button type="primary" style="margin-right: 20px;" @click="searchMarkerList">查询</Button>
          <Button @click="resetParams">重置</Button>
        </div>
      </div>
      <div class="maparea">
        <el-amap
          vid="amapcode"
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
      </div>
    </div>
    <div class="rankingright">
      <h1>区域充电电量排名</h1>
      <div class="rankinglist">
        <div class="top3color" v-for="(item, index) in rankinglist" :key="index">
          <p>
            <span :class="index < 3 ? 'activeddots': 'noactivedots'">{{index+1}}</span>
            <span class="textleft">{{item.name}}</span>
          </p>
          <p>{{item.num}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import areaCascader from "../../../charge-station-manage/components/area-cascader.vue";
import graycar from "@/assets/images/carstatus/grey.png";
export default {
  name: "regionalStatistics",
  components: {
    areaCascader
  },
  data() {
    let self = this;
    return {
      tabVal: "",
      supplierList: [
        {
          id: "1",
          name: "今日"
        },
        {
          id: "2",
          name: "本月"
        }
      ],
      rankinglist: [
        {
          name: "鼓楼",
          num: 2000
        },
        {
          name: "江宁",
          num: 1234
        },
        {
          name: "雨花台",
          num: 4124
        },
        {
          name: "金陵",
          num: 9803
        },
        {
          name: "应天",
          num: 9837
        }
      ],
      zoom: 4, // 地图显示级别//全国范围
      center: [116.286278, 34.22237],
      markers: [],
      markerRefs: [],
      mymap: null,
      cluster: null,
      events: {
        init(o) {
          let mymap = self.$refs.map.$$getInstance();
          self.getCurentLocation(self.$refs.map.$$getInstance());
          self.cluster = new AMap.MarkerClusterer(o, self.markerRefs, {
            gridSize: 80
          });
          // self.renderMarkers(self.cluster);
        }
      },
      searchParams: {}
    };
  },
  methods: {
    searchMarkerList() {},
    resetParams() {
      this.searchParams = {};
    },
    getCurentLocation(map) {
      let that = this;
      let citysearch = new AMap.CitySearch();
      citysearch.getLocalCity(function(status, result) {
        if (status === "complete" && result.info === "OK") {
          if (result && result.city && result.bounds) {
            let cityinfo = result.city;
            let citybounds = result.bounds;
            //地图显示当前城市
            // map.setBounds(citybounds);
            that.drawBounds(cityinfo);
          }
        }
      });
    },
    renderMarkers(clusterObject) {
      // 生成坐标点所在聚合集合
      let map = this.$refs.map.$$getInstance();
      const getmapdatalist = function() {};
      // getmapdatalist()
      //   .then(res => {
      //     let fakeAarry = res.data.data;
      //     let currentData = [];
      //     fakeAarry.forEach(item => {
      //       let markers = [];
      //       let { longitude, latitude } = item;
      //       markers = new AMap.Marker({
      //         position: [longitude, latitude],
      //         offset: new AMap.Pixel(-10, -10),
      //         icon: new AMap.Icon({
      //           size: new AMap.Size(40, 50), //图标的大小
      //           image: graycar,
      //           imageOffset: new AMap.Pixel(0, 0)
      //         }),
      //         clickable: true
      //       });
      //       markers.on("click", function(e) {});
      //       currentData.push(markers);
      //     });
      //     this.cluster.addMarkers(currentData);
      //   })
      //   .catch(err => {});
    },
    showInfoWindow(cont) {
      let that = this;
      let info = [];
      info.push(
        `<div style="padding:0px 0px 0px 0px;text-align: center;" class="outerinfo"><h3 style="text-align: center;font-size: 18px;color: #000;">${
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
      if (!that.infoWindow) {
        that.infoWindow = new AMap.InfoWindow({
          content: info.join("") //使用默认信息窗体框样式，显示信息内容
        });
      }
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
        });
    },
    selectAreaDown(areaList) {
      this.areaVal = JSON.parse(JSON.stringify(areaList));
      this.searchParams.cityId = this.areaVal[this.areaVal.length - 1];
      this.drawBounds(this.areaVal[this.areaVal.length - 1]);
    },
    initDown(val) {
      this.firstcitycode = val[val.length - 1];
      this.searchParams.cityId = val[val.length - 1];
    }
  }
};
</script>
<style lang="less">
.regionalstatistics {
  display: flex;
  justify-content: space-between;
  .topopationlist {
    width: 76%;
    .topop {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #c5c8ce;
      .citye{
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .maparea {
      height: 78vh;
      margin-top: 10px;
    }
  }
  .rankingright {
    width: 24%;
    padding-right: 50px;
    padding-left: 30px;
    padding-top: 50px;
    .rankinglist {
      .top3color {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        p {
          font-size: 16px;
          .noactivedots {
            width: 22px;
            height: 22px;
            text-align: center;
            vertical-align: middle;
            line-height: 22px;
          }
          .activeddots {
            color: #fff;
            background: #383838;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            text-align: center;
            vertical-align: middle;
            line-height: 22px;
          }
          .textleft {
            min-width: 50px;
            text-align: left;
          }
        }
        p:first-child {
          min-width: 150px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
}
</style>
