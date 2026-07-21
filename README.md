# Mochi — download site

A Next.js landing page that gates the Mochi download behind an emailed
6-digit code. No database: the code lives in a short-lived signed cookie, and
each unlock emails you (the owner) the person's name + email as a lead.

## Local dev

```bash
npm install
cp .env.example .env.local     # fill in values (see below)
npm run dev                    # http://localhost:3000
```

Without a `RESEND_API_KEY`, the site runs in **dev mode**: instead of emailing,
the 6-digit code is shown right on the code screen so you can test the flow.

## Environment variables

| Variable          | What it is                                                                 |
| ----------------- | -------------------------------------------------------------------------- |
| `OTP_SECRET`      | Long random string that signs the cookies. `openssl rand -base64 32`       |
| `RESEND_API_KEY`  | From resend.com → API Keys. Sends the code emails.                          |
| `EMAIL_FROM`      | Verified sender, e.g. `Mochi <noreply@yourdomain.com>`                  |
| `OWNER_EMAIL`     | Where new-download notifications (the captured leads) are sent.             |
| `DOWNLOAD_URL`    | The file link revealed after verifying — a GitHub Release asset URL.        |

## Deploy (GitHub + Vercel) — step by step

### 1. Put the code on GitHub
```bash
cd catai-site
git init && git add -A && git commit -m "Mochi download site"
# create an empty repo on github.com, then:
git remote add origin https://github.com/<you>/mochi-site.git
git branch -M main && git push -u origin main
```

### 2. Host the app file on a GitHub Release
- In the same (or the Mochi app) repo on GitHub: **Releases → Draft a new
  release** → tag `v0.1.0` → **attach** the `Mochi-0.1.0-arm64.dmg` (rename to
  `Mochi-0.1.0-arm64.dmg` if you like) → **Publish**.
- Copy the uploaded asset's URL — that's your `DOWNLOAD_URL`.

### 3. Get a Resend key (for the emails)
- Sign up at **resend.com** (free). Add + verify your domain (or use
  `onboarding@resend.dev` for testing — it only delivers to your own address).
- Create an **API key** → that's `RESEND_API_KEY`.

### 4. Deploy on Vercel
- **vercel.com → Add New → Project → import your GitHub repo.**
- Under **Environment Variables**, add all five from the table above.
- Click **Deploy**. Done — your site is live at `https://<project>.vercel.app`.

To use your own domain, add it under Vercel → Project → Domains.

## Notes

- Gating is "soft": the file lives on a public GitHub Release URL that's only
  revealed after verification. For hard gating you'd serve the file from private
  storage (e.g. S3) with signed URLs.
- Edit the contact address and details in `app/privacy/page.js`.
- Cat artwork by **Mattz Art** (xzany.itch.io).
