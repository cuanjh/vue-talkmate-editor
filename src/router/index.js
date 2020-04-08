import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
VueRouter.prototype.push = push

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/auth/login.vue')
  },
  {
    path: '/resetPwd',
    name: 'resetPwd',
    component: () => import(/* webpackChunkName: "resetPwd" */ '../views/auth/resetPwd.vue')
  },
  // {
  //   path: '/layout',
  //   redirect: 'layout/dashbord',
  //   name: 'layout',
  //   component: () => import(/* webpackChunkName: "layout" */ '../views/layout/index.vue'),
  //   children: [
  //     {
  //       path: 'dashbord',
  //       name: 'dashbord',
  //       component: () => import(/* webpackChunkName: "dashbord" */ '../views/dashbord/index.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/layout',
  //   redirect: 'layout/version/pro',
  //   name: 'layout',
  //   component: () => import(/* webpackChunkName: "layout" */ '../views/layout/index.vue'),
  //   children: [
  //     {
  //       path: 'version/:project',
  //       name: 'version',
  //       component: () => import(/* webpackChunkName: "version" */ '../views/course/version/version.vue')
  //     },
  //     {
  //       path: 'level/:id',
  //       name: 'level',
  //       component: () => import(/* webpackChunkName: "level" */ '../views/course/level/level.vue')
  //     },
  //     {
  //       path: 'chapter/:id',
  //       name: 'chapter',
  //       component: () => import(/* webpackChunkName: "chapter" */ '../views/course/chapter/chapter.vue')
  //     },
  //     {
  //       path: 'part/:id',
  //       name: 'part',
  //       component: () => import(/* webpackChunkName: "part" */ '../views/course/part/part.vue')
  //     },
  //     {
  //       path: 'edit-project',
  //       name: 'editProject',
  //       component: () => import(/* webpackChunkName: "editProject" */ '../views/editProject/editor.vue')
  //     }
  //   ]
  // },
  {
    path: '/course-content',
    name: 'courseContent',
    component: () => import(/* webpackChunkName: "course-content" */ '../views/course/content/content.vue')
  },
  // {
  //   path: '/lang',
  //   redirect: 'lang/lang-courses',
  //   name: 'lang',
  //   component: () => import(/* webpackChunkName: "lang" */ '../views/languages/index.vue'),
  //   children: [
  //     {
  //       path: 'lang-courses',
  //       name: 'langCourses',
  //       component: () => import(/* webpackChunkName: "langs" */ '../views/languages/langCourses.vue')
  //     },
  //     {
  //       path: 'lang-setting',
  //       name: 'langSetting',
  //       component: () => import(/* webpackChunkName: "langSetting" */ '../views/languages/langSetting.vue')
  //     }
  //   ]
  // },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../views/error/index.vue')
  }
]

const createRouter = () => new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

const router = createRouter()

export default router
