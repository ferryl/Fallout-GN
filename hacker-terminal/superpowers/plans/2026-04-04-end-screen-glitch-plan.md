# End Screen Glitch & Typewriter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implémenter l'écran de fin de piratage avec effet glitch, effacement du terminal, et affichage machine à écrire du résultat (Succès/Échec).

**Architecture:** 
- Ajout d'une superposition `div#end-screen` dans `index.html` (cachée par défaut).
- Animations CSS (`glitch`, `typewriter`, `blink`) dans `styles.css`.
- Logique de transition temporisée (setTimeout) dans `game.js` pour séquencer le glitch, l'affichage du texte et l'apparition du bouton de redémarrage.

**Tech Stack:** HTML, CSS, Vanilla JavaScript

---

### Task 1: Structure HTML pour l'écran de fin

**Files:**
- Modify: `/Users/ferryl/Code/Perso/Fallout-GN/hacker-terminal/index.html`

- [ ] **Step 1: Ajouter le conteneur de fin de partie**
Ajouter une nouvelle `div` pour l'écran de fin, juste avant la fermeture de `.terminal-container`.

```html
        <!-- ... code existant ... -->
        <aside class="console-output" id="console">
            <!-- Historique des clics -->
        </aside>
        
        <!-- NOUVEAU: Écran de fin (caché par défaut) -->
        <div id="end-screen" class="hidden">
            <div id="end-typewriter"></div>
            <div id="end-center-text"></div>
            <div id="end-restart-prompt" class="hidden">> CLIQUEZ POUR REDÉMARRER_</div>
        </div>
    </div>
    <script src="words.js"></script>
```

- [ ] **Step 2: Commit**
```bash
rtk but commit -m "feat: add HTML structure for end screen"
```

---

### Task 2: Styles CSS pour le Glitch et l'écran de fin

**Files:**
- Modify: `/Users/ferryl/Code/Perso/Fallout-GN/hacker-terminal/styles.css`

- [ ] **Step 1: Ajouter les styles de l'écran de fin et animations**
Ajouter à la fin du fichier `styles.css`.

```css
/* --- End Screen Styles --- */
#end-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color); /* Masque le reste */
    z-index: 10; /* Au dessus de main et header */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
    box-sizing: border-box;
}

#end-screen.hidden {
    display: none;
}

#end-typewriter {
    position: absolute;
    top: 40px;
    left: 40px;
    font-size: 24px;
    /* L'animation typewriter sera gérée en JS pour plus de contrôle ou via une classe CSS */
}

#end-center-text {
    font-size: 64px;
    text-align: center;
    animation: blinkTextCursor 2s infinite normal;
    opacity: 0; /* Caché au début */
}

#end-center-text.visible {
    opacity: 1;
}

#end-restart-prompt {
    position: absolute;
    bottom: 40px;
    font-size: 24px;
    animation: blinkTextCursor 1s infinite normal;
    cursor: pointer;
}

#end-restart-prompt.hidden {
    display: none;
}

#end-restart-prompt:hover {
    background-color: var(--phosphor);
    color: var(--bg-color);
}

/* Glitch Effect on the main container */
.glitch-effect {
    animation: glitch-anim 0.5s linear infinite;
}

@keyframes glitch-anim {
    0% { transform: translate(0) }
    20% { transform: translate(-5px, 2px); text-shadow: 2px 0 var(--crt-red), -2px 0 var(--crt-blue); }
    40% { transform: translate(-5px, -2px); text-shadow: -2px 0 var(--crt-red), 2px 0 var(--crt-blue); }
    60% { transform: translate(5px, 2px); text-shadow: 2px 0 var(--crt-red), -2px 0 var(--crt-blue); }
    80% { transform: translate(5px, -2px); text-shadow: -2px 0 var(--crt-red), 2px 0 var(--crt-blue); }
    100% { transform: translate(0) }
}
```

- [ ] **Step 2: Commit**
```bash
rtk but commit -m "feat: add CSS for end screen layout and glitch animation"
```

---

### Task 3: Logique JS de la séquence de fin (Game Over / Success)

**Files:**
- Modify: `/Users/ferryl/Code/Perso/Fallout-GN/hacker-terminal/game.js`

- [ ] **Step 1: Créer la fonction `triggerEndSequence`**
Ajouter cette fonction à la fin de `game.js`. Elle gère le séquençage exact décrit dans la spec.

```javascript
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
                    resetGame();
                };
                document.addEventListener('click', resetGameHandler);
                
            }, 2000); // 2 secondes après le texte central
        });

    }, 500); // 0.5s de glitch
}
```

- [ ] **Step 2: Commit**
```bash
rtk but commit -m "feat: implement end sequence timing and typewriter logic"
```

---

### Task 4: Intégrer la séquence et réinitialiser le jeu

**Files:**
- Modify: `/Users/ferryl/Code/Perso/Fallout-GN/hacker-terminal/game.js`

- [ ] **Step 1: Modifier `handleWordClick` pour appeler la séquence**
Trouver `handleWordClick(guess)` et remplacer le contenu des blocs de succès et de verrouillage.

```javascript
// Remplacer dans handleWordClick :

  if (guess === gameState.password) {
    updateConsole("Correspondance Exacte!");
    gameState.isLocked = true;
    triggerEndSequence(true); // Appel au succès
  } else {
    // ...
    if (gameState.attempts <= 0) {
      gameState.isLocked = true;
      updateConsole("Verrouillage en cours.");
      triggerEndSequence(false); // Appel à l'échec
    }
  }
```

- [ ] **Step 2: Créer la fonction `resetGame`**
Ajouter `resetGame` à la fin de `game.js` pour restaurer l'affichage et relancer une partie.

```javascript
function resetGame() {
    const mainContainer = document.querySelector('main');
    const headerContainer = document.querySelector('header');
    const consoleContainer = document.getElementById('console');
    const endScreen = document.getElementById('end-screen');

    // Restaurer l'affichage
    mainContainer.style.display = ''; // Retire le display: none en ligne, utilise le CSS (flex)
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
```

- [ ] **Step 3: Commit**
```bash
rtk but commit -m "feat: wire up end sequence and reset game logic"
```
