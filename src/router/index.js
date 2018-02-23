import Vue from 'vue'
import Router from 'vue-router'
import FormGame from '@/components/FormGame'
import FormPlayer from '@/components/FormPlayer'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'FormGame', component: FormGame },
    { path: '/Player', name: 'FormPlayer', component: FormPlayer }
  ]
})
