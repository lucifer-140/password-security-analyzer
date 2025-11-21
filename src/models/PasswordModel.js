/**
 * PasswordModel.js
 * 
 * This class encapsulates all the business logic for password analysis.
 * It is a pure logic layer and has no dependencies on React or the UI.
 */
export class PasswordModel {
    constructor() {
        this.commonPasswords = new Set([
            'password', '123456', 'password123', 'admin', 'qwerty',
            'letmein', 'welcome', 'monkey', '123456789', '12345678',
            '12345', '1234567', '1234567890', 'abc123', 'password1'
        ]);
    }

    /**
     * Calculates the information entropy of a password in bits.
     * Formula: L * log2(R)
     */
    calculateEntropy(pwd) {
        let charSet = 0;
        if (/[a-z]/.test(pwd)) charSet += 26;
        if (/[A-Z]/.test(pwd)) charSet += 26;
        if (/[0-9]/.test(pwd)) charSet += 10;
        if (/[^a-zA-Z0-9]/.test(pwd)) charSet += 32;
        return charSet > 0 ? pwd.length * Math.log2(charSet) : 0;
    }

    /**
     * Analyzes a password and returns a comprehensive security report.
     */
    analyze(pwd) {
        if (!pwd) return null;

        const checks = {
            length: pwd.length >= 12,
            lowercase: /[a-z]/.test(pwd),
            uppercase: /[A-Z]/.test(pwd),
            number: /[0-9]/.test(pwd),
            special: /[^a-zA-Z0-9]/.test(pwd)
        };

        const hasSequential = /(?:abc|bcd|cde|123|234|345|456|567|678|789)/i.test(pwd);
        const hasRepeated = /(.)\1{2,}/.test(pwd);
        const hasKeyboard = /qwerty|asdfgh|zxcvbn/i.test(pwd);
        const isCommon = this.commonPasswords.has(pwd.toLowerCase());

        const entropy = this.calculateEntropy(pwd);
        const complexityScore = Object.values(checks).filter(Boolean).length;

        // Scoring Algorithm
        let score = 0;
        score += Math.min(pwd.length / 16, 1) * 30;
        score += (complexityScore / 5) * 30;
        score += isCommon ? 0 : 20;
        score += (hasSequential || hasRepeated || hasKeyboard) ? 0 : 10;
        score += Math.min(entropy / 80, 1) * 10;

        // Determine Strength Label & Color
        let strength = 'Sangat Lemah';
        let color = '#ef4444';
        if (score >= 90) {
            strength = 'Sangat Kuat';
            color = '#3b82f6';
        } else if (score >= 75) {
            strength = 'Kuat';
            color = '#10b981';
        } else if (score >= 50) {
            strength = 'Sedang';
            color = '#f59e0b';
        } else if (score >= 25) {
            strength = 'Lemah';
            color = '#f97316';
        }

        // Generate Warnings
        const warnings = [];
        if (pwd.length < 12) warnings.push('Password terlalu pendek (minimal 12 karakter)');
        if (!checks.uppercase) warnings.push('Tambahkan huruf KAPITAL');
        if (!checks.special) warnings.push('Tambahkan karakter spesial (!@#$%)');
        if (isCommon) warnings.push('Password ini terlalu umum dan mudah ditebak');
        if (hasSequential) warnings.push('Hindari urutan karakter berurutan (abc, 123)');
        if (hasRepeated) warnings.push('Hindari pengulangan karakter');
        if (hasKeyboard) warnings.push('Hindari pola keyboard (qwerty)');

        // Calculate Crack Times
        const crackTimes = {
            'BF 10^6 ops/sec': Math.pow(2, entropy) / 1e6,
            'BF 10^9 ops/sec': Math.pow(2, entropy) / 1e9,
            'BF 10^12 ops/sec': Math.pow(2, entropy) / 1e12,
            'BF 10^15 ops/sec': Math.pow(2, entropy) / 1e15,
        };

        // Generate Recommendations
        const recommendations = [
            'Panjangkan passwordmu menjadi minimal 12 karakter',
            'Gunakan kombinasi huruf besar, kecil, angka, dan simbol',
            'Gunakan frasa sandi (passphrase) yang mudah diingat tapi sulit ditebak',
            'Jangan gunakan informasi pribadi seperti nama atau tanggal lahir',
            'Gunakan password manager untuk menyimpan password yang kuat dan unik',
            'Aktifkan autentikasi dua faktor (2FA) dimana pun tersedia',
            'Jangan gunakan ulang password untuk akun yang berbeda'
        ];

        // Detailed Metrics
        const metrics = {
            'Panjang': Math.min((pwd.length / 16) * 100, 100),
            'Kompleksitas': (complexityScore / 5) * 100,
            'Keunikan': isCommon ? 0 : 100,
            'Entropi': Math.min((entropy / 80) * 100, 100),
            'Pola': (hasSequential || hasRepeated || hasKeyboard) ? 50 : 100
        };

        return {
            score: Math.round(score),
            strength,
            color,
            checks,
            warnings,
            entropy: entropy.toFixed(1),
            crackTimes,
            recommendations,
            metrics,
            isCommon
        };
    }
}
