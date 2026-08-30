"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, LayoutDashboard } from "lucide-react";
import { supabase } from "../../app/dashboard/supabaseClient";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";

export function Navbar() {
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
                setUserEmail(user.email);
            }
        }
        checkUser();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setUserEmail(null);
        window.location.reload();
    };

    return (
        <header className="w-full border-b border-border bg-surface/50 backdrop-blur-md px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-40">
            {/* Left Group: Logo & Search Bar right next to each other */}
            <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2.5 font-bold text-foreground shrink-0">
                    <Logo />
                    <span className="tracking-tight">Akashic Records</span>
                </Link>

                <div className="hidden md:block w-48 lg:w-60">
                    <SearchBar />
                </div>
            </div>

            {/* Right Group: Dashboard, Theme Toggle, & Auth */}
            <div className="flex items-center gap-2.5 shrink-0">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 rounded-xl border border-border bg-surface-alt/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent transition-all cursor-pointer"
                >
                    <LayoutDashboard size={14} className="text-accent" />
                    <span>Dashboard</span>
                </Link>

                <ThemeToggle />

                {userEmail ? (
                    <div className="flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 backdrop-blur-md">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-background font-bold text-xs shadow-md">
                            {userEmail.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-medium text-foreground hidden lg:inline">
                            {userEmail.split("@")[0]}
                        </span>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            title="Sign Out"
                            className="text-muted hover:text-accent transition-colors cursor-pointer ml-0.5"
                        >
                            <LogOut size={14} />
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/dashboard"
                        className="rounded-xl border border-accent/40 bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent transition-all hover:bg-accent hover:text-background cursor-pointer shadow-sm"
                    >
                        Officer Login
                    </Link>
                )}
            </div>
        </header>
    );
}