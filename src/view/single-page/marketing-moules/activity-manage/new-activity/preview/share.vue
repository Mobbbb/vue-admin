<template>
  <div class="share-container">
    <div v-if="type==='1'">
      <img src="" alt="分享给朋友">
      <div class="content-share">
        <div class="text-inner">
          <p class="share-title">{{title}}</p>
          <!-- <p class="share-title">孩子王送你8元打车券 到店送50元玩具券</p> -->
          <div class="text-down">
            <p class="sub-title">{{subTitle}}</p>
            <img :src="shareIcon || shareIconImg">
          </div>
        </div>
        <div class="out-bg"></div>
      </div>
    </div>
    <div v-else>
      <img src="" alt="分享给朋友">
      <div class="circle-content">
        <img :src="shareIcon || shareIconImg">
        <p class="circle-title">{{title}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import shareIconImg from '@/assets/images/market/share-icon.png'
export default {
  props: {
    title:{
      type:String,
      default:''
    },
    subTitle:{
      type:String,
      default:''
    },
    shareIcon: {
      type:String,
      default:''
    },
    type: {
      type:String,
      default:'1'
    }
  },
  data(){
    return {
      shareIconImg
    }
  }
}
</script>
<style lang="less" src="./index.less" scoped></style>
