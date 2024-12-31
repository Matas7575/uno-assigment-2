import { v4 as uuidv4 } from 'uuid';
import {
  Card,
  CardColor,
  CardType,
  CARD_COLORS,
  CARD_TYPES
} from '../types/card';

/**
 * Service class for card-related operations.
 * 
 * @class CardService
 */
export class CardService {
  /**
   * Creates a new card.
   * 
   * @param {CardColor} color - The color of the card.
   * @param {CardType} type - The type of the card.
   * @param {number} [value] - The value of the card (for number cards).
   * @returns {Card} The created card.
   */
  static createCard(color: CardColor, type: CardType, value?: number): Card {
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
  static generateDeck(): Card[] {
    const deck: Card[] = [];

    // Add number cards (0-9)
    CARD_COLORS.forEach(color => {
      // One 0 card per color
      deck.push(this.createCard(color, CARD_TYPES.NUMBER, 0));

      // Two of each 1-9 card per color
      for (let i = 1; i <= 9; i++) {
        deck.push(this.createCard(color, CARD_TYPES.NUMBER, i));
        deck.push(this.createCard(color, CARD_TYPES.NUMBER, i));
      }

      // Action cards (two of each per color)
      for (let i = 0; i < 2; i++) {
        deck.push(this.createCard(color, CARD_TYPES.SKIP));
        deck.push(this.createCard(color, CARD_TYPES.REVERSE));
        deck.push(this.createCard(color, CARD_TYPES.DRAW_TWO));
      }
    });

    // Add wild cards
    for (let i = 0; i < 4; i++) {
      deck.push(this.createCard(null, CARD_TYPES.WILD));
      deck.push(this.createCard(null, CARD_TYPES.WILD_DRAW_FOUR));
    }

    return this.shuffleDeck(deck);
  }

  /**
   * Shuffles a deck of cards.
   * 
   * @param {Card[]} deck - The deck of cards to shuffle.
   * @returns {Card[]} The shuffled deck of cards.
   */
  static shuffleDeck(deck: Card[]): Card[] {
    return [...deck].sort(() => Math.random() - 0.5);
  }

  /**
   * Determines if a card can be played on top of another card.
   * 
   * @param {Card} card - The card to be played.
   * @param {Card} topCard - The card currently on top of the discard pile.
   * @param {CardColor} currentColor - The current color in play.
   * @returns {boolean} True if the card can be played, false otherwise.
   */
  static canPlayOnTop(card: Card, topCard: Card, currentColor: CardColor): boolean {
    if (card.type === CARD_TYPES.WILD || card.type === CARD_TYPES.WILD_DRAW_FOUR) {
      return true;
    }

    if (card.color === currentColor) {
      return true;
    }

    if (card.type === CARD_TYPES.NUMBER && topCard.type === CARD_TYPES.NUMBER) {
      return card.value === topCard.value;
    }

    return card.type === topCard.type;
  }
}