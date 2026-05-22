"use client";

import {
    BadgeCheck,
    LogOut,
    Sparkles,
    Sun,
    Moon,
    Laptop,
    CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { signOut } from "@/lib/auth/client";

export function NavUser({
    user,
}: {
    user: {
        name: string;
        email: string;
        avatar?: string | null;
        plan?: string;
    };
}) {
    const router = useRouter();

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        router.push("/auth/signin");
        router.refresh();
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent rounded-lg data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-full">
                                {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                                <AvatarFallback className="rounded-lg">
                                    {user.email?.[0].toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            {/* <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div> */}
                            {/* <ChevronsUpDown className="ml-auto size-4" /> */}
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side="bottom"
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center rounded-full gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-full">
                                    {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                                    <AvatarFallback className="rounded-full">
                                        {user.email?.[0].toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{user.name}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {user.plan === "free" && (
                            <>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/pricing" className="flex items-center justify-center">
                                            <Sparkles className="mr-2 size-4" />
                                            Upgrade to Pro
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                                <BadgeCheck className="mr-2 size-4" />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    {mounted ? (
                                        theme === "dark" ? <Moon className="mr-2 size-4" /> :
                                            theme === "light" ? <Sun className="mr-2 size-4" /> :
                                                <Laptop className="mr-2 size-4" />
                                    ) : (
                                        <Sun className="mr-2 size-4" />
                                    )}
                                    Theme
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => setTheme("light")}>
                                        <Sun className="mr-2 size-4" />
                                        Light
                                        {mounted && theme === "light" && <CheckCircle2 className="ml-auto size-4" />}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                                        <Moon className="mr-2 size-4" />
                                        Dark
                                        {mounted && theme === "dark" && <CheckCircle2 className="ml-auto size-4" />}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")}>
                                        <Laptop className="mr-2 size-4" />
                                        System
                                        {mounted && theme === "system" && <CheckCircle2 className="ml-auto size-4" />}
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className="text-red-500 hover:text-red-600 focus:text-red-600">
                            <LogOut className="mr-2 size-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
