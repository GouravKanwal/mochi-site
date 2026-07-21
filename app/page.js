'use client';

import { useState } from 'react';

export default function Home() {
  const [step, setStep] = useState('form'); // form | code | done
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');

  async function requestCode(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const r = await fetch('/api/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, consent }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Something went wrong.');
      setStep('code');
      setHint(data.devCode ? `Dev mode: your code is ${data.devCode}` : '');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const r = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Something went wrong.');
      setStep('done');
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
            Mochi lives on your desktop, reacts to your mouse, keyboard and scrolls,
            nudges you to take breaks, runs a Pomodoro timer, and cheers on your coding
            agent while it works.
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
          <div className="emoji">⏱️</div>
          <h3>Focus &amp; reminders</h3>
          <p>A Pomodoro timer, stretch nudges, and your own custom reminders with pop-up bubbles.</p>
        </div>
        <div className="feature">
          <div className="emoji">🤖</div>
          <h3>Cheers your agent</h3>
          <p>Runs while your AI coding agent works and jumps for joy when it finishes a task.</p>
        </div>
      </section>

      <section id="get" className="gate">
        {step === 'form' && (
          <form onSubmit={requestCode}>
            <h2>Get Mochi</h2>
            <p className="sub">We'll email you a 6-digit code to unlock the download.</p>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <label className="consent">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>I agree to receive a verification email and to the <a href="/privacy">privacy note</a>.</span>
            </label>
            {error && <div className="msg err">{error}</div>}
            <button className="primary" disabled={busy}>{busy ? 'Sending…' : 'Email me a code'}</button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={verifyCode}>
            <h2>Enter your code</h2>
            <p className="sub">We sent a 6-digit code to <b>{email}</b>. It expires in 10 minutes.</p>
            <input
              className="code-input"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              autoFocus
            />
            {hint && <div className="msg ok">{hint}</div>}
            {error && <div className="msg err">{error}</div>}
            <button className="primary" disabled={busy || code.length < 6}>{busy ? 'Checking…' : 'Verify & unlock'}</button>
            <button type="button" className="link" onClick={() => { setStep('form'); setCode(''); setError(''); }}>
              ← Use a different email
            </button>
          </form>
        )}

        {step === 'done' && (
          <div>
            <h2>You're in! 🎉</h2>
            <p className="sub">Thanks{name ? `, ${name}` : ''}. Your download is ready.</p>
            <a className="download-btn" href="/api/download">Download Mochi for macOS</a>
            <p className="note">
              It's an Apple-Silicon (arm64) app. Because it isn't from the App Store, the first
              time you may need to <b>right-click the app → Open</b>. Then grant Accessibility
              permission so the cat can react to your mouse and keyboard.
            </p>
          </div>
        )}
      </section>

      <p className="note" style={{ textAlign: 'center', maxWidth: 560, margin: '28px auto 0' }}>
        We only use your email to send the download code and occasional updates about Mochi.
        Cat artwork by <b>Mattz Art</b>.
      </p>

      <div className="foot">
        <a href="/privacy">Privacy</a> · Made with 🐱
      </div>
    </div>
  );
}
