"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Mock user session for now
    const [user] = useState({ email: "developer@example.com" });

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar userEmail={user.email} />
            <main className="flex-1 container mx-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
