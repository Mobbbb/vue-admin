<!--开通城市设置-->
<template>
<div>
    <Content>
        <Tabs v-model="tabFlag" type="line" name="tab-index">
            <TabPane label="快车" name='4' style="padding: 0 10px;" tab="tab-index">
                <Express v-if="tabFlag=='4' " :tabIndex='tabFlag'></Express>
            </TabPane>
            <TabPane label="专车" name='2' style="padding: 0 10px;" tab="tab-index">
                <Express v-if="tabFlag=='2' " :tabIndex='tabFlag'></Express>
            </TabPane>
        </Tabs>
    </Content>
</div>
</template>

<script>
import Express from './express.vue'

export default {
    components: {
        Express
    },
    data() {
        return {
            tabFlag:'4'
        }
    }
}
</script>
