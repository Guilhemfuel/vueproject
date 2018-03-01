import axios from 'axios'

const state = {
  data: '',
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
    axios.get('http://www.quizforfun.fr/api/web/api/game/' + data)
      .then(function (response) {
        console.log(...response.data)
        context.commit('mutateIfGameExist', true)
      })
      .catch(function (error) {
        console.log(error.response.data.message)
        data = error.response.data.message
        context.commit('mutateData', data)
      })
  }
}

export default {namespaced: true, state, getters, mutations, actions}
