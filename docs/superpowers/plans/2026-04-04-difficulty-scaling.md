# Difficulty Scaling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify the hacking minigame so that higher Intelligence (INT) stats make the game easier with fewer faux words and more special help sequences.

**Architecture:** Update `game.js` difficulty parameters to inverse the INT logic. Extend `words.js` to contain at least 14 4-letter words to support the hardest difficulty setting. 

**Tech Stack:** HTML/JS/CSS (Vanilla)

---

### Task 1: Expand the 4-Letter Dictionary

**Files:**
- Modify: `words.js`

- [ ] **Step 1: Write the updated dictionary**

Update `words.js` line 2 to add more 4-letter words so the length is at least 14.

```javascript
const DICTIONARY = {
    4: ["FALL", "BALL", "CALL", "TALL", "MALL", "WALL", "HALL", "MILK", "SILK", "HUNT", "HINT", "TINT", "SINK", "TANK", "BANK", "RANK", "DARK", "MARK", "PARK", "LARK"],
    5: ["WATER", "LATER", "CATER", "HATER", "GHOST", "TOAST", "ROAST", "BOAST", "BEAST"],
    7: ["FALLING", "CALLING", "TALLING", "MALLING", "HUNTING", "HINTING", "TINTING", "TESTING", "RESTING", "WASTING"]
};
```

- [ ] **Step 2: Commit dictionary expansion**

```bash
but commit -m "feat: add more 4-letter words to support hard difficulty"
```

### Task 2: Update Difficulty Logic in `game.js`

**Files:**
- Modify: `game.js:12-16`

- [ ] **Step 1: Write the inverted logic**

Replace the existing `getDifficultyParams` function to implement the new INT scaling:
- INT 1-4 (Hard): 4 letters, 14 words, 1 special
- INT 5-7 (Medium): 5 letters, 10 words, 2 specials 
- INT 8-10 (Easy): 7 letters, 5 words, 4 specials

```javascript
function getDifficultyParams(intLevel) {
  if (intLevel <= 4) return { wordLength: 4, wordCount: 14, specialCount: 1 };
  if (intLevel <= 7) return { wordLength: 5, wordCount: 10, specialCount: 2 };
  return { wordLength: 7, wordCount: 5, specialCount: 4 };
}
```

- [ ] **Step 2: Verify game init logic handles new sizes**
Visually inspect the grid generation in the browser. Test by setting `gameState.intStat = 3` (hardest), `6` (medium), and `9` (easiest) in `game.js` temporarily to confirm the correct number of words and specials appear, and that the game doesn't crash from index bounds.

- [ ] **Step 3: Commit difficulty logic**

```bash
but commit -m "feat: inverse difficulty scaling based on INT stat"
```