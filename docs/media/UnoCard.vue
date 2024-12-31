<template>
  <div class="uno-card" :class="[
    `card-${card.color?.toLowerCase() || 'wild'}`,
    { 'is-playable': isPlayable }
  ]" @click="handleClick">
    <div class="card-inner">
      <div class="card-symbol">
        <template v-if="card.type === 'number'">
          {{ card.value }}
        </template>
        <template v-else>
          <component :is="cardSymbol" :size="32" />
        </template>
      </div>

      <!-- Add chosen color indicator for wild cards -->
      <div v-if="isWild && showChosenColor" class="chosen-color">
        <div class="color-indicator" :style="{ backgroundColor: store.currentColor?.toLowerCase() }"></div>
        <div class="color-text-container">
          <span class="color-text">{{ store.currentColor }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Card } from '../types/card';
import { useUnoStore } from '@/store/unoStore';
import {
  XCircle,      // for skip
  RotateCcw,    // for reverse
  Plus,         // for draw cards
  Asterisk      // for wild
} from 'lucide-vue-next';

/**
 * Props for the UnoCard component.
 * 
 * @interface UnoCardProps
 * @property {Card} card - The card object containing its properties.
 * @property {boolean} [isPlayable] - Indicates if the card is playable.
 * @property {boolean} [showChosenColor] - Indicates if the chosen color should be shown for wild cards.
 */
const props = defineProps<{
  card: Card;
  isPlayable?: boolean;
  showChosenColor?: boolean;
}>();

const store = useUnoStore();

/**
 * Emits events for the UnoCard component.
 * 
 * @interface UnoCardEmits
 * @property {Function} cardClick - Event emitted when the card is clicked.
 */
const emit = defineEmits<{
  (e: 'cardClick', card: Card): void;
}>();

/**
 * Computed property to check if the card is a wild card.
 * 
 * @returns {boolean} True if the card is a wild card, false otherwise.
 */
const isWild = computed(() =>
  props.card.type === 'wild' || props.card.type === 'wild_draw_four'
);

/**
 * Computed property to get the symbol component for the card.
 * 
 * @returns {Component | null} The symbol component for the card, or null if the card type is not recognized.
 */
const cardSymbol = computed(() => {
  switch (props.card.type) {
    case 'skip':
      return XCircle;
    case 'reverse':
      return RotateCcw;
    case 'draw_two':
    case 'wild_draw_four':
      return Plus;
    case 'wild':
      return Asterisk;
    default:
      return null;
  }
});

/**
 * Handles the click event on the card.
 * Emits the 'cardClick' event with the card object.
 */
const handleClick = () => {
  emit('cardClick', props.card);
};
</script>

<style scoped>
.uno-card {
  width: 120px;
  height: 180px;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  perspective: 1000px;
  transition: transform 0.2s;
}

.uno-card:hover {
  transform: translateY(-10px);
}

.card-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background: white;
}

.card-symbol {
  font-size: 2.5rem;
  font-weight: bold;
}

.card-red {
  background: linear-gradient(135deg, #ff5555, #ff0000);
}

.card-blue {
  background: linear-gradient(135deg, #5555ff, #0000ff);
}

.card-green {
  background: linear-gradient(135deg, #55ff55, #00ff00);
}

.card-yellow {
  background: linear-gradient(135deg, #ffff55, #ffff00);
}

.card-wild {
  background: linear-gradient(135deg, #ff5555, #5555ff, #55ff55, #ffff55);
}

.is-playable {
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.is-playable:hover {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
}

.chosen-color {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.color-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

.color-text-container {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 2px 8px;
  border-radius: 12px;
}

.color-text {
  font-size: 0.875rem;
  color: white;
  font-weight: bold;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background: white;
}
</style>