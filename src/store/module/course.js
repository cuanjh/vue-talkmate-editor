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
  tagTypes,
  getLevelTypeList
} from '@/api/course'
import moment from 'moment'
import { getMajiaUsers, GetDictTags } from '../../api/course'

export const course = {
  namespaced: true,
  state: {
    formTypes: {
      'autoSpeak': '自动读',
      'repeatSpeak': '跟读',
      'sentenceToImg': '听句子选图片'
    },
    partOfSpeech: {
      ENG: [
        { key: 'n.', name: '名词' },
        { key: 'v.', name: '动词' },
        { key: 'vt.', name: '及物动词' },
        { key: 'vi.', name: '不及物动词' },
        { key: 'pron.', name: '代词' },
        { key: 'adj.', name: '形容词' },
        { key: 'adv.', name: '副词' },
        { key: 'num.', name: '数词' },
        { key: 'art.', name: '冠词' },
        { key: 'prep.', name: '介词' },
        { key: 'conj.', name: '连词' },
        { key: 'interj.', name: '感叹词' },
        { key: 'det.', name: '限定词' }
      ]
    },
    courseOperateLogs: [
      { key: 11, name: '内容新建' },
      { key: 12, name: '内容编辑' },
      { key: 13, name: '内容删除' },
      { key: 14, name: '内容回滚' },
      { key: 20, name: '目录新建' },
      { key: 21, name: '目录编辑' },
      { key: 22, name: '目录删除' },
      { key: 23, name: '目录移动' },
      { key: 24, name: '目录重命名' },
      { key: 25, name: '目录回滚' }
    ],
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
      courseList: [],
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
      { value: 1398, text: '¥ 1398' },
      { value: 1698, text: '¥ 1698' },
      { value: 1998, text: '¥ 1998' },
      { value: 2298, text: '¥ 2298' },
      { value: 3298, text: '¥ 3298' },
      { value: 6498, text: '¥ 6498' }
    ],
    majia: [],
    // 红色代表改动过还不确定准确度；黄色代表修改完毕；绿色代表审核完毕确认没问题
    selfSigns: [
      { key: '', type: 'info', desc: '重置' },
      { key: '0', type: 'danger', desc: '红色（改动过还不确定准确度）' },
      { key: '1', type: 'warning', desc: '黄色（修改完毕）' },
      { key: '2', type: 'success', desc: '绿色（审核完毕确认没问题）' }
    ],
    dictTags: [],
    courseContentPath: '',
    selCourseFormUUID: '',
    soundLangMap: {
      ENG: 'eng',
      FRE: 'fra',
      CHI: 'zho',
      JPN: 'jpn',
      RUS: 'rus',
      KOR: 'kor',
      GER: 'deu',
      ITA: 'ita',
      SPA: 'spa'
    },
    voiceActors: [], // 每个语言的声优列表
    levelTypeList: [] // 我的等级分类列表
  },
  mutations: {
    updateConfigInfo (state, configInfo) {
      state.langInfos = configInfo.langInfos
      state.assetsDomain = configInfo.assetsDomain + '/'
      state.uploadfileDomain = configInfo.uploadfileDomain + '/'
    },
    updateCourseContentPath (state, path) {
      state.courseContentPath = path
    },
    updateSelCourseFormUUID (state, uuid) {
      state.selCourseFormUUID = uuid
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
    },
    updateMajia (state, data) {
      state.majia = data
    },
    updateDictTags (state, data) {
      state.dictTags = data
    },
    updateVoiceActors (state, data) {
      state.voiceActors = data
    },
    updataLevelTypeList (state, data) {
      state.levelTypeList = data
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
        commit('updateLangList', res.data.list)
        if (!state.version.selLang) {
          commit('updateVersion', { key: 'selLang', val: res.data.list[0]['lan_code'] })
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
          commit('updateVersion', { key: 'courseList', val: courses })
          let selCourse = courses.find(item => {
            return state.version.selCourse && item.uuid === state.version.selCourse.uuid
          })
          if (!selCourse) {
            selCourse = courses[0]
          }
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
          commit('updateVersion', { key: 'courseList', val: [] })
          commit('updateVersion', { key: 'selVersion', val: '' })
          commit('updateVersion', { key: 'uuid', val: '' })
          commit('updateVersion', { key: 'versions', val: [] })
        }
      }
    },
    // 获取课程版本
    async getCourseVersions ({ commit }, data) {
      const res = await getCourseVersionList(data)
      if (res.success && res.data.contents) {
        let versions = res.data.contents.sort((a, b) => {
          return b['update_time'] - a['update_time']
        })
        commit('updateVersion', { key: 'versions', val: versions })
      } else {
        commit('updateVersion', { key: 'versions', val: [] })
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
    },
    async getMajia ({ commit }, data) {
      const res = await getMajiaUsers(data)
      if (res.success) {
        console.log(res)
        commit('updateMajia', res.data.userInfos)
      }
    },
    async getDictTags ({ commit }, data) {
      const res = await GetDictTags(data)
      if (res.success) {
        console.log(res)
        commit('updateDictTags', res.data)
      }
    },
    // 获取等级分类列表
    async getLevelTypeList ({ commit }, data) {
      const res = await getLevelTypeList(data)
      if (res.success) {
        let list = res.data.list || []
        console.log(list)
        if (list.length > 0) {
          list = list.filter(item => {
            return item.isDel === false
          })
        }
        commit('updataLevelTypeList', list)
      }
    }
  },
  getters: {}
}
