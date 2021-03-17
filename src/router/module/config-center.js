import Main from '@/components/main'
import parentView from '@/components/parent-view'

export default {
  path: '/configCenter',
  name: 'configCenter',
  component: Main,
  meta: {
    icon: 'md-construct',
    title: '配置管理'
  },
  children: [
    {
      path: 'face_recognition',
      name: 'face_recognition',
      meta: {
        title: '车机人脸识别管理'
      },
      component: () => import('@/view/single-page/config-modules/face_recognition/index.vue')
    },
    {
      path: 'city_control',
      name: 'city_control',
      meta: {
        title: '开通城市管理'
      },
      component: () => import('@/view/single-page/config-modules/city-control/index.vue')
    },
    {
      path: 'city_control_operation',
      name: 'city_control_operation',
      meta: {
        title: '策略管理',
        hideInMenu: true,
        parentName: 'city_control'
      },
      component: () => import('@/view/single-page/config-modules/city-control/operation.vue')
    },
    {
      path: 'site_control',
      name: 'site_control',
      meta: {
        title: '场地管理'
      },
      component: () => import('@/view/single-page/config-modules/site-control/index.vue')
    },
    {
      path: 'strategy_control',
      name: 'strategy_control',
      meta: {
        title: '系统策略管理'
      },
      component: () => import('@/view/single-page/config-modules/strategy-control/index.vue')
    },
    {
      path: 'agreement_control',
      name: 'agreement_control',
      meta: {
        title: 'APP协议管理'
      },
      component: () => import('@/view/single-page/config-modules/agreement-control/index.vue')
    },
    {
      path: 'brand_control',
      name: 'brand_control',
      meta: {
        title: '品牌管理'
      },
      component: () => import('@/view/single-page/config-modules/brand-control/index.vue')
    },
    {
      path: 'model_control',
      name: 'model_control',
      meta: {
        title: '车型管理'
      },
      component: () => import('@/view/single-page/config-modules/model-control/index.vue')
    },
    {
      path: 'device_control',
      name: 'device_control',
      meta: {
        title: '接单设备管理'
      },
      component: () => import('@/view/single-page/config-modules/device-control/index.vue')
    },
    {
      path: 'device_control_detail',
      name: 'device_control_detail',
      meta: {
        title: '接单设备详情',
        hideInMenu: true,
        parentName: 'device_control'
      },
      component: () => import('@/view/single-page/config-modules/device-control/operation/detail.vue')
    },
    {
      path: 'elecfence_control',
      name: 'elecfence_control',
      meta: {
        title: '电子围栏管理'
      },
      component: () => import('@/view/single-page/config-modules/elecfence-control/index.vue')
    },
    {
      path: 'car-machine',
      name: 'car-machine',
      meta: {
        title: '车机远程管理'
      },
      component: () => import('@/view/single-page/config-modules/car-machine/index.vue')
    },
    {
      path: 'approval_control',
      name: 'approval_control',
      meta: {
        title: '审批管理'
      },
      component: () => import('@/view/single-page/config-modules/approval-control/index.vue')
    },
  ]
}