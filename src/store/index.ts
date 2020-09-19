import Vue from "vue"
import Vuex, { GetterTree, ActionTree, MutationTree, Action } from "vuex"

Vue.use(Vuex)

const state = () => ({})

const getters: GetterTree<AppState, AppState> = {}

const actions: ActionTree<AppState, AppState> = {}

const mutations: MutationTree<AppState> = {}

const modules = {}

export type AppState = ReturnType<typeof state>

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules,
})
