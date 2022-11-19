<template>
  <el-card>
    <div slot="header" class="header">
      <div class="category-header" >
        <span>销售额占比</span>
        <el-radio-group v-model="value">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
export default {
    data(){
        return{
            value:''
        }
    },
    mounted(){
        let myCharts=echarts.init(this.$refs.charts);
        myCharts.setOption( {
            thitle:{
                text:'',
                subtext:'',
            },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        position: 'outside'
      },
      labelLine: {
        show: true
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
});
myCharts.on('mouseover',(params)=>{
  const {name,value}=params.data;
  myCharts.setOption({
    title:{
        text:name,
        subtext:value,
        left:"center",
                top:"center",
    }
  })
});
    },
};
</script>

<style scoped>
.category-header{
    display:flex;
    justify-content: space-between;
    align-items: center;
}
.charts{
    width:100%;
    height:300px
}
</style>