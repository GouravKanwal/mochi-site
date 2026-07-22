'use client';

import { useState } from 'react';

export default function Home() {
  const [step, setStep] = useState('form'); // form | done
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Suggestion box
  const [sMsg, setSMsg] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sBusy, setSBusy] = useState(false);
  const [sSent, setSSent] = useState(false);
  const [sErr, setSErr] = useState('');

  async function submitSuggestion(e) {
    e.preventDefault();
    setSErr('');
    setSBusy(true);
    try {
      const r = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: sMsg, email: sEmail }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Something went wrong.');
      setSSent(true);
      setSMsg('');
      setSEmail('');
    } catch (err) {
      setSErr(err.message);
    } finally {
      setSBusy(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const r = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, consent }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Something went wrong.');
      setStep('done');
      // Start the download automatically.
      setTimeout(() => { window.location.href = '/api/download'; }, 400);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wrap">
      <div className="nav">
        <img src="/icon.png" alt="Mochi" />
        Mochi
      </div>

      <section className="hero">
        <div>
          <span className="badge">macOS · free · pixel desktop pet</span>
          <h1>A pixel cat that keeps you on track.</h1>
          <p className="lede">
            Mochi lives on your desktop — she roams around, reacts to your mouse,
            keyboard and scrolls, keeps you off distracting apps, runs a Pomodoro
            timer, tracks your focus streaks, and cheers on your coding agent while
            it works.
          </p>
          <a className="download-btn" href="#get">Get Mochi ↓</a>
        </div>
        <div className="heroArt">
          <img src="/preview.gif" alt="Mochi cat animations" />
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <div className="emoji">🖱️</div>
          <h3>Reacts to you</h3>
          <p>Turns to face your cursor, dashes on fast moves, paws along as you type, trots when you scroll.</p>
        </div>
        <div className="feature">
          <div className="emoji">🐾</div>
          <h3>Roams &amp; pounces</h3>
          <p>Wanders your whole screen on her own, and every so often chases your cursor and pounces on it.</p>
        </div>
        <div className="feature">
          <div className="emoji">🚫</div>
          <h3>Distraction guard</h3>
          <p>Name your time-sink apps and she glares and grumbles whenever one is in front of you.</p>
        </div>
        <div className="feature">
          <div className="emoji">⏱️</div>
          <h3>Focus &amp; reminders</h3>
          <p>A Pomodoro timer, stretch nudges, and your own custom reminders with pop-up bubbles.</p>
        </div>
        <div className="feature">
          <div className="emoji">📊</div>
          <h3>Stats &amp; streaks</h3>
          <p>Tracks your daily focus sessions and active time, and keeps your streak going in the menu bar.</p>
        </div>
        <div className="feature">
          <div className="emoji">🤖</div>
          <h3>Cheers your agent</h3>
          <p>Runs while your AI coding agent works and jumps for joy when it finishes a task.</p>
        </div>
      </section>

      <section id="get" className="gate">
        {step === 'form' && (
          <form onSubmit={submit}>
            <h2>Get Mochi</h2>
            <p className="sub">Just your name and email, and the download starts right away.</p>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <label className="consent">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>I agree to the <a href="/privacy">privacy note</a> and to receiving occasional Mochi updates.</span>
            </label>
            {error && <div className="msg err">{error}</div>}
            <button className="primary" disabled={busy}>{busy ? 'Starting…' : 'Download Mochi for macOS'}</button>
          </form>
        )}

        {step === 'done' && (
          <div>
            <h2>Thanks{name ? `, ${name}` : ''}! 🎉</h2>
            <p className="sub">Your download should start automatically. If it doesn't:</p>
            <a className="download-btn" href="/api/download">Download Mochi for macOS</a>
            <p className="note">
              It's an Apple-Silicon (arm64) app. Because it isn't from the App Store, the first
              time you may need to <b>right-click the app → Open</b>. Then grant Accessibility
              permission so the cat can react to your mouse and keyboard.
            </p>
          </div>
        )}
      </section>

      <section className="gate" style={{ marginTop: 40 }}>
        {!sSent ? (
          <form onSubmit={submitSuggestion}>
            <h2>What should Mochi do next? 🐾</h2>
            <p className="sub">Got an idea or a bug? Tell us — we read every one.</p>
            <label htmlFor="sMsg">Your suggestion</label>
            <textarea
              id="sMsg"
              className="suggest-area"
              value={sMsg}
              onChange={(e) => setSMsg(e.target.value)}
              placeholder="I wish Mochi could…"
              rows={4}
              required
            />
            <label htmlFor="sEmail">Email (optional, if you want a reply)</label>
            <input id="sEmail" type="email" value={sEmail} onChange={(e) => setSEmail(e.target.value)} placeholder="you@example.com" />
            {sErr && <div className="msg err">{sErr}</div>}
            <button className="primary" disabled={sBusy || sMsg.trim().length < 3}>
              {sBusy ? 'Sending…' : 'Send suggestion'}
            </button>
          </form>
        ) : (
          <div>
            <h2>Thank you! 🐱</h2>
            <p className="sub">Your suggestion landed. Mochi appreciates you.</p>
            <button type="button" className="link" onClick={() => setSSent(false)}>Send another</button>
          </div>
        )}
      </section>

      <p className="note" style={{ textAlign: 'center', maxWidth: 560, margin: '28px auto 0' }}>
        We only use your details to let you know about Mochi updates. Cat artwork by <b>Mattz Art</b>.
      </p>

      <div className="foot">
        <a href="/privacy">Privacy</a> · Made with 🐱 · Built by{' '}
        <a href="https://gouravkanwal.com" target="_blank" rel="noopener noreferrer">GouravKanwal.com</a>
      </div>
    </div>
  );
}
