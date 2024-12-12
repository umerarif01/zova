"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertTriangle, Ban, UserX, UserCheck } from "lucide-react";
import { banUser } from "@/drizzle/queries/admin";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BanUserDialogProps {
  userId: string;
  username: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BanUserDialog({
  userId,
  username,
  open,
  onOpenChange,
}: BanUserDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [banOption, setBanOption] = useState<"true" | "false" | null>(null);

  const handleUpdateBanStatus = async () => {
    if (banOption === null) {
      toast.error("Please select an option before updating the user's status.");
      return;
    }

    setIsUpdating(true);
    try {
      const result = await banUser(userId, banOption);

      if (result) {
        onOpenChange(false);
        toast.success(
          `User ${banOption === "true" ? "banned" : "unbanned"} successfully`,
          {
            description: `${username}'s access to the platform has been ${
              banOption === "true" ? "revoked" : "restored"
            }.`,
          }
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating user status", {
        description:
          "Please try again or contact support if the issue persists.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Update User Access
          </DialogTitle>
          <DialogDescription>
            You are about to change the access status for user{" "}
            <span className="font-semibold">{username}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 py-4">
          <div className="rounded-full bg-destructive/10 p-3">
            <Ban className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {`Are you sure you want to update this user's access?`}
            </p>
            <p className="text-sm text-muted-foreground">
              {`This action will affect the user's ability to use the platform.`}
            </p>
          </div>
        </div>
        <RadioGroup
          value={banOption || ""}
          onValueChange={(value) => setBanOption(value as "true" | "false")}
          className="grid gap-4 pt-4"
        >
          <div>
            <RadioGroupItem value="true" id="ban" className="peer sr-only" />
            <Label
              htmlFor="ban"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <UserX className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">Ban User</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="false" id="unban" className="peer sr-only" />
            <Label
              htmlFor="unban"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <UserCheck className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">Unban User</span>
            </Label>
          </div>
        </RadioGroup>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={banOption === "false" ? "default" : "destructive"}
            onClick={handleUpdateBanStatus}
            disabled={isUpdating || banOption === null}
          >
            {isUpdating ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {banOption === "true" ? "Banning User..." : "Unbanning User..."}
              </span>
            ) : (
              <span>{banOption === "true" ? "Ban User" : "Unban User"}</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
