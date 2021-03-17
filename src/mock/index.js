import Mock from 'mockjs'

// 登录相关、获取菜单、获取用户信息
import { login, logout } from './login'
import { getNavList, getUserInfo } from './data/power-data'
Mock.mock(/\/mock_login/, login)
Mock.mock(/\/mock_logout/, logout)
Mock.mock(/\/auth-api\/api\/v1\/staff\/selectLoginStaffInfo/, getUserInfo) // 获取用户信息
Mock.mock(/\/auth-api\/api\/auth\/resource\/queryResourceByAccountId/, getNavList) // 菜单资源列表


import { 
    getAgentByCity, queryCarListByRemote, getOpmanerByOrgan, 
    getSiteList, getDriverDetail, getCarByVin
} from './data/map-data'
// 运营地图
Mock.mock(/\/vue-admin\/admin\/driverRemote\/getAgentByCity/, getAgentByCity) // 根据城市获取运营商
Mock.mock(/\/vue-admin\/admin\/driverRemote\/getCarDistribution/, queryCarListByRemote) // 查询地图服务要求的数据信息
Mock.mock(/\/vue-admin\/admin\/driver\/managerDriver/, getOpmanerByOrgan) // 根据运营商获取司管
Mock.mock(/\/vue-admin\/system\/serviceSiteList/, getSiteList) // 获取站点列表
Mock.mock(/\/vue-admin\/admin\/driver\/detail/, getDriverDetail) // 获取司机详情信息
Mock.mock(/\/vue-admin\/admin\/carManager\/detailInfo/, getCarByVin) // 根据vin获取车辆的基础信息


import { 
    getDriverList, getAllOrgan, getAgentPageList, 
    getAgentById, returnSuccess, getAgentRules,
    getAgentResult, getDrpList, getExistMonths1,
    getExistMonths2, getDrpDetail, getSubsidyList,
    getSubsidyDetail, getDriverMList, getCarMList,
    getRuleList, getRuleDetail, getCityList,
    getPlatformInfo, getPlatformService, getPlatformPermit,
    getPlatformPay, getCarList, getCarDetailInfo,
    getAuthorizedDriverList, getViolationRecordList, getCarOrderList,
    getHistoricalUserList
} from './data/operator-data'
// 营运管理
Mock.mock(/\/vue-admin\/protocolAgree\/queryPage/, getDriverList) // 获取协议
Mock.mock(/\/vue-admin\/admin\/sysAgent\/getAllOrgan/, getAllOrgan) // 获取所有组织机构
Mock.mock(/\/vue-admin\/admin\/sysAgent\/queryAgentPageList/, getAgentPageList) // 获取运营商列表
Mock.mock(/\/vue-admin\/admin\/sysAgent\/getAgentById/, getAgentById) // 获取运营商详情
Mock.mock(/\/vue-admin\/admin\/sysAgent\/save/, returnSuccess) // 更新运营商
Mock.mock(/\/vue-admin\/admin\/sysAgent\/assessment\/rules/, getAgentRules) // 获取运营商考核规则
Mock.mock(/\/vue-admin\/admin\/sysAgent\/assessment\/result/, getAgentResult) // 获取运营商考核结果
Mock.mock(/\/vue-admin\/admin\/regional\/agentCommision\/list/, getDrpList) // 获取抽成列表
Mock.mock(/\/vue-admin\/admin\/regional\/agentCommision\/getExistMonths/, getExistMonths1) // 获取已存在的月份
Mock.mock(/\/vue-admin\/admin\/regional\/agentSubsidy\/getExistMonths/, getExistMonths2) // 获取已存在的月份
Mock.mock(/\/vue-admin\/admin\/regional\/agentCommision\/save/, returnSuccess) // 保存抽成
Mock.mock(/\/vue-admin\/admin\/regional\/agentCommision\/info/, getDrpDetail) // 获取抽成详情
Mock.mock(/\/vue-admin\/admin\/regional\/agentCommision\/update/, returnSuccess) // 更新抽成
Mock.mock(/\/vue-admin\/admin\/regional\/agentCommision\/remove/, returnSuccess) // 删除抽成
Mock.mock(/\/vue-admin\/admin\/regional\/agentSubsidy\/list/, getSubsidyList) // 获取补贴列表
Mock.mock(/\/vue-admin\/admin\/regional\/agentSubsidy\/save/, returnSuccess) // 补贴
Mock.mock(/\/vue-admin\/admin\/regional\/agentSubsidy\/update/, returnSuccess) // 补贴
Mock.mock(/\/vue-admin\/admin\/regional\/agentSubsidy\/remove/, returnSuccess) // 补贴
Mock.mock(/\/vue-admin\/admin\/regional\/agentSubsidy\/info/, getSubsidyDetail) // 获取补贴详情
Mock.mock(/\/vue-admin\/manager\/driver\/manager\/list/, getDriverMList) // 司管列表/司机列表
Mock.mock(/\/vue-admin\/admin\/carManager\/queryVehicleManagementListByPage/, getCarMList) // 车管列表
Mock.mock(/\/vue-admin\/admin\/driver\/examine\/rule\/list/, getRuleList) // 考核规则
Mock.mock(/\/vue-admin\/admin\/driver\/examine\/rule\/info/, getRuleDetail) // 考核规则
Mock.mock(/\/vue-admin\/admin\/driver\/examine\/rule\/add/, returnSuccess) // 新增考核
Mock.mock(/\/vue-admin\/admin\/driver\/examine\/rule\/edit/, returnSuccess) // 编辑考核
Mock.mock(/\/vue-admin\/common\/citys/, getCityList) // 获取同级城市列表
Mock.mock(/\/vue-admin\/platformInfo\/query/, getPlatformInfo) // 获取平台信息
Mock.mock(/\/vue-admin\/platformService\/query/, getPlatformService) // 获取平台信息
Mock.mock(/\/vue-admin\/platformPermit\/query/, getPlatformPermit) // 获取平台信息
Mock.mock(/\/vue-admin\/platformPay\/query/, getPlatformPay) // 获取平台信息
Mock.mock(/\/vue-admin\/platformInfo\/addPlatformInfo/, returnSuccess) // 编辑平台信息
Mock.mock(/\/vue-admin\/platformPay\/addPlatformPay/, returnSuccess) // 编辑平台信息
Mock.mock(/\/vue-admin\/platformService\/addPlatformService/, returnSuccess) // 编辑平台信息
Mock.mock(/\/vue-admin\/platformPermit\/addPlatformPermit/, returnSuccess) // 编辑平台信息
Mock.mock(/\/vue-admin\/admin\/carManager\/list/, getCarList) // 获取车辆列表
Mock.mock(/\/vue-admin\/admin\/carManager\/detailInfo/, getCarDetailInfo) // 获取车辆基本信息
Mock.mock(/\/vue-admin\/admin\/carManager\/authorizedDriver/, getAuthorizedDriverList) // 获取准驾司机列表
Mock.mock(/\/vue-admin\/admin\/carManager\/authDriver/, returnSuccess) // 司机授权
Mock.mock(/\/vue-admin\/admin\/carManager\/violationRecord/, getViolationRecordList) // 获取违章记录
Mock.mock(/\/vue-admin\/admin\/carManager\/orderList/, getCarOrderList) // 获取车辆订单信息
Mock.mock(/\/vue-admin\/admin\/carManager\/historicalUser/, getHistoricalUserList) // 获取历史使用人


import { 
    getInvoiceList, getInvoiceDetail, getRechargeLevelList,
    getPaywayList, getFaceRecognitionList, getEstablishCityList,
    establishCityDetail, queryCreditModel, getDiscountConfig,
    getServiceSiteList, getStrategyList, getAlarmList,
    getAppProtolList, getDeviceList, getElectronicFenceList
} from './data/finance-data'
// 配置管理
Mock.mock(/\/vue-admin\/admin\/finance\/invoice\/list/, getInvoiceList) // 获取发票列表
Mock.mock(/\/vue-admin\/admin\/finance\/invoice\/saveExpressNo/, returnSuccess) // 快递单号录入
Mock.mock(/\/vue-admin\/admin\/finance\/invoice\/get/, getInvoiceDetail) // 获取发票详情
Mock.mock(/\/vue-admin\/admin\/Strategy\/recharge\/query/, getRechargeLevelList) // 获取充值档位列表
Mock.mock(/\/vue-admin\/admin\/Strategy\/recharge\/edit/, returnSuccess) // 更新充值档位
Mock.mock(/\/vue-admin\/admin\/Strategy\/recharge\/add/, returnSuccess) // 新增充值档位
Mock.mock(/\/vue-admin\/admin\/Strategy\/payway\/query/, getPaywayList) // 获取支付方式列表
Mock.mock(/\/vue-admin\/admin\/Strategy\/payway\/shiftDown/, returnSuccess) // 更改支付方式顺序
Mock.mock(/\/vue-admin\/admin\/Strategy\/payway\/shiftUp/, returnSuccess) // 更改支付方式顺序
Mock.mock(/\/vue-admin\/admin\/Strategy\/payway\/edit/, returnSuccess) // 开启/关闭支付方式
Mock.mock(/\/vue-admin\/config\/carFaceRecognition\/list/, getFaceRecognitionList) // 人脸识别列表
Mock.mock(/\/vue-admin\/config\/carFaceRecognition\/update/, returnSuccess) // 人脸识别切换登录方式
Mock.mock(/\/vue-admin\/config\/carModelsLevel\/listData/, getEstablishCityList) // 开通城市列表
Mock.mock(/\/vue-admin\/config\/carModelsLevel\/detail/, establishCityDetail) // 定价策略
Mock.mock(/\/vue-admin\/config\/carModelsLevel\/openCity/, returnSuccess) // 开启城市
Mock.mock(/\/vue-admin\/config\/carModelsLevel\/addCity/, returnSuccess) // 开通城市
Mock.mock(/\/vue-admin\/config\/carModelsLevel\/queryCreditModel/, queryCreditModel) // 坏账策略
Mock.mock(/\/vue-admin\/config\/carModelsLevel\/saveCreditModel/, returnSuccess) // 修改坏账策略
Mock.mock(/\/vue-admin\/config\/carModelsLevel\/update/, returnSuccess) // 修改定价策略
Mock.mock(/\/vue-admin\/config\/carModelsLevel\/getDiscountConfig/, getDiscountConfig) // 获取折扣矩阵
Mock.mock(/\/vue-admin\/system\/serviceSitePageList/, getServiceSiteList) // 场地管理列表
Mock.mock(/\/vue-admin\/system\/saveServiceSite/, returnSuccess) // 编辑场地
Mock.mock(/\/vue-admin\/system\/deleteServiceSite/, returnSuccess) // 删除场地
Mock.mock(/\/vue-admin\/system\/importServiceSite/, returnSuccess) // 导入场地
Mock.mock(/\/vue-admin\/admin\/strategy\/selectAll/, getStrategyList) // 免费取消策略列表
Mock.mock(/\/vue-admin\/admin\/alarmStrategy\/list/, getAlarmList) // 报警策略列表
Mock.mock(/\/vue-admin\/admin\/strategy\/add/, returnSuccess) // 新建取消策略
Mock.mock(/\/vue-admin\/admin\/strategy\/updateStrategy/, returnSuccess) // 编辑策略
Mock.mock(/\/vue-admin\/admin\/strategy\/delete/, returnSuccess) // 停用策略
Mock.mock(/\/vue-admin\/admin\/alarmStrategy\/save/, returnSuccess) // 新建报警策略
Mock.mock(/\/vue-admin\/admin\/alarmStrategy\/update/, returnSuccess) // 新建报警策略
Mock.mock(/\/vue-admin\/admin\/sysProtol\/query/, getAppProtolList) // APP协议列表
Mock.mock(/\/vue-admin\/admin\/sysProtol\/save/, returnSuccess) // 新建APP协议
Mock.mock(/\/vue-admin\/admin\/sysProtol\/edit/, returnSuccess) // 编辑APP协议
Mock.mock(/\/vue-admin\/admin\/orderEquipment\/list/, getDeviceList) // 获取接单设备列表
Mock.mock(/\/vue-admin\/admin\/orderEquipment\/switchDevice/, returnSuccess) // 切换接单设备
Mock.mock(/\/vue-admin\/admin\/sysElectronicFence\/select/, getElectronicFenceList) // 电子围栏列表
Mock.mock(/\/vue-admin\/admin\/sysElectronicFence\/saveOrUpdate/, returnSuccess) // 新增电子围栏


import { 
    getOrderList, getRoutePointModifyRecord, getActualTrack,
    getPlanningPath, getOrderDetail
} from './data/order-data'
// 订单管理
Mock.mock(/\/vue-admin\/admin\/order\/queryOrderListByPage/, getOrderList) // 订单列表
Mock.mock(/\/vue-admin\/admin\/order\/getOrderDetailByOrderId/, getOrderDetail) // 订单详情
Mock.mock(/\/vue-admin\/admin\/order\/routePointModifyRecord/, getRoutePointModifyRecord) // 途经点修改记录列表
Mock.mock(/\/vue-admin\/admin\/order\/actualTrack/, getActualTrack) // 实际行车轨迹
Mock.mock(/\/vue-admin\/admin\/order\/planningPath/, getPlanningPath) // 规划轨迹


import { 
    getCustomerList, getCustomerDetail, getCustomerOrderList,
    getRechargeList, getCustomerCouponList, getCustomerRefundList,
    getConsumptionList, getDisableAccountList, getEmergencyContactList,
    getTripShareList
} from './data/customer-data'
// 订单管理
Mock.mock(/\/vue-admin\/admin\/passenger\/queryList/, getCustomerList) // 乘客列表
Mock.mock(/\/vue-admin\/admin\/passenger\/queryDetail/, getCustomerDetail) // 乘客详情
Mock.mock(/\/vue-admin\/admin\/passenger\/queryOrderList/, getCustomerOrderList) // 乘客订单列表
Mock.mock(/\/vue-admin\/admin\/passenger\/queryRechargeList/, getRechargeList) // 乘客充值记录列表
Mock.mock(/\/vue-admin\/admin\/passenger\/listCoupon/, getCustomerCouponList) // 乘客优惠券列表
Mock.mock(/\/vue-admin\/admin\/passenger\/queryRefundList/, getCustomerRefundList) // 乘客退款列表
Mock.mock(/\/vue-admin\/admin\/passenger\/queryConsumptionList/, getConsumptionList) // 乘客消费列表
Mock.mock(/\/vue-admin\/admin\/passenger\/queryDisableAccountList/, getDisableAccountList) // 封号记录列表
Mock.mock(/\/vue-admin\/admin\/passenger\/queryEmergencyContactList/, getEmergencyContactList) // 紧急联系人列表
Mock.mock(/\/vue-admin\/admin\/passenger\/queryTripShareList/, getTripShareList) // 行程分享列表


import { getProvinceCityList, getCityOperatorTree } from './common'
Mock.mock(/\/common\/listProvinceCityData/, getProvinceCityList)
Mock.mock(/\/carDriver\/operatorList/, getCityOperatorTree)

export default Mock
