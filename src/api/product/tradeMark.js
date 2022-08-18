// 获取品牌管理的数据
import request from '@/utils/request';

//获取品牌列表的接口
///admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' });

//新增品牌或修改品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    //带给服务器数据，判断修改还是新增
    if (tradeMark.id) {
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark });
    } else {
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark });
    }
}


//删除品牌
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' });









































