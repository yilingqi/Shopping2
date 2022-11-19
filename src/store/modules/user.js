import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { anyRoutes, resetRouter, asyncRoutes, constantRoutes } from '@/router'
import router from '@/router'


const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: '',
        routes: [],
        roles: [],
        buttons: [],
        //对比项目中有的异步路由，与服务器返回数据对比
        resultAsyncRoute: [],
        resultAllRoutes: []
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    //存储用户信息
    SET_USERINFO: (state, userInfo) => {
        state.name = userInfo.name
        state.avatar = userInfo.avatar
        state.routes = userInfo.routes
        state.buttons = userInfo.buttons
        state.roles = userInfo.roles
    },
    SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
        state.resultAsyncRoute = asyncRoutes
        state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoute, anyRoutes)
        router.addRoutes(state.resultAllRoutes)
    }
}

const computedAsyncRoutes = (asyncRoutes, routes) => {
    return asyncRoutes.filter(item => {
        if (routes.indexOf(item.name) != -1) {
            if (item.children && item.children.length) {
                item.children = computedAsyncRoutes(item.children, routes);
            }
            return true
        }
    })
}

const actions = {
    //在处理登陆业务
    // user login
    async login({ commit }, userInfo) {
        //解构出用户名和密码
        const { username, password } = userInfo
        // return new Promise((resolve, reject) => {
        //   login({ username: username.trim(), password: password }).then(response => {
        //     const { data } = response
        //     commit('SET_TOKEN', data.token)
        //     setToken(data.token)
        //     resolve()
        //   }).catch(error => {
        //     reject(error)
        //   })
        // })
        let result = await login({ username: username.trim(), password: password.trim() })

        if (result.code == 20000) {
            commit('SET_TOKEN', result.data.token) //提交
            setToken(result.data.token) //本地存储一下token
            return 'ok'
        } else {
            return Promise.reject(new Error('fail'))
        }
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                const { data } = response
                //vuex存储全部用户的信息
                commit('SET_USERINFO', data);
                commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}