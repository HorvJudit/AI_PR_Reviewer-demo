import { formatDuration, getDifficultyPreset } from './gameLogic.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const CARD_DEAL_STAGGER_MS = 28;
const MAX_STARS = 3;

const REQUIRED_ELEMENT_IDS = Object.freeze({
  board: 'game-board',
  movesValue: 'moves-value',
  pairsValue: 'pairs-value',
  timerValue: 'timer-value',
  bestValue: 'best-value',
  statusMessage: 'status-message',
  difficultyControls: 'difficulty-controls',
  restartButton: 'restart-btn',
  soundToggleButton: 'sound-toggle-btn',
  victoryModal: 'victory-modal',
  victorySubtitle: 'victory-subtitle',
  victoryStars: 'victory-stars',
  summaryMoves: 'summary-moves',
  summaryTime: 'summary-time',
  summaryAccuracy: 'summary-accuracy',
  summaryRecord: 'summary-record',
  playAgainButton: 'play-again-btn',
  nextDifficultyButton: 'next-difficulty-btn',
});

const SOUND_CUES = Object.freeze({
  flip: Object.freeze([{ frequency: 420, duration: 0.06, delay: 0, gain: 0.045, type: 'sine' }]),
  match: Object.freeze([
    { frequency: 523.25, duration: 0.1, delay: 0, gain: 0.06, type: 'triangle' },
    { frequency: 659.25, duration: 0.14, delay: 0.07, gain: 0.06, type: 'triangle' },
  ]),
  mismatch: Object.freeze([
    { frequency: 240, duration: 0.09, delay: 0, gain: 0.045, type: 'sine' },
    { frequency: 196, duration: 0.12, delay: 0.08, gain: 0.04, type: 'sine' },
  ]),
  victory: Object.freeze([
    { frequency: 523.25, duration: 0.12, delay: 0, gain: 0.06, type: 'triangle' },
    { frequency: 659.25, duration: 0.12, delay: 0.1, gain: 0.06, type: 'triangle' },
    { frequency: 783.99, duration: 0.14, delay: 0.2, gain: 0.065, type: 'triangle' },
    { frequency: 1046.5, duration: 0.26, delay: 0.31, gain: 0.07, type: 'triangle' },
  ]),
});

/** Creates an SVG element with the provided attribute map using the SVG XML namespace. */
function createSvgNode(documentRef, tagName, attributes) {
  const node = documentRef.createElementNS(SVG_NS, tagName);

  for (const [key, value] of Object.entries(attributes)) {
    node.setAttribute(key, value);
  }

  return node;
}

/** Builds the geometric diamond ornament displayed on the back of every face-down card. */
function createCardBackOrnament(documentRef) {
  const svg = createSvgNode(documentRef, 'svg', {
    class: 'card-back-ornament',
    viewBox: '0 0 36 36',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.6',
    'aria-hidden': 'true',
  });

  svg.append(
    createSvgNode(documentRef, 'polygon', { points: '18,4 32,18 18,32 4,18' }),
    createSvgNode(documentRef, 'polygon', { points: '18,10 26,18 18,26 10,18' }),
    createSvgNode(documentRef, 'circle', { cx: '18', cy: '18', r: '2', fill: 'currentColor' })
  );

  return svg;
}

/** Builds the corner checkmark icon shown once a card pair has been matched. */
function createMatchCheckIcon(documentRef) {
  const svg = createSvgNode(documentRef, 'svg', {
    class: 'card-check',
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2.4',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
  });

  svg.append(createSvgNode(documentRef, 'polyline', { points: '4,10.5 8,14.5 16,6.5' }));

  return svg;
}

/** Builds the inline vector artwork element for a card's front face. */
function createSymbolArtwork(documentRef, { viewBox, shapes }) {
  const svg = createSvgNode(documentRef, 'svg', {
    viewBox,
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2.2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
  });

  for (const { tag, attrs } of shapes) {
    svg.append(createSvgNode(documentRef, tag, attrs));
  }

  return svg;
}

/** Creates a single interactive 3D memory card button element. */
function createCardElement(documentRef, card, index) {
  const { id, label, accentColor } = card;
  const button = documentRef.createElement('button');
  button.type = 'button';
  button.className = 'memory-card';
  button.dataset.cardId = id;
  button.style.setProperty('--deal-delay', `${index * CARD_DEAL_STAGGER_MS}ms`);
  button.style.setProperty('--card-accent', accentColor);
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-label', `Hidden card ${index + 1}`);

  const inner = documentRef.createElement('span');
  inner.className = 'card-inner';

  const backFace = documentRef.createElement('span');
  backFace.className = 'card-face card-back';
  backFace.append(createCardBackOrnament(documentRef));

  const frontFace = documentRef.createElement('span');
  frontFace.className = 'card-face card-front';

  const symbolBox = documentRef.createElement('span');
  symbolBox.className = 'card-symbol';
  symbolBox.append(createSymbolArtwork(documentRef, card));

  const labelSpan = documentRef.createElement('span');
  labelSpan.className = 'card-label';
  labelSpan.textContent = label;

  frontFace.append(createMatchCheckIcon(documentRef), symbolBox, labelSpan);
  inner.append(backFace, frontFace);
  button.append(inner);

  return button;
}

/** Builds a star SVG node for the victory rating row. */
function createStarIcon(documentRef, isEarned) {
  const svg = createSvgNode(documentRef, 'svg', {
    class: isEarned ? 'star-icon is-earned' : 'star-icon',
    viewBox: '0 0 24 24',
    fill: isEarned ? 'currentColor' : 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
  });

  svg.append(
    createSvgNode(documentRef, 'polygon', {
      points: '12,2.5 14.9,8.4 21.5,9.3 16.7,13.9 17.8,20.5 12,17.4 6.2,20.5 7.3,13.9 2.5,9.3 9.1,8.4',
    })
  );

  return svg;
}

/** Schedules a single synthesized oscillator tone on an active AudioContext. */
function playOscillatorTone(audioContext, tone) {
  const { frequency, duration, delay, gain, type } = tone;
  const { currentTime, destination } = audioContext;
  const startTime = currentTime + delay;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  // Exponential decay avoids audible speaker clicks when notes terminate.
  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(gain, startTime + 0.015);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.02);
}

/**
 * Resolves and validates all DOM elements required by the game interface.
 *
 * @param {Document} documentRef - Injected DOM document reference.
 * @returns {Readonly<Record<string, HTMLElement>>} Frozen dictionary of resolved DOM elements.
 * @throws {Error} If documentRef is missing or any required DOM element cannot be found.
 */
export function queryDomElements(documentRef) {
  if (!documentRef || typeof documentRef.getElementById !== 'function') {
    throw new TypeError('A valid Document reference is required.');
  }

  const resolved = {};

  for (const [key, elementId] of Object.entries(REQUIRED_ELEMENT_IDS)) {
    const element = documentRef.getElementById(elementId);

    if (!element) {
      throw new Error(`Required DOM element "#${elementId}" was not found.`);
    }

    resolved[key] = element;
  }

  return Object.freeze(resolved);
}

/**
 * Renders a freshly dealt card deck into the board container.
 *
 * @param {HTMLElement} boardElement - Container element hosting the card grid.
 * @param {ReadonlyArray<object>} cards - Shuffled card descriptors.
 * @param {string} difficultyKey - Active difficulty preset key.
 * @param {Document} documentRef - Injected DOM document reference.
 * @returns {void}
 */
export function renderBoard(boardElement, cards, difficultyKey, documentRef) {
  const { gridClass } = getDifficultyPreset(difficultyKey);
  const fragment = documentRef.createDocumentFragment();

  cards.forEach((card, index) => {
    fragment.append(createCardElement(documentRef, card, index));
  });

  boardElement.className = `game-board ${gridClass}`;
  boardElement.replaceChildren(fragment);
}

/**
 * Synchronizes CSS flip, match, and mismatch states on existing card DOM nodes.
 *
 * @param {HTMLElement} boardElement - Container element hosting the card grid.
 * @param {Readonly<object>} state - Current immutable game state.
 * @returns {void}
 */
export function syncBoardCards(boardElement, state) {
  const { cards, flippedIds, matchedIds, mismatchedIds } = state;
  const cardById = new Map(
    cards.map((card, index) => {
      const { id } = card;
      return [id, { card, index }];
    })
  );
  const cardButtons = boardElement.querySelectorAll('.memory-card');

  for (const button of cardButtons) {
    const { cardId } = button.dataset;
    const entry = cardById.get(cardId);

    if (!entry) {
      continue;
    }

    const { card, index } = entry;
    const { label } = card;
    const isMatched = matchedIds.includes(cardId);
    const isFlipped = flippedIds.includes(cardId);
    const isMismatched = mismatchedIds.includes(cardId);
    const isRevealed = isFlipped || isMatched;

    button.classList.toggle('is-flipped', isFlipped);
    button.classList.toggle('is-matched', isMatched);
    button.classList.toggle('is-mismatched', isMismatched);
    button.disabled = isMatched;
    button.setAttribute('aria-pressed', String(isRevealed));

    if (isMatched) {
      button.setAttribute('aria-label', `${label}, matched`);
    } else if (isFlipped) {
      button.setAttribute('aria-label', `${label}, revealed`);
    } else {
      button.setAttribute('aria-label', `Hidden card ${index + 1}`);
    }
  }
}

/**
 * Updates the top HUD metrics and live status announcement.
 *
 * @param {Readonly<Record<string, HTMLElement>>} elements - Resolved DOM element map.
 * @param {Readonly<object>} state - Current immutable game state.
 * @param {number | null} bestMoves - Recorded minimum moves for the active grid, or null.
 * @param {string} statusText - Human-readable announcement for the status strip.
 * @returns {void}
 */
export function renderHud(elements, state, bestMoves, statusText) {
  const { movesValue, pairsValue, timerValue, bestValue, statusMessage } = elements;
  const { moves, matchedIds, totalPairs, elapsedSeconds } = state;
  const matchedPairs = matchedIds.length / 2;

  movesValue.textContent = String(moves);
  pairsValue.textContent = `${matchedPairs} / ${totalPairs}`;
  timerValue.textContent = formatDuration(elapsedSeconds);
  bestValue.textContent = bestMoves === null ? '—' : `${bestMoves} moves`;
  statusMessage.textContent = statusText;
}

/**
 * Updates the active visual and ARIA state of the difficulty selector buttons.
 *
 * @param {HTMLElement} difficultyControls - Container element wrapping difficulty buttons.
 * @param {string} activeDifficultyKey - Currently selected difficulty key.
 * @returns {void}
 */
export function renderDifficultyButtons(difficultyControls, activeDifficultyKey) {
  const buttons = difficultyControls.querySelectorAll('[data-difficulty]');

  for (const button of buttons) {
    const { difficulty } = button.dataset;
    const isActive = difficulty === activeDifficultyKey;

    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  }
}

/**
 * Updates the accessible pressed state and label on the sound toggle button.
 *
 * @param {HTMLElement} soundToggleButton - Sound toggle button element.
 * @param {boolean} isSoundEnabled - Whether synthesized sound cues are enabled.
 * @returns {void}
 */
export function renderSoundToggle(soundToggleButton, isSoundEnabled) {
  soundToggleButton.setAttribute('aria-pressed', String(isSoundEnabled));
  soundToggleButton.setAttribute(
    'aria-label',
    isSoundEnabled ? 'Mute sound effects' : 'Enable sound effects'
  );
}

/**
 * Populates and reveals the victory summary modal once all pairs are matched.
 *
 * @param {Readonly<Record<string, HTMLElement>>} elements - Resolved DOM element map.
 * @param {{moves: number, elapsedSeconds: number, accuracy: number, stars: number, isNewRecord: boolean, nextDifficultyLabel: string | null}} summary - Victory statistics payload.
 * @param {Document} documentRef - Injected DOM document reference.
 * @returns {void}
 */
export function renderVictoryModal(elements, summary, documentRef) {
  const {
    victoryModal,
    victorySubtitle,
    victoryStars,
    summaryMoves,
    summaryTime,
    summaryAccuracy,
    summaryRecord,
    nextDifficultyButton,
    playAgainButton,
  } = elements;

  const { moves, elapsedSeconds, accuracy, stars, isNewRecord, nextDifficultyLabel } = summary;

  summaryMoves.textContent = String(moves);
  summaryTime.textContent = formatDuration(elapsedSeconds);
  summaryAccuracy.textContent = `${accuracy}%`;
  victorySubtitle.textContent =
    stars === MAX_STARS
      ? 'Exceptional recall across the entire board.'
      : 'Every pair matched. Ready for another round?';

  const starFragment = documentRef.createDocumentFragment();
  for (let starIndex = 1; starIndex <= MAX_STARS; starIndex += 1) {
    starFragment.append(createStarIcon(documentRef, starIndex <= stars));
  }

  victoryStars.setAttribute('aria-label', `${stars} out of ${MAX_STARS} stars`);
  victoryStars.replaceChildren(starFragment);

  if (isNewRecord) {
    summaryRecord.textContent = `New personal best: ${moves} moves`;
    summaryRecord.classList.remove('is-hidden');
  } else {
    summaryRecord.textContent = '';
    summaryRecord.classList.add('is-hidden');
  }

  if (nextDifficultyLabel) {
    nextDifficultyButton.textContent = `Try ${nextDifficultyLabel}`;
    nextDifficultyButton.classList.remove('is-hidden');
  } else {
    nextDifficultyButton.classList.add('is-hidden');
  }

  victoryModal.classList.remove('is-hidden');
  victoryModal.setAttribute('aria-hidden', 'false');
  playAgainButton.focus();
}

/**
 * Hides the victory summary modal.
 *
 * @param {HTMLElement} modalElement - Victory modal backdrop element.
 * @returns {void}
 */
export function hideVictoryModal(modalElement) {
  modalElement.classList.add('is-hidden');
  modalElement.setAttribute('aria-hidden', 'true');
}

/**
 * Creates a lazy Web Audio synthesizer for tactile UI sound cues without external assets.
 *
 * @param {Window} windowRef - Injected Window reference providing AudioContext.
 * @returns {{playCue: (cueName: string, isEnabled: boolean) => Promise<void>}} Sound engine API.
 */
export function createSoundEngine(windowRef) {
  let audioContext = null;

  /** Lazily initializes an AudioContext after a user gesture satisfies browser autoplay rules. */
  function resolveAudioContext() {
    if (audioContext) {
      return audioContext;
    }

    const { AudioContext: StandardAudioContext, webkitAudioContext } = windowRef;
    const AudioContextConstructor = StandardAudioContext ?? webkitAudioContext;

    if (typeof AudioContextConstructor !== 'function') {
      return null;
    }

    audioContext = new AudioContextConstructor();
    return audioContext;
  }

  async function playCue(cueName, isEnabled) {
    if (!isEnabled || !Object.hasOwn(SOUND_CUES, cueName)) {
      return;
    }

    const activeContext = resolveAudioContext();
    if (!activeContext) {
      return;
    }

    try {
      const { state: contextState } = activeContext;
      if (contextState === 'suspended') {
        await activeContext.resume();
      }

      for (const tone of SOUND_CUES[cueName]) {
        playOscillatorTone(activeContext, tone);
      }
    } catch (error) {
      const { message } = error;
      console.warn(`Audio playback skipped: ${message}`);
    }
  }

  return Object.freeze({ playCue });
}
