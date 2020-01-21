import { getConfigInfo, getCourseTypes } from '@/api/course'
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
    locale: 'zh-CN',
    assetsDomain: '',
    langInfos: [],
    courseTypes: [],
    version: {
      selLang: '',
      selCourseType: '',
      selVersion: '',
      uuid: ''
    }
  },
  mutations: {
    updateConfigInfo (state, configInfo) {
      state.langInfos = configInfo.langInfos
      state.assetsDomain = configInfo.assetsDomain + '/'
    },
    updateVersion (state, { key, val }) {
      state.version[key] = val
    },
    updateCourseTypes (state, courseTypes) {
      state.courseTypes = courseTypes
    }
  },
  actions: {
    // 获取相关配置信息
    async getConfigInfo ({ commit }, data) {
      const res = await getConfigInfo(data)
      if (res.success) {
        commit('updateConfigInfo', res.data)
      }
    },
    // 获取课程类型
    async getCourseTypes ({ commit }) {
      const res = await getCourseTypes()
      if (res.success) {
        commit('updateCourseTypes', res.data.types)
      }
    }
  },
  getters: {}
}
