import Link from "next/link";
import { site } from "@/content/site";
import { LiveClock } from "./canvas/LiveClock";
import { Ruler } from "./canvas/Ruler";
import { NavLinks } from "./NavLinks";

export function Header() {
  return (
    <header>
      <Ruler />
      <div className="wrap grid grid-cols-[1fr_auto] items-center gap-y-3 pt-4 md:grid-cols-[1fr_auto_1fr] md:pt-5">
        <Link href="/" className="font-semibold tracking-tight">
          {site.nombre}
        </Link>
        <div className="justify-self-end md:justify-self-center">
          <LiveClock />
        </div>
        <nav aria-label="Principal" className="col-span-2 md:col-span-1 md:justify-self-end">
          <NavLinks />
        </nav>
      </div>
    </header>
  );
}
