import axios from 'axios'
import router from '../router/index'
import store from '@/store'
import { setCookie, getToken } from '@/libs/util'
import { TOKEN_KEY, messageMap } from '@/libs/util'
import { Message } from 'iview'

const CancelToken = axios.CancelToken

class HttpRequest {
    constructor(baseUrl = baseURL) {
        this.baseUrl = baseUrl
        this.queue = {}
    }
    getInsideConfig() {
        const config = {
            baseURL: this.baseUrl,
            headers: {
                'Authorization': getToken()
            }
        }
        return config
    }
    destroy(url) {
        delete this.queue[url]
        if (!Object.keys(this.queue).length) {}
    }
    interceptors(instance, url) {
        // 请求拦截
        instance.interceptors.request.use(config => {
                // 添加全局的loading...
                if (!Object.keys(this.queue).length) {
                    // RequestLoading()
                }
                /*if (this.queue[url]) {
                    this.queue[url]('取消重复请求')
                    Message.warning({
                        title: '请勿重复提交请求'
                    })
                }
                
                config.cancelToken = new CancelToken(c => {
                    this.queue[url] = c
                })*/
                
                // get 方法中可以添加Content-Type
                if (config.method == 'get') {
                    config.data = true
                }
                return config
            }, error => {
                return Promise.reject(error)
            })
            // 响应拦截
        instance.interceptors.response.use(res => {
            this.destroy(url)
            if (res && res.data && !res.data.success) {
                if (messageMap[res.data.code]) {
                    setCookie(TOKEN_KEY, '')
                    router.push({ name: 'login' })
                }
                Message.error({
                    content: res.data.msg,
                    duration: 5
                })
                return Promise.reject(res)
            } else {
                const { data, status } = res
                return { data, status }
            }
        }, error => {
            let res = error.response
            store.commit('changeLoadingFlag', false)
            this.destroy(url)
            Message.error({
                content: (res && res.data && res.data.msg) || '系统错误，请联系管理员',
                duration: 5
            })
            return Promise.reject(error)
        })
    }
    request(options) {
        const instance = axios.create({})
        options = Object.assign(this.getInsideConfig(), options)
        this.interceptors(instance, options.url)
        return instance(options)
    }
}
export default HttpRequest