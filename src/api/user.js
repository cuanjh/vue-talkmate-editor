import service from '../utils/request'

// @Summary 用户登录
// @Produce  application/json
// @Param data body {username:"string",password:"string"}
// @Router /base/login [post]
export const login = (data) => {
  return service({
    url: '/base/login',
    method: 'post',
    data: data
  })
}

// @Summary 用户注册
// @Produce  application/json
// @Param data body {username:"string",password:"string"}
// @Router /base/resige [post]
export const regist = (data) => {
  return service({
    url: '/base/regist',
    method: 'post',
    data: data
  })
}

// @Summary 用户重置密码
// @Produce  application/json
// @Param data body {username:"string",password:"string","newPassword": "string"}
// @Router /user/changePassword [post]
export const userChangePwd = (data) => {
  return service({
    url: '/user/changePassword',
    method: 'post',
    data: data
  })
}

// @Summary 删除用户
// @Produce  application/json
// @Param data body {username:"string"}
// @Router user/remove [post]
export const removeUser = (data) => {
  return service({
    url: '/user/remove',
    method: 'post',
    data: data
  })
}

// @Tags User
// @Summary 分页获取用户列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body modelInterface.PageInfo true "分页获取用户列表"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /user/getUserList [post]
export const getUserList = (data) => {
  return service({
    url: '/user/getUserList',
    method: 'post',
    data: data
  })
}

// @Tags User
// @Summary 设置用户权限
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body api.SetUserAuth true "设置用户权限"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"修改成功"}"
// @Router /user/setUserAuthority [post]
export const setUserAuthority = (data) => {
  return service({
    url: '/user/setUserAuthority',
    method: 'post',
    data: data
  })
}
