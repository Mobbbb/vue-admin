<!--
   * cascader-input   级联选择框
   * drop-tree-input  树形下拉选择框
   * text-input       文本输入框
   * drop-input       下拉选择框
   * remote-input     远程搜索输入框
   * date-input       起止date选择框
   * date             date选择框
   * date-time-input  起止date + time选择框
   * time-input       date + time选择框
   * month-input      月份选择框
   * year-input       年份选择框
   * section-input    数字范围输入框
   * number-input     筛选数字输入框

   * @input props       {Array} inputList               输入框配置数组

     @数组内对象共同属性 {Object} name                   该对象展示的输入框类型，共有上列几种类型
                                bind_key{String,Array}  搜索返回的key
                                placeholder             占位文本
                                value                   用于v-model绑定
                                title                   标签文本
                                titleWidth              标签文本宽度
                                inputWidth              输入框的宽度
                                key                     该输入框的唯一标识，用于匹配该输入框是否展示
                                isHide{boolean}         是否显示

    下列name类型需添加特殊字段:
    @cascader-input{Object}     cascaderList{Array}     级联列表，数据结构同cascader组件
                                bind_key{Array}         搜索返回绑定的key名，['province', 'city']

    @drop-tree-input{Object}    label                   绑定展示数据
                                loading{boolean}        树形加载中
                                treeData{Array}         树形列表，数据结构同tree组件

    @drop-input{Object}         dropList{Array}         下拉数据，数据结构同select组件

    @remote-input{Object}       remoteMethod{Function}  远程搜索的方法，方法写法同select组件
                                remoteList              搜索到的数据，数据结构同select组件

    @date-input{Object}         bind_key{Array}         搜索返回绑定的key名，['startTime', 'endTime']

    @section-input{Object}      bind_key                搜索返回绑定的key名，['numStart', 'numEnd']
                                value1                  用于v-model绑定
                                value2                  用于v-model绑定

    Events:                     说明
    @on-search                  点击搜索时触发，返回key，value形式的对象
    @on-reset                   点击重置时触发，返回空对象

    @示例:
    inputList: [
      {
        name: 'text-input',
        bind_key: 'userAccount',
        placeholder: '请输入联系电话',
        value: '',
        title: '联系电话',
        titleWidth: 65,
        inputWidth: 200,
        key: 'tel_input',
        isHide: false
      }
    ]
-->
<template>
  <div>
    <div class="input-list-wrap" v-for="(item, index) in inputList" :key="index" v-show="index < insideShowNumber || !spreadStatus">
      <Dropdown 
        trigger="click" 
        v-if="item.name === 'drop-tree-input'" 
        placement="bottom-end" 
        @on-visible-change="dropTreeList" 
        v-show="item.isMore">
        <div class="text-input">
          <span class="title-name" :style="{'width': item.titleWidth + 'px'}">{{item.title}}</span>
          <div class="clickInput" :style="{'width': item.inputWidth + 'px'}">
            <div class="remodel-placeholder" v-if="item.label === ''">{{item.placeholder}}</div>
            <div v-else>{{item.label}}</div>
          </div>
        </div>
        <DropdownMenu slot="list" :style="{'min-width': item.inputWidth + 'px'}">
            <div class="treeData-wrap">
              <Select
                class="treeData-search-input"
                filterable
                remote
                ref="remodelInput"
                @on-query-change="searchTree"
                :remote-method="remoteMethod">
              </Select>
              <Spin :style="{width: '30px', margin: '10px auto'}" v-if="item.loading" size="large"></Spin>
              <Tree
                v-else
                :ref="item.bind_key"
                :data="item.treeData"
                @on-select-change="getTreeData(index)"
                empty-text="暂无数据">
              </Tree>
            </div>
        </DropdownMenu>
      </Dropdown>
      <div class="text-input" v-if="item.name === 'cascader-input'">
        <span class="title-name" :style="{'width': item.titleWidth + 'px'}">{{item.title}}</span>
        <Cascader
          trigger="hover"
          :placeholder="item.placeholder"
          :style="{'width': item.inputWidth + 'px'}"
          :data="item.cascaderList"
          v-model="item.value"
          :change-on-select="item.changeOnSelect ? item.changeOnSelect : false">
        </Cascader>
      </div>
      <div class="text-input" v-if="item.name === 'text-input'">
        <span class="title-name" :style="{'width': item.titleWidth + 'px'}">{{item.title}}</span>
        <Input
          clearable
          v-model="item.value"
          :placeholder="item.placeholder"
          class="search-input"
          @on-change="selectOrInput"
          :style="{'width': item.inputWidth + 'px'}"/>
      </div>
      <div class="text-input" v-if="item.name === 'number-input'">
        <span class="title-name" :style="{'width': item.titleWidth + 'px'}">{{item.title}}</span>
        <Input
          clearable
          v-model="item.value"
          :placeholder="item.placeholder"
          class="search-input"
          @on-keyup="change_number(item.value,index)"
          @on-blur="change_number(item.value,index)"
          @on-change="selectOrInput"
          :style="{'width': item.inputWidth + 'px'}"/>
      </div>
      <div class="text-input" v-if="item.name === 'drop-input'">
        <span class="title-name" :style="{'width': item.titleWidth + 'px'}">{{item.title}}</span>
        <Select
          clearable
          v-model="item.value"
          :filterable="item.filterable||false"
          class="search-input"
          :placeholder="item.placeholder"
          :style="{'width': item.inputWidth + 'px'}"
          @on-change="selectOrInput"
          v-if="typeof(item.value_key) === 'undefined' || typeof(item.label_key) === 'undefined'">
          <Option
            v-for="dropItem in item.dropList"
            :value="dropItem.value"
            :bind_key="dropItem.value"
            :key="dropItem.value">
            {{dropItem.label}}
          </Option>
        </Select>
        <Select
          clearable
          v-else
          v-model="item.value"
          class="search-input"
          @on-change="selectOrInput"
          :placeholder="item.placeholder"
          :style="{'width': item.inputWidth + 'px'}">
          <Option
            v-for="dropItem in item.dropList"
            :value="dropItem[value_key]"
            :bind_key="dropItem[value_key]"
            :key="dropItem[value_key]">
            {{dropItem[label_key]}}
          </Option>
        </Select>
      </div>
      <div class="text-input" v-if="item.name === 'remote-input'">
        <span class="title-name" :style="{'width': item.titleWidth + 'px'}">{{item.title}}</span>
        <Select
          :style="{'width': item.inputWidth + 'px'}"
          :placeholder="item.placeholder"
          :ref="item.bind_key"
          :remote-method="item.remoteMethod"
          @on-change="selectOrInput"
          class="search-input"
          v-model="item.value"
          remote
          clearable
          filterable>
          <Option v-for="(option, index) in item.remoteList" :bind_key="option.value" :value="option.value" :key="index">{{option.label}}</Option>
        </Select>
      </div>
      <div class="text-input" v-if="item.name === 'date-input'">
        <span class="title-name" :style="{'width': item.titleWidth + 'px'}">{{item.title}}</span>
        <DatePicker
          clearable
          type="daterange"
          class="search-input"
          placement="bottom-start"
          v-model="item.value"
          :options="item.options||{}"
          :ref="item.bind_key"
          :placeholder="item.placeholder"
          :style="{'width': item.inputWidth + 'px'}"
          @on-change="selectOrInput">
        </DatePicker>
      </div>
      <div class="text-input" v-if="item.name === 'date'">
        <span class="title-name" :style="{'width': item.titleWidth + 'px'}">{{item.title}}</span>
        <DatePicker
          clearable
          type="date"
          class="search-input"
          placement="bottom-start"
          v-model="item.value"
          :ref="item.bind_key"
          :placeholder="item.placeholder"
          :style="{'width': item.inputWidth + 'px'}"
          @on-change="selectOrInput">
        </DatePicker>
      </div>
      <div class="text-input" v-if="item.name === 'date-time-input'">
        <span class="title-name" :style="{'width': item.titleWidth + 'px'}">{{item.title}}</span>
        <DatePicker
          clearable
          type="datetimerange"
          class="search-input"
          placement="bottom-end"
          v-model="item.value"
          :ref="item.bind_key"
          :placeholder="item.placeholder"
          :format="item.format && item.format || 'yyyy-MM-dd HH:mm'"
          :style="{'width': item.inputWidth + 'px'}">
        </DatePicker>
      </div>
      <div class="text-input" v-if="item.name === 'time-input'">
        <span class="title-name" :style="{'width': item.titleWidth + 'px'}">{{item.title}}</span>
        <DatePicker
          clearable
          class="search-input"
          type="datetime"
          :editable="false"
          v-model="item.value"
          :ref="item.bind_key"
          :placeholder="item.placeholder"
          :style="{'width': item.inputWidth + 'px'}"
          @on-change="selectOrInput">
        </DatePicker>
      </div>
      <div class="text-input" v-if="item.name === 'month-input'">
        <span class="title-name" :style="{'width': item.titleWidth + 'px'}">{{item.title}}</span>
        <DatePicker
          :clearable="item.clearable === false ? false : true"
          class="search-input"
          type="month"
          v-model="item.value"
          :editable="item.editable===false?false:true"
          :options="item.options||{}"
          :ref="item.bind_key"
          :placeholder="item.placeholder"
          :style="{'width': item.inputWidth + 'px'}"
          @on-change="selectOrInput">
        </DatePicker>
      </div>
      <div class="text-input" v-if="item.name === 'year-input'">
        <span class="title-name" :style="{'width': item.titleWidth + 'px'}">{{item.title}}</span>
        <DatePicker
          clearable
          class="search-input"
          type="year"
          :editable="false"
          v-model="item.value"
          :ref="item.bind_key"
          :placeholder="item.placeholder"
          :style="{'width': item.inputWidth + 'px'}"
          @on-change="selectOrInput">
        </DatePicker>
      </div>
      <div class="text-input" v-if="item.name === 'section-input'">
        <span class="title-name" :style="{'width': item.titleWidth + 'px'}">{{item.title}}</span>
        <InputNumber
          class="search-input"
          :ref="item.bind_key[0]"
          :min="0"
          :placeholder="item.placeholder"
          :style="{'width': item.inputWidth + 'px'}"
          v-model="item.value1"
          @on-change="selectOrInput">
        </InputNumber>
        <span class="section-hr">-</span>
        <InputNumber
          class="search-input"
          :ref="item.bind_key[1]"
          :min="0"
          :placeholder="item.placeholder"
          :style="{'width': item.inputWidth + 'px'}"
          v-model="item.value2"
          @on-change="selectOrInput">
        </InputNumber>
      </div>
    </div>
    <div class="input-list-wrap">
      <div class="text-input">
        <slot name="extendInput"></slot>
      </div>
    </div>
    <div class="btn-wrap">
      <Button style="margin-right: 15px;" type="primary" @click="search">搜索</Button>
      <Button @click="reset">清空</Button>
      <span @click="spread" class="displayBtn" v-show="inputList.length > insideShowNumber && spreadStatus">
        查看更多
        <Icon type="ios-arrow-down"/>
      </span>
      <span @click="less" class="displayBtn" v-show="inputList.length < insideShowNumber && spreadStatus">
        收起更多
        <Icon type="ios-arrow-up"/>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'search_list_page',
  props: {
    inputList: {
      type: Array
    },
    spreadStatus: {
      type: Boolean,
      default: false
    },
    showNumber: {
      type: Number,
      default: 3
    }
  },
  data () {
    return {
      insideShowNumber: 0,
    }
  },
  watch: {
    showNumber: function(){
      this.insideShowNumber = this.showNumber
    }
  },
  created () {
    this.insideShowNumber = this.showNumber
  },
  methods: {
    spread () {
      this.insideShowNumber = this.inputList.length + 1
    },
    less () {
      this.insideShowNumber = this.showNumber
    },
    change_number (val,index) {
      this.inputList[index].value = val.replace(/[^\d]/g,'')
    },
    remoteMethod: function(){},
    dropTreeList: function(visible){
      if(visible){ // 下拉菜单时
        this.$refs.remodelInput[0].$children[0].query = ''
        this.$emit('on-drop-tree')
      }
    },
    searchTree: function(data){ // 树形结构搜索时
      this.$emit('on-search-tree', data)
    },
    getTreeData: function(index){ // 点击树形结构选择时
      this.inputList[index].label = this.$refs[this.inputList[index].bind_key][0].getSelectedNodes()[0].label
      this.inputList[index].value = this.$refs[this.inputList[index].bind_key][0].getSelectedNodes()[0].value
    },
    resetData: function(){
      for(let i = 0; i < this.inputList.length; i++){
        if(this.inputList[i].name === 'remote-input'){
          this.inputList[i].value = ''
          this.$refs[this.inputList[i].bind_key][0].$children[0].query = ''
          this.$refs[this.inputList[i].bind_key][0].clearSingleSelect()
        } else if(this.inputList[i].name === 'date-input' || this.inputList[i].name === 'date-time-input'){
          this.inputList[i].value = ''
          this.$refs[this.inputList[i].bind_key][0].$children[0].currentValue = ''
        } else if(this.inputList[i].name === 'drop-tree-input'){
          this.inputList[i].value = ''
          this.inputList[i].label = ''
          this.$refs.remodelInput[0].$children[0].query = ''
        } else if(this.inputList[i].name === 'cascader-input'){
          this.inputList[i].value = []
        }else if(this.inputList[i].name === 'section-input'){
          this.inputList[i].value1 = null
          this.inputList[i].value2 = null
        } else {
          this.inputList[i].value = ''
        }
      }
    },
    reset: function(){
      this.resetData()
      this.$store.commit('changeLoadingFlag', true)
      this.$emit('on-reset', {})
    },
    getSearchData: function(){
      let data = {}
      for(let i = 0; i < this.inputList.length; i++){
        if(this.inputList[i].name === 'remote-input'){ // 远程搜索
          data[this.inputList[i].bind_key] = this.$refs[this.inputList[i].bind_key][0].$children[0].query
        } else if (this.inputList[i].name === 'cascader-input'){ // 级联选择
          let that = this
          this.inputList[i].bind_key.forEach(function(item, index){
            data[item] = that.inputList[i].value[index]
          })
        } else if (this.inputList[i].name === 'date-input' || this.inputList[i].name === 'date-time-input'){ 
          // 起止date选择框、起止date + time选择框
          if(this.inputList[i].value === '') {
            data[this.inputList[i].bind_key[0]] = ''
            data[this.inputList[i].bind_key[1]] = ''
          } else {
            if(this.inputList[i].value[0] !== ''){
              data[this.inputList[i].bind_key[0]] = Date.parse(this.inputList[i].value[0])
              data[this.inputList[i].bind_key[1]] = Date.parse(this.inputList[i].value[1])
            } else {
              data[this.inputList[i].bind_key[0]] = this.inputList[i].value[0]
              data[this.inputList[i].bind_key[1]] = this.inputList[i].value[1]
            }
          }
        } else if (this.inputList[i].name === 'time-input'){ // date + time选择框
          if(this.inputList[i].value === '') {
            data[this.inputList[i].bind_key] = ''
          } else {
            data[this.inputList[i].bind_key] = Date.parse(this.inputList[i].value)
          }
        } else if (this.inputList[i].name === 'month-input'){ // 月份选择
          if(this.inputList[i].value === '') {
            data[this.inputList[i].bind_key] = ''
          } else {
            data[this.inputList[i].bind_key] = this.$moment(this.inputList[i].value).format('YYYY-MM')
          }
        } else if (this.inputList[i].name === 'year-input'){ // 年份选择
          if(this.inputList[i].value === '') {
            data[this.inputList[i].bind_key] = ''
          } else {
            data[this.inputList[i].bind_key] = this.inputList[i].value.getFullYear()
          }
        } else if (this.inputList[i].name === 'section-input'){ // 数量区间选择
          if(this.inputList[i].value2 === '' || this.inputList[i].value2 === 0) {
            data[this.inputList[i].bind_key[0]] = 0
            data[this.inputList[i].bind_key[1]] = 0
          } else {
            data[this.inputList[i].bind_key[0]] = this.inputList[i].value1;
            data[this.inputList[i].bind_key[1]] = this.inputList[i].value2;
          }
        } else { // 其他输入框
          if(typeof(this.inputList[i].value) === 'undefined'){
            data[this.inputList[i].bind_key] = ''
          } else {
            data[this.inputList[i].bind_key] = this.inputList[i].value
          }
        }
      }
      for(let item in data){
        if(data[item] === '' || typeof(data[item]) === 'undefined' || data[item] === null) {
          delete data[item]
        }
      }

      return data
    },
    search: function(){
      let data = this.getSearchData()
      this.$store.commit('changeLoadingFlag', true)
      this.$emit('on-search', data)
    },
    selectOrInput (data) {
      this.$emit('on-change', data)
    }
  }
}
</script>

<style scoped>
  .remodel-placeholder{
    color: rgb(201,204,209);
  }
  .clickInput{
    line-height: 24px;
    display: inline-block;
    width: 100%;
    height: 32px;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    color: #515a6e;
    background-color: #fff;
    cursor: pointer;
    transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out;
    -webkit-transition: border 0.2s ease-in-out, background 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out;
  }
  .clickInput:hover{
    border-color: #57a3f3;
  }
  .treeData-wrap{
    padding: 0 15px;
    box-sizing: border-box;
  }
  .treeData-search-input{
    margin-top: 5px;
  }
  .input-list-wrap{
    display: inline-block;
    margin: 0 35px 20px 0;
  }
  .text-input{
    display: flex;
    align-content: center;
    line-height: 32px;
    font-size: 12px;
  }
  .text-input .title-name{
    display: block;
    width: 100px;
    min-width: 30px;
    line-height: 32px;
  }
  .search-input{
    width: 200px;
  }
  .btn-wrap{
    display: inline-flex;
    margin: 0 0 20px 0;
    align-items: center;
  }
  .ivu-input-number-input{
    vertical-align: super;
  }
  .section-hr{
    display: inline-block;
    width: 20px;
    height: 32px;
    line-height: 32px;
    text-align: center;
  }
  .displayBtn{
    margin-left: 15px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    transition: all .2s ease-in-out;
  }
  .displayBtn:hover{
    color: #2d8cf0;
  }
</style>
