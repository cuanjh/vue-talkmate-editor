import service from '@/utils/request'

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
