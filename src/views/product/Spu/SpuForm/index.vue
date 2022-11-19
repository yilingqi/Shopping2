<template>
    <div>
        <!--这个子组件发请求的分析：
            不能在mounted上面（因为mounted只会挂载一次，但是子组件在父组件那里是用v-show来控制显示与隐藏，没有被销毁）
            但是我们需要的是，每在父组件那边点一次按钮，就要触发请求
            所以，现在父组件那边给子组件绑定ref=“spu” 在按钮点击事件中用this.$refs.spu可以获取到子组件的所有东西
            这样在子组件里面写方法，通过ref来让父组件触发就可以了-->
        <el-form ref="form" label-width="80px" :model="spu">
            <el-form-item label="SPU名称">
                <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
            </el-form-item>
            <el-form-item label="品牌">
                <el-select placeholder="请输入品牌名称" v-model="spu.tmId">
                    <!--（上）上面是说和spu。tmid绑定了，选择哪一个就spu里面的tm就会更改
                        (下)value就是要收集的，通过id来让服务器确认选择的是哪一个品牌-->
                    <el-option :label="tm.tmName" :value="tm.id" v-for="tm in tradeMarkList" :key="tm.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述">
              <el-input type="textarea" rows="4" placeholder="描述" v-model="spu.description"></el-input>
            </el-form-item>
            <!--action:图片上传的地址
                list type:照片墙类型
                onpreview：预览
                onremove删除图片触发
                :fill-list="spuImageList"显示照片数组格式[{name：，url：}]
                on-success是我们新上传一张图，然后可以被检测到
            -->
            <el-form-item label="SPU图片">
                <el-upload
                 action="/dev-api/admin/product/fileUpload"
                 list-type="picture-card"
                 :on-preview="handlePictureCardPreview"
                 :on-remove="handleRemove"
                 :on-success="handlerSuccess"
                 :file-list="spuImageList">
                <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="销售属性">
               <el-select :placeholder="`还有${unSelectSaleAttr.length}个未选择`" v-model="attrIdAndAttrName">
                   <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="unselect in  unSelectSaleAttr" :key="unselect.id"></el-option>
               </el-select>
               <el-button icon="el-icon-plus" type="primary" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
               <!--展示的是spu属于自己的销售属性-->
               <el-table style="width:100%" border :data="spu.spuSaleAttrList">
                      <el-table-column type="index" label="序号" width="80px" aligin="center"></el-table-column>
                      <el-table-column prop="saleAttrName" label="属性名" width="width"></el-table-column>
                      <el-table-column prop="prop" label="属性值名称列表" width="width">
                            <template slot-scope="{row,$index}">
                                <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">{{tag.saleAttrValueName}}</el-tag>
                                <!--@keyup.enter.native="handleInputConfirm"
                                    -->
                                <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small"  @blur="handleInputConfirm(row)"></el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
                            </template>
                      </el-table-column>
                      <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{row,$index}">
                           <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
                        </template>
                      </el-table-column>
                   </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
    
    </template>
    
    <script>
    export default({
        data() {
          return {
        dialogImageUrl: '',
        dialogVisible: false,
        //上面是elementbutton的数据
        //上面是el-tag的数据
        spu:{
            "category3Id": 0,//三级分类的id
            "description": " ",//描述
            "tmId": '',//品牌id
            "spuName": " ",//spu名称
            //收集spu图片信息
            "spuImageList": [
                    // {
                    //  "id": 0,
                    //  "imgName": "string",
                    //  "imgUrl": "string",
                    //  "spuId": 0
                    // }
                            ],
            //平台属性与属性值的收集
            "spuSaleAttrList": [
                    // {
                    //  "baseSaleAttrId": 0,
                    //  "id": 0,
                    //  "saleAttrName": "string",
                    //  "spuId": 0,
                    //  "spuSaleAttrValueList": [
                    //          {
                    //            "baseSaleAttrId": 0,
                    //            "id": 0,
                    //            "isChecked": "string",
                    //            "saleAttrName": "string",
                    //            "saleAttrValueName": "string",
                    //            "spuId": 0
                    //          }
                    //                          ]
                    // }
                               ],
            },//初始化是一个空对象，后来发请求有了数据，但是我们新增的时候，里面要有一些能发给服务器的，但是我们收集数据的时候要有哪些文档要先初始化。
        tradeMarkList:[],
        spuImageList:[],//spu图片
        saleAttrList:[],//销售属性的数据
        attrIdAndAttrName:'',//收集未选择的id
      };
    },
    methods: {
        //file参数，代表的是你要删除的那张图
      handleRemove(file, fileList) {
        //在删除后，需要收集照片墙剩下的照片即 fileList
        this.spuImageList=fileList
        //这列spuImage不能传给服务器，因为它身上多了两个属性，name和url
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      //上面两个是element 照片墙功能
      //初始化SpuForm数据
    async  initSpuDate(spu){
        //获取spu信息的数据
      let spuResult= await this.$API.spu.reqSpu(spu.id)
            if(spuResult.code==200){
                this.spu=spuResult.data
            }
        //获取品牌的信息
      let tradeResult= await this.$API.spu.reqTradeMark()
            if(tradeResult.code==200){
                this.tradeMarkList=tradeResult.data
            }
        //获取spu图片的信息
      let imgResult=await this.$API.spu.reqSpuImageList(spu.id)
           if(imgResult.code==200){
            let ListArr=imgResult.data
            //由于照片墙有格式要求，所以先对照片数组处理一下
            ListArr.forEach(item=>{
                item.name=item.imgName
                item.url=item.imgUrl
                //整理好的数组进行替换
            })
            this.spuImageList=ListArr;
           }
         //获取平台全部的销售属性
       let saleResult= await this.$API.spu.reqBaseSaleAttr()  
         if(saleResult.code==200){
            this.saleAttrList=saleResult.data
         }
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      addSaleAttrValue(row){
        //添加按钮的回调,点击销售属性的添加，我们需要展示input，通过row. inputVisible（目前没有这个属性，要通过vue添加响应式数据）
        //收集到row. inputValue中，这个也是后添加的
        this.$set(row,'inputVisible',true)
        this.$set(row,'inputValue','')
      },
       //el-input失去焦点
      handleInputConfirm(row) {
       const {baseSaleAttrId,inputValue} =row
       //判断，新增的销售属性值的名称不为空
       if(inputValue.trim()==''){
        this.$message('输入不能为空')
        return
       }
       //属性值不能重复
      let result= row.spuSaleAttrValueList.every(item=>item.saleAttrValueName!=inputValue)
      if(!result)return
        row.inputVisible = false;
        let newSaleValue={
            baseSaleAttrId,
            saleAttrValueName:inputValue
        }
        row.spuSaleAttrValueList.push(newSaleValue)
        
      },
      handlerSuccess(response,file,fileList){
        //照片墙上传成功的回调
        //第一个参数是服务器返回的信息，第二个参数是上传成功的那张图，第三个参数，是所有图片的信息
        this.spuImageList=fileList
      },
      //上面三个方法都是el-tag
      addSaleAttr(){
        //添加新的销售属性
        //把收集到的销售属性进行分割
        const[baseSaleAttrId,saleAttrName]=this.attrIdAndAttrName.split(':')
          //向spu对象的spuSaleAttrList属性里面，添加属性。
          let newSaleAttr={
            baseSaleAttrId,
            saleAttrName,
            spuSaleAttrValueList:[],
          }
          //添加新的销售属性
          this.spu.spuSaleAttrList.push(newSaleAttr)
          this. attrIdAndAttrName=''
      },
      async addOrUpdateSpu(){
        //整理参数，带给服务器的参数，看data中的spu
        //照片墙的数据还没有更新，之前收集到了spuImageList这个数组中，但是spuImageList这个数组又多了两个属性，所以需要我们删除，我们住需要imgName，imgUrl字段
       this.spu.spuImageList= this.spuImageList.map(item=>{
            return {
                imgName:item.name,
                imgUrl:(item.response&&item.response.data)||item.url
            //map返回的是新数组，这里如果是新图片，就不会有url，所以要用response里面的data数据（不能用本地地址，不然下次就看不到了）
            }
        })
      let result= await this.$API.spu.reqAddOrUpdateSpu(this.spu)
        if(result.code==200){
            this.$message('保存成功')
            //通知父亲回到场景0
            this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'添加'})
        }
        Object.assign(this._data,this.$option.data())//清除数据
      },
      async addSpuData(category3Id){
        //添加spu的时候，收集三级分类的id
        //点击添加按钮，发送两个请求
        //获取品牌的信息
        this.spu.category3Id=category3Id
        let tradeResult= await this.$API.spu.reqTradeMark()
            if(tradeResult.code==200){
                this.tradeMarkList=tradeResult.data
            }
            //获取属性的全部信息
         let saleResult= await this.$API.spu.reqBaseSaleAttr()  
         if(saleResult.code==200){
            this.saleAttrList=saleResult.data
         }
      },
      cancel(){
       this.$emit('changeScene',{scene:0,flag:'取消'})
       //通知父亲切换场景为0
       //清理数据es6新增的合并对象
       Object.assign(this._data,this.$option.data())
      }
    },
    computed:{
        unSelectSaleAttr(){
            //整个平台的销售属性一共有三个 saleAttrList
            //当前SPU拥有的属于自己的销售属性spu.spusaleAttrList
            //过滤,可以从已有的数组当中，过滤出用户需要的元素，返回新的数组
          return  this.saleAttrList.filter(item=>{
                //every会返回一个布尔值
                return this.spu.spuSaleAttrList.every(item1=>{
                    return item.name!=item1.saleAttrName 
                })
            })
        }
    }
    })
    </script>
    
    <style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>