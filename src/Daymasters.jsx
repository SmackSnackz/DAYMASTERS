import { useState, useEffect, useRef } from "react";

// ─── STYLES ───────────────────────────────────────────────────────────────────
const injectStyles = () => {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=Rajdhani:wght@300;400;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --gold: #C9A84C;
      --gold-light: #F0D080;
      --gold-dim: #7A6130;
      --bg-dark: #050508;
      --bg-card: #0D0D14;
      --bg-card2: #12121C;
      --text: #E8E0D0;
      --text-dim: #888070;
      --solar: #FFD700;
      --sofia: #FF8FAB;
      --stewart: #60C0FF;
      --drax: #A0E0A0;
      --aries: #FF6B35;
      --mary: #C89FFF;
    }

    body { background: var(--bg-dark); font-family: 'Rajdhani', sans-serif; }

    /* ── SPLASH ── */
    .dm-splash {
      position: fixed; inset: 0; background: var(--bg-dark);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      z-index: 9999; transition: opacity 0.8s ease;
    }
    .dm-splash.fade-out { opacity: 0; pointer-events: none; }

    .dm-logo-wrap {
      display: flex; flex-direction: column; align-items: center;
      cursor: pointer; user-select: none;
    }
    .dm-logo {
      width: 160px; height: 160px; object-fit: contain;
      filter: drop-shadow(0 0 18px var(--gold)) drop-shadow(0 0 40px var(--gold-dim));
      animation: logoPulse 3s ease-in-out infinite;
      transition: transform 0.1s ease;
    }
    .dm-logo:active { transform: scale(0.93); }
    .dm-logo-tap-flash {
      animation: tapFlash 0.15s ease !important;
    }
    @keyframes logoPulse {
      0%, 100% { filter: drop-shadow(0 0 18px var(--gold)) drop-shadow(0 0 40px var(--gold-dim)); }
      50% { filter: drop-shadow(0 0 28px var(--gold-light)) drop-shadow(0 0 60px var(--gold)); }
    }
    @keyframes tapFlash {
      0% { transform: scale(1); }
      50% { transform: scale(0.88); }
      100% { transform: scale(1); }
    }

    .dm-title {
      font-family: 'Cinzel', serif;
      font-size: 2.2rem; font-weight: 900;
      color: var(--gold);
      letter-spacing: 0.3em;
      margin-top: 1.2rem;
      text-shadow: 0 0 20px var(--gold-dim);
    }
    .dm-tagline {
      font-size: 0.85rem; color: var(--text-dim);
      letter-spacing: 0.18em; margin-top: 0.4rem;
      text-transform: uppercase;
    }
    .dm-enter-btn {
      margin-top: 2.5rem;
      padding: 0.75rem 2.5rem;
      background: transparent;
      border: 1px solid var(--gold-dim);
      color: var(--gold);
      font-family: 'Cinzel', serif;
      font-size: 0.85rem; letter-spacing: 0.25em;
      cursor: pointer; border-radius: 2px;
      transition: all 0.3s ease;
    }
    .dm-enter-btn:hover {
      background: var(--gold-dim);
      color: var(--bg-dark);
      box-shadow: 0 0 20px var(--gold-dim);
    }
    .dm-tap-hint {
      margin-top: 0.6rem; font-size: 0.7rem;
      color: #222; letter-spacing: 0.12em;
    }

    /* ── ADMIN PANEL ── */
    .dm-admin-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.92);
      display: flex; align-items: center; justify-content: center;
      z-index: 99999;
    }
    .dm-admin-box {
      background: var(--bg-card);
      border: 1px solid var(--gold-dim);
      border-radius: 4px;
      padding: 2rem; width: 90%; max-width: 380px;
      box-shadow: 0 0 40px rgba(201,168,76,0.15);
    }
    .dm-admin-title {
      font-family: 'Cinzel', serif;
      color: var(--gold); font-size: 1rem;
      letter-spacing: 0.2em; margin-bottom: 1.2rem;
      text-align: center;
    }
    .dm-admin-input {
      width: 100%; padding: 0.7rem 1rem;
      background: #0A0A12; border: 1px solid var(--gold-dim);
      color: var(--gold); font-family: 'Rajdhani', sans-serif;
      font-size: 1rem; letter-spacing: 0.15em;
      border-radius: 2px; outline: none;
      margin-bottom: 1rem;
    }
    .dm-admin-input::placeholder { color: #444; }
    .dm-admin-input:focus { border-color: var(--gold); }
    .dm-admin-btn {
      width: 100%; padding: 0.7rem;
      background: var(--gold-dim); border: none;
      color: var(--bg-dark); font-family: 'Cinzel', serif;
      font-size: 0.85rem; letter-spacing: 0.15em;
      cursor: pointer; border-radius: 2px;
      transition: background 0.2s;
    }
    .dm-admin-btn:hover { background: var(--gold); }
    .dm-admin-err { color: #FF6060; font-size: 0.78rem; text-align: center; margin-top: 0.5rem; }
    .dm-admin-close {
      margin-top: 1rem; width: 100%; padding: 0.5rem;
      background: transparent; border: 1px solid #333;
      color: var(--text-dim); font-size: 0.78rem;
      cursor: pointer; border-radius: 2px;
      letter-spacing: 0.1em;
    }

    /* ── ADMIN DASHBOARD ── */
    .dm-admin-dash {
      background: var(--bg-card);
      border: 1px solid var(--gold-dim);
      border-radius: 4px;
      padding: 1.5rem; width: 94%; max-width: 500px;
      max-height: 85vh; overflow-y: auto;
      box-shadow: 0 0 40px rgba(201,168,76,0.15);
    }
    .dm-admin-dash h2 {
      font-family: 'Cinzel', serif; color: var(--gold);
      font-size: 1rem; letter-spacing: 0.2em;
      margin-bottom: 1.2rem; text-align: center;
    }
    .dm-tier-btns { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .dm-tier-btn {
      flex: 1; padding: 0.6rem 0.5rem;
      background: #0A0A12; border: 1px solid var(--gold-dim);
      color: var(--text-dim); font-size: 0.78rem;
      letter-spacing: 0.08em; cursor: pointer; border-radius: 2px;
      transition: all 0.2s;
    }
    .dm-tier-btn.active { background: var(--gold-dim); color: var(--bg-dark); border-color: var(--gold); }
    .dm-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 1rem; }
    .dm-stat {
      background: #0A0A12; border: 1px solid #1A1A28;
      padding: 0.8rem; border-radius: 2px;
    }
    .dm-stat-label { font-size: 0.7rem; color: var(--text-dim); letter-spacing: 0.1em; }
    .dm-stat-val { font-size: 1.4rem; color: var(--gold); font-weight: 700; margin-top: 0.2rem; }

    /* ── MAIN APP ── */
    .dm-app {
      min-height: 100vh; background: var(--bg-dark);
      display: flex; flex-direction: column;
      max-width: 480px; margin: 0 auto;
    }

    /* ── HEADER ── */
    .dm-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 1.2rem;
      border-bottom: 1px solid #1A1A28;
    }
    .dm-header-logo { width: 36px; height: 36px; object-fit: contain; }
    .dm-header-title {
      font-family: 'Cinzel', serif; font-size: 1rem;
      color: var(--gold); letter-spacing: 0.2em;
    }
    .dm-day-badge {
      font-size: 0.7rem; color: var(--text-dim);
      letter-spacing: 0.1em; text-align: right;
    }

    /* ── COMPANION SELECTOR ── */
    .dm-companions {
      display: flex; gap: 0.5rem;
      padding: 0.8rem 1rem; overflow-x: auto;
      border-bottom: 1px solid #1A1A28;
      scrollbar-width: none;
    }
    .dm-companions::-webkit-scrollbar { display: none; }
    .dm-companion-btn {
      display: flex; flex-direction: column; align-items: center;
      gap: 0.3rem; min-width: 58px;
      cursor: pointer; border: none; background: none;
      padding: 0.4rem;
    }
    .dm-companion-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem; border: 2px solid transparent;
      transition: all 0.25s ease;
    }
    .dm-companion-btn.active .dm-companion-avatar {
      border-color: var(--gold);
      box-shadow: 0 0 12px var(--companion-color, var(--gold));
    }
    .dm-companion-name {
      font-size: 0.62rem; letter-spacing: 0.08em;
      color: var(--text-dim); text-transform: uppercase;
    }
    .dm-companion-btn.active .dm-companion-name { color: var(--gold); }

    /* ── TABS ── */
    .dm-tabs {
      display: flex; border-bottom: 1px solid #1A1A28;
    }
    .dm-tab {
      flex: 1; padding: 0.8rem;
      background: none; border: none;
      color: var(--text-dim); font-family: 'Rajdhani', sans-serif;
      font-size: 0.82rem; letter-spacing: 0.15em;
      text-transform: uppercase; cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }
    .dm-tab.active {
      color: var(--gold);
      border-bottom-color: var(--gold);
    }

    /* ── CHAT ── */
    .dm-chat-area {
      flex: 1; overflow-y: auto; padding: 1rem;
      display: flex; flex-direction: column; gap: 0.8rem;
      min-height: 60vh;
    }
    .dm-msg {
      max-width: 85%; padding: 0.75rem 1rem;
      border-radius: 2px; font-size: 0.92rem; line-height: 1.5;
    }
    .dm-msg.user {
      align-self: flex-end;
      background: #12121C; color: var(--text);
      border: 1px solid #1E1E30;
    }
    .dm-msg.companion {
      align-self: flex-start;
      background: #0D0D18;
      color: var(--text);
      border-left: 3px solid var(--companion-color, var(--gold));
    }
    .dm-msg-name {
      font-size: 0.65rem; letter-spacing: 0.1em;
      color: var(--companion-color, var(--gold));
      margin-bottom: 0.3rem; text-transform: uppercase;
    }

    /* ── FEEDBACK ── */
    .dm-feedback {
      display: flex; align-items: center; gap: 0.6rem;
      margin-top: 0.4rem; flex-wrap: wrap;
    }
    .dm-fb-btn {
      background: none; border: 1px solid #222;
      color: var(--text-dim); padding: 0.25rem 0.55rem;
      font-size: 0.82rem; cursor: pointer; border-radius: 2px;
      transition: all 0.2s;
    }
    .dm-fb-btn:hover { border-color: var(--gold-dim); color: var(--gold); }
    .dm-fb-btn.selected { border-color: var(--gold); color: var(--gold); }
    .dm-fb-input {
      flex: 1; min-width: 100px; background: #0A0A12; border: 1px solid #222;
      color: var(--text); font-size: 0.78rem; padding: 0.25rem 0.6rem;
      border-radius: 2px; outline: none; font-family: 'Rajdhani', sans-serif;
    }
    .dm-fb-input:focus { border-color: var(--gold-dim); }
    .dm-fb-send {
      background: none; border: 1px solid var(--gold-dim);
      color: var(--gold); padding: 0.25rem 0.6rem;
      font-size: 0.72rem; cursor: pointer; border-radius: 2px;
      letter-spacing: 0.1em;
    }

    /* ── INPUT ── */
    .dm-input-row {
      display: flex; gap: 0.5rem;
      padding: 0.8rem 1rem;
      border-top: 1px solid #1A1A28;
    }
    .dm-input {
      flex: 1; background: #0D0D18;
      border: 1px solid #1E1E30; color: var(--text);
      font-family: 'Rajdhani', sans-serif; font-size: 0.95rem;
      padding: 0.65rem 0.9rem; border-radius: 2px; outline: none;
    }
    .dm-input:focus { border-color: var(--gold-dim); }
    .dm-input::placeholder { color: var(--text-dim); }
    .dm-send-btn {
      background: var(--gold-dim); border: none;
      color: var(--bg-dark); padding: 0 1.2rem;
      font-family: 'Cinzel', serif; font-size: 0.78rem;
      letter-spacing: 0.1em; cursor: pointer; border-radius: 2px;
      transition: background 0.2s;
    }
    .dm-send-btn:hover { background: var(--gold); }

    /* ── DECIDE ── */
    .dm-decide-area { flex: 1; overflow-y: auto; padding: 1rem; }
    .dm-decide-question {
      font-family: 'Cinzel', serif; font-size: 1rem;
      color: var(--gold); text-align: center;
      margin-bottom: 1.2rem; line-height: 1.5;
    }
    .dm-paths { display: flex; flex-direction: column; gap: 0.6rem; }
    .dm-path {
      background: var(--bg-card2);
      border: 1px solid #1E1E30;
      border-left: 3px solid var(--gold-dim);
      padding: 0.9rem 1rem; border-radius: 2px;
      cursor: pointer; transition: all 0.2s;
    }
    .dm-path:hover {
      border-left-color: var(--gold);
      background: #14141E;
    }
    .dm-path-label {
      font-size: 0.65rem; color: var(--gold-dim);
      letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.3rem;
    }
    .dm-path-text { font-size: 0.92rem; color: var(--text); line-height: 1.4; }
    .dm-path-outcomes {
      margin-top: 0.8rem; display: flex; flex-direction: column; gap: 0.4rem;
    }
    .dm-outcome {
      background: #0A0A12; border: 1px solid #1A1A26;
      padding: 0.6rem 0.8rem; border-radius: 2px; font-size: 0.82rem;
      color: var(--text-dim); line-height: 1.4;
    }
    .dm-outcome-label {
      font-size: 0.6rem; letter-spacing: 0.1em;
      color: var(--gold-dim); margin-bottom: 0.2rem;
    }

    /* ── GROW ── */
    .dm-grow-area { flex: 1; overflow-y: auto; padding: 1rem; }
    .dm-grow-section { margin-bottom: 1.4rem; }
    .dm-grow-heading {
      font-family: 'Cinzel', serif; font-size: 0.82rem;
      color: var(--gold); letter-spacing: 0.2em;
      margin-bottom: 0.8rem; text-transform: uppercase;
    }
    .dm-goal-item {
      display: flex; align-items: center; gap: 0.7rem;
      padding: 0.7rem; background: var(--bg-card2);
      border: 1px solid #1A1A28; border-radius: 2px;
      margin-bottom: 0.5rem; cursor: pointer;
    }
    .dm-goal-check {
      width: 18px; height: 18px; border-radius: 50%;
      border: 2px solid var(--gold-dim);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.7rem; flex-shrink: 0; transition: all 0.2s;
    }
    .dm-goal-check.done { background: var(--gold-dim); border-color: var(--gold); }
    .dm-goal-text { font-size: 0.88rem; color: var(--text); }
    .dm-goal-text.done { text-decoration: line-through; color: var(--text-dim); }

    /* ── NOTIF BANNER ── */
    .dm-notif-banner {
      position: fixed; top: 0; left: 50%; transform: translateX(-50%);
      background: var(--bg-card); border: 1px solid var(--gold-dim);
      border-top: none; border-radius: 0 0 4px 4px;
      padding: 0.6rem 1.2rem; z-index: 8000;
      font-size: 0.82rem; color: var(--gold); letter-spacing: 0.08em;
      box-shadow: 0 4px 20px rgba(201,168,76,0.15);
      animation: slideDown 0.4s ease;
      max-width: 440px; width: 92%;
      display: flex; align-items: center; justify-content: space-between;
    }
    @keyframes slideDown {
      from { transform: translateX(-50%) translateY(-100%); }
      to { transform: translateX(-50%) translateY(0); }
    }
    .dm-notif-close {
      background: none; border: none; color: var(--text-dim);
      cursor: pointer; font-size: 1rem; margin-left: 0.8rem;
    }

    /* ── TYPING ── */
    .dm-typing {
      display: flex; gap: 4px; padding: 0.6rem 0.4rem;
    }
    .dm-typing span {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--gold-dim);
      animation: typingBounce 1s infinite;
    }
    .dm-typing span:nth-child(2) { animation-delay: 0.15s; }
    .dm-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }
  `;
  if (!document.getElementById("dm-styles")) {
    const style = document.createElement("style");
    style.id = "dm-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }
};

// ─── COMPANIONS ───────────────────────────────────────────────────────────────
const COMPANIONS = {
  Solar: {
    emoji: "☀️",
    color: "#FFD700",
    bg: "#1A1600",
    title: "The Collective",
    role: "Master Guide",
    voice: "Solar channels all frequencies. Every path you walk shapes the quantum field around you. What will you do with today?",
    decideIntro: "Multiple realities exist simultaneously. Here are the paths the quantum field reveals:",
  },
  Sofia: {
    emoji: "🌸",
    color: "#FF8FAB",
    bg: "#1A0810",
    title: "The Compassionate",
    role: "Heart Guide",
    voice: "You are seen, you are heard. Every step forward, no matter how small, is still a step. What is on your heart today?",
    decideIntro: "Every choice carries an emotional weight. Let's feel into these paths:",
  },
  Stewart: {
    emoji: "⚡",
    color: "#60C0FF",
    bg: "#08101A",
    title: "The Logical",
    role: "Reason Guide",
    voice: "Data. Systems. Structure. Let's break this down into what actually makes sense. What problem are we solving?",
    decideIntro: "Analyzing variables across each decision path:",
  },
  Drax: {
    emoji: "🪨",
    color: "#A0E0A0",
    bg: "#081208",
    title: "The Realist",
    role: "Ground Guide",
    voice: "Real talk — no sugarcoating. What's actually happening and what are you actually willing to do about it?",
    decideIntro: "Here's what's real about each option:",
  },
  Aries: {
    emoji: "🔥",
    color: "#FF6B35",
    bg: "#1A0800",
    title: "The Fearless",
    role: "Action Guide",
    voice: "Fear is a liar. The version of you that chose boldly — that's the one you're proud of. What are you waiting on?",
    decideIntro: "Bold moves and their ripple effects:",
  },
  Mary: {
    emoji: "🌙",
    color: "#C89FFF",
    bg: "#100818",
    title: "The Intuitive",
    role: "Wisdom Guide",
    voice: "Close your eyes for a moment. Your gut already knows the answer. Which path makes your chest feel lighter?",
    decideIntro: "Your intuition speaks through these paths:",
  },
};

const PATHS_TEMPLATE = [
  {
    label: "Path Alpha",
    text: "Take immediate, decisive action — commit fully and burn the ships.",
    outcomes: [
      { label: "Best case", text: "You break through the wall. Momentum compounds fast." },
      { label: "Likely", text: "Rough start, real progress within 2–3 weeks." },
      { label: "Challenge", text: "Exhaustion if you move without support." },
    ],
  },
  {
    label: "Path Beta",
    text: "Gather more information first — research, plan, and build confidence before moving.",
    outcomes: [
      { label: "Best case", text: "You move with clarity and make fewer costly mistakes." },
      { label: "Likely", text: "Delayed start, but stronger foundation." },
      { label: "Challenge", text: "Over-planning becomes a form of avoidance." },
    ],
  },
  {
    label: "Path Gamma",
    text: "Test a smaller version — validate with minimal risk before going all in.",
    outcomes: [
      { label: "Best case", text: "Real data fast. Pivot before wasting big resources." },
      { label: "Likely", text: "You learn what you needed to know within days." },
      { label: "Challenge", text: "Small bets can feel safe but never fully scale." },
    ],
  },
  {
    label: "Path Delta",
    text: "Collaborate — bring someone in to share the load, knowledge, or execution.",
    outcomes: [
      { label: "Best case", text: "Two minds unlock what neither would reach alone." },
      { label: "Likely", text: "Speed increases. So does complexity." },
      { label: "Challenge", text: "Alignment required. Trust is a currency." },
    ],
  },
];

const ADMIN_KEY = "DMTHRONE25";

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DayMasters() {
  useEffect(() => { injectStyles(); }, []);

  // Splash
  const [splashVisible, setSplashVisible] = useState(true);
  const [splashFade, setSplashFade] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef(null);
  const logoRef = useRef(null);

  // Admin
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [showAdminDash, setShowAdminDash] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [adminErr, setAdminErr] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [simTier, setSimTier] = useState("free");

  // App state
  const [activeCompanion, setActiveCompanion] = useState("Solar");
  const [activeTab, setActiveTab] = useState("talk");
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [fbComment, setFbComment] = useState({});
  const [goals, setGoals] = useState([
    { id: 1, text: "Set your intention for today", done: false },
    { id: 2, text: "Complete your most important task", done: false },
    { id: 3, text: "Reflect before you sleep", done: false },
  ]);
  const [newGoal, setNewGoal] = useState("");
  const [decideQ, setDecideQ] = useState("");
  const [paths, setPaths] = useState(null);
  const [expandedPath, setExpandedPath] = useState(null);
  const [notif, setNotif] = useState(null);
  const chatEndRef = useRef(null);

  // Notifications
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) {
      setNotif("🌅 Good morning. What does today need from you?");
    } else if (hour >= 12 && hour < 14) {
      setNotif("⚡ Midday check-in — are you on track with your Day?");
    } else if (hour >= 17 && hour < 20) {
      setNotif("🔔 Closing bell. What did you accomplish today?");
    }
  }, []);

  // Logo tap Easter egg
  const handleLogoTap = () => {
    if (logoRef.current) {
      logoRef.current.style.animation = "none";
      logoRef.current.style.transform = "scale(0.88)";
      setTimeout(() => {
        if (logoRef.current) {
          logoRef.current.style.transform = "scale(1)";
          logoRef.current.style.animation = "";
        }
      }, 150);
    }
    tapCount.current += 1;
    clearTimeout(tapTimer.current);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      setShowAdminPrompt(true);
    } else {
      tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 1500);
    }
  };

  const handleEnter = () => {
    setSplashFade(true);
    setTimeout(() => setSplashVisible(false), 800);
    const c = COMPANIONS[activeCompanion];
    setMessages([{ id: 1, from: "companion", text: c.voice, companion: activeCompanion }]);
  };

  // Admin
  const handleAdminSubmit = () => {
    if (adminInput.trim().toUpperCase() === ADMIN_KEY) {
      setIsAdmin(true);
      setShowAdminPrompt(false);
      setAdminInput("");
      setAdminErr("");
      if (!splashVisible) setShowAdminDash(true);
    } else {
      setAdminErr("Invalid key. Access denied.");
    }
  };

  // Chat
  const sendMessage = async () => {
    if (!inputVal.trim() || isLoading) return;
    const userMsg = { id: Date.now(), from: "user", text: inputVal.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsLoading(true);

    const c = COMPANIONS[activeCompanion];
    const systemPrompt = `You are ${activeCompanion}, ${c.title} (${c.role}) in the Day Masters app — a mobile AI compass built on quantum parallel paths thinking. Your personality: ${c.voice} Keep responses concise (2–4 sentences). Stay in character. Do not mention being an AI.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            ...messages.slice(-10).filter(m => m.from !== "system").map(m => ({
              role: m.from === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: userMsg.text },
          ],
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Something went quiet. Try again.";
      setMessages(prev => [...prev, { id: Date.now() + 1, from: "companion", text: reply, companion: activeCompanion }]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, from: "companion", text: "Lost the signal. Try again.", companion: activeCompanion }]);
    }
    setIsLoading(false);
  };

  const handleDecide = () => {
    if (!decideQ.trim()) return;
    setPaths(PATHS_TEMPLATE);
    setExpandedPath(null);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const switchCompanion = (name) => {
    setActiveCompanion(name);
    if (activeTab === "talk") {
      const c = COMPANIONS[name];
      setMessages(prev => [...prev, { id: Date.now(), from: "companion", text: c.voice, companion: name }]);
    }
  };

  const c = COMPANIONS[activeCompanion];

  return (
    <>
      {/* NOTIFICATION */}
      {notif && (
        <div className="dm-notif-banner">
          <span>{notif}</span>
          <button className="dm-notif-close" onClick={() => setNotif(null)}>×</button>
        </div>
      )}

      {/* SPLASH */}
      {splashVisible && (
        <div className={`dm-splash${splashFade ? " fade-out" : ""}`}>
          <div className="dm-logo-wrap" onClick={handleLogoTap}>
            <img
              ref={logoRef}
              src="/logo.png"
              alt="Day Masters"
              className="dm-logo"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.insertAdjacentHTML("afterend", '<div style="font-size:5rem;filter:drop-shadow(0 0 18px #C9A84C)">☀️</div>');
              }}
            />
          </div>
          <div className="dm-title">DAY MASTERS</div>
          <div className="dm-tagline">Your quantum compass</div>
          <button className="dm-enter-btn" onClick={handleEnter}>ENTER YOUR DAY</button>
          <div className="dm-tap-hint">tap logo 5× for access</div>
        </div>
      )}

      {/* ADMIN KEY PROMPT */}
      {showAdminPrompt && (
        <div className="dm-admin-overlay">
          <div className="dm-admin-box">
            <div className="dm-admin-title">⬡ ADMINISTRATIVE ACCESS</div>
            <input
              className="dm-admin-input"
              type="password"
              placeholder="Enter admin key..."
              value={adminInput}
              onChange={e => setAdminInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAdminSubmit()}
              autoFocus
            />
            <button className="dm-admin-btn" onClick={handleAdminSubmit}>AUTHENTICATE</button>
            {adminErr && <div className="dm-admin-err">{adminErr}</div>}
            <button className="dm-admin-close" onClick={() => { setShowAdminPrompt(false); setAdminErr(""); setAdminInput(""); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ADMIN DASHBOARD */}
      {showAdminDash && (
        <div className="dm-admin-overlay">
          <div className="dm-admin-dash">
            <h2>⬡ ADMIN DASHBOARD</h2>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>SIMULATE TIER</div>
              <div className="dm-tier-btns">
                {["free", "pro", "premium"].map(t => (
                  <button key={t} className={`dm-tier-btn${simTier === t ? " active" : ""}`} onClick={() => setSimTier(t)}>
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="dm-stat-grid">
              <div className="dm-stat"><div className="dm-stat-label">ACTIVE TIER</div><div className="dm-stat-val">{simTier.toUpperCase()}</div></div>
              <div className="dm-stat"><div className="dm-stat-label">COMPANIONS</div><div className="dm-stat-val">{simTier === "free" ? "2" : "6"}</div></div>
              <div className="dm-stat"><div className="dm-stat-label">QUANTUM PATHS</div><div className="dm-stat-val">{simTier === "free" ? "2" : simTier === "pro" ? "4" : "6"}</div></div>
              <div className="dm-stat"><div className="dm-stat-label">OUTCOMES/PATH</div><div className="dm-stat-val">{simTier === "free" ? "1" : simTier === "pro" ? "3" : "5"}</div></div>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", lineHeight: "1.8", marginBottom: "1rem", background: "#0A0A12", padding: "0.8rem", borderRadius: "2px", border: "1px solid #1A1A28" }}>
              <div style={{ color: "var(--gold-dim)", marginBottom: "0.4rem", letterSpacing: "0.1em" }}>TIER STRUCTURE</div>
              <div>Free: Solar + Sofia only · 2 paths · 1 outcome · no memory</div>
              <div>Pro $19.99: All 6 companions · 4 paths · 3 outcomes · basic memory</div>
              <div>Premium $29.99: All 6 · 6 paths · 5 outcomes · evolving relationships</div>
            </div>
            <button className="dm-admin-close" onClick={() => setShowAdminDash(false)}>Close Dashboard</button>
          </div>
        </div>
      )}

      {/* MAIN APP */}
      {!splashVisible && (
        <div className="dm-app">
          {/* Header */}
          <div className="dm-header">
            <img src="/logo.png" alt="DM" className="dm-header-logo" onError={e => e.target.style.display = "none"} />
            <div className="dm-header-title">DAY MASTERS</div>
            <div className="dm-day-badge">
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              {isAdmin && <div style={{ color: "var(--gold-dim)", fontSize: "0.6rem", cursor: "pointer" }} onClick={() => setShowAdminDash(true)}>⬡ ADMIN</div>}
            </div>
          </div>

          {/* Companions */}
          <div className="dm-companions">
            {Object.entries(COMPANIONS).map(([name, data]) => (
              <button key={name} className={`dm-companion-btn${activeCompanion === name ? " active" : ""}`} onClick={() => switchCompanion(name)}>
                <div className="dm-companion-avatar" style={{ background: data.bg, "--companion-color": data.color }}>
                  {data.emoji}
                </div>
                <div className="dm-companion-name">{name}</div>
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div className="dm-tabs">
            {[["talk", "💬 Talk"], ["decide", "⚡ Decide"], ["grow", "🌱 Grow"]].map(([tab, label]) => (
              <button key={tab} className={`dm-tab${activeTab === tab ? " active" : ""}`} onClick={() => setActiveTab(tab)}>
                {label}
              </button>
            ))}
          </div>

          {/* ── TALK ── */}
          {activeTab === "talk" && (
            <>
              <div className="dm-chat-area">
                {messages.map((msg) => {
                  const mc = msg.companion ? COMPANIONS[msg.companion] : null;
                  return (
                    <div key={msg.id}>
                      <div className={`dm-msg ${msg.from}`} style={mc ? { "--companion-color": mc.color } : {}}>
                        {msg.from === "companion" && (
                          <div className="dm-msg-name">{msg.companion} · {mc?.role}</div>
                        )}
                        {msg.text}
                      </div>
                      {msg.from === "companion" && (
                        <div className="dm-feedback">
                          <button className={`dm-fb-btn${feedback[msg.id] === "up" ? " selected" : ""}`} onClick={() => setFeedback(f => ({ ...f, [msg.id]: f[msg.id] === "up" ? null : "up" }))}>👍</button>
                          <button className={`dm-fb-btn${feedback[msg.id] === "down" ? " selected" : ""}`} onClick={() => setFeedback(f => ({ ...f, [msg.id]: f[msg.id] === "down" ? null : "down" }))}>👎</button>
                          {feedback[msg.id] === "down" && (
                            <>
                              <input className="dm-fb-input" placeholder="What missed?" value={fbComment[msg.id] || ""} onChange={e => setFbComment(f => ({ ...f, [msg.id]: e.target.value }))} />
                              <button className="dm-fb-send">Send</button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {isLoading && (
                  <div className="dm-msg companion" style={{ "--companion-color": c.color }}>
                    <div className="dm-msg-name">{activeCompanion} · {c.role}</div>
                    <div className="dm-typing"><span /><span /><span /></div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="dm-input-row">
                <input className="dm-input" placeholder={`Talk to ${activeCompanion}...`} value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
                <button className="dm-send-btn" onClick={sendMessage}>SEND</button>
              </div>
            </>
          )}

          {/* ── DECIDE ── */}
          {activeTab === "decide" && (
            <div className="dm-decide-area">
              {!paths ? (
                <>
                  <div className="dm-decide-question">What decision are you facing?</div>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                    <input className="dm-input" placeholder="Describe your decision..." value={decideQ} onChange={e => setDecideQ(e.target.value)} onKeyDown={e => e.key === "Enter" && handleDecide()} />
                    <button className="dm-send-btn" onClick={handleDecide}>GO</button>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", textAlign: "center", lineHeight: "1.6" }}>{c.decideIntro}</div>
                </>
              ) : (
                <>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.82rem", color: "var(--gold-dim)", textAlign: "center", marginBottom: "0.4rem" }}>DECISION</div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text)", textAlign: "center", marginBottom: "0.6rem", lineHeight: "1.5" }}>"{decideQ}"</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textAlign: "center", marginBottom: "1rem" }}>{c.decideIntro}</div>
                  <div className="dm-paths">
                    {paths.map((path, i) => (
                      <div key={i} className="dm-path" onClick={() => setExpandedPath(expandedPath === i ? null : i)}>
                        <div className="dm-path-label">{path.label} {expandedPath === i ? "▲" : "▼"}</div>
                        <div className="dm-path-text">{path.text}</div>
                        {expandedPath === i && (
                          <div className="dm-path-outcomes">
                            {path.outcomes.map((o, j) => (
                              <div key={j} className="dm-outcome">
                                <div className="dm-outcome-label">{o.label}</div>
                                {o.text}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setPaths(null); setDecideQ(""); }} style={{ marginTop: "1rem", background: "none", border: "1px solid #222", color: "var(--text-dim)", padding: "0.6rem", borderRadius: "2px", cursor: "pointer", width: "100%", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
                    NEW DECISION
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── GROW ── */}
          {activeTab === "grow" && (
            <div className="dm-grow-area">
              <div className="dm-grow-section">
                <div className="dm-grow-heading">Today's Goals</div>
                {goals.map(goal => (
                  <div key={goal.id} className="dm-goal-item" onClick={() => setGoals(gs => gs.map(g => g.id === goal.id ? { ...g, done: !g.done } : g))}>
                    <div className={`dm-goal-check${goal.done ? " done" : ""}`}>{goal.done ? "✓" : ""}</div>
                    <div className={`dm-goal-text${goal.done ? " done" : ""}`}>{goal.text}</div>
                  </div>
                ))}
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <input className="dm-input" placeholder="Add a goal..." value={newGoal} onChange={e => setNewGoal(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && newGoal.trim()) { setGoals(gs => [...gs, { id: Date.now(), text: newGoal.trim(), done: false }]); setNewGoal(""); } }} />
                  <button className="dm-send-btn" onClick={() => { if (newGoal.trim()) { setGoals(gs => [...gs, { id: Date.now(), text: newGoal.trim(), done: false }]); setNewGoal(""); } }}>ADD</button>
                </div>
              </div>
              <div className="dm-grow-section">
                <div className="dm-grow-heading">Progress</div>
                <div style={{ background: "var(--bg-card2)", border: "1px solid #1A1A28", padding: "1rem", borderRadius: "2px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>Goals complete</span>
                    <span style={{ fontSize: "0.78rem", color: "var(--gold)" }}>{goals.filter(g => g.done).length} / {goals.length}</span>
                  </div>
                  <div style={{ height: "6px", background: "#1A1A28", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${goals.length ? (goals.filter(g => g.done).length / goals.length) * 100 : 0}%`, background: "var(--gold)", transition: "width 0.4s ease" }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
