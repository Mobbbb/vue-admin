/**
 * 基础管理-权限管理 接口
 */

import axios from '@/libs/api.request'

/**
 * 获取菜单列表
 */
export const getMenuList = () => {
  return axios.request({
    url: '/sys/resource/listData',
    method: 'post'
  })
}

/**
 * 新增菜单
 */
export const saveMenu = (data) => {
  return axios.request({
    url: '/sys/resource/save',
    method: 'post',
    data: data
  })
}

/**
 * 删除菜单
 */
export const deleteMenu = (data) => {
  return axios.request({
    url: '/sys/resource/delete',
    method: 'post',
    data: data
  })
}

/**
 * 编辑菜单
 */
export const updateMenu = (data) => {
  return axios.request({
    url: '/sys/resource/update',
    method: 'post',
    data: data
  })
}

/**
 * 获取用户列表
 */
export const getUserList = (data) => {
  return axios.request({
    url: '/sys/usr/listData',
    method: 'post',
    data: data
  })
}

/**
 * 获取角色列表
 */
export const getRoleList = (data) => {
  return axios.request({
    url: '/sys/role/listData',
    method: 'post',
    data: data
  })
}

/**
 * 新增用户
 */
export const saveUser = (data) => {
  return axios.request({
    url: '/sys/usr/save',
    method: 'post',
    data: data
  })
}

/**
 * 编辑用户
 */
export const updateUser = (data) => {
  return axios.request({
    url: '/sys/usr/update',
    method: 'post',
    data: data
  })
}

/**
 * 删除用户
 */
export const deleteUser = (data) => {
  return axios.request({
    url: '/sys/usr/delete',
    method: 'post',
    data: data
  })
}

/**
 * 菜单详情
 */
export const getMenuByRoleId = (data) => {
  return axios.request({
    url: '/sys/role/resource',
    method: 'post',
    data: data
  })
}

/**
 * 新增角色
 */
export const getSaveRole = (data) => {
  return axios.request({
    url: '/sys/role/save',
    method: 'post',
    data: data
  })
}

/**
 * 编辑角色
 */
export const getUpdateRole = (data) => {
  return axios.request({
    url: '/sys/role/update',
    method: 'post',
    data: data
  })
}

/**
 * 删除角色
 */
export const deleteRole = (data) => {
  return axios.request({
    url: '/sys/role/delete',
    method: 'post',
    data: data
  })
}

/**
 * 冻结/解冻用户
 */
export const updateStatus = (data) => {
  return axios.request({
    url: '/sys/usr/updateStatus',
    method: 'post',
    data: data
  })
}

/**
 * 重置密码
 */
export const resetPassword = (data) => {
  return axios.request({
    url: '/sys/usr/resetPassword',
    method: 'post',
    data: data
  })
}

/**
 * 获取用户姓名列表
 */
export const userRemoteByName = (data) => {
  return axios.request({
    url: '/sys/usr/names',
    method: 'post',
    data: data
  })
}

/**
 * 分组列表
 */
export const getGroupList = (data) => {
  return axios.request({
    url: '/sys/group/listData',
    method: 'post',
    data: data
  })
}

/**
 * 新增分组
 */
export const addGroup = (data) => {
  return axios.request({
    url: '/sys/group/save',
    method: 'post',
    data: data
  })
}

/**
 * 编辑分组
 */
export const updateGroup = (data) => {
  return axios.request({
    url: '/sys/group/update',
    method: 'post',
    data: data
  })
}

/**
 * 获取所有分组列表
 */
export const allGroupList = (data) => {
  return axios.request({
    url: '/sys/group/all',
    method: 'post',
    data: data
  })
}

/**
 * 删除分组
 */
export const deleteGroup = (data) => {
  return axios.request({
    url: '/sys/group/delete',
    method: 'post',
    data: data
  })
}