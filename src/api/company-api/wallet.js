import axios from '@/libs/api.request'
/* 
企业钱包
*/
//获取企业钱包
export const getCompanyList = (data) => {
    return axios.request({
		url: 'company/wallet/list',
		data,
		method: 'POST'
    })
}
