import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AnalayticCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
}

export default function AnalayticCard({
  title,
  value,
  icon: Icon,
}: AnalayticCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {title}
            </h3>
            <div className="space-y-1">
              <p className="text-4xl font-semibold tracking-tight">{value}</p>
            </div>
          </div>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
