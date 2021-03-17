<template>
    <div>
      <Upload
        :action="actionUrl"
        :data="uploadFiles"
        :before-upload="res => beforeUpload(res)"
        :on-success="res => uploadSuccess(res)"
        :on-error="err => uploadError(err)"
        :on-remove="res => removefile(res)"
        :multiple="true"
        :paste="true"
        :headers="header"
      >
        <Button>{{ uploadtitle }}</Button>
      </Upload>
    </div>
  </template>
  <script>
  import {getToken} from '@/libs/util.js';
  export default {
      props: {
          uploadtitle: {
              type: String,
              default () {
                  return '文件上传'
              }
          }
      },
      data () {
          return {
              actionUrl: this._baseUrl + '/common/uploadFile',
              uploadFiles: {},
              filesData: [],
              header: {'Authorization': getToken()},
          }
      },
      methods: {
          uploadSuccess (res) {
              this.$emit('uploadSuccess', res)
          },
          uploadError (error) {
              this.$emit('uploadError', error)
          },
          beforeUpload (res) {
              this.$emit('beforeUpload', res)
          },
          removefile (res) {
              this.$emit('removefile', res)
          },
      },
  };
  </script>
  <style lang="less">
  </style>
  