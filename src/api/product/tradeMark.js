import request from '@/utils/request'

//获取品牌列表接口
///admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

//添加品牌操作  要带参数：品牌名称，品牌logo，id是服务器生成的
//export const req=()=>request({url:'/admin/product/baseTrademark/save',method:'post'})

//修改品牌操作 需要携带id，修改哪一个品牌，品牌名称 品牌logo
//export const req=()=>request({url:'/admin/product/baseTrademark/update',method:'put'})
//因为这两个接口需要操作差不多，所以可以封装成一个接口
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    if (tradeMark.id) {
        //如果带给服务器的数据携带id，说明是修改
        return request({ url: '/admin/product/baseTrademark/update', data: tradeMark, method: 'put' })
    } else {
        return request({ url: '/admin/product/baseTrademark/save', data: tradeMark, method: 'post' })
    }
}

export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })