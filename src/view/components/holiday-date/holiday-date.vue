<template>
    <div>
        <div class="date top15">
            <div class="flexcont">
                <Button type="primary" @click="changeBtnTitle">{{edittitle}}</Button>
                <DatePicker
                    type="month" 
                    v-model="dateVal"
                    placeholder="Select month"
                    style="width: 210px"
                    @on-change="dateChange"
                    :clearable="false">
                </DatePicker>
            </div> 
            <!-- 星期 -->
            <ul class="weekdays">
                <li>一</li>
                <li>二</li>
                <li>三</li>
                <li>四</li>
                <li>五</li>
                <li style="color:red">六</li>
                <li style="color:red">日</li>
            </ul>
            <!-- 日期 -->
            <div class="bodyDiv">
                <ul class="days" v-for="(value,index1) in daysUL" :key="index1">
                    <li @click="pick(day,index+index1*7)" v-for="(day, index) in value" :key="index+'label'"  :class="{'xiu':isXiu[index+index1*7]}"  >
                      <!--本月-->
                      <span v-if="day.getMonth()+1 != currentMonth" class="other-month shalowcolor" :class="{'selected':isSelected[index+index1*7]}" style="display: none;">{{ day.getDate() }}</span>
                      <span v-else :class="{'selected':isSelected[index+index1*7]}" class="shalowcolor">
                        <!--今天-->
                        <span v-if="day.getFullYear() == new Date().getFullYear() && day.getMonth() == new Date().getMonth() && day.getDate() == new Date().getDate()" class="active">{{ day.getDate() }} </span>
                        <span v-else>{{ day.getDate()}}</span>
                      </span>
                    </li>
                </ul>
            </div>
            <!-- 日历下操作按钮 -->
            <div class="button" v-if="editable">
                <div><Button type="primary" size="default" @click="setRestOrWork('R')">设置为节假日</Button></div>
                <div><Button type="primary" size="default" @click="setRestOrWork('W')">设置为工作日</Button></div>
                <div><Button type="default" size="default" @click="cancel">关闭日历</Button></div>
            </div>
        </div>
    </div>
</template>
<script>
import {
  calenderUpdate,
  calenderSelectByParam
} from "@/api/configData.js"
export default {
    name: 'date-holiday',
    props:{
    },
 data () {
    return {
        currentYear: 2018,   // 年份
        currentMonth: 11,  // 月份
        currentDay: 1,    // 日期
        currentWeek: 1,    // 星期
        dateVal: '',
        firstWeek:1,
        days: [],       
        daysUL:[],       //绑定的天数
        params:{
            selectDay:'',
            type:''
        },
        isSelected:[],
        isBan:[],
        isXiu:[],
        restDays:{
            year:'',
            month:'',
            day:'',
            resttype:'',
            restdate:''
        },
        edittitle: '编辑模式',
        editable: false,
        banList:[],
        xiuList:[],
        selectIndex:'',
        restDaysList: [],
        currentIndex: ''
    }
},

created () {
    this.initData()
    this.dealResult(this.currentYear,this.currentMonth);
},
methods: {
    changeBtnTitle() {
        if (this.editable) {
            this.edittitle = '编辑模式'
        } else {
            this.edittitle = '展示模式'
        }
        this.editable = !this.editable
    },
    //格式化日期
    formatDate (year, month, day) {
        const y = year
        let m = month
        if (m < 10) m = `0${m}`
            let d = day
        if (d < 10) d = `0${d}`
            // console.log(`${y}-${m}-${d}`)
        return `${y}-${m}-${d}`
    },
    // 初始化日历
    initData (cur) {
        let date = cur? new Date(cur) : new Date()
        this.currentDay = date.getDate()          // 今日日期 几号
        this.currentYear = date.getFullYear()       // 当前年份
        this.currentMonth = date.getMonth() + 1    // 当前月份
        this.currentWeek = date.getDay() // 1...6,0   // 今天是星期几
        this.dateVal = date.getFullYear() + '-'+ (date.getMonth() + 1)
        //当前月的第一天是星期几
        date.setDate(1);
        this.firstWeek = date.getDay();
        if (this.firstWeek === 0) {
            this.firstWeek = 7;
        }
        const str = this.formatDate(this.currentYear, this.currentMonth, 1)// 今日日期 年-月-日
        this.days.length = 0
        // 今天是周日，放在第一行第7个位置，前面6个 这里默认显示一周，如果需要显示一个月，则第二个循环为 i<= 42 - this.firstWeek
        for (let i = this.firstWeek - 1; i >= 0; i -= 1) {
            const d = new Date(str)
            d.setDate(d.getDate() - i)
            this.days.push(d)  //把不是本月前面天书也添加进去
        }
        //处理1号是星期天为 7 的情况， 为7天就直接放在daysUL里
        if (this.days.length % 7 === 0){
            this.daysUL.push(this.days); 
            this.days = [];
        }
        for (let i = 1; i <= 42 - this.firstWeek; i += 1) {
            const d = new Date(str);
            d.setDate(d.getDate() + i);
            this.days.push(d);        //一个 days 就是一行7天  daysUL 就是个数组，里面有六个days  就是六行42天
            if (this.days.length % 7 === 0){
                this.daysUL.push(this.days);
                this.days = [];   //清空重新存放天数
            }
        }
        // 调后台接口，获取当前年，当前月的 班休时间
        let currentMonth = this.currentMonth.toString().length == 1? `0${this.currentMonth}`: this.currentMonth
        let data = {
            year: `${this.currentYear}-${currentMonth}`
        }
        /*calenderSelectByParam(data).then(res => {
            let newData = res.data.data
            newData.forEach((item, index) => {
                item.day = index + 1
                item.resttype = item.weekDay == 1? 'R': 'W'
            })
            this.restDaysList = newData
            this.dealResult(this.currentYear,this.currentMonth)
        }).catch(err => {})*/
    },
    setRestOrWork(type) {
        if (this.onlySelect()) {
            let alsoType = this.isXiu[this.selectIndex]? 'R':'W'
            if ((type == alsoType) && this.isXiu[this.selectIndex]) {
                this.$Message.warning('该日期已经是休息日')
                return
            } else if ((type == alsoType) && this.isBan[this.selectIndex]) {
                this.$Message.warning('该日期已经是工作日')
                return
            }
            let weekDay = type == 'W' ? 2 : 1;
            let year = this.params.selectDay
            let dataParams =  {
                year,
                weekDay
            }
            calenderUpdate(dataParams).then(res => {
                if (type == 'R'){
                    this.isXiu[this.selectIndex] = true
                } else {
                    this.isXiu[this.selectIndex] = false
                }
                this.isSelected = []
                for (let i = 0; i < 42; i++) {
                    if (this.selectIndex == i) {
                        this.isSelected.push(true);
                        continue;
                    }
                    this.isSelected.push(false);
                }
                this.$Message.success('设置成功')
                // this.params.selectDay = ''
                this.params.type = ''
            })
        }
    },
    dateChange (val) {
        // console.log(val)
        this.daysUL = [];
        this.isSelected = [];
        var dateTime = val + "-1"
        const d = new Date(dateTime)
        d.setDate(0)
        this.initData(dateTime)
        this.dealResult(this.currentYear,this.currentMonth);
    },
    //算法
    dealResult(currentYear,currentMonth){
        this.banList = [];  //把当前月的 工作日 放在一起
        this.xiuList = [];  //把当前月的 休息日 放在一起
        this.isBan = [];    //设置上班标识，来确定是用标识显示
        this.isXiu = [];    //设置休假标识，来确定用什么标识显示
        let zhouji = new Date(this.formatDate(currentYear, currentMonth, 1)).getDay(); //被查找的月份 1 号是星期几
        if (zhouji === 0){  // 0 就是星期天
            zhouji = 7;
        }
        
        for (let i = 0; i<this.restDaysList.length;i++){
            this.restDays = this.restDaysList[i];
            if (this.restDays.resttype === 'W') {
                let ban = this.restDays.day - 1 + (zhouji - 1);//重要算法，算出班日，在几号位
                this.banList.push(ban);
            }
            if (this.restDays.resttype === 'R'){
                let xiu = this.restDays.day - 1 + (zhouji - 1);//重要算法，算出休息日，在几号位
                this.xiuList.push(xiu);
            }
        }
       
        for (let m = 0; m < 42; m++) {    // banlist 里面放置的都是在日历上处于几号位，而不是工作日的日期，
            let nothave = true;           // 所以得把这些位置号拎出来，给它们于不同的样式
            for (let k = 0; k < this.banList.length; k++) {
                if (m == this.banList[k]) {
                    this.isBan.push(true);
                    nothave = false;
                    break;
                }
            }
            if (nothave) {
                this.isBan.push(false);
            }
        }
        for (let n = 0; n < 42; n++) {   // 同上，来处理休息日
            let nothave = true;
            for (let k = 0; k < this.xiuList.length; k++) {
                if (n == this.xiuList[k]) {
                    this.isXiu.push(true);
                    nothave = false;
                    break;
                }
            }
            if (nothave) {
                this.isXiu.push(false);
            }
        }
    },
    returnNow(){
        this.daysUL = [];
        this.initData(null);
    },
    // 当前选择日期
    pick (date,index) {
        if(date.getMonth() + 1 === this.currentMonth){
            this.selectIndex = index;
            this.isSelected = [];
            this.params.selectDay = this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
            for (let i = 0; i < 42; i++) {
                if (index == i) {
                    this.isSelected.push(true);
                    continue;
                }
                this.isSelected.push(false);
            }
        }
    },
    onlySelect(){
        if(this.params.selectDay === ''){
            this.$Message.warning('请选择日期')
            return false;
        }
        return true;
    },
    cancel() {
        let status = false
        this.isSelected = []
        this.returnNow()
        this.$emit('datepickmodal', status)
    }
},
}

</script>
<style scoped lang="less">
.date {
    // height: 400px;
    width:600px;
    color: #333;
    background: #fff;
    border:1px solid rgba(100, 100, 100, 0.1);
    box-shadow:2px 1px 5px rgba(100, 100, 100, 0.1);
}
.flexcont{
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 5px 0;
}
.shalowcolor{
    color: #999;
}
.button{
    // float: left;
    // margin-left:110px;
    // margin-top:120px;
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 20px;
    padding-right: 40px;
}
.button>div{
    margin-left: 30px;
}
.month {
    font-size: 24px;
    text-align: center;
    margin-top: 20px;
}

.weekdays {
    background:rgba(100, 100, 100, 0.1);
    opacity: 0.6;
    display: flex;
    font-size: 16px;
    li{
        line-height: 30px;
    } 
}

.days {
    display: flex;
}
li {
    flex: 1;
    font-size: 18px;
    width:20px;
    list-style-type:none;
    text-align: center;
    margin-top: 5px;
    line-height:  60px;
    cursor:pointer;
}

.selected{
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    color: #fff;
    border-radius: 70%;
    background-color: #1E90FF;
    box-shadow:2px 1px 18px rgba(100, 100, 100, 0.4);
}
ul.days li span.selected span{
    color: #fff;
}
.ban{
    position: relative;
    top: 0;
    left: 0;
    // background: rebeccapurple
}
.xiu{
    position: relative;
    left: 0;
    //  background: green
}
.xiu:before{
    content:"休";
    color: red;
    font-size: 8px;
    position: absolute;
    top: 0;
    left: 20%;
    height: 20px;
    line-height: 20px;
}
.active {
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    color: #fff;
    border-radius: 50%;
    background-color: #324057;
}
i{
    margin-right:30px;
    cursor:pointer
}
.other-month {
    color: #EEC591;
}
ul.days li:nth-child(7) span,
ul.days li:nth-child(6) span{
    color: red
}

</style>