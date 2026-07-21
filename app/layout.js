import './globals.css';

export const metadata = {
  title: 'Mochi — a pixel cat that keeps you on track',
  description:
    'A pixel cat that lives on your desktop. Reacts to your mouse, keyboard and scrolls, gives you reminders, runs a Pomodoro timer, and cheers on your coding agent.',
  openGraph: {
    title: 'Mochi — a pixel cat that keeps you on track',
    description: 'A desktop pixel-cat companion with reminders, Pomodoro, and AI-agent reactions.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
