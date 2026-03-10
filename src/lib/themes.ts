export type ThemeMode = 'DEFAULT' | 'LEBARAN' | 'NATAL' | 'TAHUN_BARU' | 'NASIONAL';

export interface ThemeConfig {
    id: ThemeMode;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        cardBg: string;
        text: string;
        textMuted: string;
    };
    gradients: {
        header: string;
        main: string;
        card: string;
    };
}

export const themes: Record<ThemeMode, ThemeConfig> = {
    DEFAULT: {
        id: 'DEFAULT',
        name: 'Default (Navy & Gold)',
        colors: {
            primary: '#D4AF37', // Gold
            secondary: '#0a1120', // Navy Dark
            accent: '#3b82f6', // Blue
            background: '#0a1120',
            cardBg: 'rgba(30, 41, 59, 0.4)',
            text: '#ffffff',
            textMuted: 'rgba(255, 255, 255, 0.6)',
        },
        gradients: {
            header: 'from-gold via-yellow-200 to-gold',
            main: 'from-[#0a1120] to-[#0f172a]',
            card: 'from-navy-light/40 to-navy-dark/60',
        },
    },
    LEBARAN: {
        id: 'LEBARAN',
        name: 'Lebaran / Ramadhan',
        colors: {
            primary: '#D4AF37', // Gold
            secondary: '#064e3b', // Deep Green
            accent: '#10b981', // Emerald
            background: '#022c22',
            cardBg: 'rgba(6, 78, 59, 0.4)',
            text: '#ffffff',
            textMuted: 'rgba(255, 255, 255, 0.7)',
        },
        gradients: {
            header: 'from-gold via-yellow-100 to-gold',
            main: 'from-[#022c22] to-[#064e3b]',
            card: 'from-emerald-900/40 to-emerald-950/60',
        },
    },
    NATAL: {
        id: 'NATAL',
        name: 'Natal / Christmas',
        colors: {
            primary: '#ef4444', // Red
            secondary: '#064e3b', // Green
            accent: '#ffffff', // White
            background: '#0a1120',
            cardBg: 'rgba(153, 27, 27, 0.2)',
            text: '#ffffff',
            textMuted: 'rgba(255, 255, 255, 0.6)',
        },
        gradients: {
            header: 'from-red-500 via-white to-green-500',
            main: 'from-[#0f172a] to-[#7f1d1d]',
            card: 'from-red-900/40 to-red-950/60',
        },
    },
    TAHUN_BARU: {
        id: 'TAHUN_BARU',
        name: 'Tahun Baru',
        colors: {
            primary: '#ffffff', // White
            secondary: '#000000', // Black
            accent: '#D4AF37', // Gold
            background: '#000000',
            cardBg: 'rgba(31, 41, 55, 0.6)',
            text: '#ffffff',
            textMuted: 'rgba(255, 255, 255, 0.5)',
        },
        gradients: {
            header: 'from-white via-gold to-white',
            main: 'from-black via-gray-900 to-black',
            card: 'from-gray-800 to-black',
        },
    },
    NASIONAL: {
        id: 'NASIONAL',
        name: 'Hari Nasional',
        colors: {
            primary: '#ef4444', // Red
            secondary: '#ffffff', // White
            accent: '#D4AF37', // Gold
            background: '#450a0a',
            cardBg: 'rgba(127, 29, 29, 0.4)',
            text: '#ffffff',
            textMuted: 'rgba(255, 255, 255, 0.8)',
        },
        gradients: {
            header: 'from-red-600 via-white to-red-600',
            main: 'from-red-900 to-white/10',
            card: 'from-red-800 to-red-950',
        },
    },
};
