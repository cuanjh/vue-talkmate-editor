import service from '@/utils/request'

// @Summary 获取配置信息
// @Produce  application/json
// @Param none
// @Router /editor/info/config [get]
export const getConfigInfo = () => {
  return service({
    url: '/editor/info/config',
    method: 'get'
  })
}

// @Summary 获取上传课程资料的七牛Token
// @Produce  application/json
// @Param none
// @Router /editor/info/token [get]
export const getInfoToken = () => {
  return service({
    url: '/editor/info/token',
    method: 'get'
  })
}

// @Summary 获取语种列表
// @Produce  application/json
// @Param { \"pageNo\": 0, \"pageSize\": 100}
// @Router /editor/lang/list [post]
export const getLangList = (data) => {
  return service({
    url: '/editor/lang/list',
    method: 'post',
    data
  })
}

// @Summary 添加语种
// @Produce application/json
// @Param
// {
//   "desc": {
//     "additionalProp1": "string",
//     "additionalProp2": "string",
//     "additionalProp3": "string"
//   },
//   "flag": [
//     "string"
//   ],
//   "is_hot": true,
//   "is_show": true,
//   "lan_code": "string",
//   "list_order": 0,
//   "title": {
//     "additionalProp1": "string",
//     "additionalProp2": "string",
//     "additionalProp3": "string"
//   },
//   "word_direction": "string"
// }
// @Router /editor/lang/add [post]
export const addLang = (data) => {
  return service({
    url: '/editor/lang/add',
    method: 'post',
    data
  })
}

// @Summary 删除语种
// @Produce application/json
// @Param lan_code: 'string'
// @Router /editor/lang/del [post]
export const delLang = (data) => {
  return service({
    url: '/editor/lang/del',
    method: 'post',
    data
  })
}

// @Summary 编辑语种
// @Produce application/json
// @Param
// {
//   "lan_code": "string",
//   "lang_info": {
//     "desc": {
//       "additionalProp1": "string",
//       "additionalProp2": "string",
//       "additionalProp3": "string"
//     },
//     "flag": [
//       "string"
//     ],
//     "is_hot": true,
//     "is_show": true,
//     "list_order": 0,
//     "title": {
//       "additionalProp1": "string",
//       "additionalProp2": "string",
//       "additionalProp3": "string"
//     },
//     "word_direction": "string"
//   }
// }
// @Router /editor/lang/del [post]
export const editLang = (data) => {
  return service({
    url: '/editor/lang/edit',
    method: 'post',
    data
  })
}

// @Summary 获取课程分类
// @Produce  application/json
// @Param none
// @Router /editor/course/types [get]
export const getCourseTypes = () => {
  return service({
    url: '/editor/course/types',
    method: 'get'
  })
}

// @Summary 获取课程列表
// @Produce  application/json
// @Param
// {
//   "lan_code": "string",
//   "pageNo": 0,
//   "pageSize": 0
// }
// @Router /editor/course/list [post]
export const getCourseList = (data) => {
  return service({
    url: '/editor/course/list',
    method: 'post',
    data
  })
}

// @Summary 添加课程
// @Produce  application/json
// @Param
// {
//   "code": "string",
//   "course_type": 0,
//   "cover": [
//     "string"
//   ],
//   "desc": {
//     "additionalProp1": "string",
//     "additionalProp2": "string",
//     "additionalProp3": "string"
//   },
//   "flag": [
//     "string"
//   ],
//   "is_show": true,
//   "lan_code": "string",
//   "tags": [
//     "string"
//   ],
//   "title": {
//     "additionalProp1": "string",
//     "additionalProp2": "string",
//     "additionalProp3": "string"
//   },
//   "uuid": "string"
// }
// @Router /editor/course/add [post]
export const addCourse = (data) => {
  return service({
    url: '/editor/course/add',
    method: 'post',
    data
  })
}

// @Summary 修改课程
// @Produce  application/json
// @Param
// {
//   "code": "string",
//   "course_type": 0,
//   "cover": [
//     "string"
//   ],
//   "desc": {
//     "additionalProp1": "string",
//     "additionalProp2": "string",
//     "additionalProp3": "string"
//   },
//   "flag": [
//     "string"
//   ],
//   "is_show": true,
//   "lan_code": "string",
//   "tags": [
//     "string"
//   ],
//   "title": {
//     "additionalProp1": "string",
//     "additionalProp2": "string",
//     "additionalProp3": "string"
//   },
//   "uuid": "string"
// }
// @Router /editor/course/edit [post]
export const courseEdit = (data) => {
  return service({
    url: '/editor/course/edit',
    method: 'post',
    data
  })
}

// @Summary 获取课程列表
// @Produce  application/json
// @Param
// {
//   "pageNo": 0,
//   "pageSize": 0,
//   "parent_uuid": "string"
// }
// @Router /editor/content/list [post]
export const getCourseVersionList = (data) => {
  return service({
    url: '/editor/content/version/list',
    method: 'post',
    data
  })
}

/**
 * @Summary 添加课程版本
 * @Produce  application/json
 * @param {*} data
 * @Router /editor/content/version/add [post]
 */
export const addCourseVersion = (data) => {
  return service({
    url: '/editor/content/version/add',
    method: 'post',
    data
  })
}

/**
 * @Summary 删除课程版本
 * @Produce  application/json
 * @param {*} data
 * @Router /editor/content/version/del [post]
 */
export const delCourseVersion = (data) => {
  return service({
    url: '/editor/content/version/del',
    method: 'post',
    data
  })
}

/**
 * @Summary 编辑课程版本
 * @Produce  application/json
 * @param {*} data
 * @Router /editor/content/version/edit [post]
 */
export const editCourseVersion = (data) => {
  return service({
    url: '/editor/content/version/edit',
    method: 'post',
    data
  })
}

// @Summary 获取目录列表
// @Produce  application/json
// @Param
// {
//   "parent_uuid": "2d28b65a-3eae-4030-93da-b70b453b4ceb"
// }
// @Router /editor/catalog/list [post]
export const getCatalogList = (data) => {
  return service({
    url: '/editor/catalog/list',
    method: 'post',
    data
  })
}

/**
 * @Summary 添加目录（文件）
 * @param {*} data
 * @Router /editor/catalog/add [post]
 */
export const addCatalog = (data) => {
  return service({
    url: '/editor/catalog/add',
    method: 'post',
    data
  })
}

/**
 * @Summary 修改目录（文件）
 * @param {*} data
 * @Router /editor/catalog/edit [post]
 */
export const editCatalog = (data) => {
  return service({
    url: '/editor/catalog/edit',
    method: 'post',
    data
  })
}

/**
 * @Summary 删除目录（文件）
 * @param {*} data
 * @Router /editor/catalog/del [post]
 */
export const delCatalog = (data) => {
  return service({
    url: '/editor/catalog/del',
    method: 'post',
    data
  })
}

/**
 * @Summary 移动目录（文件）
 * @param {*} data
 * @Router /editor/catalog/move [post]
 */
export const moveCatalog = (data) => {
  return service({
    url: '/editor/catalog/move',
    method: 'post',
    data
  })
}

/**
 * @Summary 复制目录（文件）
 * @param {*} data
 * @Router /editor/catalog/copy [post]
 */
export const copyCatalog = (data) => {
  return service({
    url: '/editor/catalog/copy',
    method: 'post',
    data
  })
}

/**
 * @Summary 获取内容列表
 * @Produce  application/json
 * @Param
 * {
 *    "content_model": "string",
 *    "parent_uuid": "string"
 *  }
 * @Router /editor/content [post]
 */
export const getContent = (data) => {
  return service({
    url: '/editor/content',
    method: 'post',
    data
  })
}

/**
 * @Summary 编辑内容
 * @Produce  application/json
 * @Param
 * {
 *    "content_model": "string",
 *    "contents": "string" // form数组
 *    "parent_uuid": "string"
 *  }
 * @Router /editor/content/edit [post]
 */
export const editContent = (data) => {
  return service({
    url: '/editor/content/edit',
    method: 'post',
    data
  })
}

/**
 * @Summary 删除内容
 * @Produce  application/json
 * @Param
 * {
 *   "content_model": "string",
 *   "del_uuids": [
 *     "string"
 *   ]
 * }
 * @Router /editor/content/del [post]
 */
export const delContent = (data) => {
  return service({
    url: '/editor/content/del',
    method: 'post',
    data
  })
}

/**
 * @Summary 获取模型列表
 * @Produce  application/json
 * @param {*} data
 * {
 *   "pageNo": 0,
 *   "pageSize": 0
 * }
 * @Router /editor/model/list [post]
 */
export const getModelList = (data) => {
  return service({
    url: '/editor/model/list',
    method: 'post',
    data
  })
}

/**
 * @Summary 获取内容类型列表
 * @param {*} data
 * @Router /editor/content/showTypes [get]
 */
export const getContentTypes = (data) => {
  return service({
    url: '/editor/content/showTypes',
    method: 'get',
    data
  })
}

/**
 * @Summary 获取内容标签列表
 * @param {*} data
 * @Router /editor/tag/list [post]
 */
export const getContentTags = (data) => {
  return service({
    url: '/editor/tag/list',
    method: 'post',
    data
  })
}

/**
 * @Summary 添加标签
 * @param {*} data
 * @Router /editor/tag/add [post]
 */
export const addTags = (data) => {
  return service({
    url: '/editor/tag/add',
    method: 'post',
    data
  })
}

/**
 * @Summary 删除标签
 * @param {*} data
 * @Router /editor/tag/del [post]
 */
export const delTags = (data) => {
  return service({
    url: '/editor/tag/del',
    method: 'post',
    data
  })
}

/**
 * @Summary 搜索图片库
 * @param {*} data
 * @Router /editor/image/search [post]
 */
export const searchImages = (data) => {
  return service({
    url: '/editor/image/search',
    method: 'post',
    data
  })
}

/**
 * @Summary 搜索内容
 * @param {*} data
 * @Router /editor/content/search [post]
 */
export const searchContent = (data) => {
  return service({
    url: '/editor/content/search',
    method: 'post',
    data
  })
}

/**
 * @Summary 设置目录权限
 * @param {*} data
 * @Router /editor/authority/set [post]
 */
export const setCatalogAuthority = (data) => {
  return service({
    url: '/editor/authority/set',
    method: 'post',
    data
  })
}

/**
 * @Summary 提交审核
 * @param {*} data
 * @Router /editor/examin/submit [post]
 */
export const submitExamin = (data) => {
  return service({
    url: '/editor/examin/submit',
    method: 'post',
    data
  })
}
