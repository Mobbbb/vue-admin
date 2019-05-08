<template>
  <div>
    <!-- 数据导入 -->
     <Button type="primary" @click="importFile" >{{btnText}}</Button>
     <Modal
      v-model="isShowUpModal"
      :title="'导入数据'"
      :mask-closable='false'
      width="600"
      @on-visible-change='statusChange'
    >
     <Alert  type="warning">{{importMessage}}</Alert>
     <div class="down-container">
        <Button  type="primary" style="display: inline-block;" :to='toDownTemplateUrl_' target="_blank">
          <Icon type="ios-cloud-download-outline" size="20"/>
            下载模板
        </Button>
        <Upload
          multiple
          type="drag"
          :data="data"
          :action='importFileUrl_'
          class="file-box"
          ref="importFile"
          :headers="header"
          :before-upload='beforeUpHandle'
          :show-upload-list='false'
          :on-success="importSuccess"
          :on-error="importFiled"
          :format="['zip','xlsx']"
          >
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击(拖拽)上传文件</p>
            </div>
             <Progress :percent="upPercent" v-show="isShowUpBar"/>
        </Upload>
     </div>
    </Modal>
  </div>
</template>
<script>
let timer = null;
import {getToken} from '@/libs/util.js';
  export default {
    name: 'ImportFile',
    props: {
      importFileUrl: {
        type: String,
        required: true
      },
      btnText: {
        type: String,
        default:'导入数据'
      },
      toDownTemplateUrl: {
        type: String,
        required: true
      },
      data: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        toDownTemplateUrl_: this._baseUrl + this.toDownTemplateUrl,
        upPercent: 0,
        header: {'Authorization': getToken()},
        isShowUpBar: false,
        sameMessage: '请先下载导入模板，根据规则填写模板，然后再导入填好的模板数据！',
        importMessage: '请先下载导入模板，根据规则填写模板，然后再导入填好的模板数据！',
        isShowUpModal: false,
        importFileUrl_: this._baseUrl + this.importFileUrl
      }
    },
    methods: {
      importFile() {
        this.upPercent = 0;
        this.isShowUpBar = false;
        this.importMessage = this.sameMessage;
        this.isShowUpModal = true;
      },
      beforeUpHandle(res, file) {
        this.upPercent = 0;
        this.isShowUpBar = true;
        timer = setInterval(()=> {
          if (this.upPercent < 91) {
            this.upPercent = this.upPercent + parseInt(Math.random()*10)
          } else {
            clearInterval(timer);
          }
        }, 1000)
      },
      importSuccess(res, file) {
        clearInterval(timer);
        this.upPercent = 100;
        if (res.success) {
          let successmsg = res.msg || '导入成功!';
          this.importMessage = successmsg;
          this.$emit('on-success', res)
        } else {
          let errormsg = res.msg || '服务器错误!';
          this.importMessage = errormsg;
        }
      },
      importFiled(res, file) {
        if (!res.success) {
          this.upPercent = 100;
          clearInterval(timer);
          let errormsg = res.msg || '服务器错误!';
          this.$Notice.error({
            desc: errormsg,
            duration: 10
          })
        }
      },
      statusChange(flag){
        this.$emit('on-change', flag)
      }
    }
  }
</script>
<style lang="less">
.down-container {
  display: flex;
  align-items: center;
  a {
    width: 150px;
    height: 35px;
    flex: 1;
    margin: 0 10px 0 0;
  }
  .file-box {
    flex: 2;
    margin: 0 10px;
  }
}
</style>
