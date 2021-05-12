
import service from '@/utils/request'
/**
 * @Summary 添加学习方法
 * @param {*} data
 * @Router /editor/kind_resources/create [post]
 */
export const createKindResources = (data) => {
  return service({
    url: '/editor/kind_resources/create',
    method: 'post',
    data
  })
}

/**
 * @Summary 学习方法列表
 * @param {*} data
 * @Router /editor/kind_resources/list [post]
 */
export const listKindResources = (data) => {
  return service({
    url: '/editor/kind_resources/list',
    method: 'post',
    data
  })
}

/**
 * @Summary 更新学习方法
 * @param {*} data
 * @Router /editor/kind_resources/update [post]
 */
export const updateKindResources = (data) => {
  return service({
    url: '/editor/kind_resources/update',
    method: 'post',
    data
  })
}

/**
 * @Summary 删除学习方法
 * @param {*} data
 * @Router /editor/kind_resources/delete [post]
 */
export const delKindResources = (data) => {
  return service({
    url: '/editor/kind_resources/delete',
    method: 'post',
    data
  })
}
