export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/change_pwd',
    name: 'change_pwd',
    meta: {
      title: 'change_pwd - 修改密码',
      hideInMenu: true
    },
    component: () => import('@/view/change_pwd/change_pwd.vue')
  }
]
