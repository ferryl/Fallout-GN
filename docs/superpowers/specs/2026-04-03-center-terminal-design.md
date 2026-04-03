# Design Specification: Centering Terminal Interface

## Context
The user wants to center the main content of the Fallout-GN terminal game (header, two text columns, and console) while maintaining a fixed layout width. As the browser window expands, the black background should expand to fill the empty space around the centered terminal interface.

## Chosen Approach
Option 1: Max-Width Container
We will apply a `max-width` and `margin: 0 auto` to the `.terminal-container` to center the entire interface on the screen while preserving its internal layout.

## Implementation Details

### CSS Changes (`styles.css`)

We will update the `.terminal-container` class to:
1. Define a reasonable `max-width` that fits typical terminal interfaces (e.g., `800px` or `900px`). I will select `800px` as a starting point.
2. Add `margin: 0 auto;` to center the container within the `body` horizontally.
3. Keep the existing `padding: 20px 40px;` so the text doesn't touch the edges of the container.
4. Keep the existing `display: flex; flex-direction: column;` and `height: 100vh;` so the internal layout works correctly.

The CSS will look something like this:
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

### HTML Changes (`index.html`)
No changes are required to the HTML structure, as `.terminal-container` already wraps the header, grid columns, and console.

## Success Criteria
- The game content (header, columns, console) stays grouped together in the center of the screen.
- On large screens, there are black borders on the left and right.
- On small screens (under 800px), the container takes up the available width.
- The distance between the two text columns remains consistent regardless of the window width.