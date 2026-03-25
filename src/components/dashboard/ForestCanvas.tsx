"use client";
import {
  useMemo, useEffect, useState, useRef, useCallback,
} from "react";
import {
  motion, AnimatePresence,
} from "framer-motion";
import { useExpenses } from "@/hooks/useExpenses";
import type { AppUser } from "@/lib/database.types";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type TreeState = "seedling" | "sapling" | "healthy" | "stressed" | "sad" | "burnt" | "golden";
type Weather   = "sunny" | "rainy" | "snowy" | "stormy";
type TimeOfDay = "dawn" | "morning" | "afternoon" | "dusk" | "night" | "deepnight";

interface Props { user: AppUser }

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getTimeOfDay(): TimeOfDay {
  const h = new Date().getHours();
  if (h >= 5  && h <  8) return "dawn";
  if (h >= 8  && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 20) return "dusk";
  if (h >= 20 || h <  2) return "night";
  return "deepnight";
}

function resolveTreeState(pct: number): TreeState {
  if (pct <= 0)  return "seedling";
  if (pct < 5)   return "golden";
  if (pct < 30)  return "sapling";
  if (pct < 65)  return "healthy";
  if (pct < 82)  return "stressed";
  if (pct < 100) return "sad";
  return "burnt";
}

// ─────────────────────────────────────────────────────────────────────────────
// WEATHER HOOK  (cycles every 10 min based on wall clock)
// ─────────────────────────────────────────────────────────────────────────────
const WEATHER_ORDER: Weather[] = ["sunny", "rainy", "snowy", "stormy"];

function useWeather(): Weather {
  const [idx, setIdx] = useState(() => Math.floor(Date.now() / 600_000) % 4);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % 4), 600_000);
    return () => clearInterval(id);
  }, []);
  return WEATHER_ORDER[idx];
}

// ─────────────────────────────────────────────────────────────────────────────
// WEB AUDIO  –  all sounds generated procedurally via OscillatorNode / noise
// ─────────────────────────────────────────────────────────────────────────────
function useAudio() {
  const ctxRef       = useRef<AudioContext | null>(null);
  const windSrcRef   = useRef<AudioBufferSourceNode | null>(null);
  const windGainRef  = useRef<GainNode | null>(null);
  const rainSrcRef   = useRef<AudioBufferSourceNode | null>(null);
  const rainGainRef  = useRef<GainNode | null>(null);

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return ctxRef.current;
  }, []);

  // ── WIND  (bandpass-filtered noise, gentle fade in/out) ───────────────────
  const startWind = useCallback((intensity = 0.16) => {
    try {
      const ctx = getCtx();
      if (windSrcRef.current) { try { windSrcRef.current.stop(); } catch {} windSrcRef.current = null; }

      const len = ctx.sampleRate * 3;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d   = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

      const src    = ctx.createBufferSource();
      src.buffer   = buf;
      src.loop     = true;

      const bp     = ctx.createBiquadFilter();
      bp.type      = "bandpass";
      bp.frequency.value = 340;
      bp.Q.value   = 0.55;

      const lfo    = ctx.createOscillator();
      lfo.frequency.value = 0.18;
      const lfoG   = ctx.createGain();
      lfoG.gain.value = 80;
      lfo.connect(lfoG);
      lfoG.connect(bp.frequency);
      lfo.start();

      const gain   = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(intensity, ctx.currentTime + 2);

      src.connect(bp);
      bp.connect(gain);
      gain.connect(ctx.destination);
      src.start();

      windSrcRef.current  = src;
      windGainRef.current = gain;
    } catch (_) {}
  }, [getCtx]);

  const stopWind = useCallback(() => {
    try {
      const ctx = getCtx();
      if (windGainRef.current) {
        windGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
        setTimeout(() => {
          try { windSrcRef.current?.stop(); } catch {} windSrcRef.current = null;
        }, 1600);
      }
    } catch (_) {}
  }, [getCtx]);

  // ── RAIN  (high-pass noise, soft patter) ──────────────────────────────────
  const startRain = useCallback((heavy = false) => {
    try {
      const ctx = getCtx();
      if (rainSrcRef.current) { try { rainSrcRef.current.stop(); } catch {} rainSrcRef.current = null; }

      const len = ctx.sampleRate * 3;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d   = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

      const src  = ctx.createBufferSource();
      src.buffer = buf;
      src.loop   = true;

      const hp   = ctx.createBiquadFilter();
      hp.type    = "highpass";
      hp.frequency.value = 2600;

      const gain = ctx.createGain();
      gain.gain.value = heavy ? 0.09 : 0.055;

      src.connect(hp);
      hp.connect(gain);
      gain.connect(ctx.destination);
      src.start();

      rainSrcRef.current  = src;
      rainGainRef.current = gain;
    } catch (_) {}
  }, [getCtx]);

  const stopRain = useCallback(() => {
    try { rainSrcRef.current?.stop(); } catch {} rainSrcRef.current = null;
  }, []);

  // ── CRACKLE / EMBERS  (short noise bursts at random pitch) ───────────────
  const playCrackle = useCallback(() => {
    try {
      const ctx = getCtx();
      for (let p = 0; p < 5; p++) {
        setTimeout(() => {
          const len = Math.floor(ctx.sampleRate * 0.035);
          const buf = ctx.createBuffer(1, len, ctx.sampleRate);
          const d   = buf.getChannelData(0);
          for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
          const src  = ctx.createBufferSource();
          src.buffer = buf;
          src.playbackRate.value = 0.7 + Math.random() * 0.8;
          const lp   = ctx.createBiquadFilter();
          lp.type    = "lowpass";
          lp.frequency.value = 800 + Math.random() * 400;
          const gain = ctx.createGain();
          gain.gain.value = 0.14;
          src.connect(lp);
          lp.connect(gain);
          gain.connect(ctx.destination);
          src.start();
        }, p * 175 + Math.random() * 60);
      }
    } catch (_) {}
  }, [getCtx]);

  // ── LEVEL-UP CHIME  (4-note ascending sine arpeggio) ─────────────────────
  const playLevelUp = useCallback(() => {
    try {
      const ctx   = getCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
      notes.forEach((freq, i) => {
        setTimeout(() => {
          const osc  = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type   = "sine";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.6);
        }, i * 120);
      });
    } catch (_) {}
  }, [getCtx]);

  // ── THUNDER  (low-pass noise decay boom) ─────────────────────────────────
  const playThunder = useCallback(() => {
    try {
      const ctx  = getCtx();
      const len  = ctx.sampleRate * 1.6;
      const buf  = ctx.createBuffer(1, len, ctx.sampleRate);
      const d    = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const decay = Math.exp(-i / (ctx.sampleRate * 0.42));
        d[i] = (Math.random() * 2 - 1) * decay;
      }
      const src  = ctx.createBufferSource();
      src.buffer = buf;
      const lp   = ctx.createBiquadFilter();
      lp.type    = "lowpass";
      lp.frequency.value = 160;
      const gain = ctx.createGain();
      gain.gain.value = 0.52;
      src.connect(lp);
      lp.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    } catch (_) {}
  }, [getCtx]);

  // ── SNOW AMBIENCE  (very soft low-level noise) ────────────────────────────
  const playSnow = useCallback(() => {
    startWind(0.055);
  }, [startWind]);

  return { startWind, stopWind, startRain, stopRain, playCrackle, playLevelUp, playThunder, playSnow };
}

// ─────────────────────────────────────────────────────────────────────────────
// SKY GRADIENTS
// ─────────────────────────────────────────────────────────────────────────────
const SKY: Record<TimeOfDay, string> = {
  dawn:      "linear-gradient(180deg,#1e0b35 0%,#8c3a6a 40%,#e8836b 70%,#ffb86c 100%)",
  morning:   "linear-gradient(180deg,#0e1f38 0%,#1e5090 40%,#5aaad8 75%,#b8dcf0 100%)",
  afternoon: "linear-gradient(180deg,#071220 0%,#102e58 40%,#1e6aaa 75%,#2e90c8 100%)",
  dusk:      "linear-gradient(180deg,#0c0120 0%,#5a1e90 30%,#c05a28 65%,#f5a020 100%)",
  night:     "linear-gradient(180deg,#020510 0%,#060e20 40%,#0a1832 70%,#0e2040 100%)",
  deepnight: "linear-gradient(180deg,#010204 0%,#040810 50%,#080e1c 100%)",
};

// ─────────────────────────────────────────────────────────────────────────────
// TREE COLOR PALETTES
// ─────────────────────────────────────────────────────────────────────────────
interface TreeColors {
  trunk: string; trunkLight: string; trunkDark: string;
  leafA: string; leafB: string; leafC: string; leafDark: string;
  leafHighlight: string;
  glowColor: string; glowAlpha: number;
  emberColor: string;
}

const TREE_COLORS: Record<TreeState, TreeColors> = {
  seedling: {
    trunk:"#7c5c3e", trunkLight:"#a07850", trunkDark:"#4e3220",
    leafA:"#7ece6a", leafB:"#4aaa38", leafC:"#2a8020", leafDark:"#1a5514",
    leafHighlight:"rgba(200,255,180,0.28)", glowColor:"#50e870", glowAlpha:0.24, emberColor:"",
  },
  sapling: {
    trunk:"#6b4c30", trunkLight:"#9a7050", trunkDark:"#422c18",
    leafA:"#5ec858", leafB:"#38a832", leafC:"#1c8820", leafDark:"#115514",
    leafHighlight:"rgba(180,255,160,0.26)", glowColor:"#40d860", glowAlpha:0.30, emberColor:"",
  },
  healthy: {
    trunk:"#5a3e28", trunkLight:"#8a6040", trunkDark:"#382010",
    leafA:"#38c050", leafB:"#22a038", leafC:"#107828", leafDark:"#0a5020",
    leafHighlight:"rgba(160,255,180,0.30)", glowColor:"#28e868", glowAlpha:0.40, emberColor:"",
  },
  golden: {
    trunk:"#8c6840", trunkLight:"#bca060", trunkDark:"#5a4020",
    leafA:"#ffd700", leafB:"#e8a800", leafC:"#c87800", leafDark:"#9a5800",
    leafHighlight:"rgba(255,245,130,0.40)", glowColor:"#ffd700", glowAlpha:0.55, emberColor:"",
  },
  stressed: {
    trunk:"#7a5430", trunkLight:"#a88050", trunkDark:"#4e3218",
    leafA:"#d8a828", leafB:"#b88818", leafC:"#906808", leafDark:"#604800",
    leafHighlight:"rgba(255,220,80,0.20)", glowColor:"#d4aa28", glowAlpha:0.28, emberColor:"",
  },
  sad: {
    trunk:"#5a4830", trunkLight:"#8a7050", trunkDark:"#362c18",
    leafA:"#789048", leafB:"#587030", leafC:"#385018", leafDark:"#203010",
    leafHighlight:"rgba(140,160,80,0.16)", glowColor:"#78904a", glowAlpha:0.18, emberColor:"",
  },
  burnt: {
    trunk:"#28180c", trunkLight:"#402818", trunkDark:"#180a04",
    leafA:"#2a1e18", leafB:"#1e1410", leafC:"#140e0a", leafDark:"#0a0604",
    leafHighlight:"rgba(200,80,20,0.16)", glowColor:"#e04010", glowAlpha:0.45, emberColor:"#e86820",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PURE-CODE SVG TREE
// Every shape is drawn with SVG primitives – no external images, no emoji
// ─────────────────────────────────────────────────────────────────────────────
type BlobDef = [number, number, number, number, number]; // cx cy rx ry opacity

function TreeSVG({ state, spentPct }: { state: TreeState; spentPct: number }) {
  const C         = TREE_COLORS[state];
  const isBurnt   = state === "burnt";
  const isGolden  = state === "golden";
  const isSeed    = state === "seedling";
  const isSap     = state === "sapling";
  const isTiny    = isSeed || isSap;

  /* ── dimensions ── */
  const tH        = isSeed ? 56 : isSap ? 88 : 132;   // trunk height
  const tW        = isSeed ? 9  : isSap ? 15 : 24;    // trunk width at base
  const groundY   = 270;
  const trunkTopY = groundY - tH;
  const dropY     = state === "sad" ? 8 : 0;          // drooping offset for sad

  /* ── sway config ── */
  const swayAng  = isBurnt ? 0 : state==="stressed" ? 4.5 : state==="sad" ? 2.2 : 1.8;
  const swayDur  = state==="stressed" ? 1.2 : state==="sad" ? 5.5 : 3.2;

  /* ── canopy blob definitions  (cx, cy, rx, ry, opacity) ── */
  const blobs: BlobDef[] = isSeed
    ? [
        [100, 186, 32, 27, 1.0],
        [82,  198, 20, 16, 0.76],
        [118, 196, 20, 16, 0.73],
      ]
    : isSap
    ? [
        [100, 152, 55, 45, 1.0],
        [75,  172, 35, 28, 0.78],
        [125, 170, 35, 28, 0.75],
        [100, 138, 38, 30, 0.68],
      ]
    : [
        [100, 105, 82, 68, 1.0],    // main centre crown
        [67,  138, 56, 47, 0.82],   // left mid cluster
        [133, 135, 54, 44, 0.80],   // right mid cluster
        [100,  85, 58, 48, 0.75],   // top crown peak
        [56,  116, 38, 31, 0.62],   // far left
        [144, 114, 36, 30, 0.60],   // far right
        [100, 157, 48, 37, 0.54],   // bottom skirt
      ];

  return (
    <motion.svg
      viewBox="0 0 200 300"
      style={{ width: 200, height: 300, overflow: "visible",
               originX: "50%", originY: `${(groundY / 300) * 100}%` }}
      animate={swayAng > 0
        ? { rotate: [0, swayAng, -swayAng * 0.65, swayAng * 0.35, 0] }
        : { rotate: 0 }}
      transition={{ duration: swayDur, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        {/* Trunk – lateral gradient for roundness */}
        <linearGradient id={`tg-${state}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={C.trunkDark} />
          <stop offset="28%"  stopColor={C.trunk} />
          <stop offset="62%"  stopColor={C.trunkLight} />
          <stop offset="100%" stopColor={C.trunkDark} />
        </linearGradient>

        {/* Leaf fill – radial for depth */}
        <radialGradient id={`lg-${state}`} cx="36%" cy="28%" r="68%">
          <stop offset="0%"   stopColor={C.leafA} />
          <stop offset="44%"  stopColor={C.leafB} />
          <stop offset="100%" stopColor={C.leafC} />
        </radialGradient>

        {/* Ambient aura glow */}
        <radialGradient id={`ag-${state}`} cx="50%" cy="52%" r="50%">
          <stop offset="0%"   stopColor={C.glowColor} stopOpacity={C.glowAlpha} />
          <stop offset="100%" stopColor={C.glowColor} stopOpacity="0" />
        </radialGradient>

        {/* Ground shadow */}
        <radialGradient id={`gs-${state}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#000" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>

        {/* Burnt ember glow */}
        {isBurnt && (
          <radialGradient id="emb-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ff8820" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e04010" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>

      {/* ── ground shadow ── */}
      <ellipse cx="100" cy={groundY + 7} rx="58" ry="10" fill={`url(#gs-${state})`} />

      {/* ── ambient aura halo ── */}
      <ellipse
        cx="100"
        cy={isSeed ? 195 : isSap ? 155 : 138}
        rx={isSeed ? 50 : isSap ? 78 : 108}
        ry={isSeed ? 42 : isSap ? 62 : 90}
        fill={`url(#ag-${state})`}
      />

      {/* ══════════ ROOTS ══════════ */}
      {!isSeed && (
        <g>
          {/* Left primary root */}
          <path
            d={`M${100 - tW/2},${groundY} C88,${groundY+4} 72,${groundY+8} 56,${groundY+6}`}
            stroke={C.trunkDark} strokeWidth={isSap ? 4.5 : 7} fill="none" strokeLinecap="round"
          />
          {/* Right primary root */}
          <path
            d={`M${100 + tW/2},${groundY} C112,${groundY+4} 128,${groundY+8} 144,${groundY+6}`}
            stroke={C.trunkDark} strokeWidth={isSap ? 4.5 : 7} fill="none" strokeLinecap="round"
          />
          {!isSap && (
            <>
              {/* Left secondary root */}
              <path
                d={`M88,${groundY+2} C80,${groundY+5} 68,${groundY+9} 60,${groundY+8}`}
                stroke={C.trunk} strokeWidth="4" fill="none" strokeLinecap="round"
              />
              {/* Right secondary root */}
              <path
                d={`M112,${groundY+2} C120,${groundY+5} 132,${groundY+9} 140,${groundY+8}`}
                stroke={C.trunk} strokeWidth="4" fill="none" strokeLinecap="round"
              />
              {/* Left tertiary root */}
              <path
                d={`M72,${groundY+6} C64,${groundY+8} 58,${groundY+10} 52,${groundY+9}`}
                stroke={C.trunkDark} strokeWidth="2.5" fill="none" strokeLinecap="round"
              />
              {/* Right tertiary root */}
              <path
                d={`M128,${groundY+6} C136,${groundY+8} 142,${groundY+10} 148,${groundY+9}`}
                stroke={C.trunkDark} strokeWidth="2.5" fill="none" strokeLinecap="round"
              />
            </>
          )}
        </g>
      )}

      {/* ══════════ TRUNK  (tapers toward top via path) ══════════ */}
      <path
        d={`
          M${100 - tW/2 - 3},${groundY}
          C${100 - tW/2 - 2},${groundY - tH * 0.48}
           ${100 - tW/2 + 1},${groundY - tH * 0.82}
           ${100 - tW/2 + 5},${trunkTopY}
          L${100 + tW/2 - 5},${trunkTopY}
          C${100 + tW/2 - 1},${groundY - tH * 0.82}
           ${100 + tW/2 + 2},${groundY - tH * 0.48}
           ${100 + tW/2 + 3},${groundY}
          Z
        `}
        fill={`url(#tg-${state})`}
      />

      {/* Bark texture lines on trunk */}
      {!isSeed && (
        <>
          {[0.30, 0.52, 0.72].map((t, i) => {
            const y = trunkTopY + tH * t;
            const wAtY = tW * (0.55 + t * 0.45);
            return (
              <path key={i}
                d={`M${100 - wAtY/2 + 3},${y} Q100,${y - 2} ${100 + wAtY/2 - 3},${y}`}
                stroke={C.trunkDark} strokeWidth="1.4" fill="none" opacity="0.45"
              />
            );
          })}
        </>
      )}

      {/* ══════════ BRANCHES  (only mature, non-burnt) ══════════ */}
      {!isTiny && !isBurnt && (
        <g>
          {/* Left main branch */}
          <path
            d={`M100,${trunkTopY + tH*0.32} C88,${trunkTopY+tH*0.18} 70,${trunkTopY+tH*0.06} 53,${trunkTopY-12}`}
            stroke={C.trunkDark} strokeWidth="10" fill="none" strokeLinecap="round"
          />
          <path
            d={`M100,${trunkTopY + tH*0.32} C88,${trunkTopY+tH*0.18} 70,${trunkTopY+tH*0.06} 53,${trunkTopY-12}`}
            stroke={C.trunk} strokeWidth="7" fill="none" strokeLinecap="round"
          />
          {/* Left sub-branch */}
          <path
            d={`M70,${trunkTopY+tH*0.12} C60,${trunkTopY+tH*0.00} 50,${trunkTopY-10} 42,${trunkTopY-22}`}
            stroke={C.trunkDark} strokeWidth="6.5" fill="none" strokeLinecap="round"
          />
          <path
            d={`M70,${trunkTopY+tH*0.12} C60,${trunkTopY+tH*0.00} 50,${trunkTopY-10} 42,${trunkTopY-22}`}
            stroke={C.trunk} strokeWidth="4.5" fill="none" strokeLinecap="round"
          />
          {/* Right main branch */}
          <path
            d={`M100,${trunkTopY + tH*0.24} C112,${trunkTopY+tH*0.10} 130,${trunkTopY-0.02*tH} 147,${trunkTopY-16}`}
            stroke={C.trunkDark} strokeWidth="10" fill="none" strokeLinecap="round"
          />
          <path
            d={`M100,${trunkTopY + tH*0.24} C112,${trunkTopY+tH*0.10} 130,${trunkTopY-0.02*tH} 147,${trunkTopY-16}`}
            stroke={C.trunk} strokeWidth="7" fill="none" strokeLinecap="round"
          />
          {/* Right sub-branch */}
          <path
            d={`M132,${trunkTopY+tH*0.05} C142,${trunkTopY-0.06*tH} 152,${trunkTopY-16} 158,${trunkTopY-28}`}
            stroke={C.trunkDark} strokeWidth="6" fill="none" strokeLinecap="round"
          />
          <path
            d={`M132,${trunkTopY+tH*0.05} C142,${trunkTopY-0.06*tH} 152,${trunkTopY-16} 158,${trunkTopY-28}`}
            stroke={C.trunk} strokeWidth="4" fill="none" strokeLinecap="round"
          />
          {/* Centre top branch */}
          <path
            d={`M100,${trunkTopY+6} C98,${trunkTopY-12} 100,${trunkTopY-28} 102,${trunkTopY-42}`}
            stroke={C.trunkDark} strokeWidth="8" fill="none" strokeLinecap="round"
          />
          <path
            d={`M100,${trunkTopY+6} C98,${trunkTopY-12} 100,${trunkTopY-28} 102,${trunkTopY-42}`}
            stroke={C.trunk} strokeWidth="5.5" fill="none" strokeLinecap="round"
          />
        </g>
      )}

      {/* ══════════ BURNT deadwood ══════════ */}
      {isBurnt && (
        <g>
          <path
            d={`M100,${trunkTopY+42} C82,${trunkTopY+22} 64,${trunkTopY+10} 50,${trunkTopY+2}`}
            stroke="#2a1a10" strokeWidth="8" fill="none" strokeLinecap="round"
          />
          <path
            d={`M100,${trunkTopY+30} C118,${trunkTopY+14} 136,${trunkTopY+4} 148,${trunkTopY-10}`}
            stroke="#2a1a10" strokeWidth="7" fill="none" strokeLinecap="round"
          />
          <path
            d={`M100,${trunkTopY+14} C100,${trunkTopY-5} 98,${trunkTopY-22} 100,${trunkTopY-36}`}
            stroke="#2a1a10" strokeWidth="5.5" fill="none" strokeLinecap="round"
          />
          {/* Char cracks on trunk */}
          {[0.28, 0.50, 0.72].map((t, i) => {
            const y = trunkTopY + tH * t;
            const wAtY = tW * (0.55 + t * 0.45);
            return (
              <path key={i}
                d={`M${100-wAtY/2+3},${y} Q${96+i*2},${y+3} ${100+wAtY/2-3},${y}`}
                stroke="#180a04" strokeWidth="1.8" fill="none" opacity="0.70"
              />
            );
          })}
        </g>
      )}

      {/* ══════════ CANOPY BLOBS ══════════ */}
      {!isBurnt && (
        <>
          {/* Shadow blobs (drawn behind) */}
          {blobs.map(([cx,cy,rx,ry,op], i) => (
            <ellipse key={`sh-${i}`}
              cx={cx + 6} cy={cy + dropY + 8}
              rx={rx * 0.88} ry={ry * 0.80}
              fill={C.leafDark}
              opacity={op * 0.30}
            />
          ))}

          {/* Main filled blobs (front to back order, later = smaller/back) */}
          {blobs.map(([cx,cy,rx,ry,op], i) => (
            <motion.ellipse key={`blob-${i}`}
              cx={cx} cy={cy + dropY}
              rx={rx} ry={ry}
              fill={`url(#lg-${state})`}
              opacity={op}
              animate={{
                scaleX: [1, 1.016, 0.988, 1.006, 1],
                scaleY: [1, 1.024, 0.990, 1.008, 1],
              }}
              transition={{
                duration: 3.6 + i * 0.38,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.22,
              }}
              style={{ transformOrigin: `${cx}px ${cy + dropY}px` }}
            />
          ))}

          {/* Specular highlight on main crown */}
          <ellipse
            cx={blobs[0][0] - blobs[0][2] * 0.24}
            cy={blobs[0][1] + dropY - blobs[0][3] * 0.32}
            rx={blobs[0][2] * 0.27}
            ry={blobs[0][3] * 0.21}
            fill="white" opacity="0.09"
          />

          {/* Inner depth shadow on main crown */}
          <ellipse
            cx={blobs[0][0] + 12}
            cy={blobs[0][1] + dropY + 20}
            rx={blobs[0][2] * 0.42}
            ry={blobs[0][3] * 0.32}
            fill={C.leafDark} opacity="0.18"
          />
        </>
      )}

      {/* ══════════ BURNT EMBERS + SMOKE ══════════ */}
      {isBurnt && (
        <>
          {[
            {cx:76,  cy:185, r:4.2, d:1.0},
            {cx:124, cy:176, r:3.2, d:0.7},
            {cx:100, cy:165, r:3.8, d:1.3},
            {cx:87,  cy:198, r:2.6, d:0.85},
            {cx:115, cy:190, r:2.9, d:1.55},
            {cx:66,  cy:204, r:2.2, d:0.5},
            {cx:136, cy:196, r:2.4, d:1.15},
          ].map((e, i) => (
            <motion.g key={i}>
              {/* Glow aura */}
              <motion.circle cx={e.cx} cy={e.cy} r={e.r * 2.8}
                fill="url(#emb-g)" opacity="0"
                animate={{ opacity:[0,0.42,0], r:[e.r*2.8, e.r*4.2, e.r*2.8] }}
                transition={{ duration:e.d*1.6, repeat:Infinity, delay:i*0.20 }}
              />
              {/* Ember core */}
              <motion.circle cx={e.cx} cy={e.cy} r={e.r}
                fill={C.emberColor}
                animate={{ opacity:[0.92,0.22,0.92], r:[e.r, e.r*1.55, e.r] }}
                transition={{ duration:e.d, repeat:Infinity, delay:i*0.20 }}
              />
              {/* Rising smoke puff */}
              <motion.ellipse cx={e.cx} cy={e.cy} rx={2.5} ry={3.5}
                fill="rgba(90,70,60,0.38)"
                animate={{ y:[0,-26], opacity:[0.38,0], scaleX:[1,2.8] }}
                transition={{ duration:2.4, repeat:Infinity, delay:i*0.38, ease:"easeOut" }}
              />
            </motion.g>
          ))}
        </>
      )}

      {/* ══════════ STRESSED: falling leaves ══════════ */}
      {state === "stressed" && (
        <>
          {[
            {x:76,  y:128, dx:20},
            {x:124, y:144, dx:-14},
            {x:94,  y:116, dx:22},
            {x:110, y:160, dx:-18},
            {x:82,  y:150, dx:16},
          ].map((l, i) => (
            <motion.ellipse key={i}
              cx={l.x} cy={l.y} rx="5.5" ry="3"
              fill={C.leafB} opacity="0.82"
              animate={{
                y: [0, 58, 88], x: [0, l.dx, l.dx * 0.55],
                opacity: [0.82, 0.5, 0],
              }}
              transition={{ duration:2.5, repeat:Infinity, delay:i*0.65, ease:"easeIn" }}
            />
          ))}
        </>
      )}

      {/* ══════════ SAD: extra wilting droop shadow ══════════ */}
      {state === "sad" && !isTiny && (
        <ellipse
          cx="100" cy={blobs[0][1] + 22}
          rx={blobs[0][2] + 10} ry={blobs[0][3] * 0.38}
          fill={C.leafC} opacity="0.24"
        />
      )}

      {/* ══════════ GOLDEN: 4-point star sparkles ══════════ */}
      {isGolden && (
        <>
          {[
            {x:84,y:86},{x:116,y:78},{x:100,y:68},{x:67,y:108},{x:133,y:104},
            {x:76,y:128},{x:126,y:126},{x:100,y:148},
          ].map((s, i) => {
            const sp = `
              M${s.x},${s.y-5.5} L${s.x+1.6},${s.y-1.6}
              L${s.x+5.5},${s.y} L${s.x+1.6},${s.y+1.6}
              L${s.x},${s.y+5.5} L${s.x-1.6},${s.y+1.6}
              L${s.x-5.5},${s.y} L${s.x-1.6},${s.y-1.6} Z
            `;
            return (
              <motion.path key={i} d={sp} fill="#ffe040"
                animate={{ opacity:[0,1,0], scale:[0.3,1.3,0.3] }}
                transition={{ duration:2.1, repeat:Infinity, delay:i*0.30 }}
                style={{ transformOrigin:`${s.x}px ${s.y}px` }}
              />
            );
          })}
        </>
      )}
    </motion.svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WEATHER FX COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function Rain({ heavy = false }: { heavy?: boolean }) {
  const drops = useMemo(() =>
    Array.from({ length: heavy ? 72 : 50 }, (_, i) => ({
      id: i,
      left:  Math.random() * 110 - 5,
      delay: Math.random() * 1.6,
      dur:   0.35 + Math.random() * 0.4,
      h:     11 + Math.random() * 16,
      op:    0.22 + Math.random() * 0.48,
      slant: Math.random() * 10 - 5,
    })), [heavy]);

  return (
    <div style={{ position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden" }}>
      {drops.map(d => (
        <motion.div key={d.id}
          style={{
            position:"absolute", left:`${d.left}%`, top:"-3%",
            width:1.5, height:d.h, borderRadius:2, opacity:d.op,
            background:"linear-gradient(180deg,transparent,rgba(160,200,255,0.85))",
          }}
          animate={{ y:["0vh","110vh"], x:[0,d.slant] }}
          transition={{ duration:d.dur, repeat:Infinity, delay:d.delay, ease:"linear" }}
        />
      ))}
    </div>
  );
}

function Snow() {
  const flakes = useMemo(() =>
    Array.from({ length: 52 }, (_, i) => ({
      id: i,
      left: Math.random() * 110 - 5,
      size: 3 + Math.random() * 5.5,
      delay: Math.random() * 8,
      dur:   5.5 + Math.random() * 8,
      drift: Math.random() * 38 - 19,
      op:    0.5 + Math.random() * 0.5,
    })), []);

  return (
    <div style={{ position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden" }}>
      {flakes.map(f => (
        <motion.div key={f.id}
          style={{
            position:"absolute", left:`${f.left}%`, top:"-3%",
            width:f.size, height:f.size, borderRadius:"50%",
            background:"white", opacity:f.op,
          }}
          animate={{ y:["0vh","108vh"], x:[0,f.drift,-f.drift*0.5,f.drift*0.3] }}
          transition={{ duration:f.dur, repeat:Infinity, delay:f.delay, ease:"linear" }}
        />
      ))}
    </div>
  );
}

function Lightning() {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let tid: ReturnType<typeof setTimeout>;
    const schedule = () => {
      tid = setTimeout(() => {
        setFlash(true);
        setTimeout(() => { setFlash(false); schedule(); }, 140);
      }, 3500 + Math.random() * 9000);
    };
    schedule();
    return () => clearTimeout(tid);
  }, []);

  return (
    <div style={{ position:"absolute",inset:0,pointerEvents:"none" }}>
      <AnimatePresence>
        {flash && (
          <motion.div
            style={{ position:"absolute",inset:0,background:"rgba(210,220,255,0.16)" }}
            initial={{ opacity:0 }}
            animate={{ opacity:[0,0.9,0.2,1,0] }}
            exit={{ opacity:0 }}
            transition={{ duration:0.14 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SunGlow() {
  return (
    <motion.div
      style={{
        position:"absolute",top:22,left:22,
        width:108,height:108,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(255,220,80,0.65) 0%,transparent 70%)",
        filter:"blur(12px)", pointerEvents:"none",
      }}
      animate={{ opacity:[0.5,1,0.5], scale:[1,1.15,1] }}
      transition={{ duration:5, repeat:Infinity, ease:"easeInOut" }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CELESTIAL OBJECTS
// ─────────────────────────────────────────────────────────────────────────────
function Stars() {
  const stars = useMemo(() =>
    Array.from({ length: 62 }, (_, i) => ({
      id: i,
      l:   Math.random() * 100,
      t:   Math.random() * 58,
      s:   0.8 + Math.random() * 2.2,
      del: Math.random() * 5,
      dur: 2 + Math.random() * 3.5,
    })), []);

  return (
    <>
      {stars.map(s => (
        <motion.div key={s.id}
          style={{
            position:"absolute", left:`${s.l}%`, top:`${s.t}%`,
            width:s.s, height:s.s, borderRadius:"50%", background:"white",
          }}
          animate={{ opacity:[0.15,0.95,0.15] }}
          transition={{ duration:s.dur, repeat:Infinity, delay:s.del, ease:"easeInOut" }}
        />
      ))}
    </>
  );
}

function Moon() {
  return (
    <motion.div
      style={{
        position:"absolute", top:26, right:50,
        width:50, height:50, borderRadius:"50%",
        background:"radial-gradient(circle at 37% 33%,#fff8e0,#d4a84a)",
        boxShadow:"0 0 55px rgba(255,230,130,0.22),0 0 110px rgba(255,200,60,0.08)",
      }}
      animate={{ opacity:[0.80,1,0.80] }}
      transition={{ duration:7, repeat:Infinity, ease:"easeInOut" }}
    />
  );
}

function Fireflies() {
  const flies = useMemo(() =>
    Array.from({ length: 13 }, (_, i) => ({
      id: i,
      l:   12 + Math.random() * 76,
      t:   28 + Math.random() * 56,
      del: Math.random() * 9,
      dur: 3 + Math.random() * 4.5,
      dx:  (Math.random() - 0.5) * 42,
      dy:  (Math.random() - 0.5) * 30,
    })), []);

  return (
    <>
      {flies.map(f => (
        <motion.div key={f.id}
          style={{
            position:"absolute", left:`${f.l}%`, top:`${f.t}%`,
            width:7, height:7, borderRadius:"50%",
            background:"#aaff88",
            boxShadow:"0 0 9px 3px rgba(120,255,100,0.72)",
            pointerEvents:"none",
          }}
          animate={{ opacity:[0,1,0], x:[0,f.dx,0], y:[0,f.dy,0] }}
          transition={{ duration:f.dur, repeat:Infinity, delay:f.del, ease:"easeInOut" }}
        />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GROUND ELEMENTS
// ─────────────────────────────────────────────────────────────────────────────
function GroundGrass({ treeState }: { treeState: TreeState }) {
  const color = treeState==="burnt" ? "#3a2210" : treeState==="sad" ? "#4a5820" : "#2a8838";
  const blades = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x:   4 + (i / 23) * 92,
      h:   10 + Math.random() * 13,
      del: i * 0.11,
    })), []);

  return (
    <div style={{ position:"absolute",bottom:0,left:0,right:0,height:62,pointerEvents:"none",overflow:"hidden" }}>
      <svg viewBox="0 0 400 62" width="100%" height="62" preserveAspectRatio="none">
        {blades.map(b => (
          <motion.path key={b.id}
            d={`M${b.x*4},62 Q${b.x*4-5},${62-b.h*0.55} ${b.x*4+1},${62-b.h}`}
            stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"
            animate={{
              d:[
                `M${b.x*4},62 Q${b.x*4-5},${62-b.h*0.55} ${b.x*4+1},${62-b.h}`,
                `M${b.x*4},62 Q${b.x*4+6},${62-b.h*0.55} ${b.x*4+3},${62-b.h}`,
                `M${b.x*4},62 Q${b.x*4-5},${62-b.h*0.55} ${b.x*4+1},${62-b.h}`,
              ],
            }}
            transition={{ duration:3.0, repeat:Infinity, delay:b.del, ease:"easeInOut" }}
          />
        ))}
      </svg>
    </div>
  );
}

function GroundParticles() {
  const pts = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      l:   5 + Math.random() * 90,
      s:   2 + Math.random() * 4.5,
      del: Math.random() * 6.5,
      dur: 4.5 + Math.random() * 5.5,
      dx:  (Math.random() - 0.5) * 24,
    })), []);

  return (
    <div style={{ position:"absolute",bottom:0,left:0,right:0,height:160,pointerEvents:"none",overflow:"hidden" }}>
      {pts.map(p => (
        <motion.div key={p.id}
          style={{
            position:"absolute", left:`${p.l}%`, bottom:"8%",
            width:p.s, height:p.s, borderRadius:"50%",
            background:"rgba(100,220,130,0.52)",
          }}
          animate={{ y:[0,-65,0], x:[0,p.dx,0], opacity:[0.52,0.07,0.52] }}
          transition={{ duration:p.dur, repeat:Infinity, delay:p.del, ease:"easeInOut" }}
        />
      ))}
    </div>
  );
}

function FogLayer({ weather }: { weather: Weather }) {
  const op = weather==="stormy" ? 0.25 : weather==="rainy" ? 0.14 : 0.07;
  return (
    <motion.div
      style={{
        position:"absolute", bottom:0, left:0, right:0, height:130,
        pointerEvents:"none",
        background:"linear-gradient(0deg,rgba(155,185,210,0.20) 0%,transparent 100%)",
      }}
      animate={{ opacity:[op, op*1.5, op] }}
      transition={{ duration:10, repeat:Infinity, ease:"easeInOut" }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// XP RING  (animated progress ring with tick marks and centre label)
// ─────────────────────────────────────────────────────────────────────────────
function XPRing({ pct, state }: { pct: number; state: TreeState }) {
  const r     = 108;
  const circ  = 2 * Math.PI * r;
  const filled = Math.min(pct, 100);

  const color =
    state==="burnt"    ? "#e85520" :
    state==="sad"      ? "#7a8840" :
    state==="stressed" ? "#d4a820" :
    state==="golden"   ? "#ffd700" :
                         "#28e870";

  const tipAngle = (filled / 100) * 2 * Math.PI - Math.PI / 2;
  const tipX = 120 + r * Math.cos(tipAngle);
  const tipY = 120 + r * Math.sin(tipAngle);

  return (
    <svg viewBox="0 0 240 240"
      style={{
        width:240, height:240,
        position:"absolute", top:-30, left:"50%",
        transform:"translateX(-50%)",
        pointerEvents:"none",
      }}
    >
      {/* Outer background track */}
      <circle cx="120" cy="120" r={r}
        fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />

      {/* Tick marks (20 segments) */}
      {Array.from({ length: 20 }, (_, i) => {
        const a = (i / 20) * 2 * Math.PI - Math.PI / 2;
        const ir = r - 6, or2 = r + 3;
        return (
          <line key={i}
            x1={120 + ir * Math.cos(a)} y1={120 + ir * Math.sin(a)}
            x2={120 + or2 * Math.cos(a)} y2={120 + or2 * Math.sin(a)}
            stroke="rgba(255,255,255,0.14)" strokeWidth="1.8"
          />
        );
      })}

      {/* Progress arc */}
      <motion.circle
        cx="120" cy="120" r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${(filled / 100) * circ} ${circ}`}
        transform="rotate(-90 120 120)"
        initial={{ strokeDasharray:`0 ${circ}` }}
        animate={{ strokeDasharray:`${(filled / 100) * circ} ${circ}` }}
        transition={{ duration:1.5, ease:"easeOut" }}
      />

      {/* Glowing tip dot */}
      {filled > 2 && (
        <motion.circle cx={tipX} cy={tipY} r="6"
          fill={color}
          animate={{ opacity:[1,0.35,1], r:[6,8.5,6] }}
          transition={{ duration:1.7, repeat:Infinity }}
        />
      )}

      {/* Centre readout */}
      <text x="120" y="113"
        textAnchor="middle" fill="rgba(255,255,255,0.88)"
        fontSize="23" fontWeight="700" fontFamily="monospace">
        {Math.round(filled)}%
      </text>
      <text x="120" y="132"
        textAnchor="middle" fill="rgba(255,255,255,0.40)"
        fontSize="11" fontFamily="sans-serif" letterSpacing="1.2">
        BUDGET
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HUD COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const MOOD_CFG: Record<TreeState, {label:string;color:string;bg:string}> = {
  seedling: { label:"Just Started",   color:"#58e878", bg:"rgba(18,65,28,0.62)" },
  sapling:  { label:"Growing",        color:"#40d860", bg:"rgba(16,60,24,0.62)" },
  healthy:  { label:"Thriving",       color:"#28f070", bg:"rgba(14,60,26,0.62)" },
  golden:   { label:"Legendary ★",    color:"#ffd700", bg:"rgba(78,52,0,0.66)"  },
  stressed: { label:"Watch Spending", color:"#e8c038", bg:"rgba(72,52,0,0.62)"  },
  sad:      { label:"Struggling",     color:"#9ab050", bg:"rgba(26,36,8,0.62)"  },
  burnt:    { label:"Overspent!",     color:"#e86030", bg:"rgba(78,16,0,0.66)"  },
};

const WEATHER_ICON: Record<Weather, string> = {
  sunny:"☀", rainy:"⛆", snowy:"❄", stormy:"⚡",
};

function MoodBadge({ state }: { state: TreeState }) {
  const c = MOOD_CFG[state];
  return (
    <motion.div key={state}
      initial={{ opacity:0, y:-10 }}
      animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, y:10 }}
      style={{
        position:"absolute", top:14, left:14, zIndex:20,
        padding:"5px 14px", borderRadius:99,
        background:c.bg, color:c.color,
        border:`1px solid ${c.color}44`,
        backdropFilter:"blur(8px)",
        fontSize:12, fontWeight:700, letterSpacing:"0.05em",
        fontFamily:"monospace",
      }}
    >
      {c.label}
    </motion.div>
  );
}

function BudgetHUD({ spent, budget, pct }: { spent:number; budget:number; pct:number }) {
  const over = pct >= 100;
  return (
    <div style={{
      position:"absolute", top:14, right:14, zIndex:20,
      padding:"6px 14px", borderRadius:12,
      background:"rgba(6,14,26,0.65)",
      backdropFilter:"blur(10px)",
      border:"1px solid rgba(255,255,255,0.09)",
      fontSize:13, fontFamily:"monospace",
    }}>
      <span style={{ color:"rgba(255,255,255,0.45)" }}>Today: </span>
      <span style={{ color: over ? "#e86030" : "#28f070", fontWeight:700 }}>₹{spent}</span>
      <span style={{ color:"rgba(255,255,255,0.32)" }}> / ₹{budget}</span>
    </div>
  );
}

function WeatherBadge({ weather }: { weather: Weather }) {
  return (
    <div style={{
      position:"absolute", bottom:14, right:14, zIndex:20,
      padding:"4px 12px", borderRadius:10,
      background:"rgba(6,14,26,0.54)",
      border:"1px solid rgba(255,255,255,0.09)",
      fontSize:12, color:"rgba(255,255,255,0.52)",
      fontFamily:"monospace", letterSpacing:"0.06em",
      backdropFilter:"blur(6px)",
    }}>
      {WEATHER_ICON[weather]} {weather.toUpperCase()}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAST-DAY MINI TREES
// ─────────────────────────────────────────────────────────────────────────────
function PastTrees({ pastDays }: { pastDays: {date:string; state:TreeState}[] }) {
  if (!pastDays.length) return null;
  return (
    <div style={{
      position:"absolute", bottom:4, left:8, right:8,
      display:"flex", justifyContent:"space-around", alignItems:"flex-end",
      zIndex:1, pointerEvents:"none",
    }}>
      {pastDays.map((d, i) => {
        const sc = 0.15 + i * 0.028;
        return (
          <div key={d.date} style={{
            opacity: 0.26 + i * 0.06,
            transform:`scale(${sc})`,
            transformOrigin:"bottom center",
          }}>
            <TreeSVG state={d.state} spentPct={50} />
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export function ForestCanvas({ user }: Props) {
  const { getTodayTotal, expenses } = useExpenses();
  const todaySpent   = getTodayTotal();
  const spentPercent = user.dailyBudget > 0 ? (todaySpent / user.dailyBudget) * 100 : 0;
  const treeState    = resolveTreeState(spentPercent);
  const timeOfDay    = getTimeOfDay();
  const weather      = useWeather();
  const isNight      = ["night", "deepnight", "dusk"].includes(timeOfDay);
  const prevState    = useRef<TreeState>(treeState);

  const audio = useAudio();

  // ── Weather-driven ambient audio ──────────────────────────────────────────
  useEffect(() => {
    if (weather === "stormy") {
      audio.startRain(true);
      audio.startWind(0.30);
    } else if (weather === "rainy") {
      audio.startRain(false);
      audio.startWind(0.12);
    } else if (weather === "snowy") {
      audio.stopRain();
      audio.playSnow();
    } else {
      audio.stopRain();
      audio.startWind(0.055);
    }
    return () => { audio.stopWind(); audio.stopRain(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weather]);

  // ── Tree state change sounds ──────────────────────────────────────────────
  useEffect(() => {
    const prev = prevState.current;
    if (prev !== treeState) {
      if (treeState === "burnt") {
        audio.playCrackle();
      } else if (
        ["stressed","sad","burnt"].includes(prev) &&
        ["healthy","golden","sapling","seedling"].includes(treeState)
      ) {
        audio.playLevelUp();
      }
      prevState.current = treeState;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeState]);

  // ── Periodic thunder during storm ─────────────────────────────────────────
  useEffect(() => {
    if (weather !== "stormy") return;
    let tid: ReturnType<typeof setTimeout>;
    const loop = () => {
      tid = setTimeout(() => { audio.playThunder(); loop(); }, 7000 + Math.random() * 12000);
    };
    loop();
    return () => clearTimeout(tid);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weather]);

  // ── Past days data ────────────────────────────────────────────────────────
  const pastDays = useMemo(() => {
    const today    = new Date().toISOString().split("T")[0];
    const dayMap: Record<string, number> = {};
    expenses.forEach(e => {
      if (e.date !== today) dayMap[e.date] = (dayMap[e.date] || 0) + Number(e.amount);
    });
    return Object.entries(dayMap).slice(-6).map(([date, total]) => ({
      date,
      state: resolveTreeState((total / user.dailyBudget) * 100),
    }));
  }, [expenses, user.dailyBudget]);

  return (
    <div style={{
      flex: 1,
      position: "relative",
      overflow: "hidden",
      borderRadius: 20,
      margin: 8,
      minHeight: 420,
      background: SKY[timeOfDay],
    }}>

      {/* Weather colour tint overlay */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:
          weather==="stormy" ? "rgba(8,8,42,0.34)" :
          weather==="rainy"  ? "rgba(65,105,195,0.10)" :
          weather==="snowy"  ? "rgba(198,218,255,0.08)" :
                               "rgba(255,210,80,0.05)",
      }} />

      {/* ── HUD ── */}
      <AnimatePresence mode="wait">
        <MoodBadge key={treeState} state={treeState} />
      </AnimatePresence>
      <BudgetHUD spent={todaySpent} budget={user.dailyBudget} pct={spentPercent} />
      <WeatherBadge weather={weather} />

      {/* ── Celestial ── */}
      {isNight && <Stars />}
      {isNight && <Moon />}
      {["morning","dawn"].includes(timeOfDay) && weather==="sunny" && <SunGlow />}

      {/* ── Weather FX ── */}
      {weather==="rainy"  && <Rain />}
      {weather==="snowy"  && <Snow />}
      {weather==="stormy" && <><Rain heavy /><Lightning /></>}

      {/* ── Past mini trees (background, very small) ── */}
      <PastTrees pastDays={pastDays} />

      {/* ── Ground ── */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:115,
        background:"linear-gradient(180deg,transparent,hsl(150,28%,6%))",
      }} />
      <FogLayer weather={weather} />
      <GroundParticles />
      <GroundGrass treeState={treeState} />
      {isNight && <Fireflies />}

      {/* ── MAIN TREE + XP RING ── */}
      <div style={{
        position:"absolute", bottom:54, left:"50%",
        transform:"translateX(-50%)",
        display:"flex", flexDirection:"column", alignItems:"center",
        zIndex:10,
      }}>
        <div style={{ position:"relative" }}>
          <XPRing pct={spentPercent} state={treeState} />
          <div style={{ marginTop:28 }}>
            <TreeSVG state={treeState} spentPct={spentPercent} />
          </div>
        </div>
      </div>

    </div>
  );
}