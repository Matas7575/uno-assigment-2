import { defineStore } from "pinia";
import { ref } from "vue";

export const useUnoStore = defineStore("unoStore", () => {
  const players = ref([]);
  const currentHand = ref([]);
  const gameScore = ref({});
  const turn = ref(0);
  const gameOver = ref(false);

  function setupGame(playerCount) {
    players.value = [
      "Player 1",
      ...Array.from({ length: playerCount }, (_, i) => `Bot ${i + 1}`),
    ];
    gameScore.value = players.value.reduce((acc, player) => {
      acc[player] = 0;
      return acc;
    }, {});
    startNewHand();
  }

  function startNewHand() {
    currentHand.value = [];
    turn.value = 0;
  }

  function playTurn() {
    turn.value = (turn.value + 1) % players.value.length;
    checkForGameOver();
  }

  function checkForGameOver() {
    if (currentHand.value.length === 0) {
      gameOver.value = true;
    }
  }

  return {
    players,
    currentHand,
    gameScore,
    turn,
    gameOver,
    setupGame,
    playTurn,
    startNewHand,
  };
});
