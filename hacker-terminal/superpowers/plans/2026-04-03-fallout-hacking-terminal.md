# Hacking Terminal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire un mini-jeu de piratage de terminal style Fallout en HTML/CSS/JS Vanilla avec un rendu CRT dynamique et une difficulté basée sur les statistiques (INT).

**Architecture:** Une architecture Frontend pure. `index.html` pour la structure, `styles.css` pour l'effet CRT (scanlines, glow) et la grille, `words.js` contenant le dictionnaire brut, et `game.js` contenant la logique d'état, la génération de la grille aléatoire et la gestion des événements de clics.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript.

---

## Task 1: Structure HTML et Calque CRT CSS

**Files:**
- Create: `index.html`
- Create: `styles.css`

- [ ] **Step 1: Créer le squelette HTML (`index.html`)**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ROBCO Terminal</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
</head>
<body>
    <div class="crt-overlay"></div>
    <div class="terminal-container">
        <header>
            <h1>ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM</h1>
            <h2>COPYRIGHT 2075-2077 ROBCO INDUSTRIES</h2>
            <div id="password-prompt">-Server 1-</div>
            <br>
            <div>Enter Password</div>
            <div id="attempts-container">
                <span id="attempts-remaining">4 ATTEMPT(S) LEFT:</span>
                <span id="attempts-blocks">■ ■ ■ ■</span>
            </div>
            <br>
        </header>
        <main class="grid-container">
            <div class="column" id="col-1"></div>
            <div class="column" id="col-2"></div>
        </main>
        <aside class="console-output" id="console">
            <!-- Historique des clics -->
        </aside>
    </div>
    <script src="words.js"></script>
    <script src="game.js"></script>
</body>
</html>
```

- [ ] **Step 2: Implémenter l'effet CRT et les styles de base (`styles.css`)**

```css
:root {
    --phosphor: #16c60c;
    --bg-color: #000000;
}

body {
    background-color: var(--bg-color);
    color: var(--phosphor);
    font-family: 'VT323', monospace;
    font-size: 24px;
    margin: 0;
    overflow: hidden;
    text-shadow: 0 0 5px var(--phosphor); /* Glow effect */
}

.crt-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.15),
        rgba(0, 0, 0, 0.15) 1px,
        transparent 1px,
        transparent 2px
    );
    pointer-events: none;
    z-index: 100;
}

.terminal-container {
    padding: 20px 40px;
    height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.grid-container {
    display: flex;
    gap: 40px;
    flex-grow: 1;
}

.column {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.hex-addr {
    display: inline-block;
    width: 80px;
}

.word:hover {
    background-color: var(--phosphor);
    color: var(--bg-color);
    cursor: pointer;
}
```

---

## Task 2: Dictionnaire et Logique de Difficulté (INT)

**Files:**
- Create: `words.js`
- Create: `game.js`

- [ ] **Step 1: Créer un petit dictionnaire dans `words.js`**

```javascript
const DICTIONARY = {
    4: ["FALL", "BALL", "CALL", "TALL", "MALL", "WALL", "HALL", "MILK", "SILK", "HUNT", "HINT", "TINT"],
    5: ["WATER", "LATER", "CATER", "HATER", "GHOST", "GHOST", "TOAST", "ROAST", "BOAST", "BEAST"],
    7: ["FALLING", "CALLING", "TALLING", "MALLING", "HUNTING", "HINTING", "TINTING", "TESTING", "RESTING", "WASTING"]
};

// Caractères poubelles pour remplir l'écran
const GARBAGE_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
```

- [ ] **Step 2: Créer le gestionnaire d'état et la config selon l'INT (`game.js`)**

```javascript
const gameState = {
    intStat: 5, // A récupérer dynamiquement plus tard
    attempts: 4,
    password: "",
    duds: [],
    history: [],
    isLocked: false
};

function getDifficultyParams(intLevel) {
    if (intLevel <= 4) return { wordLength: 4, wordCount: 6 };
    if (intLevel <= 7) return { wordLength: 5, wordCount: 10 };
    return { wordLength: 7, wordCount: 14 }; // Hard (INT 8+)
}
```

---

## Task 3: Génération de la Grille et Injection des Mots

**Files:**
- Modify: `game.js`

- [ ] **Step 1: Génération de la vue Hexadécimale et du texte poubelle (`game.js`)**

```javascript
function generateGarbage(length) {
    let result = "";
    for(let i = 0; i < length; i++) {
        result += GARBAGE_CHARS.charAt(Math.floor(Math.random() * GARBAGE_CHARS.length));
    }
    return result;
}

function initGame() {
    const params = getDifficultyParams(gameState.intStat);
    const availableWords = [...DICTIONARY[params.wordLength]];
    
    // Shuffle words
    availableWords.sort(() => 0.5 - Math.random());
    
    // Select password and duds
    gameState.password = availableWords[0];
    gameState.duds = availableWords.slice(1, params.wordCount);
    
    const allWords = [gameState.password, ...gameState.duds].sort(() => 0.5 - Math.random());
    
    renderGrid(allWords);
}
```

- [ ] **Step 2: Rendu du HTML dans les colonnes (`game.js`)**

```javascript
function renderGrid(words) {
    const col1 = document.getElementById('col-1');
    const col2 = document.getElementById('col-2');
    col1.innerHTML = '';
    col2.innerHTML = '';

    let wordIndex = 0;
    let baseAddr = 0xF000;

    for (let i = 0; i < 34; i++) { // 34 lines total (17 per col)
        let lineContent = generateGarbage(12);
        
        // Randomly inject a word in this line
        if (wordIndex < words.length && Math.random() > 0.5) {
            const word = words[wordIndex];
            const insertPos = Math.floor(Math.random() * (12 - word.length));
            const htmlWord = `<span class="word" onclick="handleWordClick('${word}')">${word}</span>`;
            
            lineContent = lineContent.substring(0, insertPos) + htmlWord + lineContent.substring(insertPos + word.length);
            wordIndex++;
        }

        const hexStr = "0x" + baseAddr.toString(16).toUpperCase();
        const lineHTML = `<div><span class="hex-addr">${hexStr}</span> ${lineContent}</div>`;
        
        if (i < 17) col1.innerHTML += lineHTML;
        else col2.innerHTML += lineHTML;
        
        baseAddr += 12;
    }
}

// Start the game
initGame();
```

---

## Task 4: Mécanique de Comparaison et de Victoire/Défaite

**Files:**
- Modify: `game.js`

- [ ] **Step 1: Gérer les clics et calculer les lettres communes (`game.js`)**

```javascript
function getMatchCount(guess, pass) {
    let matches = 0;
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === pass[i]) matches++;
    }
    return matches;
}

function updateConsole(text) {
    const consoleDiv = document.getElementById('console');
    gameState.history.push(text);
    if(gameState.history.length > 5) gameState.history.shift();
    
    consoleDiv.innerHTML = gameState.history.join('<br>');
}

function handleWordClick(guess) {
    if (gameState.isLocked) return;

    updateConsole(`>${guess}`);

    if (guess === gameState.password) {
        updateConsole("Exact Match!");
        updateConsole("Please Wait");
        updateConsole("While System");
        updateConsole("Is Accessed.");
        gameState.isLocked = true;
        // Trigger win visual effect
    } else {
        gameState.attempts--;
        const matches = getMatchCount(guess, gameState.password);
        updateConsole("Entry Denied");
        updateConsole(`${matches}/${guess.length} Correct.`);
        
        updateAttemptsDisplay();

        if (gameState.attempts <= 0) {
            gameState.isLocked = true;
            updateConsole("Lockout in progress.");
        }
    }
}

function updateAttemptsDisplay() {
    const blocksSpan = document.getElementById('attempts-blocks');
    blocksSpan.textContent = "■ ".repeat(gameState.attempts).trim();
}
```

*(Note : L'implémentation des Séquences Spéciales comme `[#*+]` pour retirer des leurres ou regagner des essais sera la tâche 5 optionnelle, ajoutant la logique de parsing sur les symboles générés dans `generateGarbage`.)*

---

## Plan Completion

- [ ] **Plan document created**

**Two execution options:**

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
