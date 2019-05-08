import Main from '@/components/main'
import parentView from '@/components/parent-view'

export default {
  path: '/opCenter',
  name: 'opCenter',
  component: Main,
  meta: {
    icon: 'md-car',
    title: '营运管理',
    showAlways: true
  },
  children: [
    {
      path: 'user-protocol',
      name: 'user-protocol',
      meta: {
        title: '协议签署管理'
      },
      component: parentView,
      children: [
        {
          path: 'passenger-protocol',
          name: 'passenger-protocol',
          meta: {
            title: '乘客用户'
          },
          component: () => import('@/view/single-page/operator-moules/user-protocol/passenger-protocol/index.vue')
        },
        {
          path: 'driver-protocol',
          name: 'driver-protocol',
          meta: {
            title: '司机用户'
          },
          component: () => import('@/view/single-page/operator-moules/user-protocol/driver-protocol/index.vue')
        }
      ]
    },
    {
      path: 'carrier-center',
      name: 'carrier-center',
      meta: {
        title: '运营商管理'
      },
      component: parentView,
      children: [
        {
          path: 'carrier',
          name: 'carrier',
          meta: {
            title: '运营商'
          },
          component: () => import('@/view/single-page/operator-moules/carrier-management/carrier/index.vue')
        },
        {
          path: 'carrier-detail',
          name: 'carrier-detail',
          meta: {
            title: '运营商详情',
            parentName: 'carrier',
            hideInMenu: true
          },
          component: () => import('@/view/single-page/operator-moules/carrier-management/carrier/operation/detail.vue')
        },
        {
          path: 'assessment-rule',
          name: 'assessment-rule',
          meta: {
            title: '考核规则管理'
          },
          component: () => import('@/view/single-page/operator-moules/carrier-management/assessment-rule/index.vue')
        },
      ]
    },
    {
      path: 'platform-center',
      name: 'platform-center',
      meta: {
        title: '平台信息管理'
      },
      component: () => import('@/view/single-page/operator-moules/platform/index.vue')
    },
    {
      path: 'vehicle-center',
      name: 'vehicle-center',
      meta: {
        title: '车辆管理'
      },
      component: () => import('@/view/single-page/operator-moules/vehicle/index.vue')
    },
    {
      path: 'detail/:id',
      name: 'vehicle-detail',
      meta: {
        title: '车辆详情',
        parentName: 'vehicle-center',
        hideInMenu: true
      },
      component: () => import('@/view/single-page/operator-moules/vehicle/vehicle-detail.vue')
    },
    {
      path: 'edit/:id',
      name: 'add-vehicle',
      meta: {
        title: '编辑车辆',
        parentName: 'vehicle-center',
        hideInMenu: true
      },
      component: () => import('@/view/single-page/operator-moules/vehicle/edit.vue')
    },
  ]
}