import { login } from '../../api/user'
import router from '../../router'
import { jsonInBlacklist } from '../../api/jwt'

export const user = {
  namespaced: true,
  state: {
    userInfo: {
      uuid: '',
      nickName: '',
      headerImg: '',
      authority: ''
    },
    lowerRoleUser: false,
    token: '',
    expiresAt: ''
  },
  mutations: {
    setUserInfo (state, userInfo) {
      console.log('userInfo', userInfo)
      let obj = {
        name: userInfo.userName,
        avatar: userInfo.headerImg,
        uuid: userInfo.uuid
      }
      window.zhuge.identify(userInfo.uuid, obj)
      if (userInfo.authorityId === '111' || userInfo.authorityId === '121' || userInfo.authorityId === '131') {
        state.lowerRoleUser = true
      } else {
        state.lowerRoleUser = false
      }
      state.userInfo = userInfo
    },
    setToken (state, token) {
      state.token = token
    },
    setExpiresAt (state, expiresAt) {
      state.expiresAt = expiresAt
    },
    LoginOut (state) {
      state.userInfo = {}
      state.token = ''
      state.expiresAt = ''
      router.push({ name: 'login', replace: true })
      window.location.reload()
    },
    ResetUserInfo (state, userInfo = {}) {
      state.userInfo = { ...state.userInfo, ...userInfo }
    }
  },
  actions: {
    async LoginIn ({ commit }, loginInfo) {
      const res = await login(loginInfo)
      commit('setUserInfo', res.data.user)
      commit('setToken', res.data.token)
      commit('setExpiresAt', res.data.expiresAt)
      if (res.success) {
        const redirect = router.history.current.query.redirect
        if (redirect) {
          router.push({ path: redirect })
        } else {
          router.push({ path: 'layout/dashbord' })
        }
      }
    },
    async LoginOut ({ commit }) {
      const res = await jsonInBlacklist()
      if (res.success) {
        commit('LoginOut')
      }
    }
  },
  getters: {
    userInfo (state) {
      return state.userInfo
    },
    token (state) {
      return state.token
    },
    expiresAt (state) {
      return state.expiresAt
    }
  }
}
