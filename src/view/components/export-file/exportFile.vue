<template>
  <Button type="primary" :disabled="isDisabled" @click="exportFile" >数据导出</Button>
</template>
<script>
import axios from 'axios';
import fileDownload from 'js-file-download';
import {getToken} from '@/libs/util.js';
  export default {
    props: {
      queryData: {
        type: Object,
        default: ()=> {
          return {};
        }
      },
      ajaxMethod:{
        type: String,
        default: 'POST'
      },
      columnsTitle: {
        type: Array,
        default: ()=> {
          return [];
        }
      },
      exportUrl: {
        type: String,
        required: true
      },
      excelTitle:{
         type: String,
         default: 'Message'
      },
      exportFileName: {
        type: String,
        default: 'Message.csv'
      },
      isDisabled: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        exportMsgUrl: this._baseUrl + this.exportUrl
      }
    },
    methods: {
      exportFile() {
        let params = {
          // excelTitle: this.excelTitle,
        }
        if (this.columnsTitle.length > 0) {
          params.excelHeader = [...this.columnsTitle]
        }
        if (Object.keys(this.queryData).length > 0) {
          params = Object.assign(params, this.queryData);
        }
        let method = this.ajaxMethod.toUpperCase();
        let ajaxData = method == 'GET' ? 'params' : 'data';
        let sendMsg  = {
          method: method,
          headers: {'Authorization': getToken()},
          url: this.exportMsgUrl,
          ajaxData: params,
          responseType: 'blob', // 如果项目中引入了mock模块，会更改blob数据，返回乱码
        }
        sendMsg[ajaxData] = params;
        let self = this;
        axios(sendMsg).then(function (res) {
          if (res.data) {
            let fileName = self.exportFileName;
            fileDownload(res.data, fileName)
          } else {
            let errormsg = res.data.errorMsg || '服务器错误!'
            self.$Message.error(errormsg);
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    }
  }
</script>