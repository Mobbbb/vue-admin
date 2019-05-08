<template>
<div class="top">
    
    <div class="amap-page-container">
      <el-amap-search-box  class="search-box"  :search-option="searchOption" :on-search-result="onSearchResult" > </el-amap-search-box>
      <el-amap vid="amapDemo" :center="mapCenter" :zoom="12" :style="{width:mapWidth + 'px',height:mapHeight +'px' }" :plugin="plugin" ref="mapPicker" :events="events">
        <el-amap-marker v-for="(marker,index) in markers" :position="marker.position" :key="marker.index" :icon='marker.icon' :title='marker.name' :events="marker.events" :draggable="marker.draggable" :vid='index'></el-amap-marker>
      </el-amap>
      <!-- <div class="closeIc" @click="closeMap"><Icon type="md-close" /> </div> -->
      <div class="toolbar">
        <Button type="info" name="i" v-on:click="handleMarkedMove">点击可移动</Button>
        <!-- <button type="button" name="i" v-on:click="handleDelMarked">点击删除标记</button> -->
      </div>
    </div>

</div>
</template>
<script>
import  './styles.css'
// import VueAMap from 'vue-amap'

// let amapManager = new VueAMap.AMapManager()
export default {
    name:'map-picker',

     mounted(){
      //  console.log(this.originLocation)
      let that = this
      if(this.originLocation.length !==0){
         this.markers[0].position = this.originLocation
         this.mapCenter = this.originLocation
       }
    //  this.getLocation()
    //  console.log($$getInstance()	)
     },
     watch:{
       'originLocation' :function(){
      if(this.originLocation.length !==0){
         this.markers[0].position = this.originLocation
         this.mapCenter = this.originLocation
        //  console.log('has',this.markers) 
         this.markers = this.markers.slice(0,1)
       }
       else{
        //  console.log('no')
        //  this.getLocation()
       }
       }
     },

    props:{
      mapWidth: {
        type: String,
        default: ()=>{
          return '800px'
        }
      },
      mapHeight: {
        type: String,
        default: ()=>{
          return '400px'
        }
      },
      originLocation:{
        type: Array,
        default: ()=>{
          return []
        }
      }
    },
     data() {
        const self = this
        return {
          searchFlag:false,
          events:{
              'click': (e) => {
              // alert('map clicked');
              let newMarker = []
              newMarker = [(e.lnglat.lng).toFixed(6), (e.lnglat.lat.toFixed(6))]
              // console.log(newMarker)
              this.addNewMarker(newMarker)
            }
            
          },
          markers: [
            {
              position: [118.811987, 31.915646],
              events: {
                click: (e) => {
                  this.$Modal.confirm({
                      title:'提示',
                      content:'确定选中此处吗 ',
                      onOk:()=>{
                            let position = [(e.lnglat.lng).toFixed(6), (e.lnglat.lat.toFixed(6))]
                            self.lnglat = position
                            self.addressInfo.longitude = Number(position[0])
                            self.addressInfo.latitude = Number(position[1])
                            self.getAdress(position)
                      }
                  }
                  )
                  // console.log(e)
                },
                dragend: (e) => {
                  //console.log('---event---: dragend')
                  this.markers[0].position = [e.lnglat.lng, e.lnglat.lat];
                }
              },
              draggable: true,
            }
          ],
          markerModel:{
              events:{
                click: (e) => {
                  this.$Modal.confirm({
                      title:'提示',
                      content:'确定选中此处吗',
                      onOk:()=>{
                            // let position = [(e.lnglat.O).toFixed(6), (e.lnglat.P.toFixed(6))]
                            let position = [(e.lnglat.lng).toFixed(6), (e.lnglat.lat.toFixed(6))]
                            self.lnglat = position
                            //console.log('point')
                            self.addressInfo.longitude = Number(position[0])
                            self.addressInfo.latitude = Number(position[1])
                            self.getAdress(position)
                      }
                  }
                  )
                  // console.log(e)
                },  
                icon:"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
                dragend: (e) => {
                  // console.log('---event---: dragend')
                  this.markers[this.markers.length-1].position = [e.lnglat.lng, e.lnglat.lat];
                }
              },
              draggable: true,

          },
          searchOption: {
            // city: '上海',
            // citylimit: false
          },
          plugin: [{
            pName: 'Geolocation',
            events: {
              init(o) {
                // o 是高德地图定位插件实例
                o.getCurrentPosition((status, result) => {
                  if (result && result.position) {
                    self.lng = result.position.lng;
                    self.lat = result.position.lat;
                    self.mapCenter = [self.lng, self.lat];
                  //  console.log(self)
                    self.loaded = true;
                    // self.$nextTick();
                  }
                });
              }
               }
          }],
          mapCenter: [118.811987, 31.915646],
          lnglat:[],
          addressInfo:{
            areaCode: '',
            city: '',
            province: '',
            address: '',
            longitude: '',
            latitude: ''
          }
        };
      },
      methods: {
        addMarker: function() {
          let lng = 118.5 + Math.round(Math.random() * 1000) / 10000;
          let lat = 31.915646 + Math.round(Math.random() * 500) / 10000;
          this.markers.push([lng, lat]);
        },
        // 添加新坐标点
        addNewMarker(lnglat){
          let poi = {}
          poi.position = lnglat
          poi.events = this.markerModel.events
          this.$Modal.confirm({
                    title: '标记',
                    content: '<p>是否标记此处</p>',
                    onOk: () => {
                        this.markers.push(poi);
                        if(this.markers.length >1){
                          // this.markers = this.markers.slice[0,1]
                          this.markers[1]= this.markers[this.markers.length-1]
                          this.markers = Array.from(new Set(this.markers))
                          this.markers[1].draggable = false
                          // this.markers = Array.from(new Set(this.markers))
                          // this.markers = this.markers.slice[0,2]
                        }
                        // this.markers[1] = poi
                        // console.log(this.markers)
                    },
                    onCancel: () => {
                        this.$Message.info('已取消');
                    }
                });
           
        },
        //获取当前定位
        getLocation(){
          // console.log('1111')
          //  console.log(self.mapCenter)
          // this.getCurrentPosition()
          let that = this
          var geolocation = new AMap.Geolocation({
                  enableHighAccuracy: true,
                  // 设置定位超时时间，默认：无穷大
                  timeout: 10000,
                  // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
                  buttonOffset: new AMap.Pixel(10, 20),
                  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                  zoomToAccuracy: true,     
                  //  定位按钮的排放位置,  RB表示右下
                  buttonPosition: 'RB'
                  })
          geolocation.getCurrentPosition(function(status,result){
              // console.log(status,result)
              if(status == 'complete' ){
                that.mapCenter = [result.position.lng,result.position.lat]
              }
          })


        },
        onSearchResult(pois) {
          this.markers = [];
          let latSum = 0;
          let lngSum = 0;
          if (pois.length > 0) {
            pois.forEach(poi => {
              let {lng, lat} = poi;
              lngSum += lng;
              latSum += lat;
              poi.position = [poi.lng, poi.lat]
              poi.events = this.markerModel.events
              this.markers.push(poi)
              
            });
            // this.markers = this.markers.slice[0,2]
            // console.log('res',this.markers)
            // console.log(this.markers)
            let center = {
              lng: lngSum / pois.length,
              lat: latSum / pois.length
            };
            this.mapCenter = [center.lng, center.lat];
          }
        },
  
        passData(val){
            // console.log(val)
        },
        closeMap(){
            // console.log('xxx')
            this.$emit('isShow',false)
        },
        oneMethod(val){
            this.closeMap()
            // this.$emit('isShow',false)
            
        },
        handleMarked(){
          let map = this.$refs.mapPicker.$$getInstance()
          this.mapInfo = map
          
        },
        handleMarkedMove(){
          // let draggable = true
          // this.markers[0].draggable = !draggable;
            this.markers.forEach(marker => {
              marker.draggable = false
            });
            this.markers[this.markers.length-1].draggable = true
          //  console.log(this.markers)

        },
        handleDelMarked(){

        },
        getAdress(lnglat){
          //高德地图SDK逆向地理信息
          // console.log(lnglat)
          let that = this 
           var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
              }); 
          geocoder.getAddress(lnglat, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                  if (result && result.regeocode) {
                  that.addressInfo.areaCode = result.regeocode.addressComponent.adcode
                  
                  if(result.regeocode.addressComponent.city == '' || null || undefined) {
                    that.addressInfo.city = result.regeocode.addressComponent.province
                  }else{
                    that.addressInfo.city = result.regeocode.addressComponent.city
                  }
                  // (that.addressInfo.city!='') ? that.addressInfo.city = result.regeocode.addressComponent.city : that.addressInfo.city = result.regeocode.addressComponent.province
                  that.addressInfo.province = result.regeocode.addressComponent.province
                  that.addressInfo.address = result.regeocode.formattedAddress
                    // self.$nextTick();
                   that.$emit('listenMap',that.addressInfo)
                  }
                  else{
                    that.$Message.error('获取地址失败');
                  }
                }else{
                  that.$Message.error('获取地址失败');}
              });    
           
        }
      }
}
</script>
<style scoped  lang="less">
    .amap-demo1 {
    width: 800px;
      height: 400px;
    }
     .search-box {
      position: absolute;
      top: 37px;
      left: 20px;
     
    }
    

     .amap-page-container {
      position: relative;
       height: 400px;
    }
    .top{
        // position:fixed;
        // z-index: 12000;
        // width: 800px;
        // height: 400px;
        /* top:100px; */
        /* left: 200px; */
    }
    .closeIc{
            width: 20px;
    font-size: 29px;
    position: absolute;
    right: 0px;
    top: 20px;
    cursor: pointer;
    }
   
  </style>
  <style scoped>
  .search-btn{
    opacity: 0;
    visibility: hidden;
  }
  .el-vue-search-box-container .search-box-wrapper span{
      color: red;
    }
  </style>
  
