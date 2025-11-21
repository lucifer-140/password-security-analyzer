import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';

const PasswordGenerator = ({ onGenerate }) => {
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
    });
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [copied, setCopied] = useState(false);

    const generatePassword = () => {
        const charset = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
        };

        let chars = '';
        if (options.uppercase) chars += charset.uppercase;
        if (options.lowercase) chars += charset.lowercase;
        if (options.numbers) chars += charset.numbers;
        if (options.symbols) chars += charset.symbols;

        if (chars === '') return;

        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        setGeneratedPassword(password);
        if (onGenerate) onGenerate(password);
        setCopied(false);
    };

    useEffect(() => {
        generatePassword();
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-lg p-6 mb-6 shadow-sm dark:shadow-none transition-colors duration-300">
            <h2 className="text-blue-600 dark:text-cyan-400 font-medium mb-4 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Generator Password
            </h2>

            <div className="bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg p-4 mb-4 flex items-center justify-between group transition-colors duration-300">
                <code className="text-xl font-mono text-slate-800 dark:text-white break-all mr-4">
                    {generatedPassword}
                </code>
                <div className="flex gap-2">
                    <button
                        onClick={generatePassword}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                        title="Generate New"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors relative"
                        title="Copy"
                    >
                        {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
                        <span>Panjang Password</span>
                        <span>{length} karakter</span>
                    </div>
                    <input
                        type="range"
                        min="8"
                        max="64"
                        value={length}
                        onChange={(e) => setLength(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-cyan-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(options).map(([key, value]) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${value
                                    ? 'bg-blue-600 dark:bg-cyan-500 border-blue-600 dark:border-cyan-500'
                                    : 'border-slate-300 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-500'
                                }`}>
                                {value && <Check size={14} className="text-white" />}
                            </div>
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={() => setOptions(prev => ({ ...prev, [key]: !prev[key] }))}
                                className="hidden"
                            />
                            <span className="text-slate-700 dark:text-slate-300 capitalize">{key}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PasswordGenerator;
