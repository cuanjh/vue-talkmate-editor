export const asyncRouterHandle = (asyncRouter) => {
  asyncRouter.map(item => {
    if (item.component) {
      item.component = require('@/' + item.component.replace(/(^\s*)|(\s*$)/g, '')).default
    } else {
      delete item['component']
    }
    if (item.children) {
      asyncRouterHandle(item.children)
    }
  })
}
