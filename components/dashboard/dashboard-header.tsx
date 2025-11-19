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
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DashboardHeaderProps {
  user: SupabaseUser;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');
    
    // Validation
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const supabase = createClient();
      
      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) {
        setError(updateError.message);
        return;
      }
      
      setSuccess('Password changed successfully!');
      setTimeout(() => {
        setIsPasswordDialogOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const displayName = user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'User';

  return (
    <>
      <header className="bg-[#EEF5E9] px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          {/* User Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/80 hover:bg-white"
          >
            <User className="h-5 w-5 text-[#4F5D4F]" />
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-1">
            <Image 
              src="/logo.png" 
              alt="EcoBytes" 
              width={32} 
              height={32}
              className="h-8 w-8"
            />
            <span className="text-lg font-semibold text-[#2F3A2F]">
              Eco<span className="text-[#7BAE7F]">bytes</span>
            </span>
          </div>

          {/* Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 hover:bg-white/80"
              >
                <Menu className="h-5 w-5 text-[#4F5D4F]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-white">
              <div className="flex flex-col gap-4 pt-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                </div>
                
                <Button
                  onClick={() => setIsPasswordDialogOpen(true)}
                  variant="outline"
                  className="w-full"
                >
                  Change Password
                </Button>
                
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your new password below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            
            {success && (
              <p className="text-sm text-green-600">{success}</p>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={() => setIsPasswordDialogOpen(false)}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangePassword}
                className="flex-1 bg-[#7BAE7F] hover:bg-[#6A9D6F]"
                disabled={loading}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
