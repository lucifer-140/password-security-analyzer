import { useState, useEffect, useRef } from 'react';
import { PasswordModel } from '../models/PasswordModel';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const usePasswordController = (darkMode) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [activeTab, setActiveTab] = useState('analyze');
    const [copied, setCopied] = useState(false);
    const [history, setHistory] = useState([]);
    const reportRef = useRef(null);

    // Instantiate the model once
    const model = useRef(new PasswordModel()).current;

    useEffect(() => {
        const savedHistory = localStorage.getItem('passwordHistory');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    const triggerConfetti = () => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 }
        };

        function fire(particleRatio, opts) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    };

    const addToHistory = (pwd, score, strength, color) => {
        if (!pwd) return;
        const newEntry = {
            id: Date.now(),
            password: pwd,
            score,
            strength,
            color,
            timestamp: new Date().toISOString()
        };

        const updatedHistory = [newEntry, ...history].slice(0, 10);
        setHistory(updatedHistory);
        localStorage.setItem('passwordHistory', JSON.stringify(updatedHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('passwordHistory');
    };

    useEffect(() => {
        const result = model.analyze(password);
        setAnalysis(result);

        // Trigger confetti if score is high and it's a new analysis
        if (result && result.score >= 90 && password.length > 0) {
            const timeout = setTimeout(() => {
                triggerConfetti();
            }, 500);
            return () => clearTimeout(timeout);
        }

        const timeoutId = setTimeout(() => {
            if (result && password.length > 0) {
                const lastEntry = history[0];
                if (!lastEntry || lastEntry.password !== password) {
                    addToHistory(password, result.score, result.strength, result.color);
                }
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [password]); // Removed history dependency to avoid infinite loop, added to addToHistory logic instead

    const handleCopy = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadReport = async () => {
        if (!reportRef.current) return;

        try {
            const canvas = await html2canvas(reportRef.current, {
                backgroundColor: darkMode ? '#020617' : '#ffffff',
                scale: 2
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('password-security-report.pdf');
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    return {
        state: {
            password,
            showPassword,
            analysis,
            activeTab,
            copied,
            history,
            reportRef
        },
        actions: {
            setPassword,
            setShowPassword,
            setActiveTab,
            handleCopy,
            handleDownloadReport,
            clearHistory
        }
    };
};
