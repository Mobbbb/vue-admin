/**
 * 配置管理-开通城市 接口
 */

import axios from '@/libs/api.request'

/**
 * 定价策略列表
 */
export const getPriceStrategyList = (data) => {
  	return axios.request({
	    url: '/config/carModelsLevel/priceStrategyQuery',
	    method: 'post',
	    data
  	})
}

/**
 * 新增定价策略
 */
export const addPriceStrategy = (data) => {
  	return axios.request({
	    url: '/config/carModelsLevel/priceStrategySave',
	    method: 'post',
	    data
  	})
}

/**
 * 定价策略详情
 */
export const priceStrategyDetail = (data) => {
  	return axios.request({
	    url: '/config/carModelsLevel/priceStrategyDetail',
	    method: 'post',
	    data
  	})
}

/**
 * 删除定价策略
 */
export const deletePriceStrategy = (data) => {
  	return axios.request({
	    url: '/config/carModelsLevel/updateFareModel',
	    method: 'post',
	    data
  	})
}

/**
 * 坏账策略列表
 */
export const getBadDebtList = (data) => {
  	return axios.request({
	    url: '/config/carModelsLevel/badDebtQuery',
	    method: 'post',
	    data
  	})
}

/**
 * 新增坏账策略
 */
export const addBadDebt = (data) => {
  	return axios.request({
	    url: '/config/carModelsLevel/badDebtSave',
	    method: 'post',
	    data
  	})
}

/**
 * 坏账策略详情
 */
export const badDebtDetail = (data) => {
  	return axios.request({
	    url: '/config/carModelsLevel/badDebtDetail',
	    method: 'post',
	    data
  	})
}

/**
 * 删除坏账策略
 */
export const deleteBadDebt = (data) => {
  	return axios.request({
	    url: '/config/carModelsLevel/updateBadDebt',
	    method: 'post',
	    data
  	})
}

/**
 * 折扣矩阵列表
 */
export const getDiscountList = (data) => {
  	return axios.request({
	    url: '/config/carModelsLevel/discountConfigQuery',
	    method: 'post',
	    data
  	})
}

/**
 * 新增折扣矩阵
 */
export const addDiscount = (data) => {
  	return axios.request({
	    url: '/config/carModelsLevel/discountConfigSave',
	    method: 'post',
	    data
  	})
}

/**
 * 折扣矩阵详情
 */
export const discountDetail = (data) => {
  	return axios.request({
	    url: '/config/carModelsLevel/discountConfigDetail',
	    method: 'post',
	    data
  	})
}

/**
 * 删除折扣矩阵
 */
export const deleteDiscount = (data) => {
  	return axios.request({
	    url: '/config/carModelsLevel/discountConfigUpdate',
	    method: 'post',
	    data
  	})
}