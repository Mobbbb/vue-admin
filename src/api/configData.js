import axios from '@/libs/api.request'

// 获取站点列表--地图 --没有分页
export const getSiteList = (data) => {
  return axios.request({
    url: '/system/serviceSiteList',
    data,
    method: 'post'
  })
}
// 更新站点
export const saveServiceSite = (data) => {
  return axios.request({
    url: '/system/saveServiceSite',
    data,
    method: 'post'
  })
}
// 删除站点
export const deleteServiceSite = (data) => {
  return axios.request({
    url: '/system/deleteServiceSite',
    data,
    method: 'post'
  })
}

// 计费规则列表
export const getModelsLeveList = (data) => {
  return axios.request({
    url: '/config/carModelsLevel/listData',
    data,
    method: 'post'
  })
}

// 计费规则查询
export const getModelRules = (data) => {
  return axios.request({
    url: '/config/carModelsLevel/detail',
    data,
    method: 'post'
  })
}

// 计费规则更新
export const updateCarModel = (data) => {
  return axios.request({
    url: '/config/carModelsLevel/update',
    data,
    method: 'post'
  })
}

// 添加开通城市
export const addCity = (data) => {
  return axios.request({
    url: '/config/carModelsLevel/addCity',
    data,
    method: 'post'
  })
}

// 关闭城市
export const turnoffCity = (data) => {
  return axios.request({
    url: '/config/carModelsLevel/closeCity',
    data,
    method: 'post'
  })
}
// 开启城市
export const turnOnCity = (data) => {
  return axios.request({
    url: '/config/carModelsLevel/openCity',
    data,
    method: 'post'
  })
}

// 获取当前城市的坏账策略
export const getBdStrategy = (data) => {
  return axios.request({
    url: '/config/carModelsLevel/queryCreditModel',
    data,
    method: 'post'
  })
}

// 编辑城市坏账策略
export const editbdModel = (data) => {
  return axios.request({
    url: '/config/carModelsLevel/saveCreditModel',
    data,
    method: 'post'
  })
}

// 品牌列表
export const getBrandList = (data) => {
  return axios.request({
    url: '/config/model/queryBrandPageList',
    data,
    method: 'post'
  })
}

// 新增品牌
export const saveBrand = (data) => {
  return axios.request({
    url: '/config/model/saveBrandModel',
    data,
    method: 'post'
  })
}

// 删除品牌
export const deleteBrand = (data) => {
  return axios.request({
    url: '/config/model/deleteBrandModel',
    data,
    method: 'post'
  })
}
//停用品牌
export const ableControlBrand = (data) => {
  return axios.request({
    url: 'config/model/enableOrDisableBrandModel',
    data,
    method: 'post'
  })
}

// 获取车型列表
export const getModelList = (data) => {
  return axios.request({
    url: '/config/model/queryCarModelPageList',
    data,
    method: 'post'
  })
}

// 获取品牌
export const getOwnedBrand = (data) => {
  return axios.request({
    url: '/config/model/brandList',
    data,
    method: 'post'
  })
}

// 新增车型
export const saveCarModel = (data) => {
  return axios.request({
    url: '/config/model/saveOrUpdateCarModel',
    data,
    method: 'post'
  })
}
// 删除车型
export const deleteCarModel = (data) => {
  return axios.request({
    url: '/config/model/deleteCarModel',
    data,
    method: 'post'
  })
}
// ******APP协议管理 ******//
// app协议管理列表
export const protocolListdata = data => {
  return axios.request({
    url: '/admin/sysProtol/query',
    data,
    method: 'post'
  })
}
// app协议管理新增（保存）
export const protocolSave = data => {
  return axios.request({
    url: '/admin/sysProtol/save',
    data,
    method: 'post'
  })
}
// app协议管理更新
export const protocolEdit = data => {
  return axios.request({
    url: '/admin/sysProtol/edit',
    data,
    method: 'post'
  })
}
// app协议管理详情
export const protocolDetail = data => {
  return axios.request({
    url: '/admin/sysProtol/getProtocolById',
    data,
    method: 'post'
  })
}
// ******系统策略管理 ******//
// 考勤策略-详情
export const attendanceStrategyDetail = data => {
  return axios.request({
    url: '/admin/attendanceStrategy/get',
    data,
    method: 'post'
  })
}
// 考勤策略-删除
export const attendanceStrategyDelete = data => {
  return axios.request({
    url: `/admin/attendanceStrategy/delete${data}`,
    data,
    method: 'get'
  })
}
// 考勤策略--分页查询
export const attendanceStrategyPage = data => {
  return axios.request({
    url: '/admin/attendanceStrategy/queryPage',
    data,
    method: 'post'
  })
}
// 考勤策略--新增
export const attendanceStrategySave = data => {
  return axios.request({
    url: '/admin/attendanceStrategy/save',
    data,
    method: 'post'
  })
}
// 考勤策略-修改
export const attendanceStrategyUpdate = data => {
  return axios.request({
    url: '/admin/attendanceStrategy/update',
    data,
    method: 'post'
  })
}
// 订单策略删除
export const orderStrategyDelete = data => {
  return axios.request({
    url: '/admin/strategy/delete',
    data,
    method: 'post'
  })
}
// 订单策略编辑
export const orderUpdateStrategy = data => {
  return axios.request({
    url: '/admin/strategy/updateStrategy',
    data,
    method: 'post'
  })
}
// 订单策略添加
export const orderStrategyAdd = data => {
  return axios.request({
    url: '/admin/strategy/add',
    data,
    method: 'post'
  })
}
// 订单策略--分页查询
export const orderselectAll = data => {
  return axios.request({
    url: 'admin/strategy/selectAll',
    data,
    method: 'post'
  })
}
// 开通城市
export const getChoiceCity = data => {
  return axios.request({
    url: '/admin/city/getOpenCity',
    method: 'get'
  })
}
// 运营商查询
export const getAgentList = data => {
  return axios.request({
    url: `/admin/city/getAgent`,
    data,
    method: 'post'
  })
}
// 日历功能
// 日期更新
export const calenderUpdate = data => {
  return axios.request({
    url: '/admin/calender/update',
    data,
    method: 'post'
  })
}
// 日期查询
export const calenderSelectByParam = data => {
  return axios.request({
    url: `/admin/calender/selectByParam`,
    data,
    method: 'post'
  })
}
// 插入日历
export const calenderInsertCalendar = data => {
  return axios.request({
    url: `/admin/calender/insertCalendar${data}`,
    method: 'get'
  })
}
// 偏离报警策略--列表
export const alarmList = data => {
  return axios.request({
    url: '/admin/alarmStrategy/list',
    data,
    method: 'post'
  })
}
// 偏离报警策略--详情
export const alarmListDdetail = data => {
  return axios.request({
    url: '/admin/alarmStrategy/getDetail',
    data,
    method: 'post'
  })
}
// 偏离报警策略--保存/修改
export const alarmSave = data => {
  return axios.request({
    url: '/admin/alarmStrategy/save',
    data,
    method: 'post'
  })
}
// 偏离报警策略--保存/修改
export const alarmUpate = data => {
  return axios.request({
    url: '/admin/alarmStrategy/update',
    data,
    method: 'post'
  })
}
// ******运营地图 ******//
// 保存乘客脸部特征
export const saveFaceFeature = data => {
  return axios.request({
    url: '/admin/passenger/saveFaceFeature',
    data,
    method: 'post'
  })
}
// 全国车辆总数
export const findCarAddress = data => {
  return axios.request({
    url: '/admin/carMonitor/findCarAddress',
    data,
    method: 'post'
  })
}
// 查询地图服务要求的数据信息
export const queryCarListByRemote = data => {
  return axios.request({
    url: '/admin/driverRemote/getCarDistribution',
    data,
    method: 'post'
  })
}
// 城市总数统计
export const getCountCityCar = data => {
  return axios.request({
    url: '/admin/carMonitor/countCityCar',
    data,
    method: 'post'
  })
}
// 统计地图服务要求的数据信息
export const getcountCars = data => {
  return axios.request({
    url: '/admin/driverRemote/countCars',
    data,
    method: 'post'
  })
}
// 根据vin获取车辆实时信息
export const findOneByVin = data => {
  return axios.request({
    url: '/admin/carManager/realTimeStatus',
    data,
    method: 'post'
  })
}
// 根据vin获取车辆的基础信息
export const getCarByVin = data => {
  return axios.request({
    url: '/admin/carManager/detailInfo',
    data,
    method: 'post'
  })
}
// 获取司机详情信息
export const getDriverDetail = data => {
  return axios.request({
    url: '/admin/driver/detail',
    data,
    method: 'post'
  })
}
// 远程控制--获取
export const getRmoteControlGet = data => {
  return axios.request({
    url: '/admin/driverRemote/getCarControl',
    data,
    method: 'post'
  })
}
// 远程控制--修改
export const getRmoteEdit = data => {
  return axios.request({
    url: '/admin/driverRemote/editCarControl',
    data,
    method: 'post'
  })
}
// 查询当日订单
export const getDriverOrderPage = data => {
  return axios.request({
    url: 'admin/carManager/orderList',
    data,
    method: 'post'
  })
}
// 查询批量选中的车辆分页信息
export const getCarPageByVins = data => {
  return axios.request({
    url: '/admin/driverRemote/getCarPageByVins',
    data,
    method: 'post'
  })
}
// 根据车辆uuid获得今日订单分页信息
export const getOrderPageToday = data => {
  return axios.request({
    url: '/admin/driverRemote/getOrderPageToday',
    data,
    method: 'post'
  })
}
// 保存车辆或司机信息
export const saveDriverOrCarMsg = (data, query) => {
  return axios.request({
    url: `/admin/sms/batch/send${query}`,
    data,
    method: 'post'
  })
}
// 保存车辆或司机信息
export const savePushToCars = data => {
  return axios.request({
    url: '/admin/system/push/pushToCars',
    data,
    method: 'post'
  })
}
// 场地管理 站点列表--（有分页）
export const serviceSitePageList = data => {
  return axios.request({
    url: '/system/serviceSitePageList',
    data,
    method: 'post'
  })
}
// 获取地图 电子围栏--电子围栏
export const getElefenServiceSelect = data => {
  return axios.request({
    url: '/admin/sysElectronicFence/selectInfo',
    data,
    method: 'post'
  })
}
// 根据城市获取运营商
export const getAgentByCity = data => {
  return axios.request({
    url: '/admin/driverRemote/getAgentByCity',
    data,
    method: 'post'
  })
}
// 根据运营商获取司管
export const getOpmanerByOrgan = data => {
  return axios.request({
    url: '/admin/driver/managerDriver',
    data,
    method: 'post'
  })
}
// 获取当日订单
export const getOrderListByVin = data => {
  return axios.request({
    url: '/admin/carManager/orderList',
    data,
    method: 'post'
  })
}
// 发送短信
export const sendSms = data => {
  return axios.request({
    url: '/admin/sms/sendSms',
    data,
    method: 'post'
  })
}
// ******平台信息管理 ******//
// 获取省市列表
export const getCityList = data => {
  return axios.request({
    url: '/common/citys',
    data,
    method: 'post'
  })
}
// 运营规模信息查询
export const getScaleInfo = data => {
  return axios.request({
    url: '/operationScale/queryDriverCarNum',
    data,
    method: 'post'
  })
}
// 平台基本信息查询
export const getBasicInfo = data => {
  return axios.request({
    url: '/platformInfo/query',
    data,
    method: 'post'
  })
}
// 平台基本信息修改
export const editBasicInfo = data => {
  return axios.request({
    url: '/platformInfo/addPlatformInfo',
    data,
    method: 'post'
  })
}
// 支付信息查询
export const getPayInfo = data => {
  return axios.request({
    url: '/platformPay/query',
    data,
    method: 'post'
  })
}
// 支付信息修改
export const editPayInfo = data => {
  return axios.request({
    url: '/platformPay/addPlatformPay',
    data,
    method: 'post'
  })
}
// 服务机构信息查询
export const getServiceInfo = data => {
  return axios.request({
    url: '/platformService/query',
    data,
    method: 'post'
  })
}
// 服务机构信息修改
export const editServiceInfo = data => {
  return axios.request({
    url: '/platformService/addPlatformService',
    data,
    method: 'post'
  })
}
// 经营许可信息查询
export const getLicenseInfo = data => {
  return axios.request({
    url: '/platformPermit/query',
    data,
    method: 'post'
  })
}
// 经营许可信息修改
export const editLicenseInfo = data => {
  return axios.request({
    url: '/platformPermit/addPlatformPermit',
    data,
    method: 'post'
  })
}
// 电子围栏管理
// 电子围栏保存
export const savePen = data => {
  return axios.request({
    url: '/admin/sysElectronicFence/saveOrUpdate',
    data,
    method: 'post'
  })
}
// 电子围栏查询
export const selectPen = data => {
  return axios.request({
    url: '/admin/sysElectronicFence/select',
    data,
    method: 'post'
  })
}
// 电子围栏详情
export const getPenDetail = data => {
  return axios.request({
    url: '/admin/sysElectronicFence/getDetail' + `${data}`,
    method: 'get'
  })
}

// 接单设备列表(查询)
export const getOrderEquipmentList = data => {
  return axios.request({
    url: '/admin/orderEquipment/list',
    data,
    method: 'post'
  })
}

// 获取接单设备操作记录
export const getOperationRecord = data => {
  return axios.request({
    url: '/admin/orderEquipment/operationRecord',
    data,
    method: 'post'
  })
}

// 根据车辆vin或者运营商查询接单设备信息
export const getVinInfo = data => {
  return axios.request({
    url: '/admin/orderEquipment/getByVinOrOperator',
    data,
    method: 'post'
  })
}

// 保存接单设备设置
export const saveNewEquipConfig = data => {
  return axios.request({
    url: '/admin/orderEquipment/save',
    data,
    method: 'post'
  })
}

// 接单设备详情
export const getEquitConfigDetail = data => {
  return axios.request({
    url: '/admin/orderEquipment/get' ,
    data,
    method: 'post'
  })
}

// 编辑折扣矩阵
export const saveDiscount = data => {
  return axios.request({
    url: '/config/carModelsLevel/updateDiscountConfig' ,
    data,
    method: 'post'
  })
}

// 获取折扣矩阵信息
export const getDiscountInfo = data => {
  return axios.request({
    url: '/config/carModelsLevel/getDiscountConfig' ,
    data,
    method: 'post'
  })
}

// 车辆供应商分页列表接口
export const getProviderList = data => {
  return axios.request({
    url: '/admin/carProvider/list' ,
    data,
    method: 'post'
  })
}

// 新增车辆供应商
export const addProvider = data => {
  return axios.request({
    url: '/admin/carProvider/save' ,
    data,
    method: 'post'
  })
}

// 编辑车辆供应商
export const editProvider = data => {
  return axios.request({
    url: '/admin/carProvider/edit' ,
    data,
    method: 'post'
  })
}

// 获取人脸识别列表
export const getFaceList = data => {
  return axios.request({
    url: '/config/carFaceRecognition/list' ,
    data,
    method: 'post'
  })
}

// 更改人脸识别状态
export const updateFaceStatus = data => {
  return axios.request({
    url: '/config/carFaceRecognition/update' ,
    data,
    method: 'post'
  })
}

// 切换接单设备
export const switchDevice = data => {
  return axios.request({
    url: '/admin/orderEquipment/switchDevice' ,
    data,
    method: 'post'
  })
}
