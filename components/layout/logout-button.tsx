"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button variant="ghost" size="sm" className="gap-2">
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </form>
  );
}
