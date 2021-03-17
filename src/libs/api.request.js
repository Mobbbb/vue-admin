import HttpRequest from '@/libs/axios'
import config from '@/config'
export const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export const api = baseUrl + '/vue-admin'
const axios = new HttpRequest(api)
export default axios
