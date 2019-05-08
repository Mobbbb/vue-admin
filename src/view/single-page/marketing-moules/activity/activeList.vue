<!--注册活动、推荐乘客-->
<template>
  <div>
    <div v-show="activityData.length!==0" style="max-height:550px;overflow:auto;">      
      <div class="activeList" v-if="tabsIndex!=='2'">
        <Card class="item" v-for="(item, index) in activityData" :key="index">
          <div style="display:flex;width:100%;">
            <div class="item-left">
              <p>{{item.actType}}</p>
              <p class="const">{{item.rewardSum}}元</p>
            </div>
            <div class="item-right">
              <span class="item-status">{{item.Status}}</span>
              <ul>
                <li>{{item.activityName}}</li>
                <li>针对城市：{{item.cityName}}</li>
                <li v-if="item.activityType!==3">含{{item.giftmoney}}个赠送币、{{item.discountNum}}张折扣券、{{item.deductionNum}}张抵扣券</li>
                <li>在线时间：{{item.beginDate}}至{{item.endDate}}</li>
                <li>已发送：{{item.sendNum}}</li>
                <li>优先级：{{item.level}}</li>
              </ul>
              <div class="item-bottom">
                <span><Icon type="md-document" size='26' color='#80ff80' @click="detail(item.uuid, item.activityType)"/></span>
                <span><Icon type="md-close-circle" size='26' color='#ff4d4d' @click="isShowClose(item)"/></span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div class="ruleBox" v-else style="max-height:550px;overflow:auto;">
        <div class="item" v-for="(item, index) in activityData" :key="index">
          <div class="item-top">
            <img :src="item.revarchargeBanner" alt="">
          </div>
          <div class="item-bottom">
            <span class="item-status">{{item.Status}}</span>
            <p>{{item.activityName}}<span @click="ruleDetail(item.uuid)" style="color:#57a3f3;padding:0 10px;cursor:pointer">(查看充值规则)</span></p>
            <p>针对城市：{{item.cityName}}</p>
            <p>在线时间：{{item.beginDate}}至{{item.endDate}}</p>
            <p>优先级：{{item.level}}</p>
            <div class="closeBox">
              <span><Icon type="md-document" size='26' color='#80ff80' @click="detail(item.uuid, item.activityType)"/></span>
              <span><Icon type="md-close-circle" size='26' color='#ff4d4d' @click="isShowClose(item)"/></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="noDataText" v-show="activityData.length===0">
      <div class="demo-spin-container" v-show="isLoading">
        <Spin fix></Spin>
      </div>
      <p v-show="!isLoading">暂无数据</p>  
    </div>    
    <Modal v-model="isShow" :mask-closable='false'>
      <p class="closeTxt">您确定要关闭{{activeName}}吗？</p>
      <div slot="footer">
        <Button type="primary" size="large" long @click="close">确定关闭</Button>
      </div>
    </Modal>
    <Modal v-model="isShowRule" :mask-closable='false'>
      <table cellspacing="0" class="Table" style="margin: 20px auto;">
        <thead>
          <td width='150'>充值金额</td>
          <td width='150'>奖励类型</td>
          <td width='150'>金额</td>
        </thead>
        <tbody>
          <tr v-for="(item, index) in detailData" :key="index">
            <td>{{item.revarchargeMoney}}</td>
            <td>
              {{item.rewardKind}}
            </td>
            <td>
              <div v-if="item.rewardKind==='赠送币'">{{item.rewardMoney}}</div>
              <div v-else>
                {{item.couponInfo}}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Modal>      
  </div>  
</template>
<script>
import { closeActivity, rechargeRule } from '@/api/passenger'
export default {
  props:{
    tabsIndex: {
      type: String,
      default: '0'
    },
    activityData: {
      type: Array,
      default: ()=>{
        return []
      }
    },
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 15
    },
    current: {
      type: Number,
      default: 1
    },
    isLoading:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isShow: false,
      isShowRule: false,
      activeName: '******',
      uuid: '',
      detailData: []
    }
  },
  methods:{
    isShowClose(item){
      if(item.activityStatus === 4){
        this.$Message.warning('该活动已关闭')
      } else {
        this.activeName = item.activeName
        this.uuid = item.uuid
        this.isShow = true
      }      
    },
    detail(uuid, type){
      switch(this.tabsIndex){
        case '0':
          this.$router.push({name:'activity-register', params:{ id: uuid}}) // 注册活动详情
          break
        case '1':
          if(type===2){            
            this.$router.push({name:'activity-passenger', params:{ id: uuid}}) // 乘客奖励详情
          } else if( type === 3) {
            this.$router.push({name:'activity-driver', params:{ id: uuid}}) // 司机奖励详情
          }
          break
        case '2':
          this.$router.push({name:'activity-recharge', params:{ id: uuid}}) // 充值奖励详情
          break
      }
    },
    close(){
      let params = {
        activityUuid: this.uuid,
        activityStatus: 4
      }
      closeActivity(params).then(res => {
        if(res.data.success){
          this.$Message.success('操作成功')
          this.$emit('closeSuccess')
          this.isShow = false
        }
      })      
    },
    ruleDetail(id){
      this.isShowRule = true
      let params = {
        activityUuid: id
      }
      rechargeRule(params).then(res => {
        if(res.data.success){
          this.detailData = res.data.data
          this.detailData.forEach((v, k) => {
            if(v.rewardKind === 2){
              v.rewardKind = '优惠券'
              v.couponInfo = v.rewardSum + '元(共'+ (v.discountNum + v.deductionNum) +'张券，含'+ v.discountNum +"张折扣券、"+ v.deductionNum +'张抵扣券)'
            } else if(v.rewardKind === 1){
              v.rewardKind = '赠送币'
            }
          })
          this.detailData.sort(this.compare("revarchargeMoney"))
        }
      })
    },
    compare(propertyName){ // 充值规则排序
      return function(obj1, obj2){
        let value1 = obj1[propertyName]
        let value2 = obj2[propertyName]
        if(value1 < value2){
          return -1
        } else if (value1 > value2){
          return 1
        } else {
          return 0
        }
      }      
    }
  }
}
</script>
<style lang="less">
.noDataText{
  min-height: 550px;
  text-align: center;
  line-height: 550px;;
}
.activeList{
  max-height: 550px;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  .item{
    display: flex;
    border: 1px solid #dcdee2;
    width: 480px;
    height: 150px;
    margin: 10px;
    position: relative;
    padding: 0;
    .item-left{
      border-right: 1px solid #dcdee2;
      width: 115px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      padding-right: 16px;
      p{
        text-align: center;
        margin: 10px 0;
      }
      .const{
        color: red;
        font-size: 24px;
        font-weight: bold;
      }
    }
    .item-right{
      padding-left: 16px;
      height: 100%;
      .item-status{
        position: absolute;
        right: 15px;
        color: #ffffff;
        background: #57a3f3;
        border-radius: 5px;
        padding: 5px 10px;
      }
      ul {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
      .item-bottom{
        position: absolute;
        bottom: 10px;
        right: 5px;
        span{
          display: inline-block;
          border-radius: 50%;
          width: 25px;
          height: 25px;
          margin-right: 10px;
          cursor: pointer;
        }
      }
    }    
  }
}
.ruleBox{
  height: 600px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  .item{
    border: 1px solid #dcdee2;
    width: 450px;
    height: 350px;
    margin: 10px 1%;
    .item-top{
      height: 250px;
      padding: 10px;
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
.demo-spin-container{
  display: inline-block;
  width: 200px;
  height: 100px;
  position: relative;
}
.ivu-card-body{
  width: 100%;
  font-size: 12px;
}
.Table{
  text-align: center;
  border-collapse: collapse;
  border: 1px solid;
  margin-left: 100px;
  td{
    border: 1px solid;
    height: 50px;
  }
}
</style>
