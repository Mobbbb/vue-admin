import Main from '@/components/main'
import parentView from '@/components/parent-view'

export default {
  path: '/chargeCenter',
  name: 'chargeCenter',
  component: Main,
  meta: {
    icon: 'md-battery-charging',
    title: '充电管理',
    showAlways: true
  },
  children: [
    {
      path: 'config',
      name: 'chargeCenter-config',
      meta: {
        title: '配置管理'
      },
      component: parentView,
      children: [
        {
          path: 'supplier-control',
          name: 'supplier-control',
          meta: {
            title: '供应商管理'
          },
          component: () => import('@/view/single-page/charge-modules/config-manage/supplier-control/index.vue')
        },
        {
          path: 'city-control',
          name: 'charge-city-control',
          meta: {
            title: '开通城市管理'
          },
          component: () => import('@/view/single-page/charge-modules/config-manage/city-control/index.vue')
        },
        {
          path: 'price-control',
          name: 'price-control',
          meta: {
            title: '定价管理'
          },
          component: () => import('@/view/single-page/charge-modules/config-manage/price-control/index.vue')
        }
      ]
    },
    {
      path: 'order',
      name: 'chargeCenter-order',
      meta: {
        title: '订单管理'
      },
      component: parentView,
      children: [
        {
          path: 'order-list',
          name: 'order-list',
          meta: {
            title: '订单列表'
          },
          component: () => import('@/view/single-page/charge-modules/order-manage/order-list/index.vue')
        },
        {
          path: 'order-detail/:id',
          name: 'chargeCenter-order-detail',
          meta: {
            title: '订单详情',
            hideInMenu: true
          },
          component: () => import('@/view/single-page/charge-modules/order-manage/order-detail/index.vue')
        }
      ]
    },
    {
      path: 'account',
      name: 'chargeCenter-account',
      meta: {
        title: '充电账户管理'
      },
      component: parentView,
      children: [
        {
          path: 'account-list',
          name: 'account-list',
          meta: {
            title: '充电账户列表'
          },
          component: () => import('@/view/single-page/charge-modules/account-manage/account-list/index.vue')
        },
        {
          path: 'driver-detail/:id',
          name: 'driver-detail',
          meta: {
            title: '司机详情',
            hideInMenu: true,
            parentName: 'account-list'
          },
          component: () => import('@/view/single-page/charge-modules/account-manage/driver-detail/index.vue')
        }
      ]
    },
    {
      path: 'charge-station',
      name: 'charge-station',
      meta: {
        title: '充电站管理'
      },
      component: () => import('@/view/single-page/charge-modules/charge-station-manage/index.vue')
    },
    {
      path: 'charge-station-detail/:id',
      name: 'charge-station-detail',
      meta: {
        title: '充电详情',
        hideInMenu: true,
        parentName: 'charge-station'
      },
      component: () => import('@/view/single-page/charge-modules/charge-station-manage/charge-station-detail/index.vue')
    },
    {
      path: 'statistics',
      name: 'statistics',
      meta: {
        title: '统计管理'
      },
      component: parentView,
      children: [
        {
          path: 'whole',
          name: 'whole',
          meta: {
            title: '整体统计'
          },
          component: () => import('@/view/single-page/charge-modules/statistics-manage/whole-statistics/index.vue')
        },
        {
          path: 'city',
          name: 'city-statistics',
          meta: {
            title: '充电量排名'
          },
          component: () => import('@/view/single-page/charge-modules/statistics-manage/area-statistics/city-statistics/index.vue')
        },
        {
          path: 'district/:id',
          name: 'district-statistics',
          meta: {
            title: '区充电量排名',
            hideInMenu: true,
            parentName: 'city-area-statistics'
          },
          component: () => import('@/view/single-page/charge-modules/statistics-manage/area-statistics/district-statistics/index.vue')
        },
        {
          path: 'user',
          name: 'user-statistics',
          meta: {
            title: '个人统计'
          },
          component: () => import('@/view/single-page/charge-modules/statistics-manage/user-statistics/index.vue')
        },
        {
          path: 'time-interval',
          name: 'time-interval-statistics',
          meta: {
            title: '时段统计'
          },
          component: () => import('@/view/single-page/charge-modules/statistics-manage/time-interval-statistics/index.vue')
        }
      ]
    }
    
  ]
}