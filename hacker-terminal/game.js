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
          lineContent.substring(0, insertPos) +
          htmlWord +
          lineContent.substring(insertPos + word.length);
      } else if (line.type === "special") {
        const seq = line.value;
        const insertPos = Math.floor(Math.random() * (12 - seq.length));
        const htmlSeq = `<span class="special" onclick="handleSpecialClick('${seq}')">${seq}</span>`;
        lineContent =
          lineContent.substring(0, insertPos) +
          htmlSeq +
          lineContent.substring(insertPos + seq.length);
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
  if (gameState.history.length > 5) gameState.history.shift();

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
      updateConsole(" Dud Retire: " + dudToRemove);

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
    element.textContent = "";
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        } else if (callback) {
            callback();
        }
    }
    typeWriter();
}

function triggerEndSequence(isSuccess) {
    const mainContainer = document.querySelector('main');
    const headerContainer = document.querySelector('header');
    const consoleContainer = document.getElementById('console');
    const endScreen = document.getElementById('end-screen');
    const typewriterEl = document.getElementById('end-typewriter');
    const centerTextEl = document.getElementById('end-center-text');
    const restartPrompt = document.getElementById('end-restart-prompt');

    // 1. Le Choc (Effet Glitch)
    mainContainer.classList.add('glitch-effect');
    headerContainer.classList.add('glitch-effect');
    consoleContainer.classList.add('glitch-effect');

    setTimeout(() => {
        // 2. Le Vide
        mainContainer.classList.remove('glitch-effect');
        headerContainer.classList.remove('glitch-effect');
        consoleContainer.classList.remove('glitch-effect');
        
        mainContainer.style.display = 'none';
        headerContainer.style.display = 'none';
        consoleContainer.style.display = 'none';
        
        endScreen.classList.remove('hidden');
        centerTextEl.classList.remove('visible');
        restartPrompt.classList.add('hidden');
        typewriterEl.textContent = "";

        // Textes selon le résultat
        const typeText = isSuccess ? "> MOT DE PASSE ACCEPTÉ..." : "> TENTATIVES ÉPUISÉES...";
        const centerText = isSuccess ? "ACCÈS AUTORISÉ" : "VERROUILLAGE DU SYSTÈME";

        // 3. Le Verdict (Typewriter)
        typeWriterEffect(typewriterEl, typeText, 50, () => {
            // Après le typewriter, afficher le texte central
            centerTextEl.textContent = centerText;
            centerTextEl.classList.add('visible');

            // 4. Relance
            setTimeout(() => {
                restartPrompt.classList.remove('hidden');
                
                // Ajouter l'écouteur de clic pour redémarrer
                // On utilise une fonction nommée pour pouvoir la retirer ensuite
                const resetGameHandler = () => {
                    document.removeEventListener('click', resetGameHandler);
                    // On suppose que resetGame existe (sera défini à la tâche 4)
                    if (typeof resetGame === 'function') resetGame();
                };
                document.addEventListener('click', resetGameHandler);
                
            }, 2000); // 2 secondes après le texte central
        });

    }, 500); // 0.5s de glitch
}

function resetGame() {
    const mainContainer = document.querySelector('main');
    const headerContainer = document.querySelector('header');
    const consoleContainer = document.getElementById('console');
    const endScreen = document.getElementById('end-screen');

    // Restaurer l'affichage
    mainContainer.style.display = ''; 
    headerContainer.style.display = '';
    consoleContainer.style.display = '';
    
    // Cacher l'écran de fin
    endScreen.classList.add('hidden');
    
    // Réinitialiser le state
    gameState.attempts = 4;
    gameState.history = [];
    gameState.isLocked = false;
    document.getElementById("console").innerHTML = "";
    
    // Relancer
    initGame();
}
