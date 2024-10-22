import { createRouter, createWebHistory } from "vue-router";
import GameSetup from "../views/GameSetup.vue";
import PlayHand from "../views/PlayHand.vue";
import GameOver from "../views/GameOver.vue";

const routes = [
  { path: "/", name: "GameSetup", component: GameSetup },
  { path: "/play-hand", name: "PlayHand", component: PlayHand, props: true },
  { path: "/game-over", name: "GameOver", component: GameOver, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
