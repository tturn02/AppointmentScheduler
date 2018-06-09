import Vue from 'vue'
import Vuex from 'vuex'

import { slotGetters } from './getters'
import { slotMutations } from './mutation'
import { slotActions } from './actions'
Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    slots: []
  },
  mutations: Object.assign({}, slotMutations),
  getters: Object.assign({}, slotGetters),
  actions: Object.assign({}, slotActions)
})
