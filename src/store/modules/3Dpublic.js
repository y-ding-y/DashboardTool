import baseService from '@/services/base'

export default {
    namespaced: true,
    state: {
        commondata: [],
        curmodel: '',
    },
    getters: {
        commondata: (state) => {
            return state.commondata
        },
        curmodel: (state) => {
            return state.curmodel
        },
    },
    mutations: {
        setPublicdata(state, val) {
            state.commondata = val
        },
        refreshdata(state, val) {
            var temp = state.commondata[val.key]
            temp.tabledata = val.val
            state.commondata.splice(val.key, 1, temp)
            //   state.commondata[val.key].tabledata = val.val
        },

        setCurmodel(state, val) {
            if (val[0].userData.binddata != undefined) {
                state.curmodel =
                    val[0].userData.binddata.equipkey == undefined
                        ? ''
                        : val[0].userData.binddata.equipkey
            } else {
                state.curmodel = ''
            }
        },
    },
    actions: {
        setPublicdata(context, param) {
            baseService
                .reqPost('PARA_SET', { paras: [{ key: 'PARA.' + param }] })
                .then((res) => {
                    res.data[0].data.map((e) => {
                        let temp = eval('(' + e.note + ')')
                        if (e.note != null)
                            baseService.reqPost(temp.api, temp.params).then((res2) => {
                                e.tabledata = res2.data
                                e.column = [
                                    {
                                        dataIndex: 'no',
                                        key: 'no',
                                        title: 'NO',
                                        width: 80,
                                        scopedSlots: { customRender: 'no' },
                                    },
                                ]
                                for (var key in res2.data[0]) {
                                    e.column.push({
                                        dataIndex: key,
                                        key: key,
                                        title: key,
                                        width: 100,
                                        scopedSlots: { customRender: key },
                                    })
                                }
                                context.commit('setPublicdata', res.data[0].data)
                            })
                    })
                })
        },
        refreshdata(context, param) {
            var key = param.key
            let temp = eval('(' + context.state.commondata[key].note + ')')
            baseService.reqPost(temp.api, temp.params).then((res) => {
                context.commit('refreshdata', { key: key, val: res.data })
            })
        },
    },
}
