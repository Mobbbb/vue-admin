import Main from '@/components/main'
import parentView from '@/components/parent-view'
import OperatorCenter from './module/operator-center'
import OperatorData from './module/operator-data'
import InfoCenter from './module/info-center'
import ConfigCenter from './module/config-center'
import PowerCenter from './module/power-center'
import OrderCenter from './module/order-center'
import FinanceCenter from './module/finance-center'
import CustomerCenter from './module/customer-center'
import SinglePage from './module/single-page'
import ErrorCenter from './module/error-center'
import ChargeCenter from './module/charge-center'

/**
 * children中的子路由path不要带/
 * 内嵌页面路由mate中配置parentName、hideInMenu
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  parentName: 父级路由name  设置该参数后可以在面包屑中显示出详情信息
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home-moules')
      }
    ]
  },
  OperatorData,   // 运营数据
  OperatorCenter, // 营运管理中心
  PowerCenter,    // 权限管理
  ConfigCenter,   // 配置管理
  FinanceCenter,  // 财务结算管理
  OrderCenter,    // 订单管理
  CustomerCenter, // 乘客管理
  InfoCenter,     // 消息中心
  ChargeCenter,   // 充电管理中心
  ...SinglePage,  // 登录、修改密码
  ...ErrorCenter  // 401, 404, 500, 错误日志
]
