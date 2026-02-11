# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web-based quiz simulation application for case study assessments. The application guides users through a multi-phase research and analysis exercise involving wildlife conservation scenarios (specifically about Kapulici Monkeys). Users collect research data, perform calculations, answer case questions, and create reports.

## Running the Application

This is a static web application with no build process:

- **Open in browser**: Simply open `log_in.html` in a web browser to start
- **Local server** (recommended): Use a simple HTTP server to avoid CORS issues:
  ```bash
  python -m http.server 8000
  # Then navigate to http://localhost:8000/log_in.html
  ```

## Application Architecture

### Three-Phase Structure

The application follows a sequential three-phase workflow:

1. **Investigation Phase** ([index.html](index.html))
   - Entry point after login
   - Users drag information from exhibits to a research journal
   - 35-minute countdown timer starts
   - Data persists in localStorage across navigation

2. **Analysis Phase** ([calculator_question_1.html](calculator_question_1.html) through [calculator_question_4.html](calculator_question_4.html))
   - Four sequential calculation questions
   - Built-in calculator and research journal available
   - Progress tracked via `calculator_state` in localStorage

3. **Report Phase** ([report_written.html](report_written.html), [report_graph.html](report_graph.html), [report_visual_*.html](report_visual_bar.html))
   - Users create written reports and select visualizations
   - Multiple report sections with different chart types

### Additional Sections

- **Case Questions** ([case_1.html](case_1.html) through [case_6.html](case_6.html)): Six independent case questions accessed from Analysis phase
- **Review** ([test_review.html](test_review.html)): Displays all answers and allows CSV download

### State Management

The application relies heavily on **localStorage** for state persistence:

- `isLoggedIn`: Authentication status (checked on every page load)
- `journalData`: Research journal contents (JSON string)
- `countDownDate`: Timer state (persists across page navigation)
- `calculator_state`: Current question in Analysis phase ('1', '2', '3', '4', 'review')
- Input values: Stored by element ID for each answer field

**Important**: The "Restart" button clears all localStorage except `isLoggedIn`, resetting the entire quiz.

### Drag-and-Drop System

Powered by jQuery UI, the drag-and-drop system is central to the Investigation phase:

- **Draggable elements**: Items in exhibits marked with class `draggable` and `data-title` attribute
- **Drop target**: `.right_screen` element (research journal)
- **After drop**: Elements become `.sortable`, gain title and remove button, and can be reordered
- **State tracking**: Dropped elements change from `.draggable` to `.afterDrag` in source to prevent re-dragging
- **Expand/collapse**: Long text items (>25 chars) get expand arrows for better UX

Key files: [js/index.js](js/index.js) (lines 88-174) contains core drag-drop logic

### Calculator Component

Reusable calculator appears in multiple phases:

- Located in right column or integrated into main screen
- Handles basic arithmetic operations
- Result element is draggable to journal (class `draggable` on `#result`)
- History display shows previous calculations
- Key file: [js/calculator.js](js/calculator.js)

### Timer System

35-minute countdown timer:

- Starts in Investigation phase, persists across all pages
- Stores `countDownDate` timestamp in localStorage
- Updates every second
- Shows "Time's Up" when expired (no auto-redirect, commented out)
- Implemented in [js/index.js](js/index.js) (lines 23-73) and [js/calculator.js](js/calculator.js)

## Technology Stack

- **No framework**: Vanilla JavaScript with jQuery
- **jQuery**: DOM manipulation and AJAX (if needed)
- **jQuery UI**: Drag-and-drop, sortable interactions
- **Chart.js** (v2.9.4): Data visualization in report phase
- **No build tools**: No webpack, npm, or transpilation

## File Organization

```
/
├── index.html              # Investigation phase entry point
├── log_in.html             # Login page (first page)
├── calculator_question_*.html  # Analysis phase questions (1-4)
├── calculator_review.html  # Analysis review page
├── case_*.html            # Case questions (1-6)
├── report_*.html          # Report phase pages
├── test_review.html       # Final review and download
├── js/
│   ├── index.js          # Investigation phase logic + drag-drop
│   ├── calculator.js     # Calculator component + state loading
│   ├── cases.js          # Case questions logic
│   ├── case_1.js, case_2.js, case_8.js  # Individual case logic
│   ├── *_graph.js        # Chart rendering (bar, line, pie)
│   └── test_review.js    # CSV export functionality
├── style/
│   ├── index.css         # Investigation phase styles
│   ├── calculator.css    # Calculator and analysis styles
│   ├── case_*.css        # Individual case styling
│   ├── cases_general.css # Shared case styles
│   └── *.css             # Various page-specific styles
└── img/                  # Exhibits and chart images
```

## Common Development Tasks

### Adding a New Question

1. Duplicate an existing question HTML file (e.g., `calculator_question_1.html`)
2. Update question number, title, and content
3. Change input IDs (convention: `"[order]. [Phase] [description]"`)
4. Update navigation in `SaveToLocalStorage()` function in [js/index.js](js/index.js) (lines 240-284)
5. Update menu links in other question pages

### Modifying Draggable Elements

All draggable elements need:
- Class: `draggable`
- Attribute: `data-title="Display Title"` (becomes title in journal)
- Optional: `data-value="123"` (for numeric values)
- Content: Text/numbers displayed in the box

Example:
```html
<div class="draggable" data-title="Population in Year 1" data-value="356">356</div>
```

### Working with LocalStorage

Access pattern used throughout:
```javascript
// Save
localStorage.setItem('key', value);
localStorage.setItem('jsonKey', JSON.stringify(object));

// Retrieve
const value = localStorage.getItem('key');
const object = JSON.parse(localStorage.getItem('jsonKey'));

// Clear all except login
var isLoggedIn = localStorage.getItem('isLoggedIn');
localStorage.clear();
localStorage.setItem('isLoggedIn', isLoggedIn);
```

### Styling Conventions

- CSS uses CSS variables (custom properties) defined in individual stylesheets
- Common class patterns:
  - `.btn` / `.btn_active`: Menu buttons
  - `.draggable` / `.afterDrag`: Drag source states
  - `.sortable`: Dropped items in journal
  - `.input_answer`: Answer input fields (auto-saved to localStorage)
  - `.end_btn`: Navigation buttons ("Next Question", etc.)
  - `.confirm_btn`: Confirmation dialog buttons

## Important Behavioral Notes

- **Navigation is linear**: Users progress through Investigation → Analysis → Report → Cases
- **No back button**: Users cannot return to previous questions once confirmed
- **Auto-save**: Input values save to localStorage on change
- **Login persistence**: `isLoggedIn` check on every page (`window.onload` in most JS files)
- **Journal follows user**: Research journal data persists and displays throughout all phases
- **Confirmation dialogs**: Most "Next" buttons show confirmation overlay before navigation

## Chart.js Integration

Charts are rendered using Chart.js v2.9.4 in report visualizations:

- Bar charts: [js/bar_graph.js](js/bar_graph.js)
- Line charts: [js/line_graph.js](js/line_graph.js)
- Pie charts: [js/pie_graph.js](js/pie_graph.js)
- Main report logic: [js/report_graph.js](js/report_graph.js)

Charts display data from localStorage based on user's calculated answers.

## Testing

No automated tests exist. Manual testing workflow:

1. Open [log_in.html](log_in.html) and log in
2. Progress through Investigation → collect journal items
3. Complete Investigation → move to Analysis
4. Answer calculator questions 1-4
5. Complete Analysis → move to Report
6. Answer report questions and select visualizations
7. Navigate to Cases and answer 1-6
8. Review all answers in [test_review.html](test_review.html)
9. Download CSV to verify data export
10. Click "Restart" to reset and test again

To test specific phases, manually set localStorage:
```javascript
localStorage.setItem('isLoggedIn', 'true');
localStorage.setItem('calculator_state', '2'); // Jump to question 2
```
