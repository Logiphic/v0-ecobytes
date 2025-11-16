"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Menu, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DashboardHeaderProps {
  user: SupabaseUser;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const displayName = user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User';

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 bg-[rgba(238,245,233,1)]">
        <div className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="EcoBytes Logo" 
            width={120} 
            height={40}
            className="h-10 w-auto"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-accent">
            <User className="h-5 w-5" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 py-4">
                <div className="border-b pb-4">
                  <p className="text-sm text-muted-foreground">Signed in as</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="px-4 py-4 border-transparent border-t-0 border-none bg-[rgba(238,245,233,1)]">
        <h2 className="text-2xl font-bold text-foreground">Hello,</h2>
        <h2 className="text-2xl font-bold text-foreground">{displayName}</h2>
      </div>
    </header>
  );
}
