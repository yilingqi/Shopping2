<template>
  <div>
    <el-row :gutter="10">
      <!--gutter:每一个col之间的距离-->
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="￥126560">
            <template slot="charts">
               <span>周同比 &nbsp;&nbsp; 56.67% <svg t="1668152453919" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4261" width="16" height="16"><path d="M698.7 480.9v429.5c0 54.8-44.5 99.3-99.3 99.3H434c-54.8 0-99.3-44.5-99.3-99.3V480.9H70l446.9-463 446.9 463H698.7z m0 0" fill="" p-id="4262"></path></svg></span>
               &nbsp;
               <span>日同比 &nbsp;&nbsp;19.96% <svg t="1668152550302" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2723" width="16" height="16"><path d="M335 546.6V117.1c0-54.8 44.5-99.3 99.3-99.3h165.4c54.8 0 99.3 44.5 99.3 99.3v429.5h264.7l-446.9 463L70 546.6h265z m0 0" fill="" p-id="2724"></path></svg></span>
            </template>
            <template slot="footer">
                <span>日销售额 &nbsp;￥12432</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="88460">
            <template slot="charts">
                <lineChart></lineChart>
            </template>
            <template slot="footer">
                <span>日访问量 &nbsp;1234</span>
            </template>
          </Detail>
        </el-card> </el-col
      ><el-col :span="6">
        <el-card> 
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
               <barChart></barChart>
            </template>
            <template slot="footer">
                <span>转化率 &nbsp;65%</span>
            </template>
          </Detail>
        </el-card> </el-col
      ><el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
               <progressChart></progressChart>
            </template>
            <template slot="footer">
                <span>周同比 &nbsp;&nbsp; 56.67% <svg t="1668152453919" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4261" width="16" height="16"><path d="M698.7 480.9v429.5c0 54.8-44.5 99.3-99.3 99.3H434c-54.8 0-99.3-44.5-99.3-99.3V480.9H70l446.9-463 446.9 463H698.7z m0 0" fill="" p-id="4262"></path></svg></span>
               &nbsp;
               <span>日同比 &nbsp;&nbsp;19.96% <svg t="1668152550302" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2723" width="16" height="16"><path d="M335 546.6V117.1c0-54.8 44.5-99.3 99.3-99.3h165.4c54.8 0 99.3 44.5 99.3 99.3v429.5h264.7l-446.9 463L70 546.6h265z m0 0" fill="" p-id="2724"></path></svg></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
  
  <script>
import Detail from "./Detial/index.vue";
import lineChart from './lineChart/index.vue'
import barChart from './barCharts/index.vue'
import progressChart from './progressChart/index.vue'
export default {
  components: {
    Detail,
    lineChart,
    barChart,
    progressChart
  },
};
</script>
  
  <style scoped>
</style>
  