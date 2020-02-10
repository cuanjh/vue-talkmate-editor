import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { store } from './store'
import '@/permission'
import Bus from '@/bus'
import { formatDate } from '@/utils/formatDate'

// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入video.js
// import Videojs from 'video.js'
// import 'video.js/dist/video-js.css'
// Vue.prototype.$video = Videojs

Vue.use(ElementUI)
Vue.use(Bus)
Vue.filter('formatDate', formatDate)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
