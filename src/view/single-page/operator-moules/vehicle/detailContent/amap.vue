<template>
    <div>
        
        <div class="amap-page-container">
        <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo">
            <el-amap-marker vid="component-marker" :position="pit" :icon='markers[0].icon' :size='markers[0].size' ></el-amap-marker>
        </el-amap>
        </div>
    </div>
</template>
<script>
import VueAMap from 'vue-amap'
import carImg from '@/assets/icons/car-2.png'
export default {
     name: 'amap-page',
     props:{
         pit: Array,
         default:()=>{
             return []
         }
     },
     mounted(){
         
     },
      data() {
          return{
            zoom: 14,
            center: this.pit,
            markers: [
                {
                    position: [121.5273285, 31.21515044],
                    icon: new AMap.Icon({            
                        image: carImg,
                        size: new AMap.Size(80, 80),  //图标大小
                        imageSize: new AMap.Size(54,33),
                        imageOffset: new AMap.Pixel(0, 0)
                    }),
                    visible: true,
                    draggable: false,
                    }
            ]
          }
      }
}
</script>
<style scoped>
.amap-page-container {
      position: relative;
      padding-top: 20px;
       height: 400px;
       
    }
    .amap-icon img{
        width: 50px
    }
</style>
