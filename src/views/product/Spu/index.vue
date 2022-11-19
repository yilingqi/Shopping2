<template>
    <div>
        <el-card style="margin:20px 0px">
        <CategorySelect @getCategoryId="getCategoryId" :show="scene!=0">
        </CategorySelect>
        </el-card>
        <el-card>
            <!--这里将来要有三部分进行切换-->
            <div v-show="scene==0">
                <!--展示spu列表的结构-->
                <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
                <el-table style="width:100%" border :data="records">
                    <el-table-column type="index" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="spuName" label="spu名称" width="width">
                    </el-table-column>
                    <el-table-column prop="description" label="spu描述" width="width">
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{row,$index}">
                            <!--这里的按钮将来用hintButton替换-->
                            <HintButton type="success" icon="el-icon-plus" size="mini" title="添加spu" @click='addSku(row)'></HintButton>
                            <HintButton type="warning" icon="el-icon-edit" size="mini" title="编辑spu"  @click="updataSpu(row)"></HintButton>
                            <HintButton type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="handler(row)"></HintButton>
                              <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
                                <el-table :data="skuList" style="width:100%" border v-loading="loading">
                                <el-table-column property="skuName" label="名称" width="width"></el-table-column>
                                <el-table-column property="price" label="价格" width="width"></el-table-column>
                                <el-table-column property="weight" label="重量" width="width"></el-table-column>
                                <el-table-column property="" label="默认图片" width="width">
                                    <template slot-scope="{row}">
                                        <img :src="row.skuDefaultImg" style="width:100px;height:100px">
                                    </template>
                                </el-table-column>
                                </el-table>
                              </el-dialog>
                            <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                            <HintButton slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu"></HintButton>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!--@current-change="getPageList"-->
                <el-pagination
                style="margin-top: 20px; text-align: center"
                :current-page="page"
                :total="total"
                :page-size="limit"
                @current-change="getSpuList"
                layput="prev,pager,next,jumper,->sizes,total">
                </el-pagination>
            </div>
            <SpuForm v-show="scene==1" @changeScene="changeScene" ref="spu">
              <!--展示spu列表的结构-->
            </SpuForm>
            <SkuForm v-show="scene==2" ref="sku" @changeScenes="changeScenes">
             <!--展示spu列表的结构-->
            </SkuForm>
        </el-card>
    </div>
</template>
<script>
import SpuForm from './SpuForm/index.vue'
import SkuForm from './SkuForm/index.vue'
export default({
    name:'spu',
    data(){
        return{
            category1Id:'',
            category2Id:'',
            category3Id:'',
            //控制三级联动的可操作性
            page:1,//分页器当前在第几页
            limit:3,//每一页有多少条数据
            records:[],//spu列表的数组
            total:0,//总数据的条数
            scene:0,//用来切换3个页面 1：表示添加添加spu|修改spu 2：添加sku 0：刚显示的页面列表
            dialogTableVisible:false,//控制sku列表的显示与隐藏
            spu:{},//在sku列表中起到存储传递过来的参数的作用
            skuList:[],
            loading:true
        }
    },
    components:{
        SpuForm,
        SkuForm
    },
 methods:{
    //三级联动自定义事件，把子组件数据传给父组件
    getCategoryId({categoryId,level}){
        if(level==1){
          this.category1Id=categoryId
          this.category2Id=''
          this.category3Id=''
        }else if(level==2){
            this.category2Id=categoryId
            this.category3Id=''
        }else{
            this.category3Id=categoryId
            this.getSpuList()
        }
    },
   async getSpuList(pages=1){//默认参数pages=1，有参数用参数，没有就用默认的
         //获取spu列表的方法,携带三个参数，page limit 三级分类id
         this.page=pages
         const {page,limit,category3Id}=this
      let result= await  this.$API.spu.reqSpuList(page,limit,category3Id)
      if(result.code==200){
           this.total=result.data.total
           this.records=result.data.records
      }
    },
    addSpu(){
      
        this.scene=1
        //然后通知子组件发请求，发两个请求
        this.$refs.spu.addSpuData(this.category3Id)
    },
    updataSpu(row){
        //修改某一个spu的操作
        this.scene=1
        this.$refs.spu.initSpuDate(row)
    },
    changeScene({scene,flag}){
        //flag是为了区分保存是添加还是修改
        //是spu自定义事件的回调
        this.scene=0
        if(flag=='修改'){ this.getSpuList(this.page)}
        else{this.getSpuList()}
       
    },
   async deleteSpu(row){
     //删除spu的回调
   let result= await this.$API.spu.reqDeleteSpu(row.id)
      if(result.code==200){
        this.$message('删除成功')
        this.getSpuList(this.records.length>1?this.page:this.page-1)
        //这里不能单单用this.page，因为有时候数据没了,records是当前页的数据数量
      }
    },
    addSku(row){
         //切换场景
         this.scene=2
         //父组件调用子组件的方法，让子组件发请求
         this.$refs.sku.getData(this.category1Id,this.category2Id,row)
    },
    changeScenes(scene){
        //skuForm通知父组件修改场景
        this.scene=scene
    },
    async handler(spu){
        //查看sku按钮的回调
        this.dialogTableVisible=true
        this.spu=spu
       let result= await this.$API.spu.reqSkuList(spu.id)
       if(result.code==200){
        this.skuList=result.data
        this.loading=false
       }

    },
    close(done){
        //关闭对话框的回调
        this.skuList=[]
        this.loading=true
        done()
    }
 }
})
</script>

<style scoped>

</style>

