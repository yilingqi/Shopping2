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
            type:'category'
        },
        yAxis:{
            show:false
        },
        //系列
        series:[
            {
                type:'line',
                data:[10,7,33,12,88,98],
                //拐点的样式的设置
                itemStyle:{
                        opacity:0
                },
                //线条的样式
                lineStyle:{
                    color:'purple'
                },
                //区域填充样式
                areaStyle:{
                    color:'purple'
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