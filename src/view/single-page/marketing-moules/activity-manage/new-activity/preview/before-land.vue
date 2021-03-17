<template>
  <div class="preview-containor" :style="{background:bgColor||'#f8c3ab'}">
    <div class="head-box">
      <img src="@/assets/images/market/head.png" alt="手机头部">
      <p class="title">{{title}}</p>
    </div>
    <div class="banner-box">
      <img :src="banner||bannerImg" alt="banner图">
    </div>
    <div class="content-box" v-if="type==='1'">
      <img class="logo-img" src="@/assets/images/logo.jpg" alt="logo">
      <p class="text">{{textFirst}}</p>
      <p class="text">{{textSecond}}</p>
      <img class="input-img" src="@/assets/images/market/button.png" alt="button">
      <p class="rule-text">活动规则 ></p>
    </div>
    <div class="after-box" v-else>
      <p class="user-text">优惠券礼包已放入 134****7890</p>
    </div>
  </div>
</template>
<script>
import bannerImg from '@/assets/images/market/banner.png'
export default {
  props: {
    bgColor: {
      type: String,
      default: '#f8c3ab'
    },
    type:{
      type:String,
      default:'1'
    },
    title: {
      type:String,
      default:''
    },
    banner: {
      type:String,
      default:bannerImg
    },
    textFirst:{
      type:String,
      default:'123'
    },
    textSecond:{
      type:String,
      default:'123'
    }
  },
  data(){
    return {
      bannerImg
    }
  }
}
</script>
<style src="./index.less" lang="less" scoped></style>

