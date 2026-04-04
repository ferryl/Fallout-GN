# Mixed Scanline and Main Branch Interface Design

## Purpose
This document specifies the design for combining the current scanline animation's visual effects with the main branch game interface's layout and organization of elements. The goal is to enhance the visual experience of the game interface while maintaining the usability and structure preferred from the main branch.

## Problem Statement
Users appreciate the specific visual effects of the current scanline animation (flickering, color distortion, etc.) but prefer the layout and organization of elements from the main branch game interface. The current implementation already overlays scanline effects via CSS, but there may be opportunities to refine the implementation for better visual harmony.

## Proposed Solution
Implement a refined approach that ensures all scanline animation effects are properly active and visible while preserving the main branch interface layout. This involves:

1. Fixing missing CSS variable definitions (--phosphor and --bg-color) that are referenced in hover states
2. Ensuring all existing scanline effects (.crt-overlay, #crt:before, .scanline, text-shadow) remain functional
3. Optionally adjusting scanline animation intensity to maintain readability if needed
4. Verifying that the combined interface enhances the user experience

## Architecture
The solution works within the existing HTML/CSS/JS structure:

- **HTML Structure**: Maintains the current structure with `.crt-overlay` for scanline effects and `#monitor` > `#bezel` > `#crt` > `.terminal` for the game interface
- **CSS**: 
  - Scanline effects: `.crt-overlay` (repeating-linear-gradient), `#crt:before` (gradient overlay), `.scanline` (animated scanline), `text-shadow` on `#crt`
  - Interface layout: `#monitor` flex container, `.terminal` flex grow, `.grid-container` for two-column layout
  - Fixed: Added proper definitions for `--phosphor` and `--bg-color` CSS variables
- **JavaScript**: Game logic remains unchanged as it doesn't directly interfere with visual effects

## Components
1. **Scanline Overlay Layer**: `.crt-overlay` provides the repeating scanline pattern across the entire viewport
2. **CRT Container**: `#crt` contains the game content with gradient overlay (`#crt:before`) and animated scanline (`.scanline`)
3. **Game Interface**: 
   - Header: Displays system information
   - Main: Two-column grid for word display (`.grid-container` > `.column`)
   - Aside: Console output for game history (`.console-output`)
4. **Typography**: Uses VT323 font for authentic Fallout terminal feel

## Data Flow
No data flow changes are required as this is purely a visual enhancement. The game logic in `game.js` continues to function as before, generating content and handling user interactions.

## Error Handling
Error handling remains the responsibility of the existing game logic. The visual effects are purely presentational and do not affect game state.

## Implementation Plan
1. Fix missing CSS variables in `styles.css`
2. Verify all scanline effects are visible and properly layered
3. Optionally tune animation parameters (opacity, speed) for optimal visual balance
4. Test the combined interface to ensure scanline effects enhance rather than distract from gameplay

## Success Criteria
- Scanline animation effects are visibly present
- Main branch interface layout (header, two-column grid, console) is preserved
- Text remains readable despite scanline overlay
- No regression in game functionality
- User reports improved visual experience

## Open Questions
- Should the scanline animation intensity be adjustable based on user preference?
- Are there additional scanline effects (chromatic aberration, curvature) that could further enhance the experience without compromising usability?

## References
- Existing implementation in `index.html`, `styles.css`, and `game.js`
- User feedback requesting combination of scanline visual effects with main branch layout