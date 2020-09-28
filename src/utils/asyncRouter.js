export const asyncRouterHandle = (asyncRouter) => {
  asyncRouter.map(item => {
    if (item.component) {
      try {
        item.component = require('@/' + item.component.replace(/(^\s*)|(\s*$)/g, '')).default
      } catch (error) {
        delete item['component']
      }
    } else {
      delete item['component']
    }
    if (item.children) {
      asyncRouterHandle(item.children)
    }
  })
}
