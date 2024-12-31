<template>
  <div class="min-h-screen bg-emerald-700 flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 text-center">
      <h2 class="text-4xl font-bold mb-6 text-emerald-800">
        Game Over!
      </h2>

      <div class="my-8 p-6 bg-emerald-50 rounded-lg">
        <h3 class="text-2xl font-bold text-emerald-600">
          Winner: {{ winner }}
        </h3>
      </div>

      <div class="space-y-4">
        <button @click="playAgain" class="w-full py-3 px-6 text-lg font-semibold text-white 
                 bg-emerald-600 rounded-lg hover:bg-emerald-500">
          Play Again
        </button>

        <button @click="backToSetup" class="w-full py-3 px-6 text-lg font-semibold text-emerald-600 
                 bg-white border-2 border-emerald-600 rounded-lg
                 hover:bg-emerald-50">
          Back to Setup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUnoStore } from '../store/unoStore';

const router = useRouter();
const store = useUnoStore();
const winner = computed(() => store.winner);

/**
 * Function to start a new game.
 * Sets up the game with the same number of bots and navigates to the PlayHand view.
 */
const playAgain = () => {
  store.setupGame(store.players.length - 1); // Subtract 1 to exclude human player
  router.push({ name: 'PlayHand' });
};

/**
 * Function to navigate back to the game setup view.
 */
const backToSetup = () => {
  router.push({ name: 'GameSetup' });
};
</script>

<style scoped>
/* Styles for the GameOver component */
.min-h-screen {
  min-height: 100vh;
}

.bg-emerald-700 {
  background-color: #047857;
}

.bg-emerald-600 {
  background-color: #059669;
}

.bg-emerald-50 {
  background-color: #ECFDF5;
}

.text-emerald-800 {
  color: #065F46;
}

.text-emerald-600 {
  color: #059669;
}

.hover\:bg-emerald-500:hover {
  background-color: #10B981;
}

.hover\:bg-emerald-50:hover {
  background-color: #D1FAE5;
}
</style>