<template>
  <div class="play-area" v-if="isGameReady">
    <!-- Game Status Bar -->
    <div class="status-bar">
      <div class="direction-indicator">
        <RotateCcw :class="{ 'reverse': store.direction === -1 }" class="direction-icon" />
      </div>
      <div class="current-color" :style="{ backgroundColor: store.currentColor?.toLowerCase() }">
        Current Color
      </div>
      <div class="turn-indicator">
        {{ isPlayerTurn ? "Your Turn" : `${currentPlayerName}'s Turn` }}
      </div>
    </div>

    <!-- Game Info -->
    <div class="game-info">
      <div class="hand-info">
        Hand {{ store.gameState.handNumber }}
      </div>
      <div class="scores">
        <div v-for="player in store.players" :key="player.id" class="player-score">
          {{ player.name }}: {{ store.gameState.totalScores[player.id] || 0 }}
        </div>
      </div>
    </div>

    <!-- Draw Cards Message -->
    <div v-if="store.isPlayerTurn && store.mustDrawCards > 0" class="draw-cards-message">
      You must draw {{ store.mustDrawCards }} cards!
      <button @click="handleDrawCard" class="draw-button">
        Draw Cards
      </button>
    </div>

    <!-- Opponent Hands -->
    <div class="opponents">
      <TransitionGroup name="card">
        <div v-for="player in otherPlayers" :key="player.id" class="opponent">
          <div class="opponent-cards">
            <div v-for="(_, index) in player.hand" :key="`${player.id}-${index}`" class="opponent-card-back" />
          </div>
          <div class="player-info">
            <span class="player-name">{{ player.name }}</span>
            <span class="card-count">Cards: {{ player.hand.length }}</span>
            <span v-if="player.hand.length === 1" class="uno-warning">UNO!</span>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Center Play Area -->
    <div class="center-area">
      <!-- Draw Pile -->
      <div class="draw-pile" @click="handleDrawCard" v-if="isPlayerTurn">
        <div class="card-back">
          <span class="cards-remaining">{{ deckCount }}</span>
        </div>
      </div>

      <!-- Discard Pile -->
      <div class="discard-pile">
        <UnoCard v-if="topCard" :key="topCard.id" :card="topCard"
          :show-chosen-color="topCard.type === 'wild' || topCard.type === 'wild_draw_four'" class="top-card" />
      </div>
    </div>

    <!-- Player's Hand -->
    <div class="player-hand">
      <div class="cards-container">
        <TransitionGroup name="card">
          <UnoCard v-for="card in currentPlayerHand" :key="card.id" :card="card"
            :is-playable="isPlayerTurn && canPlayCard(card)" @card-click="handleCardPlay" />
        </TransitionGroup>
      </div>
    </div>

    <!-- UNO Buttons -->
    <button v-if="currentPlayerHand.length === 2 && !store.unoState.unoCalled" class="uno-button" @click="callUno">
      UNO!
    </button>

    <button v-if="canChallenge" class="challenge-button" @click="challengeLastPlay">
      Challenge UNO!
    </button>

    <!-- Color Picker Dialog -->
    <Dialog :open="showColorPicker" @update:open="showColorPicker = $event">
      <template #header>
        <h3 class="text-lg font-semibold">Choose a Color</h3>
      </template>
      <div class="color-options">
        <button v-for="color in CARD_COLORS" :key="color" class="color-option"
          :style="{ backgroundColor: color.toLowerCase() }" @click="selectWildColor(color)" />
      </div>
    </Dialog>

    <!-- Hand Results Dialog -->
    <HandResultsDialog v-model="showHandResults" @next-hand="handleNextHand" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { RotateCcw } from 'lucide-vue-next';
import { useUnoStore } from '@/store/unoStore';
import { CARD_COLORS, type Card, type CardColor } from '@/types/card';
import UnoCard from '@/components/UnoCard.vue';
import Dialog from '@/components/ui/Dialog.vue';
import HandResultsDialog from '@/components/HandResultsDialog.vue';
import { useRouter } from 'vue-router';

const store = useUnoStore();
const showColorPicker = ref(false);
const pendingWildCard = ref<Card | null>(null);
const router = useRouter();
const showHandResults = ref(false);

// Game state checks
const isGameReady = computed(() => {
  return store.players &&
    store.players.length > 0 &&
    store.players[0]?.hand !== undefined;
});

// Computed properties with safety checks
const currentPlayerHand = computed(() => store.players[0]?.hand ?? []);
const otherPlayers = computed(() => store.players?.slice(1) ?? []);
const currentPlayerName = computed(() => store.players[store.currentPlayer]?.name ?? '');
const isPlayerTurn = computed(() => store.currentPlayer === 0);
const deckCount = computed(() => store.deck?.length ?? 0);
const topCard = computed(() => store.topCard);

// Single watcher for handling end of hand
watch(
  () => store.winner,
  (newWinner) => {
    if (newWinner) {
      const isGameOver = store.endHand();
      showHandResults.value = true;
    }
  }
);


// Methods
const canPlayCard = (card: Card) => {
  return store.canPlayCard(card);
};

const handleCardPlay = (card: Card) => {
  if (!isPlayerTurn.value || !canPlayCard(card)) return;

  if (card.type === 'wild' || card.type === 'wild_draw_four') {
    pendingWildCard.value = card;
    showColorPicker.value = true;
    return;
  }

  playCard(card);
};

const playCard = (card: Card) => {
  const handIndex = currentPlayerHand.value.findIndex(c => c.id === card.id);
  if (handIndex === -1) return;
  store.playCard(handIndex);
};

const selectWildColor = (color: CardColor) => {
  if (!pendingWildCard.value) return;

  const handIndex = currentPlayerHand.value.findIndex(
    c => c.id === pendingWildCard.value!.id
  );

  if (handIndex === -1) return;

  store.playCard(handIndex, color);
  showColorPicker.value = false;
  pendingWildCard.value = null;
};

const handleDrawCard = () => {
  if (!isPlayerTurn.value) return;
  store.drawCards(store.mustDrawCards || 1);
};

const canChallenge = computed(() => {
  return store.isPlayerTurn &&
    !store.unoState.unoCalled &&
    otherPlayers.value.some(p => p.hand.length === 1);
});

function callUno() {
  store.callUno('0'); // player's ID
}

function challengeLastPlay() {
  const targetPlayer = otherPlayers.value.find(p => p.hand.length === 1);
  if (targetPlayer) {
    store.challengeUno('0', targetPlayer.id);
  }
}

function handleNextHand() {
  showHandResults.value = false;
  if (store.gameState.totalScores[store.winner] >= store.gameState.targetScore) {
    router.push({ name: 'GameOver' });
  } else {
    store.setupGame(store.players.length - 1); // Reset for next hand
  }
}
</script>

<style scoped>
.play-area {
  min-height: 100vh;
  background-color: #1a936f;
  padding: 1rem;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.direction-icon {
  transition: transform 300ms;
}

.direction-icon.reverse {
  transform: scaleX(-1);
}

.center-area {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
}

.opponents {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
}

.opponent {
  text-align: center;
}

.opponent-cards {
  display: flex;
  gap: 0.25rem;
}

.opponent-card-back {
  width: 2rem;
  height: 3rem;
  background-color: #1e293b;
  border-radius: 0.25rem;
  transform: rotate(-90deg);
}

.player-hand {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.cards-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.draw-pile {
  cursor: pointer;
}

.card-back {
  width: 8rem;
  height: 12rem;
  background-color: #1e293b;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.cards-remaining {
  font-size: 1.5rem;
  font-weight: bold;
}

.uno-warning {
  color: #ef4444;
  font-weight: bold;
  animation: pulse 1s infinite;
}

.color-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem;
}

.color-option {
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: transform 200ms;
}

.color-option:hover {
  transform: scale(1.1);
}

/* Card Transitions */
.card-move,
.card-enter-active,
.card-leave-active {
  transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translateY(2rem);
}

.card-leave-active {
  position: absolute;
}

.draw-cards-message {
  background-color: rgba(255, 255, 255, 0.9);
  color: #ef4444;
  padding: 1rem;
  margin: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.draw-button {
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 200ms;
}

.draw-button:hover {
  background-color: #dc2626;
}

.game-info {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  margin: 1rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hand-info {
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
}

.scores {
  display: flex;
  gap: 2rem;
}

.player-score {
  color: white;
  font-weight: bold;
}

.uno-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  background-color: #ef4444;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transform: rotate(-10deg);
  transition: all 200ms;
  z-index: 50;
}

.uno-button:hover {
  transform: rotate(-10deg) scale(1.1);
  background-color: #dc2626;
}

.challenge-button {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  padding: 1rem 2rem;
  background-color: #eab308;
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 200ms;
  z-index: 50;
}

.challenge-button:hover {
  background-color: #ca8a04;
  transform: scale(1.05);
}

@keyframes pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}
</style>