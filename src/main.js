import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { store } from './store'
import '@/permission'
import Bus from '@/bus'
import { formatDate } from '@/utils/formatDate'
import { urlfix } from '@/utils/filter'

import AudioRecorder from '@/components/common/record'

// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'

// 引入video.js
// import Videojs from 'video.js'
// import 'video.js/dist/video-js.css'

import VueIntro from 'vue-introjs'
import 'intro.js/introjs.css'
Vue.use(VueIntro)

Vue.use(ElementUI)

Vue.use(AudioRecorder)

Vue.use(Bus)
Vue.filter('formatDate', formatDate)
Vue.filter('urlFix', urlfix)

Vue.config.productionTip = false
Vue.prototype.$http = axios
// Vue.prototype.$video = Videojs

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
