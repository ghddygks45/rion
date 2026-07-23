"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_ITEMS = [
  { href: "/theme", label: "오늘의 테마" },
  { href: "/stock/overheat", label: "단기과열 조회" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="relative z-50 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="bg-linear-to-r from-primary to-accent bg-clip-text text-xl font-bold tracking-tight text-transparent"
          >
            RION
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-base ${
                  isActive(item.href)
                    ? "font-bold text-text after:absolute after:bottom-1 after:-right-2.5 after:h-1.5 after:w-1.5 after:rounded-full after:bg-accent after:content-['']"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="메뉴 열기"
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-text-secondary hover:text-text md:hidden"
          >
            <span className="relative flex h-4 w-4 flex-col items-center justify-center">
              <span
                className={`absolute h-0.5 w-4 bg-current transition-transform duration-300 ${open ? "translate-y-0 rotate-45" : "-translate-y-1.5"}`}
              />
              <span
                className={`absolute h-0.5 w-4 bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute h-0.5 w-4 bg-current transition-transform duration-300 ${open ? "translate-y-0 -rotate-45" : "translate-y-1.5"}`}
              />
            </span>
          </button>
        </div>
      </div>

      <nav
        className={`absolute left-0 right-0 top-full z-50 overflow-hidden border-b border-border bg-surface transition-all duration-300 ease-out md:hidden ${
          open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-2 py-2 text-md ${isActive(item.href) ? "font-bold text-text" : "text-text-secondary hover:text-text"}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-x-0 top-16 bottom-0 z-40 bg-black/50 backdrop-blur-[1px] transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
    </header>
  );
}
