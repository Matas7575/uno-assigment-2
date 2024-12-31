import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import GameSetup from '../views/GameSetup.vue'
import PlayHand from '../views/PlayHand.vue'
import GameOver from '../views/GameOver.vue'

/**
 * Array of route records for the application.
 * 
 * @type {Array<RouteRecordRaw>}
 * @property {string} path - The URL path of the route.
 * @property {string} name - The name of the route.
 * @property {Component} component - The component to render for the route.
 */
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

/**
 * Creates a router instance.
 * 
 * @returns {Router} The router instance.
 */
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router