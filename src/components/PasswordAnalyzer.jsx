import React from 'react';
import { Eye, EyeOff, Shield, AlertTriangle, CheckCircle, Copy, Check, History, Trash2, Download, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PasswordGenerator from './PasswordGenerator';
import { usePasswordController } from '../controllers/usePasswordController';

const Tooltip = ({ text }) => (
    <div className="group relative inline-block ml-2">
        <Info size={14} className="text-slate-400 cursor-help hover:text-blue-500 dark:hover:text-cyan-400 transition-colors" />
        <div className="invisible group-hover:visible absolute z-50 w-64 p-3 mt-2 text-xs text-slate-200 bg-slate-900/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-700/50 -left-28 top-full opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
            {text}
            <div className="absolute w-2 h-2 bg-slate-900/95 rotate-45 -top-1 left-1/2 -translate-x-1/2 border-l border-t border-slate-700/50"></div>
        </div>
    </div>
);

const PasswordAnalyzer = ({ darkMode }) => {
    const { state, actions } = usePasswordController(darkMode);
    const { password, showPassword, analysis, activeTab, copied, history, reportRef } = state;
    const { setPassword, setShowPassword, setActiveTab, handleCopy, handleDownloadReport, clearHistory } = actions;

    const formatTime = (seconds) => {
        if (seconds < 1) return '< 1 detik';
        if (seconds < 60) return `${seconds.toFixed(1)} detik`;
        if (seconds < 3600) return `${(seconds / 60).toFixed(1)} menit`;
        if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} jam`;
        if (seconds < 31536000) return `${(seconds / 86400).toFixed(1)} hari`;
        if (seconds < 31536000000) return `${(seconds / 31536000).toFixed(1)} tahun`;
        return '> 1000 tahun';
    };

    return (
        <div className="max-w-7xl mx-auto p-6 pt-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8"
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-200 dark:border-blue-500/30 shadow-lg shadow-blue-500/10 backdrop-blur-sm">
                        <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Password Security Analyzer</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Sistem Analisis Keamanan Password Canggih</p>
                    </div>
                </div>

                {analysis && (
                    <button
                        onClick={handleDownloadReport}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md"
                    >
                        <Download size={18} />
                        <span className="hidden sm:inline font-medium">Download Report</span>
                    </button>
                )}
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl mb-8 w-fit border border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => setActiveTab('analyze')}
                    className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${activeTab === 'analyze'
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                >
                    Analisis Password
                </button>
                <button
                    onClick={() => setActiveTab('generate')}
                    className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${activeTab === 'generate'
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                >
                    Generator Password
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'analyze' ? (
                    <motion.div
                        key="analyze"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        ref={reportRef}
                        className="p-4 -m-4"
                    >
                        {/* Input Section */}
                        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 mb-8 shadow-xl shadow-slate-200/50 dark:shadow-black/20 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Test Password Anda</h2>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Masukkan password untuk mengetahui seberapa kuat keamanannya</p>
                            <div className="relative group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-cyan-500/10 transition-all duration-200 pr-24 font-mono"
                                    placeholder="Masukkan password..."
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                                    <button
                                        onClick={handleCopy}
                                        className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-500/10 rounded-lg transition-all duration-200"
                                        title="Copy"
                                    >
                                        {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                    </button>
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-blue-50 dark:hover:bg-cyan-500/10 rounded-lg transition-all duration-200"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {analysis && (
                            <>
                                {/* Score Section */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 mb-8 shadow-xl shadow-slate-200/50 dark:shadow-black/20 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Skor Kekuatan</h2>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Evaluasi kekuatan password Anda</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-4xl font-bold tracking-tight" style={{ color: analysis.color }}>
                                                {analysis.score}
                                                <span className="text-2xl text-slate-400 dark:text-slate-600">/100</span>
                                            </div>
                                            <div className="text-sm font-medium mt-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 inline-block" style={{ color: analysis.color }}>
                                                {analysis.strength}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner">
                                        <motion.div
                                            className="h-full rounded-full shadow-sm"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${analysis.score}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            style={{ backgroundColor: analysis.color }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-slate-400 dark:text-slate-500 mt-3 px-1">
                                        <span>0</span>
                                        <span>25</span>
                                        <span>50</span>
                                        <span>75</span>
                                        <span>100</span>
                                    </div>
                                </motion.div>

                                {/* Warning Section */}
                                {analysis.warnings.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-2xl p-6 mb-8"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-orange-900 dark:text-orange-200 font-semibold mb-3">Peringatan Keamanan</h3>
                                                <ul className="space-y-2">
                                                    {analysis.warnings.map((warning, idx) => (
                                                        <li key={idx} className="flex items-center gap-2 text-orange-700 dark:text-orange-300/90 text-sm">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 dark:bg-orange-500 flex-shrink-0"></span>
                                                            {warning}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Charts Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                    {/* Security Metrics Radar */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-black/20"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                                                <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-cyan-400"></div>
                                            </div>
                                            <h3 className="text-slate-900 dark:text-white font-semibold flex items-center">
                                                Metrik Keamanan
                                                <Tooltip text="Analisis mendalam berdasarkan panjang, kompleksitas karakter, keunikan, dan entropi informasi." />
                                            </h3>
                                        </div>
                                        <div className="space-y-4">
                                            {Object.entries(analysis.metrics).map(([key, value]) => (
                                                <div key={key}>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-slate-600 dark:text-slate-400 font-medium">{key}</span>
                                                        <span className="text-blue-600 dark:text-cyan-400 font-bold">{Math.round(value)}%</span>
                                                    </div>
                                                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-cyan-500 dark:to-blue-500 rounded-full shadow-sm"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${value}%` }}
                                                            transition={{ duration: 0.5, delay: 0.2 }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Crack Time Chart */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-black/20"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                                                <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-cyan-400"></div>
                                            </div>
                                            <h3 className="text-slate-900 dark:text-white font-semibold flex items-center">
                                                Waktu Untuk Dibobol
                                                <Tooltip text="Estimasi waktu yang dibutuhkan komputer canggih untuk menebak password ini dengan metode Brute Force." />
                                            </h3>
                                        </div>
                                        <div className="space-y-5">
                                            {Object.entries(analysis.crackTimes).map(([key, seconds], idx) => {
                                                const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981'];
                                                const maxLog = 20;
                                                const logValue = Math.log10(seconds + 1);
                                                const barWidth = Math.min((logValue / maxLog) * 100, 100);

                                                return (
                                                    <div key={key}>
                                                        <div className="flex justify-between text-sm mb-2">
                                                            <span className="text-slate-600 dark:text-slate-400 font-medium">{key}</span>
                                                            <span className="text-blue-600 dark:text-cyan-400 text-xs font-mono bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">{formatTime(seconds)}</span>
                                                        </div>
                                                        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg relative overflow-hidden shadow-inner">
                                                            <motion.div
                                                                className="h-full flex items-center justify-center opacity-90"
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${barWidth}%` }}
                                                                transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
                                                                style={{ backgroundColor: colors[idx] }}
                                                            >
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Recommendations */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/20"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                                        </div>
                                        <h3 className="text-slate-900 dark:text-white font-semibold">Rekomendasi Peningkatan</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {analysis.recommendations.slice(0, 8).map((rec, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Check size={12} className="text-green-600 dark:text-green-400" />
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{rec}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="generate"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <PasswordGenerator onGenerate={(pwd) => {
                            setPassword(pwd);
                        }} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* History Section */}
            <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        <h3 className="text-slate-700 dark:text-slate-300 font-semibold">Riwayat Analisis</h3>
                    </div>
                    {history.length > 0 && (
                        <button
                            onClick={clearHistory}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-1.5 font-medium"
                        >
                            <Trash2 size={12} /> Hapus Riwayat
                        </button>
                    )}
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        <History className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-500 text-sm">Belum ada riwayat analisis.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {history.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 group">
                                <div className="overflow-hidden">
                                    <div className="text-slate-700 dark:text-slate-300 font-mono text-sm truncate group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                                        {item.password.substring(0, 3) + '••••••' + item.password.substring(item.password.length - 2)}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">{new Date(item.timestamp).toLocaleTimeString()}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-lg leading-none" style={{ color: item.color }}>{item.score}</div>
                                    <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mt-1">{item.strength}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PasswordAnalyzer;
