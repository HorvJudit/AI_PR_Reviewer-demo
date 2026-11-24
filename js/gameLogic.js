const SVG_VIEW_BOX = '0 0 48 48';

export const DIFFICULTY_ORDER = Object.freeze(['relaxed', 'classic', 'master']);

export const DIFFICULTY_PRESETS = Object.freeze({
  relaxed: Object.freeze({
    key: 'relaxed',
    label: '4 × 3 Relaxed',
    pairCount: 6,
    gridClass: 'grid-relaxed',
  }),
  classic: Object.freeze({
    key: 'classic',
    label: '4 × 4 Classic',
    pairCount: 8,
    gridClass: 'grid-classic',
  }),
  master: Object.freeze({
    key: 'master',
    label: '6 × 4 Master',
    pairCount: 12,
    gridClass: 'grid-master',
  }),
});

export const CARD_SYMBOLS = Object.freeze([
  Object.freeze({
    id: 'compass',
    label: 'Compass',
    accentColor: '#f59e0b',
    viewBox: SVG_VIEW_BOX,
    shapes: Object.freeze([
      Object.freeze({ tag: 'circle', attrs: Object.freeze({ cx: '24', cy: '24', r: '16' }) }),
      Object.freeze({ tag: 'polygon', attrs: Object.freeze({ points: '24,11 28,24 24,37 20,24' }) }),
      Object.freeze({ tag: 'circle', attrs: Object.freeze({ cx: '24', cy: '24', r: '2.5', fill: 'currentColor' }) }),
    ]),
  }),
  Object.freeze({
    id: 'crescent',
    label: 'Crescent',
    accentColor: '#93c5fd',
    viewBox: SVG_VIEW_BOX,
    shapes: Object.freeze([
      Object.freeze({
        tag: 'path',
        attrs: Object.freeze({ d: 'M31 32a13 13 0 1 1-11-20 10 10 0 0 0 11 20Z' }),
      }),
      Object.freeze({
        tag: 'path',
        attrs: Object.freeze({ d: 'M33 12v6M30 15h6' }),
      }),
    ]),
  }),
  Object.freeze({
    id: 'crystal',
    label: 'Crystal',
    accentColor: '#2dd4bf',
    viewBox: SVG_VIEW_BOX,
    shapes: Object.freeze([
      Object.freeze({ tag: 'polygon', attrs: Object.freeze({ points: '24,7 36,18 24,41 12,18' }) }),
      Object.freeze({ tag: 'polyline', attrs: Object.freeze({ points: '12,18 24,22 36,18' }) }),
      Object.freeze({ tag: 'line', attrs: Object.freeze({ x1: '24', y1: '7', x2: '24', y2: '41' }) }),
    ]),
  }),
  Object.freeze({
    id: 'ember',
    label: 'Ember',
    accentColor: '#fb923c',
    viewBox: SVG_VIEW_BOX,
    shapes: Object.freeze([
      Object.freeze({
        tag: 'path',
        attrs: Object.freeze({
          d: 'M24 8c5 6 11 11 11 19a11 11 0 1 1-22 0c0-5 3-9 6-12 0 3 2 5 4 5-1-4 0-8 1-12Z',
        }),
      }),
      Object.freeze({
        tag: 'path',
        attrs: Object.freeze({ d: 'M24 26c2 2 4 4 4 7a4 4 0 0 1-8 0c0-3 2-5 4-7Z' }),
      }),
    ]),
  }),
  Object.freeze({
    id: 'fern',
    label: 'Botanical',
    accentColor: '#34d399',
    viewBox: SVG_VIEW_BOX,
    shapes: Object.freeze([
      Object.freeze({
        tag: 'path',
        attrs: Object.freeze({ d: 'M12 36C12 20 22 10 37 10c0 15-10 26-25 26Z' }),
      }),
      Object.freeze({
        tag: 'path',
        attrs: Object.freeze({ d: 'M12 36 30 18M20 28h7M24 24v-7' }),
      }),
    ]),
  }),
  Object.freeze({
    id: 'anchor',
    label: 'Anchor',
    accentColor: '#60a5fa',
    viewBox: SVG_VIEW_BOX,
    shapes: Object.freeze([
      Object.freeze({ tag: 'circle', attrs: Object.freeze({ cx: '24', cy: '12', r: '3.5' }) }),
      Object.freeze({ tag: 'line', attrs: Object.freeze({ x1: '24', y1: '15.5', x2: '24', y2: '39' }) }),
      Object.freeze({ tag: 'line', attrs: Object.freeze({ x1: '16', y1: '22', x2: '32', y2: '22' }) }),
      Object.freeze({
        tag: 'path',
        attrs: Object.freeze({ d: 'M12 29a12 12 0 0 0 24 0' }),
      }),
    ]),
  }),
  Object.freeze({
    id: 'hourglass',
    label: 'Hourglass',
    accentColor: '#fbbf24',
    viewBox: SVG_VIEW_BOX,
    shapes: Object.freeze([
      Object.freeze({ tag: 'line', attrs: Object.freeze({ x1: '14', y1: '10', x2: '34', y2: '10' }) }),
      Object.freeze({ tag: 'line', attrs: Object.freeze({ x1: '14', y1: '38', x2: '34', y2: '38' }) }),
      Object.freeze({
        tag: 'path',
        attrs: Object.freeze({ d: 'M16 10v5c0 4 4 7 8 9-4 2-8 5-8 9v5M32 10v5c0 4-4 7-8 9 4 2 8 5 8 9v5' }),
      }),
    ]),
  }),
  Object.freeze({
    id: 'quill',
    label: 'Quill',
    accentColor: '#a78bfa',
    viewBox: SVG_VIEW_BOX,
    shapes: Object.freeze([
      Object.freeze({
        tag: 'path',
        attrs: Object.freeze({ d: 'M36 10C25 11 16 19 13 31l-2 7 7-2c12-3 20-12 18-26Z' }),
      }),
      Object.freeze({
        tag: 'path',
        attrs: Object.freeze({ d: 'M11 38 30 19M19 30h8' }),
      }),
    ]),
  }),
  Object.freeze({
    id: 'crown',
    label: 'Crown',
    accentColor: '#facc15',
    viewBox: SVG_VIEW_BOX,
    shapes: Object.freeze([
      Object.freeze({
        tag: 'polygon',
        attrs: Object.freeze({ points: '10,34 12,16 20,24 24,13 28,24 36,16 38,34' }),
      }),
      Object.freeze({ tag: 'line', attrs: Object.freeze({ x1: '11', y1: '38', x2: '37', y2: '38' }) }),
    ]),
  }),
  Object.freeze({
    id: 'bolt',
    label: 'Spark',
    accentColor: '#fde047',
    viewBox: SVG_VIEW_BOX,
    shapes: Object.freeze([
      Object.freeze({
        tag: 'polygon',
        attrs: Object.freeze({ points: '26,8 13,26 23,26 21,40 35,21 25,21' }),
      }),
    ]),
  }),
  Object.freeze({
    id: 'prism',
    label: 'Prism',
    accentColor: '#38bdf8',
    viewBox: SVG_VIEW_BOX,
    shapes: Object.freeze([
      Object.freeze({ tag: 'polygon', attrs: Object.freeze({ points: '24,9 39,36 9,36' }) }),
      Object.freeze({ tag: 'polygon', attrs: Object.freeze({ points: '24,19 32,33 16,33' }) }),
    ]),
  }),
  Object.freeze({
    id: 'key',
    label: 'Cipher',
    accentColor: '#fb7185',
    viewBox: SVG_VIEW_BOX,
    shapes: Object.freeze([
      Object.freeze({ tag: 'circle', attrs: Object.freeze({ cx: '17', cy: '24', r: '7' }) }),
      Object.freeze({ tag: 'line', attrs: Object.freeze({ x1: '24', y1: '24', x2: '39', y2: '24' }) }),
      Object.freeze({ tag: 'line', attrs: Object.freeze({ x1: '33', y1: '24', x2: '33', y2: '30' }) }),
      Object.freeze({ tag: 'line', attrs: Object.freeze({ x1: '38', y1: '24', x2: '38', y2: '29' }) }),
    ]),
  }),
]);

/** Validates that a value is an integer greater than zero. */
function assertPositiveInteger(value, fieldName) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${fieldName} must be a positive integer.`);
  }
}

/** Validates that a difficulty key exists in DIFFICULTY_PRESETS. */
function assertValidDifficulty(difficultyKey) {
  if (typeof difficultyKey !== 'string' || !Object.hasOwn(DIFFICULTY_PRESETS, difficultyKey)) {
    throw new RangeError(`Unknown difficulty preset: "${String(difficultyKey)}".`);
  }
}

/** Validates that the provided cards argument is a non-empty array with an even count. */
function assertValidDeck(cards) {
  if (!Array.isArray(cards) || cards.length === 0 || cards.length % 2 !== 0) {
    throw new TypeError('Deck must be a non-empty array with an even number of cards.');
  }
}

/** Creates a pair of card entities for a single symbol definition. */
function createCardPair(symbol) {
  const { id, label, accentColor, viewBox, shapes } = symbol;

  return [
    Object.freeze({ id: `${id}-a`, symbolId: id, label, accentColor, viewBox, shapes }),
    Object.freeze({ id: `${id}-b`, symbolId: id, label, accentColor, viewBox, shapes }),
  ];
}

/** Produces a new shuffled copy using the Fisher-Yates algorithm without mutating input. */
function shuffleCards(cards, randomFn) {
  const shuffled = [...cards];

  // Reverse iteration guarantees every permutation has equal probability.
  for (let currentIndex = shuffled.length - 1; currentIndex > 0; currentIndex -= 1) {
    const swapIndex = Math.floor(randomFn() * (currentIndex + 1));
    const currentCard = shuffled[currentIndex];
    shuffled[currentIndex] = shuffled[swapIndex];
    shuffled[swapIndex] = currentCard;
  }

  return shuffled;
}

/** Locates a card object in a list by its unique card identifier. */
function findCardById(cards, cardId) {
  return cards.find(({ id }) => id === cardId) ?? null;
}

/**
 * Resolves the preset configuration for a given difficulty key.
 *
 * @param {string} difficultyKey - One of 'relaxed', 'classic', or 'master'.
 * @returns {Readonly<{key: string, label: string, pairCount: number, gridClass: string}>} The matching difficulty preset.
 * @throws {RangeError} If the difficulty key is unknown.
 */
export function getDifficultyPreset(difficultyKey) {
  assertValidDifficulty(difficultyKey);
  return DIFFICULTY_PRESETS[difficultyKey];
}

/**
 * Returns the next higher difficulty preset key, or null when already on the hardest grid.
 *
 * @param {string} difficultyKey - Current difficulty key.
 * @returns {string | null} Next difficulty key, or null if no higher preset exists.
 * @throws {RangeError} If the difficulty key is unknown.
 */
export function getNextDifficulty(difficultyKey) {
  assertValidDifficulty(difficultyKey);
  const currentIndex = DIFFICULTY_ORDER.indexOf(difficultyKey);
  const nextIndex = currentIndex + 1;

  if (nextIndex >= DIFFICULTY_ORDER.length) {
    return null;
  }

  return DIFFICULTY_ORDER[nextIndex];
}

/**
 * Generates a shuffled deck containing the requested number of symbol pairs.
 *
 * @param {number} pairCount - Number of unique pairs to include in the deck.
 * @param {ReadonlyArray<object>} [symbols=CARD_SYMBOLS] - Source catalog of symbol definitions.
 * @param {() => number} [randomFn=Math.random] - Injectable PRNG returning values in [0, 1).
 * @returns {Array<Readonly<object>>} A newly allocated, shuffled array of card objects.
 * @throws {RangeError|TypeError} If inputs are invalid or insufficient symbols exist.
 */
export function createDeck(pairCount, symbols = CARD_SYMBOLS, randomFn = Math.random) {
  assertPositiveInteger(pairCount, 'pairCount');

  if (!Array.isArray(symbols) || symbols.length < pairCount) {
    throw new RangeError(`At least ${pairCount} unique symbols are required to create this deck.`);
  }

  if (typeof randomFn !== 'function') {
    throw new TypeError('randomFn must be a function.');
  }

  const selectedSymbols = symbols.slice(0, pairCount);
  const pairedCards = selectedSymbols.flatMap(createCardPair);

  return shuffleCards(pairedCards, randomFn);
}

/**
 * Creates a clean initial game state for a newly dealt deck.
 *
 * @param {Array<Readonly<object>>} cards - Shuffled array of card objects.
 * @param {string} difficultyKey - Active difficulty preset key.
 * @returns {Readonly<object>} Immutable initial game state.
 * @throws {TypeError|RangeError} If cards or difficultyKey are invalid.
 */
export function createInitialState(cards, difficultyKey) {
  assertValidDeck(cards);
  assertValidDifficulty(difficultyKey);

  return Object.freeze({
    cards: Object.freeze([...cards]),
    difficultyKey,
    totalPairs: cards.length / 2,
    flippedIds: Object.freeze([]),
    matchedIds: Object.freeze([]),
    mismatchedIds: Object.freeze([]),
    moves: 0,
    elapsedSeconds: 0,
    status: 'idle',
    isLocked: false,
  });
}

/**
 * Attempts to flip a single card and returns the resulting transition without mutating state.
 *
 * @param {Readonly<object>} state - Current game state.
 * @param {string} cardId - Unique identifier of the clicked card.
 * @returns {{nextState: Readonly<object>, didFlip: boolean, shouldEvaluate: boolean}} Transition result.
 * @throws {TypeError} If state is missing or cardId is not a non-empty string.
 */
export function flipCard(state, cardId) {
  if (!state || typeof state !== 'object') {
    throw new TypeError('Game state object is required.');
  }

  if (typeof cardId !== 'string' || cardId.trim() === '') {
    throw new TypeError('cardId must be a non-empty string.');
  }

  const { cards, flippedIds, matchedIds, status, isLocked } = state;

  if (isLocked || status === 'won') {
    return { nextState: state, didFlip: false, shouldEvaluate: false };
  }

  if (flippedIds.includes(cardId) || matchedIds.includes(cardId)) {
    return { nextState: state, didFlip: false, shouldEvaluate: false };
  }

  const targetCard = findCardById(cards, cardId);
  if (!targetCard) {
    return { nextState: state, didFlip: false, shouldEvaluate: false };
  }

  const nextFlippedIds = Object.freeze([...flippedIds, cardId]);
  const shouldEvaluate = nextFlippedIds.length === 2;
  const nextStatus = status === 'idle' ? 'playing' : status;

  const nextState = Object.freeze({
    ...state,
    flippedIds: nextFlippedIds,
    mismatchedIds: Object.freeze([]),
    status: nextStatus,
    isLocked: shouldEvaluate,
  });

  return { nextState, didFlip: true, shouldEvaluate };
}

/**
 * Evaluates the two currently flipped cards for a symbol match.
 *
 * @param {Readonly<object>} state - Current game state containing exactly two flipped cards.
 * @returns {{nextState: Readonly<object>, isMatch: boolean, matchedLabel: string | null}} Evaluation result.
 * @throws {Error} If fewer or more than two cards are currently flipped.
 */
export function evaluateFlippedPair(state) {
  const { cards, flippedIds, matchedIds, moves, totalPairs } = state;

  if (flippedIds.length !== 2) {
    throw new Error('evaluateFlippedPair requires exactly two flipped cards.');
  }

  const [firstId, secondId] = flippedIds;
  const firstCard = findCardById(cards, firstId);
  const secondCard = findCardById(cards, secondId);

  if (!firstCard || !secondCard) {
    throw new Error('Flipped card identifiers could not be resolved in the active deck.');
  }

  const { symbolId: firstSymbolId, label: firstLabel } = firstCard;
  const { symbolId: secondSymbolId } = secondCard;
  const isMatch = firstSymbolId === secondSymbolId;
  const nextMoves = moves + 1;

  if (!isMatch) {
    const nextState = Object.freeze({
      ...state,
      moves: nextMoves,
      mismatchedIds: Object.freeze([firstId, secondId]),
      isLocked: true,
    });

    return { nextState, isMatch: false, matchedLabel: null };
  }

  const nextMatchedIds = Object.freeze([...matchedIds, firstId, secondId]);
  const isBoardCleared = nextMatchedIds.length === totalPairs * 2;

  const nextState = Object.freeze({
    ...state,
    flippedIds: Object.freeze([]),
    matchedIds: nextMatchedIds,
    mismatchedIds: Object.freeze([]),
    moves: nextMoves,
    status: isBoardCleared ? 'won' : 'playing',
    isLocked: false,
  });

  return { nextState, isMatch: true, matchedLabel: firstLabel };
}

/**
 * Clears any mismatched face-up selection and unlocks the board for the next turn.
 *
 * @param {Readonly<object>} state - Current game state.
 * @returns {Readonly<object>} New unlocked game state with flipped selection cleared.
 */
export function clearMismatchedSelection(state) {
  if (!state || typeof state !== 'object') {
    throw new TypeError('Game state object is required.');
  }

  return Object.freeze({
    ...state,
    flippedIds: Object.freeze([]),
    mismatchedIds: Object.freeze([]),
    isLocked: false,
  });
}

/**
 * Advances the elapsed timer by one second when a game is actively in progress.
 *
 * @param {Readonly<object>} state - Current game state.
 * @returns {Readonly<object>} Updated game state with incremented timer, or unchanged state if not playing.
 */
export function incrementElapsedSeconds(state) {
  const { status, elapsedSeconds } = state;

  if (status !== 'playing') {
    return state;
  }

  return Object.freeze({
    ...state,
    elapsedSeconds: elapsedSeconds + 1,
  });
}

/**
 * Computes match accuracy as an integer percentage between 0 and 100.
 *
 * @param {number} moves - Total move attempts made.
 * @param {number} matchedPairCount - Number of pairs matched so far.
 * @returns {number} Rounded accuracy percentage.
 */
export function calculateAccuracy(moves, matchedPairCount) {
  if (moves <= 0 || matchedPairCount <= 0) {
    return 0;
  }

  const ratio = Math.min(1, matchedPairCount / moves);
  return Math.round(ratio * 100);
}

/**
 * Calculates a 1-to-3 star rating from move efficiency relative to the number of pairs.
 *
 * @param {number} moves - Total moves used to clear the board.
 * @param {number} totalPairs - Total pairs on the board.
 * @returns {number} Star count between 1 and 3.
 */
export function calculateStarRating(moves, totalPairs) {
  assertPositiveInteger(totalPairs, 'totalPairs');

  if (moves <= Math.ceil(totalPairs * 1.45)) {
    return 3;
  }

  if (moves <= Math.ceil(totalPairs * 2.1)) {
    return 2;
  }

  return 1;
}

/**
 * Formats a non-negative duration in seconds into MM:SS notation.
 *
 * @param {number} totalSeconds - Elapsed seconds.
 * @returns {string} Zero-padded MM:SS string.
 */
export function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
