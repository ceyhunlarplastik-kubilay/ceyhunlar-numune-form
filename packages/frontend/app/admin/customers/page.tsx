import { Suspense } from "react";
import { redirect } from "next/navigation";
import CustomersPageClient from "./CustomersPageClient";
import { CustomersTableSkeleton } from "@/components/customers/CustomersTableSkeleton";
import { hasAtLeastRole } from "@/utils/roles";

export default async function Page() {
  const canView = await hasAtLeastRole("moderator");
  if (!canView) redirect("/");

  return (
    <Suspense fallback={<CustomersTableSkeleton />}>
      <CustomersPageClient />
    </Suspense>
  );
}
