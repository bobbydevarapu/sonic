import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Disc3, Github, Headphones, Instagram, Linkedin, Menu, Mic2, Music, Music2, Radio, Volume2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'EXPERIENCE', href: '#hero' },
  { label: 'SOUNDSCAPES', href: '#features' },
  { label: 'TECHNOLOGY', href: '#technology' },
  { label: 'ABOUT', href: '#about' }
];

const features = [
  { icon: Volume2, title: 'PURE FIDELITY', desc: 'Lossless audio streaming that preserves every detail of each track.' },
  { icon: Headphones, title: 'SPATIAL FLUX', desc: 'Immersive sound layers that respond to your listening context.' },
  { icon: Radio, title: 'LIVE STREAMS', desc: 'Connect to live sets with low-latency, high-clarity playback.' },
  { icon: Mic2, title: 'CREATOR TOOLS', desc: 'Artist-focused controls for discovering and shaping sound.' },
  { icon: Disc3, title: 'VINYL MODE', desc: 'Warm analog-inspired playback colors for a nostalgic vibe.' },
  { icon: Music2, title: 'SMART CURATION', desc: 'Recommendation rails that evolve with your music taste.' }
];

const aboutItems = [
  {
    title: 'Smart Discovery',
    text: 'Find tracks from global catalogs with responsive, context-aware search rails built for fast exploration.'
  },
  {
    title: 'Immersive UI',
    text: 'Motion-driven visuals react to scroll, rhythm, and transitions to keep every interaction cinematic.'
  },
  {
    title: 'Connected Stack',
    text: 'Frontend and backend work together for identity, playlists, recommendations, and seamless session flow.'
  },
  {
    title: 'Built To Scale',
    text: 'A modular architecture that supports future features, richer personalization, and production-ready growth.'
  }
];

function LandingNavbar() {
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 180], [0.72, 0.96]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  const scrollTo = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <motion.nav
      className="fixed left-0 right-0 top-0 z-40 px-3 py-3 sm:px-6 sm:py-4"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2, duration: 0.45 }}
      style={{ opacity: navOpacity }}
    >
      <div className="si-glass-strong si-nav-shell mx-auto flex max-w-5xl items-center justify-between rounded-full px-4 py-2.5 sm:px-8 sm:py-3">
        <button onClick={() => scrollTo('#hero')} className="flex items-center gap-2">
          <Music className="h-5 w-5 text-cyan-300" />
          <span className="si-font-display text-sm font-bold tracking-wider text-white/90">SONICFLUX</span>
        </button>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => scrollTo(link.href)}
              className="si-font-heading text-xs tracking-[0.25em] text-white/65 transition-colors duration-300 hover:text-cyan-300"
            >
              {link.label}
            </button>
          ))}
        </div>

        <Link
          to={user ? '/app' : '/auth'}
          className="si-glass si-font-heading hidden rounded-full px-3 py-1.5 text-[10px] tracking-[0.16em] text-white/90 transition-all duration-300 hover:text-cyan-300 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em] md:inline-flex"
        >
          {user ? 'OPEN DASHBOARD' : 'SIGN IN'}
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="ml-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 transition hover:border-cyan-300/30 hover:text-cyan-300 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div className={`mx-4 mt-3 overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/95 px-4 py-4 shadow-[0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-all duration-300 md:hidden ${menuOpen ? 'max-h-[380px] opacity-100' : 'pointer-events-none max-h-0 opacity-0'}`}>
        <div className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => scrollTo(link.href)}
              className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-left text-sm tracking-[0.22em] text-white/80 transition hover:border-cyan-300/20 hover:text-cyan-300"
            >
              {link.label}
              <span className="text-xs text-slate-500">→</span>
            </button>
          ))}
          <Link
            to={user ? '/app' : '/auth'}
            onClick={() => setMenuOpen(false)}
            className="mt-2 inline-flex items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-semibold tracking-[0.18em] text-cyan-100 transition hover:bg-cyan-300/15"
          >
            {user ? 'OPEN DASHBOARD' : 'SIGN IN'}
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  const { user } = useAuth();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);
  const badgeY = useTransform(scrollYProgress, [0, 0.45, 1], [0, -14, -48]);
  const badgeOpacity = useTransform(scrollYProgress, [0, 0.45, 0.9], [1, 0.58, 0.18]);
  const line1Y = useTransform(scrollYProgress, [0, 0.38, 1], [0, -14, -56]);
  const line2Y = useTransform(scrollYProgress, [0, 0.5, 1], [0, -20, -72]);
  const line3Y = useTransform(scrollYProgress, [0, 0.62, 1], [0, -26, -88]);
  const line1Opacity = useTransform(scrollYProgress, [0, 0.5, 0.95], [1, 0.65, 0.2]);
  const line2Opacity = useTransform(scrollYProgress, [0, 0.58, 0.96], [1, 0.62, 0.18]);
  const line3Opacity = useTransform(scrollYProgress, [0, 0.66, 1], [1, 0.58, 0.15]);

  return (
    <section id="hero" ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-14 pt-24 sm:px-6 sm:pb-0 sm:pt-20 lg:pt-32 xl:pt-36">
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-cyan-400/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-indigo-500/10 blur-[140px]" />
      </div>

      <motion.div className="relative z-10 mx-auto max-w-5xl text-center" style={{ y, opacity }}>
        <motion.p
          className="si-font-heading mb-6 text-xs uppercase tracking-[0.5em] text-slate-400 sm:text-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
          style={{ y: badgeY, opacity: badgeOpacity }}
        >
          Millions of songs and podcasts
        </motion.p>

        <motion.h1
          className="si-font-display si-hero-wave text-3xl font-black leading-tight text-white sm:text-6xl md:text-8xl"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <motion.span className="block" style={{ y: line1Y, opacity: line1Opacity }}>
            Music
          </motion.span>
          <motion.span className="block" style={{ y: line2Y, opacity: line2Opacity }}>
            listening is
          </motion.span>
          <motion.span className="si-text-gradient-cyan block" style={{ y: line3Y, opacity: line3Opacity }}>
            everything
          </motion.span>
        </motion.h1>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          <Link
            to={user ? '/app' : '/auth'}
            className="si-glass si-font-heading group mx-auto inline-flex items-center gap-3 rounded-full px-6 py-3 text-xs uppercase tracking-[0.18em] text-white transition-all duration-300 hover:text-cyan-300 sm:px-8 sm:text-sm sm:tracking-[0.2em]"
          >
            {user ? 'Open Dashboard' : 'Sign In'}
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-cyan-300/60">
              ▶
            </span>
          </Link>
        </motion.div>

        <motion.div
          className="mt-16 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          <p className="si-font-heading text-xs uppercase tracking-[0.3em] text-slate-400">Swipe or Scroll</p>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ChevronDown className="h-5 w-5 text-slate-400" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="relative px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
        >
          <p className="si-font-heading mb-4 text-xs uppercase tracking-[0.4em] text-cyan-300">Features</p>
          <h2 className="si-font-display text-3xl font-black text-white sm:text-5xl">
            Built for <span className="si-text-gradient-cyan">Sound</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="si-glass rounded-xl p-6 sm:p-7"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-300/10">
                  <Icon className="h-5 w-5 text-cyan-300" />
                </div>
                <h3 className="si-font-display mb-3 text-sm font-bold tracking-wider text-white sm:text-base">{feature.title}</h3>
                <p className="si-font-body text-sm leading-relaxed text-slate-300">{feature.desc}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TechnologySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="technology" ref={ref} className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-28">
      <div className="absolute inset-0">
        <div className="absolute right-0 top-0 h-[460px] w-[460px] rounded-full bg-indigo-500/10 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <motion.p
            className="si-font-heading mb-6 text-xs uppercase tracking-[0.4em] text-cyan-300"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
          >
            Technology
          </motion.p>
          <motion.h2
            className="si-font-display mb-6 text-3xl font-black leading-tight text-white sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 26 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.04 }}
          >
            THE FUTURE OF <span className="si-text-gradient-cyan">SOUND DESIGN</span>
          </motion.h2>
          <motion.p
            className="si-font-body mb-8 text-base leading-relaxed text-slate-300 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            We reimagined the audio interface for modern streaming. Simple enough for new listeners, powerful enough for audiophiles.
          </motion.p>

          <div className="space-y-4">
            {['REAL-TIME VISUALIZERS', 'COLLABORATIVE SESSIONS', 'CLOUD-SYNC LIBRARIES'].map((item, index) => (
              <motion.div
                key={item}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -18 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.16 + index * 0.08 }}
              >
                <span className="si-pulse-dot h-2 w-2 rounded-full bg-cyan-300" />
                <span className="si-font-heading text-xs tracking-[0.3em] text-slate-400">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="relative flex h-80 items-center justify-center lg:h-[400px]"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.55, delay: 0.12 }}
        >
          <div className="relative h-64 w-64">
            <motion.div className="absolute inset-0 rounded-full border border-cyan-300/25" animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }} />
            <motion.div className="absolute inset-4 rounded-full border border-indigo-300/25" animate={{ rotate: -360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }} />
            <motion.div className="absolute inset-8 rounded-full border border-cyan-300/35" animate={{ rotate: 360 }} transition={{ duration: 11, repeat: Infinity, ease: 'linear' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div className="si-glow-cyan h-16 w-16 rounded-full bg-cyan-300/20" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2.2, repeat: Infinity }} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ImmersionVideoSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-70px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.86, 1.02, 1.12]);
  const cardY = useTransform(scrollYProgress, [0, 0.45, 1], [36, 0, -24]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.55, 1, 0.88]);

  return (
    <section ref={ref} className="relative px-4 py-24 sm:px-6 sm:py-28">
      <motion.div
        className="si-glass-strong mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 p-5 sm:p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{ scale: cardScale, y: cardY, opacity: cardOpacity }}
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="si-font-heading text-xs uppercase tracking-[0.35em] text-cyan-300">Immersion Reel</p>
            <h3 className="si-font-display mt-2 text-2xl font-semibold text-white sm:text-3xl">SonicFlux Visual Motion</h3>
          </div>
          <span className="si-font-heading rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/75">
            Loop video
          </span>
        </div>

        <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/35">
          <video src="/loadingani.mp4" autoPlay muted loop playsInline preload="auto" className="sf-section-video h-full w-full object-cover" />
        </div>
      </motion.div>
    </section>
  );
}

function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-90px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [typedHeading, setTypedHeading] = useState('');
  const activeItem = aboutItems[activeIndex];
  const marqueeItems = [...aboutItems, ...aboutItems];

  useEffect(() => {
    const cycleTimer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % aboutItems.length);
    }, 3200);

    return () => window.clearTimeout(cycleTimer);
  }, [activeIndex]);

  useEffect(() => {
    const heading = activeItem.title.toUpperCase();
    let charIndex = 0;
    setTypedHeading('');

    const typingTimer = window.setInterval(() => {
      charIndex += 1;
      setTypedHeading(heading.slice(0, charIndex));

      if (charIndex >= heading.length) {
        window.clearInterval(typingTimer);
      }
    }, 52);

    return () => window.clearInterval(typingTimer);
  }, [activeItem.title]);

  return (
    <section id="about" ref={ref} className="relative px-4 py-24 sm:px-6 sm:py-28">
      <div className="si-glass mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -26 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <p className="si-font-heading mb-4 text-xs uppercase tracking-[0.35em] text-cyan-300">About</p>
            <h2 className="si-font-display si-about-heading-wrap text-[clamp(1.7rem,4.6vw,4rem)] font-black leading-none text-white">
              <span className="si-about-typing-live">{typedHeading}</span>
              <span className="si-about-caret" aria-hidden />
            </h2>
          </motion.div>

          <motion.p
            key={activeItem.title}
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="si-font-body max-w-[34rem] text-base leading-relaxed text-slate-300 sm:text-lg"
          >
            {activeItem.text}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="si-about-row-mask mt-8"
        >
          <div className="si-about-row-track">
            {marqueeItems.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className={`si-about-card si-glass rounded-xl border p-4 sm:p-5 ${item.title === activeItem.title ? 'border-cyan-300/40 bg-cyan-300/6' : 'border-white/10'}`}
              >
                <h3 className="si-font-display text-lg font-semibold text-white">{item.title}</h3>
                <p className="si-about-card-text si-font-body mt-2 text-sm leading-relaxed text-slate-300">{item.text}</p>
              </article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function NowPlayingSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cards = [
    { src: '/card1.png', title: 'Floating music notes', className: 'sm:translate-y-6' },
    { src: '/card2.png', title: 'Playback controls', className: 'sm:-translate-y-8 sm:scale-[1.03]' },
    { src: '/card3.png', title: 'Music quote card', className: 'sm:translate-y-10' }
  ];
  const leftX = useTransform(scrollYProgress, [0, 0.5, 1], [-130, 0, 130]);
  const leftY = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -18]);
  const leftScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.94]);
  const rightX = useTransform(scrollYProgress, [0, 0.5, 1], [130, 0, -130]);
  const rightY = useTransform(scrollYProgress, [0, 0.5, 1], [26, 0, -16]);
  const rightScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.94]);
  const middleX = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 0]);
  const middleY = useTransform(scrollYProgress, [0, 0.5, 1], [38, 0, -20]);
  const middleScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.04, 0.92]);

  return (
    <section ref={ref} className="relative overflow-hidden px-4 py-24 sm:px-6">
      <div className="si-bg-gradient-radial pointer-events-none absolute inset-0" />
      <motion.div
        className="relative z-10 mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 28 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55 }}
      >
        <div className="mb-8 text-center">
          <p className="si-font-heading text-xs uppercase tracking-[0.34em] text-cyan-300">Now Playing Visuals</p>
          <h3 className="si-font-display mt-3 text-2xl font-bold text-white sm:text-3xl">Responsive Floating Cards</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {cards.map((card, index) => (
            <motion.article
              key={card.src}
              className={`si-glass-strong overflow-hidden rounded-[1.35rem] border border-white/10 p-2 ${card.className}`}
              initial={{ opacity: 0, y: 26, scale: 0.97 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ opacity: { duration: 0.45, delay: 0.08 + index * 0.08 } }}
              style={
                index === 0
                  ? { x: leftX, y: leftY, scale: leftScale }
                  : index === 1
                    ? { x: rightX, y: rightY, scale: rightScale }
                    : { x: middleX, y: middleY, scale: middleScale }
              }
            >
              <img
                src={card.src}
                alt={card.title}
                className="h-48 w-full rounded-[1rem] object-cover sm:h-56 md:h-[14.5rem] lg:h-[15.5rem]"
                loading="lazy"
              />
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function FooterSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const giantScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.9, 1, 1.08]);
  const giantY = useTransform(scrollYProgress, [0, 0.5, 1], [34, 0, -18]);
  const giantOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.18, 0.42, 0.16]);
  const giantFilter = useTransform(scrollYProgress, [0, 0.5, 1], ['brightness(0.84) contrast(0.95)', 'brightness(1.06) contrast(1.2)', 'brightness(0.95) contrast(1.05)']);
  const giantLetterSpacing = useTransform(scrollYProgress, [0, 0.5, 1], ['0.04em', '0.12em', '0.06em']);
  
  // Knife-like sharpness effect - progressively sharp edges from left to right
  const knifeProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.6]);
  const strokeOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.5]);
  const knifeReveal = useTransform(knifeProgress, (value) => `inset(0 ${Math.max(0, (1 - value) * 100)}% 0 0)`);
  const sharpnessFilter = useTransform(knifeProgress, (value) => {
    const sharpness = 1 + value * 0.28;
    return `contrast(${sharpness}) saturate(${1 + value * 0.12})`;
  });

  return (
    <footer id="join" ref={ref} className="relative overflow-visible px-4 pb-8 pt-20 sm:overflow-hidden sm:px-6 sm:pt-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <div className="si-footer-word-wrap mb-10 sm:mb-12">
          <motion.h2
            className="si-font-display si-footer-word si-footer-word-base select-none font-black leading-none"
            style={{ scale: giantScale, y: giantY, opacity: giantOpacity, filter: giantFilter, letterSpacing: giantLetterSpacing }}
          >
            <span className="si-so-gradient">SO</span>
            <span className="text-slate-400">NICF</span>
            <span className="si-lux-red">LUX</span>
          </motion.h2>
          <motion.h2
            className="si-font-display si-footer-word si-footer-word-knife select-none font-black leading-none"
            style={{ scale: giantScale, y: giantY, opacity: strokeOpacity, letterSpacing: giantLetterSpacing, filter: sharpnessFilter, clipPath: knifeReveal }}
          >
            <span className="si-so-gradient">SO</span>
            <span className="text-slate-400">NICF</span>
            <span className="si-lux-red">LUX</span>
          </motion.h2>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-6">
          {[
            { href: 'https://www.linkedin.com/in/bobbydevarapu/', icon: Linkedin, label: 'LinkedIn' },
            { href: 'https://github.com/bobbydevarapu', icon: Github, label: 'GitHub' },
            { href: 'https://www.instagram.com/bobby_devarapu/', icon: Instagram, label: 'Instagram' }
          ].map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/85 transition-all duration-300 hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-300 sm:h-12 sm:w-12"
              >
                <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </a>
            );
          })}
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.24em] text-slate-400/90">© 2026 SonicFlux</p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="si-page si-noise-bg relative min-h-screen overflow-hidden text-white">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TechnologySection />
        <ImmersionVideoSection />
        <NowPlayingSection />
        <AboutSection />
      </main>
      <FooterSection />
    </div>
  );
}
