<!--活动管理-活动详情-wx 传uuid-->
<template>
  <Tabs class="act-detail" :value="tabObj.tabVal" @on-click="tabschange">
    <TabPane label="基础信息" name="tab1">
      <p class="line-title">活动基础信息</p>
      <div class="line-list">
        <div class="line-item">
          <span class="line-tit">活动名称：</span>
          <span class="line-val">{{infoData.activityName}}</span>
        </div>
        <div class="line-item">
          <span class="line-tit">活动编码：</span>
          <span class="line-val">{{infoData.activityCode}}</span>
        </div>
        <div class="line-item">
          <span class="line-tit">活动类型：</span>
          <span class="line-val">{{activityName}}</span>
        </div>
      </div>
      <p class="line-title">奖励发放情况</p>
      <div class="line-list">
        <div v-if="!isCoupon">
          <p class="second-tit">赠送币</p>
          <div class="line-item">
            <span class="line-tit">已发放额度/活动总额度：</span>
            <span class="line-val">{{infoData.giftCurrency}}</span>
          </div>
        </div>
        <div v-else>
          <div v-for="(obj,index) in infoData.couponRewardList" :key="index">
            <p class="coupon-sub-tit" v-if="obj.rewardName">{{index+1}} . {{obj.rewardName}}</p>
            <div v-if="obj.coupon.length>0">
              <div class="coupon-list" v-for="(item ,i) in obj.coupon" :key="i-100">
                <p class="second-tit">优惠券-{{item.couponName}}</p>
                <div class="line-item">
                  <span class="line-tit">已发放额度/已使用额度/券总额度：</span>
                  <span class="line-val">{{item.amount}}</span>
                </div>
                <div class="line-item">
                  <span class="line-tit">已发放张数/已使用张数/券总张数：</span>
                  <span class="line-val">{{item.sheet}}</span>
                </div>
              </div>
            </div>
            <div v-else>
              未设置
            </div>
          </div>
        </div>
      </div>
      <p class="line-title" v-if="isJoin">活动参与情况</p>
      <div class="line-list" v-if="isJoin">
        <!-- 注册活动 -->
        <div class="line-item" v-if="infoData.activityType=='1'">
          <span class="line-tit">注册用户数：</span>
          <span class="line-val">{{infoData.registerUserCount || 0}}</span>
        </div>
        <!-- 充值活动 -->
        <div  v-if="infoData.activityType=='3'">
          <div class="line-item">
            <span class="line-tit">充值次数：</span>
            <span class="line-val">{{infoData.rechargeCount || 0}}</span>
          </div>
          <div class="line-item">
            <span class="line-tit">充值用户数：</span>
            <span class="line-val">{{infoData.rechargeUserCount || 0}}</span>
          </div>
          <div class="line-item">
            <span class="line-tit">充值金额：</span>
            <span class="line-val">{{infoData.rechargeAmount || 0}}</span>
          </div>
        </div>
        <!-- 推荐乘客 -->
        <div v-if="infoData.activityType=='2'">
          <div class="line-item">
            <span class="line-tit">推荐次数：</span>
            <span class="line-val">{{infoData.recommendCount || 0}}</span>
          </div>
          <div class="line-item">
            <span class="line-tit">推荐注册成功人数：</span>
            <span class="line-val">{{infoData.recommendRegisterCount || 0}}</span>
          </div>
          <div class="line-item">
            <span class="line-tit">推荐完成首单人数：</span>
            <span class="line-val">{{infoData.recommendFirstOrderCount || 0}}</span>
          </div>
        </div>
        <!-- 渠道红包 -->
        <div v-if="infoData.activityType=='5'">
          <div class="line-item">
            <span class="line-tit">分享用户数：</span>
            <span class="line-val">{{infoData.shareUserCount || 0}}</span>
          </div>
          <div class="line-item">
            <span class="line-tit">分享次数：</span>
            <span class="line-val">{{infoData.shareCount || 0}}</span>
          </div>
        </div>
        <!-- 行程分享 -->
        <div v-if="infoData.activityType=='6'">
          <div class="line-item">
            <span class="line-tit">种子用户数：</span>
            <span class="line-val">{{infoData.seedUserCount || 0}}</span>
          </div>
          <div class="line-item">
            <span class="line-tit">分享用户数：</span>
            <span class="line-val">{{infoData.shareUserCount || 0}}</span>
          </div>
          <div class="line-item">
            <span class="line-tit">分享次数：</span>
            <span class="line-val">{{infoData.shareCount || 0}}</span>
          </div>
        </div>
        <!-- 助力红包 -->
        <div v-if="infoData.activityType=='10'">
          <div class="line-item">
            <span class="line-tit">种子用户数：</span>
            <span class="line-val">{{infoData.seedUserCount || 0}}</span>
          </div>
          <div class="line-item">
            <span class="line-tit">助力用户数：</span>
            <span class="line-val">{{infoData.assistUserCount || 0}}</span>
          </div>
          <div class="line-item">
            <span class="line-tit">注册用户数：</span>
            <span class="line-val">{{infoData.registerUserCount || 0}}</span>
          </div>
          <div class="line-item">
            <span class="line-tit">完成首单用户数：</span>
            <span class="line-val">{{infoData.recommendFirstOrderCount || 0}}</span>
          </div>
        </div>
      </div>
      <Divider/>
      <div class="btn-box">
        <Button @click="cancelFun('infoForm')">关闭</Button>
        <Button type="primary" @click="tabObj.tabVal='tab2'" style="margin-left: 10px">下一步</Button>
      </div>
    </TabPane>
    <TabPane label="活动规则" name="tab2">
      <div class="line-list">
        <div class="line-item" v-if="isCity">
          <span class="line-tit">活动城市：</span>
          <span class="line-val">{{ruleData.cityName}}</span>
        </div>
        <div class="line-item" v-if="isCity">
          <span class="line-tit">活动时间：</span>
          <span class="line-val">{{ruleData.effectiveTime}}</span>
        </div>
        <div class="line-item" v-if="isPayTime">
          <span class="line-tit">发放时间：</span>
          <span
            class="line-val"
          >{{ruleData.isGrantImmediately?'立即发放':('固定时间发放: '+ruleData.grantTime)}}</span>
        </div>
        <div class="line-item" v-if="isUserGroup">
          <span class="line-tit">用户群：</span>
          <span class="line-val">{{ruleData.needUserGroup===1?'选择用户群':'全部用户群'}}</span>
          <div style="margin-left:66px;" v-if="ruleData.needUserGroup===1">
            <Table
              class="bottom15"
              style="width:600px;"
              border
              :columns="userGroupColumns"
              :data="ruleData.userGroups"
            ></Table>
          </div>
        </div>
        <div class="line-item" v-if="isBusinessLine">
          <span class="line-tit">业务线：</span>
          <span class="line-val">
            <span v-for="(val,index) in ruleData.businessTypeList" :key="val">{{val==='4'?'快车':val==='2'?'专车':'出租车'}} {{index == ruleData.businessTypeList.length-1?'':'/'}}</span>
          </span>
        </div>
        <div class="line-item" v-if="isBusinessLine && ruleData.businessTypeList.indexOf('4')>-1">
          <span class="line-tit">订单类型：</span>
          <span class="line-val">
            <span v-for="(val,index) in ruleData.userLimitList" :key="val">{{val==='1'?'实时':'预约'}}{{index == ruleData.userLimitList.length-1?'':'/'}}</span>
          </span>
        </div>
        <div class="line-item" v-if="isCommand">
          <span class="line-tit">领取口令：</span>
          <span class="line-val">{{ruleData.psword}}</span>
        </div>
        <div class="line-item" v-if="isLimit">
          <span class="line-tit">每人领取次数上限：</span>
          <span class="line-val">{{ruleData.maxRewardCount}}</span>
        </div>
        <div class="line-item" v-if="isLimit">
          <span class="line-tit">每人每天领取次数上限：</span>
          <span class="line-val">{{ruleData.maxDayRewardCount}}</span>
        </div>
        <div class="line-item" v-if="isShare">
          <span class="line-tit">每个行程最多领取次数上限：</span>
          <span class="line-val">{{ruleData.routemaxRewardCount}}</span>
        </div>
        <div class="line-item" v-if="isQuota">
          <span class="line-tit">活动奖励总额度：</span>
          <span class="line-val">{{ruleData.activityQuotaType===1?('限定额度 ( '+ ruleData.activityTotal+'元 ) '):'不限额度'}}</span>
        </div>
        <div class="line-item" v-if="isShare">
          <span class="line-tit">分享行程：</span>
          <span class="line-val">{{ruleData.shareRoute?'是':'否'}}</span>
        </div>
        <div class="line-item" v-if="!isCoupon">
          <span class="line-tit">奖励规则：</span>
          <Table
            class="bottom15"
            style="width:400px;margin-left:70px;"
            border
            :columns="awardColumns"
            :data="ruleData.ladder"
          ></Table>
        </div>
        <!-- 优惠券 -->
        <div class="line-item" v-if="isCoupon">
          <span class="line-tit">活动奖励：</span>
          <span class="line-val">优惠券</span>
        </div>
        <div v-if="isCoupon">
          <div v-for="(obj,i) in ruleData.couponList" :key="i">
            <p v-if="obj.name">{{i+1}} . {{obj.name}} :</p>
            <ul class="coupon-list padleft50" v-if="obj.list.length>0">
              <li v-for="(item,index) in obj.list" :key="index">
                <div class="coupon-item">
                  <span class="index-num">{{index+1}}.</span>
                  <div class="coupon-left">
                    <div class="small-left" v-if="item.templateType===1">
                      <p class="fontsize18" style="color:#2D8cF0">{{item.discount}}折</p>
                      <p v-if="item.needCondition	">最高抵扣 {{item.highestMoney}} 元</p>
                      <p v-else>不限门槛</p>
                    </div>
                    <div class="small-left" v-else>
                      <p class="fontsize18" style="color:#2D8cF0">{{item.couponMoney}}元</p>
                      <p v-if="item.needCondition	">满 {{item.conditionMoney}} 可用</p>
                      <p v-else>不限门槛</p>
                    </div>
                    <div class="small-right">
                      <span class="coupon-icon" v-if="item.templateType===1">折扣券</span>
                      <span class="coupon-icon" v-else>抵扣券</span>
                      <p class="coupon-name">{{item.couponName}}</p>
                    </div>
                  </div>
                  <ul class="coupon-right">
                    <li v-if="obj.isEvery">
                      <span class="line-tit">每次奖励券张数：</span>
                      <span class="line-val">{{item.perRewardNum}}</span>
                    </li>
                    <li>
                      <span class="line-tit">发放总额度(元)：</span>
                      <span class="line-val">{{item.totalRewardAmount}}</span>
                    </li>
                    <li>
                      <span class="line-tit">发券总张数：</span>
                      <span class="line-val">{{item.totalCouponNum}}</span>
                    </li>
                    <li>
                      <span class="line-tit">券有效期：</span>
                      <span class="line-val">{{item.validityType===1?('固定期限'):('动态有效期')}}</span>
                    </li>
                    <li v-if="item.validityType===1">
                      <span class="line-tit">固定期限：</span>
                      <span class="line-val">{{item.startTime}} 至 {{item.endTime}}</span>
                    </li>
                    <li v-else>
                      <span class="line-tit">动态有效期：</span>
                      <span class="line-val">{{item.effectiveDays}} 天</span>
                    </li>
                    <li>
                      <span class="line-tit">使用城市：</span>
                      <span class="line-val">{{item.useCityName}}</span>
                    </li>
                    <li>
                      <span class="line-tit">使用时段：</span>
                      <span class="line-val">{{item.useLimitBeginTime}} 至 {{item.useLimitEndTime}}</span>
                    </li>
                    <li>
                      <span class="line-tit">券模板名称：</span>
                      <span class="line-val">{{item.templateName}}</span>
                    </li>
                    <li>
                      <span class="line-tit">券模板编码：</span>
                      <span class="line-val">{{item.templateCode}}</span>
                    </li>
                    <li>
                      <span class="line-tit">业务线：</span>
                      <span class="line-val">
                        <!-- <span>{{item.businessTypeList.join('、')}}</span> -->
                        <span v-for="(val,index) in item.businessTypeList" :key="val">{{businessLineMap[val]}} {{index == item.businessTypeList.length-1?'':'/'}}</span>
                      </span>
                    </li>
                    <li>
                      <span class="line-tit">订单类型：</span>
                      <span class="line-val">
                        <!-- <span>{{item.userLimitList.join('、')}}</span> -->
                        <span v-for="(val,index) in item.userLimitList" :key="val">{{orderMap[val]}} {{index == item.userLimitList.length-1?'':'/'}}</span>
                      </span>
                    </li>
                  </ul>
                </div>
                <!-- 奖励方式 -->
                <div v-if="obj.isAwardType">
                  <div class="line-item">
                    <span class="line-tit">奖励方式：</span>
                    <span class="line-val">{{item.couponRewardType===1?'每单奖励':'阶梯奖励'}}</span>
                  </div>
                  <div v-if="item.couponRewardType===1 && item.ladder && item.ladder[0]" style="margin-left:74px;">
                    {{obj.awardTypeList.onlyStart}}
                    {{item.ladder[0].ladderValue}}
                    {{obj.awardTypeList.onlyMiddle}}
                    {{item.ladder[0].rewardValue}}
                    {{obj.awardTypeList.onlyEnd}}
                  </div>
                  <Table
                    v-if="item.couponRewardType===2"
                    style="width:340px;margin-left:74px;"
                    border
                    :columns="obj.awardTypeList.ladderColumns"
                    :data="item.ladder"
                  ></Table>
                </div>
                <!-- 限定时段，限定区域 -->
                <div v-if="isBusinessLine"> 
                  <div class="line-item bottom15" v-if="item.activityLimitTime">
                    <span class="line-tit">限定时段：</span>
                    <span class="line-val">{{item.startLimitTime}} 至 {{item.endLimitTime}}</span>
                  </div>
                  <div class="line-item" v-if="item.activityLimitArea">
                    <span class="line-tit">限定区域：</span>
                    <span class="line-val">{{item.electronicCrawlName}}</span>
                  </div>
                </div>
              </li>
            </ul>
            <p v-else class="padleft50">未设置</p>
            <!-- 助力活动奖励方式 -->
            <div v-if="infoData.activityType=='10' && obj.list.length>0"  class="padleft50">
              <div class="line-item">
                <span class="line-tit">奖励方式：</span>
                <span class="line-val">{{obj.award.couponRewardType===1?'每单奖励':'阶梯奖励'}}</span>
              </div>
              <div v-if="obj.award.couponRewardType===1 && obj.award.ladder && obj.award.ladder[0]" style="margin-left:74px;">每加入助力团{{obj.award.ladder[0].ladderValue}}名新用户，奖励{{obj.award.ladder[0].rewardValue}}次</div>
              <Table
                v-if="obj.award.couponRewardType===2"
                style="width:340px;margin-left:74px;"
                border
                :columns="ladderColumns"
                :data="obj.award.ladder"
              ></Table>
            </div>
          </div>
        </div>
        <!-- 活动说明 -->
        <Divider v-if="isActivityRule"/>
        <div class="line-item top15" v-if="isCoupon2">
          <span class="line-tit">活动说明：</span>
          <span class="line-val max60">{{ruleData.activityDesc||'未设置'}}</span>
        </div>
        <!-- 活动规则 -->
        <div class="line-item top15" v-if="isActivityRule">
          <span class="line-tit">活动规则：</span>
          <span class="line-val max60">{{ruleData.activityRule||'未设置'}}</span>
        </div>
      </div>
      <Divider/>
      <div class="btn-box">
        <Button @click="cancelFun('infoForm')">关闭</Button>
        <Button type="primary" @click="tabObj.tabVal='tab1'" style="margin-left: 10px">上一步</Button>
        <Button v-if="isTab3" type="primary" @click="tabObj.tabVal='tab3'" style="margin-left: 10px">下一步</Button>
      </div>
    </TabPane>
    <TabPane v-if="isTab3" label="页面设置" name="tab3">
      <p class="line-title">领券前落地页设置</p>
      <div class="preview-out">
        <before-land type="1" 
          :title="setData.beforeLandingPageTitle"
          :banner="setData.beforeLandingPageBanner"
          :textFirst="setData.beforeLandingCopywriting[0]"
          :textSecond="setData.beforeLandingCopywriting[1]"
          :bgColor="setData.beforeLandingPageBgcolor">
        </before-land>
        <div class="line-list">
          <div class="line-item">
            <span class="line-tit">页面标题：</span>
            <span class="line-val">{{setData.beforeLandingPageTitle}}</span>
          </div>
          <div class="line-item img-out">
            <span class="line-tit">banner图：</span>
            <img v-if="setData.beforeLandingPageBanner" :src="setData.beforeLandingPageBanner" alt="banner" style="height:120px;">
            <span v-else>未设置</span>
          </div>
          <div class="line-item">
            <span class="line-tit">背景颜色：</span>
            <ColorPicker v-if="setData.beforeLandingPageBgcolor" v-model="setData.beforeLandingPageBgcolor" disabled size="small"/>
            <span v-else>未设置</span>
          </div>
          <div class="line-item top15" style="display:flex">
            <span class="line-tit">活动文案：</span>
            <div>
              <p>
                <span class="line-tit">第一行：</span>
                <span>{{setData.beforeLandingCopywriting[0] || '未设置'}}</span>
              </p>
              <p>
                <span class="line-tit">第二行：</span>
                <span>{{setData.beforeLandingCopywriting[1] || '未设置'}}</span>
              </p>
            </div>
          </div>
          <div class="line-item top15">
            <span class="line-tit">活动规则：</span>
            <Input
              v-model="setData.beforeLandingPageRule"
              disabled
              type="textarea"
              :autosize="true"
              style="width:450px"
            />
          </div>
          <div class="line-item top15"  v-if="infoData.activityType=='5'">
            <span class="line-tit">落地页链接：</span>
            <span class="line-val">{{setData.beforeLandingPageUrl}}</span>
          </div>
        </div>
      </div>
      <Divider/>
      <p class="line-title">领券后落地页设置</p>
      <div class="preview-out">
        <before-land type="2"
          :title="setData.afterLandingPageTitle"
          :banner="setData.afterLandingPageBanner"
          :textFirst="setData.afterLandingCopywriting[0]"
          :textSecond="setData.afterLandingCopywriting[1]"
          :bgColor="setData.afterLandingPageBgcolor"
        ></before-land>
        <div class="line-list">
          <div class="line-item">
            <span class="line-tit">页面标题：</span>
            <span class="line-val">{{setData.afterLandingPageTitle}}</span>
          </div>
          <div class="line-item img-out">
            <span class="line-tit">banner图：</span>
            <img v-if="setData.afterLandingPageBanner" :src="setData.afterLandingPageBanner" alt="banner" style="height:120px;">
            <span v-else>未设置</span>
          </div>
          <div class="line-item">
            <span class="line-tit">背景颜色：</span>
            <ColorPicker v-if="setData.afterLandingPageBgcolor" v-model="setData.afterLandingPageBgcolor" disabled size="small"/>
            <span v-else>未设置</span>
          </div>
          <div class="line-item top15" style="display:flex">
            <span class="line-tit">活动文案：</span>
            <div>
              <p>
                <span class="line-tit">第一行：</span>
                <span>{{setData.afterLandingCopywriting[0] || '未设置'}}</span>
              </p>
              <p>
                <span class="line-tit">第二行：</span>
                <span>{{setData.afterLandingCopywriting[1] || '未设置'}}</span>
              </p>
            </div>
          </div>
          <!-- <div class="line-item top15" v-if="infoData.activityType=='5'">
            <span class="line-tit">落地页链接：</span>
            <span class="line-val">{{setData.afterLandingPageUrl}}</span>
          </div> -->
        </div>
      </div>
      <Divider/>
      <p class="line-title">分享设置</p>
      <div class="preview-out share-out">
        <share 
          type="1"
          :shareIcon="setData.shareIcon"
          :subTitle="setData.shareSubTitle"
          :title="setData.shareTitle">
        </share>
        <div class="line-list">
          <p class="second-tit">分享给朋友</p>
          <div class="line-item">
            <span class="line-tit">主标题：</span>
            <span class="line-val">{{setData.shareTitle}}</span>
          </div>
          <div class="line-item">
            <span class="line-tit">副标题：</span>
            <span class="line-val">{{setData.shareSubTitle}}</span>
          </div>
          <div class="line-item img-out">
            <span class="line-tit">分享图标：</span>
            <img v-if="setData.shareIcon" :src="setData.shareIcon" alt="banner" style="height:60px;">
            <span v-else>未设置</span>
          </div>
        </div>
      </div>
      <div class="preview-out share-out">
        <share 
          type="2"
          :shareIcon="setData.shareFriendsIcon"
          :title="setData.shareFriendsTitle">
        </share>
        <div class="line-list">
          <p class="second-tit">朋友圈分享</p>
          <div class="line-item">
            <span class="line-tit">标题：</span>
            <span class="line-val">{{setData.shareFriendsTitle}}</span>
          </div>
          <div class="line-item img-out" >
            <span class="line-tit">分享图标：</span>
            <img v-if="setData.shareFriendsIcon" :src="setData.shareFriendsIcon" alt="banner" style="height:60px;">
            <span v-else>未设置</span>
          </div>
        </div>
      </div>
      <Divider/>
      <div class="btn-box">
        <Button @click="cancelFun('infoForm')">关闭</Button>
        <Button type="primary" @click="tabObj.tabVal='tab2'" style="margin-left: 10px">上一步</Button>
      </div>
    </TabPane>
  </Tabs>
</template>
<script>
import { axiosDetail } from "@/api/market";
import { activityTypeMap,orderMap,businessLineMap } from "../fields";
import { cacheData } from "./fields";
import beforeLand from "../new-activity/preview/before-land.vue";
import share from "../new-activity/preview/share.vue";
export default {
  data() {
    return {
      ...cacheData,
      orderMap,
      businessLineMap,
      tabObj: {
        tabVal: "tab1"
      },
    };
  },
  components: {
    beforeLand,
    share
  },
  computed: {
    isJoin(){
      // 活动参与情况
      let type = this.infoData.activityType;
      let arr = ["1", "2", "3", "5", "6","10"];
      let result = arr.indexOf(type) > -1 ? true : false;
      return result;
    },
    activityName() {
      let key = Number(this.infoData.activityType);
      return activityTypeMap[key];
    },
    isTab3() {
      let type = this.infoData.activityType;
      let result = type === "5" || type === "6" ? true : false;
      return result;
    },
    awardLabel(){
      let type = this.infoData.activityType;
      switch (type) {
        case '2':
          return '推荐成功奖励'
        case '10':
          return '助力成功奖励'
        default: 
          return  '活动奖励'
      }
    },
    isCity() {
      // 活动城市，活动时间：不是定向发券，就有城市
      let result = this.infoData.activityType === "4" ? false : true;
      return result;
    },
    isPayTime() {
      // 发放时间，发券通知：只有定向发券有
      let result = this.infoData.activityType === "4" ? true : false;
      return result;
    },
    isUserGroup() {
      // 用户群：注册活动和客服发券没有
      let type = this.infoData.activityType;
      let result = type && type !== "1" && type !== "8" ? true : false;
      return result;
    },
    isBusinessLine() {
      // 业务线、限定时段区域，只有冒泡发券有
      let result = this.infoData.activityType === "9" ? true : false;
      return result;
    },
    isCommand() {
      // 领取口令，只有口令红包有
      let result = this.infoData.activityType === "7" ? true : false;
      return result;
    },
    isLimit() {
      // 每人领取次数上限、每人每天领取次数上限：充值活动、渠道红包、行程分享、口令红包、冒泡发券有
      let type = this.infoData.activityType;
      let arr = ["3", "5", "6", "7", "9"];
      let result = arr.indexOf(type) > -1 ? true : false;
      return result;
    },
    isQuota() {
      // 活动奖励总额度：528客服发券没有,618
      // let result = this.infoData.activityType === "8" ? false : true;
      return true;
    },
    isCoupon() {
      // 优惠券，只有充值活动没有；奖励规则，只有充值活动有
      let result = this.infoData.activityType === "3" ? false : true;
      return result;
    },
    isCoupon2() {
      // 优惠券2、奖励方式、活动说明、：只有推荐乘客有
      let result = this.infoData.activityType === "2" ? true : false;
      return result;
    },
    isActivityRule(){
      //活动规则,优惠券1有没有奖励方式,推荐乘客和助力活动有
      let type = this.infoData.activityType
      let result = type === "2" || type === "10" ? true : false;
      return result;
    },
    isShare() {
      // 用户分享奖励、每个行程最多领取次数上限、行程分享，只有行程分享有
      let result = this.infoData.activityType === "6" ? true : false;
      return result;
    },
    isRegisterAward() {
      // 注册成功奖励,优惠券3（只有助力奖励有）
      let result = this.infoData.activityType === "10" ? true : false;
      return result;
    }
  },
  mounted() {
    this.getDetailInfo()
  },
  methods: {
    cancelFun() {
      this.$store.commit('setChangeTab',this.$route)
      this.$router.push("/marketing/activity-manage");
    },
    // 切换tab
    tabschange(name) {
      this.tabObj.tabVal = name;
    },
    // 获取详情信息
    getDetailInfo() {
      axiosDetail({ activityUuid: this.$route.params.id }).then(res => {
        if (res.data.success) {
          let resData = res.data.data||{};
          this.infoData = resData.basicInformation;
          this.ruleData = resData.rule
          this.setData = resData.pageSettings;
          let type = String(this.infoData.activityType)
          this.infoData.activityType = type
          // 如果有用户群，用户群列表-用户群类型转换
          if(this.ruleData.needUserGroup && this.ruleData.needUserGroup===1){
            let list = this.ruleData.userGroups
            list.forEach(item => {
              item.userGroupType=item.userGroupType===1?'excel模板导入':'条件筛选'
            });
            this.$set(this.ruleData,'userGroups',list)
          }
          // 充值活动，表值添加奖励类型
          if(!this.isCoupon){
            let arr = this.ruleData.ladder
            arr.forEach(item=>{
              item.type = '赠送币'
            })
            this.$set(this.ruleData,'ladder',arr)
          }else{
            let couponList = []
            if(type=='2'){
              // 推荐乘客
              // 注册成功奖励、首单奖励
              couponList.push({
                name: '注册成功奖励',
                list: this.ruleData.activityTemplateCfgDto,
                isEvery: false,
                isAwardType: true,
                awardTypeList: this.awardTypeLabel1
              })
              couponList.push({
                name: '首单奖励',
                list: this.ruleData.firstOrderTemplateCfg,
                isEvery: false,
                isAwardType: true,
                awardTypeList: this.awardTypeLabel2
              })
            } else if(type=='6'){
              // 行程分享
              // 空，分享用户奖励
              couponList.push({
                name: '',
                list: this.ruleData.activityTemplateCfgDto,
                isEvery: true,
                isAwardType: false
              })
              couponList.push({
                name: '分享用户奖励',
                list: this.ruleData.shareTemplateCfgList,
                isEvery: false,
                isAwardType: true,
                awardTypeList: this.awardTypeLabel1
              })
            }else if(type=='10'){
              // 助力活动
              // 加入助力团奖励、注册成功奖励、首单奖励
              couponList.push({
                name: '加入助力团奖励',
                list: this.ruleData.succesAssistTempletsLadder.templateCfgList,
                isEvery: true,
                isAwardType: false,
                award: this.ruleData.succesAssistTempletsLadder
              })
              let obj2 = this.ruleData.successAwardTempletsLadder
              couponList.push({
                name: '注册成功奖励',
                list: obj2?obj2.templateCfgList:[],
                isEvery: true,
                isAwardType: false,
                award: this.ruleData.successAwardTempletsLadder||{}
              })
              let obj3 = this.ruleData.firstOrderTempletsLadder
              couponList.push({
                name: '首单奖励',
                list: obj3?obj3.templateCfgList:[],
                isEvery: true,
                isAwardType: false,
                award: this.ruleData.firstOrderTempletsLadder||{}
              })
            }else{
              // 其他活动
              // 奖励名称空，只有列表
              couponList.push({
                name: '',
                list: this.ruleData.activityTemplateCfgDto,
                isEvery: true,
                isAwardType: false
              })
            }
            this.$set(this.ruleData,'couponList',couponList)
          }
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    }
  },
  beforeRouteUpdate(to,from,next){
    this.getDetailInfo()
    this.tabObj.tabVal = 'tab1';
    next()
  }
};
</script>
<style lang="less" scoped src="../activity.less"></style>
<style lang="less" scoped>
.coupon-sub-tit{
  color:#333;
  margin-left: -15px;
}
.line-title {
  font-size: 15px;
  line-height: 22px;
  color: #333;
  margin-bottom: 15px;
  &::before {
    display: inline-block;
    content: "";
    width: 3px;
    height: 13px;
    background: #2d8cf0;
    margin-right: 5px;
    position: relative;
    top: 1px;
  }
}
.img-out{
  margin:15px 0;
}
.line-list {
  padding-left: 30px;
  margin-bottom: 10px;
  line-height: 26px;
}
.preview-out{
  position: relative;
  min-height:520px;
  .line-list{
    margin-left:310px;
  }
  &.share-out{
    min-height:250px;
  }
}
.line-tit {
  margin-right: 15px;
  color: #3b465f;
}
.act-detail {
  font-size: 13px;
  .coupon-left,
  .coupon-right {
    height: 100px;
    min-height: 100px;
  }
  .coupon-right {
    display: flex;
    flex-wrap: wrap;
  }
  .small-left {
    padding-top: 25px;
  }
  .small-right {
    padding-top: 30px;
  }
  .coupon-left {
    min-width: 300px;
  }
  .coupon-list {
    min-width: 900px;
    font-size: 12px;
  }
}
.padleft50{
  padding-left: 50px;
}
.second-tit {
  font-size: 14px;
  line-height: 30px;
  color: #333;
  position: relative;
  margin-top: 10px;
  &::before {
    content: "";
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #2d8cf0;
    position: absolute;
    font-weight: bold;
    left: -10px;
    top: 13px;
  }
}
.line-val {
  margin-right: 50px;
  &.max60{
    max-width: 800px;
    display: inline-block;
    vertical-align: top;
  }
}
.btn-box {
  width: 300px;
  margin: 0 auto;
}
</style>

