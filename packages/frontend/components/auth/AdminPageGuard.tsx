"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Roles } from "@/types/globals";
import { useClientRole } from "@/hooks/auth/useClientRole";

interface AdminPageGuardProps {
  /** Bu sayfa için minimum rol */
  requiredRole: Roles;
  children: React.ReactNode;
}

export function AdminPageGuard({
  requiredRole,
  children,
}: AdminPageGuardProps) {
  const router = useRouter();
  const { isLoaded, role } = useClientRole();

  useEffect(() => {
    if (!isLoaded) return;

    // Rol yoksa veya yetmiyorsa
    if (!role || !hasAtLeast(role, requiredRole)) {
      toast.error("Yetkisiz Erişim", {
        description: "Bu sayfaya erişim yetkiniz bulunmamaktadır.",
      });

      router.replace("/admin");
    }
  }, [isLoaded, role, requiredRole, router]);

  // Yüklenene kadar render etme
  if (!isLoaded) {
    return null;
  }

  // Yetkisizse render etme (redirect zaten oluyor)
  if (!role || !hasAtLeast(role, requiredRole)) {
    return null;
  }

  return <>{children}</>;
}

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const ROLE_LEVEL: Record<Roles, number> = {
  moderator: 1,
  admin: 2,
  owner: 3,
};

function hasAtLeast(userRole: Roles, required: Roles) {
  return ROLE_LEVEL[userRole] >= ROLE_LEVEL[required];
}
