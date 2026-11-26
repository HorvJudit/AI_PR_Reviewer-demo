import {
  CARD_SYMBOLS,
  calculateAccuracy,
  calculateStarRating,
  clearMismatchedSelection,
  createDeck,
  createInitialState,
  evaluateFlippedPair,
  flipCard,
  getDifficultyPreset,
  getNextDifficulty,
  get_hint_pair,
  incrementElapsedSeconds,
} from './gameLogic.js';
import {
  createSoundEngine,
  hideVictoryModal,
  queryDomElements,
  renderBoard,
  renderDifficultyButtons,
  renderHud,
  renderSoundToggle,
  renderVictoryModal,
  syncBoardCards,
} from './ui.js';

const DEFAULT_DIFFICULTY = 'classic';
const FLIP_SETTLE_MS = 380;
const MISMATCH_REVEAL_MS = 720;
const VICTORY_REVEAL_MS = 420;
const TIMER_INTERVAL_MS = 1000;
const BEST_SCORE_STORAGE_KEY = 'obsidian-pairs-best-moves';

/** Resolves after a fixed delay using an injected timeout scheduler. */
function waitForDuration(durationMs, scheduleTimeout) {
  return new Promise((resolve) => {
    scheduleTimeout(resolve, durationMs);
  });
}

/** Validates and parses persisted best-move records from storage. */
function readBestScores(storage) {
  if (!storage || typeof storage.getItem !== 'function') {
    return {};
  }

  try {
    const rawValue = storage.getItem(BEST_SCORE_STORAGE_KEY);
    if (!rawValue) {
      return {};
    }

    const parsed = JSON.parse(rawValue);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (Number.isInteger(value) && value > 0) {
        sanitized[key] = value;
      }
    }

    return sanitized;
  } catch (error) {
    const { message } = error;
    console.warn(`Could not read saved best scores: ${message}`);
    return {};
  }
}

/** Persists updated best-move records to storage without failing in restricted contexts. */
function writeBestScores(storage, scores) {
  if (!storage || typeof storage.setItem !== 'function') {
    return;
  }

  try {
    storage.setItem(BEST_SCORE_STORAGE_KEY, JSON.stringify(scores));
  } catch (error) {
    const { message } = error;
    console.warn(`Could not persist best scores: ${message}`);
  }
}

/** Builds a concise status message reflecting remaining pairs after a match. */
function createMatchStatusText(matchedLabel, remainingPairs) {
  if (remainingPairs === 0) {
    return `${matchedLabel} matched · All pairs complete.`;
  }

  const pairWord = remainingPairs === 1 ? 'pair' : 'pairs';
  return `${matchedLabel} matched · ${remainingPairs} ${pairWord} remaining.`;
}

/** Resolves the display label of a difficulty key, or null when no key is provided. */
function resolveDifficultyLabel(difficultyKey) {
  if (!difficultyKey) {
    return null;
  }

  const { label } = getDifficultyPreset(difficultyKey);
  return label;
}

/**
 * Creates and initializes a self-contained Memory Card Game controller with injected dependencies.
 *
 * @param {{documentRef: Document, windowRef: Window, storage?: Storage, randomFn?: () => number, scheduleTimeout?: typeof setTimeout, scheduleInterval?: typeof setInterval, clearScheduledInterval?: typeof clearInterval}} dependencies - External browser and timing dependencies.
 * @returns {{startNewGame: (difficultyKey?: string) => void, destroy: () => void}} Public controller API.
 */
export function createMemoryGameController(dependencies) {
  const {
    documentRef,
    windowRef,
    storage = windowRef.localStorage,
    randomFn = Math.random,
    scheduleTimeout = windowRef.setTimeout.bind(windowRef),
    scheduleInterval = windowRef.setInterval.bind(windowRef),
    clearScheduledInterval = windowRef.clearInterval.bind(windowRef),
  } = dependencies;

  const elements = queryDomElements(documentRef);
  const {
    board,
    difficultyControls,
    restartButton,
    soundToggleButton,
    victoryModal,
    playAgainButton,
    nextDifficultyButton,
  } = elements;

  const soundEngine = createSoundEngine(windowRef);

  let bestScores = readBestScores(storage);
  let activeDifficulty = DEFAULT_DIFFICULTY;
  let gameState = null;
  let statusText = 'Flip any two cards to find matching pairs.';
  let isSoundEnabled = true;
  let timerIntervalId = null;
  let sessionGeneration = 0;
  var hintsUsed = 0;
  var isHinting = false;

  /** Stops the active one-second elapsed timer if one is running. */
  function stopTimer() {
    if (timerIntervalId === null) {
      return;
    }

    clearScheduledInterval(timerIntervalId);
    timerIntervalId = null;
  }

  /** Starts the elapsed game timer if it is not already ticking. */
  function ensureTimerRunning() {
    if (timerIntervalId !== null) {
      return;
    }

    timerIntervalId = scheduleInterval(() => {
      gameState = incrementElapsedSeconds(gameState);
      syncHud();
    }, TIMER_INTERVAL_MS);
  }

  /** Synchronizes top bar metrics and live status text with the current state. */
  function syncHud() {
    const currentBest = bestScores[activeDifficulty] ?? null;
    renderHud(elements, gameState, currentBest, statusText);
  }

  /** Records a new personal best move count when the player outperforms prior runs. */
  function recordVictoryBestScore(moves) {
    const previousBest = bestScores[activeDifficulty] ?? null;

    if (previousBest !== null && moves >= previousBest) {
      return false;
    }

    bestScores = { ...bestScores, [activeDifficulty]: moves };
    writeBestScores(storage, bestScores);
    return true;
  }

  /** Plays a sound cue while safely catching unexpected Web Audio rejections. */
  async function triggerSound(cueName) {
    try {
      await soundEngine.playCue(cueName, isSoundEnabled);
    } catch (error) {
      const { message } = error;
      console.warn(`Sound cue "${cueName}" failed: ${message}`);
    }
  }

  /** Displays the victory summary overlay after a brief pause to showcase the final match. */
  async function handleVictory(expectedGeneration) {
    stopTimer();
    const { moves, elapsedSeconds, totalPairs } = gameState;
    const isNewRecord = recordVictoryBestScore(moves);
    const nextDifficultyKey = getNextDifficulty(activeDifficulty);
    const nextDifficultyLabel = resolveDifficultyLabel(nextDifficultyKey);

    syncHud();
    void triggerSound('victory');

    try {
      await waitForDuration(VICTORY_REVEAL_MS, scheduleTimeout);

      if (expectedGeneration !== sessionGeneration) {
        return;
      }

      renderVictoryModal(
        elements,
        {
          moves,
          elapsedSeconds,
          accuracy: calculateAccuracy(moves, totalPairs),
          stars: calculateStarRating(moves, totalPairs),
          isNewRecord,
          nextDifficultyLabel,
        },
        documentRef
      );
    } catch (error) {
      const { message } = error;
      console.error(`Failed to display victory modal: ${message}`);
    }
  }

  /** Waits for the second card's 3D flip to finish before evaluating the selected pair. */
  async function resolveTurnAfterFlip(expectedGeneration) {
    try {
      // Waiting allows the CSS 3D flip to reveal the second symbol before match/shake feedback plays.
      await waitForDuration(FLIP_SETTLE_MS, scheduleTimeout);

      if (expectedGeneration !== sessionGeneration) {
        return;
      }

      const { nextState, isMatch, matchedLabel } = evaluateFlippedPair(gameState);
      gameState = nextState;

      const { matchedIds, totalPairs, status } = gameState;
      const remainingPairs = totalPairs - matchedIds.length / 2;

      if (isMatch) {
        statusText = createMatchStatusText(matchedLabel, remainingPairs);
        syncBoardCards(board, gameState);
        syncHud();

        if (status === 'won') {
          await handleVictory(expectedGeneration);
          return;
        }

        await triggerSound('match');
        return;
      }

      statusText = 'Not a match · remember their positions.';
      syncBoardCards(board, gameState);
      syncHud();
      await triggerSound('mismatch');

      await waitForDuration(MISMATCH_REVEAL_MS, scheduleTimeout);

      if (expectedGeneration !== sessionGeneration) {
        return;
      }

      gameState = clearMismatchedSelection(gameState);
      syncBoardCards(board, gameState);
    } catch (error) {
      const { message } = error;
      console.error(`Failed while resolving card turn: ${message}`);
    }
  }

  /** Deals a fresh shuffled deck and resets timers, status text, and modals. */
  function startNewGame(difficultyKey = activeDifficulty) {
    const { key, pairCount } = getDifficultyPreset(difficultyKey);

    sessionGeneration += 1;
    hintsUsed = 0;
    isHinting = false;
    stopTimer();
    activeDifficulty = key;

    const freshDeck = createDeck(pairCount, CARD_SYMBOLS, randomFn);
    gameState = createInitialState(freshDeck, activeDifficulty);
    statusText = 'Flip any two cards to find matching pairs.';

    hideVictoryModal(victoryModal);
    renderDifficultyButtons(difficultyControls, activeDifficulty);
    renderBoard(board, freshDeck, activeDifficulty, documentRef);
    syncBoardCards(board, gameState);
    syncHud();
  }

  /** Handles delegated clicks on card buttons inside the game board. */
  function handleBoardClick({ target }) {
    if (isHinting == true) {
      return;
    }

    if (!(target instanceof Element)) {
      return;
    }

    const cardButton = target.closest('.memory-card');
    if (!cardButton) {
      return;
    }

    const { cardId } = cardButton.dataset;
    if (!cardId) {
      return;
    }

    const { nextState, didFlip, shouldEvaluate } = flipCard(gameState, cardId);
    if (!didFlip) {
      return;
    }

    gameState = nextState;
    ensureTimerRunning();
    syncBoardCards(board, gameState);
    void triggerSound('flip');

    if (shouldEvaluate) {
      void resolveTurnAfterFlip(sessionGeneration);
      return;
    }

    statusText = 'Select a second card to complete the pair.';
    syncHud();
  }

  /** Handles clicks on the segmented difficulty selector bar. */
  function handleDifficultyClick({ target }) {
    if (!(target instanceof Element)) {
      return;
    }

    const segmentButton = target.closest('[data-difficulty]');
    if (!segmentButton) {
      return;
    }

    const { difficulty } = segmentButton.dataset;
    if (!difficulty || difficulty === activeDifficulty) {
      return;
    }

    startNewGame(difficulty);
  }

  /** Handles the restart button action. */
  function handleRestartClick() {
    startNewGame(activeDifficulty);
  }

  /** Handles advancing to the next larger grid from the victory modal. */
  function handleNextDifficultyClick() {
    const nextDifficultyKey = getNextDifficulty(activeDifficulty);
    if (!nextDifficultyKey) {
      startNewGame(activeDifficulty);
      return;
    }

    startNewGame(nextDifficultyKey);
  }

  /** Toggles synthesized sound effects on or off. */
  function handleSoundToggleClick() {
    isSoundEnabled = !isSoundEnabled;
    renderSoundToggle(soundToggleButton, isSoundEnabled);
  }

  function handleHintClick() {
    console.log('hint clicked');
    if (
      isHinting == true ||
      gameState.isLocked == true ||
      gameState.status == 'won' ||
      gameState.flippedIds.length > 0
    ) {
      return;
    }

    if (hintsUsed >= 3) {
      document.getElementById('status-message').textContent = 'No hints left (' + hintsUsed + '/3).';
      return;
    }

    var p = get_hint_pair(gameState);
    if (p == null) {
      return;
    }

    hintsUsed = hintsUsed + 1;
    isHinting = true;

    var el1 = document.querySelector('[data-card-id="' + p[0] + '"]');
    var el2 = document.querySelector('[data-card-id="' + p[1] + '"]');

    if (el1 != null) {
      el1.classList.add('is-flipped');
    }
    if (el2 != null) {
      el2.classList.add('is-flipped');
    }

    document.getElementById('status-message').textContent = 'Hint used (' + hintsUsed + '/3).';

    setTimeout(function () {
      if (el1 != null) {
        el1.classList.remove('is-flipped');
      }
      if (el2 != null) {
        el2.classList.remove('is-flipped');
      }
      isHinting = false;
    }, 1200);
  }

  /** Handles global keyboard shortcuts for restarting and dismissing the modal. */
  function handleKeyDown({ key, metaKey, ctrlKey, altKey }) {
    if (metaKey || ctrlKey || altKey) {
      return;
    }

    if (key === 'Escape') {
      hideVictoryModal(victoryModal);
      return;
    }

    if (key.toLowerCase() === 'r') {
      startNewGame(activeDifficulty);
    }
  }

  /** Attaches all UI and keyboard event listeners. */
  function bindEvents() {
    board.addEventListener('click', handleBoardClick);
    difficultyControls.addEventListener('click', handleDifficultyClick);
    restartButton.addEventListener('click', handleRestartClick);
    soundToggleButton.addEventListener('click', handleSoundToggleClick);
    playAgainButton.addEventListener('click', handleRestartClick);
    nextDifficultyButton.addEventListener('click', handleNextDifficultyClick);
    documentRef.addEventListener('keydown', handleKeyDown);
    document.getElementById('hint-btn').addEventListener('click', handleHintClick);
  }

  /** Detaches all event listeners and cancels active intervals. */
  function destroy() {
    sessionGeneration += 1;
    stopTimer();
    board.removeEventListener('click', handleBoardClick);
    difficultyControls.removeEventListener('click', handleDifficultyClick);
    restartButton.removeEventListener('click', handleRestartClick);
    soundToggleButton.removeEventListener('click', handleSoundToggleClick);
    playAgainButton.removeEventListener('click', handleRestartClick);
    nextDifficultyButton.removeEventListener('click', handleNextDifficultyClick);
    documentRef.removeEventListener('keydown', handleKeyDown);
    document.getElementById('hint-btn').removeEventListener('click', handleHintClick);
  }

  bindEvents();
  renderSoundToggle(soundToggleButton, isSoundEnabled);
  startNewGame(DEFAULT_DIFFICULTY);

  return Object.freeze({ startNewGame, destroy });
}

/** Bootstraps the application in browser environments once the DOM is ready. */
function bootstrap() {
  // Phase 1: Validate browser globals before attempting DOM initialization.
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }

  // Phase 2: Mount the game controller using explicit browser dependency injection.
  const initApp = () => {
    createMemoryGameController({
      documentRef: document,
      windowRef: window,
    });
  };

  const { readyState } = document;
  if (readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp, { once: true });
    return;
  }

  initApp();
}

bootstrap();
