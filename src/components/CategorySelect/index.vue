<template>
    <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
        <!--这里有一个绑定，是和cForm表单绑定的，里面存的是分类id
        然后下面的下拉框和对象内的各个元素绑定
         通过item的v-model和option的value
        v-model的值是被选中的option的value值-->
    <el-form-item label="一级分类" >
    <el-select  placeholder="请选择" v-model="cForm.category1Id" @change="handler1" :disabled="show">
      <el-option :label="c1.name" :value="c1.id" v-for="c1 in List1" :key="c1.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="二级分类" >
    <el-select  placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="show">
      <el-option :label="c2.name" :value="c2.id" v-for="c2 in List2" :key="c2.id"></el-option>  
    </el-select>
  </el-form-item>
  <el-form-item label="三级分类" >
    <el-select  placeholder="请选择" v-model="cForm.category3Id" @change="handler3" :disabled="show">
      <el-option :label="c3.name" :value="c3.id" v-for="c3 in List3" :key="c3.id"></el-option>
    </el-select>
  </el-form-item>
</el-form>
    </div>
</template>
<script>
export default({
   name:'CategorySelect',
   //组件挂载完毕的时候，就应该获取到一级分类的数据
   data(){
    return{
        List1:[],
        List2:[],
        List3:[],
        //收集相应的一级二级的id
        cForm:{
            category1Id:'',
            category2Id:'',
            category3Id:''
        },
    }
   },
   props:['show'],
   mounted(){
    this.getCategoryList()
   },
   methods:{
    //获取一级分类方法
   async getCategoryList(){
      let result=  await this.$API.attr.reqCategory1List()
      if(result.code==200){
        this.List1=result.data
      }
    },
    //一级分类select的事件回调（当一级分类改变的时候，会触发）
    async handler1(){
           //清除后面的id
           this.List2=[]
           this.List3=[]
           this.cForm.category2Id=''
           this.cForm.category3Id=''
         //解构出一级分类所获取的id
         const {category1Id}=this.cForm//不是从this中解构出来的，是this.cForm
         this.$emit('getCategoryId',{categoryId:category1Id,level:1})
         let result = await this.$API.attr.reqCategory2List(category1Id)
         if(result.code==200){
        this.List2=result.data
      }
    },
     async handler2(){
        this.List3=[]
        this.cForm.category3Id=''
        const {category2Id}=this.cForm
        this.$emit('getCategoryId',{categoryId:category2Id,level:2})
         let result = await this.$API.attr.reqCategory3List(category2Id)
         if(result.code==200){
        this.List3=result.data
      }
    } ,
    //在三级分类之后，我们需要发送请求，展示三级分类后的结果
    async handler3(){
         const {category3Id}=this.cForm
         this.$emit('getCategoryId',{categoryId:category3Id,level:3})
    }
   }
})
</script>

<style scoped>

</style>
