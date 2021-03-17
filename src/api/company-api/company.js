import axios from '@/libs/api.request'

/* 
企业信息 
*/
//获取企业列表
export const getCompanyList = (data) => {
    return axios.request({
		url: 'admin/company/list',
		data,
		method: 'POST'
    })
}
	
//新增企业
export const addCompany = (data) => {
  	return axios.request({
		url: 'admin/company/insert',
		data,
		method: 'POST'
  	})
}  

//编辑企业
export const editCompany = (data) => {
	return axios.request({
	  url: 'admin/company/edit',
	  data,
	  method: 'POST'
	})
}  


//获取企业详情
export const getCompanyDetail = (data) => {
	return axios.request({
		url: 'admin/company/detail',
		data,
		method: 'POST'
	})
}  

//开通或关闭企业
export const enableCompany = (data) => {
	return axios.request({
		url: 'admin/company/enable',
		data,
		method: 'POST'
	})
}  

/* 
企业用车管理
*/

//获取用车场景列表
export const getCarInfoScenes = (data) => {
  	return axios.request({
		url: 'admin/companyUseCarInfoScenes/listQuery',
		data,
		method: 'POST'
  	})
}

//编辑用车场景
export const editCarInfoScenes = (data) => {
	return axios.request({
	  url: 'admin/companyUseCarScenes/edit',
	  data,
	  method: 'POST'
	})
}

//获取用车场景详情
export const CarInfoScenesDetail = (data) => {
	return axios.request({
	  url: 'admin/companyUseCarScenes/detail',
	  data,
	  method: 'POST'
	})
}

//获取场景列表
export const carScenesList = (data) => {
	return axios.request({
	  url: 'admin/companyUseCarInfoScenes/sceneslist',
	  data,
	  method: 'POST'
	})
}

//新增用车场景
export const addCarScenes = (data) => {
	return axios.request({
	  url: 'admin/companyUseCarInfoScenes/scenesAdd',
	  data,
	  method: 'POST'
	})
}

//删除用车场景
export const delCarScenes = (data) => {
	return axios.request({
	  url: 'admin/companyUseCarInfoScenes/scenesRemove',
	  data,
	  method: 'POST'
	})
}

/* 
审核管理
*/

//审核管理列表
export const companyAuditList= (data) => {
	return axios.request({
	  url: '/admin/companyReview/list',
	  data,
	  method: 'POST'
	})
}

//审核管理详情
export const companyAuditDetail= (data) => {
	return axios.request({
	  url: 'admin/companyReview/detail',
	  data,
	  method: 'POST'
	})
}

//审核更改状态
export const companyAuditVerify= (data) => {
	return axios.request({
	  url: 'admin/companyReview/verify',
	  data,
	  method: 'POST'
	})
}

/* 人员信息 */

//人员列表
export const companyUserList= (data) => {
	return axios.request({
	  url: 'admin/staff/list',
	  data,
	  method: 'POST'
	})
}

/* 财务结算*/

//财务结算页面中的结算账单数据查询操作
export const getSettlementList= (data) => {
	return axios.request({
	  url: '/company/settlement/list',
	  data,
	  method: 'POST'
	})
}
//财务结算确认收款页面的基础数据查询
export const receiptQuery= (companyId) => {
	return axios.request({
	  url: `/company/settlement/receipt/${companyId}`,
	  method: 'POST'
	})
}
//财务结算确认收款页面的更新操作
export const receiptEdit= (data) => {
	return axios.request({
	  url: '/company/settlement/receipt/edit',
	  data,
	  method: 'POST'
	})
}
//全部账单
export const settlementBill= (data) => {
	return axios.request({
	  url: '/company/settlement/bill',
	  data,
	  method: 'POST'
	})
}
//账单详情
export const billInfo = (data) => {
	return axios.request({
	  url: '/company/settlement/bill/info',
	  data,
	  method: 'POST'
	})
}
//压缩下载
export const downloadZip = (data) => {
	return axios.request({
	  url: '/common/downloadZip',
	  data,
	  method: 'POST'
	})
}