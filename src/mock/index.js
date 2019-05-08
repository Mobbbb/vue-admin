import Mock from 'mockjs'
import { getNavList, getUserInfo } from './data/power-data'
import { 
    getAgentByCity, 
    queryCarListByRemote, 
    getOpmanerByOrgan, 
    getSiteList, 
    getDriverDetail,
    getCarByVin
} from './data/map-data'
import { getDriverList } from './data/operator-data'

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

Mock.mock(/\/t3-admin\/protocolAgree\/queryPage/, getDriverList) // 获取协议




export default Mock
