<template>
  <div id="game-over">
    <h2>Game Over!</h2>
    <h3>Winner: {{ winner }}</h3>
    <button @click="restartGame">Play Again</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const winner = ref(route.params.winner);

const restartGame = () => {
  router.push({ name: "GameSetup" });
};
</script>

<style scoped>
#game-over {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
