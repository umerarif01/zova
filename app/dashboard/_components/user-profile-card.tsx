import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserProfileCardProps {
  session: any;
}

export default function UserProfileCard({ session }: UserProfileCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-1">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            disabled
            defaultValue={session?.data?.user?.name ?? ""}
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            disabled
            defaultValue={session?.data?.user?.email ?? ""}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="bg-purple-500 hover:bg-purple-600 text-white">
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
