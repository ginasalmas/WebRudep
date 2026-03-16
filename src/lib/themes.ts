export type ThemeMode = 'DEFAULT' | 'LEBARAN' | 'NATAL' | 'TAHUN_BARU' | 'NASIONAL' | 'IMLEK';

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
            primary: '#D4AF37', // Elegant Gold
            secondary: '#0F4C3A', // Rich Emerald Green
            accent: '#F3E5AB', // Soft Vanilla
            background: '#06281D', // Deep Forest Green
            cardBg: 'rgba(15, 76, 58, 0.4)',
            text: '#F8FAFC',
            textMuted: 'rgba(248, 250, 252, 0.65)',
        },
        gradients: {
            header: 'from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]',
            main: 'from-[#06281D] via-[#0A3D2A] to-[#0F4C3A]',
            card: 'from-[#0F4C3A]/50 to-[#14664D]/50',
        },
    },
    NATAL: {
        id: 'NATAL',
        name: 'Natal / Christmas',
        colors: {
            primary: '#C8102E', // Deep Christmas Red
            secondary: '#1A4325', // Alpine Green
            accent: '#D4AF37', // Classic Gold
            background: '#0D2112', // Very Dark Green
            cardBg: 'rgba(26, 67, 37, 0.4)',
            text: '#F8FAFC',
            textMuted: 'rgba(248, 250, 252, 0.7)',
        },
        gradients: {
            header: 'from-[#C8102E] via-[#D4AF37] to-[#C8102E]',
            main: 'from-[#0D2112] via-[#112F1A] to-[#1A4325]',
            card: 'from-[#1A4325]/50 to-[#2A5C37]/50',
        },
    },
    TAHUN_BARU: {
        id: 'TAHUN_BARU',
        name: 'Tahun Baru',
        colors: {
            primary: '#FFD700', // Bright Gold
            secondary: '#1A1B41', // Midnight Blue
            accent: '#E0E0E0', // Silver
            background: '#0B0C10', // Deep Black/Blue
            cardBg: 'rgba(26, 27, 65, 0.5)',
            text: '#FFFFFF',
            textMuted: 'rgba(255, 255, 255, 0.65)',
        },
        gradients: {
            header: 'from-[#FFD700] via-[#FFFFFF] to-[#FFD700]',
            main: 'from-[#0B0C10] via-[#14152A] to-[#1A1B41]',
            card: 'from-[#1A1B41]/50 to-[#26285E]/50',
        },
    },
    NASIONAL: {
        id: 'NASIONAL',
        name: 'Hari Nasional',
        colors: {
            primary: '#E53935', // Crimson Red
            secondary: '#F8FAFC', // Slate White
            accent: '#D4AF37', // Gold 
            background: '#F1F5F9', // Light Slate
            cardBg: 'rgba(255, 255, 255, 0.9)',
            text: '#0F172A', // Slate 900
            textMuted: '#64748B', // Slate 500
        },
        gradients: {
            header: 'from-[#E53935] via-[#FF6B6B] to-[#E53935]',
            main: 'from-[#F1F5F9] via-[#E2E8F0] to-[#F1F5F9]',
            card: 'from-[#FFFFFF] to-[#F8FAFC]',
        },
    },
    IMLEK: {
        id: 'IMLEK',
        name: 'Tahun Baru Imlek',
        colors: {
            primary: '#FFD700', // Imperial Gold
            secondary: '#990000', // Deep Imperial Red
            accent: '#FFA500', // Orange/Gold
            background: '#4A0404', // Very Deep Red
            cardBg: 'rgba(153, 0, 0, 0.4)',
            text: '#F8FAFC',
            textMuted: 'rgba(255, 215, 0, 0.7)',
        },
        gradients: {
            header: 'from-[#FFD700] via-[#FFE55C] to-[#FFD700]',
            main: 'from-[#4A0404] via-[#660000] to-[#990000]',
            card: 'from-[#990000]/50 to-[#B30000]/50',
        },
    },
};
