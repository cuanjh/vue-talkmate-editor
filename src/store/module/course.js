import { getLangList } from '@/api/course'
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
    langList: {},
    langAssetsUrl: '',
    formTypes: {
      'autoSpeak': '自动读',
      'repeatSpeak': '跟读',
      'sentenceToImg': '听句子选图片'
    }
  },
  mutations: {
    updateLangInfo (state, langInfo) {
      state.langAssetsUrl = langInfo.assetsUrl
      state.langList = langInfo.langs
    }
  },
  actions: {
    async getLangList ({ commit }, data) {
      const res = await getLangList(data)
      console.log(res)
      if (res.success) {
        commit('updateLangInfo', res.data)
      }
    }
  },
  getters: {}
}
