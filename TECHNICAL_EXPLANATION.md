# Technical Explanation & Architecture 🧠

This document provides a deep dive into the technical architecture, security algorithms, and design decisions behind the **Password Security Analyzer**.

## 1. Architecture Overview

The application is a **Client-Side Single Page Application (SPA)** built with **React** and **Vite**. It follows a strict **Layered Architecture** to ensure separation of concerns, maintainability, and testability.

### Architectural Style: Layered Architecture

The application is organized into three distinct horizontal layers. Each layer has a specific responsibility and only communicates with the layers directly adjacent to it.

1.  **Presentation Layer (UI)**
    *   **Role**: Responsible for what the user **sees** and interacts with. It is "dumb" and passive—it only displays data provided by the Business Logic layer and delegates user actions to it.
    *   **Components**: `PasswordAnalyzer.jsx`, `PasswordGenerator.jsx`

2.  **Business Logic Layer (Application)**
    *   **Role**: The "brain" of the application. It orchestrates the application flow, processes user commands, executes domain logic (math, validation), and manages state.
    *   **Components**: `usePasswordController.js` (Orchestration), `PasswordModel.js` (Domain Logic)

3.  **Data Persistence Layer**
    *   **Role**: Responsible for where the data **lives**. In this offline-first architecture, it abstracts the storage mechanism.
    *   **Components**: Browser's `localStorage` API.

---

### Implementation Pattern: MVC (Model-View-Controller)

To implement this layered structure efficiently within the React ecosystem, we utilize the **MVC** pattern. Here is how the layers map to MVC components:

*   **View (Presentation Layer)**:
    *   **File**: `src/components/PasswordAnalyzer.jsx`
    *   **Function**: Renders the UI using Tailwind CSS and Framer Motion. It receives state and event handlers from the Controller.

*   **Controller (Business Logic Layer)**:
    *   **File**: `src/controllers/usePasswordController.js`
    *   **Function**: A custom React Hook that acts as the glue. It manages the application state (`useState`), handles side effects (like saving to the Data Layer), and calls the Model for calculations.

*   **Model (Business Logic Layer)**:
    *   **File**: `src/models/PasswordModel.js`
    *   **Function**: A pure JavaScript class containing the core domain logic (entropy calculation, regex checks). It has no dependency on React or the UI.

### Directory Structure
```
src/
├── components/           # PRESENTATION Layer (View)
│   ├── PasswordAnalyzer.jsx
│   └── PasswordGenerator.jsx
├── controllers/          # BUSINESS LOGIC Layer (Controller)
│   └── usePasswordController.js
├── models/               # BUSINESS LOGIC Layer (Model)
│   └── PasswordModel.js
├── App.jsx
├── index.css
└── main.jsx
```

## 2. Security Algorithms

### A. Entropy Calculation
We use **Information Entropy** (measured in bits) as the primary metric for password strength. The formula used is:

$$ E = L \times \log_2(R) $$

Where:
- $E$ = Entropy (bits)
- $L$ = Password Length
- $R$ = Size of the pool of unique characters used (e.g., 26 for lowercase, 62 for alphanumeric).

**Implementation (in `PasswordModel.js`):**
```javascript
calculateEntropy(pwd) {
  let charSet = 0;
  if (/[a-z]/.test(pwd)) charSet += 26;
  if (/[A-Z]/.test(pwd)) charSet += 26;
  if (/[0-9]/.test(pwd)) charSet += 10;
  if (/[^a-zA-Z0-9]/.test(pwd)) charSet += 32;
  return charSet > 0 ? pwd.length * Math.log2(charSet) : 0;
}
```

### B. Privacy & Offline Mode
**Important Change in v2.0**: The "Have I Been Pwned" (HIBP) API integration has been **removed** to create a 100% offline, zero-trust environment.

*   **No Network Requests**: The application makes absolutely no external HTTP requests.
*   **Local Processing**: All analysis happens in the user's browser memory.
*   **Data Persistence**: Password history is stored in `localStorage` and never leaves the device.

## 3. UI/UX Design System

### Styling Strategy
- **Tailwind CSS**: Used for utility-first styling, enabling rapid development and consistent design tokens.
- **Dark Mode**: Implemented using the `class` strategy. Colors are defined with `slate` scales (`slate-50` to `slate-950`) to ensure high contrast.
- **Glassmorphism**: Achieved using `backdrop-blur`, semi-transparent backgrounds (`bg-white/60`), and subtle borders (`border-white/20`).

### Animations
- **Framer Motion**: Handles complex layout transitions (e.g., switching tabs, expanding sections) and micro-interactions.
- **Canvas Confetti**: A lightweight particle system triggered by the Controller when the Model reports a high security score.

## 4. Report Generation
We use a client-side rendering approach to generate PDF reports:
1.  **Capture**: `html2canvas` takes a "screenshot" of the analysis DOM node.
2.  **Process**: The canvas data is converted to a PNG image.
3.  **PDF Creation**: `jsPDF` embeds this image into a standard A4 PDF document.

## 5. Future Roadmap
- [ ] **PWA Support**: Make the app installable on mobile devices.
- [ ] **Custom Dictionaries**: Allow users to import their own banned word lists.
- [ ] **zxcvbn Integration**: Incorporate Dropbox's advanced pattern matching library for even deeper analysis.
