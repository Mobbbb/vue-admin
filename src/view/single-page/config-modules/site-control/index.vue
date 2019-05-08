<!--场地管理-->
<template>
<div>
    <Content>
        <Tabs v-model="tabFlag">
            <TabPane label="加油站" name="0">
                <SiteTap v-if="tabFlag==0" :tabName='tabFlag' :lData='listData'></SiteTap>
            </TabPane>
            <!--<TabPane label="充电站" name="1">
                <SiteTap v-if="tabFlag==1" :tabName='tabFlag' ></SiteTap>
            </TabPane>-->
            <TabPane label="加气站" name="2">
                <SiteTap v-if="tabFlag==2" :tabName='tabFlag' ></SiteTap>
            </TabPane>
            <TabPane label="维修站" name="3">
                <SiteTap v-if="tabFlag==3" :tabName='tabFlag' ></SiteTap>
            </TabPane>
            <TabPane label="司机之家" name="4">
                <SiteTap v-if="tabFlag==4" :tabName='tabFlag' ></SiteTap>
            </TabPane>
        </Tabs>
    </Content>
</div>
</template>

<script>
import SiteTap from './siteTab'
import {getSiteList} from '@/api/configData.js'

export default {
    components:{SiteTap},
    data() {
        return {
            tabFlag: '0',
            listData:{},        
        }
    },
    methods:{

    }
}
</script>
