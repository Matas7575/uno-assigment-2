<template>
    <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)" :closeable="false">
        <template #header>
            <h2 class="title">Hand {{ store.gameState.handNumber }} Complete!</h2>
        </template>

        <div class="hand-results">
            <div class="winner-section">
                <h3>Winner: {{ store.winner }}</h3>
                <p class="points">+{{ currentHandScore }} points</p>
            </div>

            <div class="scores-section">
                <h3>Current Scores:</h3>
                <div v-for="player in store.players" :key="player.id" class="player-score">
                    {{ player.name }}: {{ store.gameState.totalScores[player.id] || 0 }}
                </div>
            </div>

            <button class="next-hand-button" @click="startNextHand">
                {{ hasGameWinner ? 'View Final Results' : 'Start Next Hand' }}
            </button>
        </div>
    </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUnoStore } from '@/store/unoStore';
import Dialog from '@/components/ui/Dialog.vue';

/**
 * Props for the HandResultsDialog component.
 * 
 * @interface HandResultsDialogProps
 * @property {boolean} modelValue - Indicates if the dialog is open.
 */
const props = defineProps<{
    modelValue: boolean;
}>();

/**
 * Emits events for the HandResultsDialog component.
 * 
 * @interface HandResultsDialogEmits
 * @property {Function} update:modelValue - Event emitted when the dialog's open state is updated.
 * @property {Function} next-hand - Event emitted to start the next hand.
 */
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'next-hand'): void;
}>();

const store = useUnoStore();

/**
 * Computed property to get the current hand score of the winner.
 * 
 * @returns {number} The current hand score of the winner.
 */
const currentHandScore = computed(() =>
    store.gameState.currentHandScores[store.winner] || 0
);

/**
 * Computed property to check if there is a game winner.
 * 
 * @returns {boolean} True if there is a game winner, false otherwise.
 */
const hasGameWinner = computed(() => {
    const winnerScore = store.gameState.totalScores[store.winner] || 0;
    return winnerScore >= store.gameState.targetScore;
});

/**
 * Function to start the next hand.
 * Emits the 'update:modelValue' and 'next-hand' events.
 */
function startNextHand() {
    emit('update:modelValue', false);
    emit('next-hand');
}
</script>

<style scoped>
.hand-results {
    text-align: center;
}

.title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #1a936f;
}

.winner-section {
    margin: 1.5rem 0;
}

.winner-section h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}

.points {
    font-size: 2rem;
    font-weight: bold;
    color: #1a936f;
}

.scores-section {
    margin-bottom: 1.5rem;
}

.scores-section h3 {
    margin-bottom: 1rem;
}

.player-score {
    font-size: 1.125rem;
    margin: 0.5rem 0;
}

.next-hand-button {
    background-color: #1a936f;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: bold;
    border: none;
    cursor: pointer;
    transition: background-color 200ms;
}

.next-hand-button:hover {
    background-color: #147a5b;
}
</style>