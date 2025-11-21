# Technical Explanation & Architecture 🧠

This document provides a deep dive into the technical architecture, security algorithms, and design decisions behind the **Password Security Analyzer**.

## 1. Architecture Overview

The application is a **Single Page Application (SPA)** built with **React** and **Vite**. It follows a component-based architecture, emphasizing modularity and separation of concerns.

### Directory Structure
```
src/
├── components/
│   ├── PasswordAnalyzer.jsx  # Core analysis logic & UI
│   └── PasswordGenerator.jsx # Password generation utility
├── App.jsx                   # Root component & Theme context
├── index.css                 # Global styles & Tailwind directives
└── main.jsx                  # Entry point
```

### State Management
- **Local State**: We use React's `useState` for managing immediate UI state (input values, current analysis results, active tabs).
- **Effect Hooks**: `useEffect` is used for:
  - **Debouncing**: Delaying the analysis and HIBP API calls to prevent performance bottlenecks during typing.
  - **Persistence**: Saving/loading password history to/from `localStorage`.
  - **Theme**: Applying the `dark` class to the HTML root based on user preference.

## 2. Security Algorithms

### A. Entropy Calculation
We use **Information Entropy** (measured in bits) as the primary metric for password strength, rather than just length. The formula used is:

$$ E = L \times \log_2(R) $$

Where:
- $E$ = Entropy (bits)
- $L$ = Password Length
- $R$ = Size of the pool of unique characters used (e.g., 26 for lowercase, 62 for alphanumeric).

**Implementation:**
```javascript
const calculateEntropy = (pwd) => {
  let charSet = 0;
  if (/[a-z]/.test(pwd)) charSet += 26;
  if (/[A-Z]/.test(pwd)) charSet += 26;
  if (/[0-9]/.test(pwd)) charSet += 10;
  if (/[^a-zA-Z0-9]/.test(pwd)) charSet += 32;
  return charSet > 0 ? pwd.length * Math.log2(charSet) : 0;
};
```

### B. "Have I Been Pwned" (HIBP) Integration
To check if a password has been compromised without exposing it, we implement the **k-anonymity** model:

1.  **Hashing**: The password is hashed using **SHA-1** via the browser's `crypto.subtle` API.
2.  **Prefixing**: We extract the first **5 characters** of the hex-encoded hash.
3.  **Querying**: We send a GET request to `https://api.pwnedpasswords.com/range/{prefix}`.
4.  **Matching**: The API returns a list of suffixes (the rest of the hash) that match that prefix. We search this list locally for our password's hash suffix.

**Why this is secure:** The API never sees the full hash, and we never see the full list of breached passwords. The "anonymity set" (the response list) is large enough that the server cannot infer which specific password we are checking.

## 3. UI/UX Design System

### Styling Strategy
- **Tailwind CSS**: Used for utility-first styling, enabling rapid development and consistent design tokens.
- **Dark Mode**: Implemented using the `class` strategy. Colors are defined with `slate` scales (`slate-50` to `slate-950`) to ensure high contrast and reduced eye strain.
- **Glassmorphism**: Achieved using `backdrop-blur`, semi-transparent backgrounds (`bg-white/60`), and subtle borders (`border-white/20`).

### Animations
- **Framer Motion**: Handles complex layout transitions (e.g., switching tabs, expanding sections) and micro-interactions (progress bars filling up).
- **Canvas Confetti**: A lightweight particle system triggered programmatically when the security score hits a threshold (≥90).

## 4. Report Generation
We use a client-side rendering approach to generate PDF reports:
1.  **Capture**: `html2canvas` takes a "screenshot" of the analysis DOM node.
2.  **Process**: The canvas data is converted to a PNG image.
3.  **PDF Creation**: `jsPDF` embeds this image into a standard A4 PDF document.

This approach ensures the report looks exactly like the UI, preserving all charts and visual formatting.

## 5. Future Roadmap
- [ ] **Offline Mode**: PWA (Progressive Web App) support for offline analysis.
- [ ] **Custom Dictionaries**: Allow users to check against organization-specific banned word lists.
- [ ] **Password Strength Meter v2**: Incorporate `zxcvbn` library for even more advanced linguistic pattern matching.
