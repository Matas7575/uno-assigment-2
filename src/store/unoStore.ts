// src/store/unoStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Card, CardColor, Player, CardType, GameState } from '@/types/card';
import { CARD_TYPES, CARD_COLORS, CARD_SCORES } from '@/types/card';
import { v4 as uuidv4 } from 'uuid';

/**
 * Store for managing the state of the Uno game.
 * 
 * @module UnoStore
 */
export const useUnoStore = defineStore('unoStore', () => {
  // State
  const players = ref<Player[]>([]);
  const deck = ref<Card[]>([]);
  const discardPile = ref<Card[]>([]);
  const currentPlayer = ref(0);
  const direction = ref(1); // 1 for clockwise, -1 for counter-clockwise
  const currentColor = ref<CardColor>(null);
  const mustDrawCards = ref(0);
  const winner = ref<string>('');

  const gameState = ref<GameState>({
    currentHandScores: {},
    totalScores: {},
    targetScore: 500,
    handNumber: 1
  });
  const unoState = ref<{
    lastUnoCall: string | null;
    unoCalled: boolean;
    unoCallRequired: boolean;
  }>({
    lastUnoCall: null,
    unoCalled: false,
    unoCallRequired: false
  });

  // Computed
  const topCard = computed(() => discardPile.value[discardPile.value.length - 1] || null);
  const isPlayerTurn = computed(() => currentPlayer.value === 0);

  /**
   * Creates a new card.
   * 
   * @param {CardColor} color - The color of the card.
   * @param {CardType} type - The type of the card.
   * @param {number} [value] - The value of the card (for number cards).
   * @returns {Card} The created card.
   */
  function createCard(color: CardColor, type: CardType, value?: number): Card {
    return {
      id: uuidv4(),
      color,
      type,
      value
    };
  }

  /**
   * Generates a full deck of Uno cards.
   * 
   * @returns {Card[]} The generated deck of cards.
   */
  function generateDeck(): Card[] {
    const deck: Card[] = [];

    // Add number cards (0-9)
    CARD_COLORS.forEach(color => {
      // One 0 card per color
      deck.push(createCard(color, CARD_TYPES.NUMBER, 0));

      // Two of each 1-9 card per color
      for (let i = 1; i <= 9; i++) {
        deck.push(createCard(color, CARD_TYPES.NUMBER, i));
        deck.push(createCard(color, CARD_TYPES.NUMBER, i));
      }

      // Action cards (two of each per color)
      for (let i = 0; i < 2; i++) {
        deck.push(createCard(color, CARD_TYPES.SKIP));
        deck.push(createCard(color, CARD_TYPES.REVERSE));
        deck.push(createCard(color, CARD_TYPES.DRAW_TWO));
      }
    });

    // Add wild cards
    for (let i = 0; i < 4; i++) {
      deck.push(createCard(null, CARD_TYPES.WILD));
      deck.push(createCard(null, CARD_TYPES.WILD_DRAW_FOUR));
    }

    return shuffleDeck(deck);
  }

  /**
   * Shuffles a deck of cards.
   * 
   * @param {Card[]} deck - The deck of cards to shuffle.
   * @returns {Card[]} The shuffled deck of cards.
   */
  function shuffleDeck(deck: Card[]): Card[] {
    return [...deck].sort(() => Math.random() - 0.5);
  }

  /**
   * Sets up the game with the specified number of bots.
   * 
   * @param {number} botCount - The number of bots to include in the game.
   */
  function setupGame(botCount: number) {
    // Initialize deck
    deck.value = generateDeck();

    // Setup players
    players.value = [
      { id: '0', name: 'Player 1', hand: [], isBot: false },
      ...Array.from({ length: botCount }, (_, i) => ({
        id: String(i + 1),
        name: `Bot ${i + 1}`,
        hand: [],
        isBot: true
      }))
    ];

    // Deal initial hands
    players.value.forEach(player => {
      player.hand = deck.value.splice(0, 7);
    });

    // Start discard pile
    let firstCard = deck.value.pop()!;
    while (firstCard.type !== CARD_TYPES.NUMBER) {
      deck.value.unshift(firstCard);
      firstCard = deck.value.pop()!;
    }
    discardPile.value = [firstCard];
    currentColor.value = firstCard.color;

    // Reset game state
    currentPlayer.value = 0;
    direction.value = 1;
    mustDrawCards.value = 0;
    winner.value = '';
  }

  /**
   * Determines if a card can be played.
   * 
   * @param {Card} card - The card to check.
   * @returns {boolean} True if the card can be played, false otherwise.
   */
  function canPlayCard(card: Card): boolean {
    // Safety check for topCard
    if (!topCard.value) {
      return true; // First card of the game
    }

    // If there are cards to draw, only allow playing draw cards
    if (mustDrawCards.value > 0) {
      if (topCard.value.type === CARD_TYPES.DRAW_TWO) {
        return card.type === CARD_TYPES.DRAW_TWO;
      }
      if (topCard.value.type === CARD_TYPES.WILD_DRAW_FOUR) {
        return card.type === CARD_TYPES.WILD_DRAW_FOUR;
      }
      return false;
    }

    if (card.type === CARD_TYPES.WILD || card.type === CARD_TYPES.WILD_DRAW_FOUR) {
      // For Wild Draw Four, check if player has no matching colors
      if (card.type === CARD_TYPES.WILD_DRAW_FOUR) {
        const hand = players.value[currentPlayer.value].hand;
        return !hand.some(c => c.color === currentColor.value);
      }
      return true;
    }

    if (card.color === currentColor.value) {
      return true;
    }

    if (card.type === CARD_TYPES.NUMBER && topCard.value.type === CARD_TYPES.NUMBER) {
      return card.value === topCard.value.value;
    }

    return card.type === topCard.value.type;
  }

  /**
   * Plays a card from the current player's hand.
   * 
   * @param {number} cardIndex - The index of the card in the player's hand.
   * @param {CardColor} [selectedColor] - The selected color for wild cards.
   */
  function playCard(cardIndex: number, selectedColor?: CardColor) {
    const player = players.value[currentPlayer.value];
    if (!player) return;

    const card = player.hand[cardIndex];
    if (!card) return;

    if (!canPlayCard(card)) {
      throw new Error('Invalid card play');
    }

    // Remove card from hand
    player.hand.splice(cardIndex, 1);
    discardPile.value.push(card);

    // Update current color for non-wild cards
    if (card.type !== CARD_TYPES.WILD && card.type !== CARD_TYPES.WILD_DRAW_FOUR) {
      currentColor.value = card.color;
    }

    // Handle special cards
    switch (card.type) {
      case CARD_TYPES.SKIP:
        advancePlayer();
        break;
      case CARD_TYPES.REVERSE:
        direction.value *= -1;
        break;
      case CARD_TYPES.DRAW_TWO:
        mustDrawCards.value += 2;
        break;
      case CARD_TYPES.WILD:
        currentColor.value = selectedColor ?? currentColor.value;
        break;
      case CARD_TYPES.WILD_DRAW_FOUR:
        currentColor.value = selectedColor ?? currentColor.value;
        mustDrawCards.value += 4;
        break;
    }

    // Check for win condition
    if (player.hand.length === 0) {
      winner.value = player.id;
      // Score calculation will be handled by the watcher in PlayHand.vue
      return;
    }

    advancePlayer();
    if (currentPlayer.value !== 0) {
      setTimeout(playBotTurn, 1000);
    }
  }

  /**
   * Draws cards for the current player or a specified player.
   * 
   * @param {number} [amount=1] - The number of cards to draw.
   * @param {string} [targetId] - The ID of the player to draw cards for.
   */
  function drawCards(amount: number = 1, targetId?: string) {
    // If targetId is provided, find that player, otherwise use current player
    const player = targetId
      ? players.value.find(p => p.id === targetId)!
      : players.value[currentPlayer.value];

    // Draw the cards
    for (let i = 0; i < amount; i++) {
      if (deck.value.length === 0) {
        // Reshuffle discard pile if deck is empty
        const topDiscard = discardPile.value.pop()!;
        deck.value = shuffleDeck(discardPile.value);
        discardPile.value = [topDiscard];
      }
      if (deck.value.length > 0) {
        player.hand.push(deck.value.pop()!);
      }
    }

    // Handle turn advancement based on situation
    if (mustDrawCards.value > 0) {
      // This is a penalty draw (+2, +4)
      mustDrawCards.value = 0;
      advancePlayer();  // Skip their turn after drawing
      if (currentPlayer.value !== 0) {
        setTimeout(playBotTurn, 1000);
      }
    } else if (targetId) {
      // This is a targeted draw (UNO penalty)
      // Don't advance turn - play continues from current player
      return;
    } else {
      // This is a regular draw because player couldn't match
      advancePlayer();
      if (currentPlayer.value !== 0) {
        setTimeout(playBotTurn, 1000);
      }
    }
  }

  /**
   * Calls UNO for a player.
   * 
   * @param {string} playerId - The ID of the player calling UNO.
   */
  function callUno(playerId: string) {
    unoState.value.lastUnoCall = playerId;
    unoState.value.unoCalled = true;
  }

  /**
   * Challenges a player's UNO call.
   * 
   * @param {string} challengerId - The ID of the player challenging the UNO call.
   * @param {string} targetId - The ID of the player being challenged.
   * @returns {boolean} True if the challenge was successful, false otherwise.
   */
  function challengeUno(challengerId: string, targetId: string): boolean {
    const target = players.value.find(p => p.id === targetId);
    if (target && target.hand.length === 1 && !unoState.value.unoCalled) {
      // Player failed to call UNO
      drawCards(4, targetId);
      return true;
    }
    // False challenge
    drawCards(4, challengerId);
    return false;
  }

  /**
   * Determines if a bot should call UNO.
   * 
   * @returns {boolean} True if the bot should call UNO, false otherwise.
   */
  function shouldBotCallUno(): boolean {
    // 80% chance to remember to call UNO
    return Math.random() < 0.8;
  }

  /**
   * Determines if a bot should challenge a missed UNO call.
   * 
   * @returns {boolean} True if the bot should challenge the missed UNO call, false otherwise.
   */
  function shouldBotChallengeUno(): boolean {
    // 70% chance to notice and challenge missed UNO calls
    return Math.random() < 0.7;
  }

  /**
   * Plays the bot's turn.
   */
  function playBotTurn() {
    const bot = players.value[currentPlayer.value];
    if (!bot || !bot.isBot) return;

    // First check if bot needs to draw cards itself
    if (mustDrawCards.value > 0) {
      drawCards(mustDrawCards.value);
      return;
    }

    try {
      // Find all playable cards
      const playableCards = bot.hand
        .map((card, index) => ({ card, index }))
        .filter(({ card }) => canPlayCard(card));

      if (playableCards.length > 0) {
        // Choose a card (for now, just pick the first valid one)
        const { card, index } = playableCards[0];

        if (card.type === CARD_TYPES.WILD || card.type === CARD_TYPES.WILD_DRAW_FOUR) {
          // Find most common color in hand
          const colorCounts = bot.hand.reduce((counts: Record<string, number>, c) => {
            if (c.color) {
              counts[c.color] = (counts[c.color] || 0) + 1;
            }
            return counts;
          }, {});

          const selectedColor = Object.keys(colorCounts).length > 0
            ? Object.entries(colorCounts).sort(([, a], [, b]) => b - a)[0][0] as CardColor
            : CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)];

          playCard(index, selectedColor);
        } else {
          playCard(index);
        }

        // After playing, check if we need to handle any draw penalties for next player
        if (mustDrawCards.value > 0 && currentPlayer.value === players.value.length - 1) {
          // If it's going to be the human's turn, pause briefly then make them draw
          setTimeout(() => {
            if (currentPlayer.value === 0) {
              drawCards(mustDrawCards.value);
            }
          }, 1000);
        }
      } else {
        // No playable cards, draw one
        drawCards(1);
      }
    } catch (error) {
      console.error('Bot play error:', error);
      // Safeguard: if something goes wrong, just draw a card and end turn
      drawCards(1);
    }
  }

  /**
   * Calculates the score for the current hand.
   * 
   * @returns {number} The score for the current hand.
   */
  function calculateHandScore(): number {
    return players.value.reduce((total, player) => {
      if (player.id !== winner.value) {
        return total + player.hand.reduce((cardTotal, card) => {
          if (card.type === 'number') {
            return cardTotal + CARD_SCORES.NUMBER(card.value!);
          }
          const score = CARD_SCORES[card.type.toUpperCase() as keyof typeof CARD_SCORES];
          return cardTotal + (typeof score === 'function' ? score(card.value!) : score);
        }, 0);
      }
      return total;
    }, 0);
  }

  /**
   * Ends the current hand and updates the scores.
   * 
   * @returns {boolean} True if there is a game winner, false otherwise.
   */
  function endHand(): boolean {
    if (winner.value) {
      // Calculate and assign score
      const score = calculateHandScore();

      // Debug line
      console.log(`Hand score calculated: ${score}`);

      // Initialize scores if needed
      if (!gameState.value.currentHandScores) {
        gameState.value.currentHandScores = {};
      }
      if (!gameState.value.totalScores) {
        gameState.value.totalScores = {};
      }

      // Update scores
      gameState.value.currentHandScores[winner.value] = score;
      if (!gameState.value.totalScores[winner.value]) {
        gameState.value.totalScores[winner.value] = 0;
      }
      gameState.value.totalScores[winner.value] += score;

      // Debug line
      console.log("Updated scores:", gameState.value.totalScores);

      // Check for game winner
      if (gameState.value.totalScores[winner.value] >= gameState.value.targetScore) {
        return true;
      }

      // Prepare for next hand
      gameState.value.handNumber++;
      return false;
    }
    return false;
  }

  /**
   * Advances to the next player.
   */
  function advancePlayer() {
    currentPlayer.value =
      (currentPlayer.value + direction.value + players.value.length) %
      players.value.length;
  }

  return {
    // State
    players,
    deck,
    discardPile,
    currentPlayer,
    direction,
    currentColor,
    mustDrawCards,
    winner,
    gameState,
    unoState,

    // Computed
    topCard,
    isPlayerTurn,

    // Methods
    setupGame,
    playCard,
    canPlayCard,
    drawCards,
    callUno,
    challengeUno,
    playBotTurn,
    endHand
  };
});