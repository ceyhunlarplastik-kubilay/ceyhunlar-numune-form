export default function CustomersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <div className="w-full px-4 sm:px-6 lg:px-8">{children}</div>
        </div>
    );
}
