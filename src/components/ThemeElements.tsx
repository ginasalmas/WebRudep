import React from 'react';
import { ThemeMode } from '../lib/themes';

export const ThemeBackground: React.FC<{ theme: ThemeMode }> = ({ theme }) => {
    switch (theme) {
        case 'LEBARAN':
            return (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
                    {/* Mosque silhouette */}
                    <div className="absolute bottom-0 right-0 opacity-[0.07] w-[320px]">
                        <svg viewBox="0 0 100 100" fill="currentColor" className="text-emerald-300 w-full h-auto">
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
                    </div>
                    {/* Ketupat */}
                    <div className="absolute top-10 left-10 opacity-[0.08] w-[180px]">
                        <svg viewBox="0 0 100 100" fill="currentColor" className="text-amber-300 w-full h-auto">
                            <path d="M50 5 L95 50 L50 95 L5 50 Z" />
                            <path d="M50 5 L50 95 M5 50 L95 50 M20 20 L80 80 M80 20 L20 80" stroke="rgba(0,50,0,0.4)" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                    {/* Lantern */}
                    <div className="absolute top-8 right-16 opacity-[0.07] w-[100px]">
                        <svg viewBox="0 0 40 70" fill="currentColor" className="text-amber-400 w-full h-auto">
                            <rect x="15" y="0" width="10" height="6" />
                            <ellipse cx="20" cy="35" rx="15" ry="28" />
                            <rect x="17" y="63" width="6" height="7" />
                        </svg>
                    </div>
                    {/* Crescent moon */}
                    <div className="absolute top-20 left-1/2 opacity-[0.06] w-[120px]">
                        <svg viewBox="0 0 100 100" fill="currentColor" className="text-amber-200 w-full h-auto">
                            <path d="M50 10 A40 40 0 1 0 50 90 A30 30 0 1 1 50 10 Z" />
                            <polygon points="80,20 83,30 93,30 85,36 88,46 80,40 72,46 75,36 67,30 77,30" />
                        </svg>
                    </div>
                </div>
            );

        case 'NATAL':
            return (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px]" />
                    {[
                        { left: '5%', delay: '0s', size: '1.2rem', op: 0.3, dur: '9s' },
                        { left: '15%', delay: '1s', size: '0.9rem', op: 0.2, dur: '11s' },
                        { left: '25%', delay: '0.5s', size: '1.5rem', op: 0.4, dur: '8s' },
                        { left: '35%', delay: '2s', size: '1rem', op: 0.25, dur: '12s' },
                        { left: '45%', delay: '0.8s', size: '1.3rem', op: 0.35, dur: '10s' },
                        { left: '55%', delay: '1.5s', size: '0.8rem', op: 0.2, dur: '13s' },
                        { left: '65%', delay: '0.3s', size: '1.4rem', op: 0.3, dur: '9.5s' },
                        { left: '75%', delay: '1.8s', size: '1.1rem', op: 0.4, dur: '11.5s' },
                        { left: '85%', delay: '0.7s', size: '1.6rem', op: 0.25, dur: '8.5s' },
                        { left: '92%', delay: '1.2s', size: '0.9rem', op: 0.3, dur: '10.5s' },
                    ].map((sf, i) => (
                        <div key={i} className="snowflake text-white" style={{ left: sf.left, animationDelay: sf.delay, fontSize: sf.size, opacity: sf.op, animationDuration: sf.dur }}>❄</div>
                    ))}
                    {/* Pine tree */}
                    <div className="absolute bottom-0 right-0 opacity-[0.07] w-[250px]">
                        <svg viewBox="0 0 100 100" fill="currentColor" className="text-green-500 w-full h-auto">
                            <polygon points="50,5 78,40 22,40" />
                            <polygon points="50,25 82,62 18,62" />
                            <polygon points="50,45 86,85 14,85" />
                            <rect x="44" y="85" width="12" height="15" fill="#78350f" />
                        </svg>
                    </div>
                    {/* Star */}
                    <div className="absolute top-8 right-1/3 opacity-[0.06] w-[80px]">
                        <svg viewBox="0 0 100 100" fill="currentColor" className="text-yellow-200 w-full h-auto">
                            <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" />
                        </svg>
                    </div>
                </div>
            );

        case 'TAHUN_BARU':
            return (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
                    {[
                        { left: '20%', top: '25%', delay: '0s', color: '#D4AF37' },
                        { left: '50%', top: '30%', delay: '1.2s', color: '#ffffff' },
                        { left: '75%', top: '20%', delay: '0.6s', color: '#fbbf24' },
                        { left: '35%', top: '40%', delay: '1.8s', color: '#e879f9' },
                        { left: '65%', top: '35%', delay: '0.3s', color: '#60a5fa' },
                    ].map((fw, i) => (
                        <div key={i} className="absolute opacity-20" style={{ left: fw.left, top: fw.top }}>
                            <svg viewBox="0 0 80 80" width="80" height="80">
                                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, j) => {
                                    const rad = (angle * Math.PI) / 180;
                                    const x2 = 40 + Math.cos(rad) * 35;
                                    const y2 = 40 + Math.sin(rad) * 35;
                                    return <line key={j} x1="40" y1="40" x2={x2} y2={y2} stroke={fw.color} strokeWidth="2" strokeLinecap="round" />;
                                })}
                                <circle cx="40" cy="40" r="4" fill={fw.color} />
                            </svg>
                        </div>
                    ))}
                    {[...Array(30)].map((_, i) => (
                        <div key={i} className="absolute w-1 h-1 rounded-full bg-white/20"
                            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }} />
                    ))}
                </div>
            );

        case 'NASIONAL':
            return (
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-red-600/15 blur-[80px]" />
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white/5 blur-[80px]" />
                    {/* Bintang Garuda */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] opacity-[0.04]">
                        <svg viewBox="0 0 100 100" fill="currentColor" className="text-yellow-400 w-full h-auto">
                            <polygon points="50,20 60,45 85,40 65,60 72,85 50,70 28,85 35,60 15,40 40,45" />
                            <circle cx="50" cy="52" r="12" />
                        </svg>
                    </div>
                    {/* Bendera Merah Putih */}
                    <div className="absolute bottom-10 right-10 opacity-[0.12] w-[200px] rotate-6">
                        <svg viewBox="0 0 100 65" className="w-full h-auto drop-shadow-lg">
                            <rect width="100" height="32" fill="#ef4444" />
                            <rect y="32" width="100" height="33" fill="#ffffff" />
                            <rect x="0" y="0" width="4" height="65" fill="#78350f" />
                        </svg>
                    </div>
                    {[...Array(17)].map((_, i) => (
                        <div key={i} className="absolute w-1 h-1 rounded-full"
                            style={{ left: `${(i * 19) % 100}%`, top: `${(i * 31) % 50}%`, backgroundColor: i % 2 === 0 ? '#ef444430' : '#ffffff20' }} />
                    ))}
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
