<template>
  <div>    
    <div class="module">
      <div class="item" v-for="(item, index) in dataList" :key="index">
        <div class="item-top" v-if="!isCarousel">
          <img :src="item.singleImg" alt="">
        </div>
        <div class="item-top" v-else-if="isCarousel">
          <Carousel class="carousel" v-model="item.popupFrequency" v-if="item.advertisementPicLinks.length">
            <CarouselItem v-for="(value, key) in item.advertisementPicLinks" :key="key" style="height:100%;">
                <div class="demo-carousel">
                  <img :src="value.adPicture">
                </div>
            </CarouselItem>
          </Carousel>
        </div>
        <div class="item-bottom">
          <span class="item-status">{{item.status}}</span>
          <p class="bottom-text">{{item.name}}</p>
          <p class="bottom-text">针对城市：{{item.cityText}}</p>
          <p class="bottom-text">在线时间：{{item.upTime}}至{{item.downTime}}</p>
          <p class="bottom-text">优先级：{{item.level}}</p>
          <div class="closeBox">
            <span><Icon type="md-document" size='26' color='#80ff80' @click="isShowDetail(item.uuid)"/></span>
            <span><Icon type="md-close-circle" size='26' color='#ff4d4d' @click="isShowClose(item.name, item.uuid)"/></span>
          </div>
        </div>
      </div>
    </div>
    <div class="footerPage">
      <Page 
        show-sizer 
        show-elevator 
        show-total 
        :page-size-opts='pageOpts' 
        :page-size='pageSize' 
        :total='total'
        :current="current"
        @on-change="changePage"
        @on-page-size-change="changePageSize"></Page>
    </div>    
  </div>
</template>
<script>
export default {
  props:{
    isCarousel: { // 是否为走马灯，ture为走马灯，false为普通图片展示
      type: Boolean,
      default: false
    },
    pageOpts:{ // 分页数量限制
      type: [Array],
      default: ()=>{
        return [15, 30, 45, 60]
      }
    },
    pageSize:{ // 每页显示的数量
      type: Number,
      default: 15
    },
    dataList: { // 接口数据
      type: [Array],
      default: ()=>{
        return []
      }
    },
    current: { // 当前页码
      type: Number,
      default: 1
    },
    total: { // 当前总数
      type: Number,
      default: 0
    },
    type: { // 模块类型 0：广告页, 1:快车弹窗, 2: 专车弹窗, 3: 出租车弹窗
      type: Number,
      default: 0
    } 
  },
  methods:{
    changePage (val) {
      this.$emit('changePage', val);
    },
    changePageSize(val) {
      this.$emit('changePageSize', val);
    },
    isShowClose(name, id){
      let params = {
        name: name,
        id: id
      }
      this.$emit('closeAd', params)
    },
    isShowDetail(id){
      switch(this.type){
        case 0:
          this.$router.push({name:'advertising-advertisingPage', params:{ id: id}})
          break
        case 1:
          this.$router.push({name:'advertising-expressWindow', params:{ id: id}})
          break
        case 2:
          this.$router.push({name:'advertising-tailoredCarWindow', params:{ id: id}})
          break
        case 3:
          this.$router.push({name:'advertising-taxiWindow', params: {id: id}})
      }
    }
  }
}
</script>
<style lang="less">
.module{
  height: 600px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  padding-left: 55px;
  .item{
    border: 1px solid #dcdee2;
    width: 450px;
    height: 350px;
    margin-right: 55px;
    margin-bottom: 10px;
    .item-top{
      height: 250px;
      padding: 10px;
      .carousel{
        height: 100%;
        width: 100%;
        .demo-carousel{
          height: 230px;
        }
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
    .item-bottom{
      position: relative;
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 10px;
      .item-status{
        position: absolute;
        right: 10px;
        top: 10px;
        padding: 5px 10px;
        background: #57a3f3;
        color: #ffffff;
        border-radius: 5px;
      }
      .bottom-text{
        width: 80%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .closeBox{
        position: absolute;
        right: 10px;
        bottom: 10px;
        span:hover{
          cursor: pointer;
        }
      }
    }
  }
}
.footerPage{
  float: right;
  margin: 10px;
  padding: 10px;
  overflow: hidden;
}
.closeTxt{
  text-align: center;
  font-size: 18px;
  padding: 30px 0;
}
</style>
