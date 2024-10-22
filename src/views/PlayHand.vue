<template>
  <div id="play-hand">
    <h2>Current Turn: {{ players[currentTurn].name }}</h2>

    <div v-if="currentTurn === 0">
      <h3>Your Hand</h3>
      <div class="hand">
        <button
          v-for="(card, index) in players[0].hand"
          :key="index"
          @click="playCard(index)"
        >
          {{ card }}
        </button>
      </div>
    </div>

    <div v-if="currentTurn !== 0">
      <h3>{{ players[currentTurn].name }} is playing...</h3>
    </div>

    <h3>Top of the Pile: {{ topCard }}</h3>

    <button v-if="currentTurn === 0 && !canPlay()" @click="drawCard">
      Draw Card
    </button>

    <div v-if="gameOver">
      <h2>Game Over! Winner: {{ winner }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deck: [],
      players: [
        { name: "Player 1", hand: [] },
        { name: "Bot 1", hand: [] },
        { name: "Bot 2", hand: [] },
      ],
      currentTurn: 0,
      topCard: null,
      gameOver: false,
      winner: null,
    };
  },
  methods: {
    generateDeck() {
      const colors = ["Red", "Yellow", "Green", "Blue"];
      const numbers = Array.from({ length: 10 }, (_, i) => i);
      let deck = [];

      for (const color of colors) {
        for (const number of numbers) {
          deck.push(`${color} ${number}`);
        }
      }

      return deck.sort(() => Math.random() - 0.5);
    },
    startGame() {
      this.deck = this.generateDeck();
      for (let i = 0; i < 7; i++) {
        this.players.forEach((player) => player.hand.push(this.deck.pop()));
      }
      this.topCard = this.deck.pop();
    },
    playCard(cardIndex) {
      const player = this.players[this.currentTurn];
      const selectedCard = player.hand[cardIndex];

      if (this.canPlayCard(selectedCard)) {
        this.topCard = selectedCard;
        player.hand.splice(cardIndex, 1);

        if (player.hand.length === 0) {
          this.gameOver = true;
          this.winner = player.name;
        } else {
          this.nextTurn();
        }
      } else {
        alert("You cannot play that card!");
      }
    },
    canPlayCard(card) {
      const [topColor, topNumber] = this.topCard.split(" ");
      const [cardColor, cardNumber] = card.split(" ");

      return topColor === cardColor || topNumber === cardNumber;
    },
    canPlay() {
      const player = this.players[this.currentTurn];
      return player.hand.some((card) => this.canPlayCard(card));
    },
    drawCard() {
      const player = this.players[this.currentTurn];
      if (this.deck.length === 0) {
        alert("Deck is empty, reshuffling...");
        this.deck = this.generateDeck();
      }
      player.hand.push(this.deck.pop());
      this.nextTurn();
    },
    nextTurn() {
      this.currentTurn = (this.currentTurn + 1) % this.players.length;

      if (this.currentTurn !== 0) {
        setTimeout(this.botPlay, 1000);
      }
    },
    botPlay() {
      const player = this.players[this.currentTurn];
      const playableCardIndex = player.hand.findIndex((card) =>
        this.canPlayCard(card)
      );

      if (playableCardIndex !== -1) {
        this.playCard(playableCardIndex);
      } else {
        this.drawCard();
      }
    },
  },
  mounted() {
    this.startGame();
  },
};
</script>

<style scoped>
.hand {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px;
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
