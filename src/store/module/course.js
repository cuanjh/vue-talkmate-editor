import { getConfigInfo } from '@/api/course'
export const course = {
  namespaced: true,
  state: {
    interfaceLangs: [
      {
        code: 'zh-CN',
        text: '中文'
      },
      {
        code: 'en',
        text: 'English'
      }
    ],
    formTypes: {
      'autoSpeak': '自动读',
      'repeatSpeak': '跟读',
      'sentenceToImg': '听句子选图片'
    },
    assetsDomain: '',
    langInfos: []
  },
  mutations: {
    updateConfigInfo (state, configInfo) {
      state.langInfos = configInfo.langInfos
      state.assetsDomain = configInfo.assetsDomain
    }
  },
  actions: {
    // 获取相关配置信息
    async getConfigInfo ({ commit }, data) {
      const res = await getConfigInfo(data)
      if (res.success) {
        commit('updateConfigInfo', res.data)
      }
    }
  },
  getters: {}
}
