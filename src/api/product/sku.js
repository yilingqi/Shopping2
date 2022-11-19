import request from '@/utils/request'
//获取sku列表/admin/product/list/{page}/{limit}
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })

//sku的上架与下架
export const reqSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })

export const reqCancel = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })

//得到sku详情
export const reqSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })