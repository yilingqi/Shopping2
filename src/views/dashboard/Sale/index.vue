<template>
    <el-card class="box-card" style="margin:10px 0px">
  <div slot="header" class="clearfix">
    <!-- @tab-click="handleClick"-->
    <el-tabs class="tab" v-model="activeName">
    <el-tab-pane label="销售额" name="sale"></el-tab-pane>
    <el-tab-pane label="访问量" name="visit"></el-tab-pane>
  </el-tabs>
  <div class="right">
<!--头部右侧内容-->
     <span @click="setDay">今日</span>
     <span @click="setWeek">本周</span>
     <span @click="setMonth">本月</span>
     <span @click="setYear">本年</span>
     <el-date-picker
     class="data"
     v-model="data"
     value-format="yyyy-MM-dd"
     size="mini"
      type="daterange"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
  </div>
  </div>
  <div>
    <el-row :gutter="10">
       <el-col :span="18">
        <!--柱状图容器-->
        <div class="charts" ref="charts">
        </div>
       </el-col>
       <el-col :span="6">
        <!--右侧-->
            <h3>门店{{title}}排名</h3>
         <ul>
            <li>
                <span class="rindex">1</span>
                <span class="rname">肯德基</span>
                <span class="rvalue">12345</span>
            </li>
            <li>
                <span class="rindex">2</span>
                <span class="rname">肯德基</span>
                <span class="rvalue">12345</span>
            </li>
            <li>
                <span class="rindex">3</span>
                <span class="rname">肯德基</span>
                <span class="rvalue">12345</span>
            </li>
            <li>
                <span >4</span>
                <span class="rname">肯德基</span>
                <span class="rvalue">12345</span>
            </li>
            <li>
                <span >5</span>
                <span class="rname">肯德基</span>
                <span class="rvalue">12345</span>
            </li>
            <li>
                <span >6</span>
                <span class="rname">肯德基</span>
                <span class="rvalue">12345</span>
            </li>
            <li>
                <span >7</span>
                <span class="rname">肯德基</span>
                <span class="rvalue">12345</span>
            </li>
         </ul>

       </el-col>
    </el-row>
  </div>
</el-card>
</template>

<script>
import echarts from 'echarts'
import dayjs from 'dayjs'
import {mapState} from 'vuex'
export default{
    data(){
        return{
            activeName:'sale',
            myCharts:null,
            data:[]
        }
    },
    mounted(){
      this.myCharts=echarts.init(this.$refs.charts)
     this.myCharts.setOption({
        title:{
            text:this.title+'趋势'
        },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Direct',
      type: 'bar',
      barWidth: '60%',
      data: [],
      color:'skyblue'
    }
  ]
})
    },
    computed:{
        title(){
            return this.activeName=="sale"?'销售额':'访问量'
        },
       ...mapState({
        listState:state=>state.home.list
       })
    },
    watch:{
      title(){
           this.myCharts.setOption({
            title:{
                 text:this.title+'趋势'
            },
             xAxis:{
        data:this.title=='销售额'?this.listState.orderFullYearAxis:this.listState.userFullYearAxis
      },
      series:[
      {
      name: 'Direct',
      type: 'bar',
      barWidth: '60%',
      data: this.title=='销售额'?this.listState.userFullYear:this.listState.orderFullYear,
      color:'skyblue'
    }
      ]
           })
      },
      listState(){
        this.myCharts.setOption({
        title:{
            text:this.title+'趋势'
        },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: this.listState.orderFullYearAxis,
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Direct',
      type: 'bar',
      barWidth: '60%',
      data: this.listState.orderFullYear,
      color:'skyblue'
    }
  ]
})
      }
    },
    methods:{
        setDay(){
           const day=dayjs().format('YYYY-MM-DD');
           this.data=[day,day]
        },
        setWeek(){
            const start=dayjs().day(1).format('YYYY-MM-DD');
            const end=dayjs().day(7).format('YYYY-MM-DD');
            this.data=[start,end]
        },
        setMonth(){
            const start =dayjs().startOf('month').format('YYYY-MM-DD');
            const end =dayjs().endOf('month').format('YYYY-MM-DD');
            this.data=[start,end]
        },
        setYear(){
            const start =dayjs().startOf('year').format('YYYY-MM-DD');
            const end =dayjs().endOf('year').format('YYYY-MM-DD');
            this.data=[start,end]
        }
    },
}
</script>

<style scoped>
::v-deep .el-card__header{
    border-bottom:none;
}
.clearfix{
    position: relative;
    display: flex;
    justify-content: space-between;
}
.tab{
    width:100%
}
.right{
    position:absolute;
    right:0px;
}
.data{
    width:250px!important;
}
.right span{
    margin:0px 10px;
}
.charts{
    width:100%;
    height:300px;
}
ul{
    list-style:none;
    width:100%;
    height:300px;
    padding:0px;
}
ul li{
    height:8%;
    margin:10px 0px
}
.rindex{
    float: left;
    width:20px;
    height:20px;
    border-radius:50% ;
    background: #000;
    color:white;
    text-align: center;
}
.rvalue{
    float:right;
}
.rname{
    padding:20px;
}
</style>
