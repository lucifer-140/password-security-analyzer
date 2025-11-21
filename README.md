# Password Security Analyzer 🛡️

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC.svg)

A state-of-the-art **Password Security Analyzer** built with React, designed to help users evaluate, improve, and generate secure passwords. This application goes beyond simple length checks by calculating information entropy, checking against real-world data breaches, and providing actionable security recommendations in a premium, modern interface.

## ✨ Key Features

### 🔒 Advanced Security Analysis
- **Entropy Calculation**: Uses mathematical information theory to measure the true unpredictability of your password.
- **Real-World Breach Check**: Integrates with the **Have I Been Pwned (HIBP)** API to check if your password has appeared in known data leaks.
  - *Privacy First*: Uses **k-anonymity** (SHA-1 hashing) so your actual password is **never** sent to any server.
- **Comprehensive Checks**: Evaluates length, character variety (uppercase, lowercase, numbers, symbols), and common patterns (keyboard sequences, repetitions).
- **Crack Time Estimation**: Estimates how long it would take a computer to brute-force your password.

### 🎨 Premium UI/UX
- **Modern Design**: Features a sleek, glassmorphism-inspired interface with a custom "Outfit" font.
- **Dark/Light Mode**: Fully responsive theme toggle for comfortable viewing in any lighting.
- **Interactive Visuals**:
  - Dynamic strength meters and radar charts.
  - **Confetti Celebration** for achieving "Very Strong" security scores.
  - Smooth animations powered by `framer-motion`.
- **Educational Tooltips**: Learn about security terms like "Entropy" and "Brute Force" right in the app.

### 🛠️ Utilities
- **Password Generator**: Create strong, random passwords with customizable length and character sets.
- **PDF Security Report**: Download a professional PDF summary of your password analysis.
- **History Tracking**: Locally stores your recent analyses (masked) for quick comparison.
- **Copy to Clipboard**: One-click copying for convenience.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/password-security-analyzer.git
    cd password-security-analyzer
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🏗️ Tech Stack

- **Frontend Framework**: [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Generation**: [html2canvas](https://html2canvas.hertzen.com/) & [jsPDF](https://github.com/parallax/jsPDF)
- **API**: [Have I Been Pwned](https://haveibeenpwned.com/API/v3)

## 🛡️ Security & Privacy

We take your privacy seriously.
- **Client-Side Only**: All logic, including entropy calculation and pattern matching, runs entirely in your browser.
- **Zero-Knowledge HIBP Check**: When checking for breaches, we only send the first 5 characters of the SHA-1 hash of your password. The full hash and the password itself **never** leave your device.
- **Local Storage**: Password history is stored in your browser's `localStorage` and is never transmitted.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
