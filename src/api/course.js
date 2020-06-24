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

// @Summary 获取上传课程资料的七牛Token(uploadfile bucket)
// @Produce  application/json
// @Param none
// @Router /editor/info/token/uploadfile [get]
export const getInfoTokenUploadFile = () => {
  return service({
    url: '/editor/info/token/uploadfile',
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

/**
 * @Summary 课程删除
 * @Produce  application/json
 * @param {*} data
 * @Router /editor/course/del [post]
 */
export const courseDel = (data) => {
  return service({
    url: '/editor/course/del',
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
 * @Summary 重命名目录（文件）
 * @param {*} data
 * @Router /editor/catalog/rename [post]
 */
export const renameCatalog = (data) => {
  return service({
    url: '/editor/catalog/rename',
    method: 'post',
    data
  })
}

/**
 * @Summary 目录（文件）显示或隐藏
 * @param {*} data
 * @Router /editor/catalog/show [post]
 */
export const setIsShowCatalog = (data) => {
  return service({
    url: '/editor/catalog/show',
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
 * @Summary 添加模型
 * @Produce  application/json
 * @param {*} data
 * {
 *   "pageNo": 0,
 *   "pageSize": 0
 * }
 * @Router /editor/model/add [post]
 */
export const addModel = (data) => {
  return service({
    url: '/editor/model/add',
    method: 'post',
    data
  })
}

/**
 * @Summary 删除模型
 * @Produce  application/json
 * @param {*} data
 * {
 *   "pageNo": 0,
 *   "pageSize": 0
 * }
 * @Router /editor/model/del [post]
 */
export const delModel = (data) => {
  return service({
    url: '/editor/model/del',
    method: 'post',
    data
  })
}

/**
 * @Summary 编辑模型
 * @Produce  application/json
 * @param {*} data
 * {
 *   "pageNo": 0,
 *   "pageSize": 0
 * }
 * @Router //editor/model/edit [post]
 */
export const editorModel = (data) => {
  return service({
    url: '/editor/model/edit',
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
 * @Summary 编辑标签
 * @param {*} data
 * @Router /editor/tag/edit [post]
 */
export const editTags = (data) => {
  return service({
    url: '/editor/tag/edit',
    method: 'post',
    data
  })
}

/**
 * @Summary 标签类型
 * @param {*} data
 * @Router /editor/tag/types [post]
 */
export const tagTypes = (data) => {
  return service({
    url: '/editor/tag/types',
    method: 'get'
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
 * @Summary 图片库标签列表
 * @param {*} data
 * @Router /editor/image/tags [post]
 */
export const imagesTags = (data) => {
  return service({
    url: '/editor/image/tags',
    method: 'post',
    data
  })
}

/**
 * @Summary 添加图片库标签
 * @param {*} data
 * @Router /editor/image/tag/add [post]
 */
export const addImageTag = (data) => {
  return service({
    url: '/editor/image/tag/add',
    method: 'post',
    data
  })
}

/**
 * @Summary 删除图片库标签
 * @param {*} data
 * @Router /editor/image/tag/del [post]
 */
export const delImageTag = (data) => {
  return service({
    url: '/editor/image/tag/del',
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
export const setAuthority = (data) => {
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

/**
 * @Summary 重置审核状态
 * @param {*} data
 * @Router /editor/examin/reset [post]
 */
export const resetExamin = (data) => {
  return service({
    url: '/editor/examin/reset',
    method: 'post',
    data
  })
}

/**
 * @Summary 审核
 * @param {*} data
 * @Router /editor/examin [post]
 */
export const examin = (data) => {
  return service({
    url: '/editor/examin',
    method: 'post',
    data
  })
}

/**
 * @Summary 添加上线任务
 * @param {*} data
 * @Router /editor/online/courseInfo [post]
 */
export const onlineCourses = (data) => {
  return service({
    url: '/editor/online/courseInfo',
    method: 'post',
    data
  })
}

/**
 * @Summary 添加上线任务
 * @param {*} data
 * @Router /editor/online/job [post]
 */
export const addOnlineJob = (data) => {
  return service({
    url: '/editor/online/job',
    method: 'post',
    data
  })
}

/**
 * @Summary 获取内容类型列表
 * @param {*} data
 * @Router /editor/contenttype/list [post]
 */
export const getContentTypeList = (data) => {
  return service({
    url: '/editor/contenttype/list',
    method: 'post',
    data
  })
}

/**
 * @Summary 删除内容类型
 * @param {*} data
 * @Router /editor/contenttype/del [post]
 */
export const delContentType = (data) => {
  return service({
    url: '/editor/contenttype/del',
    method: 'post',
    data
  })
}

/**
 * @Summary 添加内容类型
 * @param {*} data
 * @Router /editor/contenttype/add [post]
 */
export const addContentType = (data) => {
  return service({
    url: '/editor/contenttype/add',
    method: 'post',
    data
  })
}

/**
 * @Summary 上线任务列表
 * @param {*} data
 * @Router /editor/online/list [post]
 */
export const getOnlineList = (data) => {
  return service({
    url: '/editor/online/list',
    method: 'post',
    data
  })
}

/**
 * @Summary 课堂微信群列表
 * @param {*} data
 * @Router /editor/class_weixin/list [post]
 */
export const getClassWXList = (data) => {
  return service({
    url: '/editor/class_weixin/list',
    method: 'post',
    data
  })
}

/**
 * @Summary 添加课堂微信群
 * @param {*} data
 * @Router /editor/class_weixin/add [post]
 */
export const addClassWX = (data) => {
  return service({
    url: '/editor/class_weixin/add',
    method: 'post',
    data
  })
}

/**
 * @Summary 编辑课堂微信群
 * @param {*} data
 * @Router /editor/class_weixin/edit [put]
 */
export const editClassWX = (data) => {
  return service({
    url: '/editor/class_weixin/edit',
    method: 'put',
    data
  })
}

/**
 * @Summary 删除课堂微信群
 * @param {*} data
 * @Router /editor/class_weixin/del [delete]
 */
export const delClassWX = (data) => {
  return service({
    url: '/editor/class_weixin/del',
    method: 'delete',
    data
  })
}

// @Summary 获取发现频道列表
// @Produce  application/json
// @Param none
// @Router /dis/channel/list [get]
export const getDisChannelList = () => {
  return service({
    url: '/dis/channel/list',
    method: 'get'
  })
}

/**
 * @Summary 添加发现频道
 * @param {*} data
 * @Router /dis/channel/add [post]
 */
export const addDisChannel = (data) => {
  return service({
    url: '/dis/channel/add',
    method: 'post',
    data
  })
}

/**
 * @Summary 编辑发现频道
 * @param {*} data
 * @Router /dis/channel/edit [post]
 */
export const editDisChannel = (data) => {
  return service({
    url: '/dis/channel/edit',
    method: 'post',
    data
  })
}

/**
 * @Summary 删除发现频道
 * @param {*} data
 * @Router /dis/channel/del [post]
 */
export const delDisChannel = (data) => {
  return service({
    url: '/dis/channel/del',
    method: 'post',
    data
  })
}

/**
 * @Summary 频道排序
 * @param {*} data
 * @Router /dis/channel/listorder [post]
 */
export const sortDisChannel = (data) => {
  return service({
    url: '/dis/channel/listorder',
    method: 'post',
    data
  })
}

/**
 * @Summary 添加直播
 * @param {*} data
 * @Router /live/add [post]
 */
export const addLive = (data) => {
  return service({
    url: '/live/add',
    method: 'post',
    data
  })
}

/**
 * @Summary 编辑直播
 * @param {*} data
 * @Router /live/edit [post]
 */
export const editLive = (data) => {
  return service({
    url: '/live/edit',
    method: 'post',
    data
  })
}

/**
 * @Summary 上架直播
 * @param {*} data
 * @Router /live/online [post]
 */
export const onlineLive = (data) => {
  return service({
    url: '/live/online',
    method: 'post',
    data
  })
}

/**
 * @Summary 下架直播
 * @param {*} data
 * @Router /live/online [post]
 */
export const offlineLive = (data) => {
  return service({
    url: '/live/offline',
    method: 'post',
    data
  })
}

/**
 * @Summary 删除直播
 * @param {*} data
 * @Router /live/del [post]
 */
export const delLive = (data) => {
  return service({
    url: '/live/del',
    method: 'post',
    data
  })
}

/**
 * @Summary 分享直播海报制作
 * @param {*} data
 * @Router /live/shareinfo [post]
 */
export const sharePosterLive = (data) => {
  return service({
    url: '/live/shareinfo',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

/**
 * @Summary 直播房间列表
 * @param {*} data
 * @Router /live/list [post]
 */
export const getLiveList = (data) => {
  return service({
    url: '/live/list',
    method: 'post',
    data
  })
}

/**
 * @Summary 直播开始上课
 * @param {*} data
 * @Router /live/course/online [post]
 */
export const onlineLiveCourse = (data) => {
  return service({
    url: '/live/course/online',
    method: 'post',
    data
  })
}

/**
 * @Summary 直播开始下课
 * @param {*} data
 * @Router /live/course/offline [post]
 */
export const offlineLiveCourse = (data) => {
  return service({
    url: '/live/course/offline',
    method: 'post',
    data
  })
}

/**
 * @Summary 编辑直播课程
 * @param {*} data
 * @Router /live/course/edit [post]
 */
export const editLiveCourse = (data) => {
  return service({
    url: '/live/course/edit',
    method: 'post',
    data
  })
}

/**
 * @Summary 获取推流地址
 * @param {*} data
 * @Router /live/pushurl [post]
 */
export const getLivePushUrl = (data) => {
  return service({
    url: '/live/pushurl',
    method: 'post',
    data
  })
}

/**
 * @Summary 发送直播间聊天室消息
 * @param {*} data
 * @Router /live/chatroom/sendmsg [post]
 */
export const liveSendMsg = (data) => {
  return service({
    url: '/live/chatroom/sendmsg',
    method: 'post',
    data
  })
}

/**
 * @Summary 获取直播间课程聊天室消息
 * @param {*} data
 * @Router /live/chatroom/comments [post]
 */
export const getChartroomComments = (data) => {
  return service({
    url: '/live/chatroom/comments',
    method: 'post',
    data
  })
}

/**
 * @Summary 添加禁言聊天室成员
 * @param {*} data
 * @Router /live/gagadd [post]
 */
export const addLiveGag = (data) => {
  return service({
    url: '/live/gagadd',
    method: 'post',
    data
  })
}

/**
 * @Summary 移除禁言聊天室成员
 * @param {*} data
 * @Router /live/gagremove [post]
 */
export const removeLiveGag = (data) => {
  return service({
    url: '/live/gagremove',
    method: 'post',
    data
  })
}

/**
 * @Summary 获取马甲用户
 * @param {*} data
 * @Router /live/chatroom/majia [get]
 */
export const getMajiaUsers = (data) => {
  return service({
    url: '/live/chatroom/majia',
    method: 'get',
    data
  })
}

/**
 * @Summary 获取关键词列表
 * @param {*} data
 * @Router /editor/sword/list [post]
 */
export const getSearchWords = (data) => {
  return service({
    url: '/editor/sword/list',
    method: 'post',
    data
  })
}

/**
 * @Summary 添加搜索关键词
 * @param {*} data
 * @Router /editor/sword/add [post]
 */
export const addSearchWord = (data) => {
  return service({
    url: '/editor/sword/add',
    method: 'post',
    data
  })
}

/**
 * @Summary 编辑搜索关键词
 * @param {*} data
 * @Router /editor/sword/edit [post]
 */
export const editSearchWord = (data) => {
  return service({
    url: '/editor/sword/edit',
    method: 'post',
    data
  })
}

/**
 * @Summary 排序搜索关键词
 * @param {*} data
 * @Router /editor/sword/listorder [post]
 */
export const sortSearchWord = (data) => {
  return service({
    url: '/editor/sword/listorder',
    method: 'post',
    data
  })
}

/**
 * @Summary 删除搜索关键词
 * @param {*} data
 * @Router /editor/sword/del [post]
 */
export const delSearchWord = (data) => {
  return service({
    url: '/editor/sword/del',
    method: 'post',
    data
  })
}
