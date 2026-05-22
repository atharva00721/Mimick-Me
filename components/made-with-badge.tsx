"use client";

import Link from "next/link";

export function MadeWithBadge() {
    return (
        <Link
            href="https://mimick.me"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 left-4 z-[9999] flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-md transition-all hover:bg-black/80 hover:scale-105 active:scale-95 shadow-lg overflow-hidden group"
        >
            <span className="relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">Made using</span>
            <span className="relative z-10 font-bold group-hover:text-white transition-colors">mimick.me</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
        </Link>
    );
}
