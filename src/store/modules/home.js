import mockRequest from '@/utils/mockRequest'
const state = {
    list: {}
}
const mutations = {
    GETDATE(state, list) {
        state.list = list
    }
}
const actions = {
    //发请求获取首页的模拟数组
    async getData({ commit }) {
        let result = await mockRequest.get('/home/list')
        if (result.code == 20000) {
            commit('GETDATE', result.data)
        }
    }
}
const getters = {}
export default {
    state,
    mutations,
    actions,
    getters
}