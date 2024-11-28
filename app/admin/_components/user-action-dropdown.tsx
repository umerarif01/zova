"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, User, Shield, Eye, UserCog } from "lucide-react";
import { UserDetailsDialog } from "./user-details-dialog";
import { AssignRoleDialog } from "./assign-role-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserActionDropdownProps {
  userId: string;
  userName: string;
}

export function UserActionDropdown({
  userId,
  userName,
}: UserActionDropdownProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDetailsClick = () => {
    setIsDetailsOpen(true);
    setDropdownOpen(false);
  };

  const handleRoleClick = () => {
    setIsRoleOpen(true);
    setDropdownOpen(false);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Actions for {userName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleDetailsClick}>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>View user details</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleRoleClick}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Assign role</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            <p>User actions</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <UserDetailsDialog
        userId={userId}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
      <AssignRoleDialog
        userId={userId}
        open={isRoleOpen}
        onOpenChange={setIsRoleOpen}
      />
    </>
  );
}
