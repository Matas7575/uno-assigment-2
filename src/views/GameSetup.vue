<template>
  <div id="game-setup">
    <h2>Setup Your Uno Game</h2>

    <label for="bot-count">Number of Bots:</label>
    <select v-model="botCount" id="bot-count">
      <option :value="1">1 Bot</option>
      <option :value="2">2 Bots</option>
      <option :value="3">3 Bots</option>
    </select>

    <button @click="startGame">Start Game</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const botCount = ref(2);
const router = useRouter();

const startGame = () => {
  router.push({
    name: "PlayHand",
    params: { botCount: botCount.value },
  });
};
</script>

<style scoped>
#game-setup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

select {
  padding: 10px;
  font-size: 16px;
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
