"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Code2, History, LogOut, Zap } from "lucide-react";

interface NavbarProps {
    userEmail?: string;
    onLogout?: () => void;
}

export function Navbar({ userEmail, onLogout }: NavbarProps) {
    const pathname = usePathname();

    const navItems = [
        { href: "/dashboard", label: "Enhance", icon: Zap },
        { href: "/history", label: "History", icon: History },
    ];

    return (
        <nav className="border-b-2 border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary text-primary-foreground p-1.5 rounded-sm shadow-sm group-hover:shadow-[2px_2px_0px_0px_rgba(234,88,12,0.5)] transition-shadow">
                        <Code2 size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                        PromptEnhancer
                    </span>
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-6">
                    {userEmail && (
                        <div className="flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link key={item.href} href={item.href}>
                                        <div
                                            className={cn(
                                                "relative px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                                                isActive
                                                    ? "text-primary bg-primary/10"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                            )}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="navbar-indicator"
                                                    className="absolute inset-0 border-2 border-primary/20 rounded-md"
                                                    initial={false}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 500,
                                                        damping: 30,
                                                    }}
                                                />
                                            )}
                                            <Icon size={16} />
                                            {item.label}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* User / Auth Actions */}
                    <div className="flex items-center gap-4 pl-6 border-l-2 border-border">
                        {userEmail ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground hidden md:block">
                                    {userEmail}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onLogout}
                                    className="gap-2"
                                >
                                    <LogOut size={14} />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Button asChild variant="default" size="sm">
                                <Link href="/login">Login</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
