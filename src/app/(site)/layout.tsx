import { hanken, newsreader } from "./fonts";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${hanken.variable} ${newsreader.variable} font-sans text-base`}>{children}</div>
  );
}
