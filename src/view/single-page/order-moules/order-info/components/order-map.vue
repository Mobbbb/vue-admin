<!--订单管理-订单信息-订单轨迹-wx-->
<template>
<div class="order-map">
  <Spin v-show="isShowSpin" size="large" fix></Spin>
  <div v-show="!isShowSpin" class="map-outbox">
    <ul class="color-tag">
      <li v-if="planList.length" @click="isPlan=!isPlan;togglePath()" :class="{'color-org':isPlan}">规划路径</li>
      <li v-if="isOrder" @click="isActual=!isActual;togglePath()" :class="{'color-green':isActual}">实际轨迹</li>
    </ul>
    <div id="container"></div>
    <div class="map-control" v-show="isActual">
      <Icon
        v-if="!isPlay"
        class="play-icon"
        type="ios-play"
        @click="isPlay=true;navgControl(playIcon)"
      />
      <Icon v-else class="play-icon" type="ios-pause" @click="isPlay=false;navgControl('pause')"/>
      <span class="passed-time">{{passedTime}}</span>
      <Slider class="map-slider" v-model="sliderVal" :tip-format="hideFormat" :step="0.0001"></Slider>
      <div class="map-times" @mouseenter="isTimesChoose=true" @mouseleave="isTimesChoose=false">
        <div class="times-show">倍速 {{times}}</div>
        <div class="choose-box">
          <ul v-show="isTimesChoose">
            <li v-for="item in speedList" :key="item.value" :class="{active:times==item.value}" @click="changeSpeed(item.value)">{{item.label}}</li>
          </ul>
        </div>
      </div>
      <span class="passed-time">{{totalTime}}</span>
    </div>
  </div>
</div>
  
</template>

<script>
import { setTimeout, setInterval } from "timers";
import car from "@/assets/images/carstatus/grey.png";
import {axiosPlanningPath,axiosActualTrack} from '@/api/order.js'
const tagMap = {
  1: '单',
  2: '派',
  3: '接',
  4: '服',
  5: '达',
  6: '上',
  7: '经',
  8: '终'
}
export default {
  name:'order-detail',
  props: {
    id: {
      type: String,
      required: true
    },
    activeIndex:{
      type: String,
      required: true
    }
  },
  data() {
    return {
      isShowSpin:true,
      isOrder: true,//是否有司机接单，0,true未接单，1,false已接单
      pathSimplifierIns:null,//实际巡航轨迹的巡航器
      isPlan: false,//规划路线是否显示
      isActual: false,//规划路线是否显示
      tagMap,//实际轨迹tag
      map: null,
      isOnSlider: false, //是否为手动鼠标拉动进度条
      playIcon: "resume", //开始按钮是重新开始还是继续
      isTimesChoose: false, //选择速度弹窗的open/close
      passedTime: "00:00:00", //已经走了的时间
      totalTime: "00:00:00", //已经走了的时间
      isPlay: false, //是否为播放
      sliderVal: 0, //进度条滑动速度
      speed: 100, //初始速度，km、h
      times: 1, //几倍速度播放
      navgtr: null, //巡航器
      speedList: [
        //可选速度
        { label: "倍速 10", value: 10 },
        { label: "倍速 5", value: 5 },
        { label: "倍速 2", value: 2 },
        { label: "倍速 1", value: 1 }
      ],
      planMarkList: [],//规划路径标记
      actualMarkList: [],//实际路径标记
      trackList: [],//对象实际路径列表
      planList: [], //规划路线经纬度列表
      actualList: [], //实际路线经纬度列表
      intervalTime: 0.2 //两个点之间的间隔时间
    };
  },
  methods: {
    newMap(){
      let param = {
        resizeEnable: true,
        zoom: 15
      }
      if(this.planList[0] && this.planList[0].length>0){
        param.center = this.planList[0]
      }
      this.map = new AMap.Map("container", param);
    },
    // 点击规划路径，实际轨迹按钮
    // 此处之所以用销毁地图，是因为产品需求，轨迹展示不展示可切换，同一个地图做不到。
    togglePath(){
      let that = this
      this.map.destroy()
      this.navgtr = null
      this.pathSimplifierIns = null
      this.newMap()
      this.isPlan && this.setPlanPath();
      this.isActual && this.setActualPath();
    },
    getPlanData(){
      let that = this
      axiosPlanningPath({ routeUuid: this.id }).then(res => {
        let resData = res.data.data
        // 规划路线标记点
        let iconOffsetArr = []
        resData.originPointDto && iconOffsetArr.push({
          iconContent: that.iconFun("起", "org-icon"),
          LngLat: resData.originPointDto
        })
        resData.destPointDto && iconOffsetArr.push({
          iconContent: that.iconFun("终", "org-icon"),
          LngLat: resData.destPointDto
        })
        resData.passingPointDtos.forEach(item => {
          iconOffsetArr.push({
            iconContent: that.iconFun("经", "org-icon"),
            LngLat: item
          });
        });
        that.planMarkList = that.markerFun(iconOffsetArr);
        // 轨迹经纬度列表
        that.planList.splice(0,that.planList.length)
        resData.routeSegment.forEach(item => {
          that.planList.push([item.longitude, item.latitude]);
        });
        this.newMap()
        this.isShowSpin = false
        this.drag();
      });
    },
    getActualData(){
      let that = this
      axiosActualTrack({ routeUuid: this.id }).then(res => {
        let resData = res.data.data
        that.isOrder = resData.isOrder===1?true:false
        if(!that.isOrder){
          return false
        }

        // 创建起始和经过的icon
        let iconList = []
        resData.keyPoints.forEach(item=>{
          iconList.push({
            iconContent: that.iconFun(that.tagMap[item.type], item.type===7?'light-icon':"blue-icon"),
            LngLat: item
          })
        })
        that.actualMarkList = that.markerFun(iconList);

        // 数据结构构件
        let trackList = resData.track
        let len = trackList.length
        let startPoint = trackList[0]
        let endPoint = trackList[len-1]
        // 轨迹列表
        that.actualList.splice(0,this.actualList.length)
        trackList.forEach(item=>{
          that.actualList.push([item.longitude, item.latitude]);
          item.stampTime = new Date(item.time).getTime()//当前时间戳
        })
        // 下一段路程经历了多少s,intervalTime,nextDistance:下一段路程：m,nextDistance:下一段路速度：km/h
        trackList.forEach((item,i)=>{
          let next = trackList[i+1]
          if(next){
            item.intervalTime = (next.stampTime-item.stampTime)/1000
            item.nextDistance = that.distanceFun([item.longitude, item.latitude],[next.longitude, next.latitude])
            item.nextSpeed = item.nextDistance / 1000 / (item.intervalTime /60/ 60)
          }
        })
        // 订单记录总时间，hh:mm:ss
        that.totalTime = that.getTime((endPoint.stampTime-startPoint.stampTime)/1000)
        that.trackList = trackList
      });
    },
    // 规划路径
    setPlanPath() {
      let that = this;
      let planColor = "#ff8533";
      
      that.map.add(that.planMarkList);

      // 巡航轨迹
      AMapUI.load(["ui/misc/PathSimplifier", "lib/$"], function(
        PathSimplifier,
        $
      ) {
        if (!PathSimplifier.supportCanvas) {
          that.$Message.error("当前环境不支持 Canvas！");
          return;
        }
        // 规划路线
        var planPathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          map: that.map, //所属的地图实例

          getPath: function(pathData, pathIndex) {
            return that.planList;
          },
          getHoverTitle: function(pathData, pathIndex, pointIndex) {
            return null;
          },
          autoSetFitView: true,
          renderOptions: {
            pathNavigatorStyle: {
              initRotateDegree: 0,
              width: 30,
              height: 15,
              autoRotate: true,
              lineJoin: "round",
              content: "",
              fillStyle: planColor,
              strokeStyle: planColor,
              lineWidth: 1
            },
            pathLineStyle: {
              lineWidth: 6,
              strokeStyle: planColor
            },
            pathLineHoverStyle: {
              strokeStyle: planColor
            },
            pathLineSelectedStyle: {
              lineWidth: 6,
              borderWidth: 0,
              strokeStyle: planColor
            }
          }
        });
        planPathSimplifierIns.setData([
          {
            name: "规划路线",
            points: [],
            path: that.planList
          }
        ]);
      });
    },
    // 实际路径
    setActualPath() {
      if(!this.isOrder){
        return false
      }
      let that = this;
      let relColor = "#2e9c08";
      let passColor = "#46c51a";
  
      // 将 markers 添加到地图
      that.map.add(that.actualMarkList);

      AMapUI.load(["ui/misc/PathSimplifier", "lib/$"], function(
        PathSimplifier,
        $
      ) {
        if (!PathSimplifier.supportCanvas) {
          alert("当前环境不支持 Canvas！");
          return;
        }
        let trackList = that.trackList
        let len = trackList.length
        let startPoint = trackList[0]
        let endPoint = trackList[len-1]
        // 实际轨迹总数
        function onload() {
          that.pathSimplifierIns.renderLater();
        }
        function onerror(e) {
          console.log("图片加载失败！");
        }

        // 历史轨迹巡航器
        that.pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          //autoSetFitView:false,
          map: that.map, //所属的地图实例

          getPath: function(pathData, pathIndex) {
            return pathData.path;
          },
          getHoverTitle: function(pathData, pathIndex, pointIndex) {
            return null;
          },
          autoSetFitView: true,
          // 巡航器样式
          renderOptions: {
            pathNavigatorStyle: {
              initRotateDegree: 0,
              width: 32,
              height: 32,
              autoRotate: true,
              lineJoin: "round",
              content: PathSimplifier.Render.Canvas.getImageContent(
                car,
                onload,
                onerror
              ),
              fillStyle: null,
              strokeStyle: null,
              lineWidth: 1,
              pathLinePassedStyle: {
                lineWidth: 6,
                strokeStyle: passColor
              }
            },
            pathLineStyle: {
              lineWidth: 6,
              strokeStyle: relColor
            },
            pathLineHoverStyle: {
              lineWidth: 0,
              borderWidth: 0
            },
            pathLineSelectedStyle: {
              lineWidth: 6,
              borderWidth: 0,
              strokeStyle: relColor
            },
            pathTolerance: 0,
            keyPointTolerance: -1,
            renderAllPointsIfNumberBelow: 0 //绘制路线节点，如不需要可设置为-1
          }
        });

        //历史轨迹巡航器设置数据
        that.pathSimplifierIns.setData([
          {
            name: "实际轨迹",
            path: that.actualList
          }
        ]);
        that.pathSimplifierIns.setFitView(-1)

        //对第一条线路（即索引 0）创建一个巡航器
        that.navgtr = that.pathSimplifierIns.createPathNavigator(0, {
          loop: false, //循环播放
          speed: that.speedFun(
            that.actualList[0],
            that.actualList[1],
            startPoint.intervalTime
          ) * that.times //巡航速度，单位千米/小时
        });
        //构建自定义信息窗体
        let infoContent = `<p class="info-window">剩余<span>${
          startPoint.cssEndurance
        }</span>m,剩余电量<span>${startPoint.soc}</span>%</p>`;
        let infoWindow = new AMap.InfoWindow({
          anchor: "bottom-center",
          content: infoContent
        });

        infoWindow.open(that.map, that.actualList[0]);
        // 移动过程中
        that.navgtr.on("move", function() {
          that.playIcon = "resume";
          let idx = this.getCursor().idx; //走到了第几个点
          let tail = this.getCursor().tail; //至下一个节点的比例位置
          let totalIdx = idx+tail

          // 计算下一个距离速度
          let point = trackList[idx]
          if (idx<len-1) {
            that.navgtr.setSpeed(point.nextSpeed * that.times);
          }

          // 剩余公里数，窗体随时移动展示
          point && point.cssEndurance && infoWindow.setContent(
            `<p class="info-window">剩余<span>${
              point.cssEndurance
            }</span>m,剩余电量<span>${point.soc}</span>%</p>`
          );
          infoWindow.setPosition(that.navgtr.getPosition());
          // 进度条实时展示tail

          !that.isOnSlider && (that.sliderVal = (totalIdx / len) * 100);
          // 已经播放时间
          // let sTime = (pointObj.stampTime-startStampTime)/1000;
          let sTime = parseInt((endPoint.stampTime-startPoint.stampTime)/1000*that.sliderVal/100);

          that.passedTime = that.getTime(sTime);
          // 如果到头了，回到初始状态
          if (that.navgtr.isCursorAtPathEnd()) {
            that.playIcon = "start";
            that.isPlay = false;
            that.sliderVal = 100;
            that.passedTime = that.totalTime;
          }
        });

        that.navgtr.on("start resume", function() {
          that.navgtr._startTime = Date.now();
          that.navgtr._startDist = this.getMovedDistance();
        });
        that.navgtr.on("stop pause", function() {
          that.navgtr._movedTime = Date.now() - that.navgtr._startTime;
          that.navgtr._movedDist = this.getMovedDistance() - that.navgtr._startDist;
        });
        that.navgtr.onDestroy(function() {
          that.navgtr = null;
        });
      });
    },
    // 标记列表数据
    markerFun(iconOffsetArr) {
      let list = [];
      iconOffsetArr.forEach(item => {
        let markerItem = new AMap.Marker({
          position: new AMap.LngLat(
            item.LngLat.longitude,
            item.LngLat.latitude
          ),
          // 将一张图片的地址设置为 icon
          content: item.iconContent,
          offset: new AMap.Pixel(-13, -30)
        });
        list.push(markerItem);
      });
      return list;
    },
    hideFormat() {
      return null;
    },
    // 开始、暂停、继续等操作
    navgControl(action) {
      if (action === "start") {
        let that = this;
        this.sliderVal = 0;
        this.passedTime = "00:00:00";
        setTimeout(() => {
          that.navgtr[action]();
        }, 300);
      } else {
        this.navgtr[action]();
      }
    },
    // 格式化时间
    getTime(sTime) {
      let ss = "00";
      let mm = "00";
      let hh = "00";
      if (sTime > 60) {
        let s = sTime % 60;
        ss = s > 9 ? s : "0" + s;
        let mTime = parseInt(sTime / 60);
        if (mTime > 60) {
          let m = mTime % 60;
          mm = m > 9 ? m : "0" + m;
          hh = parseInt(mTime / 60);
        } else {
          mm = mTime > 9 ? mTime : "0" + mTime;
        }
      } else {
        ss = sTime > 9 ? sTime : "0" + sTime;
      }
      return hh + ":" + mm + ":" + ss;
    },
    // 监听进度条，如果是主动用鼠标拖动进度条，isOnSlider为true
    drag(isRemove) {
      let that = this;
      let el = document.getElementsByClassName("ivu-slider-button-wrap")[0];
      let el2 = document.getElementsByClassName("ivu-slider-wrap")[0];
      
      if(isRemove){
        el && el.removeEventListener("mousedown", that.openSlider,false);
        document.removeEventListener("mouseup",that.closeSlider,false);
        el2 && el2.removeEventListener("click", that.sliderChange,false);
        return false
      }
      el2.addEventListener("click", that.sliderChange,false);
      el.addEventListener("mousedown", that.openSlider,false);
      // 此处用document是因为，滑动较为随意时，mouseup可能不是作用在el上
      document.addEventListener("mouseup",that.closeSlider,false);
    },
    openSlider(){
      this.isOnSlider = true;
    },
    closeSlider(){
      this.isOnSlider = false;
    },
    // 修改倍速
    changeSpeed(times) {
      this.isTimesChoose = false;
      this.times = times;
    },
    iconFun(content, className) {
      let str = `<div class="map-icon ${className}">
        <div class="map-icon-top">${content}</div>
        <div class="map-icon-line"></div>
        <div class="map-icon-point"></div>
      </div>`;
      return str;
    },
    // 计算两个坐标点之间的距离
    distanceFun(point1, point2){
      // point1:[longitude,latitude]
      let p1 = new AMap.LngLat(point1[0], point1[1]);
      let p2 = new AMap.LngLat(point2[0], point2[1]);
      let distance = Math.round(p1.distance(p2));
      return distance
    },
    speedFun(point1, point2, time) {
      // point1,point2:经纬度数组，time:时间，s
      let distance = this.distanceFun(point1, point2);
      let speed = distance / 1000 / (time /60/ 60);
      // speed:km/h
      return speed;
    },
    sliderChange(val){
      let newVal = typeof(newVal)==='number' ? val : this.sliderVal
      let num = parseInt((newVal / 100) * this.actualList.length);
      let decimal = String((newVal / 100) * this.actualList.length).split('.')[1]||0
      this.navgtr.moveToPoint(num, Number('0.'+decimal));
      this.pathSimplifierIns.renderLater();
    }
  },
  watch: {
    sliderVal(newVal) {
      if (!this.isOnSlider) {
        return false;
      }
      this.sliderChange(newVal)
    },
    id(){
      if(this.activeIndex === '1'){
        this.getPlanData()
        this.getActualData()
      }
    },
    activeIndex(newVal){
      if(newVal === '1'){
        this.getPlanData()
        this.getActualData()
      }
    }
  },
  beforeDestroy(){
    this.navgtr = null
    this.drag(true)
  }
};
</script>
<style lang="less" src="./order-map.less"></style> 
<style lang="less">
.map-outbox {
  .amap-info-close {
    display: none;
  }
  .info-window span {
    color: #2e75f1;
  }
  .ivu-slider-bar {
    color: #fff;
    background: #fff;
    transition: all 0.2s linear;
  }
  .ivu-slider-button-wrap {
    transition: all 0.2s linear;
    top: -5px;
  }
  .ivu-slider-wrap {
    background-color: rgba(255, 255, 255, 0.5);
  }
  .ivu-slider-button {
    border: none;
    box-shadow: 0 0 0 3.5px rgba(230, 230, 230, 0.4);
  }
}
</style>
<style scoped lang="less">
.order-map,.map-outbox {
  position: relative;
  min-height:70vh;
}
.color-tag {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 200;
  font-size: 14px;
  li {
    display: inline-block;
    border-radius: 4px;
    width: 100px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background-color: #fff;
    cursor: pointer;
    margin-right: 2px;
    &.color-org {
      background-color: #ff8533;
      color: #fff;
    }
    &.color-green {
      background-color: #46c51a;
      color: #fff;
    }
  }
}

#container {
  width: 100%;
  height: 70vh;
}
.input-card .btn {
  margin-right: 1.2rem;
  width: 9rem;
}

.input-card .btn:last-child {
  margin-right: 0;
}
.map-control {
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
  z-index: 200;
  height: 80px;
  line-height: 80px;
  color: #fff;
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 0 40px;
}
.play-icon {
  font-size: 36px;
}
.map-slider {
  display: inline-block;
  width: 65%;
  margin-left: 15px;
  position: relative;
  top: 14px;
}
.passed-time {
  position: relative;
  top: 2px;
  display: inline-block;
  margin-left: 15px;
  font-size: 14px;
}
.map-times {
  display: inline-block;
  position: relative;
  margin-left: 15px;
  .times-show {
    padding: 0 10px;
    line-height: 24px;
    font-size: 13px;
    border: 1px solid #fff;
    border-radius: 4px;
    cursor: default;
  }
  .choose-box {
    position: absolute;
    top: -135px;
    left: -6px;
    height: 162px;
    transition: all 0.5s linear;
  }
  ul {
    background: rgba(0, 0, 0, 0.7);
    padding: 10px;
    width: 70px;
    text-align: center;
    border-radius: 3px;
    li {
      height: 26px;
      line-height: 26px;
      cursor: pointer;
      &.active {
        color: #ff8533;
      }
      &:hover {
        font-size: 13px;
      }
    }
  }
}
</style>