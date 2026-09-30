import type { SVGProps } from "react";

/** Íconos de trazo propios (24×24). Cada demo elige su grosor para mantener su identidad. */
const paths = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  basket: <><path d="M3.5 10h17l-1.6 8.4a2 2 0 0 1-2 1.6H7.1a2 2 0 0 1-2-1.6z" /><path d="m8 10 3-6M16 10l-3-6M9 14v3M15 14v3" /></>,
  bag: <><path d="M5 8h14l-1 12H6z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  arrowRight: <path d="M5 12h14m-5-5 5 5-5 5" />,
  arrowLeft: <path d="M19 12H5m5-5-5 5 5 5" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  star: <path d="m12 3.8 2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8z" />,
  pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></>,
  truck: <><path d="M3 6.5h10.5v9H3zM13.5 10H18l3 3v2.5h-7.5" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  leaf: <><path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z" /><path d="M5 19c3-4 6-7 10-9" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" />,
  shield: <><path d="M12 3.5 19 6v5.5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6z" /><path d="m8.8 12 2.2 2.2 4.2-4.4" /></>,
  bolt: <path d="M13 3 5.5 13.5H11L10 21l7.5-10.5H12z" />,
  drop: <path d="M12 3.5s6 6.4 6 10.6a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5z" />,
  flame: <path d="M12 21a6.5 6.5 0 0 1-6.5-6.5c0-3.8 3.3-5.6 3.8-9.5 2.6 1.5 3.4 3.8 3.4 5.6 1-.6 1.7-1.8 1.9-3.1 2.3 1.9 3.9 4.3 3.9 7A6.5 6.5 0 0 1 12 21z" />,
  roller: <><rect x="4" y="3.5" width="14" height="5" rx="1.5" /><path d="M18 6h2v5h-8v3" /><rect x="10.5" y="14" width="3" height="7" rx="1" /></>,
  saw: <><path d="M3.5 14.5 15 3l5.5 5.5L9 20z" /><path d="m7 11 2 2m1-5 2 2m1-5 2 2" /></>,
  snow: <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5" />,
  wrench: <path d="M14.5 5.5a4 4 0 0 0 4.9 5L20 11l-9.5 9.5a2.1 2.1 0 0 1-3-3L17 8l.5.6a4 4 0 0 1-3-3.1z" />,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  camera: <><path d="M4 8h3.5L9 5.5h6L16.5 8H20v11H4z" /><circle cx="12" cy="13.5" r="3.5" /></>,
  chat: <path d="M4.5 5.5h15v10h-8l-4.5 4v-4H4.5z" />,
  send: <path d="M4 12 20 4l-5 16-3.5-6.5z" />,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  user: <><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20c.8-4 3.8-6 7.5-6s6.7 2 7.5 6" /></>,
  tag: <><path d="M3.5 12.5V4h8.5l8.5 8.5-8 8z" /><circle cx="8" cy="8.5" r="1.4" /></>,
  image: <><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="m4 18 5-5 4 4 3-3 4.5 4.5" /></>,
  trash: <path d="M5 7h14M9.5 7V4.5h5V7M7 7l1 13h8l1-13" />,
  sparkle: <path d="M12 3.5c.8 4.3 2.7 6.2 7 7-4.3.8-6.2 2.7-7 7-.8-4.3-2.7-6.2-7-7 4.3-.8 6.2-2.7 7-7z" />,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5.5M12 7.8v.2" /></>,
  phone: <path d="M6.5 3.5h3l1.5 4.5-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />,
  sort: <path d="M8 5v14m0 0-3-3m3 3 3-3M16 19V5m0 0-3 3m3-3 3 3" />,
  swap: <path d="M4 8h13l-3-3M20 16H7l3 3" />,
  home: <path d="M4 11 12 4l8 7v9h-5.5v-5h-5v5H4z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  size = 20,
  stroke = 1.8,
  filled = false,
  ...rest
}: { name: IconName; size?: number; stroke?: number; filled?: boolean } & Omit<SVGProps<SVGSVGElement>, "name" | "stroke">) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
