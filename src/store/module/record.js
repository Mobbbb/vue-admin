import store from "..";

export default {
    state: {
        uuid: "",
    },
    mutations: {
        ONADDUUID(state, val) {
            state.uuid = val
        },
        ONDELUUID(state) {
            state.uuid = ''
        }
    },
    actions: {
        handleAddUuid(state, val) {
            console.log(val)
            store.commit('ONADDUUID', val)
        },
        handleDelUuid() {
            store.commit('ONDELUUID')
        }
    }
}
