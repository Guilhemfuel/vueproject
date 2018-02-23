const state = {
  data: 'coucou',
  ifGameExist: false
}

const getters = {
  getData: function (state) { return state.data },
  getIfGameExist: function (state) { return state.ifGameExist }
}

const mutations = {
  mutateData: (state, data) => {
    state.data = data
  },
  mutateIfGameExist: (state, data) => {
    state.ifGameExist = data
  }
}

const actions = {
  setData (context, data) {
    console.log(data)
    if (data.length !== 4) {
      data = 'erreur'
    } else {
      context.commit('mutateIfGameExist', true)
    }
    context.commit('mutateData', data)
  }
}

export default {namespaced: true, state, getters, mutations, actions}
