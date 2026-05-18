import React, { useState } from 'react';

// --- Platform renk, kısaltma ve logo tanımları ---
const PLATFORM_MAP: Record<string, { label: string; bg: string; text: string; border: string; logoUrl: string }> = {
  trendyol:    { label: 'T',  bg: '#F27A1A', text: '#fff',    border: '#c95f00', logoUrl: '/logos/trendyol.png' },
  hepsiburada: { label: 'H',  bg: '#FF6000', text: '#fff',    border: '#c94b00', logoUrl: '/logos/hepsiburada.png' },
  amazon:      { label: 'a',  bg: '#232F3E', text: '#FF9900', border: '#131921', logoUrl: '/logos/amazon.png' },
  ciceksepeti: { label: 'Ç',  bg: '#7B2D8B', text: '#fff',    border: '#5a1f66', logoUrl: '/logos/ciceksepeti.png' },
  etsy:        { label: 'E',  bg: '#F45800', text: '#fff',    border: '#b84300', logoUrl: '/logos/etsy.png' },
  n11:         { label: 'N',  bg: '#7D00BE', text: '#fff',    border: '#5a008a', logoUrl: '/logos/n11.png' },
  gittigidiyor:{ label: 'G',  bg: '#E1251B', text: '#fff',    border: '#a81a12', logoUrl: '/logos/gittigidiyor.png' },
};

// --- Platform tespiti (başlık metninden) ---
const detectPlatform = (title: string, rawType?: string): string | null => {
  const lower = (title + ' ' + (rawType || '')).toLowerCase();
  if (lower.includes('trendyol')) return 'trendyol';
  if (lower.includes('hepsiburada')) return 'hepsiburada';
  if (lower.includes('amazon')) return 'amazon';
  if (lower.includes('çiçeksepeti') || lower.includes('ciceksepeti') || lower.includes('çiçek')) return 'ciceksepeti';
  if (lower.includes('etsy')) return 'etsy';
  if (lower.includes('n11')) return 'n11';
  if (lower.includes('gittigidiyor')) return 'gittigidiyor';
  return null;
};

// --- Ana bileşen ---
interface PlatformLogoProps {
  title: string;
  rawType?: string;
  amount?: number; // pozitif=gelir, negatif=gider
  size?: number;
}

export const PlatformLogo: React.FC<PlatformLogoProps> = ({
  title,
  rawType,
  amount,
  size = 36,
}) => {
  const platform = detectPlatform(title, rawType);
  const fontSize = Math.round(size * 0.38);
  const borderRadius = Math.round(size * 0.28);
  
  const [imageError, setImageError] = useState(false);

  if (platform && PLATFORM_MAP[platform]) {
    const { label, bg, text, border, logoUrl } = PLATFORM_MAP[platform];
    return (
      <div
        style={{
          width: size,
          height: size,
          minWidth: size,
          background: bg,
          border: `2px solid ${border}`,
          borderRadius,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize,
          fontWeight: 800,
          color: text,
          fontFamily: 'Arial, sans-serif',
          letterSpacing: '-0.5px',
          userSelect: 'none',
          flexShrink: 0,
          overflow: 'hidden',
        }}
        title={platform.charAt(0).toUpperCase() + platform.slice(1)}
      >
        {!imageError ? (
          <img 
            src={logoUrl} 
            alt={platform} 
            onError={() => setImageError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          label
        )}
      </div>
    );
  }

  // Bilinmeyen platform → gelir mi gider mi?
  const letter = title?.charAt(0)?.toUpperCase() || '?';
  const isIncome = amount !== undefined ? amount > 0 : true;
  const fallbackBg = isIncome ? '#16a34a22' : '#dc262622';
  const fallbackBorder = isIncome ? '#16a34a55' : '#dc262655';
  const fallbackText = isIncome ? '#4ade80' : '#f87171';

  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        background: fallbackBg,
        border: `2px solid ${fallbackBorder}`,
        borderRadius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: 800,
        color: fallbackText,
        fontFamily: 'Arial, sans-serif',
        userSelect: 'none',
        flexShrink: 0,
      }}
      title={title}
    >
      {letter}
    </div>
  );
};
