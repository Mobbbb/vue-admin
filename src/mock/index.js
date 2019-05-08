import Mock from 'mockjs'
import { login, logout, getUserInfo } from './login'
import { getTableData, getDragList } from './data'
import { getNavList } from './power-data'

// 登录相关和获取用户信息
Mock.mock(/\/mock_login/, login)
Mock.mock(/\/mock_get_info/, getUserInfo)
Mock.mock(/\/mock_logout/, logout)
/*Mock.mock(/\/get_table_data/, getTableData)
Mock.mock(/\/get_drag_list/, getDragList)
Mock.mock(/\/save_error_logger/, 'success')

Mock.mock(/\/get_role_list/, getRoleList) // 权限管理--角色管理--获取角色列表
Mock.mock(/\/get_user_list/, getUserList) // 权限管理--角色管理--获取用户列表*/

Mock.mock(/\/mock_get_nav_list/, getNavList) // 菜单资源列表

export default Mock
