# CRT Scanline Effect Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a CRT scanline sweeping effect with localized physical distortion and increased phosphor brightness for the Fallout hacking terminal.

**Architecture:** The effect will be implemented using CSS animations and a duplicate layer masking technique. A `scanline-bar` element will animate down the screen, and a `distorted-layer` element (a copy of the terminal's content) will have CSS effects applied to it. A CSS mask will reveal the `distorted-layer` only where the `scanline-bar` is.

**Tech Stack:** HTML, CSS, JavaScript (for cloning content to the distorted layer).

---

### Task 1: Add Base HTML Elements for Scanline and Distortion

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add `.scanline-bar` and `.distorted-layer` to `index.html`**

The `.distorted-layer` will initially be empty and will be populated by JavaScript. It should wrap the `header` and `main` elements, which contain the dynamic content.

```html
<!-- index.html -->
...
<body>
    <div class="crt-overlay"></div>
    <div class="terminal-container">
        <!-- New wrapper for scanline effect -->
        <div class="scanline-effect-wrapper">
            <header>
                <h1>SYSTEME D'EXPLOITATION UNIFIE ROBCO INDUSTRIES</h1>
                <h2>COPYRIGHT 2075-2077 ROBCO INDUSTRIES</h2>
                <div id="password-prompt">-Serveur 1-</div>
                <br>
                <div>Entrer le Mot de Passe</div>
                <div id="attempts-container">
                    <span id="attempts-remaining"></span>
                    <span id="attempts-blocks"></span>
                </div>
                <br>
            </header>
            <main class="grid-container">
                <div class="column" id="col-1"></div>
                <div class="column" id="col-2"></div>
            </main>
            <div class="scanline-bar"></div>
            <div class="distorted-layer"></div>
        </div>
        <aside class="console-output" id="console">
            <!-- Historique des clics -->
        </aside>
    </div>
    <script src="words.js"></script>
    <script src="game.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
but commit feat/crt-scanline-effect -m "feat: add scanline and distorted layer HTML structure" --changes index.html_ID --status-after
```

### Task 2: Add Base CSS for Scanline and Distortion

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Add CSS for `.scanline-effect-wrapper`, `.scanline-bar`, `.distorted-layer` and related animations to `styles.css`**

```css
/* styles.css */
/* Add this to the end of styles.css or in an appropriate section */

.terminal-container {
    position: relative; /* Ensure children are positioned relative to this */
}

.scanline-effect-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden; /* Contains the scanline and distorted layer */
}

.scanline-bar {
    position: absolute;
    top: -5%; /* Start slightly above to ensure full sweep */
    left: 0;
    width: 100%;
    height: 10px; /* Height of the scanline bar */
    background: rgba(22, 198, 12, 0.4); /* Phosphor green */
    box-shadow: 0 0 10px rgba(22, 198, 12, 0.6); /* Glow effect */
    z-index: 4; /* Above main content and distorted layer */
    pointer-events: none; /* Allows interaction with elements beneath */
    animation: bar-scan 4s linear infinite; /* Animation defined below */
}

.distorted-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 3; /* Below scanline bar, above main content */

    /* The actual distortion effects */
    transform: translateX(2px) skewX(-2deg) scale(1.01);
    transform-origin: center left;
    text-shadow: 0 0 8px var(--phosphor), 0 0 10px var(--phosphor);
    color: #1aff13; /* Slightly brighter green for distortion */
    font-weight: bold;

    /* Mask to reveal distortion only at scanline */
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, transparent 10px, black 15px, black 25px, transparent 30px, transparent 100%);
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: 100% 40px; /* Height of the mask band */
    animation: mask-scan 4s linear infinite; /* Synchronized with bar-scan */
}

/* Keyframes for animations */
@keyframes bar-scan {
    0% { top: -5%; } /* Start above */
    100% { top: 105%; } /* End below */
}

@keyframes mask-scan {
    0% { -webkit-mask-position: 0 -40px; } /* Start mask above */
    100% { -webkit-mask-position: 0 100%; } /* End mask below, adjusted for 100% height sweep */
}
```

- [ ] **Step 2: Update existing `.terminal-container` to remove absolute positioning, as it's now handled by the wrapper**

Find this block in `styles.css`:
```css
.terminal-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px 40px;
    height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}
```
Remove `position: relative;` if it was added from previous steps and ensure it doesn't conflict. The `scanline-effect-wrapper` will manage the absolute positioning. Actually, I need to *add* `position: relative;` to `.terminal-container` if it isn't there, so that the `scanline-effect-wrapper` (which is absolutely positioned) respects its boundaries. The prior `read` of `styles.css` shows it's not present, so I need to add it.

- [ ] **Step 3: Commit**

```bash
but commit feat/crt-scanline-effect -m "feat: add CSS for CRT scanline effect" --changes styles.css_ID --status-after
```

### Task 3: Populate Distorted Layer via JavaScript

**Files:**
- Modify: `game.js`

**Context:** The `distorted-layer` needs to contain the exact same content as the visible terminal elements (`header` and `main`). Since these are dynamically updated, we need to clone their content into the `distorted-layer` after initial load and whenever the content changes.

- [ ] **Step 1: Create a function `updateDistortedLayer` in `game.js`**

This function will:
1. Select the `.distorted-layer` element.
2. Select the elements whose content needs to be mirrored: `header` and `main.grid-container`.
3. Clear the current content of the `.distorted-layer`.
4. Clone the content of `header` and `main.grid-container` and append it to `.distorted-layer`.

```javascript
// game.js
// Add this function at an appropriate place, e.g., near the top or bottom of the script.

function updateDistortedLayer() {
    const distortedLayer = document.querySelector('.distorted-layer');
    if (!distortedLayer) return;

    const headerContent = document.querySelector('header');
    const mainContent = document.querySelector('main.grid-container');

    distortedLayer.innerHTML = ''; // Clear previous content

    if (headerContent) {
        // Clone and append header
        const clonedHeader = headerContent.cloneNode(true);
        // Remove interactive elements from the cloned header if any, to avoid conflicts
        clonedHeader.querySelector('#attempts-container').remove(); // remove attempts span from distorted layer
        distortedLayer.appendChild(clonedHeader);
    }
    if (mainContent) {
        // Clone and append main content
        const clonedMain = mainContent.cloneNode(true);
        // Remove interactive elements from the cloned main if any
        distortedMain.querySelectorAll('.word, .special').forEach(el => {
          el.removeAttribute('onclick');
          el.classList.remove('word', 'special'); // Remove classes that might have hover effects
        });
        distortedLayer.appendChild(clonedMain);
    }
}
```

- [ ] **Step 2: Call `updateDistortedLayer` on initial load and whenever the terminal content changes.**

Find where the terminal content is initially set up and where it's updated (e.g., after a guess is made, or when the word list is rendered).

For initial load, call it after the initial DOM rendering is complete, possibly at the end of a `DOMContentLoaded` listener or after any setup functions.

For updates, find the functions that modify the `header` or `main.grid-container` (e.g., `displayWords`, `checkGuess`, `updateAttempts` or similar) and add a call to `updateDistortedLayer()` at the end of these functions.

- [ ] **Step 3: Commit**

```bash
but commit feat/crt-scanline-effect -m "feat: add JavaScript to populate distorted layer" --changes game.js_ID --status-after
```

### Task 4: Verify Implementation

- [ ] **Step 1: Open `index.html` in a browser.**
- [ ] **Step 2: Observe the CRT scanline effect.**
    *   Does the bright green scanline sweep downwards?
    *   Does the text underneath the scanline jitter and brighten?
    *   Does the distortion appear localized to the scanline?
    *   Does the effect persist and loop infinitely?
- [ ] **Step 3: Interact with the terminal (make guesses).**
    *   Does the distorted layer update correctly when the words or attempts change?
    *   Are there any visual glitches or performance issues?
- [ ] **Step 4: Debug any issues.**
- [ ] **Step 5: Commit (if any fixes were made).**

```bash
but commit feat/crt-scanline-effect -m "fix: address issues with CRT scanline effect (if any)" --changes file.js_ID, file.css_ID, file.html_ID --status-after
```

Plan complete and saved to `docs/superpowers/plans/2026-04-04-crt-scanline-effect.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?