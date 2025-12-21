"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";

interface User {
    id: string;
    email: string;
    role: string;
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchSession() {
            try {
                const response = await fetch("/api/auth/me");

                if (!response.ok) {
                    // Not authenticated, redirect to login
                    router.push("/login");
                    return;
                }

                const data = await response.json();
                setUser(data.user);
            } catch (error) {
                console.error("Failed to fetch session:", error);
                router.push("/login");
            } finally {
                setIsLoading(false);
            }
        }

        fetchSession();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar userEmail={user.email} />
            <main className="flex-1 container mx-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
