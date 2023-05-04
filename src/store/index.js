import * as Vue from 'vue'
import * as Vuex from 'vuex'
import modules from './modules'

const store = Vuex.createStore({ modules })

export default store
