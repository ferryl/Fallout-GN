# CRT Scanline Effect Design

## Objective
Add a retro CRT scanline sweeping effect to the Fallout hacking terminal prototype. The effect should simulate a failing or old CRT monitor where a bright scanline sweeps downwards, causing localized physical distortion (jitter/tearing) and increased phosphor brightness only where the line passes.

## Architecture & Approach

We will implement this using CSS animations and a duplicate layer masking technique.

1. **The Scanline Bar (`.scanline-bar`)**
   - A horizontal div with a semi-transparent bright green background and a glowing box-shadow.
   - Positioned absolutely over the terminal container.
   - Animated (`@keyframes`) to sweep from the top to the bottom of the container over ~4 seconds, repeating infinitely.

2. **The Distorted Layer (`.distorted-layer`)**
   - A container that sits above the main terminal text but below the scanline bar.
   - It contains a copy of the terminal's text content (or wraps the text if we can use CSS filters/mix-blend-modes, but duplicating content or using a wrapper with a mask is the most robust way to achieve localized physical transforms without affecting the static text behind it).
   - **Styling for Distortion:**
     - `transform: translateX(2px) skewX(-2deg) scale(1.01)` to create a subtle physical tear/jitter.
     - `text-shadow: 0 0 8px #16c60c, 0 0 10px #16c60c` and `color: #1aff13` for increased phosphor glow (surbrillance).
     - `font-weight: bold`.
   - **The Mask Animation (`-webkit-mask-image`):**
     - We will use a linear-gradient mask to make only a horizontal slice of this distorted layer visible.
     - The mask's position will be animated synchronously with the `.scanline-bar`'s movement. This ensures the distorted text is only visible exactly where the bright scanline currently is, overlaying the static text underneath.

## Integration
- Add the necessary CSS to `styles.css`.
- Update `index.html` (and potentially `game.js` if dynamic rendering of the DOM is involved) to include the `.scanline-bar` and the `.distorted-layer` wrapper. 
- Since `game.js` dynamically populates the `.column` divs with hex addresses and words, we need to ensure the `.distorted-layer` accurately reflects the DOM. To avoid complex DOM duplication in JS, we can apply the effect to a pseudo-element or a wrapper around the `.grid-container` and `header`.
*Correction during self-review:* Duplicating the entire dynamic DOM for the mask layer might be heavy and complex to sync in `game.js`. A better approach for the static HTML without JS overhead is to apply the effect using CSS `filter` or an overlay, but CSS filters don't easily do localized `transform` on parts of a div. 
*Alternative:* Instead of a duplicate layer, we can apply the jitter effect to the entire terminal container but ONLY trigger it when the scanline is at specific intervals? No, the user wants the distortion to follow the line.
*Refined Approach:* We will implement the duplicate layer (`.distorted-layer`) and the `.scanline-bar` in `index.html`. Since the content is dynamic, we will use a simple JavaScript function in `game.js` that clones the `innerHTML` of the `.terminal-container` (or just the header and main grid) into the `.distorted-layer` whenever the game state updates. This guarantees perfect synchronization of the visual text.

## Scope & Constraints
- Focus only on the scanline animation.
- Do not alter the core hacking mini-game logic.
- Ensure the animation performs well and doesn't cause excessive repaints that lag the browser.