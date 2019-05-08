import { getParams } from '@/libs/util'

const USER_MAP = {
  loginData: {"success":true},
  userInfo: {"msg":"成功","code":200,"data":{"uuid":"0bc75f3a24ea4bab9bfafcaf4802038c","userName":"陈神仙","userAccount":"陈神仙"},"success":true},
  logoutData: {"msg":"已退出登录","code":200,"data":null,"success":true}
}

export const login = req => {
  return USER_MAP.loginData
}

export const getUserInfo = req => {
  return USER_MAP.userInfo
}

export const logout = req => {
  return USER_MAP.logoutData
}
