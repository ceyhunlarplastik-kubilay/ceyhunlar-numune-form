"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientRole } from "@/hooks/auth/useClientRole";

/**
 * Admin Navbar Actions
 *
 * SOL:
 *  - Logo
 *  - Sabit başlık (yan yana, hizalı)
 *
 * SAĞ:
 *  - Clerk Auth components (AYNEN KALIR)
 */
export function AuthActions() {
  const {
    isLoaded,
    role,
  } = useClientRole();

  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastScrollY && currentY > 100) setHidden(true);
      if (currentY < lastScrollY) setHidden(false);

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // 🔐 SADECE UI'YI KİLİTLİYORUZ
  if (!isLoaded) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-full flex items-center justify-between"
    >
      {/* LEFT */}
      <div className="flex items-center gap-4 min-w-0">
        {/* LOGO */}
        <Link href="/admin" className="flex items-center shrink-0">
          <Image
            src="/ceyhunlar.png"
            alt="Ceyhunlar Plastik"
            width={140}
            height={32}
            className="object-contain"
            priority
            unoptimized
          />
        </Link>

        {/* TITLE */}
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 whitespace-nowrap">
          Admin Paneli
        </h1>
      </div>

      {/* RIGHT — Clerk Auth */}
      <div className="flex items-center gap-3 shrink-0">
        <SignedIn>
          <div className="flex items-center gap-4">
            {role && (
              <span
                className="
                  px-3 py-1
                  text-s font-semibold tracking-wide
                  rounded-full
                  bg-(--color-brand)
                  text-(--color-brand-foreground)
                "
              >
                {role.toUpperCase()}
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
    </motion.div>
  );
}
