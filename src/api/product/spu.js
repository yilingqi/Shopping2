//spu接口
import request from '@/utils/request'

//获取spu列表数据的接口/admin/product/{page}/{limit}  get 还有要携带的数据是category3Id
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })

//获取某一个sup的信息 /admin/product/getSpuById/{spuId}
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

//获取品牌的信息  /admin/product/baseTrademark/getTrademarkList
export const reqTradeMark = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })

//获取spu图片接口 /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

//获取平台销售属性(最多三个)/admin/product/baseSaleAttrList
export const reqBaseSaleAttr = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' })

//修改，或者添加Spu，这两者唯一的区别是是否携带id
export const reqAddOrUpdateSpu = (spuInfo) => {
    //如果有id，是修改
    if (spuInfo.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo })
    } else {
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
    }
}

//删除spu的接口
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

//获取图片接口/admin/product/spuImageList/{spuId}
export const reqImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });

//获取销售属性列表 /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

//获取平台属性的数据 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

//添加SKU
export const reqAddSku = (skuInfo) => request({ url: `/admin/product/saveSkuInfo`, method: 'post', data: skuInfo });

//展示该产品所有sku
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })