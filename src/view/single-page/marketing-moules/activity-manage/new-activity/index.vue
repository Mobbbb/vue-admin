<template>
  <div class="new-activity">
    <Tabs :value="tabValue" @on-click="tabschange">
      <TabPane label="基础信息" name="tab1">
        <Form
          class="first-tab-form"
          ref="infoForm"
          :model="infoData"
          :rules="isEdit?{}:infoDataRules"
          :label-width="120">
          <FormItem label="活动名称：" prop="activityName">
            <Input
              v-model="infoData.activityName"
              :disabled="isEdit"
              :maxlength="20"
              placeholder="请输入活动名称"
              style="width:240px;"
            ></Input>
            <span class="counter">( {{infoData.activityName.length}}/20 )</span>
          </FormItem>
          <FormItem label="活动类型：" prop="activityType">
            <Select
              v-model="infoData.activityType"
              :disabled="isEdit"
              placeholder="请选择活动类型"
              style="width:240px;"
            >
              <Option
                v-for="item in activityTypeList"
                :key="item.value"
                :value="item.value"
              >{{item.label}}</Option>
            </Select>
          </FormItem>
        </Form>
        <Divider/>
        <div class="btn-box">
          <Button @click="cancelFun('infoForm')">取消</Button>
          <Button type="primary" @click="handleSubmitInfo('infoForm')" style="margin-left: 10px">下一步</Button>
        </div>
      </TabPane>
      <TabPane :disabled="isTab2Dis" label="活动规则" name="tab2">
        <Form
          class="second-tab-form"
          ref="ruleForm"
          :model="ruleData"
          :rules="isEdit?{}:ruleDataRules"
          :label-width="180">
          <!-- 活动城市() -->
          <FormItem v-if="isCity" label="活动城市：" prop="cityArray">
            <Select
              v-model="ruleData.cityArray"
              :disabled="isEdit"
              filterable
              multiple
              clearable
              @on-change="changeCity"
              placeholder="请选择活动城市"
              style="width:240px;"
            >
              <Option value="1">全国所有城市</Option>
              <!-- <Option value="2">全部已开通城市</Option> -->
              <Option v-for="item in cityList" :key="item.cityID" :value="item.cityID">{{item.city}}</Option>
            </Select>
          </FormItem>
          <!-- 活动时间 -->
          <FormItem v-if="isCity" label="活动时间：" prop="time">
            <!-- <DatePicker
              clearable
              :disabled="isEdit"
              type="datetimerange"
              :options="optionsTime"
              :editable="false"
              style="width:300px"
              placeholder="请输入活动时间"
              v-model="ruleData.time"
              @on-change="changeTime"
            ></DatePicker> -->
            <el-date-picker
              clearable
              size="small"
              :disabled="isEdit"
              v-model="ruleData.time"
              :picker-options="optionsTime"
              :editable="false"
              type="datetimerange"
              align="left"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width:360px"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              @change="changeTime"></el-date-picker>
          </FormItem>
          <!-- 发放时间 -->
          <div v-if="isPayTime" class="inline-form-item">
            <FormItem label="发放时间：" prop="isGrantImmediately">
              <RadioGroup v-model="ruleData.isGrantImmediately" >
                <Radio :disabled="isEdit" :label="1">立即发放</Radio>
                <Radio :disabled="isEdit" :label="0">固定时间发放</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem
              prop="startGrantTime"
              v-if="ruleData.isGrantImmediately===0"
              class="no-left-margin"
            >
              <DatePicker
                :disabled="isEdit"
                :editable="false"
                v-model="ruleData.startGrantTime"
                :options="optionsTime"
                type="datetime"
                placeholder="请选择开始时间"
                style="width: 200px"
                @on-change="chooseGrantTime"
              ></DatePicker>
            </FormItem>
          </div>
          <!-- 用户群 -->
          <div v-if="isUserGroup">
            <FormItem label="用户群：" prop="needUserGroup">
              <RadioGroup v-model="ruleData.needUserGroup" class="right15">
                <Radio :disabled="isEdit" :label="0">全部用户</Radio>
                <Radio :disabled="isEdit" :label="1">选择用户群</Radio>
              </RadioGroup>
              <Button
                v-show="ruleData.needUserGroup===1 && !isEdit"
                @click="showUserGroupModdal = true"
                type="primary"
                size="small"
              >查看用户群</Button>
            </FormItem>
            <FormItem
              v-if="ruleData.needUserGroup===1"
              class="no-left-margin table-item"
              prop="selectUserGroup"
            >
              <!-- <span>去重后共1000人</span> -->
              <Table width="700" :columns="userGroupColumns" :data="ruleData.selectUserGroup"></Table>
            </FormItem>
          </div>
          <!-- 业务线 -->
          <div v-if="isBusinessLine">
            <FormItem label="业务线：" prop="businessTypeList">
              <CheckboxGroup v-model="ruleData.businessTypeList" >
                <Checkbox :disabled="isEdit" label="4">快车</Checkbox>
                <Checkbox :disabled="isEdit" label="2">专车</Checkbox>
                <Checkbox :disabled="isEdit" label="1">出租车</Checkbox>
              </CheckboxGroup>
            </FormItem>
            <!-- 订单类型 -->
            <FormItem v-if="ruleData.businessTypeList.indexOf('4')>-1" label="订单类型" prop="userLimitList">
              <CheckboxGroup v-model="ruleData.userLimitList" >
                <Checkbox :disabled="isEdit" label="1">实时</Checkbox>
                <Checkbox :disabled="isEdit" label="2">预约</Checkbox>
              </CheckboxGroup>
            </FormItem>
          </div>
          <!-- 领取口令 -->
          <FormItem v-if="isCommand" label="领取口令：" prop="psword">
            <Input
              v-model="ruleData.psword"
              :maxlength="20"
              :disabled="isEdit"
              placeholder="请输入领取口令"
              style="width:240px;"
            ></Input>
            <span class="counter">( {{ruleData.psword.length}}/20 )</span>
          </FormItem>
          <!-- 每人领取次数上限 -->
          <FormItem v-if="isLimit" label="每人领取次数上限：" prop="maxRewardCount">
            <InputNumber
              :min="1"
              :disabled="isEdit"
              v-model="ruleData.maxRewardCount"
              placeholder="请输入"
              style="width:100px;vertical-align:top;"
            ></InputNumber>
          </FormItem>
          <!-- 每人每天领取次数上限 -->
          <FormItem v-if="isLimit" label="每人每天领取次数上限：" prop="maxDayRewardCount">
            <InputNumber
              :min="1"
              :disabled="isEdit"
              v-model="ruleData.maxDayRewardCount"
              placeholder="请输入"
              style="width:100px;vertical-align:top;"
            ></InputNumber>
          </FormItem>
          <!-- 每个行程最多领取次数上限 -->
          <FormItem v-if="isShare" label="每个行程最多领取次数上限：" prop="routemaxRewardCount">
            <InputNumber
              :min="1"
              :disabled="isEdit"
              v-model="ruleData.routemaxRewardCount"
              placeholder="请输入"
              style="width:100px;vertical-align:top;"
            ></InputNumber>
          </FormItem>
          <!-- 活动奖励总额度 -->
          <div v-if="isQuota" class="inline-form-item">
            <FormItem label="活动奖励总额度：" prop="activityQuotaType">
              <Select v-model="ruleData.activityQuotaType" placeholder="请选择" style="width:120px;" :disabled="isEdit?(ruleData.activityQuotaTypeCopy===2?true:false):false">
                <Option :value="2">不限额度</Option>
                <Option :value="1">限定额度</Option>
              </Select>
            </FormItem>
            <FormItem v-if="ruleData.activityQuotaType===1" prop="activityTotal" class="no-left-margin">
              <InputNumber
                :min="1"
                v-model="ruleData.activityTotal"
                placeholder="总额度"
                style="width:100px;vertical-align:top;"
              ></InputNumber>元
            </FormItem>
          </div>
          <!-- 分享行程 -->
          <FormItem v-if="isShare" prop="shareRoute" class="margin30">
            <Checkbox :disabled="isEdit" :true-value="1" :false-value="0" v-model="ruleData.shareRoute">分享行程</Checkbox>
            <span class="share-info">勾选后分享链接可展示行程信息</span>
          </FormItem>
          <!-- 奖励规则 -->
          <FormItem v-if="!isCoupon" label="奖励规则：" prop="ladder">
            <ul class="table-list">
              <li class="table-head">
                <div class="with-right div-item">充值金额</div>
                <div class="with-right div-item">奖励类型</div>
                <div class="div-item">奖励金额(元)</div>
              </li>
              <li class="table-body" v-for="(item,index) in ruleData.ladder" :key="index">
                <div class="with-right div-item">{{item.ladderValue}}</div>
                <div class="with-right div-item">赠送币</div>
                <div class="div-item input-item">
                  <InputNumber
                    :min="1"
                    :disabled="isEdit"
                    size="small"
                    v-model="item.rewardValue"
                    style="width:100px;margin-top:4px;vertical-align:top;"
                  ></InputNumber>
                </div>
              </li>
            </ul>
          </FormItem>
          <!-- 优惠券label -->
          <FormItem  v-if="isCoupon" :label="awardLabel" prop="template" style="margin-bottom:0;"></FormItem>
          <!-- 优惠券模板 -->
          <div style="margin-left:168px;">
              <!-- 活动奖励1 优惠券-->
            <div>
              <FormItem v-if="isRegisterAward" class="margin0">
                <span>1.加入助力团奖励</span>
              </FormItem>  
              <FormItem label="助力达成期限" v-if="isRegisterAward" prop="completionDeadline" class="left50">
                <InputNumber
                  :disabled="isEdit"
                  :min="1"
                  v-model="ruleData.completionDeadline"
                  placeholder="请输入"
                  style="width:100px;vertical-align:top;"
                ></InputNumber>小时
              </FormItem>  
              <choose-coupon
                v-if="isCoupon" 
                ref="coupon1"
                :isEdit="isEdit"
                :list="ruleData.activityTemplateCfgDto"
                :awardObj="ruleData.awardObj"
                :limitNumber="limitNumber"
                :isAwardType="isActivityRule"
                :awardTypeList="awardTypeList1"
                :isLimit="isBusinessLine"
                :selectCityList="ruleData.cityArray"
                :cityList="cityList"
                :isEvery="isEvery"
                :title="infoData.activityType==='2'?'注册成功奖励':''"
                type="1"
              ></choose-coupon>
            </div>
            <Divider dashed v-if="isCoupon2||(isShare&&ruleData.shareReward)||(isRegisterAward&&ruleData.successAward===2)"/>
            <FormItem v-if="isShare" class="margin0">
              <Checkbox :disabled="isEdit" v-model="ruleData.shareReward">分享用户奖励</Checkbox>
              <p style="line-height:14px;padding-left:18px;color:#999;">分享后有新注册用户产生时，分享人获得优惠券奖励</p>
            </FormItem>
            <FormItem v-if="isRegisterAward" class="margin0">
              <Checkbox :disabled="isEdit" :true-value="2" :false-value="1"  v-model="ruleData.successAward">2.注册成功奖励</Checkbox>
            </FormItem>
            <!-- 活动奖励2 优惠券-->
            <div v-if="isCoupon2||(isShare&&ruleData.shareReward)||(isRegisterAward&&ruleData.successAward===2)">
              <choose-coupon
                ref="coupon2"
                :isEdit="isEdit"
                :list="ruleData.activityTemplateCfgDto2"
                :awardObj="ruleData.awardObj2"
                :limitNumber="limitNumber2"
                :isAwardType="true"
                :awardTypeList="awardTypeList2"
                :cityList="cityList"
                :isEvery="isEvery2"
                :title="infoData.activityType==='2'?'首单奖励':''"
                type="2"
              ></choose-coupon>
            </div>
            <Divider dashed v-if="isRegisterAward&&ruleData.firstOrder===2"/>
            <FormItem v-if="isRegisterAward" class="margin0">
              <Checkbox :disabled="isEdit" :true-value="2" :false-value="1" v-model="ruleData.firstOrder">3.首单奖励</Checkbox>
            </FormItem>
            <!-- 活动奖励3 优惠券-->
            <div v-if="isRegisterAward&&ruleData.firstOrder===2">
              <choose-coupon
                ref="coupon3"
                :isEdit="isEdit"
                :list="ruleData.activityTemplateCfgDto3"
                :awardObj="ruleData.awardObj3"
                :isAwardType="true"
                :awardTypeList="awardTypeList3"
                :cityList="cityList"
                :isEvery="isEvery2"
                :title="''"
                type="3"
              ></choose-coupon>
            </div>
          </div>
          <Divider dashed v-if="isActivityRule"/>
          <!-- 活动说明 -->
          <FormItem v-if="isCoupon2" label="活动说明：" prop="activityDesc">
            <Input
              :disabled="isEdit"
              v-model="ruleData.activityDesc"
              type="textarea"
              :maxlength="200"
              :autosize="{minRows: 3,maxRows: 5}"
              style="width:450px;"
              placeholder="请输入活动说明(200字以内)"
            />
            <span class="counter">( {{ruleData.activityDesc.length}}/200 )</span>
          </FormItem>
          <!-- 活动规则 -->
          <FormItem v-if="isActivityRule" label="活动规则：" prop="activityRule">
            <Input
              :disabled="isEdit"
              v-model="ruleData.activityRule"
              type="textarea"
              :maxlength="200"
              :autosize="{minRows: 3,maxRows: 5}"
              style="width:450px;"
              placeholder="请输入活动规则(200字以内)"
            />
            <span class="counter">( {{ruleData.activityRule.length}}/200 )</span>
          </FormItem>
          <!-- 发券通知 -->
          <div v-if="isPayTime">
            <Divider dashed/>
            <FormItem label="发券通知：">
              <Checkbox :disabled="isEdit"  v-model="ruleData.isPush">PUSH通知</Checkbox>
            </FormItem>
            <FormItem v-if="ruleData.isPush" label="通知内容：" prop="pushContent">
              <Input
                :disabled="isEdit"
                v-model="ruleData.pushContent"
                type="textarea"
                :maxlength="30"
                :autosize="true"
                style="width:450px;"
                placeholder="请输入通知内容(30字以内)"
              />
              <span class="counter">( {{ruleData.pushContent.length}}/30 )</span>
            </FormItem>
          </div>
        </Form>
        <Divider/>
        <div class="btn-box">
          <Button @click="cancelFun('ruleForm')">取消</Button>
          <Button type="primary" @click="tabValue='tab1';" style="margin-left: 10px">上一步</Button>
          <Button v-if="isTab3" type="primary" @click="handleSubmitRule('ruleForm')" style="margin-left: 10px">下一步</Button>
          <Button v-else type="success" :loading="submitLoading" @click="handleSubmitRule('ruleForm')" style="margin-left: 10px">
            <span v-if="!submitLoading">完成</span>
            <span v-else>提交中...</span>
          </Button>
        </div>
      </TabPane>
      <TabPane v-if="isTab3" :disabled="isTab3Dis" label="页面设置" name="tab3">
        <Form
          class="first-tab-form"
          ref="setForm"
          :model="landPageData"
          :rules="isEdit?{}:landPageDataRules"
          :label-width="120">
          <!-- 领券前落地页 -->
          <p class="line-title">领券前落地页设置</p>
          <div class="preview-out">
            <before-land type="1" 
              :title="landPageData.beforeLandingPageTitle"
              :banner="landPageData.beforeLandingPageBanner"
              :textFirst="landPageData.beforeLandingCopywriting[0]"
              :textSecond="landPageData.beforeLandingCopywriting[1]"
              :bgColor="landPageData.beforeLandingPageBgcolor">
            </before-land>
            <div class="right-box">
              <FormItem label="页面标题：" prop="beforeLandingPageTitle">
                <Input
                  :disabled="isEdit"
                  :maxlength="10"
                  v-model="landPageData.beforeLandingPageTitle"
                  placeholder="请输入页面标题"
                  style="width:240px;"
                ></Input>
                <span class="counter">( {{landPageData.beforeLandingPageTitle.length}}/10 )</span>
              </FormItem>
              <FormItem label="banner图：">
                <Vupload
                  v-if="!isEdit"
                  :multiFile="false"
                  :action="upLoadUrl"
                  :defaultList="landPageData.upImgList[0]"
                  @on-upsuccess="getBeforeImg"
                  @on-remove="landPageData.beforeLandingPageBanner=''"
                ></Vupload>
                <div v-else>
                  <p v-if="!landPageData.beforeLandingPageBanner">未设置</p>
                  <img v-else :src="landPageData.beforeLandingPageBanner" alt="banner图" style="height:120px;">
                </div>
              </FormItem>
              <FormItem label="背景颜色：">
                <ColorPicker :disabled="isEdit" v-model="landPageData.beforeLandingPageBgcolor"/>
              </FormItem>
              <FormItem label="活动文案：">
                <div class="bottom15">第一行
                  <Input
                    :disabled="isEdit"
                    :maxlength="20"
                    v-model="landPageData.beforeLandingCopywriting[0]"
                    placeholder="请输入文案"
                    style="width:300px;"
                  ></Input>
                  <span class="counter">( {{landPageData.beforeLandingCopywriting[0].length}}/20 )</span>
                </div>
                <div>第二行
                  <Input
                    :disabled="isEdit"
                    :maxlength="20"
                    v-model="landPageData.beforeLandingCopywriting[1]"
                    placeholder="请输入文案"
                    style="width:300px;"
                  ></Input>
                  <span class="counter">( {{landPageData.beforeLandingCopywriting[1].length}}/20 )</span>
                </div>
              </FormItem>
              <FormItem label="活动规则：" prop="beforeLandingPageRule">
                <Input
                  :disabled="isEdit"
                  v-model="landPageData.beforeLandingPageRule"
                  type="textarea"
                  :maxlength="200"
                  :autosize="{minRows: 3,maxRows: 5}"
                  style="width:450px;"
                  placeholder="请输入活动规则(200字以内)"
                />
                <span class="counter">( {{landPageData.beforeLandingPageRule.length}}/200 )</span>
              </FormItem>
            </div>
          </div>
          <Divider/>
          <!-- 领取那后落地页 -->
          <p class="line-title">领券后落地页设置</p>
          <div class="preview-out">
            <before-land type="2" 
              :title="landPageData.afterLandingPageTitle"
              :banner="landPageData.afterLandingPageBanner"
              :textFirst="landPageData.afterLandingCopywriting[0]"
              :textSecond="landPageData.afterLandingCopywriting[1]"
              :bgColor="landPageData.afterLandingPageBgcolor">
            </before-land>
            <div class="right-box">
              <FormItem label="页面标题：" prop="afterLandingPageTitle">
                <Input
                  :disabled="isEdit"
                  :maxlength="10"
                  v-model="landPageData.afterLandingPageTitle"
                  placeholder="请输入页面标题"
                  style="width:240px;"
                ></Input>
                <span class="counter">( {{landPageData.afterLandingPageTitle.length}}/10 )</span>
              </FormItem>
              <FormItem label="banner图：">
                <Vupload
                  v-if="!isEdit"
                  :multiFile="false"
                  :action="upLoadUrl"
                  :defaultList="landPageData.upImgList[1]"
                  @on-upsuccess="getAfterImg"
                  @on-remove="landPageData.afterLandingPageBanner=''"
                ></Vupload>
                <div v-else>
                  <p v-if="!landPageData.afterLandingPageBanner">未设置</p>
                  <img v-else :src="landPageData.afterLandingPageBanner" alt="banner图" style="height:120px;">
                </div>
              </FormItem>
              <FormItem label="背景颜色：">
                <ColorPicker :disabled="isEdit" v-model="landPageData.afterLandingPageBgcolor"/>
              </FormItem>
              <FormItem label="活动文案：">
                <div class="bottom15">第一行
                  <Input
                    :disabled="isEdit"
                    :maxlength="20"
                    v-model="landPageData.afterLandingCopywriting[0]"
                    placeholder="请输入文案"
                    style="width:300px;"
                  ></Input>
                  <span class="counter">( {{landPageData.afterLandingCopywriting[0].length}}/20 )</span>
                </div>
                <div>第二行
                  <Input
                    :disabled="isEdit"
                    :maxlength="20"
                    v-model="landPageData.afterLandingCopywriting[1]"
                    placeholder="请输入文案"
                    style="width:300px;"
                  ></Input>
                  <span class="counter">( {{landPageData.afterLandingCopywriting[1].length}}/20 )</span>
                </div>
              </FormItem>
            </div>
          </div>
          <Divider/>
          <!-- 分享设置 -->
          <p class="line-title">分享设置</p>
          <div class="preview-out share-out">
            <share 
              type="1"
              :shareIcon="landPageData.shareIcon"
              :subTitle="landPageData.shareSubTitle"
              :title="landPageData.shareTitle">
            </share>
            <div class="right-box">
               <FormItem label="主标题：" prop="shareTitle">
                <Input
                  :disabled="isEdit"
                  v-model="landPageData.shareTitle"
                  :maxlength="18"
                  placeholder="请输入主标题"
                  style="width:240px;"
                ></Input>
                <span class="counter">( {{landPageData.shareTitle.length}}/18 )</span>
              </FormItem>
              <FormItem label="副标题：" prop="shareSubTitle">
                <Input
                  :disabled="isEdit"
                  v-model="landPageData.shareSubTitle"
                  :maxlength="18"
                  placeholder="请输入副标题"
                  style="width:240px;"
                ></Input>
                <span class="counter">( {{landPageData.shareSubTitle.length}}/18 )</span>
              </FormItem>
              <FormItem label="分享图标：" prop="shareIcon">
                <Vupload
                  v-if="!isEdit"
                  :multiFile="false"
                  :action="upLoadUrl"
                  :defaultList="landPageData.upImgList[2]"
                  @on-upsuccess="getShareFriendImg"
                  @on-remove="landPageData.shareIcon=''"
                ></Vupload>
                <div v-else>
                  <p v-if="!landPageData.shareIcon">未设置</p>
                  <img v-else :src="landPageData.shareIcon" alt="banner图" style="height:120px;">
                </div>
              </FormItem>
            </div>
          </div>
          <p>分享给朋友</p>
          <div class="preview-out share-out">
            <share 
              type="2"
              :shareIcon="landPageData.shareFriendsIcon"
              :title="landPageData.shareFriendsTitle">
            </share>
            <div class="right-box">
              <p>朋友圈分享</p>
              <FormItem label="标题：" prop="shareFriendsTitle">
                <Input
                  :disabled="isEdit"
                  v-model="landPageData.shareFriendsTitle"
                  :maxlength="18"
                  placeholder="请输入标题"
                  style="width:240px;"
                ></Input>
                <span class="counter">( {{landPageData.shareFriendsTitle.length}}/18 )</span>
              </FormItem>
              <FormItem label="分享图标：" prop="shareFriendsIcon">
                <Vupload
                  v-if="!isEdit"
                  :multiFile="false"
                  :action="upLoadUrl"
                  :defaultList="landPageData.upImgList[3]"
                  @on-upsuccess="getShareCircleImg"
                  @on-remove="landPageData.shareFriendsIcon=''"
                ></Vupload>
                <div v-else>
                  <p v-if="!landPageData.shareFriendsIcon">未设置</p>
                  <img v-else :src="landPageData.shareFriendsIcon" alt="banner图" style="height:120px;">
                </div>
              </FormItem>
            </div>
          </div>
        </Form>
        <Divider/>
        <div class="btn-box">
          <Button @click="cancelFun('setForm')">取消</Button>
          <Button type="primary" @click="tabValue='tab2';" style="margin-left: 10px">上一步</Button>
          <Button type="success" @click="handleSubmitSet('setForm')" :loading="submitLoading" style="margin-left: 10px">
            <span v-if="!submitLoading">完成</span>
            <span v-else>提交中...</span>
          </Button>
        </div>
      </TabPane>
    </Tabs>
    <!-- 选择用户群弹窗 -->
    <Modal width="80%" title="查看用户群" footer-hide v-model="showUserGroupModdal">
      <user-group-modal
        :isShow="showUserGroupModdal"
        :list="ruleData.selectUserGroup"
        @close="showUserGroupModdal=false"
        @selectDown="selectUserGroupDown"
      ></user-group-modal>
    </Modal>
  </div>
</template>
<script>
import { cacheData,userGroupColumns } from "./fields";
import { activityTypeList } from "../fields";
import { getCitys } from "@/api/common";
import { 
  axiosDetail,//详情
  axiosActivityEdit,//编辑
  axiosHelpActityAdd,//助力活动
  axiosRegistrationActivity,// 新增注册活动
  axiosRecommendActivity, //新增推荐乘客
  axiosRechargeActivity,// 新增充值活动
  axiosDirectActivity,// 新增定向发券
  axiosChannelRedEnvelope,// 新增渠道红包
  axiosPayRedEnvelope,//新增行程分享
  axiosPasswordRedEnvelope,//新增口令红包
  axiosCustomerServiceTicket,//新增客服发券
  axiosBubblingServiceTicket//新增冒泡发券
  } from "@/api/market";
import { getRechargeLevelList } from '@/api/finance.js'
import chooseCoupon from "./choose-coupon/index.vue";
import userGroupModal from "./user-group-modal/index.vue";
import Vupload from "_a/v-upload/v-upload"
import beforeLand from "./preview/before-land.vue";;
import share from "../new-activity/preview/share.vue";
export default {
  data() {
    return {
      ...cacheData,
      activityTypeList,
      infoData: {
        activityName: '',
        type: ''
      },
      ruleData: {
        activityType: '',
        cityArray: [],//活动城市
        time: [],//活动时间
        activityTotal: null,//活动奖励额度
        completionDeadline: null,//助力达成期限
        activityQuotaType: null,//活动奖励总额度
        maxRewardCount: null,//每人领取次数上限
        maxDayRewardCount: null,//每人每天领取次数上限
        routemaxRewardCount: null,//每个行程最多领取次数上限
        template: [],//模板
        needUserGroup: 0,//用户群
        selectUserGroup: [],//已选用户群数据
        shareRoute: false,//分享行程
        activityRule: '',//活动规则
        shareReward: false,
        registerReward: false,
        firstOrderReward: false,
        ladder: [],
        psword:'',//领取口令
        isGrantImmediately: '',//发放时间
        startGrantTime: '',//发放开始时间
        isPush: false,//发券通知
        pushContent: '',//发券通知内容
        businessTypeList: [],//业务线
        userLimitList: [],//订单类型
        activityDesc: '',//活动说明
      },
      landPageData: {// 落地页设置
        beforeLandingCopywriting: ['',''],
        afterLandingCopywriting: ['',''],
        beforeLandingPageTitle: '',//用券前名称
        afterLandingPageTitle: '',//用券后名称
        beforeLandingPageBanner: '',//用券前banner
        afterLandingPageBanner: '',//用券后banner
        upImgList: [[],[],[],[]], //展示图片列表
        beforeLandingPageBgcolor: '',//用券前颜色
        afterLandingPageBgcolor: '',//用券后颜色
        beforeLandingPageRule: '',//用券前活动规则
        // afterLandingPageRule: '',//用券后活动规则
        shareTitle: '',//分享给朋友标题
        shareSubTitle: '',//分享给朋友副标题
        shareFriendsTitle: '',//分享给朋友圈标题
        shareIcon: '',//分享给朋友图标
        shareFriendsIcon: ''//分享给朋友圈图标
      },
      submitLoading: false,//提交按钮提交状态
      tabValue:  'tab1',
      isTab2Dis: true,
      isTab3Dis: true,
      isEdit: false,
      editParams: {},
      userGroupColumns: [],
      showUserGroupModdal: false, //控制选择用户群弹窗
      addCouponTitle: "选择优惠券模板", //添加优惠券模板标题
      addCouponTitle2: "选择优惠券模板", //添加优惠券模板标题
      upLoadUrl: this._baseUrl + "/common/uploadPics",
      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      }
    };
  },
  components: {
    chooseCoupon,
    userGroupModal,
    Vupload,
    beforeLand,
    share
  },
  computed: {
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
    isEvery(){
      // 优惠券模板-每次奖励券张数：注册活动、定向发券、渠道红包、行程分享、口令红包、客服发券、冒泡发券的第一个模板有
      let type = this.infoData.activityType;
      let arr = ["1","4", "5", "6", "7","8", "9",'10'];
      let result = arr.indexOf(type) > -1 ? true : false;
      return result;
    },
    isEvery2(){
      // 优惠券模板2，每次奖励券张数
      let result =this.infoData.activityType==='10' ? true : false;
      return result;
    },
    limitNumber() {
      // 模板选择多少个
      let type = this.infoData.activityType;
      let result = type === "2" ? 1 : 15;
      return result;
    },
    limitNumber2() {
      // 模板2选择多少个
      let result = this.infoData.activityType==='10' ? 15 : 1;
      return result;
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
    },
    awardTypeList1(){
      let type = this.infoData.activityType
      switch (type) {
        case '10':
          return this.awardTypeLabel3
        default:
          return this.awardTypeLabel1
      }
    },
    awardTypeList2(){
      let type = this.infoData.activityType
      switch (type) {
        case '10':
          return this.awardTypeLabel3
        case '2':
          return this.awardTypeLabel2
        default:
          return this.awardTypeLabel1
      }
    },
    awardTypeList3(){
      return this.awardTypeLabel3
    },
  },
  beforeRouteEnter(to, from, next) {
    let id = to.params.id;
    to.meta.title = id ? "修改活动" : "新建活动";
    id && (to.meta.title = "修改活动");
    next();
  },
  created() {
    this.id = this.$route.params.id;
    this.isEdit = this.id && this.id !== "undefined" ? true : false;
    this.userGroupColumns = userGroupColumns(this)
  },
  mounted() {
    this.getCityList();
  },
  methods: {
     // 编辑获取数据
    getDetailInfo() {
      let that = this
      axiosDetail({ activityUuid: this.$route.params.id }).then(res => {
        if (res.data.success) {
          let resData = res.data.data||{};
          this.infoData = resData.basicInformation
          this.ruleData = resData.rule
          this.landPageData = resData.pageSettings||{}

          let type = String(this.infoData.activityType)
          this.infoData.activityType = type
          this.ruleData.time = this.ruleData.effectiveTime.split(' 至 ')
          // 活动奖励额度
          this.ruleData.activityTotalCopy = this.ruleData.activityTotal
          this.ruleData.activityQuotaTypeCopy = this.ruleData.activityQuotaType
          // 用户群
          if(this.isUserGroup){
            this.userGroupColumns.splice(-1)
            this.ruleData.selectUserGroup = this.ruleData.userGroups
          }
          function awardTypeFun(list,awardObj){
            if(list.length>0){
              that.ruleData[awardObj] = {
                couponRewardType: list[0].couponRewardType,
                ladder: list[0].ladder
              }
            }
          }
          // 奖励方式,优惠券
          if(type=='2'){
            // 推荐乘客
            // 注册成功奖励、首单奖励
            awardTypeFun(this.ruleData.activityTemplateCfgDto,'awardObj')
            awardTypeFun(this.ruleData.firstOrderTemplateCfg,'awardObj2')
            this.ruleData.activityTemplateCfgDto2 = this.ruleData.firstOrderTemplateCfg
          } else if(type=='6'){
            // 行程分享
            // 空，分享用户奖励
            awardTypeFun(this.ruleData.shareTemplateCfgList,'awardObj2')
            this.ruleData.activityTemplateCfgDto2 = this.ruleData.shareTemplateCfgList
          }else if(type=='10'){
            // 助力活动
            // 加入助力团奖励、注册成功奖励、首单奖励
            let obj1 = this.ruleData.succesAssistTempletsLadder
            this.ruleData.activityTemplateCfgDto = obj1.templateCfgList
            this.ruleData.awardObj = {
              couponRewardType: obj1.couponRewardType,
              ladder: obj1.ladder
            }
            let obj2 = this.ruleData.successAwardTempletsLadder
            this.ruleData.activityTemplateCfgDto2 = obj2.templateCfgList
            this.ruleData.awardObj2 = {
              couponRewardType: obj2.couponRewardType,
              ladder: obj2.ladder
            }
            let obj3 = this.ruleData.firstOrderTempletsLadder
            this.ruleData.activityTemplateCfgDto3 = obj3.templateCfgList
            this.ruleData.awardObj3 = {
              couponRewardType: obj3.couponRewardType,
              ladder: obj3.ladder
            }
          }
        } else {
          this.$Message.error(res.data.msg);
        }
      });
      
    },
    getBeforeImg(res) {
      // 获取图片链接
      if (res.success) {
        let imgUrl = res.data.picUrl;
        this.landPageData.upImgList[0].splice(
          0,
          this.landPageData.upImgList[0].length,
          { url: imgUrl }
        );
        this.$set(this.landPageData, "beforeLandingPageBanner", imgUrl);
      }
    },
    getAfterImg(res) {
      // 获取图片链接
      if (res.success) {
        let imgUrl = res.data.picUrl;
        this.landPageData.upImgList[1].splice(
          0,
          this.landPageData.upImgList[1].length,
          { url: imgUrl }
        );
        this.$set(this.landPageData, "afterLandingPageBanner", imgUrl);
      }
    },
    getShareFriendImg(res) {
      if (res.success) {
        let imgUrl = res.data.picUrl;
        this.landPageData.upImgList[2].splice(
          0,
          this.landPageData.upImgList[2].length,
          { url: imgUrl }
        );
        this.$set(this.landPageData, "shareIcon", imgUrl);
      }
    },
    getShareCircleImg(res) {
      if (res.success) {
        let imgUrl = res.data.picUrl;
        this.landPageData.upImgList[3].splice(
          0,
          this.landPageData.upImgList[3].length,
          { url: imgUrl }
        );
        this.$set(this.landPageData, "shareFriendsIcon", imgUrl);
      }
    },
    // 选择用户群
    selectUserGroupDown(list) {
      let selectCopy = JSON.parse(
        JSON.stringify(this.ruleData.selectUserGroup)
      );
      this.ruleData.selectUserGroup.splice(
        0,
        this.ruleData.selectUserGroup.length
      );
      let selectHash = {};
      selectCopy.forEach((item, index) => {
        selectHash[item.uuid] = String(index);
      });
      let addList = [];
      list.forEach(item => {
        let index = selectHash[item.uuid];
        if (index) {
          this.ruleData.selectUserGroup.push(selectCopy[index]);
        } else {
          addList.push(item);
        }
      });
      this.ruleData.selectUserGroup.push(...addList);
    },
    // 固定发券-开始发放时间
    chooseGrantTime(val){
      this.ruleData.startGrantTime = val
    },
    //修改时间
    changeTime(time) {
      this.ruleData.time = time;
      this.ruleData.beginTime = time[0];
      this.ruleData.endTime = time[1];
    },
    // 城市切换时触发，如果为全国所有城市、全部已开通城市、城市为单选， 其余为复选
    changeCity(val) {
      let length = val.length;
      if (val[length - 1] === "1") {
        this.ruleData.cityArray = ["1"];
      } else if (val[length - 1] === "2") {
        this.ruleData.cityArray = ["2"];
      } else {
        val.forEach((v, k) => {
          if (v === "1" || v === "2") val.splice(k, 1);
        });
        this.ruleData.cityArray = val;
      }
    },
    // 获取充值当位列表
    axiosLadder(){
      getRechargeLevelList({}).then(res => {
        let list = res.data.data.list
        let resList = []
        list.filter(item=>{
          if(item.status===1){
            resList.push({
              ladderValue: item.money,
              rewardValue: null,
              templateUuid: item.uuid
            })
          }
        })
        this.ruleData.ladder = resList
      })
    },
    // 基础信息下一步
    handleSubmitInfo(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.isTab2Dis = false;
          this.tabValue = "tab2";
          // 请求接口数据
          this.isUserGroup && this.getUserGroupList();
          !this.isCoupon && this.geAwardRuleList();
          this.isBusinessLine && this.getAreaList();
          // 如果活动类型是充值活动，请求档位接口
          if(this.infoData.activityType === '3' && !this.isEdit){
            this.axiosLadder()
          }
          // 切换活动类型，清空优惠券列表
          if(this.ruleData.activityType){
            if(this.ruleData.activityType!==this.infoData.activityType){
              this.ruleData.activityType = this.infoData.activityType
              this.$refs.coupon1 && (this.$refs.coupon1.couponList = [])
              this.$refs.coupon2 && (this.$refs.coupon2.couponList = [])
              this.$refs.coupon3 && (this.$refs.coupon3.couponList = [])
              this.ruleData.template.splice(0,this.ruleData.template.length)
            }
          }else{
            this.ruleData.activityType = this.infoData.activityType
          }
        } else {
          this.isTab2Dis = true;
          this.tabValue = "tab1";
        }
      });
    },
    // 活动规则下一步
    handleSubmitRule(name) {
      let that = this;
      let isCoupon = this.isCoupon;
      let isCoupon2 = this.isCoupon2 || (this.isShare && this.ruleData.shareReward) || (this.isRegisterAward && this.ruleData.successAward===2);
      let isCoupon3 = this.isRegisterAward && this.ruleData.firstOrder===2
      if(this.isEdit){
        this.validEdit(isCoupon,isCoupon2,isCoupon3)
        return false
      }
      // 获取优惠券数据
      isCoupon && (this.ruleData.template[0] = [...this.$refs.coupon1.couponList]);
      isCoupon2 && (this.ruleData.template[1] = [...this.$refs.coupon2.couponList]);
      isCoupon3 && (this.ruleData.template[2] = [...this.$refs.coupon3.couponList]);
      // 如果有分享用户奖励，且勾选了，那么必选优惠券模板
      if(isCoupon2 && this.ruleData.template[1].length===0 && !this.isCoupon2){
        this.isShare && this.ruleData.shareReward && this.$Message.warning('请选择用户分享奖励的优惠券模板')
        this.isRegisterAward && this.ruleData.successAward===1 && this.$Message.warning('请选择注册成功奖励的优惠券模板')
        return false
      }
      if(isCoupon3 && this.ruleData.template[2].length===0){
        this.$Message.warning('请选择首单奖励的优惠券模板')
        return false
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          let isSuccess = isCoupon ? false : true;
          let isSuccess2 = isCoupon2 ? false : true;
          let isSuccess3 = isCoupon3 ? false : true;

          // 如果有优惠券2，验证
          isCoupon && (isSuccess = this.$refs.coupon1.handleSubmit());
          isCoupon2 && (isSuccess2 = this.$refs.coupon2.handleSubmit());
          isCoupon3 && (isSuccess3 = this.$refs.coupon3.handleSubmit());

          if (isSuccess && isSuccess2 && isSuccess3) {
            if (this.isTab3) {
              this.isTab3Dis = false;
              this.tabValue = "tab3";
            } else {
              this.submitNew(isCoupon,isCoupon2,isCoupon3)
              this.isTab2Dis = false;
              this.tabValue = "tab2";
            }
          }else{
            this.$Message.warning('请将优惠券部分填写完整')
          }
        } else {
          this.$Message.warning('请将活动规则填写完整')
          this.isTab2Dis = true;
          this.tabValue = "tab2";
        }
      });
    },
    // 校验修改
    validEdit(isCoupon,isCoupon2,isCoupon3){
      let ruleData = {...this.ruleData}
      let params = {
        activityType: this.infoData.activityType,
        activityUuid: this.id,
        activityTemplateCfgDto: []
      }
      // 如果有活动奖励总额度
      if(this.isQuota){
        // 如果原来是限额，可以改成不限和更大的值
        if(ruleData.activityQuotaTypeCopy===1){
          if(ruleData.activityQuotaType===2){
            params.activityQuotaType=2
          }else{
            if(!ruleData.activityTotal){
              this.$Message.warning('活动奖励总额度不能为空')
              return false
            }else if(ruleData.activityTotal<ruleData.activityTotalCopy ){
              this.$Message.warning('活动奖励总额度不能修改为小于原值')
              return false
            }else if(ruleData.activityTotal>ruleData.activityTotalCopy){
              params.activityQuotaType=1
              params.activityTotal=ruleData.activityTotal
            }
          }
        }
      }

      // 优惠券1
      if(isCoupon){
        let res = this.$refs.coupon1.getEditInfo()
        if(res===false){
          return false
        }else{
          params.activityTemplateCfgDto.push(...res)
        }
      }
      // 优惠券2
      if(isCoupon2){
        let res = this.$refs.coupon2.getEditInfo()
        if(res===false){
          return false
        }else{
          params.activityTemplateCfgDto.push(...res)
        }
      }
      // 优惠券3
      if(isCoupon3){
        let res = this.$refs.coupon3.getEditInfo()
        if(res===false){
          return false
        }else{
          params.activityTemplateCfgDto.push(...res)
        }
      }
      if(this.isTab3){
        this.isTab3Dis = false;
        this.tabValue = "tab3";
        this.editParams = {...params}
        return false
      }else{
        this.submitEdit(params)
      }
    },
    // 保存修改
    submitEdit(params){
      this.submitLoading = true
      axiosActivityEdit(params).then(res => {
        this.submitLoading = false
        if (res.data.success) {
          this.$Message.success(res.data.msg);
          this.$store.commit('setChangeTab',this.$route)
          this.$router.push("/marketing/activity-manage");
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    /**
     * 保存新增
     * delete 的主要原因是，后台接口限制，即比如，如果该活动没有分享奖励，则不能传分享奖励的值给后台
     */
    submitNew(isCoupon,isCoupon2,isCoupon3){
      this.submitLoading = true
      // 根据type决定调用哪个接口
      function chooseFun(type){
        switch (type) {
          case '1':
            return axiosRegistrationActivity
          case '2':
            return axiosRecommendActivity
          case '3':
            return axiosRechargeActivity
          case '4':
            return axiosDirectActivity
          case '5':
            return axiosChannelRedEnvelope
          case '6':
            return axiosPayRedEnvelope
          case '7':
            return axiosPasswordRedEnvelope
          case '8':
            return axiosCustomerServiceTicket
          case '9':
            return axiosBubblingServiceTicket
          case '10':
            return axiosHelpActityAdd
        }
      }
      let axiosSubmitFun = chooseFun(this.infoData.activityType)
      let that = this
      let infoData = {...this.infoData}
      let ruleData = {...this.ruleData}
      let landPageData = this.isTab3?{...this.landPageData}:{}
      let activityTemplateCfgDto = {}
      let type = this.infoData.activityType
      let params = Object.assign(
        infoData,ruleData,landPageData
      );
      /**
       * 处理优惠券列表，组装字段等
       * name 传给后台的名称
       * index,取第几个列表值
       * isAwardType 是否有奖励方式
       */
      function setDataCoupon(name,index,){
        let templateList = ruleData.template
        if(templateList[index]){
          let list = []
          templateList[index].forEach(item=>{
            // 没有限制时间和限定区域
            if(!that.isBusinessLine){
              delete item.limitTime
              delete item.startLimitTime
              delete item.endLimitTime
              delete item.activityLimitArea
              delete item.activityLimitTime
              delete item.electronicCrawl
              delete item.electronicCrawlName
              delete item.startLimitTime
              delete item.endLimitTime
            }else{
              item.activityLimitTime = Number(item.activityLimitTime)
              item.activityLimitArea = Number(item.activityLimitArea)
            }
            // 每次奖励券张数
            if(!that.isEvery|| name==='shareTemplateCfg'){
              delete item.perRewardNum
            }
            // 券有效期：固定('1')和动态('2')取不同的值
            if(item.validityType===1){
              delete item.effectiveDays
            }else{
              delete item.startTime
              delete item.endTime
            }
            list.push(item)
          })
          params[name] = [...list]
        }else{
          params[name] = []
        }
      }

      // 活动城市数据组装
      this.isCity && (params.cityId = ruleData.cityArray.join(','))
      // 优惠券
      if(this.isCoupon){
        setDataCoupon('activityTemplateCfgDto',0)
        delete params.ladder
        // 奖励方式
        if(type==='10'){
          let awardTypeObj = {...this.$refs.coupon1.awardTypeObj}
          params.succesAssistTempletsLadder = Object.assign(awardTypeObj,{templateCfgList:params.activityTemplateCfgDto})
          delete params.activityTemplateCfgDto
        }else if(type === '2' && ruleData.template[0].length>0){
          let awardTypeObj = {...this.$refs.coupon1.awardTypeObj}
          params.activityTemplateCfg = [ Object.assign(awardTypeObj, params.activityTemplateCfgDto[0])]
          delete params.activityTemplateCfgDto
        }
      }
      // 优惠券2,推荐乘客和支付红包
      if(this.isCoupon2 || (this.isShare&&ruleData.shareReward) ){
        let couponListName2 = this.isCoupon2?'firstOrderTemplateCfg':'shareTemplateCfg'
        setDataCoupon(couponListName2,1)
        if(params[couponListName2][0]){
          let awardTypeObj = {...this.$refs.coupon2.awardTypeObj}
          params[couponListName2] = [ Object.assign(awardTypeObj, params[couponListName2][0])]
        }
      }
      // 助力奖励,优惠券2，和优惠券3
      if(type==='10'){
        if(isCoupon2){
          setDataCoupon('templateCfgList',1)
          let awardTypeObj = {...this.$refs.coupon2.awardTypeObj}
          params.successAwardTempletsLadder = Object.assign(awardTypeObj,{templateCfgList:params.templateCfgList})
          delete params.templateCfgList
        }
        if(isCoupon3){
          setDataCoupon('templateCfgList',2)
          let awardTypeObj = {...this.$refs.coupon3.awardTypeObj}
          params.firstOrderTempletsLadder = Object.assign(awardTypeObj,{templateCfgList:params.templateCfgList})
          delete params.templateCfgList
        }
      }
      // 活动说明
      if(!this.isCoupon2){
        delete params.activityDesc
      }
      // 活动规则
      if(!this.isActivityRule){
        delete params.activityRule
      }
      // 分享奖励
      if(!this.isShare){
        delete params.shareReward
        delete params.shareTemplateCfg
      }
      // 用户群
      if(this.isUserGroup && this.ruleData.needUserGroup===1){
        let list = []
        this.ruleData.selectUserGroup.forEach(item=>{
          list.push(item.uuid)
        })
        params.userGroups = list
      }
      // return
      // 请求保存接口
      axiosSubmitFun(params).then(res => {
        this.submitLoading = false
        if (res.data.code===200) {
          this.$Message.success(res.data.msg);
          this.$store.commit('setChangeTab',this.$route)
          this.$router.push("/marketing/activity-manage");
        } else {
          that.$Message.error(res.data.msg);
        }
      })
    },
    // 设置，完成
    handleSubmitSet(name) {
      if(this.isEdit){
        this.submitEdit(this.editParams)
        return false
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.submitNew()
        } else {
          this.$Message.warning('请将分享设置填写完整')
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.$router.push("/marketing/activity-manage");
    },
    cancelFun(name) {
      let msg = this.isEdit?'确认取消修改活动？':'确认取消创建活动？'
      this.$Modal.confirm({
        title: msg,
        onOk: () => {
          this.$store.commit('setChangeTab',this.$route)
          this.handleReset(name);
        }
      });
    },
    // 切换tab
    tabschange(name) {
      this.tabValue = name;
    },
    // 获取已开通城市列表
    getCityList() {
      getCitys({}).then(res => {
        this.cityList.splice(0, this.cityList.length);
        res.data.data.forEach(item => {
          if (item.city) {
            this.cityList.push(item);
          }
        });
        this.isEdit && this.getDetailInfo();
      });
    },
    // 获取用户群列表
    getUserGroupList() {},
    // 获取奖励规则列表
    geAwardRuleList() {},
    // 获取围栏列表
    getAreaList() {}
  },
  watch: {
    tabValue(newVal, oldVal) {
      switch (newVal) {
        case "tab1":
          this.isTab2Dis = true;
          this.isTab3Dis = true;
          break;
        case "tab2":
          this.isTab2Dis = false;
          this.isTab3Dis = true;
          break;
        case "tab3":
          this.isTab2Dis = false;
          this.isTab3Dis = false;
          break;
      }
    },
    '$route' (to,from) {
      this.tabValue = 'tab1'
      this.$refs['infoForm'].resetFields();
      this.$refs['ruleForm'].resetFields();
      this.$refs['setForm'] && this.$refs['setForm'].resetFields();
      let id = to.params.id;
      to.meta.title = id ? "修改活动" : "新建活动";
      id && (to.meta.title = "修改活动");

      this.id = this.$route.params.id;
      this.isEdit = this.id && this.id !== "undefined" ? true : false;
      this.isEdit && this.getDetailInfo()
      this.getCityList()
      this.userGroupColumns = userGroupColumns(this)
    },
  }
};
</script>
<style lang="less" scoped>
.new-activity{
  /deep/ .ivu-input-number-input{
    height:30px;
    line-height: 30px;
    vertical-align: top;
  }
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
    position: relative;
    left: -5px;
  }
}
.first-tab-form {
  margin: 20px 0 70px 40px;
}
.second-tab-form {
  margin: 20px 0 70px 0;
}
.btn-box {
  width: 300px;
  margin: 0 auto;
}
.inline-form-item {
  /deep/ .ivu-form-item {
    display: inline-block;
  }
}
/deep/ .ivu-form-item.bottom10 {
  margin-bottom: 10px;
}
.no-left-margin {
  /deep/ .ivu-form-item-content {
    margin-left: 25px !important;
  }
  &.table-item {
    margin-left: 150px !important;
    margin-top: -15px;
  }
}
.margin0 {
  /deep/ .ivu-form-item-content {
    margin-left: 0 !important;
  }
}
.margin30 {
  /deep/ .ivu-form-item-content {
    margin-left: 96px !important;
  }
}
.counter {
  vertical-align: bottom;
  margin-left: 12px;
}
.table-list {
  border: 1px solid #cccdd1;
  text-align: center;
  width: 370px;
  .table-head {
    line-height: 36px;
    background: #f8f8f9;
  }
  .table-body {
    border-top: 1px solid #cccdd1;
  }
  .with-right {
    border-right: 1px solid #cccdd1;
  }
  .div-item {
    width: 120px;
    display: inline-block;
  }
}
.preview-out{
  position: relative;
  min-height:520px;
  .right-box{
    margin-left:310px;
  }
  &.share-out{
    min-height:250px;
  }
}
.share-info{
  display: inline-block;
  font-size: 12px;
  color:#999;
  margin-left: 10px;
}
.left50{
  margin-left: -85px;
}
</style>

