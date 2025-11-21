# Technical Explanation & Architecture 🧠

This document provides a deep dive into the technical architecture, security algorithms, and design decisions behind the **Password Security Analyzer**.

## 1. Architecture Overview

The application is a **Client-Side Single Page Application (SPA)** built with **React** and **Vite**. It implements a strict **Model-View-Controller (MVC)** architectural pattern to ensure separation of concerns, maintainability, and testability.

### Architectural Style: MVC (Model-View-Controller)

We have refactored the standard React component structure into a clear MVC pattern:

1.  **Model (Logic Layer)**:
    *   **Responsibility**: Encapsulates all business logic, data processing, and mathematical calculations.
    *   **Characteristics**: Pure JavaScript (no React dependencies), stateless, easily testable.
    *   **Location**: `src/models/PasswordModel.js`

2.  **View (Presentation Layer)**:
    *   **Responsibility**: Renders the User Interface (UI) based on the data provided by the Controller.
    *   **Characteristics**: "Dumb" components, handles layout, styling (Tailwind), and animations (Framer Motion).
    *   **Location**: `src/components/PasswordAnalyzer.jsx`

3.  **Controller (State Layer)**:
    *   **Responsibility**: Manages application state, handles user input, and orchestrates communication between the Model and View.
    *   **Characteristics**: Custom React Hooks, manages side effects (localStorage, Confetti).
    *   **Location**: `src/controllers/usePasswordController.js`

### Layered Architecture Perspective

While MVC defines the *interaction* pattern, this application also follows a **Layered Architecture** (Separation of Concerns) where each layer has a specific responsibility and only communicates with the layer directly below or above it.

1.  **Presentation Layer (UI)**
    *   **Components**: `PasswordAnalyzer.jsx`, `PasswordGenerator.jsx`
    *   **Role**: Handles what the user *sees*. It is passive and only displays data provided by the Application Layer.
    *   **Corresponds to**: **View** in MVC.

2.  **Application/Business Logic Layer**
    *   **Components**: `usePasswordController.js` (Orchestration), `PasswordModel.js` (Domain Logic)
    *   **Role**: Handles what the application *does*. It processes user commands, makes decisions based on the domain logic, and manages the flow of data.
    *   **Corresponds to**: **Controller** + **Model** in MVC.

3.  **Data Persistence Layer**
    *   **Components**: `localStorage` API
    *   **Role**: Handles where the data *lives*. In this offline-first architecture, the browser's local storage acts as our database.
    *   **Corresponds to**: The data source managed by the Controller.

### Directory Structure
```
src/
├── components/           # VIEW Layer
│   ├── PasswordAnalyzer.jsx
│   └── PasswordGenerator.jsx
├── controllers/          # CONTROLLER Layer
│   └── usePasswordController.js
├── models/               # MODEL Layer
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
