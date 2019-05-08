<template>
  <div>
    <div class="custom-container">
       <Button type="primary" @click=" isShowSelectModal = true" v-text='btnText'>
        <Icon type="navicon-round"></Icon>
      </Button>
    </div>
    <Modal  
        v-model=" isShowSelectModal"
        @on-ok='getColumnsValue'
        title="自定义列表"
        :mask-closable="false"
        width="800">
        <div class="cloumns-modal-continer">
            <div class="cloumns-modal-content">
                <ul>
                    <li v-for="item in this.selectedColumns" :key='item' class="single-selected">{{item}}</li>
                </ul>
                <section class="columns-list">
                    <Checkbox-group v-model="aliasSelectedList" @on-change="changeColumns">
                        <li v-for="item in customList" :key="item.key" class="checkbox-item"><Checkbox :label="item.key">{{item.title}}</Checkbox></li>
                    </Checkbox-group>
                </section>
            </div>
        </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'CustomColumns',
  props:{
    selectedOriginList: Array,  // 已经选择的数据集
    customList: Object,  // 所有待选择的数据集
    btnText: {    
      type: String,
      default: '自定义显示列'
    }
  },
  computed: {
    selectedColumns(){
      let columns = [];
      this.selectedOriginList.forEach(item => {
        columns.push(this.customList[item].title)
      })
      return columns;
    }
  },
  data() {
    return {
      isShowSelectModal: false,
      aliasSelectedList: this.selectedOriginList//已经选择的表头
    }
  },
  methods: {
    changeColumns () {
      let data =[...this.aliasSelectedList]
      this.$emit('changeColumns', data)
    },
    getColumnsValue() {
      let data = [...this.aliasSelectedList]
      this.$emit('checkedColumns', data)
    }
  },
  watch: {
    selectedOriginList(value) {
      this.aliasSelectedList = [...value]
    }
  }
}
</script>
<style lang="less">
.custom-container {
  text-align: right;
}
.cloumns-modal-continer {
    .cloumns-modal-content {
        li {
            list-style: none;
            display: inline-block;
        }
        ul {
            padding: 20px 0;
            border-bottom: 1px dashed #DCE1E7;
            margin-bottom: 20px;
        }
        .single-selected {
            margin: 3px 5px;
            line-height: 22px;
            padding: 0 15px;
            background-color: #5f93e1;
            border-radius: 2px;
            color: #FFF;
            font-size: 12px;
            cursor: move;
        }
        .checkbox-item {
            margin: 10px 5px;
        }
        .columns-list {
            max-height: 260px;
            overflow-y: auto;
        }
    }
  } 
</style>