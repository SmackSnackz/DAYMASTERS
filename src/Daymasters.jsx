import { useState, useRef, useEffect } from "react";

const COMPANIONS = [
  {
    id: "collective", name: "Solar", title: "The Collective", role: "The Singularity",
    desc: "All voices unified into one. The master. Consult Solar when the decision defines your life.",
    color: "#C9A84C", bg: "rgba(201,168,76,0.08)", border: "rgba(201,168,76,0.35)", symbol: "\u25C8", master: true,
    nudges: ["Solar is with you. Every path you walk today was chosen by you. Choose consciously.", "The universe responds to you. What decision will you lead with today?", "You are the sum of every choice you have made. Today adds another. Make it count.", "Solar sees all your paths. Which one calls to you before the noise begins?", "Every day is a new quantum moment. What version of yourself will you choose to be?"],
  },
  {
    id: "compassionate", name: "Sofia", title: "The Compassionate", role: "Heart & Empathy",
    desc: "Sofia speaks from pure love. She feels your weight before she speaks a word.",
    color: "#E07A8A", bg: "rgba(224,122,138,0.08)", border: "rgba(224,122,138,0.35)", symbol: "\u2661",
    nudges: ["Good morning. Sofia is checking in. How are you really feeling today?", "Loving yourself is the first decision of every day. Have you made it yet?", "The people in your life feel the energy you carry. What are you bringing today?", "What is one kind thing you can do for yourself before this day gets loud?", "Your heart has been carrying a lot. Take a breath. You are doing better than you think."],
  },
  {
    id: "logical", name: "Stewart", title: "The Logical", role: "Mind & Strategy",
    desc: "Stewart is the sharpest mind in the room. No emotion — just pure strategic clarity.",
    color: "#5B9BD5", bg: "rgba(91,155,213,0.08)", border: "rgba(91,155,213,0.35)", symbol: "\u27C1",
    nudges: ["Stewart here. What is the one high-leverage action you can take today?", "Discipline is a decision repeated. What decision will you repeat today?", "Have you reviewed your goals this week? Clarity requires maintenance.", "Small consistent actions compound into extraordinary results. What is today's action?", "Are your habits today aligned with where you said you wanted to go?"],
  },
  {
    id: "realist", name: "Drax", title: "The Realist", role: "Ground & Truth",
    desc: "Drax keeps it all the way real. Street wisdom meets radical honesty.",
    color: "#A8A8A8", bg: "rgba(168,168,168,0.08)", border: "rgba(168,168,168,0.35)", symbol: "\u25CE",
    nudges: ["Drax checking in. Are you moving toward your goals or making excuses? Be real.", "Comfort is the enemy of the life you said you wanted. What habit is holding you back?", "The truth you keep avoiding is still gonna be there tomorrow. Face one thing today.", "Did you do what you said you were gonna do? Accountability starts with you.", "What is the real reason you have not started yet? Name it. Then move past it."],
  },
  {
    id: "fearless", name: "Aries", title: "The Fearless", role: "Courage & Risk",
    desc: "Aries is pure fire. The voice that pushes you past every wall fear ever built.",
    color: "#E8754A", bg: "rgba(232,117,74,0.08)", border: "rgba(232,117,74,0.35)", symbol: "\u21AF",
    nudges: ["Aries here. What is the one bold move you have been putting off? Today is the day.", "Fear is just excitement without permission. Give yourself permission today.", "The version of you that you dream about — what would they do this morning?", "Courage is not the absence of fear. It is moving despite it. Move today.", "You are one decision away from a completely different life. What is that decision?"],
  },
  {
    id: "intuitive", name: "Mary", title: "The Intuitive", role: "Spirit & Instinct",
    desc: "Mary speaks from the deepest place — the quiet voice inside you that already knows.",
    color: "#9B72CF", bg: "rgba(155,114,207,0.08)", border: "rgba(155,114,207,0.35)", symbol: "\u25C9",
    nudges: ["Mary is with you. Before the day begins — what does your gut already know?", "Your intuition has never truly failed you. What is it whispering right now?", "Take three deep breaths. What do you already know that you have been afraid to trust?", "You came here for a reason. Your spirit knows the path. Trust it today.", "What does your soul need to hear most this morning? Say it to yourself."],
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

  // Default: DECIDE mode
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
  const [nudgeTypes, setNudgeTypes] = useState([]);
  const [nudgeTime, setNudgeTime] = useState("6:00 AM");
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const msgsRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, thinking]);

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
    const voice = getVoice(c, "talk");
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
            <div className="orb-wrap">
              <div className="orb-ring" /><div className="orb-ring" /><div className="orb-ring" />
              <div className="orb-core"><span className="orb-glyph">&#9672;</span></div>
            </div>
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

        {/* NUDGE SETUP */}
        {screen === "nudge-setup" && (
          <div className="nudge-setup">
            <div className="eyebrow">Daily Nudges</div>
            <div className="heading">{companion?.name} Can Reach Out</div>
            <div className="sub">Your companion can nudge you toward better habits and accountability unprompted — like a real friend who checks in.</div>
            <div style={{ fontSize: 13, color: "var(--dim)", marginBottom: 20, fontWeight: 300 }}>Would you like {companion?.name} to reach out daily?</div>
            <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
              <button className={`opt ${nudgeEnabled ? "sel" : ""}`} style={{ flex: 1, textAlign: "center" }} onClick={() => setNudgeEnabled(true)}>Yes, reach out</button>
              <button className={`opt ${!nudgeEnabled ? "sel" : ""}`} style={{ flex: 1, textAlign: "center" }} onClick={() => setNudgeEnabled(false)}>Not right now</button>
            </div>
            {nudgeEnabled && (
              <>
                <div className="time-label">What time should {companion?.name} reach out?</div>
                <div className="time-opts">
                  {["5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "12:00 PM"].map(t => (
                    <button key={t} className={`time-opt ${nudgeTime === t ? "sel" : ""}`} onClick={() => setNudgeTime(t)}>{t}</button>
                  ))}
                </div>
              </>
            )}
            <button className="btn-full" style={{ marginTop: 8 }} onClick={() => setScreen("dash")}>Enter Day Masters</button>
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
                {showNudge && (
                  <NudgeCard
                    companion={companion}
                    onRespond={() => { setChatMode("talk"); startTalk(companion); setNudgeDismissed(true); }}
                    onDismiss={() => setNudgeDismissed(true)}
                  />
                )}

                {/* THREE FRAMEWORKS */}
                <div className="frameworks">

                  {/* DECIDE */}
                  <div className="fw-card decide" onClick={startDecide}>
                    <div className="fw-top">
                      <span className="fw-icon">&#9654;</span>
                      <span className="fw-label" style={{ color: "#C9A84C" }}>Decide</span>
                    </div>
                    <div className="fw-sub">You have a choice to make. Your companion maps your parallel paths, shows you the outcomes, and holds you to the one you choose.</div>
                    <div className="fw-action">Build my decision frame &rarr;</div>
                  </div>

                  {/* TALK */}
                  <div className="fw-card talk" onClick={() => setScreen("talk-select")}>
                    <div className="fw-top">
                      <span className="fw-icon">&#9825;</span>
                      <span className="fw-label" style={{ color: "#E07A8A" }}>Talk</span>
                    </div>
                    <div className="fw-sub">No decision needed. Just open up. Philosophy, life, relationships, pain, purpose — whatever is sitting on you right now.</div>
                    <div className="fw-action">Open a conversation &rarr;</div>
                  </div>

                  {/* GROW */}
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
            <div className="sub">Pick the companion whose voice you need most right now. Or just start with your primary guide.</div>
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

      </div>
    </>
  );
}
