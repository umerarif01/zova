"use client";

import { useState } from "react";
import { Shield, User, UserCog } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { updateUserRole } from "@/drizzle/queries/admin";
import { toast } from "sonner";

interface AssignRoleDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignRoleDialog({
  userId,
  open,
  onOpenChange,
}: AssignRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAssignRole = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("selectedRole", selectedRole);
      const result = await updateUserRole(formData);

      if (result) {
        onOpenChange(false);
        setSelectedRole(null);
        toast.success(result.message);
      }
    } catch (error) {
      console.error("Error assigning role:", error);
      toast.error("Error assigning role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Assign Role
          </DialogTitle>
        </DialogHeader>
        <Card className="mt-4">
          <CardContent className="pt-6">
            <RadioGroup
              value={selectedRole || ""}
              onValueChange={setSelectedRole}
            >
              <div className="space-y-4">
                <RoleOption
                  id="user"
                  label="User"
                  description="Regular user with standard permissions"
                  icon={User}
                />
                <RoleOption
                  id="admin"
                  label="Admin"
                  description="Administrative user with elevated permissions"
                  icon={UserCog}
                />
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        <DialogFooter className="mt-6">
          <Button
            onClick={handleAssignRole}
            disabled={!selectedRole || isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Assigning..." : "Assign Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface RoleOptionProps {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

function RoleOption({ id, label, description, icon: Icon }: RoleOptionProps) {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={id} id={id} />
      <Label
        htmlFor={id}
        className="flex items-center space-x-3 cursor-pointer px-4"
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium">{label}</p>
        </div>
      </Label>
    </div>
  );
}
