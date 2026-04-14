# Center Terminal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Center the Fallout terminal interface on the screen while maintaining a maximum width of 800px so it doesn't stretch too wide on large displays.

**Architecture:** We will apply a CSS `max-width` and `margin: 0 auto` to the `.terminal-container` class to center it horizontally on the page. The black background defined on the `body` will automatically fill the remaining space on larger screens.

**Tech Stack:** HTML, CSS

---

### Task 1: Update CSS for Terminal Container

**Files:**
- Modify: `styles.css:33-40`

- [ ] **Step 1: Write the updated CSS rules**
Modify `.terminal-container` in `styles.css` to include `max-width` and `margin`. Use the exact content below to replace the existing `.terminal-container` definition.

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

- [ ] **Step 2: Verify visually (Manual Check)**
Since this is a visual CSS change without an automated test suite, open `index.html` in a web browser to verify that the terminal interface is centered and does not stretch beyond 800px on a wide window.

- [ ] **Step 3: Commit the changes**

```bash
but status -fv
# Note the file ID for styles.css from the status command
but commit lf -m "style: center terminal container with max width" --changes <id_from_status> --status-after
```