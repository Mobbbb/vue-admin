import Mock from 'mockjs'
import { getNavList, getUserInfo } from './data/power-data'
import { 
    getAgentByCity, queryCarListByRemote, getOpmanerByOrgan, 
    getSiteList, getDriverDetail, getCarByVin
} from './data/map-data'
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

// 登录相关、获取菜单、获取用户信息
Mock.mock(/\/auth-api\/api\/v1\/staff\/selectLoginStaffInfo/, getUserInfo) // 获取用户信息
Mock.mock(/\/auth-api\/api\/auth\/resource\/queryResourceByAccountId/, getNavList) // 菜单资源列表

// 运营地图
Mock.mock(/\/t3-admin\/admin\/driverRemote\/getAgentByCity/, getAgentByCity) // 根据城市获取运营商
Mock.mock(/\/t3-admin\/admin\/driverRemote\/getCarDistribution/, queryCarListByRemote) // 查询地图服务要求的数据信息
Mock.mock(/\/t3-admin\/admin\/driver\/managerDriver/, getOpmanerByOrgan) // 根据运营商获取司管
Mock.mock(/\/t3-admin\/system\/serviceSiteList/, getSiteList) // 获取站点列表
Mock.mock(/\/t3-admin\/admin\/driver\/detail/, getDriverDetail) // 获取司机详情信息
Mock.mock(/\/t3-admin\/admin\/carManager\/detailInfo/, getCarByVin) // 根据vin获取车辆的基础信息

// 营运管理
Mock.mock(/\/t3-admin\/protocolAgree\/queryPage/, getDriverList) // 获取协议
Mock.mock(/\/t3-admin\/admin\/sysAgent\/getAllOrgan/, getAllOrgan) // 获取所有组织机构
Mock.mock(/\/t3-admin\/admin\/sysAgent\/queryAgentPageList/, getAgentPageList) // 获取运营商列表
Mock.mock(/\/t3-admin\/admin\/sysAgent\/getAgentById/, getAgentById) // 获取运营商详情
Mock.mock(/\/t3-admin\/admin\/sysAgent\/save/, returnSuccess) // 更新运营商
Mock.mock(/\/t3-admin\/admin\/sysAgent\/assessment\/rules/, getAgentRules) // 获取运营商考核规则
Mock.mock(/\/t3-admin\/admin\/sysAgent\/assessment\/result/, getAgentResult) // 获取运营商考核结果
Mock.mock(/\/t3-admin\/admin\/regional\/agentCommision\/list/, getDrpList) // 获取抽成列表
Mock.mock(/\/t3-admin\/admin\/regional\/agentCommision\/getExistMonths/, getExistMonths1) // 获取已存在的月份
Mock.mock(/\/t3-admin\/admin\/regional\/agentSubsidy\/getExistMonths/, getExistMonths2) // 获取已存在的月份
Mock.mock(/\/t3-admin\/admin\/regional\/agentCommision\/save/, returnSuccess) // 保存抽成
Mock.mock(/\/t3-admin\/admin\/regional\/agentCommision\/info/, getDrpDetail) // 获取抽成详情
Mock.mock(/\/t3-admin\/admin\/regional\/agentCommision\/update/, returnSuccess) // 更新抽成
Mock.mock(/\/t3-admin\/admin\/regional\/agentCommision\/remove/, returnSuccess) // 删除抽成
Mock.mock(/\/t3-admin\/admin\/regional\/agentSubsidy\/list/, getSubsidyList) // 获取补贴列表
Mock.mock(/\/t3-admin\/admin\/regional\/agentSubsidy\/save/, returnSuccess) // 补贴
Mock.mock(/\/t3-admin\/admin\/regional\/agentSubsidy\/update/, returnSuccess) // 补贴
Mock.mock(/\/t3-admin\/admin\/regional\/agentSubsidy\/remove/, returnSuccess) // 补贴
Mock.mock(/\/t3-admin\/admin\/regional\/agentSubsidy\/info/, getSubsidyDetail) // 获取补贴详情
Mock.mock(/\/t3-admin\/manager\/driver\/manager\/list/, getDriverMList) // 司管列表/司机列表
Mock.mock(/\/t3-admin\/admin\/carManager\/queryVehicleManagementListByPage/, getCarMList) // 车管列表
Mock.mock(/\/t3-admin\/admin\/driver\/examine\/rule\/list/, getRuleList) // 考核规则
Mock.mock(/\/t3-admin\/admin\/driver\/examine\/rule\/info/, getRuleDetail) // 考核规则
Mock.mock(/\/t3-admin\/admin\/driver\/examine\/rule\/add/, returnSuccess) // 新增考核
Mock.mock(/\/t3-admin\/admin\/driver\/examine\/rule\/edit/, returnSuccess) // 编辑考核
Mock.mock(/\/t3-admin\/common\/citys/, getCityList) // 获取同级城市列表
Mock.mock(/\/t3-admin\/platformInfo\/query/, getPlatformInfo) // 获取平台信息
Mock.mock(/\/t3-admin\/platformService\/query/, getPlatformService) // 获取平台信息
Mock.mock(/\/t3-admin\/platformPermit\/query/, getPlatformPermit) // 获取平台信息
Mock.mock(/\/t3-admin\/platformPay\/query/, getPlatformPay) // 获取平台信息
Mock.mock(/\/t3-admin\/platformInfo\/addPlatformInfo/, returnSuccess) // 编辑平台信息
Mock.mock(/\/t3-admin\/platformPay\/addPlatformPay/, returnSuccess) // 编辑平台信息
Mock.mock(/\/t3-admin\/platformService\/addPlatformService/, returnSuccess) // 编辑平台信息
Mock.mock(/\/t3-admin\/platformPermit\/addPlatformPermit/, returnSuccess) // 编辑平台信息
Mock.mock(/\/t3-admin\/admin\/carManager\/list/, getCarList) // 获取车辆列表
Mock.mock(/\/t3-admin\/admin\/carManager\/detailInfo/, getCarDetailInfo) // 获取车辆基本信息
Mock.mock(/\/t3-admin\/admin\/carManager\/authorizedDriver/, getAuthorizedDriverList) // 获取准驾司机列表
Mock.mock(/\/t3-admin\/admin\/carManager\/authDriver/, returnSuccess) // 司机授权
Mock.mock(/\/t3-admin\/admin\/carManager\/violationRecord/, getViolationRecordList) // 获取违章记录
Mock.mock(/\/t3-admin\/admin\/carManager\/orderList/, getCarOrderList) // 获取车辆订单信息
Mock.mock(/\/t3-admin\/admin\/carManager\/historicalUser/, getHistoricalUserList) // 获取历史使用人



export default Mock
