"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface AppearanceTabProps {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    isRegenerating: boolean;
    mounted: boolean;
}

export function AppearanceTab({ theme, setTheme, isRegenerating, mounted }: AppearanceTabProps) {
    return (
        <div className="space-y-6 pt-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Appearance</CardTitle>
                    <CardDescription>
                        Customize how the dashboard looks. Changing theme will regenerate your portfolio content to match the new style.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Theme Preference</Label>
                        {mounted && (
                            <Select value={theme} onValueChange={setTheme} disabled={isRegenerating}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Select a theme" />
                                    {isRegenerating && <Loader2 className="ml-2 size-3 animate-spin text-muted-foreground" />}
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light" className="font-medium">Light</SelectItem>
                                    <SelectItem value="dark" className="font-medium">Dark</SelectItem>
                                    <SelectItem value="system" className="font-medium">System</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
