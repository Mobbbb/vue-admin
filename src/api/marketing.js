import axios from '@/libs/api.request'

// 获取优惠券模板列表
export const getCouponsTemplateList = (data) => {
  	return axios.request({
	    url: '/admin/template/list',
	    data,
	    method: 'post'
  	})
}

// 获取优惠券模板详情
export const getCouponsTemplateDetail = (data) => {
  	return axios.request({
	    url: '/admin/template/info',
	    data,
	    method: 'post'
  	})
}

// 新建优惠券模板
export const addCouponsTemplate = (data) => {
  	return axios.request({
	    url: '/admin/template/save',
	    data,
	    method: 'post'
  	})
}

// 停用优惠券模板
export const banCouponsTemplate = (data) => {
  	return axios.request({
	    url: '/admin/template/disable',
	    data,
	    method: 'post'
  	})
}

// 获取用户群列表
export const getUserGroupList = (data) => {
  	return axios.request({
	    url: '/admin/userGroup/list',
	    data,
	    method: 'post'
  	})
}

// 新建导入类/条件类
export const addUserGroup = (data) => {
  	return axios.request({
	    url: '/admin/userGroup/save',
	    data,
	    method: 'post'
  	})
}

// 编辑导入类/条件类
export const updateUserGroup = (data) => {
  	return axios.request({
	    url: '/admin/userGroup/update',
	    data,
	    method: 'post'
  	})
}

// 导入类/条件类详情
export const getUserGroupDetail = (data) => {
  	return axios.request({
	    url: '/admin/userGroup/info',
	    data,
	    method: 'post'
  	})
}

// 轮询返回计算结果
export const pollingUploadResult = (data) => {
  	return axios.request({
	    url: '/admin/userGroup/importCallback',
	    data,
	    method: 'post'
  	})
}

// 创建/编辑用户群完成接口
export const userGroupConfirm = (data) => {
  	return axios.request({
	    url: '/admin/userGroup/confirm',
	    data,
	    method: 'post'
  	})
}

// 启用停用用户群
export const updateUserGroupStatus = (data) => {
  	return axios.request({
	    url: '/admin/userGroup/updateStatus',
	    data,
	    method: 'post'
  	})
}