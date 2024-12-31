/**
 * Array of possible card colors.
 * 
 * @type {ReadonlyArray<string>}
 */
export const CARD_COLORS = ['Red', 'Blue', 'Green', 'Yellow'] as const;

/**
 * Object containing possible card types.
 * 
 * @type {Readonly<{ [key: string]: string }>}
 */
export const CARD_TYPES = {
  NUMBER: 'number',
  SKIP: 'skip',
  REVERSE: 'reverse',
  DRAW_TWO: 'draw_two',
  WILD: 'wild',
  WILD_DRAW_FOUR: 'wild_draw_four'
} as const;

/**
 * Type representing a card color.
 * 
 * @typedef {('Red' | 'Blue' | 'Green' | 'Yellow' | null)} CardColor
 */
export type CardColor = typeof CARD_COLORS[number] | null;

/**
 * Type representing a card type.
 * 
 * @typedef {('number' | 'skip' | 'reverse' | 'draw_two' | 'wild' | 'wild_draw_four')} CardType
 */
export type CardType = typeof CARD_TYPES[keyof typeof CARD_TYPES];

/**
 * Interface representing a card.
 * 
 * @interface Card
 * @property {string} id - The unique identifier of the card.
 * @property {CardColor} color - The color of the card.
 * @property {CardType} type - The type of the card.
 * @property {number} [value] - The value of the card (for number cards).
 */
export interface Card {
  id: string;
  color: CardColor;
  type: CardType;
  value?: number;
}

/**
 * Interface representing a player.
 * 
 * @interface Player
 * @property {string} id - The unique identifier of the player.
 * @property {string} name - The name of the player.
 * @property {Card[]} hand - The hand of cards the player holds.
 * @property {boolean} isBot - Indicates if the player is a bot.
 */
export interface Player {
  id: string;
  name: string;
  hand: Card[];
  isBot: boolean;
}

/**
 * Interface representing the state of the Uno store.
 * 
 * @interface UnoStoreState
 * @property {Player[]} players - The list of players in the game.
 * @property {Card[]} deck - The deck of cards.
 * @property {number} currentPlayer - The index of the current player.
 * @property {Card | null} topCard - The top card on the discard pile.
 * @property {number} direction - The direction of play (1 for clockwise, -1 for counter-clockwise).
 * @property {CardColor} currentColor - The current color in play.
 * @property {number} mustDrawCards - The number of cards the current player must draw.
 */
export interface UnoStoreState {
  players: Player[];
  deck: Card[];
  currentPlayer: number;
  topCard: Card | null;
  direction: number;
  currentColor: CardColor;
  mustDrawCards: number;
}

/**
 * Object containing the scores for different card types.
 * 
 * @type {Readonly<{ [key: string]: number | ((value: number) => number) }>}
 */
export const CARD_SCORES = {
  NUMBER: (value: number) => value,
  SKIP: 20,
  REVERSE: 20,
  DRAW_TWO: 20,
  WILD: 50,
  WILD_DRAW_FOUR: 50
} as const;

/**
 * Interface representing the game state.
 * 
 * @interface GameState
 * @property {{ [playerId: string]: number }} currentHandScores - The scores for the current hand.
 * @property {{ [playerId: string]: number }} totalScores - The total scores for all hands.
 * @property {number} targetScore - The target score to win the game.
 * @property {number} handNumber - The current hand number.
 */
export interface GameState {
  currentHandScores: { [playerId: string]: number };
  totalScores: { [playerId: string]: number };
  targetScore: number;
  handNumber: number;
}