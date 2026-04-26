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

    body { background: var(--bg-dark); font-family: 'Rajdhani', sans-serif; color: var(--text); }

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
    }
    .dm-logo-fallback {
      font-size: 6rem;
      filter: drop-shadow(0 0 18px var(--gold)) drop-shadow(0 0 40px var(--gold-dim));
      animation: logoPulse 3s ease-in-out infinite;
      line-height: 1;
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
      color: var(--gold); letter-spacing: 0.3em;
      margin-top: 1.2rem;
      text-shadow: 0 0 20px var(--gold-dim);
    }
    .dm-tagline {
      font-size: 0.85rem; color: var(--text-dim);
      letter-spacing: 0.18em; margin-top: 0.4rem;
      text-transform: uppercase;
    }
    .dm-enter-btn {
      margin-top: 2.5rem; padding: 0.75rem 2.5rem;
      background: transparent; border: 1px solid var(--gold-dim);
      color: var(--gold); font-family: 'Cinzel', serif;
      font-size: 0.85rem; letter-spacing: 0.25em;
      cursor: pointer; border-radius: 2px; transition: all 0.3s ease;
    }
    .dm-enter-btn:hover { background: var(--gold-dim); color: var(--bg-dark); box-shadow: 0 0 20px var(--gold-dim); }
    .dm-tap-hint { margin-top: 0.6rem; font-size: 0.7rem; color: #1a1a1a; letter-spacing: 0.12em; }

    /* ── ADMIN OVERLAY ── */
    .dm-admin-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.92);
      display: flex; align-items: center; justify-content: center;
      z-index: 99999;
    }
    .dm-admin-box {
      background: var(--bg-card); border: 1px solid var(--gold-dim);
      border-radius: 4px; padding: 2rem; width: 90%; max-width: 380px;
      box-shadow: 0 0 40px rgba(201,168,76,0.15);
    }
    .dm-admin-title {
      font-family: 'Cinzel', serif; color: var(--gold);
      font-size: 1rem; letter-spacing: 0.2em;
      margin-bottom: 1.2rem; text-align: center;
    }
    .dm-admin-input {
      width: 100%; padding: 0.7rem 1rem;
      background: #0A0A12; border: 1px solid var(--gold-dim);
      color: var(--gold); font-family: 'Rajdhani', sans-serif;
      font-size: 1rem; letter-spacing: 0.15em;
      border-radius: 2px; outline: none; margin-bottom: 1rem;
    }
    .dm-admin-input::placeholder { color: #444; }
    .dm-admin-input:focus { border-color: var(--gold); }
    .dm-admin-btn {
      width: 100%; padding: 0.7rem; background: var(--gold-dim);
      border: none; color: var(--bg-dark); font-family: 'Cinzel', serif;
      font-size: 0.85rem; letter-spacing: 0.15em; cursor: pointer;
      border-radius: 2px; transition: background 0.2s;
    }
    .dm-admin-btn:hover { background: var(--gold); }
    .dm-admin-err { color: #FF6060; font-size: 0.78rem; text-align: center; margin-top: 0.5rem; }
    .dm-admin-close {
      margin-top: 1rem; width: 100%; padding: 0.5rem;
      background: transparent; border: 1px solid #333;
      color: var(--text-dim); font-size: 0.78rem; cursor: pointer;
      border-radius: 2px; letter-spacing: 0.1em;
    }

    /* ── ADMIN DASHBOARD ── */
    .dm-admin-dash {
      background: var(--bg-card); border: 1px solid var(--gold-dim);
      border-radius: 4px; padding: 1.5rem; width: 94%; max-width: 500px;
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
      padding: 1rem 1.2rem; border-bottom: 1px solid #1A1A28;
      flex-shrink: 0;
    }
    .dm-header-logo { width: 36px; height: 36px; object-fit: contain; }
    .dm-header-title {
      font-family: 'Cinzel', serif; font-size: 1rem;
      color: var(--gold); letter-spacing: 0.2em;
    }
    .dm-day-badge { font-size: 0.7rem; color: var(--text-dim); letter-spacing: 0.1em; text-align: right; }

    /* ── COMPANIONS ── */
    .dm-companions {
      display: flex; gap: 0.5rem; padding: 0.8rem 1rem;
      overflow-x: auto; border-bottom: 1px solid #1A1A28;
      scrollbar-width: none; flex-shrink: 0;
    }
    .dm-companions::-webkit-scrollbar { display: none; }
    .dm-companion-btn {
      display: flex; flex-direction: column; align-items: center;
      gap: 0.3rem; min-width: 58px; cursor: pointer;
      border: none; background: none; padding: 0.4rem;
      transition: opacity 0.2s;
    }
    .dm-companion-btn.locked { opacity: 0.3; cursor: not-allowed; }
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
    .dm-lock-icon { font-size: 0.55rem; color: var(--text-dim); }

    /* ── TABS ── */
    .dm-tabs { display: flex; border-bottom: 1px solid #1A1A28; flex-shrink: 0; }
    .dm-tab {
      flex: 1; padding: 0.8rem; background: none; border: none;
      color: var(--text-dim); font-family: 'Rajdhani', sans-serif;
      font-size: 0.82rem; letter-spacing: 0.15em;
      text-transform: uppercase; cursor: pointer;
      border-bottom: 2px solid transparent; transition: all 0.2s;
    }
    .dm-tab.active { color: var(--gold); border-bottom-color: var(--gold); }

    /* ── CHAT ── */
    .dm-chat-area {
      flex: 1; overflow-y: auto; padding: 1rem;
      display: flex; flex-direction: column; gap: 0.8rem;
    }
    .dm-chat-area::-webkit-scrollbar { width: 2px; }
    .dm-chat-area::-webkit-scrollbar-thumb { background: var(--gold-dim); }

    .dm-msg {
      max-width: 85%; padding: 0.75rem 1rem;
      border-radius: 2px; font-size: 0.92rem; line-height: 1.5;
    }
    .dm-msg.user {
      align-self: flex-end; background: #12121C;
      color: var(--text); border: 1px solid #1E1E30;
    }
    .dm-msg.companion {
      align-self: flex-start; background: #0D0D18;
      color: var(--text); border-left: 3px solid var(--companion-color, var(--gold));
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
      font-size: 0.82rem; cursor: pointer; border-radius: 2px; transition: all 0.2s;
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
      font-size: 0.72rem; cursor: pointer; border-radius: 2px; letter-spacing: 0.1em;
    }

    /* ── INPUT ROW ── */
    .dm-input-row {
      display: flex; gap: 0.5rem; padding: 0.8rem 1rem;
      border-top: 1px solid #1A1A28; flex-shrink: 0;
    }
    .dm-input {
      flex: 1; background: #0D0D18; border: 1px solid #1E1E30;
      color: var(--text); font-family: 'Rajdhani', sans-serif;
      font-size: 0.95rem; padding: 0.65rem 0.9rem;
      border-radius: 2px; outline: none;
    }
    .dm-input:focus { border-color: var(--gold-dim); }
    .dm-input::placeholder { color: var(--text-dim); }
    .dm-send-btn {
      background: var(--gold-dim); border: none; color: var(--bg-dark);
      padding: 0 1.2rem; font-family: 'Cinzel', serif;
      font-size: 0.78rem; letter-spacing: 0.1em;
      cursor: pointer; border-radius: 2px; transition: background 0.2s;
    }
    .dm-send-btn:hover { background: var(--gold); }
    .dm-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* ── DECIDE ── */
    .dm-decide-area { flex: 1; overflow-y: auto; padding: 1rem; }
    .dm-decide-area::-webkit-scrollbar { width: 2px; }
    .dm-decide-question {
      font-family: 'Cinzel', serif; font-size: 1rem;
      color: var(--gold); text-align: center;
      margin-bottom: 1.2rem; line-height: 1.5;
    }
    .dm-paths { display: flex; flex-direction: column; gap: 0.6rem; }
    .dm-path {
      background: var(--bg-card2); border: 1px solid #1E1E30;
      border-left: 3px solid var(--gold-dim);
      padding: 0.9rem 1rem; border-radius: 2px;
      cursor: pointer; transition: all 0.2s;
    }
    .dm-path:hover { border-left-color: var(--gold); background: #14141E; }
    .dm-path-label {
      font-size: 0.65rem; color: var(--gold-dim);
      letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.3rem;
      display: flex; justify-content: space-between; align-items: center;
    }
    .dm-path-text { font-size: 0.92rem; color: var(--text); line-height: 1.4; }
    .dm-path-outcomes { margin-top: 0.8rem; display: flex; flex-direction: column; gap: 0.4rem; }
    .dm-outcome {
      background: #0A0A12; border: 1px solid #1A1A26;
      padding: 0.6rem 0.8rem; border-radius: 2px;
      font-size: 0.82rem; color: var(--text-dim); line-height: 1.4;
    }
    .dm-outcome-label {
      font-size: 0.6rem; letter-spacing: 0.1em;
      color: var(--gold-dim); margin-bottom: 0.2rem;
    }
    .dm-decide-spinner {
      display: flex; align-items: center; justify-content: center;
      gap: 0.6rem; padding: 2rem; color: var(--text-dim);
      font-size: 0.82rem; letter-spacing: 0.1em;
    }
    .dm-spinner {
      width: 18px; height: 18px; border: 2px solid #1A1A28;
      border-top-color: var(--gold); border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .dm-free-gate {
      background: #0A0A12; border: 1px solid var(--gold-dim);
      border-radius: 2px; padding: 1.2rem; text-align: center;
      margin-top: 1rem;
    }
    .dm-free-gate-title {
      font-family: 'Cinzel', serif; color: var(--gold);
      font-size: 0.85rem; letter-spacing: 0.1em; margin-bottom: 0.5rem;
    }
    .dm-free-gate-text { font-size: 0.8rem; color: var(--text-dim); line-height: 1.5; }

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
      color: var(--bg-dark);
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
    .dm-typing { display: flex; gap: 4px; padding: 0.6rem 0.4rem; align-items: center; }
    .dm-typing span {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--gold-dim); animation: typingBounce 1s infinite;
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
    bg: "radial-gradient(circle, #2A2200 0%, #1A1600 100%)",
    title: "The Collective",
    role: "Master Guide",
    voice: "Solar channels all frequencies. Every path you walk shapes the quantum field around you. What will you do with today?",
    decideIntro: "Multiple realities exist simultaneously. The quantum field reveals these paths:",
    systemPrompt: "You are Solar, the Master Guide of Day Masters — the collective consciousness of all six guides. You are wise, expansive, and see the full picture of a person's life. You speak with warm authority and guide toward clarity and quantum possibility. Keep responses concise (2-4 sentences). Stay in character. Do not mention being an AI.",
  },
  Sofia: {
    emoji: "🌸",
    color: "#FF8FAB",
    bg: "radial-gradient(circle, #2A0818 0%, #1A0810 100%)",
    title: "The Compassionate",
    role: "Heart Guide",
    voice: "You are seen, you are heard. Every step forward, no matter how small, is still a step. What is on your heart today?",
    decideIntro: "Every choice carries an emotional weight. Let's feel into these paths:",
    systemPrompt: "You are Sofia, the Heart Guide of Day Masters. You lead with empathy and deep compassion. You help people process feelings and the emotional weight of decisions. You are warm and nurturing. Keep responses concise (2-4 sentences). Stay in character. Do not mention being an AI.",
  },
  Stewart: {
    emoji: "⚡",
    color: "#60C0FF",
    bg: "radial-gradient(circle, #08101A 0%, #060C14 100%)",
    title: "The Logical",
    role: "Reason Guide",
    voice: "Data. Systems. Structure. Let's break this down into what actually makes sense. What problem are we solving?",
    decideIntro: "Analyzing variables across each decision path:",
    systemPrompt: "You are Stewart, the Reason Guide of Day Masters. You are analytical, precise, and methodical. You break problems into frameworks and logical steps. You are direct and structured. Keep responses concise (2-4 sentences). Stay in character. Do not mention being an AI.",
    proOnly: true,
  },
  Drax: {
    emoji: "🪨",
    color: "#A0E0A0",
    bg: "radial-gradient(circle, #081208 0%, #060E06 100%)",
    title: "The Realist",
    role: "Ground Guide",
    voice: "Real talk — no sugarcoating. What's actually happening and what are you actually willing to do about it?",
    decideIntro: "Here's what's real about each option:",
    systemPrompt: "You are Drax, the Ground Guide of Day Masters. You deal in truth, not comfort. You show people what is actually happening versus what they want to believe. You are blunt and grounded. Keep responses concise (2-4 sentences). Stay in character. Do not mention being an AI.",
    proOnly: true,
  },
  Aries: {
    emoji: "🔥",
    color: "#FF6B35",
    bg: "radial-gradient(circle, #1A0800 0%, #120600 100%)",
    title: "The Fearless",
    role: "Action Guide",
    voice: "Fear is a liar. The version of you that chose boldly — that's the one you're proud of. What are you waiting on?",
    decideIntro: "Bold moves and their ripple effects:",
    systemPrompt: "You are Aries, the Action Guide of Day Masters. You are bold, fearless, and action-oriented. You push people past hesitation and self-doubt. You believe in taking the shot. Keep responses concise (2-4 sentences). Stay in character. Do not mention being an AI.",
    proOnly: true,
  },
  Mary: {
    emoji: "🌙",
    color: "#C89FFF",
    bg: "radial-gradient(circle, #100818 0%, #0C0612 100%)",
    title: "The Intuitive",
    role: "Wisdom Guide",
    voice: "Close your eyes for a moment. Your gut already knows the answer. Which path makes your chest feel lighter?",
    decideIntro: "Your intuition speaks through these paths:",
    systemPrompt: "You are Mary, the Intuitive Guide of Day Masters. You operate beyond logic and tap into intuition, energy, and the deeper knowing beneath the surface. You help people trust their gut. You are mystical and calm. Keep responses concise (2-4 sentences). Stay in character. Do not mention being an AI.",
    proOnly: true,
  },
};

// Admin key — sigil unchanged
const ADMIN_KEY = "DMTHRONE25";

// Tier config
const TIER_CONFIG = {
  free:    { label: "FREE",    pathCount: 2, outcomeCount: 1, price: null },
  pro:     { label: "PRO",     pathCount: 4, outcomeCount: 3, price: "$19.99" },
  premium: { label: "PREMIUM", pathCount: 6, outcomeCount: 5, price: "$29.99" },
};

// ─── API HELPERS ──────────────────────────────────────────────────────────────
async function callCompanion(systemPrompt, apiMessages) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: apiMessages,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content?.[0]?.text || "Something went quiet. Try again.";
}

async function callQuantumDecide(situation, companion, pathCount, outcomeCount) {
  const c = COMPANIONS[companion];
  const systemPrompt = `You are ${companion}, ${c.title} (${c.role}) in the Day Masters quantum decision engine. ${c.decideIntro} Respond ONLY with valid JSON — no markdown, no explanation, nothing else.`;

  const userPrompt = `Decision situation: "${situation}"

Generate exactly ${pathCount} quantum decision paths, each with exactly ${outcomeCount} outcome(s).

Return ONLY this JSON structure:
{
  "paths": [
    {
      "label": "Path Alpha",
      "text": "1-2 sentence description of this decision path",
      "outcomes": [
        {
          "label": "Best Case",
          "text": "What happens if this unfolds this way"
        }
      ]
    }
  ]
}

Path labels must be: Path Alpha, Path Beta, Path Gamma, Path Delta, Path Epsilon, Path Zeta (use only as many as needed).
Outcome labels must be: Best Case, Most Likely, The Challenge, Wildcard, The Cost (use only as many as needed).`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  const data = await res.json();
  const raw = data.content?.[0]?.text || "{}";
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DayMasters() {
  useEffect(() => { injectStyles(); }, []);

  // Splash
  const [splashVisible, setSplashVisible] = useState(true);
  const [splashFade, setSplashFade] = useState(false);
  const [logoError, setLogoError] = useState(false);
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
  const [decideLoading, setDecideLoading] = useState(false);
  const [decideErr, setDecideErr] = useState("");
  const [notif, setNotif] = useState(null);
  const chatEndRef = useRef(null);

  // Time-based in-app prompt (no push toggle — mobile only feature)
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) setNotif("🌅 Good morning. What does today need from you?");
    else if (hour >= 12 && hour < 14) setNotif("⚡ Midday check-in — are you on track with your Day?");
    else if (hour >= 17 && hour < 20) setNotif("🔔 Closing bell. What did you accomplish today?");
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── Logo tap Easter egg → admin prompt
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
    setMessages([{ id: Date.now(), from: "companion", text: c.voice, companion: activeCompanion, isIntro: true }]);
  };

  // ── Admin auth
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

  // ── Companion switch
  const switchCompanion = (name) => {
    const tier = isAdmin ? simTier : "free";
    const isLocked = COMPANIONS[name].proOnly && tier === "free";
    if (isLocked) return;
    setActiveCompanion(name);
    if (activeTab === "talk") {
      const c = COMPANIONS[name];
      setMessages(prev => [
        ...prev,
        { id: Date.now(), from: "companion", text: c.voice, companion: name, isIntro: true },
      ]);
    }
  };

  // ── Send chat message — FIXED: clean conversation history, no duplicates
  const sendMessage = async () => {
    if (!inputVal.trim() || isLoading) return;
    const userText = inputVal.trim();
    const userMsg = { id: Date.now(), from: "user", text: userText };

    // Build clean alternating API history from existing messages (before adding new one)
    // Skip intro/voice messages — they're not part of real conversation history
    const conversationMsgs = messages.filter(m => !m.isIntro);
    const apiMessages = [];
    let lastRole = null;
    for (const m of conversationMsgs.slice(-14)) {
      const role = m.from === "user" ? "user" : "assistant";
      if (role !== lastRole) {
        apiMessages.push({ role, content: m.text });
        lastRole = role;
      }
    }
    // Add the new user message
    if (lastRole !== "user") {
      apiMessages.push({ role: "user", content: userText });
    }
    // Edge case: if history ended on user, replace last user entry
    if (lastRole === "user" && apiMessages.length > 0) {
      apiMessages[apiMessages.length - 1] = { role: "user", content: userText };
    }

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsLoading(true);

    try {
      const c = COMPANIONS[activeCompanion];
      const reply = await callCompanion(c.systemPrompt, apiMessages);
      setMessages(prev => [...prev, { id: Date.now(), from: "companion", text: reply, companion: activeCompanion }]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now(), from: "companion", text: "Lost the signal. Try again.", companion: activeCompanion }]);
    }
    setIsLoading(false);
  };

  // ── Quantum Decide — AI-powered, tier-gated
  const handleDecide = async () => {
    if (!decideQ.trim() || decideLoading) return;
    const tier = isAdmin ? simTier : "free";
    const { pathCount, outcomeCount } = TIER_CONFIG[tier];
    setDecideLoading(true);
    setDecideErr("");
    setPaths(null);
    setExpandedPath(null);

    try {
      const result = await callQuantumDecide(decideQ, activeCompanion, pathCount, outcomeCount);
      if (result.paths?.length) {
        setPaths(result.paths);
      } else {
        setDecideErr("Couldn't generate paths. Try rephrasing your situation.");
      }
    } catch {
      setDecideErr("Connection lost. Check your signal and try again.");
    }
    setDecideLoading(false);
  };

  const c = COMPANIONS[activeCompanion];
  const tier = isAdmin ? simTier : "free";
  const tierCfg = TIER_CONFIG[tier];

  return (
    <>
      {/* NOTIFICATION BANNER */}
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
            {!logoError ? (
              <img
                ref={logoRef}
                src="/logo.png"
                alt="Day Masters"
                className="dm-logo"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div ref={logoRef} className="dm-logo-fallback">☀️</div>
            )}
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
              <div className="dm-stat"><div className="dm-stat-label">QUANTUM PATHS</div><div className="dm-stat-val">{TIER_CONFIG[simTier].pathCount}</div></div>
              <div className="dm-stat"><div className="dm-stat-label">OUTCOMES/PATH</div><div className="dm-stat-val">{TIER_CONFIG[simTier].outcomeCount}</div></div>
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
            {!logoError ? (
              <img src="/logo.png" alt="DM" className="dm-header-logo" onError={() => setLogoError(true)} />
            ) : (
              <span style={{ fontSize: "1.4rem" }}>☀️</span>
            )}
            <div className="dm-header-title">DAY MASTERS</div>
            <div className="dm-day-badge">
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              {isAdmin && (
                <div style={{ color: "var(--gold-dim)", fontSize: "0.6rem", cursor: "pointer", marginTop: "2px" }} onClick={() => setShowAdminDash(true)}>
                  ⬡ ADMIN · {tierCfg.label}
                </div>
              )}
            </div>
          </div>

          {/* Companions */}
          <div className="dm-companions">
            {Object.entries(COMPANIONS).map(([name, data]) => {
              const locked = data.proOnly && tier === "free";
              return (
                <button
                  key={name}
                  className={`dm-companion-btn${activeCompanion === name ? " active" : ""}${locked ? " locked" : ""}`}
                  onClick={() => switchCompanion(name)}
                  title={locked ? "Upgrade to Pro to unlock" : name}
                >
                  <div
                    className="dm-companion-avatar"
                    style={{ background: data.bg, "--companion-color": data.color }}
                  >
                    {locked ? "🔒" : data.emoji}
                  </div>
                  <div className="dm-companion-name">{name}</div>
                  {locked && <div className="dm-lock-icon">PRO</div>}
                </button>
              );
            })}
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
                      <div
                        className={`dm-msg ${msg.from}`}
                        style={mc ? { "--companion-color": mc.color } : {}}
                      >
                        {msg.from === "companion" && (
                          <div className="dm-msg-name">{msg.companion} · {mc?.role}</div>
                        )}
                        {msg.text}
                      </div>
                      {msg.from === "companion" && !msg.isIntro && (
                        <div className="dm-feedback">
                          <button
                            className={`dm-fb-btn${feedback[msg.id] === "up" ? " selected" : ""}`}
                            onClick={() => setFeedback(f => ({ ...f, [msg.id]: f[msg.id] === "up" ? null : "up" }))}
                          >👍</button>
                          <button
                            className={`dm-fb-btn${feedback[msg.id] === "down" ? " selected" : ""}`}
                            onClick={() => setFeedback(f => ({ ...f, [msg.id]: f[msg.id] === "down" ? null : "down" }))}
                          >👎</button>
                          {feedback[msg.id] === "down" && (
                            <>
                              <input
                                className="dm-fb-input"
                                placeholder="What missed?"
                                value={fbComment[msg.id] || ""}
                                onChange={e => setFbComment(f => ({ ...f, [msg.id]: e.target.value }))}
                              />
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
                <input
                  className="dm-input"
                  placeholder={`Talk to ${activeCompanion}...`}
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  disabled={isLoading}
                />
                <button className="dm-send-btn" onClick={sendMessage} disabled={isLoading || !inputVal.trim()}>
                  SEND
                </button>
              </div>
            </>
          )}

          {/* ── DECIDE ── */}
          {activeTab === "decide" && (
            <div className="dm-decide-area">
              {!paths && !decideLoading ? (
                <>
                  <div className="dm-decide-question">What decision are you facing?</div>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                    <input
                      className="dm-input"
                      placeholder="Describe your situation..."
                      value={decideQ}
                      onChange={e => setDecideQ(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleDecide()}
                    />
                    <button className="dm-send-btn" onClick={handleDecide} disabled={!decideQ.trim()}>GO</button>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", textAlign: "center", lineHeight: "1.6", marginBottom: "1rem" }}>
                    {c.decideIntro}
                  </div>
                  {tier === "free" && (
                    <div className="dm-free-gate">
                      <div className="dm-free-gate-title">FREE PLAN · 2 Paths · 1 Outcome Each</div>
                      <div className="dm-free-gate-text">
                        Upgrade to Pro for 4 paths with 3 outcomes, or Premium for 6 paths with 5 outcomes each — and full companion access.
                      </div>
                    </div>
                  )}
                  {decideErr && (
                    <div style={{ color: "#FF6060", fontSize: "0.8rem", textAlign: "center", marginTop: "0.8rem" }}>{decideErr}</div>
                  )}
                </>
              ) : decideLoading ? (
                <div className="dm-decide-spinner">
                  <div className="dm-spinner" />
                  {activeCompanion} is reading the quantum field...
                </div>
              ) : (
                <>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.82rem", color: "var(--gold-dim)", textAlign: "center", marginBottom: "0.4rem" }}>
                    DECISION
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text)", textAlign: "center", marginBottom: "0.5rem", lineHeight: "1.5" }}>
                    "{decideQ}"
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textAlign: "center", marginBottom: "1rem", letterSpacing: "0.05em" }}>
                    {c.decideIntro}
                  </div>

                  <div className="dm-paths">
                    {paths.map((path, i) => (
                      <div key={i} className="dm-path" onClick={() => setExpandedPath(expandedPath === i ? null : i)}>
                        <div className="dm-path-label">
                          <span>{path.label}</span>
                          <span>{expandedPath === i ? "▲" : "▼"}</span>
                        </div>
                        <div className="dm-path-text">{path.text}</div>
                        {expandedPath === i && path.outcomes?.length > 0 && (
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

                  <button
                    onClick={() => { setPaths(null); setDecideQ(""); setDecideErr(""); }}
                    style={{ marginTop: "1rem", background: "none", border: "1px solid #222", color: "var(--text-dim)", padding: "0.6rem", borderRadius: "2px", cursor: "pointer", width: "100%", fontSize: "0.8rem", letterSpacing: "0.1em" }}
                  >
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
                  <div
                    key={goal.id}
                    className="dm-goal-item"
                    onClick={() => setGoals(gs => gs.map(g => g.id === goal.id ? { ...g, done: !g.done } : g))}
                  >
                    <div className={`dm-goal-check${goal.done ? " done" : ""}`}>{goal.done ? "✓" : ""}</div>
                    <div className={`dm-goal-text${goal.done ? " done" : ""}`}>{goal.text}</div>
                  </div>
                ))}
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <input
                    className="dm-input"
                    placeholder="Add a goal..."
                    value={newGoal}
                    onChange={e => setNewGoal(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && newGoal.trim()) {
                        setGoals(gs => [...gs, { id: Date.now(), text: newGoal.trim(), done: false }]);
                        setNewGoal("");
                      }
                    }}
                  />
                  <button className="dm-send-btn" onClick={() => {
                    if (newGoal.trim()) {
                      setGoals(gs => [...gs, { id: Date.now(), text: newGoal.trim(), done: false }]);
                      setNewGoal("");
                    }
                  }}>ADD</button>
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
                    <div style={{
                      height: "100%",
                      width: `${goals.length ? (goals.filter(g => g.done).length / goals.length) * 100 : 0}%`,
                      background: "var(--gold)",
                      transition: "width 0.4s ease",
                    }} />
                  </div>
                </div>
              </div>

              <div className="dm-grow-section">
                <div className="dm-grow-heading">Companion Access</div>
                <div style={{ background: "var(--bg-card2)", border: "1px solid #1A1A28", padding: "1rem", borderRadius: "2px" }}>
                  {Object.entries(COMPANIONS).map(([name, data]) => {
                    const locked = data.proOnly && tier === "free";
                    return (
                      <div key={name} style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
                        <span style={{ fontSize: "1rem" }}>{data.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.78rem", color: locked ? "var(--text-dim)" : data.color }}>{name}</div>
                          <div style={{ fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "0.05em" }}>{data.title}</div>
                        </div>
                        <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: locked ? "#FF6060" : "#4CAF50" }}>
                          {locked ? "PRO" : "ACTIVE"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </>
  );
}
