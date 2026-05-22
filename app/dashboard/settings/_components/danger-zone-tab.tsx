"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DangerZoneTabProps {
    onDeletePortfolio: () => void;
    isDeletingPortfolio: boolean;
    isPending: boolean;
}

export function DangerZoneTab({ onDeletePortfolio, isDeletingPortfolio, isPending }: DangerZoneTabProps) {
    return (
        <div className="space-y-6 pt-4">
            <Card className="border-destructive/30 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2 text-lg">
                        <AlertTriangle className="size-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Irreversible actions that affect your account and data.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 border rounded-md border-destructive/20 bg-background/50">
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold">Delete Current Portfolio</h4>
                                <p className="text-xs text-muted-foreground font-medium">
                                    Permanently delete this specific portfolio, its agent, and captured leads.
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="shrink-0"
                                onClick={onDeletePortfolio}
                                disabled={isDeletingPortfolio || isPending}
                            >
                                <Trash2 className="size-4 mr-2" />
                                {isDeletingPortfolio ? "Deleting..." : "Delete Portfolio"}
                            </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 border rounded-md border-destructive/20 bg-background/50">
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold">Delete Account</h4>
                                <p className="text-xs text-muted-foreground font-medium">
                                    Permanently delete your account, all portfolios, agents, and all captured leads.
                                </p>
                            </div>
                            <Button variant="destructive" size="sm" className="shrink-0">Delete Account</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
