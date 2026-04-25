import { useState, useEffect, useRef } from "react";

const LOGO_SRC = "/logo.png?v=daymasters-1";

const injectStyles = () => {
  if (document.getElementById("dm-styles")) return;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --gold: #C9A84C;
      --gold-light: #F0D080;
      --gold-dim: #7A6130;
      --bg: #050508;
      --bg-card: #0D0D14;
      --bg-card2: #12121C;
      --text: #E8E0D0;
      --text-dim: #888070;
    }

    html, body, #root {
      height: 100%;
      min-height: 100%;
      background: var(--bg);
      font-family: 'Rajdhani', sans-serif;
    }

    body {
      overflow-x: hidden;
    }

    button, input {
      font-family: inherit;
    }

    /* SPLASH */
    .dm-splash {
      position: fixed;
      inset: 0;
      background: var(--bg);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: opacity 0.8s ease;
    }

    .dm-splash.out {
      opacity: 0;
      pointer-events: none;
    }

    .dm-logo-wrap {
      width: 176px;
      height: 176px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 10000;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(201,168,76,0.16), rgba(201,168,76,0.04) 45%, transparent 70%);
      cursor: pointer;
    }

    .dm-logo {
      width: 160px;
      height: 160px;
      object-fit: contain;
      display: block;
      opacity: 1;
      visibility: visible;
      position: relative;
      z-index: 10001;
      cursor: pointer;
      user-select: none;
      filter: drop-shadow(0 0 20px var(--gold)) drop-shadow(0 0 50px var(--gold-dim));
      animation: pulse 3s ease-in-out infinite;
    }

    @keyframes pulse {
      0%,100% {
        filter: drop-shadow(0 0 20px var(--gold)) drop-shadow(0 0 50px var(--gold-dim));
      }

      50% {
        filter: drop-shadow(0 0 35px var(--gold-light)) drop-shadow(0 0 70px var(--gold));
      }
    }

    .dm-logo-fallback {
      font-size: 6rem;
      cursor: pointer;
      user-select: none;
      filter: drop-shadow(0 0 20px var(--gold));
      animation: pulse 3s ease-in-out infinite;
    }

    .dm-title {
      font-family: 'Cinzel', serif;
      font-size: 2.4rem;
      font-weight: 900;
      color: var(--gold);
      letter-spacing: 0.35em;
      margin-top: 1.2rem;
      text-shadow: 0 0 30px var(--gold-dim);
      text-align: center;
    }

    .dm-tagline {
      font-size: 0.82rem;
      color: var(--text-dim);
      letter-spacing: 0.2em;
      margin-top: 0.4rem;
      text-align: center;
    }

    .dm-enter {
      margin-top: 2.5rem;
      padding: 0.8rem 2.8rem;
      background: transparent;
      border: 1px solid var(--gold-dim);
      color: var(--gold);
      font-family: 'Cinzel', serif;
      font-size: 0.85rem;
      letter-spacing: 0.25em;
      cursor: pointer;
      transition: all 0.3s;
    }

    .dm-enter:hover {
      background: var(--gold-dim);
      color: var(--bg);
      box-shadow: 0 0 20px var(--gold-dim);
    }

    .dm-hint {
      margin-top: 0.7rem;
      font-size: 0.65rem;
      color: #333;
      letter-spacing: 0.1em;
    }

    /* ADMIN */
    .dm-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.93);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
    }

    .dm-admin-box {
      background: var(--bg-card);
      border: 1px solid var(--gold-dim);
      padding: 2rem;
      width: 90%;
      max-width: 380px;
      border-radius: 3px;
      box-shadow: 0 0 40px rgba(201,168,76,0.12);
    }

    .dm-admin-h {
      font-family: 'Cinzel', serif;
      color: var(--gold);
      font-size: 0.95rem;
      letter-spacing: 0.2em;
      text-align: center;
      margin-bottom: 1.2rem;
    }

    .dm-admin-in {
      width: 100%;
      padding: 0.7rem 1rem;
      background: #0A0A12;
      border: 1px solid var(--gold-dim);
      color: var(--gold);
      font-size: 1rem;
      letter-spacing: 0.15em;
      outline: none;
      margin-bottom: 1rem;
    }

    .dm-admin-in:focus {
      border-color: var(--gold);
    }

    .dm-admin-in::placeholder {
      color: #333;
    }

    .dm-admin-btn {
      width: 100%;
      padding: 0.7rem;
      background: var(--gold-dim);
      border: none;
      color: var(--bg);
      font-family: 'Cinzel', serif;
      font-size: 0.85rem;
      letter-spacing: 0.15em;
      cursor: pointer;
      transition: background 0.2s;
    }

    .dm-admin-btn:hover {
      background: var(--gold);
    }

    .dm-admin-err {
      color: #FF5050;
      font-size: 0.75rem;
      text-align: center;
      margin-top: 0.5rem;
    }

    .dm-cancel {
      margin-top: 0.8rem;
      width: 100%;
      padding: 0.5rem;
      background: none;
      border: 1px solid #222;
      color: var(--text-dim);
      font-size: 0.75rem;
      cursor: pointer;
      letter-spacing: 0.08em;
    }

    /* ADMIN DASH */
    .dm-dash {
      background: var(--bg-card);
      border: 1px solid var(--gold-dim);
      padding: 1.5rem;
      width: 94%;
      max-width: 480px;
      max-height: 88vh;
      overflow-y: auto;
      border-radius: 3px;
    }

    .dm-dash h2 {
      font-family: 'Cinzel', serif;
      color: var(--gold);
      font-size: 0.95rem;
      letter-spacing: 0.2em;
      text-align: center;
      margin-bottom: 1.2rem;
    }

    .dm-tiers {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .dm-tier {
      flex: 1;
      padding: 0.6rem;
      background: #0A0A12;
      border: 1px solid var(--gold-dim);
      color: var(--text-dim);
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      cursor: pointer;
    }

    .dm-tier.on {
      background: var(--gold-dim);
      color: var(--bg);
      border-color: var(--gold);
    }

    .dm-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.6rem;
      margin-bottom: 1rem;
    }

    .dm-stat {
      background: #0A0A12;
      border: 1px solid #1a1a28;
      padding: 0.8rem;
    }

    .dm-stat-l {
      font-size: 0.65rem;
      color: var(--text-dim);
      letter-spacing: 0.1em;
    }

    .dm-stat-v {
      font-size: 1.5rem;
      color: var(--gold);
      font-weight: 700;
      margin-top: 0.2rem;
    }

    .dm-tier-info {
      font-size: 0.7rem;
      color: var(--text-dim);
      line-height: 1.8;
      background: #0A0A12;
      padding: 0.8rem;
      border: 1px solid #1a1a28;
      margin-bottom: 1rem;
    }

    .dm-tier-info-h {
      color: var(--gold-dim);
      letter-spacing: 0.1em;
      margin-bottom: 0.3rem;
    }

    /* APP */
    .dm-app {
      min-height: 100vh;
      background: var(--bg);
      display: flex;
      flex-direction: column;
      max-width: 480px;
      margin: 0 auto;
    }

    /* HEADER */
    .dm-hdr {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.9rem 1.1rem;
      border-bottom: 1px solid #1a1a28;
    }

    .dm-hdr-logo {
      width: 34px;
      height: 34px;
      object-fit: contain;
      display: block;
      opacity: 1;
      visibility: visible;
    }

    .dm-hdr-title {
      font-family: 'Cinzel', serif;
      font-size: 0.95rem;
      color: var(--gold);
      letter-spacing: 0.2em;
    }

    .dm-hdr-right {
      font-size: 0.65rem;
      color: var(--text-dim);
      text-align: right;
      line-height: 1.5;
    }

    .dm-admin-badge {
      color: var(--gold-dim);
      cursor: pointer;
      font-size: 0.6rem;
      letter-spacing: 0.1em;
    }

    /* COMPANIONS */
    .dm-comps {
      display: flex;
      gap: 0.4rem;
      padding: 0.7rem 0.9rem;
      overflow-x: auto;
      border-bottom: 1px solid #1a1a28;
      scrollbar-width: none;
    }

    .dm-comps::-webkit-scrollbar {
      display: none;
    }

    .dm-comp {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      min-width: 52px;
      cursor: pointer;
      border: none;
      background: none;
      padding: 0.3rem;
    }

    .dm-av {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      border: 2px solid transparent;
      transition: all 0.25s;
    }

    .dm-comp.on .dm-av {
      border-color: var(--gold);
      box-shadow: 0 0 10px var(--c, var(--gold));
    }

    .dm-cn {
      font-size: 0.6rem;
      letter-spacing: 0.06em;
      color: var(--text-dim);
      text-transform: uppercase;
    }

    .dm-comp.on .dm-cn {
      color: var(--gold);
    }

    /* TABS */
    .dm-tabs {
      display: flex;
      border-bottom: 1px solid #1a1a28;
    }

    .dm-tab {
      flex: 1;
      padding: 0.75rem;
      background: none;
      border: none;
      color: var(--text-dim);
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }

    .dm-tab.on {
      color: var(--gold);
      border-bottom-color: var(--gold);
    }

    /* CHAT */
    .dm-chat {
      flex: 1;
      overflow-y: auto;
      padding: 0.9rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      min-height: 55vh;
    }

    .dm-msg {
      max-width: 86%;
      padding: 0.7rem 0.9rem;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .dm-msg.u {
      align-self: flex-end;
      background: #111118;
      color: var(--text);
      border: 1px solid #1c1c2c;
    }

    .dm-msg.c {
      align-self: flex-start;
      background: #0c0c16;
      color: var(--text);
      border-left: 3px solid var(--c, var(--gold));
    }

    .dm-mname {
      font-size: 0.62rem;
      letter-spacing: 0.1em;
      color: var(--c, var(--gold));
      margin-bottom: 0.25rem;
      text-transform: uppercase;
    }

    .dm-fb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.3rem;
      flex-wrap: wrap;
    }

    .dm-fbb {
      background: none;
      border: 1px solid #1e1e1e;
      color: var(--text-dim);
      padding: 0.22rem 0.5rem;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .dm-fbb:hover,
    .dm-fbb.on {
      border-color: var(--gold);
      color: var(--gold);
    }

    .dm-fbi {
      flex: 1;
      min-width: 80px;
      background: #0A0A12;
      border: 1px solid #1e1e1e;
      color: var(--text);
      font-size: 0.75rem;
      padding: 0.22rem 0.5rem;
      outline: none;
    }

    .dm-fbs {
      background: none;
      border: 1px solid var(--gold-dim);
      color: var(--gold);
      padding: 0.22rem 0.5rem;
      font-size: 0.68rem;
      cursor: pointer;
      letter-spacing: 0.08em;
    }

    .dm-typing {
      display: flex;
      gap: 3px;
      padding: 0.5rem 0.3rem;
    }

    .dm-typing span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--gold-dim);
      animation: bounce 1s infinite;
    }

    .dm-typing span:nth-child(2) {
      animation-delay: 0.15s;
    }

    .dm-typing span:nth-child(3) {
      animation-delay: 0.3s;
    }

    @keyframes bounce {
      0%,60%,100% {
        transform: translateY(0);
      }

      30% {
        transform: translateY(-6px);
      }
    }

    /* INPUT ROW */
    .dm-irow {
      display: flex;
      gap: 0.4rem;
      padding: 0.75rem 0.9rem;
      border-top: 1px solid #1a1a28;
    }

    .dm-in {
      flex: 1;
      background: #0c0c16;
      border: 1px solid #1c1c2c;
      color: var(--text);
      font-size: 0.92rem;
      padding: 0.6rem 0.85rem;
      outline: none;
      min-width: 0;
    }

    .dm-in:focus {
      border-color: var(--gold-dim);
    }

    .dm-in::placeholder {
      color: var(--text-dim);
    }

    .dm-send {
      background: var(--gold-dim);
      border: none;
      color: var(--bg);
      padding: 0 1.1rem;
      font-family: 'Cinzel', serif;
      font-size: 0.72rem;
      letter-spacing: 0.1em;
      cursor: pointer;
      transition: background 0.2s;
    }

    .dm-send:hover {
      background: var(--gold);
    }

    /* DECIDE */
    .dm-decide {
      flex: 1;
      overflow-y: auto;
      padding: 0.9rem;
    }

    .dm-dq {
      font-family: 'Cinzel', serif;
      font-size: 0.95rem;
      color: var(--gold);
      text-align: center;
      margin-bottom: 1.1rem;
      line-height: 1.5;
    }

    .dm-paths {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }

    .dm-path {
      background: var(--bg-card2);
      border: 1px solid #1c1c2c;
      border-left: 3px solid var(--gold-dim);
      padding: 0.85rem 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .dm-path:hover {
      border-left-color: var(--gold);
      background: #111118;
    }

    .dm-pl {
      font-size: 0.62rem;
      color: var(--gold-dim);
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 0.25rem;
    }

    .dm-pt {
      font-size: 0.88rem;
      color: var(--text);
      line-height: 1.4;
    }

    .dm-outs {
      margin-top: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .dm-out {
      background: #0A0A12;
      border: 1px solid #181828;
      padding: 0.55rem 0.75rem;
      font-size: 0.78rem;
      color: var(--text-dim);
      line-height: 1.4;
    }

    .dm-ol {
      font-size: 0.58rem;
      letter-spacing: 0.1em;
      color: var(--gold-dim);
      margin-bottom: 0.18rem;
    }

    .dm-new {
      margin-top: 0.9rem;
      width: 100%;
      padding: 0.55rem;
      background: none;
      border: 1px solid #1e1e1e;
      color: var(--text-dim);
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      cursor: pointer;
    }

    .dm-new:hover {
      border-color: var(--gold-dim);
      color: var(--gold);
    }

    /* GROW */
    .dm-grow {
      flex: 1;
      overflow-y: auto;
      padding: 0.9rem;
    }

    .dm-gh {
      font-family: 'Cinzel', serif;
      font-size: 0.78rem;
      color: var(--gold);
      letter-spacing: 0.18em;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
    }

    .dm-goal {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.65rem;
      background: var(--bg-card2);
      border: 1px solid #1a1a28;
      margin-bottom: 0.45rem;
      cursor: pointer;
    }

    .dm-chk {
      width: 17px;
      height: 17px;
      border-radius: 50%;
      border: 2px solid var(--gold-dim);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      flex-shrink: 0;
      transition: all 0.2s;
    }

    .dm-chk.done {
      background: var(--gold-dim);
      border-color: var(--gold);
    }

    .dm-gt {
      font-size: 0.85rem;
      color: var(--text);
    }

    .dm-gt.done {
      text-decoration: line-through;
      color: var(--text-dim);
    }

    .dm-prog {
      background: var(--bg-card2);
      border: 1px solid #1a1a28;
      padding: 0.9rem;
      margin-top: 1rem;
    }

    .dm-prow {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.75rem;
    }

    .dm-pbar {
      height: 5px;
      background: #1a1a28;
      border-radius: 3px;
      overflow: hidden;
    }

    .dm-pfill {
      height: 100%;
      background: var(--gold);
      transition: width 0.4s ease;
    }

    /* NOTIF */
    .dm-notif {
      position: fixed;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      background: var(--bg-card);
      border: 1px solid var(--gold-dim);
      border-top: none;
      padding: 0.55rem 1.1rem;
      z-index: 8000;
      font-size: 0.78rem;
      color: var(--gold);
      letter-spacing: 0.07em;
      max-width: 440px;
      width: 92%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 20px rgba(201,168,76,0.12);
      animation: slideD 0.4s ease;
    }

    @keyframes slideD {
      from {
        transform: translateX(-50%) translateY(-100%);
      }

      to {
        transform: translateX(-50%) translateY(0);
      }
    }

    .dm-nx {
      background: none;
      border: none;
      color: var(--text-dim);
      cursor: pointer;
      font-size: 1rem;
      margin-left: 0.7rem;
    }
  `;

  const s = document.createElement("style");
  s.id = "dm-styles";
  s.textContent = css;
  document.head.appendChild(s);
};

const COMPANIONS = {
  Solar: {
    emoji: "☀️",
    color: "#FFD700",
    bg: "#1A1600",
    title: "The Collective",
    role: "Master Guide",
    voice:
      "Solar channels all frequencies. Every path you walk shapes the quantum field around you. What will you do with today?",
    decide:
      "Multiple realities exist simultaneously. Here are the paths the quantum field reveals:",
  },
  Sofia: {
    emoji: "🌸",
    color: "#FF8FAB",
    bg: "#1A0810",
    title: "The Compassionate",
    role: "Heart Guide",
    voice:
      "You are seen, you are heard. Every step forward, no matter how small, is still a step. What is on your heart today?",
    decide: "Every choice carries emotional weight. Let's feel into these paths:",
  },
  Stewart: {
    emoji: "⚡",
    color: "#60C0FF",
    bg: "#08101A",
    title: "The Logical",
    role: "Reason Guide",
    voice:
      "Data. Systems. Structure. Let's break this down into what actually makes sense. What problem are we solving?",
    decide: "Analyzing variables across each decision path:",
  },
  Drax: {
    emoji: "🪨",
    color: "#A0E0A0",
    bg: "#081208",
    title: "The Realist",
    role: "Ground Guide",
    voice:
      "Real talk — no sugarcoating. What's actually happening and what are you actually willing to do about it?",
    decide: "Here's what's real about each option:",
  },
  Aries: {
    emoji: "🔥",
    color: "#FF6B35",
    bg: "#1A0800",
    title: "The Fearless",
    role: "Action Guide",
    voice:
      "Fear is a liar. The version of you that chose boldly — that's the one you're proud of. What are you waiting on?",
    decide: "Bold moves and their ripple effects:",
  },
  Mary: {
    emoji: "🌙",
    color: "#C89FFF",
    bg: "#100818",
    title: "The Intuitive",
    role: "Wisdom Guide",
    voice:
      "Close your eyes. Your gut already knows the answer. Which path makes your chest feel lighter?",
    decide: "Your intuition speaks through these paths:",
  },
};

const PATHS = [
  {
    label: "Path Alpha",
    text: "Take immediate, decisive action — commit fully and burn the ships.",
    outcomes: [
      { label: "Best case", text: "You break through. Momentum compounds fast." },
      { label: "Likely", text: "Rough start, real progress within 2–3 weeks." },
      { label: "Challenge", text: "Exhaustion if you move without support." },
    ],
  },
  {
    label: "Path Beta",
    text: "Gather more information first — research, plan, build confidence before moving.",
    outcomes: [
      { label: "Best case", text: "You move with clarity, fewer costly mistakes." },
      { label: "Likely", text: "Delayed start, but stronger foundation." },
      { label: "Challenge", text: "Over-planning becomes avoidance." },
    ],
  },
  {
    label: "Path Gamma",
    text: "Test a smaller version — validate with minimal risk before going all in.",
    outcomes: [
      { label: "Best case", text: "Real data fast. Pivot before wasting resources." },
      { label: "Likely", text: "You learn what you needed within days." },
      { label: "Challenge", text: "Small bets can feel safe but never scale." },
    ],
  },
  {
    label: "Path Delta",
    text: "Collaborate — bring someone in to share the load, knowledge, or execution.",
    outcomes: [
      { label: "Best case", text: "Two minds unlock what neither reaches alone." },
      { label: "Likely", text: "Speed increases. So does complexity." },
      { label: "Challenge", text: "Alignment required. Trust is a currency." },
    ],
  },
];

const KEY = "DMTHRONE25";

export default function App() {
  useEffect(() => {
    injectStyles();
  }, []);

  const [splash, setSplash] = useState(true);
  const [splashOut, setSplashOut] = useState(false);

  const [splashImgErr, setSplashImgErr] = useState(false);
  const [headerImgErr, setHeaderImgErr] = useState(false);
  const [logoReady, setLogoReady] = useState(false);

  const taps = useRef(0);
  const tapT = useRef(null);

  const [showKey, setShowKey] = useState(false);
  const [showDash, setShowDash] = useState(false);
  const [keyVal, setKeyVal] = useState("");
  const [keyErr, setKeyErr] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [tier, setTier] = useState("free");

  const [comp, setComp] = useState("Solar");
  const [tab, setTab] = useState("talk");
  const [msgs, setMsgs] = useState([]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const [fb, setFb] = useState({});
  const [fbc, setFbc] = useState({});

  const [goals, setGoals] = useState([
    { id: 1, text: "Set your intention for today", done: false },
    { id: 2, text: "Complete your most important task", done: false },
    { id: 3, text: "Reflect before you sleep", done: false },
  ]);

  const [ng, setNg] = useState("");
  const [dq, setDq] = useState("");
  const [paths, setPaths] = useState(null);
  const [exp, setExp] = useState(null);
  const [notif, setNotif] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = LOGO_SRC;

    img.onload = () => {
      console.log("Logo loaded:", LOGO_SRC);
      setLogoReady(true);
    };

    img.onerror = () => {
      console.error("Logo failed to load:", LOGO_SRC);
      setSplashImgErr(true);
      setHeaderImgErr(true);
    };
  }, []);

  useEffect(() => {
    const h = new Date().getHours();

    if (h >= 6 && h < 10) {
      setNotif("🌅 Good morning. What does today need from you?");
    } else if (h >= 12 && h < 14) {
      setNotif("⚡ Midday check-in — are you on track?");
    } else if (h >= 17 && h < 20) {
      setNotif("🔔 Closing bell. What did you accomplish today?");
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const handleTap = () => {
    taps.current += 1;
    clearTimeout(tapT.current);

    if (taps.current >= 5) {
      taps.current = 0;
      setShowKey(true);
    } else {
      tapT.current = setTimeout(() => {
        taps.current = 0;
      }, 1500);
    }
  };

  const enter = () => {
    setSplashOut(true);

    setTimeout(() => {
      setSplash(false);
    }, 800);

    setMsgs([
      {
        id: 1,
        from: "c",
        text: COMPANIONS[comp].voice,
        who: comp,
      },
    ]);
  };

  const authAdmin = () => {
    if (keyVal.trim().toUpperCase() === KEY) {
      setIsAdmin(true);
      setShowKey(false);
      setKeyVal("");
      setKeyErr("");

      if (!splash) {
        setShowDash(true);
      }
    } else {
      setKeyErr("Invalid key. Access denied.");
    }
  };

  const send = async () => {
    if (!inp.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      from: "u",
      text: inp.trim(),
    };

    setMsgs((prev) => [...prev, userMsg]);
    setInp("");
    setLoading(true);

    const C = COMPANIONS[comp];

    try {
      /*
        IMPORTANT:
        This direct Anthropic call usually will NOT work from the browser in production
        unless you have a backend/proxy. The logo fix is separate from this.
      */
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are ${comp}, ${C.title} (${C.role}) in the Day Masters app — a mobile AI compass built on quantum parallel paths decision-making. ${C.voice} Keep responses to 2–4 sentences. Stay in character. Do not mention being an AI.`,
          messages: [
            ...msgs.slice(-12).map((m) => ({
              role: m.from === "u" ? "user" : "assistant",
              content: m.text,
            })),
            {
              role: "user",
              content: userMsg.text,
            },
          ],
        }),
      });

      const data = await res.json();

      setMsgs((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "c",
          text: data.content?.[0]?.text || "Lost signal. Try again.",
          who: comp,
        },
      ]);
    } catch (err) {
      console.error("Message send failed:", err);

      setMsgs((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "c",
          text: "Lost signal. Try again.",
          who: comp,
        },
      ]);
    }

    setLoading(false);
  };

  const switchComp = (name) => {
    setComp(name);

    if (tab === "talk") {
      setMsgs((prev) => [
        ...prev,
        {
          id: Date.now(),
          from: "c",
          text: COMPANIONS[name].voice,
          who: name,
        },
      ]);
    }
  };

  const addGoal = () => {
    if (!ng.trim()) return;

    setGoals((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: ng.trim(),
        done: false,
      },
    ]);

    setNg("");
  };

  const startDecision = () => {
    if (!dq.trim()) return;
    setPaths(PATHS);
    setExp(null);
  };

  const C = COMPANIONS[comp];
  const done = goals.filter((g) => g.done).length;

  return (
    <>
      {notif && (
        <div className="dm-notif">
          <span>{notif}</span>
          <button className="dm-nx" onClick={() => setNotif(null)}>
            ×
          </button>
        </div>
      )}

      {/* SPLASH */}
      {splash && (
        <div className={`dm-splash${splashOut ? " out" : ""}`}>
          {!splashImgErr ? (
            <div className="dm-logo-wrap" onClick={handleTap}>
              <img
                src={LOGO_SRC}
                alt="Day Masters"
                className="dm-logo"
                onLoad={() => setLogoReady(true)}
                onError={() => setSplashImgErr(true)}
                style={{
                  display: "block",
                  opacity: logoReady ? 1 : 0.35,
                  visibility: "visible",
                  position: "relative",
                  zIndex: 10001,
                }}
              />
            </div>
          ) : (
            <div className="dm-logo-fallback" onClick={handleTap}>
              ☀️
            </div>
          )}

          <div className="dm-title">DAY MASTERS</div>
          <div className="dm-tagline">Your quantum compass</div>

          <button className="dm-enter" onClick={enter}>
            ENTER YOUR DAY
          </button>

          <div className="dm-hint">tap logo 5× for access</div>
        </div>
      )}

      {/* ADMIN KEY */}
      {showKey && (
        <div className="dm-overlay">
          <div className="dm-admin-box">
            <div className="dm-admin-h">⬡ ADMINISTRATIVE ACCESS</div>

            <input
              className="dm-admin-in"
              type="password"
              placeholder="Enter admin key..."
              value={keyVal}
              onChange={(e) => setKeyVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && authAdmin()}
              autoFocus
            />

            <button className="dm-admin-btn" onClick={authAdmin}>
              AUTHENTICATE
            </button>

            {keyErr && <div className="dm-admin-err">{keyErr}</div>}

            <button
              className="dm-cancel"
              onClick={() => {
                setShowKey(false);
                setKeyVal("");
                setKeyErr("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ADMIN DASH */}
      {showDash && (
        <div className="dm-overlay">
          <div className="dm-dash">
            <h2>⬡ ADMIN DASHBOARD</h2>

            <div
              style={{
                fontSize: "0.65rem",
                color: "var(--text-dim)",
                letterSpacing: "0.1em",
                marginBottom: "0.5rem",
              }}
            >
              SIMULATE TIER
            </div>

            <div className="dm-tiers">
              {["free", "pro", "premium"].map((t) => (
                <button
                  key={t}
                  className={`dm-tier${tier === t ? " on" : ""}`}
                  onClick={() => setTier(t)}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="dm-grid">
              <div className="dm-stat">
                <div className="dm-stat-l">ACTIVE TIER</div>
                <div className="dm-stat-v">{tier.toUpperCase()}</div>
              </div>

              <div className="dm-stat">
                <div className="dm-stat-l">COMPANIONS</div>
                <div className="dm-stat-v">{tier === "free" ? "2" : "6"}</div>
              </div>

              <div className="dm-stat">
                <div className="dm-stat-l">QUANTUM PATHS</div>
                <div className="dm-stat-v">
                  {tier === "free" ? "2" : tier === "pro" ? "4" : "6"}
                </div>
              </div>

              <div className="dm-stat">
                <div className="dm-stat-l">OUTCOMES/PATH</div>
                <div className="dm-stat-v">
                  {tier === "free" ? "1" : tier === "pro" ? "3" : "5"}
                </div>
              </div>
            </div>

            <div className="dm-tier-info">
              <div className="dm-tier-info-h">TIER STRUCTURE</div>
              <div>Free: Solar + Sofia · 2 paths · 1 outcome · no memory</div>
              <div>Pro $19.99: All 6 companions · 4 paths · 3 outcomes · memory</div>
              <div>Premium $29.99: All 6 · 6 paths · 5 outcomes · evolving bonds</div>
            </div>

            <button className="dm-cancel" onClick={() => setShowDash(false)}>
              Close Dashboard
            </button>
          </div>
        </div>
      )}

      {/* MAIN APP */}
      {!splash && (
        <div className="dm-app">
          {/* Header */}
          <div className="dm-hdr">
            {!headerImgErr ? (
              <img
                src={LOGO_SRC}
                alt="DM"
                className="dm-hdr-logo"
                onLoad={() => setLogoReady(true)}
                onError={() => setHeaderImgErr(true)}
              />
            ) : (
              <span style={{ fontSize: "1.4rem" }}>☀️</span>
            )}

            <div className="dm-hdr-title">DAY MASTERS</div>

            <div className="dm-hdr-right">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}

              {isAdmin && (
                <div className="dm-admin-badge" onClick={() => setShowDash(true)}>
                  ⬡ ADMIN
                </div>
              )}
            </div>
          </div>

          {/* Companions */}
          <div className="dm-comps">
            {Object.entries(COMPANIONS).map(([name, data]) => (
              <button
                key={name}
                className={`dm-comp${comp === name ? " on" : ""}`}
                onClick={() => switchComp(name)}
              >
                <div
                  className="dm-av"
                  style={{
                    background: data.bg,
                    "--c": data.color,
                  }}
                >
                  {data.emoji}
                </div>

                <div className="dm-cn">{name}</div>
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div className="dm-tabs">
            {[
              ["talk", "💬 Talk"],
              ["decide", "⚡ Decide"],
              ["grow", "🌱 Grow"],
            ].map(([t, label]) => (
              <button
                key={t}
                className={`dm-tab${tab === t ? " on" : ""}`}
                onClick={() => setTab(t)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* TALK */}
          {tab === "talk" && (
            <>
              <div className="dm-chat">
                {msgs.map((m) => {
                  const MC = m.who ? COMPANIONS[m.who] : null;

                  return (
                    <div key={m.id}>
                      <div
                        className={`dm-msg ${m.from === "u" ? "u" : "c"}`}
                        style={MC ? { "--c": MC.color } : {}}
                      >
                        {m.from === "c" && (
                          <div className="dm-mname">
                            {m.who} · {MC?.role}
                          </div>
                        )}

                        {m.text}
                      </div>

                      {m.from === "c" && (
                        <div className="dm-fb">
                          <button
                            className={`dm-fbb${fb[m.id] === "up" ? " on" : ""}`}
                            onClick={() =>
                              setFb((prev) => ({
                                ...prev,
                                [m.id]: prev[m.id] === "up" ? null : "up",
                              }))
                            }
                          >
                            👍
                          </button>

                          <button
                            className={`dm-fbb${fb[m.id] === "down" ? " on" : ""}`}
                            onClick={() =>
                              setFb((prev) => ({
                                ...prev,
                                [m.id]: prev[m.id] === "down" ? null : "down",
                              }))
                            }
                          >
                            👎
                          </button>

                          {fb[m.id] === "down" && (
                            <>
                              <input
                                className="dm-fbi"
                                placeholder="What missed?"
                                value={fbc[m.id] || ""}
                                onChange={(e) =>
                                  setFbc((prev) => ({
                                    ...prev,
                                    [m.id]: e.target.value,
                                  }))
                                }
                              />

                              <button className="dm-fbs">Send</button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {loading && (
                  <div className="dm-msg c" style={{ "--c": C.color }}>
                    <div className="dm-mname">
                      {comp} · {C.role}
                    </div>

                    <div className="dm-typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                )}

                <div ref={endRef} />
              </div>

              <div className="dm-irow">
                <input
                  className="dm-in"
                  placeholder={`Talk to ${comp}...`}
                  value={inp}
                  onChange={(e) => setInp(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                />

                <button className="dm-send" onClick={send}>
                  SEND
                </button>
              </div>
            </>
          )}

          {/* DECIDE */}
          {tab === "decide" && (
            <div className="dm-decide">
              {!paths ? (
                <>
                  <div className="dm-dq">What decision are you facing?</div>

                  <div
                    className="dm-irow"
                    style={{
                      padding: 0,
                      marginBottom: "1rem",
                    }}
                  >
                    <input
                      className="dm-in"
                      placeholder="Describe your decision..."
                      value={dq}
                      onChange={(e) => setDq(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && startDecision()}
                    />

                    <button className="dm-send" onClick={startDecision}>
                      GO
                    </button>
                  </div>

                  <div
                    style={{
                      fontSize: "0.76rem",
                      color: "var(--text-dim)",
                      textAlign: "center",
                      lineHeight: "1.6",
                    }}
                  >
                    {C.decide}
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.72rem",
                      color: "var(--gold-dim)",
                      textAlign: "center",
                      marginBottom: "0.3rem",
                      letterSpacing: "0.12em",
                    }}
                  >
                    DECISION
                  </div>

                  <div
                    style={{
                      fontSize: "0.86rem",
                      color: "var(--text)",
                      textAlign: "center",
                      marginBottom: "0.5rem",
                      lineHeight: "1.5",
                    }}
                  >
                    "{dq}"
                  </div>

                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-dim)",
                      textAlign: "center",
                      marginBottom: "0.9rem",
                    }}
                  >
                    {C.decide}
                  </div>

                  <div className="dm-paths">
                    {paths.map((p, i) => (
                      <div
                        key={p.label}
                        className="dm-path"
                        onClick={() => setExp(exp === i ? null : i)}
                      >
                        <div className="dm-pl">
                          {p.label} {exp === i ? "▲" : "▼"}
                        </div>

                        <div className="dm-pt">{p.text}</div>

                        {exp === i && (
                          <div className="dm-outs">
                            {p.outcomes.map((o) => (
                              <div key={o.label} className="dm-out">
                                <div className="dm-ol">{o.label}</div>
                                {o.text}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    className="dm-new"
                    onClick={() => {
                      setPaths(null);
                      setDq("");
                      setExp(null);
                    }}
                  >
                    NEW DECISION
                  </button>
                </>
              )}
            </div>
          )}

          {/* GROW */}
          {tab === "grow" && (
            <div className="dm-grow">
              <div className="dm-gh">Today's Goals</div>

              {goals.map((g) => (
                <div
                  key={g.id}
                  className="dm-goal"
                  onClick={() =>
                    setGoals((prev) =>
                      prev.map((x) =>
                        x.id === g.id ? { ...x, done: !x.done } : x
                      )
                    )
                  }
                >
                  <div className={`dm-chk${g.done ? " done" : ""}`}>
                    {g.done ? "✓" : ""}
                  </div>

                  <div className={`dm-gt${g.done ? " done" : ""}`}>
                    {g.text}
                  </div>
                </div>
              ))}

              <div
                className="dm-irow"
                style={{
                  padding: "0.5rem 0 0 0",
                }}
              >
                <input
                  className="dm-in"
                  placeholder="Add a goal..."
                  value={ng}
                  onChange={(e) => setNg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addGoal();
                  }}
                />

                <button className="dm-send" onClick={addGoal}>
                  ADD
                </button>
              </div>

              <div className="dm-prog" style={{ marginTop: "1.2rem" }}>
                <div className="dm-prow">
                  <span
                    style={{
                      color: "var(--text-dim)",
                      fontSize: "0.75rem",
                    }}
                  >
                    Goals complete
                  </span>

                  <span
                    style={{
                      color: "var(--gold)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {done} / {goals.length}
                  </span>
                </div>

                <div className="dm-pbar">
                  <div
                    className="dm-pfill"
                    style={{
                      width: `${goals.length ? (done / goals.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
