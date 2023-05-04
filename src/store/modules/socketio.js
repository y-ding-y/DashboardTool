import * as Vue from 'vue'
import localforage from 'localforage'

export default {
  namespaced: true,
  state: {
    commondata: [],
    msg: '',
    empnolist: {},
    chat: {},
    newmsg: {},
    totalnewcount: 0,
    curuser: '',
  },
  getters: {
    commondata: (state) => {
      return state.commondata
    },
    msg: (state) => {
      return state.msg
    },
    empnolist: (state) => {
      // let filedata = Array(localforage.getItem('socketempnolist'))
      // Promise.all(filedata).then(value => {
      //     if (value[0] != null) {
      //         state.empnolist = value[0]
      //     }
      // })
      return state.empnolist
    },
    chat: (state) => {
      // let filedata = Array(localforage.getItem('socketchat'))
      // Promise.all(filedata).then(value => {
      //     if (value[0] != null) {
      //         state.chat = value[0]
      //     }
      // })
      return state.chat
    },
    totalnewcount: (state) => {
      return state.totalnewcount
    },
    newmsg: (state) => {
      return state.newmsg
    },
  },
  mutations: {
    SOCKET_update_online_count(state, data) {
      state.msg = data
    },
    SOCKET_welcome(state, data) {
      state.empnolist = data
      for (var key in data) {
        state.newmsg[key] = { newcount: 0 }
      }
      localforage.setItem('socketempnolist', state.empnolist)
    },
    SOCKET_chat(state, data) {
      var temp = []
      var temp_user = ''
      // var temp_count = 0;

      if (data.type == 'my') {
        temp_user = data.toempno
        temp = state.chat[data.toempno]
      } else if (data.type == 'user') {
        temp_user = data.myempno
        temp = state.chat[data.myempno]
        if (state.curuser == '' || state.curuser != data.myempno) {
          state.totalnewcount++
          let tempempno = { ...state.empnolist[data.myempno] }
          if (tempempno.newcount == undefined) tempempno.newcount = 0

          tempempno.newcount++
          state.newmsg[data.myempno].newcount++

          localforage.setItem('sockettotalcount', state.totalnewcount)
          localforage.setItem('socketnewmsg', state.newmsg)
          state.empnolist[data.myempno] = tempempno

          // localforage.setItem('socketempnolist', state.empnolist)
        }
      }
      if (temp == undefined) temp = []
      temp.push(data)
      state.chat[temp_user] = temp
      localforage.setItem('socketchat', state.chat)
    },
    setpersonlcount(state, val) {
      state.curuser = val
      if (val != '') {
        let temp = { ...state.empnolist[val] }
        state.totalnewcount = state.totalnewcount - temp.newcount
        temp.newcount = 0
        state.empnolist[val] = temp
        state.newmsg[val] = { newcount: 0 }
        localforage.setItem('socketnewmsg', state.newmsg)
        localforage.setItem('sockettotalcount', state.totalnewcount)
      }
    },
    setoldchat(state) {
      let filedata = Array(localforage.getItem('socketchat'))
      Promise.all(filedata).then((value) => {
        if (value[0] != null) {
          state.chat = value[0]
        }
      })
    },
    setoldnewcount(state) {
      let filedata = Array(localforage.getItem('sockettotalcount'))
      Promise.all(filedata).then((value) => {
        if (value[0] != null) {
          state.totalnewcount = value[0]
        }
      })
    },
    setoldnewmsg(state) {
      let filedata = Array(localforage.getItem('socketnewmsg'))
      Promise.all(filedata).then((value) => {
        if (value[0] != null) {
          state.newmsg = value[0]
          for (var key in state.empnolist) {
            if (state.empnolist[key].newcount == undefined)
              state.empnolist[key].newcount = 0
            state.empnolist[key].newcount = state.newmsg[key].newcount
          }
        }
      })
    },
    refreshdata(state, val) {
      state.commondata[val.key].tabledata = val.val
    },
  },
  actions: {
    setPublicdata(context) {
      context.commit('setPublicdata', '')
    },
  },
}
