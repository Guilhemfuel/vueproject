import Vue from 'vue'
import Router from 'vue-router'
import FormGame from '@/components/FormGame'
import Game from '@/components/Game'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'FormGame', component: FormGame },
    { path: '/:code', name: 'Game', component: Game }
  ]
})
