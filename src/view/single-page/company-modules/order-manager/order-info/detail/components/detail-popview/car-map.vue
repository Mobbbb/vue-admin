<template>
    <div>
        <div style="height: 400px;">
            <el-amap
                :center="position"
                :zoom="zoom"
                ref="map">
                <el-amap-marker
                    v-if="showMarker"
                    :position="position"> 
                </el-amap-marker>
            </el-amap>
        </div>
        <div class="popView-footer-wrap">
            <Button size="large" type="primary" @click="commit">确定</Button>
        </div>
    </div>
</template>

<script>

export default {
	props: ['value', 'orderCarStatus'],
    data() {
        return {
            zoom: 17,
            position: [120, 30],
            showMarker: true
        }
    },
    watch: {
    	'value': function(){
    		if(this.value){
                this.initMap()
    		}
    	}
    },
    methods: {
        commit () {
        	this.$emit('input', false)
        },
        initMap () {
            let lon = this.orderCarStatus.longitude || 0
            let lat = this.orderCarStatus.latitude || 0
            let map = this.$refs.map.$$getInstance()
            if(lon && lat) {
                this.position = [lon, lat]
                this.showMarker = true
            } else {
                this.showMarker = false
                this.$Message.warning('未获取到车辆坐标点')
            }
            map.setZoom(this.zoom)
        }
    }
}
</script>

<style scoped>
    
</style>