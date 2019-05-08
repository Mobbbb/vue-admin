import Main from '@/components/main'
import parentView from '@/components/parent-view'

export default {
  path: '/opData',
  name: 'opData',
  component: Main,
  meta: {
    icon: 'md-car',
    title: '运营数据',
    showAlways: true
  },
  children: [
    {
      path: 'operative-map',
      name: 'operative-map',
      meta: {
        title: '运营地图'
      },
      component: () => import('@/view/single-page/opdata-modules/operative-map/index.vue')
    },
    {
      path: 'operation-manage',
      name: 'operation-manage',
      meta: {
        title: '运营管理'
      },
      component: () => import('@/view/single-page/opdata-modules/operation-manage/index.vue')
    },
  ]
}