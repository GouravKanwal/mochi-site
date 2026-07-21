export const metadata = { title: 'Privacy — Mochi' };

export default function Privacy() {
  return (
    <div className="wrap" style={{ maxWidth: 680 }}>
      <div className="nav"><img src="/icon.png" alt="Mochi" />Mochi</div>
      <h1 style={{ marginTop: 32 }}>Privacy note</h1>
      <p style={{ color: 'var(--muted)' }}>Last updated: {new Date().getFullYear()}</p>

      <h3>What we collect</h3>
      <p>When you request the download we collect your <b>email address</b> and, if you
        provide it, your <b>name</b>. That's it — we don't track your activity on the site.</p>

      <h3>Why</h3>
      <p>Your email is used to send you a one-time verification code to unlock the download,
        and occasionally to let you know about important Mochi updates.</p>

      <h3>How it's stored</h3>
      <p>The verification code lives only in a short-lived, signed cookie in your browser and
        expires in 10 minutes. Your name and email are sent to the maintainer's inbox as a
        download notification.</p>

      <h3>Sharing</h3>
      <p>We don't sell or share your information. Email is delivered through
        <b> Resend</b>, our email provider.</p>

      <h3>Your choices</h3>
      <p>Want your details removed, or to stop hearing from us? Email the address below and
        we'll take care of it.</p>

      <h3>Contact</h3>
      <p>Reach out at <b>your@email.com</b>.</p>

      <p style={{ marginTop: 32 }}><a href="/">← Back</a></p>
    </div>
  );
}
