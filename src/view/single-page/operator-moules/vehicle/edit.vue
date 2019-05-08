<template>
    <div class="layout" id='box'>
        <Content :style="{padding: '24px 0', minHeight: '280px', background: '#fff'}">
            <Layout>
                <Sider hide-trigger :style="{background: '#fff',position:'fixed',zIndex:'1000' }">
                    <!-- <Menu active-name='basic_info' width='auto' @on-select="scollTo()" ref="side_menu"> -->
                    <Anchor show-ink v-bind:container="outBox" @on-select="jumpTo" >
                        <AnchorLink href="#basic_info" title="基础信息" />
                        <AnchorLink href="#license_info" title="行驶证信息" />
                        <AnchorLink href="#operator_info" title="运营信息" />
                        <AnchorLink href="#ensurence_info" title="保险信息" />
                        <AnchorLink href="#purchase_info" title="购置信息" />
                        <AnchorLink href="#board_info" title="上牌信息" />
                        <AnchorLink href="#softpack_info" title="软装信息" />
                        <AnchorLink href="#hardware_info" title="硬件信息" />
                        <AnchorLink href="#others_info" title="其他信息" />
                    </Anchor>
                </Sider>
                <Content :style="{padding: '24px', minHeight: '280px', background: '#fff',marginLeft:'200px'}">
                    <BasicInfo :infoData="info"></BasicInfo>
                    <LicenseInfo :infoData="info"></LicenseInfo>
                    <OperatorInfo :infoData="info"></OperatorInfo>
                    <EnsurenceInfo :infoData="info"></EnsurenceInfo>
                    <PurchaseInfo :infoData="info"></PurchaseInfo>
                    <BoardInfo :infoData="info"></BoardInfo>
                    <SoftpackInfo :infoData="info"></SoftpackInfo>
                    <HardwareInfo :infoData="info"></HardwareInfo>
                    <OthersInfo :infoData="info"></OthersInfo>
                    <Row>
                        <Col  offset="20">
                            <div style="margin-top:80px">
                            <!-- <Button type='primary'>提交</Button> -->
                            </div>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Content>
    </div>
</template>

<script>
import BasicInfo from './addContent/basic.vue'
import LicenseInfo from './addContent/license.vue'
import OperatorInfo from './addContent/operator.vue'
import EnsurenceInfo from './addContent/ensurence.vue'
import PurchaseInfo from './addContent/purchase.vue'
import BoardInfo from './addContent/board.vue'
import SoftpackInfo from './addContent/softpack.vue'
import HardwareInfo from './addContent/hardware.vue'
import OthersInfo from './addContent/others.vue'
import {getVehicleBasic} from '@/api/vehicle.js'
import { mapMutations, mapActions, mapGetters } from 'vuex'

export default {
    components:{
        BasicInfo,
        LicenseInfo,
        OperatorInfo,
        EnsurenceInfo,
        PurchaseInfo,
        BoardInfo,
        SoftpackInfo,
        HardwareInfo,
        OthersInfo
    },
    mounted(){
        this.getInfo()
    },
    data(){
        return{
            menuIndex:'1',
            outBox:'',
            info:{}
        }
    },
    methods:{
        ...mapActions([
        'handleAddUuid',
        'handleDelUuid'
        ]),
        getInfo(){
            let data = {otherIndex: this.$route.params.id}
             getVehicleBasic(data).then(res=>{
                if(res.data.success){
                    this.handleDelUuid()
                    this.info = res.data.data
                    let uuid = this.info.uuid
                    this.handleAddUuid(uuid)
                }else{
                    this.$Message.error('读取数据出错')
                }
            })
        },
        jumpTo(url){
            let id = url.substr(1,url.length)
            let parentE = document.getElementById('box').parentElement
            let itemPosition = document.getElementById(id)
            parentE.scrollTo(0,itemPosition.offsetTop-100)
            
        },
         scollTo(){  
            this.$refs.side_menu.updateActiveName()
             let items = this.$refs.side_menu.$children
             let selectItem = ''
            items.forEach(item => {
                if(item.active){
                    selectItem = item.name
                }
            });
            let y = document.getElementById(selectItem)
            let yy= document.getElementById('box')
            let yyp = yy.parentElement
             yyp.scrollTo(0,y.offsetTop-100);
        },
        handleScoll(){
            let yy= document.getElementById('box')
            let yypHeight = yy.parentElement.scrollTop
        }

    }
}
</script>

<style lang="less">
.containerA {
    .contentBox {
        float: left;
        width: 500px;
        border: 1px solid #adadad;
        position: relative;
    }

    .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        
    }

    .layout-logo {
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }

    .layout-nav {
        width: 420px;
        margin: 0 auto;
        margin-right: 20px;
    }

    .layout-footer-center {
        text-align: center;
    }
    
     
    
}
.ivu-anchor-link{
        padding: 14px 24px;
        font-size: 14px;
    }
    
</style>
