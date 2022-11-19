<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
      >添加</el-button
    >
    <!--表格-->
    <!--data:表格要展示的数据，一定是数组类型的
           饿了么ui当中的表格是一列一列的，每一列都是el-table-colum 
        border:是给表格添加边框
        column属性
        lebal:显示的标题
        width:列宽
        align:文字居中
       type:用来展示序号的
       prop:对应列内容的字段名
    table是以一列一列来展示的-->
    <el-table style="width: 100%" border :data="list">
      <el-table-column
        type="index"
        prop="prop"
        label="序号"
        width="80px"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <!--插槽！！-->
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit" @click="updateTradeMark(row)"
            >修改</el-button
          ><!--这里需要知道哪里要修改-->
          <el-button type="danger" icon="el-icon-delete" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器-->
    <!-- 
           layput=""可以改变布局
           current-page:当前第几页
           total:数据总条数
           page-size：每一页展示的条数
           page-sizes:[]
        @size-change='handleSizeChange':每一页的size改变
        @current-change='handleCurrentChange':每一页当你点击按钮的时候会触发-->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      @current-change="getPageList"
      layput="prev,pager,next,jumper,->sizes,total"
    >
    </el-pagination>
    <!--对话框
       :visible.sync：控制对话框的显示与隐藏
       Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
       并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
        -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!--展示表单元素-->
      <!--这里是提交表单元素的收集结果，暂时用不到-->
      <!--这里需要用到v-model绑定属性，收集数据,就是把表单的数据收集到那个对象的身上，来验证表单，-->
      <el-form style="width: 80%" v-model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
          <!--这里要写对应哪一个-->
        </el-form-item>
         <!--action：上传图片地址
            :on-success="handleAvatarSuccess"，检测图片上传是否成功，成功执行
            :before-upload="beforeAvatarUpload"上传之前执行一次-->
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
            <!--这里不能使用v-model-->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpDateTradeMark"

          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "TradeMark",
  data() {
    return {
      //表示分页器的第几页
      page: 1,
      //当前页数展示的数据
      limit: 3,
      //总共有几条数据
      total: 0,
      //列表展示数据
      list: [],
      dialogFormVisible: false, //控制对话框的显示与隐藏
      imageUrl: '',//上传图片使用的属性
      tmForm:{
        tmName:'',
        logoUrl:'',
      },//收集品牌表单信息
      //表单验证规则
      rules:{
        //品牌名称验证
        tmName: [  
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' },
          ],
        //品牌logo验证
        logoUrl: [
            { required: true, message: '请选择品牌图片'}
          ],
      },
    };
  },
  mounted() {
    //获取列表数据,如果在这里直接发请求，那么只能发一次，但是当用户点击的时候，是要一直发请求的，所以封装一下
    this.getPageList();
  },
  methods: {
    async getPageList(pager = 1) {
      this.page = pager; //没有传进来值就用1，传进来了用传进来的值
      //获取品牌列表的接口
      //要带两个参数（page，limit）
      const { limit, page } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    showDialog() {
      this.dialogFormVisible = true;
      //清除数据
      this.tmForm={tmName:'',logoUrl:''};
    },
    updateTradeMark(row) {
        //row就是当前用户选中的品牌的信息
      this.dialogFormVisible = true;
      //因为进行了绑定，所以直接修改就好
      this.tmForm={...row}
     //这里不能直接赋值，要用浅拷贝，不然就算你点了取消，数据也会直接渲染到表单上
      
    },
    //上传图片相关的回调
    handleAvatarSuccess(res, file) {
        //res上传成功之后，返回前端的地址，file：是上传成功之后，返回的一些数据
        //收集表单数据，因为将来需要带给服务器
        this.tmForm.logoUrl = res.data;
      },
     beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //添加品牌/修改品牌
     addOrUpDateTradeMark(){
       this.$ref.ruleForm.validata(async(success)=>{
       //如果全部字段符合条件，那么可以执行
        this.dialogFormVisible = false
        //发请求，可能是添加，可能是修改
       let result=await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
            if(result.code==200){
                //弹出消息
                this.$message.success(this.tmForm.id?'修改品牌成功':'添加品牌成功')
                this.getPageList(this.tmForm.id?this.page:1)
            }//更新列表展示,因为在当前页修改，所以修改完后希望停留在当前页，所以这里要传参，不然默认第一页
            else{
                return false;
            }
        }) 
    },
    deleteTradeMark(row){
        this.$confirm( `你确定删除${row.tmName}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let result= await this.$API.trademark.reqDeleteTradeMark(row.id)
          console.log(result)
         if(result.code==200){
            this.$message({
            //触发删除事件
            //向服务器发送请
            type: 'success',
            message: '删除成功!'
          });
          //再次获取数据
          this.getPageList(this.list.length>1?this.page:this.page-1)
         }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
  },
};
</script>

<style>
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
