"use client";

import { useEffect, useState } from "react";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/auth/useRole";
import { motion } from "motion/react";

export function AuthActions() {
  const { isAdmin } = useRole();

  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastScrollY && currentY > 100) {
        setHidden(true);
      }

      if (currentY < lastScrollY) {
        setHidden(false);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.header
      initial={false}
      animate={{
        y: hidden ? -120 : 0,
        opacity: hidden ? 0 : 1,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="
    sticky top-0 z-40 w-full
    backdrop-blur
    border-b border-black/5

    /* SOFT BACKGROUND */
    bg-gradient-to-b
    from-[color-mix(in_oklab,var(--color-brand)_6%,white)]
    to-[color-mix(in_oklab,var(--color-brand)_2%,white)]

    shadow-[0_1px_0_rgba(0,0,0,0.03)]
  "
    >

      <div
        className="
          max-w-7xl mx-auto
          px-6
          h-[88px]
          flex items-center justify-between
        "
      >
        {/* LEFT SIDE – TITLE */}
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-semibold text-gray-900">
            Admin Panel
          </span>
          <span className="text-sm text-muted-foreground">
            Ceyhunlar Plastik
          </span>
        </div>

        {/* RIGHT SIDE – AUTH */}
        <SignedIn>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <span
                className="
                  px-3 py-1
                  text-xs font-semibold tracking-wide
                  rounded-full
                  bg-[var(--color-brand)]
                  text-[var(--color-brand-foreground)]
                "
              >
                ADMIN
              </span>
            )}
            <UserButton />
          </div>
        </SignedIn>

        <SignedOut>
          <SignInButton>
            <Button size="sm" className="font-medium shadow-sm">
              Giriş Yap
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </motion.header>
  );
}
