<template>
    <div style="padding: 0 20px;">
        <Form>
            <FormItem label="续航里程 :">
                <p>{{orderCarStatus.cssEndurance}}公里</p>
            </FormItem>
            <FormItem label="剩余电量 :">
                <p>{{orderCarStatus.soc}}%</p>
            </FormItem>
        </Form>
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
            
        }
    },
    watch: {
    	'value': function(){
    		if(this.value){

    		}
    	}
    },
    methods: {
        commit () {
        	this.$emit('input', false)
        }
    }
}
</script>

<style scoped>
    
</style>