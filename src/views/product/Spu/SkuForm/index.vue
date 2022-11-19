<template>
    <div>
        <el-form ref="form" label-width="80px">
             <el-form-item label="SPU名称">
                {{spu.spuName}}
             </el-form-item>
             <el-form-item label="SKU名称">
                <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
            </el-form-item>
            <el-form-item label="价格（元）">
                <el-input placeholder="价格（元）" type="number" v-model="skuInfo.price"></el-input>
            </el-form-item>
            <el-form-item label="重量（千克）">
                <el-input placeholder="重量（千克）" type="number" v-model="skuInfo.weight"></el-input>
            </el-form-item>
            <el-form-item label="规格描述">
                <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
            </el-form-item>
            <el-form-item label="平台属性">
                 <el-form :inline="true" ref="form" label-width="80px">
                    <el-form-item :label="attr.attrName" value="" v-for="attr in attrInfoList" :key="attr.id">
                        <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
                          <!--option里面我们收集到了属性和属性值，我们需要把它们存到一个地方就是attr.attrIdAndValueId（新建的，用来存储），
                          这样的话，每！一！个！平台属性身上就都会有attrIdAndValueId这个属性，存储的是属性与属性值--> 
                      <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id">
                      </el-option>
                  </el-select>
                </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="销售属性">
                 <el-form :inline="true" ref="form" label-width="80px">
                    <el-form-item :label="saleAttr.saleAttrName" value="" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
                        <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId"> 
                      <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id">
                      </el-option>
                  </el-select>
                </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="图片列表">
                <el-table border style="width:100%" :data="spuImageList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="80px"></el-table-column>
                <el-table-column prop="prop" label="图片" width="width"> 
                  <template slot-scope="{row}">
                     <img :src="row.imgUrl" style="height:100px;width:100px">  
                  </template>
                </el-table-column>
                <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
                <el-table-column prop="prop" label="操作" width="width">
                  <template slot-scope="{row}">
                       <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
                        <el-button v-else>默认</el-button>
                  </template>
                </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
    </template>
    
    <script>
    export default({
        data(){
            return{
                spuImageList:[],//存储图片属性
                spuSaleAttrList:[],//存储销售属性
                attrInfoList:[],//存储平台属性
                //收集sku字段
                skuInfo:{
                    //第一类数据：通过父组件传过来的数据拿到（getdata）
                    "category3Id": 0,
                    "spuId": 0,
                     "tmId": 0,
                     //第二类数据：需要数据双向绑定拿到v-model
                    "price": "",
                    "skuName": "",
                    "weight": "",
                    "skuDesc": "",
                    //第三类数据：需要写代码
                    "skuDefaultImg": "", //默认图片
                    "skuImageList": [
                    //            {
                    //   "id": 0,
                    //   "imgName": "string",
                    //   "imgUrl": "string",
                    //    "isDefault": "string",
                    //   "skuId": 0,
                    //   "spuImgId": 0
                    //            }
                                   ],//收集图片信息
                    "skuSaleAttrValueList": [
                    //              {
                    //  "id": 0,
                    //  "saleAttrId": 0,
                    //  "saleAttrName": "string",
                    //  "saleAttrValueId": 0,
                    //  "saleAttrValueName": "string",
                    //  "skuId": 0,
                    //  "spuId": 0
                    //              }
                                 ],//销售属性列表
                    "skuAttrValueList": [
                               {
                     "attrId": 0,
                     "valueId": 0,
                                }
                                        ],//平台属性          
                       },
                spu:{},
                imageList:[],//收集勾选的图片信息
            }
        },
          methods:{
           async getData(category1Id,category2Id,spu){
            this.skuInfo.category3Id=spu.category3Id
            this.skuInfo.spuId=spu.id
            this.skuInfo.tmId=spu.tmId
            this.spu=spu
                //获取sku from数组
             //获取图片的数据
            let imgResult =await this.$API.spu.reqImageList(spu.id)
              if(imgResult.code==200){
                   let List=imgResult.data
                   List.forEach(item=>{
                    item.isDefault=0
                   })
                  this.spuImageList=List
              }
                  
              //获取销售属性的数组
              let saleResult =await this.$API.spu.reqSpuSaleAttrList(spu.id)
              if(saleResult.code==200){
                this.spuSaleAttrList=saleResult.data
              }
              //获取平台属性
              let attrResult =await this.$API.spu.reqAttrInfoList(category1Id,category2Id,spu.category3Id)
              if(attrResult.code==200){
                this.attrInfoList=attrResult.data
              }
            },
            handleSelectionChange(){
                //这里可以收集到一个数组，是被选中的元素的所有信息，但是如果要传给服务器，缺少了idDefault字段
            },//table表格复选框的事件
            changeDefault(row){
              //这里需要传参是因为我们需要排它操作
              this.spuImageList.forEach(item=>{
                item.isDefault=0
              })
              row.isDefault=1
              this.skuInfo.skuDefaultImg=row.imgUrl
            },
            cancel(){
              //自定义事件，让父组件切换场景为0
              this.$emit('changeScenes',0)
              //清除数据
               Object.assign(this._data, this.$options.data())
            },
            async save(){
              //整理参数
              //整理平台属性
              const {attrInfoList,skuInfo,spuSaleAttrList,imageList}=this
              // let arr=[]
              // attrInfoList.forEach(item=>{
              //   if(item.attrIdAndValueId){
              //     //表示这个选项，用户进行了选择
              //     const [attrId,valueId]=item.attrIdAndValueId.split(':')
              //     let obj={attrId,valueId}
              //     arr.push(obj)
              //   }
              // })
              // skuInfo.skuAttrValueList=arr
              skuInfo.skuAttrValueList= attrInfoList.reduce((prev,item)=>{
                if(item.attrIdAndValueId){
                  const [attrId,valueId]=item.attrIdAndValueId.split(':')
                  prev.push({attrId,valueId})
                }
                return prev
              },[])
              //整理销售属性
              skuInfo.skuSaleAttrValueList=spuSaleAttrList.reduce((prev,item)=>{
                if(item.attrIdAndValueId){
                  const [saleAttrId,saleAttrValueId]=item.attrIdAndValueId.split(':')
                  prev.push({saleAttrId,saleAttrValueId})
                }
                return prev
              },[])
              //整理图片信息
              skuInfo.skuImageList=imageList.map(item=>{
                return{
                  imgName:item.imgName,
                  imgUrl:item.imgUrl,
                  isDefault:item.isDefault,
                  spuImgId:item.Id
                }
              })
              //发请求
              let result=await this.$API.spu.reqAddSku(skuInfo)
                 if(result.code==200){
                  Object.assign(this._data, this.$options.data())
                  this.$emit('changeScenes',0)
                  this.$message('添加成功')
                 }
            }
          }
    })
    </script>
    
    <style scpoed>
    
    </style>