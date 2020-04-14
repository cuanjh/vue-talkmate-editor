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
  getOnlineList,
  tagTypes
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
    uploadfileDomain: '',
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
    onlineList: [], // 上线列表
    tagTypes: [], // 标签类型
    // 直播课程定价
    livePrices: [
      { value: 0, text: '¥ 0' },
      { value: 1, text: '¥ 1' },
      { value: 3, text: '¥ 3' },
      { value: 6, text: '¥ 6' },
      { value: 8, text: '¥ 8' },
      { value: 12, text: '¥ 12' },
      { value: 18, text: '¥ 18' },
      { value: 25, text: '¥ 25' },
      { value: 28, text: '¥ 28' },
      { value: 30, text: '¥ 30' },
      { value: 40, text: '¥ 40' },
      { value: 45, text: '¥ 45' },
      { value: 50, text: '¥ 50' },
      { value: 60, text: '¥ 60' },
      { value: 68, text: '¥ 68' },
      { value: 73, text: '¥ 73' },
      { value: 78, text: '¥ 78' },
      { value: 88, text: '¥ 88' },
      { value: 93, text: '¥ 93' },
      { value: 98, text: '¥ 98' },
      { value: 108, text: '¥ 108' },
      { value: 168, text: '¥ 168' },
      { value: 198, text: '¥ 198' },
      { value: 328, text: '¥ 328' },
      { value: 588, text: '¥ 588' },
      { value: 998, text: '¥ 998' },
      { value: 1998, text: '¥ 1998' },
      { value: 3298, text: '¥ 3298' },
      { value: 6498, text: '¥ 6498' }
    ]
  },
  mutations: {
    updateConfigInfo (state, configInfo) {
      state.langInfos = configInfo.langInfos
      state.assetsDomain = configInfo.assetsDomain + '/'
      state.uploadfileDomain = configInfo.uploadfileDomain + '/'
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
      state.modelList = models.reverse()
    },
    updateContentTypes (state, showTypes) {
      state.contentTypes = showTypes
    },
    updateContentTags (state, tags) {
      state.contentTags = tags.reverse()
    },
    updateContentTypeList (state, typesList) {
      state.contentTypeList = typesList
    },
    updateOnlineList (state, online) {
      state.onlineList = online
    },
    updateTagsTypes (state, types) {
      state.tagTypes = types
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
    async getLangList ({ state, commit }, data) {
      const res = await getLangList(data)
      if (res.success) {
        commit('updateLangList', res.data.langs)
        if (!state.version.selLang) {
          commit('updateVersion', { key: 'selLang', val: res.data.langs[0]['lan_code'] })
        }
      }
    },
    // 获取课程类型
    async getCourseTypes ({ state, commit }) {
      const res = await getCourseTypes()
      if (res.success) {
        commit('updateCourseTypes', res.data.types)
        if (!state.version.selCourseType) {
          commit('updateVersion', { key: 'selCourseType', val: res.data.types[0]['type'] })
        }
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
          } else {
            commit('updateVersion', { key: 'uuid', val: '' })
            commit('updateVersion', { key: 'versions', val: [] })
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
      if (res.success && res.data.jobs) {
        let online = res.data.jobs.filter(item => {
          item.time = moment(item.created_time * 1000).format('YYYY/MM/DD')
          return item.online_type !== 'string'
        })
        console.log(online)
        commit('updateOnlineList', online)
      }
    },
    // 获取标签类型
    async getTagTypes ({ commit }, data) {
      const res = await tagTypes(data)
      if (res.success) {
        let tags = res.data.types
        console.log(tags)
        commit('updateTagsTypes', tags)
      }
    }
  },
  getters: {}
}
