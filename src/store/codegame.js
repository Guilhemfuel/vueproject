const state = {
  data: 'coucou'
}

const getters = {
  getData: function (state) { return state.data }
}

const mutations = {
  mutateData: (state, data) => {
    state.data = data
  }
}

const actions = {
  setData (context, data) {
    console.log(data)
    context.commit('mutateData', data)
  }
}

export default {namespaced: true, state, getters, mutations, actions}
