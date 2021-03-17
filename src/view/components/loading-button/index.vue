<template>
  <div>
    <Button :type="type" :loading="loading" @click="handleClick" :style="{'width': width + 'px'}">
      <span v-if="!loading">{{btntitle}}</span>
      <span v-else>{{loadingtitle}}</span>
    </Button>
  </div>
</template>

<script>
export default {
  name: "loadingButton",
  props: {
    loading: {
        default: false,
        type: Boolean
    },
    btntitle: {
        default: '查询',
        type: String
    },
    loadingtitle: {
        default: '请求中',
        type: String
    },
    width: {
        default: 190,
        type: Number
    },
    type: {
      type:String,
      default: 'default'
    }
  },
  data() {
    return {
    };
  },
  methods: {
    handleClick() {
        this.$emit('on-click')
    }
  }
};
</script>

<style>
</style>
