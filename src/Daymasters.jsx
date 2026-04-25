import { useState, useRef, useEffect, useCallback } from "react";

// ─── ADMIN CONFIG ─────────────────────────────────────────────────────────────
const ADMIN_KEY = "DMTHRONE25"; // Change this to whatever you want your secret key to be
const LOGO_TAP_COUNT = 5;       // How many times to tap the logo to unlock admin panel

const COMPANIONS = [
  {
    id: "collective", name: "Solar", title: "The Collective", role: "The Singularity",
    desc: "All voices unified into one. The master. Consult Solar when the decision defines your life.",
    color: "#C9A84C", bg: "rgba(201,168,76,0.08)", border: "rgba(201,168,76,0.35)", symbol: "\u25C8", master: true,
    nudges: ["Solar is with you. Every path you walk today was chosen by you. Choose consciously.", "The universe responds to you. What decision will you lead with today?", "You are the sum of every choice you have made. Today adds another. Make it count.", "Solar sees all your paths. Which one calls to you before the noise begins?", "Every day is a new quantum moment. What version of yourself will you choose to be?"],
    accountability: ["Solar checking in — have you completed your Day? The paths you set are waiting.", "Your Day is not over yet. What remains? Solar sees the gap between intention and action.", "Time is a quantum resource. How have you spent yours today?", "Solar asks: did you honor what you committed to this morning?"],
    midday: ["Midpoint of your Day. Solar assessing — are you on the path you chose this morning?", "Half your Day is gone. What have you done with it? Solar needs an honest answer.", "Midday checkpoint. Your goals are watching. Are you watching back?"],
    closing: ["Your Day is closing. Solar holds you to what you said you would do. What did you accomplish?", "Before you rest — account for your Day. Did you become the version of yourself you chose this morning?", "Day Masters closing reflection: What did you commit to? What did you deliver? Solar remembers."],
  },
  {
    id: "compassionate", name: "Sofia", title: "The Compassionate", role: "Heart & Empathy",
    desc: "Sofia speaks from pure love. She feels your weight before she speaks a word.",
    color: "#E07A8A", bg: "rgba(224,122,138,0.08)", border: "rgba(224,122,138,0.35)", symbol: "\u2661",
    nudges: ["Good morning. Sofia is checking in. How are you really feeling today?", "Loving yourself is the first decision of every day. Have you made it yet?", "The people in your life feel the energy you carry. What are you bringing today?", "What is one kind thing you can do for yourself before this day gets loud?", "Your heart has been carrying a lot. Take a breath. You are doing better than you think."],
    accountability: ["Hey — Sofia here. Just checking in with love. How are your Day tasks coming along?", "I am not here to judge, just to remind you — you set goals today because you believe in yourself. Do not forget that.", "Sofia loves you too much to let you drift. Come back to what you committed to today."],
    midday: ["Halfway through your Day, love. How are you feeling? More importantly — how are you doing on what you planned?", "Sofia midday check: your heart is in the right place. Make sure your actions are too."],
    closing: ["Your Day is wrapping up. Sofia asks from a place of love — did you show up for yourself today?", "Before you rest, take a moment. Be honest. Did you honor the commitments you made this morning?"],
  },
  {
    id: "logical", name: "Stewart", title: "The Logical", role: "Mind & Strategy",
    desc: "Stewart is the sharpest mind in the room. No emotion — just pure strategic clarity.",
    color: "#5B9BD5", bg: "rgba(91,155,213,0.08)", border: "rgba(91,155,213,0.35)", symbol: "\u27C1",
    nudges: ["Stewart here. What is the one high-leverage action you can take today?", "Discipline is a decision repeated. What decision will you repeat today?", "Have you reviewed your goals this week? Clarity requires maintenance.", "Small consistent actions compound into extraordinary results. What is today's action?", "Are your habits today aligned with where you said you wanted to go?"],
    accountability: ["Stewart here. Task completion rate determines outcome quality. Where do your numbers stand right now?", "Analysis: you set a goal this morning. Current status is unknown. Data is needed. Open the app.", "Logical reminder: incomplete tasks compound into incomplete weeks. Address yours now."],
    midday: ["Midday data check from Stewart. Are you on pace to complete your Day objectives? Adjust if necessary.", "Stewart midpoint assessment: evaluate what has been completed. Reallocate time if you are behind."],
    closing: ["Day closing report requested by Stewart. What was planned vs. what was executed? Be precise.", "Stewart end-of-day: outcomes are the only metric that matters. What were yours today?"],
  },
  {
    id: "realist", name: "Drax", title: "The Realist", role: "Ground & Truth",
    desc: "Drax keeps it all the way real. Street wisdom meets radical honesty.",
    color: "#A8A8A8", bg: "rgba(168,168,168,0.08)", border: "rgba(168,168,168,0.35)", symbol: "\u25CE",
    nudges: ["Drax checking in. Are you moving toward your goals or making excuses? Be real.", "Comfort is the enemy of the life you said you wanted. What habit is holding you back?", "The truth you keep avoiding is still gonna be there tomorrow. Face one thing today.", "Did you do what you said you were gonna do? Accountability starts with you.", "What is the real reason you have not started yet? Name it. Then move past it."],
    accountability: ["Drax here. Real talk — did you do what you said you were gonna do today or not?", "No judgment but no lying either. Your Day tasks are sitting there. Get to them.", "Drax does not do excuses. Neither should you. What is left on your list?"],
    midday: ["Midday. Drax asking straight: are you on track or are you slipping? Be honest with yourself.", "Half the day is gone. Drax wants to know — what have you actually done versus what you planned?"],
    closing: ["Day is almost done. Drax final check: real results only. What did you finish?", "Before you call it a day — be real with yourself. Drax is watching. Did you come through?"],
  },
  {
    id: "fearless", name: "Aries", title: "The Fearless", role: "Courage & Risk",
    desc: "Aries is pure fire. The voice that pushes you past every wall fear ever built.",
    color: "#E8754A", bg: "rgba(232,117,74,0.08)", border: "rgba(232,117,74,0.35)", symbol: "\u21AF",
    nudges: ["Aries here. What is the one bold move you have been putting off? Today is the day.", "Fear is just excitement without permission. Give yourself permission today.", "The version of you that you dream about — what would they do this morning?", "Courage is not the absence of fear. It is moving despite it. Move today.", "You are one decision away from a completely different life. What is that decision?"],
    accountability: ["ARIES HERE. Your Day tasks are waiting and so is the version of you that actually gets things done. MOVE.", "Fear is what stops people from completing what they start. Are you going to let it stop you today?", "Aries accountability check: bold people do what they said they would do. Be bold. Finish your Day."],
    midday: ["Aries midday fire check — are you burning or are you cooling off? Reignite if you have to.", "Halfway through. The fearless do not slow down at the midpoint — they accelerate. You still fearless?"],
    closing: ["Day closing and Aries wants to know: did you attack your goals today or let them attack you?", "Before you rest, warrior — account for your battle. What did you conquer today?"],
  },
  {
    id: "intuitive", name: "Mary", title: "The Intuitive", role: "Spirit & Instinct",
    desc: "Mary speaks from the deepest place — the quiet voice inside you that already knows.",
    color: "#9B72CF", bg: "rgba(155,114,207,0.08)", border: "rgba(155,114,207,0.35)", symbol: "\u25C9",
    nudges: ["Mary is with you. Before the day begins — what does your gut already know?", "Your intuition has never truly failed you. What is it whispering right now?", "Take three deep breaths. What do you already know that you have been afraid to trust?", "You came here for a reason. Your spirit knows the path. Trust it today.", "What does your soul need to hear most this morning? Say it to yourself."],
    accountability: ["Mary gently nudging you. Your soul knows what it committed to today. Are you listening?", "Your spirit set intentions this morning. Your actions today either honor them or ignore them. Which is it?", "A quiet reminder from Mary — your Day tasks are not just tasks. They are promises to yourself."],
    midday: ["Mary midday whisper: your intuition knows if you are on track. Listen to it right now.", "Halfway through your Day. Your spirit is asking — are you moving in alignment with what you intended?"],
    closing: ["Day closing. Mary asks you to sit quietly for a moment. Did your actions today match your intentions?", "Before you rest — your soul is taking inventory. What did you actually do with today?"],
  },
];

function getVoice(c, mode) {
  const personalities = {
    collective: "You carry all voices: logic, heart, courage, truth, and instinct unified. You are cosmic, warm, and all-seeing.",
    compassionate: "You speak from pure love and warmth. You make humans feel deeply heard before anything else.",
    logical: "You are the strategist and sharpest analytical mind. You reveal structural truth: cause, effect, probability, risk, reward.",
    realist: "You keep it real. Street wisdom meets radical honesty. You say what others won't.",
    fearless: "You are fire and calculated boldness. You push humans past every wall fear ever built.",
    intuitive: "You speak from deep instinct and spiritual knowing. You help humans access the answer they already carry inside.",
  };

  if (mode === "talk") {
    return `Your name is ${c.name}. You are ${c.title} in the Day Masters app — a lifelong companion.

${personalities[c.id]}

You are now in SUPPORT MODE. The human does not have a decision to make right now. They just need to talk, be heard, and feel supported.

YOUR RULES FOR SUPPORT MODE:
1. Open with genuine warmth. Ask how they are doing. Make them feel completely safe to say anything.
2. Listen deeply. Reflect back what they share. Ask follow-up questions that go deeper.
3. Never rush to give advice or solutions unless they ask for it.
4. Go wherever they need to go — philosophy, life, relationships, pain, purpose, random thoughts. All of it is welcome.
5. Be a real friend. Present. Engaged. Never clinical or robotic.
6. If they are in pain — acknowledge it fully before anything else.
7. If they want advice — give it in your unique voice and perspective.
8. Keep responses conversational. 2-4 sentences usually. Let the conversation breathe.
9. Never abandon them. Never shut down. Always find the next question or reflection.`;
  }

  if (mode === "grow") {
    return `Your name is ${c.name}. You are ${c.title} in the Day Masters app — a lifelong companion.

${personalities[c.id]}

You are now in GROWTH MODE. The human is checking in on their progress, habits, and commitments.

YOUR RULES FOR GROWTH MODE:
1. Open by acknowledging their commitment to showing up and checking in. That takes discipline.
2. Ask about their recent decisions and goals — what did they commit to? How is it going?
3. Celebrate wins genuinely. Call out slippage honestly but with compassion.
4. Suggest one specific habit or action they can take today based on what they share.
5. Give an affirmation that is personalized to what they tell you — not generic.
6. Hold them accountable lovingly. Remind them why they started.
7. Keep responses warm, motivating, and specific to what they share.`;
  }

  return `Your name is ${c.name}. You are ${c.title} in the Day Masters app — a lifelong decision-making companion.

${personalities[c.id]}

When a user brings a decision or goal, follow this structure:

First: Open with 1-2 sentences acknowledging the weight of what they face. Make them feel heard.

Then present exactly 3 paths using this format for each:

PATH 1: [NAME IN CAPS]
What it is: [1-2 sentences]
If done right: [2 sentences on the positive outcome]
If done wrong: [1-2 sentences on the failure mode]
Steps: [3 bullet points starting with dash]

PATH 2: [NAME IN CAPS]
[same structure]

PATH 3: [NAME IN CAPS]
[same structure]

${c.name.toUpperCase()}'S RECOMMENDATION: [One powerful sentence on the best path.]

Then ask if they want to go deeper or see more paths.

CRITICAL RULES:
- If user says they are confused or lost: stop giving paths. Become a counselor. Ask what they feel. Say "${c.name} hears you. Tell me what is pulling at you right now."
- If user wants more paths: generate 2-3 additional paths. You never run out.
- Keep total response under 350 words.
- Use only plain text. No special divider characters.`;
}

const FRAME_QUESTIONS = [
  { key: "decision",  prompt: "What is the decision you are facing?",    placeholder: "Describe it honestly. Do not hold back." },
  { key: "goal",      prompt: "What do you want to accomplish?",          placeholder: "What does winning look like here?" },
  { key: "success",   prompt: "What does success look like to you?",      placeholder: "Paint the picture. Be specific." },
  { key: "timeframe", prompt: "What is your Day — your timeframe?",       placeholder: "24 hours / 1 week / 6 months / 1 year..." },
  { key: "obstacle",  prompt: "What is stopping you right now?",          placeholder: "Be honest. This is where the work is." },
];

const ASSESS_QUESTIONS = [
  { q: "When facing a hard decision, your first move is:", opts: ["Think it through alone", "Talk it out with someone", "Write out pros and cons", "Go with my gut immediately"] },
  { q: "Your biggest obstacle in making decisions is:", opts: ["Fear of being wrong", "Too many options", "Worrying what others think", "I overthink everything"] },
  { q: "When you make a bad call, you:", opts: ["Beat myself up hard", "Analyze what went wrong", "Move on fast", "Ask others what I should have done"] },
  { q: "The decisions you struggle with most are:", opts: ["Career and money", "Relationships and people", "Daily habits", "Big life direction"] },
  { q: "What do you want most from a guide?", opts: ["Raw honesty", "Compassion first", "Strategy and a plan", "Accountability"] },
];

const HISTORY = [
  { id: 1, type: "Decision", q: "Should I leave my job to pursue my own business?", status: "decided", date: "Mar 24", framework: "decide" },
  { id: 2, type: "Talk",     q: "I still love her but I do not know what to do.",    status: "pending", date: "Mar 23", framework: "talk" },
  { id: 3, type: "Grow",     q: "Morning check-in with Aries",                        status: "complete", date: "Mar 22", framework: "grow" },
  { id: 4, type: "Decision", q: "Should I move to a new city for a fresh start?",    status: "complete", date: "Mar 19", framework: "decide" },
];

const NOTIFICATION_TYPES = [
  { id: "morning", icon: "☀️", label: "Morning Accountability", desc: "Your companion kicks off your Day and locks you into your commitments." },
  { id: "midday", icon: "⚡", label: "Midday Check-In", desc: "Halfway through — are you on track? Your guide pulls you back if you drifted." },
  { id: "closing", icon: "🌙", label: "Day Closing Reflection", desc: "End-of-day accountability. Did you honor what you said you would do?" },
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Jost:wght@200;300;400;500;600&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#07090E;--s1:#0C0F18;--s2:#111520;--gold:#C9A84C;--gold2:#E8C96A;--text:#EAE6DE;--dim:#6A6660;--border:#1A1E2C}
html,body{background:var(--bg);color:var(--text);font-family:'Jost',sans-serif;overflow-x:hidden}
.app{max-width:420px;margin:0 auto;min-height:100vh;background:var(--bg);position:relative}

/* SPLASH */
.splash{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 32px;position:relative}
.aura{position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% 10%,rgba(201,168,76,.12) 0%,transparent 65%),radial-gradient(ellipse 40% 40% at 15% 70%,rgba(155,114,207,.07) 0%,transparent 60%);pointer-events:none}
.orb-wrap{position:relative;width:160px;height:160px;margin-bottom:44px}
.orb-ring{position:absolute;border-radius:50%;border:1px solid rgba(201,168,76,.15);animation:breathe 5s ease-in-out infinite}
.orb-ring:nth-child(1){inset:0}
.orb-ring:nth-child(2){inset:-14px;border-color:rgba(201,168,76,.08);animation-delay:.5s}
.orb-ring:nth-child(3){inset:-28px;border-color:rgba(201,168,76,.04);animation-delay:1s}
.orb-core{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 38% 38%,rgba(201,168,76,.18),rgba(201,168,76,.04) 60%,transparent);display:flex;align-items:center;justify-content:center}
.orb-glyph{font-size:56px;color:var(--gold);filter:drop-shadow(0 0 24px rgba(201,168,76,.6));animation:breathe 5s ease-in-out infinite;line-height:1}
@keyframes breathe{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.06);opacity:1}}
.app-name{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:600;letter-spacing:8px;text-transform:uppercase;text-align:center;line-height:1;margin-bottom:6px}
.app-tag{font-size:10px;letter-spacing:5px;color:var(--gold);text-transform:uppercase;text-align:center;margin-bottom:40px;font-weight:300}
.splash-copy{font-size:15px;color:var(--dim);text-align:center;line-height:1.8;max-width:270px;margin-bottom:56px;font-weight:300}
.btn-gold{background:linear-gradient(135deg,#C9A84C,#A8832A);color:#07090E;border:none;padding:15px 52px;font-family:'Cormorant Garamond',serif;font-size:14px;letter-spacing:4px;text-transform:uppercase;font-weight:600;cursor:pointer;border-radius:1px;transition:all .3s;box-shadow:0 4px 28px rgba(201,168,76,.25)}
.btn-gold:hover{transform:translateY(-2px);box-shadow:0 8px 40px rgba(201,168,76,.4)}
.btn-ghost{background:transparent;color:var(--dim);border:1px solid var(--border);padding:13px 40px;font-family:'Jost',sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;border-radius:1px;margin-top:12px;transition:all .3s}
.btn-ghost:hover{border-color:rgba(201,168,76,.4);color:var(--gold)}

/* SHARED */
.screen{min-height:100vh;padding:56px 24px 120px;animation:fadeUp .35s ease forwards}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.eyebrow{font-size:10px;letter-spacing:4px;color:var(--gold);text-transform:uppercase;margin-bottom:8px}
.heading{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500;line-height:1.25;margin-bottom:6px}
.sub{font-size:13px;color:var(--dim);line-height:1.7;font-weight:300;margin-bottom:36px}
.prog-track{height:1px;background:var(--border);margin-bottom:48px}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--gold2));transition:width .5s ease}
.q-num{font-size:11px;letter-spacing:3px;color:var(--dim);margin-bottom:14px;text-transform:uppercase}
.q-text{font-size:19px;font-weight:400;line-height:1.5;margin-bottom:36px}
.opts{display:flex;flex-direction:column;gap:10px}
.opt{background:var(--s1);border:1px solid var(--border);color:var(--text);padding:16px 18px;border-radius:2px;text-align:left;font-family:'Jost',sans-serif;font-size:14px;font-weight:300;cursor:pointer;transition:all .2s;line-height:1.4}
.opt:hover{border-color:rgba(201,168,76,.4);background:var(--s2);transform:translateX(4px)}
.opt.sel{border-color:var(--gold);background:rgba(201,168,76,.08);color:var(--gold)}
.clist{display:flex;flex-direction:column;gap:12px}
.ccard{background:var(--s1);border:1px solid var(--border);border-radius:3px;padding:18px;cursor:pointer;transition:all .25s;display:flex;align-items:center;gap:16px;position:relative;overflow:hidden}
.ccard::after{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--cc);opacity:0;transition:opacity .25s}
.ccard:hover::after,.ccard.sel::after{opacity:1}
.ccard:hover,.ccard.sel{border-color:var(--cb);background:var(--cbg);transform:translateX(3px)}
.ccard.master{border-color:rgba(201,168,76,.2)}
.csym{font-size:28px;width:40px;text-align:center;flex-shrink:0}
.cbody{flex:1;min-width:0}
.cname{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;margin-bottom:1px}
.ctitle{font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;opacity:.7}
.cdesc{font-size:12px;color:var(--dim);line-height:1.5;font-weight:300}
.mpill{font-size:8px;letter-spacing:2px;text-transform:uppercase;border:1px solid rgba(201,168,76,.4);color:var(--gold);padding:3px 7px;border-radius:1px;flex-shrink:0}
.btn-full{width:100%;margin-top:24px;background:linear-gradient(135deg,#C9A84C,#A8832A);color:#07090E;border:none;padding:16px;font-family:'Cormorant Garamond',serif;font-size:14px;letter-spacing:4px;text-transform:uppercase;font-weight:600;cursor:pointer;border-radius:1px;transition:all .3s}
.btn-full:hover{box-shadow:0 4px 28px rgba(201,168,76,.35)}
.btn-full:disabled{opacity:.3;cursor:not-allowed}

/* DASHBOARD */
.dash-top{padding:48px 24px 28px;border-bottom:1px solid var(--border);background:linear-gradient(180deg,var(--s1) 0%,transparent 100%);position:relative}
.dash-top::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
.dgreet{font-size:11px;letter-spacing:3px;color:var(--gold);text-transform:uppercase;margin-bottom:4px}
.dtitle{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500;margin-bottom:18px}
.aguide{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--s1);border:1px solid var(--border);border-radius:3px;cursor:pointer;transition:all .2s}
.aguide:hover{border-color:rgba(201,168,76,.3)}
.agsym{font-size:22px}
.aginfo{flex:1}
.aglabel{font-size:9px;letter-spacing:2px;color:var(--dim);text-transform:uppercase}
.agname{font-family:'Cormorant Garamond',serif;font-size:16px}
.agsubtitle{font-size:10px;color:var(--dim)}

/* THREE FRAMEWORK CARDS */
.frameworks{padding:24px 24px 0;display:flex;flex-direction:column;gap:14px}
.fw-card{border-radius:4px;padding:20px;cursor:pointer;transition:all .3s;position:relative;overflow:hidden;border:1px solid var(--border)}
.fw-card:hover{transform:translateY(-2px)}
.fw-card.decide{background:linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.03));border-color:rgba(201,168,76,0.25)}
.fw-card.talk{background:linear-gradient(135deg,rgba(224,122,138,0.08),rgba(224,122,138,0.03));border-color:rgba(224,122,138,0.25)}
.fw-card.grow{background:linear-gradient(135deg,rgba(91,155,213,0.08),rgba(91,155,213,0.03));border-color:rgba(91,155,213,0.25)}
.fw-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--fw-accent),transparent)}
.fw-card.decide::before{--fw-accent:rgba(201,168,76,0.6)}
.fw-card.talk::before{--fw-accent:rgba(224,122,138,0.6)}
.fw-card.grow::before{--fw-accent:rgba(91,155,213,0.6)}
.fw-top{display:flex;align-items:center;gap:12px;margin-bottom:8px}
.fw-icon{font-size:24px}
.fw-label{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600}
.fw-sub{font-size:12px;color:var(--dim);font-weight:300;line-height:1.5;margin-bottom:12px}
.fw-action{font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:500}
.fw-card.decide .fw-action{color:#C9A84C}
.fw-card.talk .fw-action{color:#E07A8A}
.fw-card.grow .fw-action{color:#5B9BD5}

/* NUDGE CARD */
.nudge-card{margin:20px 24px 0;background:linear-gradient(135deg,rgba(201,168,76,0.06),rgba(201,168,76,0.02));border:1px solid rgba(201,168,76,0.2);border-radius:4px;padding:18px 18px 16px;position:relative;overflow:hidden}
.nudge-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.6),transparent)}
.nudge-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.nudge-from{display:flex;align-items:center;gap:8px}
.nudge-sym{font-size:16px}
.nudge-from-label{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--gold)}
.nudge-cname{font-family:'Cormorant Garamond',serif;font-size:13px;margin-left:2px}
.nudge-time{font-size:10px;color:var(--dim)}
.nudge-msg{font-size:15px;line-height:1.7;font-weight:300;margin-bottom:14px;font-style:italic}
.nudge-actions{display:flex;gap:10px}
.nudge-btn{flex:1;background:transparent;border:1px solid var(--border);color:var(--dim);padding:8px;border-radius:2px;font-family:'Jost',sans-serif;font-size:11px;cursor:pointer;transition:all .2s;text-transform:uppercase;letter-spacing:1px}
.nudge-btn:hover{border-color:rgba(201,168,76,.4);color:var(--gold)}
.nudge-btn.primary{background:rgba(201,168,76,.12);border-color:rgba(201,168,76,.3);color:var(--gold)}

/* HISTORY */
.slabel{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--dim);padding:28px 24px 14px}
.hlist{padding:0 24px;display:flex;flex-direction:column;gap:10px}
.hcard{background:var(--s1);border:1px solid var(--border);border-radius:3px;padding:16px;cursor:pointer;transition:all .2s;display:flex;align-items:flex-start;gap:12px}
.hcard:hover{transform:translateY(-1px);background:var(--s2)}
.hcard-icon{font-size:18px;flex-shrink:0;margin-top:1px}
.hcard-body{flex:1}
.htop{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.htype{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--gold)}
.hdate{font-size:11px;color:var(--dim)}
.hq{font-size:14px;line-height:1.5;margin-bottom:8px;font-weight:400}
.hstat{display:flex;align-items:center;gap:6px}
.dot{width:6px;height:6px;border-radius:50%}
.dot.pending{background:#C9A84C;box-shadow:0 0 6px rgba(201,168,76,.7)}
.dot.decided{background:#5B9BD5;box-shadow:0 0 6px rgba(91,155,213,.7)}
.dot.complete{background:#5BAD8A;box-shadow:0 0 6px rgba(91,173,138,.7)}
.hstxt{font-size:11px;color:var(--dim);text-transform:capitalize}

/* FRAME */
.frame-screen{min-height:100vh;padding:56px 24px 40px;animation:fadeUp .35s ease}
.fstep{margin-bottom:32px}
.fq{font-size:17px;font-weight:400;margin-bottom:12px;line-height:1.4}
.finput{width:100%;background:var(--s1);border:1px solid var(--border);border-radius:2px;padding:14px 16px;color:var(--text);font-family:'Jost',sans-serif;font-size:14px;font-weight:300;outline:none;transition:border-color .25s;resize:none;min-height:68px;line-height:1.6}
.finput::placeholder{color:var(--dim)}
.finput:focus{border-color:rgba(201,168,76,.4)}
.fbox{background:var(--s1);border:1px solid rgba(201,168,76,.2);border-radius:3px;padding:20px;margin-bottom:24px}
.fboxtitle{font-family:'Cormorant Garamond',serif;font-size:14px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:16px}
.frow{margin-bottom:12px}
.frlabel{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--dim);margin-bottom:3px}
.frval{font-size:14px;line-height:1.5}

/* TALK SCREEN */
.talk-screen{min-height:100vh;padding:56px 24px 40px;animation:fadeUp .35s ease}
.companion-pick{display:flex;flex-direction:column;gap:10px;margin-bottom:24px}
.cpick{background:var(--s1);border:1px solid var(--border);border-radius:3px;padding:14px 16px;cursor:pointer;transition:all .25s;display:flex;align-items:center;gap:12px}
.cpick:hover,.cpick.sel{border-color:var(--cb);background:var(--cbg);transform:translateX(3px)}
.cpick-sym{font-size:22px;width:30px;text-align:center;flex-shrink:0}
.cpick-name{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:500}
.cpick-role{font-size:10px;letter-spacing:1px;opacity:.7}

/* GROW SCREEN */
.grow-screen{min-height:100vh;padding:56px 24px 40px;animation:fadeUp .35s ease}
.grow-stats{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:28px}
.stat-card{background:var(--s1);border:1px solid var(--border);border-radius:3px;padding:16px;text-align:center}
.stat-num{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:var(--gold);line-height:1}
.stat-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--dim);margin-top:4px}
.habit-list{display:flex;flex-direction:column;gap:10px;margin-bottom:28px}
.habit-item{background:var(--s1);border:1px solid var(--border);border-radius:3px;padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all .2s}
.habit-item:hover{border-color:rgba(201,168,76,.3)}
.habit-check{width:20px;height:20px;border-radius:50%;border:1px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;transition:all .2s}
.habit-item.done .habit-check{background:var(--gold);border-color:var(--gold);color:#07090E}
.habit-text{flex:1;font-size:14px;font-weight:300}
.habit-item.done .habit-text{color:var(--dim);text-decoration:line-through}

/* CHAT */
.chat-screen{display:flex;flex-direction:column;height:100vh;animation:fadeUp .35s ease}
.chat-head{padding:44px 20px 16px;background:var(--s1);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:14px;flex-shrink:0;position:relative}
.chat-mode-badge{position:absolute;top:48px;right:20px;font-size:8px;letter-spacing:2px;text-transform:uppercase;padding:3px 8px;border-radius:10px;font-weight:500}
.chat-mode-badge.decide{background:rgba(201,168,76,.15);color:var(--gold);border:1px solid rgba(201,168,76,.3)}
.chat-mode-badge.talk{background:rgba(224,122,138,.15);color:#E07A8A;border:1px solid rgba(224,122,138,.3)}
.chat-mode-badge.grow{background:rgba(91,155,213,.15);color:#5B9BD5;border:1px solid rgba(91,155,213,.3)}
.chat-back{font-size:22px;cursor:pointer;color:var(--dim);transition:color .2s;line-height:1}
.chat-back:hover{color:var(--gold)}
.chat-csym{font-size:26px;flex-shrink:0}
.chat-cname{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600}
.chat-ctitle{font-size:9px;letter-spacing:2px;color:var(--dim);text-transform:uppercase}
.chat-msgs{flex:1;overflow-y:auto;padding:20px 20px 8px;display:flex;flex-direction:column;gap:14px;scroll-behavior:smooth}
.chat-msgs::-webkit-scrollbar{width:0}
.msg{max-width:92%;padding:14px 16px;font-size:14px;line-height:1.8;font-weight:300}
.msg.ai{align-self:flex-start;background:var(--s1);border:1px solid var(--border);border-radius:2px 12px 12px 12px}
.msg.user{align-self:flex-end;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.2);border-radius:12px 2px 12px 12px}
.msg-who{font-size:9px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;font-weight:600}
.msg-text{white-space:pre-wrap;word-break:break-word;font-size:13.5px;line-height:1.8}
.cursor{display:inline-block;width:2px;height:13px;background:var(--gold);margin-left:2px;vertical-align:middle;animation:blink-cursor .7s ease-in-out infinite}
@keyframes blink-cursor{0%,100%{opacity:1}50%{opacity:0}}
.thinking-portal{align-self:flex-start;background:var(--s1);border:1px solid rgba(201,168,76,.25);border-radius:2px 12px 12px 12px;padding:16px 18px;max-width:88%}
.tp-label{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:12px;font-weight:500}
.tp-paths{display:flex;flex-direction:column;gap:8px}
.tp-path{display:flex;align-items:center;gap:10px;font-size:12px;color:var(--dim);font-weight:300}
.tp-dot{width:5px;height:5px;border-radius:50%;background:var(--gold);flex-shrink:0;opacity:.2;animation:pathpulse 2s ease-in-out infinite}
@keyframes pathpulse{0%,100%{opacity:.15;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}}
.tp-bar{height:1px;background:var(--border);margin-top:14px;overflow:hidden}
.tp-bar-fill{height:100%;background:linear-gradient(90deg,transparent,var(--gold),transparent);animation:scanbar 1.8s ease-in-out infinite}
@keyframes scanbar{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
.retry-btn{background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.3);color:var(--gold);padding:10px 20px;border-radius:2px;font-family:'Jost',sans-serif;font-size:12px;cursor:pointer;margin-top:10px;transition:all .2s;display:block;width:100%;text-align:center}
.chat-bar{padding:12px 16px 28px;background:rgba(7,9,14,.95);border-top:1px solid var(--border);backdrop-filter:blur(12px);display:flex;align-items:flex-end;gap:10px;flex-shrink:0}
.cinput{flex:1;background:var(--s1);border:1px solid var(--border);border-radius:3px;padding:11px 13px;color:var(--text);font-family:'Jost',sans-serif;font-size:14px;font-weight:300;outline:none;resize:none;max-height:120px;line-height:1.5;transition:border-color .2s}
.cinput::placeholder{color:var(--dim)}
.cinput:focus{border-color:rgba(201,168,76,.35)}
.csend{background:var(--gold);border:none;color:#07090E;width:38px;height:38px;border-radius:3px;cursor:pointer;font-size:17px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s;font-weight:700}
.csend:hover{background:var(--gold2)}
.csend:disabled{opacity:.4;cursor:not-allowed}

/* NAV */
.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:420px;background:rgba(7,9,14,.96);border-top:1px solid var(--border);backdrop-filter:blur(20px);display:flex;padding:10px 0 22px;z-index:100}
.bni{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;transition:all .2s;padding:4px 0}
.bni-icon{font-size:18px;opacity:.3;transition:all .2s}
.bni-label{font-size:8px;letter-spacing:1.5px;text-transform:uppercase;color:var(--dim);opacity:.3;transition:all .2s}
.bni.on .bni-icon,.bni.on .bni-label{opacity:1}
.bni.on .bni-label{color:var(--gold)}

/* NUDGE SETUP */
.nudge-setup{min-height:100vh;padding:56px 24px 120px;animation:fadeUp .35s ease}
.nudge-types{display:flex;flex-direction:column;gap:12px;margin-bottom:32px}
.nudge-type-card{background:var(--s1);border:1px solid var(--border);border-radius:3px;padding:16px 18px;cursor:pointer;transition:all .25s;display:flex;align-items:center;gap:14px}
.nudge-type-card.sel{border-color:rgba(201,168,76,.5);background:rgba(201,168,76,.06)}
.nudge-type-card:hover{border-color:rgba(201,168,76,.3);transform:translateX(3px)}
.nt-icon{font-size:22px;width:32px;text-align:center;flex-shrink:0}
.nt-body{flex:1}
.nt-label{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:500;margin-bottom:2px}
.nt-desc{font-size:12px;color:var(--dim);font-weight:300}
.nt-check{width:18px;height:18px;border-radius:50%;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:10px;transition:all .25s;flex-shrink:0}
.nudge-type-card.sel .nt-check{background:var(--gold);border-color:var(--gold);color:#07090E}
.time-label{font-size:11px;letter-spacing:3px;color:var(--dim);text-transform:uppercase;margin-bottom:12px}
.time-opts{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:32px}
.time-opt{background:var(--s1);border:1px solid var(--border);padding:10px 16px;border-radius:2px;font-family:'Jost',sans-serif;font-size:13px;cursor:pointer;transition:all .2s;color:var(--dim)}
.time-opt.sel{border-color:var(--gold);color:var(--gold);background:rgba(201,168,76,.08)}

/* LOGO */
.dm-logo{width:180px;height:180px;object-fit:contain;margin-bottom:32px;filter:drop-shadow(0 0 32px rgba(155,114,207,.7)) drop-shadow(0 0 64px rgba(201,68,76,.3));animation:breathe 5s ease-in-out infinite;cursor:pointer;user-select:none;-webkit-user-select:none}
.logo-tap-hint{font-size:9px;letter-spacing:2px;color:rgba(155,114,207,.4);text-transform:uppercase;margin-top:-20px;margin-bottom:28px;text-align:center;transition:opacity .3s}

/* ADMIN PANEL OVERLAY */
.admin-overlay{position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:1000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;animation:fadeUp .25s ease}
.admin-panel{background:var(--s1);border:1px solid rgba(155,114,207,.4);border-radius:4px;padding:28px 24px;width:100%;max-width:360px;position:relative}
.admin-panel::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(155,114,207,.8),transparent)}
.admin-eyebrow{font-size:9px;letter-spacing:4px;color:#9B72CF;text-transform:uppercase;margin-bottom:6px}
.admin-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;margin-bottom:4px}
.admin-sub{font-size:12px;color:var(--dim);margin-bottom:24px;font-weight:300}
.admin-input{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:2px;padding:13px 16px;color:var(--text);font-family:'Jost',sans-serif;font-size:15px;letter-spacing:4px;text-transform:uppercase;outline:none;transition:border-color .25s;text-align:center}
.admin-input:focus{border-color:rgba(155,114,207,.5)}
.admin-input::placeholder{letter-spacing:2px;text-transform:none;font-size:13px}
.admin-error{font-size:12px;color:#E07A8A;text-align:center;margin-top:10px;min-height:18px}
.admin-close{position:absolute;top:16px;right:16px;background:none;border:none;color:var(--dim);font-size:20px;cursor:pointer;transition:color .2s;line-height:1}
.admin-close:hover{color:var(--text)}
.admin-unlocked{text-align:center;padding:8px 0}
.admin-unlocked-icon{font-size:40px;margin-bottom:12px}
.admin-unlocked-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:#9B72CF;margin-bottom:8px}
.admin-tier-btns{display:flex;flex-direction:column;gap:10px;margin-top:20px}
.tier-btn{background:var(--bg);border:1px solid var(--border);color:var(--text);padding:13px 16px;border-radius:2px;font-family:'Jost',sans-serif;font-size:13px;cursor:pointer;transition:all .2s;text-align:left;display:flex;align-items:center;justify-content:space-between}
.tier-btn:hover{border-color:rgba(155,114,207,.4);background:rgba(155,114,207,.05)}
.tier-btn.active{border-color:#9B72CF;background:rgba(155,114,207,.1);color:#9B72CF}
.tier-badge{font-size:9px;letter-spacing:2px;text-transform:uppercase;padding:3px 8px;border-radius:10px;background:rgba(155,114,207,.2);color:#9B72CF}
.feedback-count{background:rgba(155,114,207,.15);border:1px solid rgba(155,114,207,.3);border-radius:2px;padding:10px 14px;margin-top:16px}
.feedback-count-label{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#9B72CF;margin-bottom:6px}
.feedback-count-num{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--text)}

/* FEEDBACK MODAL */
.feedback-overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:999;display:flex;align-items:flex-end;justify-content:center;animation:fadeUp .2s ease}
.feedback-modal{background:var(--s1);border:1px solid var(--border);border-radius:4px 4px 0 0;padding:28px 24px 40px;width:100%;max-width:420px;position:relative}
.feedback-modal::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
.feedback-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;margin-bottom:6px}
.feedback-sub{font-size:13px;color:var(--dim);font-weight:300;margin-bottom:24px}
.feedback-rating{display:flex;gap:16px;margin-bottom:20px}
.rating-btn{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:3px;padding:16px;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;transition:all .25s}
.rating-btn:hover{transform:translateY(-2px)}
.rating-btn.up.sel{border-color:rgba(91,173,138,.6);background:rgba(91,173,138,.08)}
.rating-btn.down.sel{border-color:rgba(224,122,138,.6);background:rgba(224,122,138,.08)}
.rating-icon{font-size:28px}
.rating-label{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--dim)}
.feedback-textarea{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:2px;padding:13px 16px;color:var(--text);font-family:'Jost',sans-serif;font-size:14px;font-weight:300;outline:none;resize:none;min-height:90px;line-height:1.6;transition:border-color .25s;margin-bottom:16px}
.feedback-textarea::placeholder{color:var(--dim)}
.feedback-textarea:focus{border-color:rgba(201,168,76,.35)}
.feedback-success{text-align:center;padding:20px 0}
.feedback-success-icon{font-size:36px;margin-bottom:12px}
.feedback-success-title{font-family:'Cormorant Garamond',serif;font-size:20px;margin-bottom:6px}
.feedback-success-sub{font-size:13px;color:var(--dim);font-weight:300}

/* FEEDBACK TRIGGER BUTTON */
.feedback-trigger{position:fixed;bottom:90px;right:16px;width:44px;height:44px;border-radius:50%;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.3);color:var(--gold);font-size:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:90;transition:all .2s;max-width:420px}
.feedback-trigger:hover{background:rgba(201,168,76,.2);transform:scale(1.1)}

/* PERMISSION BANNER */
.perm-banner{background:rgba(91,155,213,0.08);border:1px solid rgba(91,155,213,0.25);border-radius:3px;padding:14px 16px;margin-bottom:20px;display:flex;align-items:flex-start;gap:12px}
.perm-icon{font-size:18px;flex-shrink:0;margin-top:1px}
.perm-body{flex:1}
.perm-title{font-size:12px;font-weight:500;margin-bottom:3px;color:#5B9BD5}
.perm-desc{font-size:11px;color:var(--dim);font-weight:300;line-height:1.5}

/* ACCOUNTABILITY BANNER ON DASH */
.acct-banner{margin:16px 24px 0;background:rgba(232,117,74,0.06);border:1px solid rgba(232,117,74,0.2);border-radius:3px;padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all .2s}
.acct-banner:hover{border-color:rgba(232,117,74,0.4)}
.acct-dot{width:8px;height:8px;border-radius:50%;background:#E8754A;box-shadow:0 0 8px rgba(232,117,74,.6);flex-shrink:0;animation:acctpulse 2s ease-in-out infinite}
@keyframes acctpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.3)}}
.acct-text{flex:1;font-size:13px;font-weight:300;color:var(--text);line-height:1.5}
.acct-name{font-family:'Cormorant Garamond',serif;font-size:11px;color:#E8754A;margin-bottom:2px;letter-spacing:1px;text-transform:uppercase}
`;

const HABIT_DEFAULTS = [
  { id: 1, text: "Morning reflection — 5 minutes", done: false },
  { id: 2, text: "Physical movement today", done: false },
  { id: 3, text: "Review one goal and take one step", done: false },
  { id: 4, text: "Drink enough water", done: false },
  { id: 5, text: "End the day with gratitude", done: false },
];

function FrameStep({ fq, value, active, locked, onSubmit }) {
  const [val, setVal] = useState(value || "");
  if (locked) return (
    <div className="fstep">
      <div className="fq" style={{ color: "var(--dim)", fontSize: 13 }}>{fq.prompt}</div>
      <div style={{ fontSize: 14, paddingLeft: 4, color: "var(--text)" }}>{value}</div>
    </div>
  );
  return (
    <div className="fstep">
      <div className="fq">{fq.prompt}</div>
      <textarea className="finput" placeholder={fq.placeholder} value={val} onChange={e => setVal(e.target.value)} autoFocus={active} rows={2} />
      {active && <button className="btn-full" style={{ marginTop: 10 }} disabled={!val.trim()} onClick={() => onSubmit(val.trim())}>Next</button>}
    </div>
  );
}

function ThinkingPortal({ name, mode }) {
  const lines = {
    decide: ["Feeling the weight of your situation", "Identifying your core paths", "Mapping outcomes for each path", "Finding what most people miss", "Preparing your recommendation"],
    talk: ["Opening a safe space for you", "Tuning in to what you need", "Preparing to listen deeply"],
    grow: ["Checking in on your journey", "Reviewing your commitments", "Building your growth response"],
  };
  return (
    <div className="thinking-portal">
      <div className="tp-label">{name} is with you</div>
      <div className="tp-paths">
        {(lines[mode] || lines.decide).map((t, i) => (
          <div key={i} className="tp-path">
            <div className="tp-dot" style={{ animationDelay: `${i * 0.25}s` }} />
            <span>{t}</span>
          </div>
        ))}
      </div>
      <div className="tp-bar"><div className="tp-bar-fill" /></div>
    </div>
  );
}

function NudgeCard({ companion, onRespond, onDismiss }) {
  const nudge = companion.nudges[new Date().getDay() % companion.nudges.length];
  const hours = new Date().getHours();
  const timeLabel = hours < 12 ? "Morning Nudge" : hours < 17 ? "Afternoon Check-In" : "Evening Reflection";
  return (
    <div className="nudge-card">
      <div className="nudge-top">
        <div className="nudge-from">
          <span className="nudge-sym" style={{ color: companion.color }}>{companion.symbol}</span>
          <span className="nudge-from-label">{timeLabel} from</span>
          <span className="nudge-cname">{companion.name}</span>
        </div>
        <span className="nudge-time">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
      <div className="nudge-msg">"{nudge}"</div>
      <div className="nudge-actions">
        <button className="nudge-btn primary" onClick={onRespond}>Respond</button>
        <button className="nudge-btn" onClick={onDismiss}>Acknowledge</button>
      </div>
    </div>
  );
}

// ─── NOTIFICATION ENGINE ───────────────────────────────────────────────────────

async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  const result = await Notification.requestPermission();
  return result;
}

function parseTime(timeStr) {
  // e.g. "6:00 AM", "12:00 PM"
  const [timePart, period] = timeStr.split(" ");
  const [hourStr, minStr] = timePart.split(":");
  let hour = parseInt(hourStr);
  const min = parseInt(minStr);
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return { hour, min };
}

function getDelayUntil(hour, min) {
  const now = new Date();
  const target = new Date();
  target.setHours(hour, min, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target.getTime() - now.getTime();
}

function fireNotification(companion, type, habitsDone, habitsTotal) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const pool = companion[type] || companion.nudges;
  const msg = pool[Math.floor(Math.random() * pool.length)];

  let body = msg;
  if (type === "midday" || type === "closing") {
    const remaining = habitsTotal - habitsDone;
    if (remaining > 0) {
      body += ` (${remaining} habit${remaining > 1 ? "s" : ""} still open today)`;
    } else {
      body += " All habits complete — keep that energy.";
    }
  }

  new Notification(`Day Masters — ${companion.name}`, {
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: `daymasters-${type}`,
  });
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────

export default function DayMasters() {
  const [screen, setScreen] = useState("splash");
  const [assessIdx, setAssessIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [companion, setCompanion] = useState(null);
  const [nav, setNav] = useState("home");
  const [frame, setFrame] = useState({});
  const [frameStep, setFrameStep] = useState(0);
  const [frameConfirmed, setFrameConfirmed] = useState(false);
  const [talkCompanion, setTalkCompanion] = useState(null);
  const [habits, setHabits] = useState(HABIT_DEFAULTS);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatMode, setChatMode] = useState("decide");
  const [thinking, setThinking] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [lastPrompt, setLastPrompt] = useState(null);
  const [nudgeEnabled, setNudgeEnabled] = useState(false);
  const [nudgeTypes, setNudgeTypes] = useState(["morning", "midday", "closing"]);
  const [nudgeTime, setNudgeTime] = useState("6:00 AM");
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported"
  );
  const [activeAccountabilityMsg, setActiveAccountabilityMsg] = useState(null);
  const [scheduledTimers, setScheduledTimers] = useState([]);

  // Admin Easter egg
  const [logoTaps, setLogoTaps] = useState(0);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminKeyInput, setAdminKeyInput] = useState("");
  const [adminKeyError, setAdminKeyError] = useState("");
  const [activeTier, setActiveTier] = useState("free"); // "free" | "pro"
  const logoTapTimer = useRef(null);

  // Feedback system
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(null); // "up" | "down"
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);

  const msgsRef = useRef(null);
  const habitsRef = useRef(habits);

  // Keep habitsRef in sync so notification callbacks always see fresh habit data
  useEffect(() => { habitsRef.current = habits; }, [habits]);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, thinking]);

  // ── Schedule notifications whenever settings change ──────────────────────────
  useEffect(() => {
    // Clear existing timers
    scheduledTimers.forEach(t => clearTimeout(t));

    if (!nudgeEnabled || !companion || notifPermission !== "granted") return;

    const newTimers = [];

    // Morning nudge at user-selected time
    if (nudgeTypes.includes("morning")) {
      const { hour, min } = parseTime(nudgeTime);
      const delay = getDelayUntil(hour, min);
      const t = setTimeout(() => {
        const h = habitsRef.current;
        fireNotification(companion, "morning", h.filter(x => x.done).length, h.length);
        setActiveAccountabilityMsg({
          type: "morning",
          msg: companion.accountability[Math.floor(Math.random() * companion.accountability.length)],
          companion,
        });
      }, delay);
      newTimers.push(t);
    }

    // Midday check-in at noon
    if (nudgeTypes.includes("midday")) {
      const delay = getDelayUntil(12, 0);
      const t = setTimeout(() => {
        const h = habitsRef.current;
        fireNotification(companion, "midday", h.filter(x => x.done).length, h.length);
        setActiveAccountabilityMsg({
          type: "midday",
          msg: companion.midday[Math.floor(Math.random() * companion.midday.length)],
          companion,
        });
      }, delay);
      newTimers.push(t);
    }

    // Day closing at 8 PM
    if (nudgeTypes.includes("closing")) {
      const delay = getDelayUntil(20, 0);
      const t = setTimeout(() => {
        const h = habitsRef.current;
        fireNotification(companion, "closing", h.filter(x => x.done).length, h.length);
        setActiveAccountabilityMsg({
          type: "closing",
          msg: companion.closing[Math.floor(Math.random() * companion.closing.length)],
          companion,
        });
      }, delay);
      newTimers.push(t);
    }

    setScheduledTimers(newTimers);
    return () => newTimers.forEach(t => clearTimeout(t));
  }, [nudgeEnabled, companion, nudgeTypes, nudgeTime, notifPermission]);

  // ── Easter egg: tap logo 5x to open admin panel ───────────────────────────
  function handleLogoTap() {
    const next = logoTaps + 1;
    setLogoTaps(next);
    if (logoTapTimer.current) clearTimeout(logoTapTimer.current);
    if (next >= LOGO_TAP_COUNT) {
      setLogoTaps(0);
      setShowAdminPanel(true);
      setAdminKeyInput("");
      setAdminKeyError("");
    } else {
      logoTapTimer.current = setTimeout(() => setLogoTaps(0), 2000);
    }
  }

  function submitAdminKey() {
    if (adminKeyInput.toUpperCase() === ADMIN_KEY) {
      setAdminUnlocked(true);
      setAdminKeyError("");
    } else {
      setAdminKeyError("Invalid key. Try again.");
      setAdminKeyInput("");
    }
  }

  // ── Feedback ──────────────────────────────────────────────────────────────
  function submitFeedback() {
    if (!feedbackRating) return;
    const entry = {
      id: Date.now(),
      rating: feedbackRating,
      text: feedbackText,
      date: new Date().toLocaleDateString(),
      companion: companion?.name || "None",
    };
    setFeedbackList(prev => [entry, ...prev]);
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setShowFeedback(false);
      setFeedbackSubmitted(false);
      setFeedbackRating(null);
      setFeedbackText("");
    }, 2200);
  }

  async function handleEnableNotifications() {
    const perm = await requestNotificationPermission();
    setNotifPermission(perm);
    if (perm === "granted") setNudgeEnabled(true);
  }

  function toggleNudgeType(id) {
    setNudgeTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  }

  function pickOpt(opt) {
    const updated = { ...answers, [assessIdx]: opt };
    setAnswers(updated);
    if (assessIdx < ASSESS_QUESTIONS.length - 1) setTimeout(() => setAssessIdx(assessIdx + 1), 280);
    else setTimeout(() => setScreen("companions"), 350);
  }

  function saveFrameStep(val) {
    const key = FRAME_QUESTIONS[frameStep].key;
    const updated = { ...frame, [key]: val };
    setFrame(updated);
    if (frameStep < FRAME_QUESTIONS.length - 1) setFrameStep(frameStep + 1);
    else setFrameConfirmed(true);
  }

  function toggleHabit(id) {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, done: !h.done } : h));
  }

  async function callAI(systemPrompt, msgs) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 900, system: systemPrompt, messages: msgs }),
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return data.content?.[0]?.text || "";
  }

  async function runAI(systemPrompt, msgs, mode) {
    setThinking(true);
    setLastPrompt({ systemPrompt, msgs, mode });

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 900, stream: true, system: systemPrompt, messages: msgs }),
      });

      if (!res.ok || !res.body) throw new Error("stream_unavailable");

      setThinking(false);
      setStreaming(true);
      setMessages(prev => [...prev, { role: "ai", text: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";
      let gotData = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const p = JSON.parse(data);
            if (p.type === "content_block_delta" && p.delta?.text) {
              accumulated += p.delta.text;
              gotData = true;
              setMessages(prev => { const u = [...prev]; u[u.length - 1] = { role: "ai", text: accumulated }; return u; });
            }
          } catch {}
        }
      }
      setStreaming(false);
      if (!gotData) throw new Error("empty_stream");

    } catch {
      setStreaming(false);
      setThinking(true);
      try {
        const text = await callAI(systemPrompt, msgs);
        setThinking(false);
        setMessages(prev => {
          const filtered = prev.filter(m => !(m.role === "ai" && m.text === ""));
          return [...filtered, { role: "ai", text }];
        });
      } catch {
        setThinking(false);
        setMessages(prev => {
          const filtered = prev.filter(m => !(m.role === "ai" && m.text === ""));
          return [...filtered, { role: "ai", text: "I hit a snag. Tap Retry to try again." }];
        });
      }
    }
  }

  async function retryLast() {
    if (!lastPrompt || thinking || streaming) return;
    setMessages(prev => prev.filter(m => !(m.role === "ai" && (m.text === "" || m.text.includes("hit a snag")))));
    await runAI(lastPrompt.systemPrompt, lastPrompt.msgs, lastPrompt.mode);
  }

  async function startDecide() {
    setFrame({});
    setFrameStep(0);
    setFrameConfirmed(false);
    setChatMode("decide");
    setScreen("frame");
  }

  async function startTalk(selectedCompanion) {
    const c = selectedCompanion || companion;
    const intro = c.name + " is here with you.\n\nNo agenda. No decisions needed. Just talk. What is on your mind today?";
    setChatMode("talk");
    setMessages([{ role: "ai", text: intro }]);
    setScreen("chat");
  }

  async function startGrow() {
    const c = companion;
    const voice = getVoice(c, "grow");
    const donedCount = habits.filter(h => h.done).length;
    const intro = c.name + " is checking in on your growth.\n\n" + donedCount + " of " + habits.length + " habits checked off today. Let us talk about where you are.";
    const prompt = "The user is checking in on their growth and habits. " + donedCount + " out of " + habits.length + " daily habits are done today. Open a warm, motivating check-in conversation. Ask how they are feeling about their progress. Acknowledge what they have done and encourage what remains.";
    setChatMode("grow");
    setMessages([{ role: "ai", text: intro }]);
    setScreen("chat");
    await runAI(voice, [{ role: "user", content: prompt }], "grow");
  }

  async function launchDecideChat() {
    const c = companion;
    const voice = getVoice(c, "decide");
    const intro = c.name + " has your full frame.\n\nGoal: " + frame.goal + "\nTimeframe: " + frame.timeframe + "\n\nMapping your paths now...";
    const prompt = "The user has brought this decision frame:\nDecision: " + frame.decision + "\nGoal: " + frame.goal + "\nSuccess means: " + frame.success + "\nTimeframe (Their Day): " + frame.timeframe + "\nWhat is stopping them: " + frame.obstacle + "\n\nFirst acknowledge the weight of what they are facing in 1-2 warm sentences. Then present exactly 3 paths using the format in your instructions. Be specific to their actual goal. Make each path real, actionable, and distinct.";
    setChatMode("decide");
    setMessages([{ role: "ai", text: intro }]);
    setScreen("chat");
    await runAI(voice, [{ role: "user", content: prompt }], "decide");
  }

  async function sendMsg() {
    if (!chatInput.trim() || thinking || streaming) return;
    const txt = chatInput.trim();
    setChatInput("");
    const updated = [...messages, { role: "user", text: txt }];
    setMessages(updated);
    const activeCompanion = chatMode === "talk" && talkCompanion ? talkCompanion : companion;
    const voice = getVoice(activeCompanion, chatMode);
    const history = updated.filter((_, i) => i > 0).map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
    await runAI(voice, history, chatMode);
  }

  const showNudge = nudgeEnabled && !nudgeDismissed && companion;
  const activeComp = chatMode === "talk" && talkCompanion ? talkCompanion : companion;
  const lastMsg = messages[messages.length - 1];
  const showRetry = !thinking && !streaming && lastMsg?.text?.includes("hit a snag");
  const doneHabits = habits.filter(h => h.done).length;

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* SPLASH */}
        {screen === "splash" && (
          <div className="splash">
            <div className="aura" />
            <img
              src="/dayimage.png"
              alt="Day Masters"
              className="dm-logo"
              onClick={handleLogoTap}
              draggable={false}
            />
            {logoTaps > 0 && logoTaps < LOGO_TAP_COUNT && (
              <div className="logo-tap-hint">{LOGO_TAP_COUNT - logoTaps} more...</div>
            )}
            <div className="app-name">Day Masters</div>
            <div className="app-tag">The Ultimate Human Compass</div>
            <p className="splash-copy">Every decision. Every conversation. Every step forward. Your companions are here.</p>
            <button className="btn-gold" onClick={() => setScreen("assess")}>Begin</button>
            <button className="btn-ghost" onClick={() => { setNudgeEnabled(true); setScreen("companions"); }}>Returning User</button>
          </div>
        )}

        {/* ASSESSMENT */}
        {screen === "assess" && (
          <div className="screen">
            <div className="eyebrow">Self Assessment</div>
            <div className="heading">Know Yourself First</div>
            <div className="sub">Your companions are built from who you are. Answer honestly.</div>
            <div className="prog-track"><div className="prog-fill" style={{ width: `${(assessIdx / ASSESS_QUESTIONS.length) * 100}%` }} /></div>
            <div className="q-num">Question {assessIdx + 1} of {ASSESS_QUESTIONS.length}</div>
            <div className="q-text">{ASSESS_QUESTIONS[assessIdx].q}</div>
            <div className="opts">
              {ASSESS_QUESTIONS[assessIdx].opts.map((o, i) => (
                <button key={i} className={`opt ${answers[assessIdx] === o ? "sel" : ""}`} onClick={() => pickOpt(o)}>{o}</button>
              ))}
            </div>
          </div>
        )}

        {/* COMPANIONS */}
        {screen === "companions" && (
          <div className="screen">
            <div className="eyebrow">Your Inner Council</div>
            <div className="heading">Meet Your Companions</div>
            <div className="sub">Six companions. Each a mirror of a different part of you. Choose your primary guide.</div>
            <div className="clist">
              {COMPANIONS.map(c => (
                <div key={c.id} className={`ccard ${c.master ? "master" : ""} ${companion?.id === c.id ? "sel" : ""}`}
                  style={{ "--cc": c.color, "--cbg": c.bg, "--cb": c.border }} onClick={() => setCompanion(c)}>
                  <div className="csym" style={{ color: c.color, filter: `drop-shadow(0 0 10px ${c.color})` }}>{c.symbol}</div>
                  <div className="cbody">
                    <div className="cname">{c.name}</div>
                    <div className="ctitle" style={{ color: c.color }}>{c.title} &middot; {c.role}</div>
                    <div className="cdesc">{c.desc}</div>
                  </div>
                  {c.master && <div className="mpill">Master</div>}
                </div>
              ))}
            </div>
            <button className="btn-full" disabled={!companion} onClick={() => setScreen("nudge-setup")}>
              Continue with {companion?.name || "..."}
            </button>
          </div>
        )}

        {/* NUDGE SETUP — REBUILT WITH ACCOUNTABILITY */}
        {screen === "nudge-setup" && (
          <div className="nudge-setup">
            <div className="eyebrow">Accountability</div>
            <div className="heading">{companion?.name} Can Hold You To It</div>
            <div className="sub">
              Your companion will reach out during your Day to make sure you are doing what you said you would do — not just at a set time, but at the moments that matter most.
            </div>

            {/* Permission state */}
            {notifPermission === "unsupported" && (
              <div className="perm-banner">
                <div className="perm-icon">⚠️</div>
                <div className="perm-body">
                  <div className="perm-title">Notifications Not Supported</div>
                  <div className="perm-desc">Your browser does not support push notifications. In-app nudges will still appear when you open Day Masters.</div>
                </div>
              </div>
            )}

            {notifPermission === "denied" && (
              <div className="perm-banner" style={{ background: "rgba(232,117,74,0.06)", borderColor: "rgba(232,117,74,0.25)" }}>
                <div className="perm-icon">🔒</div>
                <div className="perm-body">
                  <div className="perm-title" style={{ color: "#E8754A" }}>Notifications Blocked</div>
                  <div className="perm-desc">Enable notifications in your browser settings so {companion?.name} can reach you outside the app.</div>
                </div>
              </div>
            )}

            <div style={{ fontSize: 13, color: "var(--dim)", marginBottom: 16, fontWeight: 300 }}>
              Should {companion?.name} hold you accountable throughout your Day?
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
              <button
                className={`opt ${nudgeEnabled ? "sel" : ""}`}
                style={{ flex: 1, textAlign: "center" }}
                onClick={async () => {
                  if (notifPermission !== "granted") {
                    await handleEnableNotifications();
                  } else {
                    setNudgeEnabled(true);
                  }
                }}
              >
                Yes, hold me to it
              </button>
              <button
                className={`opt ${!nudgeEnabled ? "sel" : ""}`}
                style={{ flex: 1, textAlign: "center" }}
                onClick={() => setNudgeEnabled(false)}
              >
                Not right now
              </button>
            </div>

            {nudgeEnabled && (
              <>
                {/* Notification Type Selection */}
                <div className="time-label" style={{ marginBottom: 14 }}>When should {companion?.name} reach out?</div>
                <div className="nudge-types">
                  {NOTIFICATION_TYPES.map(nt => (
                    <div
                      key={nt.id}
                      className={`nudge-type-card ${nudgeTypes.includes(nt.id) ? "sel" : ""}`}
                      onClick={() => toggleNudgeType(nt.id)}
                    >
                      <div className="nt-icon">{nt.icon}</div>
                      <div className="nt-body">
                        <div className="nt-label">{nt.label}</div>
                        <div className="nt-desc">{nt.desc}</div>
                      </div>
                      <div className="nt-check">{nudgeTypes.includes(nt.id) ? "✓" : ""}</div>
                    </div>
                  ))}
                </div>

                {/* Morning time picker — only shown if morning is selected */}
                {nudgeTypes.includes("morning") && (
                  <>
                    <div className="time-label" style={{ marginTop: 24 }}>Morning start time</div>
                    <div className="time-opts">
                      {["5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM"].map(t => (
                        <button key={t} className={`time-opt ${nudgeTime === t ? "sel" : ""}`} onClick={() => setNudgeTime(t)}>{t}</button>
                      ))}
                    </div>
                  </>
                )}

                <div style={{ fontSize: 11, color: "var(--dim)", lineHeight: 1.6, marginBottom: 8, fontWeight: 300 }}>
                  {nudgeTypes.includes("midday") && "Midday check-in fires at 12:00 PM. "}
                  {nudgeTypes.includes("closing") && "Day closing fires at 8:00 PM."}
                </div>
              </>
            )}

            <button className="btn-full" style={{ marginTop: 8 }} onClick={() => setScreen("dash")}>
              Enter Day Masters
            </button>
          </div>
        )}

        {/* DASHBOARD */}
        {screen === "dash" && (
          <div style={{ paddingBottom: 100 }}>
            <div className="dash-top">
              <div className="dgreet">Good Day</div>
              <div className="dtitle">How can I serve you today?</div>
              {companion && (
                <div className="aguide" onClick={() => setNav("council")}>
                  <div className="agsym" style={{ color: companion.color }}>{companion.symbol}</div>
                  <div className="aginfo">
                    <div className="aglabel">Your Companion</div>
                    <div className="agname">{companion.name}</div>
                    <div className="agsubtitle">{companion.title}</div>
                  </div>
                  <div style={{ color: "var(--dim)" }}>›</div>
                </div>
              )}
            </div>

            {nav === "home" && (
              <>
                {/* In-app accountability banner when notification fires */}
                {activeAccountabilityMsg && (
                  <div
                    className="acct-banner"
                    onClick={() => {
                      setActiveAccountabilityMsg(null);
                      setChatMode("grow");
                      startGrow();
                    }}
                  >
                    <div className="acct-dot" />
                    <div style={{ flex: 1 }}>
                      <div className="acct-name">{activeAccountabilityMsg.companion.name} — Accountability</div>
                      <div className="acct-text">{activeAccountabilityMsg.msg}</div>
                    </div>
                    <div style={{ color: "var(--dim)", fontSize: 16 }}>›</div>
                  </div>
                )}

                {showNudge && (
                  <NudgeCard
                    companion={companion}
                    onRespond={() => { setChatMode("talk"); startTalk(companion); setNudgeDismissed(true); }}
                    onDismiss={() => setNudgeDismissed(true)}
                  />
                )}

                {/* THREE FRAMEWORKS */}
                <div className="frameworks">
                  <div className="fw-card decide" onClick={startDecide}>
                    <div className="fw-top">
                      <span className="fw-icon">&#9654;</span>
                      <span className="fw-label" style={{ color: "#C9A84C" }}>Decide</span>
                    </div>
                    <div className="fw-sub">You have a choice to make. Your companion maps your parallel paths, shows you the outcomes, and holds you to the one you choose.</div>
                    <div className="fw-action">Build my decision frame &rarr;</div>
                  </div>

                  <div className="fw-card talk" onClick={() => setScreen("talk-select")}>
                    <div className="fw-top">
                      <span className="fw-icon">&#9825;</span>
                      <span className="fw-label" style={{ color: "#E07A8A" }}>Talk</span>
                    </div>
                    <div className="fw-sub">No decision needed. Just open up. Philosophy, life, relationships, pain, purpose — whatever is sitting on you right now.</div>
                    <div className="fw-action">Open a conversation &rarr;</div>
                  </div>

                  <div className="fw-card grow" onClick={() => setScreen("grow-dash")}>
                    <div className="fw-top">
                      <span className="fw-icon">&#9651;</span>
                      <span className="fw-label" style={{ color: "#5B9BD5" }}>Grow</span>
                    </div>
                    <div className="fw-sub">Your companion checks in on your habits, commitments, and progress. {doneHabits} of {habits.length} habits done today.</div>
                    <div className="fw-action">Check my progress &rarr;</div>
                  </div>
                </div>

                <div className="slabel">Recent Sessions</div>
                <div className="hlist">
                  {HISTORY.map(h => (
                    <div key={h.id} className="hcard">
                      <div className="hcard-icon" style={{ color: h.framework === "decide" ? "#C9A84C" : h.framework === "talk" ? "#E07A8A" : "#5B9BD5" }}>
                        {h.framework === "decide" ? "\u25B6" : h.framework === "talk" ? "\u2665" : "\u25B3"}
                      </div>
                      <div className="hcard-body">
                        <div className="htop"><span className="htype">{h.type}</span><span className="hdate">{h.date}</span></div>
                        <div className="hq">{h.q}</div>
                        <div className="hstat"><div className={`dot ${h.status}`} /><span className="hstxt">{h.status}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {nav === "council" && (
              <div style={{ padding: "0 24px 20px" }}>
                <div className="slabel" style={{ padding: "28px 0 14px" }}>Your Council</div>
                <div className="clist">
                  {COMPANIONS.map(c => (
                    <div key={c.id} className={`ccard ${c.master ? "master" : ""} ${companion?.id === c.id ? "sel" : ""}`}
                      style={{ "--cc": c.color, "--cbg": c.bg, "--cb": c.border }}
                      onClick={() => { setCompanion(c); setNav("home"); }}>
                      <div className="csym" style={{ color: c.color }}>{c.symbol}</div>
                      <div className="cbody">
                        <div className="cname">{c.name}</div>
                        <div className="ctitle" style={{ color: c.color }}>{c.title} &middot; {c.role}</div>
                        <div className="cdesc">{c.desc}</div>
                      </div>
                      {c.master && <div className="mpill">Master</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bnav">
              {[{ id: "home", icon: "\u2299", label: "Home" }, { id: "council", icon: "\u25C8", label: "Council" }, { id: "history", icon: "\u2261", label: "History" }, { id: "profile", icon: "\u25CE", label: "Profile" }].map(n => (
                <div key={n.id} className={`bni ${nav === n.id ? "on" : ""}`} onClick={() => setNav(n.id)}>
                  <div className="bni-icon">{n.icon}</div>
                  <div className="bni-label">{n.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TALK — COMPANION SELECT */}
        {screen === "talk-select" && (
          <div className="talk-screen">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <span style={{ fontSize: 22, cursor: "pointer", color: "var(--dim)" }} onClick={() => setScreen("dash")}>&#8592;</span>
              <div>
                <div className="eyebrow" style={{ marginBottom: 2 }}>Talk</div>
                <div className="heading" style={{ marginBottom: 0 }}>Who do you want to talk to?</div>
              </div>
            </div>
            <div className="sub">Pick the companion whose voice you need most right now.</div>
            <div className="companion-pick">
              {COMPANIONS.map(c => (
                <div key={c.id} className={`cpick ${talkCompanion?.id === c.id ? "sel" : ""}`}
                  style={{ "--cb": c.border, "--cbg": c.bg }}
                  onClick={() => { setTalkCompanion(c); startTalk(c); }}>
                  <div className="cpick-sym" style={{ color: c.color }}>{c.symbol}</div>
                  <div>
                    <div className="cpick-name">{c.name}</div>
                    <div className="cpick-role" style={{ color: c.color }}>{c.role}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-full" style={{ marginTop: 4 }} onClick={() => { setTalkCompanion(companion); startTalk(companion); }}>
              Talk to {companion?.name || "my companion"}
            </button>
          </div>
        )}

        {/* GROW DASHBOARD */}
        {screen === "grow-dash" && (
          <div className="grow-screen">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <span style={{ fontSize: 22, cursor: "pointer", color: "var(--dim)" }} onClick={() => setScreen("dash")}>&#8592;</span>
              <div>
                <div className="eyebrow" style={{ marginBottom: 2 }}>Grow</div>
                <div className="heading" style={{ marginBottom: 0 }}>Your Progress Today</div>
              </div>
            </div>

            <div className="grow-stats">
              <div className="stat-card">
                <div className="stat-num">{doneHabits}</div>
                <div className="stat-label">Habits Done</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">{habits.length - doneHabits}</div>
                <div className="stat-label">Remaining</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">3</div>
                <div className="stat-label">Day Streak</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">7</div>
                <div className="stat-label">Decisions Made</div>
              </div>
            </div>

            <div className="slabel" style={{ padding: "0 0 14px" }}>Today's Habits</div>
            <div className="habit-list">
              {habits.map(h => (
                <div key={h.id} className={`habit-item ${h.done ? "done" : ""}`} onClick={() => toggleHabit(h.id)}>
                  <div className="habit-check">{h.done ? "\u2713" : ""}</div>
                  <div className="habit-text">{h.text}</div>
                </div>
              ))}
            </div>

            <button className="btn-full" style={{ marginTop: 4 }} onClick={startGrow}>
              Check In with {companion?.name}
            </button>
          </div>
        )}

        {/* FRAME */}
        {screen === "frame" && (
          <div className="frame-screen">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <span style={{ fontSize: 22, cursor: "pointer", color: "var(--dim)" }} onClick={() => setScreen("dash")}>&#8592;</span>
              <div>
                <div className="eyebrow" style={{ marginBottom: 2 }}>Decide</div>
                <div className="heading" style={{ marginBottom: 0 }}>Build Your Frame</div>
              </div>
            </div>
            <div className="sub">{companion?.name} needs the full picture to map your paths accurately.</div>
            {!frameConfirmed ? (
              FRAME_QUESTIONS.slice(0, frameStep + 1).map((fq, i) => (
                <FrameStep key={fq.key} fq={fq} value={frame[fq.key] || ""} active={i === frameStep} locked={i < frameStep} onSubmit={saveFrameStep} />
              ))
            ) : (
              <>
                <div className="fbox">
                  <div className="fboxtitle">Your Decision Frame</div>
                  {FRAME_QUESTIONS.map(fq => (
                    <div key={fq.key} className="frow">
                      <div className="frlabel">{fq.prompt.replace("?", "")}</div>
                      <div className="frval">{frame[fq.key]}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: "var(--dim)", marginBottom: 24, lineHeight: 1.7, fontWeight: 300 }}>
                  {companion?.name} has your full picture and will now reveal your 3 core paths.
                </p>
                <button className="btn-full" style={{ marginTop: 0 }} onClick={launchDecideChat}>
                  Reveal My Paths with {companion?.name}
                </button>
                <button className="btn-ghost" style={{ width: "100%", marginTop: 10 }} onClick={() => { setFrameConfirmed(false); setFrameStep(0); }}>
                  Start Over
                </button>
              </>
            )}
          </div>
        )}

        {/* CHAT */}
        {screen === "chat" && activeComp && (
          <div className="chat-screen">
            <div className="chat-head">
              <div className="chat-back" onClick={() => setScreen("dash")}>&#8592;</div>
              <div className="chat-csym" style={{ color: activeComp.color }}>{activeComp.symbol}</div>
              <div style={{ flex: 1 }}>
                <div className="chat-cname">{activeComp.name}</div>
                <div className="chat-ctitle">{activeComp.title} &middot; {activeComp.role}</div>
              </div>
              <div className={`chat-mode-badge ${chatMode}`}>
                {chatMode === "decide" ? "Decide" : chatMode === "talk" ? "Talk" : "Grow"}
              </div>
            </div>
            <div className="chat-msgs" ref={msgsRef}>
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role}`}>
                  <div className="msg-who" style={{ color: m.role === "ai" ? activeComp.color : "var(--gold)" }}>
                    {m.role === "ai" ? activeComp.name : "You"}
                  </div>
                  <div className="msg-text">
                    {m.text}
                    {streaming && i === messages.length - 1 && m.role === "ai" && <span className="cursor" />}
                  </div>
                  {showRetry && i === messages.length - 1 && (
                    <button className="retry-btn" onClick={retryLast}>Tap to retry</button>
                  )}
                </div>
              ))}
              {thinking && <ThinkingPortal name={activeComp.name} mode={chatMode} />}
            </div>
            <div className="chat-bar">
              <textarea
                className="cinput"
                placeholder={chatMode === "talk" ? "Say anything — I am here..." : chatMode === "grow" ? "Tell me how it is going..." : `Say anything — ${activeComp.name} is here...`}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                rows={1}
              />
              <button className="csend" onClick={sendMsg} disabled={thinking || streaming}>&#8593;</button>
            </div>
          </div>
        )}

        {/* ADMIN PANEL OVERLAY — tap logo 5x to access */}
        {showAdminPanel && (
          <div className="admin-overlay" onClick={e => { if (e.target === e.currentTarget) setShowAdminPanel(false); }}>
            <div className="admin-panel">
              <button className="admin-close" onClick={() => setShowAdminPanel(false)}>✕</button>
              {!adminUnlocked ? (
                <>
                  <div className="admin-eyebrow">Throne Tech</div>
                  <div className="admin-title">Admin Access</div>
                  <div className="admin-sub">Enter your administrative key to unlock developer mode.</div>
                  <input
                    className="admin-input"
                    type="password"
                    placeholder="Enter admin key"
                    value={adminKeyInput}
                    onChange={e => setAdminKeyInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") submitAdminKey(); }}
                    autoFocus
                  />
                  <div className="admin-error">{adminKeyError}</div>
                  <button className="btn-full" style={{ marginTop: 16 }} disabled={!adminKeyInput} onClick={submitAdminKey}>
                    Unlock
                  </button>
                </>
              ) : (
                <>
                  <div className="admin-unlocked">
                    <div className="admin-unlocked-icon">👑</div>
                    <div className="admin-unlocked-title">Developer Mode Active</div>
                    <div style={{ fontSize: 12, color: "var(--dim)", fontWeight: 300 }}>
                      Simulate subscription tiers and view user feedback.
                    </div>
                  </div>

                  <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "var(--dim)", margin: "20px 0 10px" }}>
                    Active Tier
                  </div>
                  <div className="admin-tier-btns">
                    <button className={`tier-btn ${activeTier === "free" ? "active" : ""}`} onClick={() => setActiveTier("free")}>
                      <span>Free Plan</span>
                      {activeTier === "free" && <span className="tier-badge">Active</span>}
                    </button>
                    <button className={`tier-btn ${activeTier === "pro" ? "active" : ""}`} onClick={() => setActiveTier("pro")}>
                      <span>Pro Plan — Full Access</span>
                      {activeTier === "pro" && <span className="tier-badge">Active</span>}
                    </button>
                  </div>

                  <div className="feedback-count" style={{ marginTop: 20 }}>
                    <div className="feedback-count-label">User Feedback Submitted</div>
                    <div className="feedback-count-num">{feedbackList.length}</div>
                    {feedbackList.length > 0 && (
                      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                        {feedbackList.slice(0, 5).map(f => (
                          <div key={f.id} style={{ fontSize: 12, color: "var(--dim)", borderTop: "1px solid var(--border)", paddingTop: 8, display: "flex", gap: 8 }}>
                            <span>{f.rating === "up" ? "👍" : "👎"}</span>
                            <div>
                              <div style={{ fontSize: 10, color: "var(--gold)", marginBottom: 2 }}>{f.date} · {f.companion}</div>
                              <div>{f.text || "No comment"}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button className="btn-ghost" style={{ width: "100%", marginTop: 16 }} onClick={() => { setAdminUnlocked(false); setShowAdminPanel(false); }}>
                    Exit Admin Mode
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* FEEDBACK FLOATING BUTTON — visible on dashboard */}
        {screen === "dash" && !showFeedback && !showAdminPanel && (
          <button className="feedback-trigger" onClick={() => setShowFeedback(true)} title="Share feedback">
            💬
          </button>
        )}

        {/* FEEDBACK MODAL */}
        {showFeedback && (
          <div className="feedback-overlay" onClick={e => { if (e.target === e.currentTarget) setShowFeedback(false); }}>
            <div className="feedback-modal">
              {!feedbackSubmitted ? (
                <>
                  <div className="feedback-title">How is Day Masters serving you?</div>
                  <div className="feedback-sub">Your honesty helps us build something better. All feedback goes straight to the team.</div>
                  <div className="feedback-rating">
                    <button className={`rating-btn up ${feedbackRating === "up" ? "sel" : ""}`} onClick={() => setFeedbackRating("up")}>
                      <div className="rating-icon">👍</div>
                      <div className="rating-label">It's working</div>
                    </button>
                    <button className={`rating-btn down ${feedbackRating === "down" ? "sel" : ""}`} onClick={() => setFeedbackRating("down")}>
                      <div className="rating-icon">👎</div>
                      <div className="rating-label">Needs work</div>
                    </button>
                  </div>
                  <textarea
                    className="feedback-textarea"
                    placeholder="Tell us more — what's working, what's missing, what would make this indispensable to you..."
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    rows={3}
                  />
                  <button className="btn-full" style={{ marginTop: 0 }} disabled={!feedbackRating} onClick={submitFeedback}>
                    Submit Feedback
                  </button>
                  <button className="btn-ghost" style={{ width: "100%", marginTop: 10 }} onClick={() => setShowFeedback(false)}>
                    Not Now
                  </button>
                </>
              ) : (
                <div className="feedback-success">
                  <div className="feedback-success-icon">✨</div>
                  <div className="feedback-success-title">Thank you. Seriously.</div>
                  <div className="feedback-success-sub">Your voice shapes what Day Masters becomes. We heard you.</div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </>
  );
}

