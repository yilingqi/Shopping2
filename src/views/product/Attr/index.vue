<template>
    <div>
       <el-card style="margin:20px 0px">
       <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
       </el-card>
       <!--因为从上面获取到了选择的id，但是我们需要在父组件即这里传数据，所以我们要用自定义事件来写-->
       <el-card>
        <div v-show="isShowTable">
            <!--再有3id之前，按钮禁用-->
             <el-button icon="el-icon-plus" type="primary" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!--表格，展示三级列表的属性-->
        <el-table style="width:100%" :data="attrList" border>
            <!--这里绑定attrList-->
         <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
         <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
         <el-table-column label="属性值列表" >
            <template slot-scope="{row}">
                <el-tag type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id" style="margin:0px 10px">{{attrValue.valueName}}</el-tag>
            </template>
        </el-table-column>
         <el-table-column label="操作" width="150">
            <template slot-scope="{row}">
                <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
                <template>
                <el-popconfirm :title="`确定要删除${row.attrName}?`"  @onConfirm="deleteAttr(row)">
                <el-button slot="reference" type='danger' icon="el-icon-delete" size="mini"></el-button>
                </el-popconfirm>
                </template>
            </template>
         </el-table-column>
        </el-table>
        </div>
        <!--添加属性的样式|修改属性的结构-->
       <div v-show="!isShowTable">
         <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
            <el-form-item label="属性名">
                <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
            </el-form-item>
         </el-form>
         <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
         <el-button @click="isShowTable=true">取消</el-button>
         <!--在这里收集属性值-->
         <el-table style="width:100%;margin:20px 0px" border :data="attrInfo.attrValueList" >
         <el-table-column type="index" label="序号" align="center" width="80"> </el-table-column>
         <el-table-column prop="prop" label="属性值名称">
            <template slot-scope="{ row ,$index}">
                <!--span input 来回切换-->
                <el-input  placeholder="请输入属性值名称" v-model="row.valueName" size="mini" v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
                <span v-else @click="toEdit(row,$index)" style="display:block">{{row.valueName}}</span>
             </template>
         </el-table-column>
         <el-table-column prop="prop" label="操作"> 
            <template slot-scope="{ row,$index }">
                 <!--气泡确认框-->
                <template>
                  <el-popconfirm
                   :title="`确定要删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                  <el-button slot="reference" type="danger" icon="el-icon-delete"></el-button>
                 </el-popconfirm>
                     </template>
             </template>
         </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
       </div>
       </el-card>
    </div>
</template>
<script>
//按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep';
export default({
    data(){
        return{
            category1Id:'',
            category2Id:'',
            category3Id:'',
            attrList:[],
            //控制table是否显示的属性
            isShowTable:true,
            //收集新增属性|修改属性用的
            attrInfo:{
                attrName: "",//属性名
                attrValueList: [//属性值：属性值可以有多个，所以用数组，每一个属性值都是一个对象
                ],
                ategoryId: this.category3Id,//三级分类id
                categoryLevel: 3,
            },
        }
    },
   methods:{
    //获取id的回调（后面那个）
    getCategoryId({categoryId,level}){//加上{}进行解构
     if(level==1){
         this.category1Id=categoryId
         this.category2Id=''
         this.category3Id=''
     }else if(level==2){
        this.category2Id=categoryId
        this.category3Id=''
     }else{
        //这里已经有三级分类id了
        this.category3Id=categoryId
        this.getAttrList()
     }
    },
   async getAttrList(){
        const{category1Id,category2Id,category3Id}=this
     let result=await this.$API.attr.reqAttrList(category1Id,category2Id,category3Id)
     if(result.code==200){
         this.attrList=result.data
     }
    },
    addAttrValue(){
        //向属性值的数组里面添加元素
        this.attrInfo.attrValueList.push({
            attrId:this.attrInfo.id,
            valueName:'',
            flag:true,//给每一个属性值添加一个标记
        })
        this.$nextTick(()=>{
            this.$refs[this.attrInfo.attrValueList.length-1].focus();
        })
    },
    addAttr(){
        this.isShowTable=false
        this. attrInfo={
                attrName: "",//属性名
                attrValueList: [//属性值：属性值可以有多个，所以用数组，每一个属性值都是一个对象
                ],
                ategoryId: 0,//三级分类id
                categoryLevel: 3,
            }
    },
    updateAttr(row){
       this.isShowTable=false
      //将选中的属性赋值给attr
      //由于数据结构当中存在对象里面套数组，数组里面又套对象，所以要用到深拷贝
      this.attrInfo=cloneDeep(row);
      //在修改某一属性的时候，将相应的属性值添加上flag
      this.attrInfo.attrValueList.forEach((item)=>{
        //vue无法探测新增的属性
        this.$set(item,'flag',false)
      })
    },
    toLook(row){
        if(row.valueName.trim()=='')
        {
            this.$message('请你输入一个正常属性值')   
            return
        }
        //所有属性值的数组
      let isRepeat=  this.attrInfo.attrValueList.some(item=>{
            //需要将row在数组里面判断
            if(row!==item){
                return row.valueName==item.valueName
            }
        })
        if(isRepeat) return 
        row.flag=false
    },
    toEdit(row,index){
        row.flag=true
        //获取input节点，自动聚焦,点击span的时候，对于浏览器来说，渲染要时间，不能一点击span就获取到input
        this.$nextTick(()=>{
            this.$refs[index].focus();
        })
    },
    deleteAttrValue(index){
        //当前是不发请求的
        this.attrInfo.attrValueList.splice(index,1)
    },
    async addOrUpdateAttr(){
        //整理参数，如果用户添加了很多属性值，且为空，不能提交
        //提交给服务器不应该有切换视图的flag
       this.attrInfo.addAttrValue= this.attrInfo.attrValueList.filter(item=>{
            //过滤掉属性值不为空的
            if(item.valueName!=''){
                delete item.flag
                return  true
            }
        })
        //发请求
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.isShowTable=true
        this.$message('保存成功')
        this.getAttrList()//再次获取平台属性
      } catch (error) {
        this.$message('保存失败')
      }
    },
    async deleteAttr(row){
      let result=  await this.$API.attr.reqDeleteAttr(row.id)
     this.getAttrList()
    }
   }
})
</script>

<style scoped>

</style>
