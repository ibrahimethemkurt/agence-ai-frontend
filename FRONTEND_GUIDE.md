# 🧭 React Frontend Geliştirme Rehberi
> Antigravity · Cursor · Claude Code · React · React Bits · Minimalist + Animasyonlu UI

---

## 📌 Bu Döküman Hakkında

Bu rehber, **Antigravity**, **Cursor** ve **Claude Code** ortamlarında **React** ile geliştirme yaparken;  
**SOLID prensiplerine** uygun, **minimalist** ama **animasyonlu ve etkileyici** frontend üretmek için hazırlanmıştır.

Tasarım referansları ve animasyon bileşenleri ağırlıklı olarak şu kaynaklardan alınır:

| Kaynak | Ne için |
|---|---|
| [React Bits](https://reactbits.dev) | Animasyonlu, özelleştirilebilir React componentleri |
| [21st.dev](https://21st.dev) | Shadcn uyumlu modern UI componentleri |
| [Framer Motion](https://www.framer.com/motion/) | Declarative React animasyon kütüphanesi |
| [GSAP](https://gsap.com) | Gelişmiş scroll ve timeline animasyonları |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS |

---

## ⚙️ Temel Stack

```
React 18+           → UI katmanı
TypeScript          → Tip güvenliği
Tailwind CSS        → Stil
Framer Motion       → Animasyon (birincil)
React Bits          → Hazır animasyonlu component kaynağı
21st.dev            → UI component referansı
Vite                → Build aracı
ESLint + Prettier   → Kod kalitesi
```

---

## 🧱 SOLID Prensipleri — React Uygulamaları

> ⚠️ SOLID prensipleri bu projede **hiçbir şekilde ihlal edilmez.**

---

### S — Single Responsibility (Tek Sorumluluk)

Her component **yalnızca bir şey** yapar. Animasyon mantığı görünüm mantığından ayrılır.

```tsx
// ❌ YANLIŞ — hem veri çekiyor hem animate ediyor hem gösteriyor
const HeroSection = () => {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/hero').then(...) }, []);
  return (
    <motion.div animate={{ opacity: 1 }}>
      {data?.title}
    </motion.div>
  );
};

// ✅ DOĞRU — sorumluluklar net ayrılmış
const useHeroData = () => { /* sadece veri */ };

const AnimatedHero = ({ children }) => (   /* sadece animasyon */
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
  >
    {children}
  </motion.div>
);

const HeroSection = () => {           /* sadece birleştirme */
  const { title, subtitle } = useHeroData();
  return (
    <AnimatedHero>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </AnimatedHero>
  );
};
```

---

### O — Open/Closed (Açık/Kapalı)

Animasyonlu componentler, içlerini değiştirmeden genişletilebilir olmalı.

```tsx
// ✅ variant sistemi ile genişletilebilir animasyon
const TRANSITIONS = {
  fade:    { initial: { opacity: 0 },            animate: { opacity: 1 } },
  slideUp: { initial: { opacity: 0, y: 32 },     animate: { opacity: 1, y: 0 } },
  slideIn: { initial: { opacity: 0, x: -32 },    animate: { opacity: 1, x: 0 } },
  scale:   { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
} as const;

type TransitionVariant = keyof typeof TRANSITIONS;

interface RevealProps {
  variant?: TransitionVariant;
  duration?: number;
  delay?: number;
  children: React.ReactNode;
}

const Reveal = ({ variant = 'fade', duration = 0.4, delay = 0, children }: RevealProps) => (
  <motion.div
    {...TRANSITIONS[variant]}
    transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
  >
    {children}
  </motion.div>
);

// Kullanım — kodu değiştirmeden yeni variant eklenebilir
<Reveal variant="slideUp" delay={0.2}>
  <HeroTitle />
</Reveal>
```

---

### L — Liskov Substitution (Yerine Geçebilirlik)

Animasyonlu bileşenler, animasyonsuz versiyonların yerine geçebilmeli.

```tsx
interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Button = ({ onClick, disabled, children, className }: ButtonProps) => (
  <button onClick={onClick} disabled={disabled} className={className}>
    {children}
  </button>
);

// Aynı interface — AnimatedButton, Button'ın yerine sorunsuz geçer
const AnimatedButton = ({ onClick, disabled, children, className }: ButtonProps) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    className={className}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.15 }}
  >
    {children}
  </motion.button>
);
```

---

### I — Interface Segregation (Arayüz Ayrımı)

Componentlere ihtiyaç duymadıkları animasyon prop'larını verme.

```tsx
// ❌ YANLIŞ — tüm animasyon config her yere geçiliyor
<Card animConfig={{ duration: 0.4, delay: 0.2, ease: 'easeOut', stagger: 0.1 }} />

// ✅ DOĞRU — stagger wrapper yönetir, card sadece render eder
<StaggerContainer staggerDelay={0.1}>
  <Card />
  <Card />
  <Card />
</StaggerContainer>
```

---

### D — Dependency Inversion (Bağımlılık Tersine Çevirme)

Animasyon kütüphanesine doğrudan bağımlı olma — soyutla.

```tsx
// ❌ YANLIŞ — Framer Motion her component'e doğrudan import
const Card = () => <motion.div whileHover={{ scale: 1.02 }}> ... </motion.div>;

// ✅ DOĞRU — animasyon hook ile soyutlanmış
// hooks/useHoverAnimation.ts
export const useHoverAnimation = () => ({
  whileHover: { scale: 1.02, transition: { duration: 0.2 } },
  whileTap:   { scale: 0.98 },
});

// Yarın farklı kütüphane geçersen sadece hook değişir
const Card = () => {
  const hoverProps = useHoverAnimation();
  return <motion.div {...hoverProps}> ... </motion.div>;
};
```

---

## 🎨 Minimalist Tasarım + Animasyon Dengesi

> Minimalizm animasyonsuzluk demek değildir.  
> Doğru animasyon, tasarımı **daha sade** hissettirir.

### Animasyon Hiyerarşisi

```
1. SAYFA GEÇİŞİ       → en ağır, en uzun (400–600ms)
2. BÖLÜM REVEAL       → scroll tetiklemeli, staggered (300–500ms)
3. COMPONENT MOUNT    → hafif fade/slide (200–400ms)
4. HOVER / TAP        → anında, minimal (100–200ms)
5. DEKORATIF (loop)   → yavaş, göz yormayan (sonsuz)
```

### Kesin Kurallar

```
✅ ease-out veya custom bezier — hiçbir zaman linear
✅ Reduced-motion medya sorgusu her zaman eklenir
✅ Stagger: birden fazla element aynı anda değil, sırayla
❌ 600ms üzeri animasyon (sayfa geçişi hariç)
❌ Sadece "güzel görünsün" diye animasyon
```

### Reduced Motion Desteği

```tsx
// hooks/useSafeAnimation.ts
import { useReducedMotion } from 'framer-motion';

export const useSafeAnimation = <T extends object>(animation: T): T | object => {
  const shouldReduce = useReducedMotion();
  return shouldReduce ? {} : animation;
};
```

---

## 🔧 React Bits Kullanım Protokolü

[React Bits](https://reactbits.dev) — copy-paste değil, **adapte et** felsefesiyle kullanılır.

```
1. reactbits.dev'de ihtiyaca uygun component'i bul
2. Kodu components/ui/ altında yeni dosyaya kopyala
3. TypeScript tip ekle
4. Design token'larına göre renk/spacing güncelle
5. SOLID'e uygun prop interface'i düzenle
6. Kaynak URL'yi dosyanın başına yorum olarak ekle
```

```tsx
// components/ui/TextShimmer.tsx
// Kaynak: https://reactbits.dev/text-animations/shimmer-text
// Düzenlendi: TypeScript + design token uyarlaması

interface TextShimmerProps {
  text: string;
  duration?: number;
  className?: string;
}

const TextShimmer = ({ text, duration = 2, className }: TextShimmerProps) => {
  // ... adapte edilmiş kod
};

export default TextShimmer;
```

---

## 🧩 21st.dev Kullanım Protokolü

[21st.dev](https://21st.dev) — Shadcn/UI uyumlu, üretim kalitesinde componentler.

```
1. 21st.dev'de component'i bul
2. Shadcn CLI ile veya manuel ekle
3. Tailwind class'larını token sistemine uyarla
4. Gerekirse Framer Motion animasyonu ekle
```

---

## 📁 Klasör Yapısı

```
src/
├── components/
│   ├── ui/                   # Atom — Button, Input, Badge, TextShimmer...
│   │   └── [Component]/
│   │       ├── index.tsx
│   │       └── [Component].tsx
│   ├── layout/               # Header, Footer, Section, Grid
│   ├── composite/            # Card, Modal, Form, Navbar
│   └── animation/            # Saf animasyon wrapper'ları
│       ├── Reveal.tsx
│       ├── Stagger.tsx
│       ├── PageTransition.tsx
│       └── variants.ts       # Merkezi motion variants
│
├── features/                 # Domain bazlı modüller
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       └── utils/
│
├── hooks/
│   ├── useSafeAnimation.ts
│   ├── useScrollProgress.ts
│   └── useInView.ts
│
├── styles/
│   ├── tokens.css
│   ├── reset.css
│   └── typography.css
│
└── types/
```

---

## 📐 Design Tokens

```css
/* styles/tokens.css */
:root {
  /* Color */
  --color-bg:       #0A0A0A;
  --color-fg:       #F5F5F5;
  --color-accent:   #5B5BD6;
  --color-muted:    #6B6B6B;
  --color-border:   rgba(255,255,255,0.08);
  --color-surface:  rgba(255,255,255,0.04);

  /* Spacing (8px grid) */
  --space-1: 4px;   --space-2: 8px;    --space-3: 12px;
  --space-4: 16px;  --space-6: 24px;   --space-8: 32px;
  --space-12: 48px; --space-16: 64px;  --space-24: 96px;

  /* Typography */
  --font-display: 'Syne', sans-serif;
  --font-body:    'DM Sans', sans-serif;
  --text-sm: 0.875rem; --text-base: 1rem;   --text-xl: 1.25rem;
  --text-2xl: 1.5rem;  --text-4xl: 2.25rem; --text-6xl: 3.75rem;

  /* Motion */
  --duration-fast:  150ms;
  --duration-base:  300ms;
  --duration-slow:  500ms;
  --ease-default:   cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Merkezi Motion Variants

```ts
// components/animation/variants.ts

export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
};
```

---

## 🎯 AI'a Tasarım Referansı Verme Formatı

```
TASARIM REFERANSI:
- Kaynak: [URL veya "React Bits > Shimmer Text"]
- Ton: [minimalist / editorial / glassmorphism / dark tech...]
- Renk: bg=  fg=  accent=
- Font: [display fontu + body fontu]
- Animasyon: [yok / fade / slide / parallax / scroll-trigger]
- Motion kaynak: [React Bits / Framer Motion / GSAP]
- Spacing: [sıkı / dengeli / dramatik]
- Referans component: [hangi element için]
```

**Gerçek örnek:**
```
TASARIM REFERANSI:
- Kaynak: React Bits > Scroll Reveal + 21st.dev > Bento Grid
- Ton: Dark, minimal, teknolojik
- Renk: bg=#0D0D0D  fg=#EFEFEF  accent=#00FF88
- Font: display=Syne, body=DM Sans
- Animasyon: staggered fade-up, scroll tetiklemeli
- Motion kaynak: Framer Motion (whileInView)
- Spacing: dramatik — büyük section padding'ler
- Referans component: Features bölümü kartları
```

---

## 🤖 AI Araçlarıyla Çalışma Protokolü

### Cursor

```
"[component adı] — [React Bits / 21st.dev kaynağı] referans alınarak,
SOLID [hangi prensip] uygun, TypeScript, Framer Motion [hangi animasyon],
design token kullanan, max [X] satır."
```

### Claude Code (Terminal)

```bash
claude "React Bits shimmer text'i SOLID'e uygun, TypeScript,
kendi token sistemimize uyarlanmış şekilde yaz."

claude "Bu component SRP'yi ihlal ediyor mu?
Animasyon ve render mantığı ayrı mı? Refactor et."

claude "Bu Card'a whileInView + stagger ekle.
Framer Motion, reduced-motion destekli, variants.ts kullan."
```

---

## ✅ Code Review Checklist

### SOLID
- [ ] Component tek şey mi yapıyor? (S)
- [ ] Animasyon ayrı wrapper/hook'ta mı? (S)
- [ ] Yeni variant için eski kod değişiyor mu? (O)
- [ ] Component başkasının yerine geçebilir mi? (L)
- [ ] Sadece ihtiyacı olan prop'ları alıyor mu? (I)
- [ ] Animasyon kütüphanesi soyutlandı mı? (D)

### Animasyon
- [ ] reduced-motion destekleniyor mu?
- [ ] Variant'lar variants.ts'te mi?
- [ ] Süre 600ms altında mı?
- [ ] Stagger gereken yerde kullanıldı mı?

### Genel
- [ ] Token dışı renk/spacing yok mu?
- [ ] TypeScript tipleri tam mı?
- [ ] Responsive mi?

---

## 🚫 Yasaklı Pratikler

```tsx
// ❌ Inline animasyon değeri — variants.ts kullan
<motion.div animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }} />

// ❌ Magic number
transition={{ duration: 0.35 }}

// ❌ React Bits kodu olduğu gibi yapıştırılmış — mutlaka adapt et

// ❌ Animasyon kütüphanesi doğrudan UI component'te
// Sadece components/animation/ içindeki wrapper'larda kullanılır

// ❌ reduced-motion kontrolü eksik — her animasyonlu component'te zorunlu
```

---

## 📎 Kaynaklar

| Kaynak | URL |
|---|---|
| React Bits | https://reactbits.dev |
| 21st.dev | https://21st.dev |
| Framer Motion | https://www.framer.com/motion |
| Tailwind CSS | https://tailwindcss.com |
| GSAP | https://gsap.com |
| Shadcn/UI | https://ui.shadcn.com |

---

> 📝 Tasarım referansları geldiğinde bu döküman güncellenir.  
> Her yeni animasyon pattern `variants.ts`'e, her yeni kaynak tabloya eklenir.

*Son güncelleme: Mayıs 2026*
