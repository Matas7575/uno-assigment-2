// src/types/card.ts
export const CARD_COLORS = ['Red', 'Blue', 'Green', 'Yellow'] as const;
export const CARD_TYPES = {
  NUMBER: 'number',
  SKIP: 'skip',
  REVERSE: 'reverse',
  DRAW_TWO: 'draw_two',
  WILD: 'wild',
  WILD_DRAW_FOUR: 'wild_draw_four'
} as const;

export type CardColor = typeof CARD_COLORS[number] | null;
export type CardType = typeof CARD_TYPES[keyof typeof CARD_TYPES];

export interface Card {
  id: string;
  color: CardColor;
  type: CardType;
  value?: number;
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  isBot: boolean;
}

export interface UnoStoreState {
  players: Player[];
  deck: Card[];
  currentPlayer: number;
  topCard: Card | null;
  direction: number;
  currentColor: CardColor;
  mustDrawCards: number;
}

export const CARD_SCORES = {
  NUMBER: (value: number) => value,
  SKIP: 20,
  REVERSE: 20,
  DRAW_TWO: 20,
  WILD: 50,
  WILD_DRAW_FOUR: 50
} as const;

export interface GameState {
  currentHandScores: { [playerId: string]: number };
  totalScores: { [playerId: string]: number };
  targetScore: number;
  handNumber: number;
}