"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/client";
import { useTheme } from "next-themes";
import { useState } from "react";

interface TopNavUserMenuProps {
  userName: string;
  userEmail: string;
  userImage?: string | null;
}

export function TopNavUserMenu({ userName, userEmail, userImage }: TopNavUserMenuProps) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [index, setIndex] = useState(0);

  const themes = [
    { name: "light", icon: Sun },
    { name: "dark", icon: Moon }
  ] as const;

  const { name, icon: Icon } = themes[index];

  function handleClick() {
    const nextIndex = (index + 1) % themes.length;
    setIndex(nextIndex);
    setTheme(themes[nextIndex].name);
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/signin");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center size-8 rounded-full bg-zinc-100 border border-zinc-200 shadow-sm overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-all">
          {userImage ? (
            <img src={userImage} alt={userName} className="size-full object-cover" />
          ) : (
            <span className="text-xs font-semibold text-zinc-600">
              {userEmail?.[0].toUpperCase() || "U"}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 font-sans">
        <div className="px-2 py-1.5">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{userName}</p>
          <p className="text-xs text-zinc-500 truncate font-medium">{userEmail}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button variant="ghost" className="w-full justify-start py-1 px-2 h-auto text-sm font-medium text-zinc-700 dark:text-zinc-300" onClick={handleClick}>
            <Icon className="mr-2 size-4" />
            <span className="capitalize">{name}</span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="cursor-pointer py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 w-full flex items-center">
            <Settings className="mr-2 size-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400 py-2 text-sm font-medium w-full flex items-center"
        >
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
