<template>
  <div class="car-gps">
    <SearchList :inputList="inputList" @on-search="getGPSData" @on-reset="clearQueryData"></SearchList>
    <div class="gps-out">
      <Spin v-if="isSpin" fix  size="large"></Spin>
      <div class="btn-list" v-if="lineArr.length>0">
        <ButtonGroup size="large">
            <Button @click="startAnimation">开始</Button>
            <Button @click="pauseAnimation">暂停</Button>
            <Button @click="resumeAnimation">继续</Button>
        </ButtonGroup>
      </div>
      <div id="container"></div>
    </div>
  </div>
</template>
<script>
import { cacheData } from './fields'
import { timeFormat } from "@/libs/util";
import { axiosCarGPSData } from "@/api/configData.js";
import car from "@/assets/images/carstatus/white3.png";
export default {
  data(){
    return {
      ...cacheData,
      searchData: {},
      map: null,
      marker:null,
      isSpin: false,
      lineArr: []
    }
  },
  mounted(){
    this.setGPS();
  },
  methods: {
    // 条件搜索后回调方法
    getGPSData(data) {
      if(!data.vin){
        this.$Message.warning('请先填写VIN')
        return false
      }
      if(!data.startTime||!data.endTime){
        this.$Message.warning('请先选择时间段')
        return false
      }
      if(data.startTime == data.endTime){
        this.$Message.warning('时间段开始时间和结束时间不能相同')
        return false
      }
      let differ = (data.endTime - data.startTime)/1000/60/60
      if(differ>4){
        this.$Message.warning('时间段不能相差4小时')
        return false
      }else{
        data.endTime = timeFormat(data.endTime, "yyyy-mm-dd")
        data.startTime = timeFormat(data.startTime, "yyyy-mm-dd")
      }
      this.isSpin = true
      axiosCarGPSData(data).then(res=>{
        if(res.data.success){
          let resData = res.data.data
          let list = []
          resData.forEach(item=>{
            list.push([item.longitude, item.latitude])
          })
          this.isSpin = false
          this.lineArr = list
          this.setGPS();
        }else{
          this.isSpin = false
          this.$$Message.error(res.data.msg||'请求数据异常')
        }
      })
    },
    clearQueryData() {
      // 点击清空
      this.searchData = {}
      this.lineArr = []
      this.marker = null
      this.setGPS();
    },
    // 
    setGPS(){
      let that = this
      this.map = new AMap.Map("container", {
        resizeEnable: true,
        zoom: 15
      });
      let len = this.lineArr.length
      if(len>0){
        that.marker = new AMap.Marker({
          map: that.map,
          position: that.lineArr[0],
          icon: car,
          offset: new AMap.Pixel(-26, -13),
          autoRotation: true,
          angle:-90,
        });
        // 起始点标记
        let markStart = that.setMarker(that.lineArr[0],'起')
        let markEnd = that.setMarker(that.lineArr[len-1],'终')
        that.map.add([markStart,markEnd]);
        // 绘制轨迹
        var polyline = new AMap.Polyline({
          map: that.map,
          path: that.lineArr,
          showDir:true,
          strokeColor: "#28F",  //线颜色
          // strokeOpacity: 1,     //线透明度
          strokeWeight: 6,      //线宽
          // strokeStyle: "solid"  //线样式
        });
        var passedPolyline = new AMap.Polyline({
          map: that.map,
          // path: that.lineArr,
          strokeColor: "#46c51a",  //线颜色
          // strokeOpacity: 1,     //线透明度
          strokeWeight: 6,      //线宽
          // strokeStyle: "solid"  //线样式
        });

        that.marker.on('moving', function (e) {
          passedPolyline.setPath(e.passedPath);
        });

        that.map.setFitView();
      }
    },
    startAnimation () {
      this.marker.moveAlong(this.lineArr, 200);
    },
    pauseAnimation () {
      this.marker.pauseMove();
    },
    resumeAnimation () {
      this.marker.resumeMove();
    },
    setMarker(item,content){
      let markerItem = new AMap.Marker({
        position: new AMap.LngLat(
          item[0],
          item[1]
        ),
        // 将一张图片的地址设置为 icon
        content: `<div class="map-icon blue-icon">
          <div class="map-icon-top">${content}</div>
          <div class="map-icon-line"></div>
          <div class="map-icon-point"></div>
        </div>`,
        offset: new AMap.Pixel(-13, -30)
      });
      return markerItem
    }
  }
}
</script>
<style lang="less" src="../../order-moules/order-info/components/order-map.less"></style>
<style lang="less">
  #container{
    height:76vh;
    margin-top:10px;
    /deep/ .amap-maps{
      height:76vh;
    }
  }
  .car-gps{
    height:100%;
    overflow: hidden;
  }
  .gps-out{
    position: relative;
  }
  .btn-list{
    position: absolute;
    bottom: 40px;
    right:40px;
    box-shadow: 0 2px 10px 0 #999;
  }
</style>