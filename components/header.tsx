"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  const getUserInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split("@")[0] || "User";
  };

  return (
    <header className="h-16 border-b border-neutral-200 bg-white px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
        <SidebarTrigger />
        <h1 className="text-lg md:text-2xl font-bold tracking-tight text-neutral-800 truncate">
          <span className="hidden sm:inline">SPK Pemilihan Bahan Kain</span>
          <span className="sm:hidden">SPK Fabric</span>
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        {user && (
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-neutral-800">{getUserDisplayName()}</span>
            <span className="text-xs text-neutral-500">{user.email}</span>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={getUserDisplayName()} />
                <AvatarFallback>{user?.email ? getUserInitials(user.email) : "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{getUserDisplayName()}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
