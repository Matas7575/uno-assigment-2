<template>
  <div class="min-h-screen bg-emerald-700 flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
      <h2 class="text-3xl font-bold text-center mb-8 text-emerald-800">
        Setup Your UNO Game
      </h2>

      <div class="space-y-6">
        <div class="space-y-2">
          <label for="bot-count" class="block text-lg font-medium text-gray-700">
            Number of Bot Players:
          </label>
          <select v-model="botCount" id="bot-count" class="w-full p-3 border border-gray-300 rounded-lg">
            <option v-for="count in [1, 2, 3]" :key="count" :value="count">
              {{ count }} {{ count === 1 ? 'Bot' : 'Bots' }}
            </option>
          </select>
        </div>

        <button @click="startGame" class="w-full py-3 px-6 text-lg font-semibold text-white 
                 bg-emerald-600 rounded-lg hover:bg-emerald-500">
          Start Game
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUnoStore } from '../store/unoStore';

const router = useRouter();
const store = useUnoStore();
const botCount = ref(2);

const startGame = () => {
  store.setupGame(botCount.value);
  router.push({ name: 'PlayHand' });
};
</script>