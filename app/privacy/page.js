export const metadata = { title: 'Privacy — Mochi' };

export default function Privacy() {
  return (
    <div className="wrap" style={{ maxWidth: 680 }}>
      <div className="nav"><img src="/icon.png" alt="Mochi" />Mochi</div>
      <h1 style={{ marginTop: 32 }}>Privacy note</h1>
      <p style={{ color: 'var(--muted)' }}>Last updated: {new Date().getFullYear()}</p>

      <h3>What we collect</h3>
      <p>When you download Mochi we collect your <b>name</b> and <b>email address</b>.
        That's it — we don't track your activity on the site.</p>

      <h3>Why</h3>
      <p>So we know who's using Mochi and can occasionally let you know about important
        updates.</p>

      <h3>How it's stored</h3>
      <p>Your name and email are saved to a private <b>Google Sheet</b> owned by the
        maintainer.</p>

      <h3>Sharing</h3>
      <p>We don't sell or share your information.</p>

      <h3>Your choices</h3>
      <p>Want your details removed, or to stop hearing from us? Email the address below and
        we'll take care of it.</p>

      <h3>Contact</h3>
      <p>Reach out at <a href="mailto:Me@gouravkanwal.com">Me@gouravkanwal.com</a>.</p>
      <p style={{ color: 'var(--muted)', marginTop: 24 }}>
        Built by <a href="https://gouravkanwal.com" target="_blank" rel="noopener noreferrer">GouravKanwal.com</a>
      </p>

      <p style={{ marginTop: 32 }}><a href="/">← Back</a></p>
    </div>
  );
}
