<template>
    <div class="charts" ref="charts">
        
 
 </div>
</template>

<script>
import echarts from 'echarts'
export default{
   mounted(){
     let lineCharts= echarts.init(this.$refs.charts)
     //配置对象
     lineCharts.setOption({
        xAxis:{
            show:false,
            min:0,
            max:100
        },
        yAxis:{
            show:false,
            type:'category'
        },
        //系列
        series:[
            {
                type:'bar',
                data:[78],
                barWidth:10,
                showBackground:true,
                backgroundStyle:{
                  color:'#eee'
                }
            },
        ],
        //布局调试
        grid:{
            left:0,
            top:0,
            right:0,
            bottom:0
        },
     })
   }
}
</script>

<style scoped>
.charts{
    width:100%;
    height:100%
}
</style>