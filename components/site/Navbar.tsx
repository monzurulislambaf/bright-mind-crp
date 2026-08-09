"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { primaryNav } from "@/data/navigation";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const menuId = useId();

  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((v) => !v);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-base-300/80 bg-base-100/85 backdrop-blur-xl">
      <div className="navbar container-page min-h-16 px-0">
        <div className="navbar-start gap-1">
          <button
            type="button"
            className="btn btn-ghost btn-square lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={toggleMenu}
          >
            {open ? (
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
          <Link
            href="/"
            className="btn btn-ghost px-2 text-lg font-semibold normal-case"
            onClick={closeMenu}
          >
            <span className="font-display tracking-tight text-primary">
              Bright<span className="text-accent">Mind</span>
            </span>
          </Link>
        </div>

        <div className="navbar-center hidden xl:flex">
          <ul className="menu menu-horizontal gap-0.5 px-1 text-sm">
            {primaryNav.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "rounded-field",
                      active && "bg-primary/10 font-medium text-primary"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="navbar-end gap-1 sm:gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="btn btn-ghost btn-sm hidden sm:inline-flex"
          >
            Login
          </Link>
          <Link
            href="/request-a-report"
            className="btn btn-primary btn-sm sm:btn-md gap-1.5"
          >
            <span className="hidden sm:inline">Request a Report</span>
            <span className="sm:hidden">Report</span>
            <ArrowRightIcon
              className="hidden h-4 w-4 sm:block"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            className="border-t border-base-300 bg-base-100 lg:hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="container-page py-4" aria-label="Mobile">
              <ul className="menu w-full gap-1 rounded-box p-0">
                {primaryNav.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        className={cn(
                          "rounded-field py-3 text-base",
                          active && "bg-primary/10 font-medium text-primary"
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
                <li className="mt-2">
                  <Link
                    href="/request-a-report"
                    onClick={closeMenu}
                    className="btn btn-primary justify-start"
                  >
                    Request a Report
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-field py-3"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
