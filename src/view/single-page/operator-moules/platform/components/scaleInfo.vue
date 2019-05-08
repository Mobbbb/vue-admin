<template>
    <div  style="margin-top:20px">
        <Row >
            <Col>
             <span class="titleFont"> 注册车辆数：{{scaleInfo.carNum}}</span>
            </Col>
        </Row>
        <Row :style="{marginTop:'20px'}">
            <Col>
             <span class="titleFont"> 注册司机数：{{scaleInfo.driverNum}}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
  export default {
    name: 'VTable',
    props: {
      scaleInfo: Object
    },
    data () {
      return {
      };
    },
    mounted() {
    },
    methods: {

    }
  };
</script>
<style lang="less" scoped>
.titleFont{
    font-weight: 500;
    font-size: 12px;
    text-indent:10px
}
</style>
