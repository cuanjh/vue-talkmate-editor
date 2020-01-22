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

// @Tags Api
// @Summary 添加语种
// @Security ApiKeyAuth
// @accept application/json
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
// @Success 200 {string} json "{"success":true,"data":{},"msg":"添加成功"}"
// @Router /editor/lang/add [post]
export const addLang = (data) => {
  return service({
    url: '/editor/lang/add',
    method: 'post',
    data
  })
}

// @Tags Api
// @Summary 删除语种
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param lan_code: 'string'
// @Success 200 {string} json "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /editor/lang/del [post]
export const delLang = (data) => {
  return service({
    url: '/editor/lang/del',
    method: 'post',
    data
  })
}

// @Tags Api
// @Summary 编辑语种
// @Security ApiKeyAuth
// @accept application/json
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
// @Success 200 {string} json "{"success":true,"data":{},"msg":"编辑成功"}"
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
