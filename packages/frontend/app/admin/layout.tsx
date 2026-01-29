import { redirect } from "next/navigation";
import { hasAtLeastRole } from "@/utils/roles";
import { AuthActions } from "@/components/auth/AuthActions";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // RBAC 🔐 admin or owner
    if (!(await hasAtLeastRole("moderator"))) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            {/* ADMIN NAVBAR */}
            <header className="sticky top-0 z-40 bg-white border-b">
                <nav className="h-14 md:h-16 max-w-screen-2xl mx-auto px-4 md:px-6 flex items-center">
                    <AuthActions />
                </nav>
            </header>

            {/* PAGE CONTENT */}
            <main className="flex-1 px-4 md:px-6 pt-2 md:pt-6 pb-6">
                <div className="max-w-screen-3xl mx-auto space-y-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
