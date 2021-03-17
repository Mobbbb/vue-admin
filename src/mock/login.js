const USER_MAP = {
  loginData: {"success":true, "data": { access_token: '123456' }},
  logoutData: {"msg":"已退出登录","code":200,"data":null,"success":true}
}

export const login = req => {
  return USER_MAP.loginData
}

export const logout = req => {
  return USER_MAP.logoutData
}
