import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { OnboardingSelectorOption } from "@/lib/onboarding/types";
import { Check } from "lucide-react";
import { colorMap, IconComponent, iconContainerColorMap } from "./shared";

interface ToneSelectorCardsProps {
    options: OnboardingSelectorOption[];
    onSelect: (value: string, optionId: string) => void;
    disabled?: boolean;
}

export function ToneSelectorCards({ options, onSelect, disabled }: ToneSelectorCardsProps) {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (option: OnboardingSelectorOption) => {
        setSelected(option.id);
        onSelect(option.value, option.id);
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {options.map((option) => {
                const isSelected = selected === option.id;
                const colorClass = option.color ? colorMap[option.color] || "" : "";

                return (
                    <Card
                        key={option.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
                            } ${colorClass}`}
                        onClick={() => !disabled && handleSelect(option)}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-lg ${option.color && iconContainerColorMap[option.color] ? iconContainerColorMap[option.color] : "bg-muted"}`}>
                                    <IconComponent name={option.icon} className="w-6 h-6" />
                                </div>
                                {isSelected && <Check className="w-5 h-5 text-primary" />}
                            </div>
                            <CardTitle className="text-lg mt-3">{option.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-sm">
                                {option.description}
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="">
                            {isSelected && (
                                <Badge variant="secondary" className="text-xs">
                                    Selected
                                </Badge>
                            )}
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
