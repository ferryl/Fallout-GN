const TIMING = {
  GLITCH_DURATION: 500,
  TYPEWRITER_SPEED: 50,
  RESTART_PROMPT_DELAY: 2000
};

const MESSAGES = {
  SUCCESS_TYPEWRITER: "> MOT DE PASSE ACCEPTÉ...",
  SUCCESS_CENTER: "ACCÈS AUTORISÉ",
  FAILURE_TYPEWRITER: "> TENTATIVES ÉPUISÉES...",
  FAILURE_CENTER: "VERROUILLAGE DU SYSTÈME"
};

const DOM = {
  mainContainer: document.querySelector('main'),
  headerContainer: document.querySelector('header'),
  consoleContainer: document.getElementById('console'),
  endScreen: document.getElementById('end-screen'),
  typewriterEl: document.getElementById('end-typewriter'),
  centerTextEl: document.getElementById('end-center-text'),
  restartPrompt: document.getElementById('end-restart-prompt')
};

let activeTypewriterTimeout = null;

const gameState = {
  intStat: 6,
  attempts: 4,
  password: "",
  duds: [],
  dudsRemoved: [],
  history: [],
  isLocked: false,
  specialSequences: [],
};

function getDifficultyParams(intLevel) {
  if (intLevel <= 4) return { wordLength: 4, wordCount: 16, specialCount: 1 };
  if (intLevel <= 7) return { wordLength: 5, wordCount: 12, specialCount: 2 };
  return { wordLength: 7, wordCount: 7, specialCount: 4 };
}

function generateGarbage(length) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += GARBAGE_CHARS.charAt(
      Math.floor(Math.random() * GARBAGE_CHARS.length),
    );
  }
  return result;
}

function initGame() {
  const params = getDifficultyParams(gameState.intStat);
  const availableWords = [...DICTIONARY[params.wordLength]];

  availableWords.sort(() => 0.5 - Math.random());

  gameState.password = availableWords[0];
  gameState.duds = availableWords.slice(1, params.wordCount);
  gameState.dudsRemoved = [];

  const allWords = [gameState.password, ...gameState.duds].sort(
    () => 0.5 - Math.random(),
  );

  gameState.specialSequences = [];
  for (let i = 0; i < params.specialCount; i++) {
    gameState.specialSequences.push(generateSpecialSequence());
  }

  renderGrid(allWords);
  updateAttemptsDisplay();
}

function renderGrid(words) {
  const col1 = document.getElementById("col-1");
  const col2 = document.getElementById("col-2");
  col1.innerHTML = "";
  col2.innerHTML = "";

  const halfWords = Math.ceil(words.length / 2);
  const wordsCol1 = words.slice(0, halfWords);
  const wordsCol2 = words.slice(halfWords);

  const halfSpecials = Math.ceil(gameState.specialSequences.length / 2);
  const specialsCol1 = gameState.specialSequences.slice(0, halfSpecials);
  const specialsCol2 = gameState.specialSequences.slice(halfSpecials);

  let baseAddr = 0xf000;

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, function(tag) {
      const charsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      };
      return charsToReplace[tag] || tag;
    });
  }

  function fillColumn(container, columnWords, columnSpecials) {
    const lineTypes = [
      ...columnWords.map((w) => ({ type: "word", value: w })),
      ...columnSpecials.map((s) => ({ type: "special", value: s })),
      ...Array(17 - columnWords.length - columnSpecials.length).fill({
        type: "garbage",
      }),
    ].sort(() => Math.random() - 0.5);

    lineTypes.forEach((line) => {
      let lineContent = generateGarbage(12);

      if (line.type === "word") {
        const word = line.value;
        const insertPos = Math.floor(Math.random() * (12 - word.length));
        const htmlWord = `<span class="word" onclick="handleWordClick('${word}')">${word}</span>`;
        lineContent =
          escapeHTML(lineContent.substring(0, insertPos)) +
          htmlWord +
          escapeHTML(lineContent.substring(insertPos + word.length));
      } else if (line.type === "special") {
        const seq = line.value;
        const insertPos = Math.floor(Math.random() * (12 - seq.length));
        const htmlSeq = `<span class="special" onclick="handleSpecialClick(this.textContent)">${escapeHTML(seq)}</span>`;
        lineContent =
          escapeHTML(lineContent.substring(0, insertPos)) +
          htmlSeq +
          escapeHTML(lineContent.substring(insertPos + seq.length));
      } else {
        lineContent = escapeHTML(lineContent);
      }

      const hexStr = "0x" + baseAddr.toString(16).toUpperCase();
      container.innerHTML += `<div><span class="hex-addr">${hexStr}</span> ${lineContent}</div>`;
      baseAddr += 12;
    });
  }

  fillColumn(col1, wordsCol1, specialsCol1);
  fillColumn(col2, wordsCol2, specialsCol2);
}

initGame();

function getMatchCount(guess, pass) {
  let matches = 0;
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === pass[i]) matches++;
  }
  return matches;
}

function updateConsole(text) {
  const consoleDiv = document.getElementById("console");
  gameState.history.push(text);
  if (gameState.history.length > 7) gameState.history.shift();

  consoleDiv.innerHTML = gameState.history.join("<br>");
}

function handleWordClick(guess) {
  if (gameState.isLocked) return;

  updateConsole(`>${guess}`);

  if (guess === gameState.password) {
    updateConsole("Correspondance Exacte!");
    gameState.isLocked = true;
    triggerEndSequence(true); // Appel au succès
  } else {
    gameState.attempts--;
    const matches = getMatchCount(guess, gameState.password);
    updateConsole("Entree Refusee");
    updateConsole(`${matches}/${guess.length} Correctes.`);

    updateAttemptsDisplay();

    if (gameState.attempts <= 0) {
      gameState.isLocked = true;
      updateConsole("Verrouillage en cours.");
      triggerEndSequence(false); // Appel à l'échec
    }
  }
}

function updateAttemptsDisplay() {
  const attemptsLabel = document.getElementById("attempts-remaining");
  const blocksSpan = document.getElementById("attempts-blocks");
  attemptsLabel.textContent = gameState.attempts + " ESSAI(S) RESTANT(S) :";
  blocksSpan.textContent = "■ ".repeat(gameState.attempts).trim();
}

function handleSpecialClick(seq) {
  if (gameState.isLocked) return;

  // Remplacer la séquence par des points (usage unique)
  const allSpecials = document.querySelectorAll(".special");
  allSpecials.forEach((span) => {
    if (span.textContent === seq) {
      span.textContent = ".".repeat(seq.length);
      span.classList.add("removed");
      span.onclick = null;
    }
  });

  updateConsole(`>${seq}`);

  const effect = Math.random() > 0.33;

  if (effect) {
    const availableDuds = gameState.duds.filter(
      (d) => !gameState.dudsRemoved.includes(d),
    );
    if (availableDuds.length > 0) {
      const dudToRemove =
        availableDuds[Math.floor(Math.random() * availableDuds.length)];
      gameState.dudsRemoved.push(dudToRemove);
      updateConsole(" Leurre retire: " + dudToRemove);

      const allSpans = document.querySelectorAll(".word");
      allSpans.forEach((span) => {
        if (span.textContent === dudToRemove) {
          const dots = ".".repeat(dudToRemove.length);
          span.textContent = dots;
          span.classList.add("removed");
          span.onclick = null;
        }
      });
    }
  } else {
    gameState.attempts = Math.min(gameState.attempts + 1, 4);
    updateAttemptsDisplay();
    updateConsole(" Essais Reinitialises!");
  }
}

// --- Séquence de Fin ---

function typeWriterEffect(element, text, speed, callback) {
  if (activeTypewriterTimeout) clearTimeout(activeTypewriterTimeout);
  element.textContent = "";
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      activeTypewriterTimeout = setTimeout(typeWriter, speed);
    } else if (callback) {
      callback();
    }
  }
  typeWriter();
}

function triggerEndSequence(isSuccess) {
  // 1. Le Choc (Effet Glitch)
  DOM.mainContainer.classList.add('glitch-effect');
  DOM.headerContainer.classList.add('glitch-effect');
  DOM.consoleContainer.classList.add('glitch-effect');

  setTimeout(() => {
    // 2. Le Vide
    DOM.mainContainer.classList.remove('glitch-effect');
    DOM.headerContainer.classList.remove('glitch-effect');
    DOM.consoleContainer.classList.remove('glitch-effect');

    DOM.mainContainer.style.display = 'none';
    DOM.headerContainer.style.display = 'none';
    DOM.consoleContainer.style.display = 'none';

    DOM.endScreen.classList.remove('hidden');
    DOM.centerTextEl.classList.remove('visible');
    DOM.restartPrompt.classList.add('hidden');
    DOM.typewriterEl.textContent = "";

    // Textes selon le résultat
    const typeText = isSuccess ? MESSAGES.SUCCESS_TYPEWRITER : MESSAGES.FAILURE_TYPEWRITER;
    const centerText = isSuccess ? MESSAGES.SUCCESS_CENTER : MESSAGES.FAILURE_CENTER;

    // 3. Le Verdict (Typewriter)
    typeWriterEffect(DOM.typewriterEl, typeText, TIMING.TYPEWRITER_SPEED, () => {
      // Après le typewriter, afficher le texte central
      DOM.centerTextEl.textContent = centerText;
      DOM.centerTextEl.classList.add('visible');

      // 4. Relance
      setTimeout(() => {
        DOM.restartPrompt.classList.remove('hidden');

        // Ajouter l'écouteur de clic pour redémarrer
        // On utilise une fonction nommée pour pouvoir la retirer ensuite
        const resetGameHandler = () => {
          DOM.endScreen.removeEventListener('click', resetGameHandler);
          // On suppose que resetGame existe (sera défini à la tâche 4)
          if (typeof resetGame === 'function') resetGame();
        };
        DOM.endScreen.addEventListener('click', resetGameHandler);

      }, TIMING.RESTART_PROMPT_DELAY); // Délai après le texte central
    });

  }, TIMING.GLITCH_DURATION); // Durée de glitch
}

function resetGame() {
  // Restaurer l'affichage
  DOM.mainContainer.style.display = '';
  DOM.headerContainer.style.display = '';
  DOM.consoleContainer.style.display = '';

  // Cacher l'écran de fin
  DOM.endScreen.classList.add('hidden');

  // Réinitialiser le state
  gameState.attempts = 4;
  gameState.history = [];
  gameState.isLocked = false;
  DOM.consoleContainer.innerHTML = "";

  // Relancer
  initGame();
}
