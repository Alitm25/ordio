import { Card, CardContent } from "@/components/ui/card";
import {LucideIcon} from "lucide-react";

interface StatsCardProps {
    title: string;
    value: number;
    icon?: LucideIcon;
    iconClassName?: string;
}

export default function StatsCard({ title, value, icon: Icon, iconClassName }: StatsCardProps) {
    return (
        <Card>
            <CardContent className="p-6 flex items-start justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <h2 className="text-3xl font-bold mt-2">
                        {value.toLocaleString()}
                    </h2>
                </div>

                {Icon && (
                    <div
                        className={`rounded-full p-2.5 ${
                            iconClassName ?? "bg-muted text-muted-foreground"
                        }`}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}