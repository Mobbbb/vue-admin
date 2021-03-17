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
      path: 'driver',
      name: 'driver',
      meta: {
        title: '司机管理'
      },
      component: parentView,
      children: [
        {
          path: 'staff-manage',
          name: 'staff-manage',
          meta: {
            title: '人员管理'
          },
          component: () => import('@/view/single-page/operator-moules/staff-manage/index.vue')
        },
        {
          path: 'staff-detail/:id',
          name: 'staff-detail',
          meta: {
            title: '人员详情',
            parentName: 'staff-manage',
            hideInMenu: true
          },
          component: () => import('@/view/single-page/operator-moules/staff-manage/detail.vue')
        },
        {
          path: 'attendance-manage',
          name: 'attendance-manage',
          meta: {
            title: '考勤管理'
          },
          component: () => import('@/view/single-page/operator-moules/staff-manage/attendance-manage/index.vue')
        },
        // {
        //   path: 'attendance-detail',
        //   name: 'attendance-detail',
        //   meta: {
        //     title: '考勤明细',
        //     parentName: 'attendance-manage',
        //     hideInMenu: true
        //   },
        //   component: () => import('@/view/single-page/operator-moules/staff-manage/attendance-manage/month-attendance/detail.vue')
        // },
        {
          path: 'appraise-manage',
          name: 'appraise-manage',
          meta: {
            title: '评价管理'
          },
          component: () => import('@/view/single-page/operator-moules/staff-manage/appraise-manage/index.vue')
        },
        {
          path: 'feedback-list',
          name: 'feedback-list',
          meta: {
            title: '反馈列表'
          },
          component: () => import('@/view/single-page/operator-moules/staff-manage/feedback-list/index.vue')
        },
        {
          path: 'check-manage',
          name: 'check-manage',
          meta: {
            title: '审批管理'
          },
          component: () => import('@/view/single-page/operator-moules/staff-manage/check-manage/index.vue')
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
            title: '考勤规则管理'
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