/** Set de íconos de línea propio (24×24). Sin emojis. */
const paths = {
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  x: "M6 6l12 12M18 6L6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
  "chevron-left": "M15 6l-6 6 6 6",
  "chevron-right": "M9 6l6 6-6 6",
  "chevron-down": "M6 9l6 6 6-6",
  "chevron-up": "M6 15l6-6 6 6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  phone:
    "M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a1.5 1.5 0 0 1-1.5 1.5A16 16 0 0 1 3.5 5.5 1.5 1.5 0 0 1 5 4z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  chat: "M5 18.5V6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5v8a1.5 1.5 0 0 1-1.5 1.5H9z M9 10h6M9 13h4",
  calendar: "M5 6h14v14H5zM5 10h14M9 3v4M15 3v4",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5V12l3 2",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0",
  users:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20a6 6 0 0 1 12 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.5a6 6 0 0 1 3 5.5",
  home: "M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-5h4v5",
  building: "M5 21V4h9v17M14 9h5v12M8 7.5h3M8 11h3M8 14.5h3M3 21h18",
  kanban: "M4 4h4.5v16H4zM9.75 4h4.5v10h-4.5zM15.5 4H20v7h-4.5z",
  list: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
  tasks: "M4 5.5l1.5 1.5L8.5 4M4 12l1.5 1.5L8.5 10.5M4 18.5l1.5 1.5 3-3M11 6h9M11 12.5h9M11 19h9",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2.2 2.2 0 0 0 4 0",
  filter: "M4 5h16l-6 7.5V19l-4-2v-4.5z",
  "arrow-up": "M12 19V5M6 11l6-6 6 6",
  "arrow-down": "M12 5v14M6 13l6 6 6-6",
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  "arrow-left": "M19 12H5M11 6l-6 6 6 6",
  sort: "M8 4v16M4.5 7.5L8 4l3.5 3.5M16 20V4M12.5 16.5L16 20l3.5-3.5",
  trash: "M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5",
  edit: "M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4",
  note: "M6 3.5h9l4 4V20.5H6zM15 3.5v4h4M9 12h7M9 15.5h7",
  pin: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  box: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9",
  alert: "M12 4l9 16H3zM12 10v4.5M12 17.5h.01",
  truck: "M3 6h11v10H3zM14 9.5h4l3 3.5V16h-7M7 19.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17.5 19.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  history: "M4 12a8 8 0 1 0 2.4-5.7M4 4.5v3.8h3.8M12 8v4.5l3 1.8",
  scan: "M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M3 12h18",
  barcode: "M4 5v14M7 5v14M10.5 5v14M13 5v14M17 5v14M20 5v14",
  chart: "M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  refresh: "M20 11a8 8 0 0 0-14.3-4.3L4 8.5M4 4v4.5h4.5M4 13a8 8 0 0 0 14.3 4.3L20 15.5M20 20v-4.5h-4.5",
  flame:
    "M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.3 2.4-5.4 3.6-7.8.5 1.6 1.4 2.6 2.4 3.1.2-2.6 1.3-5 3.3-7.1.3 3 1.5 4.6 2.7 6.3 1 1.4 1.5 3 1.5 4.6C19 18.3 16 21 12 21z",
  utensils: "M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 21V3c-2 1.5-3 4-3 7.5V13h3",
  bike: "M5.5 19a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM18.5 19a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5.5 15.5l4-7h5l4 7M9.5 8.5L8 5.5H6M14.5 8.5L16 5h2",
  receipt: "M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21zM9 8h6M9 11.5h6M9 15h4",
  grip: "M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01",
  eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  copy: "M8 8h12v12H8zM16 8V4H4v12h4",
  printer: "M7 8V3.5h10V8M5 17H3.5V9.5A1.5 1.5 0 0 1 5 8h14a1.5 1.5 0 0 1 1.5 1.5V17H19M7 14h10v7H7z",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3h-4.4l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2l.4 2.6h4.4l.4-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z",
  star: "M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z",
  flag: "M5 21V4M5 4h11l-2 4 2 4H5",
  tag: "M3.5 12.5V4h8.5l8.5 8.5-8.5 8.5zM8 8.5h.01",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  maximize: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
  minimize: "M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5",
  logout: "M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10",
  dollar: "M12 3v18M16.5 7.5c0-1.9-2-3-4.5-3s-4.5 1.2-4.5 3.2c0 4.6 9 2.4 9 7 0 2-2 3.3-4.5 3.3s-4.5-1.2-4.5-3.2",
  "trend-up": "M3 17l6-6 4 4 8-8M15 7h6v6",
  "trend-down": "M3 7l6 6 4-4 8 8M15 17h6v-6",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  inbox: "M3 13l3-8h12l3 8v6H3zM3 13h5l1.5 3h5L16 13h5",
  send: "M4 12l16-8-6 16-2.5-6.5z M11.5 13.5L20 4",
  undo: "M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3",
  timer: "M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 9v4l2.5 1.5M9.5 2.5h5",
  bag: "M5 8h14l-1 13H6zM9 8V6.5a3 3 0 0 1 6 0V8",
  table: "M4 9.5h16M6 9.5v10M18 9.5v10M8.5 5.5h7a4 4 0 0 1 4 4h-15a4 4 0 0 1 4-4z",
  store: "M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9M10 20v-5h4v5",
  cash: "M3 7h18v10H3zM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM6 10v4M18 10v4",
  dot: "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  className = "size-5",
  strokeWidth = 1.8,
  title,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      aria-label={title}
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}
