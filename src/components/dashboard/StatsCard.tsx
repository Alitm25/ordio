import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
    title: string;
    value: number;
}

export default function StatsCard({ title, value }: StatsCardProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                    {title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                    {value}
                </h2>
            </CardContent>
        </Card>
    );
}