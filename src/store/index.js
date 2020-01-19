import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import { user } from './module/user'
import { router } from './module/router'
import { course } from './module/course'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['user', 'course']
})

export const store = new Vuex.Store({
  modules: {
    user,
    course,
    router
  },
  plugins: [vuexLocal.plugin]
})
