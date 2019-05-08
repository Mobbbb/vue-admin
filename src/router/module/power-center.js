import Main from '@/components/main'
import parentView from '@/components/parent-view'

export default {
  path: '/powerCenter',
  name: 'powerCenter',
  component: Main,
  meta: {
    icon: 'md-construct',
    title: '权限管理'
  },
  children: [
    {
      path: 'organization-control',
      name: 'organization-control',
      meta: {
        title: '组织机构管理'
      },
      component: () => import('@/view/single-page/power-modules/organization-control/index.vue')
    },
    {
      path: 'post-control',
      name: 'post-control',
      meta: {
        title: '岗位管理'
      },
      component: () => import('@/view/single-page/power-modules/post-control/index.vue')
    },
    {
      path: 'role-management',
      name: 'role-management',
      meta: {
        title: '操作角色管理'
      },
      component: () => import('@/view/single-page/power-modules/role-management/index.vue')
    },
    {
      path: 'user-management',
      name: 'user-management',
      meta: {
        title: '员工及账号管理'
      },
      component: () => import('@/view/single-page/power-modules/user-management/index.vue')
    },

    {
      path: 'user_control',
      name: 'user_control',
      meta: {
        title: '用户管理'
      },
      component: () => import('@/view/single-page/power-modules/user-control/index.vue')
    },
    {
      path: 'role_control',
      name: 'role_control',
      meta: {
        title: '角色管理'
      },
      component: () => import('@/view/single-page/power-modules/role-control/index.vue')
    },
    {
      path: 'menu_control',
      name: 'menu_control',
      meta: {
        title: '菜单管理'
      },
      component: () => import('@/view/single-page/power-modules/menu-control/index.vue')
    },
    {
      path: 'group_control',
      name: 'group_control',
      meta: {
        title: '分组管理'
      },
      component: () => import('@/view/single-page/power-modules/group-control/index.vue')
    }
  ]
}