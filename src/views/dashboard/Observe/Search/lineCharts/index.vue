<template>
    <div>
        <div class="header">
            <span class="search-header">搜索用户数</span>
            <i class="el-icon-warning-outline"></i>
        </div>
        <div class="main">
            <span class="main-title">12321</span>
            <span class="main-content">17.1</span>
            <i class="el-icon-caret-top" style="color:greenyellow"></i>
            <i class="el-icon-caret-bottom" style="color:red"></i>
        </div>
        <div class="footer">
            <div class="charts" ref="charts"></div>
        </div>

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
                data:[10,7,33,12,88,98,100,120,34,34,24,88,98,100,120],
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
.header{
    display:flex;
    align-items: center;
    color:grey
}
.search-header{
    margin-right: 20px;
}
.main-title{
    margin-right: 30px;
    
}
.main{
    margin-top:30px
}
.main-content{
    margin-right:10px
}
.charts{
    width:100%;
    height:50px
}
</style>