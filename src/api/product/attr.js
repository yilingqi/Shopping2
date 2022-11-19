//平台属性管理
import request from '@/utils/request'

//获取一级分类数据的接口
///admin/product/getCategory1  get
export const reqCategory1List = () => request({ url: '/admin/product/getCategory1', method: 'get' })

//获取二级分类的接口
///admin/product/getCategory2/{category1Id}   get
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })

//获取三级分类的接口
///admin/product/removeCategory3/{id}
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })

//展示商品
///admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrList = (category1Id, category2Id, category3Id) => request({ url: `admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

//添加属性与属性值的接口/admin/product/saveAttrInfo  post
export const reqAddOrUpdateAttr = (data) => request({ url: '/admin/product/saveAttrInfo', data, method: 'post' })
    /*{
      "attrName": "string",
      "attrValueList": [
        {
          "attrId": 0,
          "id": 0,
          "valueName": "string"
        }
      ],
      "categoryId": 0,
      "categoryLevel": 0,
      "id": 0
    } */

//删除属性/admin/product/deleteAttr/{attrId}
export const reqDeleteAttr = (attrId) => request({ url: `/admin/product/deleteAttr/${attrId}`, method: 'delete' })