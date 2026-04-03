const gameState = {
  intStat: 5,
  attempts: 4,
  password: "",
  duds: [],
  dudsRemoved: [],
  history: [],
  isLocked: false,
  specialSequences: [],
};

function getDifficultyParams(intLevel) {
  if (intLevel <= 4) return { wordLength: 4, wordCount: 14, specialCount: 1 };
  if (intLevel <= 7) return { wordLength: 5, wordCount: 10, specialCount: 2 };
  return { wordLength: 7, wordCount: 5, specialCount: 4 };
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

  let wordIndex = 0;
  let specialIndex = 0;
  let baseAddr = 0xf000;

  for (let i = 0; i < 34; i++) {
    let lineContent = generateGarbage(12);

    const rand = Math.random();

    if (wordIndex < words.length && rand > 0.6) {
      const word = words[wordIndex];
      const insertPos = Math.floor(Math.random() * (12 - word.length));
      const htmlWord = `<span class="word" onclick="handleWordClick('${word}')">${word}</span>`;

      lineContent =
        lineContent.substring(0, insertPos) +
        htmlWord +
        lineContent.substring(insertPos + word.length);
      wordIndex++;
    } else if (specialIndex < gameState.specialSequences.length && rand > 0.3) {
      const seq = gameState.specialSequences[specialIndex];
      const insertPos = Math.floor(Math.random() * (12 - seq.length));
      const htmlSeq = `<span class="special" onclick="handleSpecialClick('${seq}')">${seq}</span>`;

      lineContent =
        lineContent.substring(0, insertPos) +
        htmlSeq +
        lineContent.substring(insertPos + seq.length);
      specialIndex++;
    }

    const hexStr = "0x" + baseAddr.toString(16).toUpperCase();
    const lineHTML = `<div><span class="hex-addr">${hexStr}</span> ${lineContent}</div>`;

    if (i < 17) col1.innerHTML += lineHTML;
    else col2.innerHTML += lineHTML;

    baseAddr += 12;
  }
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
    updateConsole("Veuillez Patienter");
    updateConsole("Pendant que le Systeme");
    updateConsole("Est Accede.");
    gameState.isLocked = true;
  } else {
    gameState.attempts--;
    const matches = getMatchCount(guess, gameState.password);
    updateConsole("Entree Refusee");
    updateConsole(`${matches}/${guess.length} Correctes.`);

    updateAttemptsDisplay();

    if (gameState.attempts <= 0) {
      gameState.isLocked = true;
      updateConsole("Verrouillage en cours.");
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
