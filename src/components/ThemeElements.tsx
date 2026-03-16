import React from 'react';
import { ThemeMode, themes } from '../lib/themes';

// --- Shared Elements ---

export const Star: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

// --- Ramadan Elements ---

export const MosqueSilhouette: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
        <rect x="35" y="55" width="30" height="45" />
        <ellipse cx="50" cy="55" rx="20" ry="22" />
        <rect x="5" y="65" width="20" height="35" />
        <ellipse cx="15" cy="65" rx="12" ry="13" />
        <rect x="75" y="65" width="20" height="35" />
        <ellipse cx="85" cy="65" rx="12" ry="13" />
        <rect x="48" y="15" width="4" height="25" />
        <polygon points="50,8 53,19 47,19" />
        <rect x="13" y="42" width="4" height="16" />
        <rect x="83" y="42" width="4" height="16" />
    </svg>
);

export const RamadanLantern: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 40 70" fill="currentColor" className={className}>
        <path d="M15 0h10v6H15zM5 25c0-10 5-15 15-15s15 5 15 15v20c0 10-5 15-15 15s-15-5-15-15V25z" opacity="0.8" />
        <rect x="10" y="20" width="20" height="30" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
        <line x1="20" y1="20" x2="20" y2="50" stroke="currentColor" strokeWidth="0.5" />
        <rect x="17" y="63" width="6" height="7" />
    </svg>
);

export const CrescentMoon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
        <path d="M50 10 A40 40 0 1 0 50 90 A30 30 0 1 1 50 10 Z" />
    </svg>
);

export const IslamicPattern: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" className={className}>
        <pattern id="islamic-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M10 0 L20 10 L10 20 L0 10 Z" />
            <circle cx="10" cy="10" r="3" />
            <path d="M0 0 L20 20 M20 0 L0 20" strokeWidth="0.2" />
        </pattern>
        <rect width="100" height="100" fill="url(#islamic-grid)" />
    </svg>
);

// --- Christmas Elements ---

export const ChristmasTree: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
        <polygon points="50,5 78,40 22,40" />
        <polygon points="50,25 82,62 18,62" />
        <polygon points="50,45 86,85 14,85" />
        <rect x="44" y="85" width="12" height="15" fill="#78350f" />
    </svg>
);

export const Snowflake: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
    </svg>
);

export const GiftBox: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <rect x="3" y="10" width="18" height="11" rx="1" />
        <rect x="2" y="7" width="20" height="3" rx="1" />
        <path d="M12 7V3h2a2 2 0 0 1 0 4h-4a2 2 0 0 1 0-4h2v4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

// --- New Year Elements ---

export const Firework: React.FC<{ className?: string; color?: string }> = ({ className, color = "currentColor" }) => (
    <svg viewBox="0 0 80 80" className={className}>
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, j) => {
            const rad = (angle * Math.PI) / 180;
            const x2 = 40 + Math.cos(rad) * 35;
            const y2 = 40 + Math.sin(rad) * 35;
            return <line key={j} x1="40" y1="40" x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeLinecap="round" />;
        })}
        <circle cx="40" cy="40" r="4" fill={color} />
    </svg>
);

// --- Indonesia Elements ---

export const GarudaSilhouette: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
        <path d="M50 20 L60 45 L85 40 L65 60 L72 85 L50 70 L28 85 L35 60 L15 40 L40 45 Z" />
        <circle cx="50" cy="52" r="12" />
    </svg>
);

export const BatikPattern: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className}>
        <pattern id="batik-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M20 5 L20 35 M5 20 L35 20 M10 10 L30 30 M30 10 L10 30" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="20" cy="20" r="3" fill="currentColor" />
        </pattern>
        <rect width="100" height="100" fill="url(#batik-grid)" opacity="0.1" />
    </svg>
);

// --- Chinese New Year Elements ---

export const ChineseLantern: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
        <ellipse cx="50" cy="50" rx="35" ry="40" />
        <rect x="35" y="10" width="30" height="8" rx="2" />
        <rect x="35" y="82" width="30" height="8" rx="2" />
        <path d="M50 90 L50 100 M45 90 L45 98 M55 90 L55 98" stroke="currentColor" strokeWidth="2" />
        <path d="M25 50 Q50 50 75 50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <path d="M50 10 Q50 50 50 90" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    </svg>
);

export const ChineseCoin: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
        <circle cx="50" cy="50" r="45" />
        <rect x="35" y="35" width="30" height="30" fill="black" opacity="0.2" />
    </svg>
);

// --- Background Components ---

export const ThemeBackground: React.FC<{ theme: ThemeMode }> = ({ theme }) => {
    switch (theme) {
        case 'LEBARAN':
            return (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#0F4C3A]/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 right-0 opacity-[0.07] w-[320px]">
                        <MosqueSilhouette className="text-[#D4AF37]" />
                    </div>
                    <div className="absolute top-10 left-10 opacity-[0.08] w-[180px]">
                        <IslamicPattern className="text-[#D4AF37]" />
                    </div>
                    <div className="absolute top-8 right-16 opacity-[0.07] w-[100px]">
                        <RamadanLantern className="text-[#D4AF37]" />
                    </div>
                    <div className="absolute top-20 left-1/2 opacity-[0.06] w-[120px]">
                        <div className="relative">
                            <CrescentMoon className="text-[#F3E5AB]" />
                            <Star className="absolute top-4 right-4 w-6 h-6 text-[#D4AF37]" />
                        </div>
                    </div>
                </div>
            );

        case 'NATAL':
            return (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#C8102E]/10 rounded-full blur-[100px]" />
                    <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#1A4325]/10 rounded-full blur-[80px]" />
                    {[...Array(15)].map((_, i) => (
                        <div key={i} className="snowflake text-white absolute"
                            style={{
                                left: `${(Math.random() * 100)}%`,
                                top: `-20px`,
                                animation: `fall ${5 + Math.random() * 10}s linear infinite`,
                                animationDelay: `${Math.random() * 5}s`,
                                opacity: 0.1 + Math.random() * 0.3,
                                fontSize: `${0.5 + Math.random() * 1.5}rem`
                            }}>❄</div>
                    ))}
                    <div className="absolute bottom-0 right-0 opacity-[0.07] w-[250px]">
                        <ChristmasTree className="text-[#1A4325]" />
                    </div>
                    <div className="absolute top-8 left-1/3 opacity-[0.06] w-[80px]">
                        <Star className="text-[#D4AF37]" />
                    </div>
                    <div className="absolute bottom-10 left-10 opacity-[0.1] w-[100px]">
                        <GiftBox className="text-[#C8102E]" />
                    </div>
                </div>
            );

        case 'TAHUN_BARU':
            return (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#1A1B41]/20 to-transparent" />
                    {[
                        { left: '20%', top: '25%', delay: '0s', color: '#FFD700' },
                        { left: '50%', top: '30%', delay: '1.2s', color: '#FFFFFF' },
                        { left: '75%', top: '20%', delay: '0.6s', color: '#E0E0E0' },
                        { left: '35%', top: '40%', delay: '1.8s', color: '#FFD700' },
                        { left: '65%', top: '35%', delay: '0.3s', color: '#E0E0E0' },
                    ].map((fw, i) => (
                        <div key={i} className="absolute opacity-20" style={{ left: fw.left, top: fw.top, animation: `ping ${3 + i}s cubic-bezier(0, 0, 0.2, 1) infinite` }}>
                            <Firework color={fw.color} className="w-20 h-20" />
                        </div>
                    ))}
                    {[...Array(30)].map((_, i) => (
                        <div key={i} className="absolute w-1 h-1 rounded-full bg-white/20"
                            style={{ left: `${(Math.random() * 100)}%`, top: `${(Math.random() * 100)}%` }} />
                    ))}
                </div>
            );

        case 'NASIONAL':
            return (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-[#E53935]/10 blur-[80px]" />
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-slate-200/50 blur-[80px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] opacity-[0.05]">
                        <GarudaSilhouette className="text-[#D4AF37]" />
                    </div>
                    <div className="absolute inset-0">
                        <BatikPattern className="w-full h-full text-[#E53935] opacity-[0.03]" />
                    </div>
                    <div className="absolute bottom-10 right-10 opacity-[0.15] w-[200px] rotate-6">
                        <svg viewBox="0 0 100 65" className="w-full h-auto drop-shadow-lg">
                            <rect width="100" height="32" fill="#E53935" />
                            <rect y="32" width="100" height="33" fill="#ffffff" />
                            <rect x="0" y="0" width="4" height="65" fill="#78350f" />
                        </svg>
                    </div>
                </div>
            );

        case 'IMLEK':
            return (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4A0404] via-[#990000] to-[#4A0404]" style={{ opacity: 0.1 }} />
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#FFD700]/10 rounded-full blur-[120px]" />

                    <div className="absolute top-0 left-0 w-full flex justify-around p-4 opacity-20">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-bounce" style={{ animationDuration: `${3 + i}s` }}>
                                <ChineseLantern className="text-[#FFD700] w-12 h-12" />
                            </div>
                        ))}
                    </div>

                    <div className="absolute bottom-10 right-10 opacity-[0.08] w-[300px]">
                        <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#FFD700]">
                            <path d="M10 80 Q30 50 50 80 T90 80" fill="none" stroke="currentColor" strokeWidth="2" />
                            <path d="M10 70 Q30 40 50 70 T90 70" fill="none" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </div>

                    <div className="absolute top-1/2 left-10 opacity-[0.15] space-y-4">
                        <ChineseCoin className="text-[#FFD700] w-8 h-8" />
                        <ChineseCoin className="text-[#FFD700] w-8 h-8 translate-x-4" />
                        <ChineseCoin className="text-[#FFD700] w-8 h-8" />
                    </div>
                </div>
            );

        default:
            return (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px]" />
                </div>
            );
    }
};

export const ThemeTicketDecoration: React.FC<{ theme: ThemeMode; position: 'top-right' | 'bottom-left' }> = ({ theme, position }) => {
    const isTopRight = position === 'top-right';
    const containerClasses = `absolute ${isTopRight ? 'top-2 right-2' : 'bottom-2 left-2'} opacity-20 pointer-events-none`;

    switch (theme) {
        case 'LEBARAN':
            return (
                <div className={containerClasses}>
                    {isTopRight ? (
                        <div className="flex gap-1 justify-end items-start text-[#D4AF37]">
                            <CrescentMoon className="w-8 h-8" />
                            <Star className="w-3 h-3 mt-1" />
                        </div>
                    ) : (
                        <RamadanLantern className="w-10 h-10 text-[#D4AF37]" />
                    )}
                </div>
            );
        case 'NATAL':
            return (
                <div className={containerClasses}>
                    {isTopRight ? <Snowflake className="w-8 h-8 text-white" /> : <GiftBox className="w-8 h-8 text-[#C8102E]" />}
                </div>
            );
        case 'TAHUN_BARU':
            return (
                <div className={containerClasses}>
                    {isTopRight ? <Firework color="#FFD700" className="w-10 h-10" /> : <Star className="w-6 h-6 text-[#E0E0E0]" />}
                </div>
            );
        case 'NASIONAL':
            return (
                <div className={containerClasses}>
                    {isTopRight ? (
                        <div className="w-10 h-6 border border-gray-200">
                            <div className="h-1/2 bg-[#E53935]" />
                            <div className="h-1/2 bg-white" />
                        </div>
                    ) : (
                        <GarudaSilhouette className="w-10 h-10 text-[#D4AF37]" />
                    )}
                </div>
            );
        case 'IMLEK':
            return (
                <div className={containerClasses}>
                    {isTopRight ? <ChineseLantern className="w-10 h-10 text-[#FFD700]" /> : <ChineseCoin className="w-8 h-8 text-[#FFD700]" />}
                </div>
            );
        default:
            return null;
    }
};
