import {
  getConfigInfo,
  getCourseTypes,
  getLangList,
  getCourseList,
  getCourseVersionList,
  getModelList,
  getContentTypes,
  getContentTags,
  getContentTypeList,
  getOnlineList
} from '@/api/course'
import moment from 'moment'

export const course = {
  namespaced: true,
  state: {
    formTypes: {
      'autoSpeak': '自动读',
      'repeatSpeak': '跟读',
      'sentenceToImg': '听句子选图片'
    },
    locale: 'zh-CN',
    assetsDomain: '',
    langInfos: [],
    langList: [],
    selLangState: '',
    courseTypes: [],
    version: {
      selLang: '',
      selCourseType: '',
      selCourse: null,
      selVersion: '',
      versions: [],
      uuid: '',
      copyForm: ''
    },
    modelList: [], // 内容模型列表
    contentTypes: [], // 内容分类列表
    contentTags: [], // 内容标签列表
    contentTypeList: [], // 内容类型列表
    onlineList: [] // 上线列表
  },
  mutations: {
    updateConfigInfo (state, configInfo) {
      state.langInfos = configInfo.langInfos
      state.assetsDomain = configInfo.assetsDomain + '/'
    },
    updateLangList (state, langs) {
      state.langList = langs
    },
    updateVersion (state, { key, val }) {
      state.version[key] = val
    },
    updateCourseTypes (state, courseTypes) {
      state.courseTypes = courseTypes
    },
    updataModelList (state, models) {
      state.modelList = models
    },
    updateContentTypes (state, showTypes) {
      state.contentTypes = showTypes
    },
    updateContentTags (state, tags) {
      state.contentTags = tags
    },
    updateContentTypeList (state, typesList) {
      state.contentTypeList = typesList
    },
    updateOnlineList (state, online) {
      state.onlineList = online
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
    // 获取语种列表
    async getLangList ({ commit }, data) {
      const res = await getLangList(data)
      if (res.success) {
        commit('updateLangList', res.data.langs)
        commit('updateVersion', { key: 'selLang', val: res.data.langs[0]['lan_code'] })
      }
    },
    // 获取课程类型
    async getCourseTypes ({ commit }) {
      const res = await getCourseTypes()
      if (res.success) {
        commit('updateCourseTypes', res.data.types)
        commit('updateVersion', { key: 'selCourseType', val: res.data.types[0]['type'] })
      }
    },
    // 获取课程列表，并根据当前课程分类获取课程版本
    async getCourseList ({ state, dispatch, commit }, data) {
      const res = await getCourseList(data)
      if (res.success) {
        let courses = res.data.courses
        if (courses) {
          let selCourse = courses.find(item => {
            return item.course_type === state.version.selCourseType
          })
          commit('updateVersion', { key: 'selCourse', val: selCourse })
          if (selCourse) {
            let uuid = selCourse.uuid
            dispatch('getCourseVersions', { 'pageNo': 0, 'pageSize': 0, 'parent_uuid': uuid })
          }
        } else {
          commit('updateVersion', { key: 'selCourse', val: {} })
          commit('updateVersion', { key: 'selVersion', val: '' })
          commit('updateVersion', { key: 'uuid', val: '' })
          commit('updateVersion', { key: 'versions', val: [] })
        }
      }
    },
    // 获取课程版本
    async getCourseVersions ({ commit }, data) {
      const res = await getCourseVersionList(data)
      if (res.success) {
        let versions = res.data.contents.sort((a, b) => {
          return b['update_time'] - a['update_time']
        })
        commit('updateVersion', { key: 'versions', val: versions })
      }
    },
    // 获取内容模型列表
    async getModelList ({ commit }, data) {
      const res = await getModelList(data)
      if (res.success) {
        let models = res.data.models
        console.log(models)
        commit('updataModelList', models)
      }
    },
    // 获取内容类型列表
    async getContentTypes ({ commit }) {
      const res = await getContentTypes()
      if (res.success) {
        let showTypes = res.data.showTypes
        commit('updateContentTypes', showTypes)
      }
    },
    // 获取内容标签列表
    async getContentTags ({ commit }, data) {
      const res = await getContentTags(data)
      if (res.success) {
        let tags = res.data.tags
        commit('updateContentTags', tags)
      }
    },
    // 获取内容类型列表
    async getContentTypeList ({ commit }, data) {
      const res = await getContentTypeList(data)
      if (res.success) {
        let typesList = res.data.types
        console.log(typesList)
        commit('updateContentTypeList', typesList)
      }
    },
    // 获取内容类型列表
    async getOnlineList ({ commit }, data) {
      const res = await getOnlineList(data)
      if (res.success) {
        let online = res.data.jobs.filter(item => {
          item.time = moment(item.created_time * 1000).format('YYYY/MM/DD')
          return item.online_type !== 'string'
        })
        console.log(online)
        commit('updateOnlineList', online)
      }
    }
  },
  getters: {}
}
