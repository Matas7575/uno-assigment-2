import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import GameSetup from '../views/GameSetup.vue'
import PlayHand from '../views/PlayHand.vue'
import GameOver from '../views/GameOver.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'GameSetup',
    component: GameSetup
  },
  {
    path: '/play-hand',
    name: 'PlayHand',
    component: PlayHand
  },
  {
    path: '/game-over',
    name: 'GameOver',
    component: GameOver
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router