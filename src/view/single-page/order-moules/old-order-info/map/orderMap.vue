<template>
  <div class="amap-page-container">
    <div class="orderRight">
      <p class="carTextLeft">
        行程持续时间
        <span class="carTime">{{pathTime}}</span>
      </p>
      <p class="carTextRight" @click="getMap">车辆轨迹回放</p>
    </div>
    <div :style="{width:'100%',height:'800px'}">
      <el-amap
        vid="amap"
        class="amap-demo"
        :center="center"
        :zoom="zoom"
        :amap-manager="amapManager"
      >
        <el-amap-polyline :path="pathArr"></el-amap-polyline>
        <el-amap-marker
          :position="center"
          :icon="marker.icon"
          :bubble="true"
          :autoRotation="true"
          :angle="-90"
        ></el-amap-marker>
      </el-amap>
    </div>
  </div>
</template>
<script>
import { orderPath } from "@/api/passenger.js";
import VueAMap from "vue-amap";
let amapManager = new VueAMap.AMapManager();
let o = amapManager.getMap();
export default {
  props: [
    "center", 
    "params"
  ],
  data() {
    let self = this;
    return {
      amapManager,
      polyline: [],
      pathArr: [],
      zoom: 15,
      marker: {
        map: o,
        icon: "https://webapi.amap.com/images/car.png",
        position: [120.177213, 30.187996]
      },
      pathTime: "0小时0分0秒"
    };
  },
  methods: {
    getMap() {
      orderPath(this.params)
        .then(res => {
          let o = amapManager.getMap();
          let data = res.data.data;
          this.pathArr = [];
          o.remove(this.marker);
          data.point.forEach((v, k) => {
            if (k === 0) {
              this.center = [v.longitude, v.latitude];
            }
            this.pathArr.push([v.longitude, v.latitude]);
          });
          this.marker = new AMap.Marker({
            map: o,
            icon: "https://webapi.amap.com/images/car.png",
            position: this.center,
            autoRotation: true,
            offset: new AMap.Pixel(-26, -13)
          });
          this.marker.moveAlong(this.pathArr, 1000);
          this.pathTime = data.spendTime ? data.spendTime : "00时00分00秒"
        })
        .catch(error => {});
    },
    getMoveLong() {
      // this.longMarker = new AMap.Marker({
      //   map: this.map,
      //   position: [116.478935, 39.997761],
      //   icon: "https://webapi.amap.com/images/car.png",
      //   offset: new AMap.Pixel(-26, -13),
      //   autoRotation: true,
      //   angle: -90
      // });
      // // 绘制轨迹
      // var polyline = new AMap.Polyline({
      //   map: map,
      //   path: lineArr,
      //   showDir: true,
      //   strokeColor: "#28F", //线颜色
      //   strokeWeight: 6 //线宽
      // });

      // var passedPolyline = new AMap.Polyline({
      //   map: map,
      //   strokeColor: "#AF5", //线颜色
      //   strokeWeight: 6 //线宽
      // });

      // marker.on("moving", function(e) {
      //   passedPolyline.setPath(e.passedPath);
      // });

      // map.setFitView();
    }
  }
};
</script>
<style lang="less">
.orderRight {
  display: flex;
  justify-content: space-between;
  .carTextLeft {
    font-size: 20px;
    font-weight: bold;
    .carTime {
      padding-left: 20px;
    }
  }
  .carTextRight {
    display: inline-block;
    padding: 10px 15px;
    background: #2d8cf0;
    color: #ffffff;
    border-radius: 5px;
    cursor: pointer;
  }
}
</style>
